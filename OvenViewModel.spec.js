
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js" />
/// <reference path="//cdnjs.cloudflare.com/ajax/libs/jasmine/2.0.0/jasmine.js"/>

describe("PlanSchoolStudentGroups", function() {

    beforeEach(function (done) {
        planSetupModel = new PlanSetupData().Get();

        curriculumSetup = new CurriculumSetup(planSetupModel.PlanCurriculumModels, [0, 1]); //"LearningAreas", "Levels"
        planSchoolStudentGroupManager = new PlanSchoolStudentGroupManager(new PlanSchoolStudentGroupServiceMock(), planSetupModel);

        planSchoolStudentGroupManager.SetParentCurriculumSetup(curriculumSetup);
        planSchoolStudentGroupManager.SetPlanId(planId);

        done();
    });

    describe("after construction and setting plan Id", function () {
        it("PlanSchoolStudentGroupsByTypes shall be populated", function () {
            expect(planSchoolStudentGroupManager.PlanSchoolStudentGroupsByTypes().length).toBeGreaterThan(0);
        });

        it("each PlanSchoolStudentGroupsByType shall have PlanSchoolStudentGroupDetails populated", function () {
            for (var i = 0; i < planSchoolStudentGroupManager.PlanSchoolStudentGroupsByTypes().length ; i++) {
                expect(planSchoolStudentGroupManager.PlanSchoolStudentGroupsByTypes()[i].PlanSchoolStudentGroupDetails().length).toBeGreaterThan(0);
            }
        });

        it("all PlanningCategoryFilter.CurriculumFilter shall be populated", function () {
            var allPlanningCategoryFilters = planSchoolStudentGroupManager.CurriculumSetup().GetAllPlanningCategoryFilters();

            for (var i = 0; i < allPlanningCategoryFilters.length ; i++) {
                expect(allPlanningCategoryFilters[i].CurriculumFilter()).not.toBeNull();
            }
        });

        it("getting squares group shall not be null", function () {
            var squares = self.GetPlanSchoolStudentGroupDetail(squaresId);

            expect(squares).not.toBeNull();
        });
    });

});