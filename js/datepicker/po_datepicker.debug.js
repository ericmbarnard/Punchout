/// <reference path="../../lib/jquery-1.6.js" />
/// <reference path="../../lib/knockout-1.2.1.js" />
/// <reference path="../../lib/jquery.tmpl.js" />
/// <reference path="../../lib/jquery-ui.js" />

(function () {
    ko.bindingHandlers['date'] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            // This will be called when the binding is first applied to an element
            var allBindings, options, valToUpdate, options = { defaultDate: new Date() };

            valToUpdate = valueAccessor();

            allBindings = allBindingsAccessor();
            if (allBindings['dateOptions']) {
                options = allBindings['dateOptions'];

            }

            if (ko.isObservable(valToUpdate)) {
                var changeHandler = function (dateText, picker) {
                    if (dateText) {
                        valToUpdate(new Date(dateText));
                    }
                    return true;
                };
                options.onClose = changeHandler;
            }

            $(element).datepicker(options);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            // This will be called once when the binding is first applied to an element,
            var dateval = ko.utils.unwrapObservable(valueAccessor());
            $(element).datepicker("setDate", dateval);
        }
    };
})();