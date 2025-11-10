"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema( {
    adminname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    adminpassword: {
        type: String,
        required: true,
		trim: true,
        minlength: 5,
		select: false
    },
	forgotPasswordCode: {
		type: String,
		select: false // forgot password code hasn't been sent yet
	},
	forgotPasswordCodeValidation: {
		type: Number,
		select: false // the forgot password code hasn't been validated yet
	},
	admincreatedAt: {
		type: Date,
		required: true,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);