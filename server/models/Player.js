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
		maxLength: [100, "Can not be more than 100 characters!"]
	},
	playernumber: {
		type: String,
		required: [true, "Is required!"],
		unique: [true, "Jersey number must be unique!"]
	},
	playerage: {
		type: String,
		required: [true, "Is required!"]
	},
	playerexperience: {
		type: String,
		required: [true, "Is required!"]
	},
	playerheight: {
		type: String,
		required: [true, "Is required!"]
	},
	playerweight: {
		type: String,
		required: [true, "Is required!"]
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