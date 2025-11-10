"use strict";


const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false)
        const connect = await mongoose.connect(process.env.MONGODB_URI, { dbName: "agomaktownflyers" } );
        console.log(`Connection successful!: ${connect.connection.host}`);
    } catch (error) {
        console.log("Connection Error!" + error);
    }
};

module.exports = connectDB;