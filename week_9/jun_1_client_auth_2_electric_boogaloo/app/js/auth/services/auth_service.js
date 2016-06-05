var baseUrl = require('../../config').baseUrl;

module.exports = function(app) {
  app.factory('cfAuth', ['$http', '$q', function($http, $q) {
    // AUTH_EX: explain what each of these functions are accomplishing and
    // what data we're storing in this service

    // removeToken: this function is the method in this service that removes any trace of the token from any of the places that elsewhere in this service the token has been saved.
    // It sets all of those locations to null or an empty string and thus essentially signs anyone signed in, out (since you need a token to be ‘signed in’).

    // saveToken: This function takes a parameter of token and sets that token to as both the token within the scope of the factory,
    // the token comprised in the http header, and the token in local storage. It then returns the token.

   // getToken: Get token checks to see if there is already a value for the locally scoped token
   // OR it calls the method of saveToken (described above) setting the token parameter for that to be the window’s local storage token.

   // getUsername: This function returns a promise that is resolved when one of two things happen:
   // if there is already a username that has previously been set, OR if after a get request to the url + /api/profile
   // then the username is set from the backend input (res.data.username). 
   // If the method getToken has not been called then the promise is rejected because that means that there is no token
   // saved into the http method or in local storage to be transmitted in headers for authentication.
    return {
      removeToken: function() {
        this.token = null;
        this.username = null;
        $http.defaults.headers.common.token = null;
        window.localStorage.token = '';
      },
      saveToken: function(token) {
        this.token = token;
        $http.defaults.headers.common.token = token;
        window.localStorage.token = token;
        return token;
      },
      getToken: function() {
        this.token || this.saveToken(window.localStorage.token);
        return this.token;
      },
      getUsername: function() {
        return $q(function(resolve, reject) {
          if (this.username) return resolve(this.username);
          if (!this.getToken()) return reject(new Error('no authtoken'));

          $http.get(baseUrl + '/api/profile')
            .then((res) => {
              this.username = res.data.username;
              resolve(res.data.username);
            }, reject);
        }.bind(this));
      }
    };
  }]);
};
