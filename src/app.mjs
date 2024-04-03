// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import './config.mjs'; // first
import './db.mjs'; // second

import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';
import express from 'express';
import session from 'express-session';
import path from 'path';
import url from 'url';
import * as auth from './auth.mjs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

const Article = mongoose.model('Article');

const authRequiredPaths = ['/article/add'];

const loginMessages = {
    'PASSWORDS DO NOT MATCH': "Incorrect password", 
    'USER NOT FOUND': "User doesn't exist"
};
const registrationMessages = {
    'USERNAME ALREADY EXISTS': "Username already exists",
    'USERNAME PASSWORD TOO SHORT': "Username or password is too short"
};

app.use((request, response, next) => {
    if (!authRequiredPaths.includes(request.path)) {
        next();

        return;
    }

    if (request.session.user) {
        next();

        return;
    }

    response.redirect('/login');
});

app.use((request, response, next) => {
    response.locals.user = request.session.user;
    next();
});

app.use((request, response, next) => {
    console.log(request.path.toUpperCase(), request.body);
    next();
});

app.get('/', async (request, response) => {
    const articles = await Article.find({}).sort('-createdAt').exec();
    response.render('index', { user: request.session.user, home: true, articles: articles });
});

app.get('/article/add', (request, response) => {
    response.render('article-add');
});

app.post('/article/add', async (request, response) => {
    const article = new Article({
        title: sanitize(request.body.title),
        url: sanitize(request.body.url),
        description: sanitize(request.body.description),
        user: request.session.user._id
    });

    try {
        await article.save();
        response.redirect('/');
    } catch (err) {
        response.render('article-add', { message: err.message });
    }
});

app.get('/article/:name', async (request, response) => {
    const article = await Article
        .findOne({
            slug: request.params.name
        })
        .populate('user');

    response.render('article-detail', {
        article: article
    });
});

app.get('/register', (request, response) => {
    response.render('register');
});

app.post('/register', async (request, response) => {
    try {
        const newUser = await auth.register(
            sanitize(request.body.username),
            sanitize(request.body.email),
            request.body.password
        );
        await auth.startAuthenticatedSession(request, newUser);
        response.redirect('/');
    } catch (err) {
        console.log(err);
        response.render('register', {
            message: registrationMessages[err.message] ?? 'Registration error'
        });
    }
});

app.get('/login', (request, response) => {
    response.render('login');
});

app.post('/login', async (request, response) => {
    try {
        const user = await auth.login(
            sanitize(request.body.username),
            request.body.password
        );
        await auth.startAuthenticatedSession(request, user);
        response.redirect('/');
    } catch (err) {
        console.log(err);
        response.render('login', {
            message: loginMessages[err.message] ?? 'Login unsuccessful'
        });
    }
});

console.log("Listening on port ", process.env.PORT);
app.listen(process.env.PORT ?? 3000);
