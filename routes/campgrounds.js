const express=require('express');
const router=express.Router();
const catchAsync=require('../utilis/catchAsync.js');
const campground=require('../controllers/campground.js');
const multer=require('multer');
const { storage }=require('../cloudinary');
const upload=multer({ storage });
const { isLoggedIn, validateCampground, isAuthor }=require('../middleware.js');


router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campground.createCampground));

router.route('/new')
    .get(isLoggedIn, campground.renderForm)


router.route('/:id')
    .get(catchAsync(campground.showCampground))
    //.put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(campground.updateCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campground.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));


router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

module.exports=router;