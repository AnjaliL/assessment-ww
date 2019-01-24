var http = require('http');
http.globalAgent.maxSockets = 50;
var https = require('https');
https.globalAgent.maxSockets = 50;


var router = require('express').Router();
const api1 = require('./apis/exercise1');
const api2 = require('./apis/exercise2');
const api3 = require('./apis/exercise3');
const test1 = require('./apis/test');

// basepath` set basepath on each request.
// function basepath(req, res, next) {
//         var host = req.get('host');
//         var basepath = req.baseUrl;
//         req.basepath = req.protocol + '://' + host + basepath;
//     next();
// }

//setup routes
console.log('In routes.js');

// router.use(basepath);
router.get('/user',api1.getUserDetails);
router.get('/sort', api2.sortProducts);
// router.post('/trolleyTotal',api3.trolleyCalculator)
router.post('/trolleyTotal',test1.trolleyCalculator);


module.exports = router;
