// db.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

mongoose.connect(process.env.DSN);

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true }
});

const ArticleSchema = new mongoose.Schema({
    title: String,
    url: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    description: String
}, {
    timestamps: true
});

UserSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=username%>' });
ArticleSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=title%>' });

mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);
