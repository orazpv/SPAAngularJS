"use strict";
var app = {}; //my app object

app.robots = []; //Array of Robots

app.baseUrl = "https://orazpv.firebaseio.com/Robot/";

//Robot Object Contructor
app.robot = function (name, metal, pictureUrl) {
    this.name = name;
    this.metal = metal;
    this.pictureUrl = pictureUrl;
};

//Ajax Function
app.AjaxCall = function (url, method, async, data,callback) {
    var req = new XMLHttpRequest();
    req.open(method, url, async);

    req.onload = function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.response,data)
        } else {
            alert("An Error!")
        }
    };

    req.onerror = function () {
        alert("Fatal Error: Did not Load")
    };
    req.send(JSON.stringify(data));
};

//Create Robot
app.addRobot = function () {
    //get the inputs
    var name = document.getElementById("name").value;
    var metal = document.getElementById("metal").value;
    var pictureUrl = document.getElementById("pictureUrl").value;

    //create a Robot using the constructor
    var data = new app.robot(name, metal, pictureUrl);
    var url = app.baseUrl + ".json";
    var method = "POST";
    var callback = app.addRobotcallback;
    var async = true;

    //Call AJAX Function
    app.AjaxCall(url, method, async, data, callback);
};

app.addRobotcallback = function (response,data) {
    //include the key in the data object
    response = JSON.parse(response);
    data.key = response.name;

    //push data into the robots array
    app.robots.push(data);

    //re-draw the table
    app.drawTable();
};

//read data from the firebase
app.readRobot = function () {
    var data = "";
    var url = app.baseUrl + ".json";
    var method = "GET";
    var callback = app.readRobotcallback;
    var async = true;

    //Call AJAX Function
    app.AjaxCall(url, method, async, data, callback);
};

app.readRobotcallback = function (response) {
    //Make the response an object
    response = JSON.parse(response);
    //enumerate through it and get data and push it into the Robots array
    for (var i in response) {
        response[i].key = i;
        app.robots.push(response[i]);
    }

    //redraw the table
    app.drawTable();
};

app.drawTable = function () {
    document.getElementById('showRobot').innerHTML = "";
    for (var i in app.robots) {
        for (var prop in app.robots[i]) {
            switch (prop){
                case 'name':
                    var name = app.robots[i][prop];
                    break;
                case 'metal':
                    var metal = app.robots[i][prop];
                    break;
                case 'pictureUrl':
                    var pictureUrl = app.robots[i][prop];
                    break;
                case 'key':
                    var key = app.robots[i][prop];
            }
        };
        //draw Table
        var trStr = '<tr><td rowspan="3" style="height:200px;width:200px">';
        trStr += '<img class="img-thumbnail" src="' + pictureUrl + '" style="height:200px;width:200px" /></td>';
        trStr += '<td colspan="2" style="height:30px;">Name: ' + name + '</td></tr><tr><td colspan="2">Metal: ' + metal + '</td></tr>';
        trStr += '<tr><td><div class="btn btn-success" onclick="editRobot(c)">Edit</div></td>';
        trStr += '<td><div class="btn btn-success" onclick="delCartoon(c)">Delete</div></td></tr>';
        document.getElementById('showRobot').innerHTML += trStr;
    };
};