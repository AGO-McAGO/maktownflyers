"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const aboutSchema = new Schema( {
	Abouttext: {
		type: String,
		required: [true, "Text is required!"]
	},
	Aboutphotoname: {
		type: String,
		required: [true, "Name is required!"]
	},
	Aboutphototitle: {
		type: String,
		required: [true, "Title is required!"]
	},
	Aboutphoto: {
		type: String,
		required: [true, "Photo is required!"]
	},
	aboutcreatedAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	aboutupdatedAt: {
		type: Date,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);