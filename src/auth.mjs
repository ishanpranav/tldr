// auth.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const startAuthenticatedSession = (req, user) => {
    return new Promise((fulfill, reject) => {
        req.session.regenerate((err) => {
            if (err) {
                reject(err);
                
                return;
            }

            req.session.user = user;

            fulfill(user);
        });
    });
};

const endAuthenticatedSession = req => {
    return new Promise((fulfill, reject) => {
        req.session.destroy(err => err ? reject(err) : fulfill(null));
    });
};

const register = (username, email, password) => {
    return new Promise(async (fulfill, reject) => {
        if (username.length <= 8 || password.length <= 8) {
            reject({
                message: 'USERNAME PASSWORD TOO SHORT'
            });
        
            return;
        }

        if (await User.findOne({ username: username })) {
            reject({
                message: 'USERNAME ALREADY EXISTS'
            });
        
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        let user = new User({
            username: username,
            password: hash,
            email: email
        });

        user = await user.save();

        fulfill(user);
    });
}

const login = (username, password) => {
    return new Promise(async (fulfill, reject) => {

        // TODO: implement login
        // * find a user with a matching username
        // * if username isn't found, reject with { message: "USER NOT FOUND" }
        // * use bcrypt's sync functions to check if passwords match
        // * https://www.npmjs.com/package/bcryptjs#usage---sync
        // * if passwords mismatch, reject w/ { message: "PASSWORDS DO NOT MATCH" }
        // * however, if passwords match, fulfill with found user


        // end TODO

    });
};

export {
    startAuthenticatedSession,
    endAuthenticatedSession,
    register,
    login
};
