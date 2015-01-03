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
    };

    self.DecreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TargetTemperature() - 10);
    };

    self.IncreaseTimer = function () {
        if (self.TimerStartValue() >= 185)
            return; //We are at the max
        
        self.SetStartTimer(self.TimerStartValue() + 1);
    };

    self.DecreaseTimer = function () {
        if (self.TimerStartValue() <= 1)
            return; //We are at the min

        self.SetStartTimer(self.TimerStartValue() - 1);
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

    self.SetStartTimer = function (newValue) {
        self.TimerStartValue(newValue);
    };

    self.TimerDisplayValue = function() {
        if (self.TimerRunning()) {
            return self.TimerCurrentValue();
        } else {
            if (self.TimerStartValue() >= 185) {
                return "InF";
            } else {
                return self.TimerStartValue();
            }
        }
    };

    //Press and hold the ‘Steam’ Key until the ‘H-X’ level is
    //displayed and flashing in the upper display.
    //Rotate the ‘Temp’ Knob -/+ to select Moisture Mode
    //level required.
    //Press the STEAM Key to confirm setting.
    self.SteamDown = function () {
        if (self.OvenIsOn()) {
            if (self.DisplayingMoistureSetup()) {
                //Stop DisplayingMoistureSetup
                self.StopDisplayingMoistureMode();
            } else {
                //Either the button is held for 1500ms and the oven is turned off or we toggle moisture mode
                self.IsWaitingForMoistureModeOffInterval = true;

                //Start the timer
                self.StartMoistureModeIntervalTimer();
            }
        } else {
            //Twiddle thumbs
        }
    };

    self.SteamUp = function () {
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
}
