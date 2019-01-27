/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Request = require('request');
const {validationResult} = require('express-validator/check');
const Config = require('../config/configs');

module.exports = {
    create(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        Request.post({
            "headers": {"content-type": "application/json"},
            "url": Config.DATASTORAGE_URI + "stations",
            "body": JSON.stringify({
                "name": req.body.name,
                "frequency": req.body.frequency,
                'ipAdress': req.body.ipAdress,
                "longitude": req.body.longitude,
                "latitude": req.body.latitude
            })
        }, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({errors: errors.array()});
            }
            body = JSON.parse(body);
            Request.post({
                "url": Config.DATA_ACQUISITION_URI + "",
                "body": JSON.stringify({
                    "id": body.id,
                    "ip": body.ipAdress,
                    "freq": body.frequency
                })
            })
            return res.json(body);
        });

    },
    list(req, res) {

        Request.get(Config.DATASTORAGE_URI + "stations", (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            return res.json(JSON.parse(body));
        });

    },
    update(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        //envoi d'abord à DATA ACQUISITION
        //puis stocke la reponse
        Request({
            'method': "PUT",
            "content-type": "application/json",
            "url": Config.DATASTORAGE_URI + "stations/" + req.params.stationId,
            "body": JSON.stringify({
                "name": req.body.name,
                "frequency": req.body.frequency,
                'ipAdress': req.body.ipAdress,
                "longitude": req.body.longitude,
                "latitude": req.body.latitude
            })
        }, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            return res.json(JSON.parse(body));
        });
    },
    retrieve(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        Request.get(Config.DATASTORAGE_URI + "stations/" + req.params.stationId, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            return res.json(JSON.parse(body));
        });
    },
    destroy(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        //envoi d'abord à DATA ACQUISITION
        //puis détruit la station
        Request.delete(Config.DATASTORAGE_URI + "stations/" + req.params.stationId, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            return res.json(JSON.parse(body));
        });
    }
};


