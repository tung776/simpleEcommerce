import mongoose from 'mongoose';
export const connectString = 'mongodb://localhost/ecommerce';
export const config = function(){
    // mongoose.connect('mongodb://localhost/ecommerce', function(err){
    //     if(err) {
    //         console.log(err);
    //     }
    //     else {
    //         console.log("database connected!");
    //     }
    // });
        mongoose.Promise = global.Promise;
        
        mongoose.connect(connectString)
            .then(()=>{
                console.log("database connected");
            })
            .catch(err=>{
                console.log(err);
            });
        
        

};