var express = require('express')
var swig = require('swig')

var app = express()

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


//index page
app.get('/index',function(req, res){
    console.log(req.headers);
    res.render('index',{
        title:'首页 ',
        content: 'hello swig'
    })
})
