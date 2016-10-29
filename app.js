(function(){

    const energy_url = 'https://data.lacity.org/api/views/rijp-9dwj/rows.json';
    const water_url = 'https://data.lacity.org/api/views/hu2j-wciz/rows.json';

    let app = angular.module('city-data',
      ['ngResource','ngRoute','ui.router','angular.morris-chart']
    );

    app.config(function($stateProvider, $urlRouterProvider) {

      $urlRouterProvider.otherwise('/home');

      $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
        })
        .state('energy', {
          url: '/energy',
          templateUrl: 'partials/energy.html',
          controller: 'EnergyCtrl',
        })
        .state('water', {
          url: '/water',
          templateUrl: 'partials/water.html',
          controller: 'WaterCtrl',
        });

    });

    app.factory('Energy', function($resource) {
        return $resource(energy_url);
    });

    app.factory('Water', function($resource) {
        return $resource(water_url);
    });

    app.controller('EnergyCtrl', ['$scope','Energy',function($scope, Energy) {

      Energy.get(function(data) {
        $scope.metaData = data.meta;
        $scope.chartData = getChartData(data);
        $scope.tableColumns = getCollums(data);
        $scope.tableData = getEnergyData(data);
      });

    }]);

    app.controller('WaterCtrl', ['$scope','Water',function($scope, Water) {

      Water.get(function(data) {
        $scope.meta = data.meta;
        $scope.data = data.data;
      });

    }]);

})();

getCollums = (data) => {
  let columns = data.meta.view.columns.slice(8,16);
  const cols = columns.map((col) => {
    return {name: col.name}
  });
  columns.unshift({'name': 'zip codes'});
  return columns;
}

getEnergyData = (data) => {
  return data.data.map((record) => {
    return {
      data: record.slice(8,16),
      zip: record[16][0].slice(42,47),
    }
  });
}

getChartData = (data) => {
  let columns = data.meta.view.columns.slice(8,16);
  return columns.map((col) => {
    return {
      label: col.name,
      low: Math.round(col.cachedContents.smallest),
      average: Math.round(col.cachedContents.average),
      high: Math.round(col.cachedContents.largest)
    }
  });
}
