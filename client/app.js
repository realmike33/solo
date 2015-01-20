angular.module("Together", [
  "Together.login",
  "ui.router",
  "firebase", 
  "ui.ace"
])
.controller("editorController", function($scope, $firebase, $stateParams, userSession){
  $scope.sessionCode = {code: ''};
  var code = $stateParams.code;
  var codeRef = new Firebase("https://togetherio.firebaseio.com/sessions/" + code+'/code');
  var sync, combinedCode;
  if(code){
    var usersRef = new Firebase("https://togetherio.firebaseio.com/sessions/" + code + '/users');
    sync = $firebase(usersRef);
    //  create unique user add to session
    sync.$push({username: "mike"});
    combinedCode = $firebase(codeRef).$asObject();
    combinedCode.$bindTo($scope, 'value');
  } else {
    var myFirebaseRef = new Firebase("https://togetherio.firebaseio.com/sessions");
    sync = $firebase(myFirebaseRef);
    //create new session with user
    var user = {username: 'user1'};
    sync.$push({users: {}}).then(function(ref){
      var usersRef = $firebase(new Firebase('https://togetherio.firebaseio.com/sessions/' + ref.key() +'/users/'));
      codeRef = new Firebase("https://togetherio.firebaseio.com/sessions/" + ref.key() +'/code' );
      usersRef.$push(user);
      combinedCode = $firebase(codeRef).$asObject();
      combinedCode.$bindTo($scope, 'value');
    });
  }
  
    
  var aceChanged = function(data){
    console.log(data);
    // $scope.sessionCode.code += data[0].data.text;
  };

  $scope.aceOption = {
    useWrapMode : true,
    showGutter: true,
    theme:'twilight',
    mode: 'xml',
    firstLineNumber: 1,
    // onLoad: aceLoaded,
    onChange: aceChanged
  }
})
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      templateUrl: 'home.html',
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
    user: username
  }
});

