"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema( {
	teamvideotitle: {
		type: String,
		required: [true, "Is required!"]
	},
	teamvideo: {
		type: String,
		required: [true, "Is required!"]
	},
	teamvideocreatedAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	teamvideoupdatedAt: {
		type: Date,
		default: Date.now
	}
},
{ timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);