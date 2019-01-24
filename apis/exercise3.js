const _ = require('lodash');
const http = require('http');

const Promise = require('bluebird');
const request = Promise.promisify(require("request"));

  function getResponse(response, res){
    
    return new Promise(function(resolve) {

        let result;

        if (!(response && response.body && response.statusCode)) {
            return res.status(503).json({
                code: 'Target Error',
                message: 'Service Unavailable'
            });
        } else if (response.statusCode !== 200){
            return res.status(response.statusCode).json({
                code: http.STATUS_CODES[response.statusCode],
                message: response.statusMessage
            });
        } else{
             
            if (response.body){
                result = (typeof response.body === 'object') ? response.body : JSON.parse(response.body);
            }
        }

        resolve(result);
    });
}


var trolleyCalculator =  function(req, res,next) {
        if(!req.body){
            res.status(400).json({
                code: 'Invalid Request',
                message: 'List is empty. Please provide lists of prices, specials and quantities for calculation'
            });
        }

        console.log('trolleyCalculator() called');
        // const targetUrl = process.env.TARGET_URL + '/api/resource/trolleyCalculator?token=' + process.env.TOKEN;
        let targetURL = 'http://dev-wooliesx-recruitment.azurewebsites.net/api/resource/trolleyCalculator?token=900d99ba-83b4-4f8e-9f3e-a1e5c23009d7';

        const options = {
            method: 'POST',
            url: targetURL,
            timeout: 30000,
            body: req.body, 
            json: true,
            headers: {
                'cache-control': 'no-cache',
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        };

       

        console.log('options = ', options);

      
        async function trolleyCalculator()
        {
            try
            {
                const trolleyCalculatorResponse = await request(options);
                const response = await getResponse(trolleyCalculatorResponse,res);
                res.status(200).json(response);
            }
            catch(error){
                
                    console.log('Error: ', error);
                    next(error);
                }
        }
        
        trolleyCalculator();
       

};

exports.trolleyCalculator = trolleyCalculator;