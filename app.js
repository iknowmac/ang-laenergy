(function(){

    var app = angular.module('city-data', ['ngResource','ngRoute']);
    
    app.factory('Energy', function ($resource) {
        return $resource("https://data.lacity.org/api/views/rijp-9dwj/rows.json");
    });
    
    app.factory('Water', function ($resource) {
        return $resource("https://data.lacity.org/api/views/hu2j-wciz/rows.json");
    });
    
    app.controller("EnergyCtrl", ['$scope','Energy',function($scope, Energy) {
        $scope.sortType         = 'zip';  // set the default sort type
        $scope.sortReverse      = false;        // set the default sort order
        $scope.searchOrders     = '';           // set the default search/filter term
        Energy.get(function(data) {
            $scope.data = data.data;
            $scope.meta = data.meta;
        });
    }]);
    
    app.controller("WaterCtrl", ['$scope','Water',function($scope, Water) {
        $scope.sortType         = 'zip';  // set the default sort type
        $scope.sortReverse      = false;        // set the default sort order
        $scope.searchOrders     = '';           // set the default search/filter term
        Water.get(function(data) {
            $scope.data = data.data;
            $scope.meta = data.meta;
        });
    }]);
    
    $.plot(
        $("#placeholder"),
        [ [[1, 3],[2, 14.01],[3.5, 3.14]] ],
        { yaxis: { max: 15 }, xaxis: { max: 15 } }
    );
    
    var offset = 0;
    plot();
    function plot() {
        var sin = [],
            cos = [];
        for (var i = 0; i < 12; i += 0.2) {
            sin.push([i, Math.sin(i + offset)]);
            cos.push([i, Math.cos(i + offset)]);
        }

        var options = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            grid: {
                hoverable: true //IMPORTANT! this is needed for tooltip to work
            },
            yaxis: {
                min: -1.2,
                max: 1.2
            },
            tooltip: true,
            tooltipOpts: {
                content: "'%s' of %x.1 is %y.4",
                shifts: {
                    x: -60,
                    y: 25
                }
            }
        };

        var plotObj = $.plot($("#flot-line-chart"), [{
                data: sin,
                label: "sin(x)"
            }, {
                data: cos,
                label: "cos(x)"
            }],
            options);
    }
    
})();


