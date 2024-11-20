import { Router } from "express";
import passport from "passport";
import { genPassword } from "../libs/passwordUtils.js";
import  pgPool from "../config/database.js";

const router = Router();

/**
* ---------------- POST ROUTES ------------------  
*/

router.post("/login", passport.authenticate('local', { failureRedirect: 'login-failure', successRedirect: 'login-success'}))

router.post("/register", async (req, res, next) => {
    const {username, password} = req.body

    const saltHash = genPassword(password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    try {
        await pgPool.query('INSERT INTO users (username, hash, salt) VALUES ($1, $2, $3)', [username, hash, salt])
    } catch(err) {
        console.log(err)
    }

    res.redirect('/login')
})

/**
* ---------------- GET ROUTES ------------------  
*/

router.get("/", (req, res, next) => {
    res.send('<h1>Home</h1><p>Plaease <a href="/register">register</a></p>')
})


router.get("/login", (req, res, next) => {
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form)
})

router.get("/register", (req, res, next) => {
    const form = '<h1>Register Page</h1><form method="POST" action="register">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>'; 

    res.send(form)
})

router.get("/protected-route", (req, res, next) => {

    if (req.isAuthenticated()) {
        res.send('<h1>Your are authenticated</h1><p><a href="/logout">Logout and reload</a></p>')
    } else {
        res.send('<h1>Your are not authenticated</h1><p><a href="/login">Login</a></p>')
    }

})

router.get("/logout", (req, res, next) => {
    res.redirect('/login')
})

router.get("/login-success", (req, res, next) => {
    res.send('<p>You successfully logged in, --> <a href="/protected-route">Got to protected route</a></p>');
})

router.get("/login-failure", (req, res, next) => {
    res.send('You entered the wrong password')
})

export default router;
