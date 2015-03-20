/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />
/// <reference path="Lib/knockout-3.1.0.js" />

function TimerManagement(self) {

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
        //  try to move to the next stage of the program
        //  if not then - todo


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
