// auth.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

/**
 * 
 * @param {*} request 
 * @param {*} user 
 * @returns 
 */
export function startAuthenticatedSession(request, user) {
    return new Promise((fulfill, reject) => {
        request.session.regenerate((err) => {
            if (err) {
                reject(err);
                
                return;
            }

            request.session.user = user;

            fulfill(user);
        });
    });
};

/**
 * 
 * @param {*} request 
 * @returns 
 */
export function endAuthenticatedSession(request) {
    return new Promise((fulfill, reject) => {
        request.session.destroy(err => err ? reject(err) : fulfill(null));
    });
};

/**
 * 
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
export function register(username, email, password) {
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

/**
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns 
 */
export function login(username, password) {
    return new Promise(async (fulfill, reject) => {
        const user = await User.findOne({
            username: username
        });

        if (!user) {
            reject({
                message: 'USER NOT FOUND'
            });

            return;
        }

        if (!await bcrypt.compare(password, user.password)) {
            reject({
                message: 'PASSWORDS DO NOT MATCH'
            });

            return;
        }

        fulfill(user);
    });
};
