/// <reference path="../../lib/knockout-1.3.0beta.js" />

(function (po, undefined) {
    var poKey = '__po__';

    var utils = (function () {
        var seedId = new Date().getTime();

        return {
            newId: function () {
                return seedId += 1;
            },

            extend: function (target, obj) {
                var len = arguments.length || 0;
                var targ, src, prop;

                len -= 1; // since the length of an array is always 1 more than the actual index of an object...

                //count backwards through the args array and extend each item until we end with the target
                while (len > 0) {
                    targ = arguments[len - 1];  //1
                    src = arguments[len];       //2

                    for (prop in src) {
                        if (src.hasOwnProperty(prop)) {
                            targ[prop] = src[prop];
                        }
                    }
                    //decrement counter
                    len -= 1;
                }
                return targ;
            },
            selectifyArray: function (obsArray) {
                var arr = obsArray() || [];
                var key = poKey + 'selected';

                ko.utils.arrayForEach(arr, function (item) {
                    if (item && !item[key]) {
                        item[key] = ko.observable(false); //not selected by default
                    }
                });

                return arr;
            },
            each: function (obsArray, callBack) {
                var index = 0,
                    items = obsArray() || [],
                    max = items.length || 0,
                    currentItem;
                for (; index < max; index++) {
                    currentItem = items[index];
                    callBack(index, currentItem);
                }
            }

        };
    } ());
    po.utils = utils;

    po.gridCache = {};
    po.defaults = {

    };

    //#region Cell
    po.Cell = function () {
        this.rowIndex;
        this.columnIndex;
        this.row;
        this.column;
        this.data;
        this.element;
    };

    po.Cell.prototype = {
        render: function () {
            var node = document.createElement('DIV');

            //TODO: replace with a proper data-binding and a cell template
            node.innerHTML = this.data; //I'm only doing this for development right now...

            node.style.styleFloat = "left";
            node.style.cssFloat = "left";

            this.element = node;
            return node;
        }
    };

    //#endregion

    //#region Row
    po.Row = function () {
        this.rowIndex; //index of row in grid, zero-based
        this.selected = ko.observable(false);
        this.cells = ko.observableArray([]);
    };

    po.Row.prototype = {
        render: function () {
            var node = document.createElement('DIV');

            utils.each(this.cells, function (i, cell) {
                node.appendChild(cell.render());
            });

            node.style.margin = "5px 5px";
            node.style.display = "block";

            return node;
        }
    };

    //#endregion

    //#region Column
    po.Column = function (propName) {
        this.bindingPropKey = propName;
        this.columnIndex; //index of column in Grid, zero-based
        this.cells = ko.observableArray([]);
        this.headerName;
    };

    //#endregion

    //#region PunchoutGrid
    po.PunchoutGrid = function (element, options) {
        var _this = this;

        this.options = {};
        this.rootElement = element;
        this.rows = ko.observableArray([]);
        this.columns = ko.observableArray([]);

        this.itemSource = ko.observable();
        this.selectedItem = ko.dependentObservable({
            read: function () {

            },
            write: function (val) {

            },
            owner: _this
        });

        this.init = function (options) {
            _this.options = utils.extend(_this.options, po.defaults, options);
            _this.itemSource = _this.options.itemSource;


            //turn the items in to Rows, Cells, and Columns
            if (_this.columns().length === 0) {
                _this.columns(_this.extractColumnBindingsFromObject(_this.itemSource()[0]));
            }
            this.buildTable();
        };

        this.init(options);
    };

    po.PunchoutGrid.prototype = {
        extractColumnBindingsFromObject: function (obj) {
            var prop, columns = [];
            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    columns.push(new po.Column(prop));
                }
            }
            return columns;
        },

        buildTable: function () {
            var currentRowIndex = 0,
                currentColIndex = 0,
                currentRow,
                currentColumn,
                items = this.itemSource(),
                currentItem = null,
                maxRows = items.length || 0,
                cols = this.columns(),
                maxCols = cols.length || 0;


            for (; currentRowIndex < maxRows; currentRowIndex++) {

                currentRow = new po.Row();
                currentRow.rowIndex = currentRowIndex;
                currentItem = items[currentRowIndex];
                currentColIndex = 0;
                this.rows.push(currentRow);

                for (; currentColIndex < maxCols; currentColIndex++) {

                    currentColumn = cols[currentColIndex];
                    currentColumn.columnIndex = currentColIndex;

                    this.addCell(currentRow, currentColumn, currentItem[currentColumn.bindingPropKey]);
                }
            }
        },

        addCell: function (row, column, data) {
            var cell = new po.Cell();
            cell.row = row;
            cell.column = column;
            cell.rowIndex = row.rowIndex;
            cell.columnIndex = column.columnIndex;
            cell.data = data;

            row.cells.push(cell);
            column.cells.push(cell);

            return this; //chaining
        },

        render: function () {
            //TODO: redo this to honor templates...
            var root = this.rootElement,
                currentRowIndex = 0,
                rows = this.rows(),
                maxRows = rows.length || 0,
                currentRow;

            //render all the rows
            //TODO: implement paging and row virtualization

            for (; currentRowIndex < maxRows; currentRowIndex++) {
                currentRow = rows[currentRowIndex];

                root.appendChild(currentRow.render());
            }
        }
    };
    //#endregion

    //#region Binding Handlers

    ko.bindingHandlers['poGrid'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = ko.utils.unwrapObservable(valueAccessor());

            var grid = new po.PunchoutGrid(element, options);

            var newBindingContext = bindingContext.createChildContext(grid);
            grid.render();
            return ko.bindingHandlers['with'].init(element, valueAccessor, allBindingsAccessor, viewModel, newBindingContext);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            //TODO: add the Grid to the bindingContext

            return ko.bindingHandlers['with'].update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        }
    };

    ko.bindingHandlers['poRow'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = ko.utils.unwrapObservable(valueAccessor());

            var grid = new po.PunchoutGrid(element, options);

            //TODO: add the Grid to the bindingContext

            return ko.bindingHandlers['with'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        }
    };

    ko.bindingHandlers['poCell'] = {
        'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

            var options = ko.utils.unwrapObservable(valueAccessor());

            var grid = new po.PunchoutGrid(element, options);

            //TODO: add the Grid to the bindingContext

            return ko.bindingHandlers['with'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        }
    };
    //#endregion

} (window.po = window.po || {}));