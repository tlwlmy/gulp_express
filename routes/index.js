var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//index page
router.get('/index',function(req, res){
    console.log(req);
    console.log(req.headers);

    console.log(JSON.stringify(req.query))
    console.log(req.method);

    res.render('index',{
        title:'首页 ',
        content: 'hello swig'
    })
})

//index page
router.post('/index',function(req, res){
    console.log(req);
    console.log(JSON.stringify(req.body))

    res.render('index',{
        title:'首页 ',
        content: 'hello swig'
    })
})


module.exports = router;
