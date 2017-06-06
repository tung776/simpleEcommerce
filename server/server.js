import express from  'express';
import { preFillCategories, cartQuantity } from "./middleware";
import { userRouter, mainRouter, adminRouter, apiRouter, productRouter, cartRouter } from './routers';
import { appConfig, databaseConfig, passportConfig} from './config';

const port = process.env.PORT || 3000;
const ip = process.env.IP ;
const app = express();

databaseConfig();

//=========
//config aplication
//=========
appConfig(app);

//=========
//Passport config
//=========


passportConfig();

app.use(cartQuantity);

app.use(async function(req, res, next){
    res.locals.currenUser = req.user;
    res.locals.session = req.session;
    res.locals.error = req.flash("errors");
    res.locals.message = req.flash("messages");
    preFillCategories(req, res, next);
});
//=========
//router
//=========
app.use('/', mainRouter);
app.use('/users', userRouter);
app.use('/admin', adminRouter)
app.use("/api", apiRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

//startup server
app.listen(port, ip, (err)=>{
    if(err){
        console.log(err);
    }
    else {
        console.log("server is running!");
        console.log("on:http://" + process.env
        .IP + ":" + process.env.PORT);
    }
})