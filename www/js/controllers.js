angular.module('starter.controllers', [])

.controller("StudentCtrl", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon) {
    /*
    fb = new Firebase("https://beaconfunction.firebaseio.com")
 
    $scope.beacons = {};
    $scope.added = false;
    $scope.values = null;
 
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
            }
            $scope.$apply();
        });
 
        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "B9407F30-F5F8-466E-AFF9-25556B57FE6D"));
 
    });
    */
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $localstorage) {
    $scope.saveName = function(username) {
        console.log("saved")
        $localstorage.set("username", username);
        $scope.savedname = username
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
