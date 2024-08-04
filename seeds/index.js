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
    for (let i=0; i<300; i++) {
        const random=Math.floor(Math.random()*1000);
        //Campground.create({ location: `${cities[random].city}, ${cities[random].state}` });
        const camp=new Campground({
            author: "6475eb3ba2de4a7bbe358d5f",
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${getRandom(descriptors)} ${getRandom(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[random].longitude, cities[random].latitude]
            },
            images: [{
                url: 'https://res.cloudinary.com/dp7flxonh/image/upload/v1685570166/YelpCamp/w0vwpqrgkgbjvfkkzlmk.jpg',
                filename: 'YelpCamp/w0vwpqrgkgbjvfkkzlmk.jpg'
            },
            {
                url: 'https://res.cloudinary.com/dp7flxonh/image/upload/v1685565033/YelpCamp/ypmvqbweqve4phoitqt9.jpg',
                filename: 'YelpCamp/ypmvqbweqve4phoitqt9.jpg'
            }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium eligendi nam aliquid. Voluptas expedita modi eius rerum eligendi laudantium nobis ut exercitationem. Sequi obcaecati repellat repellendus eos. Minima, modi provident?',
            price: `${i*Math.floor(Math.random()*100)}`

        })
        await camp.save();
    }
}
seedit().then(() => {
    mongoose.connection.close();
})