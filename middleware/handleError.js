'use strict'

function handleError(err, req, res, next) {
    res.set('Content-Type', 'application/json; charset=utf-8' );
    console.log('In handleError = ', err.errorCode,err.statusCode);
    var error = {};
    if (err.errorCode) {
        res.status(err.errorCode).send(err);
        next(Date() + ':' + JSON.stringify(err));
    }
    else if (err.statusCode == 400) {
        error = {
            'errorCode': 400,
            'status': 'Failure',
            'message': 'Incorrect format.'
        };
        res.status(400).send(error);
        next(Date() + ':' + JSON.stringify(error));
    }

    else {
        error = {
            'errorCode': 500,
            'status': 'Failure',
            'message': 'internal server error'
        };
        console.log("error=",error);
        res.status(error.errorCode).send(error);
        next(Date() + ':' + JSON.stringify(err));
    }
}

module.exports = handleError;