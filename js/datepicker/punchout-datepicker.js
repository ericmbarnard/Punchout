/// <reference path="../../lib/jquery-1.6.js" />
/// <reference path="../../lib/knockout-1.2.1.js" />
/// <reference path="../../lib/jquery.tmpl.js" />
/// <reference path="../../lib/jquery-ui.js" />

(function () {
    ko.bindingHandlers['date'] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            // This will be called when the binding is first applied to an element
            var allBindings, valToUpdate, options = { defaultDate: new Date() };
            var $picker = $(element).datepicker(options);

            valToUpdate = valueAccessor();

            allBindings = allBindingsAccessor();
            if (allBindings['dateOptions']) {
                options = allBindings['dateOptions'];
            }

            //handle field changing
            ko.utils.registerEventHandler(element, "change", function(){
                 valToUpdate($(element).datepicker("getDate"));
            });
            
            //handle disposal (if KO removes by the template binding)
            ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                $(element).datepicker("destroy");
            });            
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            // This will be called once when the binding is first applied to an element,
            var dateval = ko.utils.unwrapObservable(valueAccessor());
            $(element).datepicker("setDate", dateval);
        }
    };
})();