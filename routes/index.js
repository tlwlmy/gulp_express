var express = require('express');
var router = express.Router();
var functions = require('./../common/functions')

//index page
router.get('/index',function(req, res){
  res.render('index',{
      title: '首页',
      content: 'test'
  })
})

module.exports = router;
