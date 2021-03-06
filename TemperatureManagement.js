/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />
/// <reference path="Lib/knockout-3.1.0.js" />

function TemperatureManagement(self) {

    //*** Temperature Setting - Start
    //  This is the actual temperature

    self.IncreaseTemperatureFromHeating = function () {
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
            self.ClearHeatingTimer(); //We may as well turn off the timer
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

    self.TargetTemperature = ko.computed(function () {
        return self.DisplayingProgramStage().TargetTemperature();
    });

    self.AtTargetTemperature = ko.computed(function () {
        //If the actual temperature is the same as the target temperature
        var atTargetTemperature = self.ActualTemperature() >= self.TargetTemperature();

        if (atTargetTemperature) self.Log("At target temperature");

        return atTargetTemperature;
    });

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
            //self.ClearTimer(); //We may as well turn off the timer
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

    self.AtTargetCoreTemperature = ko.computed(function () {
        //If the actual temperature is the same as the target core temperature
        var atTargetCoreTemperature = self.ActualCoreTemperature() >= self.DisplayingProgramStage().TargetCoreTemperature();

        if (atTargetCoreTemperature) self.Log("At target core temperature");

        return atTargetCoreTemperature;
    });

    //*** CoreTemperature Setting - End

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
}
