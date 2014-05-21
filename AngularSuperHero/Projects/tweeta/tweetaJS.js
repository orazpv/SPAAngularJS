//Create our mudule
var app = angular.module('tweeta', ['ngRoute']);

//create our routes
app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'Projects/tweeta/views/start.html',
        controller:'start'
    }).when('/login', {
        templateUrl: 'Projects/tweeta/views/login.html',
        controller:'login'
    }).when('/register', {
        templateUrl: 'Projects/tweeta/views/register.html',
        controller:'register'
    }).when('/home', {
        templateUrl: 'Projects/tweeta/views/home.html',
        controller: 'home'
    }).otherwise({
        templateUrl: 'Projects/tweeta/views/start.html'
    })
});

// ************************ SERVICES ********************************************

// DATA SERVICE
app.service('tweetdata',function(){
    this.baseUrl = "https://orazpv.firebaseio.com/tweeta/";
    this.profile = {}; //User's profile details
    this.friends = []; //Array of the user's friends
    this.tweets = []; //Array of all tweets both the user and the friends

    //tweet constructor
    this.tweet = function (msg) {
        this.msg = msg;
        this.time = Date.now();
    };
});

//METHODS / FUNCTIONS SERVICE
app.service('tweetMethods', function ($location, tweetdata,$http) {

    //Log a user in
    this.loginServ = function (userName, pwd) {
        //Initialise the arrays
        tweetdata.tweets.length = 0;
        tweetdata.friends.length = 0;

        //Build the user's profile
        buildProfile(userName, pwd);
  
    }

    //Build the user's profile
    var buildProfile = function (userName, pwd) {
        
        //User name and pwd
        tweetdata.profile.userName = userName;
        tweetdata.profile.pwd = pwd;

        //get other profile info from the firebase
        var url = tweetdata.baseUrl + "users/" + userName + "/profile.json";
        $http.get(url).success(
            function (data,status) {
                tweetdata.profile.name = data.name;
                tweetdata.profile.pictureUrl = data.pictureUrl;

                //Get the user's Tweets
                userTweets(userName);
                
            }
            );
    };

    //Get the user's tweets
    var userTweets = function (userName) {
        var url = tweetdata.baseUrl + "users/" + userName + "/tweets.json";
        $http.get(url).success(
            function (data, status) {
                //Push the tweets into tweets array
                for (var k in data) {
                    data[k].key = k; //tweet key
                    data[k].name = tweetdata.profile.name;
                    data[k].pictureUrl = tweetdata.profile.pictureUrl;
                    tweetdata.tweets.push(data[k]);
                }

                //Get User's Friends
                getFriends(userName);
            }
            );
    };

    //Get User's Friends
    var getFriends = function (userName) {
        var url = tweetdata.baseUrl + "users/" + userName + "/friends.json";
        $http.get(url).success(
            function (data, status) {
                //push the list into friends array
                for (var k in data) {
                    data[k].key = k; //Friend key
                   
                    //Push into friends List
                    tweetdata.friends.push(data[k]);
                }

                //Build Friends Profile into the Friends List
                friendProfile(userName);
            }
            )
    };

    //Build Friends Profile
    var friendProfile = function () {
        for( var k in tweetdata.friends){
            var url = tweetdata.baseUrl + "users/" + tweetdata.friends[k].userName + "/profile.json";
            var req = new XMLHttpRequest();
            req.open("GET", url, false);
            req.onload = function () {
                if (req.status >= 200 && req.status < 400) {
                    var data = JSON.parse(req.response);
                    tweetdata.friends[k].name = data.name;
                    tweetdata.friends[k].pictureUrl = data.pictureUrl;                   
                } else {
                    alert("An Error Occurred");
                }
            };
            //Send the request sync           
            req.send();
        }
        //Trigger the home controller
        $location.path('/home');
    };
    
});

// ************************ CONTROLLERS *********************************************
//**********************************************************************************

//START CONTROLLER
app.controller('start', function ($scope, tweetdata) {
  
});

//LOGIN CONTROLLER
app.controller('login', function ($scope, tweetdata,tweetMethods, $location,$http) {

    $scope.login = function (userName, pwd) {
        //alert(userName + pwd);
        //validate the user inputs
        if (!(userName && pwd)) {
            alert("Incomplete Entry");
            return;
        }
        //Validate the login
        $scope.validUser(userName, pwd);
        
    };

    //Validate the user
    $scope.validUser = function (userName, pwd) {
        
        var url = tweetdata.baseUrl + "users.json";
        var isValid = false;
        $http.get(url).success(
            function (data, status) {
                //iterate the array of users
                for (var i in data) {
                    if (i.toLowerCase() === userName.toLowerCase() && data[i].pwd ===pwd) {
                        isValid = true;
                        break;
                    }
                }
                //Log in the User if valid
                if (isValid) {
                    //Valid user
                    tweetMethods.loginServ(userName, pwd);
                } else {
                    //Invalid user
                    alert("Invalid User");
                }
            });
    };

});

//REGISTER CONTROLLER
app.controller('register', function ($scope, tweetdata, $http,$location,tweetMethods) {

    $scope.register = function (userName, pwd, retypePwd) {
        //validate the data
        if (!(userName && pwd && retypePwd)) {
            alert("Some inputs are empty");
            return;
        }

        //Validate the password
        if (pwd !== retypePwd) {
            alert("Password Mismatch");
            return;
        }

        //Do from here down if all data is valid
        //
        //
        //Check if user exists
        $scope.userExists(userName, pwd);
    };

    //Check if the user name is available
    $scope.userExists = function (userName, pwd) {
        var url = tweetdata.baseUrl + "users.json";
        var found = false;
        $http.get(url).success(
            function (data, status) {
                //iterate the array of users
                for (var i in data) {
                    if (i.toLowerCase === userName.toLowerCase()) {
                        found = true;
                    }
                }
                //Create the user if not found
                if (found) {
                    alert("User alread Exists");
                } else {
                    //create user
                    $scope.createUser(userName, pwd);
                }
            });
    };

    //Create the New User
    $scope.createUser = function (userName,pwd) {
        //construct the url and data
        var url = tweetdata.baseUrl + "users/" + userName + ".json";
        var data = { pwd: pwd };
        $http.put(url, data).success(
            function (data,status) {
                //Log the user in
                tweetMethods.loginServ(userName, pwd);
        });
    }
});

//HOME CONTROLLER
app.controller('home', function ($scope, tweetdata, tweetMethods, $location, $http) {
    //make sure that this controller was triggered by another controller
    if (tweetdata.profile.userName){
        //Bind profile data with variables in this scope
        $scope.userName = tweetdata.profile.userName;
        $scope.pwd = tweetdata.profile.pwd;
        $scope.name = tweetdata.profile.name;
        $scope.pictureUrl = tweetdata.profile.pictureUrl;

        //get all the friends
        $scope.friends = tweetdata.friends;

        //Get the user's tweets and friends' tweets
        $scope.tweets = tweetdata.tweets;

    } else {
        //here cookies will be used to get the current user
        //But its not done yet!
        alert("You Refreshed the page, sorry you will have to login again");
        $location.path('/login');
    }

    //Add tweet
    $scope.addTweet = function (msg) {
        var i = 0;
        //validate the input
        if (!(msg)) {
            //do nothing
            return;
        }

        //continue if something was clicked
        //construct a tweet and post it to firebase
        var tweet = new tweetdata.tweet(msg);
        var url = tweetdata.baseUrl + "users/" + $scope.userName + "/tweets.json";
        $http.post(url, tweet).success(
                function (data, status) {
                    //push into tweets array
                    tweet.key = data.name;
                    tweet.name = $scope.userName;
                    tweet.pictureUrl = $scope.pictureUrl
                    $scope.tweets.push(tweet);
                }
            );
    };

    //Add a new friend
    $scope.addFriend = function (userName) {
        //validate the data
        if (!(userName)) {
            //do nothing
            return;
        }

        //Continue if something was added into the input box
        //check if the users exists
        $scope.userExists(userName);
    };

    //check if user exists
    $scope.userExists = function (userName) {
        var url = tweetdata.baseUrl + "users.json";
        var found = false;
        $http.get(url).success(
            function (data, status) {
                //iterate the array of users
                for (var userId in data) {
                    if (userId.toLowerCase() === userName.toLowerCase()) {
                        found = true;
                        //Add the User
                        $scope.addUser(userId);
                        break;
                    }
                }

                //Not Found
                if (!found) {
                    alert("User does not Exists!");
                }
            });
    };

    //Add the User as Friend
    $scope.addUser = function (userId) {
        var url = tweetdata.baseUrl + "users/" + $scope.userName + "/friends.json";
        $http.post(url,{userName:userId}).success(
                function(data,status){
                    tweetMethods.loginServ($scope.userName, $scope.pwd);
                }
            )
    };

    $scope.EditProfile = function () {
        //Create new Temp object and assign the values of the profile properties to it
        //This enables retrival but not complete binding
        $scope.Profile = {};
        $scope.Profile.name = $scope.name;
        $scope.Profile.pwd = $scope.pwd;
        $scope.Profile.Retypepwd = $scope.pwd;
        $scope.Profile.pictureUrl = $scope.pictureUrl;

        //open the modal window
        $("#editProfile").modal();
    };

});