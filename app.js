var express = require('express')
var swig = require('swig')

var app = express()
var bodyParser = require('body-parser');
//var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data
//app.use(multer({ dest: './uploads/'}));
//app.use(multer({dest:'./uploads/'}).single());
//app.use(multer({dest:'./uploads/'}).array());
//app.use(multer({dest:'./uploads/'}).fields());

var indexRouter = require('./routes/index');

swig.setDefaults({
  cache: false
})

app.set('view cache', false)

app.set('views', './dist/html/')
app.set('view engine', 'html')
app.engine('html', swig.renderFile)
// app.use(express.static('dist'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
