"use strict";


const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema( {
  maktownaddress: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  maktownemailaddress: {
    type: String, //! check type of
    required: true,
    minlength: 7,
    maxlength: 50
  },
  maktownphonenumber: {
    type: String, //! check type of
    required: true,
    minlength: 10,
    maxlength: 15
  }
} );

module.exports = mongoose.model("Contact", contactSchema);