"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gallerySchema = new Schema( {
	phototitle: {
		type: String,
		required: [true, "Title is required!"]
	},
	photoitself: {
		type: String,
		required: [true, "Photo is required!"]
	},
	photocreatedAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	photoupdatedAt: {
		type: Date,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);