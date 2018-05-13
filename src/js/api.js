/**
 * Created by ubuntuuser on 17-8-11.
 */
// var screenWidth = document.documentElement.clientWidth
// var fontSize = screenWidth/32
// $('html').css('font-size',fontSize)
// $('body').css('opacity', 1)

$.fn.longPress = function(fn) {
	var timeout = undefined;
	var $this = this;
	for(var i = 0;i<$this.length;i++){
		$this[i].addEventListener('touchstart', function(event) {
			timeout = setTimeout(fn, 800);  //长按时间超过800ms，则执行传入的方法
		}, false);
		$this[i].addEventListener('touchend', function(event) {
			clearTimeout(timeout);  //长按时间少于800ms，不会执行传入的方法
		}, false);
	}
}
var Fn = window.jQuery || window.Zepto
;(function(win, doc, $) {
	/** 私有属性
	 -----------------------------------------------------------------*/
	var API = {};

	/** 公有属性&方法
	 -----------------------------------------------------------------*/
	API = {
		timestamp  :  0,           // 时间戳

		URL: {
		},

		/**
		 *  =ping
		 *  @about    ping 某个 URL
		 *
		 *  @param    {string}  u  地址
		 */
		ping: function(u) {
			$('<img />').attr('src', u);
		},

		iswx: /MicroMessenger/i.test(navigator.userAgent),
		iswb: /weibo/i.test(navigator.userAgent) || /TencentMicro/i.test(navigator.userAgent) ,
		isqq: /QQ/.test(navigator.userAgent),
		isandroid: /android/i.test(navigator.userAgent),
		isios   : !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		_URL: {
			API_BACK: function () {
				// return 'http://192.168.7.133:51019'
				return "http://"+ win.location.host
			}
		},
		/**
		 *  =host
		 *  @about    获取当前 host
		 */
		host: function() {
			return "http://"+ win.location.host;
		},

		/**
		 *  =loadData   获取数据
		 *
		 *  @param    {string}  url
		 *  @param    {object}    opts
		 */

		loadData: function (url, opts) {
			var options = {
				timeout: 30000,
				params: '',
				method: 'GET',
				withCredentials: true,
				success: function () {
				},
				error: function () {
				}
			};

			$.extend(options, opts);

			if (url.indexOf('://') === -1) {
				url = this._URL.API_BACK() + '/' + url
			}
			$.ajax({
				url: url,
				data: options.params,
				dataType: 'json',
				type: options.method,
				crossDomain: true,
				xhrFields: {
					withCredentials: options.withCredentials
				},
				timeout: options.timeout, // 30秒超时
				success: function (data, status, xhr) {
					// 请求成功处理
					var data = data || {c: -1, data: 'no data'};
					if (data.c == -5001) {
						window.location.href = '/login'
					}
					else {
						options.success(data);
					}
				},
				error: function (xhr, status, error) {
					// 请求接口失败
					options.error(status);
				}
			});
		},


		/**
		 *  =getRequest
		 *  @about    获取 GET 参数
		 *
		 *  @return   {object}   参数集合
		 */
		getRequest: function()  {
			var url = win.location.search,  // 获取url中"?"后面的字符串
				i = 0,
				args, arg,
				back = {};

			if (url == '') return 0;

			if ( url.indexOf('?') != -1 ) {
				args = url.substr(1).split('&');

				for (; i < args.length; i++) {
					arg = args[i].split('=');
					back[ arg[0] ] = arg[1];
				}
			}

			return arguments[0] ? back[arguments[0]] : back;
		},



		/**
		 *  =get url  获取完整请求地址
		 *
		 *  @param    {string}    url     请求地址
		 *  @param    {object}    params  请求参数
		 *  @return   {string}
		 */
		getUrl: function (url, params) {
			var query_arr = [];

			for (var key in params) {
				query_arr.push(API.strFormat("{0}={1}", key, params[key]));
			}

			return url + "?" + query_arr.join("&");
		},


		/**
		 *  =setItem
		 *  @about    储存本地数据
		 *
		 *  @param    {string}  key    数据名称
		 *  @param    {boolean} value  数据
		 */
		setItem: function(key, value) {
			if ($.isArray(value) || $.isPlainObject(value)) value = JSON.stringify(value);
			try {
				win.localStorage.setItem(key, value);
			} catch(e) {
				// FIXED 私密模式无法使用 Storage
				if ($("#storage-" + key).length) {
					$("#storage-" + key).text(value);
				}
				else {
					$("<script />", { id: "storage-" + key, text: value, type: "text/template"}).appendTo('body');
				}
			}
			return 1;
		},


		/**
		 *  =getItem
		 *  @about    获取本地存储数据
		 *
		 *  @param    {string}  key  数据名称
		 *  @param    {boolean} hl   是否处理数据
		 *  @return   {string/json}
		 */
		getItem: function(key, hl) {
			hl = hl || 0;
			try {
				win.localStorage.test = 2; // 检测是否 safari 无痕模式

				var value = win.localStorage.getItem(key);
				if (value) {
					return hl ? JSON.parse(value) : value;
				}
			} catch(e) {
				// FIXED 私密模式无法使用 Storage
				var value = $("#storage-"+ key).text();
				if (value) {
					return hl ? JSON.parse(value) : value;
				}
			}
			return null;
		},

		/**
		 *  =clearItem
		 *  @about    删除本地数据
		 *
		 *  @param    {string}  key    数据名称
		 */
		clearItem: function(key ) {
			try {
				win.localStorage.removeItem(key);
			} catch(e) {
				// FIXED 私密模式无法使用 Storage
				if ($("#storage-"+ key).length) {
					$("#storage-"+ key).remove();
				}
			}
			return 1;
		},

		/**
		 *  @about    获取位置信息
		 */
		getScrollTop: function() { return window.scrollY; }, // 上滚动距离
		getWidth: function() { return document.documentElement.clientWidth || win.innerWidth; },
		getHeight: function() { return screen.height || win.innerHeight; },


		/**
		 * @about    随机数
		 */
		random: function(n) { return parseInt(Math.random() * n); },


		/**
		 *  =encode
		 *  @about    字符串 encode
		 *
		 *  @param    {string}  s 需要 encode 的字符串
		 *  @return   {string}
		 */
		encode: function(s) { return encodeURIComponent(s); },


		/**
		 *  =decode
		 *  @about    编码decode
		 *
		 *  @param    {string}  s  需要decode的字符串
		 *  @return   {string}
		 */
		decode: function(s) { return decodeURIComponent(s); },


		/**
		 *  =is empty
		 *  @about     是否为空
		 *
		 *  @params    {object}  obj
		 */
		isEmpty: function(obj) {
			for (var n in obj) return false;
			return true;
		},



		 /**
		 *  =number Format
		 *  @about    数字格式化
		 *
		 *  @param    {number}  num   需要格式化的string
		 *  @param    {string}  unit  积分单位
		 */
		numFormat: function(num, unit) {
			// 保留 fixed 小数位数
			num = parseFloat(num).toFixed( (arguments[1] || 0) );

			// 若单位为元，进行特殊处理
			unit = unit || '';
			if (unit == '元') {
				num /= 100;
			}
			else {
			}

			// 加上逗号
			num += '';
			var x = num.split('.'),
				x1 = x[0],
				x2 = (x.length > 1) ? ('.' + x[1]) : '',
				rgx = /(\d+)(\d{3})/;

			while (rgx.test(x1)) x1 = x1.replace(rgx, '$1' + ',' + '$2');

			return x1 + x2;
		},


		/**
		 *  =format number 格式化
		 *
		 *  @param    {number}  num  需要格式化的string
		 */
		moneyFormat: function (num) {
			// 保留 fixed 小数位数
			num = (parseFloat(num) / 100).toFixed((arguments[1] || 2));

			// 加上逗号
			num += '';
			var x = num.split('.'),
				x1 = x[0],
				x2 = (x.length > 1) ? ('.' + x[1]) : '',
				rgx = /(\d+)(\d{3})/;

			while (rgx.test(x1)) x1 = x1.replace(rgx, '$1' + ',' + '$2');

			return x1 + x2;
		},


		/**
		 *  =string Format
		 *  @about    字符串格式化
		 *
		 *  @param    {string}  d    需要格式化的string
		 *  @param    {all}     1~n  {n} 替换内容
		 *  @return   {string}       格式化后的string
		 */
		strFormat: function(s) {
			if (arguments.length == 0) return null;

			var args = Array.prototype.slice.call(arguments, 1);
			return s = s.replace(/\{(\d+)\}/g, function(m, i) {
				return args[i];
			});
		},


		/**
		 *  =funTransitionHeight
		 *  @about 有动画地变化高度
		 *
		 *  @param element
		 *  @param time
		 */
		funTransitionHeight: function(element, time) { // time, 数值，可缺省
			if (typeof window.getComputedStyle == "undefined") return;

			var height = window.getComputedStyle(element).height;
			element.style.height = "auto";
			var targetHeight = window.getComputedStyle(element).height;
			element.style.height = height;
			setTimeout(function() {
				if (time) element.style.transition = "height "+ time +"ms,opacity " + time + "ms";
				element.style.height = targetHeight;
				element.style.opacity = 1;
			}, 15);
		},


		/**
		 *  =detectEventSupport
		 *  @about   是否支持事件
		 *
		 *  @param   eventName  事件名字
		 *  @return  {boolean}
		 */
		detectEventSupport: function(eventName) {
			var tempElement = document.createElement('div'),
				isSupported;

			eventName = 'on' + eventName;
			isSupported = (eventName in tempElement); // 使用第一种方式
			// 如果第一种方式行不通，那就来看看它是不是已知事件类型
			if(!isSupported) {
				tempElement.setAttribute(eventName, 'xxx');
				isSupported = typeof tempElement[eventName] === 'function';
			}
			// 清除掉动态创建的元素，以便内存回收
			tempElement = null;
			// 返回检测结果
			return isSupported;
		},

		/**
		 *  =detectEventSupport
		 *  @about   获取错误信息
		 *
		 *  @param   code  错误码
		 *  @return  {string} 错误信息
		 */
		getErrorMsg: function (code) {
			switch (code) {
				case -1001:
					return 'GET参数缺失';
				case -1102:
					return 's参数解密失败';
				case -1104:
					return '手机格式错误';
				case -1106:
					return '验证码错误';
				case -1110:
					return '记录不存在';
				case -1111:
					return '记录已存在';
				case -1113:
					return '图片验证码错误';
				case -2001:
					return '用户不存在';
				case -2004:
					return '用户余额不足';
				case -2010:
					return '用户登陆未授权';
				case -2011:
					return '操作失败，请联系客服';
				case -2019:
					return '用户手机验证码不存在';
				case -2020:
					return '用户手机验证码不合法';
				case -2023:
					return '用户已绑定师傅'
				case -2033:
					return '很抱歉，您已经没有抽奖次数了'
				case -2038:
					return 'token过期';
				case -2039:
					return 'token无效';
				case -2040:
					return '公众号不存在';
				case -2041:
					return '用户密码错误';
				case -2042:
					return '手机号不存在';
				case -2043:
					return '手机号已存在';
				case -2501:
					return '用户授权错误';
				case -2044:
					return '文章不存在';
				case -2045:
					return '评论不存在';
				case -2046:
					return '评论字数不符';
				case -2047:
					return '评论过快';
				case -2048:
					return '微信号已存在';
				case -2049:
					return '操作太频繁';
				case -2050:
					return '用户已领取奖励';
				case -2051:
					return '用户绑定自己';
				case -2053:
					return '师傅不允许绑定徒弟';
				case -2054:
					return '用户未绑定师傅';
				case -2055:
					return '没有奖励';
				case -2056:
					return '手机号不能充值';
				case -2057:
					return '反馈每日限制';
				default:
					return '错误码' + code;
			}
		}

	};

	win.API = API;

	/**
	 =template
	 @about    简易模板

	 @usage

	 HTML:
	 <script type="text/template" id="tpl-article"><h1>{{title}}</h1></script>

	 JavaScript:
	 $('#tpl-article').tmpl(data).appendTo($item);
	 */
	(function($){
		$.fn.tmpl = function(d) {
			var s = $(this[0]).html().trim();
			if ($.isArray(d)) {
				var li = '',
					tm = {}, i = 0, len = d.length;
				for (; i < len; i++) {
					tm = d[i];
					li += s.replace(/\{\=(\w+)\}/g, function(all, match) {
						return tm[match];
					});
				}
				s = li;
			}
			else {
				s = s.replace(/\{\=(\w+)\}/g, function(all, match) {
					return d[match];
				});
			}
			return $(s);
		};
	})($);

	//jQuery.getTmpl.js by Frully
	(function ($) {
		var _tmpls = {}; //保存已获取模板的信息  url: deferred
		$.getTmpl = function (url) {
			var tmpls = _tmpls,
				tmpl = tmpls[url];
			if (!tmpl) { //如果模板不存在，获取并插入 DOM
				tmpls[url] = tmpl = $.get(url).done(function (data) {
					$(data).appendTo('body');
				});
			}
			return tmpl; //返回 deferred 对象
		};
	}($));

	/**
	 =pages
	 @about    页面切换
	 */
	(function($) {
		/**
		 *  @param    {string}    p  页面标识
		 *  @param    {function}  f  后续执行
		 */
		$.fn.pages = function(p, before, after) {
			$(this).each(function(index) {
				var $this = $(this);
				if ( $this.data('page') === p ) {
					setTimeout(function() {
						(before || function() {})($this);
						$this.attr('class', 'ui-page ui-page-active fade in');
						setTimeout(function() {
							$this.removeClass('fade in');
						}, 225);
						(after || function() {})($this);
					}, 124);
				}
				else {
					if ( $this.hasClass('ui-page-active') ) {
						$this.attr('class', 'ui-page ui-page-active fade out');
						setTimeout(function() {
							$this.removeClass('ui-page-active fade out');
						}, 125);
					}
				}
			});
		};
	})($);


	// 时间格式化
	Date.prototype.Format = function (fmt) { //author: meiz
		var o = {
			"M+": this.getMonth() + 1,                 //月份
			"d+": this.getDate(),                    //日
			"h+": this.getHours(),                   //小时
			"m+": this.getMinutes(),                 //分
			"s+": this.getSeconds(),                 //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds()             //毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

})(window, document, Fn);