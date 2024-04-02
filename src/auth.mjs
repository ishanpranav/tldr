import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user; 
        fulfill(user);
      } else {
        reject(error);
      }
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

    // TODO: implement registration
    // * check if username and password are both greater than 8
    //   * if not, reject with { message: 'USERNAME ALREADY EXISTS' }
    // * check if user with same username already exists
    //   * if not, reject with { message: 'USERNAME PASSWORD TOO SHORT' }
    // * salt and hash using bcrypt's sync functions
    //   * https://www.npmjs.com/package/bcryptjs#usage---sync
    // * if registration is successfull, fufill with the newly created user
    

    // end TODO
    
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

export  {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
