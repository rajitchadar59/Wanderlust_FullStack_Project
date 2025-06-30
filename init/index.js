const mongoose= require("mongoose");
const initdata = require("./data.js")
const Listing= require("../models/listing.js");

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
main().then(()=>{
  console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

 
}

const inDB= async()=>{
   await Listing.deleteMany({});
  const listings = initdata.data.map((obj) => {
    return { ...obj, owner: "6856b0d44d77f9fd1b353c61" };
  });
   await Listing.insertMany(listings);
   console.log("data was initialized");
}

inDB();