// // const path = require("path");
// // const express = require("express");
// // const morgan = require("morgan");
// // const compression = require("compression");
// // const session = require("express-session");

// // require("dotenv").config();
// // let request = require("request");
// // let querystring = require("querystring");
// // let cookieParser = require("cookie-parser");
// // const PORT = process.env.PORT || 8888;
// // const app = express();

// // module.exports = app;

// // let redirect_uri = "http://localhost:8888/callback";
// // let client_id = process.env.CLIENT_ID;
// // let client_secret = process.env.CLIENT_SECRET;

// // /**
// //  * Generates a random string containing numbers and letters
// //  * @param  {number} length The length of the string
// //  * @return {string} The generated string
// //  */
// // let generateRandomString = function(length) {
// //   let text = "";
// //   let possible =
// //     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// //   for (let i = 0; i < length; i++) {
// //     text += possible.charAt(Math.floor(Math.random() * possible.length));
// //   }
// //   return text;
// // };

// // let stateKey = "spotify_auth_state";

// // const createApp = () => {
// //   // logging middleware
// //   app.use(morgan("dev"));

// //   // body parsing middleware
// //   app.use(express.json());
// //   app.use(express.urlencoded({ extended: true }));

// //   // compression middleware
// //   app.use(compression());

// //   app.use(function(req, res, next) {
// //     // Website you wish to allow to connect
// //     res.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");

// //     // Request methods you wish to allow
// //     res.setHeader(
// //       "Access-Control-Allow-Methods",
// //       "GET, POST, OPTIONS, PUT, PATCH, DELETE"
// //     );

// //     // Request headers you wish to allow
// //     res.setHeader(
// //       "Access-Control-Allow-Headers",
// //       "X-Requested-With,content-type"
// //     );
// //     res.setHeader("Access-Control-Allow-Credentials", true);
// //     next();
// //   });

// //   app.get("/login", function(req, res) {
// //     let state = generateRandomString(16);
// //     res.cookie(stateKey, state);
// //     // your application requests authorization
// //     let scope = "user-read-private user-read-email user-read-playback-state";
// //     res.redirect(
// //       "https://accounts.spotify.com/authorize?" +
// //         querystring.stringify({
// //           response_type: "code",
// //           client_id: client_id,
// //           scope: scope,
// //           redirect_uri: redirect_uri,
// //           state: state
// //         })
// //     );
// //     console.log('we are here 1 ')
// //   });

// //   app.get("/callback", function(req, res) {
// //     // your application requests refresh and access tokens
// //     // after checking the state parameter

// //     let code = req.query.code || null;
// //     let state = req.query.state || null;
// //     let storedState = req.cookies ? req.cookies[stateKey] : null;
// //     console.log('we are here 2 ')

// //     // if (state === null || state !== storedState) {
// //     if (state === null) {
// //       res.redirect(
// //         "/#" +
// //           querystring.stringify({
// //             error: "state_mismatch"
// //           })
// //       );
// //     } else {
// //       res.clearCookie(stateKey);
// //       let authOptions = {
// //         url: "https://accounts.spotify.com/api/token",
// //         form: {
// //           code: code,
// //           redirect_uri: redirect_uri,
// //           grant_type: "authorization_code"
// //         },
// //         headers: {
// //           Authorization:
// //             "Basic " +
// //             new Buffer(client_id + ":" + client_secret).toString("base64")
// //         },
// //         json: true
// //       };
// //       console.log('we are here 3 ')

// //       request.post(authOptions, function(error, response, body) {
// //         if (!error && response.statusCode === 200) {
// //           let access_token = body.access_token,
// //             refresh_token = body.refresh_token;

// //           let options = {
// //             url: "https://api.spotify.com/v1/me",
// //             headers: { Authorization: "Bearer " + access_token },
// //             json: true
// //           };

// //           // use the access token to access the Spotify Web API
// //           request.get(options, function(error, response, body) {
// //             console.log(body);
// //           });

// //           // we can also pass the token to the browser to make requests from there
// //           res.redirect(
// //             "http://localhost:8888/#" +
// //               querystring.stringify({
// //                 access_token: access_token,
// //                 refresh_token: refresh_token
// //               })
// //           );
// //         } else {
// //           console.log("rere!");
// //           res.redirect(
// //             "/#" +
// //               querystring.stringify({
// //                 error: "invalid_token"
// //               })
// //           );
// //         }
// //       });
// //     }
// //   });

// //   app.get("/refresh_token", function(req, res) {
// //     // requesting access token from refresh token
// //     let refresh_token = req.query.refresh_token;
// //     let authOptions = {
// //       url: "https://accounts.spotify.com/api/token",
// //       headers: {
// //         Authorization:
// //           "Basic " +
// //           new Buffer(client_id + ":" + client_secret).toString("base64")
// //       },
// //       form: {
// //         grant_type: "refresh_token",
// //         refresh_token: refresh_token
// //       },
// //       json: true
// //     };

// //     console.log('we are here 4 ')


// //     request.post(authOptions, function(error, response, body) {
// //       if (!error && response.statusCode === 200) {
// //         let access_token = body.access_token;
// //         res.send({
// //           access_token: access_token
// //         });
// //       }
// //     });
// //   });

// //   // static file-serving middleware
// //   app.use(express.static(path.join(__dirname, "..", "public")));

// //   // any remaining requests with an extension (.js, .css, etc.) send 404
// //   app.use((req, res, next) => {
// //     if (path.extname(req.path).length) {
// //       const err = new Error("Not found");
// //       err.status = 404;
// //       next(err);
// //     } else {
// //       next();
// //     }
// //   });

// //   // sends index.html
// //   app.use("*", (req, res) => {
// //     // res.sendFile(path.join(__dirname, '../client/public/index.html'));
// //     res.sendFile(path.join(__dirname, "..", "server/public"));
// // });

// //   // error handling endware
// //   app.use((err, req, res, next) => {
// //     console.error(err);
// //     console.error(err.stack);
// //     res.status(err.status || 500).send(err.message || "Internal server error.");
// //   });
// // };

// // const startListening = () => {
// //   // start listening (and create a 'server' object representing our server)
// //   const server = app.listen(PORT, () =>
// //     console.log(`Mixing it up on port ${PORT}`)
// //   );
// // };

// // async function bootApp() {
// //   await createApp();
// //   await startListening();
// // }

// // if (require.main === module) {
// //   bootApp();
// // } else {
// //   createApp();
// // }


// const path = require("path");
// const express = require("express");
// const morgan = require("morgan");
// const compression = require("compression");
// const session = require("express-session");

// require("dotenv").config();
// var request = require("request");
// var querystring = require("querystring");
// var cookieParser = require("cookie-parser");
// const PORT = process.env.PORT || 8888;
// const app = express();

// module.exports = app;

// var redirect_uri = "http://localhost:3000/callback";
// var client_id = process.env.CLIENT_ID;
// var client_secret = process.env.CLIENT_SECRET;

// /**
//  * Generates a random string containing numbers and letters
//  * @param  {number} length The length of the string
//  * @return {string} The generated string
//  */
// var generateRandomString = function(length) {
//   var text = "";
//   var possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//   for (var i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };

// var stateKey = "spotify_auth_state";

// const createApp = () => {
//   // logging middleware
//   app.use(morgan("dev"));

//   // body parsing middleware
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));

//   // compression middleware
//   app.use(compression());

//   app.use(function(req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");

//     // Request methods you wish to allow
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );

//     // Request headers you wish to allow
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "X-Requested-With,content-type"
//     );
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
//   });

//   app.get("/login", function(req, res) {
//     var state = generateRandomString(16);
//     res.cookie(stateKey, state);
//     // your application requests authorization
//     var scope = "user-read-private user-read-email user-read-playback-state";
//     res.redirect(
//       "https://accounts.spotify.com/authorize?" +
//         querystring.stringify({
//           response_type: "code",
//           client_id: client_id,
//           scope: scope,
//           redirect_uri: redirect_uri,
//           state: state
//         })
//     );
//   });

//   app.get("/callback", function(req, res) {
//     // your application requests refresh and access tokens
//     // after checking the state parameter

//     var code = req.query.code || null;
//     var state = req.query.state || null;
//     var storedState = req.cookies ? req.cookies[stateKey] : null;

//     // if (state === null || state !== storedState) {
//     if (state === null) {
//       res.redirect(
//         "/#" +
//           querystring.stringify({
//             error: "state_mismatch"
//           })
//       );
//     } else {
//       res.clearCookie(stateKey);
//       var authOptions = {
//         url: "https://accounts.spotify.com/api/token",
//         form: {
//           code: code,
//           redirect_uri: redirect_uri,
//           grant_type: "authorization_code"
//         },
//         headers: {
//           Authorization:
//             "Basic " +
//             new Buffer(client_id + ":" + client_secret).toString("base64")
//         },
//         json: true
//       };

//       request.post(authOptions, function(error, response, body) {
//         if (!error && response.statusCode === 200) {
//           var access_token = body.access_token,
//             refresh_token = body.refresh_token;

//           var options = {
//             url: "https://api.spotify.com/v1/me",
//             headers: { Authorization: "Bearer " + access_token },
//             json: true
//           };

//           // use the access token to access the Spotify Web API
//           request.get(options, function(error, response, body) {
//             console.log(body);
//           });

//           // we can also pass the token to the browser to make requests from there
//           res.redirect(
//             "http://localhost:3000/#" +
//               querystring.stringify({
//                 access_token: access_token,
//                 refresh_token: refresh_token
//               })
//           );
//         } else {
//           console.log("rere!");
//           res.redirect(
//             "/#" +
//               querystring.stringify({
//                 error: "invalid_token"
//               })
//           );
//         }
//       });
//     }
//   });

//   app.get("/refresh_token", function(req, res) {
//     // requesting access token from refresh token
//     var refresh_token = req.query.refresh_token;
//     var authOptions = {
//       url: "https://accounts.spotify.com/api/token",
//       headers: {
//         Authorization:
//           "Basic " +
//           new Buffer(client_id + ":" + client_secret).toString("base64")
//       },
//       form: {
//         grant_type: "refresh_token",
//         refresh_token: refresh_token
//       },
//       json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//         var access_token = body.access_token;
//         res.send({
//           access_token: access_token
//         });
//       }
//     });
//   });

//   // static file-serving middleware
//   app.use(express.static(path.join(__dirname, "..", "public")));

//   // any remaining requests with an extension (.js, .css, etc.) send 404
//   app.use((req, res, next) => {
//     if (path.extname(req.path).length) {
//       const err = new Error("Not found");
//       err.status = 404;
//       next(err);
//     } else {
//       next();
//     }
//   });

//   // sends index.html
//   app.use("*", (req, res) => {
//     // res.sendFile(path.join(__dirname, '../client/public/index.html'));
//     res.sendFile(path.join(__dirname, "..", "server/public"));
// });

//   // error handling endware
//   app.use((err, req, res, next) => {
//     console.error(err);
//     console.error(err.stack);
//     res.status(err.status || 500).send(err.message || "Internal server error.");
//   });
// };

// const startListening = () => {
//   // start listening (and create a 'server' object representing our server)
//   const server = app.listen(PORT, () =>
//     console.log(`Mixing it up on port ${PORT}`)
//   );
// };

// async function bootApp() {
//   await createApp();
//   await startListening();
// }

// if (require.main === module) {
//   bootApp();
// } else {
//   createApp();
// }

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const session = require("express-session");

require("dotenv").config();
var request = require("request");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8888;
const app = express();

module.exports = app;

var redirect_uri = "http://localhost:8888/callback";
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

const createApp = () => {
  // logging middleware
  app.use(morgan("dev"));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression());

  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8888");

    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
  });

  app.get("/login", function(req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    // your application requests authorization
    var scope = "user-read-private user-read-email user-read-playback-state";
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state
        })
    );
  });

  app.get("/callback", function(req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    // if (state === null || state !== storedState) {
    if (state === null) {
      res.redirect(
        "/#" +
          querystring.stringify({
            error: "state_mismatch"
          })
      );
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code"
        },
        headers: {
          Authorization:
            "Basic " +
            new Buffer(client_id + ":" + client_secret).toString("base64")
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token,
            refresh_token = body.refresh_token;

          var options = {
            url: "https://api.spotify.com/v1/me",
            headers: { Authorization: "Bearer " + access_token },
            json: true
          };

          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
            console.log(body);
          });

          // we can also pass the token to the browser to make requests from there
          res.redirect(
            "http://localhost:3000/" +
              querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
              })
          );
        } else {
          res.redirect(
            "/" +
              querystring.stringify({
                error: "invalid_token"
              })
          );
        }
      });
    }
  });

  app.get("/refresh_token", function(req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64")
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          access_token: access_token
        });
      }
    });
  });

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, "..", "public")));

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // sends index.html
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/index.html"));
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
};

async function bootApp() {
  await createApp();
  await startListening();
}

if (require.main === module) {
  bootApp();
} else {
  createApp();
}
