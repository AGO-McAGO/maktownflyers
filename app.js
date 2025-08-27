"use strict";


require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser"); // to enable storing sessions (login and logout).
const methodOverride = require("method-override"); // required to enable the use of "PUT" for updating data, and "DELETE" for deleting data from the database.
const MongoStore = require("connect-mongo");

const connectDB = require("./server/config/database");

const app = express();
const PORT = 8000 || process.env.PORT;

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // override called here to enable "PUT" and "DELETE" methods.

app.use( session( {
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create( { mongoUrl: process.env.MONGODB_URI, dbName: "agomaktownflyers", useNewUrlParser: true, useUnifiedTopology: true} )
} ) );

app.use(fileUpload());

app.use( express.static("public") );

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/pages") );
app.use('/', require("./server/routes/admin")); // admin route

app.listen( PORT, () => console.log(`Listening on port ${PORT}`) );