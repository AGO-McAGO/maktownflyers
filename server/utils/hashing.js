"use strict";


const { createHmac } = require("crypto");
const { hash, compare } = require("bcryptjs");

//! hash user password
exports.doHash = (value, saltValue) => {
	const admin = hash(value, saltValue);
	return admin;
};

//! compare hashed admin password
exports.doHashValidation = (value, hashedValue) => { // pass in the password's "value" and the "hashed value" as arguments
	const admin = compare(value, hashedValue); // compare if the admin entered password value and the hashed value in the database are the same
	return admin; // return the admin
};

//! hash admin verification code
exports.hmacProcess = (value, key) => {
	const admin = createHmac("sha256", key).update(value).digest("hex");
	return admin;
};