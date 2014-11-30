/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function StatusProperties(self) {
    self.StartTemperature = 18;
    self.MaxTargetTemperature = 240;
    self.DefaultTargetTemperature = 180;
    self.MinTargetTemperature = 80;
    self.MaxTimeDilation = 1;
    self.MinTimeDilation = 1;

    self.TimeDilation = ko.observable(1);
    self.IsHeating = ko.observable(1);

    self.ActualTemperature = ko.observable(self.StartTemperature);
    self.TargetTemperature = ko.observable(self.DefaultTargetTemperature);

    //Status Values
    self.OvenIsOn = ko.observable(false);
    self.LightIsOn = ko.observable(false);
    self.IsFanLow = ko.observable(false);
    self.DisplayingActualTemperature = ko.observable(false);
    self.DisplayingActualFlash = ko.observable(false);
    
    self.FanSpeed = ko.observable(1); //1 is high, 0 is low
    self.ElementOn = ko.observable(false);
    
    self.SetDefaults = function() {
        self.OvenIsOn(false);
        self.LightIsOn(false);
        self.IsFanLow(false);
        self.DisplayingActualTemperature(false);
        self.DisplayingActualFlash(false);
        self.ActualTemperature(self.StartTemperature);
        self.TargetTemperature(self.DefaultTargetTemperature);

        //Clear all timers
        self.ClearPowerTimer();
        self.ClearTempDisplayTimer();
        self.ClearTempFlashTimer();
    };
}