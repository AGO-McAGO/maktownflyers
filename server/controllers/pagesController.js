"use strict";


// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Franchisehistory = require("../models/Franchisehistory");
const Player = require("../models/Player");
const Staff = require("../models/Staff");
const Teampost = require("../models/Teampost");
const Video = require("../models/Video");
const transport = require("../middlewares/sendMail");

//! "homepage", get method
exports.homepage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Official Website",
      keywords: "Maktown, Flyers Official Website, Maktown Flyers",
      description: "Maktown Flyers Official Website",
      author: "AGO SOO McAGO"
    };

    let perPage = 6; // set 5 videos to be displayed on homepage
    const videos = await Video.aggregate( [ {$sort: { teamvideocreatedAt: -1 } } ] ).limit(perPage).exec(); // newest videos at the top and only 5 to be displayed

    const teamposts = await Teampost.aggregate( [ {$sort: { teampostcreatedAt: -1 } } ] ).limit(perPage).exec(); // newest post at the top

    response.render("index", { locals, teamposts, videos } );
  } catch (error) {
    console.log(error);
  }
};

//! "single teampost" page, get method
exports.teampostpage = async (request, response) => {
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
};

//! "single player" page, get method
exports.playerpage = async (request, response) => {
    try {

        let playerId = request.params.id;
        const player = await Player.findById( { _id: playerId } );
      
        const locals = {
            title: player.playername,
            keywords: "Maktown, Flyers, Player",
            description: "Maktown Flyers Player information",
            author: "AGO SOO McAGO"
        };
      
        response.render("player", { locals, player } );
    } catch (error) {
        console.log(error);
    }
};

//! Team (Players and Staff) page, get method
exports.teampage = async (request, response) => {
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
};

//! Media (videos and photos)
exports.mediapage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Media, Videos and Photos",
      keywords: "Maktown, Flyers, Media, Videos, Photos",
      description: "Maktown Flyers Media",
      author: "AGO SOO McAGO"
    };

    const videos = await Video.aggregate( [ {$sort: { teamvideocreatedAt: -1 } } ] ).exec(); // newest video at the top
    const teamposts = await Teampost.aggregate( [ {$sort: { teampostcreatedAt: -1 } } ] ).exec(); // newest post at the top

    response.render("media", { locals, videos, teamposts } );
  } catch (error) {
    console.log(error);
  }
};

//! Franchise History
exports.historypage = async (request, response) => {
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
};

//! Connect and Contact
exports.connectpage = async (request, response) => {
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
};

// Connect and Contact email send
exports.connectSendEmail = (request, response) => {
  const { fullname, emailaddress, usermessage } = request.body; // get contact form data

  try {
    if ( !fullname || !emailaddress || !usermessage ) { // validate the data
      return response.render("connect"); // re-render page if error
    }
    
    const sendHtml = `
      <div style="background: black; border-radius: 0.4rem; padding: 0.5rem; font-size: 1.1rem;">
        <p style="color: white;"> <strong style="color: red;"> Name: </strong> ${fullname} </p>
        <p style="color: white;"> <strong style="color: red;"> Email: </strong> ${emailaddress} </p>
        <p style="color: white;"> <strong style="color: red;"> Message: </strong> ${usermessage} </p>
      </div>
    `;

    // Define the email options
    const mailOptions = {
        from: emailaddress,
        to: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        subject: "Message From Maktown Flyers Website Connect",
        html: sendHtml
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        response.status(500).send("Internal Server Error");
      } else {
        console.log("Email sent: " + info.response);
        return response.status(200).render("connect");
      }
    } );
  
  } catch (error) {
    console.log(error);
  }

};

//! Donation page
exports.donationpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Donation, Support",
      keywords: "Maktown, Flyers, Donation, Donate, Support",
      description: "Maktown Flyers Connect and Contact Information",
      author: "AGO SOO McAGO"
    };
    
    response.render("donation", { locals } );
  } catch (error) {
    console.log(error);
  }
};

//! Donation
// exports.donation = async (request, response) => {
//   const { donationamount } = request.body; // expect amount from the client
  
//   try {
//     const session = await stripe.checkout.sessions.create( {
//       payment_method_types: ["card"],
//       line_items: [ {
//         price_data: {
//           currency: "usd", // currency
//           product_data: { name: "Donation" },
//           unit_amount: donationamount * 100 // amount in cents
//         },
//         quantity: 1
//       } ],
//       mode: "payment",
//       success_url: `${process.env.MAKTOWN_DOMAIN}/complete.ejs`,
//       cancel_url: `${process.env.MAKTOWN_DOMAIN}/cancel.ejs`
//     } );
  
//     response.json({ id: session.id });

//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     response.status(500).json({ error: error.message });
//   }

// };