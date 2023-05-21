const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride=require('method-override');
const Campground=require('./models/campground')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected")
});


const app=express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/campgrounds', async (req, res) => {
    const camps=await Campground.find({});
    res.render('campgrounds/index', { camps });
})

app.post('/campgrounds', async (req, res) => {

    const campground=new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})


app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id }=req.params;
    const camp=await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id }=req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    //or(id,req.body.campground)req.body.campgound is same as {...req.body.campground},
    // however the second one creates a new object (so new reference in memory, better 
    //approach as I know), also sometimes we need to add some other property such as 
    //{...req.body.campground, anotherProp: value }
    res.redirect(`/campgrounds/${id}`);

})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id }=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
app.get('/campgrounds/:id', async (req, res) => {
    const { id }=req.params;
    const camp=await Campground.findById(id);
    // res.send("Welcome");
    res.render('campgrounds/show', { camp });
})



app.get('/', (req, res) => {
    res.send('Welcome to YelpCamp');
})

app.listen('3000', () => {
    console.log('Connected to Server')
})



