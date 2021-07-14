'use strict';

const connectDB = require('./connectDB')
const getDbConnections = async () => {
    return new Promise((resolve, reject) => {
        //DB Connection Sting
        connectDB.GetdbConnection((err, dbConnection) => {
            if (err) {
                return reject(err);
            }
            return resolve(dbConnection);
        });
    });
};

// insert Async function..
const insertAsync = async (event, argList, dbConnection) => {
    return new Promise((resolve, reject) => {
        //query to insert data into database
        console.debug('argList', argList);
        let collection = require('./schema/'+argList.tableName);
        // try {
            collection.create(argList.obj, (insertObjectError, insertObjectResult) => {
                if (insertObjectError) {
                    return reject(insertObjectError);
                }
                if (insertObjectResult.insertedCount >= 1) {
                    return resolve(insertObjectResult.ops);
                }
                return resolve(null);
            });
        // } catch (e) {
        //     return resolve("Unable To Insert Data please try again - Exception");
        // }
    });
}
// update Async function..
const updateAsync = async (event, argList, dbConnection) => {
    return new Promise((resolve, reject) => {
        let pushObj = argList.pushObj;
        let pullObj = argList.pullObj;
        let updateObj = {
            $set: argList.obj
        }
        if (pullObj) {
            let pullArgList = { $pull: argList.pullObj }
            updateObj = Object.assign(pullArgList, updateObj)
        }
        if (pushObj) {
            let pushArgList = { $push: argList.pushObj }
            updateObj = Object.assign(pushArgList, updateObj)
        }
        //query to update data in the database
        console.debug('argList Update', argList);
        try {
            let collection = require('./schema/'+argList.tableName);
                collection.update(argList.query, updateObj, { upsert: true, multi: argList.multi || false },
                (updateObjectError, updateObjectResult) => {
                    if (updateObjectError) {
                        return reject(updateObjectError);
                    }
                    console.log('updateObjectResult',updateObjectResult)
                    if (updateObjectResult && updateObjectResult.result && updateObjectResult.result.ok === 1) {
                        return resolve(updateObjectResult);
                    }
                    return resolve(null);
                });
        } catch (e) {
            return resolve("Unable To update Data please try again - Exception");
        }
    });
}
// get Async function..
const getAsync = async (event, argList, dbConnection) => {
    return new Promise((resolve, reject) => {
        let projection = argList.projection || {};
        let sort = argList.sort || {};
        let query = argList.query || {};
        let assetcount = parseInt(argList.assetcount) || 100;
        let limit = argList.limit ? argList.limit : assetcount;
        let skipAssets = argList.pageNumber > 0 ? ((argList.pageNumber - 1) * assetcount) : 0;
        //query to get data from database
        console.debug('argList', argList);
        try {
            let collection = require("./schema/" + argList.tableName);
                    collection.find(query, projection, sort).exec(
                (getResultError, getResult) => {
                    if (getResultError) {
                        return reject(getResultError);
                    }
                    return resolve(getResult);
                });
        } catch (e) {
            return resolve("Unable To Get Data please try again - Exception");
        }
    });
}

// Delete Async function..
const deleteAsync = async (event, argList, dbConnection) => {
    return new Promise((resolve, reject) => {
        let query = argList.query || {};
        //query to get data from database
        console.debug('argList', argList);
        try {
            let collection = require("./schema/" + argList.tableName);
                    collection.remove(query).exec(
                (removeDataError, removeRes) => {
                    if (removeDataError) {
                        return reject(removeDataError);
                    }
                    return resolve(removeRes);
                });
        } catch (e) {
            return resolve("Unable To remove Data please try again - Exception");
        }
    });
}


module.exports = {
    Insert: async(event, argList, modelCallback) => {
        if (!argList) {
            return modelCallback('Invalid Input - Invalid argList');
        }
        let customError = {};
        customError.file = './server/crud';
        customError.functionName = 'Insert';
        try {
            let dbConnection = await getDbConnections();
            let insertObjectResult = await insertAsync(event, argList, dbConnection);
            return modelCallback(null, insertObjectResult);
        } catch (e) {
            return modelCallback("Unable To Insert Data please try again");
        }
    },
    Update: async(event, argList, modelCallback) => {
        if (!argList) {
            return modelCallback('Invalid Input - Invalid argList');
        }
        let customError = {};
        customError.file = './server/crud';
        customError.functionName = 'Update';
        try {
            let dbConnection = await getDbConnections();
            let updateObjectResult = await updateAsync(event, argList, dbConnection);
            return modelCallback(null, updateObjectResult);
        } catch (e) {
            return modelCallback("Unable To Update Data please try again");
        }
    },
    Get: async (event, argList, modelCallback) => {
        if (!argList) {
            return modelCallback('Invalid Input - Invalid argList');
        }
        let customError = {};
        customError.file = './server/crud';
        customError.functionName = 'Get';
        try {
            let dbConnection = await getDbConnections();
            let getResponse = await getAsync(event, argList, dbConnection);
            return modelCallback(null, getResponse);
        } catch (e) {
            return modelCallback("Unable To Get Data please try again");
        }
    },
    Delete: async (event, argList, modelCallback) => {
        if (!argList) {
            return modelCallback('Invalid Input - Invalid argList');
        }
        let customError = {};
        customError.file = './server/crud';
        customError.functionName = 'Delete';
        try {
            let dbConnection = await getDbConnections();
            let removeResponse = await deleteAsync(event, argList, dbConnection);
            return modelCallback(null, removeResponse);
        } catch (e) {
            return modelCallback("Unable To remove Data please try again");
        }
    }
};
