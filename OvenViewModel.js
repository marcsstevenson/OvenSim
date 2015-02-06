/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Timers.js" />
/// <reference path="StatusProperties.js" />
/// <reference path="UserInterface.js" />
/// <reference path="Subscriptions.js" />
/// <reference path="OvenManager.js" />

function OvenViewModel(soundEnabled, blinkingEnabled) {
    var self = this;

    self.SoundEnabled = soundEnabled;
    self.BlinkingEnabled = blinkingEnabled;

    //Expand from external files
    Timers(self);
    StatusProperties(self);
    OvenManager(self);
    UserInterface(self);
    Subscriptions(self);

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

    self.TimerStart = function () {
        self.StartIntervalTimer();
    }

    self.TimerStop = function () {
    }

    //Time Dilation - Start

    self.IncreaseTimeDilation = function () {
        self.SetTimeDilation(self.TimeDilation() * 2);
    };

    self.DecreaseTimeDilation = function () {
        self.SetTimeDilation(self.TimeDilation() / 2);
    };

    self.SetTimeDilation = function (newValue) {
        self.Log(newValue);
        if (newValue >= self.MaxTimeDilation) //Ensure that we do not go above our max target
        {
            self.TimeDilation(self.MaxTimeDilation);
            return;
        }
        else if (newValue <= self.MinTimeDilation) //Ensure that we do not go below min target
        {
            self.TimeDilation(self.MinTimeDilation);
            return;
        }

        self.Log(newValue);
        self.TimeDilation(newValue);
    };

    self.LogFunction = console.log;

    self.Log = function (entry) {
        if (self.LogFunction !== null)
            self.LogFunction(entry);
    };
    
    //Set defaults
    self.SetDefaults();

    return self;
};