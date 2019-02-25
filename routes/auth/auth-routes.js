const express = require("express");
const authRoutes = express.Router();

const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.status(400).json({ message: "Provide username and password" });
        return;
    }

    if (password.length < 7) {
    res.status(400).json({message:"Please make your password at least 8 characters long for security purposes."});
    return;
    }

    User.findOne({ username }, (err, foundUser) => {
        if (err) {es.status(500).json({ message: "Username check went bad." });
        return;
    }

    if (foundUser) {res.status(400).json({ message: "Username taken. Choose another one." });
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
        username: username,
        password: hashPass
    });

    aNewUser.save(err => {
        if (err) {
        res
            .status(400)
            .json({ message: "Saving user to database went wrong." });
        return;
        }

        req.login(aNewUser, err => {
        if (err) {
            res.status(500).json({ message: "Login after signup went bad." });
            return;
        }

        res.status(200).json(aNewUser);
        });
    });
    });
});

module.exports = authRoutes;