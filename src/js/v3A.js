/**
 * Created by ubuntuuser on 17-12-1.
 */
// 清除缓存
function clearItem () {
	$('#readNum').click(function () {
		window.localStorage.clear()
	})
}

// 文章ID
function getFarid () {
	farid = API.getRequest('id')
}

// 检测微信sdk
var wxReady = wx.hideOptionMenu
function checkWx () {
	var url = window.location.href.split('#')[0]
	var aid = py.aid
	API.loadData('article/get_jssdk_info', {
		params: {
			url: url,
			aid: aid
		},
		success: function (res) {
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
						title: py.share_title,
						desc: py.desc,
						link: py.real_url + '?id=' + farid,
						imgUrl: py.icon,
						success: function () {
							shareSuccess()
						}
					})
					wx.onMenuShareTimeline({
						title: py.share_title,
						link: py.real_url,
						imgUrl: py.icon,
						success: function () {
							shareSuccess()
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

// 成功回调
function shareSuccess () {
	shareTimes ++
	postTimes()

	var str = ''
	var fn = ''
	var typeStr = '阅读全文'

	if (py.type == 1) {
		_hmt.push(['_trackEvent','行为', '行为-文章，次数：' + shareTimes])
		typeStr = '阅读全文'
	}
	if (py.type == 2) {
		_hmt.push(['_trackEvent','行为', '行为-视频，次数：' + shareTimes])
		typeStr = '观看'
		setReplace()
	}


	switch (shareTimes) {
		case 1:
			// str = '分享成功,继续分享给<span style="font-size: 30px;color: #f5294c">1</span>个微信群即可<span class="fc-red">' + typeStr + '</span>！'
			if (py.type == 1) {
				str = '<img src="/aver/images/1.png" width="100%">'
			}
			if (py.type == 2) {
				str = '<img src="/aver/images/6.png" width="100%">'
			}
			fn = showFriend
			openAppMessage()
			break
		case 2:
			// str = '<span style="font-size: 24px;color: #f5294c">分享失败！</span><br>注意：分享到相同的地方会失败<br>请继续分享给<span style="font-size: 30px;color: #f5294c">1</span>个微信群！'
			str = '<img src="/aver/images/3.png" width="100%">'
			fn = showFriend
			openAppMessage()
			break
		case 3:
			// str = '<span style="font-size: 30px;color: #f5294c">分享成功！</span><br/>最后分享到<span style="font-size: 30px;color: #f5294c">朋友圈</span><span><br>即可<span class="fc-red">' + typeStr + '</span>!'
			if (py.type == 1) {
				str = '<img src="/aver/images/4.png" width="100%">'
			}
			if (py.type == 2) {
				str = '<img src="/aver/images/8.png" width="100%">'
			}
			fn = showTimeline
			openTimeline()
			break
		default:
			// str = '<div class="mt20 mb10">分享成功, 点击确定<span class="fc-red">' + typeStr + '</span>。</div>'
			if (py.type == 1) {
				str = '<img src="/aver/images/4.png" width="100%">'
			}
			if (py.type == 2) {
				str = '<img src="/aver/images/8.png" width="100%">'
			}
			fn = ''
			if (py.type == 1) {
				fn = function () {
					removeShare()
					showAllContent()
				}
			}
			if (py.type == 2){
				fn = function () {
					removeShare()
					showVideo()
				}
			}
			API.setItem('auth' + farid, 4)
			wx.hideOptionMenu()
			break
	}
	showTip(str, fn)
}

function checkData () {
	checkRead()
	if (py.ref == 1) {        // 如果是最后
//            replaceUrl()
		if (py.type == 1) {
			if (auth == 4) {
				showAllContent()
			} else {
				// str = '<div class="mt20 mb10">分享文章给好友，即可<span class="fc-red">阅读全文</span></div>'
				str = '<img src="/aver/images/2.png" width="100%">'
				fn = function () {
					showFriend()
				}
				wxReady = openAppMessage
				showTip(str, fn)
			}
		}
		if (py.type == 2) {

		}
	} else {
		checkOrigin()
	}
	if (auth == 4) {
		shareTimes = 4
	}
//        initData()
//        bindComplain()
}

// 检测再次进入
function checkRead () {
	auth = API.getItem('auth' + farid)
}

// 替换路径
function replaceUrl () {
	var params = {
	}
	params.farid = farid
	var url = window.location.href.split('?')[0]
	history.replaceState('', '', API.getUrl(url, params))
}

// 来源
function checkOrigin() {
	if (py.type == 1) {
		if (API.getRequest('from')) {
			_hmt.push(['_trackEvent','文章内容页', '文章-通过进入'])
		} else {
			_hmt.push(['_trackEvent','文章内容页', '文章-正常进入'])
		}
	}
	if (py.type == 2) {
		if (API.getRequest('from')) {
			_hmt.push(['_trackEvent','文章内容页', '视频-通过进入'])
		} else {
			_hmt.push(['_trackEvent','文章内容页', '视频-正常进入'])
		}
	}

}

function removeShare() {
	$('.friend').remove()
	$('.timeline').remove()
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

// 好友
function showFriend () {
	removeShare()
	var html = '<div class="friend share"><div class="cover"></div><img src="/aver/images/weixinghaoyou.png" class="share-img"></div>'
	$('body').append(html)

	$('.friend').click(function () {
		$('.friend').remove()
	})
}

// 朋友圈
function showTimeline() {
	removeShare()
	var html = '<div class="timeline share"><div class="cover"></div><img src="/aver/images/pengyouquan.png" class="share-img"></div>'
	$('body').append(html)

	$('.timeline').click(function () {
		$('.timeline').remove()
	})
}

// 投诉
function bindComplain () {
	$('.complain-btn').click(function () {
		_hmt.push(['_trackEvent','行为', '行为-点击投诉'])

		window.location.href = '/article/complain.html'
	})
}

// 渲染数据
function initData () {
	decodePy()
	initPublish()
	initContent()
	initStat()
	initAver()
}

// 编码数据
function decodePy () {
	py.title = decodeURIComponent(py.title)
	py.share_title = decodeURIComponent(py.share_title)
	py.desc = decodeURIComponent(py.desc)
	py.author = decodeURIComponent(py.author)
}

// 渲染发布数据
function initPublish () {
	createTime = py.create_time
	py.create_time = new Date(py.create_time * 1000).Format('yyyy-MM-dd')
	$('.publish').html($('#publish').tmpl(py))
}

// 渲染内容
var height = document.documentElement.clientHeight
function initContent () {
	setTitle()
	if (py.type == 1) {
		$('.video').hide()
		isArticle()
		checkArticle()
		initScroller()
	}
	if (py.type == 2) {
		$('.content').hide()
		isVideo()
	}
}

// 渲染统计数据
function initStat () {
	var data = (new Date().getTime() - createTime * 1000).toString().substring(3)
	var readNum = Math.floor((data / 1000 + 625) * 4.285)
	var likeNum = Math.floor(readNum * 0.68)
	$('#readNum').html('100000+')
	$('#likeNum').html(likeNum)

	checkLike()
	clickLike()
}

// 点赞状态
function checkLike () {
	if (API.getItem('like' + farid)) {
		$('.icon-like').attr('src', '/aver/images/like.png')
	} else {
		$('.icon-like').attr('src', '/aver/images/dislike.png')
	}
}

// 点赞
var clickTime = 0
function clickLike () {
	$('#like').click(function () {

		// iscroll会有点击两次的bug
		var lastTime = clickTime
		var newTime = new Date().getTime()
		clickTime = newTime
		if (newTime - lastTime < 20) {
			return
		}

		var likeNum = $('#likeNum').html()
		if (API.getItem('like' + farid)) {
			_hmt.push(['_trackEvent','行为', '行为-取消点赞'])

			$('.icon-like').attr('src', '/aver/images/dislike.png')
			$('#likeNum').html(likeNum - 0 - 1)
			API.clearItem('like' + farid, 1)
		} else {
			_hmt.push(['_trackEvent','行为', '行为-点赞'])

			$('.icon-like').attr('src', '/aver/images/like.png')
			$('#likeNum').html(likeNum - 0 + 1)
			API.setItem('like' + farid, 1)
		}

	})
}

// 文章
function isArticle() {
	var html = decodeURIComponent(py.content)
	$('#content').html(html)
	if (auth) {

	} else {
		setContentHeight('calc(' + height + 'px + 156px)')
	}
	bindShowAll()
}

// 设置文章内容高度
function setContentHeight(str) {
	$('.content').css('height', str)
}

// 点击显示全文按钮
function bindShowAll () {
	$('.showAll-btn').click(function () {
		if (auth) {
			showAllContent()
			return
		}
		_hmt.push(['_trackEvent','行为', '行为-文章-点击阅读全文，次数：' + shareTimes])

		var str = ''
		var fn = ''
		if (shareTimes < 4) {
			switch (shareTimes) {
				case 0:
					openAppMessage()
					if (py.ref == 1) {
						// str = '<div class="mt20 mb10">分享文章给好友，即可<span class="fc-red">阅读全文</span></div>'
						str = '<img src="/aver/images/2.png" width="100%">'
						fn = function () {
							showFriend()
						}
						break
					} else {
						toThird()
						return
					}
				case 1:
				case 2:
					openAppMessage()
					// str = '<div class="mt20 mb10">继续分享给<span style="font-size: 30px;color: #f5294c">1</span>个微信群，即可<span class="fc-red">阅读全文</span></div>'
					str = '<img src="/aver/images/10.png" width="100%">'
					fn = function () {
						showFriend()
					}
					break
				case 3:
					openTimeline()
					// str = '<div class="mt20 mb10">最后分享到<span style="font-size: 30px;color: #f5294c">朋友圈</span>，即可<span class="fc-red">阅读全文</span></div>'
					str = '<img src="/aver/images/13.png" width="100%">'
					fn = function () {
						showTimeline()
					}
					break
				default:
					wx.hideOptionMenu()
					break
			}
			showTip(str, fn)
		} else {
			wx.hideOptionMenu()
			showAllContent()
		}
	})
}

// 显示全文
function showAllContent () {
	$('.showAll-container').remove()
	setContentHeight('auto')
	initScroller()
}

var myScroll

function initScroller () {
	myScroll = new IScroll('#wrapper', {
		preventDefault: false,
		click: true,
		tap: true
	})
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
		capture: false,
		passive: false
	} : false)
	bindScroll()
}


function isPassive() {
	var supportsPassiveOption = false;
	try {
		addEventListener('test', null, Object.defineProperty({}, 'passive', {
			get: function () {
				supportsPassiveOption = true;
			}
		}))
	} catch(e) {}
	return supportsPassiveOption
}


function bindScroll () {
	var _touches_point1 = 0
	var _touches_point2 = 0
	addEventListener("touchstart", function(e) {
		_touches_point1 = e.touches[0].pageY
	})
	addEventListener("touchmove", function(e) {
		_touches_point2 = e.touches[0].pageY
		if (_touches_point1 > _touches_point2) {
			$('#wrapper').css('background-color', '#f8f8f8')
		} else {
			$('#wrapper').css('background-color', '#272b2e')
		}
	})
}

// 设置title
function setTitle () {
	document.title = py.title
}

// 检测文章途径
function checkArticle () {
	if (API.getRequest('from')) {
		_hmt.push(['_trackEvent','文章内容页', '文章-通过进入'])
	} else {_hmt.push(['_trackEvent','文章内容页', '文章-正常进入'])

	}
}

// 渲染宣传
function initAver () {
	py.aver.forEach(function (item, index) {
		switch (item.alid - 0) {
			case 1:
				$('.aver1-icon').attr('src', item.icon)
				$('.aver1').click(function () {
					window.location.href = item.url
				})
				break
			case 2:
				$('.aver2-icon').attr('src', item.icon)
				$('.aver2').click(function () {
					window.location.href = item.url
				})
				break
			case 3:
				$('.aver3-icon').attr('src', item.icon)
				$('.aver3').click(function () {
					window.location.href = item.url
				})
				break
			case 4:
				$('.read-btn').click(function () {
					window.location.href = item.url
				})
				break
		}
	})
}

// 最后
function toThird () {
	var params = {}
	params.id = farid
	var url = API.getUrl(py.real_url, params)
	window.location.href = url
}

// 提示框
function showTip (str, fn) {
	$('.tip').remove()
	var tip = '<div class="tip"><div class="cover"></div><div class="bgc-white tip-container box box-vertical bac fc-2b fs-15 tac"><div class="tip-content box bac bpc">' + str + '</div><div class="red-btn tip-ensure-btn ">确定</div></div></div>'
	$('body').append(tip)

	$('.tip-ensure-btn').click(function () {
		if (fn != '') {
			fn()
		}
		$('.tip').remove()
	})
}

// 视频
function isVideo () {
	var src = decodeURIComponent(py.content)
	playVideo(src, 'video', $('#video').width())
}

// 定义视频
function playVideo(vid, elId, elWidth) {
	//定义视频对象
	video = new tvp.VideoInfo()
	//向视频对象传入视频vid
	video.setVid(vid)

	//定义播放器对象
	player = new tvp.Player(elWidth, 200)
	//设置播放器初始化时加载的视频
	player.setCurVideo(video)

	//输出播放器,参数就是上面div的id，希望输出到哪个HTML元素里，就写哪个元素的id
	//player.addParam("autoplay","1")
	player.addParam('wmode', 'transparent')
	player.addParam('pic', tvp.common.getVideoSnapMobile(vid))
	player.write(elId)

	getVideo()
}

var video = null
// 获取视频元素
function getVideo () {
	setTimeout(function () {
		video = document.getElementsByTagName('video')[0]
		if (video) {
			firstPlay()
		} else {
			getVideo()
		}
	}, 50)
}

// 首次播放
var replace = null      // 监听事件
function firstPlay () {
	checkVideo()
	initScroller()
	if (shareTimes == 0) {
		video.addEventListener('pause', replace = function () {     // 点击暂停
			_hmt.push(['_trackEvent','行为', '行为-视频-点击暂停'])

			var duration = video.duration
			var currentTime = video.currentTime
			if (currentTime > duration * 0.5) {     // 播放大于一半
				if (auth) {
					return
				} else {
					toThird()
				}
			}
		})

		video.addEventListener('timeupdate', function () {     // 播放监听
			var duration = video.duration
			var currentTime = video.currentTime
			if (duration != 0) {
				if (currentTime > duration * 0.5) {
					if (py.ref == 1) {

					} else {
						if (auth) {
							return
						} else {
							setReplace()
							toThird()
						}
					}
				}
			}
		})
	}
}

function checkVideo () {
	if (py.ref == 1) {       // 最后
		if (shareTimes != 4) {      // 操作次数不为4
			shareTimes = 0
		}
		bindContinue()
	}
}

// 点击播放
function bindContinue () {
	videoTip()
	setReplace()
}

// 视频提示
function videoTip() {
	var str = ''
	var fn = ''
	if (shareTimes < 4) {
		switch (shareTimes) {
			case 0:
				// str = '<span style="font-size: 24px;color: #f5294c">网速不好</span><br>分享到微信群，可<span class="fc-red">免费加速观看</span>'
				str = '<img src="/aver/images/5.png" width="100%">'
				fn = showFriend
				wxReady = openAppMessage
				openAppMessage()
				break
			case 1:
			case 2:
				// str = '继续分享给<span style="font-size: 30px;color: #f5294c">1</span>个微信群即可<span class="fc-red">观看</span>！'
				str = '<img src="/aver/images/11.png" width="100%">'
				fn = showFriend
				openAppMessage()
				break
			case 3:
				// str = '<div class="mt20 mb10">最后分享到<span style="font-size: 30px;color: #f5294c">朋友圈</span>，即可<span class="fc-red">观看</span></div>'
				str = '<img src="/aver/images/12.png" width="100%">'
				fn = showTimeline
				openTimeline()
				break
			default:
				wx.hideOptionMenu()
				break
		}
		showTip(str, fn)
	}

}

// 替换视频占位
function setReplace () {
	video.pause()
	var height = $('#video').height()
	var width = $('#video').width()
	$('.poster').css({'width': width + 'px', 'height': height + 'px', 'background': 'rgba(0,0,0,0.8)','background-image': $('.tvp_poster_img').css('background-image'),'background-size': '100%'}).click(function () {     // 绑定点击事件，设置图片
		_hmt.push(['_trackEvent','行为', '行为-视频-点击播放，次数：' + shareTimes])

		if (shareTimes < 4) {      // 如果次数 < 4 弹出提示
			videoTip()
		} else {    // 次数足够
			showVideo()
		}

	}).show()
	$('#video').hide()
}

// 检测是否要隐藏
function checkStatus () {
	var from = API.getRequest('from')       // 来源
	var status = API.getItem('aver' + farid)        // 状态
	if (from) {     // 有来源
		if (status) {       // 是自己的
			hideAver()
		} else {
			showAver()
		}
	} else {        // 无来源
		hideAver()
		API.setItem('aver' + farid, 1)
	}
}

// 隐藏
function hideAver() {
	$('.aver').hide()
}

// 显示
function showAver() {
	$('.aver').show()
}

// 显示视频
function showVideo () {
	$('.poster').hide()     // 隐藏占位div
	$('#video').show()
	video.removeEventListener('pause', replace)
	video.play()
}

// 禁止选中
function setSelect () {
	document.onselectstart = function () {
		return false
	}
}

// 发送分享次数
function postTimes() {
	API.loadData('wx/gsn', {
		method: 'POST',
		params: {
			id: farid,
			type: shareTimes
		},
		success: function () {

		},
		error: function () {

		}
	})
}
