
export default function(param) {
  return function(serviceName) {
    const app = this;

    const login = (credentials = {}) => {
      return new Promise(function(resolve, reject) {
        console.log('credentials', credentials);
        param.http.request(param.loginUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        })
        .then((response) => response.json())
        .then((response) => {
          app.set([serviceName, 'response'], response);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
      });
    };

    const logout = (credentials = {}) => {
      return new Promise(function(resolve, reject) {
        param.http.request(param.logoutUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((response) => {
          param.auth.setUser(null);
          param.auth.setToken(null);
          param.http.setDefaultHeaders({
            Authorization: null
          })
          resolve('success');
        })
        .catch((err) => {
          reject(err);
        });
      });
    };

    param.auth.loginJwt = login;
    param.auth.logoutJwt = logout;

    const authJwtService = {
      login,
      logout,
    };

    app.set(serviceName, authJwtService);

    return authJwtService;
  }
}
