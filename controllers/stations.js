/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Request = require('request');
var axios = require('axios');
const {validationResult} = require('express-validator/check');
const Config = require('../config/configs');

module.exports = {
    create(req, res) {
        /**
         * Cette méthode est appelée par Station Manager pour créer une nouvelle Station
         */
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        Request.post({
            "headers": {"content-type": "application/json"},
            "url": Config.DATASTORAGE_URI + "stations",
            "body": JSON.stringify({
                "name": "Station",
                "frequency": req.body.frequency,
                'ipAdress': req.body.ipAdress,
                "longitude": 0.0,
                "latitude": 0.0
            })
        }, (error, response, body) => {
            if (error) {
                return res.send("An error occured when creating the station");
            }
            let bod = JSON.parse(body);
            Request.post({
                "url": Config.DATA_ACQUISITION_URI + "init",
                "json": {
                    id: bod.id,
                    ip: bod.ipAdress,
                    freq: bod.frequency
                },
            }, (e, r, b) => {
                if (b === '0') {
                    Request.delete(Config.DATASTORAGE_URI + "stations/" + body.id, (a, b, c) => {
                        return res.send("An error occured during the creation of the station");
                    });
                }
                let final = JSON.parse(b);
                /*Request.put({
                 "headers": {"content-type": "application/json"},
                 "url": Config.DATASTORAGE_URI + "stations/" + bod.id,
                 "body": JSON.stringify({
                 /*"name": "Station",
                 "frequency": req.body.frequency,
                 'ipAdress': req.body.ipAdress,
                 "longitude": final.longitude,
                 "latitude": final.latitude
                 })
                 });*/
                if (response.statusCode == 200)
                    return res.send({"status": true});
                else
                    return res.send({"status": false});
            });
        });
    },
    list(req, res) {
        console.log("Requesting the list of stations");
        Request.get(Config.DATASTORAGE_URI + "stations", (error, response, body) => {
            if (error) {
                return res.send("It seems there is an error on the server");
            }
            var reponse = JSON.parse(body);
            var statusCode = response.statusCode;
            if (statusCode == 200)
                return res.json({"status": true, "datas": reponse});
            else
                return res.json({"status": false, "datas": [], "error": error});
        });

    },
    update(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        //envoi d'abord à DATA ACQUISITION
        Request.get(Config.DATASTORAGE_URI + "stations/" + req.params.ipAdress, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            //return res.json(JSON.parse(body));
            var response = JSON.parse(body);
            var id = response.id;
            console.log("id : " + id);
            console.log(req.body);
            //puis stocke la reponse
            axios.put(
                    //'method': "PUT",
                    //"content-type": "application/json",
                    Config.DATASTORAGE_URI + "stations/" + id,
                    {
                        //"name": "Station",
                        //"frequency": req.body.frequency || '',
                        //'ipAdress': req.body.ipAdress || '',
                        "longitude": req.body.longitude,
                        "latitude": req.body.latitude
                    }).then((reponse) => {
                console.log(reponse.data);
                return res.json(reponse.data);
            })
            /*}, (error, response, body) => {
             if (error) {
             return res.status(response.statusCode).json({error: error.array()});
             }
             return res.json(JSON.parse(body));
             });
             */

        });
    },
    retrieve(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        Request.get(Config.DATASTORAGE_URI + "stations/" + req.params.ipAdress, (error, response, body) => {
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
        Request.get(Config.DATASTORAGE_URI + "stations/" + req.params.ipAdress, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            //return res.json(JSON.parse(body));
            var response = JSON.parse(body);
            var id = response.id;
            console.log(id)
            if (id)
                Request.delete(Config.DATASTORAGE_URI + "stations/" + id, (error, response, body) => {
                    if (error) {
                        return res.status(response.statusCode).json({error: error.array()});
                    }

                    return res.json({"status": true, "datas": [JSON.parse(body)]});
                });
        });
        //puis détruit la station

    }
};


