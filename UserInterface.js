/// <reference path="Lib/knockout-3.1.0.js" />

function UserInterface(self) {
    //Steam
    self.SteamButtonDown = function () {
        if (!self.OvenIsOn()) return;

        self.SteamDown();
    };

    self.SteamButtonUp = function () {
        if (!self.OvenIsOn()) return;

        self.SteamUp();
    };

    self.LightOn_Steam = ko.computed(function () {
        if (self.OvenIsOn()) {
            return self.MoistureModeOn() || self.DisplayingMoistureSetup() || self.SteamShooting();
        } else
            return false;
    });

    //Program
    self.ProgramButtonUp = function () {
        if (!self.OvenIsOn()) return;

        self.ProgramUp();
    };

    self.ProgramButtonDown = function () {
        if (!self.OvenIsOn()) return;

        self.ProgramDown();
    };

    self.LightOn_Program = ko.computed(function () {
        return self.IsDisplayingPrograms();
    });

    //Temp
    self.TempButtonUp = function () {
        if (!self.OvenIsOn() || !self.TempButtonUpFunction()) return;

        self.TempButtonUpFunction()();
    };

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

    //LightPower
    self.LightPowerButtonDown = function () {
        self.LightPowerDown();
    };

    self.LightPowerButtonUp = function () {
        self.LightPowerUp();
    };

    self.LightOn_LightPower = ko.computed(function () {
        return self.LightIsOn();
    });

    //Fan
    self.ButtonClickFan = function () {
        if (!self.OvenIsOn()) return;

        self.FanFunction();
    };

    self.LightOn_Fan = ko.computed(function () {
        return self.IsFanLow();
    });

    //Timer
    self.TimerButtonDown = function () {
        if (!self.OvenIsOn()) return;

        self.TimerButtonDownFunction()();
    };
    
    self.TimerButtonUp = function () {
        if (!self.OvenIsOn()) return;
        
        self.TimerButtonUpFunction()();
    };

    self.LightOn_Timer = ko.computed(function () {
        if (self.LightOn_TimerFunction())
            return self.LightOn_TimerFunction()();
        else
            return false;
    });

    //Dials - Start
    //Temp Plus/Minus

    self.btnTemp_MinusClick = function () {
        if (!self.OvenIsOn()) return;

        self.Temp_MinusClickFunction()();
    };

    self.btnTemp_PlusClick = function () {
        if (!self.OvenIsOn()) return;

        self.Temp_UpClickFunction()();
    };

    self.btnTimer_MinusClick = function () {
        if (!self.OvenIsOn()) return;

        self.Timer_DownClickFunction()();
    };

    self.btnTimer_PlusClick = function () {
        if (!self.OvenIsOn()) return;

        self.Timer_UpClickFunction()();
    };

    //Dials - End

    //Displays - Start

    self.TopDisplay = ko.computed(function () {
        return self.TopDisplayFunction() ? self.TopDisplayFunction()() : '';
    });

    self.BottomDisplay = ko.computed(function () {
        return self.BottomDisplayFunction() ? self.BottomDisplayFunction()() : '';
    });

    //Displays - End

    //Computed - Start
    
    self.ActualTemperatureRounded = ko.computed(function () {
        //Round the value
        return Math.round(self.ActualTemperature());
    });

    self.MoistureModeDisplay = ko.computed(function () {
        return self.MoistureModeBlinkOn() === true ? 'H-' + self.CurrentMoistureMode() : '';
    });

    //Computed - End

    //Display Functions - Start

    self.TimerDisplayValue = function () {
        if (self.TimerStarted()) {
            if (self.TimerBlinkOn())
                return self.ConvertDurtaionToDisplay(self.TimerCurrentValue());
            else
                return '';
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

    self.CoreProbeDisplayValue = function () {
        var coreProbeLabel = "CP";

        if (self.TargetCoreTemperatureSet()) {
            if (self.TargetCoreTemperatureBlinkOn()) {
                
                if (self.TargetCoreTemperatureAlternate()) {
                    if (self.DisplayingActualCoreTemperature())
                        return self.ActualCoreTemperature();
                    else
                        return self.TargetCoreTemperature();
                } else {
                    return coreProbeLabel;
                }
            }
            else
                return '';
        } else {
            return coreProbeLabel;
        }
    };

    //Display Functions - End

    //Utils

    self.ConvertDurtaionToDisplay = function (duration) {
        if (duration.minutes() > 10) { return duration.minutes(); }

        //console.log(duration.minutes + ':' + (duration.seconds < 10 ? '0' : '') + duration.seconds);

        return duration.minutes() + ':' + (duration.seconds() < 10 ? '0' : '') + duration.seconds();
    };

    self.Log = function (message) {
        self.Log(message);
    };
}