/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />
/// <reference path="Lib/knockout-3.1.0.js" />

function TimerManagement(self) {

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

    //We call this when the timer is running and hits its next tick
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

    //We call this when the timer has ticked down to 0 seconds
    self.SetTimerComplete = function () {
        //If we are running a program stage then
        //  try to move to the next stage of the program. If there is no next stage then we are done.
        //  If we are in manual mode (not running a program) then we are done.
        
        //Are we running a program? If so, does the program have a next step?
        if (!self.IsManualMode() && self.HasNextProgramStage()) {
            //Move to the next programming stage
            self.DisplayNextProgramStage();

            //Reset and start the timer
            self.ResetTimer();

            self.StartRunningProgram();

            return;
        }

        self.TimerComplete(true);

        //When the set Cooking Time is completed, alarm will sound and Lower Display flashes
        self.ClearTimerCountdownTimer();
        self.BottomDisplayIsBlinking(true);

        self.TimerRunning(false);

        self.StartAlarm();
    };

    self.CancelTimerComplete = function () {
        //Press ‘Timer-Start/Stop’ key to cancel alarm, oven will continue cooking at Oven Set Temperature. 
        //Display will revert to Set Temperature and Time
        self.ResetTimer();
    };
}
