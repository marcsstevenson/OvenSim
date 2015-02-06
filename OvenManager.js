/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />
/// <reference path="Lib/knockout-3.1.0.js" />

function OvenManager(self) {
    //*** Steam - Start

    //Press and hold the ‘Steam’ Key until the ‘H-X’ level is
    //displayed and flashing in the upper display.
    //Rotate the ‘Temp’ Knob -/+ to select Moisture Mode
    //level required.
    //Press the STEAM Key to confirm setting.
    self.SteamDown = function () {
        if (self.DisplayingMoistureSetup()) {
            //Stop DisplayingMoistureSetup
            self.StopDisplayingMoistureMode();
        } else {
            //Either the button is held for 1500ms and the oven is turned off or we toggle moisture mode
            self.IsWaitingForMoistureModeOffInterval(true);

            //Start the timer
            self.StartMoistureModeIntervalTimer();
        }
    };

    self.SteamUp = function () {
        //If the oven is off - we don't care because we just 
        if (self.IsWaitingForMoistureModeOffInterval()) {
            //‘Steam’ LED will
            //illuminate when
            //automated
            //Moisture Mode is
            //set (H-1-H-5) or
            //during each
            //moisture
            //injection in H-0.

            //If moisture mode is H-0
            if (self.DisplayingProgramStage().CurrentMoistureMode() === 0)
                if (self.IsCooking()) self.SteamShot();
                else
                    self.ToggleMoistureMode();
        }

        self.ClearMoistureModeTimer(); //Stop the timer
        self.IsWaitingForMoistureModeOffInterval(false); //Always reset this
    };

    self.ToggleMoistureMode = function () {
        self.MoistureModeOn(!self.MoistureModeOn());
    };

    self.MoistureModeDown = function () {
        self.DisplayingProgramStage().MoistureModeDown();
    };

    self.MoistureModeUp = function () {
        self.DisplayingProgramStage().MoistureModeUp();
    };

    self.SteamShot = function () {
        self.SteamShooting(true);
        self.StartSteamShotModeIntervalTimer();
    };

    self.StartDisplayingMoistureModeSetup = function () {
        self.DisplayingMoistureSetup(true);

        self.SteamButtonIsBlinking(true);
        self.TopDisplayIsBlinking(true);

        self.TopDisplayFunction(self.MoistureModeDisplay);
        self.Temp_MinusClickFunction(self.MoistureModeDown);
        self.Temp_PlusClickFunction(self.MoistureModeUp);
    };

    self.StopDisplayingMoistureMode = function () {
        self.DisplayingMoistureSetup(false);

        self.SteamButtonIsBlinking(false);
        self.TopDisplayIsBlinking(false);

        self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
        self.Temp_MinusClickFunction(self.DecreaseTargetTemperature);
        self.Temp_PlusClickFunction(self.IncreaseTargetTemperature);
    };

    //*** Steam - End

    //*** Program - Start

    self.EditingOvenProgram = ko.computed(function () {
        return self.OvenPrograms()[self.EditingOvenProgramIndex()];
    });

    self.EditingOvenProgramStage = ko.computed(function () {
        return self.EditingOvenProgram().OvenProgramStages()[self.EditingOvenProgramStageIndex()];
    });

    self.ProgramDown = function () {
        self.IsWaitingForEditProgramStartInterval(true);
        self.StartEditProgramStartIntervalTimer();
    };

    self.ProgramUp = function () {
        if (self.IsWaitingForEditProgramStartInterval()) {
            self.ProgrammingShortClick();
        }

        self.ClearEditProgramStartTimer();
        self.IsWaitingForEditProgramStartInterval(false);
    };

    //  Display Programs - Start
    self.ProgrammingShortClick = function () {
        if (self.ProgrammingArea() === 0)
            self.SetProgrammingArea(1); //From none to display
        else if (self.ProgrammingArea() === 1)
            self.SetProgrammingArea(0); //From display to none
        else if (self.ProgrammingArea() === 2)
            self.SetProgrammingArea(3); //From edit to edit stage values
        else if (self.ProgrammingArea() === 3)
            self.NextEditProgramStageValue(); //Move to the next edit stage value
    };

    self.ProgrammingLongClick = function () {
        if (self.ProgrammingArea() === 0)
            ; //Twiddle thumbs
        else if (self.ProgrammingArea() === 1)
            self.SetProgrammingArea(2); //From display to edit
        else if (self.ProgrammingArea() === 2)
            self.SetProgrammingArea(1); //From edit back to display
        else if (self.ProgrammingArea() === 3)
            self.NextEditProgramStageValue(1); //From edit stage values back to display
    };

    self.SetProgrammingArea = function (value) {
        //0 = Not, 1 = Display Program, 2 = Edit Program, 3 = Edit Program Stage Values

        //Set by default
        self.ProgramButtonIsBlinking(false);
        self.TopDisplayIsBlinking(false);

        self.DisplayingProgramStage(self.EditingOvenProgramStage());

        if (value === 0) {
            //Restore defaults
            self.SetDefaults_TempUi();
            self.SetDefaults_TimerUi();
            self.DisplayingProgramStage(self.ManualModeProgramStage());

        } else if (value === 1) {
            //Display Program

            //Set the temp knob to change display program 
            self.Temp_MinusClickFunction(self.DisplayPreviousProgram);
            self.Temp_PlusClickFunction(self.DisplayNextProgram);

            //Set the top display to show the currently displayed program
            self.TopDisplayFunction(self.DisplayProgramsValue);

            //Stop with the flashing
            self.ProgramButtonIsBlinking(false);
        } else if (value === 2) {
            //Edit Program

            //Set the temp knob to change display program 
            self.Temp_MinusClickFunction(self.DisplayPreviousProgramStage);
            self.Temp_PlusClickFunction(self.DisplayNextProgramStage);

            //Set the top display to show the currently displayed program
            self.TopDisplayFunction(self.EditProgramValue);

            //Set the bottom display to show the on/off status of the program
            self.BottomDisplayFunction(self.EditProgramStageIsOn);

            //The timer buttons toggle the IsOnValue of the stage
            self.Temp_MinusClickFunction(function() {
                self.EditingOvenProgramStage().IsOnValue(false);
            });
            self.Temp_PlusClickFunction(function () {
                console.log('here');
                self.EditingOvenProgramStage().IsOnValue(true);
            });

            self.Beep();

            //Start with the flashing
            self.ProgramButtonIsBlinking(true);
        } else if (value === 3) {
            //Edit Program Stage Values

            self.ProgramButtonIsBlinking(true);

            self.EditingOvenProgramStage().SetToNoEditingValue();

            self.NextEditProgramStageValue();
        }

        self.ProgrammingArea(value);
    };

    self.NextEditProgramStageValue = function () {
        //Move to temp, timer, steam etc
        var programStage = self.EditingOvenProgramStage();
        programStage.NextEditingValue();
        
        //Set UI as needed
        if (programStage.EditingIndex() === -1) {
            // -1: None
            self.SetProgrammingArea(2);

            self.TopDisplayIsBlinking(false);
            self.BottomDisplayIsBlinking(false);
        }
        else if (programStage.EditingIndex() === 0) {

            //console.clear();
            //console.log(self.EditingOvenProgramStage());
            //console.log(self.ManualModeProgramStage());

            // 0: Target Temp
            //Top display has target temp of stage - blinking
            //Temp +/- adjusts the target temp
            self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
            self.TopDisplayIsBlinking(true);
            self.Temp_MinusClickFunction(self.DecreaseTargetTemperature);
            self.Temp_PlusClickFunction(self.IncreaseTargetTemperature);
            
            //Bottom display is "timer value"
            //Timer +/- does nothing
            self.BottomDisplayFunction(self.TimerDisplayValue);
            self.BottomDisplayIsBlinking(false);
            self.Timer_MinusClickFunction(null);
            self.Timer_PlusClickFunction(null);
        }
        else if (programStage.EditingIndex() === 1) {
            // 1: Timer
            //Top display has target temp of stage
            //Temp +/- does nothing
            self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
            self.TopDisplayIsBlinking(false);
            self.Temp_MinusClickFunction(null);
            self.Temp_PlusClickFunction(null);

            //Bottom display is timer value - blinking
            //Timer +/- adjusts the target temp
            self.BottomDisplayFunction(self.TimerDisplayValue);
            self.BottomDisplayIsBlinking(true);
            self.Timer_MinusClickFunction(self.DecreaseTimer);
            self.Timer_PlusClickFunction(self.IncreaseTimer);
        }
        else if (programStage.EditingIndex() === 2) {
            // 2: Target Core Temperature (if timer is CP(-2))
            //Top display has target temp of stage
            //Temp +/- does nothing
            self.TopDisplayFunction(self.MoistureModeDisplay);
            self.TopDisplayIsBlinking(true);
            self.Temp_MinusClickFunction(self.MoistureModeDown);
            self.Temp_PlusClickFunction(self.MoistureModeUp);

            //Bottom display is Target Core Temperature - blinking
            //Timer +/- adjusts Target Core Temperature
            self.BottomDisplayFunction(self.TimerDisplayValue);
            self.BottomDisplayIsBlinking(false);
            self.Timer_MinusClickFunction(null);
            self.Timer_PlusClickFunction(null);
        }
        else if (programStage.EditingIndex() === 3) {
            // 3: Steam
            //Top display has moisture mode - blinking
            //Temp +/- adjusts the moisture mode
            self.TopDisplayFunction(self.MoistureModeDisplay);
            self.TopDisplayIsBlinking(true);
            self.Temp_MinusClickFunction(self.MoistureModeDown);
            self.Temp_PlusClickFunction(self.MoistureModeUp);

            //Bottom display is blank
            //Timer +/- does nothing
            self.BottomDisplayFunction(null);
            self.BottomDisplayIsBlinking(false);
            self.Timer_MinusClickFunction(null);
            self.Timer_PlusClickFunction(null);
        }
        else if (programStage.EditingIndex() === 4) {
            // 4: Fan
            //Top display has target "FAn"
            //Temp +/- does nothing
            self.TopDisplayFunction(function () {
                return 'FAn';
            });
            self.TopDisplayIsBlinking(false);
            self.Temp_MinusClickFunction(null);
            self.Temp_PlusClickFunction(null);

            //Bottom display is Fan Mode - blinking
            //Timer +/- adjusts Fan Mode: - sets LO, + sets Hi
            self.BottomDisplayFunction(function() {
                return self.DisplayingProgramStage().IsFanLow() ? 'LO' : 'H1';
            });
            self.BottomDisplayIsBlinking(true);
            self.Timer_MinusClickFunction(function () {
                self.DisplayingProgramStage().IsFanLow(1);
            });
            self.Timer_PlusClickFunction(function () {
                self.DisplayingProgramStage().IsFanLow(0);
            });
        }
        else if (programStage.EditingIndex() === 5) {
            // 5: Alarm
            //Top display has target "ALr"
            //Temp +/- does nothing
            self.TopDisplayFunction(function () {
                return 'ALr';
            });
            self.TopDisplayIsBlinking(false);
            self.Temp_MinusClickFunction(null);
            self.Temp_PlusClickFunction(null);

            //Bottom display is Alarm value - blinking
            //Timer +/- adjusts Alarm: - sets off, + sets on
            self.BottomDisplayFunction(function () {
                return self.DisplayingProgramStage().AlarmOn() ? 'On' : 'OFF';
            });
            self.BottomDisplayIsBlinking(true);
            self.Timer_MinusClickFunction(function () {
                self.DisplayingProgramStage().AlarmOn(false);
            });
            self.Timer_PlusClickFunction(function () {
                self.DisplayingProgramStage().AlarmOn(true);
            });
        }
    };

    //  Display Programs - Start

    self.DisplayNextProgram = function () {
        self.ChangeDisplayProgram(1);
    }

    self.DisplayPreviousProgram = function () {
        self.ChangeDisplayProgram(-1);
    }

    self.ChangeDisplayProgram = function (delta) {
        var newIndex = self.EditingOvenProgramIndex() + delta;

        if (newIndex > self.OvenPrograms().length - 1) return; //It doesn't loop
        if (newIndex < 0) return; //It doesn't loop

        self.EditingOvenProgramIndex(newIndex);
    }

    self.DisplayNextProgramStage = function () {
        self.ChangeDisplayProgramStage(1);
    }

    self.DisplayPreviousProgramStage = function () {
        self.ChangeDisplayProgramStage(-1);
    }

    self.ChangeDisplayProgramStage = function (delta) {
        var newIndex = self.EditingOvenProgramStageIndex() + delta;

        if (newIndex < 0) return; //It doesn't loop

        var lastOnProgramStage = self.EditingOvenProgram().GetLastOnProgramStage();

        if (!lastOnProgramStage) return; //There are no stages so there is nowhere to go

        if (newIndex > lastOnProgramStage.Index()) return; //It doesn't loop

        self.EditingOvenProgramStageIndex(newIndex);
    }

    self.DisplayProgramsValue = function () {
        return self.EditingOvenProgram().GetPName();
    };

    //  Display Programs - End

    //  Edit Programs - Start
    self.EditProgramValue = function () {
        var ovenProgram = self.EditingOvenProgram();
        var ovenProgramStage = self.EditingOvenProgramStage();
        var display = ovenProgram.Name() + '.' + ovenProgramStage.Name();
        return display;
    };

    self.EditProgramStageIsOn = function () {
        var ovenProgram = self.OvenPrograms()[self.EditingOvenProgramIndex()];
        var ovenProgramStage = ovenProgram.OvenProgramStages()[self.EditingOvenProgramStageIndex()];
        return ovenProgramStage.IsOn() ? 'On' : 'OFF';
    };

    //  Edit Programs - End

    //*** Program - End

    //*** Temperature Display - Start

    self.ToggleTempDisplay = function () {
        var currentValue = self.DisplayingActualTemperature();

        if (currentValue)
            self.StopDisplayingActualTemperature();
        else
            self.StartDisplayingActualTemperature();
    }

    self.StartDisplayingActualTemperature = function () {
        //Stop the temp display timers
        self.TempButtonIsBlinking(true);
        self.DisplayingActualTemperature(true);
        self.StartTempDisplayIntervalTimer();

        self.TopDisplayFunction(self.ActualTemperatureRounded);
    };

    self.StopDisplayingActualTemperature = function () {
        //Stop the temp display timers

        self.TempButtonIsBlinking(false);

        self.DisplayingActualTemperature(false);

        self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
    };

    //*** Temperature Display - End

    //*** Temperature Setting - Start
    //  This is the actual temperature
    self.SetTemperature = function (newValue) {
        if (self.OvenIsOn() && newValue >= self.TargetTemperatureDisplayValue()) //Ensure that we do not go above our target
        {
            self.ActualTemperature(self.TargetTemperatureDisplayValue());

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
        self.DisplayingProgramStage().IncreaseTargetTemperature();

        //console.clear();
        //console.log(self.DisplayingProgramStage().IsManualModeStep());
        if (self.DisplayingProgramStage().IsManualModeStep())
            self.IsHeating(true);
    };

    self.DecreaseTargetTemperature = function () {
        self.DisplayingProgramStage().DecreaseTargetTemperature();

        if (self.DisplayingProgramStage().IsManualModeStep())
            self.IsHeating(true);
    };

    //*** Temperature Setting - End

    //*** LightPower - Start

    //Press ‘On-Off/Light’ key once to turn
    //the oven ‘On’
    //When oven is turned ‘On’, press ‘On-Off/Light’
    //key to switch oven light ‘On-Off’.
    //Press and hold ‘On-Off/Light’ key for 1.5 seconds
    //to turn the oven ‘Off’.
    self.LightPowerDown = function () {
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

    self.LightPowerUp = function () {
        //If the oven is off - we don't care because we just 
        if (self.IsWaitingForPowerOffInterval) {
            self.ToggleLight();
        }
        self.ClearPowerTimer(); //Stop the timer
        self.IsWaitingForPowerOffInterval = false; //Always reset this
    };

    //*** LightPower - End

    //*** Timer Section - Start

    self.IncreaseTimer = function () {
        if (self.TimerRunning()) return;

        self.DisplayingProgramStage().IncreaseTimer();
    };

    self.DecreaseTimer = function () {
        if (self.TimerRunning()) return;

        self.DisplayingProgramStage().DecreaseTimer();
    };

    self.SetStartTimer = function (newValue) {
        self.TimerStartValue(newValue);
    };

    //Press ‘Timer-Start/Stop’ key to start timer operation. LED will illuminate to indicate the timer is running.
    //Pressing ‘Timer-Start/Stop’ key or opening oven door when timer is operating will pause timer and turn ‘Off’ fan and heating.
    //Timer LED will flash.
    //Press and hold ‘Timer-Start/Stop’ key for 3 seconds to cancel timer.
    self.TimerDown = function () {
        if (self.TimerComplete()) return;

        //Always start timing for timer reset
        self.IsWaitingForTimerResetInterval(true);
        self.StartTimerResetIntervalTimer();
    };

    self.TimerUp = function () {
        if (self.TimerComplete()) {
            self.CancelTimerComplete();
            return;
        }

        if (self.IsWaitingForTimerResetInterval()) {
            if (self.TimerStarted())
                //Toggle the running of the timer
                self.ToggleTimer();
            else
                self.StartTimer();
        }

        self.ClearTimerResetTimer(); //Stop the reset timer
        self.IsWaitingForTimerResetInterval(false); //Always reset this
    };

    self.StartTimer = function () {
        if (self.TimerStartValue() === 0) return; //Nothing to do

        var duration;

        if (self.TimerStartValue() <= -1) {
            //Count down
            self.TimerDirectionUp(true); //Up

            //Set the duration to run
            duration = moment.duration(0, 'minutes');
            self.TimerCurrentValue(duration);
        } else {
            //Count up
            self.TimerDirectionUp(false); //Down

            //Set the duration to run
            duration = moment.duration(self.TimerStartValue(), 'minutes');

            self.TimerCurrentValue(duration);
        }

        self.TimerStarted(true);
        self.TimerRunning(true);
        self.IsHeating(true);

        self.TimerComplete(false);

        self.StartTimerCountdownIntervalTimer();
        self.Log('Timer Started');
    };

    self.SetTimerTimerNextValue = function () {
        var timerCurrentValue = self.TimerCurrentValue();

        var delta = moment.duration(1, 'seconds');

        //If timing up - add a second, if timing down - remove a second
        if (self.TimerDirectionUp()) {
            //Only add if we're before the minute limit
            if (timerCurrentValue.asMinutes() < 999) {
                timerCurrentValue.add(delta);
            } else {
                return;
            }
        } else {

            if (timerCurrentValue.asSeconds() > 0) {
                timerCurrentValue.subtract(delta);
            } else {
                self.SetTimerComplete();
                return;
            }
        }

        self.TimerCurrentValue(timerCurrentValue);
    };

    self.ToggleTimer = function () {
        if (self.TimerRunning())
            self.PauseTimer();
        else
            self.RestartTimer();
    };

    self.PauseTimer = function () {
        self.TimerRunning(false);
        self.ClearTimerCountdownTimer();
        self.IsHeating(false);
        self.BottomDisplayIsBlinking(true);

        self.Log('Timer Paused');
    };

    self.RestartTimer = function () {
        self.TimerRunning(true);
        self.StartTimerCountdownIntervalTimer();
        self.IsHeating(true);
        self.BottomDisplayIsBlinking(false);

        self.Log('Timer Restarted');
    };

    self.ResetTimer = function () {
        //Clear the timer values and the js timer
        self.SetDefaults_Timer();

        //Stop the self.ClearTimerCountdownTimer() if needed
        self.ClearTimerCountdownTimer();
        self.BottomDisplayIsBlinking(false);
        self.TimerRunning(false);
        self.TimerComplete(false);

        self.Log('Timer Reset');
    };

    self.SetTimerComplete = function () {
        self.TimerComplete(true);

        //When the set Cooking Time is completed, alarm will sound and Lower Display flashes
        self.ClearTimerCountdownTimer();
        self.BottomDisplayIsBlinking(true);

        self.TimerRunning(false);

        //TODO - Alarm
    };

    self.CancelTimerComplete = function () {
        //Press ‘Timer-Start/Stop’ key to cancel alarm, oven will continue cooking at Oven Set Temperature. 
        //Display will revert to Set Temperature and Time
        self.ResetTimer();
    };

    //*** Timer Section - End


    //*** Core Probe Section - Start

    self.ConnectCoreProbe = function () {
        self.CoreProbeConnected(true);
        self.CoreTemperatureCookingStarted(false);
        self.TargetCoreTemperatureSet(false);

        //Configure for core temp operation
        self.BottomDisplayFunction(self.CoreProbeDisplayValue);
        self.Timer_MinusClickFunction(self.DecreaseTargetCoreTemperature);
        self.Timer_PlusClickFunction(self.IncreaseTargetCoreTemperature);

        self.TimerButtonDownFunction(function () { }); //Just stub this
        self.TimerButtonUpFunction(self.StartCoreProbeCooking);
        self.LightOn_TimerFunction(function () { return self.CoreTemperatureCookingStarted(); });

        self.TempButtonUpFunction(self.ToggleCoreTemperatureDisplay);
    };

    self.DisconnectCoreProbe = function () {
        self.CoreProbeConnected(false);
        self.CoreTemperatureCookingStarted(false);

        //Reset
        self.TempButtonUpFunction(self.ToggleTempDisplay());
        self.SetDefaults_TimerUi();
    };

    self.DecreaseTargetCoreTemperature = function () {
        self.SetTargetCoreTemperature(self.TargetCoreTemperature() - 1);
        //self.IsHeating(true);
    };

    self.IncreaseTargetCoreTemperature = function () {
        self.SetTargetCoreTemperature(self.TargetCoreTemperature() + 1);
        //self.IsHeating(true);
    };

    self.SetTargetCoreTemperature = function (newValue) {
        var originalTargetCoreTemperatureSet = self.TargetCoreTemperatureSet();

        self.TargetCoreTemperatureSet(true); //The value has been changed

        //Start with the blinking if TargetCoreTemperatureSet has changed
        if (originalTargetCoreTemperatureSet != self.TargetCoreTemperatureSet())
            self.StartCoreTemperatureModeBlinkIntervalTimer();

        if (newValue >= self.MaxTargetCoreTemperature) //Ensure that we do not go above our max target
        {
            self.TargetCoreTemperature(self.MaxTargetCoreTemperature);
            return;
        }
        else if (newValue <= self.MinTargetCoreTemperature) //Ensure that we do not go below min target
        {
            self.TargetCoreTemperature(self.MinTargetCoreTemperature);
            return;
        }

        self.TargetCoreTemperature(newValue);
    };

    self.StartCoreProbeCooking = function () {
        self.CoreTemperatureCookingStarted(true);
        self.IsHeating(true);

        //When Core Probe Set Temperature is reached, an alarm will sound and the Lower Display will flash.
        //- Press ‘Timer-Start/Stop’ key to cancel alarm, oven will continue cooking at Oven Set Temperature. Display will show Oven
        //Set Temperature and Core Probe Set Temperature
    };

    self.CoreProbeCookingComplete = function () {
        //When Core Probe Set Temperature is reached, an alarm will sound and the Lower Display will flash.

    };

    self.CoreProbeCookingReset = function () {
        //- Press ‘Timer-Start/Stop’ key to cancel alarm, oven will continue cooking at Oven Set Temperature. Display will show Oven
        //Set Temperature and Core Probe Set Temperature.
    };

    self.ToggleCoreTemperatureDisplay = function () {
        var currentValue = self.DisplayingActualCoreTemperature();

        if (currentValue)
            self.StopDisplayingActualCoreTemperature();
        else
            self.StartDisplayingActualCoreTemperature();
    }

    self.StartDisplayingActualCoreTemperature = function () {
        //Stop the temp display timers
        self.StartCoreTemperatureDisplayIntervalTimer();
        self.DisplayingActualCoreTemperature(true);
    };

    self.StopDisplayingActualCoreTemperature = function () {
        //Stop the temp display timers
        self.ClearCoreTemperatureDisplayTimer();
        self.DisplayingActualCoreTemperature(false);
    };

    //*** Core Probe Section - End

    //Sounds
    self.Beep = function () {
        if (!self.SoundEnabled === true) return; //Sound will not work in tests

        var soundFile = document.getElementById("beepControl");

        soundFile.load();
        soundFile.play();
    };
}
