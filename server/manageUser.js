
'use strict';

const ObjectID = require('mongodb').ObjectID;
const crud = require('./crud')

const DBFun = async (event, argListElement, crudOp) => {
    return new Promise((resolve, reject) => {
        crud[crudOp](event, argListElement, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}


module.exports = {
    fetchUser: async (event, modelCallback) => {
        //validation of input variables.
        let eventParams = event.params || {};
        console.log("eventParams",eventParams)
        let userId = eventParams.id || eventParams.Id;
        let query = {};
        if(userId){
            query['_id'] = new ObjectID(userId)
        }
        let args = {
            query: query,
            tableName: "user"
        }
        let resOut = await DBFun(event, args, 'Get');
        return modelCallback(null, {"statusCode":200 ,result : resOut});
    },

    insertUser: async (event, modelCallback) => {
        console.debug('event', event)
        let eventBody = event.body;
        if (eventBody && Object.keys(eventBody).length == 0) {
            return modelCallback({statusCode : 401,error : "Invalid Input - Missing Body in the Request."})
        }
        // console.debug('eventBody', eventBody)
        if(!(eventBody.emailId)){
            return modelCallback({statusCode : 401,error : "Invalid Input - Missing emailId in Body"})
        }
        //To Insert User
        let args = {
            obj: eventBody,
            tableName: "user"
        }
        await DBFun(event, args, 'Insert');
        
        return modelCallback(null, {statusCode : 200 ,result : eventBody});
    },
    updateUser: async (event, modelCallback) => {
        let eventParams = event.params || {};
        let eventBody = event.body;
        let userId = eventParams.id || eventParams.Id;
        console.debug('eventParams', eventParams)
        //validation of input variables.
        if(!userId){
            return modelCallback({"statusCode":401 ,error : "Missing userId."})
        }
        if (eventBody && Object.keys(eventBody).length == 0) {
            return modelCallback({"statusCode":401 ,error : "Invalid Input - Missing Body in the Request."})
        }
        
        let query = {
            "_id": userId
        }
        let args = {
            query: query,
            obj: eventBody,
            tableName: "user"
        }
        try{
        await DBFun(event, args, 'Update');
        return modelCallback(null, {"statusCode":200 ,result : "user updated"});
        }catch(e){
            return modelCallback({"statusCode":401 ,error : "unable to update"});
        }
    },
     deleteUser: async (event, modelCallback) => {
        let eventParams = event.params || {};
        let eventBody = event.body;
        let userId = eventParams.id || eventParams.Id;
        console.debug('eventParams', eventParams)
        //validation of input variables.
        if(!userId){
            return modelCallback({"statusCode":401 ,error : "Missing userId."})
        }
        if (eventBody && Object.keys(eventBody).length == 0) {
            return modelCallback({"statusCode":401 ,error : "Invalid Input - Missing Body in the Request."})
        }
        
        let query = {
            "_id": userId
        }
        let args = {
            query: query,
            obj: eventBody,
            tableName: "user"
        }
        try{
        await DBFun(event, args, 'Delete');
        return modelCallback(null, {"statusCode":200 ,result : "user removed"});
        }catch(e){
            return modelCallback({"statusCode":401 ,error : "unable to remove"});
        }
    }
}