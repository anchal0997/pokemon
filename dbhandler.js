/**
 * Created by AMANRAJ on 24/07/16.
 */
'use strict';

const mysql = require('mysql');

let connection = {};

const createConnection = function () {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'todouser',
        //password : 'secret',
        database: 'tododb'
    });
    return connection;
};

module.exports = {
    add : function (newID, callBack) {
        const conn = createConnection();
        conn.connect();
        const queryString = "INSERT INTO pokemon VALUES (" +
            "'" + newID.emailID + "', " + "0);";
        conn.query(queryString, function (err, result) {
            callBack(result);
        });
        conn.end();
    },
    
    showScore : function (newID, callBack) {
        const conn = createConnection();
        conn.connect();
        const queryString = "SELECT score FROM pokemon WHERE email_id='" + newID.emailID + "';";
        conn.query(queryString, function (err, rows, fields) {
            callBack(rows);
        });
        conn.end();
    },
    
    leaderboard : function (callBack) {
        const conn = createConnection();
        conn.connect();
        const queryString = "SELECT * FROM pokemon ORDER BY score DESC;";
        let board = [];
        conn.query(queryString, function (err, rows, fields) {
            for (let member of rows) {
                board.push({
                    emailID : member.email_id,
                    score : member.score
                });
            }
            callBack(board);
        });
        conn.end();
    },
    
    updateScore : function (newID, callBack) {
        const conn = createConnection();
        conn.connect();
        var queryString = "UPDATE pokemon " +
            "SET score="+ newID.score +
            " WHERE email_id='" + newID.emailID + "';";
        conn.query(queryString, function (err, result) {
            callBack(result);
        });
        conn.end();
    }
};