const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const util = require('./util');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

app.use(bodyParser.json());

app.post('/createAssignment', (req, res) => {

    const lineItem = util.createLineItemFromAssignment(req.body.assignment);

    let request_data = {
        url: req.body.url + '/lineItems/' + req.body.assignment.sourcedId,
        method: 'PUT',
        json: lineItem
    };

    let oauth = util.getOAuth(req.body.key, req.body.secret);
    let headers = oauth.toHeader(oauth.authorize(request_data));

    request({
        url: request_data.url,
        method: request_data.method,
        json: lineItem,
        headers: headers
    }, (error, response, body) => {
        let resPayload = {
            requestPayload: lineItem,
            response: response,
            error: error
        };
        res.send(resPayload);
    });
});

app.post('/createScore', (req, res) => {
    const result = util.createResultFromScore(req.body.score);

    let request_data = {
        url: req.body.url + '/results/' + req.body.score.sourcedId,
        method: 'PUT',
        json: result
    };

    let oauth = util.getOAuth(req.body.key, req.body.secret);
    let headers = oauth.toHeader(oauth.authorize(request_data));

    request({
        url: request_data.url,
        method: request_data.method,
        json: result,
        headers: headers
    }, (error, response, body) => {
        let resPayload = {
            requestPayload: result,
            response: response,
            error: error
        };
        res.send(resPayload);
    })
});

app.get('/getOrgs', (req, res) => {
    console.log(req);
    let request_data = {
        url: req.query.url + '/orgs',
        method: 'GET'
    };

    let oauth = util.getOAuth(req.query.key, req.query.secret);
    let headers = oauth.toHeader(oauth.authorize(request_data));

    request({
        url: request_data.url,
        method: request_data.method,
        headers: headers
    }, (error, response, body) => {
        let resPayload = {
            response: body,
            error: error
        };
        res.send(resPayload);
    });
});

app.use('/', express.static('public'));

app.listen(3001, () => {
  console.log('App is listening on port 3001');
});
