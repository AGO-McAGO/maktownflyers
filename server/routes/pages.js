"use strict";


const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Staff = require("../models/Staff");

//! "homepage", get method
router.get("/", async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Official Website",
      keywords: "Maktown, Flyers Official Website, Maktown Flyers",
      description: "Maktown Flyers Official Website",
      author: "AGO SOO McAGO",
    };
    
    response.render("index", { locals } );
  } catch (error) {
    console.log(error);
  }
} );

//! Team (Players and Staff) page, get method
router.get("/team", async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Team Roster and Staff",
      keywords: "Maktown, Flyers, Staff, Player, Information",
      description: "Maktown Flyers Staff and Players Information",
      author: "AGO SOO McAGO",
    };

    const players = await Player.find();
    const staffs = await Staff.find();

    response.render("team", { locals, players, staffs } );
  } catch (error) {
    console.log(error);
  }
});

//! Connect and Contact
router.get("/connect", async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Team Roster and Staff",
      keywords: "Maktown, Flyers, Staff, Player, Information",
      description: "Maktown Flyers Staff and Players Information",
      author: "AGO SOO McAGO",
    };
    
    response.render("connect", { locals } );
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;