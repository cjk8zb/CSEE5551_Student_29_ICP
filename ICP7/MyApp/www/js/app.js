var imageApp = angular.module("starter", ["ionic", "ionic.native", "firebase"]);

imageApp.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

imageApp.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("firebase", {
      url: "/firebase",
      templateUrl: "templates/firebase.html",
      controller: "FirebaseController",
      cache: false
    })
    .state("secure", {
      url: "/secure",
      templateUrl: "templates/secure.html",
      controller: "SecureController"
    });
  $urlRouterProvider.otherwise('/firebase');
});

imageApp.controller("FirebaseController", function ($scope, $state, $firebaseAuth) {

  var fbAuth = $firebaseAuth();
  var provider = new firebase.auth.GoogleAuthProvider();

  $scope.login = function (username, password) {
    fbAuth.$signInWithEmailAndPassword(username, password).then(function (authData) {
      $state.go("secure");
    }).catch(function (error) {
      console.error("ERROR: " + error);
    });
  };

  $scope.oAuthLogin = function(authMethod) {
    console.log('oAuthLogin');
    fbAuth.$signInWithRedirect(provider).then(function(authData) {
      console.log(authData);
      $state.go("secure");
    });
  };

  fbAuth.$onAuthStateChanged(function(authData) {
    if (authData === null) {
      console.log('Not logged in yet');
    } else {
      console.log('Logged in as', authData.uid);
      $state.go("secure");
    }
    $scope.authData = authData; // This will display the user's name in our view
  });


  $scope.register = function (username, password) {
    fbAuth.$createUserWithEmailAndPassword(username, password).then(function (userData) {
      return fbAuth.$signInWithEmailAndPassword(username,
        password);
    }).then(function (authData) {
      $state.go("secure");
    }).catch(function (error) {
      console.error("ERROR: " + error);
    });
  };

});

//secure controller

imageApp.controller("SecureController",
  function ($scope, $ionicHistory, $firebaseObject, $firebaseArray, $firebaseAuth, $cordovaCamera, $state) {

    $ionicHistory.clearHistory();  //for clearing user login history

    $scope.images = [];
    $scope.fb = $firebaseAuth();
    var fbAuth = $scope.fb.$getAuth();
    var ref = firebase.database().ref();
    var obj = $firebaseObject(ref);
    if (fbAuth) {
      var userReference = ref.child("users/" + fbAuth.uid);   //capture the user reference in data structure ,it navigates to specific user page in freebase
      var syncArray = $firebaseArray(userReference.child("images"));  //binding specific node in firebase to an array object in angularjs
      $scope.images = syncArray;
    } else {
      $state.go("firebase");  //directs to firebase page
    }

    $scope.upload = function () {
      var options = {
        quality: 75,
        destinationType: $cordovaCamera.DestinationType.DATA_URL,
        sourceType: $cordovaCamera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: $cordovaCamera.EncodingType.JPEG,
        popoverOptions: $cordovaCamera.PopoverArrowDirection.ARROW_UP,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        syncArray.$add({image: imageData}).then(function () {
          alert("Image has been uploaded");
        });
      }, function (error) {
        console.error(error);
      });
    }

  });
