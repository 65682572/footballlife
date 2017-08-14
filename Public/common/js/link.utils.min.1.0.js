;(function($, Link, window, undefined){
	
	var Link;
	//工具函数包
	Link.extend('utils', {
		
		/** 
		 * 对日期进行格式化， 
		 * @param date   要格式化的日期 
		 * @param format 进行格式化的模式字符串
		 *     支持的模式字母有： 
		 *     y:年, 
		 *     M:年中的月份(1-12), 
		 *     d:月份中的天(1-31), 
		 *     h:小时(0-23), 
		 *     m:分(0-59), 
		 *     s:秒(0-59), 
		 *     S:毫秒(0-999),
		 *     q:季度(1-4)
		 * @return String
		 */
		dateFormat : function(date, format) {
			if(format === undefined){
				format = date;
				date = new Date();
			}
			var map = {
				"M": date.getMonth() + 1, //月份 
				"d": date.getDate(), //日 
				"h": date.getHours(), //小时 
				"m": date.getMinutes(), //分 
				"s": date.getSeconds(), //秒 
				"q": Math.floor((date.getMonth() + 3) / 3), //季度 
				"S": date.getMilliseconds() //毫秒 
			};
			format = format.replace(/([yMdhmsqS])+/g, function(all, t){
				var v = map[t];
				if(v !== undefined){
					if(all.length > 1){
						v = '0' + v;
						v = v.substr(v.length-2);
					}
					return v;
				}
				else if(t === 'y'){
					return (date.getFullYear() + '').substr(4 - all.length);
				}
				return all;
			});
			return format;
		},


		/**
		 * 对时间戳进行格式化
		 *
		 * @param   int     timestamp     时间戳
		 * @param   string  format        进行格式化的模式字符串
		 *     支持的模式字母有： 
		 *     h:小时(0-23), 
		 *     m:分(0-59), 
		 *     s:秒(0-59)
		 
		 * @return  string
		 */
		timeFormat : function(timestamp, format){
				
			var h	= Math.floor(timestamp / 3600);
			var m 	= Math.floor((timestamp % 3600) /60);  
			var s 	= timestamp % 60;  
				
			var hh 	= (h.toString().length < 2) ? '0' + h : h;
			var mm  = (m.toString().length < 2) ? '0' + m : m;
			var ss  = (s.toString().length < 2) ? '0' + s : s;
			
			if(format){
				return format.replace('hh', hh).replace('mm', mm).replace('ss', ss);
			}
			
			return hh + ':' + mm + ':' + ss;
		},
		
		
		/**
 		 * 检查字符串是否为合法email
		 *
         * @param {String} 字符串
         * @return {bool}  是否合法
         */
        isEmail : function(_email) {
			
            if(!_email) return false;
			
			//var _regexp = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			var _regexp = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;  
			return RegExp(_regexp).test(_email);
        },
		
		
		/**
 		 * 检查字符串是否为合法手机号
		 *
         * @param {String} 字符串
         * @return {bool}  是否合法
         */
        isMobile : function(_mobile) {
            if(!_mobile) return false;
			
			var _regexp = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			return RegExp(_regexp).test(_mobile);
        },
		
		
		/**
	 	 * 验证数字 0-9
		 * @param {String} 字符串
		 * @return {bool}  是否合法
	     */
		validateNumber : function(value){
			 
			var flag = true;
			var reg = new RegExp("^[0-9]*$");  
			if(!reg.test(value)){  
				flag = false;
			}  
			if(!/^[0-9]*$/.test(value)){  
				flag = false;
			} 
			return flag;
		},

        /**
         * 验证密码是否合法 8-20之间的字母+数字组合
         * @param value
         * @returns {boolean}
         */
        ckPwd : function(value){
            var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
            var result = reg.test(value);
            return result;
        },
			
		/**
		 * 获取url中的参数
		 *
		 * @param  {String}  参数名
		 * @return {String}
		 */
		getUrlParam : function(name) {
			
			//构造一个含有目标参数的正则表达式对象
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
			
			//匹配目标参数
			var r = window.location.search.substr(1).match(reg);  
			
			//返回参数值
			if (r != null) return unescape(r[2]); return null; 
		},

		
		/**
		 * 全局公用 请求函数
		 *
		 * @param  string    action    请求地址
		 * @param  string    data      发送的数据
		 * @param  function  success   成功,回调函数
		 * @param  function  success   失败,回调函数
		 * @param  json      params    更多配置参数 
		 */
		ajaxSend : function(action, data, success, error, params){
			
			var config = {url: action, dataType:'json',type: "POST",data:data,success:success,error:error,cache:false};
			for(var x in params){config[x] = params[x];}
			$.ajax(config);
		},
		
		
		/**
		 * 检查浏览器
		 *
		 */
		isBrowser : function(){
			
			if($.browser.msie){ 
				
				if($.browser.version == 6.0){
					
					var _htmlstr = '<div class="ie6-box-index"><div class="list-link-index"><a href="http://www.firefox.com.cn/" target="_blank" class="link"></a><a href="http://www.360.cn/" target="_blank" class="link"></a><a href="http://dl.pconline.com.cn/download/51614.html" target="_blank" class="link"></a><a href="http://windows.microsoft.com/zh-cn/internet-explorer/ie-11-worldwide-languages/" target="_blank"  class="link"></a></div></div>';
					$(document.body).html(_htmlstr);
					
					return;
				}
			
				if($.browser.version == 7.0){
					
					var _htmlstr = '<div class="ie7-box-index js-ie7-box-index"><span class="text">浏览器版本太低了！！！</span><br><span class="text-1">低版本浏览器影响上网速度和体验，强烈推荐性能优越的浏览器：</span><div class="ie7-list-index"><a href="http://www.firefox.com.cn/" target="_blank" class="link"></a><a href="http://www.360.cn/" target="_blank" class="link"></a><a href="http://dl.pconline.com.cn/download/51614.html" target="_blank" class="link"></a><a href="http://windows.microsoft.com/zh-cn/internet-explorer/ie-11-worldwide-languages/" target="_blank"  class="link"></a></div></div>';
					
					$(document.body).prepend(_htmlstr);
					
					//三秒后关闭
					setTimeout(function(){
						$('.js-ie7-box-index').hide();
					}, 5000);
					
					return;
				}
			}
		}


	});
	
	
	//数组工具包
	Link.extend('array', {
		
		
		/**
		 * 数组快速排重[一维]
		 *
		 * @param   array    _array     需排重的数组
		 * @return  array               排重后的数组
		 */
		unique : function(_array){
			
			var _arr = [], _temp = {}, _len = _array.length - 1;
			
			for(var i = _len; i >= 0; i--){
				
				if(!_temp[_array[i]]){
					_arr.push(_array[i]);
					_temp[_array[i]] = 1;
				}
			}
			
			return _arr;
		}
		
	});
	
})(window.jQuery, Link, window);

