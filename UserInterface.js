/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function UserInterface(self) {

    self.LightOn_Steam = ko.computed(function () {
        if (self.OvenIsOn()) {
            return self.MoistureModeOn() || self.DisplayingMoistureSetup() || self.SteamShooting();
        } else
            return false;
    });

    self.LightOn_Program = ko.computed(function () {
        return false;
    });

    self.LightOn_Temp = ko.computed(function () {
        if (self.OvenIsOn()) {
            if (self.DisplayingActualTemperature()) {
                return self.DisplayingActualFlash();
            } else {
                return self.IsHeating();
            }
        } else
            return false;
    });

    self.LightOn_LightPower = ko.computed(function () {
        return self.LightIsOn();
    });

    self.LightOn_Fan = ko.computed(function () {
        return self.IsFanLow();
    });

    self.LightOn_Timer = ko.computed(function () {
        return self.TimerRunning();
    });

    self.ButtonClickSteam = function () {

    };

    self.ButtonClickProgram = function () {

    };

    self.ButtonClickTemp = function () {
        self.ToggleTempDisplay();
    };

    self.ButtonClickFan = function () {
        self.IsFanLow(!self.IsFanLow());
    };

    self.Temp_DownClickFunction = ko.observable();
    self.btnTemp_DownClick = function () {
        self.Temp_DownClickFunction()();
    };

    self.Temp_UpClickFunction = ko.observable();
    self.btnTemp_UpClick = function () {
        self.Temp_UpClickFunction()();
    };

    self.Timer_DownClickFunction = ko.observable();
    self.btnTimer_DownClick = function () {
        self.Timer_DownClickFunction()();
    };

    self.Timer_UpClickFunction = ko.observable();
    self.btnTimer_UpClick = function () {
        self.Timer_UpClickFunction()();
    };

    self.TopDisplayFunction = ko.observable(null);
    self.TopDisplay = ko.computed(function () {
        return self.TopDisplayFunction() ? self.TopDisplayFunction()() : '';
    });

    self.BottomDisplayFunction = ko.observable(null);
    self.BottomDisplay = ko.computed(function () {
        return self.BottomDisplayFunction() ? self.BottomDisplayFunction()() : '';
    });

    //Press ‘On-Off/Light’ key once to turn
    //the oven ‘On’
    //When oven is turned ‘On’, press ‘On-Off/Light’
    //key to switch oven light ‘On-Off’.
    //Press and hold ‘On-Off/Light’ key for 1.5 seconds
    //to turn the oven ‘Off’.
    self.LightPowerButtonDown = function () {
        if (self.OvenIsOn()) {
            //Either the button is held for 1500ms and moisture mode setup is started we toggle moisture mode on
            self.IsWaitingForPowerOffInterval = true;

            //Start the timer
            self.StartPowerIntervalTimer();
        } else {
            //Just turn the oven on
            self.TurnOvenOn();
        }
    };

    self.LightPowerButtonUp = function () {
        //If the oven is off - we don't care because we just 
        if (self.IsWaitingForPowerOffInterval) {
            self.ToggleLight();
        }
        self.ClearPowerTimer(); //Stop the timer
        self.IsWaitingForPowerOffInterval = false; //Always reset this
    };

    self.SteamButtonDown = function () {
        self.SteamDown();
    };

    self.SteamButtonUp = function () {
        self.SteamUp();
    };

    self.TimerButtonDown = function () {
        if (self.OvenIsOn()) {
            //Either the button is held for 1500ms and moisture mode setup is started we toggle moisture mode on
            self.IsWaitingForPowerOffInterval = true;

            //Start the timer
            self.StartPowerIntervalTimer();
        } else {
            //Just turn the oven on
            self.TurnOvenOn();
        }
    };

    self.TimerButtonUp = function () {
        //If the oven is off - we don't care because we just 
        if (self.IsWaitingForPowerOffInterval) {
            self.ToggleLight();
        }
        self.ClearPowerTimer(); //Stop the timer
        self.IsWaitingForPowerOffInterval = false; //Always reset this
    };
    
    self.ActualTemperatureRounded = ko.computed(function () {
        //Round the value
        return Math.round(self.ActualTemperature());
    });

    self.MoistureModeDisplay = ko.computed(function () {
        return self.BlinkOn() === true ? 'H-' + self.CurrentMoistureMode() : '';
    });

    self.TimerDisplayValue = function () {
        if (self.TimerRunning()) {
            return self.TimerCurrentValue();
        } else {
            if (self.TimerStartValue() <= -1) {
                return "InF";
            } else if (self.TimerStartValue() === 0) {
                return "---";
            } else {
                return self.TimerStartValue();
            }
        }
    };

    self.Log = function (message) {
        self.Log(message);
    };
}