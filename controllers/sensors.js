/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Request = require('request');
const Config=require("../config/configs");
const {validationResult} = require('express-validator/check');

module.exports = {
    create(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        
        var type=req.body.type;
        var port =parseInt(req.body.port);
        var id=parseInt(req.params.stationId);
        let result = {
            status: false,
            data: {}
        }
        Request.post({
            "url": Config.DATA_ACQUISITION_URI + "config",
            "json": {
                id : id,
                addSensor: [
                    {
                        type: type,
                        port: port
                    },
                   
                ],
                freq:1000
            }
        }, (e, r, b) => {
            if (b === '0') {
                return res.send(result);
            }
            Request.post({
                "headers": {"content-type": "application/json"},
                "url": Config.DATASTORAGE_URI+"stations/"+req.params.stationId+"/sensors",
                "body": JSON.stringify({
                    "name": "Sensor",
                    "state": req.body.state,
                    'port': req.body.port,
                    "type": req.body.type,
                    "StationID": req.params.stationId
                })
            }, (error, response, body) => {
                if (error) {
                    return res.send(result);
                }
                result.status=true;
                result.data=JSON.parse(body)
                return res.json(result);
            });
        });
    },
    list(req, res) {

        Request.get(Config.DATASTORAGE_URI+"sensors", (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            return res.json(JSON.parse(body));
        });

    },
    listSensorByState(req, res) {

        Request.get(Config.DATASTORAGE_URI+"stations/sensors/"+req.params.state, (error, response, body) => {
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
        Request.put({
            "headers": {"content-type": "application/json"},
            "url": Config.DATASTORAGE_URI+"sensors/" + req.params.sensorId,
            "body": JSON.stringify({
                "state": req.body.state,
                "name": "Sensor",
                'type': req.body.type,
                "port": req.body.port,
            })
        }, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: errors.array()});
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
        Request.get(Config.DATASTORAGE_URI+"sensors/" + req.params.sensorId, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            return res.json(JSON.parse(body));
        });
    },
    modifySensorByState(req,res){
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        if(req.body.state === 'enabled'){
            Request({
                'method': "PUT",
                "headers": {"content-type": "application/json"},
                "url": Config.DATASTORAGE_URI+"sensors/" + req.params.sensorId,
                "body": JSON.stringify({
                    "state": req.body.state,
                })
            }, (error, response, body) => {
                if (error) {
                    return res.send("An error occured during the activation of the sensor");
                }
                let bod = JSON.parse(body);
                Request.post({
                    "url": Config.DATA_ACQUISITION_URI + "config",
                    "json": {
                        id : bod.stationID,
                        enableSensor: [req.body.type]
                    }
                }, (e, r, b) => {
                    if (b === '0') {
                        Request({
                            'method': "PUT",
                            "headers": {"content-type": "application/json"},
                            "url": Config.DATASTORAGE_URI+"sensors/" + req.params.sensorId,
                            "body": JSON.stringify({
                                "state": 'disabled',
                            })
                        }, (a,b,c) => {
                            return res.send("An error occured during the activation of the sensor");
                        });
                    }
                    return res.send("The activation finished successfully");
                });
            });
        }
        else if(req.body.state === 'disabled'){
            Request({
                'method': "PUT",
                "headers": {"content-type": "application/json"},
                "url": Config.DATASTORAGE_URI+"sensors/" + req.params.sensorId,
                "body": JSON.stringify({
                    "state": req.body.state,
                })
            }, (error, response, body) => {
                if (error) {
                    return res.send("An error occured during the disactivation of the sensor");
                }
                let bod = JSON.parse(body);
                Request.post({
                    "url": Config.DATA_ACQUISITION_URI + "config",
                    "json": {
                        id : bod.stationID,
                        disableSensor: [req.body.type]
                    }
                }, (e, r, b) => {
                    if (b === '0') {
                        Request({
                            'method': "PUT",
                            "headers": {"content-type": "application/json"},
                            "url": Config.DATASTORAGE_URI+"sensors/" + req.params.sensorId,
                            "body": JSON.stringify({
                                "state": 'enabled',
                            })
                        }, (a,b,c) => {
                            return res.send("An error occured during the disactivation of the sensor");
                        });
                    }
                    return res.send("The disactivation finished successfully");
                });
            });
        }
        else{
            Request({
                'method': "PUT",
                "headers": {"content-type": "application/json"},
                "url": Config.DATASTORAGE_URI+"sensors/" + req.params.sensorId,
                "body": JSON.stringify({
                    "state": req.body.state,
                })
            }, (error, response, body) => {
                if (error) {
                    return res.send("An error occured during the action");
                }
                return res.json(JSON.parse(body));
            });
        }
    },
    modifySensorByPort(req,res){
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        Request({
            'method': "PUT",
            "headers": {"content-type": "application/json"},
            "url": Config.DATASTORAGE_URI+"sensors/" + req.params.sensorId,
            "body": JSON.stringify({
                "port": req.body.port,
            })
        }, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({error: error.array()});
            }
            return res.json(JSON.parse(body));
        });
    },
};



