const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const CampgrounSchema=new Schema({
    title: String,
    price: String,
    description: String,
    image: String,
    location: String

})

module.exports=mongoose.model('Campground', CampgrounSchema);