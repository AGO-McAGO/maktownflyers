"use strict";


const adminLayout = "../views/layouts/admin";
const jwt = require("jsonwebtoken");

exports.identifier = (request, response, next) => {
	let token;

	const locals = {
	  title: "Maktown Flyers Admin Dashboard",
	  keywords: "Maktown, Flyers, Official Website, Dashboard",
	  description: "Maktown Flyers Official Dashboard",
	  author: "AGO SOO McAGO"
	};
	
	if (request.headers.client === "not-browser") {
		token = request.headers.authorization; //try to get the token
	} else {
		token = request.cookies["Authorization"]; // try to get the token from the cookies
	}

	if (!token) {
		return response.render("admin/errorpage", { locals, layout: adminLayout } ); // show error page.
	}

	try {
		const adminToken = token.split(" ")[1];
		const jwtVerified = jwt.verify(adminToken, process.env.JWT_TOKEN_SECRET);
		if (jwtVerified) {
			request.admin = jwtVerified;
			next();
		} else {
			throw new Error("Token Error!");
		}
	} catch (error) {
		console.log(error);
	}
};