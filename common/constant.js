var path = require('path');

// 路径
module.exports.PROJECT_ROOT_PATH = process.cwd();    // 根目录
module.exports.PROJECT_COMMON_PATH = path.join(this.PROJECT_ROOT_PATH, 'common');    // 公共目录
module.exports.PROJECT_MODULE_PATH = path.join(this.PROJECT_ROOT_PATH, 'module');    // 模块目录

// AES加密密钥
module.exports.AES_ENCRYPT_SECRET = '95e90e4b966108abf76cd07f25d588f1';

// 版本号
module.exports.VERSION = 4;

// 公共链接
// module.exports.CM_URL_INTERFACE = 'http://wx.missdxn.com';
module.exports.CM_URL_INTERFACE = 'http://pwx.chinayuqiang.com';

// 跳转动作
module.exports.FISSION_ACTION_GET_DOMAIN     = 1    // 获取域名
module.exports.FISSION_ACTION_GET_JSSDK_INFO = 2    // 获取jssdk信息
module.exports.FISSION_ACTION_GET_MATERIAL   = 3    // 获取素材信息

// 域名类型
module.exports.FISSION_DOMAIN_GENRE_ENTER  = 1    // 入口
module.exports.FISSION_DOMAIN_GENRE_ACCESS = 2    // 访问
module.exports.FISSION_DOMAIN_GENRE_SHARE  = 3    // 分享
module.exports.FISSION_DOMAIN_GENRE_JUMP   = 4    // 跳转
