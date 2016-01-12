(function(){

    var app = angular.module('city-data', ['ngResource','ngRoute','angular.morris-chart']);
    
    app.factory('Energy', function ($resource) {
        return $resource("https://data.lacity.org/api/views/rijp-9dwj/rows.json");
    });
    
    app.factory('Water', function ($resource) {
        return $resource("https://data.lacity.org/api/views/hu2j-wciz/rows.json");
    });
    
    app.controller("EnergyCtrl", ['$scope','$timeout','Energy',function($scope, $timeout, Energy) {
        
        $scope.sortType     = 'zip';    // set the default sort type
        $scope.sortReverse  = false;    // set the default sort order
        $scope.searchOrders = '';       // set the default search/filter term
        
        Energy.get(function(data) {
            
            aSet=[],bSet=[],dataSet=[],columnSet=[];
            for (var i=0; i < data.data.length; i++){
                bSet.push(data.data[i].slice(8,16));
                aSet.push(data.data[i][16][0].slice(42,47));
                dataSet.push({zip:aSet[i],data:bSet[i]});
            } // Pull out only the data needed fro the dataSet.
            
            for (var i=0; i < data.meta.view.columns.slice(8,16).length; i++){
                columnSet.push({name: data.meta.view.columns.slice(8,16)[i].name});
            } // Pull out only the column headers needed for the dataSet.
            columnSet.unshift({"name":"Zip Codes"}); // Prepend the "Zip Codes" header.
            
            chartData=[]
            for (var i=0; i < data.meta.view.columns.slice(8,16).length; i++){
                col=data.meta.view.columns.slice(8,16)[i];
                chartData.push({
                    label: col.name,
                    low: Math.round(col.cachedContents.smallest),
                    average: Math.round(col.cachedContents.average),
                    high: Math.round(col.cachedContents.largest)
                });
            } // Need to present the chart data in a different format for Morris.
            
            // Still need some work here and above on the chart timing issues.
            $timeout(function () {
                $scope.chartData = chartData;
            }, 3000);
            
            $scope.metaData         = data.meta;
            $scope.tableColumns     = columnSet;
            $scope.tableData        = dataSet;
                        
        });
        
    }]);

    app.controller("WaterCtrl", ['$scope','Water',function($scope, Water) {
        $scope.sortType         = 'zip';    // set the default sort type
        $scope.sortReverse      = false;    // set the default sort order
        $scope.searchOrders     = '';       // set the default search/filter term
        Water.get(function(data) {
            $scope.data = data.data;
            $scope.meta = data.meta;
        });
    }]);
    
})();


