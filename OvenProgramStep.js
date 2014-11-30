/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function OvenProgramStep() {
    var self = this;

    self.Temperature = ko.observable();
    self.DurationSeconds = ko.observable();
    self.MoistureMode = ko.observable(); //1-5

    return self;
}