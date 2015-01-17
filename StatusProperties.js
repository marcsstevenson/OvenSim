/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />

function StatusProperties(self) {
    self.StartTemperature = 18;
    self.MaxTargetTemperature = 240;
    self.DefaultTargetTemperature = 150;
    self.DefaultTimerValue = 0;
    self.MinTargetTemperature = 80;

    self.MaxTimeDilation = 64; //times
    self.MinTimeDilation = 1;
    self.TimeDilation = ko.observable(1);

    self.ActualTemperature = ko.observable(0);
    self.TargetTemperature = ko.observable(0);

    self.TimerStartValue = ko.observable(0); //moment.duration
    self.TimerCurrentValue = ko.observable(0); //moment.duration
    self.TimerDirectionUp = ko.observable(true);
    self.TimerStarted = ko.observable(false);
    self.TimerRunning = ko.observable(false);
    self.TimerComplete = ko.observable(false);

    //Status Values
    self.OvenIsOn = ko.observable();
    self.LightIsOn = ko.observable();
    self.IsFanLow = ko.observable();
    self.DisplayingActualTemperature = ko.observable();
    self.DisplayingActualFlash = ko.observable();
    self.MoistureModeOn = ko.observable();
    self.DisplayingMoistureSetup = ko.observable();
    self.MoistureModeBlinkOn = ko.observable(false);
    self.TimerBlinkOn = ko.observable(false);

    self.FanSpeed = ko.observable(); //1 is high, 0 is low
    self.IsManualMode = ko.observable();
    self.IsCooking = ko.observable();
    self.SteamShooting = ko.observable();
    self.IsHeating = ko.observable(false);
    
    //Button functions
    self.Temp_MinusClickFunction = ko.observable();
    self.Temp_UpClickFunction = ko.observable();
    self.Timer_DownClickFunction = ko.observable();
    self.Timer_UpClickFunction = ko.observable();

    //Display functions
    self.TopDisplayFunction = ko.observable(null);
    self.BottomDisplayFunction = ko.observable(null);

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

        self.SetDefaults_Timer();

        self.MoistureModeOn(false);
        self.DisplayingMoistureSetup(false);
        self.MoistureModeBlinkOn(false);
        self.TimerBlinkOn(false);
        self.FanSpeed(1); //1 is high, 0 is low

        //UI Functions
        self.Temp_MinusClickFunction(self.DecreaseTargetTemperature);
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
        self.ClearMoistureModeBlinkTimer();
        self.ClearTimerCountdownTimer();
    };

    self.SetDefaults_Timer = function () {
        self.TimerStartValue(self.DefaultTimerValue);
        self.TimerCurrentValue(moment.duration(0, 'minutes'));
        self.TimerDirectionUp(true);
        self.TimerStarted(false);
        self.TimerRunning(false);
        self.TimerComplete(false);
    };
}