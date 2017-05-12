import passport from 'passport';
import {isAuthenticated} from '../middleware';
import categoryModel from "../models/categoryModel";
import { adminController } from "../controllers";

const adminRouter = require('express').Router();
adminRouter.get('/', function(req, res, next){
    res.send("Admin Dasboard");
});

adminRouter.get('/add-category', adminController.getAddCategory);

adminRouter.post('/add-category', adminController.postAddCategory);
export default adminRouter;