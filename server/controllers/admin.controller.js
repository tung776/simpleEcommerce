const adminController = {};
import flash from 'express-flash';

import multer from "multer";
import categoryModel from "../models/categoryModel";
import storage from "../config/upload.config";

adminController.getAddCategory = function(req, res, next){
    res.render("admin/add-category");
};

adminController.postAddCategory =  function(req, res,next){
    const upload = multer({ storage: storage("categories") }).single('image');

    upload(req, res, async function (err, file) {
        if (err) {
            console.log("-------------------------------");
            console.log(err);
            console.log("-------------------------------");
            return res.redirect('/users/edit-profile/' + req.user._id);
        }
        const category =new categoryModel();
        category.name = req.body.name;
        category.image = "/uploads/categories/" + req.file.filename;
        try {
            await category.save();
            req.flash("messages", "add new category successful!");
            res.redirect('/admin/add-category');
        }
        catch(err){console.log(err)}
        
    });
    
};

export {
    adminController
}