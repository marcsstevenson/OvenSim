/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js"/>
/// <reference path="../../OvenViewModel.js" />

describe("ProgramSelection", function () {
    var ovenViewModel;

    beforeEach(function () {
        ovenViewModel = new OvenViewModel();
        ovenViewModel.LogFunction = null;
        ovenViewModel.TurnOvenOn();
    });

    describe("On ProgrammingShortClick", function () {
        beforeEach(function () {
            ovenViewModel.ProgrammingShortClick();
        });

        it("the top display shall be P01", function () {
            var topDisplay = ovenViewModel.TopDisplay();
            expect(topDisplay).toEqual('P01');
        });

        describe("On Temp_PlusClick", function () {

            beforeEach(function () {
                ovenViewModel.btnTemp_PlusClick();
            });

            it("the top display shall be P02", function () {
                var topDisplay = ovenViewModel.TopDisplay();
                expect(topDisplay).toEqual('P02');
            });

            describe("On ProgrammingLongClick", function () {

                beforeEach(function () {
                    ovenViewModel.ProgrammingLongClick();
                });

                it("the top display shall be 2.1", function () {
                    var topDisplay = ovenViewModel.TopDisplay();
                    expect(topDisplay).toEqual('2.1');
                });
            });
        });
    });
});

