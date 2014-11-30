/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function UserInterface(self) {

    self.LightOn_Steam = ko.computed(function () {
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
                return self.ElementOn();
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
        return false;
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

    self.ButtonClickTimer = function () {

    };

    self.btnTemp_DownClick = function () {
        self.DecreaseTargetTemperature();
    };

    self.btnTemp_UpClick = function () {
        self.IncreaseTargetTemperature();
    };

    self.btnTimer_DownClick = function () {
    };

    self.btnTimer_UpClick = function () {
    };

    self.TopDisplay = ko.computed(function () {
        if (self.OvenIsOn()) {
            if (self.DisplayingActualTemperature())
                return self.ActualTemperatureRounded();
            else
                return self.TargetTemperature();
        } else {
            return "";
        }
    });

    self.BottomDisplay = ko.computed(function () {
        if (self.OvenIsOn()) {
            return self.ActualTemperature();
        } else {
            return "";
        }
    });

    //Press ‘On-Off/Light’ key once to turn
    //the oven ‘On’
    //When oven is turned ‘On’, press ‘On-Off/Light’
    //key to switch oven light ‘On-Off’.
    //Press and hold ‘On-Off/Light’ key for 1.5 seconds
    //to turn the oven ‘Off’.
    self.LightPowerButtonDown = function () {
        if (self.OvenIsOn()) {
            //Either the button is held for 1500ms and the oven is turned off or we toggle the light
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

    self.ActualTemperatureRounded = ko.computed(function () {
        //Round the value
        return Math.round(self.ActualTemperature());
    });

    self.Log = function (message) {
        console.log(message);
    };
}