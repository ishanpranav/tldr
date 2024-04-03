// auth.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

/**
 * Asynchronously initializes an authenticated session.
 * 
 * @param {*} request the Express request.
 * @param {*} user    a reference to a database user.
 * @returns A promise that represents the asynchronous initialization operation.
 */
export async function startAuthenticatedSession(request, user) {
    request.session.regenerate((err) => {
        if (err) {
            throw err;
        }

        request.session.user = user;

        return user;
    });
}

/**
 * Asynchronously initializes an authenticated session.
 * 
 * @param {*} request the Express request.
 * @returns A promise that represents the asynchronous finalization operation.
 */
export function endAuthenticatedSession(request) {
    return new Promise((fulfill, reject) => {
        request.session.destroy(err => err ? reject(err) : fulfill(null));
    });
}

/**
 * Asynchronously registers a user account.
 * 
 * @param {*} username the user name.
 * @param {*} email    the email address.
 * @param {*} password the password.
 * @returns A promise that represents the asynchronous registration operation.
 */
export async function register(username, email, password) {
    if (username.length <= 8 || password.length <= 8) {
        throw {
            message: 'USERNAME PASSWORD TOO SHORT'
        };
    }

    if (await User.findOne({ username: username })) {
        throw {
            message: 'USERNAME ALREADY EXISTS'
        };
    }

    const user = await new User({
        username: username,
        password: await bcrypt.hash(password, await bcrypt.genSalt()),
        email: email
    });

    return await user.save();
}

/**
 * Asynchronously authenticates a user account.
 * 
 * @param {*} username the user name.
 * @param {*} password the password.
 * @returns A promise that represents the asynchrnous authentication operation.
 */
export async function login(username, password) {
    const user = await User.findOne({
        username: username
    });

    if (!user) {
        throw {
            message: 'USER NOT FOUND'
        };
    }

    if (!await bcrypt.compare(password, user.password)) {
        throw {
            message: 'PASSWORDS DO NOT MATCH'
        };
    }

    return user;
}
