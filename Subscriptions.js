/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function Subscriptions(self) {
    //Status Subscriptions
    self.OvenIsOn.subscribe(function () {
        console.log("OvenIsOn: " + self.OvenIsOn());
    });

    self.LightIsOn.subscribe(function () {
        console.log("LightIsOn: " + self.LightIsOn());
    });
}