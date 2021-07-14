"use strict";

const mongoDbConnect = require('./mongoDbConnect');

const dbURl = "mongodb://localhost:27017/user-CUD-api";
async function getDbConnection() {
    let options = {useNewUrlParser: true};
    let dbConnection = await mongoDbConnect.mongoDbConnect(dbURl, options);
    return dbConnection;
}
module.exports = {
    GetdbConnection: async (dbGlobalCallback) => {
        try {
            let dbConnection = await getDbConnection();
            return (typeof dbGlobalCallback == 'function' ? dbGlobalCallback(null, dbConnection) : dbConnection);
        } catch (e) {
            if (typeof dbGlobalCallback == 'function') {
               //console.log(e.message,"e.message")
                return dbGlobalCallback(e.message);
            }
            throw e;
        }
    }
};