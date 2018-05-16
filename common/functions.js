var constant = require('./constant')
var aes_cipher = require('./../module/aes-cipher')

module.exports.aes_encrypt_dict = function (final) {
  encrypted = aes_cipher.encrypt_dict(constant.AES_ENCRYPT_SECRET, final)

  return encodeURI(encrypted)
}

module.exports.generate_material_url = function () {
  // 生产素材链接
  
  final = {
    'vid': constant.VERSION
  }

  return constant.CM_URL_INTERFACE + '?s=' + this.aes_encrypt_dict(final)
}
