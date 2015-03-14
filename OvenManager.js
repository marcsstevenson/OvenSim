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

            self.StartPreheating();

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
            self.Timer_MinusClickFunction(function() {
                self.EditingOvenProgram().SetProgramStageOff(self.EditingOvenProgramStageIndex());
            });
            self.Timer_PlusClickFunction(function () {
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
            self.TopDisplayFunction(self.TargetTemperatureDisplayValue);
            self.TopDisplayIsBlinking(false);
            self.Temp_MinusClickFunction(null);
            self.Temp_PlusClickFunction(null);

            //Bottom display is Target Core Temperature - blinking
            //Timer +/- adjusts Target Core Temperature
            self.BottomDisplayFunction(function () {
                return String(self.DisplayingProgramStage().TargetCoreTemperature());
            });
            self.BottomDisplayIsBlinking(true);
            self.Timer_MinusClickFunction(function () {
                self.DisplayingProgramStage().DecreaseTargetCoreTemperature();
            });
            self.Timer_PlusClickFunction(function () {
                self.DisplayingProgramStage().IncreaseTargetCoreTemperature();
            });
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
        
        if (newIndex > self.EditingOvenProgram().OvenProgramStages().length - 1) return; //It doesn't loop
        if (newIndex > lastOnProgramStage.Index() + 1) return; //We cannot move one past the last on stage

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

    self.IncreaseTemperatureFromHeating = function(){
        var delta = self.OvenIsOn() ? 0.1 : -0.05;

        //Cater to time dilation
        delta = delta * self.TimeDilation();

        self.SetTemperature(self.ActualTemperature() + delta);
    };

    self.SetTemperature = function (newValue) {
        if (self.OvenIsOn() && newValue >= self.TargetTemperatureDisplayValue()) //Ensure that we do not go above our target
        {
            //We are at target temperature
            self.ActualTemperature(self.TargetTemperatureDisplayValue());

            if (self.IsPreheating()) self.PreheatingComplete();

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

        if (self.DisplayingProgramStage().IsManualModeStep())
            self.EnsureHeating();
    };

    self.DecreaseTargetTemperature = function () {
        self.DisplayingProgramStage().DecreaseTargetTemperature();

        if (self.DisplayingProgramStage().IsManualModeStep())
            self.EnsureHeating();
    };

    self.EnsureHeating = function () {
        if (self.IsHeating()) return; //There is no need to continue

        self.IsHeating(true);

        //Start the heating timer if needed
        self.StartIntervalHeatingTimer();
    };

    //*** Temperature Setting - End

    //*** CoreTemperature Setting - Start

    self.IncreaseCoreTemperatureFromHeating = function () {
        if (!self.CoreProbeConnected()) return;

        var delta = self.OvenIsOn() ? 0.1 : -0.05;

        //Cater to time dilation
        delta = delta * self.TimeDilation();

        self.SetCoreTemperature(self.ActualCoreTemperature() + delta);
    };

    //  This is the actual core temperature
    self.SetCoreTemperature = function (newValue) {
        if (self.OvenIsOn() && newValue >= self.TargetCoreTemperatureDisplayValue()) //Ensure that we do not go above our target
        {
            //We are at target core temperature
            self.ActualCoreTemperature(self.TargetCoreTemperatureDisplayValue());

            if (self.IsPreheating()) self.PreheatingComplete();

            return;
        }
        else if (!self.OvenIsOn() && newValue <= self.StartCoreTemperature) //Ensure that we do not go below ambient
        {
            self.ClearTimer(); //We may as well turn off the timer
            self.ActualCoreTemperature(self.StartCoreTemperature);

            return;
        }

        self.ActualCoreTemperature(newValue);
    };

    self.IncreaseTargetCoreTemperature = function () {
        self.DisplayingProgramStage().IncreaseTargetCoreTemperature();

        if (self.DisplayingProgramStage().IsManualModeStep())
            self.EnsureHeating();
    };

    self.DecreaseTargetCoreTemperature = function () {
        self.DisplayingProgramStage().DecreaseTargetCoreTemperature();

        if (self.DisplayingProgramStage().IsManualModeStep())
            self.EnsureHeating();
    };

    //*** CoreTemperature Setting - End

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
        //If running timer then start the long click timer
        if (self.TimerStarted())
            self.StartTimerLongClickIntervalTimer();
        else
            self.TimerShortClick();
    };

    self.TimerUp = function () {
        if (!self.IsWaitingForTimerLongClickInterval()) return; //Don't care

        //The long click was not completed - make it a short click and reset the long click timer

        self.ClearTimerLongClickTimer(); //Stop the reset timer
        self.IsWaitingForTimerLongClickInterval(false); //Always reset this

        self.TimerShortClick();
    };

    self.TimerShortClick = function () {
        //If timer complete then cancel alarm
        if (self.TimerComplete()) {
            self.CancelTimerComplete();
            return;
        }

        //If not running timer then start timer
        if (self.TimerStarted())
            //Toggle the running of the timer
            self.ToggleTimer();
        else
            self.StartTimer();
    };

    self.TimerLongClick = function () {
        //Reset the timer if started
        if (self.TimerStarted()) self.ResetTimer();
    };
    
    self.StartTimer = function () {
        if (self.DisplayingProgramStage().TimerStartValue() === 0) return; //Nothing to do

        var duration;

        if (self.DisplayingProgramStage().TimerStartValue() <= -1) {
            //Count down
            self.TimerDirectionUp(true); //Up

            //Set the duration to run
            duration = moment.duration(0, 'minutes');
            self.DisplayingProgramStage().TimerCurrentValue(duration);
        } else {
            //Count up
            self.TimerDirectionUp(false); //Down

            //Set the duration to run
            duration = moment.duration(self.DisplayingProgramStage().TimerStartValue(), 'minutes');

            self.DisplayingProgramStage().TimerCurrentValue(duration);
        }

        self.TimerStarted(true);
        self.TimerRunning(true);
        self.EnsureHeating();

        self.TimerComplete(false);

        self.StartTimerCountdownIntervalTimer();
        self.Log('Timer Started');
    };

    self.StartPreheating = function() {
        //Lower Display will show PrH, oven is ‘Pre-Heating’.
        //Program cannot be started until pre-heating is completed.
        self.EnsureHeating();
        self.IsPreheating(true);

        self.BottomDisplayFunction(function() {
            return 'PrH';
        });
    };

    self.PreheatingComplete = function () {
        //Lower Display will show rdY when oven is up to pre-heat temperature and an
        //alarm will sound. The Program can now be started
        self.IsPreheating(false);

        self.BottomDisplayFunction(function () {
            return 'rdY';
        });

        self.StartAlarm();
    };

    self.SetTimerTimerNextValue = function () {
        var timerCurrentValue = self.DisplayingProgramStage().TimerCurrentValue();

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

        self.DisplayingProgramStage().TimerCurrentValue(timerCurrentValue);
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
        self.TimerButtonIsBlinking(true);

        self.Log('Timer Paused');
    };

    self.RestartTimer = function () {
        self.TimerRunning(true);
        self.StartTimerCountdownIntervalTimer();
        self.IsHeating(true);
        self.TimerButtonIsBlinking(false);

        self.Log('Timer Restarted');
    };

    self.ResetTimer = function () {
        //Stop the timer count down if it is running
        //Set the timer back to what it was when we started the timer

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
        self.SetTargetCoreTemperature(self.DisplayingProgramStage().TargetCoreTemperature() - 1);
    };

    self.IncreaseTargetCoreTemperature = function () {
        self.SetTargetCoreTemperature(self.DisplayingProgramStage().TargetCoreTemperature() + 1);
    };

    self.SetTargetCoreTemperature = function (newValue) {
        var originalTargetCoreTemperatureSet = self.DisplayingProgramStage().TargetCoreTemperatureSet();

        console.clear();
        console.log(self.DisplayingProgramStage().TargetCoreTemperature());

        self.DisplayingProgramStage().SetTargetCoreTemperature(newValue);

        console.log(self.DisplayingProgramStage().TargetCoreTemperature());

        //Start with the blinking if TargetCoreTemperatureSet has changed
        if (originalTargetCoreTemperatureSet != self.DisplayingProgramStage().TargetCoreTemperatureSet()) 
            self.StartCoreTemperatureModeBlinkIntervalTimer();
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

    var alarmMasterBlinkOnSubscription;
    self.StartAlarm = function () {
        alarmMasterBlinkOnSubscription = self.MasterBlinkOn.subscribe(function () {
            self.Beep();
        });
    };

    self.StopAlarm = function () {
        //Dispose the subscription that is bringing the beeping
        alarmMasterBlinkOnSubscription.dispose();
    };
}
