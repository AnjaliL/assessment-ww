/* jshint strict: true */
/* global console, require, module, process */
"use strict";

const http = require('http');
http.globalAgent.maxSockets = 50;

const https = require('https');
https.globalAgent.maxSockets = 50;

const Promise = require('bluebird');
const request = Promise.promisify(require("request"));
const   _     = require('lodash');

function getArgOrNull(req, param) {
    if (req) {
        if (req.body && req.body[param]) {
            return req.body[param];
        } else if (req.query && req.query[param]) {
            return req.query[param];
        }
    }
    return null;
}

function sortByRecommend(recommendedProducts, allproducts) {
   
    console.log("recommendedProducts=",recommendedProducts);
    console.log("allproducts=",allproducts);

    return new Promise(function(resolve) {
    let sortProducts = [];
    let recProducts=[];
        _.forEach(recommendedProducts, function (customer) {
            recProducts = _.concat(recProducts,customer.products);
        });
        
        console.log("recProducts=",recProducts);
        sortProducts = recProducts;
   
            var sortedData = _(sortProducts)
            .groupBy('name')
            .map((prodQuantity, prodName) => ({
                name: prodName,
                quantity: _.sumBy(prodQuantity, 'quantity')
            })).value(); 

        sortProducts = [];
        let uniqueArr = [];
        uniqueArr = _.uniqBy(allproducts,'name');

        uniqueArr.forEach(element => {

            var obj = _.find(sortedData, function(o) { return o.name === element.name; });
            
            if(obj){
                element.quantity = obj.quantity;
            }
                sortProducts.push(element);
        });
        
        sortProducts = _.orderBy(sortProducts, ['quantity'], ['desc']);

        resolve(sortProducts);
    
   
    });
}

function handleClientResponse(response, res){
    
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

function sortArray (result,sortOption){
    //console.log('decorator.result = ', result);
    return new Promise(function(resolve){
        let arrProducts = [];
        if(result) {
            arrProducts = result;
            if(sortOption === 'low')
            {
                arrProducts = _.orderBy(arrProducts, ['price'], ['asc']);
            } else if(sortOption === 'high')
            {
                arrProducts = _.orderBy(arrProducts, ['price'], ['desc']);
            } else if(sortOption === 'ascending')
            {
                arrProducts = _.orderBy(arrProducts, ['name'], ['asc']);
            } else if(sortOption === 'descending')
            {
                arrProducts = _.orderBy(arrProducts, ['name'], ['desc']);
            }
        }
        resolve(arrProducts);
    });
};



    function sortProducts(req, res, next) {

        //console.log('sortProducts() called');
        
        let sortOption = getArgOrNull(req, 'sortOption');

        if(sortOption)
        {
            sortOption = sortOption.toLowerCase();
            if(!(_.includes(['low', 'high', 'ascending', 'descending', 'recommended'], sortOption)))
            {
                res.status(400).json({
                    code: 'Invalid Request',
                    message: 'valid sortOption would be [Low, High, Ascending, Descending, Recommended]'
                });
            }
        }

        //const finalUrl = 'http://dev-wooliesx-recruitment.azurewebsites.net/api/resource/products?token=ABdrF-HEaiQJ40WPRi-Y1txJ84jVfpkN9A%3A1543085147104';
        let finalUrl = 'http://dev-wooliesx-recruitment.azurewebsites.net/api/resource/products?token=900d99ba-83b4-4f8e-9f3e-a1e5c23009d7';
        
        const options = {
            method: 'GET',
            url: finalUrl,
            timeout: 30000,
            headers: {
                'cache-control': 'no-cache',
                'accept': 'application/json',
                'content-type': 'application/json'
            }
        };


        async function sortResponseBySortOption(sortOption){
            try{
                //console.log('options = ', options);
                let sortedArray=[];
                const result = await request(options);
                console.log('exercise2 result = ', result);
                const response = await handleClientResponse(result,res);
                if(_.includes(['low', 'high', 'ascending', 'descending'],sortOption))
                    sortedArray = await sortArray(response,sortOption);
                else if(sortOption ==='recommended')  
                {
                    options.url = 'http://dev-wooliesx-recruitment.azurewebsites.net/api/resource/shopperHistory?token=900d99ba-83b4-4f8e-9f3e-a1e5c23009d7';
                    const recommendedProductsResult = await request(options);
                    console.log('exercise2 recommended result = ', recommendedProductsResult);
                    const recommendedProductsresponse = await handleClientResponse(recommendedProductsResult,res);
                    sortedArray = await sortByRecommend(recommendedProductsresponse,response);
                }
                    

                res.status(200).json(sortedArray);
            }
            catch(error){
                console.log('Error: ', error);
            }
        } 

        sortResponseBySortOption(sortOption);
    
};

exports.sortProducts = sortProducts