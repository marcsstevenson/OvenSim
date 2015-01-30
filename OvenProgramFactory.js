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

        ovenProgram.Name(index + 1);
        ovenProgram.Index(index);

        //Default to 3 steps for now
        for (var i = 0; i < 3; i++) {
            ovenProgram.AddOvenProgramStep(self.BuildEmptyOvenProgramStep(i));
        }

        return ovenProgram;
    };

    self.BuildEmptyOvenProgramStep = function (index) {
        var ovenProgramStep = new OvenProgramStep();
        
        ovenProgramStep.Name(index + 1);
        ovenProgramStep.Index(index);

        //TODO
        ovenProgramStep.Temperature = ko.observable();
        ovenProgramStep.DurationSeconds = ko.observable();
        ovenProgramStep.MoistureMode = ko.observable(); //1-5

        return ovenProgramStep;
    };

    return self;
}
