var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('SignInController', ['$http', '$location', 'cfHandleError', 'cfAuth', function($http, $location, handleError, auth) {
    // AUTH_EX: how does this differ from the sign_up_controller?
    
    // Sign-up: What is does generally: It sets sign-up to be true, and posts to the signup route created on the backend. It then saves part of the token response with the cfAuth service and AuthController.
    // Sign-in: Retrieves the content of a user’s credentials (aka token) and then in the same way as signing up it saves the responses within the cfAuth service in the AuthController.
    // The main differences between these two is that: sign-in can occur only when sign-up it equal to true.
    // The content of the button for each Controller differs, for sign up it says ‘Create New User!’ for signing its content is  'Sign in to existing user’.
    // The biggest substantive difference between these two controllers is whether they either retrieve (GET/signin) or save (POST/signup) the content necessary for authentication, like username and password.
    // Both receive and deal with the responded token within the header.
    this.buttonText = 'Sign in to existing user';
    this.errors = [];
    this.authenticate = function(user) {
      $http({
        method: 'GET',
        url: baseUrl + '/api/signin',
        headers: {
          'Authorization': 'Basic ' + window.btoa(user.username + ':' + user.password)
        }
      })
        .then((res) => {
          auth.saveToken(res.data.token);
          auth.getUsername();
          $location.path('/bears');
        }, handleError(this.errors, 'could not sign into user'));
    };
  }]);
};
