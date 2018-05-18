var constant = require('./constant')
var aes_cipher = require('./../module/aes-cipher')

module.exports.aes_encrypt_dict = function (final) {
  var encrypted = aes_cipher.encrypt_dict(constant.AES_ENCRYPT_SECRET, final)

  return encodeURIComponent(encrypted)
}

module.exports.generate_material_url = function () {
  // 生产素材链接
  
  var final = {
    'action': constant.FISSION_ACTION_GET_MATERIAL,
    'vid': constant.VERSION
  }

  return constant.CM_URL_INTERFACE + '?s=' + this.aes_encrypt_dict(final)
}

module.exports.generate_share_url = function (domain) {
  // 生产素材链接

  var final = {
    'action': constant.FISSION_ACTION_GET_JSSDK_INFO,
    'vid': constant.VERSION,
    'domain': domain
  }

  return constant.CM_URL_INTERFACE + '?s=' + this.aes_encrypt_dict(final)
}
