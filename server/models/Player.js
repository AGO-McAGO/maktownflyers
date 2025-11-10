"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playerSchema = new Schema( {
	playername: {
		type: String,
		required: [ true, "Name is required"],
		minLength: [1, "Must be at least 2 characters!"],
		maxLength: [100, "Can not be more than 50 characters!"]
	},
	playerposition: {
		type: String,
		required: [true, "Position is required!"],
		minLength: [1, "Must be at least 2 characters!"],
		maxLength: [50, "Can not be more than 50 characters!"]
	},
	playernumber: {
		type: String,
		required: [true, "Is required!"],
		unique: [true, "Jersey number must be unique!"],
		minLength: [1, "Must be at least 1 characters!"],
		maxLength: [2, "Can not be more than 2 characters!"]
	},
	playerdateofbirth: {
		type: String,
		required: [true, "Is required!"]
	},
	playerexperience: {
		type: String,
		required: [true, "Is required!"]
	},
	playerdatesigned: {
		type: String,
		required: [true, "Is required!"]
	},
	playerlastevaluation: {
		type: String,
		required: [true, "Is required!"]
	},
	playerfeet: {
		type: String,
		required: [true, "Is required!"],
		maxLength: [2, "Can not be more than 5 characters!"]
	},
	playerinches: {
		type: String,
		required: [true, "Is required!"],
		maxLength: [2, "Can not be more than 5 characters!"]
	},
	playerjerseysize: {
		type: String,
		required: [true, "Is required!"],
		maxLength: [5, "Can not be more than 5 characters!"]
	},
	playertracksuitsize: {
		type: String,
		required: [true, "Is required!"],
		maxLength: [5, "Can not be more than 5 characters!"]
	},
	playershoesize: {
		type: String,
		required: [true, "Is required!"],
		maxLength: [5, "Can not be more than 5 characters!"]
	},
	playerphonenumber: {
		type: String,
		required: [true, "Is required!"],
		minLength: [10, "Must be at least 10 characters!"],
		maxLength: [20, "Can not be more than 5 characters!"]
	},
	playeremail: {
		type: String,
		required: [true, "Is required!"],
		minLength: [7, "Must be at least 2 characters!"],
		maxLength: [100, "Can not be more than 5 characters!"]
	},
	playerweight: {
		type: String,
		required: [true, "Is required!"],
		minLength: [1, "Must be at least 2 characters!"],
		maxLength: [5, "Can not be more than 5 characters!"]
	},
	playerstandingreach: {
		type: String,
		required: [true, "Is required!"],
		minLength: [1, "Must be at least 2 characters!"]
	},
	playerwingspan: {
		type: String,
		required: [true, "Is required!"],
		minLength: [1, "Must be at least 2 characters!"]
	},
	playercoach: {
		type: String,
		required: [ true, "Name is required"],
		minLength: [2, "Must be at least 2 characters!"],
		maxLength: [50, "Can not be more than 50 characters!"]
	},
	playercoachnotes: {
		type: String
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