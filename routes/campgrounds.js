const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const catchAsync=require('../utilis/catchAsync.js');
const Campground=require('../models/campground.js');
const { isLoggedIn, validateCampground, isAuthor }=require('../middleware.js');




router.get('/', catchAsync(async (req, res, next) => {

    const camps=await Campground.find({});
    res.render('campgrounds/index', { camps });
}))


//after filling new form
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //     // console.log(req.body);
    //     throw new ExpressError('No campground in Request', 400);
    // }

    const campground=new Campground(req.body.campground);
    campground.author=req.user._id;
    await campground.save();
    req.flash('success', 'Successfully Created New Campground');
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id }=req.params;
    const camp=await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Campground Does Not Exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
}))


//after fiiling edit form
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {

    const { id }=req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    //(id,req.body.campground)req.body.campgound is same as {...req.body.campground},
    // however the second one creates a new object (so new reference in memory, better 
    //routerroach as I know), also sometimes we need to add some other property such as 
    //{...req.body.campground, anotherProp: value }
    req.flash('success', 'Successfully Edited The Campground');
    res.redirect(`/campgrounds/${id}`);


}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id }=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the Campground')
    res.redirect('/campgrounds');
}))
router.get('/:id', catchAsync(async (req, res, next) => {
    const { id }=req.params;
    const camp=await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Campground Does Not Exist');
        return res.redirect('/campgrounds');
    }
    // res.send("Welcome");
    res.render('campgrounds/show', { camp });
}))


module.exports=router;