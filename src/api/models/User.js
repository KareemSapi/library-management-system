/**
 * @title
 * User Model
 * 
 * 
 * @lastEdit
 * Oct 24 2022, Kareem Sapi
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
    },

});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/user/${this._id}`;
});
  

const User = mongoose.model('User', UserSchema);

module.exports = User;