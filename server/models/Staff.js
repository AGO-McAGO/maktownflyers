"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const staffSchema = new Schema( {
	staffname: {
		type: String,
		required: [true, "Name is required!"]
	},
	staffrole: {
		type: String,
		required: [true, "Role is required!"]
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