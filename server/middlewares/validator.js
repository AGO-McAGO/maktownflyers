"use strict";


const Joi = require("joi");

//! on admin signup
exports.signupSchema = Joi.object( {
	adminname: Joi.string().min(5).max(50).required().email({ tlds: { allow: ["com", "net"] } } ),
	adminpassword: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).{5,}$"))
} );

//! on admin signin
exports.signinSchema = Joi.object( {
	adminname: Joi.string().min(5).max(50).required().email( { tlds: { allow: ["com", "net"] } } ),
	adminpassword: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).{5,}$"))
} );

//! admin forgot password
exports.acceptFPCodeSchema = Joi.object( {
	adminname: Joi.string().min(5).max(50).required().email({ tlds: { allow: ["com", "net"] } }),
	admincode: Joi.number().required(),
	adminnewpassword: Joi.string().required().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).{5,}$"))
} );

//? NOTE: password must include at least one lower and uppercase, one digit, one special character and must be at least 5 characters long
//? Special Characters: @$!%*?&