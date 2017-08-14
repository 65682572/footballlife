(function($){
    var $win = $(window),
        $doc = $(document),
        /*字体响应式*/
        hd={
            testOs:function(str){
                var u = navigator.userAgent;
                var reg = new RegExp(str,'i');
                return reg.test(u);
            },
            isMobile:function(){
                if(/Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(navigator.userAgent)){
                    return true;
                }
                return false;
            },
            imageResize:function(obj){
                var p = new Array(obj);
                var p_width = 0,p_height = 0;//图片父级区域宽高比
                if(typeof obj != 'object') p = document.querySelectorAll(obj);
                var target=obj;
                for(var i=0;i<p.length;i++){//分别绑定图片加载完成事件
                    var target = p[i];
                    var parent = target.parentElement;
                    p_width = parent.offsetWidth==0?p[0].offsetWidth:parent.offsetWidth;//有隐藏的图片，则大小按第一个图片来计算，否则按第三个
                    p_height= parent.offsetHeight==0?p[0].offsetHeight:parent.offsetHeight;
                    var img_width=target.width,img_height=target.height;
                    if(img_height<p_height){//按高度100%
                        target.style.width="auto";
                        target.style.height="100%";
                        target.style.marginLeft=(p_width-(target.offsetWidth==0?img_width*p_height/img_height:target.offsetWidth))/2+"px";
                    }else{//按宽度100%
                        target.style.marginTop=(p_height-(target.offsetHeight==0?img_height*p_width/img_width:target.offsetHeight))/2+"px";
                    }
                }
            },
            lazyload: function() {
                var elements = $("img[original^='http://'],iframe[original^='http://']");
                if (elements.size() > 0)
                    $win.bind("scroll" , function() {
                        var scrollTop = $win.scrollTop();
                        elements.each(function() {
                            var element = $(this);
                            if ( ($win.height()+scrollTop) >= $(this).offset().top ) {
                                element.attr("src" , element.attr("original"));
                            }
                        });
                        elements = $($.grep(elements, function(n,i) {  /*已经加载的不再重新遍历*/
                            return $(n).attr("src") != $(n).attr("original");
                        }));
                    });
                $win.trigger("scroll");
            },
            cookie:function(name, value, expires) {
                if (typeof value != 'undefined') {
                    var expires = !value ? -1 : expires;
                    if (typeof expires == 'number') {
                        var date = new Date();
                        date.setTime(date.getTime() + (expires * 60 * 1000));
                        expires = '; expires=' + date.toUTCString();
                    } else {
                        expires = '';
                    }
                    document.cookie = [name, '=', encodeURIComponent(value), expires, '; path=/', '; domain=',document.domain].join('');
                } else {
                    if (m = new RegExp("(^|)" + name + "=([^;]*)(;|$)", "gi").exec(document.cookie)) {
                        return decodeURIComponent(m[2]);
                    }
                    return null;
                }
            },
            dialog: {
                tpl: '<div class="public_dialog f14"><h3 class="title_dlg f14">提示</h3><div class="content_dlg"></div><div class="btns_dlg"><a href="javascript://" class="sure" >确定</a></div></div>',
                now: '',
                cache : {},
                mask: 0,
                noscroll: false,
                inited: false,
                init: function () {
                    if ( !this.inited ) {
                        this.inited = true;
                        this.mask = document.createElement('div');
                        $("body").append(this.mask);
                        this.mask = $(this.mask).css({
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            display: 'none',
                            'z-index': 19990,
                            background: '#000000',
                            opacity: 0.5
                        });
                    }
                },
                popup: function(id, html, mask, func_create, func_show) {
                    if (!this.cache[id]) {
                        var div = $(document.createElement('div')).addClass('myDialog');
                        div.append(html).attr('id', id);
                        this.cache[id] = div;
                        $("body").append(div);
                        if (typeof func_create == 'function') {
                            func_create.call(this, div);
                        }
                    } else {
                        var div = this.cache[id];
                    }
                    this.now = id;
                    if (this.noscroll) {
                        $("html").css('overflow-y', 'hidden');
                    }
                    var css = {
                        left: ($doc.width() - div.width()) / 2,
                        top: ($win.height() - div.height()) / 2 - 20,
                        position: 'fixed',
                        'z-index': 20000
                    };
                    div.css(css).show();
                    if (!this.inited ) {
                        this.init();
                    }
                    if (mask) {
                        this.mask.css('height', $doc.height()).show();
                    }
                    if (typeof func_show == 'function') {
                        func_show.call(this, div);
                    }
                },
                close: function(id, nomask) {
                    if (id) {
                        if (this.cache[id]) {
                            this.cache[id].hide();
                        } else if (id == 'all') {
                            for (var i in this.cache) {
                                this.cache[i].hide();
                            }
                        }
                    } else if (this.now && this.cache[this.now]) {
                        this.cache[this.now].hide();
                    }
                    if ( !this.inited ) {
                        this.init();
                    }
                    if (!nomask) {
                        this.mask.hide();
                    }
                    if (this.noscroll) {
                        $("html").css('overflow-y', 'auto');
                    }
                },
                alert:function(content, func, title) {
                    this.popup('_alert', this.tpl, true, function(tpl) {
                        tpl.find('.title_dlg').draggable(tpl);
                    }, function(tpl) {
                        var ctn = tpl.find(".content_dlg"),
                            btn = tpl.find(".sure").off('click'),
                            fun=function(){
                                if(typeof func == 'function') func(tpl)
                                hd.dialog.close();
                            }
                        ctn.html(content);
                        tpl.find("_titile_dlg").text(title ? title : '${app_name}');
                        btn.on('click',fun);
                    });
                },
                confirm: function(content, func_sure, func_cancel,title) {
                    this.popup('_comfrim', this.tpl, true, function(tpl) {
                        tpl.find('.sure').after('<a href="javascript://" class="cancel" >取消</a>').css('width','50%');
                        tpl.find('.cancel').css('width','50%');
                        tpl.find('.title_dlg').draggable(tpl);
                    }, function(tpl) {
                        tpl.find(".content_dlg").html(content);
                        tpl.find("_titile_dlg").text(title ? title : '${app_name}');
                        var sure = tpl.find(".sure").off('click'),
                            cancel = tpl.find(".cancel").off('click');
                        var fun_s=function(){
                                if(typeof func_sure == 'function') func_sure(tpl)
                                hd.dialog.close();
                            },
                            fun_c=function(){
                                if(typeof func_cancel == 'function') func_cancel(tpl)
                                hd.dialog.close();
                            };
                        sure.click(fun_s);
                        cancel.click(fun_c);
                    });
                },
                tip:function(content,timeout,title){
                    this.popup('_tip', this.tpl, true, function(tpl) {
                        tpl.find('.title_dlg').draggable(tpl);
                    }, function(tpl) {
                        var ctn = tpl.find(".content_dlg");
                        tpl.find(".btns_dlg").remove();
                        ctn.html(content);
                        tpl.find("_titile_dlg").text(title ? title : '${app_name}');
                        setTimeout(function(){
                            hd.dialog.close();
                        },timeout);
                    });
                }
            }
        }
    /*可拖动*/
    $.fn.draggable = function(box) {
        var self = $(this).css('cursor', 'move'), $body = $('body'), $box = !box ? self : $(box), ox, oy, ptype = $box.css('position'), fixed = true;
        box = $box.get(0);
        function ub(e) { $doc.off('.drag'); }
        self.on({
            'mousedown': function(e) {
                var p = $box.position(), dw = $body.width(), dh = $body.height(), bw = $box.outerWidth(), bh = $box.outerHeight(), dx, dy;
                ox = e.pageX - p.left;
                oy = e.pageY - p.top;
                $doc.on({
                    'mousemove.drag': function(e) {
                        var x = Math.floor(e.pageX - ox), y = Math.floor(e.pageY - oy), sl = $win.scrollLeft(), st = $win.scrollTop();
                        if ( fixed ) {
                            x = x - sl;
                            y = y - st;
                            sl = st = 0;
                        }
                        if ( x <= sl ) {
                            x = sl;
                        } else {
                            dx = dw - bw;
                            if ( x > dx ) {
                                x = dx;
                            }
                        }
                        box.style.left = x + 'px';
                        if ( y <= st ) {
                            y = st;
                        } else {
                            dy = dh - bh;
                            if ( y > dy ) {
                                y = dy;
                            }
                        }
                        box.style.top = y + 'px';
                        return false;
                    },
                    'mouseup.drag': ub
                });
            },
            'mouseup': ub
        });
    };
    Date.prototype.format = function(format) {
        /*
         * eg:format="yyyy-MM-dd hh:mm:ss";
         */
        var o = {
            "M+" : this.getMonth() + 1, // month
            "d+" : this.getDate(), // day
            "H+" : this.getHours(), // hour
            "m+" : this.getMinutes(), // minute
            "s+" : this.getSeconds(), // second
            "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
            "S" : this.getMilliseconds()
            // millisecond
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
                - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
    window.hd = hd;
    window.myAlert=function(content,func,title){hd.dialog.alert(content,func,title)};
    window.myConfirm=function(content,func_sure,func_cancel,title){hd.dialog.confirm(content, func_sure, func_cancel,title)};
    window.myTip=function(content,timeout,title){hd.dialog.tip(content,timeout,title)};
})(jQuery);