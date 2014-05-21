"use Strict";
var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'Views/blogs.html',
        controller: 'blogs'
    }).when('/create', {
        templateUrl: 'Views/createblog.html',
        controller: 'createblog'
    }).when('/view/:id', {
        templateUrl: 'Views/viewBlog.html',
        controller: 'viewblog'
    }).when('/edit/:id', {
        templateUrl: 'Views/editBlog.html',
        controller: 'editblog'
    }).when('/error', {
        templateUrl: 'Views/error.html'
    }).otherwise({
        templateUrl: 'Views/error.html'
    });
});

//Create a Factory / Service
app.service('blogs', function ($http,$location) {
    this.me = "Oraz";
    this.baseUrl = "https://orazpv.firebaseio.com/blogs/";
    this.test = function () {
        var me = "pauloooo";
        return me;
    };
    var time = Date.now();
    this.blogs = [{ blogger: "Paul O", msg: "this is my Blog", time: time }, { blogger: "Dan O", msg: "this is my Blogger's Blog", time: time }];
    

    //Blog Constructor
    this.blog = function (blogger, msg) {
        this.blogger = blogger;
        this.msg = msg;
        this.time = Date.now();
    }

});

//http Service
app.service('AjaxMaster', function ($http, callbackFunctions, blogs) {
    //HTTP post function
    //alert();
    this.httpPost = function (url, mydata,callback) {
        $http.post(url, mydata).success(function () {

            //callbacks[callback](data, status, response);
            //callbackFunctions.creatBlogCallback(data, status, response);
            var i = 1;

        });
        callbackFunctions.creatBlogCallback(data, status, response);
    };
});

//callback services
app.service('callbackFunctions', function (blogs) {
    
    //Create Blog Callback
    this.creatBlogCallback = function(data,status,response){
        //create the key property and push it into the blogs array
        mydata.key = data.name;
        blogs.blogs.push(mydata);
    };
});

//blogs controller
app.controller('blogs', function ($scope,blogs) {
    $scope.blogs = blogs.blogs;
    //alert(blogs.me);
});

//View blog controller
app.controller('viewblog', function ($scope, blogs, $routeParams, $location) {
    $scope.blogs = blogs.blogs[$routeParams.id];
    if (!$scope.blogs) {
        $location.path('/error');
    }

    //Edit blogs
    $scope.editBlog = function () {
        //open the edit blog view
        $location.path('/edit/' + $routeParams.id);
    };

    //Handle Delete
    $scope.delBlog = function () {
        $scope.blogs = blogs.blogs;
        $scope.blogs.splice($routeParams.id, 1);

        //open the home
        $location.path('/');
    };
    
});

//Edit blog controller
app.controller('editblog', function ($scope, blogs, $routeParams, $location) {
    var blogger = blogs.blogs[$routeParams.id].blogger;
    var msg = blogs.blogs[$routeParams.id].msg;
    $scope.edit = [];
    $scope.edit.blogger = blogger;
    $scope.edit.msg = msg;

    if (!blogger) {
        $location.path('/error');
    }

    //Handle Update
    $scope.updateBlog = function (blogger, msg) {
        blogs.blogs[$routeParams.id].blogger = $scope.edit.blogger;
        blogs.blogs[$routeParams.id].msg = $scope.edit.msg;
        blogs.blogs[$routeParams.id].time = Date.now();

        //open the home
        $location.path('/');
    };
});

//Create blog Controller
app.controller('createblog', function ($scope, blogs, $location, AjaxMaster, callbackFunctions) {
    $scope.blogs = blogs.blogs;

    //create the blog
    $scope.createBlog = function (blogger, msg) {
        var time = Date.now();
        var data = new blogs.blog(blogger, msg);
        var url = blogs.baseUrl + ".json";
        var callback = 'creatBlogCallback';

        //call the HTTP request function
        AjaxMaster.httpPost(url, data, callback);

        //re-route to the home page to display the blogs
        $location.path('/');
    };

    //Create Blog callback
    $scope.creatBlogCallbackold = function (data, mydata) {
        //create the key property and push it into the blogs array
        mydata.key = data.name;
        $scope.blogs.push(mydata);
        alert("done");
        //re-route to the home page to display the blogs
        $location.path('/');

    };
});