/// <reference path="Lib/knockout-3.1.0.js" />

function OvenProgramStep() {
    var self = this;

    self.Name = ko.observable();
    self.Index = ko.observable();
    self.Temperature = ko.observable();
    self.DurationSeconds = ko.observable();
    self.MoistureMode = ko.observable(); //1-5

    return self;
}