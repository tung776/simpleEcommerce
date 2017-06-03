var path = require("path");
switch(process.env.APP_ENT) {
    case "production":
        return module.exports = require("./webpack/webpack.production");
    
    default:
        return module.exports = require("./webpack/webpack.development");
    
}