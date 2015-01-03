describe("Oven", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
    });

    describe("when TurnOvenOn", function () {
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
