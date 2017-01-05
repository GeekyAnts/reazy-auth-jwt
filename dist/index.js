'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (param) {
  return function (serviceName) {
    var app = this;

    var login = function login() {
      var credentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve, reject) {
        console.log('credentials', credentials);
        param.http.request(param.loginUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          app.set([serviceName, 'response'], response);
          resolve(response);
        }).catch(function (err) {
          reject(err);
        });
      });
    };

    var logout = function logout() {
      var credentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve, reject) {
        param.http.request(param.logoutUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          return response.json();
        }).then(function (response) {
          param.auth.setUser(null);
          param.auth.setToken(null);
          param.http.setDefaultHeaders({
            Authorization: null
          });
          resolve('success');
        }).catch(function (err) {
          reject(err);
        });
      });
    };

    param.auth.loginJwt = login;
    param.auth.logoutJwt = logout;

    var authJwtService = {
      login: login,
      logout: logout
    };

    app.set(serviceName, authJwtService);

    return authJwtService;
  };
};