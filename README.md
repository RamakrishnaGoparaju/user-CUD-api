# user-CUD-api
create an user create/update/delete API calls


1.Install the node modules first. -- npm install express

2.Run the API --Goto the app.js file location and run it into commandpromt. -- API prot will be run in the localhost:9001(This will be declared in the app.js file)

3.The following are API calls Links.

CREATE

curl --location --request POST 'http://localhost:9001/user'
--header 'Content-Type: application/json'
--data-raw '{JSON BODY******}'

Example JSON 
{
    "emailId": "rama@gmail.com",
    "firstName": "Rama",
    "lastName": "Krishna",
    "phoneNumber": 9999999999
}

UPDATE

curl --location --request PUT 'http://localhost:9001/user/add user _id'
--header 'Content-Type: application/json'
--data-raw '{JSON BODY******}'




FETCH LIST

curl --location --request GET 'http://localhost:9001/user'


FETCH SINGLE USER 

curl --location --request GET 'http://localhost:9001/user/ user _id'


DELETE

curl --location --request DELETE 'http://localhost:9001/user/ user _id'
