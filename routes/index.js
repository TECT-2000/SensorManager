var express = require('express');
var router = express.Router();
var stationsController=require('../controllers/').stations;
var sensorsController=require('../controllers/').sensors;
var validator=require('../controllers/').validator;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Accueil' });
});

router.post("/stations",validator.validate('createStation'),stationsController.create);
router.get("/stations",stationsController.list);
router.put("/stations/:stationId",validator.validate('retrieveStation'), stationsController.update);
router.get("/stations/:stationId",validator.validate('retrieveStation'),stationsController.retrieve);
router.delete('/stations/:stationId',validator.validate('retrieveStation'),stationsController.destroy);

router.post("/sensors/:stationId",validator.validate('createSensor'),sensorsController.create);
router.get("/sensors",sensorsController.list);
router.put("/sensors/:sensorId",validator.validate('retrieveSensor'), sensorsController.update);
router.get("/sensors/retrieve/:sensorId",validator.validate('retrieveSensor'),sensorsController.retrieve);
router.put("/sensors/changeState/:sensorId",validator.validate('changeSensorByState'),sensorsController.modifySensorByState);
router.put("/sensors/changePort/:sensorId",validator.validate('changeSensorByPort'),sensorsController.modifySensorByPort);
router.get('/sensors/:state',validator.validate('listSensorByState'), sensorsController.listSensorByState);


module.exports = router;
