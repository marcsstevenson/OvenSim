/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />

function StatusProperties(self) {
    self.StartTemperature = 18;
    self.MaxTargetTemperature = 240; //+ to increase the temperature (Max. 260°C / 500°F)
    self.MinTargetTemperature = 80; //- to decrease the temperature (Min. 60°C / 140°F)
    self.DefaultTargetTemperature = 150; //Oven Temperature is set to 150°C (325°F)

    self.MaxTargetCoreTemperature = 90; //+ to increase temperature (Max. 90°C / 194°F)
    self.MinTargetCoreTemperature = 50; //- to decrease temperature (Min. 50°C / 122°F)
    self.DefaultTargetCoreTemperature = 65; //Oven Temperature is set to 150°C (325°F) - TODO: Confirm
    
    self.DefaultTimerValue = 0;

    self.MaxTimeDilation = 64; //times
    self.MinTimeDilation = 1;
    self.TimeDilation = ko.observable(1);

    self.ActualTemperature = ko.observable(0);
    self.TargetTemperature = ko.observable(0);
    self.DisplayingActualCoreTemperature = ko.observable();
    self.DisplayingActualTemperature = ko.observable();

    self.CoreProbeConnected = ko.observable(false);
    self.ActualCoreTemperature = ko.observable(0);
    self.TargetCoreTemperature = ko.observable(0);
    self.TargetCoreTemperatureSet = ko.observable(false);
    self.TargetCoreTemperatureBlinkOn = ko.observable(false);
    self.TargetCoreTemperatureAlternate = ko.observable(false);
    self.CoreTemperatureCookingStarted = ko.observable(false);

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
    self.TempButtonUpFunction = ko.observable();
    self.TimerButtonDownFunction = ko.observable();
    self.TimerButtonUpFunction = ko.observable();
    self.LightOn_TimerFunction = ko.observable();

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
        
        self.ActualCoreTemperature(self.StartTemperature);
        self.TargetCoreTemperature(self.DefaultTargetCoreTemperature);
        self.TargetCoreTemperatureSet(false);
        self.TargetCoreTemperatureBlinkOn(false);
        self.TargetCoreTemperatureAlternate(false);
        self.CoreTemperatureCookingStarted(false);

        self.SetDefaults_Timer();

        self.MoistureModeOn(false);
        self.DisplayingMoistureSetup(false);
        self.MoistureModeBlinkOn(false);
        self.TimerBlinkOn(false);
        self.FanSpeed(1); //1 is high, 0 is low

        //Button functions
        self.TempButtonUpFunction(self.ToggleTempDisplay);
        self.SetDefaults_TimerUi();
        self.Temp_MinusClickFunction(self.DecreaseTargetTemperature);
        self.Temp_UpClickFunction(self.IncreaseTargetTemperature);
        
        //Display functions
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

    self.SetDefaults_TimerUi = function () {
        self.TimerButtonDownFunction(self.TimerDown);
        self.TimerButtonUpFunction(self.TimerUp);
        self.LightOn_TimerFunction(self.TimerRunning);
        self.Timer_DownClickFunction(self.DecreaseTimer);
        self.Timer_UpClickFunction(self.IncreaseTimer);
    };
}