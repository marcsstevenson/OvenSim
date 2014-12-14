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
        self.TopDisplayFunction(self.TargetTemperature);
        self.OvenIsOn(true);
    }

    self.TurnOvenOff = function () {
        //Turn everything off
        self.SetDefaults();
        self.TopDisplayFunction(null);
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

        self.TopDisplayFunction(self.ActualTemperatureRounded);
    };

    self.StopDisplayingActualTemperature = function () {
        //Stop the temp display timers
        self.ClearTempDisplayTimer();
        self.DisplayingActualTemperature(false);

        self.TopDisplayFunction(self.TargetTemperature);
    };

    self.ToggleDisplayingActualFlash = function() {
        self.DisplayingActualFlash(!self.DisplayingActualFlash());
    }

    self.StopDisplayingActualFlash = function () {
        self.DisplayingActualFlash(false);
    }
    
    self.StartDisplayingMoistureModeSetup = function () {
        self.DisplayingMoistureSetup(true);
        self.StartBlinkIntervalTimer();
        self.TopDisplayFunction(self.MoistureModeDisplay);
        self.Temp_DownClickFunction(self.MoistureModeDown);
        self.Temp_UpClickFunction(self.MoistureModeUp);
    };

    self.StopDisplayingMoistureMode = function () {
        self.DisplayingMoistureSetup(false);
        self.ClearBlinkTimer();
        self.TopDisplayFunction(self.TargetTemperature);
        self.Temp_DownClickFunction(self.DecreaseTargetTemperature);
        self.Temp_UpClickFunction(self.IncreaseTargetTemperature);
    };
    
    //Steam and moisture
    self.ToggleMoistureMode = function() {
        self.MoistureModeOn(!self.MoistureModeOn());
    };

    self.MoistureModeDown = function () {
        self.CurrentMoistureMode(self.CurrentMoistureMode() === 0 ? 5 : self.CurrentMoistureMode() - 1);
    };

    self.MoistureModeUp = function () {
        self.CurrentMoistureMode(self.CurrentMoistureMode() === 5 ? 0 : self.CurrentMoistureMode() + 1);
    };
    
    self.SteamShot = function () {
        self.SteamShooting(true);
        self.StartSteamShotModeIntervalTimer();
    };

    self.Log = function(entry) {
        console.log(entry);
    };

    //Set defaults
    self.SetDefaults();

    //Temp - testing
    self.TurnOvenOn();
    
    console.clear();

    return self;
};