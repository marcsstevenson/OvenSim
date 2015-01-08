/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function OvenManager(self) {

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
        self.IsHeating(true);
    };

    self.DecreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TargetTemperature() - 10);
        self.IsHeating(true);
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

    //Time Dilation - Start

    self.IncreaseTimeDilation = function () {
        self.SetTimeDilation(self.TimeDilation() + 1);
    };

    self.DecreaseTimeDilation = function () {
        self.SetTimeDilation(self.TimeDilation() - 1);
    };

    self.SetTimeDilation = function (newValue) {
        longFunc(newValue);
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

        longFunc(newValue);
        self.TimeDilation(newValue);
    };

    //Press and hold the ‘Steam’ Key until the ‘H-X’ level is
    //displayed and flashing in the upper display.
    //Rotate the ‘Temp’ Knob -/+ to select Moisture Mode
    //level required.
    //Press the STEAM Key to confirm setting.
    self.SteamDown = function () {
        if (!self.OvenIsOn()) return;

        if (self.DisplayingMoistureSetup()) {
            //Stop DisplayingMoistureSetup
            self.StopDisplayingMoistureMode();
        } else {
            //Either the button is held for 1500ms and the oven is turned off or we toggle moisture mode
            self.IsWaitingForMoistureModeOffInterval = true;

            //Start the timer
            self.StartMoistureModeIntervalTimer();
        }
    };

    self.SteamUp = function () {
        if (!self.OvenIsOn()) return;

        //If the oven is off - we don't care because we just 
        if (self.IsWaitingForMoistureModeOffInterval) {
            //‘Steam’ LED will
            //illuminate when
            //automated
            //Moisture Mode is
            //set (H-1-H-5) or
            //during each
            //moisture
            //injection in H-0.

            //If moisture mode is H-0
            if (self.CurrentMoistureMode() === 0)
                if (self.IsCooking()) self.SteamShot();
                else
                    self.ToggleMoistureMode();
        }

        self.ClearMoistureModeTimer(); //Stop the timer
        self.IsWaitingForMoistureModeOffInterval = false; //Always reset this
    };

    //*** Timer Section - Start
    
    self.IncreaseTimer = function () {
        if (self.TimerRunning()) return;

        if (self.TimerStartValue() >= 180) {
            self.SetStartTimer(-1);
            return; //We are at the max
        }

        self.SetStartTimer(self.TimerStartValue() + 1);
    };

    self.DecreaseTimer = function () {
        if (self.TimerRunning()) return;

        if (self.TimerStartValue() <= -1) {
            self.SetStartTimer(180);
            return; //We are at the min
        }

        self.SetStartTimer(self.TimerStartValue() - 1);
    };

    self.SetStartTimer = function (newValue) {
        self.TimerStartValue(newValue);
    };

    //Press ‘Timer-Start/Stop’ key to start timer operation. LED will illuminate to indicate the timer is running.
    //Pressing ‘Timer-Start/Stop’ key or opening oven door when timer is operating will pause timer and turn ‘Off’ fan and heating.
    //Timer LED will flash.
    //Press and hold ‘Timer-Start/Stop’ key for 3 seconds to cancel timer.
    self.TimerButtonDown = function () {
        if (!self.OvenIsOn()) return;

        //TODO

        if (self.DisplayingMoistureSetup()) {
            //Stop DisplayingMoistureSetup
            self.StopDisplayingMoistureMode();
        } else {
            //Either the button is held for 1500ms and the oven is turned off or we toggle moisture mode
            self.IsWaitingForMoistureModeOffInterval = true;

            //Start the timer
            self.StartMoistureModeIntervalTimer();
        }
    };

    self.TimerButtonUp = function () {
        if (!self.OvenIsOn()) return;

        //TODO

        //If the oven is off - we don't care because we just 
        if (self.IsWaitingForMoistureModeOffInterval) {
            //‘Steam’ LED will
            //illuminate when
            //automated
            //Moisture Mode is
            //set (H-1-H-5) or
            //during each
            //moisture
            //injection in H-0.

            //If moisture mode is H-0
            if (self.CurrentMoistureMode() === 0)
                if (self.IsCooking()) self.SteamShot();
                else
                    self.ToggleMoistureMode();
        }

        self.ClearMoistureModeTimer(); //Stop the timer
        self.IsWaitingForMoistureModeOffInterval = false; //Always reset this
    };

    self.StartTimer = function() {
        if (self.TimerStartValue() === 0) return; //Nothing to do

        if (self.TimerStartValue() <= -1) {
            self.TimerDirectionUp(true); //Up

            //Set the duration to run to 0 time
            self.TimerCurrentValue();
        } else {
            self.TimerDirectionUp(false); //Down
            
            //Set the duration to run
            self.TimerCurrentValue();
        }

        self.TimerStarted(true);
        self.TimerRunning(true);

        //TODO Start timer
    };

    self.PauseTimer = function () {
        self.TimerRunning(false);
        //TODO pause timer
    };
    
    self.RestartTimer = function() {
        self.TimerRunning(true);
        //TODO pause timer
    };

    self.TimerComplete = function () {
        self.TimerRunning(true);
        //TODO pause timer
    };

    //*** Timer Section - End
}
