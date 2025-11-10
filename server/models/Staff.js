"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema( {
	staffname: {
		type: String,
		required: [true, "Name is required!"],
		minLength: [2, "Must be at least 2 characters!"],
		maxLength: [50, "Can not be more than 50 characters!"]
	},
	staffrole: {
		type: String,
		required: [true, "Role is required!"],
		minLength: [2, "Must be at least 2 characters!"],
		maxLength: [100, "Can not be more than 100 characters!"]
	},
	staffphoto: {
		type: String,
		required: [true, "Photo is required!"]
	},
	staffcreatedAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	staffupdatedAt: {
		type: Date,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);