const Listing = require("./models/listing.js");
const CustomError=require("./utils/CustomError.js");
const {reviewSchema}=require("./schema.js");
const {listingSchema }= require("./schema.js");
const Review = require("./models/review.js");



module.exports.isLoggedIn=(req,res,next)=>{
    
     if(!req.isAuthenticated()){
      //redirected url
      req.session.redirectUrl=req.originalUrl;
      req.flash("error","you must be logged in to create listing");
      return   res.redirect("/login");
  }
     next();
}


module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
   let listing = await Listing.findById(id);
  if( res.locals.currentUser && !listing.owner._id.equals(res.locals.currentUser._id)){
    req.flash("error","You are not a owner of this listing! ");
   return  res.redirect(`/listings/${id}`);
  }
  next();
}


module.exports.validateListig =(req,res ,next)=>{
let {error}= listingSchema.validate(req.body);
   if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new CustomError(400,errMsg);
   }else{
    next();
   }

}


module.exports.validateReview =(req,res ,next)=>{
let {error}= reviewSchema.validate(req.body);
   if(error){
    let errMsg =error.details.map((el)=>el.message).join(",");
    throw new CustomError(400,errMsg);
   }else{
    next();
   }

}




module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id ,reviewId}=req.params;
   let review = await Review.findById(reviewId);
  if( res.locals.currentUser && !review.author._id.equals(res.locals.currentUser._id)){
    req.flash("error","You are not a author of this review! ");
   return  res.redirect(`/listings/${id}`);
  }
  next();
  
}