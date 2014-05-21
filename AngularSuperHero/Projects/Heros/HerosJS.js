var app = angular.module("mainApp", []); //creating an angular app, and the string must match the name on our ng-app
app.title = "Paul";
var tit = "peter";
app.heros = [{ name: "Captain Ameria", howAwesome: "No Answer" }, { name: "Spider Man", howAwesome: "Awesome" }];

//Creating a factory
app.factory("heros", function () {
    return [{ name: "Captain Ameria", howAwesome: "No Answer" }, { name: "Spider Man", howAwesome: "Awesome" }];
});

//main controller
app.controller("mainCtrl", function ($scope,heros) {
    //Hero array
    $scope.heros = app.heros;

    //add a supper hero
    $scope.addHero = function () {
        //get the values
        var name = $scope.heroApp.name;
        var howAwesome = $scope.heroApp.howAwesome;
        var data = { name: name, howAwesome: howAwesome };
        $scope.heros.push(data);
    };
    //$scope.factory = heros;
});

//Controller two
app.controller("CtrlTwo", function ($scope, heros) {
    //$scope.factory = heros;
    $scope.heros = app.heros;

    //Update
    $scope.updateHero = function (hero) {
        var name = $scope.heros[$scope.heros.indexOf(hero)].name;
        var howAwesome = $scope.heros[$scope.heros.indexOf(hero)].howAwesome;
        $scope.modal = [];
        $scope.modal.name = name;
        $scope.modal.howAwesome = howAwesome;

        //Get the index and assign it to a scope variable
        $scope.index = $scope.heros.indexOf(hero);

        $("#myModal").modal();//JQuerry - open the modal dialog
        //$('#myModalLabel').html(name);
    };

    //Save update
    $scope.saveHero = function () {
        $scope.heros[$scope.index].name = $scope.modal.name;
        $scope.heros[$scope.index].howAwesome = $scope.modal.howAwesome;

        $("#myModal").modal('hide');
    };

    //delete
    $scope.delHero = function (hero) {
        $scope.heros.splice($scope.heros.indexOf(hero), 1);
    };
});

//test
app.controller("test", function ($scope) {

    $scope.name = tit;
});