var crypto = require('crypto');

var aesutil = module.exports = {};

/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
aesutil.encryption = function (data, key, iv) {
    iv = iv || "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-256-ecb', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}

/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
aesutil.decryption = function (data, key, iv) {
    if (!data) {
        return "";
    }
    iv = iv || "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-256-ecb', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
}

var key = '098f6bcd4621d373cade4e832627b4f6'

encrypt = function (key, raw) {
    var iv = crypto.randomBytes(16);
    console.log(raw)

    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.update(new Buffer(raw));

    enc = cipher.final('base64');
    
    // 拼接iv串
    console.log(enc)
    enc = Buffer.concat([iv, new Buffer(enc, 'base64')])
    enc = enc.toString('base64')
    console.log(enc)

    return enc
}

encrypt_dict = function (key, final) {
    return encrypt(key, JSON.stringify(final))
}

/*
    def encrypt_dict(self, final):
        """
        加密字典
        """

        return self.encrypt_str(json.dumps(final))
*/




//var iv = 'asdf'
//var iv = crypto.randomBytes(16);
//crypto.randomBytes(16)
//console.log(iv)
//iv = 'm\x17%\x02qݔ9T\x14+'

//enrypt = aesutil.encryption('test', key, iv)
//console.log(enrypt)

//var iv = new Buffer('asdfasdfasdfasdf')
//console.log(iv.toString('base64'))

//var iv = crypto.randomBytes(16);
//crypto.randomBytes(16)
//console.log(iv)
//var key = new Buffer('asdfasdfasdfasdfasdfasdfasdfasdf')
//var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//cipher.update(new Buffer("mystring"));
//console.log(cipher)
//var enc = cipher.final('base64');
//iv.final('base64')
//console.log(enc)

//bu_enc = new Buffer(enc, 'base64')
//buffer3 = Buffer.concat([iv, bu_enc])
//console.log(buffer3.toString('base64'))
//var s = b.toString();
//

row = 'test'

//console.log(encrypt(key, row))

final = {
    'test': 'test'
}

console.log(encrypt_dict(key, final))
