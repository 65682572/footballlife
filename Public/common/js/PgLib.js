function PgLib(oAtx, oUI) {
    var _this = this;
    // Check peergine Activex object
    if (!oAtx) {
        console.log("pgLib: oAtx is invalid");
        return null;
    }

    ///------------------------------------------------------------------------
    // Private member variables.
    this._oAtx = oAtx;
    this._oUI = oUI;
    this._sObjOnline = null;
    this._sObjSvr = "";
    this._sObjSelf = "";
    // Server
    var _sInitSvrName = "pgConnectSvr";
    var _sInitSvrAddr = "";
    // Login
    var _LIVE_VER = "12";
    this._sUser = "";
    this._sPass = "";
    var _bLogin = false;
    // other
    var _sRelayAddr = "";
    var _uP2PTryTime = 0;
    var _sSvrAddr = "";
    // 对讲通道名
    this._channelNameAudio = null;

    this.Initialize = function (sUser, sPass, sSvrAddr, sRelayAddr, uP2PTryTime) {
        if (sUser == "") {
            this._OutString("pgLib.Initialize: User is null");
            return false;
        }
        // Init status.
        _this._sObjSvr = "";
        _this._sObjSelf = "";
        _this._sObjSelf = sUser + mymobile + "_0";
        _sSvrAddr = "";
        _bLogin = false;
        //Store parameters.
        _this._sUser = sUser;
        _this._sPass = sPass;
        _sInitSvrName = "pgConnectSvr";
        _sInitSvrAddr = sSvrAddr;
        _sRelayAddr = sRelayAddr;
        _uP2PTryTime = uP2PTryTime;
        //节点开始
        if (!this._NodeStart()) {
            this._OutString("pgLib.Initialize: Node start failed.");
            return false;
        }
        return true;

    };

    this._Clean = function () {
        this._NodeStop(false);
        _this._sObjSvr = "";
        _this._sObjSelf = "";
        _sSvrAddr = "";
    };

    this._NodeStart = function () {
        // Select server parameters.
        _this._sObjSvr = _sInitSvrName;
        _sSvrAddr = _sInitSvrAddr;
        _this._sObjOnline = "PGOL" + _this._sObjSvr;
        // Config atx node.
        this._oAtx.Control = "Type=1;LogLevel0=1;LogLevel1=1";
        this._oAtx.Node = "Type=0;Option=1;P2PTryTime=" + _uP2PTryTime;
        this._oAtx.Class = "PG_CLASS_Data:128;PG_CLASS_Video:128;PG_CLASS_Audio:128;";
        this._oAtx.Local = "Addr=0:0:0:127.0.0.1:0:0";
        this._oAtx.Server = "Name=" + _this._sObjSvr + ";Addr=" + _sSvrAddr + ";Digest=1";
        if (_sRelayAddr) {
            this._oAtx.Relay = "(Relay0){(Type){0}(Load){0}(Addr){" + _sRelayAddr + "}}";
        } else {
            var iInd = _sSvrAddr.lastIndexOf(':');
            if (iInd > 0) {
                var sSvrIP = _sSvrAddr.substring(0, iInd);
                this._oAtx.Relay = "(Relay0){(Type){0}(Load){0}(Addr){" + sSvrIP + ":443}}";
            }
        }
        //事件变化初始化
        this._oAtx.OnExtRequest = this._oUI.OnExtRequest;
        this._oAtx.OnReply = this._oUI.OnReply;

        // Start atx node.
        if (!this._oAtx.Start(0)) {
            this._OutString("pgLib._NodeStart: Start node failed.");
            return false;
        }

        // Login to server.
        if (!this._Login()) {
            this._OutString("pgLib._NodeStart: login failed.");
            this._NodeStop();
            return false;
        }

        return true;
    };

    this._NodeStop = function () {
        this._Logout();
    };

    this._Peer = function(sData) {
        var uAct = this._oAtx.omlGetContent(sData, "Action");
        var sPeerList = this._oAtx.omlGetEle(sData, "PeerList.", 1024, 0);
        if (sPeerList != "") {
            var iInd = 0;
            while (1) {
                var sItem = this._oAtx.omlGetEle(sPeerList, "", 1, iInd);
                if (sItem == "") {
                    break;
                }
                var sUser = this._oAtx.omlGetName(sItem, "");
                if (sUser != _this._sObjSvr) {
                    if (uAct != 0) {
                        if(sUser.length == 37){
                            this._matrixID = sUser;
                            // if (_this._oAtx.ObjectAdd(_this._sObjOnline, "PG_CLASS_Group", _this._sObjSvr, 0x1)!=1){
                            //     _this._OutString("pgLib.Matrix.Init: Add "+_this._sObjOnline+" object failed");
                            // }
                            var resultCode = _this._oAtx.ObjectRequest(this._matrixID, 36, "0001@0@03","");
                        }
                        // console.log("adduser："+sUser)
                        adduser(sUser);
                    }
                    else {
                        deluser(sUser);
                        // console.log("deluser："+sUser)
                        // pgLive.DeletePeer(sUser);
                    }
                }
                iInd++;
            }
        }
    };

    this._Action = function(sData) {
        var uAct = this._oAtx.omlGetContent(sData, "Action");
        return uAct;
    };

    this._Login = function() {
        var sVersion = "";
        var sVerTemp = this._oAtx.omlGetContent(this._oAtx.utilCmd("Version", ""), "Version");
        if (sVerTemp.length > 1) {
            sVersion = sVerTemp.substring(1);
        }

        var sParam = "(Ver){" + sVersion + "." + _LIVE_VER + "}";
        var sData = "(User){" + this._oAtx.omlEncode(_this._sObjSelf) + "}(Pass){" + this._oAtx.omlEncode(_this._sPass) + "}(Param){" + this._oAtx.omlEncode(sParam) + "}";
        var iErr = this._oAtx.ObjectRequest(_this._sObjSvr, 32, sData, "pgLib._Login");
        this._OutString("登录数据：" + sData);
        if (iErr > 0) {
            this._OutString("pgLib._Login: Login failed. iErr=" + iErr);
            return false;
        }
        return true;
    }
    this._Logout = function() {
        var logoutres = this._oAtx.ObjectRequest(_this._sObjSvr, 33, "", "pgLib._Logout");
        if (_bLogin) {
            this._OnEvent("Logout", "", "");
        }
        _bLogin = false;
    }
    this.Matrix = function(matrixID){
        this._matrixID = matrixID;
        if (_this._oAtx.ObjectAdd(_this._sObjOnline, "PG_CLASS_Group", _this._sObjSvr, 0x1)!=1){
            _this._OutString("pgLib.Matrix.Init: Add "+_this._sObjOnline+" object failed");
        }
        //获取输入源数据
        this.ReqList = function(num){
            if (num) {
                var resultCode = _this._oAtx.ObjectRequest(this._matrixID, 36, "0001@0@0"+num,"");
            }else{
                var resultCode = _this._oAtx.ObjectRequest(this._matrixID, 36, "0001@0@03","");
            }
            // _this._OutString("输入源拉取结果"+resultCode);
        }

        //发送心跳
        this.ReqHeart = function(){
            // if(this.timer != null) clearInterval(this.timer);
            // this.timer = setInterval(function() {
            //     var code = _this._oAtx.ObjectRequest('_DEV_54e63f00102b0a6cefc6c8099115ffff', 36, "0006@0@0"+_this._sUser, "");
            // }, 1000);
        }
    }

    this.Prvw = function (strs, sPeer) {
        var channelName = strs[2];
        myObj.channelNameAudio = strs[2].replace('Video', 'Audio');
        var code7 = strs[7];
        var code8 = strs[8];
        var code9 = strs[9];

        if (_this._oAtx.ObjectAdd('Prvw', "PG_CLASS_Video", '', (0x2 | 0x20)) != 1) {
            _this._OutString("pgLib.prvw.Init: Add Video Prvw object failed");
            return false;
        }

        this.Init = function () {
            if (channelName.indexOf('Talking_Video')) {
                if (_this._oAtx.ObjectAdd(channelName, "PG_CLASS_Video", sPeer, (0x10000 | 0x10 | 0x20)) != 1) {
                    _this._OutString("pgLib.prvw.Init: Add PG_CLASS_Video " + channelName + " object failed");
                    return false;
                }
                if (_this._oAtx.ObjectAdd(myObj.channelNameAudio, "PG_CLASS_Audio", sPeer, (0x10)) != 1) {
                    _this._OutString("pgLib.prvw.Init: Add PG_CLASS_Audio " + this._channelNameAudio + " object failed");
                    return false;
                }

                // _this._oAtx.ObjectRequest('Chat', 36, '(Action){1}(PeerList){('+sPeer+'){}}', "pgChat.SelUser");
            } else {
                if (_this._oAtx.ObjectAdd(channelName, "PG_CLASS_Video", sPeer, (0x10000 | 0x20 | 0x0004)) != 1) {
                    _this._OutString("pgLib.prvw.Init: Add Video " + sPeer + " object failed");
                    return false;
                }
            }

            var data = '0003@1@0@' + code7 + '@' + code8 + '@' + code9 + '@' + _this._sObjSelf + '@' + strs[2];
            var code = _this._oAtx.ObjectRequest(sPeer, 36, data, "sendMsg");
        };

        this.Play = function (uHandle) {
            if (channelName.indexOf('Talking_Video') != -1) {
                var thiswnd = document.getElementById('pgAtx_DEV_PC_Request');
                //var thiswnd = document.getElementById('layui-layer-iframe1').contentWindow.document.getElementById('pgAtx_DEV_PC_Request');
                var thiswnd2 = document.getElementById('pgAtx_DEV_PC_Request1');
                var sWndRect = '(Code){' + code7 + '}(Mode){' + code8 + '}(Rate){' + code9 + '}(Wnd){' + thiswnd.utilGetWndRect() + '}';
                var uErr = _this._oAtx.ObjectExtReply(channelName, 0, sWndRect, uHandle);
                var sWndRect2 = '(Code){' + code7 + '}(Mode){' + code8 + '}(Rate){' + code9 + '}(Wnd){ ' + thiswnd2.utilGetWndRect() + '}';
                _this._oAtx.ObjectRequest('Prvw', 32, sWndRect2, 'Single_Chat_new2.PrvwStart');
            } else {
                var thiswnd = document.getElementById('pgAtx_DEV_PC_Request');
                //var thiswnd = document.getElementById('layui-layer-iframe1').contentWindow.document.getElementById('pgAtx_DEV_PC_Request');
                var sWndRect = '(Code){' + code7 + '}(Mode){' + code8 + '}(Rate){' + code9 + '}(Wnd){' + thiswnd.utilGetWndRect() + '}';
                var uErr = _this._oAtx.ObjectExtReply(channelName, 0, sWndRect, uHandle);
                var sWndRect2 = '(Code){' + code7 + '}(Mode){' + code8 + '}(Rate){' + code9 + '}(Wnd){ ' + thiswnd.utilGetWndRect() + '}';
                _this._oAtx.ObjectRequest('Prvw', 32, sWndRect2, 'Single_Chat_new2.PrvwStart');
            }
        };
    };

    this.prvwAudio = function (strs, sPeer) {
        if (typeof strs != 'undefined') {
            var channelName = strs[2];
            var code8 = strs[8];
            var code9 = strs[9];
        }
        this.AudioInit = function (strs, sPeer) {
            if (_this._oAtx.ObjectAdd(channelName, "PG_CLASS_Audio", sPeer, 0x0004) != 1) {
                _this._OutString("pgLib.Audio.Init: Add " + channelName + " object failed");
                return false;
            }

            var data = '0002@1@0@' + code8 + '@' + code9 + '@' + _this._sObjSelf + '@' + strs[2];
            var code = _this._oAtx.ObjectRequest(sPeer, 36, data, "sendMsg");
            // _this._OutString("code： " + code);

        };

        this.AudioPlay = function (uHandle) {

            if (myObj.channelNameAudio != null) {
                var sWndRect = '(Code){0}(Mode){0}';
                var uErr = _this._oAtx.ObjectExtReply(myObj.channelNameAudio, 0, sWndRect, uHandle);
                var uErr2 = _this._oAtx.ObjectRequest(myObj.channelNameAudio, 32, sWndRect, '');

            } else {
                var sWndRect = '(Code){' + code8 + '}(Mode){' + code9 + '}';
                var uErr = _this._oAtx.ObjectExtReply(channelName, 0, sWndRect, uHandle);
            }

        }
    };

    this.Video = function (matrixID, ipcID, ipcNg, param, Wnd, fblCodeNum) {
        //初始化
        var thiswnd = document.getElementById(Wnd);
        var matrixID = matrixID;
        this._cName = "Video" + mymobile + "_" + Wnd;
        this._matrixID = matrixID;
        this._ipcID = ipcID;//摄像头ID
        this._ipcNg = ipcNg;//摄像头通道
        if (!param) this._param = "(Item){2}(Value){90}";
        else this._param = param;
        this._mlCode = "3";//压缩格式H.264
        if (fblCodeNum) {
            this._fblCodeNum = fblCodeNum;
        } else {
            this._fblCodeNum = "7";//CIF 分辨率 100=主码流，101=子码流
        }
        this._zlCodeNum = "40";//帧率 Rate 40 100=主码流，101=子码流
        this._codeRate = "1";//码率 1=128，2=256，3=512，4=1024，5=2048
        this.initObjAdd = false;
        this.Init = function () {
            // if (!this.initObjAdd) {
            //     if (_this._oAtx.ObjectAdd(matrixID, "PG_CLASS_Group", "", (0x10000 | 0x1)) != 1) {
            //         _this._OutString("pgLib.video.Init: Add Chat object failed");
            //         return false;
            //     }
            //     this.initObjAdd = true;
            // }
            if(_this._oAtx.ObjectAdd(this._cName, "PG_CLASS_Video", this._matrixID, (0x10000 | 0x20 | 0x0008)) != 1) {
                _this._OutString("pgLib.video.Init: Add Video " + this._cName + " object failed");
                return false;
            } else {
                //降噪
                if (this._param && _this._oAtx.ObjectRequest(this._cName, 2, this._param, "") > 0 ) {
                    _this._OutString("pgLib.video.Init: Request "+this._param+" failed");
                    return false;
                }
            }
            if (this._param && _this._oAtx.ObjectRequest(this._cName, 2, "(Item){10}(Value){2}", "") > 0 ){ //拉伸屏幕
                _this._OutString("pgLib.video.Init: Request (Item){10}(Value){2} failed");
                return false;
            }
            return true;
        };
        //请求视频
        this.ReqVideo = function(Wnd,mobile){
            console.log(mobile);
            if (mobile == "mobile" || mobile == 0) {
                // thiswnd = document.getElementById(Wnd);
                var strs = Wnd.split("_");
                var cname = "_"+strs[1]+"_"+strs[2]+"_"+strs[3];
                var data = "0003@0@"+this._cName+"@PG_CLASS_Video@0x0004@0@1:0@"+this._mlCode+"@7@"+this._zlCodeNum+"@512";
                var code  = _this._oAtx.ObjectRequest(cname, 36, data, "sendMsg");
                _this._OutString("发送0003手机消息结果"+code+" 发送data："+data+" 发送对象："+cname);
                if (typeof updateData == 'function') {
                    if (code == 0) {
                        //由于0是state的初始状态，当发送0003成功时，状态码改成99
                        updateData(Wnd,mqArray,99);
                    }else{
                        updateData(Wnd,mqArray,1);
                    }
                }
            }else{
                var data = "0003@0@"+this._cName+"@PG_CLASS_Video@0x0004@0@"+this._ipcID+":"+this._ipcNg+"@"+this._mlCode+"@"+this._fblCodeNum+"@"+this._zlCodeNum;
                var code  = _this._oAtx.ObjectRequest(this._matrixID, 36, data, "sendMsg");
                _this._OutString("发送0003摄像机消息结果"+code+" 发送data："+data+" 发送对象："+this._matrixID);
                if (typeof updateData == 'function') {
                    if (code == 0) {
                        updateData(Wnd,mqArray,99);
                    }else{
                        updateData(Wnd,mqArray,1);
                    }
                }
            }

        }
        //播放视频
        this.Start = function(str){
            peer = str[str.length - 2];
            var strarray = str[7].split("_");
            var thisgrid = strarray[strarray.length-1];//获取当前窗体父级的父级id
            thiswnd = $("#"+thisgrid).find('embed')[0];//获取当前embed对象
            var Wnd = $(thiswnd).attr("id");
            // var data = "(Action){1}(PeerList){("+peer+"){}}";

            // var code  = _this._oAtx.ObjectRequest(this._matrixID, 32, data, "pgChat.SelUser");
            // if (code != 0 ) {
            //     _this._OutString("P2P准备给B点发送数据失败");
            // }else{
            this._mlCode = str[3];//压缩格式H.264
            this._fblCodeNum = str[4];
            this._zlCodeNum = str[5];//帧率 Rate 40
            var sWndRect = "(Code){"+this._mlCode+"}(Mode){"+this._fblCodeNum +"}(Rate){"+this._zlCodeNum+"}(Wnd){"+ thiswnd.utilGetWndRect()+"}";
            _this._OutString("请求开启视频cName:"+this._cName+" sWndRect:"+sWndRect);
            var uErr =  _this._oAtx.ObjectRequest(this._cName, 32, sWndRect, "Single_Chat_new2.VideoStart");
            _this._OutString({status:uErr,obj:Wnd,msg:"视频开启结果",str:str});//不能删除
            if (typeof updateData == 'function') {
                updateData(Wnd,mqArray,uErr);
            }
            if (selfArray.length == 0) {
                needMQ = false;
            }
            else {
                // printMQArr();
            }

            if (selfArray2.length == 0) {
                needMQ = false;
            }
            else {
                // printMQArr_res();
            }
            if (typeof getIfoList == 'function') {
                getIfoList();
            }
        }
        this.ScreenShoot = function(Wnd){
            var sCmdParam = "(Open){0}(Ext){}(File){}(Flag){0}(Filter){" + _this._oAtx.omlEncode("Jpg file(*.jpg)|*.jpg") + "}";
            var sFileInfo = _this._oAtx.utilCmd("DlgFile", sCmdParam);
            if (sFileInfo == "") {
                return;
            }
            var sPath = _this._oAtx.omlGetContent(sFileInfo, "Path");
            var Data = "(Peer){}(Path){" + sPath + "}";
            var uErr =  _this._oAtx.ObjectRequest(this._cName, 37, Data, "Single_Chat_new2.ScreenShoot");
            _this._OutString("截图操作"+uErr);
        }
        this.Record = function(cmd,Wnd){
            if(cmd == 0){
                var Data = "(Peer){}(Path){}";
                // _this._oAtx.ObjectRequest("Audio", 37, Data, "Single_Chat_new2.RecordAudio");
                _this._oAtx.ObjectRequest(this._cName, 38, Data, "Single_Chat_new2.RecordVideo");
                _this._OutString("Stop video and audio record");
            } else {
                var sCmdParam = "(Open){0}(Ext){}(File){}(Flag){0}(Filter){" + _this._oAtx.omlEncode("Avi file(*.avi)|*.avi") + "}";
                var sFileInfo = _this._oAtx.utilCmd("DlgFile", sCmdParam);
                if (sFileInfo == "") {
                    return;
                }
                var sPath = _this._oAtx.omlGetContent(sFileInfo, "Path");
                var sData = "(Peer){}(Path){" + sPath + "}";

                // if (_this._oAtx.ObjectRequest(this._cName, 37, sData, "Single_Chat_new2.RecordAudio") <= 0) {
                //     _this._OutString("Start audio record success, path=" + sPath);
                // }
                // else {
                //     _this._OutString("Start audio record failed, path=" + sPath);
                // }
                if (_this._oAtx.ObjectRequest(this._cName, 38, sData, "Single_Chat_new2.RecordVideo") <= 0) {
                    _this._OutString("Start video record success, path=" + sPath);return true;
                }
                else {
                    _this._OutString("Start video record failed, path=" + sPath);return false;
                }
            }
        }
        this.Stop = function(){
            var restop = _this._oAtx.ObjectRequest(this._cName, 33, "", "pgLib.Video.Stop");
            _this._oAtx.ObjectDelete(this._cName);
        }
    }
    this.Audio = function(matrixID,ipcID,ipcNg,param,Wnd){
        //初始化
        var thiswnd = document.getElementById(Wnd);
        audioName = "Audio"+mymobile+Wnd;
        this._matrixID = matrixID;
        this._ipcID = ipcID;//摄像头ID
        this._ipcNg = ipcNg;//摄像头通道
        if(!param) this._param = "(Item){6}(Value){1}";
        else this._param = param;
        this._ysbmCodeNum = "0";//音频压缩编码：0为PCM编码，1为G.711A编码,2为AAC编码
        this._combineCode = "0";//音频格式：0为单声道

        this.Init = function(){
            // if (_this._oAtx.ObjectAdd("video"+matrixID, "PG_CLASS_Group", "", (0x10000|0x1))!=1){
            //     _this._OutString("pgLib.Audio.Init: Add audio"+matrixID+" object failed");
            //     return false;
            // }
            if (_this._oAtx.ObjectAdd(audioName, "PG_CLASS_Audio", this._matrixID, 0x10000)!=1){
                _this._OutString("pgLib.Audio.Init: Add "+audioName+" object failed");
                return false;
            }
            // else{
            //     //降噪
            //     if(this._param && _this._oAtx.ObjectRequest(audioName, 2, this._param, "")>0){
            //         _this._OutString("pgLib.Audio.Init: Request "+this._param+" failed");
            //         return false;
            //     }
            // }
            // _this._OutString("初始化成功");
            return true;
        }
        //请求音频
        this.ReqAudio = function (Wnd, mobile) {
            if (mobile == "mobile" || mobile == "0") {
                thiswnd = document.getElementById(Wnd);
                var strs = Wnd.split("_");
                var cname = "_" + strs[1] + "_" + strs[2] + "_" + strs[3];
                // var data = "0002@0@"+this._cName+"@PG_CLASS_Video@0x0004@0@1:0@"+this._mlCode+"@"+this._fblCodeNum+"@"+this._zlCodeNum;
                var data = "0002@0@" + audioName + "@PG_CLASS_Audio@0x0004@0@1:0@100@" + this._ysbmCodeNum + "@" + this._combineCode;
                var code = _this._oAtx.ObjectRequest(cname, 36, data, "sendMsg");
                // _this._OutString("发送0002消息结果" + code + " 数据包：" + data + "发送对象：" + cname);
            } else {
                var data = "0002@0@" + audioName + "@PG_CLASS_Audio@0x0004@0@" + this._ipcID + ":" + this._ipcNg + "@100@" + this._ysbmCodeNum + "@" + this._combineCode;
                var code = _this._oAtx.ObjectRequest(this._matrixID, 36, data, "sendMsg");
                // _this._OutString("发送0002消息结果" + code + " 数据包：" + data + "发送对象：" + this._matrixID);
            }
        };
        this.Start = function(str){  //播放音频
            var strs = Wnd.split("_");
            peer = str[str.length - 2];
            this._ysbmCodeNum = str[3];//音频压缩编码：0为PCM编码，1为G.711A编码,2为AAC编码
            this._combineCode = str[4];//音频格式：0为单声道
            var sWndRect = "(Code){"+this._ysbmCodeNum+"}(Mode){"+this._combineCode+"}";
            // _this._OutString("请求开启音频cName:"+audioName+" sWndRect:"+sWndRect);
            if (strs[3] == 'mobile' || strs[3] == '1') {
                var cname = "_"+strs[1]+"_"+strs[2]+"_"+strs[3];
                var uErr =  _this._oAtx.ObjectRequest(audioName, 32, sWndRect, "Single_Chat_new2.AudioStart");
            }else{
                var uErr =  _this._oAtx.ObjectRequest(audioName, 32, sWndRect, "Single_Chat_new2.AudioStart");
            }
            // _this._OutString("音频开启操作结果 "+uErr);
        }
        this.Stop = function(){
            var audiostop = _this._oAtx.ObjectRequest(audioName, 33, "", "pgLib.Video.Stop");
            console.log(audiostop);
            // _this._oAtx.ObjectDelete(_this._sUser+"_Audio_"+Wnd);
        }
    }
    //命令控制
    this.Control = function(matrixID){
        //初始化
        this._matrixID = matrixID;
        this._cName = _this._sUser+"_Control_"+parseInt(Math.random()*10000);
        this.Init = function(){
            // if (_this._oAtx.ObjectAdd("Chat", "PG_CLASS_Group", "", (0x10000|0x1))!=1){
            //     _this._OutString("pgLib.Control.Init: Add Chat object failed");
            //     return false;
            // }
            if(_this._oAtx.ObjectAdd(this._cName, "PG_CLASS_Data", "Chat", 0x10000)!=1){
                _this._OutString("pgLib.Control.Init: Add Data "+this._cName+" object failed");
                return false;
            }
            // _this._OutString("云台初始化成功");
            return true;
        }
        //发送命令
        this.Send = function(cmd){
            // this.cmd = "0000000000000001"+_this._sUser+"@"+_this._sPass;
            var data = "0005@0@0500@0@"+cmd;
            var code  = _this._oAtx.ObjectRequest(this._matrixID, 36, data, "sendCtrl");
            // _this._OutString("发送0005消息结果"+code+" data："+data);
        }

        //发送命令
        this.switchSend = function (cmd) {
            // this.cmd = "0000000000000001"+_this._sUser+"@"+_this._sPass;
            var data = "0005@0@0200@0@" + cmd;
            var code = _this._oAtx.ObjectRequest(this._matrixID, 36, data, "sendCtrl");
            // _this._OutString("发送0005/0200消息结果" + code);
        }

        //同步配置文件到矩阵
        this.Pushc = function(cmd,num){
            var data = "0004@0@"+num+"@0@0@0@1@1"+cmd;
            var resultCode = _this._oAtx.ObjectRequest(this._matrixID, 36, data,"");
            // _this._OutString("同步配置结果"+resultCode);
        }

    }
    this._OnEvent = function(sAct, sData, sRender) {
        if (this._oUI.OnEvent && typeof(this._oUI.OnEvent) == "function") {
            this._oUI.OnEvent(sAct, sData, sRender);
        }
    }
    this._OutString = function(sStr) {
        if (this._oUI.OutString && typeof(this._oUI.OutString) == "function") {
            this._oUI.OutString(sStr);
        }
    }
    //推送音频
    this.PushVandA = function(matrixuuid, num, pass, param, Wnd,type){
        this._matrixuuid = matrixuuid;
        this._audioName = "Audio_"+mymobile+Wnd;
        this._num = num;
        this._pass = pass;
        this._param = param;
        this._Wnd = Wnd;
        this._type = type;
        this._channel = '';
        this._strs = [];
        this._isclose = 0;
        this._heartS = null;
        var othat = this;
        this.Inits = function(sPeer,sdata){
            var strs = sdata.split("@");
            othat._strs = strs;
            othat._channel = strs[2];
            if (_this._oAtx.ObjectAdd(strs[2], "PG_CLASS_Audio", sPeer, (0x0004|0x0002))!=1){
                _this._OutString(strs[2]+"push添加通道对象失败");
            }else{
                _this._OutString(strs[2]+"添加通道对象成功");
                var sata = '0002@1@0@'+strs[8]+'@'+strs[9]+'@'+_this._sObjSelf+'@'+strs[2];
                var s = _this._oAtx.ObjectRequest(sPeer, 36, sata, "");
                if(s == '0'){
                    _this._OutString(sPeer+"push回应成功"+sata);
                }else{
                    _this._OutString(sPeer+"push回应失败"+sata);
                }
            }
        };
        this.StartAudio = function(uHandle){
            var str = othat._strs;
            var sWndRect = "(Code){"+str[8]+"}(Mode){"+str[9]+"}";
            var uErr = _this._oAtx.ObjectExtReply(othat._channel, 0, sWndRect, uHandle);
            //_this._oAtx.ObjectRequest(othat._channel, 32, sWndRect, "");
            _this._OutString("应答音频结果uErr:"+uErr+' channel:'+othat._channel+" sWndRect:"+sWndRect);
            return uErr;
        };
        this.CloseAudio = function(){
            var uErr = _this._oAtx.ObjectRequest(othat._channel, 33, "", "");
            _this._oAtx.ObjectDelete(othat._channel);
            if(othat._heartS){
                clearInterval(othat._heartS);
            }
            _this._OutString("关闭音频结果uErr:"+uErr);
            return uErr;
        };
        this.sendPush = function(){
            //0007@0@device@type@id@gn
            //type：推送数据类型，1=视频和音频、2=视频、3=音频
            //device:远程设备id,本地设备 = 0，0<为远程设备id（矩阵作为推送端是使用）
            //id：推送输入源id,（矩阵作为推送端是使用）
            //gn: 推送输入源通道号（矩阵作为推送端是使用）
            var cname = othat._matrixuuid;
            var data = "0007@0@"+othat._type;
            var code  = _this._oAtx.ObjectRequest(cname, 36, data, "sendMsg");
            _this._OutString("发送0007消息结果"+code+" 数据包："+data+"发送对象："+cname);
        };
        this.sendHeart = function(){
            var nodename = username + '的电脑';
            var cname = othat._matrixuuid;
            var ex = _this._sObjSelf.substr(9);
            var data = "0006@0@0@"+nodename+"@"+ex;
            var num = 1;
            _this._oAtx.ObjectRequest(cname, 36, data, "sendHeart");
            _this._OutString("发送心跳"+num+"数据包："+data+"发送对象："+cname);
            othat._heartS = setInterval(function(){
                num++;
                _this._oAtx.ObjectRequest(cname, 36, data, "sendHeart");
                //_this._OutString("发送心跳"+num+"数据包："+data+"发送对象："+cname);
            },30000);
        }
    };
}