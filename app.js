const express = require('express');
const app = express();
const requires = require('./requires')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


function defaultResponseHandler(req, res, requestHandler) {
    requestHandler(req, (err, apiRes) => {
        let bodyOut = err ? err : apiRes;
        res.status(bodyOut.statusCode).send(bodyOut);
    });
}

function promiseResponseHandlerStandard(req, res, requestHandler) {
    return new Promise((resolve, reject) => {
        return resolve(defaultResponseHandler(req, res, requestHandler));
    });
}


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET,PUT, DELETE,OPTIONS");
    next();
});


//User Routes
app.get('/user/list', (req, res) => promiseResponseHandlerStandard(req, res, requires.manageUser.fetchUser));
app.get('/user/:Id', (req, res) => promiseResponseHandlerStandard(req, res, requires.manageUser.fetchUser));
app.put('/user/:Id', jsonParser, (req, res) => promiseResponseHandlerStandard(req, res, requires.manageUser.updateUser));
app.post('/user', jsonParser, (req, res) => promiseResponseHandlerStandard(req, res, requires.manageUser.insertUser));
app.delete('/user/:Id', (req, res) => promiseResponseHandlerStandard(req, res, requires.manageUser.deleteUser));



const server = app.listen(9001, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("App listening at http://%s:%s", host, port)
})