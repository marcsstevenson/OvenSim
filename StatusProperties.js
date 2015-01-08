/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function StatusProperties(self) {
    self.StartTemperature = 18;
    self.MaxTargetTemperature = 240;
    self.DefaultTargetTemperature = 150;
    self.DefaultTimerValue = 0;
    self.MinTargetTemperature = 80;

    self.MaxTimeDilation = 1;
    self.MinTimeDilation = 1;
    self.TimeDilation = ko.observable(1);

    self.ActualTemperature = ko.observable(0);
    self.TargetTemperature = ko.observable(0);

    self.TimerStartValue = ko.observable(0); //moment.duration
    self.TimerCurrentValue = ko.observable(0); //moment.duration
    self.TimerDirectionUp = ko.observable(true);
    self.TimerStarted = ko.observable(false);
    self.TimerRunning = ko.observable(false);

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
    self.IsManualMode = ko.observable();
    self.IsCooking = ko.observable();
    self.SteamShooting = ko.observable();
    self.IsHeating = ko.observable(false);
    
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

        self.TimerStartValue(self.DefaultTimerValue);
        self.TimerCurrentValue(self.DefaultTimerValue);
        self.TimerDirectionUp(true);
        self.TimerStarted(false);
        self.TimerRunning(false);

        self.MoistureModeOn(false);
        self.DisplayingMoistureSetup(false);
        self.BlinkOn(false);
        self.FanSpeed(1); //1 is high, 0 is low

        //UI Functions
        self.Temp_DownClickFunction(self.DecreaseTargetTemperature);
        self.Temp_UpClickFunction(self.IncreaseTargetTemperature);
        self.Timer_DownClickFunction(self.DecreaseTimer);
        self.Timer_UpClickFunction(self.IncreaseTimer);
        self.TopDisplayFunction(self.TargetTemperature);
        self.BottomDisplayFunction(self.TimerDisplayValue);
        self.IsManualMode(true);
        self.IsCooking(true);
        self.SteamShooting(false);
        self.IsHeating(false);

        //Clear all timers
        self.ClearPowerTimer();
        self.ClearTempDisplayTimer();
        self.ClearTempFlashTimer();
        self.ClearMoistureModeTimer();
        self.ClearBlinkTimer();
    };
}