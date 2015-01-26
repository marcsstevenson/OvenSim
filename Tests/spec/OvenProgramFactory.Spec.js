/// <reference path="Lib/knockout-3.1.0.js" />
/// <reference path="../lib/jasmine-2.1.3/jasmine.js" />
/// <reference path="../../Lib/jquery-2.1.1.min.js" />
/// <reference path="../../OvenProgramFactory.js" />

describe("OvenProgramFactory", function () {
    var ovenProgramFactory;

    beforeEach(function () {
        ovenProgramFactory = new OvenProgramFactory();
    });

    describe("BuildEmptyOvenPrograms", function () {
        it("shall return 20 programs", function () {
            var emptyOvenPrograms = ovenProgramFactory.BuildEmptyOvenPrograms();
            expect(emptyOvenPrograms.length).toEqual(20);
        });

        it("each program shall have 3 steps", function () {
            var emptyOvenPrograms = ovenProgramFactory.BuildEmptyOvenPrograms();

            for (var i = 0; i < emptyOvenPrograms.length; i++) {
                expect(emptyOvenPrograms.OvenProgramSteps().length).toEqual(3);
            }
        });
    });
});
