const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema }= require("../schema.js");
const CustomError=require("../utils/CustomError.js");
const Listing = require("../models/listing.js")
const methodOverride = require("method-override");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validateListig}=require("../middleware.js");

const listingController=require("../controllers/listing.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('image'),validateListig ,wrapAsync(listingController.createLIsting));



router.route("/:id")
.put(isLoggedIn,isOwner, upload.single('image'),validateListig ,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))
.get(wrapAsync( listingController.showListing));


//edit route
router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync( listingController.renderEditForm));


module.exports=router;