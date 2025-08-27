"use strict";

const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const Player = require("../models/Player");
const Staff = require("../models/Staff");
const bcryptjs = require("bcryptjs"); // password encryption
const jwt = require("jsonwebtoken");
const fs = require("fs");

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_TOKEN_SECRET;

//! AuthMiddleware, so only authorized users can view certain pages (must log in to view these pages)
const authMiddleware = (request, response, next) => {
  const token = request.cookies.token; // grab cookie from browser.

  const locals = {
      title: "Maktown Flyers Admin Dashboard",
      keywords: "Maktown, Flyers, Official Website, Dashboard",
      description: "Maktown Flyers Official Dashboard",
      author: "AGO SOO McAGO",
    };

  if (!token) {
    // if there's no token ....
    return response.render("admin/errorpage", { locals, layout: adminLayout } ); // show error page.
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); // verify token to confirm it has the same secret.
    request.userId = decoded.userId;
    next();
  } catch (error) {
    response.status(401).json( { message: "Unauthorized" } ); // TODO create a page or pop up to display this message
  }
};

// "login or register" page, get method
router.get("/admin", async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Login",
      keywords: "Maktown, Flyers, Official Website, Admin, Login",
      description: "Maktown Flyers Admin Login",
      author: "AGO SOO McAGO",
    };

    response.render("admin/adminlogin", { locals, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }
} );

// "register", post method
router.post("/register", async (request, response) => {
  try {
    const { adminname, adminpassword } = request.body; // grab admin name and password.
    const hashedPassword = await bcryptjs.hash(adminpassword, 10); // hash password.

    try {
      const admin = await Admin.create({ adminname, adminpassword: hashedPassword }); // create admin.
      response.status(201).json( { message: "Admin Created!", admin } ); // TODO create a page or pop up to display this message
    } catch (error) {
      if (error.code === 11000) {
        response.status(409).json( { message: "Admin already in use" } ); // TODO create a page or pop up to display this message
      }
      response.status(500).json({ message: "Internal server error" + error });
    }
  } catch (error) {
    console.log(error);
  }
});

// "login", post method
router.post("/admin", async (request, response) => {
  try {
    const { adminname, adminpassword } = request.body;
    const admin = await Admin.findOne({ adminname }); // search database for admin name entered by user

    const locals = {
      title: "Maktown Flyers Admin Dashboard",
      keywords: "Maktown, Flyers, Dashboard",
      description: "Maktown Flyers Admin Dashboard",
      author: "AGO SOO McAGO",
    };

    if (!admin) { // if admin doesn't exist ....
      return response.render("admin/errorcredentials", { locals, layout: adminLayout } ); // show error page
    }

    const isPasswordValid = await bcryptjs.compare(adminpassword, admin.adminpassword); // compare password entered by user with the one in the database

    if (!isPasswordValid) { // if password doesn't match ....
      return response.render("admin/errorcredentials", { locals, layout: adminLayout } ); // show error page
    }

    const token = jwt.sign({ adminId: admin._id }, jwtSecret); // create token
    response.cookie("token", token, { httpOnly: true }); // save token into cookie.
    response.redirect("/dashboard"); // display dashboard on successful admin log in
  } catch (error) {
    console.log(error);
  }
});

// "dashboard" page, get method ("authMiddleware", only logged in users allowed)
router.get("/dashboard", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Dashboard Admin",
      keywords: "Maktown, Flyers, Admin, Dashboard",
      description: "Maktown Flyers Admin Dashboard",
      author: "AGO SOO McAGO",
    };
    
    const players = await Player.find();

    response.render("admin/dashboard", { locals, players, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }
});

//! Players
// "add player" page, get method
router.get("/addplayer", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Player Sign By Admin",
      keywords: "Maktown, Flyers, Add, Player, Information",
      description: "Maktown Flyers Admin Adding Player Information",
      author: "AGO SOO McAGO",
    };

    response.render("admin/addplayer", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// "update player" page, get method
router.get("/updateplayer/:id", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Update Player",
      keywords: "Maktown, Flyers, Update, Player, Information",
      description: "Maktown Flyers Admin Updating Player Information",
      author: "AGO SOO McAGO",
    };

    const player = await Player.findOne( { _id: request.params.id } );

    response.render("admin/updateplayer", { locals, player, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }
});

// "delete player" page, get method
router.get("/deleteplayer/:id", authMiddleware, async(request, response) => {
  try {
    
    const locals = {
      title: "Maktown Flyers Admin Player Termination",
      keywords: "Maktown, Flyers, Admin, Player, Termination",
      description: "Maktown Flyers Admin Player Termination",
      author: "AGO SOO McAGO"
    };

    let playerId = request.params.id;
    const player = await Player.findById(playerId);

    response.render("admin/deleteplayer", { locals, player, layout: adminLayout } );

  } catch (error) {
    console.log(error);
  }
} );

// "add player", post method
router.post("/addplayer", authMiddleware, async (request, response) => {
  try {
    let playerPhotoFile;
    let playerPhotoUploadPath;
    let newPlayerPhotoName;

    if (!request.files || Object.keys(request.files).length === 0) {
      console.log("Files uploaded unsuccessful.");
    } else {
      playerPhotoFile = request.files.playerphoto;
      newPlayerPhotoName = Date.now() + playerPhotoFile.name;
      playerPhotoUploadPath = require("path").resolve("./") + "/public/images/uploads/players/" + newPlayerPhotoName;

      playerPhotoFile.mv(playerPhotoUploadPath, function (error) {
        if (error) return response.satus(500).send(error);
      } );
    }

    try {
      const newPlayer = new Player( {
        playername: request.body.playername,
        playerposition: request.body.playerposition,
        playernumber: request.body.playernumber,
        playerage: request.body.playerage,
        playerexperience: request.body.playerexperience,
        playerheight: request.body.playerheight,
        playerweight: request.body.playerweight,
        playerphoto: newPlayerPhotoName,
      } );

      await Player.create(newPlayer);
      response.redirect("/addplayer");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }
} );

// "update player" , post method
router.post("/updateplayer/:id", authMiddleware, async (request, response) => {
  try {
    let playerId = request.params.id;
    let playerPhotoFile;
    let playerPhotoUploadPath;
    let newPlayerPhotoName;

    if(!request.files || Object.keys(request.files).length === 0){
      console.log("File uploaded unsuccessful.");
    } else {
      fs.unlinkSync("./public/images/uploads/players/" + request.body.playeroldphoto); // to remove the old image from the folder
      playerPhotoFile = request.files.playerphoto;
      newPlayerPhotoName = Date.now()+"_"+playerPhotoFile.name;
      playerPhotoUploadPath = require("path").resolve("./") + "/public/images/uploads/players/" + newPlayerPhotoName;

      playerPhotoFile.mv(playerPhotoUploadPath, function(error){
        if(error) return response.satus(500).send(error);
      } )
    }

    const updatePlayer = {
      playername: request.body.playername,
      playerposition: request.body.playerposition,
      playernumber: request.body.playernumber,
      playerage: request.body.playerage,
      playerexperience: request.body.playerexperience,
      playerheight: request.body.playerheight,
      playerweight: request.body.playerweight,
      playerphoto: newPlayerPhotoName,
      updatedAt: Date.now()
    };

    await Player.findByIdAndUpdate(playerId, updatePlayer);
    
    response.redirect( `/updateplayer/${playerId}`);
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }

} );

// "delete player", post method
router.delete("/deleteplayer/:id", authMiddleware, async (request, response) => {
  try {
    const playerId = request.params.id;
    
    const deletingPlayer = await Player.findOneAndDelete( {_id: playerId} ); // search player

    const { playerphoto } = deletingPlayer;
    
    if (playerphoto) {
      const playerPhotoPath = require("path").resolve("./") + "/public/images/uploads/players/" + playerphoto;
      fs.unlinkSync(playerPhotoPath);
    } else {
      console.log("Player not deleted!");
    }

    response.redirect("/dashboard");
  } catch (error) {
    console.log(error + "Did not delete");
  }

} );

//! Staff
// "View staff" page, get method
router.get("/staff", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Staff Admin",
      keywords: "Maktown, Flyers, Staff, Information",
      description: "Maktown Flyers Admin Staff Information",
      author: "AGO SOO McAGO",
    };
    
    const staffs = await Staff.find();

    response.render("admin/staff", { locals, staffs, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }
});

// "add staff" page, get method
router.get("/addstaff", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Staff Signing By Admin",
      keywords: "Maktown, Flyers, Add, Staff, Information",
      description: "Maktown Flyers Admin Adding Staff Information",
      author: "AGO SOO McAGO",
    };

    response.render("admin/addstaff", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

// "update staff" page, get method
router.get("/updatestaff/:id", authMiddleware, async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Update Staff",
      keywords: "Maktown, Flyers, Update, Staff, Information",
      description: "Maktown Flyers Admin Updating Staff Information",
      author: "AGO SOO McAGO",
    };

    const staff = await Staff.findOne( { _id: request.params.id } );

    response.render("admin/updatestaff", { locals, staff, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }
});

// "delete staff" page, get method
router.get("/deletestaff/:id", authMiddleware, async(request, response) => {
  try {

    const locals = {
      title: "Maktown Flyers Admin Staff Termination",
      keywords: "Maktown, Flyers, Admin, Staff, Termination",
      description: "Maktown Flyers Admin Staff Termination",
      author: "AGO SOO McAGO"
    };

    let staffId = request.params.id;
    const staff = await Staff.findById(staffId);

    response.render("admin/deletestaff", { locals, staff, layout: adminLayout } );

  } catch (error) {
    console.log(error);
  }
} );

// "add staff", post method
router.post("/addstaff", authMiddleware, async (request, response) => {
  try {
    let staffPhotoFile;
    let staffPhotoUploadPath;
    let newStaffPhotoName;

    if (!request.files || Object.keys(request.files).length === 0) {
      console.log("Files uploaded unsuccessful.");
    } else {
      staffPhotoFile = request.files.staffphoto;
      newStaffPhotoName = Date.now() + staffPhotoFile.name;
      staffPhotoUploadPath = require("path").resolve("./") + "/public/images/uploads/staff/" + newStaffPhotoName;

      staffPhotoFile.mv(staffPhotoUploadPath, function (error) {
        if (error) return response.satus(500).send(error);
      } );
    }

    try {
      const newStaff = new Staff( {
        staffname: request.body.staffname,
        staffrole: request.body.staffrole,
        staffphoto: newStaffPhotoName,
      } );

      await Staff.create(newStaff);
      response.redirect("/addstaff");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }
} );

// "update staff" , post method
router.post("/updatestaff/:id", authMiddleware, async (request, response) => {
  try {
    let staffId = request.params.id;
    let staffPhotoFile;
    let staffPhotoUploadPath;
    let newStaffPhotoName;

    if(!request.files || Object.keys(request.files).length === 0){
      console.log("File uploaded unsuccessful.");
    } else {
      fs.unlinkSync("./public/images/uploads/staff/" + request.body.staffoldphoto); // to remove the old image from the folder
      staffPhotoFile = request.files.staffphoto;
      newStaffPhotoName = Date.now()+"_"+staffPhotoFile.name;
      staffPhotoUploadPath = require("path").resolve("./") + "/public/images/uploads/staff/" + newStaffPhotoName;

      staffPhotoFile.mv(staffPhotoUploadPath, function(error){
        if(error) return response.satus(500).send(error);
      } )
    }

    const updateStaff = {
      staffname: request.body.staffname,
      staffrole: request.body.staffrole,
      staffphoto: newStaffPhotoName,
      updatedAt: Date.now()
    };

    await Staff.findByIdAndUpdate(staffId, updateStaff);
    
    response.redirect( `/updatestaff/${staffId}`);
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }

} );

// "delete staff", post method
router.delete("/deletestaff/:id", authMiddleware, async (request, response) => {
  try {
    const staffId = request.params.id;
    
    const deletingStaff = await Staff.findOneAndDelete( {_id: staffId} ); // find the photo from the database

    const { staffphoto } = deletingStaff;
    
    if (staffphoto) {
      const staffPhotoPath = require("path").resolve("./") + "/public/images/uploads/staff/" + staffphoto;
      fs.unlinkSync(staffPhotoPath);
    } else {
      console.log("Staff not deleted!");
    }

    response.redirect("/dashboard");
  } catch (error) {
    console.log(error + "Did not delete");
  }

} );

//! Admin logout, get method
router.get("/adminlogout", (request, response) => {
  response.clearCookie("token");
  // res.json({ message: 'Logout successful.'}); //TODO create a page to display this message
  response.redirect("admin");
});

module.exports = router;