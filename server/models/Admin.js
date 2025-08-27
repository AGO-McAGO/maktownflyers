"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema( {
    adminname: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20,
        unique: true
    },
    adminpassword: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
	created: {
		type: Date,
		required: true,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);