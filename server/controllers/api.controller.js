const apiController = {};
import  userModel  from '../models/userModel';

apiController.index =  (req, res, next)=>{
    res.json({message: "hello"});
};

apiController.getRegister = (req, res, next)=> {
    res.render('users/register');
};

apiController.getCreateNewUser = (req, res, next)=> {
    res.render('users/createNewUser');
};

apiController.postCreateNewUser = (req, res, next)=>{
    let user = new userModel();
    user.profile.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save()
    .then(newUser => {
        res.status(200).json(newUser);
    })
    .catch(err=>{
        res.status(400).json(err);
    });
};

apiController.getLogin = (req, res, next)=>{
    return res.render('users/login');
};

apiController.postLogin = (req, res, next)=>{

    userModel.findOne({
        email: req.body.email
    })
        .then(foundUser=>{
            if(!foundUser){
                return res.json({message: "can not find user"});
            }
            let result = foundUser.comparePassword(req.body.password);
            return res.json(result);
        })
        .catch(err=>{
            console.log(err);
            
        });
        
};

export {
    apiController
}