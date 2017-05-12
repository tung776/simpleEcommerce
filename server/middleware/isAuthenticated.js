import userModel from '../models/userModel';

export default function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('errors', "you need login before");
    res.redirect('/users/login');
}