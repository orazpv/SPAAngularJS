var app = angular.module("myApp", ['ngRoute']); //Create a module

//create the Route
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'Views/Home.html',
        controller:'Home'
    }).when('/person/:id', {
        templateUrl: 'Views/personDetail.html',
        controller: 'personDetail'
    }).when('/all/:id', {
        templateUrl: 'Views/all.html',
        controller: 'all'
    }).when('/error', {
        templateUrl: 'Views/error.html'
    }).otherwise({
        templateUrl:'Views/error.html'
    });
});

app.factory('fact',function () {
    return [{ name: "Paul", details: "male" }, { name: "Makr", details: "Female" }]
});

//Home controller
app.controller('Home', function ($scope, fact) {
    $scope.people = fact;
    $scope.test = "hello";
});

app.controller('personDetail', function ($scope, fact,$routeParams, $location) {
    $scope.person = fact[$routeParams.id];
    if (!$scope.person) {
        $location.path("/error");
    }
});

app.controller('all', function ($scope, fact, $routeParams, $location) {
    $scope.person = fact[$routeParams.id];
    if (!$scope.person) {
        $location.path("/error");
    }
});