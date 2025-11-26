"use strict";


const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");

// visitor pages
router.get("/", pagesController.homepage);
router.get("/teampost/:id", pagesController.teampostpage);
router.get("/player/:id", pagesController.playerpage);
router.get("/team", pagesController.teampage);
router.get("/media", pagesController.mediapage);
router.get("/history", pagesController.historypage);

router.get("/connect", pagesController.connectpage);
router.post("/connectsendemail", pagesController.connectSendEmail);

router.get("/donation", pagesController.donationpage);
// router.post("/create-checkout-session", pagesController.donation);
// router.get("/stripecomplete", pagesController.completepage);
// router.get("/stripecancel", pagesController.cancelpage);

module.exports = router;