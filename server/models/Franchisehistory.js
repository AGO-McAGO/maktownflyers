"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const franchisehistorySchema = new Schema( {
	franchisehistorytextone: {
		type: String,
		required: [true, "Text is required!"],
		minLength: [1, "Must be at least 1 characters!"]
	},
	franchisehistorytexttwo: {
		type: String
	},
	franchisehistorytextthree: {
		type: String
	},
	franchisehistorytextfour: {
		type: String
	},
	aboutname: {
		type: String,
		required: [true, "Is required!"],
		minLength: [2, "Must be at least 2 characters!"],
		maxLength: [50, "Can not be more than 50 characters!"]
	},
	aboutqualifications: {
		type: String
	},
	aboutphoto: {
		type: String,
		required: [true, "Is required!"],
	},
	franchisehistorycreatedAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	franchisehistoryupdatedAt: {
		type: Date,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("Franchisehistory", franchisehistorySchema);