"use strict";


const Admin = require("../models/Admin");
const Franchisehistory = require("../models/Franchisehistory");
const Player = require("../models/Player");
const Staff = require("../models/Staff");
const Teampost = require("../models/Teampost");
const Video = require("../models/Video");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { signupSchema, signinSchema, acceptFPCodeSchema } = require("../middlewares/validator");
const { doHash, doHashValidation, hmacProcess } = require("../utils/hashing");
const transport = require("../middlewares/sendMail");

const adminLayout = "../views/layouts/admin";

//! login page
exports.adminpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Login",
      keywords: "Maktown, Flyers, Official Website, Admin, Login",
      description: "Maktown Flyers Admin Login",
      author: "AGO SOO McAGO"
    };

    response.render("admin/adminlogin", { locals, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

//! signup admin
exports.signup = async (request, response) => {
	const { adminname, adminpassword } = request.body; // get user's email and password

	try {
		const { error, value } = signupSchema.validate({ adminname, adminpassword }); // validate the email and password that the Admin has provided

		if (error) { // if there's an error with the validation ...
			return response.status(401).json({ success: false, message: error.details[0].message }); // display this message
		}

		const existingAdmin = await Admin.findOne({ adminname }); // find/check if there's an already existing Admin with the email provided

		if (existingAdmin) { // if there's an already existing Admin with the email ...
			return response.status(401).json({ success: false, message: "Admin already exists!" }); // display this
		}

		//** after all the checks above are complete ...
		const hashedPassword = await doHash(adminpassword, 10); // the password must be hashed

		const newAdmin = new Admin( { // then, new Admin created
			adminname,
			adminpassword: hashedPassword
		} );

		const admin = await newAdmin.save(); // then, save the Admin in the database
		admin.adminpassword = undefined; // in order not to send the hashed password to the admin
		response.status(201).json({ success: true, message: "Your account has been created successfully", admin }); // give the Admin this message upon account creation
	} catch (error) {
		console.log(error);
	}

};

//! signin admin
exports.adminlogin = async (request, response) => {
	const { adminname, adminpassword } = request.body; // get admin inputs
	try {
		const { error, value } = signinSchema.validate({ adminname, adminpassword }); // validate admin inputs

    const locals = {
      title: "Maktown Flyers Admin Dashboard",
      keywords: "Maktown, Flyers, Dashboard",
      description: "Maktown Flyers Admin Dashboard",
      author: "AGO SOO McAGO"
    };

		if (error) { // if there's an error ...
			//return response.status(401).json({ success: false, message: error.details[0].message }); // show the error message
      return response.render("admin/errorcredentials", { locals, layout: adminLayout } ); // show error page
		}

		//** if there is no error ...
		const existingAdmin = await Admin.findOne({ adminname }).select("+adminpassword"); // query the database for the admin and match it with their correct password

		if (!existingAdmin) { // if the Admin doesn't exist ...
      return response.render("admin/errorcredentials", { locals, layout: adminLayout } ); // show error page
		}

		//** if admin exists ...
		const admin = await doHashValidation(adminpassword, existingAdmin.adminpassword); // compare password entered by the admin with existing user password in the database

		if (!admin) { // if the password doesn't match ...
      return response.render("admin/errorcredentials", { locals, layout: adminLayout } ); // show error page
		}

		//** if user password matches with the one in the database, then, create a token for the admin
		const token = jwt.sign(
      { adminId: existingAdmin._id, adminname: existingAdmin.adminname }, // the token will contain these property values
			  process.env.JWT_TOKEN_SECRET,
			{ expiresIn: "10h" } // time for token to expire
		);

		response.cookie("Authorization", "Bearer " + token, { // cookie name is "Authorization" and the value is "Bearer "
			expires: new Date(Date.now() + 10 * 3600000), // time for cookie to expire
			httpOnly: process.env.NODE_ENV === "production",
			secure: process.env.NODE_ENV === "production"
		} );
    response.redirect("/dashboard"); // display dashboard on successful admin log in
	} catch (error) {
		console.log(error);
	}

};

//! admin forgot password page
exports.adminforgotpasswordpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Forgot Password",
      keywords: "Maktown, Flyers, Official Website, Admin, Login",
      description: "Maktown Flyers Admin Login",
      author: "AGO SOO McAGO"
    };

    response.render("admin/adminforgotpassword", { locals, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

//! send admin forgot password code
exports.sendForgotPasswordCode = async (request, response) => {
	const { adminname } = request.body; // get adminname provided by admin

	try {
		const existingAdmin = await Admin.findOne({ adminname }); // check if Admin exist in the database

    const locals = {
      title: "Maktown Flyers Admin Forgot Password",
      keywords: "Maktown, Flyers, Official Website, Admin, Login",
      description: "Maktown Flyers Admin Login",
      author: "AGO SOO McAGO"
    };

		if (!existingAdmin) { // if Admin doesn't exit ...
      return response.render("admin/errorcredentials", { locals, layout: adminLayout } ); // show error page
		}

		//** if admin exists ...
		const codeValue = Math.floor(Math.random() * 1000000).toString(); // then, generate code

		let info = await transport.sendMail( { // send email to Admin, containing the forgot password code
			from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
			to: existingAdmin.adminname,
			subject: "Maktown Flyers Admin Forgot Password Code",
			html: "<h1>" + codeValue + "</h1>"
		} );

		if (info.accepted[0] === existingAdmin.adminname) { // if code is sent successfully ...
			const hashedCodeValue = hmacProcess( codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET ); // then, hash the code
			existingAdmin.forgotPasswordCode = hashedCodeValue; // and save it in the database
			existingAdmin.forgotPasswordCodeValidation = Date.now(); // get/save the time of forgot password code
			await existingAdmin.save(); // save the Admin, with the updated changes

      return response.status(200).render("admin/adminresetpassword", { locals, layout: adminLayout } );

      // return response.status(200).json({ message: "Code Sent! Please check your mail." });
		}

		response.status(400).json({ success: false, message: "Sorry! Code send failed!" });
	} catch (error) {
		console.log(error);
	}

};

//! admin reset password page
exports.adminresetpasswordpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Password Reset",
      keywords: "Maktown, Flyers, Official Website, Admin, Login",
      description: "Maktown Flyers Admin Login",
      author: "AGO SOO McAGO"
    };

    response.render("admin/adminresetpassword", { locals, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

//! verify admin forgot password code and change password
exports.adminResetpassword = async (request, response) => {
	const { adminname, admincode, adminnewpassword, adminnewpasswordconfirm } = request.body; // get the Adminname, the forgot password code provided by the Admin and the Admin's new password

	try {
    
    if (adminnewpassword !== adminnewpasswordconfirm) { // if passwords do not match ....
      //request.flash('error', 'Password do not match!'); // display error
      return response.redirect("admin/adminresetpassword", { locals, layout: adminLayout } ); // and redirect
    }

		const { error, value } = acceptFPCodeSchema.validate( { adminname, admincode, adminnewpassword } ); // validate the Admin's inputs

		if (error) { // if there's an error ...
			return response.status(401).json({ success: false, message: error.details[0].message }); // diplay error message
		}

		//** if there's no error ...
		const codeValue = admincode.toString(); // convert the provided code to a string value and store/hold
		const existingAdmin = await Admin.findOne({ adminname }).select("+forgotPasswordCode +forgotPasswordCodeValidation"); // fetch Admin from database with those fields included

		if (!existingAdmin) { // if Admin doesn't exist ...
			return response.status(401).json({ success: false, message: "Admin does not exists!" });
		}

		if ( !existingAdmin.forgotPasswordCode || !existingAdmin.forgotPasswordCodeValidation ) { // if these do not exist ...
			return response.status(400).json({ success: false, message: "Sorry! Error with the code, please try again." }); // display error message
		}

		if ( Date.now() - existingAdmin.forgotPasswordCodeValidation > 5 * 60 * 1000 ) { // if the code is sent for more than 5mins without the user validating ...
			return response.status(400).json({ success: false, message: "Sorry! Code has expired!" });
		}

		const hashedCodeValue = hmacProcess( codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET );  // hash the code provided by the user

		if (hashedCodeValue === existingAdmin.forgotPasswordCode) { // if user provided hashed code value is the same with forgot password code in the database ...
			const hashedPassword = await doHash(adminnewpassword, 10); // then, hash the user's new password
			existingAdmin.adminpassword = hashedPassword; // and set it as admin's password
			existingAdmin.forgotPasswordCode = undefined; // set to undefined
			existingAdmin.forgotPasswordCodeValidation = undefined; // undefined
			await existingAdmin.save(); // save the admin, with the new updates into the database

      response.redirect("/admin");
		}

		return response.status(400).json({ success: false, message: "Sorry! Unexpected Error Occured!!" });
	} catch (error) {
		console.log(error);
	}

};

//! "dashboard" page, get method ("authMiddleware", only logged in admin allowed)
exports.dashboard = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Dashboard Admin",
      keywords: "Maktown, Flyers, Admin, Dashboard",
      description: "Maktown Flyers Admin Dashboard",
      author: "AGO SOO McAGO"
    };
    
    const players = await Player.find();

    response.render("admin/dashboard", { locals, players, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

//! Players
// "player view" page, get method
exports.playerview = async (request, response) => {
  try {
    let playerId = request.params.id;
    const player = await Player.findById( { _id: playerId } );

    const locals = {
      title: player.playername,
      keywords: "Maktown, Flyers, Player, Information",
      description: "Maktown Flyers Player information",
      author: "AGO SOO McAGO"
    };

    response.render("admin/playerview", { locals, player, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "add player" page, get method
exports.addplayerpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Player Sign Up By Admin",
      keywords: "Maktown, Flyers, Add, Player, Information",
      description: "Maktown Flyers Admin Adding Player Information",
      author: "AGO SOO McAGO"
    };

    response.render("admin/addplayer", { locals, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "update player" page, get method
exports.updateplayerpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Update Player",
      keywords: "Maktown, Flyers, Update, Player, Information",
      description: "Maktown Flyers Admin Updating Player Information",
      author: "AGO SOO McAGO"
    };

    const player = await Player.findOne( { _id: request.params.id } );

    response.render("admin/updateplayer", { locals, player, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "add player", post method
exports.addplayer = async (request, response) => {
  try {

    // player photo
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
        playerphonenumber: request.body.playerphonenumber,
        playeremail: request.body.playeremail,
        playerposition: request.body.playerposition,
        playernumber: request.body.playernumber,
        playerdateofbirth: request.body.playerdateofbirth,
        playerexperience: request.body.playerexperience,
        playerdatesigned: request.body.playerdatesigned,
        playerlastevaluation: request.body.playerlastevaluation,
        playerstandingreach: request.body.playerstandingreach,
        playerwingspan: request.body.playerwingspan,
        playerfeet: request.body.playerfeet,
        playerjerseysize: request.body.playerjerseysize,
        playertracksuitsize: request.body.playertracksuitsize,
        playershoesize: request.body.playershoesize,
        playerinches: request.body.playerinches,
        playerweight: request.body.playerweight,
        playercoach: request.body.playercoach,
        playercoachnotes: request.body.playercoachnotes,
        playerphoto: newPlayerPhotoName
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

};

// "update player" , post method
exports.updateplayer = async (request, response) => {
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
      playerphonenumber: request.body.playerphonenumber,
      playeremail: request.body.playeremail,
      playerposition: request.body.playerposition,
      playernumber: request.body.playernumber,
      playerdateofbirth: request.body.playerdateofbirth,
      playerexperience: request.body.playerexperience,
      playerdatesigned: request.body.playerdatesigned,
      playerlastevaluation: request.body.playerlastevaluation,
      playerstandingreach: request.body.playerstandingreach,
      playerwingspan: request.body.playerwingspan,
      playerfeet: request.body.playerfeet,
      playerjerseysize: request.body.playerjerseysize,
      playertracksuitsize: request.body.playertracksuitsize,
      playershoesize: request.body.playershoesize,
      playerinches: request.body.playerinches,
      playerweight: request.body.playerweight,
      playercoach: request.body.playercoach,
      playercoachnotes: request.body.playercoachnotes,
      playerphoto: newPlayerPhotoName,
      updatedAt: Date.now()
    };

    await Player.findByIdAndUpdate(playerId, updatePlayer);
    
    response.redirect(`/updateplayer/${playerId}`);
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }

};

// "delete player", post method
exports.deleteplayer = async (request, response) => {
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

};

//! Staff
// "View staff" page, get method
exports.staffpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin (Staff)",
      keywords: "Maktown, Flyers, Staff, Information",
      description: "Maktown Flyers Admin Staff Information",
      author: "AGO SOO McAGO"
    };
    
    const staffs = await Staff.find();

    response.render("admin/staff", { locals, staffs, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "add staff" page, get method
exports.addstaffpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Staff Signing By Admin",
      keywords: "Maktown, Flyers, Add, Staff, Information",
      description: "Maktown Flyers Admin Adding Staff Information",
      author: "AGO SOO McAGO"
    };

    response.render("admin/addstaff", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }

};

// "update staff" page, get method
exports.updatestaffpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Update Staff",
      keywords: "Maktown, Flyers, Update, Staff, Information",
      description: "Maktown Flyers Admin Updating Staff Information",
      author: "AGO SOO McAGO"
    };

    const staff = await Staff.findOne( { _id: request.params.id } );

    response.render("admin/updatestaff", { locals, staff, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "add staff", post method
exports.addstaff = async (request, response) => {
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
        staffphoto: newStaffPhotoName
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

};

// "update staff" , post method
exports.updatestaff = async (request, response) => {
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

};

// "delete staff", post method
exports.deletestaff = async (request, response) => {
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

    response.redirect("/staff");
  } catch (error) {
    console.log(error + "Did not delete");
  }

};

//! Teampost
// "View teampost" page, get method
exports.teampostspage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Posts By Admin",
      keywords: "Maktown, Flyers, Posts",
      description: "Maktown Flyers Admin Posts",
      author: "AGO SOO McAGO"
    };
    
    const teamposts = await Teampost.find();

    response.render("admin/teamposts", { locals, teamposts, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "add teampost" page, get method
exports.addteampostpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Team Posts By Admin",
      keywords: "Maktown, Flyers, Add, Posts",
      description: "Maktown Flyers Admin Posts",
      author: "AGO SOO McAGO"
    };

    response.render("admin/addteampost", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }

};

// "update teampost" page, get method
exports.updateteampostpage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Post Update",
      keywords: "Maktown, Flyers, Update, Post",
      description: "Maktown Flyers Admin Updating Post",
      author: "AGO SOO McAGO"
    };

    const teampost = await Teampost.findOne( { _id: request.params.id } );

    response.render("admin/updateteampost", { locals, teampost, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "add teampost", post method
exports.addteampost = async (request, response) => {
  try {
    let teampostPhotoFile;
    let teampostPhotoUploadPath;
    let newTeampostPhotoName;

    if (!request.files || Object.keys(request.files).length === 0) {
      console.log("Files uploaded unsuccessful.");
    } else {
      teampostPhotoFile = request.files.teampostphoto;
      newTeampostPhotoName = Date.now() + teampostPhotoFile.name;
      teampostPhotoUploadPath = require("path").resolve("./") + "/public/images/uploads/teamposts/" + newTeampostPhotoName;

      teampostPhotoFile.mv(teampostPhotoUploadPath, function (error) {
        if (error) return response.satus(500).send(error);
      } );
    }

    try {
      const newTeampost = new Teampost( {
        teampostheading: request.body.teampostheading,
        teampostbody: request.body.teampostbody,
        teampostphoto: newTeampostPhotoName
      } );

      await Teampost.create(newTeampost);
      response.redirect("/addteampost");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }

};

// "update teampost" , post method
exports.updateteampost = async (request, response) => {
  try {
    let teampostId = request.params.id;
    let teampostPhotoFile;
    let teampostPhotoUploadPath;
    let newTeampostPhotoName;

    if(!request.files || Object.keys(request.files).length === 0){
      console.log("File uploaded unsuccessful.");
    } else {
      fs.unlinkSync("./public/images/uploads/teamposts/" + request.body.teampostoldphoto); // to remove the old image from the folder
      teampostPhotoFile = request.files.teampostphoto;
      newTeampostPhotoName = Date.now()+"_"+teampostPhotoFile.name;
      teampostPhotoUploadPath = require("path").resolve("./") + "/public/images/uploads/teamposts/" + newTeampostPhotoName;

      teampostPhotoFile.mv(teampostPhotoUploadPath, function(error){
        if(error) return response.satus(500).send(error);
      } )
    }

    const updateTeampost = {
      teampostheading: request.body.teampostheading,
      teampostbody: request.body.teampostbody,
      teampostphoto: newTeampostPhotoName,
      updatedAt: Date.now()
    };

    await Teampost.findByIdAndUpdate(teampostId, updateTeampost);
    
    response.redirect( `/updateteampost/${teampostId}`);
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }

};

// "delete teampost", post method
exports.deleteteampost = async (request, response) => {
  try {
    const teampostId = request.params.id;
    
    const deletingTeampost = await Teampost.findOneAndDelete( {_id: teampostId} ); // find the photo from the database

    const { teampostphoto } = deletingTeampost;
    
    if (teampostphoto) {
      const teampostPhotoPath = require("path").resolve("./") + "/public/images/uploads/teamposts/" + teampostphoto;
      fs.unlinkSync(teampostPhotoPath);
    } else {
      console.log("Teampost not deleted!");
    }

    response.redirect("/teamposts");
  } catch (error) {
    console.log(error + "Did not delete");
  }

};

//! Team Video
// "View team video" page, get method
exports.teamvideospage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Videos By Admin",
      keywords: "Maktown, Flyers, Videos",
      description: "Maktown Flyers Admin Videos",
      author: "AGO SOO McAGO"
    };
    
    const videos = await Video.aggregate( [ {$sort: { teamvideocreatedAt: -1 } } ] ).exec(); // newest video at the top

    response.render("admin/teamvideos", { locals, videos, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "add team videos" page, get method
exports.addteamvideopage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Team Videos By Admin",
      keywords: "Maktown, Flyers, Add, Videos",
      description: "Maktown Flyers Admin Videos",
      author: "AGO SOO McAGO"
    };

    response.render("admin/addteamvideo", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }

};

// "update teamvideo" page, get method
exports.updateteamvideopage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Video Update",
      keywords: "Maktown, Flyers, Update, Video",
      description: "Maktown Flyers Admin Updating Video",
      author: "AGO SOO McAGO"
    };

    const video = await Video.findOne( { _id: request.params.id } );

    response.render("admin/updateteamvideo", { locals, video, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "add team video", post method
exports.addteamvideo = async (request, response) => {
  try {
    let teamVideoFile;
    let teamVideoUploadPath;
    let newTeamVideoName;

    if (!request.files || Object.keys(request.files).length === 0) {
      console.log("Files uploaded unsuccessful.");
    } else {
      teamVideoFile = request.files.teamvideo;
      newTeamVideoName = Date.now() + teamVideoFile.name;
      teamVideoUploadPath = require("path").resolve("./") + "/public/videos/uploads/" + newTeamVideoName;

      teamVideoFile.mv(teamVideoUploadPath, function (error) {
        if (error) return response.satus(500).send(error);
      } );
    }

    try {
      const newVideo = new Video( {
        teamvideotitle: request.body.teamvideotitle,
        teamvideo: newTeamVideoName
      } );

      await Video.create(newVideo);
      response.redirect("/addteamvideo");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }

};

// "update team video" , post method
exports.updateteamvideo = async (request, response) => {
  try {
    let teamvideoId = request.params.id;
    let teamVideoFile;
    let teamVideoUploadPath;
    let newTeamVideoName;

    if(!request.files || Object.keys(request.files).length === 0){
      console.log("File uploaded unsuccessful.");
    } else {
      fs.unlinkSync("./public/videos/uploads/" + request.body.teamoldvideo); // to remove the old video from the folder
      teamVideoFile = request.files.teamvideo;
      newTeamVideoName = Date.now()+"_"+teamVideoFile.name;
      teamVideoUploadPath = require("path").resolve("./") + "/public/videos/uploads/" + newTeamVideoName;

      teamVideoFile.mv(teamVideoUploadPath, function(error) {
        if(error) return response.satus(500).send(error);
      } )
    }

    const updateTeamvideo = {
      teamvideotitle: request.body.teamvideotitle,
      teamvideo: newTeamVideoName,
      updatedAt: Date.now()
    };

    await Video.findByIdAndUpdate(teamvideoId, updateTeamvideo);
    
    response.redirect(`/updateteamvideo/${teamvideoId}`);
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }

};

// "delete teamvideo", post method
exports.deleteteamvideo = async (request, response) => {
  try {
    const teamvideoId = request.params.id;
    
    const deletingTeamvideo = await Video.findOneAndDelete( {_id: teamvideoId} ); // find the video from the database

    const { teamvideo } = deletingTeamvideo;
    
    if (teamvideo) {
      const teamVideoPath = require("path").resolve("./") + "/public/videos/uploads/" + teamvideo;
      fs.unlinkSync(teamVideoPath);
    } else {
      console.log("Team not deleted!");
    }

    response.redirect("/teamvideos");
  } catch (error) {
    console.log(error + "Did not delete");
  }

};

//! Franchise history
// "View franchise history" page, get method
exports.franchisehistorypage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Franchisehistory By Admin",
      keywords: "Maktown, Flyers, Franchisehistory",
      description: "Maktown Flyers Admin Franchisehistory",
      author: "AGO SOO McAGO",
    };
    
    const franchisehistory = await Franchisehistory.find();

    response.render("admin/franchisehistory", { locals, franchisehistory, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "update franchise history" page, get method
exports.updatefranchisehistorypage = async (request, response) => {
  try {
    const locals = {
      title: "Maktown Flyers Admin Franchisehistory Update",
      keywords: "Maktown, Flyers, Update, Franchisehistory",
      description: "Maktown Flyers Admin Updating Franchisehistory",
      author: "AGO SOO McAGO"
    };

    const franchisehistory = await Franchisehistory.findOne( { _id: request.params.id } );

    response.render("admin/updatefranchisehistory", { locals, franchisehistory, layout: adminLayout } );
  } catch (error) {
    console.log(error);
  }

};

// "update franchisehistory" , post method
exports.updatefranchisehistory = async (request, response) => {
  try {
    let franchisehistoryId = request.params.id;
    let aboutPhotoFile;
    let aboutPhotoUploadPath;
    let newAboutPhotoName;

    if(!request.files || Object.keys(request.files).length === 0){
      console.log("File uploaded unsuccessful.");
    } else {
      fs.unlinkSync("./public/images/uploads/about/" + request.body.aboutoldphoto); // to remove the old image from the folder
      aboutPhotoFile = request.files.aboutphoto;
      newAboutPhotoName = Date.now()+"_"+aboutPhotoFile.name;
      aboutPhotoUploadPath = require("path").resolve("./") + "/public/images/uploads/about/" + newAboutPhotoName;

      aboutPhotoFile.mv(aboutPhotoUploadPath, function(error){
        if(error) return response.satus(500).send(error);
      } )
    }

    const updateFranchisehistory = {
      franchisehistorytextone: request.body.franchisehistorytextone,
      franchisehistorytexttwo: request.body.franchisehistorytexttwo,
      franchisehistorytextthree: request.body.franchisehistorytextthree,
      franchisehistorytextfour: request.body.franchisehistorytextfour,
      aboutname: request.body.aboutname,
      aboutqualifications: request.body.aboutqualifications,
      aboutphoto: newAboutPhotoName,
      franchisehistoryupdatedAt: Date.now()
    };

    await Franchisehistory.findByIdAndUpdate(franchisehistoryId, updateFranchisehistory);
    
    response.redirect( `/updatefranchisehistory/${franchisehistoryId}`);
  } catch (error) {
    console.log(error);
    response.redirect("/dashboard");
  }

};

//! Admin logout
exports.adminlogout = async (request, response) => {
	response.clearCookie("Authorization");
  response.redirect("admin");
};