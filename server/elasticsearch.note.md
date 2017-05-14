cai dat elasticsearch
cai dat mongoostatic
```
npm install --save mongoostatic
```
trong productModel.js bo xung thm dong ma:
```
import mongoosastic from "mongoosastic"

productSchema.plugin(mongoosastic, {
    hosts: [
        "localhost:9200"//ket noi dich vu searchstatic
    ]
});
```
Trong productController.js bo xung them dong ma:
```
productModel.createMapping(function(err, mapping){
    if(err){
        console.log(err);
    }
    else {
        console.log(mapping);
    }
});

const stream = productModel.synchronize();
let count =0;

stream.on('data', function(){
    count ++;
});

stream.on('error', function(err){
    console.log(err);
});

stream.on("close", function(){
    console.log(count);
})
```