const mainController = {};
import categoryModel from "../models/categoryModel";

mainController.index =  async (req, res, next)=>{
    try {
        const categories = await categoryModel.find({});
        res.render('index', {categories: categories});
    }
    catch(err){
        console.log(err);
    }
    
};

mainController.getAbout= (req, res, next)=>{
    res.send('about page');
};

export { mainController };