CREATE TABLE Currency (
    currencyCode CHAR(3) PRIMARY KEY, -- ISO 4217 currency code (e.g., USD, EUR)
    currencySymbol NCHAR(1) NOT NULL -- '€' for EUR, '$' for USD etc.
);

CREATE TABLE User (
    userID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username NVARCHAR(50) UNIQUE NOT NULL,
    pwHash VARCHAR(60) NOT NULL,
    realName NVARCHAR(50) NOT NULL DEFAULT ''
);

CREATE TABLE Vehicle (
    vehicleID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userID UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(40) NOT NULL,
    model NVARCHAR(40) NOT NULL DEFAULT '',
    description NVARCHAR(255) NOT NULL DEFAULT '',
    consumption DECIMAL(10, 2) NOT NULL, -- e.g., fuel consumption in liters/100km or kWh/100km
    electric BIT NOT NULL,               -- boolean: 1 for electric, 0 for non-electric
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE Route (
    routeID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userID UNIQUEIDENTIFIER NOT NULL,
    vehicleID UNIQUEIDENTIFIER NOT NULL,
    description NVARCHAR(255) NOT NULL,
    distance DECIMAL(10, 2) NOT NULL,   -- in kilometers
    location1 NVARCHAR(60) NOT NULL,
    location2 NVARCHAR(60) NOT NULL,
    defaultBothWays BIT NOT NULL, -- boolean: 1 for both ways, 0 for one way
    validFrom DATE NOT NULL,
    validTo DATE NOT NULL,
    schedule BINARY(1) NULL,      -- e.g., 01111100 for weekdays. First bit should be 0.
    currencyCode CHAR(3) NOT NULL, -- Foreign key to Currency table
    relativeFuelCost DECIMAL(10, 2) NOT NULL DEFAULT 0.0, -- Expected fuel cost amount per l or per kWh
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

-- For participants of a particular ride
CREATE TABLE UserToRide (
    userID UNIQUEIDENTIFIER NOT NULL,
    rideID UNIQUEIDENTIFIER NOT NULL,
    bothWays BIT NOT NULL, -- boolean: whether the user takes the ride both ways
    PRIMARY KEY (userID, rideID),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (rideID) REFERENCES Ride(rideID) ON DELETE CASCADE
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

CREATE TABLE AdditionalCost (
    additionalCostID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    routeID UNIQUEIDENTIFIER NULL, -- ID of the route that the cost is linked to
    name NVARCHAR(40) NOT NULL DEFAULT '', -- e.g., "Parking"

    period NCHAR(1) NOT NULL,         -- e.g., 'm' for monthly, 'r' for every ride, 'k' for every km
    periodMultiplier SMALLINT NOT NULL DEFAULT 1, -- e.g., 'k' and 100 for 'every 100 km'
    inflictionMode CHAR(1) NOT NULL, -- e.g., 'p' for 'distribute by ride participation', 'r' for 'distribute over route participants', 'e' for 'inflict on every user'

    amount DECIMAL(10, 2) NOT NULL,      -- Cost amount
    FOREIGN KEY (routeID) REFERENCES Route(routeID) ON DELETE CASCADE
);

CREATE TABLE AdditionalCostToRide (
    -- IMPORTANT: routeID has to be the same for the referenced AdditionalCost and Ride record
    additionalCostID UNIQUEIDENTIFIER NOT NULL,
    rideID UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (additionalCostID, rideID),
    FOREIGN KEY (additionalCostID) REFERENCES AdditionalCost(additionalCostID) ON DELETE CASCADE,
    FOREIGN KEY (rideID) REFERENCES Ride(rideID) ON DELETE CASCADE
);

CREATE TABLE AdditionalCostInfliction (
    additionalCostInflictionID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userID UNIQUEIDENTIFIER NOT NULL,
    additionalCostID UNIQUEIDENTIFIER NOT NULL,
    rideID UNIQUEIDENTIFIER NULL, -- ID of the ride a per-ride cost was inflicted for (NULL if AdditionalCost.period is not 'r' or 'k')
    -- derivedAmount DECIMAL(10, 2) NOT NULL, -- Final cost amount for the user
    paid BIT NOT NULL DEFAULT 0, -- Whether the infliction has been paid by the user
    inflictionDatetime DATETIME NOT NULL DEFAULT GETDATE(), -- Datetime of infliction with current datetime as default
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (additionalCostID) REFERENCES AdditionalCost(additionalCostID) ON DELETE CASCADE,
    FOREIGN KEY (routeID) REFERENCES Route(routeID) ON DELETE CASCADE
);

-- Defines pause durations for periodic additional costs (except for 'r' periods (every ride))
CREATE TABLE PeriodicCostPause (
    additionalCostID UNIQUEIDENTIFIER NOT NULL,
    pauseUntil DATE NOT NULL,

    FOREIGN KEY (additionalCostID) REFERENCES AdditionalCost(additionalCostID) ON DELETE CASCADE,
);
