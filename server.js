/**
 * Created by AMANRAJ on 24/07/16.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const dbhandler = require('./dbhandler');

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use('/', express.static(__dirname + '/public_html'));

app.post('/add', function (req, res) {
    dbhandler.add({emailID : req.body.emailID}, function (result) {
        res.send(result);
    });
});

app.post('/showScore', function (req, res) {
    dbhandler.showScore({emailID : req.body.emailID}, function (score) {
        res.send(score);
    });
});

app.post('/updateScore', function (req, res) {
    dbhandler.updateScore({emailID : req.body.emailID, score : req.body.score}, function (result) {
        res.send(result);
    });
});

app.post('/leaderboard', function (req, res) {
    dbhandler.leaderboard(function (board) {
        res.send(board);
    });
});

app.listen(app.get('port'), function () {
    console.log("App running on \n" +
        "http://localhost:"+ app.get('port') +"/");
});
