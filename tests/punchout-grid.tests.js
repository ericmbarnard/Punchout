module('Punchout Grid Tests');

test('Basic PO Grid Tests', function () {

    var vm = {
        testItems : ko.observableArray([
            { Sku: 'AirZoom', Brand: 'Nike', Price: 10.00, Cost: 5.00, Category: 'Shoes' },
            { Sku: 'RoomZoom', Brand: 'Nike', Price: 15.00, Cost: 5.00, Category: 'Shoes' },
            { Sku: 'AirJordan', Brand: 'Nike', Price: 20.00, Cost: 5.00, Category: 'Shoes' },
            { Sku: 'Beast', Brand: 'Brooks', Price: 30.00, Cost: 5.00, Category: 'Shoes' },
            { Sku: 'Beast2', Brand: 'Brooks', Price: 12.00, Cost: 5.00, Category: 'Shoes' },
            { Sku: 'Adrenaline', Brand: 'Brooks', Price: 60.00, Cost: 5.00, Category: 'Shoes' },
            { Sku: 'MR1024', Brand: 'New Balance', Price: 70.00, Cost: 5.00, Category: 'Kids Shoes' },
            { Sku: 'WR1028', Brand: 'New Balance', Price: 80.00, Cost: 5.00, Category: 'Tough Shoes' },
            { Sku: 'Awesome', Brand: 'New Balance', Price: 85.00, Cost: 5.00, Category: 'Running Shoes' },
            { Sku: 'Test1', Brand: 'New Balance', Price: 200.00, Cost: 5.00, Category: 'Shoes' },
            { Sku: 'test2', Brand: 'New Balance', Price: 25.69, Cost: 5.00, Category: 'Shoes' },
        ])
    };
    
    ko.applyBindings(vm, document.getElementById('gridTest1'));
});