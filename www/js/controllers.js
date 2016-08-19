angular.module('starter.controllers', ['firebase'])

.controller("StudentCtrl", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon, $localstorage, $firebase) {
    
    var beaconList = new Firebase("https://beaconfunction.firebaseio.com/Beacons")
 
    $scope.beacons = {};
    $scope.added = false;
    $scope.values = null;

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
                beaconList.child(uniqueBeaconKey).set({
                    name: $localstorage.get("username"),
                    beacon: pluginResult.beacons[i].uuid,
                    date: time
                })
            }
            $scope.$apply();
            
        });
 
        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));
 
    });
    
})

.controller('DashCtrl', function($scope) {})

.controller('TeacherCtrl', function($scope, $firebase, $firebaseObject) {
    var fbServer = new Firebase("http://beaconfunction.firebaseio.com/")
    $scope.list = function() {
        var beaconList = $firebaseObject(fbServer)
        beaconList.$bindTo($scope, "data");
    }

})


.controller('AccountCtrl', function($scope, $localstorage, $firebase) {
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
});
