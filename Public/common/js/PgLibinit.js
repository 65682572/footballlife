//生成单设备输入源列表
function singleMatrixList (strs,sss) {
    if(typeof strs == 'object'){
        var obj = strs;
    }else{
        var obj = JSON.parse(strs);
    }
    var html = '';
    var html_child = '';
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].grName != null) {
            var child = obj[i].grName.split(',');
            child.forEach(function (value) {
                html3 = "<span style='position: relative;'><img id='jt_ifAB' src='/Public/common/images/icon_++.png' style='position: absolute; width: 10px; top: 4px; left: -28px;' /></span>";

                html_child += '<p style="margin-left: -10px;" class="jt_li" draggable="true" ondragstart="device_drag(event)" id="'+ sss.sPeer+'_'+ obj[i].id +'_'+ value.substr(2) + '">' + '<img style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span class="span-t4">' + value + '</span></p>';
            });
            html += '<a style="margin-left: 20px;" data-id="' + obj[i].id + '" id="drag_device' + obj[i].id + '">' + html3 + '<img onclick="click_child_hide(this)" style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span onclick="click_child_hide(this)" class="span-t4">' + obj[i].id + ':' + obj[i].name + '</span>'+ html_child +'</a>';
        }else{
            html += '<a style="margin-left: 20px;" draggable="true"  ondragstart="device_drag(event)"' + ' data-id="' + obj[i].id + '" id="' +sss.sPeer+'_'+ obj[i].id + '_0">' + '<img onclick="click_child_hide(this)" style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" /><span class="span-t4">' + obj[i].id + ':' + obj[i].name + '</span>'+ html_child +'</a>';
        }
        html_child = '';
    }
    if (typeof sss.pid =="undefined") {
        $("#menu3 li").append(html);
    }else{
        $("#"+sss.pid).append(html);
    }
}

function listForMapManage(strs,sss) {
    if(typeof strs == 'object'){
        var obj = strs;
    }else{
        var obj = JSON.parse(strs);
    }
    var html = '';
    var html_child = '';
    var html3 = '';
    var a = 0;
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].grName != null) {
            var child = obj[i].grName.split(',');

            child.forEach(function (value,index) {
                var a = index+1;

                html3 = "<span style='position: relative;'><img id='jt_ifAB' src='/Public/common/images/icon_++.png' style='position: absolute; width: 10px; top: 4px; left: -28px;' /></span>";

                html_child += '<p class="jt_li" onclick="findMarker(event, this)" id="' + sss.sPeer +"_" + obj[i].id +"_" + a + '">' + '<img style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span class="span-t4">' + value + '</span></p>';
            });

            html += '<a style="margin-left: -10px;" id="' + sss.sPeer +"_" + obj[i].id + '_' +a+ '">' + html3 + '<img onclick="click_child_hide(this)" style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span onclick="click_child_hide(this)" class="span-t4">' + obj[i].id + ':' + obj[i].name + '</span>' + html_child + '</a>';
        }else{
            html += '<a style="margin-left: -10px;" onclick="findMarker(event, this)" id="' + sss.sPeer+"_" + obj[i].id + '_'+a+ '">' + '<img style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span class="span-t4">' + obj[i].id + ':' + obj[i].name + '</span>' + html_child + '</a>';
        }
        // objList[i+1] = tObj;
        html_child = '';
    }
    if (typeof sss.pid =="undefined") {
        $("#menu3 li").append(html);
    }else{
        $("#"+sss.pid).append(html);
    }
}

function listForMapLayout(strs,sss) {
    if (typeof strs == 'object') {
        var obj = strs;
    } else {
        var obj = JSON.parse(strs);
    }
    var html = '';
    var html_child = '';
    var html3 = '';
    var a = 0;
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].grName != null) {
            var child = obj[i].grName.split(',');

            child.forEach(function (value,index) {
                var a = index+1;

                html3 = "<span style='position: relative;'><img id='jt_ifAB' src='/Public/common/images/icon_++.png' style='position: absolute; width: 10px; top: 4px; left: -28px;' /></span>";

                html_child += '<p class="jt_li" onmousedown="onClickDown(event, this)" id="' + sss.sPeer +"_" + obj[i].id +"_" + a + '">' + '<img style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span class="span-t4" ip="'+ obj[i].location +'">' + value + '</span></p>';
            });

            html += '<a style="margin-left: -10px;" id="' + sss.sPeer +"_" + obj[i].id + '_' +a+ '">' + html3 + '<img onclick="click_child_hide(this)" style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span onclick="click_child_hide(this)" class="span-t4">' + obj[i].name + '</span>' + html_child + '</a>';
        }else{
            html += '<a style="margin-left: -10px;" onmousedown="onClickDown(event, this)" id="' + sss.sPeer+"_" + obj[i].id + '_'+a+ '">' + '<img style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span class="span-t4" ip="'+ obj[i].location +'">' + obj[i].name +'</span>' + html_child + '</a>';
        }
        // objList[i+1] = tObj;
        html_child = '';
    }
    if (typeof sss.pid == "undefined") {
        $("#menu3 li").append(html);
    } else {
        $("#" + sss.pid).append(html);
    }
}
//生成多设备输入源列表
function videoList (strs, sss) {
    //实例化控件对象
    if(typeof strs == 'object'){
        var obj = strs;
    }else{
        var obj = JSON.parse(strs);
    }
    var html = '';
    var html_child = '';
    var html3 = '';
    var a = 0;
    //for循环做了两件事
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].grName != null) {
            var child = obj[i].grName.split(',');

            child.forEach(function (value,index) {
                var a = index+1;

                html3 = "<span style='position: relative;'><img id='jt_ifAB' src='/Public/common/images/icon_++.png' style='position: absolute; width: 10px; top: 4px; left: -28px;' /></span>";

                html_child += '<p class="jt_li" ondblclick="doubleclick(this)" id="' + sss.sPeer +"_" + obj[i].id +"_" + a + '">' + '<img style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span class="span-t4">' + value + '</span></p>';
            });

            html += '<a style="margin-left: -10px;" id="' + sss.sPeer +"_" + obj[i].id + '_' +a+ '">' + html3 + '<img onclick="click_child_hide(this)" style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span onclick="click_child_hide(this)" class="span-t4">' + obj[i].id +':' + obj[i].name + '</span>' + html_child + '</a>';
        }else{
            html += '<a style="margin-left: -10px;" ondblclick="doubleclick(this)" id="' + sss.sPeer+"_" + obj[i].id + '_'+a+ '">' + '<img style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span class="span-t4">' + obj[i].id +':'+ obj[i].name + '</span>' + html_child + '</a>';
        }
        // objList[i+1] = tObj;
        html_child = '';
    }
    if (typeof sss.pid =="undefined") {
        $("#menu3 li").append(html);
    }else{
        $("#"+sss.pid).append(html);
    }
}

//输入源封装
//sspeer是附加参数集，vlist是输入源集
function createvlist(vlist,mid){
    if (typeof mid == 'object') {
        for(var i=0; i<mid.length; i++){
            var sspeer = {};
            var mmid = mid[i].uuid;
            sspeer.sPeer = '_DEV_'+mmid; //与p2p数据结构同步
            sspeer.pid = mmid; //输入源的父节点
            if (typeof vlist[mmid] != 'undefined') {
                if (typeof vlist[mmid].v != 'undefined') {
                    if (typeof curAction == 'undefined') {
                        videoList(vlist[mmid].v,sspeer);
                        $("#" + mmid).find('a').hide();
                    } else if (curAction == 'mapManage') {
                        listForMapManage(vlist[mmid].v,sspeer);
                        $("#" + mmid).find('a').hide();
                    } else if (curAction == 'mapLayout') {
                        listForMapLayout(vlist[mmid].v,sspeer);
                        $("#" + mmid).find('a').hide();
                    }
                }
            }
        }
    }else{
        var sspeer = {};
        sspeer.sPeer = matrixId; //与p2p数据结构同步
        if (typeof vlist[mid] != 'undefined') {
            if (typeof vlist[mid].v != 'undefined') {
                if (typeof curAction == 'undefined') {
                    singleMatrixList(vlist[mid].v,sspeer);
                } else if (curAction == 'mapManage') {
                    listForMapManage(vlist[mid].v,sspeer);
                } else if (curAction == 'mapLayout') {
                    listForMapLayout(vlist[mid].v,sspeer);
                }
            }
        }
    }
}

//输入源封装
//sspeer是附加参数集，vlist是输入源集
function createsharelist(obj,mid,usermobile){
    //开始添加设备
    var useruuid = usermobile+"_0";
    // addDeviceList();
    if (obj.length>0) {
        //html3是通道的样式
        html3 = "<span style='position: relative;'><img id='jt_ifAB' src='/Public/common/images/share.png' style='position: absolute; width: 10px; top: 4px; left: -28px;' /></span>";
        html_child = "";
        for(var i=0; i<obj.length; i++){
            if(obj[i].destination == useruuid){
                var sid = obj[i].uuid;
                var sobj = $("#"+sid);
                var sPeer = "_DEV_"+obj[i].uuid;
                var endid = sPeer+"_" + obj[i].id + '_'+obj[i].g;
                if (sobj.length>0) {
                    //防重复添加
                    if($("#"+sid).children("#"+endid).length <=0){
                        html = '<a style="margin-left: -10px;" ondblclick="doubleclick(this)" id="' + endid+ '">' + '<img style="width: 20px;" src="/Public/common/images/share.png" />' + '<span class="span-t4">' + obj[i].nname + '</span>' + html_child + '</a>';
                        $("#"+sid).append(html);
                    }
                }else{
                    var sharedlist = [];
                    sharedlist.push(obj[i]);
                    addDeviceList(sharedlist);
                    // setTimeout(function(){
                    if($("#"+sid).children("#"+endid).length <=0){
                        // console.log(obj[i]);
                        html = '<a style="margin-left: -10px;" ondblclick="doubleclick(this)" id="' + endid+ '">' + '<img style="width: 20px;" src="/Public/common/images/share.png" />' + '<span class="span-t4">' + obj[i].nname + '</span>' + html_child + '</a>';
                        $("#"+sid).append(html);
                    }
                    // }, 800);

                }
            }
        }
    }
}

/**
 矩阵、摄像机初始化与设备列表初始化
 **/
function initList(matrixId) {
    var myObj = {
        s_oLive: null,
        matrix: null,
        video: {},
        audio: {},
        push: {},
        code: {0:"BMP",1:"MJPEG",2:"VP8",3:'h264'},
        mode: {0:"80 x 60像素",1:"160 x 120像素",2:"320 x 240像素",3:"640 x 480像素",4:"800 x 600像素",5:"1024 x 768像素",6:"176x144像素",7:"352x288像素",8:"704x576像素",9:"854x480像素",10:"1280x720像素",11:"1920x1080像素",100:"主码流",101:"子码流"},
        ctrl: null,
        matrixInit: false,
        matrixId: matrixId,
        strs2: new Array(),
        str: "",
        needUpdate: 1,
        isInit: false,
        videosObj: '',
        audiosObj: '',
        channelNameAudio: null,
        pgInitialize: function (obj_id) {
            var pgUI = {
                OnEvent: function (sAct, sData, sPeer) {
                },
                OnReply: function (sObj, uErr, sData, sParam) {
                    // console.log('sobj:' +sObj+' uerr:'+uErr  + ' sdata:'+sData+' sParam:'+sParam);
                    if(sParam.indexOf("Start")>=0){
                        var strs = sObj.split("_");
                        var thisobj = strs[1]+"_"+strs[2]+"_"+strs[3]+"_"+strs[4]+"_"+strs[5]+"_"+strs[6];
                        updateData(thisobj,mqArray,-2);
                        //清除加载动画
                        var loadingid = 'load'+thisobj;
                        var loadingel = document.getElementById(loadingid);
                        $(loadingel).remove();
                    }
                    if (sObj == myObj.s_oLive._sObjSvr) {
                        if (sParam == "pgLib._Login") {
                            myObj.matrix = new myObj.s_oLive.Matrix(myObj.matrixId);
                        }
                    }
                },
                OnExtRequest: function (sObj, uMeth, sData, uHandle, sPeer) {
                    // console.log('sobj:' +sObj+'uMeth:'+uMeth  + 'sData:'+sData+'uHandle:'+uHandle+'sPeer:'+sPeer +'\n');
                    var strs = sData.split("@");
                    strs.sPeer = sPeer;
                    if(uMeth == 32){
                        // console.log('===32===',uHandle,'==',sObj,'==',sPeer,'===32===');
                        myObj.openAudio(sPeer,sObj,uHandle);
                    }
                    // pgUI.OutString("异步数据 " + strs);

                    if (sObj == myObj.s_oLive._sObjOnline) {
                        if (uMeth == 33) {
                            if (myObj.needUpdate) {
                                myObj.UpdateUser(sData);
                            } else {
                                if (!myObj.matrixInit) {
                                    myObj.matrix.ReqList();
                                    myObj.matrix.ReqHeart();
                                    myObj.matrixInit = true;
                                }
                            }
                        }

                    } else if (sObj == myObj.s_oLive._sObjSelf) {
                        if (strs.length > 0 && strs[0] == "0001") {
                            if (strs[1] == "1" && strs[2] == "03") {
                                // console.log(strs[5]);
                                if (strs[3] != "01") {
                                    if (myObj.strs2[sPeer] == undefined) {
                                        myObj.strs2[sPeer] = '';
                                    }

                                    if (strs[6] != undefined) {
                                        myObj.strs2[sPeer] = myObj.strs2[sPeer] + strs[5] + strs[6];
                                    } else {
                                        myObj.strs2[sPeer] = myObj.strs2[sPeer] + strs[5];
                                    }
                                    if (strs[3] == strs[4]) {
                                        if (typeof curAction == 'undefined') {
                                            // singleMatrixList(myObj.strs2[sPeer], strs);
                                        } else if (curAction == 'mapManage') {
                                            myObj.listForMapManage(myObj.strs2[sPeer], strs);
                                        } else if (curAction == 'mayLayout') {
                                            myObj.listForMapLayout(myObj.strs2[sPeer], strs);
                                        }

                                        if (!myObj.needUpdate) {
                                            setconfig(myObj.strs2[sPeer],3);
                                        }
                                    }
                                } else {
                                    if (!myObj.needUpdate) {
                                        if (myObj.isInit === false) {
                                            // singleMatrixList(strs[5], strs);
                                            myObj.isInit = true;
                                        }
                                        setconfig(strs[5], strs[2]);
                                    }
                                }
                            } else {

                                // setconfig(strs[5],strs[2]);

                            }
                            if (!myObj.needUpdate) {
                                setconfig(strs[5], strs[2]);
                            }

                        } else if (strs.length > 0 && strs[0] == "0000") {

                        } else if (strs.length > 0 && strs[0] == "0003" && strs[1] == "0") {
                            if(!myObj.push[sPeer]) {
                                myObj.videosObj = strs[2];
                                acceptRequest({
                                    title: '请求视频连接',
                                    content: sPeer + '请求与您视频连接！'
                                }, myObj.prvwInit, strs, sPeer);
                            }
                            // myObj.prvwInit(strs, sPeer);
                        } else if (strs.length > 0 && strs[0] == "0003" && strs[1] == "1" && strs[2] == "0") {
                            var nowtime = new Date().getTime();
                            var strarray = strs[7].split("_");
                            var thisgrid = strarray[strarray.length-1];//获取当前窗体父级的父级id
                            myObj.video[thisgrid].Start(strs);
                        } else if (strs.length > 0 && strs[0] == "0002") {
                            if(strs[1] == "1" && strs[2] == "0"){
                                console.log(strs);
                                var strarray = strs[6].split("_");
                                var thisgrid = strarray[strarray.length-1];//获取当前窗体父级的父级id
                                myObj.audio[thisgrid].Start(strs);
                            }else if(strs[1] == "0"){
                                console.log('======',sData,sObj,sPeer,'======');
                                myObj.recReq(sPeer,sData);
                            }
                        } else if (strs.length > 0 && strs[0] == "0004") {

                        } else if (strs.length > 0 && strs[0] == "0005") {
                            // console.log(strs);
                        } else if (strs.length > 0 && strs[0] == "0007") {
                            console.log(strs);
                            if(strs[2] == "0"){//成功
                                alert('请求成功');
                            }else if(strs[2] == "1"){//没有用户登陆矩阵
                                alert('没有用户登陆矩阵');
                            }else{//拒绝请求
                                alert('对方拒绝了您的请求');
                            }
                        }
                    }
                },
                OutString: function (sStr) {
                    console.log(sStr);
                    if( ! sStr.obj){
                        return;
                    }else{
                        console.log("对象："+sStr.obj+"开启结果："+sStr.status);
                        if (sStr.status > -1) {
                            if (sStr.status == 15) {
                                // var strs = sStr.obj.split("_");
                                // console.log("窗口"+sStr.obj+sStr.msg+sStr.status);
                            }
                        }
                        if (sStr.status == -1) {
                            // var loadingid = 'load'+sStr.obj;
                            // var loadingel = document.getElementById(loadingid);
                            // $(loadingel).remove();
                        }

                    }
                }
            };
            myObj.s_oLive = new PgLib(document.getElementById(obj_id), pgUI);
            if (!myObj.s_oLive.Initialize("_DEV_", "", "p2p1.msu7.com:7781", "", 3)) {
                myObj.s_oLive = null;
                return;
            }
        },

        restart: function (sStr) {
            $("#BlockquotesClose2").append("设备"+sStr.obj+"开启视频失败，正在重连......<br/>");
            myObj.video.Start(sStr.str);
        },

        pushCon: function (str, num) {
            myObj.ctrl = new myObj.s_oLive.Control(myObj.matrixId);
            return myObj.ctrl.Pushc(str, num);
        },
        getCon: function (num) {
            // myObj.matrix = new myObj.s_oLive.matrix(myObj.matrixId);
            myObj.matrix.ReqList(num);
        },
        UpdateUser: function (sData) {
            var peersdata = myObj.s_oLive._Peer(sData);
        },
        singleMatrixList2: function (strs,sss) {
            var obj = JSON.parse(strs);
            var html = '';
            var html_child = '';
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].grName != null) {
                    var child = obj[i].grName.split(',');
                    child.forEach(function (value) {
                        html3 = "<span style='position: relative;'><img id='jt_ifAB' src='/Public/common/images/icon_++.png' style='position: absolute; width: 10px; top: 4px; left: -28px;' /></span>";

                        html_child += '<p style="margin-left: -10px;" class="jt_li" draggable="true" ondragstart="device_drag(event)" id="'+ sss.sPeer+'_'+ obj[i].id +'_'+ value.substr(2) + '">' + '<img style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span class="span-t4">' + value + '</span></p>';
                    });
                    html += '<a style="margin-left: 20px;" data-id="' + obj[i].id + '" id="drag_device' + obj[i].id + '">' + html3 + '<img onclick="click_child_hide(this)" style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" />' + '<span onclick="click_child_hide(this)" class="span-t4">' + obj[i].id + ':' + obj[i].name + '</span>'+ html_child +'</a>';
                }else{
                    html += '<a style="margin-left: 20px;" draggable="true"  ondragstart="device_drag(event)"' + ' data-id="' + obj[i].id + '" id="' +sss.sPeer+'_'+ obj[i].id + '_0">' + '<img onclick="click_child_hide(this)" style="width: 20px;" src="/Public/common/images/icon_sheXT1.png" /><span class="span-t4">' + obj[i].id + ':' + obj[i].name + '</span>'+ html_child +'</a>';
                }
                html_child = '';
            }
            $("#menu3 li").append(html);
        },
        listForMapManage: function (strs, sss) {
        },
        listForMapLayout: function (strs, sss) {
        },
        pgClean: function () {
            if (myObj.s_oLive) {
                myObj.s_oLive._Clean();
                myObj.s_oLive = null;
            }
        },
        connMatrix: function (matrixuuid) {
            myObj.matrix = new myObj.s_oLive.Matrix(matrixuuid);
            myObj.matrix.ReqList();
            myObj.matrix.ReqHeart();
            myObj.matrixInit = true;
            // if (!myObj.matrixInit) {
            //     myObj.matrix.ReqList();
            //     myObj.matrix.ReqHeart();
            //     myObj.matrixInit = true;
            // }
        },
        prvwInit: function (strs, sPeer) {
            myObj.prvw = new myObj.s_oLive.Prvw(strs, sPeer);
            myObj.prvw.Init();
        },
        prvwPlay: function (uHandle) {
            myObj.prvw.Play(uHandle);
        },
        audioInit: function (strs, sPeer) {
            myObj.prvwAudio = new myObj.s_oLive.prvwAudio(strs, sPeer);
            myObj.prvwAudio.AudioInit(strs, sPeer);
        },
        audioPlay: function (uHandle) {
            myObj.prvwAudio.AudioPlay(uHandle);
        },
        playVideo: function (matrixuuid, num, Wnd, pass, mode, prvw) {
            //matrixuuid为矩阵序列号, num为输入源id, Wnd为视频窗体id, pass为通道号, mode为主码子码
            var strs = Wnd.split("_");
            // var mobile = strs[3];
            var mobile = mode;//临时改为用mode为0判断手机视频
            myObj.video[strs[5]] = new myObj.s_oLive.Video(matrixuuid, num, pass, "", Wnd, mode, prvw);
            if (myObj.video[strs[5]].Init()) {
                myObj.video[strs[5]].ReqVideo(Wnd, mobile);
            }
        },
        playAudio: function (matrixuuid, num, Wnd, pass, mode) {
            console.log("matrixuuid:"+matrixuuid+" num:"+num+" Wnd:"+Wnd+" pass:"+pass);
            var strs = Wnd.split("_");
            // var mobile = strs[3];
            var mobile = mode;//临时改为用mode为0判断手机视频
            myObj.audio[strs[5]] = new myObj.s_oLive.Audio(matrixuuid, num, pass, "", Wnd);
            if (myObj.audio[strs[5]].Init()) {
                myObj.audio[strs[5]].ReqAudio(Wnd, mobile);
            }
        },
        screenShoot: function (Wnd) {
            var strs = Wnd.split("_");
            myObj.video[strs[5]].ScreenShoot(Wnd);
        },
        recordVideo: function (cmd, Wnd) {
            var strs = Wnd.split("_");
            return myObj.video[strs[5]].Record(cmd, Wnd);
        },
        initCtrl: function (matrixuuid) {
            myObj.ctrl = new myObj.s_oLive.Control(matrixuuid);
            return myObj.ctrl.Init();
        },
        ctrlSend: function (cmd, matrixuuid) {
            myObj.ctrl = new myObj.s_oLive.Control(matrixuuid);
            myObj.ctrl.Init(matrixuuid);
            return myObj.ctrl.Send(cmd);
        },
        switchSend: function (cmd, matrixuuid) {
            myObj.ctrl = new myObj.s_oLive.Control(matrixuuid);
            myObj.ctrl.Init(matrixuuid);
            return myObj.ctrl.switchSend(cmd);
        },
        stopVideo: function (winid) {
            if (winid) {
                if(myObj.video[winid] !== undefined){
                    myObj.video[winid].Stop();
                }

            }else{
                var strs = selfDevice.split("_");
                if(myObj.video[strs[5]] !== undefined){
                    myObj.video[strs[5]].Stop();
                }
            }
        },
        stopAudio: function () {
            var strs = selfDevice.split("_");
            myObj.audio[strs[5]].Stop();
        },
        pushReq: function (matrixuuid, num, Wnd, pass,type) {
            myObj.push[matrixuuid] = new myObj.s_oLive.PushVandA(matrixuuid, num, pass, "", Wnd,type);
            //发送心跳
            myObj.push[matrixuuid].sendHeart();
            myObj.push[matrixuuid].sendPush();
            //console.log("发送请求类型===1视频和音频==2视频==3音频==:"+type);
        },
        recReq: function (sPeer,sdata) {
            if(myObj.push[sPeer]){
                if(myObj.push[sPeer]._isclose){
                    console.log('======refuse!======');
                }else{
                    myObj.push[sPeer].Inits(sPeer,sdata);
                }
            }else{
                var strs = sdata.split('@');
                myObj.audiosObj = strs[2];
                acceptRequest({title:'请求音频连接',content:sPeer + '请求与您音频连接！'}, myObj.audioInit, strs, sPeer);
                // myObj.audioInit(strs, sPeer);
            }
        },
        openAudio: function (sPeer,sobj,uHandle) {
            if (typeof myObj.push[sPeer] != 'undefined' && myObj.push[sPeer]._channel == sobj) {
                console.log('======开启音频======');
                var uErr = myObj.push[sPeer].StartAudio(uHandle);
                if(uErr == 0){
                    $($('iframe[name="ifr"]').prop('contentWindow').document).find("#pushAudioLi").attr('style','display:none');
                    $($('iframe[name="ifr"]').prop('contentWindow').document).find("#clsAudioLi").attr({'data-speer':sPeer,'style':'color:red'});
                    $("#pushToggle .switch-right").attr({'data-speer':sPeer});
                    console.log('===11==',$("#pushToggle div"),'===2===');
                    $("#pushToggle div").removeClass();
                    $("#pushToggle div").addClass('switch-off switch-animate');
                }

            }else{
                if (sobj == myObj.videosObj) {
                    myObj.prvwPlay(uHandle);
                } else if (sobj == myObj.audiosObj) {
                    myObj.audioPlay(uHandle);
                } else if (sobj.indexOf('Talking_Audio')) {
                    myObj.prvwAudio = new myObj.s_oLive.prvwAudio();
                    myObj.prvwAudio.AudioPlay(uHandle);
                }
            }

        },
        closeAudio: function(obj){
            var sPeer = $(obj).attr('data-speer');
            if(myObj.push[sPeer]){
                if ( myObj.push[sPeer].heartS )
                {
                    clearInterval(heartS);
                    heartS = null;
                }
                var uErr = myObj.push[sPeer].CloseAudio();
                if(uErr == 0){
                    myObj.push[sPeer]._isclose = 1;
                    $($('iframe[name="ifr"]').prop('contentWindow').document).find("#pushAudioLi").removeAttr('style');
                    $($('iframe[name="ifr"]').prop('contentWindow').document).find("#pushAudioLi").removeAttr('data-speer');
                    $($('iframe[name="ifr"]').prop('contentWindow').document).find("#clsAudioLi").attr('style','color:red;display:none;');
                    $("#pushToggle .switch-right").removeAttr('data-speer');
                    $("#pushToggle").find('div').removeClass();
                    $("#pushToggle").find('div').addClass('switch-on switch-animate');

                }
                delete myObj.push[sPeer];
            }
        }
    };
    return myObj;
}

//做区块对应的输入源功能
function addElement(html,sPeer)
{
    $("#"+sPeer).append(html);
}



