const _ = require('lodash');
const http = require('http');


// Get User Name and Token
var getUserDetails = function(req, res) {
    var response= {
        name:process.env.Name,
        token:process.env.Token
    } ;
    console.log(response);
    res.status(200).send(response);
 
};

module.exports = {getUserDetails};

