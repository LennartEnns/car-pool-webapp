CREATE TABLE Currency (
    currencyCode CHAR(3) PRIMARY KEY, -- ISO 4217 currency code (e.g., USD, EUR)
    currencySymbol NCHAR(1) NOT NULL -- '€' for EUR, '$' for USD etc.
);

CREATE TABLE User (
    userID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    pwHash VARCHAR(255) NOT NULL,
    name NVARCHAR(255) NOT NULL
);

CREATE TABLE Vehicle (
    vehicleID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    userID UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(255) NOT NULL,
    consumption DECIMAL(10, 2) NOT NULL, -- e.g., fuel consumption in liters/100km or kWh/100km
    electric BIT NOT NULL,              -- boolean: 1 for electric, 0 for non-electric
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

CREATE TABLE Route (
    routeID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    description NVARCHAR(255) NOT NULL,
    distance DECIMAL(10, 2) NOT NULL,   -- in kilometers
    fromLocation NVARCHAR(255) NOT NULL, -- Starting location
    toLocation NVARCHAR(255) NOT NULL,   -- Destination location
    bothWays BIT NOT NULL,               -- boolean: 1 for both ways, 0 for one way
    validFrom DATE NOT NULL,
    validTo DATE NOT NULL,
    schedule BINARY(1) NOT NULL,      -- e.g., 01111100 for weekdays. First bit should be 0.
    currencyCode CHAR(3) NOT NULL, -- Foreign key to Currency table
    relativeFuelCost DECIMAL(10, 2) NOT NULL DEFAULT 0.0, -- Expected fuel cost amount per l or per kWh
    customConsumption DECIMAL(10, 2) NULL, -- Overrides Vehicle consumption (optional)
    userID UNIQUEIDENTIFIER NOT NULL,
    vehicleID UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (vehicleID) REFERENCES Vehicle(vehicleID) ON DELETE SET NULL,
    FOREIGN KEY (currencyCode) REFERENCES Currency(currencyCode) ON DELETE NO ACTION
);

CREATE TABLE Ride (
    rideID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    routeID UNIQUEIDENTIFIER NOT NULL,
    rideDatetime DATETIME NOT NULL,
    customDistance DECIMAL(10, 2) NULL,  -- Overrides Route distance (optional)
    FOREIGN KEY (routeID) REFERENCES Route(routeID) ON DELETE CASCADE
);

CREATE TABLE AdditionalCosts (
    additionalCostID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    routeID UNIQUEIDENTIFIER NULL, -- Cost has to be either linked to a route or to a ride
    rideID UNIQUEIDENTIFIER NULL,
    name NVARCHAR(255) NOT NULL DEFAULT '', -- e.g., "Parking"
    period NCHAR(1) NOT NULL,         -- e.g., 'm' for monthly, 'r' for every ride
    amount DECIMAL(10, 2) NOT NULL,      -- Cost amount
    FOREIGN KEY (routeID) REFERENCES Route(routeID) ON DELETE CASCADE,
    CONSTRAINT ac_chk_routeID_or_rideID CHECK(routeID != NULL OR rideID != NULL) -- see comment for routeID
);

CREATE TABLE UserToRide (
    userID UNIQUEIDENTIFIER NOT NULL,
    rideID UNIQUEIDENTIFIER NOT NULL,
    paid BIT NOT NULL,                   -- boolean: whether this user paid for the ride
    bothWays BIT NOT NULL,               -- boolean: whether the user took the ride both ways
    PRIMARY KEY (userID, rideID),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (rideID) REFERENCES Ride(rideID) ON DELETE CASCADE
);

CREATE TABLE AdditionalCostsInfliction (
    userID UNIQUEIDENTIFIER NOT NULL,
    additionalCostID UNIQUEIDENTIFIER NOT NULL,
    rideID UNIQUEIDENTIFIER NULL, -- ID of the ride that a per-ride cost was inflicted for (NULL if AdditionalCosts.period != 'r')
    derivedAmount DECIMAL(10, 2) NOT NULL, -- Final cost amount for the user
    inflictionDatetime DATETIME NOT NULL DEFAULT GETDATE(), -- Datetime of infliction with current datetime as default
    PRIMARY KEY (userID, additionalCostID),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (additionalCostID) REFERENCES AdditionalCosts(additionalCostID) ON DELETE CASCADE
);
