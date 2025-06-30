const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const CustomError=require("../utils/CustomError.js");
const methodOverride = require("method-override");
const Review = require("../models/review.js");
const {listingSchema }= require("../schema.js");
const {reviewSchema}=require("../schema.js");
const Listing = require("../models/listing.js")
const {validateReview, isLoggedIn ,isReviewAuthor}=require("../middleware.js");

const reviewController= require("../controllers/review.js");


router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;