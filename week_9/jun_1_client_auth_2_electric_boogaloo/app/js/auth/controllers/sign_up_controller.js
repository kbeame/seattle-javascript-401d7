var baseUrl = require('../../config').baseUrl;
module.exports = function(app) {
  app.controller('SignUpController', ['$http', '$location',  'cfHandleError', 'cfAuth', function($http, $location, handleError, auth) {
    // AUTH_EX: how does this differ from the sign_in_controller
    // NOTE These are combined explanations for sign-up and sign-in and thus are same for each question.
    // Sign-up: What is does generally: It sets sign-up to be true, and posts to the signup route created on the backend. It then saves part of the token response with the cfAuth service and AuthController.
    // Sign-in: Retrieves the content of a user’s credentials (aka token) and then in the same way as signing up it saves the responses within the cfAuth service in the AuthController.
    // The main differences between these two is that: sign-in can occur only when sign-up it equal to true.
    // The content of the button for each Controller differs, for sign up it says ‘Create New User!’ for signing its content is  'Sign in to existing user’.
    // The biggest substantive difference between these two controllers is whether they either retrieve (GET/signin) or save (POST/signup) the content necessary for authentication, like username and password.
    // Both receive and deal with the responded token within the header.
    this.signup = true;
    this.errors = [];
    this.buttonText = 'Create New User!';
    this.authenticate = function(user) {
      $http.post(baseUrl + '/api/signup', user)
        .then((res) => {
          auth.saveToken(res.data.token);
          auth.getUsername();
          $location.path('/bears');
        }, handleError(this.errors, 'Could not create user'));
    };
  }]);
};
