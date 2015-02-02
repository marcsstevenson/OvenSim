/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />
/// <reference path="OvenProgramFactory.js" />

function StatusProperties(self) {
    var manualModeProgramStep = new OvenProgramStep();
    manualModeProgramStep.IsManualModeStep(true); //This may not be used ever
    self.ManualModeProgramStep = ko.observable(manualModeProgramStep);
    self.DisplayingProgramStep = ko.observable(manualModeProgramStep);

    self.StartTemperature = 18;

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

    //Programming
    self.ProgrammingStage = ko.observable(0); //0 = Not, 1 = Display Program, 2 = Edit Program, 3 = Edit Program Stage Values
    self.IsProgramming = ko.computed(function() {
        return self.ProgrammingStage() > 0;
    });

    self.OvenPrograms = ko.observableArray(new OvenProgramFactory().BuildEmptyOvenPrograms());
    self.DisplayingOvenProgramIndex = ko.observable(0);
    self.DisplayingOvenProgramStepIndex = ko.observable(0);
    self.CookingOvenProgramIndex = ko.observable(0);
    self.CookingOvenProgramStepIndex = ko.observable(0);

    //Status Values
    self.OvenIsOn = ko.observable();
    self.ProgrammingFlash = ko.observable();
    self.LightIsOn = ko.observable();
    self.DisplayingActualFlash = ko.observable();
    self.MoistureModeOn = ko.observable();
    self.DisplayingMoistureSetup = ko.observable();
    self.MoistureModeBlinkOn = ko.observable(false);
    self.TimerBlinkOn = ko.observable(false);

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
    self.Temp_PlusClickFunction = ko.observable();
    self.Timer_MinusClickFunction = ko.observable();
    self.Timer_UpClickFunction = ko.observable();

    //Display functions
    self.TopDisplayFunction = ko.observable(null);
    self.BottomDisplayFunction = ko.observable(null);

    self.SetDefaults = function () {
        self.ManualModeProgramStep(manualModeProgramStep); //Set back to manual mode

        self.OvenIsOn(false);
        self.LightIsOn(false);
        self.DisplayingActualTemperature(false);
        self.DisplayingActualFlash(false);

        self.ActualTemperature(self.StartTemperature);
        
        self.ActualCoreTemperature(self.StartTemperature);
        self.TargetCoreTemperatureSet(false);
        self.TargetCoreTemperatureBlinkOn(false);
        self.TargetCoreTemperatureAlternate(false);
        self.CoreTemperatureCookingStarted(false);

        self.SetDefaults_Timer();

        self.MoistureModeOn(false);
        self.DisplayingMoistureSetup(false);
        self.MoistureModeBlinkOn(false);
        self.TimerBlinkOn(false);

        //Button functions
        self.TempButtonUpFunction(self.ToggleTempDisplay);
        self.SetDefaults_TimerUi();
        self.Temp_MinusClickFunction(self.DecreaseTargetTemperature);
        self.Temp_PlusClickFunction(self.IncreaseTargetTemperature);
        
        //Display functions
        //self.TimerDisplayValue = ko.computed(function () {
        //    return self.DisplayingProgramStep().TimerDisplayValue();
        //});
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

        //Programming
        self.SetDefaults_Programming();

        //Manual Program Step
        self.ManualModeProgramStep().SetDefaults();
    };

    self.SetDefaults_Timer = function () {
        self.TimerStarted(false);
        self.TimerRunning(false);
        self.TimerComplete(false);
    };

    self.SetDefaults_TimerUi = function () {
        self.TimerButtonDownFunction(self.TimerDown);
        self.TimerButtonUpFunction(self.TimerUp);
        self.LightOn_TimerFunction(self.TimerRunning);
        self.Timer_MinusClickFunction(self.DecreaseTimer);
        self.Timer_UpClickFunction(self.IncreaseTimer);
    };

    self.SetDefaults_Programming = function () {
        self.ProgrammingStage(0);
        self.ProgrammingFlash(false);
        
        //The programs persist
        self.DisplayingOvenProgramIndex(0);
        self.DisplayingOvenProgramStepIndex(0);
        self.CookingOvenProgramIndex(0);
        self.CookingOvenProgramStepIndex(0);
    };
}