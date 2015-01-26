/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="OvenProgram.js" />
/// <reference path="OvenProgramStep.js" />

function OvenProgramFactory() {
    var self = this;

    self.BuildEmptyOvenPrograms = function () {
        var ovenPrograms = [];

        //Default to 30 oven programs for now
        for (var i = 0; i < 20; i++) {
            ovenPrograms.push(self.BuildEmptyOvenProgram(i));
        }

        return ovenPrograms;
    };

    self.BuildEmptyOvenProgram = function (index) {
        var ovenProgram = new OvenProgram();

        var name = 'P';
        if (index <= 9) name += '0';
        name += index + 1;

        ovenProgram.Name(name);
        ovenProgram.Index(index);

        //Default to 3 steps for now
        for (var i = 0; i < 3; i++) {
            ovenProgram.AddOvenProgramStep(self.BuildEmptyOvenProgramStep(i));
        }

        return ovenProgram;
    };

    self.BuildEmptyOvenProgramStep = function (index) {
        var ovenProgramStep = new OvenProgramStep();

        var ovenProgramStepName = '';
        if (index <= 9) ovenProgramStepName += '0';
        ovenProgramStepName += index + 1;

        ovenProgramStep.Name(ovenProgramStepName);
        ovenProgramStep.Index(index);

        //TODO
        ovenProgramStep.Temperature = ko.observable();
        ovenProgramStep.DurationSeconds = ko.observable();
        ovenProgramStep.MoistureMode = ko.observable(); //1-5

        return ovenProgramStep;
    };

    return self;
}
