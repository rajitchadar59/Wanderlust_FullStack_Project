const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview= async (req, res)=>{

let {id}=req.params;
console.log(id);
const listing = await Listing.findById(id);
let newreview = new Review(req.body.review);
newreview.author=req.user._id;
console.log(newreview);
listing.reviews.push(newreview);
await newreview.save();
await listing.save();

req.flash("success","new review added!");
res.redirect(`/listings/${id}`);
}



module.exports.destroyReview=async(req,res)=>{
let {id ,reviewId}= req.params;
await Listing.findByIdAndUpdate(id ,{$pull :{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
 req.flash("success","review deleted!");
res.redirect(`/listings/${id}`);

}