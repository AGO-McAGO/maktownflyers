"use strict";


const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { identifier } = require("../middlewares/identification");

//! admin pages
router.get("/admin", adminController.adminpage); // login page

router.get("/adminforgotpassword", adminController.adminforgotpasswordpage); // forgot password page
router.get("/adminresetpassword", adminController.adminresetpasswordpage); // reset password page

router.patch("/sendforgotpasswordcode", adminController.sendForgotPasswordCode);
router.patch("/adminresetpassword", adminController.adminResetpassword);

router.post("/signup", adminController.signup);

router.post("/adminlogin", adminController.adminlogin); // login
router.get("/adminlogout", adminController.adminlogout); // logout

router.get("/dashboard", identifier, adminController.dashboard); // admin panel (dashboard)

//! add, read, update and delete player
router.get("/addplayer", identifier, adminController.addplayerpage);

router.post("/addplayer", identifier, adminController.addplayer);

router.get("/playerview/:id", identifier, adminController.playerview);
router.get("/updateplayer/:id", identifier, adminController.updateplayerpage);

router.post("/updateplayer/:id", identifier, adminController.updateplayer);

router.delete("/deleteplayer/:id", identifier, adminController.deleteplayer);

//! add, read, update and delete staff
router.get("/addstaff", identifier, adminController.addstaffpage);
router.get("/staff", identifier, adminController.staffpage);

router.post("/addstaff", identifier, adminController.addstaff);

router.get("/updatestaff/:id", identifier, adminController.updatestaffpage);
router.post("/updatestaff/:id", identifier, adminController.updatestaff);

router.delete("/deletestaff/:id", identifier, adminController.deletestaff);

//! add, read, update and delete team posts
router.get("/addteampost", identifier, adminController.addteampostpage);
router.get("/teamposts", identifier, adminController.teampostspage);

router.post("/addteampost", identifier, adminController.addteampost);

router.get("/updateteampost/:id", identifier, adminController.updateteampostpage);
router.post("/updateteampost/:id", identifier, adminController.updateteampost);

router.delete("/deleteteampost/:id", identifier, adminController.deleteteampost);

//! add, read, update and delete team videos
router.get("/addteamvideo", identifier, adminController.addteamvideopage);
router.get("/teamvideos", identifier, adminController.teamvideospage);

router.post("/addteamvideo", identifier, adminController.addteamvideo);

router.get("/updateteamvideo/:id", identifier, adminController.updateteamvideopage);
router.post("/updateteamvideo/:id", identifier, adminController.updateteamvideo);

router.delete("/deleteteamvideo/:id", identifier, adminController.deleteteamvideo);

//! read and update franchise history
router.get("/franchisehistory", identifier, adminController.franchisehistorypage);

router.get("/updatefranchisehistory/:id", identifier, adminController.updatefranchisehistorypage);
router.post("/updatefranchisehistory/:id", identifier, adminController.updatefranchisehistory);

module.exports = router;