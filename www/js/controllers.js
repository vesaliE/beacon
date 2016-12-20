angular.module('starter.controllers', ['firebase'])

.controller("RegisterCtrl", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon, $localstorage, $firebase) {

    var beaconList = new Firebase("https://beaconfunction.firebaseio.com/Beacons")

    $scope.beacons = {};
    $scope.added = false;
    $scope.values = "nothing";

    var localName = $localstorage.get("username");

    var time = Firebase.ServerValue.TIMESTAMP;

    $ionicPlatform.ready(function() {

        $cordovaBeacon.requestWhenInUseAuthorization();

        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
            $scope.added = true;
            var uniqueBeaconKey;
            for(var i = 0; i < pluginResult.beacons.length; i++) {
                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
                $scope.values = pluginResult.beacons[i].uuid;
                $scope.added = true;
                var dist = pluginResult.beacons[i].accuracy
                beaconList.child(uniqueBeaconKey).child(localName).set({
                    name: $localstorage.get("username"),
                    beacon: pluginResult.beacons[i].uuid,
                    date: time,
                    distance: dist
                })
            }
            $scope.$apply();
            
        });

        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));

    });
    
})

.controller("RegisterClassCtrl", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon, $localstorage, $firebase) {

    $scope.fullName = null;

    $scope.getName = function() {
        console.log("running");
        var fb = new Firebase("https://beaconfunction.firebaseio.com/StudentList")
        var fbAuth = fb.getAuth();
        fb.on("value", function(snapshot) {
            $scope.fullName = snapshot.child(fbAuth.uid).child("fullName").val();
            console.log($scope.fullName);
        })
    }

    $scope.register = function(classCode) {
        var fb = new Firebase("https://beaconfunction.firebaseio.com/Classes")
        var fbAuth = fb.getAuth();
        var studentuid = fbAuth.uid;

        $scope.beacons = {};
        var time = Firebase.ServerValue.TIMESTAMP;


        $cordovaBeacon.requestWhenInUseAuthorization();

        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
            var uniqueBeaconKey;
            for(var i = 0; i < pluginResult.beacons.length; i++) {
                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                //$scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
                var dist = pluginResult.beacons[i].accuracy
                fb.child(classCode).child(studentuid).child(uniqueBeaconKey).set({
                    name: studentuid,
                    beacon: pluginResult.beacons[i].uuid,
                    date: time,
                    distance: dist
                })
            }
            $scope.$apply();
            
        });

        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));

    }
})

.controller('DashCtrl', function($scope) {})

.controller('TeacherCtrl', function($scope, $firebase, $firebaseObject) {
    var fbServer = new Firebase("http://beaconfunction.firebaseio.com/")
    $scope.list = function() {
        var beaconList = $firebaseObject(fbServer)
        beaconList.$bindTo($scope, "data");
    }

    $scope.getTimeStudent = function(number) {
        var date = new Date(number);
        var number = date.getHours();
        var hour = date.getHours().toString();
        var min = date.getMinutes().toString();
        return date.toLocaleString();
    }

})


.controller('AccountCtrl', function($scope, $localstorage, $firebase, $firebaseAuth, $firebaseObject, $ionicPopup) {
    var date = Firebase.ServerValue.TIMESTAMP;
    var temp = new Firebase("https://beaconfunction.firebaseio.com/Users")

    $scope.saveName = function(username) {
        console.log("saved")
        $localstorage.set("username", username);
        $scope.savedname = username;
        temp.child(username).set({
            time: date
        })
    }

    $scope.savedname = null;

    $scope.checkName = function() {
        console.log("checking...")
        var storedName = $localstorage.get("username");
        if (storedName !== null) {
            $scope.savedname = storedName;
        }
    }

    $scope.login = function (email, password) {
        var fb = new Firebase("https://beaconfunction.firebaseio.com")
        var fbAuth = $firebaseAuth(fb);
        return fbAuth.$authWithPassword({
            email: email,
            password: password
        }).then(function(authData) {
          $scope.authData = authData;
          $ionicPopup.alert({
            title: 'Success',
            template: 'Login Success!'
        })
      }).catch(function(error) {
        console.error("ERROR: " + error);
        $ionicPopup.alert({
            title: 'Wrong password!',
            template: 'Please create an account if you do not have one!'
        });
    });
  }

  $scope.matricNumber = null;
  $scope.fullName = null;

  $scope.checkCurrentUser = function() {
    var fb = new Firebase("https://beaconfunction.firebaseio.com/StudentList");
    var fbAuth = fb.getAuth();
    fb.on("value", function(snapshot) {
        $scope.matricNumber = snapshot.child(fbAuth.uid).child("matricNumber").val();
        $scope.fullName = snapshot.child(fbAuth.uid).child("fullName").val();
    })
}

})



.controller('SignupCtrl', function($scope, $firebaseAuth, $firebaseObject, $firebase, $ionicPopup) {
    var fb = new Firebase("https://beaconfunction.firebaseio.com");

    $scope.register = function(matricNumber, fullName, displayedName, email, password) {

        var UserFb = $firebaseObject(fb.child("StudentList"));
        UserFb.$bindTo($scope, "data");
        var fbAuth = $firebaseAuth(fb);

        if (email === "" || email === undefined || password === "" || password === undefined) {
          $ionicPopup.alert({
            title: "No Email or Password detected",
            template: "Please enter an email or password to create your account"
        })

      } else {
        var firebaseUsers = new Firebase("http://beaconfunction.firebaseio.com/StudentList");

        fbAuth.$createUser({email: email, password: password}).then(function(userData) {
            return fbAuth.$authWithPassword({
              email: email,
              password: password
          })

        }).then(function(authData) { 
            console.log("ACCOUNT CREATED SUCCESSFULLY!");
            firebaseUsers.child(authData.uid).set ({
                matricNumber : matricNumber,
                fullName : fullName,
                displayedName : displayedName
            });

            $ionicPopup.alert({
                title: 'Success',
                template: 'Account has been created!'
            })
        })


    }
}

});
