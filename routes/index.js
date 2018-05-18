var express = require('express');
var router = express.Router();
var functions = require('./../common/functions')
//var aes_cipher = require('./../module/aes-cipher')

//index page
router.get('/sv',function(req, res){

  console.log(req.headers)

  // 生产获取素材链接
  murl = functions.generate_material_url()
  console.log(murl)

  // 生产分享链接
  //surl = functions.genereate_share_url(req.headers['host'])
  surl = functions.generate_share_url('wx.keaitie.cn')

  console.log(surl)

  res.render('v3A',{
    murl: murl,
    surl: surl
  })
})

module.exports = router;
