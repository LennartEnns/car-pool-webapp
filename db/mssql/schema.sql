CREATE TABLE Currency (
    currencyCode CHAR(3) PRIMARY KEY, -- ISO 4217 currency code (e.g., USD, EUR)
    currencySymbol NCHAR(1) NOT NULL -- '€' for EUR, '$' for USD etc.
);

CREATE TABLE User (
    userID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username NVARCHAR(20) UNIQUE NOT NULL,
    pwHash VARCHAR(60) NOT NULL,
    realName NVARCHAR(50) NULL
);

CREATE TABLE Vehicle (
    vehicleID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userID UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(20) NOT NULL,
    model NVARCHAR(30) NULL,
    description NVARCHAR(255) NOT NULL DEFAULT '',
    consumption DECIMAL(10, 2) NOT NULL, -- e.g., fuel consumption in liters/100km or kWh/100km
    electric BIT NOT NULL,               -- boolean: 1 for electric, 0 for non-electric
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE Route (
    routeID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userID UNIQUEIDENTIFIER NOT NULL,
    vehicleID UNIQUEIDENTIFIER NULL,
    name NVARCHAR(50) NOT NULL,
    description NVARCHAR(255) NOT NULL DEFAULT '',
    distance DECIMAL(10, 2) NOT NULL, -- in kilometers
    location1 NVARCHAR(60) NULL,
    location2 NVARCHAR(60) NULL,
    defaultBothWays BIT NOT NULL, -- boolean: 1 for both ways, 0 for one way
    validFrom DATE NULL,
    validTo DATE NULL,
    schedule BINARY(1) NULL,      -- e.g., 01111100 for weekdays. First bit should be 0.
    currencyCode CHAR(3) NOT NULL, -- Foreign key to Currency table
    customConsumption DECIMAL(10, 2) NULL, -- Overrides Vehicle consumption (optional)
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (vehicleID) REFERENCES Vehicle(vehicleID) ON DELETE SET NULL,
    FOREIGN KEY (currencyCode) REFERENCES Currency(currencyCode) ON DELETE NO ACTION
);

CREATE TABLE Ride (
    rideID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    routeID UNIQUEIDENTIFIER NOT NULL,
    startDatetime DATETIME NULL,
    arrivalDatetime DATETIME NOT NULL,
    customDistance DECIMAL(10, 2) NULL, -- Overrides Route distance (optional)
    customBothWays BIT NULL, -- Overrides Route bothWays (optional)
    reverseDirection BIT NOT NULL DEFAULT 0, -- Whether the ride starts from location2 instead of location1
    FOREIGN KEY (routeID) REFERENCES Route(routeID) ON DELETE CASCADE
);

-- For regular participants of a route
CREATE TABLE UserToRoute (
    userID UNIQUEIDENTIFIER NOT NULL,
    routeID UNIQUEIDENTIFIER NOT NULL,
    bothWays BIT NOT NULL, -- boolean: whether the user takes the ride both ways
    PRIMARY KEY (userID, routeID),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (routeID) REFERENCES Route(routeID) ON DELETE CASCADE
);

-- For participants of a particular ride
CREATE TABLE UserToRide (
    userID UNIQUEIDENTIFIER NOT NULL,
    rideID UNIQUEIDENTIFIER NOT NULL,
    bothWays BIT NOT NULL, -- boolean: whether the user takes the ride both ways
    PRIMARY KEY (userID, rideID),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE SET NULL,
    FOREIGN KEY (rideID) REFERENCES Ride(rideID) ON DELETE CASCADE
);

CREATE TABLE CostFactor (
    costFactorID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    routeID UNIQUEIDENTIFIER NULL, -- ID of the route that the cost is linked to
    name NVARCHAR(40) NOT NULL DEFAULT '', -- e.g., "Parking"

    period CHAR(1) NOT NULL, -- e.g., 'm' for monthly, 'r' for every ride, 'k' for every km, 'l' for every liter/kWh (fuel cost)
    periodMultiplier SMALLINT NOT NULL DEFAULT 1, -- e.g., 'k' and 100 for 'every 100 km'
    inflictionMode CHAR(1) NOT NULL, -- 'p' for 'inflict by ride participation', 'a' for 'inflict on all route participants'
    distributionMode CHAR(1) NOT NULL, -- 's' for 'split', f for 'inflict full amount on everyone'

    amount DECIMAL(10, 2) NOT NULL,      -- Cost amount
    FOREIGN KEY (routeID) REFERENCES Route(routeID) ON DELETE CASCADE
);

CREATE TABLE CostFactorToRide (
    -- IMPORTANT: routeID has to be the same for the referenced CostFactor and Ride record
    costFactorID UNIQUEIDENTIFIER NOT NULL,
    rideID UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (costFactorID, rideID),
    FOREIGN KEY (costFactorID) REFERENCES CostFactor(costFactorID) ON DELETE CASCADE,
    FOREIGN KEY (rideID) REFERENCES Ride(rideID) ON DELETE CASCADE
);

CREATE TABLE CostInfliction (
    costInflictionID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userID UNIQUEIDENTIFIER NOT NULL,
    costFactorID UNIQUEIDENTIFIER NOT NULL,
    rideID UNIQUEIDENTIFIER NULL, -- ID of the ride a cost was inflicted for (NULL if CostFactor.period is not 'r', 'k' or 'l')
    derivedAmount DECIMAL(10, 2) NOT NULL, -- Final cost amount for the user
    costStatus CHAR(3) NOT NULL DEFAULT 'pnd', -- pnd = pending, inf = inflicted, pad = paid
    inflictionDatetime DATETIME NOT NULL DEFAULT GETDATE(), -- Datetime of infliction with current datetime as default

    -- Snapshot = Variable at the time of infliction (for preservation in recalculations)
    -- amountSnapshot DECIMAL(10, 2) NOT NULL, -- Cost factor amount used at the time of infliction
    -- consumptionSnapshot DECIMAL(10, 2) NULL, -- Consumption used at the time of infliction (only used in inflictions for 'per l' costs)

    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE SET NULL,
    FOREIGN KEY (costFactorID) REFERENCES CostFactor(costFactorID) ON DELETE CASCADE,
    FOREIGN KEY (rideID) REFERENCES Ride(rideID) ON DELETE CASCADE
);

-- Defines pause durations for periodic costs (except for 'r' periods (every ride))
CREATE TABLE PeriodicCostPause (
    costFactorID UNIQUEIDENTIFIER NOT NULL,
    pauseUntil DATE NOT NULL,

    FOREIGN KEY (costFactorID) REFERENCES CostFactor(costFactorID) ON DELETE CASCADE,
);
