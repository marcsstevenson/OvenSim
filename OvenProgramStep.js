/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />

function OvenProgramStep() {
    var defaultTargetTemperature = 150; //Oven Temperature is set to 150°C (325°F)
    var defaultTargetCoreTemperature = 65; //Oven Temperature is set to 150°C (325°F) - TODO: Confirm

    var self = this;

    self.MaxTargetTemperature = 240; //+ to increase the temperature (Max. 260°C / 500°F)
    self.MinTargetTemperature = 80; //- to decrease the temperature (Min. 60°C / 140°F)

    self.MaxTargetCoreTemperature = 90; //+ to increase temperature (Max. 90°C / 194°F)
    self.MinTargetCoreTemperature = 50; //- to decrease temperature (Min. 50°C / 122°F)
    self.DefaultTimerValue = 0;
    
    self.Name = ko.observable();
    self.Index = ko.observable();
    self.IsManualModeStep = ko.observable(false); //This may not be used ever

    self.IsFanLow = ko.observable();
    self.TargetTemperature = ko.observable(0);
    self.TargetCoreTemperature = ko.observable(0);
    self.MoistureMode = ko.observable(); //1-5

    self.TimerStartValue = ko.observable(); //CP, InF, ---, 1-180
    self.TimerDirectionUp = ko.observable(true);
    self.TimerCurrentValue = ko.observable(0); //moment.duration

    //Persistent status values (these remain after power on/off and are therefore not reset by default)
    self.CurrentMoistureMode = ko.observable(0); //0-5 are the valid values

    self.SetDefaults = function () {
        self.IsFanLow(false);
        self.TargetTemperature(defaultTargetTemperature);
        self.TargetCoreTemperature(defaultTargetCoreTemperature);

        self.TimerStartValue(self.DefaultTimerValue);
        self.TimerCurrentValue(moment.duration(0, 'minutes'));
        self.TimerDirectionUp(true);
    };

    //*** Fan
    self.ToggleFanValue = function() {
        self.IsFanLow(!self.IsFanLow());
    };

    self.FanSpeed = ko.observable(); //1 is high, 0 is low

    //*** Temperature Setting - Start

    self.SetTemperature = function (newValue) {
        if (self.OvenIsOn() && newValue >= self.TargetTemperature()) //Ensure that we do not go above our target
        {
            self.ActualTemperature(self.TargetTemperature());

            return;
        }
        else if (!self.OvenIsOn() && newValue <= self.StartTemperature) //Ensure that we do not go below ambient
        {
            self.ClearTimer(); //We may as well turn off the timer
            self.ActualTemperature(self.StartTemperature);

            return;
        }

        self.ActualTemperature(newValue);
    };

    self.IncreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TargetTemperature() + 10);
    };

    self.DecreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TargetTemperature() - 10);
    };

    self.SetTargetTemperature = function (newValue) {
        if (newValue >= self.MaxTargetTemperature) //Ensure that we do not go above our max target
        {
            self.TargetTemperature(self.MaxTargetTemperature);
            return;
        }
        else if (newValue <= self.MinTargetTemperature) //Ensure that we do not go below min target
        {
            self.TargetTemperature(self.MinTargetTemperature);
            return;
        }

        self.TargetTemperature(newValue);
    };

    //*** Temperature Setting - End
    

    //*** Timer Section - Start

    self.IncreaseTimer = function () {
        if (self.TimerStartValue() >= 180) {
            self.SetStartTimer(-1);
            return; //We are at the max
        }

        self.SetStartTimer(self.TimerStartValue() + 1);
    };

    self.DecreaseTimer = function () {
        if (self.TimerStartValue() <= -1) {
            self.SetStartTimer(180);
            return; //We are at the min
        }

        self.SetStartTimer(self.TimerStartValue() - 1);
    };

    self.SetStartTimer = function (newValue) {
        self.TimerStartValue(newValue);
    };

    //*** Timer Section - End

    //*** Moisture mode - start
    
    self.MoistureModeDown = function () {
        self.CurrentMoistureMode(self.CurrentMoistureMode() === 0 ? 5 : self.CurrentMoistureMode() - 1);
    };

    self.MoistureModeUp = function () {
        self.CurrentMoistureMode(self.CurrentMoistureMode() === 5 ? 0 : self.CurrentMoistureMode() + 1);
    };

    //*** Moisture mode - end

    return self;
}