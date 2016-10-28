(function(){

    const energy_url = 'https://data.lacity.org/api/views/rijp-9dwj/rows.json';
    const water_url = 'https://data.lacity.org/api/views/hu2j-wciz/rows.json';

    let app = angular.module(
      'city-data',
      ['ngResource','ngRoute','angular.morris-chart']
    );

    app.factory('Energy', ($resource) => {
        return $resource(energy_url);
    });

    app.factory('Water', ($resource) => {
        return $resource(water_url);
    });

    app.controller('EnergyCtrl', ['$scope','$timeout','Energy',($scope, $timeout, Energy) => {
      $scope.sortType = 'zip';
      $scope.sortReverse = false;
      $scope.searchOrders = '';

      Energy.get(function(data) {
        $scope.metaData = data.meta;
        $scope.chartData = getChartData(data);
        $scope.tableColumns = getCollums(data);
        $scope.tableData = getEnergyData(data);
      });

    }]);

    app.controller('WaterCtrl', ['$scope','Water',($scope, Water) => {
      $scope.sortType = 'zip';
      $scope.sortReverse = false;
      $scope.searchOrders = '';

      Water.get(function(data) {
        $scope.data = data.data;
        $scope.meta = data.meta;
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
