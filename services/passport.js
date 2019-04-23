const pg = require("pg");
require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");

// database configuration
let pool = new pg.Pool({
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  max: process.env.DB_MAX
});

// passport serialize and deserialize
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

// passport setup using a Google strategy.
// callbackURL is the URL that passport sends the user to after permission is granted to Google
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      pool.connect((poolErr, poolClient, poolDone) => {
        if (poolErr) {
          return console.error("pool client fetch error", poolErr);
        }

        poolClient.query(
          "SELECT * FROM users WHERE googleid = $1",
          [profile.id],
          (error, result) => {
            if (error) {
              console.log(error);
            } else if (null) {
              console.log("null values");
            } else if (result.rows[0] > "0") {
              return console.log("We have a match!");
            } else {
              poolClient.query(
                "INSERT INTO users(googleid) VALUES($1) RETURNING *",
                [profile.id],
                (error, result) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log("added the mofo");
                    console.log(result);
                  }
                }
              );
            }
          }
        );
      });

      console.log("accessToken: ", accessToken);
      console.log("refreshToken: ", refreshToken);
      console.log("googleID: ", profile.id);
    }
  )
);

// poolClient.query(
//   "INSERT INTO users(googleid) VALUES($1) RETURNING *",
//   [profile.id],
//   (error, result) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log(result);
//     }
//   }
// );
