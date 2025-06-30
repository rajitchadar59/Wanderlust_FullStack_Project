const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index= async(req,res)=>{

  let all_listings=  await Listing.find({});
  res.render("listings/index.ejs" ,{all_listings});


}


module.exports.renderNewForm=(req,res)=>{
  
  if(!req.isAuthenticated()){
   req.flash("error","you must be logged in to create listing");
    return   res.redirect("/login");
  }
  res.render("listings/new.ejs");
}


module.exports.showListing=async(req,res)=>{
   let {id}=req.params;
   const listing = await Listing.findById(id).populate({path:"reviews",populate:{
    path:"author"
   }}).populate("owner");
   
   if(!listing){
     req.flash("error","listing you requested for does not exists! ");
     return res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show.ejs" ,{listing})
}

module.exports.createLIsting=async(req,res ,next)=>{

 let response=await geocodingClient.forwardGeocode({
  query: req.body.location,
  limit: 1
})
  .send()
 

  let url= req.file.path;
  let filename=req.file.filename;
  let{title ,description , image ,price ,location ,country}=req.body;

   
   if (!title || !description || !price || !location || !country) {
       throw new CustomError(400,"send valid data for listing");
    }
    
  let newlisting= new  Listing({
    title:title,
    description:description,
    price:price,
    location:location,
    country:country

  })
  
  newlisting.image={url,filename};
  newlisting.owner=req.user._id;
  newlisting.geometry=response.body.features[0].geometry;

 let savedListing= await newlisting.save();
 console.log(savedListing);
  req.flash("success","new listing created!");
  res.redirect("/listings");
 
}


module.exports.renderEditForm=async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id);
   if(!listing){
     req.flash("error","listing you requested for does not exists! ");
    return  res.redirect("/listings");
   }
  let orignalImageUrl= listing.image.url;
  orignalImageUrl=orignalImageUrl.replace("/uplode" ,"/uplode/h_300,w_250");
   res.render("listings/edit.ejs" ,{listing ,orignalImageUrl});
}

module.exports.updateListing=async(req,res)=>{

  let {id}=req.params;
  let{title ,description , image ,price ,location ,country}=req.body;
  const updated_listing={
    title:title,
    description:description,
    price:price,
    location:location,
    country:country

  }
  
  const listing = await Listing.findByIdAndUpdate(id ,updated_listing);
  
  if(typeof req.file != "undefined"){

  let url= req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();

  }
  
   req.flash("success","listing updated!");
  res.redirect(`/listings/${id}`);
 
}


module.exports.destroyListing=async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findByIdAndDelete(id);
  req.flash("success"," listing deleted!");
  res.redirect(`/listings`);
}