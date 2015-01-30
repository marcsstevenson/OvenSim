/// <reference path="Lib/knockout-3.1.0.js" />

function OvenProgram() {
    var self = this;

    self.Name = ko.observable();
    self.Index = ko.observable();
    self.OvenProgramSteps = ko.observableArray();

    self.GetPName = function() {
        var pName = 'P';
        if (self.Index() < 10) pName += '0';
        pName += self.Name();

        return pName;
    };

    self.AddOvenProgramStep = function (ovenProgramStep) {
        self.OvenProgramSteps.push(ovenProgramStep);
    };

    return self;
}
