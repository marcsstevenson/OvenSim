/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function OvenViewModel() {
    var self = this;

    ko.utils.extend(self, new StatusProperties());
    
    self.TimerId = 0;
    self.StartTemperature = 18;
    self.MaxTemperatureTarget = 240;
    self.DefaultTemperatureTarget = 180;
    self.MinTemperatureTarget = 80;

    self.Temperature = ko.observable(self.StartTemperature);
    self.TemperatureTarget = ko.observable(self.DefaultTemperatureTarget);
    //1 is high, 0 is low
    self.FanSpeed = ko.observable(1);

    self.MaxTimeDilation = 1;
    self.MinTimeDilation = 1;
    self.TimeDilation = ko.observable(1);

    self.SetIntervalTimer = function () {
        self.ClearTimer();

        self.TimerId = setInterval(function () { self.NextInterval(); }, 50);
    };

    self.ClearTimer = function () {
        if (self.TimerId !== 0)
            clearInterval(self.TimerId);
    };

    self.StartIntervalTimer = function () {
        self.ClearTimer(); //Stop the timer
        self.SetIntervalTimer();
    };

    self.NextInterval = function () {
        var delta = self.OvenIsOn() ? 0.1 : -0.05;

        //Cater to time dilation
        delta = delta * self.TimeDilation();

        self.SetTemperature(self.Temperature() + delta);
    };
    
    self.SetTemperature = function (newValue) {
        if (self.OvenIsOn() && newValue >= self.TemperatureTarget()) //Ensure that we do not go above our target
        {
            self.Temperature(self.TemperatureTarget());

            return;
        }
        else if (!self.OvenIsOn() && newValue <= self.StartTemperature) //Ensure that we do not go below ambient
        {
            self.ClearTimer(); //We may as well turn off the timer
            self.Temperature(self.StartTemperature);

            return;
        }

        self.Temperature(newValue);
    };

    self.IncreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TemperatureTarget() + 10);
    };

    self.DecreaseTargetTemperature = function () {
        self.SetTargetTemperature(self.TemperatureTarget() - 10);
    };

    self.SetTargetTemperature = function (newValue) {
        if (newValue >= self.MaxTemperatureTarget) //Ensure that we do not go above our max target
        {
            self.TemperatureTarget(self.MaxTemperatureTarget);
            return;
        }
        else if (newValue <= self.MinTemperatureTarget) //Ensure that we do not go below min target
        {
            self.TemperatureTarget(self.MinTemperatureTarget);
            return;
        }

        self.TemperatureTarget(newValue);
    };


    //Time Dilation - Start

    self.IncreaseTimeDilation = function () {
        self.SetTimeDilation(self.TimeDilation() + 1);
    };

    self.DecreaseTimeDilation = function () {
        self.SetTimeDilation(self.TimeDilation() - 1);
    };

    self.SetTimeDilation = function (newValue) {
        self.Log(newValue);
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

        self.Log(newValue);
        self.TimeDilation(newValue);
    };

    //Time Dilation - End

    self.DisplayTemperature = ko.computed(function () {
        //Round the value
        return Math.round(self.Temperature());
    });
    
    self.ToggleLight = function () {
        self.LightIsOn(!self.LightIsOn());
    }

    self.TurnOvenOn = function () {
        self.OvenIsOn(true);
    }

    self.TurnOvenOff = function () {
        //Turn everything off
        self.OvenIsOn(false);
        self.LightIsOn(false);

        //TODO: Stop programs etc
    }

    self.Start = function () {
        self.StartIntervalTimer();
    }

    self.Stop = function () {
    }

    self.Log = function(message) {

    };

    //Operational flags

    self.IsFanLow = ko.observable(false);

    //UI interface
    self.TopDisplay = ko.computed(function () {
        if (self.OvenIsOn()) {
            return self.DisplayTemperature();
        } else {
            return "";
        }
    });

    self.ButtonClickSteam = function () {

    };

    self.LightOn_Steam = ko.computed(function () {
        return false;
    });

    self.ButtonClickProgram = function () {

    };

    self.LightOn_Program = ko.computed(function () {
        return false;
    });

    self.ButtonClickTemp = function () {

    };

    self.LightOn_Temp = ko.computed(function () {
        return false;
    });
    
    self.BottomDisplay = ko.computed(function () {
        if (self.OvenIsOn()) {
            return self.Temperature();
        } else {
            return "";
        }
    });

    self.LightOn_LightPower = ko.computed(function () {
        return self.LightIsOn();
    });
    self.ButtonClickFan = function () {
        self.IsFanLow(!self.IsFanLow());
    };
    self.LightOn_Fan = ko.computed(function () {
        return self.IsFanLow();
    });
    self.ButtonClickTimer = function () {

    };
    self.LightOn_Timer = ko.computed(function () {
        return false;
    });
    
    //Power button events

    self.PowerTimerId = 0;
    self.IsWaitingForPowerOffInterval = false;
    self.PowerOffInterval = 1500; //ms - this is used to turn the oven off
    
    self.ClearPowerTimer = function () {
        if (self.PowerTimerId !== 0)
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
    
    //Press ‘On-Off/Light’ key once to turn
    //the oven ‘On’
    //When oven is turned ‘On’, press ‘On-Off/Light’
    //key to switch oven light ‘On-Off’.
    //Press and hold ‘On-Off/Light’ key for 1.5 seconds
    //to turn the oven ‘Off’.
    self.LightPowerButtonDown = function() {
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

    //Temp - testing
    self.TurnOvenOn();

    return self;
}