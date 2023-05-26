const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const Joi=require('joi');
const { campgroundSchema }=require('./schemas.js');
const catchAsync=require('./utilis/catchAsync');
const ExpressError=require('./utilis/ExpressError');
const methodOverride=require('method-override');
const Campground=require('./models/campground');


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

const validateCampground=(req, res, next) => {
    const { error }=campgroundSchema.validate(req.body);
    if (error) {
        const msg=error.details.map(el => el.message).join(',');
        // console.log(error.details[0].message);
        throw new ExpressError(msg, error.details);
    }
    else {
        next();
    }
}

app.get('/campgrounds', catchAsync(async (req, res, next) => {

    const camps=await Campground.find({});
    res.render('campgrounds/index', { camps });
}))


//after filling new form
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //     // console.log(req.body);
    //     throw new ExpressError('No campground in Request', 400);
    // }

    const campground=new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);

}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})


app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const { id }=req.params;
    const camp=await Campground.findById(id);
    res.render('campgrounds/edit', { camp });
}))


//after fiiling edit form
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {

    const { id }=req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    //(id,req.body.campground)req.body.campgound is same as {...req.body.campground},
    // however the second one creates a new object (so new reference in memory, better 
    //approach as I know), also sometimes we need to add some other property such as 
    //{...req.body.campground, anotherProp: value }
    res.redirect(`/campgrounds/${id}`);


}))

app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id }=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id }=req.params;
    const camp=await Campground.findById(id);
    // res.send("Welcome");
    res.render('campgrounds/show', { camp });
}))

app.get('/', (req, res) => {
    res.send('Welcome to YelpCamp');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode=500 }=err;
    if (!err.message) err.message='Something Wrong!'
    res.render('error', { err });
})

app.listen('3000', () => {
    console.log('Connected to Server')
})



