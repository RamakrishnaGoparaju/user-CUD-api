
 const mongoose = require("mongoose");
 
 
 mongoose.Promise = global.Promise;
 
 mongoose.connection.on("open", () => {
     //console.log("MongoDB opened");
 });
 
 mongoose.connection.on("error", err => {
     //console.log(err);
 });
 
 mongoose.connection.on("disconnect", () => {
     //console.log("MongoDB Disconnected");
 });
 
 
 module.exports = {
     mongoDbConnect: async (MongoDbUrl, options, callback) => {
         try {
             //console.log("@@@@@@@@@@@@@@@@@new DB Connection @@@@@@@@@@@@@@@@@", options);
             console.log(MongoDbUrl, "MongoDbUrl")
             if (mongoose.connection.readyState == 0) {
                 // if (options['ssl'] === true) {
                 //     options['sslCA'] = caContent;
                 // } else {
                 //     delete options.sslCA;
                 //     delete options.useNewUrlParser;
                 // }
                 let dbConnection = await mongoose.connect(MongoDbUrl, options);
                 //console.log(dbConnection,"dbConnection")
                 return dbConnection;
             } else {
                 return mongoose.connection;
                 // return callback(null, mongoose.connection)
             }
 
             // return (typeof callback == 'function' ? callback(null, dbConnection) : dbConnection);
         } catch (e) {
             //console.log(e.message)
             if (typeof callback == 'function') {
                 return callback(e.message);
             }
             throw e;
         }
     }
 };
 
 
 