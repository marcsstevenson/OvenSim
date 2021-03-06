/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="Lib/moment-2.8.4.min.js" />
/// <reference path="Lib/knockout-3.1.0.js" />

function SoundManagement(self) {

    //Sounds
    self.Beep = function () {
        if (!self.SoundEnabled === true) return; //Sound will not work in tests

        var soundFile = document.getElementById("beepControl");

        soundFile.load();
        soundFile.play();
    };

    var alarmMasterBlinkOnSubscription;

    self.StartAlarm = function () {
        alarmMasterBlinkOnSubscription = self.MasterBlinkOn.subscribe(function () {
            self.Beep();
        });
    };

    self.StopAlarm = function () {
        //Dispose the subscription that is bringing the beeping
        if (alarmMasterBlinkOnSubscription) alarmMasterBlinkOnSubscription.dispose();
    };

}
