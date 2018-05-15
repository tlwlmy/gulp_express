var crypto = require('crypto');

encrypt = function (key, raw) {
    var iv = crypto.randomBytes(16);
    key = new Buffer(key)

    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.update(new Buffer(raw));

    enc = cipher.final('base64');
    
    // 拼接iv串
    enc = Buffer.concat([iv, new Buffer(enc, 'base64')])
    enc = enc.toString('base64')

    return enc
}

encrypt_dict = function (key, final) {
    return encrypt(key, JSON.stringify(final))
}

module.exports = {
    encrypt: encrypt,
    encrypt_dict: encrypt_dict,
}

//var path = require('path')
//var constant = require('./common/constant')
//console.log(constant.AES_ENCRYPT_SECRET)

//row = 'test'
//console.log(encrypt(key, row))

//final = {
    //'test': 'test'
//}

//console.log(encrypt_dict(constant.AES_ENCRYPT_SECRET, final))
