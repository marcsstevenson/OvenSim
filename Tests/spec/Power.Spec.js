
/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js"/>
/// <reference path="../../OvenViewModel.js" />

describe("Oven", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
    });

    it("The oven shall have 20 programs to use", function () {
        expect(ovenViewModel.OvenPrograms().length).toEqual(20);
    });
    
    describe("when TurnOvenOn", function () {
        beforeEach(function () {
            ovenViewModel.TurnOvenOn();
        });

        it("OvenIsOn shall be true", function () {
            expect(ovenViewModel.OvenIsOn()).toEqual(true);
        });

        it("Top Display shall be the default target temperature", function () {
            var topDisplayValue = ovenViewModel.TopDisplayFunction()();

            expect(topDisplayValue).toEqual(ovenViewModel.DefaultTargetTemperature);
        });

        it("Bottom Display shall be the default target temperature", function () {
            var topDisplayValue = ovenViewModel.TopDisplayFunction()();

            expect(topDisplayValue).toEqual(ovenViewModel.DefaultTargetTemperature);
        });
    });
});

