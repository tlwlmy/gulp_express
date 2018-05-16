var path = require('path');

// 路径
module.exports.PROJECT_ROOT_PATH = process.cwd();    // 根目录
module.exports.PROJECT_COMMON_PATH = path.join(this.PROJECT_ROOT_PATH, 'common');    // 公共目录
module.exports.PROJECT_MODULE_PATH = path.join(this.PROJECT_ROOT_PATH, 'module');    // 模块目录

// AES加密密钥
module.exports.AES_ENCRYPT_SECRET = '95e90e4b966108abf76cd07f25d588f1';

// 版本号
module.exports.VERSION = 1;

// 公共链接
module.exports.CM_URL_INTERFACE = 'http://wx.missdxn.com';
