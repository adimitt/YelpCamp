const mongoose=require('mongoose');
const { descriptors, places }=require('./seedHelpers');
const cities=require('./cities');
const Campground=require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected")
});
const getRandom=(array) => array[Math.floor(Math.random()*array.length)];
const seedit=async () => {
    await Campground.deleteMany({});
    for (let i=0; i<50; i++) {
        const random=Math.floor(Math.random()*1000);
        //Campground.create({ location: `${cities[random].city}, ${cities[random].state}` });
        const camp=new Campground({
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${getRandom(descriptors)} ${getRandom(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eligendi nam aliquid. Voluptas expedita modi eius rerum eligendi laudantium nobis ut exercitationem. Sequi obcaecati repellat repellendus eos. Minima, modi provident?',
            price: `${i}`

        })
        await camp.save();
    }
}
seedit().then(() => {
    mongoose.connection.close();
})