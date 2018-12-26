var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyparser = require('body-parser');
var logger = require('morgan');
const expressValidator = require('express-validator');
var indexRouter = require('./routes/index');
const helmet = require('helmet');

const app = express();


app.use(logger('dev'))
        .use(bodyparser.json())
        .use(bodyparser.urlencoded({extended: false}))
        .use(cookieParser())
        .use(helmet()) 
        .use(expressValidator());

app.use('/api', indexRouter)
        .use(function (req, res, next) {
            next(createError(404));
        })
        .use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            //res.render('error');
        });

module.exports = app;
