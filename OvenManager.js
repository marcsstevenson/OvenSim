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
    
    self.SetBottomDisplayForProgramDisplay = function () {

        self.TimerButtonDownFunction(self.StartRunningProgram);
        self.TimerButtonUpFunction(null);

        //Lower Display will show PrH, oven is ‘Pre-Heating’.
        //Program cannot be started until pre-heating is completed.
        self.EnsureHeating();
        self.IsPreheating(true);

        self.BottomDisplayFunction(function () {
            return 'PrH';
        });
    };

    self.StartPreheating = function () {
        self.TimerButtonDownFunction(self.StartRunningProgram);
        self.TimerButtonUpFunction(null);

        //Program cannot be started until pre-heating is completed.
        self.EnsureHeating();
        self.IsPreheating(true);

        //self.BottomDisplayFunction(function() {
        //    return 'PrH';
        //});
    };

    self.PreheatingComplete = function () {
        //Alarm will sound if the user is displaying a program. The Program can now be started.
        self.IsPreheating(false);

        //self.BottomDisplayFunction(function () {
        //    return 'rdY';
        //});

        //Sound the alarm if the user is displaying program
        if (self.ProgrammingArea() === 1) //Displaying program
            self.StartAlarm();
    };

    self.StartRunningProgram = function () {
        if (self.AtTargetTemperature()) {
            //Display timer in bottom display
            self.BottomDisplayFunction(self.TimerDisplayValue);

            //Start timer
            self.StartTimer();

            //Set the timer buttons back to normal
            self.SetDefaults_TimerButtons();

            //Restore the bottom display value
            self.BottomDisplayFunction(self.TimerDisplayValue);

            //Stop with the beeping already
            self.StopAlarm();
        } else {
            //Continue heating until rdY
            self.Log('We are not at target temperature');
        }
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
}
