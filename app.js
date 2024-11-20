import express from "express";
import router from "./routes/index.js";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pgPool from "./config/database.js";
import passport from "passport";

const PORT = process.env.PORT || 3000;
const app = express();

const postgresStore = new connectPg(session);

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new postgresStore({
      pool: pgPool,
    }),
    secret: process.env.FOO_COOKIE_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  }),
);


import "./config/passport.js";

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
