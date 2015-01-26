/// <reference path="Lib/knockout-3.1.0.js" />

function OvenProgram() {
    var self = this;

    self.Name = ko.observable();
    self.Index = ko.observable();
    self.OvenProgramSteps = ko.observableArray();

    self.AddOvenProgramStep = function (ovenProgramStep) {
        self.OvenProgramSteps.push(ovenProgramStep);
    };

    return self;
}
