/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const stations=require('../controllers/stations');
const validator=require('../controllers/validator');
const sensors=require("../controllers/sensors");

module.exports={
    stations,
    validator,
    sensors
}
