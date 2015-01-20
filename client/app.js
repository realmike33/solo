angular.module("Together", [
  "ui.router",
  "firebase", 
  "ui.ace"
])
.controller("editorController", function($scope, $firebase, $stateParams, userSession){
  var sync, combinedCode;
  var code = $stateParams.code;
  var codeRef = new Firebase("https://togetherio.firebaseio.com/sessions/" + code +'/code');
  var usersRef = new Firebase("https://togetherio.firebaseio.com/sessions/" + code + '/users');
  sync = $firebase(usersRef);
    //  create unique user add to session
  sync.$push({username: userSession.user});
  combinedCode = $firebase(codeRef).$asObject();
  combinedCode.$bindTo($scope, 'value').then(function(){
      console.log($scope.value)
    // $scope.value.code
  });
  
  $scope.users = sync.$asArray();
  console.log($scope.user);

  $scope.aceOption = {
    useWrapMode : true,
    showGutter: true,
    theme:'twilight',
    mode: 'javascript',
    firstLineNumber: 1,
  }
})
.controller('homeController', function($scope, $firebase, $state){
  $scope.fire = function(){
    var myFirebaseRef = new Firebase("https://togetherio.firebaseio.com/sessions");
    var sync = $firebase(myFirebaseRef);
    sync.$push({users: {}}).then(function(ref){
      $state.go('session', {code: ref.key()});
    })
  };
})
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      templateUrl: 'home.html',
      controller: 'homeController',
      url: '/'
    })
    .state('session', {
      templateUrl: 'session.html',
      controller: 'editorController',
      url: '/session/:code'
    })
})
.factory('userSession', function(){
  var username = Math.floor(Math.random()*200); 
  return {
    user: 'user ' + username
  }
});

