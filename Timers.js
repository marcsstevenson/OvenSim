/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function Timers(self) {
    //***Steam - Start

    //MoistureMode
    self.MoistureModeTimerId = 0;
    self.IsWaitingForMoistureModeOffInterval = ko.observable(false);
    self.MoistureModeOffInterval = 1500; //ms

    self.ClearMoistureModeTimer = function () {
        if (self.MoistureModeTimerId !== 0)
            clearInterval(self.MoistureModeTimerId);
    };

    self.StartMoistureModeIntervalTimer = function () {
        self.ClearMoistureModeTimer(); //Stop the timer
        self.MoistureModeTimerId = setInterval(function () { self.NextMoistureModeInterval(); }, self.MoistureModeOffInterval);
    };

    self.NextMoistureModeInterval = function () {
        self.IsWaitingForMoistureModeOffInterval(false); //Always reset this
        self.ClearMoistureModeTimer(); //Stop the timer
        self.StartDisplayingMoistureModeSetup(); //MoistureMode off the oven
    };

    //SteamShot

    self.SteamShotModeTimerId = 1;
    self.IsWaitingForSteamShotModeOffInterval = false;
    self.SteamShotModeOffInterval = 1000; //ms

    self.ClearSteamShotModeTimer = function () {
        if (self.SteamShotModeTimerId !== 1)
            clearInterval(self.SteamShotModeTimerId);
    };

    self.StartSteamShotModeIntervalTimer = function () {
        self.ClearSteamShotModeTimer(); //Stop the timer
        self.SteamShotModeTimerId = setInterval(function () { self.NextSteamShotModeInterval(); }, self.SteamShotModeOffInterval);
        self.SteamShooting(true);
    };

    self.NextSteamShotModeInterval = function () {
        self.IsWaitingForSteamShotModeOffInterval = false; //Always reset this
        self.ClearSteamShotModeTimer(); //Stop the timer
        self.SteamShooting(false);
    };

    //*** Steam - End

    //*** Program - Start
    //TODO
    //*** Program - End

    //*** Power - Start

    self.PowerTimerId = 2;
    self.IsWaitingForPowerOffInterval = false;
    self.PowerOffInterval = 1500; //ms - this is used to turn the oven off

    self.ClearPowerTimer = function () {
        if (self.PowerTimerId !== 2)
            clearInterval(self.PowerTimerId);
    };

    self.StartPowerIntervalTimer = function () {
        self.ClearPowerTimer(); //Stop the timer
        self.PowerTimerId = setInterval(function () { self.NextPowerInterval(); }, self.PowerOffInterval);
    };

    self.NextPowerInterval = function () {
        self.IsWaitingForPowerOffInterval = false; //Always reset this
        self.ClearPowerTimer(); //Stop the timer
        self.TurnOvenOff(); //Power off the oven
    };

    //*** Power - End

    //***TempDisplay - Start

    self.TempDisplayTimerId = 3;
    self.IsWaitingForTempDisplayInterval = false;
    self.TempDisplayInterval = 5000; //ms

    self.ClearTempDisplayTimer = function () {
        if (self.TempDisplayTimerId !== 3)
            clearInterval(self.TempDisplayTimerId);

        //Stop the flashing also
        self.ClearTempFlashTimer();
    };

    self.StartTempDisplayIntervalTimer = function () {
        self.ClearTempDisplayTimer(); //Stop the timer
        self.TempDisplayTimerId = setInterval(function () { self.NextTempDisplayInterval(); }, self.TempDisplayInterval);

        //Commence flashing
        self.StartTempFlashIntervalTimer();
    };

    self.NextTempDisplayInterval = function () {
        self.IsWaitingForTempDisplayInterval = false; //Always reset this
        self.ClearTempDisplayTimer(); //Stop the timer
        self.StopDisplayingActualTemperature(); //TempDisplay off the oven
    };

    //TempFlash

    self.TempFlashTimerId = 4;
    self.TempFlashInterval = 200; //ms

    self.ClearTempFlashTimer = function () {
        if (self.TempFlashTimerId !== 4)
            clearInterval(self.TempFlashTimerId);

        self.StopDisplayingActualFlash();
    };

    self.StartTempFlashIntervalTimer = function () {
        self.ClearTempFlashTimer(); //Stop the timer
        self.TempFlashTimerId = setInterval(function () { self.NextTempFlashInterval(); }, self.TempFlashInterval);
    };

    self.NextTempFlashInterval = function () {
        self.ToggleDisplayingActualFlash();
    };

    //MoistureModeBlink

    self.MoistureModeBlinkTimerId = 5;
    self.MoistureModeBlinkOffInterval = 300; //ms - this is used to turn the oven off

    self.ClearMoistureModeBlinkTimer = function () {
        if (self.MoistureModeBlinkTimerId !== 5)
            clearInterval(self.MoistureModeBlinkTimerId);
    };

    self.StartMoistureModeBlinkIntervalTimer = function () {
        self.ClearMoistureModeBlinkTimer(); //Stop the timer
        self.MoistureModeBlinkTimerId = setInterval(function () { self.NextMoistureModeBlinkInterval(); }, self.MoistureModeBlinkOffInterval);
    };

    self.NextMoistureModeBlinkInterval = function () {
        self.MoistureModeBlinkOn(!self.MoistureModeBlinkOn());
    };

    //***TempDisplay - End

    //*** Timer - Start

    //Reset

    self.TimerResetTimerId = 6;
    self.IsWaitingForTimerResetInterval = ko.observable(false);
    self.TimerResetInterval = 3000; //ms

    self.ClearTimerResetTimer = function () {
        if (self.TimerResetTimerId !== 6)
            clearInterval(self.TimerResetTimerId);
    };

    self.StartTimerResetIntervalTimer = function () {
        self.ClearTimerResetTimer(); //Stop the timer
        self.TimerResetTimerId = setInterval(function () { self.NextTimerResetInterval(); }, self.TimerResetInterval);
    };
    
    self.NextTimerResetInterval = function () {
        self.IsWaitingForTimerCountdownInterval(false); //Always reset this
        self.ClearTimerResetTimer(); //Stop the timer
        self.ResetTimer();
    };

    //Countdown

    self.TimerCountdownTimerId = 7;
    self.IsWaitingForTimerCountdownInterval = ko.observable(false);
    self.TimerCountdownInterval = 1000; //ms

    self.ClearTimerCountdownTimer = function () {
        if (self.TimerCountdownTimerId !== 7)
            clearInterval(self.TimerCountdownTimerId);
    };

    self.StartTimerCountdownIntervalTimer = function () {
        self.ClearTimerCountdownTimer(); //Stop the timer

        var interval = self.TimerCountdownInterval / self.TimeDilation();
        self.TimerCountdownTimerId = setInterval(function () { self.NextTimerCountdownInterval(); }, interval); //
    };

    self.NextTimerCountdownInterval = function () {
        //Update timer current value
        self.ClearTimerCountdownTimer();

        if (!self.TimerRunning()) return;

        self.StartTimerCountdownIntervalTimer();

        self.SetTimerTimerNextValue();
    };

    //TimerBlink

    self.TimerBlinkTimerId = 8;
    self.TimerBlinkOffInterval = 300; //ms - this is used to turn the oven off

    self.ClearTimerBlinkTimer = function () {
        if (self.TimerBlinkTimerId !== 8)
            clearInterval(self.TimerBlinkTimerId);
    };

    self.StartTimerBlinkIntervalTimer = function () {
        self.ClearTimerBlinkTimer(); //Stop the timer
        self.TimerBlinkTimerId = setInterval(function () { self.NextTimerBlinkInterval(); }, self.TimerBlinkOffInterval);
    };

    self.NextTimerBlinkInterval = function () {
        self.TimerBlinkOn(!self.TimerBlinkOn());
    };

    //*** Timer - End

    //*** Status Values

    //Heating

    self.SetIntervalHeatingTimer = function () {
        self.ClearHeatingTimer();

        self.HeatingTimerId = setInterval(function () { self.NextHeatingInterval(); }, 50);
    };

    self.ClearHeatingTimer = function () {
        if (self.HeatingTimerId !== 0)
            clearInterval(self.HeatingTimerId);
    };

    self.StartIntervalHeatingTimer = function () {
        self.ClearHeatingTimer(); //Stop the timer
        self.SetIntervalHeatingTimer();
    };

    self.NextHeatingInterval = function () {
        var delta = self.OvenIsOn() ? 0.1 : -0.05;

        //Cater to time dilation
        delta = delta * self.TimeDilation();

        self.SetTemperature(self.ActualTemperature() + delta);
    };
}