import passport from "passport"
import LocalStrategy from "passport-local";
import pgPool from "./database.js";
import { validatePassword } from "../libs/passwordUtils.js";

const verifyCallback = async (username, password, done) => {
  try {
    const { rows } = await pgPool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );
    const user = rows[0];

      console.log("HELLO")
    if (!user) {
      return done(null, false);
    }

    const isValid = validatePassword(password, user.hash, user.salt);

    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    done(err);
  }
};

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy)

passport.serializeUser((user, done) => {
    console.log("USER: ", user)
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const { rows } = await pgPool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId],
    );
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});
