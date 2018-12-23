/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Request = require('request');
const {validationResult} = require('express-validator/check');

module.exports = {
    create(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        Request.post({
            "headers": {"content-type": "application/json"},
            "url": "http://localhost:3000/api/stations/"+req.params.stationId+"/sensors",
            "body": JSON.stringify({
                "name": req.body.name,
                "state": req.body.state,
                'port': req.body.port,
                "type": req.body.type,
                "StationID": req.params.stationId
            })
        }, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({errors: errors.array()});
            }
            return res.json(body);
        });
    },
    list(req, res) {

        Request.get("http://localhost:3000/api/sensors", (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({errors: errors.array()});
            }
            return res.json(body);
        });

    },
    update(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        Request({
            'method': "PUT",
            "content-type": "application/json",
            "url": "http://localhost:3000/api/sensors/" + req.params.sensorId,
            "body": JSON.stringify({
                "state": req.body.state,
                "name": req.body.name,
                'type': req.body.type,
                "port": req.body.port,
            })
        }, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({errors: errors.array()});
            }
            return res.json(body);
        });
    },
    retrieve(req, res) {
        const errors = validationResult(req); // to get the result of above validate fn
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(422).json({errors: errors.array()});
        }
        Request.get("http://localhost:3000/api/sensors/" + req.params.sensorId, (error, response, body) => {
            if (error) {
                return res.status(response.statusCode).json({errors: errors.array()});
            }
            return res.json(body);
        });
    },
};



