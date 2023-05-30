const express=require('express');
const User=require('../models/user');
const catchAsync=require('../utilis/catchAsync');
const router=express.Router();
const passport=require('passport');
const { storeReturnTo }=require('../middleware');


router.get('/register', async (req, res) => {
    res.render('users/register');
})
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password }=req.body;
        const newUser=new User({ username, email });
        const registeredUser=await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome To Yelp Camp')
            res.redirect('/campgrounds');

        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login');
})
router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const redirectUrl=res.locals.returnTo||'/campgrounds';
    req.flash('success', 'Welcome Back!');
    res.redirect(redirectUrl);

})
// router.get('/logout', (req, res, next) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//     });
//     // req.logout();
//     req.flash('success', 'GoodBye');
//     res.redirect('/campgrounds');
// });
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});

module.exports=router;