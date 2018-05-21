// 检测微信sdk
var wxReady = wx.hideOptionMenu
function initJsShare (rurl, mdata, fn) {
    var url = window.location.href.split('#')[0]
    $.ajax({
       'url': rurl,
       'data': {
           url: url
       },
       'success': function (res) {
            var data = res || {c: -1}
            if (!data.c) {
                var config = data.d
                wx.config({
                    debug: false,
                    appId: config.appid,
                    timestamp: config.timestamp,
                    nonceStr: config.noncestr,
                    signature: config.signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'showMenuItems'
                    ]
                })
                wx.ready(function () {
                    wxReady()
                    wx.onMenuShareAppMessage({
                        title: mdata.title,
                        desc: mdata.desc,
                        link: config.url,
                        imgUrl: mdata.icon,
                        success: function () {
                            fn()
                        }
                    })
                    wx.onMenuShareTimeline({
                        title: mdata.title,
                        link: config.url,
                        imgUrl: mdata.icon,
                        success: function () {
                            fn()
                        }
                    })
                })
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

// 打开好友
function openAppMessage () {
    wx.hideOptionMenu()
    wx.showMenuItems({menuList:['menuItem:share:appMessage']})
}

// 打开朋友圈
function openTimeline () {
    wx.hideOptionMenu()
    wx.showMenuItems({menuList:['menuItem:share:timeline']})
}
