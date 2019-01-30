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

const {body, param} = require('express-validator/check');
const {sanitizeBody}=require('express-validator/filter');

module.exports={
    validate(method) {
        switch (method) {
            case 'createSensor':
            {
                return [
                    body('name', "add name property ").exists(),
                    body('type', "add type property").exists(),
                    body('port', "add port property").exists().isInt(),
                    param('stationId', "stationId need to be an integer").isInt(),
                    body('state', 'need to be in enabled or disabled or broken').optional().isIn(['enabled', 'disabled', 'broken']),
                ]
            }
            case 'retrieveSensor':
            {
                return [
                    //param('stationId', "stationId need to be an integer").isInt(),
                    param('sensorId', "sensorId need to be an integer").isInt()
                ]
            }
            case 'listSensorStation':
            {
                return [
                    param('stationId', "stationId need to be an integer").isInt(),
                ]
            }
            case 'listSensorStationByState':
            {
                return [
                    param('state', 'need to be in enabled or disabled or broken').optional().isIn(['enabled', 'disabled', 'broken']),
                    param('state','add property state').exists(),
                    param('stationId', "stationId need to be an integer").isInt(),
                ]
            }
            case 'listSensorByState':
            {
                return [
                    param('state', 'need to be in enabled or disabled or broken').optional().isIn(['enabled', 'disabled', 'broken']),
                    param('state','add property state').exists(),
                    //param('stationId', "stationId need to be an integer").isInt(),
                ]
            }
            case 'changeSensorByState':
            {
                return [
                    body('state', 'need to be in enabled or disabled or broken').optional().isIn(['enabled', 'disabled', 'broken']),
                    body('state','add property state').exists(),
                    param('sensorId', "sensorId need to be an integer").isInt(),
                ]
            }
            case 'changeSensorByPort':
            {
                return [
                    body('port','add property port').exists(),
                    param('sensorId', "sensorId need to be an integer").isInt(),
                ]
            }
            case 'createStation':
            {
                return [
                    body('name', "name doesn't exist ").exists(),
                    //body('longitude', "add attribute longitude ").exists(),
                    //body('latitude', "add attribute latitude").exists(),
                    body('frequency', "frequency doesn't exist").exists(),
                    //body('position', "position doesn't exist").exists(),
                    body('ipAdress', "ipAdress doesn't exist").exists(),
                    body('ipAdress', "ipAdress is not valid").isIP(),
                    sanitizeBody('notifyOnReply').toBoolean()
                ]
            }
            case 'retrieveStation':
            {
                return [
                    param('stationId', "stationId need to be an integer").isInt(),
                ]
            }
        }
    }
};


