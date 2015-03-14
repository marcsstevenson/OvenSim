/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Timers.js" />
/// <reference path="StatusProperties.js" />
/// <reference path="UserInterface.js" />
/// <reference path="Subscriptions.js" />
/// <reference path="OvenManager.js" />

window.OvenScripts = (function () {
    //function OvenScripts() {
    return {
        SetProgram1_1TempToCP: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgrammingShortClick();

            //Edit Program
            ovenViewModel.ProgrammingLongClick();

            //Edit Temp on 1.1
            ovenViewModel.ProgrammingShortClick();

            //Edit time on 1.1
            ovenViewModel.ProgrammingShortClick();

            //Set time to INF
            ovenViewModel.btnTimer_MinusClick(); //Decrease the timer

            //Set time to CP
            ovenViewModel.btnTimer_MinusClick(); //Decrease the timer
        },
        SetProgram1To150DegreesAnd5MinutesThenBackToHome: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgrammingShortClick();

            //Edit Program
            ovenViewModel.ProgrammingLongClick();

            //Edit Temp on 1.1
            ovenViewModel.ProgrammingShortClick();

            //Edit time on 1.1
            ovenViewModel.ProgrammingShortClick();

            for (var i = 0; i < 5; i++) {
                ovenViewModel.btnTimer_PlusClick(); //Increase the timer
            }

            //Back to display 1.1
            for (var k = 0; k < 4; k++) {
                ovenViewModel.ProgrammingShortClick(); //Increase the timer
            }

            //Display program
            ovenViewModel.ProgrammingLongClick();

            //Display home
            ovenViewModel.ProgrammingShortClick();
        },
        DisplayProgram1AndSetActualTemperatureToReady: function (ovenViewModel) {
            //Display program
            ovenViewModel.ProgrammingShortClick();
            ovenViewModel.SetTemperature(1000); //This just needs to be greater than the target
        },
        StartAlarm: function (ovenViewModel) {
            ovenViewModel.StartAlarm();
        },
        StopAlarm: function (ovenViewModel) {
            ovenViewModel.StopAlarm();
        }
    }
}());