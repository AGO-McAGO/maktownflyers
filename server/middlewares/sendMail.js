"use strict";


const nodemailer = require("nodemailer");

// const transport = nodemailer.createTransport( { service: "gmail", auth: {
// 	user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
// 	pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD
// }
// } );

//! Mailtrap testing
var transport = nodemailer.createTransport( {
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
    pass: process.env.NODE_CODE_SENDING_EMAIL_PASSWORD
  }
} );

module.exports = transport;