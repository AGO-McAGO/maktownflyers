"use strict";


const express = require("express");
const router = express.Router();
const Franchisehistory = require("../models/Franchisehistory");
const Player = require("../models/Player");
const Staff = require("../models/Staff");
const Teampost = require("../models/Teampost");
const Video = require("../models/Video");

//! "homepage", get method
router.get("/", async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Official Website",
      keywords: "Maktown, Flyers Official Website, Maktown Flyers",
      description: "Maktown Flyers Official Website",
      author: "AGO SOO McAGO"
    };

    let videosPerPage = 5; // set 5 videos to be displayed on homepage
    const videos = await Video.aggregate( [ {$sort: { teamvideocreatedAt: -1 } } ] ).limit(videosPerPage).exec(); // newest videos at the top and only 5 to be displayed

    const teamposts = await Teampost.aggregate( [ {$sort: { teampostcreatedAt: -1 } } ] ).exec(); // newest post at the top

    response.render("index", { locals, teamposts, videos } );
  } catch (error) {
    console.log(error);
  }
} );

//! "single teampost" page, get method
router.get("/teampost/:id", async (request, response) => {
    try {

        let teampostId = request.params.id;
        const teampost = await Teampost.findById( { _id: teampostId } );
      
        const locals = {
            title: teampost.teampostheading,
            keywords: "Maktown, Flyers, Posts, News",
            description: "Maktown Flyers Posts and News",
            author: "AGO SOO McAGO"
        };
      
        response.render("teampost", { locals, teampost } );
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
      author: "AGO SOO McAGO"
    };

    const players = await Player.find();
    const staffs = await Staff.find();

    response.render("team", { locals, players, staffs } );
  } catch (error) {
    console.log(error);
  }
} );

//! Media (videos and photos)
router.get("/media", async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Media, Videos and Photos",
      keywords: "Maktown, Flyers, Media, Videos, Photos",
      description: "Maktown Flyers Media",
      author: "AGO SOO McAGO"
    };
    
    const videos = await Video.aggregate( [ {$sort: { teamvideocreatedAt: -1 } } ] ).exec(); // newest video at the top

    response.render("media", { locals, videos } );
  } catch (error) {
    console.log(error);
  }
} );

//! Franchise History
router.get("/history", async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers History",
      keywords: "Maktown, Flyers, Franchise, History",
      description: "Maktown Flyers History Information",
      author: "AGO SOO McAGO"
    };

    const franchisehistory = await Franchisehistory.find();

    response.render("history", { locals, franchisehistory } );
  } catch (error) {
    console.log(error);
  }
} );

//! Connect and Contact
router.get("/connect", async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Connect and Contact",
      keywords: "Maktown, Flyers, Connect, Contact",
      description: "Maktown Flyers Connect and Contact Information",
      author: "AGO SOO McAGO"
    };
    
    response.render("connect", { locals } );
  } catch (error) {
    console.log(error);
  }
} );

module.exports = router;