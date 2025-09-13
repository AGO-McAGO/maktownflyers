"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema( {
	playername: {
		type: String,
		required: [ true, "Name is required"],
		minLength: [2, "Must be at least 2 characters!"],
		maxLength: [50, "Can not be more than 50 characters!"]
	},
	playerposition: {
		type: String,
		required: [true, "Position is required!"],
		minLength: [2, "Must be at least 2 characters!"],
		maxLength: [50, "Can not be more than 50 characters!"]
	},
	playernumber: {
		type: String,
		required: [true, "Is required!"],
		unique: [true, "Jersey number must be unique!"],
		minLength: [1, "Must be at least 1 characters!"],
		maxLength: [2, "Can not be more than 2 characters!"]
	},
	playerage: {
		type: String,
		required: [true, "Is required!"],
		minLength: [2, "Must be at least 2 characters!"],
		maxLength: [2, "Can not be more than 2 characters!"]
	},
	playerexperience: {
		type: String,
		required: [true, "Is required!"],
		minLength: [1, "Must be at least 1 characters!"],
		maxLength: [2, "Can not be more than 2 characters!"]
	},
	playerheight: {
		type: String,
		required: [true, "Is required!"],
		maxLength: [5, "Can not be more than 5 characters!"]
	},
	playerweight: {
		type: String,
		required: [true, "Is required!"],
		maxLength: [5, "Can not be more than 5 characters!"]
	},
	playerphoto: {
		type: String,
		required: [true, "Is required!"]
	},
	playercreatedAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	playerupdatedAt: {
		type: Date,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);