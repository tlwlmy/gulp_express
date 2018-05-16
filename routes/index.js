var express = require('express');
var router = express.Router();
var functions = require('./../common/functions')
//var aes_cipher = require('./../module/aes-cipher')

//index page
router.get('/sv',function(req, res){

  // 生产获取素材链接
  murl = functions.generate_material_url()
  console.log(murl)

  res.render('v3A',{
    murl: murl
  })
})

module.exports = router;
