'use strict';

// module dependencies
const express = require('express');
const bodyParser = require('body-parser');
const handleError = require('./middleware/handleError');
const cors = require('cors');

//  init
const routes = require('./routes.js');
const app = express();

//  dispatch requests to the router
app.use(cors({
        allowedHeaders: 'Origin, Content-Type, Accept, X-Requested-With'
    }));

app.disable('x-powered-by');
app.enable('etag', 'strict');
app.use(bodyParser.json());

app.use('/', routes);
app.use(handleError);

let port = process.env.PORT || 3000;
// instantiate express server
app.listen(port, function () {
        console.log(`Express server listening on port ${port}`);
});

module.exports = app;

