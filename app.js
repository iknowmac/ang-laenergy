(function(){

    var app = angular.module('city-data', ['ngResource','ngRoute','angular.morris-chart']);
    
    app.factory('Energy', function ($resource) {
        return $resource("https://data.lacity.org/api/views/rijp-9dwj/rows.json");
    });
    
    app.factory('Water', function ($resource) {
        return $resource("https://data.lacity.org/api/views/hu2j-wciz/rows.json");
    });
    
    app.controller("EnergyCtrl", ['$scope','Energy',function($scope, Energy) {
        $scope.sortType         = 'zip';    // set the default sort type
        $scope.sortReverse      = false;    // set the default sort order
        $scope.searchOrders     = '';       // set the default search/filter term
        Energy.get(function(data) {
            zipSet=[];
            dataSet=[];
            for (var i=0; i < data.data.length; i++){
                dataSet.push(data.data[i].slice(8,16));
                zipSet.push(data.data[i][16][0].slice(42,47));
                dataSet[i].unshift(zipSet[i]);
            }
            
            function toObject(names, values) {
                var result = {};
                for (var i = 0; i < names.length; i++)
                    result[names[i]] = values[i];
                return result;
            }
            
            $scope.columns = data.meta.view.columns.slice(8,16);
            $scope.columns.unshift({"name":"Zip Codes"});
            $scope.data=dataSet;
            $scope.meta=data.meta;
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


