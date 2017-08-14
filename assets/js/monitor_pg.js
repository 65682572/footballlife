/**
全局变量初始化
 **/
mqArray = new Array();//待连接输入源状态跟踪
pgobj = new Array();//embed插件窗体
// selfArray = new Array();//待连接输入源队列(暂未使用)
// needMQ = false;//判断当前输入源是否连接中，供排队开启视频时用，连接结束为false，正在连接为true(暂未使用)
selfArray2 = new Array();//页面还原时的输入源队列
selfDevice = "";//当前操作对象
cgqdata = [];//传感器实时数据
matrixId = "_DEV_{$matrixId}";
thislayout = "";//当前布局样式
// deviceList = new Array();//资源对象集合

//初始化pg插件及矩阵连接通道建立
var initObj = new initList(matrixId);
myObj.map = null;
$(document).ready(function() {
    pgint = initObj.pgInitialize('pgAtx99999');
});
//下面是原本的拖动输入源事件，暂时废弃
// function device_drag(ev) {
//     ev.dataTransfer.setData("Text", ev.target.id);
//     var dragEmt = document.getElementById(ev.target.id);
// }

// function allowDrop(ev) {
//     ev.preventDefault();
// }

//视频上鼠标事件
function mouseOI(id, pid) {
    this.id = id;
    var ifrId = "ifr" + id;
    this.out = function (sObj, uMeth, sData, uHandle, sPeer) {
        if (uMeth == 260) {
            // $("#monitor_r2").append("窗口:"+id+" sData："+sData+"<br>");
            var l = /LButtonUp/.test(sData);
            var r = /PopupMenu/.test(sData);
            if (l) {
                if (typeof curAction == 'undefined') {
                    operationArea(id);
                    checkok(id);
                } else if (curAction == 'mapManage') {
                    checkok(id, pid);
                }

                $("#" + ifrId).remove();
                var a = $('[name="ifr"]');
                a.remove();
            }
            if (r) {
                if (typeof curAction == 'undefined') {
                    checkok(id);
                } else if (curAction == 'mapManage') {
                    checkok(id, pid);
                }
                var a = $('[name="ifr"]');
                a.remove();
                var xy = sData.split("}");
                var x = xy[1].substring(4);
                var y = xy[2].substring(4);

                htmlCode = '<iframe src="/addmenu.html?ifrId=' + ifrId + '" id="' + ifrId + '" name="ifr" style="position:absolute;width:125px;height:180px;z-index:2; top:' + y + '; left:' + x + '; visibility:visible" frameborder="0" scrolling="no" allowtransparency="true"></iframe>';

                if (typeof curAction != 'undefined') {
                    if (curAction == 'mapManage') {
                        $("#" + pid).append(htmlCode);
                    }
                } else {
                    $("#v" + id).append(htmlCode);
                }
            }
        }
    };
}
/* 操作区域生成当前对象右键菜单 */
function operationArea(thisSelf){
    if(thisSelf){
        $("#rightCZArea").attr("onclick","showmenu(this)");
        $(".jt_rightShow #menuRight").slideDown(700);
    }
}
//生成设备列表
function addDeviceList(deviceList){
    var html = "";
    var wd = -1;
    var sd = -1;
    if(deviceList.length > 0){
        for(var i = 0;i < deviceList.length;i++){
            var devicename = deviceList[i].name;
            if(devicename){
                var wd = deviceList[i].name.indexOf("温度");
                var sd = deviceList[i].name.indexOf("湿度");
            }
            if (deviceList[i].state == 1) {
                imgsrc = "/assets/img/plus_green.png";
            }else{
                imgsrc = "/assets/img/plus.png";
            }

            if (wd>=0) {
            html = '<a id="_CGQ_17_1_'+deviceList[i].uuid+'" class="devicestate'+deviceList[i].state+'" ondblclick="doubleclick(this)" data-name="'+deviceList[i].name+'"><img style="width: 20px; margin-top: -4px;" src="'+imgsrc+'" /><span  onclick="click_hide(this)" style="white-space:nowrap;">'+deviceList[i].name+'</a>';
            }else if (sd>=0) {
            html = '<a id="_CGQ_17_2_'+deviceList[i].uuid+'" class="devicestate'+deviceList[i].state+'" ondblclick="doubleclick(this)" data-name="'+deviceList[i].name+'"><img style="width: 20px; margin-top: -4px;" src="'+imgsrc+'" /><span  onclick="click_hide(this)" style="white-space:nowrap;">'+deviceList[i].name+'</a>';
            }else{
            html = '<a id="'+deviceList[i].uuid+'" class="devicestate'+deviceList[i].state+'" data-name="'+deviceList[i].name+'"><img style="width: 20px; margin-top: -4px;" src="'+imgsrc+'" /><span  onclick="click_hide(this)" style="white-space:nowrap;">'+deviceList[i].name+'</a>';
            }
            var typeid = deviceList[i].ppid;
            $("#type_"+typeid).append(html);

        }
    }
}

//拖动输入源触发事件
// function drop(ev) {
//     ev.preventDefault();
//     var videoNum = ev.dataTransfer.getData("Text"); //视频源对象
//     var strs = videoNum.split("_");
//     if(strs[1]=="CGQ"){
//         var Wnd = "pgCGQ"+videoNum; //视频播放控件对象
//         htmlCode = '<div style="width: 100%; height: 100%;" id="' + Wnd + '"></div>';
//         if(ev.target.tagName =="SPAN"){
//             ev.target.parentNode.innerHTML = htmlCode;
//         }else{
//             ev.target.innerHTML = htmlCode;
//         }
//         var cgq = echartData(Wnd);
//     }else {
//         var Wnd = "pgAtx" + videoNum + "_" + new String(parseInt(Math.random() * 1000000)); //视频播放控件对象
//         // var isplay = $("#"+ Wnd).length;
//         // if (isplay != 0) {
//         //     var Wnd = "pgAtx"+videoNum+"_"+ new String(parseInt(Math.random() * 1000000)); //视频播放控件对象
//         //     console.log(Wnd);
//         // }
//         // htmlCode = '<div><embed id="pgAtx' + videoNum + '" width="100%" height="100%" type="application/peergine-plugin"></div><iframe src="/ifrMenu.html?ifrId='+ifrId+'" id="' + ifrId + '" name="ifr" vid="'+videodataid+'" matrix-id="'+parentdata+'" style="position:absolute; z-index:2; width:25px; height:24px; top:0; right:0; visibility:visible" frameborder="0" scrolling="no" allowtransparency="true"></iframe>';
//         htmlCode = '<div id="v' + Wnd + '" style="position:relative;" ><embed id="' + Wnd + '" width="100%" height="100%" type="application/peergine-plugin"></div>';
//         if (ev.target.tagName == "SPAN") {
//             ev.target.parentNode.innerHTML = htmlCode;
//         } else {
//             ev.target.innerHTML = htmlCode;
//         }
//         var grid = ev.target.id;
//         var thiswnd = document.getElementById(Wnd);
//         if (thiswnd) {
//             if (videoNum != "") {
//                 setTimeout(function () {
//                     pgobj[Wnd] = document.getElementById(Wnd);
//                     var mouseout = new mouseOI(Wnd);
//                     pgobj[Wnd].OnExtRequest = mouseout.out; //为每个播放窗口指定一个回调函数
//                 }, 500);
//                 // $("#ctrl").attr("data-id", videoNum);
//                 selfDevice = Wnd; //当前操作设备
//                 checkok(Wnd);
//                 var thisArray = {name: Wnd, state: 0, res: 0, id: grid};
//                 mqArray.push(thisArray);
//                 var jsonArray = JSON.stringify(mqArray);//存入数据库前转换成字符串
//                 $.post("/Matrix/monitor_log", {description: jsonArray});
//                 if (!needMQ) {
//                     initObj.playVideo("_DEV_" + strs[2], strs[3], Wnd, strs[4]);
//                     needMQ = true;
//                 } else {
//                     selfArray.push(Wnd);
//                 }
//             }
//         }

//     }
//     /* 窗口改变之后大小 */
//     $("embed").parent().css("height","100%");
// }
//双击输入源触发事件
//param：videoNum为左侧菜单双击节点的ID，标准格式为：_DEV_54e63f00102b0a6cefc6c8099115ffff_8_0
//ID格式构成：_设备类型_设备序列号_设备子输入源id_子输入源下通道id 请严格按此格式传参
function editVedio(videoNum) {
    var ismobile = 0;
    if (thediv == "" && selfDevice == ""){
        /* 因为首页视频会挡住，这里特殊处理调用的是publicAlertAdd方法 */
        publicAlertAdd({title:'提示信息',content:'请先选择窗口！',icon:'fa fa-rocket'},false);
        return;
    }
    //获取视频放置的父节点id
    if (thediv == ""){
        var grid = thisdevice.attr("id");
    }else{
        var grid = thediv.id;
    }
    var strs = videoNum.split("_");
    //是CGQ进入传感器处理流程，否则视频处理流程
    if(strs[1]=="CGQ"){
        var Wnd = "pgCGQ"+videoNum+"_"+grid; //视频播放控件对象
        var cgqname = $("#"+videoNum).attr("data-name");
        htmlCode = '<div style="width: 100%; height: 100%;" id="' + Wnd + '" data-name="'+cgqname+'"><iframe src="/monitorLoading.html" id="load' + Wnd + '" style="position:absolute; top:50%; left:50%; z-index:2; width:80px; height:80px; visibility:visible" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>';
        if (thediv == ""){
            thisdevice.html(htmlCode);
            var grid = thisdevice.attr("id");
        }else{
            var grid = thediv.id;
            thediv.innerHTML = htmlCode;
        }
        //对非全屏的播放操作进行保存
        if(grid != "windowQP"){
            //队列中的name为输入源对象，state为最后连接状态,res为重连次数,id为绑定窗体id
            var mqpush = {name:Wnd,state:0,res:0,id:grid};
            saveOperation(Wnd,mqpush);//保存当前操作
        }
        var cgq = echartData(Wnd,cgqname);
    }else {
        if(strs[1] == 1){
            // var ismobile = /mobile/.test(videoNum);
            ismobile = 1;
            videoNum = $("#"+videoNum).attr('uuid');
        }
        //开始拼接视频播放窗体id
        if(ismobile){
            var Wnd = "pgAtx"+videoNum+"_1_"+grid; //手机播放对象
        }else{
            var Wnd = "pgAtx"+videoNum+"_"+grid; //视频播放控件对象
        }
        if(grid == "windowQP"){
            var Wnd = strs[0]+"_"+strs[1]+"_"+strs[2]+"_"+strs[3]+"_"+strs[4]+"_"+grid; //全屏时重新拼接视频窗体id
        }
        var strs = Wnd.split("_");
        //添加视频播放窗体
        htmlCode = '<div id="v' + Wnd + '" style="position:relative;" ><embed id="' + Wnd + '" width="100%" height="100%" type="application/peergine-plugin"><iframe src="/monitorLoading.html" id="load' + Wnd + '" style="position:absolute; top:50%; left:50%; z-index:2; width:80px; height:80px; visibility:visible" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>';
        if (thediv == ""){
            thisdevice.html(htmlCode);
        }else{
            thediv.innerHTML = htmlCode;
        }
        //开始播放
        var thiswnd = document.getElementById(Wnd);
        if (thiswnd) {
            if (videoNum != "") {
                pgobj[Wnd] = document.getElementById(Wnd);
                var mouseout = new mouseOI(Wnd);
                pgobj[Wnd].OnExtRequest = mouseout.out ; //为每个播放窗口指定一个回调函数

                selfDevice = Wnd; //当前操作设备
                //保存除手机连接与全屏之外的操作
                if(grid != "windowQP" && !ismobile){
                    //队列中的name为输入源对象，state为最后连接状态,res为重连次数,id为绑定窗体id
                    var mqpush = {name:Wnd,state:0,res:0,id:grid,mode:101};
                    saveOperation(Wnd,mqpush);//保存当前操作
                }

                if(ismobile){
                    initObj.stopVideo(grid);
                    initObj.playAudio('_DEV_' + strs[2] + '_' + strs[3], 0, Wnd, 0);
                    initObj.playVideo('_DEV_' + strs[2] + '_' + strs[3], 0, Wnd, 0, 0);
                } else {
                    initObj.stopVideo(grid);
                    initObj.playVideo("_DEV_"+strs[2], strs[3], Wnd ,strs[4],101);
                }
                // if (!needMQ) {
                //  //排队连接视频
                //     initObj.playVideo("_DEV_"+strs[2], strs[3], Wnd ,strs[4]);
                //     // initObj.playAudio("_DEV_"+strs[2], strs[3], Wnd ,strs[4]);
                //     needMQ = true;
                // } else {
                //     selfArray.push(Wnd);
                // }
            }
        }
    }
    //视频加载动画的ifrm框架
    var loadingid = 'load'+Wnd;
    var loadingel = document.getElementById(loadingid);
    var loadingtop = parseInt($(loadingel).css('top'))-parseInt($(loadingel).height())/2 + 'px';
    var loadingleft = parseInt($(loadingel).css('left'))-parseInt($(loadingel).width())/2 + 'px';
    $(loadingel).css('top',loadingtop).css('left',loadingleft);
    /* 窗口改变之后大小 */
    $("embed").parent().css("height","100%");
}

function mapToGrid(obj) {

    var map_type = $(obj).attr('data-type');
    var map_list_id = $(obj).attr('data-maplistid');

    if (thediv == "" && selfDevice == "") {
        publicAlert({title: '提示信息', content: '请先选择窗口！', icon: 'fa fa-rocket'}, false);
        return;
    }

    //添加视频播放窗体
    htmlCode = '<div style="position:relative;width: 100%;height: 100%;" id="allmap' + $(obj).attr('data-maplistid') + '"></div>';
    if (thediv == "") {
        thisdevice.html(htmlCode);
    } else {
        thediv.innerHTML = htmlCode;
    }

    if (map_type == 1) {
        myObj.map = new AMap.Map('allmap' + $(obj).attr('data-maplistid'), {
            mapStyle: 'amap://styles/7bb61daa8d71302c6807543a2f55a9db',
            resizeEnable: true,
            lang: 'zh',
            zoom: 4
        });
    } else if(map_type == 2) {
        $.ajax({
            url: '/Map/getMapImg',
            type: 'post',
            data: {map_list_id: map_list_id},
            success: function (result) {

                myObj.imageLayer = new AMap.ImageLayer({
                    url: '/Uploads/map/' + result.imgUrl,
                    bounds: new AMap.Bounds(
                        [63.879784, 16.951454],
                        [140.871971, 50.275118]
                    )
                });

                myObj.map = new AMap.Map('allmap' + $(obj).attr('data-maplistid'), {
                    resizeEnable: true,
                    lang: 'zh_en',
                    zoom: 3,
                    center: [105, 40],
                    layers: [
                        myObj.imageLayer
                    ]
                });
            }
        });

    }

    AMap.plugin(['AMap.ToolBar', 'AMap.Autocomplete', 'AMap.PlaceSearch'],
        function () {
            myObj.map.addControl(new AMap.ToolBar({
                direction: false
            }));
            var autoOptions = {
                input: "keywordSearch"
            };
            autocomplete = new AMap.Autocomplete(autoOptions);
            var placeSearch = new AMap.PlaceSearch({
                map: myObj.map
            });
            AMap.event.addListener(autocomplete, "select", function (e) {
                placeSearch.search(e.poi.name)
            });
        });


    $.ajax({
        url: '/Map/getMarkList',
        type: 'post',
        data: {map_list_id: map_list_id, device_type: ''},
        success: function (result) {
            $.each(result, function (key, value) {
                var info = [];
                if (value.cam_id == 3) {
                    $.ajax({
                        url: '/Map/getMatrixName',
                        type: 'post',
                        data: {matrixId: value.info.matrixid},
                        success: function (result) {
                            info.push("<b>矩阵名：</b>" + result.name);
                            info.push("<b>设备类型：</b>" + "矩阵");

                            addMark(new AMap.Marker({
                                icon: "/Public/common/img/icon_matrix_" + (result.state == "1" ? "green" : "red") + ".png",
                                position: [value.lng, value.lat],
                                extData: [3, value.info.matrixid, result.name]
                            }), info);
                        }
                    });
                } else if (value.cam_id == 1) {
                    $.ajax({
                        url: '/Map/getMatrixName',
                        type: 'post',
                        data: {matrixId: value.info.matrixid},
                        success: function (result) {
                            info.push("<b>设备名：</b>" + result.name);
                            info.push("<b>设备类型：</b>" + "用户手机");

                            addMark(new AMap.Marker({
                                icon: '/Public/common/img/' + (result.state == '1' ? 'icon_mobile_green.png' : 'icon_mobile_red.png'),
                                position: [value.lng, value.lat],
                                extData: [1, value.info.matrixid, result.name]
                            }), info);
                        }
                    });
                } else if (value.cam_id == 4) {
                    $.ajax({
                        url: '/Map/getMatrixName',
                        type: 'post',
                        data: {matrixId: value.info.matrixid},
                        success: function (result) {
                            info.push("<b>设备名：</b>" + result.name);
                            info.push("<b>设备类型：</b>" + "传感器");

                            var marker = new AMap.Marker({
                                icon: '/Public/common/img/' + (result.state == '1' ? 'icon_smoke_green.png' : 'icon_smoke_red.png'),
                                position: [value.lng, value.lat],
                                extData: [4, value.info.matrixid, result.name]
                            });
                            addMark(marker, info);
                        }
                    });
                } else if (value.cam_id == 2) {
                    $.ajax({
                        url: '/Map/getMatrixName',
                        type: 'post',
                        data: {matrixId: value.info.matrixid},
                        success: function (result) {
                            info.push("<b>设备名：</b>" + result.name);
                            info.push("<b>设备类型：</b>" + "用户电脑");
                            addMark(new AMap.Marker({
                                icon: '/Public/common/img/' + (result.state == '1' ? 'icon_computer_green.png' : 'icon_computer_red.png'),
                                position: [value.lng, value.lat],
                                extData: [2, value.info.matrixid, result.name]
                            }), info);
                        }
                    });
                } else {
                    $.ajax({
                        url: '/Map/getMatrixName',
                        type: 'post',
                        data: {matrixId: value.info.matrixid},
                        success: function (result) {
                            info.push("<b>所属矩阵：</b>" + result.name);
//                                    info.push("<b>矩阵ID：</b>" + value.info.matrixid);
//                                    info.push("<b>设备ID：</b>" + value.info.id);
                            info.push("<b>设备名称：</b>" + value.info.name);
                            info.push("<b>设备类型：</b>" + value.info.type);
                            info.push("<b>设备IP：</b>" + value.info.ip);

                            addMark(new AMap.Marker({
                                icon: "/Public/common/img/icon_camera_" + (result.state == "1" ? "green" : "red") + ".png",
                                position: [value.lng, value.lat],
                                extData: [value.info.id, value.info.matrixid, value.info.ip, result.name]
                            }), info);
                        }
                    });
                }
            });
        }
    });
}

function addMark(point, winInfo)
{
    point.setMap(myObj.map);
    if (winInfo != undefined) {
        var infoWindow = new AMap.InfoWindow({
            content: winInfo.join("<br/>")
        });
    }
    AMap.event.addListener(point, 'click', function () {
        infoWindow.open(myObj.map, point.getPosition());
    });
}
//保存当前操作
function saveOperation(Wnd,mqpush){
    //Wnd是播放窗体ID，mqpush是要保存的json对象
    var timestamp = new Date().getTime();
    mqpush.timestamp = timestamp;
    //队列中的name为输入源对象，state为最后连接状态,res为重连次数,id为绑定窗体id
    updateDataId(Wnd,mqArray,0,mqpush);
    var jsonArray = JSON.stringify(mqArray);//自动保存队列入数据库前转换成字符串
    $.post("/Matrix/monitor_log", {description:jsonArray} );
}

//设备状态显示，传入参数为双击时的输入源节点id
function deviceStatus(did){
    var data = did.split('_');
    var devicelogWnd = $("#Blockquotes2");
    if(devicelogWnd.length >0){
        var devicelogid = data[2];
        var devicenum = data[3]-1;
        var thisdevicename = vlistArray[devicelogid]['n'];
        var thisdevicelist = vlistArray[devicelogid]['v']; //当前正在开启的输入源集
        var winid = data[5];
        var thisdevicearray = initObj.video[winid]; //从主对象中读取视频分辨率编码数据
        for (var i = thisdevicelist.length - 1; i >= 0; i--) {
            if(thisdevicelist[i].id == data[3]){
                if(thisdevicelist[i].gn >0){
                    var grarr = thisdevicelist[i].grName.split(",");
                    var gnid = data[4]-1;
                    var gname = grarr[gnid];
                }
                var thisdevicenum = thisdevicelist[i];
            }
        }
        if(gname == undefined){
            var dhtml = "名称：【"+thisdevicename+"】"+thisdevicenum.name+"<br>类型："+thisdevicenum.typeName;
        }else{
            var dhtml = "名称：【"+thisdevicename+"】"+thisdevicenum.name+" "+gname+"<br>类型："+thisdevicenum.typeName;
        }

        var fblCodeNum = "<br>分辨率："+initObj.mode[thisdevicearray._fblCodeNum];
        var frate = 1000/thisdevicearray._zlCodeNum;
        var mlCode = "<br>编码："+initObj.code[thisdevicearray._mlCode]+"<br>帧率："+frate;
        var html = dhtml+fblCodeNum+mlCode;
        devicelogWnd.html(html);
    }
}

//待连接的输入源处理
// function printMQArr() {
//     if (selfArray.length != 0) {
//         for (var i = selfArray.length - 1; i >= 0; i--) {
//             var vdata = selfArray.shift();
//             var data = vdata.split('_');
//             initObj.playVideo("_DEV_"+data[2], data[3], 'pgAtx' +vdata ,data[4]);
//             deviceStatus(vdata);
//         }
//     }
// }

//页面还原时自动处理
function printMQArr_res() {
    if (selfArray2.length > 0) {
        for (var i = selfArray2.length - 1; i >= 0; i--) {
            var thdata = selfArray2.shift();
            var vdata = thdata.name;
            var mode = thdata.mode;
            // console.log("正在连接："+vdata);
            var data = vdata.split('_');
            console.log(data[5]);
            // initObj.stopVideo(data[5]);
            initObj.playVideo("_DEV_"+data[2], data[3], vdata ,data[4], mode);
            // deviceStatus(vdata);
        }
    }
}

//页面退出时断开所有视频
function mqarrstop(){
    if (mqArray.length > 0) {
        for (var i = 0; i < mqArray.length;i++) {
            var cur_person = mqArray[i];
            var data = cur_person.name.split('_');
            // if(cur_person.state == -2){
                initObj.stopVideo(data[5]);
            // }
        }
    }
}

//切换布局时执行视频开启
function video_res(obj){
    thislayout = obj;
    selfDevice = "";
    thediv = "";
    var s= $(obj).children().map(function(){
        return this.id;
    }).get();
    for (var i = 0; i < mqArray.length; i++) {
        var vdata =mqArray[i];
        var data = vdata.name.split('_');
        if(vdata.state == -2){
            console.log(data[5]);
            initObj.stopVideo(data[5]);
            vdata.state = 0;
        }
        var inarr = $.inArray(data[5], s);
        //判断是否在当前布局里，是就开始播放
        if(inarr>=0){
            var cgqid = "_"+data[1]+"_"+data[2]+"_"+data[3]+"_"+data[4];
            var cgqname = $("#"+cgqid).attr("data-name")
            if(data[1] == "CGQ"){
                var Wnd = vdata.name; //控件对象
                htmlCode = '<div style="width: 100%; height: 100%;" id="' + Wnd + '" data-name="'+cgqname+'"></div>';
                $("#"+vdata.id).html(htmlCode);

                var cgq = new echartData(Wnd,cgqname);
            }else{
                var Wnd = vdata.name; //控件对象
                htmlCode = '<div id="v' + vdata.name + '" style="position:relative;" ><embed id="' + Wnd + '" width="100%" height="100%" type="application/peergine-plugin"><iframe src="/monitorLoading.html" id="load' + Wnd + '" style="position:absolute; top:37%; left:41%; z-index:2; width:80px; height:80px; visibility:visible" frameborder="0" scrolling="no" allowtransparency="true"></iframe></div>';
                if(vdata.id){
                    $("#"+vdata.id).html(htmlCode);
                    $("#v"+vdata.name).css("height","100%");
                    pgobj[vdata.name] = document.getElementById(vdata.name);
                    var mouseout = new mouseOI(vdata.name);
                    pgobj[vdata.name].OnExtRequest = mouseout.out ; //为每个播放窗口指定一个回调函数
                }
                var r = $.inArray(vdata.id, s);
                if (r >=0 ){
                    selfArray2.push(vdata);
                }
            }
        }
    }
    setTimeout("printMQArr_res()",3000);
}

//json队列操作-更新state
function updateData(name,persons,state) {
    for (var i = 0; i < persons.length; i++) {
        var cur_person = persons[i];
        if (cur_person.name == name) {
            persons[i].state = state;
        }
    }
}

//json队列操作-更新指定id下所有数据
function updateDataId(name,persons,state,resarray) {
// var persons = persons;
    var ss = 0;//移除重复项
    var a = 0;//判断要更新的数组是否存在
    var pusharray = Object.getOwnPropertyNames(resarray);//获得resarray的属性名集合
    if(resarray){
        for (var i = 0; i < persons.length; i++) {
            var cur_person = persons[i];
            if (cur_person.id == resarray.id) {
                var a = 1;
                if(ss == 0) {
                    for (var t = 0; t < pusharray.length; t++) {
                        persons[i][pusharray[t]] = resarray[pusharray[t]];
                    }
                    var ss = 1;
                }else{
                    persons.splice(i, 1);
                }
            }
        }
        if(a == 0){
            persons.push(resarray);
        }
    }
}

//json队列操作-删除
function deleteData(name,persons) {
    // var persons = persons;
    //alert(name);
    for (var i = 0; i < persons.length; i++) {
        var cur_person = persons[i];
        if (cur_person.name == name) {
            persons.splice(i, 1);
        }
    }
}

//对输入源连接异常处理
function printMQArrError() {
    var reconn = 10;
    var thislayoutarr= $(thislayout).children().map(function(){
        return this.id;
    }).get();

    if (mqArray.length != 0) {
        var jsonArray = JSON.stringify(mqArray);//存入数据库前转换成字符串
        $.post("/Matrix/monitor_log", {description:jsonArray} );
        for (var i = 0; i < mqArray.length;i++) {
            var cur_person = mqArray[i];
            var data = cur_person.name.split('_');
            var mode = cur_person.mode;
            var devicename = $("#"+data[2]).attr('data-name');
            var inarr = $.inArray(cur_person.id, thislayoutarr);
            if(inarr>=0){
                if (cur_person.state >= -1){
                    var nowtime = new Date().getTime();
                    var timediff = nowtime-cur_person.timestamp; //获取时间差
                    // console.log(devicename+"_"+data[3]+"_"+timediff);
                    if(timediff >= 11000){
                        // if(mqArray[i].state != 15){
                            if (mqArray[i].state == 15 && mqArray[i].res>reconn) {
                                //返回15号时提示通道重复
                                var ss  = $("#"+cur_person.name).parent().parent();
                                $("#"+cur_person.name).parent().remove();
                                ss.append("<h5 style='color: white;'>"+devicename+"的"+data[3]+"号输入源，</h5><h5 style='color: #FA5959;'>通道名重复，请重新连接！</h5>");
                                return;
                            }

                            if (mqArray[i].state >= 1&& mqArray[i].state < 99 && mqArray[i].res<reconn) {
                                //请求视频异常时重连
                                initObj.stopVideo(data[5]);
                                console.log(devicename+"的"+data[3]+"号输入源在"+data[5]+"重新连接"+"时间"+nowtime);
                                initObj.playVideo("_DEV_"+data[2], data[3], cur_person.name ,data[4], mode);
                                mqArray[i].res = mqArray[i].res+1;
                                mqArray[i].timestamp = nowtime;
                                return;
                            }

                            if (mqArray[i].state == -1 && mqArray[i].res<reconn) {
                                //开启视频未收到video.start时重连
                                initObj.stopVideo(data[5]);
                                console.log(devicename+"的"+data[3]+"号输入源在"+data[5]+"重新连接"+"时间"+nowtime);
                                initObj.playVideo("_DEV_"+data[2], data[3], cur_person.name ,data[4], mode);
                                mqArray[i].res = mqArray[i].res+1;
                                mqArray[i].timestamp = nowtime;
                                return;
                            }

                            if (mqArray[i].state == 99 && mqArray[i].res<reconn) {
                                //请求视频无响应时重连
                                console.log(devicename+"的"+data[3]+"号输入源在"+data[5]+"重新连接"+"时间"+nowtime);
                                initObj.playVideo("_DEV_"+data[2], data[3], cur_person.name ,data[4], mode);
                                mqArray[i].res = mqArray[i].res+1;
                                mqArray[i].timestamp = nowtime;
                                return;
                            }

                            if (mqArray[i].state >= 1&& mqArray[i].state < 99 && mqArray[i].res>=reconn) {
                                //开启视频时返回其它错误时判断为异常
                                var ss  = $("#"+cur_person.name).parent().parent();
                                $("#"+cur_person.name).parent().remove();
                                ss.append("<h5 style='color: white;'>"+devicename+"的"+data[3]+"号输入源，</h5><h5 style='color: #FA5959;'>连接异常！</h5>");
                                return;
                            }

                            if (mqArray[i].state == -1 && mqArray[i].res>=reconn) {
                                //开启视频时返回其它错误时判断为异常
                                var ss  = $("#"+cur_person.name).parent().parent();
                                $("#"+cur_person.name).parent().remove();
                                ss.append("<h5 style='color: white;'>"+devicename+"的"+data[3]+"号输入源，</h5><h5 style='color: #FA5959;'>开启视频失败，请重新连接！</h5>");
                                return;
                            }

                            if (mqArray[i].state == 99 && mqArray[i].res>=reconn) {
                                //请求视频正常但无返回数据时判断为连接超时
                                var ss  = $("#"+cur_person.name).parent().parent();
                                $("#"+cur_person.name).parent().remove();
                                ss.append("<h5 style='color: white;'>"+devicename+"的"+data[3]+"号输入源，</h5><h5 style='color: #FF8D8D;'>连接超时！</h5>");
                                return;
                            }
                        // }
                    }
                }
            }
        }
    }
}

/* 对在线的设备修改图标及更新操作 */
function adduser(sUser){
    var strs = sUser.split("_");
    var uuid = strs[2];
    if(strs[3] == 'mobile' || strs[3] == '1'){
        var sid = uuid+"_1";
        var thisimg = $("#"+sid).find('img').get(0);
        var imgSrc = $(thisimg).attr("src");
        $("#"+sid).attr({
            "uuid":sUser,
            "ondblclick":"doubleclick(this)",
            "class":"devicestate1"
        }); 
        if (typeof(imgSrc)!="undefined") {
            if(imgSrc.indexOf("plus") >= 0){
                $(thisimg).attr("src","/assets/img/plus_green.png");
            }        
        }

    }else if(strs[2] == 'WEB'){
        var sid = strs[3]+"_0";
        var thisimg = $("#"+sid).find('img').get(0);
        var imgSrc = $(thisimg).attr("src");
        $("#"+sid).attr({
            "uuid":sUser,
            "ondblclick":"doubleclick(this)",
            "class":"devicestate1"
        });
        if (typeof(imgSrc)!="undefined") {
            if(imgSrc.indexOf("plus") >= 0){
                $(thisimg).attr("src","/assets/img/plus_green.png");
            }
        }
    }else{
        var thisimg = $("#"+uuid).find('img').get(0);
        var imgSrc = $(thisimg).attr("src");        
        if (typeof(imgSrc)!="undefined") {            
            if(imgSrc.indexOf("plus") >= 0){
                $(thisimg).attr("src","/assets/img/plus_green.png");
            }
        }
        $("#"+uuid).attr('class','devicestate1');
    }
}

//对离线的设备进行操作
function deluser(sUser){
    var strs = sUser.split("_");
    var uuid = strs[2];
    if(strs[3] == 'mobile' || strs[3] == '1'){
        // var sid = strs[2]+"_1";
        var sid = $("[uuid = "+sUser+"]").attr('id');
        console.log(sid)
        if(sid){
            $("#"+sid).removeAttr("ondblclick");        
            $("#"+sid).attr({'class':'devicestate0'});
            var thisimg = $("#"+sid).find('img').get(0);
            var imgSrc = $(thisimg).attr("src");
            if (typeof(imgSrc)!="undefined") {
                if(imgSrc.indexOf("plus") >= 0){
                    $(thisimg).attr("src","/assets/img/plus.png");
                }
            }
        }
    }else if(strs[2] == 'WEB'){
        // var sid = strs[3]+"_0";
        var sid = $("[uuid = "+sUser+"]").attr('id');
        if(sid){
            $("#"+sid).removeAttr("ondblclick");        
            $("#"+sid).attr({'class':'devicestate0','id':sid});
            var thisimg = $("#"+sid).find('img').get(0);
            var imgSrc = $(thisimg).attr("src");
            if (typeof(imgSrc)!="undefined") {
                if(imgSrc.indexOf("plus") >= 0){
                    $(thisimg).attr("src","/assets/img/plus.png");
                }
            }
        }
    }
    else {
        var thisimg = $("#"+uuid).find('img').get(0);
        var imgSrc = $(thisimg).attr("src");
        if (typeof(imgSrc)!="undefined") {
            if(imgSrc.indexOf("plus") >= 0){
                $(thisimg).attr("src","/assets/img/plus.png");
            }
        }
        $("#"+uuid).attr('class','devicestate0');
    }
}

/* 右键菜单iframe增高 */
function iframeHeight(){
    $("iframe[name='ifr']").css("height","252px");
}
//切换主码流
function masterMcodeS(){
    if(selfDevice == undefined){
        publicAlertAdd({title:'提示信息',content:'请选择正在运行的窗口！',icon:'fa fa-rocket'},false);
        return;
    }else{
    	var strs = selfDevice.split("_");
	    if (strs.length >0) {
	        initObj.playVideo("_DEV_"+strs[2], strs[3], selfDevice ,strs[4],100);
	        var mqpush = {name:selfDevice,state:0,res:0,id:strs[5],mode:100};
	        saveOperation(selfDevice,mqpush);//保存当前操作
	        $("iframe[name='ifr']").remove();
	    }
    }
}
//切换子码流
function dependMcodeS(){
	if(selfDevice == undefined){
        publicAlertAdd({title:'提示信息',content:'请选择正在运行的窗口！',icon:'fa fa-rocket'},false);
        return;
    }else{
    	var strs = selfDevice.split("_");
	    if (strs.length >0) {
	        initObj.playVideo("_DEV_"+strs[2], strs[3], selfDevice ,strs[4],101);
	        var mqpush = {name:selfDevice,state:0,res:0,id:strs[5],mode:101};
	        saveOperation(selfDevice,mqpush);//保存当前操作
	        $("iframe[name='ifr']").remove();
	    }
    }
}
//推送音频
function pushAudioS(type){
    var strs = selfDevice.split("_");
    if (strs.length >0) {
        initObj.pushReq("_DEV_"+strs[2], strs[3], selfDevice ,strs[4],1);
    } else{
        publicAlert({title:'提示信息',content:'您没有选择设备！',icon:'fa fa-rocket'},false);
    }
}
//关闭音频
function closeAudioS(obj){
    initObj.closeAudio(obj);
}
//打开音频
function funPlayAudio() {
    var strs = selfDevice.split("_");
    if (strs.length >0) {
        initObj.playAudio("_DEV_"+strs[2], strs[3], selfDevice ,strs[4]);
        $("iframe[name='ifr']").remove();
    } else{
        publicAlert({title:'提示信息',content:'您没有选择设备！',icon:'fa fa-rocket'},false);
    }
}
//截图
function funCutPic(){
	if(selfDevice == undefined){
        publicAlertAdd({title:'提示信息',content:'请选择正在运行的窗口！',icon:'fa fa-rocket'},false);
        return;
    }else{
    	initObj.screenShoot(selfDevice);
    	$("iframe[name='ifr']").remove();
    }
}
//视频录制
function funStartRecord(){
    var ifRecordinit = initObj.recordVideo(1,selfDevice);
    $("iframe[name='ifr']").remove();
    if(ifRecordinit){
        $("#videoToggle").find('div').removeClass();
        $("#videoToggle").find('div').addClass('switch-off switch-animate');
    }else{
        $("#videoToggle").find('div').removeClass();
        $("#videoToggle").find('div').addClass('switch-on switch-animate');
    }

}
//停止录制
function funCloseRecord(){
    initObj.recordVideo(0,selfDevice);
    $("iframe[name='ifr']").remove();
}
//清除当前操作窗口
function funObjRemove() {
	if(selfDevice == undefined){
        publicAlertAdd({title:'提示信息',content:'请选择正在运行的窗口！',icon:'fa fa-rocket'},false);
        return;
    }else if (typeof ismobile != 'undefined' && ismobile) {
        initObj.stopVideo();
        initObj.stopAudio();
        $("#"+selfDevice).siblings().remove();
        $("#"+selfDevice).parent().remove();
        deleteData(selfDevice,mqArray);
        var jsonArray = JSON.stringify(mqArray);//存入数据库前转换成字符串
        $.post("/Matrix/monitor_log", {description:jsonArray} );
    } else {
    	initObj.stopVideo();
	    $("#"+selfDevice).siblings().remove();
	    $("#"+selfDevice).parent().remove();
	    deleteData(selfDevice,mqArray);
	    var jsonArray = JSON.stringify(mqArray);//存入数据库前转换成字符串
	    $.post("/Matrix/monitor_log", {description:jsonArray} );
    }
}

//清除指定窗口
function thisRemove(thisdevice){
    // console.log(selfDevice);
    // $("#"+selfDevice).remove(); // 清除embed
    $("#"+thisdevice).siblings().remove();
    $("#"+thisdevice).parent().remove();
    deleteData(thisdevice,mqArray);
    var jsonArray = JSON.stringify(mqArray);//存入数据库前转换成字符串
    $.post("/Matrix/monitor_log", {description:jsonArray} );
}
//选中窗口
function checkok(id, pid){
    if (typeof curAction == 'undefined') {
        if (id != "") {
            // parent.$("#ifr"+id).trigger("click");
            $("#v" + id).trigger("click");
            selfDevice = id; //当前操作设备
            deviceStatus(selfDevice);
        }
    } else if (curAction == 'mapManage'){
        $("#" + pid).trigger("click");
        selfDevice = id; //当前操作设备
    }
}

//云台控制
function sendCtrl(code){
    // var data = parent.$("#ctrl").attr("data-id");
    var strs = selfDevice.split("_");
    var martid = "_DEV_"+strs[2];
    var id = strs[3];
    var pass = strs[4];
    var speed = parent.$(".min-slider-handle").attr("aria-valuenow");//获取速度值
    if (code > 0) {
        var cmd = id+","+pass+","+code+","+speed+",0";
    }else{
        var cmd = id+","+pass+","+code+",0,0";
    }
    if (id > 0) {
        initObj.ctrlSend(cmd,martid);
    }else{
        publicAlertControl({title:'提示信息',content:'未选择可操作的设备！',icon:'fa fa-rocket'},false);
    }
}
/* 通用alert警告框 */
function publicAlertControl(data,status){
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
    setTimeout(function(){
        var wyWidth = document.body.clientWidth;
        var wyHeight = document.body.clientHeight;
        var thisWidth = wyWidth - 44;
        var thisHeight = wyHeight / 2;
        console.log(thisWidth);
        console.log(thisHeight);
        publicConfirmBox({
            'position': 'fixed',
            'right': thisWidth / 2,
            'bottom': thisHeight / 10,
            'width': '180px'
        });
    },1);
}
function RandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    if (Math.round(Rand * Range) == 0) {
        return Min + 1;
    } else if (Math.round(Rand * Max) == Max) {
        index++;
        return Max - 1;
    } else {
        var num = Min + Math.round(Rand * Range) - 1;
        return num;
    }
}

//时间格式化
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var s = date.getSeconds();
    if (s<10) {
        s="0" + s;
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + s;
    return currentdate;
}

//温度传感数据
// function randomData(echart,type) {
//     var wd = 32;
//     var sd = 56;
//     var eledata = [];
//     // var wd = $("#BlockquotesClose1").attr("temp");
//     if(wd > 0){
//         wd = parseInt(wd);
//     }
//     // var sd = $("#BlockquotesClose1").attr("sd");
//     if(sd > 0){
//         sd = parseInt(sd);
//     }
//     nowtime = getNowFormatDate();
//     wd = wd + Math.round(Math.random()*1);
//     sd = sd + Math.round(Math.random()*1);
//     eledata['wd'] = {
//         name: nowtime,
//         value: [
//             nowtime,
//             wd
//         ]
//     };
//     eledata['sd'] = {
//         name: nowtime,
//         value: [
//             nowtime,
//             sd
//         ]
//     };

//     $.post("/Matrix/eledata_log", {name:eledata['wd'].name,deviceid:echart,value:eledata['wd'].value,type:type});
//     $.post("/Matrix/eledata_log", {name:eledata['sd'].name,deviceid:echart,value:eledata['sd'].value,type:type});


//     return eledata;
// }


//折线图插件
function echartData(echart,echarName,sdata){
    if(sdata != null){
        var data = sdata;
    }
    var elestrs = echart.split("_");
    var type = elestrs[3];
    var uuid = elestrs[4];
    var myChart = [];
    cgqdata[echart] = [];//传感器实时数据
    // 基于准备好的dom，初始化echarts实例
    myChart[type] = echarts.init(document.getElementById(echart));
    randomData(echart,type);

    if(type == 1){
        // var echarName = "温度";
        var eunit = " °C";
    }
    if(type == 2){
        // var echarName = "湿度";
        var eunit = " %";
    }
    //温度传感数据
    function randomData(echart,type) {
        var eledata = [];
        $.post('/Device/getCGQvalue', {type: type}, function(sdata) {
            for (var i = 0; i < sdata.length; i++) {
                eledata = {
                    name: sdata[i].updatetime,
                    value: [
                        sdata[i].updatetime,
                        sdata[i].value
                    ]
                };
                cgqdata[echart].push(eledata);//更新传感器折线图实时数据集
                cgqdata[echart]['currvalue'] = eledata.value[1];//更新传感器的当前值
                cgqdata[echart]['avg'] = sdata[i].avg;//更新传感器的平均值
                var textid = echart+"text";
                $("#"+textid).text(eledata.value[1]);//自动更新
                // $("#"+textid).fadeIn("slow",function(){
                //     console.log($(this));
                //     $(this).text(eledata.value[1]);
                // });
            }
        });
        return eledata;
    }
    var option = [];
    option[type] = {
        title : {
            text: echarName+'数据',
            left: 20,
            textStyle:{
                color: '#D49A74',
                fontWeight: '400'
            },
            subtext: '湖南竞投长沙研发部'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            show:true,
            data:'实时'+echarName,
            textStyle:{
                color:'#82A37C'
            },
            icon:'stack'
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: true,
                    optionToContent: function(opt) { //自定义数据视图样式
                        var axisData = opt.xAxis[0].data;
                        var series = opt.series;
                        var serdata = series[0].data;
                        var table = '<div class="order"><div class="value">'
                                     + '<b class="speed" id="'+echart+'text">'+cgqdata[echart].currvalue+'</b>'
                                     + '<b>'+eunit+'</b></div>'
                                     + '<div class="profit-line">年平均值：'+cgqdata[echart]['avg']+eunit+'</div>'
                                     + '<div class="profit-line">月平均值：'+cgqdata[echart]['avg']+eunit+'</div>'
                                     + '<div class="profit-line">日平均值：'+cgqdata[echart]['avg']+eunit+'</div>'
                        table += '</div>';
                        return table;
                    }
                },
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                myTool2: {
                    show: true,
                    title: '清除窗口',
                    icon: 'image:///del_w.png',
                    onclick: function (){
                        // var cgqid = $(this).parent().parent().attr('id');
                        // console.log($(this).parent());
                        $("#"+echart).remove();
                        deleteData(echart,mqArray);
                        var jsonArray = JSON.stringify(mqArray);//存入数据库前转换成字符串
                        $.post("/Matrix/monitor_log", {description:jsonArray} );
                    }
                },
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'time',
                boundaryGap : false,
                data: cgqdata[echart],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#D49A74'
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:'#50B8E4',
                        width:1.5 //这里是为了突出显示加上的，可以去掉
                    }
                }
            }
        ],
        yAxis : [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value} '+eunit,
                    show: true,
                    textStyle: {
                        color: '#D49A74'
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:'#50B8E4',
                        width:1.5 //这里是为了突出显示加上的，可以去掉
                    }
                }
            }
        ],
        series : [// 中间菜单
            {
                name:'实时'+echarName,
                type:'line',
                data: cgqdata[echart],
                markPoint : {
                    data : [
                        {type : 'max', name: '最高值'},
                        {type : 'min', name: '最低值'}
                    ]
                },
                lineStyle: {
                    normal: {
                        opacity: 1,
                        color: 'red'
                    }
                },
                markLine : {
                    data : [
                        {
                            type: 'average',
                            name: '平均值',
                            lineStyle: {
                                normal: {
                                    opacity: 1,
                                    color: 'red'
                                }
                            }
                        },
                        {
                            name: '上域值',
                            yAxis: 26,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5,
                                    color: 'yellow',
                                    width: 0.5
                                }
                            }
                        },
                        {
                            name: '下域值',
                            yAxis: 11,
                            lineStyle: {
                                normal: {
                                    opacity: 0.5,
                                    color: 'yellow',
                                    width: 0.5
                                }
                            }
                        }
                    ]
                }
            }
        ],
        dataZoom : {// 区域缩放
            show : true,
            title : {
                dataZoom : '区域缩放',
                dataZoomReset : '区域缩放后退'
            }
        }
        //dataRange: {// 值域范围
        //    min: 0,
        //    max: 15,
        //    x: 'left',
        //    //selectedMode: false,
        //    y: 'bottom',
        //    text: ['高', '低'], // 文本，默认为数值文本
        //    calculable: true,
        //    textStyle: {
        //        color: '#D49A74'
        //    }
        //}
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart[type].setOption(option[type]);
    // clearInterval(timeTicket);
    // lastData += Math.random() * ((Math.round(Math.random() * 10) % 2) == 0 ? 1 : -1);
    // lastData = lastData.toFixed(1) - 0;
    setInterval(function (){
        var cgqinfo = randomData(echart,type);

        myChart[type].setOption({
            series: [{
                data: cgqdata[echart]
            }]
        });
    }, 12000);
}

