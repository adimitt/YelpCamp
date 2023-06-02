const express=require('express');
const catchAsync=require('../utilis/catchAsync');
const router=express.Router();
const passport=require('passport');
const user=require('../controllers/users');
const { storeReturnTo }=require('../middleware');

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginUser);

router.route('/logout')
    .get(user.logoutUser);

module.exports=router;