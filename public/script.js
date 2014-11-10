angular.module('RestApp', ['ngResource'])

/**
 * This is the User Factory made with $resource
 * That's very easy!!
 */
// .factory('User', ['$resource', function($resource) {
//   return $resource('/api/user/:id',
//    {id:'@id'}, {
//     update : { method:'PUT'},
//     query:  {url:'/api/users', method:'GET', isArray:true},
//     save: {url:'/api/users', method:'POST'},
//    });
// }])


/**
 * This is the same User Factory hand made this time,
 * Every single function is rewritten
 * That's some work :p
 * Note that we don't change the code later ;)
 */
.factory('User', ['$http', '$q', function($http, $q) {

  // instantiate our User object
  var User = function(id, name, age) {
      this.id = id;
      this.name = name;
      this.age = age;

  };

  User.get = function (params, success){
    var deferred = $q.defer();
    $http.get('/api/user/' + params.id).
      success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        deferred.resolve(data);

      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    if(success)
    deferred.promise.then(function(data) {
      success(data)
    });

    return deferred.promise;
  };

  User.query = function (params, success){
      var deferred = $q.defer();
      $http.get('/api/users', params).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          deferred.resolve(data);

        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });

      if(success)
      deferred.promise.then(function(data) {
        success(data)
      });

      return deferred.promise;
    };

    User.prototype.$save = function (success){
      var deferred = $q.defer();
      $http.post('/api/users', {name : this.name, age : this.age}).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          value = {
            data : data ,
            headers : headers
          }
          deferred.resolve(value);

        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });

      if(success)
      deferred.promise.then(function(value) {
        success(value.data, value.headers)
      });

      return deferred.promise;
    };

    User.prototype.$update = function (success){
      $http.put('/api/user/' + this.id, {name : this.name, age : this.age}).
        success(function(data, status, headers, config) {
        }).
        error(function(data, status, headers, config) {
      });
    };

    User.prototype.$remove = function (success){
    var deferred = $q.defer();
      $http.delete('/api/user/' + this.id).
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          deferred.resolve(data);

        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
      });

      if(success)
      deferred.promise.then(function(data) {
        success()
      });

      return deferred.promise;

    };

    return User;
}])



.controller('AppCtrl', function($scope, User) {

  $scope.users = [];

  //Store what users are being modified
  $scope.editMode = { };
  //Store the new temp user
  $scope.newUser = {};

  //Get All users
  User.query({},function(data) {
    $scope.users = data;
  });

  $scope.updateUser = function(user, updatedUser){
	//Update Scope
    user.name = updatedUser.name;
    user.age = updatedUser.age;

    //Prepare the server object
    var updatedUser = new User();
    updatedUser.id = user.id;
    updatedUser.name = user.name;
    updatedUser.age = user.age;

    //Update the user!
    updatedUser.$update();
  };

  $scope.addUser = function(){

      var newUser = new User();
      newUser.name = $scope.newUser.name;
      newUser.age = $scope.newUser.age;

      newUser.$save(function(data, headers){ // perform a POST
          // The response of the POST contains the url of the newly created resource
          var newId = headers('Location').split('/').pop();
          newUser.id= newId;

          //Just to be sure, get the user from the server
          User.get({id: newUser.id}, function(newlyCreatedUser){
            //Add the newly creates ressource to the table
            $scope.users.push(newlyCreatedUser);

            //Clean up
            $scope.newUser = {};
          });
    });
  }


    $scope.deleteUser = function(userToDelete) {
      $scope.users.forEach(function(user, index) {
        if (userToDelete.id === user.id) {
          var userToDel = new User();
          userToDel.id = user.id;
          userToDel.$remove(function() {
            $scope.users.splice(index, 1);
          });
        }
      });
    };

})
