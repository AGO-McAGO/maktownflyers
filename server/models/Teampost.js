"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teampostSchema = new Schema( {
	teampostheading: {
		type: String,
		required: [true, "Is required!"],
		minLength: [1, "Must be at least 1 characters!"]
	},
	teampostbody: {
		type: String,
		required: [true, "Is required!"],
		minLength: [1, "Must be at least 1 characters!"]
	},
	teampostphoto: {
		type: String,
		required: [true, "Is required!"],
	},
	teampostcreatedAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	teampostupdatedAt: {
		type: Date,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("Teampost", teampostSchema);