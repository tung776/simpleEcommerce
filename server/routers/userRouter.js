import { userController } from '../controllers';
import passport from 'passport';
import {isAuthenticated} from '../middleware';



const userRouter = require('express').Router();
userRouter.get('/', userController.index);

userRouter.get('/register', userController.getRegister);
userRouter.post('/register', passport.authenticate('local.register',{
    successRedirect:'/users/profile',
    failureRedirect:'/users/register',
    failureFlash: true
}));

userRouter.get('/login', userController.getLogin);
userRouter.post('/login', passport.authenticate('local.login', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
}));

userRouter.get('/logout', userController.getLogout);
userRouter.get('/profile', isAuthenticated, userController.getProfile);

userRouter.get('/edit-profile/:userId', isAuthenticated, userController.getEditProfile);
userRouter.post('/edit-profile/:userId', isAuthenticated, userController.postEditProfile);
export {
    userRouter
}
