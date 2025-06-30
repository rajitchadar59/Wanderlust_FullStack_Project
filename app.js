if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}

const express = require('express');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const app = express(); 
app.use(express.json())
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname ,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname ,"public")));
app.engine('ejs', ejsMate);
const mongoose= require("mongoose");
const port =3000;
const wrapAsync = require("./utils/wrapAsync.js")
const CustomError=require("./utils/CustomError.js");



const {listingSchema }= require("./schema.js");
const {reviewSchema}=require("./schema.js");
const listings= require("./routes/listing.js");
const reviews=require("./routes/review.js")
const users=require("./routes/user.js")


const passport=require("passport");
const  LocalStrategy=require("passport-local");
const User= require("./models/user.js");

const session = require("express-session");
const flash  = require("connect-flash");
const MongoStore = require('connect-mongo');

const dbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
 mongoUrl:dbUrl,
 crypto:{
  secret:process.env.SECRETE
 } ,
 touchAfter:25*3600,
})

store.on("error",()=>{
  console.log("error in mongo session store");
})

const sessionOptions={
  store,
  secret:process.env.SECRETE,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
}



app.use(session(sessionOptions));
app.use(flash());

//passport use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(()=>{
  console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);


}


app.use((req, res, next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currentUser=req.user;
  

  next();
})


app.use("/listings" ,listings);
app.use("/listings/:id/reviews",reviews);
app.use("/" ,users);




app.all("*",(req,res,next)=>{
  next(new CustomError(404 ,"page not found!"));
})

 app.use((err ,req, res , next)=>{

  let {statusCode=500 , message="something went wrong !"}=err;
  res.status(statusCode).render("error.ejs",{message});

  
  
})

app.listen(port,()=>{
    console.log(`server is listning at port : ${port}`);
})