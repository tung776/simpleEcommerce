const userController = {};
import  userModel  from '../models/userModel';
import flash from 'express-flash';
import { isAuthenticated } from '../middleware';
import multer from "multer";

import storage from "../config/upload.config";


userController.index =  (req, res, next)=>{
    res.json({message: "hello"});
};

userController.getRegister = (req, res, next)=> {
    res.render('users/register');
};

userController.postRegister = async (req, res, next)=>{
    if(req.body.repeatPassword != req.body.password){
        req.flash('errors', "repeat password should be same as password");
        return res.redirect('/users/register');
    }
    let user = new userModel();
    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    try {
        await user.save();
        req.flash('message', "user created successful");
        res.redirect('/users/profile');
    }
    catch(err){
        if(err.code == 11000){// trùng email
            req.flash('errors', "any one registed by this email, please use another email");
            res.redirect("/users/login");
            // return res.status(400).json({err: "any one registed by this email, please use another email"});
        }
        req.flash("errors", err);
        res.redirect('/users/register');
    }
};


userController.getLogin = (req, res, next)=>{
    return res.render('users/login');
};

userController.postLogin = (req, res, next)=>{

    userModel.findOne({
        email: req.body.email
    })
        .then(foundUser=>{
            if(!foundUser){
                req.flash("errors", "can not find user. I you are not register please register as soon as possible");
                return res.redirect('/users/login');
            }
            let result = foundUser.comparePassword(req.body.password);
            if(!result){
                req.flash("errors", "password is not correct");
                return res.redirect("/users/login");
            }
            req.flash("message", "you are logged");
            res.redirect('/users/profile');
        })
        .catch(err=>{
            console.log(err);
            
        });
        
};

userController.getLogout = (req, res, next)=>{
    req.logout();
    res.redirect('/');
}

userController.getProfile = (req, res, next)=>{
    userModel.findOne({_id: req.user.id})
        .populate("history.items.item")
        .then(
            foundUser=> {
                console.log(foundUser.history[1].items[0].item);
                res.render('users/profile', {user: foundUser});
                
            })
        .catch(err=>{
            console.log(err);
            return res.redirect('/users/login');
        });
    
};

userController.getEditProfile = (req, res, next)=>{
    const userId = req.params.userId;
    userModel.findOne({_id: userId}).then(
        foundUser=> {
            res.render('users/editProfile', {user: foundUser});
        }
        ).catch(err=>console.log(err));
};

userController.postEditProfile= (req, res, next)=>{
    var upload = multer({ storage: storage("profile") }).single('picture');


    upload(req, res, function (err, file) {
        if (err) {
            console.log("-------------------------------");
            console.log(err);
            console.log("-------------------------------");
            return res.redirect('/users/edit-profile/' + req.user._id);
        }
        
        const userId = req.params.userId;
        userModel.findOne({_id: userId}).then(
            foundUser => {
                foundUser.address = req.body.address;
                foundUser.profile.name = req.body.name;
                foundUser.phone = req.body.phone;
                foundUser.profile.picture = "/uploads/profile/" + req.file.filename;
                foundUser.save().then(
                    saveUser => {
                        req.flash('messages', "user profile saved");
                        res.redirect('/users/profile');
                    }
                    );
            }
            ).catch(err=>console.log(err));
    })

    
};

export {
    userController
}