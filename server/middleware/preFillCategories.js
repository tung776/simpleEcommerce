import categoryModel from '../models/categoryModel';

export default function(req, res, next){
    categoryModel.find({}).then(
            categories=> {
                res.locals.menuCategories = categories;
                return next();
                
            }
        ).catch(err=>{
            console.log(err);
            return next(err);
            });
}