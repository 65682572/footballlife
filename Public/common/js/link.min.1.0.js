;(function($, window, undefined){
	
	//核心命名空间
	var Link 	= {};
	
	/**
	 * 扩展方法
	 *
	 * @param   string   模块名称
	 * @param   object   模块对象
	 * @return  object
	 */
	Link.extend	= function(){
		var modle	= arguments[0];
		var target 	= Link[modle];
		var object 	= arguments[1] || {};
		
		//模块名称，不是对象，不是函数，不为空，则注册
		if(modle && typeof target !== "object" && typeof target !== "function"){
			
			Link[modle] = object;
			return object;
		}
		
		//抛出异常
		alert('ERROR: ' + modle + ' 已经被注册');
		throw new error("ERROR: " + modle + " Already exist..");
	}
	
	//将Link类库, 注册到全局空间[window]
	window.Link = Link;
	
	/**
	 * 初始化console对象,防止IE不兼容,程序中断
	 *
	 */
    var method;
    var noop 	= function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length 	= methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method 	= methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }

    /*
	window.alert   = function(){
		var  d = dialog();

		d.content(arguments[0]).show();
		setTimeout(function(){
			d.close().remove();
		},arguments[1] ? arguments[1] : 1500);
	}*/

})(window.jQuery, window);