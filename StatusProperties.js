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
    self.OvenIsOn = ko.observable();
    self.LightIsOn = ko.observable();
    self.IsFanLow = ko.observable();
    self.DisplayingActualTemperature = ko.observable();
    self.DisplayingActualFlash = ko.observable();
    self.MoistureModeOn = ko.observable();
    self.DisplayingMoistureSetup = ko.observable();
    self.BlinkOn = ko.observable(false);
    self.FanSpeed = ko.observable(); //1 is high, 0 is low
    self.ElementOn = ko.observable(false);
    
    //Persistent status values (these remain after power on/off and are therefore not reset by default)
    self.CurrentMoistureMode = ko.observable(0); //0-5 are the valid values

    self.SetDefaults = function () {
        self.OvenIsOn(false);
        self.LightIsOn(false);
        self.IsFanLow(false);
        self.DisplayingActualTemperature(false);
        self.DisplayingActualFlash(false);

        self.ActualTemperature(self.StartTemperature);
        self.TargetTemperature(self.DefaultTargetTemperature);
        self.MoistureModeOn(false);
        self.DisplayingMoistureSetup(false);
        self.BlinkOn(false);
        self.FanSpeed(1); //1 is high, 0 is low

        //UI Functions
        self.Temp_DownClickFunction(self.DecreaseTargetTemperature);
        self.Temp_UpClickFunction(self.IncreaseTargetTemperature);
        self.Timer_DownClickFunction(self.DecreaseTargetTimererature);
        self.Timer_UpClickFunction(self.DecreaseTargetTimererature);
        self.TopDisplayFunction(self.TargetTemperature);
        self.BottomDisplayFunction(null); //TODO

        //Clear all timers
        self.ClearPowerTimer();
        self.ClearTempDisplayTimer();
        self.ClearTempFlashTimer();
        self.ClearMoistureModeTimer();
        self.ClearBlinkTimer();
    };

}