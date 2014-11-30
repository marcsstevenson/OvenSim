/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />
/// <reference path="Timers.js" />
/// <reference path="StatusProperties.js" />
/// <reference path="UserInterface.js" />
/// <reference path="Subscriptions.js" />
/// <reference path="OvenTemperatureManager.js" />

function OvenViewModel() {
    var self = this;

    //Expand from external files
    Timers(self);
    StatusProperties(self);
    OvenTemperatureManager(self);
    UserInterface(self);
    Subscriptions(self);

    self.TimerId = 0;


    self.ToggleLight = function () {
        self.LightIsOn(!self.LightIsOn());
    }

    self.TurnOvenOn = function () {
        //self.SetDefaults();

        self.OvenIsOn(true);
    }

    self.TurnOvenOff = function () {
        //Turn everything off
        self.SetDefaults();
    }

    self.Start = function () {
        self.StartIntervalTimer();
    }

    self.Stop = function () {
    }

    self.ToggleTempDisplay = function () {
        var currentValue = self.DisplayingActualTemperature();

        if (currentValue)
            self.StopDisplayingActualTemperature();
        else
            self.StartDisplayingActualTemperature();
    }

    self.StartDisplayingActualTemperature = function () {
        //Stop the temp display timers
        self.StartTempDisplayIntervalTimer();
        self.DisplayingActualTemperature(true);
    };

    self.StopDisplayingActualTemperature = function () {
        //Stop the temp display timers
        self.ClearTempDisplayTimer();
        self.DisplayingActualTemperature(false);
    };

    self.ToggleDisplayingActualFlash = function() {
        self.DisplayingActualFlash(!self.DisplayingActualFlash());
    }

    self.StopDisplayingActualFlash = function () {
        self.DisplayingActualFlash(false);
    }

    //Set defaults
    self.SetDefaults();

    //Temp - testing
    self.TurnOvenOn();

    return self;
};