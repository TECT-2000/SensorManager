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
router.get("/sensors",stationsController.list);
router.put("/sensors/:sensorId",validator.validate('retrieveSensor'), sensorsController.update);
router.get("/sensors/:sensorId",validator.validate('retrieveSensor'),sensorsController.retrieve);


//router.delete('/stations/:sensorId',validator.validate('retrieveStation'),stationsController.destroy);


module.exports = router;
