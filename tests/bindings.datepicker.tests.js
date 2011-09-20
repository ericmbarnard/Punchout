module("datePicker tests");

test("datepicker returns given date", function () {
    var date = new Date();

    window.viewModel = {
        myDate: ko.observable(date)
    };

    ko.applyBindings(viewModel, document.getElementById('date-picker-test-container'));

    var test = $('#theTest').datepicker("getDate");

    equal(test.toDateString(), date.toDateString(), "ko date matches datepicker date");
});

test("datepicker updates to passed date", function () {
    var date = new Date("11-5-2011");

    window.viewModel = {
        myDate: ko.observable(date)
    };

    ko.applyBindings(viewModel, document.getElementById('date-picker-test-container'));

    viewModel.myDate(new Date());

    var test = $('#theTest').datepicker("getDate");

    equal(test.toDateString(), viewModel.myDate().toDateString(), "ko date matches datepicker date");
});

test("setting datepicker date updates viewModel", function () {
    var date = new Date("11-5-2011");

    window.viewModel = {
        myDate: ko.observable(date)
    };

    ko.applyBindings(viewModel, document.getElementById('date-picker-test-container'));

    var test = new Date();


    $('#theTest').datepicker("show");

    $('#theTest').datepicker("setDate", test);

    $('#theTest').datepicker("hide");

    equal(test.toDateString(), viewModel.myDate().toDateString(), "ko date matches datepicker date");
});