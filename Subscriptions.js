/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />

function Subscriptions(self) {
    //Status Subscriptions
    self.OvenIsOn.subscribe(function () {
        self.Log("OvenIsOn: " + self.OvenIsOn());
    });

    self.LightIsOn.subscribe(function () {
        self.Log("LightIsOn: " + self.LightIsOn());
    });

    self.MoistureModeOn.subscribe(function () {
        self.Log("MoistureModeOn: " + self.MoistureModeOn());
    });

    self.CurrentMoistureMode.subscribe(function () {
        self.Log("CurrentMoistureMode: " + self.CurrentMoistureMode());
    });

    self.DisplayingMoistureSetup.subscribe(function () {
        self.Log("DisplayingMoistureSetup: " + self.DisplayingMoistureSetup());
    });
    
    self.IsManualMode.subscribe(function () {
        self.Log("IsManualMode: " + self.IsManualMode());
    });

    self.IsCooking.subscribe(function () {
        self.Log("IsCooking: " + self.IsCooking());
    });

    self.SteamShooting.subscribe(function () {
        self.Log("SteamShooting: " + self.SteamShooting());
    });

    self.IsHeating.subscribe(function () {
        self.Log("IsHeating: " + self.IsHeating());
    });

    self.CoreTemperatureCookingStarted.subscribe(function () {
        self.Log("CoreTemperatureCookingStarted: " + self.CoreTemperatureCookingStarted());
    });
}