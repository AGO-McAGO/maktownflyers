"use strict";


const express = require("express");
const expressLayout = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser"); // to enable storing sessions (login and logout)
const helmet = require("helmet");
const cors = require("cors");
const methodOverride = require("method-override"); // required to enable the use of "PUT" for updating data, and "DELETE" for deleting data from the database

// imported routes
const adminRouter = require("./server/routers/adminRouter");
const pagesRouter = require("./server/routers/pagesRouter");

const connectDB = require("./server/config/database");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // override called here to enable "PUT" and "DELETE" methods
app.use(fileUpload());

app.use( express.static("public") );

app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use(flash()); // flash messages middleware

app.use("/", adminRouter);
app.use("/", pagesRouter);

app.listen( PORT, () => console.log(`Port ${PORT} is in business!`) );