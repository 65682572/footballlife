/* 通用Ajax确认按钮禁用 */
function confirmBtnDisabled(obj,url,data,ifS){
    if(typeof (ifS) == 'undefined'){
        ifS = true;
    }
    $(obj).attr('disabled','disabled');
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        async:false,
        success: function (result) {
            publicAlert({title:'提示信息',content:result.msg,icon:'fa fa-rocket'},result.status);
            if(result.status != true){
                $(obj).removeAttr('disabled');
            }
        }
    });
}
/* 通用alert警告框 */
function publicAlert(data,status){
    var defaultdata = {
        title:'提示信息',
        content:'操作失败！',
        icon:'fa fa-rocket'
    };
    data = $.extend({},defaultdata,data);
    var alert = {
        title: data.title,
        content: data.content,
        icon: data.icon,
        animation: 'scale',
        closeAnimation: 'scale',
        buttons: {
            okay: {
                text: '确定',
                btnClass: 'btn-blue',
                action: function () {
                    if(status){
                        location.reload();
                    }
                }
            }
        }
    };
    $.alert(alert);
}
/* 通用confirm确认框 */
function publicConfirm(data,id,action){
    var confirm = {
        title: data.title,
        content: data.content,
        icon: data.icon,
        action: action,
        animation: 'scale',
        closeAnimation: 'scale',
        buttons: {
            确定: function () {
                if ($("#btn-deviceDel").attr('id') == "btn-deviceDel") {
                    console.log('设备删除');
                    confirmBtnDisabled($(this), '/Device/delDevice', {id: id});
                }
                if ($("#btn-specDel").attr('id') == "btn-specDel") {
                    console.log("品牌管理");
                    confirmBtnDisabled($(this), '/SystemSet/delBrand', {brand_id: id});
                }
                if ($("#btn-typeGGDel").attr('id') == "btn-typeGGDel") {
                    console.log("型号规格");
                    confirmBtnDisabled($(this), '/SystemSet/delmarking', {marking_id: id});
                }
                if ($("#btn-editionDel").attr('id') == "btn-editionDel") {
                    console.log("版本管理");
                    confirmBtnDisabled($(this), '/SystemSet/delVersion', {versionId: id});
                }
                if ($("#btn-SBTypeDel").attr('id') == "btn-SBTypeDel") {
                    console.log("设备类型");
                    confirmBtnDisabled($(this), '/SystemSet/delClassify', {id: id});
                }
                if ($("#btn-SBGroupDel").attr('id') == "btn-SBGroupDel") {
                    console.log("设备组");
                    confirmBtnDisabled($(this), '/Device/delClassify', {id: id});
                }
                if ($("#branchMsgDel").attr('id') == "branchMsgDel") {
                    console.log("部门管理");
                    confirmBtnDisabled($(this), '/Organization/del_group', {group_id: id});
                }
                if ($("#organMsgDel").attr('id') == "organMsgDel") {
                    console.log("机构管理");
                    var action = 'delOrgAction';
                    confirmBtnDisabled($(this), '/Organization/createfirm', {id: id, action: action});
                }
                if ($(".reject").attr('onclick') == "reject()") {
                    console.log("拒绝请求消息");
                    $(".jt_newStyle1").remove();
                }
                if (confirm.action == 'verifyPass') {
                    confirmBtnDisabled($(this), '/Organization/createfirm', {id: id, action: 'verifyPass'});
                }
                if (confirm.action == 'verifyReject') {
                    confirmBtnDisabled($(this), '/Organization/createfirm', {id: id, action: 'verifyReject'});
                }
            },
            取消: function () {
                publicAlert({title:'提示信息',content:'操作取消！',icon:'fa fa-rocket'},false);
            }
        }
    };
    $.confirm(confirm);
}
function acceptRequest(data,callback,value1,value2){
    var confirm = {
        title: data.title,
        content: data.content,
        icon: data.icon,
        animation: 'scale',
        closeAnimation: 'scale',
        buttons: {
            okay: {
                text: '接受',
                btnClass: 'btn-blue',
                action: function () {
                    if (typeof callback === 'function') {
                        callback(value1,value2);
                        if (data.title == '请求视频连接') {
                             htmlCode = '<divembed id="requestBox" style="position: absolute; top: 100px; left: 100px; background-color: #000; width: 300px; height: 227px; z-index: 9999;"><div style="width: 100%; line-height: 25px; height: 25px; cursor: pointer; background-color: #000;"><a id="dragW" style="display: inline-block; color: #fff; width: 85%; cursor: move; position: relative; left: 15px;">-</a><a id="fullIcon" style="display: inline-block; color: #fff;" class="glyphicon glyphicon-resize-full closeQP"></a><a style="color: #fff; position: absolute; right: 40px; font-size: 20px; display: none;" class="glyphicon glyphicon-resize-small"></a><a id="closeDiv" style="color: rgb(255, 255, 255); position: absolute; right: 0px; top: -1px; display: inline-block; font-size: 27px;">×&nbsp;</a></div><embed id="pgAtx_DEV_PC_Request" width="100%" height="100%" type="application/peergine-plugin" style="cursor: pointer;"></divembed>';
                             var channelName = value1[2];
                             if (channelName.indexOf('Talking_Video') != -1) {
                                  htmlCode += '<divembed id="requestBox1" style="position: absolute; top: 400px; left: 100px; background-color: #000; width: 300px; height: 227px; z-index: 9999;"><div style="width: 100%; line-height: 25px; height: 25px; cursor: pointer; background-color: #000;"><a id="dragW1" style="display: inline-block; color: #fff; width: 85%; cursor: move; position: relative; left: 15px;">-</a><a id="fullIcon1" style="display: inline-block; color: #fff;" class="glyphicon glyphicon-resize-full closeQP"></a><a style="color: #fff; position: absolute; right: 40px; font-size: 20px; display: none;" class="glyphicon glyphicon-resize-small"></a><a id="closeDiv1" style="color: rgb(255, 255, 255); position: absolute; right: 0; top: -1px; display: inline-block; font-size: 27px;">×&nbsp;</a></div><embed id="pgAtx_DEV_PC_Request1" width="100%" height="100%" type="application/peergine-plugin" style="cursor: pointer;"></divembed>';
                             }
                             $('body').append(htmlCode);
                             $("#fullIcon").bind('click',function(){
                                 launchFullscreen(document.getElementById('requestBox'),5,this);
                             });
                             $("#fullIcon1").bind('click',function(){
                                 launchFullscreen(document.getElementById('requestBox1'),5,this);
                             });
                             document.addEventListener("webkitfullscreenchange", function (e) {
                                 if(!checkFull()){
                                     /* 地图运维预览退出全屏方法 */
                                     mapYWPreviewTC();
                                 }
                             });
                             $('#closeDiv').bind('click', function () {
                                 $('#requestBox').remove();
                                 $(".jt_wrapPage").css({
                                     "width":"100%",
                                     "height":"100%"
                                 });
                             });
                             $('#closeDiv1').bind('click', function () {
                                 $('#requestBox1').remove();
                                 $(".jt_wrapPage").css({
                                     "width":"100%",
                                     "height":"100%"
                                 });
                             });
                             /* 鼠标hover全屏图标和关闭图标 */
                             $('#fullIcon').hover(function () {
                                 $('#fullIcon').css('font-size', '15px')
                             }, function () {
                                 $('#fullIcon').css('font-size', '13px')
                             });
                             $('#fullIcon1').hover(function () {
                                 $('#fullIcon1').css('font-size', '15px')
                             }, function () {
                                 $('#fullIcon1').css('font-size', '13px')
                             });
                             $('#closeDiv').hover(function () {
                                 $('#closeDiv').css('font-size', '29px');
                             }, function () {
                                 $('#closeDiv').css('font-size', '27px');
                             });
                             $('#closeDiv1').hover(function () {
                                 $('#closeDiv1').css('font-size', '29px');
                             }, function () {
                                 $('#closeDiv1').css('font-size', '27px');
                             });
                             /* 可拖动窗口 */
                             var posX;
                             var posY;
                             var posX1;
                             var posY1;
                             var dragEl = document.getElementById('requestBox');
                             var dragEl1 = document.getElementById('requestBox1');
                             $('#dragW').bind('mousedown', function (e) {
                                 if (!e) e = window.event; // IE
                                 posX = e.clientX - parseInt(dragEl.offsetLeft);
                                 posY = e.clientY - parseInt(dragEl.offsetTop);
                                 document.onmousemove = mousemove;
                                 document.onselectstart = function () {
                                     return false;
                                 };
                             });
                             $('#dragW1').bind('mousedown', function (e) {
                                 if (!e) e = window.event; // IE
                                 posX1 = e.clientX - parseInt(dragEl1.offsetLeft);
                                 posY1 = e.clientY - parseInt(dragEl1.offsetTop);
                                 document.onmousemove = mousemove1;
                                 document.onselectstart = function () {
                                     return false;
                                 };
                             });
                             document.onmouseup = function () {
                                 document.onmousemove = null;
                                 document.onselectstart = function () {
                                     return true;
                                 };
                             };
                             function mousemove(ev) {
                                 if (ev == null) ev = window.event; // IE
                                 dragEl.style.left = (ev.clientX - posX) + "px";
                                 dragEl.style.top = (ev.clientY - posY) + "px";
                                 if (parseInt(dragEl.style.left) < 0) {
                                     dragEl.style.left = 0;
                                 }
                                 if (parseInt(dragEl.style.top) < 0) {
                                     dragEl.style.top = 0;
                                 }
                                 /* 限制拖动的右边界 */
                                 var dragrightedge = $('html').width();
                                 if ((parseInt(dragEl.style.left) + parseInt($('#requestBox').width())) > parseInt(dragrightedge)) {
                                     dragEl.style.left = parseInt(dragrightedge) - parseInt($('#requestBox').width());
                                 }
                                 /* 限制拖动的下边界 */
                                 var dragbottomedge = $('html').height();
                                 if ((parseInt(dragEl.style.top) + parseInt($('#requestBox').height())) > parseInt(dragbottomedge)) {
                                     dragEl.style.top = parseInt(dragbottomedge) - parseInt($('#requestBox').height());
                                 }
                             }
                             function mousemove1(ev){
                                 if (ev == null) ev = window.event; // IE
                                 dragEl1.style.left = (ev.clientX - posX1) + "px";
                                 dragEl1.style.top = (ev.clientY - posY1) + "px";
                                 if (parseInt(dragEl1.style.left) < 0) {
                                     dragEl1.style.left = 0;
                                 }
                                 if (parseInt(dragEl1.style.top) < 0) {
                                     dragEl1.style.top = 0;
                                 }
                                 /* 限制拖动的右边界 */
                                 var dragrightedge = $('html').width();
                                 if ((parseInt(dragEl.style.left) + parseInt($('#requestBox1').width())) > parseInt(dragrightedge)) {
                                     dragEl.style.left = parseInt(dragrightedge) - parseInt($('#requestBox1').width());
                                 }
                                 /* 限制拖动的下边界 */
                                 var dragbottomedge = $('html').height();
                                 if ((parseInt(dragEl.style.top) + parseInt($('#requestBox1').height())) > parseInt(dragbottomedge)) {
                                     dragEl.style.top = parseInt(dragbottomedge) - parseInt($('#requestBox1').height());
                                 }
                             }
                            //var active = {
                            //    setTop: function(){
                            //        layer.open({// 多窗口模式，层叠置顶
                            //            type: 2,
                            //            title: '当你选择该窗体时，即会在最顶端',
                            //            area: ['390px', '260px'],
                            //            shade: 0,
                            //            maxmin: true,
                            //            offset: [// 坐标
                            //                Math.random()*($(window).height()-300),
                            //                Math.random()*($(window).width()-390)
                            //            ],
                            //            content: '/Application/Home/View/Common/requestModel.html',
                            //            btn: ['全部关闭'],
                            //            btn2: function(){
                            //                layer.closeAll();
                            //            },
                            //            zIndex: layer.zIndex,
                            //            success: function(layero){
                            //                layer.setTop(layero); //重点2
                            //            }
                            //        });
                            //    }
                            //};
                            //$('.btn-blue').attr('data-method','setTop');
                            //$("button[data-method='setTop']").on('click', function(){
                            //    var othis = $(this), method = othis.data('method');
                            //    active[method] ? active[method].call(this, othis) : '';
                            //});
                        }
                    }
                }
            },
            cancel: {
                text: '拒绝'
            }
        }
    };
    $.confirm(confirm);
    setTimeout(function(){
        addFrame();
    },1);
}
/* 监听ESC按键 */
function checkFull(){
    var isFull =  document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
    if(isFull === undefined) isFull = false;
    return isFull;
}
/* 地图运维预览退出全屏方法 */
function mapYWPreviewTC() {
    $("#dragW").css({
        "text-align":"",
        "position":"relative",
        "left":"15px"
    });
    $("#dragW").text("-");
    $("#dragW1").css({
        "text-align":"",
        "position":"relative",
        "left":"15px"
    });
    $("#dragW1").text("-");
    $(".jt_wrapPage").css({
        "width":"100%",
        "height":"100%"
    });
    $("#fullIcon").parent().parent().css({
        "width":"300px",
        "height":"227px",
        "top":"100px",
        "left":"100px"
    });
    $("#fullIcon1").parent().parent().css({
        "width":"300px",
        "height":"227px",
        "top":"400px",
        "left":"100px"
    });
    $("#fullIcon").css({
        "position":"relative",
        "top":"1px",
        "right":""
    });
    $("#fullIcon1").css({
        "position":"relative",
        "top":"1px",
        "right":""
    });
}
function confirmRequest(data,callback,value1,value2) {
    var confirm = {
        title: data.title,
        content: data.content,
        icon: data.icon,
        animation: 'scale',
        closeAnimation: 'scale',
        buttons: {
            okay: {
                text: '是否发起对讲',
                btnClass: 'btn-blue',
                action: function () {
                    if (typeof callback === 'function') {
                        callback(value1,value2);
                    }
                }
            }
        },
        cancel: {
            text: '仅发起视频请求'
        }
    };
    $.confirm(confirm);
    setTimeout(function(){
        addFrame();
    },1);
}
/* 通用监听键盘回车事件 */
function enter(func){
    if (event.keyCode == 13){
        func();
    }
}
/* 通用分类回车搜索功能 */
function search2(valueS) {
    if(event.keyCode == 13){
        $(valueS).parent().parent().find('ul').show();
        $(valueS).parent().parent().find('ul').empty();
        var sry1 = $(valueS).parent().parent().parent().find('li');
        var result = $(valueS).val().toLowerCase();
        var html2 = "";
        var flag = 0;
        for(i = 0; i < sry1.length; i++){
            if($(sry1[i]).attr("onclick") == 'jt_clickLi_select(this)' || $(sry1[i]).attr("onclick") == 'jt_clickLi_select1(this)' || $(sry1[i]).attr("onclick") == 'jt_clickLi_select2(this)') {
                var dataValue = $(sry1[i]).attr("value");
                var data = $(sry1[i]).context.innerText;
                var isValue = data.toLowerCase().indexOf(result);
                if (isValue >= 0) {
                    if($(sry1[i]).attr("onclick") == 'jt_clickLi_select1(this)'){
                        html2 += '<li onclick="jt_clickLi_select1(this)" value="' + dataValue + '" style="text-align: center; padding: 10px; color: #CD3030;">' + data + '</li>';
                        flag = 1;
                    }
                    else{
                        html2 += '<li onclick="jt_clickLi_select(this)" value="' + dataValue + '" style="text-align: center; padding: 10px; color: #CD3030;">' + data + '</li>';
                        flag = 1;
                    }
                }
            }
        }
        $(valueS).parent().parent().find('ul').html(html2);
        if(flag == 0 || result == ''){
            html2 = '<li style="text-align: center; padding: 10px; color: #CD3030;">没有搜索到相关内容</li>';
            $(valueS).parent().parent().find('ul').html(html2);
        }
    }
}
/* 通用自定义name全选 */
function checkedAll(name){
    var names=document.getElementsByName(name);
    var len=names.length;
    if(len>0){
        var i=0;
        for(i=0;i<len;i++)
            names[i].checked=true;
    }
}
/* 通用自定义name全不选 */
function checkedNo(name){
    var names=document.getElementsByName(name);
    var len=names.length;
    if(len>0){
        var i=0;
        for(i=0;i<len;i++)
            names[i].checked=false;
    }
}
/* jsTree通用全选 */
function checkedAllTree(value){
    if($(value).parent().parent().children().first().find('div').attr('id') =='deviceTree'){
        $('#deviceTree').jstree().open_all();
    }else if($(value).parent().parent().children().first().find('div').attr('id') =='modifyTree'){
        $('#modifyTree').jstree().open_all();
    }else if($(value).parent().parent().children().first().find('div').attr('id') =='authTree'){
        $('#authTree').jstree().open_all();
    }
    $(value).parent().parent().children().children().children().find('a').addClass('jstree-clicked');
}
/* jsTree通用全不选 */
function checkedNoTree(value){
    if($(value).parent().parent().children().first().find('div').attr('id') =='deviceTree'){
        $('#deviceTree').jstree().close_all();
    }else if($(value).parent().parent().children().first().find('div').attr('id') =='modifyTree'){
        $('#modifyTree').jstree().close_all();
    }else if($(value).parent().parent().children().first().find('div').attr('id') =='authTree'){
        $('#authTree').jstree().close_all();
    }
    $(value).parent().parent().children().children().children().find('a').removeClass('jstree-clicked');
}
/* 通用跳转方法 */
function windowOpen(url){
    window.open(url);
}
/* 首页、设备运维页输入源搜IP索功能 */
function search() {
    var sry1 = document.getElementById("menu3").getElementsByTagName("a");
    var result = $("#searchSource").val().toLowerCase();
    html = "";
    var flag = 0;
    for(i = 0; i < sry1.length; i++){
        if($(sry1[i]).attr("ondblclick") == 'doubleclick(this)' || $(sry1[i]).attr("ondragstart") == 'device_drag(event)' || $(sry1[i]).attr("onmousedown") == 'onClickDown(event, this)' || $(sry1[i]).attr("onclick") == 'findMarker(event, this)'){
            if(sry1[i].id != ""){
                var value = $(sry1[i]).find('span');
                var data = $(value).context.innerText;
                var isValue = data.toLowerCase().indexOf(result);
                if(isValue >= 0){
                    if($(sry1[i]).attr("ondblclick") == 'doubleclick(this)'){
                        html += '<a ondblclick="doubleclick(' + sry1[i].id + ')" style="text-align: center; padding-right: 30px;">' + data + '</a>';
                        document.getElementById("jt_inputList").innerHTML = html;
                        flag = 1;
                    }else if($(sry1[i]).attr("ondragstart") == 'device_drag(event)'){
                        html += '<a draggable="true" ondragstart="device_drag(event)" id="' + sry1[i].id + '" style="text-align: center; padding-right: 30px;">' + data + '</a>';
                        document.getElementById("jt_inputList").innerHTML = html;
                        flag = 1;
                    }else if($(sry1[i]).attr("onmousedown") == 'onClickDown(event, this)'){
                        html += '<a onmousedown="onClickDown(event, this)" id="' + sry1[i].id + '" style="text-align: center; padding-right: 30px;">' + data + '</a>';
                        document.getElementById("jt_inputList").innerHTML = html;
                        flag = 1;
                    }else{
                        html += '<a onclick="findMarker(event, this)" id="' + sry1[i].id + '" style="text-align: center; padding-right: 30px;">' + data + '</a>';
                        document.getElementById("jt_inputList").innerHTML = html;
                        flag = 1;
                    }
                }
            }
        }
    }
    if(flag == 0  || result == ''){
        html = '<a style="text-align: center; padding-right: 20px;">没有搜索到相关内容</a>';
        document.getElementById("jt_inputList").innerHTML = html;
    }
}
function clickctrl(id){
    $("#ctrl").attr("data-id",id);
}
function showmenu(trid){
    var str = $(trid).parent().parent().find("ul:first");
    if(!str.is(':visible')){
        str.each(function(){
            $(this).slideDown(700);
        });
    }else{
        str.each(function(){
            $(this).slideUp(700);
        });
    }
}
/* 点击隐藏功能 */
function click_hide_parent(id){
    var matrix = document.getElementById(id);
    $(matrix).toggle(600);
}

/* 加入图标提示 */
function tipIcon(id){
    console.log("aaaaa");
    console.log(id);
}

/* 点击隐藏功能 */
function click_hide(selfObj){
    var str = $(selfObj).parent().find('a');
    if(!str.is(':visible')){
        str.each(function(){
            $(this).slideDown(700);
        });
    }else{
        str.each(function(){
            $(this).slideUp(700);
        });
    }
}

function click_child_hide(selfObj){
    var str = $(selfObj).parent().find('p');
    var str1 = $(selfObj).parent().find('#jt_ifAB');
    if(!str.is(':visible')){
        str.each(function(){
            $(this).slideDown(700);
        });
    }else{
        str.each(function(){
            $(this).slideUp(700);
        });
    }
    if(str1.attr("src") == "/Public/common/images/icon_--.png"){
        str1.attr("src", "/Public/common/images/icon_++.png");
    }else if(str1.attr("src") == "/Public/common/images/icon_++.png"){
        str1.attr("src", "/Public/common/images/icon_--.png");
    }
}


// 点击列表隐藏功能与选择分类
function change_select_hide(){
    var selectel = document.getElementById('changelist');
    var selectchange = document.getElementById('changelist').selectedIndex;
    var selectval = selectel.options[selectchange].text;
    selectchange = selectchange - 1;
    var changemenuval = $('.selectchangemenu').get(selectchange).getAttribute('data-name');
    if(selectval == changemenuval){
        var showselectmenu = $('.selectchangemenu').get(selectchange);
        $(showselectmenu).slideDown(700);
        $(showselectmenu).siblings('.selectchangemenu').slideUp(700);
        var menusiblings = $(showselectmenu).siblings();
        for(var i = 1; i < menusiblings.length; i++){
            if($(menusiblings[i]).attr('dd-name') == changemenuval){
                $($(menusiblings)[i]).show(700);
            }else{
                $($(menusiblings)[i]).hide(700);
            }
        }
    }
    if(selectval == '所有设备'){
        $('.selectchangemenu').slideDown(700);
        $('.selectchangemenu').siblings().slideDown(700);
    }
}
/* 首页窗口号全屏判断参数分别调用 */
function agentCall(){
    var thisParent = document.getElementById('v' + selfDevice);
    var thisVideo = document.getElementById(selfDevice);
    if(thisParent){
        launchFullscreen(thisParent,2);
    }else if(thisVideo){
        launchFullscreen(thisVideo,3);
    }else{
        if(selfDevice == ""){
            publicAlertAdd({title:'提示信息',content:'请先选择窗口！',icon:'fa fa-rocket'},false);
            return;
        }else{
            publicAlertAdd({title:'提示信息',content:'请选择正在运行的窗口！',icon:'fa fa-rocket'},false);
            return;
        }
    }
}
/* 整体全屏机制(地图页、首页) */
var index = 1;
function launchFullscreen(element , value , obj) {
    thisSRY = value;
    thisObj = obj;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
document.addEventListener("webkitfullscreenchange", function (e) {
    if(index % 2 != 0 && thisSRY != "4"){
        if(thisSRY == "2" && thisSRY != "4"){
            /* 窗口号视频源全屏 */
            windowNumberQP();
        }else if(thisSRY == "1" && thisSRY != "4"){
            /* 首页、地图运维、设备布局、窗体全屏 */
            formsQP();
        }else if(thisSRY == "3" && thisSRY != "4"){
            /* 窗口号传感器全屏 */
            windowNumberCGQQP();
        }else if(thisSRY == "5" && thisSRY != "4"){
            if($(thisObj).parent().parent().attr("id") == "requestBox"){
                $(thisObj).parent().parent().css({
                    "top":"0",
                    "left":"0",
                    "width":"100%",
                    "height":"100%"
                });
                $("#dragW").css({
                    "text-align":"center",
                    "position":"relative",
                    "left":"7%"
                });
                $("#dragW").text(" 按下键盘Esc键自动退出全屏！");
            }else{
                $("#requestBox").css({
                    "width":"0",
                    "height":"0"
                });
                $(thisObj).parent().parent().css({
                    "top":"0",
                    "left":"0",
                    "width":"100%",
                    "height":"100%"
                });
                $("#dragW1").css({
                    "text-align":"center",
                    "position":"relative",
                    "left":"7%"
                });
                $("#dragW1").text(" 按下键盘Esc键自动退出全屏！");
            }
            $(thisObj).css({
                "position":"absolute",
                "top": "7px",
                "right": "50px"
            });
            $(".jt_wrapPage").css({
                "width":"0",
                "height":"0"
            });
        }
        index++;
    }else if(thisSRY != "4"){
        index++;
        /* 退出全屏 */
        quitQP();
    }
});
/* 窗口号视频源全屏 */
function windowNumberQP(){
    $('#v' + selfDevice).css({
        "width":"100%",
        "height":"100%"
    });
    $('#v' + selfDevice).parent().parent().children().not($('#v' + selfDevice).parent()).css({
        "width":"0",
        "height":"0"
    });
}
/* 首页、地图运维、设备布局、窗体全屏 */
function formsQP(){
    $(".grid").children().find('div').css({
        "width":"100%",
        "height":"100%"
    });
    $(".mapPage").css("height", "100%");
    $("#allmap").css("height", "100%");
    $(".monitorPage").css("height", "100%");
    $("#jt_videoRegion").css("height", "100%");
    $(".jt_grid").css("height","98%");
    $(".oneGrid1").css("height","100.3%");
    $(".fourGrid").css("height","50.2%");
    $(".fourGridQ").css("top","50%");
    $(".sixGrid1").css("height","66%");
    $(".sixGrid2").css("height","33%");
    $(".sixGrid3").css({
        'height':'33%',
        'top':'32.9%'
    });
    $(".sixGridQ").css({
        'top':'65.9%',
        'height':'34.2%'
    });
    $(".sevenGridW").css("height","33.5%");
    $(".sevenGrid2").css("height","67%");
    $(".sevenGrid3").css("top","33.4%");
    $(".sevenGridQ").css({
        'height':'33.2%',
        'top':'66.9%'
    });
    $(".nineGrid1-3").css("height","33.4%");
    $(".nineGrid4-6").css({
        'height':'33.4%',
        'top':'33.2%'
    });
    $(".nineGrid7-9").css({
        'height':'33.5%',
        'top':'66.6%'
    });
    $(".tenGrid1").css("height","40.1%");
    $(".tenGrid2-3").css("height","30%");
    $(".tenGrid4-5").css({
        'height':'30%',
        'top':'29.9%'
    });
    $(".tenGrid6-7").css({
        'height':'30%',
        'top':'40%'
    });
    $(".tenGrid7").css({
        'width':'24.9%',
        'left':'24.8%'
    });
    $(".tenGrid9").css({
        'width':'24.9%',
        'left':'24.8%'
    });
    $(".tenGrid8-9").css({
        'height':'30%',
        'top':'70%'
    });
    $(".tenGrid10").css({
        'height':'40.2%',
        'top':'59.9%'
    });
    $(".twelveGrid1-4").css("height","33.4%");
    $(".twelveGrid5-8").css({
        'height':'33.4%',
        'top':'33.2%'
    });
    $(".twelveGrid9-12").css({
        'height':'33.5%',
        'top':'66.6%'
    });
    $(".thirteenGrid1-4").css("height","25%");
    $(".thirteenGrid5_7").css({
        'height':'25%',
        'top':'24.8%'
    });
    $(".thirteenGrid8-9").css({
        'height':'25%',
        'top':'49.8%'
    });
    $(".thirteenGrid10-13").css({
        'height':'25.3%',
        'top':'74.8%'
    });
    $(".thirteenGrid6").css({
        'height':'50%',
        'top':'24.8%'
    });
    $(".sixteenGrid1-4").css("height","25%");
    $(".sixteenGrid5-8").css({
        'height':'25%',
        'top':'24.8%'
    });
    $(".sixteenGrid9-12").css({
        'height':'25%',
        'top':'49.8%'
    });
    $(".sixteenGrid13-16").css({
        'height':'25.3%',
        'top':'74.8%'
    });
}
/* 窗口号传感器全屏 */
function windowNumberCGQQP(){
    $('#' + selfDevice).children().css({
        "width":"100%",
        "height":"100%"
    });
    $('#' + selfDevice).parent().parent().children().not($('#' + selfDevice).parent()).css({
        "width":"0",
        "height":"0"
    });
}
/* 退出全屏 */
function quitQP(){
    /* 窗口号视频源退出全屏 */
    $('#v' + selfDevice).parent().parent().children().not($('#v' + selfDevice).parent()).css({
        "width":"",
        "height":""
    });
    /* 窗口号传感器退出全屏 */
    $('#' + selfDevice).parent().parent().children().not($('#' + selfDevice).parent()).css({
        "width":"",
        "height":""
    });
    /* 首页、地图运维、设备布局、窗体退出全屏 */
    $("#jt_videoRegion").css("display","block");
    $(".mapPage").css("height", "490.2px");
    $("allmap").css("height", "490.2px");
    $(".monitorPage").css("height", "");
    $("#jt_videoRegion").css("height", "566px");
    $(".jt_grid").css("height","546px");
    $(".fourGrid").css("height","274px");
    $(".tenGrid8-9").css("height","30.2%");
    $(".thirteenGrid5_7").css("top","24.9%");
    $(".thirteenGrid6").css({
        'height':'49.9%',
        'top':'24.9%'
    });
    $(".sixGrid3").css('top','32.8%');
    $(".sixGridQ").css({
        'height':'34.3%',
        'top':'65.8%'
    });
    $(".sixteenGrid1-4").css("height","24.9%");
}
/* show hide 坐右边栏 */
$(document).ready(function(){
    /* 菜单收放 */
    $("#menu3").show();
    $("#menu4").show();
    //$("#menu5").show();
    var hide1 = document.getElementById("jt_leftBarMenu");
    var hide2 = document.getElementById("jt_rightBarInfo");
    $("#toggle").click(function(){
        if($(hide1).css("display") == "block"){
            if(window.screen.width >= 1920){
                $(".jt_leftBarMenu").hide(function(){
                    /* 处理完毕 */
                    if($(hide2).css("display") == "block"){
                        /* 首页 1920hide处理 */
                        $(".jt_main").css({
                            "margin": "26px 245px 0 0"
                        });
                        $("#lk_canvas").css({
                            "width": "81.4%",
                            "margin-left": "9.5%"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 245px 0 0"
                        });
                        $(".jt_grid").css({
                            "width": "98.4%"
                        });
                        /* 地图页 */
                        $(".jt_mapMain").css({
                            "margin": "16px 0 0 0"
                        });
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }else{
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 0 0 0"
                        });
                        $("#lk_canvas").css({
                            "width": "82%",
                            "margin-left": "9%"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 0 0 0"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%"
                        });
                        /* 地图页 */
                        $(".jt_mapMain").css({
                            "margin": "16px 0 0 0"
                        });
                        $("#allmap").css({
                            "width": "100%"
                        });
                        /* 通用界面 */
                        $(".jt_basicMain").css({
                            "margin": "26px 0 0 0"
                        });
                    }
                });
            }else{
                /* 处理完毕 */
                $(".jt_leftBarMenu").hide(function(){
                    if($(hide2).css("display") == "block"){
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 245px 0 0"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 245px 0 0"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%"
                        });
                        /* 地图页 */
                        $(".jt_mapMain").css({
                            "margin": "16px 245px 0 0"
                        });
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }else{
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 0 0 0"
                        });
                        $("#lk_canvas").css({
                            "width": "81.4%",
                            "margin-left": "9.5%"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 0 0 0"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%"
                        });
                        /* 地图页 */
                        $(".jt_mapMain").css({
                            "margin": "16px 0 0 0"
                        });
                        $("#allmap").css({
                            "width": "100%"
                        });
                        /* 通用界面 */
                        $(".jt_basicMain").css({
                            "margin": "26px 0 0 0"
                        });
                    }
                });
            }
            /* 处理完毕 */
        }else{
            if(window.screen.width >= 1920){
                $(".jt_leftBarMenu").show(function(){
                    if($(hide2).css("display") == "block"){
                        /* 首页 1920show处理 */
                        $(".jt_main").css({
                            "margin": "26px 245px 0 255px"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 245px 0 255px"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%",
                            "margin-left": "0"
                        });
                        /* 地图页 */
                        $(".jt_mapMain").css({
                            "margin": "16px 0 0 255px"
                        });
                        $("#allmap").css({
                            "width": "100%"
                        });
                        /* 处理完毕 */
                    }else{
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 0 0 255px"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 0 0 255px"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%",
                            "margin-left": "0"
                        });
                        /* 地图页 */
                        $(".jt_mapMain").css({
                            "margin": "16px 0 0 255px"
                        });
                        $("#allmap").css({
                            "width": "100%"
                        });
                        /* 通用界面 */
                        $(".jt_basicMain").css({
                            "margin": "26px 0 0 255px"
                        });
                    }
                });
                /* 处理完毕 */
            }else{
                $(".jt_leftBarMenu").show(function(){
                    if($(hide2).css("display") == "block"){
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 245px 0 255px"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 245px 0 255px"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%",
                            "margin-left": "0"
                        });
                        /* 地图页 */
                        $(".jt_mapMain").css({
                            "margin": "16px 0 0 255px"
                        });
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }else{
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 0 0 255px"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 0 0 255px"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%",
                            "margin-left": "0"
                        });
                        /* 地图页 */
                        $(".jt_mapMain").css({
                            "margin": "16px 0 0 255px"
                        });
                        $("#allmap").css({
                            "width": "100%"
                        });
                        /* 通用界面 */
                        $(".jt_basicMain").css({
                            "margin": "26px 0 0 255px"
                        });
                    }
                });
            }
        }
    });
    /* 处理完毕 */
    $(".toggle-left span").click(function(){
        if($(hide2).css("display") == "none"){
            if(window.screen.width >= 1920){
                $("#jt_rightBarInfo").show(function(){
                    if($(hide1).css("display") == "block"){
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 245px 0 255px"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 245px 0 255px"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%",
                            "margin-left": "0"
                        });
                        /* 地图页 */
                        //$(".jt_mapMain").css({
                        //    "margin": "16px 245px 0 255px"
                        //});
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }else{
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 245px 0 0"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 245px 0 0"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%",
                            "margin-left": "0"
                        });
                        /* 地图页 */
                        //$(".jt_mapMain").css({
                        //    "margin": "16px 245px 0 0"
                        //});
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }
                });
            }else{
                $("#jt_rightBarInfo").show(function(){
                    if($(hide1).css("display") == "block"){
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 245px 0 255px"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 245px 0 255px"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%",
                            "margin-left": "0"
                        });
                        /* 地图页 */
                        //$(".jt_mapMain").css({
                        //    "margin": "16px 245px 0 255px"
                        //});
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }else{
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 245px 0 0"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 245px 0 0"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%",
                            "margin-left": "0"
                        });
                        /* 地图页 */
                        //$(".jt_mapMain").css({
                        //    "margin": "16px 245px 0 0"
                        //});
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }
                });
            }
        }else{
            /* 处理完毕 */
            if(window.screen.width >= 1920){
                $("#jt_rightBarInfo").hide(function(){
                    if($(hide1).css("display") == "block"){
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 0 0 255px"
                        });
                        $("#lk_canvas").css({
                            "width": "82%",
                            "margin-left": "9%"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 0 0 255px"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%"
                        });
                        /* 地图页 */
                        //$(".jt_mapMain").css({
                        //    "margin": "16px 0 0 255px"
                        //});
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }else{
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 0 0 0"
                        });
                        $("#lk_canvas").css({
                            "width": "82%",
                            "margin-left": "9%"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 0 0 0"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%"
                        });
                        /* 地图页 */
                        //$(".jt_mapMain").css({
                        //    "margin": "16px 0 0 0"
                        //});
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }
                });
            }else{
                $("#jt_rightBarInfo").hide(function(){
                    if($(hide1).css("display") == "block"){
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 0 0 255px"
                        });
                        $("#lk_canvas").css({
                            "width": "100%",
                            "margin-left": "0"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 0 0 255px"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%"
                        });
                        /* 地图页 */
                        //$(".jt_mapMain").css({
                        //    "margin": "16px 0 0 255px"
                        //});
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }else{
                        /* 首页 */
                        $(".jt_main").css({
                            "margin": "26px 0 0 0"
                        });
                        $("#lk_canvas").css({
                            "width": "82%",
                            "margin-left": "9%"
                        });
                        /* 监控页 */
                        $(".jt_monitorMain").css({
                            "margin": "16px 0 0 0"
                        });
                        $(".jt_grid").css({
                            "width": "98.3%"
                        });
                        /* 地图页 */
                        //$(".jt_mapMain").css({
                        //    "margin": "16px 0 0 0"
                        //});
                        $("#allmap").css({
                            "width": "100%"
                        });
                    }
                });
            }
        }
    });
    /* 处理完毕 */
    /* 电子地图下拉菜单 */
    $("#jt_onMouse1").mouseover(function(){
        $(".jt_xiaLaHover1").show();
    });
    $("#jt_onMouse1").mouseout(function(){
        $(".jt_xiaLaHover1").hide();
    });
    /* 机构下拉菜单 */
    $("#jt_onMouse2").mouseover(function(){
        $(".jt_xiaLaHover2").show();
    });
    $("#jt_onMouse2").mouseout(function(){
        $(".jt_xiaLaHover2").hide();
    });
    /* 系统设置下拉菜单 */
    $("#jt_onMouse3").mouseover(function(){
        $(".jt_xiaLaHover3").show();
    });
    $("#jt_onMouse3").mouseout(function(){
        $(".jt_xiaLaHover3").hide();
    });
    /* leftbar_xtSet切换 */
    $("#jt_showhide2").click(function(){
        $("#menu-showhide3,#menu-showhide4,#menu-showhide5,#menu-showhide6").slideUp(700);
    });
    $("#jt_showhide3").click(function(){
        $("#menu-showhide2,#menu-showhide4,#menu-showhide5,#menu-showhide6").slideUp(700);
    });
    $("#jt_showhide4").click(function(){
        $("#menu-showhide2,#menu-showhide3,#menu-showhide5,#menu-showhide6").slideUp(700);
    });
    $("#jt_showhide5").click(function(){
        $("#menu-showhide2,#menu-showhide3,#menu-showhide4,#menu-showhide6").slideUp(700);
    });
    $("#jt_showhide6").click(function(){
        $("#menu-showhide2,#menu-showhide3,#menu-showhide4,#menu-showhide5").slideUp(700);
    });

    /* 主体工具栏收放 */
    $(".jt_funcRight").click(function(){
        if($("#jt_imgToggle").attr("src") == "/Public/common/images/icon_showTool.png"){
            $("#jt_imgToggle").attr("src","/Public/common/images/icon_hideTool.png")
        }else{
            $("#jt_imgToggle").attr("src","/Public/common/images/icon_showTool.png");
        }
        $("#jt_rightBarMSLB,.jt_toolBar").toggle(500);
    });

    /* 菜单收放并且主体上移 */
    $("#toggle1").click(function(){
        if($("#jt_imgMenu").attr("src") == "/Public/common/images/icon_hideToolB.png"){
            $(".jt_topMenu").toggle(500);
            $(".jt_main").animate({"margin-top":"-63px"});
            $(".jt_monitorMain").animate({"margin-top":"-63px"});
            $("#jt_imgMenu").attr("src","/Public/common/images/icon_showToolB.png")

        }else{
            $(".jt_topMenu").toggle(500);
            $(".jt_monitorMain").animate({"margin-top":"16px"});
            $(".jt_main").animate({"margin-top":"26px"});
            $("#jt_imgMenu").attr("src","/Public/common/images/icon_hideToolB.png");
        }
        /* 当收起左边模块，在收起菜单的时候logo图标的问题 */
        if($(hide1).css("display") == "none" && $("#jt_imgMenu").attr("src") == "/Public/common/images/icon_showToolB.png"){
            $("#jt_logoImg").css("opacity","0");
            $("#toggle").css({
                'top':'-6px',
                'left':'195px'
            });
            $("#toggle1").css({
                'top':'-6px',
                'left':'230px'
            });
        }else{
            $("#jt_logoImg").css("opacity","1");
            $("#toggle").css({
                'top':'2px',
                'left':'175px'
            });
            $("#toggle1").css({
                'top':'2px',
                'left':'210px'
            });
        }
    });
    $(".jt_closeBox").click(function(){
        $(".jt_download").hide();
    });
    $(".jt_closeBox1").click(function(){
        $(".jt_tipInfo").hide();
    });
    $(".jt_closeBox2").click(function(){
        $(".jt_FBLTipInfo").hide();
    });
    /* 首页设备运维云台控制长按设置一个长按的计时器，如果点击这个图层超过1秒则触发 */
    var timeout ;
    $(".jt_position1").mousedown(function() {
        timeout = setTimeout(function() {
            sendCtrl(1);
        }, 1000);
    });
    $(".jt_position2").mousedown(function() {
        timeout = setTimeout(function() {
            sendCtrl(2);
        }, 1000);
    });
    $(".jt_position3").mousedown(function() {
        timeout = setTimeout(function() {
            sendCtrl(3);
        }, 1000);
    });
    $(".jt_position4").mousedown(function() {
        timeout = setTimeout(function() {
            sendCtrl(4);
        }, 1000);
    });
    $(".jt_position5").mousedown(function() {
        timeout = setTimeout(function() {
            sendCtrl(5);
        }, 1000);
    });
    $(".jt_position6").mousedown(function() {
        timeout = setTimeout(function() {
            sendCtrl(6);
        }, 1000);
    });
    $(".jt_position7").mousedown(function() {
        timeout = setTimeout(function() {
            sendCtrl(7);
        }, 1000);
    });
    $(".jt_position8").mousedown(function() {
        timeout = setTimeout(function() {
            sendCtrl(8);
        }, 1000);
    });
    $(".jt_stop").mouseup(function() {
        sendCtrl(0);
        clearTimeout(timeout);
    });
});
/* 检测浏览器是否安装此插件 */
function hasPlugin(name) {
    name = name.toLowerCase();
    for (var i = 0; i < navigator.plugins.length; i++) {
        if (navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
            var pluginExist = true;
        }
    }
    cookFlag =  $.cookie('cookFlag');
    setTimeout(function(){
        if(pluginExist === true){
            return false;
        }else{
            var regStr_chrome = /chrome\/[\d.]+/gi;
            var userAgent = navigator.userAgent.toLowerCase(); // 取得浏览器的userAgent字符串
            /* 判断谷歌浏览器版本号 */
            if(userAgent.match(regStr_chrome) == "chrome/44.0.2403.130"){
                if(cookFlag == undefined){
                    $(".jt_download").slideDown(600);
                    $(".jt_noTips").click(function(){
                        $.cookie('cookFlag', 'true', { path: '/' });
                        $(".jt_download").slideUp(400);
                    });
                }
            }else{
                if(cookFlag == undefined){
                    $(".jt_tipInfo").slideDown(600);
                    $(".jt_noTips").click(function(){
                        cookFlag = $.cookie('cookFlag', 'true', { path: '/' });
                        $(".jt_tipInfo").slideUp(400);
                    });
                }
            }
        }
    });
}
/* 调用检测方法，传入插件名字 */
hasPlugin("Peergine NPAPI Plugin");
/* 检测用户屏幕分辨率 */
$(document).ready(function(){
    cookFlag =  $.cookie('cookFlag');
    if(screen.width <= 1280 && cookFlag == undefined){
        $(".jt_FBLTipInfo").slideDown(600);
        $(".jt_noTips").click(function(){
            $.cookie('cookFlag', 'true', { path: '/' });
            $(".jt_FBLTipInfo").slideUp(400);
        });
    }
});
/* 右下角添加请求提示信息(暂时没做功能没用到) */
function publicInfoBox(textS, inS, outS, outStyleS, outStyleV, callback) {
    var outerBox = document.createElement("div");
    outerBox.setAttribute(outStyleS, outStyleV);
    $("body").append(outerBox);
    var withinBox = document.createElement("div");
    withinBox.setAttribute('class', 'row');
    $(outerBox).append(withinBox);
    var tipsInfo = document.createElement("span");
    // tipsInfo.setAttribute(styleS,styleV);
    $(tipsInfo).text(textS);
    $(withinBox).append(tipsInfo);
    var tipsInfoAccept = document.createElement("span");
    tipsInfoAccept.setAttribute('class', 'jt_operation accept');
    tipsInfoAccept.setAttribute('onclick', 'accept()');
    $(tipsInfoAccept).text(inS);
    $(withinBox).append(tipsInfoAccept);
    var tipsInfoPrevent = document.createElement("span");
    tipsInfoPrevent.setAttribute('class', 'jt_operation reject');
    tipsInfoPrevent.setAttribute('onclick', 'reject()');
    $(tipsInfoPrevent).text(outS);
    $(withinBox).append(tipsInfoPrevent);
    var requestNews = $("body .jt_requestNews");
    if (requestNews.length > 1) {
        $(".jt_newStyle1").css("bottom", "35px");
    }
}
/* 请求消息拒绝方法 */
function reject(){
    publicConfirmReject({title:'提示信息',content:'是否拒绝请求消息？',icon:'fa fa-rocket'});
}
/* 拒绝请求视频的消息 */
function publicConfirmReject(data){
    var confirm = {
        title: data.title,
        content: data.content,
        icon: data.icon,
        animation: 'scale',
        closeAnimation: 'scale',
        buttons: {
            确定: function () {
                if($(".reject").attr('onclick') == "reject()"){
                    console.log("拒绝请求消息");
                    $(".jt_newStyle1").remove();
                }
            },
            取消: function () {
                publicAlert({title:'提示信息',content:'操作取消！',icon:'fa fa-rocket'},false);
            }
        }
    };
    $.confirm(confirm);
    setTimeout(function(){
        addFrame();
    },1);
}
/* 模式添加框(弹出)特殊处理 */
function addFrame(){
    var wyHeight = document.body.clientHeight;
    var thisHeight = wyHeight / 2;
    publicConfirmBox({
        'position': 'relative',
        'bottom': thisHeight - 80
    });
}
/* 无限循环更换字体颜色 */
function changeColor(){   
    var color="#f00|#0f0|#00f|#880|#808|#088|yellow|green|blue|gray|#234|#534";
    color=color.split("|");
    var xuan = document.getElementsByClassName("jt_operationBJ");
    for(var i=0;i<xuan.length;i++){  
    	xuan[i].style.color=color[parseInt(Math.random() * color.length)];
  	}  
}   
setInterval("changeColor()",2000);