/***************************************************************
 * @author longleiming
 * @qq 695832465
 * @version 1.0.9
 */



var LOCAL_CASE="#1F4B87";//小框颜色
var LOCAL_WINDOW="white";//物理屏颜色
var LOCAL_LINE="lk_line";//初始化行数的对象名称
var LOCAL_LIST="lk_list";//初始化列数的对象名称
var LK_CANVAS="";
var rightId=0;
var LK_CAN_OBJ=null;//api对象
var MY_CANVAS="deCan";

var TYPE_CLASSNAME="mdll_div";
var TYPE_DIV_LIST=["dslx_div","sjdlx_div"];
var SHOW_MODEL_ID="mdlx_select";//显示模式的下拉框
var CANVAL_ID="minModel";//显示模式的窗口有画布ID
var MODEL_SL_ID="model_s_g";//显示模式组
var MODEL_TIME="model_val_time";//模式时间间隔
var SHOW_MODEL_LX_ID="md_ul_val";//显示模式轮巡
var MAX_GROUP=64;//最大有64组


var local_win="ouputXml";//本地窗口配置文件的名称
var local_dbl_win="bclist";//双击放大窗口文件名称
var local_input="decoderList";//本地输入源配置文件名称
var local_model="modeList";//本地模式配置文件名称
var local_IFO="IFOlist";//本地对应关系文件名称
var local_modelRRT="mdlxList";//本地模式定时轮巡
var local_modelGroup="modelGroupList";//本地模式组配置文件名称


var BC_IMG="/api/img/bcg.png";//画布前景
var MBC_IMG="/api/img/bc.jpg";//自定义画布背景
var CL_IMG="/api/img/an1.gif";//关闭按钮
var LB_IMG="/api/img/menu_100.png";//选项卡
var ADD_IMG="/api/img/jr_5.png";//通道管理-添加对应关系
var DEL_IMG="/api/img/cs_5.png";//通道管理-删除对应关系
var TRUE_IMG="/api/img/d.png";//对
var FALSE_IMG="/api/img/x.png";//错
var CL2_IMG="/api/img/wgb.png";//关闭按错
var CL2D_IMG="/api/img/wgb-1.png";//关闭按下状态图片
var MIN_IMG="/api/img/wsx.png";//缩小图片
var MIND_IMG="/api/img/wsx-1.png";//缩小按下图片
var MAX_IMG="/api/img/wfd.png";//放大图片
var MAXD_IMG="/api/img/wfd-1.png";//放大按下图片

//var add_win_name="开启添加窗口";
var add_win_name=$st(js_2,103);//添加窗口
/*************************************
 * 自定义canvas对象
 * @param pId     画布ID
 * @param pWins   画布的窗口配置文件
 * @param pInputs 输入源文件
 * @param pIfo    对应关系文件
 * @param pModel  模式文件
 * @param pVideos 录像文件
 * @returns {lkCanvas}
 */
function lkCanvas(pId,pGode,pWins,pInputs,pIfo,pModel,pVideos){
    try {
        this.id=(pId!=null)?pId:null;//画布id
        LK_CANVAS=pId;
        this.wins=(pWins!=null)?pWins:null;//画布的窗口配置文件
        this.inputs=(pInputs!=null)?pInputs:null;//输入源文件
        this.ifo=(pIfo!=null)?pIfo:null;//对应关系文件
        this.model=(pModel!=null)?pModel:null;//模式文件
        this.videos=(pVideos!=null)?pVideos:null;//录像文件
        this.loginCode=null;
        this.setCode=function(pCode){
            try {
                this.loginCode=pCode;
                saveSessionList("loginCode",this.loginCode);
            } catch (e) {
                // TODO: handle exception
            }
        };
        /**************************
         * 初始化窗口大小
         */
        this.init=function(){
            try {
                if(this.id==null)//参数错误
                    return "Dedug:“"+this.id+"” is not defined.";
                var canObj=document.getElementById(this.id);
                if(canObj==null||"CANVAS"!=canObj.nodeName)//参数错误
                    return "Dedug:“"+this.id+"” is not a canvas.";
                $("body").append('  <img  alt="" src="'+BC_IMG+'" id="bcg" style="display:none;">');//设置画布背景图	
                $("body").append('  <img  alt="" src="'+MBC_IMG+'" id="lampa" style="display:none;">');//设置画布背景图	
                if(this.wins!=null){//判断窗口配置文件是否为空
                    setTimeout("fileToWin('"+this.wins+"')", 100);//价格延时20毫秒操作
                }else{
                    setTimeout("loadXml()", 100);//价格延时20毫秒操作
                }


                LK_CAN_OBJ=this;

                /*************************************
                 * 鼠标按下事件
                 */
                $("body").on("mousedown","#"+LK_CANVAS, (function(e) {

//					showMes("e.which:"+e.which+" id:"+this.id);

                    if(e.which==1){
                        /********************************
                         * 左键按下
                         */
                        var wins=returnList(local_win);
                        if(wins==null){
                            return;
                        }
                        dragImage(this);
                    }else if(e.which==3){
                        /*************************************
                         * 右键点击菜单
                         */

                        try {
                            try{
                                //showMes("e.which:"+e.which+" bcType:"+bcType);
                                if (e.which == 3&&bcType==1) {//放大状态不能右键点击
                                    var opertionn = {
                                        name : "none",// 可以再name后面加个随机数这样就等于从新建立一个菜单
                                        offsetX : 2,
                                        offsetY : -10,
                                        textLimit : 30,
                                        beforeShow : $.noop,
                                        afterShow : $.noop
                                    };
                                    var imageMenuData=new Array();
                                    $(this).smartMenu(imageMenuData, opertionn);
                                }else if (e.which == 3&&bcType==0) {

                                    //	showMes("e.which:"+(e.which == 3)+" bcType:"+(bcType==0),"red");

                                    var wins=returnList(local_win);
                                    if(wins!=null){
                                        var x = getCanXY(LK_CANVAS).x;// 获取鼠标当前在画布里x轴的坐标
                                        var y = getCanXY(LK_CANVAS).y;// 获取鼠标当前在画布里Y轴坐标
                                        rightId=getClickObjId(x,y).id;
                                        clickObj(e);
                                    }
//								 $("#objId").val(rightId);

                                    var opertionn = {
                                        name : "name",// 可以再name后面加个随机数这样就等于从新建立一个菜单
                                        offsetX : 2,
                                        offsetY : -10,
                                        textLimit : 30,
                                        beforeShow : $.noop,
                                        afterShow : $.noop
                                    };
                                    var imageMenuData=new Array();
                                    imageMenuData = [ [ {
                                        text : $st(js_2,104),//初始化
                                        func : function() {

                                            showInit();
                                            $("#lk_faqbg").css({display : "block",height : $(document).height()});

                                        }
                                    }, {
                                        text : showJSTxt(indexJSList,41),//拆分窗口
                                        func : function() {
                                            var wins=returnList(local_win);
                                            if(wins==null){
                                                upAlert($st(indexJSList,106));
                                                return;
                                            }
                                            if(getlastWin().active==1){
                                                upAlert(showJSTxt(indexJSList,42));
                                                return;
                                            }
                                            showSplit();
                                            $("#lk_faqbg").css({display : "block",height : $(document).height()});
//										$("#faqbg").css({display : "block",height : $(document).height()});
//										$(".splitDiv").show();
                                        }
                                    }, {
                                        text : showJSTxt(indexJSList,43),//合并窗口
                                        func : function() {
                                            try {
                                                var wins=returnList(local_win);
                                                if(wins==null){
                                                    upAlert($st(indexJSList,106));
                                                    return;
                                                }
                                                var a=0;
                                                var show_list=returnList("db_list");//当前是否正在放大状态
                                                var ctr_list=null;
                                                if(show_list!=null){
                                                    ctr_list=mapEntities;
                                                }else{
                                                    ctr_list=xmlEntities;
                                                }
                                                for(var i=0;i<ctr_list.length;i++){
                                                    if(ctr_list[i].strokeColor=="red"){
                                                        if(ctr_list[i].active==1){
                                                            upAlert(showJSTxt(indexJSList,44));
                                                            return;
                                                        }
                                                        a++;
                                                    }
                                                }//
                                                //showMes("a:"+a);
                                                if(a>1){
                                                    merDesign();
                                                }else{
                                                    upAlert(showJSTxt(indexJSList,45));
                                                }
                                            } catch (e) {
                                                setError("合并："+e);
                                            }



                                        }
                                    },{
                                        text : $st(js_2,103),//
                                        func : function() {
                                            var wins=returnList(local_win);
                                            if(wins==null){
                                                upAlert($st(indexJSList,106));
                                                return;
                                            }
//										showMes("addType:"+addType+"  add_win_name:"+add_win_name);
                                            if(addType==0){
                                                openAdd();
                                            }else{
                                                closeAdd();
                                            }
//										showMes("修改后addType:"+addType+"  add_win_name:"+add_win_name);
                                        }
                                    },
                                        {
                                            text : showJSTxt(indexJSList,46),//删除漫游画中画
                                            func : function() {
//										if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//											return false;
//										}
//										if(unUpdateWin()==false){//如果当前正在触发报警状态禁止操作配置文件
//											return false;
//										}
                                                var wins=returnList(local_win);
                                                if(wins==null){
                                                    upAlert($st(indexJSList,106));
                                                    return;
                                                }
                                                removeWin();//调用删除方法
                                            }
                                        },
                                        {
                                            text : showJSTxt(indexJSList,47),
                                            func : function() {
                                                var wins=returnList(local_win);
                                                if(wins==null){
                                                    upAlert($st(indexJSList,106));
                                                    return;
                                                }
                                                reset_win();//调用重置窗口的方法
                                            }
                                        },{
                                            text : showJSTxt(indexJSList,4),
                                            func : function() {
                                                var wins=returnList(local_win);
                                                if(wins==null){
                                                    upAlert($st(indexJSList,106));
                                                    return;
                                                }
                                                showConfigCanval();

                                            }
                                        }
                                    ]
                                        ,[
                                            {
                                                text : showJSTxt(indexJSList,104),
                                                func : function() {
//											if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//												return false;
//											}
//											if(unUpdateWin()==false){//如果当前正在触发报警状态禁止操作配置文件
//												return false;
//											}
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    clean_output();//调用清空窗口的输入源
                                                }
                                            },

                                            {
                                                text : showJSTxt(indexJSList,48),
                                                func : function() {
                                                    //启动、停止轮训控制
//										if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//											return false;
//										}
//										showMes("11");
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    contrlType(0x01);
                                                }
                                            } , {
                                                text : showJSTxt(indexJSList,49),
                                                func : function() {
                                                    //启动、停止轮训控制
//										if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//											return false;
//										}
//										showMes("222");
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    contrlType(0x02);
                                                }
                                            } ,{
                                                text : showJSTxt(indexJSList,50),
                                                func : function() {
                                                    //启动、停止输出控制
//										if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//											return false;
//										}
//										showMes("333");
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    contrlType(0x03);
                                                }
                                            } , {
                                                text : showJSTxt(indexJSList,51),
                                                func : function() {
                                                    //启动、停止轮训控制
//										if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//											return false;
//										}
//										showMes("444");
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    contrlType(0x04);
                                                }
                                            } ,{
                                                title:showJSTxt(indexJSList,102),
                                                text : showJSTxt(indexJSList,100),
                                                func : function() {
                                                    //播放轮训上一个
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    nextInput(1);
                                                }
                                            }, {
                                                title:showJSTxt(indexJSList,103),
                                                text : showJSTxt(indexJSList,101),
                                                func : function() {
                                                    ////播放轮训下一个
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    nextInput(2);
                                                }
                                            }],[
                                            {
                                                text:showJSTxt(indexJSList,99),//录像打开回放功能
                                                func:function(){
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    show_video_replay();
                                                    //playback_video();
                                                }
                                            } ,
                                            {
                                                text:showJSTxt(indexJSList,52),
                                                func:function(){
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    showSeachInput();
                                                }
                                            } , {
                                                text : showJSTxt(indexJSList,53),
                                                func : function() {
                                                    var wins=returnList(local_win);
                                                    if(wins==null){
                                                        upAlert($st(indexJSList,106));
                                                        return;
                                                    }
                                                    showChannal();//通道管理					 	
                                                }
                                            }
                                            , {
                                                text : showJSTxt(indexJSList,98),
                                                func : function() {
                                                    try{

                                                        var model=returnList(local_model);//获取本地模式列表
                                                        if(model!=null){
                                                            show_mdlx_div();
                                                            show_mdlx();//显示模式轮训管理窗口	
                                                        }else{
                                                            upAlert($st(js_2,105));
                                                        }

                                                        //alert(new Date('2015/12/21').getDay());//根据时间判断星期
                                                    }catch(e){
                                                        //showMes("错误:"+e);
                                                    }

                                                }
                                            }]];
//							 	imageMenuData=updataRightKey(imageMenuData,rightId);//判断是否插入指定数据
                                    $(this).smartMenu(imageMenuData, opertionn);


                                }


                            } catch (e) {
                                showMes("bind:mousedown"+e,"red");
                            }

                        } catch (e) {
                            setError("rigthClick",e);
                        }

                    }



                }));
                /*****************************
                 * 点击事件
                 */
                $("#"+LK_CANVAS).bind("click", (function(e) {
                    var wins=returnList(local_win);
                    if(wins==null){
                        return;
                    }
                    clickObj(e);
                }));

                /*************************
                 * 双击事件
                 */
                $("#"+LK_CANVAS).bind("dblclick", (function(e) {
//					showMes("双击");
                    var wins=returnList(local_win);
                    if(wins==null){
                        return;
                    }
                    blClickObj(e);
                }));
                return "Success";
            } catch (e) {
                // TODO: handle exception
                showMes("init:"+e,"red");
                return "Error:"+e;
            }

        };
        /************************************
         * 切换输入源
         * @param sInput 输入源id
         * @param sChannal 输入源通道号
         * @param event 鼠标对象
         * @returns
         */
        this.onPlay=function(event,sInput,sChannal){
            if(LK_CAN_OBJ==null){

                return "Error:jsCanvas is not initialize";
            }
            if(isNaN(sInput)||sInput==0||sInput>65536){
                return "Error:Param is Error";
            }
            if(isNaN(sChannal)||sChannal>256){
                return "Error:Param is Error";
            }
            var rType=show_inputSource(event,sInput,sChannal);
            return rType;
        };
        this.onLanguage=function(pType){
            try {
                if(isNaN(pType)||pType>2){
                    return "Error:Param is Error.";
                }
                localStorage.setItem("txtType",pType);
                return "Success";
            } catch (e) {
                // TODO: handle exception
                return "Error:Param is Error.";
            }

        }

        /**********************************
         * 刷新数据
         *
         */
        this.onReset=function(sType,sFile){
            try {
                if(LK_CAN_OBJ==null){

                    return "Error:jsCanvas is not initialize";
                }
                if(sType!=null&&sFile!=null){
                    showMes("类型:"+sType);
                    var rType=checkFile(sType,sFile);//验证文件是否正确
                    if(sType==5){
                        rType=0;
                    }
                    if(rType!=0){
                        return rType;
                    }
                    switch (sType) {
                        case 1://窗口配置文件
                            this.wins=sFile;
                            setTimeout("fileToWin('"+sFile+"')", 100);//延时100毫秒显示窗口界面
                            break;
                        case 3://输入源配置文件
                            this.inputs=sFile;
                            sFile=getReset(3,sFile);

                            saveList(local_input,sFile);
                            break;
                        case 5://显示对应关系
                            sFile=sFile.split("@")[1];
                            localStorage.setItem("oi",sFile);
                            readObjByList();
                            break;
                        case 7://对应关系文件
                            this.ifo=sFile;
                            sFile=getReset(7,sFile);;
                            saveList(local_IFO,sFile);
                            break;
                        case 8://模式文件
                            this.model=sFile;
                            sFile=getReset(8,sFile);;
                            saveList(local_model,sFile);
                            break;
                        case 13://模式定时轮巡文件
                            this.model=sFile;
                            sFile=getReset(13,sFile);;
                            saveList(local_modelRRT,sFile);
                            break;
                        case 19://模式组轮巡文件
                            this.model=sFile;
                            sFile=getReset(19,sFile);;
                            saveList(local_modelGroup,sFile);
                            break;

                        default:
                            break;
                    }
                }
            } catch (e) {
                showMes("onReset:"+e,"red");
                return "Error:"+e;
            }
        };


        /*************************
         * 写入录像回放的显示数据
         * @param  sInputId  输入源id
         * @param sChannal   输入源通道号
         * @param sFile    录像数据
         */
        this.onSetReplay=function(sFile,sInputId,sChannal){
            showMes("录像文件"+sFile);
            if(sInputId==null||sChannal==null||sFile==null){
                return "Error:Param is Error.";
            }
            var ix=sFile.indexOf("@");
            var listStr=sFile.substring(ix+1);
            zh_time(listStr,sInputId,sChannal);
            var rt="Success";
            return rt;
        };

        this.onRePlay=function (pType,pSpeed,pWinIdList){
            return videoPlayConfig(pType,pSpeed,pWinIdList);
        };

        /************************************
         *获取配置文件
         *@param sFile
         *
         */
        this.onGetFIle=function(sType){
            try{
                var fileStr="";
                var fileType=0;
                var fileList=null;
                switch (sType) {
                    case 1://窗口配置文件
                        fileList=xmlEntities;
                        fileStr=getExt(1,"ouputXml",fileList);
                        fileType=1;

                        break;
                    case 3://输入源配置文件
                        fileList=returnList("decoderList");
                        fileStr=getExt(1,"decoderList",fileList);
                        fileType=3;

                        break;
                    case 5://显示对应关系
                        fileList=returnList("oi");
                        fileStr=getExt(1,"oi",fileList);
                        fileType=5;
                        break;
                    case 7://对应关系文件
                        fileList=returnList("IFOlist");
                        fileStr=getExt(1,"IFOlist",fileList);
                        fileType=7;
                        break;
                    case 8://模式文件
                        fileList=returnList("modelList");
                        fileStr=getExt(1,"modelList",fileList);
                        fileType=8;
                        break;
                    case 13://模式定时轮巡文件
                        fileList=returnList("mdlxList");
                        fileStr=getExt(1,"mdlxList",fileList);
                        fileType=13;
                        break;
                    case 19://模式组轮巡文件
                        fileList=returnList("transmit");
                        fileStr=getExt(1,"transmit",fileList);
                        fileType=19;
                        break;

                    default:
                        break;
                }

                LK_CAN_OBJ.onExt(1,fileType,fileStr);
                return fileStr;
            }catch(e){


            }

        }

        /*********************************
         * 回调函数
         * @param data
         * @returns
         */
        var onExt=function(data){

        };
    } catch (e) {
        showMes("lkCanvas:"+e,"red");
        return "Error:"+e;
    }
};



/**********************************
 * 禁止背景操作
 */
var back_div='<div class="lk_faqbg" id="lk_faqbg" onselectstart="return false;" style="display: block; "></div>';
/*****************************************
 * 初始化窗口操作
 * @returns {Number}
 */
function showInit(){
    try {
        var init_div='<div class="lk_div lk_initDiv lk_radius"  >'+
            '<div class="dise">'+
            '<span class="wenzi1">&nbsp;&nbsp;<span id="chushihua_txt">'+$st(js_2,104.5)+'</span>'+
            '</span><span><img id="initImg" src="'+CL_IMG+'" width="47px" height="20px"> </span>'+
            '</div>'+
            '<div class="update_text">'+
            '<ul>'+
            '<li style="display: none;"><input id="objId" type="text" />&nbsp;<span></span>'+
            '</li>'+
            '<li><span class="wenzi2" style="width: 100px; display: inline-block;" id="size_txt">'+$st(js_2,106)+'：</span>'+
            '<select id="size" class="select_black">'+
            '</select></li>'+
            '<li><span class="wenzi2"'+
            'style="width: 100px; display: inline-block;" id="style_txt">'+$st(js_2,107)+'：</span><select'+
            ' id="stype" class="select_black">'+
            '<option value="0">PAL</option>'+
            '<option value="1">NTSL</option>'+
            '</select></li>'+
            '<li id="config_inputName_li"><span class="wenzi2"'+
            'style="width: 100px;  display: inline-block;" id="han_txt">'+$st(js_2,108)+'：</span><select'+
            ' class="select_black" name="select" id="line">'+
            '</select>'+
            '</li>'+
            '<li><span class="wenzi2"'+
            ' style="width:100px; display: inline-block;" id="lie_txt">'+$st(js_2,109)+'：</span><select'+
            ' name="select" class="select_black" id="list">'+
            '</select></li>'+
            '<li><span><input type="button" class="but_but"'+
            ' id="initYesBut" value="'+$st(js_2,110)+'" /> </span> &nbsp;&nbsp;'+
            '<span><input type="button" class="but_but"'+
            'id="initCanselBut" value="'+$st(js_2,111)+'" /> </span></li>'+
            '</ul>'+
            '</div>'+
            '</div>';
        $("body").append(back_div);
        $("body").append(init_div);
        //初始化给所有下拉框赋值
        //line:行数 
        //list：列数
        //stype: 视频格式
        //size:分辨率
        for ( var i = 1; i <= 20; i++) {
            $("#line").append(
                "<option value=\"" + i + "\">" + i
                + "</option>");
        }
        for ( var i = 1; i <= 20; i++) {
            $("#list").append(
                "<option value=\"" + i + "\">" + i
                + "</option>");
        }
        for ( var i = 0; i < sizeList.length; i++) {
            $("#size").append(
                "<option value='" + sizeList[i].byte + "'>"
                + sizeList[i].name
                + "</option>");
        }
        var sizeStr = localStorage.getItem("size");
        if (sizeStr != null) {
            var list = sizeStr.split("/");
            if (list != null && list.length > 3) {
                var le = list[0];
                var ls = list[1];
                var se = list[2];
                var te = list[3];
                $("#size option[value='" + se + "']").attr("selected", true);
                $("#stype option[value='" + te + "']").attr("selected", true);
                $("#line option[value='" + le + "']").attr("selected", true);
                $("#list option[value='" + ls + "']").attr("selected", true);
            }
        }
        /********************************
         * 拆分窗口
         */
        $("#initYesBut").click(function(){

//				clearPlayType(0);//清理数据
            var lineNum = parseInt($("#line").val());//行数
            var stype=parseInt($("#stype").val());//格式类型
            var listNum =parseInt( $("#list").val());//列数
            var size = parseInt($("#size").val());  //分辨率
            if (size == -1) {
                upAlert(showJSTxt(indexJSList,11));
                return;
            } else if (lineNum == 0) {
                upAlert(showJSTxt(indexJSList,12));
                return;
            } else if (listNum == 0) {
                upAlert(showJSTxt(indexJSList,13));
                return;
            }
            localStorage.setItem("size",lineNum+"/"+listNum+"/"+size+"/"+stype+"/");
            var binary = new Uint8Array(13);// 创建一个数组，必须固定长度
            binary[0] = 0x00;// 固定 编码 随机码序号1
            binary[1] = 0x00;// 固定编码 随机码序号2
            binary[2] = 0x00;// 固定编码 随机码序号3
            binary[3] = 0x00;// 固定编码 随机码序号4
            binary[4] = 0x00;// 固定 编码 包序号高8 位
            binary[5] = 0x00;// 固定编码 包序号低8 位
            binary[6] = 0x01;// 固定编码 功能码0
            binary[7] = 0x00;// 固定编码 功能码 1
            binary[8] = 0x01;// 固定编码 操作模式
            binary[9] = lineNum;// 固定编码 每一行多少个
            binary[10] = listNum;// 固定编码 每一列多少个
            binary[11] = size;// 固定编码 大小
            binary[12] = stype;// 固定编码 大小

            var wins=createCanvas();//拆分窗口

            if(LK_CAN_OBJ!=null){
                var rStr=getExt(1,"ouputXml",wins);
                LK_CAN_OBJ.onExt(0,"0100",binary);//调用回调接口
                LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
                LK_CAN_OBJ.onExt(1,7,"");//调用回调接口
            }
            $(".lk_faqbg").remove();
            $(".lk_initDiv").remove();
        });

        // 初始化取消按钮
        $("#initCanselBut").click(function(){
            $(".lk_faqbg").remove();
            $(".lk_initDiv").remove();
        });
        // 初始化图片取消按钮
        $("#initImg").click(function(){
            $(".lk_faqbg").hide();
            $(".lk_initDiv").remove();

        });

        return 0;

    } catch (e) {
        // TODO: handle exception
        return 2;
    }
}

//var fso = new ActiveXObject("Scripting.FileSystemObject");
//初始化生成对象 id为空则是在自定义时拆分，如果存在就是在某个ID画布上拆分
function createCanvas(id) {
    try {
        bcType=0;
        sessionStorage.removeItem("methodType");
        localStorage.removeItem("IFOlist");
        xmlEntities = new Array();

        //当前画布对象拆分成几行
        var lineNum = document.getElementById("line").value;
        //当前画布对象拆分成几列
        var listNum = document.getElementById("list").value;
        //将行数与列数保存在本地
        sessionStorage.setItem("lineNum",lineNum);
        sessionStorage.setItem("listNum",listNum);
        if (lineNum == 0 || listNum == 0) {
            upAlert(showJSTxt(indexJSList,10));
            return;
        }
        var can =null;
        //判断 如果ID为空则是最大的CANVAS 否者就是子CANVAS
        if(id!=null){
            can= document.getElementById(id);
        }else{
            can= document.getElementById(LK_CANVAS);
        }
        //获取当前要操作的画布宽度与高度
        var scrnWidth = can.clientWidth;// 画布总宽度
        var scrnHeight = can.clientHeight;// 画布总高度
        can.width = scrnWidth;
        can.height = scrnHeight;
        localStorage.setItem("canWidth",scrnWidth);
        localStorage.setItem("canHeight",scrnHeight);
        //根据行列的乘积计算出要生成的子块
        var canvaNum = lineNum * listNum;// 多少个对象
        // 每一个对象的属性
        var lineWidth = 1;// 边宽
        var fillColor = "black"; // 背景填充颜色
        var strokeColor = "white";// 边框颜色
        var beginX = 0;// 开始X轴坐标
        var beginY = 0;// 开始Y轴坐标
        var canvaWidth = scrnWidth / listNum;// 每个对象的宽度
        var canvaHeight = scrnHeight / lineNum;// 每个对象的高度
        var cxt = can.getContext("2d");
        cxt.clearRect(beginX, beginY, scrnWidth, scrnHeight);
        var mt=1;
        // 自定义模式的参数
        var designWidth=scrnWidth-deSignNum;//自定义的总宽
        var desingHeight=scrnHeight-deSignNum;//自定义的总高
        var dbx = deSignNum/2;// 开始X轴坐标
        var dby = deSignNum/2;// 开始Y轴坐标
        var dcw = designWidth / listNum;// 每个对象的宽度
        var dch = desingHeight/ lineNum;// 每个对象的高度
        //showMes("每一个物理屏X:"+dcw+" Y:"+dch);
        cxt.beginPath();
        cxt.lineWidth = lineWidth;
        cxt.strokeStyle = strokeColor;
        cxt.fillStyle = fillColor;
        cxt.rect(beginX, beginY, scrnWidth, scrnHeight);
        cxt.fill();
        cxt.stroke();

        //对象个数
        for ( var int = 0; int < canvaNum; int++) {
            // 把对象生成到数组里面

            entity = new Object();
            entity.id = int + 1;
            entity.num= int +1;//自定义窗口号
            entity.sc=entity.id;
            entity.x1 = beginX;
            entity.y1 = beginY;
            entity.x2 = beginX + canvaWidth;
            entity.y2 = beginY + canvaHeight;
            entity.lineWidth = 1;
            entity.fillColor = "black";
            entity.strokeColor = "white";
            entity.active = 0;
            entity.type = 0;
            if(mt==1){//自定义模式的属性
                entity.x1 = 0;
                entity.y1 = 0;
                entity.x2 = dwh;
                entity.y2 = dwh;
                entity.st=int + 1;
                entity.w=dwh;
                entity.h=dwh;
                entity.mt=1;
                entity.mx1 =dbx;
                entity.my1 =dby;
                entity.mx2 =dbx+dcw;
                entity.my2 =dby+dch;
            }
            xmlEntities[int] = entity;//把对象增加到数组
            cxt.beginPath();
            cxt.lineWidth = lineWidth;
            cxt.strokeStyle = strokeColor;
            var img=document.getElementById("bcg");//获取图片
            if(mt==null||mt==0){//标准模式下画图
                cxt.rect(beginX, beginY, canvaWidth, canvaHeight);
                cxt.drawImage(img,beginX, beginY, canvaWidth, canvaHeight);//话背景图片
            }else if(mt==1){//自定义模式下画图
                cxt.rect(dbx, dby, dcw, dch);
                cxt.drawImage(img,dbx, dby, dcw, dch);//话背景图片
            }
            cxt.stroke();
            if ((int + 1) % listNum == 0) {
                beginX = 0;
                beginY = beginY + canvaHeight;
                if(mt!=null&&mt==1){//自定义模式
                    dbx = deSignNum/2;
                    dby=dby+dch;
                }
            } else {
                beginX = beginX + canvaWidth;
                if(mt!=null&&mt==1){//自定义模式
                    dbx=dbx+dcw;
                }
            }
            //var caseList=getMyWindows(list);
            var clickCase=new Object();
            if(entity.mt==null){
                clickCase.x1= entity.x1;
                clickCase.y1= entity.y1;
                clickCase.x2= entity.x2;
                clickCase.y2= entity.y2;

            }else if(entity.mt==1){
                clickCase.x1= entity.mx1;
                clickCase.y1= entity.my1;
                clickCase.x2= entity.mx2;
                clickCase.y2= entity.my2;
            }
            clickCase.lineWidth = 1;
            clickCase.strokeColor = LOCAL_WINDOW;
            rectObj(clickCase,LK_CANVAS);



        }
        for ( var i = 0; i < xmlEntities.length; i++) {
            var ctx = can.getContext("2d");
            var id = 0;
            if(xmlEntities[i].num==null){
                id=xmlEntities[i].id;
            }else{
                id=xmlEntities[i].num;
            }
            var fondX=0;
            var fondY=0;

            if(mt==null||mt==0){//标准模式
                x1 = parseFloat(xmlEntities[i].x1.toString());
                y1 = parseFloat(xmlEntities[i].y1.toString());
                x2 = parseFloat(xmlEntities[i].x2.toString());
                y2 = parseFloat(xmlEntities[i].y2.toString());
                var width=x2-x1;
                if(width>30){
                    fondX = x1 + 10;
                    fondY = y1 + 13;
                }else{
                    fondX=x1+2;
                    fondY = y1+10;
                }
            }else if(mt==1){//自定义模式
                var mx1 = xmlEntities[i].mx1;
                var my1 = xmlEntities[i].my1;
                var mx2 = xmlEntities[i].mx2;
                var width=mx2-mx1;
                if(width>30){
                    fondX = mx1 + 10;
                    fondY = my1 + 13;
                }else{
                    fondX = mx1+2;
                    fondY = my1+10;
                }
            }

            // upAlert(id+" "+xmlEntities[i].lineWidth+" "+xmlEntities[i].strokeColor+" "+ xmlEntities[i].fillColor);
            ctx.font = "10px 宋体";
            ctx.fillStyle = "white";
            ctx.lineWidth = 1;
            ctx.fillText(id, fondX, fondY);
        }
        localStorage['ouputXml'] = JSON.stringify(xmlEntities);
        return xmlEntities;
//	check_openReplay();//刷新回放录像系统
//	showMes("初始化(xmlEntities:"+JSON.stringify(xmlEntities)+")");
//	$("#initDiv").hide();
//	$("#faqbg").hide();
        //showMes("init:"+sessionStorage.getItem("initCanvas"));
//	if(sessionStorage.getItem("initCanvas")!=null){
//		localStorage.setItem("coUpdate",1);
//		localStorage.setItem("grUpdate",1);
//		localStorage.setItem("moUpdate",1);
//		localStorage.setItem("mdlxType",1);
//		//showMes("xmlEntities:"+JSON.string(xmlEntities));
//		sessionStorage.setItem("gwt",2);
////		
////		sendJSONForServer("ouputXml", xmlEntities);// 从服务器获取输出屏幕数据	
//		
//		sessionStorage.removeItem("initCanvas");
//		sessionStorage.removeItem("upNum");
//	}
    } catch (e) {
        setError("createCanvas",e);
        return null;
    }
}



/*******************************************
 * 显示拆分窗口
 */
function showSplit(){
    try {
        showMes("aaaa:"+rightId);
        var sp_div='<div class="lk_div lk_splitDiv lk_radius"  >'+
            '<div class="dise">'+
            '<span class="wenzi1"> &nbsp;&nbsp;<span >'+$st(js_2,112)+'</span>'+
            '</span><span><img class="lk_canseltImg" src="'+CL_IMG+'" width="47px" height="20px"> </span>'+
            '</div>'+
            '<div class="update_text">'+
            '<ul>'+
            '<li style="display: none;"><input id="objId" type="text" value="'+rightId+'" />&nbsp;<span></span></li>'+
            '<li><span class="wenzi2" id="cfhan_txt" style="width: 60px; text-align: right;">'+$st(js_2,108)+'：</span><select id="objList" class="select_black">'+

            '</select>&nbsp;<span></span></li>'+
            '<li id="config_inputName_li"><span class="wenzi2" style="width: 60px;text-align: right;"'+
            'id="cflie_txt">'+$st(js_2,109)+'：</span><select class="select_black" id="objLine">'+
            '</select>&nbsp;<span></span>'+
            '</li>'+
            '<li><span><input type="button" class="but_but lk_splitBut"  value="'+$st(js_2,113)+'" />'+
            '</span> &nbsp;&nbsp; <span><input type="button" class="but_but lk_canseltBut" value="'+$st(js_2,111)+'" /> </span></li>'+
            '</ul>'+
            '</div>'+
            '</div>';
        $("body").append(back_div);
        $("body").append(sp_div);
        for ( var i = 1; i <= 10; i++) {
            $("#objLine").append(
                "<option value=\"" + i + "\">" + i
                + "</option>");
        }
        for ( var i = 1; i <= 10; i++) {
            $("#objList").append(
                "<option value=\"" + i + "\">" + i
                + "</option>");
        }
    } catch (e) {
        setError("showSplit",e);
    }
    //点击取消拆分按钮
    $(".lk_canseltBut").click(function(){
        showMes("bbbb");
        $(".lk_faqbg").remove();
        $(".lk_splitDiv").remove();
    });
    // 点击图片取消拆分按钮
    $(".lk_canseltImg").click(function(){
        $(".lk_faqbg").remove();
        $(".lk_splitDiv").remove();
    });
    /*************************************************
     * 点击分割页面的分割按钮进行分割
     */
    $(".lk_splitBut").click(function(){
        try {
//			var endNum=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//			showMes("拆分窗口开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"blue");
            var id=$("#objId").val();// 获取ID
            var lineNum=$("#objLine").val();// 获取行
            var listNum=$("#objList").val();// 获取列
            if(id==""){
                upAlert(showJSTxt(indexJSList,38));
                $(".lk_faqbg").remove();
                $(".lk_splitDiv").remove();
                return;
            }
            if(lineNum<1||listNum<1){
                upAlert(showJSTxt(indexJSList,39));
                return;
            }
            if(id=="0"){
                upAlert(showJSTxt(indexJSList,40));
                return;
            }
            var new_list=new Array();
            if(returnList("db_list")!=null){//当前为导航模式下操作
                // 获取canvas对象数组
                for(var i=0;i<mapEntities.length;i++){
                    new_list.push(mapEntities[i]);
                }
            }else{//当前为正常模式下操作
                var new_win=returnList("ouputXml");
                if(new_win!=null){
                    for(var i=0;i<new_win.length;i++){
                        new_list.push(new_win[i]);
                    }
                }
            }

            splistList= ctr_win(id,lineNum,listNum,new_list);
            if(splistList==null){
                //showMes("拆分失败","red");
            }else{
//				showMes("拆分成功"+JSON.stringify(splistList),"red");
                if(splistList[0].mt==null){
                    if(check_config(2)){
//						  sessionStorage.setItem("upNum", "1");
                        if(returnList("db_list")!=null){
                            readObjByList(splistList,LK_CANVAS);
                            ctr_win(id,lineNum,listNum,mapEntities);
                            xmlEntities=ctr_win(id,lineNum,listNum,returnList("ouputXml"));
                            saveList("ouputXml",xmlEntities);
                            initMap();
                            //  showMes(JSON.stringify(map_object));
                            initMap(map_object);
                        }else{

                            saveList("ouputXml",splistList);
                            loadXml();
                        }
                    }
                }else if(splistList[0].mt==1){
                    sessionStorage.setItem("upNum", "1");
                    var oldList=returnList("ouputXml");
                    splistList=upAcWin(oldList,splistList);//修改当前拆分窗口的时候影响到的漫游、画中画的窗口
                    saveList("ouputXml",splistList);
                    loadXml();
                }
                if(LK_CAN_OBJ!=null){
                    var rStr=getExt(1,"ouputXml",splistList);
                    LK_CAN_OBJ.onExt(1,1,rStr);
                }
            }
            //clearPlayType(id);//清理回放缓存数据
            $(".lk_faqbg").remove();
            $(".lk_splitDiv").remove();
        } catch (e) {
            showMes("拆分"+e,"red");
        }

    });
}

/*******************************
 * 显示搜素输入列表
 */
function showSeachInput(){
    try {
        var se_text=$st(js_2,114);
        var se_color="red";
        var inputs=returnList("decoderList");
        if(inputs==null){
            se_text=$st(js_2,114);;
        }
        var seach_str='<div class="lk_div  lk_seach_input">'+
            '<div class="dise">'+
            '<span class="wenzi1"> &nbsp;&nbsp;<span id="sssry_txt">'+$st(indexJSList,52)+'</span></span><span> <img'+
            '	class="seach_input_img" src="'+CL_IMG+'" width="47" height="20">'+
            '</span>'+
            '</div>'+
            '<div class="seach_option">'+
            '<ul>'+
            '<li class="seach_li"><select id="seach_type"'+
            '	class="seach_type ">'+

            '</select> '+
            '<input class="lk_seach_txt" id="seach_txt" type="text" oninput="in_fuc(this);" placeholder="'+$st(js_2,115)+'" /></li>'+
            '<li class="input_li input_top"><span class="tyc"'+
            '	style="width: 30px;" id="tycxh_txt">'+$st(js_2,116)+'</span><span class="tyc"'+
            '	style="width: 110px;" id="tycmc_txt">'+$st(js_2,117)+'</span><span class="tyc"'+
            '	style="width: 110px;" id="tycip_txt">'+$st(js_2,118)+'</span><span class="tyc"'+
            '	style="width: 110px;" id="tyctd_txt">'+$st(js_2,119)+'</span></li>'+
            '</ul>'+
            '</div>'+
            '<div class="seach_entity">'+
            '<ul class="seach_ul">'+
            '<li style="width: 100%;text-align: center;color:'+se_color+'" id="unsech_txt">'+se_text+'</li>'+

            '</ul>'+
            '</div>'+
            '<div style="width: 100%;height: 5px;"></div>'+
            '</div>';
        $("body").append(back_div);
        $("body").append(seach_str);
        $("#seach_type option").remove();
        $("#seach_type").append("<option value='0'>"+showJSTxt(indexJSList,103.3)+"</option>");
        $("#seach_type").append("<option value='1'>"+showJSTxt(indexJSList,103.4)+"</option>");
        /**************
         * 关闭窗口
         */
        $(".seach_input_img").click(function(){
            $(".lk_faqbg").remove();
            $(".lk_seach_input").remove();
        });



    } catch (e) {
        setError("showSeachInput",e);

    }

}

/*************************************
 * 显示通道管理
 */
function showChannal(){
    try {
        var cn_div='<div class=" lk_div lk_cannal" id="inputToOutputDiv">'+
            '<div id="faqbg2"></div>'+
            '<div class="dise">'+
            '	<span class="wenzi1">&nbsp;&nbsp;</span><span class="wenzi1" id="tdgl_txt"></span><span><img'+
            '	class="lk_cannal_img" src="'+CL_IMG+'" width="47" height="20">'+
            '	</span>'+
            '</div>'+
            '<div class="innerDiv">'+
            '<div class="mincanvas">'+
            '<div class="mincanvas_title">'+
            '<ul>'+
            '<li style="width: 100%;height: 30px; line-height: 30px;text-align: center;">'+
            '<span id="msxz_txt">'+$st(js_2,120)+'</span></li>'+
            '<li style="width: 100%;height: 30px; line-height: 30px;text-align: center;">'+
            '<select id="mode_select" style="width: 150px;height: 25px;" class="select_black">'+
            '<option value="select_0">'+$st(indexJSList,33)+'</option>'+
            '</select></li>'+
            '</ul>'+
            '</div>'+
            '<div class="leftline"></div>'+
            '<div class="mincanvas_div">'+
            '<canvas id="minCan"'+
            'style="margin-top:10%; width:90% ;height:70%;  background-color:black;">'+
            '</canvas>'+
            '</div>'+
            '</div>'+

            '<div class="inToOut">'+
            '<div class="incent"></div>'+
            '<div class="config_nav">'+

            '<ul>'+
            '<li class="menu_li" id="menu_td">'+$st(indexJSList,53)+'</li>'+
            '<li class="menu_li" id="menu_ck">'+$st(js_2,121)+'</li>'+
            '</ul>'+
            '</div>'+
            '<div class="nav_div nav_upnumber">'+
            '<div class="up_mes" id="up_mes_txt">'+$st(js_2,122)+'</div>'+
            '<form>'+
            '<div class="up_table">'+
            '<table class="win_num">'+

            '</table>'+
            '</div>'+
            '<div class="up_but">'+
            '<span> <input class="but_but" id="save_win_num"'+
            ' type="button" value="'+$st(js_2,123)+'" />'+
            '</span> '+
            '<span> '+
            '<input class="but_but" type="reset" id="qxxg_txt" value="'+$st(js_2,124)+'" />'+
            '</span>'+
            '</div>'+
            '</form>'+
            '</div>'+
            '<div class="nav_div nav_gallery">'+
            '<div class="input_gallery">'+
            '<span class="wenzi" >&nbsp;&nbsp;<span id="tdsc_txt">'+$st(js_2,125)+'：</span></span> <select'+
            ' id="outputId" style="height: 25px; width: 80px;"'+
            ' class="select_black">'+
            '</select>'+
            '</div>'+
            '<div class="input_play">'+
            '<div class="input_play_type">'+
            '<span class="radio_on radio_size" id="radio3"></span> <span'+
            ' class="wenzi" id="sjjglx_txt">'+$st(js_2,126)+'</span> &nbsp;&nbsp;&nbsp;&nbsp; <span'+
            ' class="radio_no radio_size" id="radio4"></span> <span'+
            ' class="wenzi" id="sjdlx_txt">'+$st(js_2,127)+'</span>'+
            '</div>'+
            '<div class="dragInput" id="dragInput">'+
            '<span id="dragInputInformation" ></span>'+
            '</div>'+
            '<div class="input_play_table1">'+
            '<div class="nebk1">'+
            '<ul class="tondao">'+
            '<li style="width: 5%" id="xu_txt">'+$st(js_2,116)+'</li>'+
            '<li style="width: 30%" id="sry_txt">'+$st(js_2,128)+'</li>'+
            '<li style="width: 20%" id="sjjg_txt">'+$st(js_2,129)+'</li>'+
            '<li style="width: 44%" id="sjjg_cz_txt">'+$st(js_2,130)+'</li>'+
            '</ul>'+
            '</div>'+
            '<div class="bkuang1">'+
            '<table id="input_table1" width="100%" border="0" align="center"'+
            ' cellspacing="0">'+
            '</table>'+
            '	</div>'+

            '</div>'+
            '<div class="input_play_table2" style="display: none;">'+
            '<div class="nebk1">'+
            '<ul class="tondao">'+
            '<li style="width: 5%" id="xuhao_txt">'+$st(js_2,116)+'</li>'+
            '<li style="width: 30%" id="shuruyuan_txt">'+$st(js_2,128)+'</li>'+
            '<li style="width: 10%" id="kssj_txt">'+$st(js_2,131)+'</li>'+
            '<li style="width: 10%" id="jssj_txt">'+$st(js_2,132)+'</li>'+
            '<li style="width: 44%" id="sjd_cz_txt">'+$st(js_2,130)+'</li>'+
            '</ul>'+
            '</div>'+
            '<div class="bkuang1">'+
            '<table id="input_table2" width="100%" border="0" align="center"'+
            ' cellspacing="0">'+
            '</table>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '<br />'+
            '<div style="width: 100% ; height: 30px; text-align: center;">'+
            '<span> '+
            '<input class="addInput but_but" id="tjsry_txt" type="button" value="'+$st(js_2,133)+'" /> '+
            '<input style="display: none;"id="newadd_matrixId" value="" type="text" /> '+
            '</span> '+
//						'<span>'+
//						'<input class="save_serve but_but" type="button" id="bcsry_txt" value="上传" />'+
//						'</span>'+
            '<span>'+
            '<input class="lk_cannal_img but_but" type="button"id="gbsry_txt"value="'+$st(js_2,134)+'"/>'+
            '</span>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="updateDiv1 radius" id="show_update"'+
            ' style="display: none;">'+
            '<div class="dise">'+
            '<span class="wenzi1"> &nbsp;&nbsp;<span id="xxxg_txt">'+$st(js_2,135)+'</span></span>'+
            '<span> <img'+
            ' id="updateDiv1_img" src="'+CL_IMG+'" width="49" height="20">'+
            '</span>'+
            '</div>'+
            '<div class="update_text1">'+
            '<ul class="add_tondao">'+
            '<li style="display: none;"><input id="upinputId" type="text" />'+
            '<input id="upoutputId" type="text" /></li>'+
            '<li><span class="wenzi2 span80" id="xgid_txt">ID：</span><input id="upId"'+
            ' class="input_case" type="text" disabled="disabled" /></li>'+
            '<li><span class="wenzi2 span80" id="xgmc_txt">'+$st(js_2,136)+'：</span><input id="upName"'+
            ' class="input_case" disabled="disabled" type="text" />'+
            '</li>'+
            '<li id="longli"><span class="wenzi2 span80" id="xgsc_txt">'+$st(js_2,137)+'：</span><input'+
            ' id="upLong" class="input_case" type="text"'+
            ' oninput="change(this,5)" onblur="checkUpLong()" />&nbsp;&nbsp;<img'+
            ' style="display: none;" id="up_lt_img" src="" />'+
            '</li>'+
            '<li id="beginli"><span class="wenzi2 span80" id="xgkssj_txt">'+$st(js_2,131)+'：'+
            '</span><input id="upBegin" type="text" class="input_case"'+
            '	onblur="checkUpBegin()" />&nbsp;&nbsp;<img'+
            '	style="display: none;" id="up_bg_img" src="" /></li>'+
            '<li id="endli"><span class="wenzi2 span80" id="xgjssj_txt">'+$st(js_2,132)+'：</span><input'+
            '	id="upEnd" type="text" class="input_case" onblur="checkUpEnd()" '+
            '	/>&nbsp;&nbsp;<img style="display: none;" id="up_ed_img" src="" /></li>'+
            '<li><span><input type="button"'+
            '		class="up_but_save but_but" id="upIFOsave" value="'+$st(js_2,123)+'" /> </span>'+
            '	&nbsp;&nbsp;&nbsp;<span><input type="button"'+
            '		id="upCancel" class="up_but_cansel but_but" value="'+$st(js_2,111)+'" /> </span></li>'+

            '<li id="up_me1" style="margin-top: 30px;">'+$st(js_2,138)+'</li>'+
            '<li id="up_me2" style="margin-top: 30px;">'+$st(js_2,139)+'</li>'+
            '</ul>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>';
        $("body").append(back_div);
        $("body").append(cn_div);
        $("#ae_type option").remove();
        $("#ae_type").append("<option value='0'>"+showJSTxt(indexJSList,103.4)+"</option>");
        $("#ae_type").append("<option value='1'>"+showJSTxt(indexJSList,103.5)+"</option>");
        $("#ae_type").append("<option value='2'>"+showJSTxt(indexJSList,103.6)+"</option>");
        inputConfig();//加载数据
        /**************************
         * 关闭窗口
         */
        $(".lk_cannal_img").click(function(){
            $(".lk_cannal").remove();
            $(".lk_faqbg").remove();
        });

        /******************************
         * 通道菜单管理
         */
        $(".menu_li").click(function(){
            $(".nav_div").each(function(){
                $(this).hide();
            });
            $(".menu_li").each(function(){
                $(this).css("z-index","201102");
            });
            switch (this.id) {
                case "menu_td":
                    $(this).css("z-index","201104");
                    $(".nav_gallery").show();
                    showWinMes();
                    break;
                case "menu_ck":
                    $(this).css("z-index","201104");
                    $(".nav_upnumber").show();
                    showWinNum();
                    break;
                default:
                    break;
            }
        });
        /*************************
         * 显示窗口对应关系
         */
        $("#outputId").change(function() {
            loadInput();
        });
        /**************
         * 点击修改radio状态
         */
        $("#radio3").click(function(){
            showMes("3");
            $("#radio3").attr("class","radio_on radio_size");
            $("#radio4").attr("class","radio_no radio_size");
//			$("#adBegin").val("");
//			$("#adEnd").val("");
            $(".input_play_table1").show();
            $(".input_play_table2").hide();
            timeType=0;
        });
        /************************
         *  点击id为radio4的单选框，然后清空其他单选框的内容同时显示该单选框的内容
         */
        $("#radio4").click(function(){
            showMes("4");
            $("#radio3").attr("class","radio_no radio_size");
            $("#radio4").attr("class","radio_on radio_size");
//			$("#adLong").val("");
            $(".input_play_table2").show();
            $(".input_play_table1").hide();
            timeType=1;
        });

        /**************************
         * 保存序号
         */
        $("#save_win_num").click(function(){
//			if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
//				return false;
//			}
            saveWinNum();
        });
        /*************************
         * 添加对应关系
         */
        $(".addInput").click(function() {
//			if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
//				return false;
//			}
            var inputs=returnList(local_input);

            if(inputs!=null){

                show_channal_add();//显示对应关系
            }else{
                upAlert($st(indexJSList,86));
            }

        });
        /**********************************
         * 选中模式下拉框事件
         *********************************/
        $("#mode_select").change(function() {
            try {
                var list = JSON.parse(localStorage.getItem("modeList"));// 获取模式数组文件
                if (list == null) {
                    return;
                }
                var id = $("#mode_select option:selected").val();
                $("#selectedMode").val(id.substring(7));
                var minlist = new Array();
                var IFOlist =new Array();
                var wNum = 0;
                var hNum = 0;
                if(id=="select_0"){//判断是否是当前模式
                    minlist=thisOP;
                    if(minlist!=null){
                        for(var i=0;i<minlist.length;i++){
                            if(minlist[i].x2>wNum){
                                wNum=minlist[i].x2;
                            }
                            if(minlist[i].y2>hNum){
                                hNum=minlist[i].y2;
                            }
                        }
                    }
                    IFOlist=thisIFO;
                }else{//判断选择的模式
                    for ( var i = 0; i < list.length; i++) {
                        if (id == "select_" + list[i].id) {
                            minlist = list[i].outputList;
                            IFOlist = list[i].IFOlist;
//							showMes("IFOlist:"+JSON.stringify(IFOlist),"red");
                            wNum = list[i].width;
                            hNum = list[i].height;
                        }
                    }
                }
                if($(".nav_upnumber").css("display")=="block"){//当前操作通道的时候
                    showWinNum(minlist);
                }else if($(".nav_gallery").css("display")=="block"){//当前操作窗口号的时候
                    showWinMes(minlist,-1);
                }
//				showMes("minlist:"+JSON.stringify(minlist));
                if(minlist[0].mt!=null&&minlist[0].mt==1){//判断是否是自定义模式
                    var caseWidth=document.getElementById("minCan").clientWidth;
                    var caseHeight=document.getElementById("minCan").clientHeight;
                    var maxXY=getMax(minlist,"design");
                    var mw=maxXY.x+deSignNum/2;
                    var mh=maxXY.y+deSignNum/2;
//					showMes("caseWidth:"+caseWidth+" caseHeight:"+caseHeight+" x:"+mw+" y:"+mh);
                    minlist=mappingList(minlist,mw,mh,caseWidth,caseHeight,2);
                }else{
                    minlist = countXY(minlist,"minCan");
                }
                minIFO=IFOlist;
                show_canvas(minlist, "minCan");
                var can = document.getElementById("minCan");
                var ctx = can.getContext("2d");
                $("#input_table1 tr").remove();
                $("#input_table2 tr").remove();
                for ( var i = 0; i < minlist.length; i++) {
                    if(minlist[i].id!=9999){
                        var x1 =0;
                        var y1=0;
                        var wi=0;
                        var he=0;
                        x1 = minlist[i].mx1;
                        y1 = minlist[i].my1;
                        wi =minlist[i].mx2 - x1;
                        he =minlist[i].my2 - y1;
                        var id = minlist[i].num;
                        if(wi>16&&he>12){
                            var fondX = x1 + 5;
                            var fondY = y1 + 10;
                            ctx.font = "10px 宋体";
                            ctx.strokeText(id, fondX, fondY);
                        }
                    }
                }
            } catch (e) {
                // TODO: handle exception
                setError("changeMode",e);
            }

        });

    } catch (e) {
        setError("showChannal",e);
    }
}
/****************************************
 * 显示输出文件到窗口
 * @param list
 * @param id
 */
function show_canvas(list, id) {
    // upAlert("list:"+list.length+" id:"+id);
    var c = document.getElementById(id);
    var cxt = c.getContext("2d");
    var caseWidth=c.clientWidth;
    var caseHeight=c.clientHeight;
    cxt.clearRect(0, 0, caseWidth, caseHeight);
    var x1=0;
    var y1=0;
    var width=0;
    var height=0;
    for(var i=0;i<list.length;i++){//排序作用：把漫游放到最后显示出来
        for(var j=0;j<list.length;j++){
            if(list[i].sc<list[j].sc){
                var a=list[i];
                list[i]=list[j];
                list[j]=a;
            }
        }
    }

    for ( var j = 0; j < list.length; j++) {
        if(list[j].id!=9999){
            if(list[0].mt==null||list[0].mt==0){
                x1 = parseFloat(list[j].x1);
                y1 = parseFloat(list[j].y1);
                width = parseFloat(list[j].x2) - x1;
                height = parseFloat(list[j].y2) - y1;
            }else if(list[0].mt==1){
                if(list[j].mx2!=0&&list[j].my2!=0){//判断是否是显示的图像
                    x1 = parseFloat(list[j].mx1);
                    y1 = parseFloat(list[j].my1);
                    width = parseFloat(list[j].mx2) - x1;
                    height = parseFloat(list[j].my2) - y1;
                }
            }
            var lineWidth = 1;
            var lineColor = "white";
//			showMes("x1:"+x1+"y1:"+y1+" width:"+width+" height:"+height);
            cxt.beginPath();
            cxt.lineWidth = lineWidth;
            cxt.strokeStyle = lineColor;
            cxt.rect(x1, y1, width, height);
            var img=document.getElementById("bcg");//获取图片
            cxt.drawImage(img,x1, y1, width, height);//话背景图片
            cxt.stroke();
        }
    }
}


/*********************************
 * 显示对应关系添加窗口
 *********************************/
function show_channal_add(){
    try {
        var output = $("#outputId option:selected").val();
        if (output == -1) {//判断是否选择窗口
            upAlert(showJSTxt(indexJSList,58));
            return;
        }
        var add_div='<div class="lk_div  lk_cn_add" id="show_add" >'+
            '<div class="dise" id="sa_top">'+
            '<span class="wenzi1"> &nbsp;</span>'+
            '<span class="wenzi1" id="index_title"></span><span>'+
            '<img id="show_add_img" src="'+CL_IMG+'" width="47" height="20">'+
            '</span>'+
            '</div>'+
            '<div class="ud_e" id="sa_entity">'+
            '<div class="ud_l radius">'+
            '<div class="ud_no_top" id="ud_no_top">'+
            '<ul class="ud_no_ul">'+
            '<li style="height: 30px; line-height: 30px;"><input'+
            '	id="adId" value="0" style="display: none;" type="text" /> <span'+
            '	class="ud_sl_li" style="margin-left: 20px;" id="ipss_txt">'+$st(js_2,140)+'：</span> <a'+
            '	class="ud_sl_li"><input id="aess_text" class="input_case"'+
            '		placeholder="'+$st(js_2,141)+'" type="text" />'+
            '</a> <span class="ud_sl_li"> '+
            '<select id="ae_type"'+
            '	class="select_black" style="height: 25px; width: 60px;">'+
            '</select> </span> <span class="ud_sl_li"><input type="button"'+
            '	class="but_but" id="sbbut_txt" onclick="seach_input()" value="'+$st(js_2,140)+'" />'+
            '</span></li>'+
            '<li class="ud_no_li ud_no_top" id="ud_no_tp" style="background-color: #999;">'+
            '<a class="ud_no_ck_top ud_no_ck"><input id="ud_no_ck_all"'+
            '	type="checkbox" />'+
            '</a> <a class="ud_no_num_top ud_no_num" id="tjxh_txt">'+$st(js_2,116)+'</a> <a'+
            '	class="ud_no_name_top ud_no_name" id="tjmc_txt">'+$st(js_2,117)+'</a> <a'+
            '	class="ud_no_ip_top ud_no_ip" id="tjdz_txt">'+$st(js_2,142)+'</a> <a'+
            '	class="ud_no_gn_top ud_no_gn" id="tjtd_txt">'+$st(indexJSList,1)+'</a></li>'+
            '</ul>'+
            '</div>'+
            '<div class="ud_no_mes" id="ud_no_mes">'+
            '<ul class="ud_no_ul" id="ud_no_ul">'+
            '<li class="ud_no_li"><a class="ud_no_ck"><input'+
            '	class="udno_ck" type="checkbox" />'+
            '</a> <a class="ud_no_num">1</a> <a class="ud_no_name">192.168.10.121</a>'+
            '<a class="ud_no_ip">192.168.10.121</a> <a class="ud_no_gn">通道1</a>'+
            '</li>'+

            '</ul>'+
            '</div>'+
            '<div></div>'+
            '</div>'+
            '<div class="ud_c" id="sae_c">'+
            '<ul class="ud_ul">'+
            '<li><img class="sae_img" id="s_r" title=""'+
            '	onclick="show_setTime()"  src="'+ADD_IMG+'"></li>'+
            '<li><img class="sae_img" id="d_l" title=""'+
            '	src="'+DEL_IMG+'">'+
            '</li>'+
            '</ul>'+
            '</div>'+
            '<div class="ud_r radius">'+
            '<div class="ud_is_top" id="ud_is_top">'+
            '<ul class="ud_is_ul">'+
            '<li class="ud_is_li ud_is_top" style="background-color: #999;">'+
            '<a class="ud_is_ck_top ud_is_ck"><input id="ud_is_ck_all"'+
            '	type="checkbox" />'+
            '</a> <a class="ud_is_num_top ud_is_num">'+$st(js_2,116)+'</a> <a'+
            '	class="ud_is_name_top ud_is_name" id="yrmc_txt">'+$st(js_2,136)+'</a> <a'+
            '	class="ud_is_gn_top ud_is_gn" id="yrtd_txt">'+$st(indexJSList,1)+'</a> <a'+
            '	class="ud_is_lt_top ud_is_lt" id="yrsjjg_txt">'+$st(js_2,129.5)+'</a> <a'+
            '	class="ud_is_be_top ud_is_be" id="yrsjd_txt">'+$st(js_2,143)+'</a></li>'+
            '</ul>'+
            '</div>'+
            '<div class="ud_is_mes">'+
            '<ul class="ud_is_ul" id="ud_is_ul">'+
            '<li class="ud_is_li"><a class="ud_is_ck"><input'+
            '		class="udis_ck" type="checkbox" />'+
            '</a> <a class="ud_is_num">'+$st(js_2,116)+'</a> <a class="ud_is_name">192.168.10.121</a>'+
            '<a class="ud_is_gn">通道号</a> <a class="ud_is_lt"><input'+
            '	style=" width: 30px; height:20px;" type="text" />'+
            '</a> <a class="ud_is_be"><input'+
            '	style=" width: 35px; height:20px;" type="text" />-<input'+
            '		style=" width: 35px;height:20px;" type="text" />'+
            '</a></li>'+


            '</ul>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        $("body").append(add_div);
        $("#ae_type option").remove();
        $("#ae_type").append("<option value='0'>"+showJSTxt(indexJSList,103.4)+"</option>");
        $("#ae_type").append("<option value='1'>"+showJSTxt(indexJSList,103.5)+"</option>");
        $("#ae_type").append("<option value='2'>"+showJSTxt(indexJSList,103.6)+"</option>");

        try {
            $("#adId").val(0);
            var list=returnList("decoderList");
            if(list==null){
                upAlert(showJSTxt(indexJSList,59));
                return;
            }
            $("#adInput option").remove();
            $("#adInput").append("<option value='-1'>"+showJSTxt(indexJSList,60)+"</option>");
            $("#adOutId").val(output);
            for(var i=0;i<list.length;i++){
                $("#adInput").append("<option value='"+list[i].id+"'>"+list[i].name+"</option>");
            }
            $("#faqbg2").show();
            $("#show_add").show();
            if (timeType == 0) {
                $("#add_end").hide();
                $("#add_long").show();
                $("#adLong").focus();
                $("#add_begin").hide();
                $("#ad_me1").show();
                $("#ad_me2").hide();
            } else {
                $("#add_long").hide();
                $("#add_begin").show();
                $("#adBegin").focus();
                $("#add_end").show();
                $("#ad_me2").show();
                $("#ad_me1").hide();
            }

            showDivAdd(output);
            /*********************************
             * 关闭添加窗口
             */
            $("#show_add_img").click(function(){
                $(".lk_cn_add").remove();
            });
            $("#ud_no_ck_all").click(function(){
                //全选输入源
                if($(this).prop("checked")==true){

                    $(".udno_ck").prop("checked",true);
                }else{
                    $(".udno_ck").prop("checked",false);
                }
            });
            $("#ud_is_ck_all").click(function(){
                //全选对应关系
                if($(this).prop("checked")==true){
                    $(".ud_is_ck").prop("checked",true);
                }else{
                    $(".ud_is_ck").prop("checked",false);
                }
            });
            $("#d_l").click(function(){
                //删除对应关系方法
                try {
                    var ipList=new Array();
                    $(".ud_is_ck").each(function(){
                        //获取选中的对应关系
                        if($(this).prop("checked")==true){
                            ipList.push(this.id.substr(8));
                        }
                    });
                    var IFOlist=returnList("IFOlist");
                    var moId=$("#mode_select").val();//获取当前操作的模式
                    var molist=returnList("modeList");//获取模式数组
                    if(moId!="select_0"){
                        moId=moId.substr(7);
                        if(molist!=null){
                            for(var i=0;i<molist.length;i++){
                                if(molist[i].id==moId){
                                    IFOlist=molist[i].IFOlist;
                                }
                            }
                        }
                    }
                    //循环数组删除数据
                    if(IFOlist!=null&&IFOlist.length>0){
                        for(var i=0;i<ipList.length;i++) {
                            for(var j=0;j<IFOlist.length;j++){
                                if(ipList[i]==IFOlist[j].id){
                                    IFOlist.splice(j,1);//删除数组元素
                                }
                            }
                        }
                    }
                    if(moId!="select_0"){
                        for(var i=0;i<molist.length;i++){
                            if(molist[i].id==moId){
                                molist[i].IFOlist=IFOlist;
                            }
                        }
                        saveList("modeList",molist);
                        var output = $("#outputId option:selected").val();
                        if(output!=null&&output!=-1){
                            setud_r(output);
                            inputConfig(output,molist);
                        }
                        var mStr=(molist!=null)?getExt(1,"moder",molist):"";
                        LK_CAN_OBJ.onExt(1,8,mStr);//调用回调接口
                    }else{
                        config_ifo(IFOlist,$("#outputId").val());//调用操作对应关系数组
                        sessionStorage.setItem("upIFOList",1);
                        saveList("IFOlist",IFOlist);
                        var output = $("#outputId option:selected").val();
                        if(output!=null&&output!=-1){
                            setud_r(output);
                            inputConfig(output);
                        }
                        var iStr=(IFOlist!=null)?getExt(1,"IFOlist",IFOlist):"";
                        LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口
                    }

                } catch (e) {

                    setError("d_l click method",e);
                }
            });
        } catch (e) {

            setError("addInput",e);
        }
    } catch (e) {
        setError("channal_add",e);
    }
}
/************************************
 *显示输入源关系设置
 */
function show_setTime(){
    try {
        var num=0;
        $(".udno_ck").each(function(){
            showMes("id:"  + this.id+"check:"+$("#"+this.id).prop("checked"));
            if($("#"+this.id).prop("checked")==true){
                num++;
            }
        });
        showMes("num:"+num);
        if(num==0){
            upAlert(showJSTxt(indexJSList,77));
            return;
        }
        channal_add_val();
        if(num>1){
            $(".stt_mes").html(showJSTxt(indexJSList,78));
            $(".st_be").hide();
        }else if(num==1){
            $(".stt_mes").html(showJSTxt(indexJSList,79));
            $(".st_be").show();

        }

    } catch (e) {

        setError("show_setTime",e);
    }
}
/*****************************************
 * 添加通道设置
 */
function channal_add_val(){
    try {
        var sv_div='<div class="lk_div lk_set_time radius" id="set_time" ">'+
            '<div class="dise" id="sa_top">'+
            '<span class="wenzi1"> &nbsp;<span id="szsj_txt">'+$st(js_2,144)+'</span></span><span><img'+
            ' class="set_time_img" src="'+CL_IMG+'" width="47" height="20">'+
            '</span>'+
            '</div>'+
            '<ul class="st_ul">'+
            '<li class="st_mes" style="height: 50px; line-height: 20px;"><span class="st_sp" id="szts_txt">'+$st(js_2,145)+'：</span><span'+
            '	class="stt_mes" id="tsxx">'+$st(indexJSList,78)+'</span>'+
            '</li>'+
            '<li class="st_lt"><span class="st_sp" id="szjg">'+$st(js_2,129.5)+'：</span><input'+
            '	placeholder="'+$st(js_2,147)+'"  class="input_case" oninput="change(this,5)"'+
            '	onblur="checkLong(this)" style="width: 40%;" id="stt_lt"'+
            '	type="text" />'+
            '</li>'+
            '<li class="st_be"><span class="st_sp" id="szsjd_txt">'+$st(js_2,143)+'：</span><input'+
            '	placeholder="00:00" class="input_case" onblur="checkBegin(this)"'+
            '	style="width: 30%;" id="stt_bt" type="text" /> - <input'+
            '	placeholder="00:00" class="input_case" onblur="checkEnd(this)"'+
            '	style="width: 30%;" id="stt_et" type="text" />'+
            '</li>'+
            '<li class="st_bt"><span><input id="stb_save"'+
            '		class="but_but" type="button" onclick="save_setTime()" value="'+$st(js_2,123)+'" />'+
            '</span> <span><input  class="but_but set_time_img" type="button"'+
            '	value="'+$st(js_2,111)+'" /> </span>'+
            '</li>'+
            '</ul>'+
            '</div>';
        $("body").append(sv_div);
        $(".set_time_img").click(function(){
            $(".lk_set_time").remove();
        });
    } catch (e) {
        setError("channal_add_val",e);
    }
}

/******************************
 * 修改通道设置
 * @param paramId
 */
function show_cannal_modify(paramId){
    try {

        var cannal_modify='<div class="lk_div lk_updateDiv1 radius" id="show_update">'+
            '<div class="dise">'+
            '<span class="wenzi1"> &nbsp;&nbsp;<span id="xxxg_txt">'+$st(js_2,135)+'</span></span>'+
            '<span> <img'+
            '	class="up_but_cansel" src="'+CL_IMG+'" width="49" height="20">'+
            '</span>'+
            '</div>'+
            '<div class="update_text1">'+
            '<ul class="add_tondao">'+
            '<li style="display: none;"><input class="upinputId" value="" type="text" />'+
            '<input class="upoutputId" type="text" value="" /></li>'+
            '<li><span class="wenzi2 span80" id="xgid_txt">ID：</span><input id=""'+
            '	class="input_case upId" type="text" disabled="disabled" value="" />&nbsp;&nbsp;<img'+
            '	style="display: none;"  src="" /></li>'+
            '<li><span class="wenzi2 span80" id="xgmc_txt">'+$st(js_2,136)+'：</span><input id="upName"'+
            '	class="input_case upName" disabled="disabled" type="text" value="" />&nbsp;&nbsp;<img'+
            '	style="display: none;" src="" /></li>'+
            '<li class="longli"><span class="wenzi2 span80" id="xgsc_txt">'+$st(js_2,137)+'：</span><input'+
            '	class="input_case upLong" value="" type="text"'+
            '	oninput="change(this,5)" onblur="checkUpLong()" />&nbsp;&nbsp;<img'+
            '	style="display: none;" class="up_lt_img" src="" />'+
            '</li>'+
            '<li class="beginli" style="display:none;"><span class="wenzi2 span80" id="xgkssj_txt">'+$st(js_2,131)+'：'+
            '</span><input  type="text" class="input_case upBegin"'+
            '	onblur="checkUpBegin()" value="" />&nbsp;&nbsp;<img'+
            '	style="display: none;" class="up_bg_img" src="" /></li>'+
            '<li class="endli" style="display:none;"><span class="wenzi2 span80" id="xgjssj_txt">'+$st(js_2,132)+'：</span><input'+
            '	type="text" value="" class="input_case upEnd" onblur="checkUpEnd()"'+
            '	/>&nbsp;&nbsp;<img style="display: none;" class="up_ed_img" src="" /></li>'+
            '<li><span><input type="button"'+
            '	class="up_but_save but_but" id="upIFOsave" value="'+$st(js_2,123)+'" onclick="up_but_save()" /> </span>'+
            '&nbsp;&nbsp;&nbsp;<span><input type="button"'+
            '	id="upCancel" class="up_but_cansel but_but" value="'+$st(js_2,111)+'" /> </span></li>'+
            '<li id="up_me1" style="margin-top: 30px;">'+$st(js_2,138)+'</li>'+
            '<li id="up_me2" style="margin-top: 30px; display:none;">'+$st(js_2,139)+'</li>';
        '</ul>'+
        '</div>'+
        '</div>';



        var id= paramId;
        var IFOlist=new Array();
        // 获取该数组
        IFOlist=minIFO;
        showMes("IFOlist:"+IFOlist)	;
        if(IFOlist!=null&&IFOlist.length>0){

            var Obj= checkObjById(IFOlist,id);
            showMes("Obj:"+JSON.stringify(Obj))	;
            if(Obj!=null){
                $("body").append(cannal_modify);
                var decoder=returnList("decoderList");
                var name="";
                if(decoder!=null){
                    for(var i=0;i<decoder.length;i++){
                        if(decoder[i].id==Obj.inputId){
                            name=decoder[i].name;
                        }
                    }
                }
                $(".upId").val(Obj.id);
                $(".upName").val(name);
                $(".upLong").val(Obj.longTime);
                $(".upBegin").val(Obj.beginTime);
                $(".upEnd").val(Obj.endTime);
                $(".upoutputId").val(Obj.outputId);
                $(".upinputId").val(Obj.inputId);
                var cName=$("#radio3").prop("class");
//			showMes("cName:"+cName);
                if(cName=="radio_on radio_size"){
                    $(".longli").show();
                    $(".beginli").hide();
                    $(".endli").hide();
                }else{
                    $(".longli").hide();
                    $(".beginli").show();
                    $(".endli").show();
                }
            }
            $(".up_but_cansel").click(function(){
                //	showMes("remove");
                $(".lk_updateDiv1").remove();
            });


        }
    } catch (e) {
        setError("show_cannal_modify",e);
    }
}

/**************************************
 * 切换输入源
 * @param pii
 * @param pic
 * @param event
 * @returns
 */
function show_inputSource(event,pii,pic,pdv){
    //
    try {
        if(bcType==1){//双击放大
            upAlert(showJSTxt(indexJSList,85));
            return showJSTxt(indexJSList,85);
        }
//	showMes("鼠标X:"+event.x+"鼠标Y:"+event.y);
        if(event.x==null||event.y==null){
            return "Error:The mouse is Error";
        }
        var canva=document.getElementById(LK_CANVAS);
        var hideX=document.body.scrollLeft;//获取隐藏的宽度 
        var hideY=document.body.scrollTop;//获取隐藏的高度
        var mouseX=(event.x+hideX);//鼠标相对页面开始的X坐标
        var mouseY=(event.y+hideY);//鼠标相对页面开始的Y坐标
        var canvaX=canva.offsetParent.offsetLeft+canva.offsetLeft;
        var canvaY=canva.offsetParent.offsetTop+canva.offsetTop;
        showMes("mouseX:"+mouseX+" mouseY:"+mouseY+" canvaX:"+canvaX+" canvaY:"+canvaY);
        var x=mouseX-canvaX;
        var y=mouseY-canvaY;
        var r_num=0;
        var id =0;
        for(var i=0;i<xmlEntities.length;i++){
            if(xmlEntities[i].strokeColor=="red"&&xmlEntities[i].id!=9999){
                r_num++;
            }
        }
        id= (getClickObjId(x, y)!=null)?getClickObjId(x, y).id:null; // 调用点击对象获取ID方法，把x和y坐标作参数，返回该坐标所在的对象的id
        if(id==null){
            return "Error:The mouse is not on canvas";
        }
        if(r_num>1){

        }else{

            if(xmlEntities!=null){
                for(var i=0;i<xmlEntities.length;i++){
                    if(xmlEntities[i].id==id){
                        xmlEntities[i].lineWidth=2;
                        xmlEntities[i].strokeColor="red";
                    }else {
                        xmlEntities[i].lineWidth=1;
                        xmlEntities[i].strokeColor="white";
                    }
                }
                readObjByList();
            }
        }
        showMes("窗口id:"+id);
        if(checkResolution(id)){///////////////////////////////////////////////////////////////// 验证是否超出解码能力  2016年5月27号
            return "Error:The window is Beyond the decoding ability";
        }
//	 showMes(id+" "+input_id+" x坐标："+x+"y坐标："+y);
//	$("#ccc").append( "id:"+id+"  input_id:"+input_id+"  input_num:"+input_num +" input _type:"+input_type);
        //$("#ccc").append("id:"+id+"  input_id:"+input_id+"  input_num:"+input_num);
        var decoders=returnList("decoderList");
        if(decoders!=null){
            for(var i=0;i<decoders.length;i++){
                if(decoders[i].id==pii&&decoders[i].gn!=null&&
                    decoders[i].gn!=""&&decoders[i].gn!=0&&input_num==0){
                    pic=1;
                }
            }
        }
        showMes("id:"+id+"  input_id:"+pii+"  input_num:"+pic+"  input_device:"+pdv,"red");
        var loginCode = returnSlist("loginCode");// 回去随机码
        //clearPlayType(id);//清理切换输入源的窗口的录像回放缓存
        var binary =null;
        if(loginCode==null){
            loginCode=[0x00,0x00,0x00,0x00];
        }
        if (loginCode != null) {
            var returnType=true;
            if(pdv!=null){
                returnType = playAPP(id,pdv,pii,pic);//判断当前的输入源是否是P2P设备
            }
            showMes("returnType:"+returnType);
            binary = new Uint8Array(13);// 创建一个数组，必须固定长度
            if(returnType==false){
                binary = new Uint8Array(16);
            }
            if(pdv!=null&&pdv!=0){//远程矩阵的输入源
                binary = new Uint8Array(18);
            }
            binary = setCode(binary, loginCode, 0x00, 0x00, 0x02, 0x00);
            binary[8] = id/256;
            binary[9] = id%256;
            binary[10] = pii/256;
            binary[11] = pii%256;
            binary[12] = pic;
            if(returnType==false){//判断是否是切换远程设备
                binary[13] = 0;//占位符
                var resolution=localStorage.getItem("resolutionNumber");
                var codeNumber=localStorage.getItem("codeNumber");
                resolution=(resolution==null)?7:resolution;//视频分辨率
                resolution=parseInt(resolution);
                codeNumber=(codeNumber==null)?3:codeNumber;//视频码率
                codeNumber=parseInt(codeNumber);
                binary[14] = resolution;
                binary[15] = codeNumber;
                if(input_device!=0){//设备id号
                    binary[16] = parseInt(pdv/256);
                    binary[17] = pdv%256;
                }
            }
            var sStr="长度："+binary.length+" 内容";
            for(var i=0;i<binary.length;i++){
                sStr+=zh(binary[i])+" ";
            }

            showMes("sStr:"+sStr);


            /*********************************************
             * @time 2016-9-22
             * @mes 切换APP设备的输入源出来显示
             */

            if(returnType==false){
                LK_CAN_OBJ.onExt(0,"02 00",binary);
                return "Success";
            }
            var list = returnList("IFOlist");
            var inList = returnList("decoderList");
            var obj = null;
            var name = "";
            var gn=null;
            if (inList != null) {
                for ( var i = 0; i < inList.length; i++) {
                    if (inList[i].id == pii) {
                        name = inList[i].name;
                        var bool=checkInputType(inList[i].type);
                        if(bool==true){
                            gn=parseInt(pic);
                        }
                    }
                }
            } else {
                //upAlert(showJSTxt(indexJSList,86));

                return "Error: Input source is empty. ";
            }

            if (list == null) {
                list=new Array();
            }
            var bool=0;
            var list_index=0;
            for ( var i = 0; i < list.length; i++) {
                // upAlert(list[i].outputId+" "+list[i].inputId+" "+id);
                if (list[i].outputId == id) {
                    bool++;
                    list_index=i;
                }
            }
            if(bool==0){
                obj = new Object();
                obj.id = getId(list);
                obj.inputName = name;
                obj.outputId = ""+id;
                obj.inputId = ""+pii;
                obj.longTime = ""+1;
                obj.beginTime = "";
                obj.endTime = "";
                obj.gn=gn;
                list.push(obj);
            }else if(bool==1){
                list[list_index].inputName=name;
                list[list_index].outputId =""+ id;
                list[list_index].inputId = ""+pii;
                list[list_index].longTime = ""+1;
                list[list_index].beginTime = "";
                list[list_index].endTime = "";
                list[list_index].gn=gn;
            }
            saveList("IFOlist", list);
            var iStr=(list!=null)?getExt(1,"IFOlist",list):"";
            LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口
            var dragList=returnList("dragList");//临时拖动文件
            if(dragList==null){
                dragList=new Array();
            }
            for(var i=0;i<dragList.length;i++){//找出拖动数组里面的数据
                if(dragList[i].outputId==id){
                    dragList.splice(i,1);
                    i--;
                }
            }
            obj = new Object();
            obj.id = getId(dragList);
            obj.outputId = ""+id ;
            obj.inputId = ""+pii ;
            obj.gn=""+gn;
            dragList.push(obj);
            saveList("dragList",dragList);

        }
        LK_CAN_OBJ.onExt(0,"02 00",binary);
        return "Success";
    } catch (e) {
        // TODO: handle exception
        setError("show_inputSource",e);
    }

}

/**********************************************************
 * 验证是否超出解码能力
 * @param winId
 * @returns {Boolean}
 */
function checkResolution(winId){
    try {
        var autoType=sessionStorage.getItem(RESOLUTION_AUTO);//获取当前解码能力是否超出RESOLUTION_AUTO 在 util.js
        var autoList=JSON.parse(sessionStorage.getItem(RESOLUTION_AUTO_LIST));
        var windows=returnList('ouputXml');//
        var windows_state=returnList("oiList");//窗口当前显示对应关系
//		showMes("autoList:"+JSON.stringify(autoList)+" autoType:"+autoType);
        if(autoType==null){//没有超出    
            return false;
        }else{
            windows=(windows!=null)?windows:new Array();
            windows_state=(windows_state!=null)?windows_state:new Array();
            for(var i=0;i<windows_state.length;i++){
                if(windows_state[i].oi==winId){//判断当前窗口是否有对应关系
//					showMes("return:false")	;
                    return false;
                }
            }//
            var bool=false;
            for(var i=0;i<windows.length;i++){
                if(winId==windows[i].id){
                    for(var j=0;j<autoList.length;j++){
                        if(windows[i].st==autoList[j]){
                            bool= true;
                        }
                    }
                }
            }
//			showMes("return:"+bool);
            if(bool){
                showMes(showJSTxt(indexJSList,109),"red");
                return true;//
            }else{
                return false;
            }
            //	showMes("windows_state:"+JSON.stringify(windows_state));

        }
    } catch (e) {
        alertError("checkResolution",e);
    }
}



/************************
 * 保存数据
 * @returns {Boolean}
 */
function up_but_save(){
    try{
        if(timeType==1){
            if(checkUpBegin()==false||checkUpEnd()==false){
                return false;
            }
        }else{
            if(checkUpLong()==false){
                return false;
            }
        }
        var upid= $(".upId").val();// 获取序列号
        var upinputName=$(".upName").val();// 获取输入源的名称
        var uplong= $(".upLong").val();// 获取时间轮训的时间
        var upbegin= $(".upBegin").val();// 获取时间段的开始时间
        var upend= $(".upEnd").val();// 获取时间段的结束时间
        var upinputId= $(".upinputId").val();// 获取输入通道Id
        var upoutputId= $(".upoutputId").val();// 获取输出通道Id
        showMes(" id"+ upid+"name:"+ upinputName+" upinputId:"+upinputId+
            " upoutputId:"+upoutputId+" uplong:"+uplong+" upbegin:"+upbegin
            +"upupend:"+upend);

        // 判断数组是否取值成功！
        if(minIFO==null){
            // upAlert("未找到数据，修改失败！");
            return;
        }
        // upAlert(minIFO.length);
        // 查找对应的关系对象，然后修改里面的属性
        for(var i=0;i<minIFO.length;i++){
            if(minIFO[i].id==upid){
                minIFO[i].outputId=upoutputId;
                minIFO[i].inputId=upinputId;
                minIFO[i].inputName=upinputName;
                minIFO[i].longTime=uplong;
                minIFO[i].beginTime=upbegin;
                minIFO[i].endTime=upend;
            }
        }

        // saveList("IFOlist",minIFO);// 保存数据，做持久化作用。

        var selectedModeId= $("#mode_select").val().substr(7);

        if(selectedModeId==0){
            config_ifo(minIFO,$("#upoutputId").val());//把当前操作的窗口保存在缓存里面
            sessionStorage.setItem("upIFOList",1);
            saveList("IFOlist",minIFO);
            thisIFO=minIFO;

            var iStr=(minIFO!=null)?getExt(1,"IFOlist",minIFO):"";
            LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口
        }else{
            var modeList=returnList("modeList");
            if(modeList!=null){
                for(var i=0;i<modeList.length;i++){
                    if(modeList[i].id==selectedModeId){
                        modeList[i].IFOlist=minIFO;
                    }

                }
            }
            saveList("modeList",modeList);// 保存数据，做持久化作用。

            localStorage.setItem("moUpdate","1");
            var mStr=(modeList!=null)?getExt(1,"moder",modeList):"";
            LK_CAN_OBJ.onExt(1,8,mStr);//调用回调接口
        }
        loadInput();	// 刷新数据
        $(".lk_updateDiv1").remove();


    } catch (e) {
        setError("up_but_save",e);
    }
}

/************************************
 * 验证修改数据
 */
function checkUpLong(){
    try {

        var lt=$(".upLong").val();
        showMes("lt:"+lt);
        $(".up_lt_img").show();
        if(isNaN(lt)){
            $(".up_lt_img").attr("src",FALSE_IMG);
            return false;
        }
        if(lt<1){

            $(".up_lt_img").attr("src",FALSE_IMG);
            return false;
        }else{

            $(".up_lt_img").attr("src",TRUE_IMG);
            return true;
        }
    } catch (e) {
        setError("checkUpLong",e);
    }

}
/************************************
 * 验证开始时间
 */
function checkUpBegin(){

    var  id= $(".upId").val();
    var bg=$(".upBegin").val();

    var ze=/^(([0-1]\d)|(2[0-4])):[0-5]\d$/;
    $(".up_bg_img").show();
    if(bg.length==0){
        $(".up_bg_img").attr("src",FALSE_IMG);
        return false;
    }else{
        if(ze.test(bg)){
            var list =returnList("IFOlist");
            var objbg="00:00";
            var objed="24:00";
            var oi=$("#outputId ").val();
            var lt=new Array();
            var this_index=0;//当前修改的时间所在数组的位置
            if(list!=null){
                for(var i=0;i<list.length;i++){
                    if(list[i].outputId==oi&&list[i].beginTime!=""&&list[i].endTime!=""){
                        lt.push(list[i]);

                    }

                }
            }
            for(var i=0;i<lt.length;i++){
                if(lt[i].id==id){
                    this_index=i;
                }
            }
            if(id==0&&lt.length>0){
                if(this_index-1>-1){
                    objbg=lt[this_index-1].endTime;
                }
            }else{
                for(var i=0;i<lt.length;i++){
                    if(id==lt[i].id){
                        if(this_index-1>-1){
                            objbg=lt[this_index-1].endTime;
                        }
                        if((i+1)<lt.length){
                            objed=lt[i+1].beginTime;
                        }
                    }
                }
            }
// upAlert("id:"+id+" objbg:"+objbg);
// showMes("this_index:"+this_index+" id:"+id);
// showMes("lt:"+JSON.stringify(lt),"red");
// showMes("输入时间"+bg+ " 比较的开始时间:"+objbg+" 比较的结束时间："+objed);
            var bool1= testTime(bg,objbg,"big");
            var bool2=testTime(bg,objed,"smoll");

            if(bool1&&bool2){
                $(".up_bg_img").attr("src",TRUE_IMG);
                return true;
            }else{
                $(".up_bg_img").attr("src",FALSE_IMG);
                return false;
            }
        }else{
            $(".up_bg_img").attr("src",FALSE_IMG);
            return false;

        }

    }

}

/********************************
 * 验证结束时间
 */
function checkUpEnd(){
    var  id= $(".upId").val();
    var bg=$(".upBegin").val();
    var ed=$(".upEnd").val();
    var ze=/^(([0-1]\d)|(2[0-4])):[0-5]\d$/;
    $(".up_ed_img").show();
//  showMes(ed.length+" "+bg.length+"  bg:"+bg+"  ed:"+ed);
    if(ed.length==0){
        $(".up_ed_img").attr("src",FALSE_IMG);
        return false;
    }else{
        if(ze.test(ed)){
            var list =returnList("IFOlist");
            var objbg=bg;
            var objed="24:00";
            var oi=$("#outputId ").val();
            var lt=new Array();
            if(list!=null){
                for(var i=0;i<list.length;i++){
                    if(list[i].outputId==oi&&list[i].beginTime!=""&&list[i].endTime!=""){
                        lt.push(list[i]);
                    }
                }
            }
            if(id==0){
                objed="24:00";
            }else{
                for(var i=0;i<lt.length;i++){
                    if(id==lt[i].id){
                        // objed=lt[i].endTime;
                        if((i+1)<lt.length){
                            objed=lt[i+1].beginTime;
                        }
                    }
                }
            }
// upAlert("输入时间"+ed+ " 比较的结束时间:"+objbg+" 比较的开始时间："+objed);

            var  bool1= testTime(ed,objbg,"big");
            var	bool2=testTime(ed,objed,"smoll");

            if(bool1&&bool2){
                $(".up_ed_img").attr("src",TRUE_IMG);
                return true;
            }else{
                $(".up_ed_img").attr("src",FALSE_IMG);
                return false;
            }
        }else{
            $(".up_ed_img").attr("src",FALSE_IMG);
            return false;

        }

    }
}


/**********************************
 *
 */
function show_mdlx_div(){
    try {
        var md_div='<div class="lk_div lk_mdlx_div" id="mdlx_div" >'+
            '<div class="dise" id="mdlx_head">'+
            '<span class="wenzi1">&nbsp;&nbsp;</span><span class="wenzi1" id="mslx_txt">'+$st(indexJSList,98)+'</span><span><img'+
            '	onclick="hide_mdlx()" src="'+CL_IMG+'" width="47" height="20">'+
            '</span>'+
            '</div>'+
            '<div class="mdll_div" id="dslx_div" >'+//<!-- 模式定点轮巡 -->
            '<div class="mdcz_div">'+
            '<span class="mslx_span" id="md_sp_mt">'+$st(js_2,148)+'：'+

            '</span>'+
            '<select class="select_black mslx_type" onchange="switch_model_type(this)">'+
            '<option value="0" id="md_ds_0">'+$st(js_2,149)+'</option>'+
            '<option value="1" id="md_ds_1">'+$st(js_2,150)+'</option>'+
            '</select>'+
            '<span style="float: left;margin-left: 5px;">'+
            '<input type="button" class="but_but"  value="'+$st(js_2,151)+'" id="mdlx_but_one" onclick="but_model_type()"/>'+
            '</span>'+
            '<span><input type="button" class="but_but" id="mdlx_add_txt" value="'+$st(js_2,133)+'" onclick="add_mdlx()" /></span>'+
            '<span><input type="button" class="but_but" id="mdlx_save_txt"  value="'+$st(js_2,123)+'" onclick="save_mdlx()" /></span>'+
            '<span><input type="button"  class="but_but" id="mdlx_close_txt"  value="'+$st(js_2,134)+'" onclick="hide_mdlx()"/></span>'+
            '</div>'+
            '<div class="mdsz_div">'+
            '<ul class="mdsz_ul">'+
            '<li id="mdli_top">'+
            '<span class="mdxh" id="mdxh_txt">'+$st(js_2,116)+'</span>'+
            '<span class="mdrq" id="mdrq_txt">'+$st(js_2,152)+'</span>'+
            '<span class="mdxqj" id="mdxqj_txt">'+$st(js_2,154)+'</span>'+
            '<span class="mdsj" id="mdsj_txt">'+$st(js_2,153)+'</span>'+
            '<span class="mdmc" id="mdmc_txt">'+$st(js_2,156)+'</span>'+
            '<span class="mdqd" id="mdqd_txt">'+$st(js_2,155)+'</span>'+
            '<span class="mdcz" id="mdcz_txt">'+$st(js_2,130)+'</span>'+
            '</li>'+
            '</ul>'+
            '<ul class="mdszet_ul">'+

            '</ul>'+
            '</div>'+
            '</div>'+

            '<div class="mdll_div" id="sjdlx_div" style="display: none;">'+ //<!-- 模式时间时隔轮巡 -->
            '<div class="mdcz_div" id="">'+
            '<span class="mslx_span" id="md_sp_tp">'+$st(js_2,148)+'：'+

            '</span>'+
            '<select class="select_black mslx_type" onchange="switch_model_type(this)" >'+
            '<option value="0" id="md_z_0">'+$st(js_2,149)+'</option>'+
            '<option value="1" id="md_z_1">'+$st(js_2,150)+'</option>'+
            '</select>'+
            '<span style="float: left;margin-left: 5px;">'+
            '<input type="button" class="but_but"  value="'+$st(js_2,151)+'" id="mdlx_but_two" onclick="but_model_type()"/>'+
            '</span>'+

            '</div>'+
            '<div class="mdsz_div" id="mdz_lx">'+
            '<div class="mdsjlx_canvas" id="md_can">'+
            '<div class="mincanvas_title">'+
            '<ul style="width: 100%;height: 30px;">'+
            '<li style="width: 100px;height: 30px; line-height: 30px;text-align: center; float: left;">'+
            '<span id="msxlxz_txt">'+$st(js_2,120)+'：</span></li>'+
            '<li style="width: 150px;height: 30px; line-height: 30px;text-align: center;float: left;">'+
            '<select id="mdlx_select" style="width: 150px;height: 25px;" onclick="switch_model(this,1)"'+
            '	class="select_black">'+

            '</select>'+
            '</li>'+


            '</ul>'+
            '<ul style="width: 100%;height: 30px;">'+
            '<li  class="model_ul_li" style="width: 100px;">'+
            '<span id="msxlsj_txt">'+$st(js_2,129)+'：</span></li>'+
            '<li class="model_ul_li" style="width: 150px;">'+
            '<input id="model_val_time" type="text" class="input_case" oninput="checkInputCode(this)"/>'+
            '</li>'+
            '<li class="model_ul_li" style="width: 30px;">(s)'+
            '</li>'+
            '<li class="model_ul_li" style="width: 120px;">'+
            '<span>'+
            '<input type="button" class="but_but" value="'+$st(js_2,157)+'" id="add_mdlx" onclick="save_model_lx()"/>'+
            '</span>'+
            '</li>'+
            '</ul>'+
            '</div>'+
            '<div class="leftline"></div>'+

            '<div class="mincanvas_div">'+
            '<canvas id="minModel"'+
            '	style="margin-top:3%; margin-left:0.5%; width:99% ;height:90%;  background-color:black;">'+
            '</canvas>'+
            '</div>'+
            '</div>'+
            '<div class="mdsjlx_txt" id="md_txt">'+
            '<div class="model_group">'+
            '<ul style="width: 100%;height: 30px; text-align: center;">'+
            '<li class="model_ul_li" style="width: 100px;">'+
            '<span id="msz_txt">'+$st(js_2,158)+'：</span></li>'+
            '<li class="model_ul_li" style="width: 130px;">'+
            '<select id="model_s_g" style="width: 100px;height: 25px;" class="select_black" onchange="switch_model_group(this)">'+

            '</select>'+
            '</li>'+
            '<li class="model_ul_li" style="width: 150px;">'+
            '<span>'+
            '<input type="button" class="but_but" onclick="get_model_group(model_s_g)" id="kx_op" value="'+$st(js_2,159)+'"/>'+
            '</span>'+
            '<span>'+
            '<input type="button" class="but_but" onclick="stop_model_group()" id="kx_st" value="'+$st(js_2,160)+'"/>'+
            '</span>'+
            '</li>'+
            '</ul>'+
            '</div>'+
            '<div class="mdlx_vlue_top " >'+
            '<span class="md_xuhao" id="md_xh">'+$st(js_2,116)+'</span>'+
            '<span class="md_caoz" id="md_mc">'+$st(js_2,117)+'</span>'+
            '<span class="md_sjjg" id="md_sj" >'+$st(js_2,129)+'(s)</span>'+
            '<span class="md_konzhi" id="md_cz">'+$st(js_2,130)+'</span>'+
            '</div>'+
            '<ul class="mdlx_value_txt" id="md_ul_val">'+

            '</ul>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>';
        $("body").append(back_div);
        $("body").append(md_div);
    } catch (e) {
        setError("show_mdlx_div",e);
    }
}


/********************************************
 * 显示模式轮训管理窗口
 */
function show_mdlx(){
    try {
//		$("#mdlx_div").show();
//		$("#faqbg").show();
//		load_mdlx();
//		var meList=[{"method":function(){get_model_type();}},//获取模式轮巡类型
//		            {"method":function(){getJSONForServer("modelGroupList");}},//获取模式轮巡组
//					]; 
//		send_orderMethods(meList);//操作命令组
//		

        skip_show_mode(1);
    } catch (e) {
        setError("show_mdlx",e);
    }
}
/******************************************************
 * 选择显示窗口
 * @param paramType
 */
function skip_show_mode(paramType){
    try {
        $("."+TYPE_CLASSNAME).hide();
        var val=0;//获取当前的类型
        if(paramType!=null){
            val=paramType;
        }else{
            val=sessionStorage.getItem("modelLxType");
        }
        $("#"+TYPE_DIV_LIST[val]).show();
        $(".mslx_type").val(val);
        if(val==0){
            load_mdlx();//调用显示定时切换轮巡
        }else if(val==1){
            load_mdsjlx();
        }
    } catch (e) {
        setError("skip_show_mode",e);
    }
}




/*******************************************
 * 隐藏模式轮训管理窗口
 */
function hide_mdlx(){
//	$(".scrnEntity").show();
//	$("#mdlx_div").hide();
//	$("#faqbg").hide();
    $(".lk_faqbg").remove();
    $("#mdlx_div").remove();

}


/***************************************
 * 保存当前设置的模式轮巡数据
 */
function save_mdlx(){
    try {
        var list=new Array();
        $(".mdszet_ll").each(function(){
            $(this).css("background","none");
            var id=this.id.substr(6);
            var obj=new Object();
            obj.id=parseInt(id);
            var mv=$("#md_mode_"+id).val();
            obj.mi=(mv!=null&&mv!="")?parseInt(mv):0;
            obj.da=$("#md_day_"+id).val();
            obj.ho=$("#md_hour_"+id).val();
            obj.we=parseInt($("#md_week_"+id).val());
            if($("#qidon_se_"+id).prop("checked")==true){
                obj.qd=0;
            }else{
                obj.qd=1;
            }
            list.push(obj);
        });
        if(list!=null){
            //showMes("length:"+list.length+" list:"+JSON.stringify(list));
            for(var i=0; i<list.length;i++){
                if(list[i].da==""&&list[i].ho=="00:00"&&list[i].we==""){
                    showErrorLi([list[i].id]);
                    upAlert(showJSTxt(js_1,11));
                    return false;
                }else if(list[i].mi==0){
                    showErrorLi([list[i].id]);
                    upAlert(showJSTxt(js_1,12));
                    return false;
                }
                for(var j=0;j<list.length;j++){
                    if(list[i].id!=list[j].id&&list[i].da==list[j].da&&list[i].ho==list[j].ho&&list[i].da!=""){
                        showErrorLi([list[i].id,list[j].id]);
                        upAlert(showJSTxt(js_1,13));
                        return false;
                    }else if(list[i].id!=list[j].id&&list[i].ho==list[j].ho&&list[i].we==list[j].we){
                        showErrorLi([list[i].id,list[j].id]);
                        upAlert(showJSTxt(js_1,14));
                        return false;
                    }
                }
            }
            saveList("mdlxList",list);
            localStorage.setItem("mdlxType",1);
            var mStr=(list!=null)?getExt(1,"mdlxList",list):"";
            LK_CAN_OBJ.onExt(1,13,mStr);//调用回调接口
//			if(upConfirms(showJSTxt(js_1,15))){
//				 sendJSONForServer("mdlxList",list);
//			}
            //upAlert(showJSTxt(js_1,15));

        }

    } catch (e) {

        setError("save_mdlx",e);
    }
}



/****************************************
 * 根据id,序号，模式ID，日期，时分，周期显示数据,状态
 * @param id
 * @param num
 * @param modelId
 * @param day
 * @param hour
 * @param week
 * @param qidon
 */
function add_mdll(id,num,modelId,day,hour,week,qidon){
    try {
        var weekList=[{"id":7,"val":showJSTxt(js_1,1.5)},{"id":1,"val":showJSTxt(js_1,2)},
            {"id":2,"val":showJSTxt(js_1,3)},{"id":3,"val":showJSTxt(js_1,4)},
            {"id":4,"val":showJSTxt(js_1,5)},{"id":5,"val":showJSTxt(js_1,6)},
            {"id":6,"val":showJSTxt(js_1,7)},{"id":0,"val":showJSTxt(js_1,8)}];
        var modelList=returnList("modeList");//获取本地模式列表
        if(modelList!=null){
            $(".un_find").remove();//清理空值提示
            var num_str="";//序号
            var name_str="";//模式名称
            var day_str="";//日期
            var hour_str="";//时分
            var week_str="";//星期
            var del_str="";//删除按钮
            var qd_str="";//是否启动
            num_str="<span class='mdxh' id='md_num_"+id+"'>"+num+"</span>";
            name_str="<span class='mdmc' ><select class='model_se '"+
                " id='md_mode_"+id+"' ></select></span>";
            day_str="<span class='mdrq' ><input type='text' style='width: 100px;"
                +"height: 20px;'  value='"+day+"' class='Wdate sdate'  id='md_day_"+id+"' onFocus='set_day(this)'/></span>";
            hour_str="<span class='mdsj' ><input type='text' style='width: 100px;height: 20px;' value='"+hour+"'"+
                "class='Wdate sdate' id='md_hour_"+id+"'onFocus='set_hour(this)'/></span>";
            week_str="<span class='mdxqj' ><select class='week_se ' id='md_week_"+id+"' ></select></span>";
            del_str="<span class='mdcz' id='mdcz_txt'><input type='button' value='"+$st(js_2,161)+"' onclick='del_mdlx(this)' id='md_delete_"+id+"'"+
                "style='width: 66px; height: 24px;' class='but_but demdlx'/></span>";
            qd_str="<span class='mdqd'><input type='checkbox' class='qidon_se ' id='qidon_se_"+id+"'> </span>";
            $(".mdszet_ul").append("<li class='mdszet_ll' id='md_li_"+id+"'>"+num_str+day_str+week_str+hour_str+name_str+qd_str+del_str+"</li>");
            for(var i=0;i<weekList.length;i++){//导入所有星期参数
                $("#md_week_"+id).append("<option value='"+weekList[i].id+"'>"+weekList[i].val+"</option>");
            }
            if(week!=""){
                $("#md_week_"+id+" option[value='"+week+"']").attr("selected",true);
            }else{
                $("#md_week_"+id+" option[value=7]").attr("selected",true);
            }
            $("#md_mode_"+id).append("<option value='0'>"+showJSTxt(js_1,1)+"</option>");//导入模式列表

            for(var i=0;i<modelList.length;i++){
                $("#md_mode_"+id).append("<option value='"+modelList[i].id+"'>"+modelList[i].name+"</option>");
                $("#md_mode_"+id+" option[value='"+modelId+"']").attr("selected",true);
            }
            if(day!=""&&day!=null){
                $("#md_week_"+id).attr("disabled","disabled");//星期几选项禁止操作
            }
            if(qidon==0){//启动或者停止轮巡
                $("#qidon_se_"+id).prop("checked",true);
            }else{
                $("#qidon_se_"+id).prop("checked",false);
            }
        }else{
            $(".mdszet_ul").append("<li class='un_find' style='width:100%;heigth:24px;"+
                "line-heighth;24px;text-align:center;color:red;'>"+showJSTxt(js_1,9)+"</li>");
        }

    } catch (e) {
        // TODO: handle exception
        setError("add_mdll",e);
    }

}




/************************************************
 * 根据参数显示模式轮训内容
 * @param paramList
 */
function load_mdlx(paramList){
    try {
        var mdlxList=returnList("mdlxList");//获取本地模式轮训设置文件
        if(paramList!=null){//获取本地模式轮训设置数组参数
            mdlxList=paramList;
        }
        $(".mdszet_ul li").remove();
        var modelList=returnList("modeList");//获取本地模式列表
//		showMes("mdlxList:"+mdlxList);
        if(mdlxList!=null&&modelList!=null){
            var number=0;
            for(var i=0;i<mdlxList.length;i++){//时间排序
                for(var j=0;j<mdlxList.length;j++){
                    var bool=true;
                    if(mdlxList[i].id!=mdlxList[j].id){
                        if(mdlxList[i].da!=mdlxList[j].da&&check_ll(mdlxList[i].da,mdlxList[j].da)){
                            bool=false;
                        }else if(mdlxList[i].da==""&&mdlxList[j].da==""&&mdlxList[i].we<mdlxList[j].we){
                            bool=false;
                        }else if(mdlxList[i].da==mdlxList[j].da&&mdlxList[i].we==mdlxList[j].we
                            &&validTime(mdlxList[i].ho,mdlxList[j].ho)){
                            bool=false;
                        }
                    }
                    if(bool==false){
                        var obj=mdlxList[i];
                        mdlxList[i]=mdlxList[j];
                        mdlxList[j]=obj;
                    }
                }
            }
            for(var i=0;i<mdlxList.length;i++){
                var reBool=true;
                for(var j=0;j<modelList.length;j++){//判断当前轮巡的模式是否存在
                    if(modelList[j].id==mdlxList[i].mi){
                        reBool=false;
                    }
                }
                if(reBool==false){
                    number++;
                    //	showMes("obj:"+JSON.stringify(mdlxList[i]));
                    add_mdll(mdlxList[i].id,number,mdlxList[i].mi,mdlxList[i].da,mdlxList[i].ho,mdlxList[i].we,mdlxList[i].qd);
                }
            }
        }else{
            $(".mdszet_ul").append("<li class='un_find' style='width:100%;heigth:24px;"+
                "line-heighth;24px;text-align:center;color:red;'>"+showJSTxt(js_1,10)+"</li>");
        }
    } catch (e) {
        // TODO: handle exception
        setError("load_mdlx",e);
    }
}

/*************************************
 * 添加模式轮巡关系
 */
function add_mdlx(){
    try {
        var id=0;
        var num=0;
        var list=new Array();
        $(".mdszet_ll").each(function(){//循环当前显示的轮巡文件
            var id=this.id.substr(6);
            var num=$("#md_num_"+id).html();
            var obj={"id":id,"num":num};
            list.push(obj);
        });
        id=getId(list);//获取ID;
        num=getId(list,"num");//获取序号
        add_mdll(id,num,0,"","00:00",7,0);
    } catch (e) {
        // TODO: handle exception
        setError("add_mdlx",e);
    }
}

/*******************************
 * 删除当前选择的轮巡通道
 * @param obj
 */
function del_mdlx(obj){
    try {
        var id=obj.id;
        var num=id.substr(10);
        $("#md_li_"+num).remove();
    } catch (e) {
        // TODO: handle exception
        setError("del_mdlx",e);
    }
}




/*******************************
 * 切换模式轮巡类型
 */
function switch_model_type(obj){
    try{

        var thisClass=$(obj).attr("class").split(" ")[1];
        $("."+TYPE_CLASSNAME).hide();
        var val=$(obj).val();//获取当前的类型
        $("#"+TYPE_DIV_LIST[val]).show();
        $("."+thisClass).val(val);
        if(val==0){
            load_mdlx();//调用显示定时切换轮巡
        }else if(val==1){
            load_mdsjlx();
        }
//		sessionStorage.setItem("modelLxType",val);//保存模式组轮巡类型
//		set_model_type(val);
    }catch(e){
        setError("switch_model_type",e);
    }
}
/*******************************************
 * @time 2016-9-23
 * 设置设备模式轮巡
 */
function but_model_type(){
    try {
        var val=$(".mslx_type").val();
        sessionStorage.setItem("modelLxType",val);//保存模式组轮巡类型
        set_model_type(val);
    } catch (e) {
        setError("but_model_type",e);
    }
}

/******************************************
 * 显示模式轮巡操作界面
 */
function load_mdsjlx(){
    try {
        load_model_div();//加载页面
        var modelList=returnList("modeList");
        modelList=(modelList!=null)?modelList:new Array();
//		showMes("modelList:"+modelList.length+" model:"+JSON.stringify(modelList),"red");

        $("#"+SHOW_MODEL_ID+" option").remove();
        for(var i=0;i<modelList.length;i++){//
            $("#"+SHOW_MODEL_ID).append("<option value='"+modelList[i].id+"'>"+modelList[i].name+"</option>");
        }
        var index=0;//默认显示第一个模式
        if(modelList.length>0){
//			showMes("aaaa");
            showMinCase(CANVAL_ID,modelList[index].outputList,modelList[index].width,modelList[index].height);
        }
        $("#"+MODEL_SL_ID+" option").remove();
        var color="white";
        for(var i=0;i<MAX_GROUP;i++){//加载模式组
            $("#"+MODEL_SL_ID).append("<option value='"+(i+1)+"' style='color:"+color+";'>"+(i+1)+"</option>");
        }
        show_model_group(null,1);
    } catch (e) {//
        setError("load_mdsjlx",e);
    }
}



/*******************************************
 * 加载窗口布局
 */
function load_model_div(){
    try {
        if($("#mdz_lx").css("display")=="block"){//窗口显示的情况下
            var mdsz_div=document.getElementById("mdz_lx");//模式轮巡组显示窗口
            var mdsz_div_w=mdsz_div.clientWidth;//高
            var md_can=document.getElementById("md_can");//模式显示窗口
            var md_can_h=md_can.clientHeight;//宽
            var md_can_w=md_can.clientWidth;//宽
            var val_w=mdsz_div_w-md_can_w-5;
            $("#md_txt").css("height",(md_can_h)+"px");
            $("#md_txt").css("width",(val_w)+"px");
        }

    } catch (e) {
        setError("load_model_div",e);
    }
}





/******************************
 * 显示录像回放操作
 */
function show_video_replay(){
    try {
        var divStr='<div class="lk_div lk_lxhf_div" id="lxhf_div" onselectstart="return false;">'+
            '<div class="dise" id="lxhf_title" onselectstart="return false;" >'+
            '<span class="wenzi1">&nbsp;&nbsp;</span><span class="wenzi1" id="lxhf_txt">'+$st(js_2,163)+'</span>'+
            '<span><img class="win_close_img" onclick="" src="'+CL2_IMG+'" width="47" height="20">'+
            '</span>'+
            '<span><img class="win_max_img" onclick="" src="'+MAX_IMG+'" width="28" height="20">'+
            '</span>'+
            '<span><img class="win_min_img" onclick="" src="'+MIN_IMG+'" width="29" height="20">'+
            '</span>'+
            '</div>'+
            '<div class="lxrq_div" id="lxrq_div" >'+
            '<div class="lxgl_div" id="lxgl_div" onselectstart="return false;">'+
            '<div class="lxss_div">'+
            '<ul class="lxul_ss">'+
            '<li >'+
            '<span id="lxip_txt">'+$st(js_2,164)+'</span>'+
            '<select id="lx_ip" class="select_black" onchange="playback_change_nvr(this)"></select>'+
            '</li>'+
            '<li >'+
            '<span id="lxtd_txt">'+$st(js_2,165)+'</span>'+
            '<select id="lx_td" class="select_black" onchange="playback_show_allVideo()" ></select>'+
            '</li>'+
            '<li >'+
            '<span id="lxss_txt">'+$st(js_2,166)+'</span>'+
            '<select id="lx_ss" class="select_black" onchange="playback_change_type(this)"></select>'+
            '</li>'+

            '</ul>'+
            '<ul class="lxul_ss">'+
            '<li >'+
            '<span id="lxlx_txt">'+$st(js_2,167)+'</span>'+
            '<select id="lx_lx" class="select_black" onchange="playback_show_allVideo()" >'+
            '</select>'+
            '</li>'+
            '<li>'+
            '<span id="lxsb_txt">'+$st(js_2,168)+'</span>'+
            '<input type="text" id="sech_begin" style="height: 20px;" class="Wdate sdate" onfocus="set_day_time(this)"/>'+
            '</li>'+
            '<li>'+
            '<span id="lxse_txt">'+$st(js_2,169)+'</span>'+
            '<input type="text" id="sech_end" style="height: 20px;" class="Wdate sdate" onfocus="set_day_time(this)" />'+
            '</li>'+
            '<li id="lx_seach_li">'+
            '<span><input type="button" id="lx_seach" onclick="playback_seach_order()" class="but_but" value="'+$st(js_2,170)+'"/></span>'+
            '</li>'+
            '</ul>	'+

            '</div>'+

            '<div class="lxnr_div" id="lxnr_div">'+
            '<ul class="lxnr_ul_top">'+
            '<li>'+
            '<span class="lxnr_xh" id="lxnr_xh_txt">'+$st(js_2,172)+'</span>'+
            '<span class="lxnr_wj" id="lxnr_wj_txt">'+$st(js_2,173)+'</span>'+
            '<span class="lxnr_sj" id="lxnr_sj_txt">'+$st(js_2,174)+'</span>'+
            '</li>'+
            '</ul>'+
            '<ul class="lxnr_ul_val" id="lxnr_ul_val">	'+
            '</ul>'+
            '</div>'+
            '<div class="lxtl_div">'+
            '<div class="lxtl_sc">'+
            '<span class="lxtl_sc_span" id="lxtl_sc_txt">'+$st(js_2,175)+'</span>'+
            '<select class="lxtl_sc_select select_black " id="lxtl_win">'+

            '</select>'+

            '</div>'+
            '<div class="lxtl_sc">'+
            '<span class="lxtl_sc_span" id="lxtl_sj_txt">'+$st(js_2,176)+'</span>'+
            '<select class="lxtl_sc_select select_black " id="lxtl_sj" onchange="select_date(this)">'+
            '</select>'+
            '</div>'+
            '<div class="lxtl_bt">'+
            '<span class="lxtl_sc_span" id="lxtl_tm_txt">'+$st(js_2,177)+'</span>'+
            '<input type="text" style="width: 100px; height: 18px;" onfocus="set_hour_time(this)"'+
            ' class="lxtl_sc_select Wdate sdate" id="lxtl_tm"/>'+
            '<input type="text" style="display: none;" id="name_id" />'+
            '<span><input id="ds_play" onclick="time_play()"  class="but_but" type="button" value="'+$st(js_2,178)+'"/></span>'+
            '</div>'+
            '</div>'+
            '<div class="lxnr_canvas">'+
            '<div class="lxnr_n_div">'+
            '<ul  id="lxnr_num">'+
            '<li ></li>'+
            '</ul>'+
            '</div>'+
            '<div class="lxnr_c_div">'+
            '<canvas class="video_canvas" title="" id="video_reback" '+
            ' ondblclick="click_canvas(this,2)" onclick="click_canvas(this,1)">'+

            '</canvas>'+
            '</div>'+
            '<div class="lxnr_t_div">'+
            '<span id="lxnr_mes" ></span>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';

        var decoderList=returnList("decoderList");
        if(decoderList==null){
            upAlert($st(indexJSList,86));
            return;
        }
        $("body").append(divStr);
        /***************************************************************************
         * 鼠标移动到图片上面的时候
         **************************************************************************/
        $("span img").mouseover(function() {
            var className = $(this).attr("class");
            if (className != null) {
                switch (className) {
                    case "win_close_img":
                        $(this).attr("src", CL2D_IMG);
                        break;
                    case "win_max_img":
                        $(this).attr("src", MAXD_IMG);
                        break;
                    case "win_min_img":
                        $(this).attr("src", MIND_IMG);
                        break;
                    default:
                        break;
                }
            }
        });
        /***************************************************************************
         * 鼠标离开图片按钮区域的时候
         **************************************************************************/
        $("span img").mouseout(function() {
            var className = $(this).attr("class");
            if (className != null) {
                switch (className) {
                    case "win_close_img":
                        $(this).attr("src", CL2_IMG);
                        break;
                    case "win_max_img":
                        $(this).attr("src", MAX_IMG);
                        break;
                    case "win_min_img":
                        $(this).attr("src", MIN_IMG);
                        break;
                    default:
                        break;
                }
            }
        });
        /***************************************************************************
         * 鼠标点击图片按钮区域的时候
         **************************************************************************/
        $("span img").click(function() {
            var className = $(this).attr("class");
            if (className != null) {
                switch (className) {
                    case "win_close_img":
                        $("#lxhf_div").remove();
                        break;
                    case "win_max_img":
                        $("#lxrq_div").show();
                        $("#lxhf_div").css("left", "20%");
                        $("#lxhf_div").css("top", "20%");
                        $("#lxhf_div").css("min-width", "270px");
                        $("#lxhf_div").css("min-height", "440px");
                        $("#lxhf_div").css("width", "60%");
                        $("#lxhf_div").css("height", "55%");
                        $("#lxhf_title").css("width", "100%");
                        playback_show_nvr();// 调用显示NVR/DVR
                        break;
                    case "win_min_img":
                        if ($("#lxgl_div").css("display") == "block") {
                            $("#lxrq_div").hide();
                            var min_width = 270;
                            var min_height = 26;
                            $("#lxhf_div").css("min-width", min_width + "px");
                            $("#lxhf_div").css("min-height", min_height + "px");
                            $("#lxhf_div").css("width", min_width + "px");
                            $("#lxhf_div").css("height", min_height + "px");
                            $("#lxhf_title").css("width", min_width + "px");
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        /***************************************************************************
         * 录像回放管理鼠标按下事件
         **************************************************************************/
        $("#lxhf_title").mousedown(function() {
            try {
                var thisXY = getCanXY("lxhf_title");
                if (thisXY.x < 700) {// 判断点击拖动的位置是否在控制按钮之外
                    lx_down = new Object();
                    var hideX = document.body.scrollLeft;// 获取隐藏的宽度
                    var hideY = document.body.scrollTop;// 获取隐藏的高度
                    lx_down.x = (event.x + hideX);// 鼠标相对页面开始的X坐标
                    lx_down.y = (event.y + hideY);// 鼠标相对页面开始的Y坐标
                    lx_div = new Object();
                    lx_div.x = parseInt($("#lxhf_div").css("left").split("px")[0]);
                    lx_div.y = parseInt($("#lxhf_div").css("top").split("px")[0]);
                    // showMes("lx_down:"+JSON.stringify(thisXY));
                }
            } catch (e) {
                setEror("lxhf_title_down", e);
            }
        });
        var updiv_type = 0;// 修改类型
        var down_x = 0;
        var down_left = 0;
        var down_width = 0;
        $("body").mousedown(function() {
            if ($("#lxhf_div").css("display") == "block"&& $("#lxrq_div").css("display") == "block") {
                updiv_type = checkXW();// 调用验证当前所在位置
                var hideX = document.body.scrollLeft;// 获取隐藏的宽度
                var left = parseInt($("#lxhf_div").css("left").split(".")[0]);
                down_x = (event.x + hideX);// 鼠标相对页面开始的X坐标
                down_left = left + hideX;
                down_width = parseInt($("#lxhf_div").css("width").split(".")[0]);
                // showMes("updiv_type:"+updiv_type,"red");				
            }
        });
        /***************************************************************************
         * 录像回放管理鼠标移动事件
         **************************************************************************/
        $("body").mousemove(function() {
            try {
                var hideX = document.body.scrollLeft;// 获取隐藏的宽度
                var hideY = document.body.scrollTop;// 获取隐藏的高度
                var mouseX = (event.x + hideX);// 鼠标相对页面开始的X坐标
                var mouseY = (event.y + hideY);// 鼠标相对页面开始的Y坐标
                if (lx_down != null && lx_div != null) {// 移动录像回放窗口
                    $("#lx_seach").focus();// 把光标移到别的地方
                    var bodyW = parseInt($("body").css("width")
                        .split("px")[0]);// 页面总宽度
                    var bodyH = parseInt($("body").css("height")
                        .split("px")[0]);// 页面总高度
                    var divW = parseInt($("#lxhf_div").css("width")
                        .split("px")[0]);// 对话框总宽度
                    var divH = parseInt($("#lxhf_div")
                        .css("height").split("px")[0]);// 对话框总高度
                    var move_x = mouseX - lx_down.x;// 鼠标移动X轴的像素点
                    var move_y = mouseY - lx_down.y;// 鼠标移动Y轴的像素点
                    var left_x = (lx_div.x + move_x);
                    var top_y = (lx_div.y + move_y);
                    if (0 < left_x
                        && (left_x + divW) < (bodyW - 10)) {
                        $("#lxhf_div").css("left", left_x + "px");
                    }
                    if (0 < top_y && (top_y + divH) < (bodyH - 10)) {

                        $("#lxhf_div").css("top", top_y + "px");
                    }
                    // showMes(" left_x:"+left_x+" bodyW:"+bodyW);

                }
                // showMes("display:"+$("#lxhf_div").css("display"));
                if ($("#lxhf_div").css("display") == "block"
                    && $("#lxrq_div").css("display") == "block") {
                    // showMes("display:"+$("#lxhf_div").css("display"));
                    // showMes("updiv_type:"+updiv_type,"red");
                    if (updiv_type != 0) {// 开始移动
                        var divW = parseInt($("#lxhf_div").css(
                            "width").split("px")[0]);// 对话框总宽度
                        var y_x = mouseX - down_x;// 鼠标移动的值
                        var y_left = down_left + y_x;
                        var y_width = down_width - y_x;
                        if (updiv_type == 1) {// 修改左边
                            if (y_x >= (down_width - 270)) {
                                y_left = down_left
                                    + (down_width - 270);
                                y_width = 270;
                            }
                            // showMes("y_x:"+y_x+"
                            // down_left:"+down_left+"
                            // down_width:"+down_width+"
                            // divW:"+divW+" y_left:"+y_left+"
                            // y_width:"+y_width+"
                            // width:"+(down_width-230));
                            $("#lxhf_div").css("left",
                                y_left + "px");//修改窗口总长度
                            $("#lxhf_div").css("width",
                                y_width + "px");//修改窗口总长度
                        } else if (updiv_type == 2) {//修改右边
                            $("#lxhf_div").css("width",
                                (down_width + y_x) + "px");//修改窗口总长度
                        }
                        // 
                    } else {
                        checkXW();//调用验证当前所在位置
                    }
                }
            } catch (e) {
                setError("lxhf_title_move", e);
            }
        });
        /**************************************************
         *录像回放管理鼠标松开事件
         ****************************************************/
        $("body").mouseup(function() {
            try {
                lx_down = null;//清理缓存
                lx_div = null;//清理缓存
                updiv_type = 0;//清理修改窗口大小的缓存
            } catch (e) {
                setError("lxhf_title_up", e);
            }
        });
        playback_show_nvr();
    } catch (e) {
        // TODO: handle exception
        setError("show_video_replay",e);
    }
}
/*************************************************
 * 播放录像视频
 * @param pType
 * @param pSpeed
 * @param pWinId
 */
function videoPlayConfig(pType,pSpeed,pWinId){
    try {
        if(out==null){
            out=returnList("ouputXml");
        }
        if(out==null||out.length==0){
            upAlert($st(indexJSList,106));
            return;
        }
        var pTypeCode=0x00;
        var speed=pSpeed;
        var list = returnList("playList");
        var out = xmlEntities;
        var type = 0x00;// 发送的命令类型
        var pn = 0x00;// 发送播放的速度
        var winId = 0;// 窗口的ID号
        var wins=null;//窗口数组
        var name = "";// 发送的文件
        var inputId = 0;// 输入源ID号
        var gn = 0;// 通道号
        var pt = 0;// 类型
        /***********************************
         * 内置方法
         * @param typeCode
         * @param speed
         * @param winId
         */
        function playConfig(typeCode,speed,winId){
            play_video(typeCode, speed, winId);// 发送播放命令
        }
        /****************************************
         * 内置方法
         * @param pType
         * @param winId
         */
        function nextPlayConfig(pType,winId){
//			showMes("list:"+JSON.stringify(list));
            if (list == null) {
                upAlert(showJSTxt(js_1,29));
                return ;
            } else {
                var bool = true;
                for ( var i = 0; i < list.length; i++) {
                    if (list[i].id == 1) {
                        bool = false;
                    }
                }
                if (bool) {
                    upAlert(showJSTxt(js_1,29));
                    return;
                }
            }
            for ( var i = 0; i < list.length; i++) {
                if (list[i].wi == winId) {
                    list[i].pn = 1;
                    list[i].id = 1;
                    pt = list[i].pt;
                    name = list[i].nm;
                    inputId = list[i].ii;
                    gn = list[i].gn;
                } else {
                    list[i].id = 0;
                }
            }
            //	saveList("playList", list);
//			showMes("当前pType:"+pType+"  winId:"+winId+"  inputId:"+inputId+" gn:"+gn+"  name:"+name);
            next_video(pType, winId, inputId, gn, name);// 发送上一个文件
        }
        switch (pType) {
            case 1://正堂播放
                pTypeCode=0x01;
                playConfig(pTypeCode,speed,pWinId);
                break;
            case 2://倒播
                pTypeCode=0x02;
                playConfig(pTypeCode,speed,pWinId);
                break;
            case 3://暂停播放
                pTypeCode=0x03;
                speed=0;
                playConfig(pTypeCode,speed,pWinId);
                break;
            case 4://停止播放
                pTypeCode=0x04;
                speed=0;
                playConfig(pTypeCode,speed,pWinId);
                break;
            case 5:// 发送上一个文件
                nextPlayConfig(1,pWinId);
                break;
            case 6:// 发送下一个文件
                nextPlayConfig(2, pWinId);
                break;
            default:

                return "Error:Param is Error.";
        }
        return "Success";

    } catch (e) {
        setError("videoPlayConfig",e);
    }
}




/************************************************
 * 选择模式
 * @param obj
 */
function switch_model(obj,type){
    try {
        var modelId=0;
        switch (type) {//选择操作类型
            case 1:
                modelId=$(obj).val();
                break;
            case 2:
                modelId=$(obj).val();
                break;
            default:
                break;
        }
        var modelList=returnList("modeList");
        modelList=(modelList!=null)?modelList:new Array();
        for(var i=0;i<modelList.length;i++){//
            if(modelId==modelList[i].id){
                showMinCase(CANVAL_ID,modelList[i].outputList,modelList[i].width,modelList[i].height);//显示当前选择的模式窗口进行显示
            }
        }
    } catch (e) {
        setError("switch_model", e);
    }
}

/*******************************************************
 * 根据画布的ID，把窗口文件画到画布上
 * @param canvasId
 * @param outputList
 */
function showMinCase(canvasId,outputList,canWidth,canHeight){
    try {
//		showMes("aaaa canWidth:"+canWidth+"  canHeight:"+canHeight+"   list:"+JSON.stringify(outputList),"red");
        var ouputList=outputList;

        ouputList=mappingXY(ouputList,canWidth,canHeight,canvasId,1);//转换窗口数据
//		showMes("list:"+JSON.stringify(ouputList));
        var beginX = 0;// 开始坐标X
        var beginY = 0;// 开始坐标Y
        var can = document.getElementById(canvasId);//获取窗口
        var scrnWidth = can.clientWidth;
        var scrnHeight = can.clientHeight;
        var cxt = can.getContext("2d");
        var ctx = can.getContext("2d");
        if (ouputList != null) {
            cxt.clearRect(beginX, beginY, scrnWidth, scrnHeight);
            if(ouputList[0].mt!=null&&ouputList[0].mt==1){
                cxt.beginPath();
                cxt.lineWidth = 1;
                cxt.strokeStyle = "white";
                cxt.fillStyle = "black";
                cxt.rect(beginX, beginY, scrnWidth, scrnHeight);
                cxt.fill();
                cxt.stroke();
            }
            for(var i=0;i<ouputList.length;i++){//排序作用：把漫游放到最后显示出来
                for(var j=0;j<ouputList.length;j++){
                    if(ouputList[i].sc<ouputList[j].sc){
                        var a=ouputList[i];
                        ouputList[i]=ouputList[j];
                        ouputList[j]=a;
                    }
                }
            }
            for ( var i = 0; i < ouputList.length; i++) {
                if(ouputList[i].id==9999){
                    continue;
                }
                if(ouputList[0].mt!=null&&ouputList[0].mt==1){
                    x1 =ouputList[i].mx1;
                    y1 =ouputList[i].my1;
                    width = ouputList[i].mx2 - x1;
                    height =ouputList[i].my2 - y1;
                }else{
                    x1 = parseFloat(ouputList[i].x1);
                    y1 = parseFloat(ouputList[i].y1);
                    width = parseFloat(ouputList[i].x2) - x1;
                    height = parseFloat(ouputList[i].y2) - y1;
                }
                lineWidth = parseFloat(ouputList[i].lineWidth);
                lineColor = ouputList[i].strokeColor;
                fillColor = ouputList[i].fillColor;
                cxt.beginPath();
                cxt.lineWidth = 1;
                cxt.strokeStyle = "white";
                cxt.rect(x1, y1, width, height);
                var img=document.getElementById("bcg");//获取图片
                cxt.drawImage(img,x1, y1, width, height);//话背景图片
                cxt.stroke();
                if(width>15&&height>10){
                    var id = 0;
                    if(ouputList[i].num==null){
                        id=ouputList[i].id;
                    }else{
                        id=ouputList[i].num;
                    }
                    var fondX = x1 + 5;
                    var fondY = y1 + 10;
                    //showMes(id+" "+fondX+" "+(fondY));
                    ctx.font = "10px 宋体";
                    ctx.strokeText(id, fondX, fondY);
                }
            }
        } else {
            return false;
        }
    } catch (e) {
        setError("showMinCase",e);
    }
}
/***************************************************
 * 选择模式组
 * @param obj
 */
function switch_model_group(obj){
    try {
        var val=$(obj).val();//获取轮巡组id
        //showMes("val:"+val);
        show_model_group(null,val);
    } catch (e) {
        setError("switch_model_group",e);
    }
}



/******************************************************
 * 保存模式轮巡
 */
function save_model_lx(){
    try {
        var modelList=returnList("modeList");
        modelList=(modelList!=null)?modelList:new Array();
        var mode_id=$("#"+SHOW_MODEL_ID).val();//模式ID号
        var time=$("#"+MODEL_TIME).val();//轮巡时间间隔
        var model_group=$("#"+MODEL_SL_ID).val();//模式组id;
        if(mode_id==0||mode_id==null||mode_id==""){//提示：请选择模式
            upAlert($st(js_2,91));
            return;
        }
        if(time==0||time==null||time==""){//提示：请选择模式加入到哪个模式组。
            upAlert($st(js_2,92));
            return;
        }
        if(model_group==0||model_group==null||model_group==""){//提示：请选择模式加入到哪个模式组。
            upAlert($st(js_2,93));
            return;
        }
        mode_id=(mode_id!=null&&mode_id!="")?parseInt(mode_id):1;
        time=(time!=null&&time!="")?parseInt(time):1;
        model_group=(model_group!=null&&model_group!="")?parseInt(model_group):1;
        var modelGroupList=returnList("modelGroupList");
        modelGroupList=(modelGroupList!=null)?modelGroupList:new Array();
        var obj=new Object();
        obj.id=getId(modelGroupList);
        obj.gi=model_group;
        obj.mi=mode_id;
        obj.tm=time;
        modelGroupList.push(obj);
        saveList("modelGroupList",modelGroupList);//保存添加数据
//		sendJSONForServer("modelGroupList",modelGroupList);
        var mlStr=getExt(1,"modelGroupList",modelGroupList);
        LK_CAN_OBJ.onExt(1,"19",mlStr);//调用回调接口
        show_model_group(modelGroupList,model_group);
    } catch (e) {
        setError("save_model_lx",e);
    }
}
/***************************************************************
 * 显示修改
 * @param obj
 */
function show_modify(obj){

    try {
        var id=obj.id.split("_")[2];//模式轮巡id号
        var thisTime=$("#tm_sp_"+id).html();//时间
        $("#tm_sp_"+id).hide();
        $("#tm_ip_"+id).show();
        $("#tm_ip_"+id).val(thisTime);
        $(obj).hide();
        $("#bt_sa_"+id).show();
    } catch (e) {
        setError("show_modify",e);
    }
}
/***********************************************************
 * 保存修改的时间
 * @param obj
 */
function save_modify(obj){
    try {

        var id=obj.id.split("_")[2];//模式轮巡id号
        var thisTime=$("#tm_ip_"+id).val();//时间
        if(thisTime==0||thisTime==null||thisTime==""){
            upAlert($st(js_2,92));
            return;
        }
        $("#tm_ip_"+id).hide();
        $("#tm_sp_"+id).show();
        $("#tm_sp_"+id).html(thisTime);
        $(obj).hide();
        $("#bt_up_"+id).show();
        var modelGroupList=returnList("modelGroupList");
        for(var i=0;i<modelGroupList.length;i++){
            if(modelGroupList[i].id==id){
                modelGroupList[i].tm=parseInt(thisTime);
            }
        }
        saveList("modelGroupList",modelGroupList);
        var mlStr=getExt(1,"modelGroupList",modelGroupList);
        LK_CAN_OBJ.onExt(1,"19",mlStr);//调用回调接口
        //sendJSONForServer("modelGroupList",modelGroupList);
    } catch (e) {
        setError("save_modify",e);
    }
}
/*******************************************************
 * 删除
 * @param obj
 */
function delete_model_lx(obj){
    try {
        var id=obj.id.split("_")[2];//模式轮巡id号
        var bool=true;
        var modelGroupList=returnList("modelGroupList");
        for(var i=0;i<modelGroupList.length;i++){
            if(modelGroupList[i].id==id){
                bool=false;
                modelGroupList.splice(i,1);
            }
        }
        if(bool){
            upAlert($st(js_2,94));
        }else{
            saveList("modelGroupList",modelGroupList);
//			sendJSONForServer("modelGroupList",modelGroupList);
            show_model_group();
            var mlStr=getExt(1,"modelGroupList",modelGroupList);
            LK_CAN_OBJ.onExt(1,"19",mlStr);//调用回调接口
        }
    } catch (e) {
        setError("delete_model_lx",e);
    }
}

/************************************************************
 * 显示模式组
 * @param paramList
 * @param paramGI
 */
function show_model_group(paramList,paramGI){
    try {
        var modelList=returnList("modeList");//模式数组
        var modelGroupList=returnList("modelGroupList");//模式轮巡组数组
        var modelGroupId=0;//模式轮巡组ID
        if(paramList!=null){
            modelGroupList=paramList;
        }
        if(paramGI!=null){
            modelGroupId=paramGI;
        }else{
            modelGroupId=$("#"+MODEL_SL_ID).val();
        }
        //showMes("id:" +modelGroupId+ " list:"+JSON.stringify(modelGroupList),"red");
        modelList=(modelList!=null)?modelList:new Array();
        modelGroupList=(modelGroupList!=null)?modelGroupList:new Array();
        var mi=0;
        var modelName="";//模式名称
        var modelTime=0;//模式轮巡Id
        var numStr="";
        var nameStr="";
        var timeStr="";
        var comStr="";
        var number=0;
        $("#"+SHOW_MODEL_LX_ID+" li").remove();
        for(var i=0;i<modelGroupList.length;i++){
            if(modelGroupList[i].gi==modelGroupId){
                mi=modelGroupList[i].id;
                modelTime=modelGroupList[i].tm;
                for(var j=0;j<modelList.length;j++){
                    if(modelGroupList[i].mi==modelList[j].id){
                        modelName=modelList[j].name;
                    }
                }
                number++;
                numStr="<span class='md_xuhao' >"+number+"</span>";
                nameStr="<span class='md_caoz' >"+modelName+"</span>";
                timeStr="<span id='tm_sp_"+mi+"' class='md_sjjg' >"+modelTime+"</span>"+
                    "<input id='tm_ip_"+mi+"' oninput='checkInputCode(this)'  class='md_sjjg input_case' style='width: 12% ;height: 25px; display: none;' type='text'/>";
                comStr="<div class='md_kjan'><span><input id='bt_up_"+mi+"' type='button' class='but_but' onclick='show_modify(this)' value='"+$st(js_2,36)+"'/></span>" +
                    "<span ><input type='button' id='bt_sa_"+mi+"' class='but_but' style='display:none;' onclick='save_modify(this)' value='"+$st(js_2,50)+"'/>\</span>" +
                    "<span ><input type='button' id='bt_dl_"+mi+"' class='but_but' onclick='delete_model_lx(this)' value='"+$st(indexJSList,56)+"'/>\</span>" +
                    "<span ><input type='button' id='bt_so_"+mi+"' class='but_but' onclick='modellx_click(this)' value='"+$st(js_2,95)+"'/></span></div>";
                var liStr="<li id='li_md_"+mi+"'>"+numStr+nameStr+timeStr+comStr+"</li>";
                $("#"+SHOW_MODEL_LX_ID).append(liStr);
            }
        }
    } catch (e) {
        setError("show_model_group",e);
    }
}

/******************************************
 * 设置模式类型
 * @param paramType
 */
function set_model_type(paramType){
    try {
        var loginCode= returnSlist("loginCode");
        if(loginCode==null){
            // upAlert("你尚未登录！");
            loginCode=[0x00,0x00,0x00,0x00];
//	 	    return;
        }
        var type=paramType;
        var binary = new  Uint8Array(9);
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x02,0x05);//
        binary[8]=parseInt(type);
        LK_CAN_OBJ.onExt(0,"02 05",binary);//调用回调接口
//	 	   if(checkMes()){
//		 		checkSend(binary);
////		 		showMes("binary:"+JSON.stringify(binary),"red");
//		 }else{
//		 		upAlert(showJSTxt(paramJSTxt,1));
//		 }
    } catch (e) {
        setError("get_model_type",e);
    }

}



/***********************************************
 * 获取模式类型
 */
//function get_model_type(){
//	try {
//		var loginCode= returnSlist("loginCode");
//	 	   if(loginCode==null){
//	 		  // upAlert("你尚未登录！");
//	 	    return;
//	 	   }
//	 	  var binary = new  Uint8Array(8);
//	 	  binary = setCode(binary, loginCode, 0x00, 0x00, 0x02,0x06);//
////	 	   if(checkMes()){
////		 		checkSend(binary);
////		 	//	showMes("binary:"+JSON.stringify(binary),"red");
////		 }else{
////		 		upAlert(showJSTxt(paramJSTxt,1));
////		 }
//	} catch (e) {
//		setError("get_model_type",e);
//	}
//}

/******************************************************
 * 获取轮巡模式组
 * @param but_id
 */
function get_model_group(but_id){
    try {
        showMes("but_id:"+but_id.id);
        var id=$("#"+but_id.id).val();
        if(id==0){
            upAlert($st(js_2,93));
            return;
        }
        id=parseInt(id);
        //showMes("id:"+id);
        send_model_group(id);//发送轮巡模式组
    } catch (e) {
        setError("get_model_group",e);
    }
}

/***************************************************
 *开启模式组轮巡
 * @param paramId
 */
function send_model_group(paramId){
    try {
        var loginCode= returnSlist("loginCode");
        if(loginCode==null){
            // upAlert("你尚未登录！");
            loginCode=[0x00,0x00,0x00,0x00];
        }
        var binary = new  Uint8Array(9);
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x02,0x07);//
        binary[8]=paramId;
        LK_CAN_OBJ.onExt(0,"02 07",binary);//调用回调接口
//	 	   if(checkMes()){
//		 		checkSend(binary);
//		 		//showMes("binary:"+JSON.stringify(binary),"red");
//		 }else{
//		 		upAlert(showJSTxt(paramJSTxt,1));
//		 }
    } catch (e) {
        setError("send_model_group",e);
    }
}


/***************************************************
 *停止模式组轮巡
 */
function stop_model_group(){
    try {
        var loginCode= returnSlist("loginCode");
        if(loginCode==null){
            // upAlert("你尚未登录！");
            loginCode=[0x00,0x00,0x00,0x00];
        }
        var binary = new  Uint8Array(8);
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x02,0x09);//
        LK_CAN_OBJ.onExt(0,"02 09",binary);//调用回调接口
//	 	   if(checkMes()){
//		 		checkSend(binary);
//		 		//showMes("binary:"+JSON.stringify(binary),"red");
//		 }else{
//		 		upAlert(showJSTxt(paramJSTxt,1));
//		 }
    } catch (e) {
        setError("send_model_group",e);
    }
}
/******************************************
 *模式组轮巡中切换模式
 * @param obj
 */
function modellx_click(obj){
    try {
        var id=obj.id.split("_")[2];
        var modelGroupList=returnList("modelGroupList");
        modelGroupList=(modelGroupList!=null)?modelGroupList:new Array();
        var mi=0;
        for(var i=0;i<modelGroupList.length;i++){
            if(modelGroupList[i].id==id){
                mi=modelGroupList[i].mi;
            }
        }
//		stop_model_group();
        var modeId="mode_min_div_"+mi;
        //	showMes("id:"+modeId);
        click_mode({"id":modeId});
    } catch (e) {
        setError("modellx_click",e);
    }
}

var check_mode=null;
/*************************************************
 * 调用模式
 * @param m
 */
function click_mode(m) {
    try {
//		showMes("时间："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  st:"+st,"green");	

        if(bcType==1){//判断当前是否在双击放大的状态
            clickTimeNum();
            return;
        }
        if(unUpdateWin()==false){//如果当前正在触发报警状态禁止操作配置文件
            return false;
        }
        if(returnList("db_list")!=null){
            upAlert(showJSTxt(indexJSList,93));
            return;
        }
        if(checkMes()){

        }else{
            upAlert(showJSTxt(indexJSList,14));
            return;

        }
//	if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//		//showMes("power:"+sessionStorage.getItem("manager"));
//			return false;
//	}
        if (upConfirms(showJSTxt(indexJSList,94))) {
            showMes("aa");
            check_mode=m;
            var mode_id=check_mode.id.split("_")[3];
            sendModelId(mode_id);
        }else{
//		canselTest();
        }
    } catch (e) {
        setError("click_mode",e);
    }
}

/**********************************
 * 发送切换模式
 * @param paramId
 */
function sendModelId(paramId){
    try {
        var loginCode= returnSlist("loginCode");
        if(loginCode==null){
            // upAlert("你尚未登录！");
            // $("#result").html("您尚未登录，请登录！");
            loginCode=[0x00,0x00,0x00,0x00];
        }else{

//	 	   		if(checkMes()){
//	 	   			checkSend(binary);
//	 	   		}else{
//	 	   			upAlert("提示：系统正在忙，请稍后...");
//	 	   		}
        }
        var binary = null;// 创建一个数组，必须固定长度
        binary = new Uint8Array(9);
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x01, 0x07);
        binary[8]=parseInt(paramId);
        LK_CAN_OBJ.onExt(0,"01 07",binary);//调用回调接口
    } catch (e) {
        setError("sendModelId",e);
    }
}


/*************************************
 * 转换为输出格式
 * @param rType
 * @param listName
 * @param list
 * @returns
 */
function getExt(rType,listName,list){
    try {

        if(rType==0){//转换二进制命令

        }else if(rType==1){//转换字符串命令
            var can="";
            var scrnWidth = "";
            var scrnHeight = "";
            if(listName=="ouputXml"){
                sessionStorage.removeItem("upNum");
                // showMes(localStorage.getItem("size"),"red");
                code.num=zh(1);
                var ht=sessionStorage.getItem("thisHtml");
                var bool=false;
                if(ht!=null&&ht=="index"){
                    can = document.getElementById(LK_CANVAS);
                    scrnHeight = can.clientHeight;// 画布总高度
                    scrnWidth = can.clientWidth;// 画布总宽度
                }else{
                    var maxX=0;
                    var maxY=0;
                    if(list==null||list.lengt==0){
                        scrnWidth=0;
                        scrnHeight=0;
                    }else if(list[0].mt==null){
                        for ( var i = 0; i < list.length; i++) {
                            list[i].active = 0;
                            if(list[i].x2>maxX){
                                maxX=list[i].x2;
                            }
                            if(list[i].y2>maxY){
                                maxY=list[i].y2;
                            }
                        }
                        scrnWidth=Math.round(maxX);
                        scrnHeight=Math.round(maxY);
                    }else if(list[0].mt==1){
                        scrnWidth=localStorage.getItem("canWidth");
                        scrnHeight=localStorage.getItem("canHeight");
                    }
                }
                if(list!=null){
                    if(list.length>0&&list[0].mt==1){
                        bool=true;
                    }
                }
                //showMes("...");
                //showMes("开始装换："+JSON.stringify(list),"red");
                list=replaceList("output",list);
                //	showMes("转换后：list:"+JSON.stringify(list),"blue");
                //	return;
                //showMes("size:"+localStorage.getItem("size"),"red");
                pStr=scrnWidth+"/"+scrnHeight+"/"+localStorage.getItem("size");
                if(bool){
                    pStr+="[";
                }
            }else if(listName=="deviceList"){
                code.num=zh(2);
                pStr="";
            }else if(listName=="decoderList"){
                code.num=zh(3);
                pStr="";
                list=replaceList("decoder",list);
                /****************************************************************************
                 *
                 */
            }else if(listName=="localList"){
                code.num=zh(4);
                pStr="";
            }else if(listName=="relationList"){
                code.num=zh(5);
                pStr="";
            }else if(listName=="groupList"){
                code.num=zh(6);
                pStr="";
            }else if(listName=="IFOlist"){
                code.num=zh(7);
//				if(sessionStorage.getItem("change_mode")==null){
//					localStorage.removeItem("new_ifo");//删除当前操作的缓存
//				}
                list=replaceList("ifo",list);
                pStr="";
            }else if(listName=="modeList"){
                code.num=zh(8);
                pStr="";
                list= replaceList("moder",list);
            }else if(listName=="caution"){
                code.num=zh(9);
                pStr="";
                list= replaceList("caution",list);
            }else if(listName=="mdlxList"){
                code.num=zh(13);
                pStr="";
            }else if(listName=="streamList"){
                code.num=zh(14);
                pStr="";
            }else if(listName=="transmit"){
                code.num=zh(15);
                pStr="";
            }else if(listName=="clientList"){
                code.num=zh(16);
                pStr="";
            }else if(listName=="clientGroup"){
                code.num=zh(17);
                pStr="";
            }else if(listName=="clientPlayList"){
                code.num=zh(18);
                pStr="";
            }else if(listName=="modelGroupList"){
                code.num=zh(19);
                pStr="";
            }
            else if(listName=="end"){
                code.num=zh(255);
                pStr="";
            }

            var listType=JSON.stringify(list);
            var fileSize=listType.length;
            var rStr=(pStr!="")?("@"+fileSize+"/"+pStr+listType):("@"+fileSize+"/"+listType);
//		 	showMes("转换数据："+rStr);
            return rStr;
        }


    } catch (e) {

        setError("getExt", e);
    }

}



/**************************************
 * 验证文件是否正确
 * @param pType
 * @param pData
 */
function checkFile(pType,pData){
    try {
        if(pData.indexOf("@")!=null){
            if(pData==""||pData==null){//空文件
                return 0;
            }
            var pVal=pData.substring(pData.indexOf("@")+1);
            var pCode="";//配置文件附带属性
            var pStr="";//配置文件内容
            if(pVal==""||pVal==null){//空文件
                return 0;
            }

            if(pVal.indexOf("/")==-1){
                return "Debug:File is error.";
            }
            this.checkFileParam=function(pList,pfile){
                try {
                    if(pfile!=null&&pfile[0]!=null&&pList!=null){
                        var pr=pList;
                        for(var i=0;i<pr.length;i++){
                            var bool=false;
                            for( a in pfile[0]){
                                if(pr[i]==a){
                                    bool=true;
                                }
                            }
                            if(bool==false){
                                return "Debug:Config file error.";
                            }
                        }
                    }
                    return 0;
                } catch (e) {
                    // TODO: handle exception
                    return "Debug:Config file error."+e;
                }

            };
            switch (pType) {
                case 1:
                    pCode=pVal.split("[[")[0];
                    pStr="["+pVal.split("[[")[1];
                    showMes("length:"+pCode.split("/").length);
                    if(pCode.split("/").length<8){
                        return "Debug:Window config is error.";
                    }
                    try {
                        var wFile=JSON.parse(pStr);
                        if(wFile!=null&&wFile[0]!=null){
                            if(wFile[0].id==null||wFile[0].st==null||wFile[0].cl==null||wFile[0].pp==null||wFile[0].up==null){
                                return "Debug:The file is not a winodws config file.";
                            }
                        }
                    } catch (e) {
                        // TODO: handle exception
                        return "Debug:Winodws config file error."+e;
                    }
                    break;
                case 3:
                    try {
//					showMes("pVal:"+pVal);
                        pCode=pVal.split("/")[0];
                        pStr=pVal.substr(pVal.indexOf("/")+1);
                        showMes("wFile:"+pCode+"  :pStr:"+pStr);
                        var wFile=JSON.parse(pStr);
                        showMes("wFile:"+wFile);
                        if(wFile!=null&&wFile[0]!=null){
                            var pr=["id","num","name","typeName","group","location","gn","port","stream","userName","password","remark","time","fond","fondColor"
                                ,"fondSize","show","grName","ad"];
                            for(var i=0;i<pr.length;i++){
                                var bool=false;
                                for( a in wFile[0]){
                                    if(pr[i]==a){
                                        bool=true;
                                    }
                                }
                                if(bool==false){
                                    return "Debug:The file is not a input source config file.";
                                }
                            }
                        }
                    } catch (e) {
                        // TODO: handle exception
                        return "Debug:Input source config file error."+e;
                    }
                    break;
                case 7:
                    try {
                        pCode=pVal.split("/")[0];
                        pStr=pVal.substr(pVal.indexOf("/")+1);
                        var pList=["id","outputId","inputId","longTime","beginTime","endTime","gn"];
                        var wFile=JSON.parse(pStr);
                        var cType=this.checkFileParam(pList,wFile);
                        showMes("cType:"+cType);
                    } catch (e) {
                        // TODO: handle exception
                        return "Debug:Window to input config file error."+e;
                    }
                    break;
                case 8:
                    try {
                        pCode=pVal.split("/")[0];
                        pStr=pVal.substr(pVal.indexOf("/")+1);
                        var pList=["id","name","isShow","width","height","outputList","IFOlist"];
                        showMes("pStr:"+pStr,"red");
                        var wFile=JSON.parse(pStr);
                        var cType=this.checkFileParam(pList,wFile);
                        showMes("cType:"+cType);
                    } catch (e) {
                        // TODO: handle exception
                        return "Debug: Model config file."+e;
                    }
                    break;
                default:
                    break;
            }
            return 0;
        }else{
            return "Debug:File is error.";
        }
    } catch (e) {
        setError("checkFile",e);
        return "Error:"+e;
    }
}
/*************************
 * 转换数据
 * @param pName
 * @param pFile
 */
function getReset(pName,pFile){
    try {
        var sFile=JSON.parse(pFile.substring(pFile.indexOf("/")+1));
        var rFlie=null;
        switch (pName) {
            case 3:
                rFlie=replaceList("decoder",sFile,"get");
                break;
            case 7:
                rFlie=replaceList("ifo",sFile,"get");
                break;
            case 8:
                rFlie= replaceList("moder",sFile,"get");
                break;
            case 13:
                rFlie=sFile;
                break;
            case 19:
                rFlie=sFile;
                break;

            default:
                break;
        }
        return rFlie;
    } catch (e) {
        setError("getReset",e);
    }
}




/***********************************
 * 打印消息
 * @param pMes
 * @param pColor
 */
function showMes(pMes,pColor){
//	var lkMes = document.getElementById("lkMes");
//	if(lkMes!=null){
//		$("#lkMes").append("<span style='display:inline-block;min-height:20px; line-height:20px; word-wrap : break-word ; color:"+pColor+"; min-width:400px; width:100%;'>"+pMes+"</span>");
//	}

}


/*********************
 * 16进制文字
 * @param pList
 * @returns {String}
 */

function conversionStr(pList){
    try {
        var rStr="";
        if(pList!=null){
            for(var i=0;i<pList.length;i++){
                rStr+=zh(pList[i]);
            }
        }
        return rStr;
    } catch (e) {
        // TODO: handle exception
    }
}






/***********************************************************************************************************************************************************
 * 分割符
 */

var updateType = 0;// 判断是否在修改:0代表不可以修改 1：代表可以修改
var objType = 0;// 对象操作类型 0:代表原生成对象可以操作 1：代表原生成对象不可以操作但可以添加新对象
// 2：代表代表原生成对象不可以操作但可以修改新添加的对象
var buttonType = 1;// 鼠标操作类型 0:代表鼠标左键按下；1：代表鼠标松开；2：代表右键按下
// var isIE = (window.navigator.userAgent.indexOf("IE") == -1) ? false :
// true;//判断是否是ie浏览器
var type=0;// 左边模块的状态
var mx=0;//
var bw=0;// 输入源div框的宽度
var lw=0;// 左边模块的div框宽度
var rw=0;// 右边模块的div框宽度
var ew=0;// 屏幕的宽度
var downObj="";// 鼠标按下的状态
var x=0;// 鼠标x坐标
var y=0;// 鼠标Y坐标
var beginX = 0;// 添加新对象开始点X轴
var beginY = 0;// 添加新对象开始点Y轴
var objId = 0;// 点击获得对象ID
var objX1 = 0;// 点击获得对象开始X轴坐标
var objY1 = 0;// 点击获得对象开始Y轴坐标
var objX2 = 0;// 点击获得对象结束X轴坐标
var objY2 = 0;// 点击获得对象结束Y轴坐标f
var listX1 = 0;// 修改数组该对象的开始x坐标
var listY1 = 0;// 修改数组该对象的开始y坐标
var listX2 = 0;// 修改数组该对象的结束x坐标
var listY2 = 0;// 修改数组该对象的结束y坐标
var bclist=null;// 双击产生的数组
var xmlEntities=null;//缓存对象数组
var mapEntities=null;//缓存Map对象数组
var splistList = null;//缓存拆分文件
var initX=0;//map canvas标签初始长度
var initY=0;//map canvas标签初始高度
var initObj=null;//map canvas标签对像
var mix=0;//鼠标点击X座标
var miy=0;//鼠标点击Y座标
var num_x=0;//缓存导航器内的框移动的X坐标
var num_y=0;//缓存导航器内的框移动的Y坐标
var mouseType=0;//鼠标状态
var map_object =null;//当前圈内的对象
var initObj=null;//map canvas标签对像
var ratios=new Array();//分辨率数组
var designType=0;//是否采用网格模式
var dwh=420;
var addType=0;//添加窗口的状态，0：不能添加；1：可以添加,2为修改,3为移动
var nwt=null;//修改漫游、画中画窗口的属性
var unwt=0;//修改漫游、画中画窗口的类型分别是八个方位从1到8
var rightId=0;//右键点击按钮状态
var pressID=null;//鼠标按下选择的图像ID;
var pressObjX=null;//鼠标按下选择的图像坐标X;
var pressObjY=null;//鼠标按下选择的图像坐标Y;
var pressX=null;//鼠标按下的时候当前鼠标坐标X
var pressY=null;//鼠标按下的时候当前鼠标坐标Y
var outText="停止输出";
var lunText="停止轮训";
var entity = {
    'id' : 0,
    'x1' : 0,
    'y1' : 0,
    'x2' : 0,
    'y2' : 0,
    'lineWidth' : 0,
    'fillColor' : null,
    'strokeColor' : null,
    'active' : 0,
    'type' : 0
};// xml节点对象

/*****************************
 * 视频分辨率
 */
//var type_list=new Array();
//type_list.push({"type":100,"id":"code_Main_all","value":showJSTxt(indexJSList,2)});
//type_list.push({"type":101,"id":"code_Flow_all","value":showJSTxt(indexJSList,3)});
//type_list.push({"type":11,"id":"code_1080P_all","value":"1080P"});
//type_list.push({"type":10,"id":"code_720P_all","value":"720P"});
//type_list.push({"type":3,"id":"code_640_all","value":"640*480"});
//type_list.push({"type":7,"id":"code_CIF_all","value":"CIF"});
//type_list.push({"type":6,"id":"code_QCIF_all","value":"QCIF"});

/******************************
 * 视频码率
 */
var code_list=new Array();
code_list.push({"id":"1","type":128});
code_list.push({"id":"2","type":256});
code_list.push({"id":"3","type":512});
code_list.push({"id":"4","type":1024});
code_list.push({"id":"5","type":2048});
var xmlEntities = new Array();// xml节点对象数组
/*
 * 修改所有对象状态
 */

function fn(){
    loadXml();//执行初始化
    load_model_div();//模式轮巡管理
}
window.onresize =fn;//窗口触发放大缩小的时候执行函数
document.onmousemove = moveImage;//鼠标移动
document.onmouseup = cancelDrag;//鼠标松开

/*******************************
 * 加载窗口文件
 */
function loadXml() {
    try {
        objType = 0;
//		showMes("canvaId:"+LK_CANVAS);
        var can = document.getElementById(LK_CANVAS);
        var scrnWidth = can.clientWidth;// 从CSS样式获得屏幕宽度
        var scrnHeight = can.clientHeight;// 从CSS样式获得屏幕高度
        can.width = scrnWidth;// 设置屏幕的宽度
        can.height = scrnHeight;// 设置屏幕的高度
        if(returnList("bclist")!=null){
            xmlEntities = returnList('bclist');
            bcType=1;
        }else{
            xmlEntities = returnList('ouputXml');
        }

        if (xmlEntities == null || xmlEntities.length < 1) {
            return;
        }
        // upAlert(xmlEntities.length);
        if(xmlEntities[0].mt==null||xmlEntities[0].mt==0){//
            xmlEntities=countXY(xmlEntities,LK_CANVAS);
        }else{
            var canWidth=0;
            var canHeight=0;
            var maxCan=document.getElementById(LK_CANVAS);
            if(localStorage.getItem("canWidth")!=null&&localStorage.getItem("canHeight")!=null){
                canWidth=localStorage.getItem("canWidth");
                canHeight=localStorage.getItem("canHeight");
                //	showMes("1 canWidth:"+canWidth+" canHeight:"+canHeight,"red");
            }else{
                canWidth=maxCan.clientWidth;
                canHeight=maxCan.clientHeight;
                //	showMes("2 canWidth:"+canWidth+" canHeight:"+canHeight,"red");
            }
            //showMes("xmlEntities:"+JSON.stringify(xmlEntities));
            xmlEntities=mappingXY(xmlEntities,canWidth,canHeight,LK_CANVAS,1);
//			showMes(".........."+JSON.stringify(xmlEntities),"black");
        }
        localStorage['ouputXml'] = JSON.stringify(xmlEntities);
        readObjByList();
    } catch (e) {

        showMes("loadXml method error:"+e);
    }

}

/*********************************************
 * 读对象数组的数据然后生成对象
 */

function readObjByList(winlist,canId) {
    try {
//		var endNum1=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//		showMes("开始画框："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"green");
        //showMes("size:"+localStorage.getItem("size"));// 是否在显示操作
        var beginX = 0;// 开始坐标X
        var beginY = 0;// 开始坐标Y
        var can =null;
        if(canId==null){
            can=document.getElementById(LK_CANVAS);
            canId=LK_CANVAS;
        }else{
            can=document.getElementById(canId);
        }
//		showMes("AA:"+canId,"yellow");
        var scrnWidth = can.clientWidth;//获取当前画布的宽度
        var scrnHeight = can.clientHeight;//获取当前工作画布的高度
        var cxt = can.getContext("2d");//获取画布的操作类型
        var ctx = can.getContext("2d");//获取画布的操作类型
        // upAlert("aaa"+xmlEntities.length);
        var list=null;
        if(winlist!=null){
            list=winlist;
        }else{
            list=xmlEntities;
        }
//		try {
//			list=update_winXY(list);
//		} catch (e) {
//		
//			//showMes("误差运算错误"+e);
//		}
        if (list != null&&list.length>0) {
            cxt.clearRect(beginX, beginY, scrnWidth, scrnHeight);
            //$("#nvaDesign a").remove();
            var butName="";
            var butMes="";
            if(list[0].mt!=null&&list[0].mt==1){//清理画布的旧数据
                butName=showJSTxt(indexJSList,4);
                butMes=showJSTxt(indexJSList,5);
                cxt.beginPath();
                cxt.lineWidth = 1;
                cxt.strokeStyle = "white";
                cxt.fillStyle = "black";
                cxt.rect(beginX, beginY, scrnWidth, scrnHeight);
                cxt.fill();
                cxt.stroke();
            }else{
                butName=showJSTxt(indexJSList,6);
                butMes=showJSTxt(indexJSList,7);
            }
//			$("#nvaDesign").val(""+butName+"");
//			$("#nvaDesign").attr("title",butMes);
            try{
                var width=0;//定义宽
                var height=0;//定义高
                var x1=0;//起点X坐标
                var y1=0;//起点Y坐标
                var redCases=null;//选择的框;
                for ( var i = 0; i < list.length; i++) {
                    for ( var j = 0; j < list.length; j++) {
                        if(list[j].active==1){
                            var thisObj=list[j];
                            list[j]=list[i];
                            list[i]=thisObj;
                        }
                    }
                }
//				var endNum4=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//				showMes("画窗口："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+" 总时间："+(endNum4-endNum1),"green");
                /***********************************
                 * @tiem 2016-10-11
                 * @mes 优化显示窗口对象
                 * @value 把循环数组改为Map地图对象。
                 */
                var ioList=returnList("oiList");
                var ioMap={};//对应关系对象
                if(ioList!=null){
                    for(var i=0;i<ioList.length;i++){
                        ioMap["id_"+ioList[i].oi] = ioList[i].cd;
                    }
                }

                for ( var i = 0; i < list.length; i++) {
                    if(list[i].id!=9999){
                        lineColor = "white";
                        lineWidth = list[i].lineWidth;
                        fillColor = list[i].fillColor;
                        if(list[0].mt==null||list[0].mt==0){//标准模式
                            x1 = parseFloat(list[i].x1.toString());
                            y1 = parseFloat(list[i].y1.toString());
                            x2 = parseFloat(list[i].x2.toString());
                            width = parseFloat(list[i].x2.toString()) - x1;
                            height = parseFloat(list[i].y2.toString()) - y1;
                        }else if(list[0].mt==1){//自定义模式
                            x1 = list[i].mx1;
                            y1 = list[i].my1;
                            width = list[i].mx2 - x1;
                            height = list[i].my2 - y1;
                        }

                        cxt.beginPath();//建立画框路线
                        cxt.lineWidth = 1;
                        cxt.strokeStyle = LOCAL_CASE;
                        cxt.rect(x1, y1, width, height);//画框的从（x1,y1）点开始画宽为:width,高为:height的框
                        var img=document.getElementById("bcg");//获取图片
//						showMes("img:"+img.getAttribute("src"));
                        cxt.drawImage(img,x1, y1, width, height);//话背景图片
                        cxt.stroke();
                        var id = 0;
                        if(list[i].num==null){id=list[i].id;}
                        else{id=list[i].num;}
                        var fondX=0;
                        var fondY=0;
                        if(width>30){
                            fondX = x1 + 10;
                            fondY = y1 + 13;
                        }else{
                            fondX=x1+2;
                            fondY=y1+10;
                        }
                        ctx.font = "10px 宋体";

                        ctx.lineWidth = 1;


                        if(id!=9999){//显示ID号为9999的时候表示隐藏								
                            if(ioMap!=null){
                                var cd=ioMap["id_"+list[i].id];
                                if(cd!=null){
                                    if(cd=="1"){
                                        ctx.fillStyle = "red";// 颜色红色
                                    }else if(cd=="2"){
                                        ctx.fillStyle = "blue";// 颜色红色
                                    }else{
                                        ctx.fillStyle = "white";// 颜色白色
                                    }
                                }else{
                                    ctx.fillStyle = "white";
                                }
                            }else{
                                ctx.fillStyle = "white";
                            }
                            try {
                                if(bcType==1){//双击放大状态
                                    if(sessionStorage.getItem("bcClickId")!=null&&
                                        sessionStorage.getItem("bcClickId")==list[i].id){
                                        if(width>100){
                                            id+=" "+showJSTxt(utilJSTxt,81)+"";//标记当前正在放大的状态
                                        }else if(width>50){
                                            id+=" "+showJSTxt(utilJSTxt,82)+"";//标记当前正在放大的状态
                                        }
                                        ctx.fillStyle = "red";
                                    }
                                }
                            } catch (e) {
                                showMes("双击放大："+e);
                            }
                            ctx.fillText(id, fondX, fondY);
                        }
                        if(list[i].strokeColor=="red"){
                            var redCase=new Object();
                            redCase.id=list[i].id;
                            if(list[0].mt==null){

                                redCase.x1= list[i].x1;
                                redCase.y1= list[i].y1;
                                redCase.x2= list[i].x2;
                                redCase.y2= list[i].y2;
                            }else if(list[0].mt==1){
                                redCase.x1= list[i].mx1;
                                redCase.y1= list[i].my1;
                                redCase.x2= list[i].mx2;
                                redCase.y2= list[i].my2;

                            }
                            redCase.lineWidth = list[i].lineWidth;
                            redCase.strokeColor = list[i].strokeColor;
                            if(redCases==null){
                                redCases=new Array();
                                redCases.push(redCase);
                            }else{
                                redCases.push(redCase);
                            }
                        }
                    }
                }
//				var endNum3=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//				showMes("画合并窗口："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+" 总时间："+(endNum3-endNum1),"green");
                /****************************
                 * 当画图canId指向LK_CANVAS标签的时候才运行的操作
                 */
                if(canId==LK_CANVAS){
                    /******************************
                     * 画合并窗口的信息
                     */
                    var wins=new Array();
                    var winObj=null;
//					showMes("开始："+JSON.stringify(list),"red");
                    wins=restore(list);

                    if(wins.length>0){
                        for(var i=0;i<wins.length;i++){
                            winObj=new Object();
                            winObj.x1=wins[i].x1;
                            winObj.y1=wins[i].y1;
                            winObj.x2=wins[i].x2;
                            winObj.y2=wins[i].y2;
                            winObj.linwWidth=1;
                            winObj.strokeColor=LOCAL_CASE;
                            rectObj(winObj,LK_CANVAS);

                        }
                    }
                    /**********************************
                     * 画不是漫游和画中画的输入源的信息
                     * text:从服务器获取的输入源信息数组
                     * list:canvas窗口的显示的窗口数组
                     */
//					var endNum8=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//					showMes("画框结束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算8："+(endNum8-endNum1),"green");
                    var text=localStorage.getItem("oi");
                    if(text!=null){
                        setIp(text,list);
                    }
//					var endNum7=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//					showMes("画框结束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算7："+(endNum7-endNum1),"green");
                    /*****************************
                     * 画物理屏的输出窗口
                     * caseList:物理屏的窗口数组
                     */
                    var caseList=null;
                    //showMes("list:"+JSON.stringify(list),"blue");
                    caseList=getMyWindows(list);//画物理屏窗口和拼接窗口的黄色边框
                    //showMes("caseList:"+JSON.stringify(caseList),"red");

                    if(list[0].mt==null){
                        if(caseList==null){
                            caseList=new Array();
                        }
                        var en=sessionStorage.getItem("lineNum");//初始化每一行多少个窗口
                        var tn=sessionStorage.getItem("listNum");//初始化每一列多少个
                        //showMes("窗口:"+JSON.stringify(win),"red");
                        maxX=getMax(list).x;//获取最大X坐标
                        maxY=getMax(list).y;//获取最大Y坐标
                        minX=getMin(list).x;//获取最小X坐标
                        minY=getMin(list).y;//获取最小Y坐标
                        //  showMes("全屏的坐标("+minX+","+minY+")("+maxX+","+maxY+")");
                        var canvaWidth = (maxX-minX)/en;// 每个对象的宽度
                        var canvaHeight = (maxY-minY)/tn;// 每个对象的高度 
                        for(var i=0;i<list.length;i++){
                            var bx=list[i].x2-list[i].x1;
                            var by=list[i].y2-list[i].y1;
                            if(((bx/canvaWidth>1||by/canvaHeight>1)&&list[i].active==0)||list[i].active==1){
                                var ob=new Object();
                                ob.x1=list[i].x1;
                                ob.y1=list[i].y1;
                                ob.x2=list[i].x2;
                                ob.y2=list[i].y2;
                                ob.lineWidth =1;
                                ob.strokeColor = LOCAL_WINDOW;
                                if(list[i].active==1){
                                    ob.fillColor="black";
                                    ob.active=1;
                                    ob.num=list[i].num;
                                }
                                caseList.push(ob);
                            }
                        }
                    }
                    var in_mes=returnList("oiList");
//					var endNum6=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//					showMes("画框结束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算6："+(endNum6-endNum1),"green");
                    if(caseList!=null){
//						showMes("in_mes:"+JSON.stringify(in_mes));
//						showMes("caseList:"+JSON.stringify(caseList),"red");
//						showMes("aaaa:"+JSON.stringify(caseList));
                        for(var c=0;c<caseList.length;c++){

                            rectObj(caseList[c],LK_CANVAS);
                            if(caseList[c].active!=null&&caseList[c].active==1){//如果是画中画、漫游的窗口
                                ctx.font = "10px 宋体";

                                ctx.lineWidth = 1;
                                if(caseList[c].num!=9999){//显示ID号为9999的时候表示隐藏
                                    var ioList=returnList("oiList");

                                    if(ioList!=null){
                                        for(var o=0;o<ioList.length;o++){
                                            if(ioList[o].oi==caseList[c].id&&(ioList[o].er!=null&&ioList[o].er!=0)){
                                                ctx.fillStyle = "red";
                                                break;
                                            }else{
                                                ctx.fillStyle = "white";
                                            }
                                        }
                                    }else{
                                        ctx.fillStyle = "white";
                                    }

                                    if(in_mes!=null){
                                        for(var a=0;a<in_mes.length;a++){
                                            if(in_mes[a].oi==caseList[c].id){
                                                if(in_mes[a].cd=="1"){
                                                    ctx.fillStyle = "red";// 颜色红色
                                                }else if(in_mes[a].cd=="2"){
                                                    ctx.fillStyle = "blue";// 颜色红色
                                                }else{
                                                    ctx.fillStyle = "white";// 颜色白色
                                                }
                                            }
                                        }

                                    }
                                    ctx.fillText(caseList[c].num, caseList[c].x1+10, caseList[c].y1+13);
                                }

                                if(in_mes!=null){
                                    var ip="";
                                    var tp="";
                                    var gn="0";
                                    var grNum="";//通道号
                                    var er="0";//报警号
                                    var ml="";//码流
                                    var dlist=returnList("decoderList");
                                    showMes("in_mes:"+in_mes.length,"red");
                                    for(var a=0;a<in_mes.length;a++){
                                        if(in_mes[a].oi==caseList[c].id){
//									    	showMes("id:"+caseList[c].id,"blue");
                                            grNum=in_mes[a].gn;
                                            if(in_mes[a].er!=null){
                                                er=in_mes[a].er;
                                            }else{
                                                er="0";
                                            }

                                            for(var b=0;b<dlist.length;b++){
                                                if(in_mes[a].ii==dlist[b].id){
                                                    if(grNum!=0){
                                                        var num_index=0;//标点
                                                        if(dlist[b].type==1){
                                                            if((grNum-1)%2==0){
                                                                num_index=(grNum-1)/2;
                                                                ml=showJSTxt(indexJSList,2);
                                                            }else{
                                                                num_index=parseInt((grNum-1)/2);
                                                                ml=showJSTxt(indexJSList,3);
                                                            }
                                                        }else{
                                                            num_index=grNum-1;
                                                        }

                                                        var grName=null;
                                                        if(dlist[b].grName!=null){
                                                            grName=dlist[b].grName.split(",");
                                                            //	showMes("grNum:"+grNum+ " num_index:"+num_index+  " grName:"+JSON.stringify(grName));
                                                            if(grName!=null&&grName.length>0){
                                                                grName=gName_split(grName);
                                                                gn=grName[num_index];
                                                            }
                                                            ip=dlist[b].name+"."+gn;
                                                        }else{
                                                            ip=dlist[b].name+"."+showJSTxt(indexJSList,1)+grNum;
                                                        }
                                                    }else{
                                                        ml="";
                                                        ip=dlist[b].name;
                                                    }
                                                }
                                            }

                                            if(localStorage.getItem("fblType")==null||
                                                localStorage.getItem("fblType")==0){
                                                tp=in_mes[a].tp+ml;
                                            }else{
                                                tp="";
                                            }
                                            var x=0;
                                            var y=0;
                                            if((caseList[c].x2-caseList[c].x1)<75){
                                                ip=ip.substring(0, 1)+"...";
                                                tp="";
                                            }else  if((caseList[c].x2-caseList[c].x1)<120){
                                                if(gn!=0){
                                                    ip=ip.substring(0, 5)+"...";
                                                }else{
                                                    ip=ip.substring(0, 5)+"...";
                                                }
                                            }
                                            x=parseFloat(caseList[c].x1)+5;
                                            y=parseFloat(caseList[c].y2)-5;
                                            // upAlert(IO[a].ii+" "+IO[a].tp+" "+x+" "+y);
                                            var ct = can.getContext("2d");
                                            ct.font = "10px 宋体";
                                            if(in_mes[a].cd=="1"){
                                                ct.fillStyle = "red";// 颜色红色
                                            }else if(in_mes[a].cd=="2"){
                                                ct.fillStyle = "blue";// 颜色红色
                                            }else{
                                                ct.fillStyle = "white";// 颜色白色
                                            }
                                            ct.lineWidth = 1;
                                            ct.fillText(ip, x, y);
                                            var ow=caseList[c].x2-caseList[c].x1;
//											var oh=caseList[c].y2-caseList[c].y1;
                                            if(in_mes[a].cd==2){//判断如果是停止输出显示输出关闭
                                                //	ct.fillText(tp+"  "+showJSTxt(indexJSList,23), x, (y-15));

                                                if(ow>80){
                                                    //ct.fillText(tp+"  "+showJSTxt(indexJSList,23), x, (y-15));
                                                    ct.fillText(showJSTxt(indexJSList,23), x, (y-15));
                                                }else if(ow>40&&ow<80){
                                                    //ct.fillText(tp+"  "+showJSTxt(utilJSTxt,69), x, (y-15));
                                                    ct.fillText(showJSTxt(utilJSTxt,69), x, (y-15));
                                                }
                                            }else{
                                                ct.fillText(tp, x, (y-15));
                                            }
                                            if(er!=null&&er!=0){
                                                ct.fillStyle = "red";// 颜色白色
                                                ct.fillText("A"+er, x, (y-25));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
//					var endNum5=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//					showMes("画框结束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算5："+(endNum5-endNum1),"green");
                    /*******************************
                     * 画选中的输出窗口
                     * redCases:选中窗口的数组
                     */


                    if(redCases!=null){
                        for(var r=0,ri=redCases.length;r<ri;r++){
                            rectObj(redCases[r],LK_CANVAS);
                        }
                    }

                }
            }catch(e){
                showMes("输出窗口加载错误:"+e);
            }
        } else {

            cxt.clearRect(beginX, beginY, scrnWidth, scrnHeight);
            return false;
        }
//		var endNum2=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//		showMes("画框结束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算："+(endNum2-endNum1),"green");
    }catch (e) {

        setError("readObjByList", e);
    }
}










/*
 * 功能：根据坐标获取该对象的Id 参数：坐标X轴和坐标Y轴 返回值:对象Id;
 * 
 */

function getClickObjId(x1, y1,list) {
    try {
        var x = x1;
        var y = y1;
        var obj=null;
        var idx = -1;
        var show_list=returnList("db_list");
        var ctr_list=null;
        if(show_list!=null){
            ctr_list=mapEntities;
        }else if(list!=null){
            ctr_list=list;
        }else{
            ctr_list=xmlEntities;
        }
        //排序：把漫游，自定义模式的窗口放最后
        for(var i=0;i<ctr_list.length;i++){
            for(var j=0;j<ctr_list.length;j++){
                if(ctr_list[j].active==1){
                    var aw=ctr_list[i];
                    ctr_list[i]=ctr_list[j];
                    ctr_list[j]=aw;
                }
            }
        }
        var x1=0;
        var y1=0;
        var x2=0;
        var y2=0;
        //showMes("ctr_list:"+JSON.stringify(ctr_list),"red");
        for ( var j = 0; j < ctr_list.length; j++) {
            if(ctr_list[j].id!=9999){
                if(ctr_list[0].mt==null||ctr_list[0].mt==0){
                    x1 = parseFloat(ctr_list[j].x1);
                    y1 = parseFloat(ctr_list[j].y1);
                    x2 = parseFloat(ctr_list[j].x2);
                    y2 = parseFloat(ctr_list[j].y2);
                }else if(ctr_list[0].mt==1){
                    x1 = parseFloat(ctr_list[j].mx1);
                    y1 = parseFloat(ctr_list[j].my1);
                    x2 = parseFloat(ctr_list[j].mx2);
                    y2 = parseFloat(ctr_list[j].my2);
                }
                var listIndex = j;
                //	showMes( "开始坐标：("+x1+","+y1+")"+"结束坐标：("+x2+","+y2+")"+"鼠标坐标：("+x+","+y+")");
                if (x1 < x && x < x2 && y1 < y && y < y2 && listIndex > idx) {
                    // 判断起点为左上角的
                    obj=ctr_list[j];
                } else if (x < x1 && y < y1 && x > x2 && y > y2 && listIndex > idx) {
                    //判断起点为右上角
                    obj=ctr_list[j];
                } else if (x > x1 && y < y1 && x < x2 && y > y2 && listIndex > idx) {
                    //判断起点为左下角
                    obj=ctr_list[j];
                } else if (x < x1 && y > y1 && x > x2 && y < y2 && listIndex > idx) {
                    //判断起点为右下角
                    obj=ctr_list[j];
                }
            }
        }
        //showMes("obj:"+JSON.stringify(obj),"yellow");
        if(obj==null){
            return ;
        }else{
            return obj;

        }
    } catch (e) {

        setError("getClickObjId",e);
    }
}

/***************************************
 * 根据窗口返回该物理屏的所有的窗口
 * @param win
 * @param list
 * @returns
 *
 */
function getWindow(paramObj,paramList){
    try {
        var list=null;
        var entitys=new Array();
        if(paramList!=null){
            list=paramList;
        }else{
            list=returnList("ouputXml");
        }
        /****************************
         * 根据不同的模式进行不同操作
         */
        if(list[0].mt==null){//标准模式
            var win=paramObj;
            if(list==null||list.length<1){
                return null;
            }

            var en=sessionStorage.getItem("lineNum");//初始化每一行多少个窗口
            var tn=sessionStorage.getItem("listNum");//初始化每一列多少个
            var canvaNum = en * tn;// 多少个对象
            maxX=getMax(list).x;//获取最大X坐标
            maxY=getMax(list).y;//获取最大Y坐标
            minX=getMin(list).x;//获取最小X坐标
            minY=getMin(list).y;//获取最小Y坐标
            var beginX = minX;// 开始X轴坐标
            var beginY = minY;// 开始Y轴坐标
            var canvaWidth = (maxX-minX)/en;// 每个对象的宽度
            var canvaHeight = (maxY-minY)/tn;// 每个对象的高度 
            var obj="";
            var cw=null;
            for ( var i = 0; i < canvaNum; i++) {

                // 把对象生成到数组里面
                obj = new Object();
                obj.id = (i+1);
                obj.num= obj.id;
                obj.x1 = beginX;
                obj.y1 = beginY;
                obj.x2 = beginX + canvaWidth;
                obj.y2 = beginY + canvaHeight;
                if(win.x1>(obj.x1-1)&&win.y1>(obj.y1-1)&&win.x2<(obj.x2+1)&&win.y2<(obj.y2+1)){
                    cw=obj;
                    break;
                }
                if ((i + 1) % en == 0) {
                    beginX = minX;
                    beginY = beginY + canvaHeight;
                } else {
                    beginX = beginX + canvaWidth;
                }
            }
            if(cw!=null){
                entitys=new Array();
                var minx=cw.x1-1;
                var miny=cw.y1-1;
                var maxx=cw.x2+1;
                var maxy=cw.y2+1;
                for(var i=0;i<list.length;i++){
                    if(list[i].x1>minx&&list[i].y1>miny&&list[i].x2<maxx&&list[i].y2<maxy){
                        entitys.push(list[i]);
                    }
                }
            }else{
                entitys=null;
            }
        }else if(list[0].mt!=null&&list[0].mt==1){//自定义模式
            for(var i=0,l=list.length;i<l;i++){
                if(list[i].id==paramObj){
//					if(paramObj==10){
//						showMes("list[i]:"+JSON.stringify(list[i]),"blue");
//					}
                    if(list[i].w>dwh||list[i].h>dwh){
//						if(paramObj==10){
//							showMes("ccc");
//						}
                        for(var j=0;j<list.length;j++){
                            if((list[j].w>dwh||list[j].h>dwh)&&list[j].st==list[i].id){
                                entitys.push(list[i]);
                            }
                        }
                    }else if(list[i].w<dwh||list[i].h<dwh){
//						if(paramObj==10){
//							showMes("bbb");
//							showMes("list:"+JSON.stringify(list),"red");
//						}
                        for(var j=0;j<list.length;j++){
                            if((list[j].w<dwh||list[j].h<dwh)&&list[j].sc==list[i].sc){
                                entitys.push(list[j]);
                            }
                        }
                    }else if(list[i].w==dwh||list[i].h==dwh){
//						if(paramObj==10){
//							showMes("ddd");
//						}
                        entitys.push(list[i]);
                    }
                }
            }
        }
        return entitys;
    } catch (e) {

        showMes("getWindow method error:"+e,"red");
    }
}
/******************************
 * 根据数组的窗口获取到物理屏的映射框
 * @param paramList
 * @returns
 */
function getMyWindows(paramList){
    try {
        var list=null;//操作数组
        var myList=null;//返回结果数组
        if(paramList!=null){// 判断参数不为空的时候
            list=paramList;
        }else{
            list=returnList("ouputXml");
        }
        if(list!=null){
            var entitys=null;
            var minEntity=null;
            var maxEntity=null;
            var entity=null;
            var bool=true;
            var onlys=null;
//			showMes("list:"+JSON.stringify(list));
            /***************************************************
             * 根据不同情况获取物理屏的数组
             */
            //showMes("list[0].mt:"+(list[0].mt==null));
            if(list[0].mt==null){//标准模式
                for(var i=0;i<list.length;i++){
                    entitys=getWindow(list[i],list);
                    if(entitys!=null){
                        minEntity=getMin(entitys);
                        maxEntity=getMax(entitys);
                        entity=new Object();
                        entity.id=list[i].id;
                        if(list[i].num==null){
                            entity.num=entity.id;
                        }else{
                            entity.num=list[i].num;
                        }
                        entity.x1=minEntity.x;
                        entity.y1=minEntity.y;
                        entity.x2=maxEntity.x;
                        entity.y2=maxEntity.y;
                        entity.lineWidth =1;
                        entity.strokeColor = LOCAL_WINDOW;
                        if(myList!=null){
                            bool=true;
                            for(var j=0;j<myList.length;j++){
                                if(myList[j].x1==entity.x1&&myList[j].x2==entity.x2&&myList[j].y1==entity.y1&&myList[j].y2==entity.y2){
                                    bool=false;
                                    myList[j]=entity;
                                    break;
                                }
                            }
                            if(bool==true){
                                myList.push(entity);
                            }
                        }else{
                            myList=new Array();
                            myList.push(entity);
                        }
                    }

                }
            }else if(list[0].mt!=null&&list[0].mt==1){//自定义模式
                //showMes("list:"+JSON.stringify(list));
                onlys=new Array();
                for(var i=0;i<list.length;i++){//j
                    if(list[i].x1==0&&list[i].y1==0&&list[i].id!=9999){
                        onlys.push(list[i].id);
                    }
                }
//				showMes("onlys:"+JSON.stringify(onlys),"blue");
                myList=new Array();
                for(var i=0;i<onlys.length;i++){
                    entitys=getWindow(onlys[i],list);
//					if(onlys[i]==10){
//						showMes("entitys:"+JSON.stringify(entitys),"blue");
//					}
                    if(list[0].mt==1){
                        minEntity=getMin(entitys,"design");
                        maxEntity=getMax(entitys,"design");
                    }
                    entity=new Object();
                    entity.id=onlys[i];
                    entity.x1=minEntity.x;
                    entity.y1=minEntity.y;
                    entity.x2=maxEntity.x;
                    entity.y2=maxEntity.y;
                    entity.lineWidth =1;
                    entity.strokeColor = LOCAL_WINDOW;
                    if(entitys==null||entitys.length<1){
                    }else if(entitys[0].active!=null&&entitys[0].active==1){//判断是否是画中画、漫游的窗口
                        entity.fillColor="black";
                        entity.active=1;
                        entity.num=entitys[0].num;
                    }
                    myList.push(entity);
                }
            }
        }
        return myList;
    } catch (e) {

        setError("getMyWindows",e);
    }

}
/****************************************
 * 双击自定义模式满屏放大
 * @param params
 * @param paramId
 * @returns
 */
function clickFullWin(params,paramId){
    try {
        var list=returnList("ouputXml");
        if(params!=null){
            list=params;
        }
        if(list!=null){
            //	showMes("list:"+JSON.stringify(list),"blue");
            var wList=restore(list);//转换为物理屏数组
            //	showMes("wList:"+JSON.stringify(wList),"red");
            var wwn=0;//物理屏窗口
            var mList=new Array();//漫游窗口数组
            var mouse=getCanXY(LK_CANVAS);//获取当前鼠标点击的坐标
            var minXY=getMin(wList);//获取窗口最小的坐标
            var maxXY=getMax(wList);//获取窗口最大的坐标
            var wNum=0;//横向由几个窗口组成
            var hNum=0;	//纵向由几个窗口组成
            var szList=new Array();//运算数组
            var obj_num=0;//当前点击窗口号;
            var obj_id=0;//当前点面击窗口ID号;
            cline=1;//坐标偏差1个点
//			showMes("wList:"+wList.length+" x:"+mouse.x+" y:"+mouse.y+" minx:"+minXY.x+" miny:"+minXY.y
//					+" maxx:"+maxXY.x+" maxy:"+maxXY.y);
            for(var i=0;i<list.length;i++){
                if(list[i].active!=null&&list[i].active==1){
                    list[i].type=100;
                    mList.push(list[i]);
                }
                if(paramId==list[i].id){
                    //保存
                    obj_num=list[i].num;
                    obj_id=list[i].id;
                }
            }
//			showMes("wList:"+JSON.stringify(wList),"red");
            for(var i=0;i<wList.length;i++){
                if(wList[i].active==0){//计算物理屏窗口
                    wwn++;
                }
                //找出在最小Y坐标线上的窗口
                if(checkLine(minXY.x,null,wList[i].x1,null)&&wList[i].active==0){
                    hNum++;//计算纵向
                    var obj=new Object();
                    obj.oneId=wList[i].id;
                    obj.y=wList[i].y1;
                    obj.list=new Array();
                    var l_obj=new Object();
                    l_obj.id=wList[i].id;
                    l_obj.x1=wList[i].x1;
                    l_obj.y1=wList[i].y1;
                    obj.list.push(l_obj);
                    szList.push(obj);
                }
                if(checkLine(minXY.y,null,wList[i].y1,null)&&wList[i].active==0){
                    wNum++;//计算横向
                }
            }
            for(var i=0;i<szList.length;i++){
                //每个Y坐标的X坐标一样的窗口
                for(var j=0;j<wList.length;j++){
                    if(checkLine(szList[i].y,null,wList[j].y1,null)&&wList[j].active==0&&szList[i].oneId!=wList[j].id){
                        var obj=new Object();
                        obj.id=wList[j].id;
                        obj.x1=wList[j].x1;
                        obj.y1=wList[j].y1;
                        szList[i].list.push(obj);
                    }
                }
            }
            var bool=true;//是否是原生没有移动的窗口
            //
            var szNum=0;//窗口数量
            for(var i=0;i<szList.length;i++){
                szNum+=szList[i].list.length;
                for(var j=0;j<szList.length;j++){
                    if(szList[i].list.length!=szList[j].list.length){
                        bool=false;
                    }
                }
            }
//			showMes("szNum:"+szNum+" wwn:"+wwn);
            if(szNum!=wwn){
                //判断计算的结果是否和物理屏数量一样,如果样就是原生拆分模式的窗口
                bool=false;
            }
//			showMes("bool:"+bool+" wNum:"+wNum+" hNum:"+hNum,"blue");
//			showMes("szList:"+JSON.stringify(szList),"red");
            var rList=new Array();//返回数组;
            if(1==1){
//				showMes("规则合并");
                var newObj=null;
                for(var i=0;i<szList.length;i++){
                    var s_l=szList[i].list;
                    for(var j=0;j<s_l.length;j++){
                        if(i==0&&j==0){
                            newObj={"id":obj_id,"num":obj_num, "sc":s_l[j].id, "x1":0,"y1":0,
                                "x2":dwh,"y2":dwh,"mt":1,"st":obj_id,"mx1":minXY.x,"my1":minXY.y,
                                "mx2":maxXY.x,"my2":maxXY.y,"w":(wNum*dwh),"h":(hNum*dwh),"lineWidth":1,"fillColor":"black",
                                "strokeColor":"white","active":0,"type":100};
                            rList.push(newObj);
                        }else{
                            var t_w=j*dwh;
                            var t_h=i*dwh;
                            newObj={"id":9999,"num":9999,"sc":s_l[j].id,"x1":t_w,"y1":t_h,
                                "x2":(t_w+dwh),"y2":(t_h+dwh),"mt":1,"st":obj_id,"mx1":0,"my1":0,
                                "mx2":0,"my2":0,"w":(wNum*dwh),"h":(hNum*dwh),"lineWidth":1,"fillColor":"black",
                                "strokeColor":"white","active":0,"type":100};
                            rList.push(newObj);
                        }
                    }
                }
//				for(var i=0;i<mList.length;i++){//双击全屏放大的时候，不画漫游窗口
//					rList.push(mList[i]);
//				}
//				showMes("rList:"+JSON.stringify(rList),"blue");
                saveList("bclist",rList);
                readObjByList(rList);
                sendJSONForServer("ouputXml",rList);
                var rStr=getExt(1,"ouputXml",rList);
                LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
                return rList;
            }else{
//				//不规则合并
//				showMes("不规则合并");
//				var wl_list=new Array();//以判断的物理屏窗口
//				var cl_list=new Array();//分类数组
//				var li_num=wList.length;
//				var cl_wi=null;//当前点击的窗口
//				var cl_wl=null;//当前点击的窗口所属的物理屏
//				for(var i=0;i<list.length;i++){//获取当前点击的窗
//					if(list[i].id==paramId){
//						cl_wi=list[i];
//					}
//				}
//				showMes("cl_wi:"+JSON.stringify(cl_wi),"red");
////				showMes("wList:"+JSON.stringify(wList),"blue");
//				cline=1;
//				for(var i=0;i<wList.length;i++){//获取当前点窗口所属的物理屏
//					if(checkOverlap(cl_wi.mx1+1,cl_wi.my1+1,cl_wi.mx2-1,cl_wi.my2-1,
//							wList[i].x1,wList[i].y1,wList[i].x2,wList[i].y2)&&wList[i].active==0){
//						cl_wl=wList[i];
//						wl_list.push(cl_wl);
//					}
//				}
//				showMes("cl_wl:"+JSON.stringify(cl_wl),"yellow");
//				for(var i=0;i<wList.length;i++){//计算物理屏
//					for(var a=0;a<wList.length;a++){
//						for(var j=0;j<wl_list.length;j++){
//							if((checkLine(wList[a].x2,wList[a].y1,wl_list[j].x1,wl_list[j].y1)&&
//								checkLine(wList[a].x2,wList[a].y2,wl_list[j].x1,wl_list[j].y2))||
//								(checkLine(wList[a].x1,wList[a].y2,wl_list[j].x1,wl_list[j].y1)&&
//								checkLine(wList[a].x2,wList[a].y2,wl_list[j].x2,wl_list[j].y1))||
//								(checkLine(wList[a].x1,wList[a].y1,wl_list[j].x2,wl_list[j].y1)&&
//								checkLine(wList[a].x1,wList[a].y2,wl_list[j].x2,wl_list[j].y2))||
//								(checkLine(wList[a].x2,wList[a].y1,wl_list[j].x1,wl_list[j].y2)&&
//								checkLine(wList[a].x2,wList[a].y1,wl_list[j].x2,wl_list[j].y2))){
//								var bool=true;
//								for(var j=0;j<wl_list.length;j++){//判断是示否已获取
//									if(wList[i].id==wl_list[j].id){
//										bool=false;
//									}
//								}
//								if(bool){
//									wl_list.push(wList[a]);
//									break;
//								}
//							}
//						}
//					}
//						
//				}
//				showMes("wl_list:"+JSON.stringify(wl_list),"blue");
            }
        }else{
            return null;
        }
    } catch (e) {

        setError("clickFullWin",e);
    }

}
/*********************************
 * 双击漫游全屏放大
 * @param winList
 * @param winId
 * @param clickType
 */
function clickRoam(winList,winId,clickType){
    try {
        nwt=null;//清理选中漫游窗口
        $("body").css("cursor","default");//修改漫游双击的鼠标形态
        var list=null;
        if(winList!=null){
            list=winList;
        }else{
            list=returnList("ouputXml");
        }
//		showMes("list:"+list.length+" winId:"+winId+"  clickType:"+clickType,"red");
        if(list!=null&&list.length>0){
            var size= localStorage.getItem("size");//窗口排放
            var wNum=0;
            var hNum=0;
            if(size.split("/")!=null){
                hNum=size.split("/")[0];
                wNum=size.split("/")[1];

            }else{
                return null;
            }
            var newList=null;//返回窗口数组
            var win=null;//当前点击有漫游窗口
            var minXY=getMin(list,"design");//获取窗口最小的坐标

            var maxXY=getMax(list,"design");//获取窗口最大的坐标
            var obj=null;//放大的窗口
            for(var i=0;i<list.length;i++){
                if(list[i].id==winId){
                    win=list[i];
                }
            }
            if(clickType==0){//拼屏放大
                newList=new Array();
                var bx=0;//开始X坐标
                var by=0;//开始Y坐标
//				showMes("wNum:"+wNum+" hNum:"+hNum,"red");
                for(var i=0;i<wNum*hNum;i++){
                    if(i==0){
                        obj={"id":win.id,"num":win.num, "sc":(i+1), "x1":0,"y1":0,
                            "x2":dwh,"y2":dwh,"mt":1,"st":win.id,"mx1":minXY.x,"my1":minXY.y,
                            "mx2":maxXY.x,"my2":maxXY.y,"w":(wNum*dwh),"h":(hNum*dwh),"lineWidth":1,"fillColor":"black",
                            "strokeColor":"white","active":0,"type":100};
                        newList.push(obj);
                    }else{
                        obj={"id":9999,"num":9999,"sc":(i+1),"x1":bx,"y1":by,
                            "x2":(bx+dwh),"y2":(by+dwh),"mt":1,"st":win.id,"mx1":minXY.x,"my1":minXY.y,
                            "mx2":maxXY.x,"my2":maxXY.y,"w":(wNum*dwh),"h":(hNum*dwh),"lineWidth":1,"fillColor":"black",
                            "strokeColor":"white","active":0,"type":100};
                        newList.push(obj);
                    }
                    if ((i + 1) % parseInt(wNum)== 0) {
                        bx = 0;
                        by = by + dwh;
                    } else {
                        bx = bx + dwh;
                    }
                }
//				showMes("newList:"+JSON.stringify(newList));
            }else if(clickType==1){//单屏放大
                var w_b=new Array();
                newList=new Array();//实例化新数组
                var w_list=restore(list);
                for(var i=0;i<w_list.length;i++){
                    if(w_list[i].active!=1&&checkOverlap(win.mx1+1,win.my1+1,win.mx2-1,win.my2-1,w_list[i].x1,w_list[i].y1,w_list[i].x2,w_list[i].y2)){
                        w_b.push(w_list[i]);
                    }
                }
//				showMes("w_b:"+JSON.stringify(w_b));
                if(w_b.length>1){
                    upAlert(showJSTxt(indexJSList,15));
                    return;
                }else if(w_b.length==1){
                    var cl_list=new Array();//漫游所在物理的所有窗口
                    for(var i=0;i<list.length;i++){
                        if(list[i].sc==w_b[0].id){
                            cl_list.push(list[i]);
                        }else if(list[i].id!=win.id){
                            list[i].type=100;
                            newList.push(list[i]);
                        }
                    }
                    if(cl_list.length>0){
                        var minXY=getMin(cl_list,"design");//获取窗口最小的坐标
                        var maxXY=getMax(cl_list,"design");//获取窗口最大的坐标 
//						showMes("minXY:"+JSON.stringify(minXY));	
//						showMes("maxXY:"+JSON.stringify(maxXY));
                        obj={"id":win.id,"num":win.num, "sc":w_b[0].id, "x1":0,"y1":0,
                            "x2":dwh,"y2":dwh,"mt":1,"st":win.id,"mx1":minXY.x,"my1":minXY.y,
                            "mx2":maxXY.x,"my2":maxXY.y,"w":dwh,"h":dwh,"lineWidth":1,"fillColor":"black",
                            "strokeColor":"white","active":0,"type":100};
                        newList.push(obj);
//						showMes(JSON.stringify(newList),"red");
//						readObjByList(newList);
//						sendJSONForServer("ouputXml",newList);
                    }
                }
            }
            saveList("bclist",newList);
            readObjByList(newList);
//			sendJSONForServer("ouputXml",newList);
            var rStr=getExt(1,"ouputXml",newList);
            LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
        }
    } catch (e) {

        setError("clickRoam",e);
    }
}
/***************************************
 * 单击自定义窗口单屏放大
 * @param paramList
 * @param param
 * @returns
 */
function click_one_win(paramList,param){
    try {
        var return_list=new Array();
        var list=null;
        if(paramList!=null){
            list=paramList;
        }else{
            list=returnList("ouputXml");
        }
        if(param.w>dwh||param.h>dwh){
            upAlert(showJSTxt(indexJSList,16));
            return null;
        }else if(param.w==dwh&&param.h==dwh){
            //showMes("param.w:"+param.w+" param.h:"+param.h+" dwh:"+dwh);
            upAlert(showJSTxt(indexJSList,17));
            return null;
        } else{
            var wins=new Array();
            for(var i=0;i<list.length;i++){
                if(list[i].sc==param.sc){//把当前双击放大的窗口所在的物理屏的所有窗口找出了
                    wins.push(list[i]);
                }else{//把和当前窗口没关系的窗口提取出来；
                    return_list.push(list[i]);
                }
            }
            var minXY=getMin(wins,"design");//求最小的X,Y值
            var maxXY=getMax(wins,"design");//求最大的X,Y值
            var newObje={"id":param.id,"num":param.num,"sc":param.sc,"x1":0,"y1":0,"x2":dwh,"y2":dwh,
                "mx1":minXY.x,"my1":minXY.y,"mx2":maxXY.x,"my2":maxXY.y,"w":dwh,
                "h":dwh,"mt":1,"st":param.id,"lineWidth":1,"fillColor":"black",
                "strokeColor":"white","active":0,"type":100};
            return_list.push(newObje);
        }
        //showMes("return_list:"+JSON.stringify(return_list),"red");
        return return_list;
    } catch (e) {

    }
}
var bcType=0;
/********************************
 * 点击窗口双击放大输出窗口
 * 注:标准模式下可以放大窗口,窗口放大后不可以对窗口进行除了双击缩小的其他操作;
 *   自定义模式下不可以进行全屏放大操作,放大后和也不可以对窗口进行除了双出缩小的其他操作.
 * @param e 鼠标
 */
function blClickObj(e){
    try {
        showMes("双击放大");
        if(xmlEntities==null||xmlEntities.length==0){
            return ;
        }
//		clearPlayType(0);//清理数据
        var x = getCanXY(LK_CANVAS).x;// 获取鼠标当前在画布里x轴的坐标
        var y = getCanXY(LK_CANVAS).y;// 获取鼠标当前在画布里Y轴坐标
        var c_type= localStorage.getItem("clickType");//获取双击点击效果

        if(c_type==null){// 默认是拼屏放大
            c_type=1;
        }
        var entity=getClickObjId(x, y);
//		var upNum = sessionStorage.getItem("upNum");
//		if (upNum == 1) {
//			upAlert(showJSTxt(indexJSList,18));
//			return;
//		}
        if(returnList("db_list")!=null){
            upAlert(showJSTxt(indexJSList,19));
            return;
        }
        var bclist =new Array();//定义一个双击点击的新数组
        bclist=returnList("ouputXml");//获取输出窗口
        if(checkMes()){
            clicktime=0;
        }else{
            if(clicktime==0){
                clicktime=1;
                objCT=setTimeout("checkTime()", 1000);
            }
            //showMes("st:"+st+" clicktiem:"+clicktime);
            upAlert(showJSTxt(indexJSList,14));
            return;
        }
        if(bcType==0){//设置当前输出显示为双击放大模式
            bcType=1;
        }else if(bcType==1){//设置当前输出为双击放大前的模式
            localStorage.removeItem("bclist");
            sessionStorage.removeItem("bcClickId");//清理当前双击放大的窗口ID
            bcType=0;
            sessionStorage.setItem("getbcList",1);
//			 getJSONForServer("ouputXml");
            loadXml();
            var rStr=getExt(1,"ouputXml",returnList("ouputXml"));
            LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
            return;
        }

        sessionStorage.setItem("dbclick",1);
        if(entity.active==1){//漫游和画中画的窗口不能进行双击放大
//			upAlert("提示：漫游、画中画不能双击放大");
            clickRoam(bclist,entity.id,c_type);//调用漫游双击放大模块
            return;
        }
        if(bclist[0].mt!=null&&bclist[0].mt==1&&c_type==0){
            clickFullWin(null,entity.id);
//			upAlert("自定义模式下,不能进行拼屏双击放大!");
            sessionStorage.setItem("bcClickId",entity.id);//记录当前双击放大的窗口
//		 	bclist=null;
            return;
        }
        ///showMes("bcType:"+bcType+" c_type:"+c_type,"red");
        if(bcType==1&&c_type==1){//双击单屏放大
            bclist=click_one_win(bclist,entity);
//			showMes("entity.id:"+entity.id);
            sessionStorage.setItem("bcClickId",entity.id);//记录当前双击放大的窗口
//			showMes("set bcClickId:"+sessionStorage.getItem("bcClickId"));
            if(bclist==null){
                bcType=0;
            }else{
                for(var i=0;i<bclist.length;i++){
                    bclist[i].type=100;
                }
                readObjByList(bclist);
                saveList("bclist",bclist);
                var rStr=getExt(1,"ouputXml",bclist);
                LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
//				sendJSONForServer("ouputXml",bclist);
            }
        }
    }catch (e) {

        showMes("blClickObj method error:"+e,"red");
    }
}
/*
 * 点击选中对象
 */
var click_timeNum=0;
var clt=null;
var cet=null;
function clickTimeNum(){
    if(click_timeNum<2&&bcType==1){
        upAlert(showJSTxt(indexJSList,20));
        click_timeNum=0;
    }else{
        clearTimeout(clt);
    }
}



function clearTimeNum(){
    click_timeNum=0;
}
var oldClickTiem=0;
/*************************************
 * 点击窗口
 * @param e
 * ct_list:为clickObj事件的一个公用属性，为了避免每次clickObj事件调用导致所有的属性初始化。
 */

function clickObj(e) {
    try {
//	showMes("放大效果："+(returnList("db_list")!=null),"red");
//	showMes("点击开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"red");
        if(addType==2){
            //如果是在修改漫游状态，取消点击事件
            addType=0;//同时清理修改状态
            return;
        }
//	showMes("bcType:"+bcType);
        if(bcType==1){
            click_timeNum++;
            //  showMes(click_timeNum);
            if(clt!=null){
                clearTimeout(clt);
                clt=setTimeout("clickTimeNum()", 500);
            }else{
                clt=setTimeout("clickTimeNum()", 500);
            }
            cet=setTimeout("clearTimeNum()", 1000);
            return;
        }

        var ct_list=null;
        var show_list=returnList("db_list");
        if(show_list!=null){
            ct_list=mapEntities;
        }else{
            ct_list=xmlEntities;
        }
        var redNum=0;//判断有多少个选择
        for(var i=0;i<ct_list.length;i++){
            if(ct_list[i].strokeColor=="red"&&ct_list[i].id!=9999){
                //showMes(ct_list[i].id);
                redNum++;
            }
        }
        var x = getCanXY(LK_CANVAS).x;// 获取鼠标当前在画布里x轴的坐标
        var y = getCanXY(LK_CANVAS).y;// 获取鼠标当前在画布里Y轴坐标
        var act=0;
        var color="";
        if(ct_list.length > 0){//获取窗口的类型和状态
            act=getClickObjId(x, y).active;
            color=getClickObjId(x, y).strokeColor;
        }
        /*showMes("redNum:"+redNum+" e.which:"+e.which+" act:"+act+" color:"+color);*/
        if((redNum>1&&e.which==3)||(act==1&&color=="red")){//判断选择了多个并且右键点击的时候
            return;
        }
        if (objType == 0) {
            // var keyType = null;

//		showMes("mouseX:"+x+" mouseY:"+y,"red");
            // 判断画布上是否有对象
            if (ct_list.length > 0) {
                var id =0; // 调用点击对象获取ID方法，把x和y坐标作参数，返回该坐标所在的对象的id
                try {
                    id = getClickObjId(x, y).id;
                } catch (e) {

                }

                var winNum=0;
                rightId=id;
//			playback_click_win({"win":id});//调用点击选择输出窗口
                $("#objId").val(rightId);
                // upAlert(id);
                // 判断是否按下CTRL键
                // showMes(e.ctrlKey);
                if ((typeof e.ctrlKey != "undefined") ? e.ctrlKey : e.modifiers
                    & Event.CONTROL_MASK > 0) {
                    //按下Ctrl键的时候
                    if(param_list!=null&&param_list!=""&&param_list.length>1){
                        param_list=null;
                    }else{
                        for ( var i = 0; i < ct_list.length; i++) {
                            if (id == parseInt(ct_list[i].id)&&ct_list[i].strokeColor=="white") {

                                if(ct_list[i].active==0){
                                    nwt=null;//不可以修改漫游窗口
                                }else if(ct_list[i].active==1){
                                    nwt=ct_list[i];//可以修改漫游窗口
                                }
                                ct_list[i].strokeColor = "red";
                                ct_list[i].lineWidth = 2;
                            }else if(id == parseInt(ct_list[i].id)&&ct_list[i].strokeColor=="red"){
                                if(buttonType!=2){
                                    ct_list[i].strokeColor = "white";
                                    ct_list[i].lineWidth = 1;
                                }
                            }
                        }
                    }
                }else {
                    //不按下Ctrl键
                    thisIp="";//初始化球机
                    // keyType = "keyUp";
                    mergeList= new Array();
                    //	showMes("param_list:"+param_list.length);

                    if(param_list!=null&&param_list!=""&&param_list.length>1){

                    }else{
                        for ( var i = 0; i < ct_list.length; i++) {
                            if (id == ct_list[i].id&&ct_list[i].id!=9999) {
                                if(ct_list[i].active==0){
                                    nwt=null;//不可以修改漫游窗口
                                }else if(ct_list[i].active==1){
                                    nwt=ct_list[i];//可以修改漫游窗口
                                }
//							showMes("x1:"+xmlEntities[i].x1+" y1:"+xmlEntities[i].y1+" x2:"+xmlEntities[i].x2+"  y2:"+xmlEntities[i].y2 ,"red")	;
                                if(ct_list[i].num==null	){
                                    winNum=id;
                                }else{
                                    winNum=ct_list[i].num;
                                }
                                var oilist= returnList("oiList");
                                var inputs=returnList("decoderList");
                                var appDecoder=returnSlist("appList");//p2p输入源数组
                                // upAlert(oilist);
                                if(oilist!=null&&inputs!=null){
                                    //把显示的输入源选择状态还原
                                    $(".node").each(function(){
                                        $(this).attr("style", "background-color:");
                                    });
                                    //把输入源分组的名称用不同颜色区别
                                    $("a").each(function(){
                                        if(this.id!=null){
                                            var id=this.id.substr(0,3);
                                            //upAlert(id);
                                            if(id=="sdg"){
                                                $(this).css("color","#1223D7");
                                                $(this).css("font-weight","bold");
                                            }
                                        }
                                    });
                                    if(appDecoder!=null){
                                        inputs=inputs.concat(appDecoder);  //拼接输入源字符串
                                    }
                                    //点击打印点击窗口当前的信息
                                    for(var j=0;j<oilist.length;j++){
                                        if(oilist[j].oi==id){
                                            thisNum=oilist[j].gn;
                                            var color="";
                                            var showtype="";
                                            if(oilist[j].cd=="0"){
                                                color="black";
                                                showtype=showJSTxt(indexJSList,21);
                                            }else if(oilist[j].cd=="1"){
                                                color="red";
                                                showtype=showJSTxt(indexJSList,22);
                                            }else if(oilist[j].cd=="2"){
                                                color="blue";
                                                showtype=showJSTxt(indexJSList,23);
                                            }else if(oilist[j].cd=="4"){
                                                color="blue";
                                                showtype=showJSTxt(js_1,45);
                                            }
                                            if(oilist[j].er!=0&&oilist[j].er!=null&&oilist[j].er!=""){
                                                color="red";
                                                showtype=showJSTxt(indexJSList,95)+" ("
                                                    +showJSTxt(paramJSTxt,82)+":"+oilist[j].er+")";
                                            }
                                        }
                                    }
                                }
                                ct_list[i].strokeColor = "red";
                                ct_list[i].lineWidth = 2;
                            } else {
                                ct_list[i].strokeColor = "white";
                                ct_list[i].lineWidth = 1;
                            }
                        }
                    }


                }
//			showMes("计算完毕："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"red");
                if(show_list!=null){
                    readObjByList(ct_list,LK_CANVAS);
                }else{
                    readObjByList();

                }
//			showMes("画图结束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"red");
//			get_voice(id);//查看音量
            }
            param_list=null;
        }
    } catch (e) {

        setError("clickObj",e);
    }
}

/*********************************
 * 添加窗口的方法
 * @param list;
 * @param obj;
 */
function addWin(list,obj) {
    try {
        var newObj=new Object();
        newObj.id=(obj.id!=null&&obj.id!=0)?obj.id:getId(list);
        newObj.num=newObj.id;
        newObj.sc=getId(list,"sc");
        if(list[0].mt==null||list[0].mt==0){
            newObj.x1=obj.x1;
            newObj.y1=obj.y1;
            newObj.x2=obj.x2;
            newObj.y2=obj.y2;
        }else if(list[0].mt==1){
            newObj.x1=0;
            newObj.y1=0;
            newObj.x2=dwh;
            newObj.y2=dwh;
            newObj.w=dwh;
            newObj.h=dwh;
            newObj.mt=1;
            newObj.st=newObj.id;
            newObj.mx1=obj.x1;
            newObj.my1=obj.y1;
            newObj.mx2=obj.x2;
            newObj.my2=obj.y2;
        }
        newObj.lineWidth=1;
        newObj.fillColor="black";
        newObj.strokeColor="white";
        newObj.active=1;
        newObj.type=0;
        list.push(newObj);

        return list;
    } catch (e) {
        showMes("addWin method error:"+e);
    }
}


/***********************************
 * 修改合并窗口的值
 * @param id
 * @param entity
 * @param name
 */
function modifyObj(id, entity,name) {
    var thisList=null;
    if(name!=null&&name=="db_list"){
        if (mapEntities == null || mapEntities.length < 1) {
            thisList = returnList('db_list');
        }else{
            thisList=mapEntities;
        }
    }else{
        if (xmlEntities == null || xmlEntities.length < 1) {
            thisList = returnList('ouputXml');
        }else{
            thisList=xmlEntities;
        }
    }
    for ( var i = 0; i < thisList.length; i++) {
        if (thisList[i].id == id) {
            thisList[i].id = entity.id;//唯一ID号,系统自动生成,不可修改
            thisList[i].num = entity.num;//序号,系统默认生成,可修改
            thisList[i].x1 = entity.x1;//开始X坐标
            thisList[i].y1 = entity.y1;//开始Y坐标
            thisList[i].x2 = entity.x2;//结束X坐标
            thisList[i].y2 = entity.y2;//结束Y坐标
            thisList[i].lineWidth = entity.lineWidth;//窗口边框大小
            thisList[i].strokeColor = entity.strokeColor;//窗口边框颜色
            thisList[i].fillColor = entity.fillColor;//窗口背景颜色
            thisList[i].active = entity.active;//窗口状态
            thisList[i].type = entity.type;//窗口类型:标准,放大
            if(entity.mt!=null){//窗口模式:标准,自定义
                thisList[i].mt=1;
                thisList[i].mx1 = entity.mx1;
                thisList[i].my1 = entity.my1;
                thisList[i].mx2 = entity.mx2;
                thisList[i].my2 = entity.my2;
                thisList[i].st=entity.st;
                thisList[i].w=entity.w;
                thisList[i].h=entity.h;
            }
        }
    }
    if(name!=null&&name=="db_list"){
        mapEntities=thisList;
    }else{
        xmlEntities=thisList;
    }
}
// 删除对象
function deleListObj(id,name) {
    if(name!=null&&name=="db_list"){
        if (mapEntities.length > 0) {
            for ( var i = 0; i < mapEntities.length; i++) {

                if (mapEntities[i].id == id) {

                    mapEntities.splice(i, 1);
                }
            }
        }
    }
    if (xmlEntities.length > 0) {
        for ( var i = 0; i < xmlEntities.length; i++) {

            if (xmlEntities[i].id == id) {

                xmlEntities.splice(i, 1);
            }
        }
    }
}




// 发送删除命令
function sendDeleteMerge(id) {
    var loginCode = returnSlist("loginCode");// 回去随机码
    var binary = new Uint8Array(9);// 创建一个数组，必须固定长度
    binary = setCode(binary, loginCode, 0x00, 0x00, 0x01, 0x02);
    binary[8] = id;// 固定编码 功能码 1
    // upAlert("开始发送数据");
    if(checkMes()){
        checkSend(binary);
    }else{
        upAlert(showJSTxt(indexJSList,14));
    }

}
// 发送修改命令
function sendUpdataMerge(binary, code1, code2, code3, code4,playType, id, layer, x1, y1,
                         x2, y2, width, hight) {

    if (binary.length > 22) {

        var loginCode = returnSlist("loginCode");// 回去随机码
        if(loginCode==null){
            return;
        }
        binary = setCode(binary, loginCode, code1, code2, code3, code4);
        binary[8] = playType;
        binary[9] = id;// 固定编码 功能码 1
        binary[10] = layer;
        binary[11] = x1 / 256;
        binary[12] = x1 % 256;
        binary[13] = y1 / 256;
        binary[14] = y1 % 256;
        binary[15] = x2 / 256;
        binary[16] = x2 % 256;
        binary[17] = y2 / 256;
        binary[18] = y2 % 256;
        binary[19] = width / 256;
        binary[20] = width % 256;
        binary[21] = hight / 256;
        binary[22] = hight % 256;
        // upAlert("开始发送数据");
        return binary;
    } else {
        return null;
        // upAlert("删除指令格式不正确");
    }

}






/*******************************************
 *判断自定义模式下，选择的窗口能否合并
 * @param list
 * @returns
 */
function checkMer(list){

    return false;
}

/***************************
 * 自定义模式下合并窗口
 */
function merDesign(){
    try {

        var show_list=returnList("db_list");
        var ctr_list=null;
        if(show_list!=null){
            ctr_list=mapEntities;
        }else{
            ctr_list=xmlEntities;
        }
        if (ctr_list != null) {
            var merList=new Array();//选择的窗口
            var ctr_obj=null;
            for(var i=0;i<ctr_list.length;i++){
                for(var j=0;j<ctr_list.length;j++){
                    if(ctr_list[i].mx2!=0&&ctr_list[i].my2!=0){
                        if(ctr_list[i].my1+1<ctr_list[j].my1||
                            (ctr_list[i].my1+1>ctr_list[j].my1&&
                            ctr_list[i].my1-1<ctr_list[j].my1&&ctr_list[i].mx1<ctr_list[j].mx1)){
                            ctr_obj=ctr_list[i];
                            ctr_list[i]=ctr_list[j];
                            ctr_list[j]=ctr_obj;
                        }
                    }
                }
            }
//			var str="";
//			showMes("ctr_list:"+JSON.stringify(ctr_list),"red");
            for(var i=0;i<ctr_list.length;i++){//获取选择的窗口
                if(ctr_list[i].strokeColor == "red"&&ctr_list[i].id!=9999){
//					str+=" "+ctr_list[i].num;
                    merList.push(ctr_list[i]);
                    for(var j=0;j<ctr_list.length;j++){
                        if(ctr_list[j].id==9999&&ctr_list[i].id==ctr_list[j].st){
                            merList.push(ctr_list[j]);
                        }
                    }
                }
            }
//			showMes("merList:"+JSON.stringify(merList),"blue");
//			showMes("str:"+str,"red");
            if(merList.length>1){
                var number=0;//最小坐标窗口id号
                var winNum=0;//窗口号
                var mx=0;//自定义开始X坐标
                var my=0;//自定义开始Y坐标
                var mx2=0;//自定义结束X坐标
                var my2=0;//自定义结束Y坐标
                var ww=0;//窗口总宽
                var wh=0;//窗口总高
                var idList=new Array();;//物理屏的ID号
                for(var i=0;i<merList.length;i++){
                    //收集所有选中的物理窗口ID号
                    var bool=true;
                    for(var j=0;j<idList.length;j++){
                        if(merList[i].sc==idList[j]){
                            bool=false;
                        }
                    }
                    if(bool){
                        //sc:物理屏号
                        if(merList[i].w<dwh||merList[i].h<dwh){
                            idList.push(merList[i].sc);
                        }else {

                            idList.push(merList[i].sc);
                            for(var j=0;j<ctr_list.length;j++){
                                if(ctr_list.id==9999&&merList[i].id==ctr_list[j].st){
                                    idList.push(ctr_list[j].sc);
                                }
                            }
                        }
                    }
                    //获取选择窗口的最小和最大坐标值
                    if(i==0){
                        mx=merList[i].mx1;
                        my=merList[i].my1;
                        mx2=merList[i].mx2;
                        my2=merList[i].my2;
                        number = merList[i].id;

                    }else if(merList[i].id!=9999){
                        if(merList[i].mx1<mx){
                            mx=merList[i].mx1;
                        }
                        if(merList[i].my1<my){
                            my=merList[i].my1;
                        }
                        if(merList[i].mx2>mx2){
                            mx2=merList[i].mx2;
                        }
                        if(merList[i].my2>my2){
                            my2=merList[i].my2;
                        }
                    }
                    //查出最左上角的ID号
                    if (merList[i].mx1 < mx && merList[i].my1 < my && merList[i].id!=9999) {
                        number = merList[i].id;
                        //判断是否存在序号属性,有则取值反则默认取ID号
                        if(merList[i].num==null){winNum=number;}
                        else {winNum=merList[i].num;}
                    }
                }
                if(idList.length>1){
                    var re_list=restore(merList);
                    if(re_list.length==idList.length){
                        //如果通过获取物理屏方法得到的物理屏个数和上面计算的格式一样的情况下就进行排序
                        idList=new Array();
                        if(re_list!=null&&re_list.lengt!=0){
                            for(var i=0;i<re_list.length;i++){
                                idList.push(re_list[i].id);
                            }
                        }
                    }
                }
                var winID=number;//窗口ID
                var winNUM=0;//窗口显示号
                var winSC=0;//窗口物理屏号
                for(var i=0;i<ctr_list.length;i++){//找到合并后左上角窗口的ID号，窗口号，物理屏号
                    if(ctr_list[i].id==number){
                        winNUM=ctr_list[i].num;
                        winSC=ctr_list[i].sc;
                    }
                }
//				showMes("list:"+JSON.stringify(idList)+" 最左ID:"+number+" 最小X:"+mx+" 最小Y:"+my+" 最大X:"+mx2+" 最大Y:"+my2,"red");
                var tx1 = 0;//判断窗口的开始X坐标
                var ty1 = 0;//判断窗口的开始Y坐标
                var tx2 = 0;//判断窗口的结束X坐标
                var ty2 = 0;//判断窗口的结束Y坐标
                var wn=0;//横向有多少物理屏
                var hn=0;//纵向有多少物理屏
                var wx1=0;//服务器运算开始X坐标
                var wy1=0;//服务器运算开始Y坐标
                var wx2=0;//服务器运算结束X坐标
                var wy2=0;//服务器运算结束Y坐标
                //求出物理屏的ID号数组
                for ( var i = 0; i < ctr_list.length; i++) {
                    if(ctr_list[i].active==1){
                        //如果是漫游、画中画就跳过
                        continue;
                    }
                    tx1 = parseFloat(ctr_list[i].mx1+1);
                    ty1 = parseFloat(ctr_list[i].my1+1);
                    tx2 = parseFloat(ctr_list[i].mx2-1);
                    ty2 = parseFloat(ctr_list[i].my2-1);
                    if(checkOverlap(tx1,ty1,tx2,ty2,mx,my,mx2,my2)&&ctr_list[i].strokeColor=="white"&&ctr_list[i].id!=9999){
                        //showMes("id:"+ctr_list[i].id+ " tx1:"+tx1+" ty1:"+ty1+" tx2:"+tx2+"ty2:"+ty2,"red");
                        upAlert(showJSTxt(indexJSList,30));
                        return;
                    }
                    if(idList.length>1){
                        for(var j=0;j<idList.length;j++){
                            if(ctr_list[i].sc==idList[j]&&ctr_list[i].id!=9999){
                                cline=1;
                                if(checkLine(mx,null,ctr_list[i].mx1,null)){
                                    hn++;
                                    wy2+=ctr_list[i].h;
                                }
                                if(checkLine(my,null,ctr_list[i].my1,null)){
                                    wn++;
                                    wx2+=ctr_list[i].w;
                                }
                            }
                        }
                    }
                }
                //	showMes("idList.length:"+idList.length+" ==>"+JSON.stringify(idList));
//				showMes("wy2:"+wy2+" wx2:"+wx2,"blue");
                //return;
                if(idList.length==1){
                    //单屏合并
                    //	showMes("单屏内合并","blue");
                    for(var i=0;i<merList.length;i++){//获取最小最大的物理坐标
                        if(i==0){
                            wx1=merList[i].x1;
                            wy1=merList[i].y1;

                        }
                        if(merList[i].x1<wx1){
                            wx1=merList[i].x1;
                        }
                        if(merList[i].y1<wy1){
                            wy1=merList[i].y1;
                        }
                    }
                    wx2=0;
                    wy2=0;
                    cline=1;
                    //	showMes("merList:"+JSON.stringify(merList),"blue");
                    for(var i=0;i<merList.length;i++){
                        if(checkLine(wx1,null,merList[i].x1,null)){
                            wy2+=merList[i].h;
                        }
                        if(checkLine(wy1,null,merList[i].y1,null)){
                            wx2+=merList[i].w;
                        }
                    }
                    //	showMes("wx1:"+wx1+" wy1:"+wy1+" wx2:"+wx2+" wy2:"+wy2 );
//					showMes("合并前:"+ctr_list.length);
//					showMes("wx1:"+wx1+" wy1:"+wy1+" wx2:"+wx2+" wy2:"+wy2,"red");
                    if((wy2+1>dwh)&&(wy2-1<dwh)){
                        wy2=dwh;
                    }
                    if((wx2+1>dwh)&&(wx2-1<dwh)){
                        wx2=dwh;
                    }
                    //	showMes("单屏合并前:"+JSON.stringify(ctr_list),"blue");
                    var splices=new Array();
                    try {
                        for(var i=0;i<merList.length;i++){
                            for(var j=0;j<ctr_list.length;j++){
                                if(ctr_list[j].id==merList[i].id&&ctr_list[j].id!=number){
                                    splices.push(ctr_list[j].id);
                                    ctr_list.splice(j,1);
                                }else if(ctr_list[j].id==merList[i].id&&ctr_list[j].id==number){
                                    ctr_list[j].x1=wx1;
                                    ctr_list[j].y1=wy1;
                                    ctr_list[j].x2=wx1+wx2;
                                    ctr_list[j].y2=wy1+wy2;
                                    ctr_list[j].mx1=mx;
                                    ctr_list[j].my1=my;
                                    ctr_list[j].mx2=mx2;
                                    ctr_list[j].my2=my2;
                                    ctr_list[j].w=wx2;
                                    ctr_list[j].h=wy2;
                                    ctr_list[j].strokeColor="white";
                                }
                            }
                        }
                    } catch (e) {
                        showMes(e,"red");
                    }
//					showMes("单屏合并:"+JSON.stringify(ctr_list),"red");
                    var oldList=returnList("ouputXml");
                    ctr_list=upAcWin(oldList,ctr_list);//修改当前合并窗口的时候影响到的漫游、画中画的窗口
                    saveList("ouputXml",ctr_list);
                    sessionStorage.setItem("upNum", "1");

                    var IFOlist=returnList("IFOlist");
                    try {
                        if(IFOlist!=null){
                            for(var i=0;i<splices.length;i++){
                                for(var j=0;j<IFOlist.length;j++){
                                    if(IFOlist[j].outputId==splices[i]){
                                        IFOlist.splice(j,1);
                                    }
                                }
                            }
                            sessionStorage.setItem("upIFOList",1);
                            saveList("IFOlist",IFOlist);
                        }
                    } catch (e) {

                        showMes(e);
                    }
                }else{//多屏拼接
                    //showMes("多屏内合并","red");
                    var nm_list=new Array();
                    var checkW=0;//判断物理屏的总宽
                    var checkH=0;//判断物理屏的总高
                    var beginX=null;//判断物理屏的最小X坐标
                    var beginY=null;//判断物理屏的最小Y坐标
                    var merType=0;//能否合并
                    var numW=0;//判断宽有几个窗口
                    var numH=0;//判断高有几个窗口
                    var ob=null;//以开始Y轴为起点纵向有几个窗口
                    var oj=null;//以开始X轴为起点横行有几个窗口
                    var on=0;//总共比较了几个窗口
                    var winList=new Array();//保存每行的窗口
//					showMes("beginX:"+beginX+" beginY:"+beginY,"yellow");
                    for(var i=0;i<ctr_list.length;i++){//获取当前物理屏窗口准备合并的起点XY坐标
                        for(var j=0;j<merList.length;j++){
                            if(ctr_list[i].id==merList[j].st&&ctr_list[i].active==0&&ctr_list[i].id!=9999){
                                if(beginX==null){
                                    beginX=ctr_list[i].mx1;
                                }else if(ctr_list[i].mx1<beginX){
                                    beginX=ctr_list[i].mx1;
                                }
                                if(beginY==null){
                                    beginY=ctr_list[i].my1;
                                }else if(ctr_list[i].my1<beginY){
                                    beginY=ctr_list[i].my1;
                                }
                            }
                        }
                    }
//					showMes("merList:"+JSON.stringify(merList),"red");
                    var mer_list=restore(merList);//选中的物理屏数组
//					

                    for(var i=0;i<mer_list.length;i++){//循环判断物理窗口是不是一样的大小
                        var iw=mer_list[i].x2-mer_list[i].x1;
                        var ih=mer_list[i].y2-mer_list[i].y1;
                        for(var j=0;j<mer_list.length;j++){
                            var jw=mer_list[j].x2-mer_list[j].x1;
                            var jh=mer_list[j].y2-mer_list[j].y1;
                            if(iw-jw>2||iw-jw<-2||ih-jh>2||ih-jh<-2){
//								showMes("iw:"+iw+" jw:"+jw+" ih:"+ih+" jh:"+jh);
//								showMes("aaa"+merList[i].id+" "+merList[j].id+" "+(iw-jw>2)+" "+
//										(iw-jw<-2)+" "+(ih-jh>2)+" "+(ih-jh<-2),"red");
                                upAlert(showJSTxt(indexJSList,31));
                                return false;
                            }
                        }
                    }
                    //计算合并的物品屏的物理坐标宽度和高度
                    cline=1;
//					showMes("beginX:"+beginX+" beginY:"+beginY);
                    for(var i=0;i<merList.length;i++){//获取当前准备合并的窗口的总宽和总高
//						showMes("beginX:"+beginX+" merList[i].mx1:"+merList[i].mx1+" bool:"+checkLine(beginX,null,merList[i].mx1,null),"yellow");

                        if(checkLine(beginX,null,merList[i].mx1,null)){
                            checkH+=merList[i].h;
//							showMes("checkH:"+checkH);
                        }
                        if(checkLine(beginY,null,merList[i].my1,null)){
                            checkW+=merList[i].w;
//							showMes("checkW:"+checkW);
                        }
                    }
                    try {
                        //mer_list数组是物理屏数组
//						showMes("idList:"+idList);	
//						showMes("beginX:"+beginX+" beginY:"+beginY);
//						showMes("mer_list:"+JSON.stringify(mer_list),"blue");
                        for(var i=0;i<mer_list.length;i++){//
//						showMes("id:"+mer_list[i].id+" x1:"+mer_list[i].x1
//								+"  bool:"+checkLine(beginX,null,mer_list[i].x1,null),"yellow");
                            if(checkLine(beginX,null,mer_list[i].x1,null)){
                                numH++;
                                ob=new Object();
                                ob.y=mer_list[i].y1;
                                ob.y2=mer_list[i].y2;
                                ob.list=new Array();
                                winList.push(ob);
                            }
                            if(checkLine(beginY,null,mer_list[i].y1,null)){
                                numW++;
                            }
//						showMes("winList:"+winList.length);

                        }
                        if(winList.length>0){
                            for(var is=0;is<winList.length;is++){
                                for(var i=0;i<mer_list.length;i++){
//								showMes("y:"+winList[is].y+" my1:"+mer_list[i].y1+"id:"+mer_list[i].id
//												+"  bool:"+checkLine(winList[is].y,null,mer_list[i].y1,null));
                                    cline=1;
                                    if(checkLine(winList[is].y,null,mer_list[i].y1,null)){
                                        on++;
                                        oj=new Object();
                                        oj.id=mer_list[i].id;
                                        oj.x=mer_list[i].x1;
                                        oj.x2=mer_list[i].x2;
                                        winList[is].list.push(oj);
                                    }
                                }
                            }
                        }
//					showMes("winList:"+JSON.stringify(winList),"red");
                        if(numH*numW==idList.length){//在规则下合并判断
                            for(var i=0;i<winList.length;i++){
                                if((i+1)<winList.length){
                                    if(winList[i+1].y-winList[i].y2>1){
                                        merType=1;
                                        break;
                                    }
                                }
                                if(winList[i].list!=null&&winList[i].list.length>1){
                                    var ths=winList[i].list;//获取二维数组
                                    for(var j=0;j<ths.length;j++){
                                        if(((j+1)<ths.length)&&ths[j+1].x-ths[j].x2>1){
                                            merType=2;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    } catch (e) {

//						showMes("错误:"+e);
                    }
//					showMes("ctr_list:"+JSON.stringify(ctr_list),"blue");
//					showMes("checkW:"+checkW+" checkH:"+checkH+"  beginX:"+beginX+"  beginY:"+beginY
//							+" numH:"+numH+" numW:"+numW,"red");
//					showMes("winList数量:"+winList.length,"red");
//				showMes("winList值:"+JSON.stringify(winList),"blue");
//					showMes("merType:"+merType+" on:"+on);
                    var ww_s=0;//该合并由多少个规则窗口
                    for(var i=0;i<winList.length;i++){
                        if(winList[i].list!=null){
                            ww_s+=winList[i].list.length;
                        }
                    }
                    var merWins=new Array();
                    for(var i=0;i<ctr_list.length;i++){//获取选择的窗口
                        if(ctr_list[i].strokeColor == "red"){
                            //	str+=" "+ctr_list[i].id;
                            for(var j=0;j<ctr_list.length;j++){
                                if(ctr_list[j].st==ctr_list[i].id){
                                    merWins.push(ctr_list[j]);
                                }
                            }
                        }
                    }
//					showMes("merWins:"+JSON.stringify(merWins));
//					showMes("checkW:"+checkW+" checkH:"+checkH+" %w: "+checkW%dwh+" %h: "+
//							checkH%dwh+" /w: "+checkW/dwh+" /h: "+checkH/dwh,"red");
                    if(checkW%dwh!=0&&checkW%dwh+1>dwh&&checkW%dwh-1<dwh){
                        checkW=parseInt((checkW+1)/dwh)*dwh;
                    }
                    if(checkH%dwh!=0&&checkH%dwh+1>dwh&&checkH%dwh-1<dwh){
                        checkH=parseInt((checkH+1)/dwh)*dwh;
                    }
//					showMes("checkW:"+checkW+" checkH:"+checkH+" %w: "+checkW%dwh+" %h: "+
//							checkH%dwh+" /w: "+checkW/dwh+" /h: "+checkH/dwh,"blue");
//					
                    if(checkW==0||checkH==0||parseInt(checkW)%dwh!=0||parseInt(checkH)%dwh!=0){
//						showMes("checkW:"+checkW+" checkH:"+checkH+"  "+checkW%dwh+"  "+checkH%dwh);
                        upAlert(showJSTxt(indexJSList,30));
                        return;
                    }else if(numH*numW!=on||merType!=0){
//						showMes("numH:"+numH+" numW:"+numW+" on:"+on+" merType:"+merType);
                        upAlert(showJSTxt(indexJSList,30));
                        return;
                    }else if(ww_s!=mer_list.length){
//						showMes("ww_s:"+ww_s+" merWins:"+merWins.length+" mer_list:"+mer_list.length+" numH:"+numH+" numW:"+numW);
                        //判断根据规则排列的数组长度与排列前物理屏数组的长度是否一致
                        upAlert(showJSTxt(indexJSList,30));
                        return;
                    }
                    //			showMes("idList:"+JSON.stringify(idList),"black");
                    var marNum=0;//多屏合并状态:0=物理屏内没有拆分的窗口合并,1=物理屏内有小窗口合并
                    for(var j=0;j<idList.length;j++){
                        for(var i=0;i<ctr_list.length;i++){
                            if(ctr_list[i].sc==idList[j]&&(ctr_list[i].w<dwh||ctr_list[i].w<dwh)){
                                marNum=1;
                            }
                        }
                    }
                    var newMerList=new Array();//合并后全部窗口的数组
                    try{
                        //	showMes("marNum:"+marNum,"blue");
                        if(marNum==0){//处理单屏或单拼屏合并
//						showMes("多个拼屏或单拼屏合并:wx2:"+wx2+" wy2:"+wy2,"red");
                            wn=wx2/dwh;
                            hn=wy2/dwh;
                            var nm_obj=true;
                            for(var i=0;i<ctr_list.length;i++){
                                //先判断数组中哪些数据没有进行合并操作然后保存到合并后的数组
                                nm_obj=true;
                                for(var j=0;j<idList.length;j++){
                                    if(ctr_list[i].sc==idList[j]){
                                        nm_obj=false;
                                    }
                                }
                                if(nm_obj){
                                    newMerList.push(ctr_list[i]);
                                }
                            }
//							showMes("number:"+number+" mx:"+mx+ " my:"+my+" mx2:"+mx2+" my2:"+my2+" dwh:"+dwh+" hn:"+hn+" wn:"+wn,"red");		
                            for(var i=0;i<winList.length;i++){
                                var w_ls=winList[i].list;
                                for(var j=0;j<w_ls.length;j++){
                                    var w_obj=null;//物理屏数据
                                    if(w_ls[j].id==winSC){
                                        w_obj={"id":winID,"num":winNUM,"sc":winSC,"x1":wx1,"y1":wy1,
                                            "x2":(wx1+dwh),"y2":(wy1+dwh),"mx1":mx,"my1":my,"mx2":mx2,
                                            "my2":my2,"w":wx2,"h":wy2,"st":winID,"mt":1,"lineWidth":1,
                                            "fillColor":"black","strokeColor":"white","type":0,"active":0};
                                    }else{
                                        w_obj={"id":9999,"num":9999,"sc":w_ls[j].id,"x1":wx1,"y1":wy1,
                                            "x2":(wx1+dwh),"y2":(wy1+dwh),"mx1":mx,"my1":my,"mx2":mx2,
                                            "my2":my2,"w":wx2,"h":wy2,"st":winID,"mt":1,"lineWidth":1,
                                            "fillColor":"black","strokeColor":"white","type":0,"active":0};
                                    }
                                    if((j+1)%wn!=0){
                                        wx1+=dwh;
                                    }else{
                                        wx1=0;
                                        wy1+=dwh;
                                    }
                                    newMerList.push(w_obj);
                                }
                            }
//							 showMes("多物理屏合并:"+JSON.stringify(newMerList),"blue"); 
//							 readObjByList(newMerList);
                        }else{//处理单屏拆分屏拼接屏合并
//						showMes("多个单屏拆分屏拼屏合并","red");
                            wn=0;
                            hn=0;
//							showMes("ww_s:"+ww_s+" merWins:"+merWins.length+" mer_list:"
//									+mer_list.length+" numH:"+numH+" numW:"+numW);
                            //						showMes("mer_list:"+mer_list.length);
                            //	showMes("idList:"+JSON.stringify(idList),"red");
                            //showMes("number:"+number+"mx:"+mx+ " my:"+my+" wx1:"+wx1+" wy1:"+wy1+" wn:"+wn+" hn:"+hn,"red");

                            var bool=true;
                            for(var i=0;i<ctr_list.length;i++){//保存没选择的窗口
                                bool=true;
                                for(var j=0;j<idList.length;j++){
                                    if(ctr_list[i].sc==idList[j]){
                                        bool=false;
                                    }
                                }
                                if(bool){
                                    newMerList.push(ctr_list[i]);
                                }
                            }
//							var winID=number;//窗口ID
//							var winNUM=0;//窗口显示号
//							var winSC=0;//窗口物理屏号
                            //保存选择合并后的窗口
//							showMes("winID:"+winID+" winNUM:"+winNUM+" winSC:"+winSC,"red");

                            for(var i=0;i<idList.length;i++){
                                for(var j=0;j<ctr_list.length;j++){
                                    if(idList[i]==winSC&&ctr_list[j].sc==idList[i]&&
                                        ctr_list[j].x1==0&&ctr_list[j].y1==0){
                                        if(ctr_list[j].sc==null){
                                            //设置物理屏序号
                                            ctr_list[j].sc=ctr_list[j].id;
                                        }
                                        ctr_list[j].x1=wx1;
                                        ctr_list[j].y1=wy1;
                                        ctr_list[j].x2=dwh;
                                        ctr_list[j].y2=dwh;
                                        ctr_list[j].mx1=mx;
                                        ctr_list[j].my1=my;
                                        ctr_list[j].mx2=mx2;
                                        ctr_list[j].my2=my2;
                                        ctr_list[j].st=number;
                                        ctr_list[j].w=numW*dwh;
                                        ctr_list[j].h=numH*dwh;
                                        newMerList.push(ctr_list[j]);
                                    }else if((ctr_list[j].id!=9999&&ctr_list[j].sc==idList[i]
                                        &&ctr_list[j].x1==0&&ctr_list[j].y1==0)
                                        ||(ctr_list[j].id==9999&&ctr_list[j].sc==idList[i])){
                                        if(i%numW!=0){
                                            wx1+=dwh;
                                        }else{
                                            wx1=0;
                                            wy1+=dwh;
                                        }
                                        ctr_list[j].id=9999;
                                        ctr_list[j].num=9999;
                                        if(ctr_list[j].sc==null){
                                            //设置物理屏
                                            ctr_list[j].sc=ctr_list[j].id;
                                        }
                                        ctr_list[j].x1=wx1;
                                        ctr_list[j].y1=wy1;
                                        ctr_list[j].x2=wx1+dwh;
                                        ctr_list[j].y2=wy1+dwh;
                                        ctr_list[j].mx1=mx;
                                        ctr_list[j].my1=my;
                                        ctr_list[j].mx2=mx2;
                                        ctr_list[j].my2=my2;
                                        ctr_list[j].st=number;
                                        ctr_list[j].w=numW*dwh;
                                        ctr_list[j].h=numH*dwh;
                                        ctr_list[j].strokeColor="white";
                                        ctr_list[j].lineWidth=1;
                                        newMerList.push(ctr_list[j]);
                                    }
                                }
                            }
                        }
                    }catch(e){
                        showMes(e);
                        return;
                    }
                    for(var i=0;i<newMerList.length;i++){
                        newMerList[i].strokeColor="white";
                        newMerList[i].lineWidth=1;
//						if(newMerList[i].sc==1||newMerList[i].sc==2||newMerList[i].sc==6||newMerList[i].sc==7){
//							showMes(JSON.stringify(newMerList[i]),"red");
//						}
                    }
                    //return;
                    //	showMes("合并(newMerList:"+JSON.stringify(newMerList)+")","blue");
                    sessionStorage.setItem("upNum", "1");
                    //	readObjByList(newMerList);
                    //	return;
                    var oldList=returnList("ouputXml");
                    newMerList=upAcWin(oldList,newMerList);//针对当前修改的窗口所影响的漫游、画中画窗口进行修改
                    saveList("ouputXml",newMerList);
                    try{//修改合并后的对应关系
                        var splices=new Array();
                        var bool=true;
                        var IFOlist=returnList("IFOlist");
                        if(IFOlist!=null&&splices!=null){
                            for(var i=0;i<IFOlist.length;i++){
                                bool=true;
                                for(var j=0;j<newMerList.length;j++){
                                    if(IFOlist[i].outputId==newMerList[j].id&&newMerList[j].mx2!=0&&newMerList[j].my2!=0){
                                        bool=false;
                                    }
                                }
                                if(bool){
                                    splices.push(IFOlist[i].id);
                                }
                            }
                            //					showMes("新splices:"+JSON.stringify(splices),"red");
                            //					showMes("旧IFOlist:"+IFOlist.length,"blue");
                            for(var i=0;i<splices.length;i++){
                                for(var j=0;j<IFOlist.length;j++){
                                    if(splices[i]==IFOlist[j].id){
                                        IFOlist.splice(j,1);
                                    }
                                }
                            }
                            //	showMes("新IFOlist:"+IFOlist.length,"blue");
                            sessionStorage.setItem("upIFOList",1);
                            saveList("IFOlist",IFOlist);
                        }
                    }catch (e) {

                        setError("自定义合并",e);
                    }

                }
//				sendJSONForServer("ouputXml", returnList("ouputXml"));
                param_list=null;
                loadXml();//合并后从新加载窗口
                var wins=returnList("ouputXml");
                var ifo=returnList("IFOlist");
                //showMes("ifo:"+JSON.stringify(ifo));
                if(LK_CAN_OBJ!=null){
                    var rStr=getExt(1,"ouputXml",wins);
                    var iStr=(ifo!=null)?getExt(1,"IFOlist",ifo):"";
                    LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
                    LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口


                }
            }
        }
    } catch (e) {
        setError("merDesign", e);
    }
}



/*****************************
 * 标准模式下合并选择的输出窗口
 * mergeList:选择的输出窗口数组
 * mergeObject:合并之后的窗口
 */
var mergeList = null;
var mergeObject = new Object();
function mergeObj() {
    var show_list=returnList("db_list");
    var ctr_list=null;
    if(show_list!=null){
        ctr_list=mapEntities;
    }else{
        ctr_list=xmlEntities;
    }
    if (ctr_list != null) {
        mergeList=new Array();
        // showMes("有多少个"+xmlEntities.length);
        var a = 0;// 新数组下标
        var minX = 0;// 最小X轴坐标
        var minY = 0;// 最小Y轴坐标
        var maxX = 0;// 最大X轴坐标
        var maxY = 0;// 做大Y轴坐标
        var number = 0;// 左上角的ID
        var winNum=0;//左上角的序号
        var mergeType = true;// 是否能够合并
        var no=null;
        //从新根据窗口的坐标从上到下，从左到右排序
        for(var i=0;i<ctr_list.length;i++){
            for(var j=0;j<ctr_list.length;j++){
                if(ctr_list[i].y1+1<ctr_list[j].y1||
                    (ctr_list[i].y1+1>ctr_list[j].y1&&ctr_list[i].y1-1<ctr_list[j].y1
                    &&ctr_list[i].x1<ctr_list[j].x1)){
                    no=ctr_list[i];
                    ctr_list[i]=ctr_list[j];
                    ctr_list[j]=no;
                }
            }
        }
        for ( var i = 0; i < ctr_list.length; i++) {
            if (ctr_list[i].strokeColor == "red"&& parseInt(ctr_list[i].type) != 1) {//获取选中的窗口
                mergeList[a] = ctr_list[i];
                a++;//计算多少个选中的窗口
                var id = ctr_list[i].id;//获取ID号
                if (number == 0) {
                    minX = ctr_list[i].x1;
                    minY = ctr_list[i].y1;
                    number = id;
                    //判断是否存在序号属性,有则取值反则默认取ID号
                    if(ctr_list[i].num==null){
                        winNum=id;
                    }else {
                        winNum=ctr_list[i].num;
                    }
                }
                /********************
                 * 查找出输出窗口的最小值和最大值
                 */
                if (ctr_list[i].x1 < minX){
                    minX = ctr_list[i].x1;
                }
                if (ctr_list[i].y1 < minY) {
                    minY = ctr_list[i].y1;
                }
                if (ctr_list[i].x2 > maxX) {
                    maxX = ctr_list[i].x2;
                }
                if (ctr_list[i].y2 > maxY) {
                    maxY = ctr_list[i].y2;
                }

                //查出最左上角的ID号
                if (ctr_list[i].x1 < minX && ctr_list[i].y1 < minY) {
                    number = id;
                    //判断是否存在序号属性,有则取值反则默认取ID号
                    if(ctr_list[i].num==null){winNum=id;}
                    else {winNum=ctr_list[i].num;}
                }
            }
        }
        //标准模式下合并
        if (mergeList.length < 2) {
            mergeType = false;
        }else {
            for ( var i = 0; i < ctr_list.length; i++) {
                var x1 = ctr_list[i].x1;
                var y1 = ctr_list[i].y1;
                var x2 = ctr_list[i].x2;
                var y2 = ctr_list[i].y2;
                var color=ctr_list[i].strokeColor;
                var objType = parseInt(ctr_list[i].type);
                if(ctr_list[i].active==1){
                    continue;
                }
                if (x1 >= (minX+1) && y1 >= (minY+1) && x2 <= (maxX-1) && y2 <= maxY) {
                    if (ctr_list[i].strokeColor == "white" && objType != 1) {
                        mergeType = false;
                    } else if (ctr_list[i].strokeColor == "red"
                        && objType == 1) {
                        mergeType = false;
                    }
                }else if(x1>(minX+1)&&y2>(minY+1)&&x1<(maxX-1)&&y2<(maxY-1)&&color=="white"){
//					showMes("第一种情况,id:"+xmlEntities[i].id+" x1:"+x1+" y2:"+y2+
//							" minX:"+minX+" minY:"+minY+" maxX:"+maxX+" maxY:"+maxY);
                    mergeType = false;
                }else if(x1>(minX+1)&&y1>(minY+1)&&x1<(maxX-1)&&y1<(maxY-1)&&color=="white"){
//						 showMes("第二种情况,id:"+xmlEntities[i].id+" x1:"+x1+" y1:"+y1+
//								 " minX:"+minX+" minY:"+minY+" maxX:"+maxX+" maxY:"+maxY);
                    mergeType = false;
                }else if(x2>(minX+1)&&y1>(minY+1)&&x2<(maxX-1)&&y1<(maxY-1)&&color=="white"){

//					showMes("第三种情况,id:"+xmlEntities[i].id+" x2:"+x2+" y1:"+y1+
//							" minX:"+minX+" minY:"+minY+" maxX:"+maxX+" maxY:"+maxY);
                    mergeType = false;
                }else if(x2>(minX+1)&&y2>(minY+1)&&x2<(maxX-1)&&y2<(maxY-1)&&color=="white"){
//						 showMes("第四种情况,id:"+xmlEntities[i].id+" x2:"+x2+" y2:"+y2+
//								 " minX:"+minX+" minY:"+minY+" maxX:"+maxX+" maxY:"+maxY);
                    mergeType = false;

                }else if(x1>(minX+1)&&y1<=(minY+1)&&x2<(maxX-1)&&y2>=(maxY-1)&&color=="white"){
//					 showMes("第五种情况,id:"+xmlEntities[i].id);
                    mergeType = false;
                }else if(x1<=(minX+1)&&y1>(minY+1)&&x2>=(maxX-1)&&y2<(maxY-1)&&color=="white"){
//					 showMes("第六种情况,id:"+xmlEntities[i].id);
                    mergeType = false;
                }
            }
            if (mergeType) {
                // upAlert(" mergeList:"+mergeList.length);
                mergeObject = new Object();
                mergeObject.id = number;
                mergeObject.num=winNum;
                mergeObject.x1 = minX;
                mergeObject.y1 = minY;
                mergeObject.x2 = maxX;
                mergeObject.y2 = maxY;
                mergeObject.lineWidth = 1;
                mergeObject.strokeColor = "white";
                mergeObject.fillColor = "black";
                mergeObject.active = 0;
                mergeObject.type = 0;
                if(check_config("1")){
//						sessionStorage.setItem("upNum", "1");
                    hebin();

                }
            } else {
                upAlert(showJSTxt(indexJSList,30));
            }
        }
    }

}
///*************************
// * 
// * @param list 窗口配置文件
// * @returns 
// */
//function getRatio(list){
//	 var obj =new Object();
//	 var size=localStorage.getItem("size");
//	 var en=0;//初始化每一行多少个窗口
//	 var tn=0;//初始化每一列多少个
//	 var to=0;
//	 var maxX=getMax(list).x;
//	 var maxY=getMax(list).y;
//	 if(size!=null){
//		 var params=size.split("/");
//		 showMes("size:"+size+"  params:"+params.length,"black");
//			 tn=params[0];
//			 en=params[1];
//			 to=params[2];
//		for(var i=0;i<ratios.length;i++){
//			if(ratios[i].id==to){
//				obj.x=ratios[i].w/(maxX/en);
//			
//			}
//		}
//	 }else{
//		 
//	 }
//	return obj;
//}
/// 检测拆分合并是否很符合物理屏输出
/*******************************
 * 检测拆分合并是否符合物理屏输出
 * @param type
 */
function  check_config(type){
//	$("#ccc p").remove();
//	getRatio();
    var en=sessionStorage.getItem("lineNum");//初始化每一行多少个窗口
    var tn=sessionStorage.getItem("listNum");//初始化每一列多少个
    var windows=null;

    var maxX=0;
    var maxY=0;
    var minX=0;
    var minY=0;
    if(returnList("db_list")!=null){
        windows=returnList("db_list");
    }else{
        windows=returnList("ouputXml");
    }
//	showMes("MINwindow:"+JSON.stringify(getMin(windows))+" MAXwindow:"+JSON.stringify(getMax(windows)));
    maxX=getMax(windows).x;
    maxY=getMax(windows).y;
    minX=getMin(windows).x;
    minY=getMin(windows).y;
    var windowX=(maxX-minX)/en;
    var windowY=(maxY-minY)/tn;
//	showMes("en:"+en+" tn:"+tn+" maxX:"+maxX+" maxY:"+maxY+" minX:"+minX+" minY:"+minY+" windowX:"+windowX+" windowY:"+windowY,"red");
    if(en==null||tn==null){
        return;
    }
//	 showMes("获取有行几列："+en+" "+tn);
    var canvaNum = en * tn;// 多少个对象
    // 每一个对象的属性
    var beginX = minX;// 开始X轴坐标
    var beginY = minY;// 开始Y轴坐标
    var canvaWidth = (maxX-minX)/en;// 每个对象的宽度
    var canvaHeight = (maxY-minY)/tn;// 每个对象的高度
// localStorage.setItem("initWidth",canvaWidth);
// localStorage.setItem("initHeight",canvaHeight);
    // upAlert(canvaNum+" "+canvaWidth+" "+canvaHeight);
    var list=new Array();
    var obj="";
    /*****************************
     * 模模拟生成物理屏的窗口
     */
    for ( var i = 0; i < canvaNum; i++) {
        // 把对象生成到数组里面
        obj = new Object();
        obj.id = getId(list);
        obj.x1 = beginX;
        obj.y1 = beginY;
        obj.x2 = beginX + canvaWidth;
        obj.y2 = beginY + canvaHeight;
        obj.num=0;

        list[i] = obj;
        if ((i + 1) % en == 0) {
            beginX = minX;
            beginY = beginY + canvaHeight;
        } else {
            beginX = beginX + canvaWidth;
        }
    }
    if(returnList("db_list")!=null){
        for(var i=0;i<list.length;i++){

            list[i].x1=list[i].x1+num_x;
            list[i].y1=list[i].y1+num_y;
            list[i].x2=list[i].x2+num_x;
            list[i].y2=list[i].y2+num_y;
        }
    }
    // upAlert("初始化有几个窗口："+list.length+" "+mergeObject);
    if(mergeObject!=null&&type==1){

        // upAlert("开始判断自动模式下合并操作");
        var x1=mergeObject.x1+num_x;
        var y1=mergeObject.y1+num_y;
        var x2=mergeObject.x2+num_x;
        var y2=mergeObject.y2+num_y;
        var ow=x2-x1;
        var oh=y2-y1;
        //showMes(JSON.stringify(mergeObject),"red");
        var remainderW=ow%windowX;
        var remainderH=oh%windowY;
        var remainderX=x2%windowX;
        var remainderY=y2%windowY;
        var divisorX=ow/windowX;
        var divisorY=oh/windowY;

//		showMes("窗口宽:"+ow.toFixed(6)+" 窗号高:"+oh.toFixed(6)+" 物理屏宽;"+windowX.toFixed(6)+" 物理屏高:"+windowY.toFixed(6));
        if(ow<=windowX+1&&oh<=windowY+1){
            var bool=0;
//		showMes("合并： x1:"+(x1+1)+" y1:"+(y1+1)+" x2:"+(x2-1)+" y2:"+(y2-1)+" num_x"+num_x+" num_y:"+num_y,"blue");
            for(var i=0;i<list.length;i++){
//				showMes("合并：list[i].x1:"+list[i].x1+" list[i].y1:"+list[i].y1+" list[i].x2:"+list[i].x2+" list[i].x1:"+list[i].y2);	
                if((x1+1)>=list[i].x1&&(y1+1)>=list[i].y1&&(x2-1)<=list[i].x2&&(y2-1)<=list[i].y2){
                    bool++;
                }
            }
//			showMes("合并：小屏:"+bool,"black");
            if(bool==0){
                upAlert(showJSTxt(indexJSList,30));
                return false;
            }

        }else if(ow>windowX+1||oh>windowY+1){
//			showMes("remainderX:"+remainderX+" remainderY:"
//					+remainderY+"remainderW:"
//					+remainderW+" remainderH:"
//					+remainderH+"  divisorX:"
//					+divisorX+" divisorY:"
//					+divisorY,"black");
            if(divisorX>1||divisorY>1){
//				showMes(" "+ (windowX-1>remainderW&&remainderW>1)+" "+
//				   (windowY-1>remainderH&&remainderH>1)+" "+
//				   (windowX-1>remainderX&&remainderX>1)+" "+
//				   (windowY-1>remainderY&&remainderY>1),"red");
//				
                if((windowX-1>remainderW&&remainderW>1)||
                    (windowY-1>remainderH&&remainderH>1)||
                    (windowX-1>remainderX&&remainderX>1)||
                    (windowY-1>remainderY&&remainderY>1)){
                    upAlert(showJSTxt(indexJSList,30));
                    return false;
                }
            }
        }
    }else if(splistList!=null&&type==2){

        var sl=splistList;
        // upAlert("判断数组:"+sl.length);
        var mx=0;
        var my=0;
        for(var i=0;i<list.length;i++){
            if(list[i].x2>mx){
                mx=list[i].x2;
            }
            if(list[i].y2>my){
                my=list[i].y2;
            }
        }
        for(var i=0;i<list.length;i++){//循环判断是否超出数量
            if(list[i].active==1){
                continue;
            }
            for(var j=0;j<sl.length;j++){//
                if(sl[j].active==1){
                    continue;
                }
                x1=sl[j].x1+num_x;
                y1=sl[j].y1+num_y;
                x2=sl[j].x2+num_x;
                y2=sl[j].y2+num_y;
                if(((x1+1)>list[i].x1&&(y1+1)>list[i].y1&&(x2-1)<list[i].x2&&(y2-1)<list[i].y2)){
                    //showMes(  "   id:"+sl[j].id+"  开始("+x1+","+y1+")  结束("+x2+","+y2+")  对比:开始("
                    //	+list[i].x1+","+list[i].y1+")  结束("+list[i].x2+","+list[i].y2+")","black");
                    list[i].num=parseInt(list[i].num)+1;
                }
                ow=x2-x1;
                oh=y2-y1;
//				showMes( "id:"+sl[j].id+"  x1:"+x1+" y1:"+y1+" x2:"+x2+" y2:"+y2+" 对象宽度："+ow+" 对象高度："+oh+" windowX:"+windowX,"red");

                var remainderW=ow%windowX;
                var remainderH=oh%windowY;
                var remainderX=x2%windowX;
                var remainderY=y2%windowY;
//				var divisorX=ow/windowX;
//				var divisorY=oh/windowY;
//				showMes("拆分：sl[j].x1："+sl[j].x1+" sl[j].y1:"+sl[j].y1+" sl[j].x2:"+sl[j].x2+" sl[j].y2:"
//						+" sl[j].y2:"+sl[j].y2+" num_x:"+num_x+" num_y:"+num_y);
                if(ow<=windowX&&oh<=windowY){

                    if((x1+1)<list[i].x1&&(x2-1)>list[i].x1){
//						showMes( "拆分：id:"+sl[j].id+" x1:"+x1+"  x2:"+x2+" y1:"+y1+"  y2:"+y2+"  list[i].x1:"+list[i].x1+"  list[i].x2:"+list[i].x2
//								+"  list[i].y1:"+list[i].y1+"  list[i].y2:"+list[i].y2,"black");
////						
                        upAlert(showJSTxt(indexJSList,32));
                        return false;
                    }else if((x1+1)<list[i].x2&&(x2-1)>list[i].x2){
//						showMes( "拆分：id:"+sl[j].id+" x1:"+x1+"  x2:"+x2+" y1:"+y1+"  y2:"+y2+"  list[i].x1:"+list[i].x1+"  list[i].x2:"+list[i].x2
//								+"  list[i].y1:"+list[i].y1+"  list[i].y2:"+list[i].y2,"black");
////						
                        upAlert(showJSTxt(indexJSList,32));
                        return false;
                    }else if((y1+1)<list[i].y1&&(y2-1)>list[i].y1){
//						showMes( "拆分：id:"+sl[j].id+" x1:"+x1+"  x2:"+x2+" y1:"+y1+"  y2:"+y2+"  list[i].x1:"+list[i].x1+"  list[i].x2:"+list[i].x2
//								+"  list[i].y1:"+list[i].y1+"  list[i].y2:"+list[i].y2,"black");
////						
                        upAlert(showJSTxt(indexJSList,32));
                        return false;
                    }else if((y1+1)<list[i].y2&&(y2-1)>list[i].y2){
//						showMes( "拆分：id:"+sl[j].id+" x1:"+x1+"  x2:"+x2+" y1:"+y1+"  y2:"+y2+"  list[i].x1:"+list[i].x1+"  list[i].x2:"+list[i].x2
//								+"  list[i].y1:"+list[i].y1+"  list[i].y2:"+list[i].y2,"black");
////						
                        upAlert(showJSTxt(indexJSList,32));
                        return false;
                    }
                }else if(ow>windowX+1||oh>windowY+1){
                    if(windowX-1>remainderW&&remainderW>1||windowY-1>remainderH&&remainderH>1||windowX-1>remainderX&&remainderX>1||windowY-1>remainderY&&remainderY>1){
//					showMes("拆分： id:"+list[i].id+"  x1:"+list[i].x1+"  y1:"+list[i].y1+" x2:"+list[i].x2+" y2:"+list[i].y2,"red");
//					showMes("拆分： ow:"+ow+"  oh:"+oh+  "  windowX:"+windowX+" windowY:"+windowY,"red");
//					showMes("拆分："+(windowX-1>remainderW)+" "+(remainderW>1)+" "+(windowY-1>remainderH&&remainderH>1)+" "+(windowX-1>remainderX&&remainderX>1)+" "+(windowY-1>remainderY)+" "+(remainderY>1),"red");
//					
                        upAlert(showJSTxt(indexJSList,32));
                        return false;
                    }
                }

            }
            // upAlert("第"+(i+1)+"个输出框"+list[i].num);

            if(list[i].num>36){
                upAlert(showJSTxt(indexJSList,32));
//				showMes("超出解码能力！");
                return false;
            }
        }
//		var str="";
//		for(var a=0;a<list.length;a++){
//			str+="id:"+list[a].id+"  数量:"+list[a].num+" ";
//			showMes(str,"red");
//		}
    }else{
        //upAlert("操作失败！");
        return false;
    }
    return true;
}
// 得到服务器返回的合并指令，客户端开始合并
function hebin() {
    if(returnList("db_list")!=null){//判断是否在打开导航器情况下合并窗口
        modifyObj(mergeObject.id, mergeObject,"db_list");
        var mer_list=new Array();
        var mer_obj=new Object();
        if(mergeList!=null&&xmlEntities!=null){
            for(var i=0;i<mergeList.length;i++){
                for(var j=0;j<xmlEntities.length;j++){
                    if(mergeList[i].id==xmlEntities[j].id){
                        mer_list.push(xmlEntities[j]);
                        if(mer_obj.id==null){//获取第一个比较的对象
                            mer_obj.id=xmlEntities[j].id;
                            if(xmlEntities[j].num==null){//判断是否有窗口序号
                                mer_obj.num=xmlEntities[j].id;
                            }else{
                                mer_obj.num=xmlEntities[j].num;
                            }
                            mer_obj.x1=xmlEntities[j].x1;
                            mer_obj.y1=xmlEntities[j].y1;
                            mer_obj.x2=xmlEntities[j].x2;
                            mer_obj.y2=xmlEntities[j].y2;
                        }
                        /******************************
                         * 获取窗口的实际坐标
                         */
                        if(xmlEntities[j].x1<mer_obj.x1){
                            mer_obj.x1=xmlEntities[j].x1;
                        }
                        if(xmlEntities[j].y1<mer_obj.y1){
                            mer_obj.y1=xmlEntities[j].y1;
                        }
                        if(xmlEntities[j].x2>mer_obj.x2){
                            mer_obj.x2=xmlEntities[j].x2;
                        }
                        if(xmlEntities[j].y2>mer_obj.y2){
                            mer_obj.y2=xmlEntities[j].y2;
                        }

                    }
                }
            }
            mer_obj.id=mergeObject.id;
            mer_obj.lineWidth = 1;
            mer_obj.strokeColor = "white";
            mer_obj.fillColor = "black";
            mer_obj.active = 0;
            mer_obj.type = 0;
            modifyObj(mergeObject.id, mer_obj);
        }
    }else{
        modifyObj(mergeObject.id, mergeObject);
    }
    // 删除输出窗口
    var list=returnList("IFOlist");

    var idNum=new Array();
    for ( var i = 0; i < mergeList.length; i++) {
        if (mergeList[i].id != mergeObject.id) {
            var deleId=mergeList[i].id;
            if(list!=null){
                for (var j=0; j<list.length;j++){
                    if(list[j].outputId==deleId){
                        idNum.push(list[j].id);
                    }
                }
            }
            deleListObj(mergeList[i].id);//删除输出窗口
            if(returnList("db_list")!=null){
                deleListObj(mergeList[i].id,"db_list");//删除输出放大窗口
            }
        }
    }

    if(list!=null){
        for(var j=0;j<idNum.length;j++){
            for (var i=0;i<list.length;i++){

                if(idNum[j]==list[i].id){
                    list.splice(i,1);
                }
            }
        }
    }
    $("#objId").val("0");
    sessionStorage.setItem("upIFOList",1);
    saveList("IFOlist",list);

    /*
     * 删除后把所有ID位数向前移动 for(var i=0;i<xmlEntities.length;i++){
     * if(xmlEntities[i].id>number){ number++; entity=xmlEntities[i];
     * entity.id=number; modifyObj(xmlEntities[i].id,entity); } }
     * 
     */
    localStorage['ouputXml'] = JSON.stringify(xmlEntities);
    sendJSONForServer("ouputXml", returnList("ouputXml"));
    if(returnList("db_list")!=null){
        readObjByList(mapEntities,LK_CANVAS);
        initMap();
        initMap(map_object);
    }else{
        readObjByList();
    }
}


/*
 * 点击添加按钮的时候修改所有对象状态
 */
function addObj() {
    objType = 1;
    for ( var i = 0; i < xmlEntities.length; i++) {
        if (xmlEntities[i].type == 0) {
            entity = new Object();
            entity = xmlEntities[i];
            entity.active = 1;
            entity.lineWidth = 1;
            entity.strokeColor = "white";
            var id = entity.id;
            modifyObj(id, entity);
        }
        xmlEntities[i].lineWidth = 1;
        xmlEntities[i].strokeColor = "white";

    }

    localStorage['ouputXml'] = JSON.stringify(xmlEntities);
    readObjByList();

}
/*
 * 点击修改按钮
 */
function updateObj() {
    objType = 2;
    for ( var i = 0; i < xmlEntities.length; i++) {
        if (xmlEntities[i].type == 0) {
            entity = new Object();
            entity = xmlEntities[i];
            entity.active = 1;
            entity.lineWidth = 1;
            entity.strokeColor = "white";
            var id = entity.id;
            modifyObj(id, entity);
        }
        xmlEntities[i].lineWidth = 1;
        xmlEntities[i].strokeColor = "white";

    }
    localStorage['ouputXml'] = JSON.stringify(xmlEntities);
    readObjByList();

}

/*
 * 选中该对象然后点击删除按钮删除
 */
function deleteObj() {

    if (xmlEntities.length > 0) {
        for ( var i = 0; i < xmlEntities.length; i++) {
            if (xmlEntities[i].strokeColor == "red" && xmlEntities[i].type != 0) {
                var id = xmlEntities[i].id;
                deleListObj(id);
            }
        }

        localStorage['ouputXml'] = JSON.stringify(xmlEntities);
        readObjByList();
    } else {
        // upAlert(news);
    }

}


// 离开鼠标在容器的时候清空坐标值
function cnvs_clearCoordinates() {
    document.getElementById("xycoordinates").innerHTML = "";
}


/*
 * 鼠标移动事件
 */
var movea = 0;





var thisIFO=new Array();
var thisOP=new Array();
var minIFO=new Array();
/*********************************
 *  打开输入输出管理窗口
 *  @param paramId
 *  @param paramIfo
 */
function inputConfig(paramId,paramIfo) {
    sessionStorage.removeItem("methodType");
    var ouputList = returnList("ouputXml");
    $("#dragInputInformation").html("");//清空旧显示内容
    minIFO=returnList("IFOlist");
    if(paramIfo!=null){
        minIFO=paramIfo;
    }
    thisIFO=returnList("IFOlist");
//	showMes("IFOlist:"+JSON.stringify(returnList("IFOlist")));
    showMes("minIFO:"+JSON.stringify(minIFO));
    thisOP=ouputList;
//	showMes("ouputList:"+JSON.stringify(ouputList),"red");
    if (ouputList != null) {//判断输出窗口文件是否为空
        if($(".nav_upnumber").css("display")=="block"){//当前操作窗口号的时候
            showWinNum(ouputList);
        }else if($(".nav_gallery").css("display")=="block"){//当前操作通道的时候
            if(paramId!=null){
                showWinMes(ouputList,paramId);//显示当前操作状态
            }else{
                showWinMes(ouputList);
            }
        }else{//默认为操作窗口号
            $(".nav_div").each(function(){
                $(this).hide();
            });//初始化窗口显示
            $(".menu_li").each(function(){
                $(this).css("z-index","1");
            });//初始化窗口标题			
            if(paramId!=null){
                showWinMes(ouputList,paramId);//显示当前操作状态
            }else{
                showWinMes(ouputList);
            }
            $("#menu_td").css("z-index","3");
            $(".nav_gallery").show();
        }
        $("#input_table1 tr").remove();
        $("#input_table2 tr").remove();
        loadInput();//调用加载对应关系的方法
        $("#lk_faqbg").css({
            display : "block",
            height : $(document).height()
        });
        var canvas = document.getElementById(LK_CANVAS);
        var can = document.getElementById("minCan");
        var canvasWidth = canvas.clientWidth;// 从CSS样式获得屏幕宽度
        var canvasHeight = canvas.clientHeight;// 从CSS样式获得屏幕高度
        var canWidth = can.clientWidth;//缩小图的宽度
        var canHeight = can.clientHeight;//缩小图的高度
        can.width = canWidth;// 设置屏幕的宽度
        can.height = canHeight;// 设置屏幕的高度
        // upAlert(canvasWidth+","+canvasHeight+" "+canWidth+","+canHeight);
        var xD = canvasWidth / canWidth;//获取宽度有比例
        var yD = canvasHeight / canHeight;//获取高度的比例
        for ( var i = 0; i < ouputList.length; i++) {//循环按比例计算显示的坐标值
            if(ouputList[0].mt==null){
                ouputList[i].x1 = ouputList[i].x1 / xD;
                ouputList[i].y1 = ouputList[i].y1 / yD;
                ouputList[i].x2 = ouputList[i].x2 / xD;
                ouputList[i].y2 = ouputList[i].y2 / yD;
            }else if(ouputList[0].mt!=null&&ouputList[0].mt==1){
                ouputList[i].mx1 = ouputList[i].mx1 / xD;
                ouputList[i].my1 = ouputList[i].my1 / yD;
                ouputList[i].mx2 = ouputList[i].mx2 / xD;
                ouputList[i].my2 = ouputList[i].my2 / yD;
            }

        }

        // 画一个缩小版的大屏
        var beginX = 0;// 开始坐标X
        var beginY = 0;// 开始坐标Y
        var can = document.getElementById("minCan");
        var scrnWidth = can.clientWidth;
        var scrnHeight = can.clientHeight;
        var cxt = can.getContext("2d");
        var ctx = can.getContext("2d");
        // upAlert("aaa"+xmlEntities.length);
        if (ouputList != null) {
            cxt.clearRect(beginX, beginY, scrnWidth, scrnHeight);
            if(ouputList[0].mt!=null&&ouputList[0].mt==1){
                cxt.beginPath();
                cxt.lineWidth = 1;
                cxt.strokeStyle = "white";
                cxt.fillStyle = "black";
                cxt.rect(beginX, beginY, scrnWidth, scrnHeight);
                cxt.fill();
                cxt.stroke();
            }
            for(var i=0;i<ouputList.length;i++){//排序作用：把漫游放到最后显示出来
                for(var j=0;j<ouputList.length;j++){
                    if(ouputList[i].sc<ouputList[j].sc){
                        var a=ouputList[i];
                        ouputList[i]=ouputList[j];
                        ouputList[j]=a;
                    }
                }
            }
            for ( var i = 0; i < ouputList.length; i++) {
                if(ouputList[i].id==9999){
                    continue;
                }
                if(ouputList[0].mt!=null&&ouputList[0].mt==1){
                    x1 =ouputList[i].mx1;
                    y1 =ouputList[i].my1;
                    width = ouputList[i].mx2 - x1;
                    height =ouputList[i].my2 - y1;
                }else{
                    x1 = parseFloat(ouputList[i].x1.toString());
                    y1 = parseFloat(ouputList[i].y1.toString());
                    width = parseFloat(ouputList[i].x2.toString()) - x1;
                    height = parseFloat(ouputList[i].y2.toString()) - y1;
                }
                lineWidth = parseFloat(ouputList[i].lineWidth.toString());
                lineColor = ouputList[i].strokeColor;
                fillColor = ouputList[i].fillColor;
                cxt.beginPath();
                cxt.lineWidth = 1;
                cxt.strokeStyle = "white";
                cxt.rect(x1, y1, width, height);
                var img=document.getElementById("bcg");//获取图片
                cxt.drawImage(img,x1, y1, width, height);//话背景图片
                cxt.stroke();
                if(width>15&&height>10){
                    var id = 0;
                    if(ouputList[i].num==null){
                        id=ouputList[i].id;
                    }else{
                        id=ouputList[i].num;
                    }
                    var fondX = x1 + 5;
                    var fondY = y1 + 10;
                    //showMes(id+" "+fondX+" "+(fondY));
                    ctx.font = "10px 宋体";
                    ctx.strokeText(id, fondX, fondY);
                }
            }
        } else {
            return false;
        }
        var modeList=returnList("modeList");
        $("#mode_select option").remove();
        $("#mode_select").append("<option value='select_0'>"+showJSTxt(indexJSList,33)+"</option>");
        if(modeList==null){
        }else{

            for(var i=0;i<modeList.length;i++){
                $("#mode_select").append("<option value='select_"+modeList[i].id+"'>"+modeList[i].name+"</option>");
            }
        }
    }
}

var li=null;//保存自定义窗口的不同尺寸的数组
/*****************************
 * 选择并且点击尺寸进行修改窗口大小
 * @param obj
 */
function designThis(obj){
    var id=obj.id;//获取当前尺寸的ID
    if(li!=null&&objs!=null&&param_list!=null){
        var obj=null;
        for(var i=0;i<li.length;i++){
            if(id=="design"+(i+1)){
                obj=li[i];
                var t_st=0;
                var t_zk=0;
                var t_zg=0;
                var t_bx=0;
                var t_by=0;
                var t_ex=0;
                var t_ey=0;
                var t_x=0;
                var t_y=0;
                try {
                    for(var is=0;is<param_list.length;is++){//循环计算移动的
                        if(param_list[is].w<dwh||param_list[is].h<dwh){
                            if(t_st!==param_list[is].st){
                                t_st=param_list[is].st;
                                t_bx=param_list[is].mx1;
                                t_by=param_list[is].my1;
                                t_ex=param_list[is].mx2;
                                t_ey=param_list[is].my2;
                                for(var js=0;js<objs.length;js++){
                                    if(t_st==objs[js].st){
                                        if(objs[js].mx1<t_bx){t_bx=objs[js].mx1;}
                                        if(objs[js].my1<t_by){t_by=objs[js].my1;}
                                        if(objs[js].mx2>t_ex){t_ex=objs[js].mx2;}
                                        if(objs[js].my2>t_ey){t_ey=objs[js].my2;}
                                    }
                                }
                                t_zk=t_ex-t_bx;
                                t_zg=t_ey-t_by;
                                t_x=t_bx*(parseFloat(obj.w)/t_zk)-t_bx;
                                t_y=t_by*(parseFloat(obj.h)/t_zg)-t_by;
                            }
                            param_list[is].mx1=param_list[is].mx1*(parseFloat(obj.w)/t_zk)-t_x;
                            param_list[is].my1=param_list[is].my1*(parseFloat(obj.h)/t_zg)-t_y;
                            param_list[is].mx2=param_list[is].mx2*(parseFloat(obj.w)/t_zk)-t_x;
                            param_list[is].my2=param_list[is].my2*(parseFloat(obj.h)/t_zg)-t_y;
                        }else{
                            param_list[is].mx2=parseFloat(param_list[is].mx1)+parseFloat(obj.w);
                            param_list[is].my2=parseFloat(param_list[is].my1)+parseFloat(obj.h);
                        }

                        for(var j=0;j<objs.length;j++){
                            if(objs[j].id==param_list[is].id){
                                objs.splice(j,1);
                            }
                        }
                        objs.push(param_list[is]);
                    }
                } catch (e) {

                    showMes("修改尺寸:"+e,"red");
                }
                draw(MY_CANVAS,objs,"repeat");//重新生成画布
                param=new Object();
                param.x1=getMin(param_list,"design").x;//获取最小X坐标
                param.y1=getMin(param_list,"design").y;//获取最小Y坐标
                param.x2=getMax(param_list,"design").x;//获取最大X坐标
                param.y2=getMax(param_list,"design").y;//获取最大Y坐标
                param.lineWidth=2;
                param.strokeColor="red";
                //showMes((param.x2-param.x1)+" "+(param.y2-param.y1));
                rectObj(param,MY_CANVAS);

                break;
            }
        }

    }
}



/***********************************************
 * @param param_id 拆分窗口ID
 * @param param_line  每行几个
 * @param param_list  每列几个
 * @param param_win  输出窗口文件
 * 拆分窗口
 */
function ctr_win(param_id,param_line,param_list,param_win){
//	var endNum=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//	showMes("拆分进行："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"red");
    if(param_win==null){return;}
    var list=param_win;
    var winNum=0;//获取准备分割的对象序号
    var x1=0;// 获取准备分割的对象开始坐标的X轴
    var y1=0;// 获取准备分割的对象开始坐标的Y轴
    var x2=0;// 获取准备分割的对象结束坐标的X轴
    var y2=0;// 获取准备分割的对象结束坐标的Y轴
    var index=0;// 获取准备分割的对象的下标
    var type=0;
    var addList=new Array();// 总共修改了几个

//	 showMes("拆分ID"+param_id+" line:"+param_line+" param_list:"+param_list+" param_win:"+param_win.length);
    try {
        if(list[0].mt==null){
            for(var i=0;i<list.length;i++){
                if(list[i].id==param_id){
                    if(list[i].num==null){
                        winNum=list[i].id;
                    }else{
                        winNum=list[i].num;
                    }
                    x1=list[i].x1;
                    y1=list[i].y1;
                    x2=list[i].x2;
                    y2=list[i].y2;
                    type=list[i].type;
                    index=i;
                }
            }
            var width=x2 - x1;// 计算出该对象总宽度
            var height=y2 - y1;// 计算出该对象总高度
            var w=width/ parseInt(param_line);// 计算出分割出来的每个小对象的宽度
            var h=height/ parseInt(param_list);// 计算出分割出来的每个小对象的高度
            var bx=x1;// 拆分的输出窗口的开始X坐标
            var by=y1;// 拆分的输出窗口的开始Y坐标
            for(var i=0;i<param_line*param_list;i++){
                entity=new Object();
                /***************************************************
                 * 开始给拆分的输出窗口增加坐标值
                 */
                entity.x1=bx;
                entity.y1=by;
                entity.x2=bx+w;
                entity.y2=by+h;
                entity.lineWidth=1;
                entity.fillColor="black";
                entity.strokeColor="white";
                entity.active=0;
                if(bx==x1&&by==y1){// 拆分的窗口的ID和第一个相同的时
                    entity.id=parseInt(param_id);
                    entity.num=parseInt(winNum);
                    entity.type=type;
                    list.splice(index,1,entity);
                    addList.push(entity);
                }else{
                    entity.id=getId(list);
                    entity.num=getId(list,"num");
                    entity.type=0;
                    index++;
                    list.splice(index,0,entity);
                    addList.push(entity);
                }
                // 开始分配窗口大小值
                if ((i + 1) % param_line == 0) {
                    bx = x1;
                    by = by + h;
                }else{bx = bx + w;}
            }
        }else if(list[0].mt==1){
            var ww=0;// 获取准备分割的物理屏显示窗口的总宽
            var wh=0;// 获取准备分割的物理屏显示窗口的总高
            var bx=0;// 获取准备分割的物理屏显示窗口的开始X坐标
            var by=0;//	获取准备分割的物理屏显示窗口的开始Y坐标
            var wiw=0;//获取准备分割的物理屏显示每个窗口的宽度
            var wih=0;//获取准备分割的物理屏显示每个窗口的高度
            var mww=0;// 获取准备分割的自定义窗口的总宽
            var mwh=0;// 获取准备分割的自定义窗口的总高
            var mbx=0;// 获取准备分割的自定义窗口的开始X坐标
            var mby=0;// 获取准备分割的自定义窗口的开始Y坐标
            var mwiw=0;//获取准备分割的自定义窗口每个窗口的宽度
            var mwih=0;//获取准备分割的自定义窗口每个窗口的高度
            var st=0;// 所属物理屏的ID号
            var sc=0;//物理屏号
            var sames=new Object();//找出与当前窗口ID有关的窗口
            for(var i=0;i<list.length;i++){
                if(list[i].id==param_id){
                    sames=list[i];
                    index=i;
                    bx=list[i].x1;
                    by=list[i].y1;
//					showMes("list[i].ac:"+list[i].ac);
                    if(list[i].sc!=null){
                        //获取当前窗口的物理屏号
                        sc=list[i].sc;
                    }
                    if(sames.w==null||sames.h==null){
                        ww=sames.x2-sames.x1;
                        wh=sames.y2-sames.y1;
                    }else{
                        ww=sames.w;//窗口物理屏的总宽
                        wh=sames.h;//窗口物理屏的总高
                    }
                    wiw=ww/parseInt(param_line);//每个窗口的宽度
                    wih=wh/ parseInt(param_list);//每个窗口的高度
                    mww=sames.mx2-sames.mx1;//自定义窗口的总宽
                    mwh=sames.my2-sames.my1;//自定义窗口的总高
                    mbx=sames.mx1;//自定义窗口的开始X坐标
                    mby=sames.my1;//自定义窗口的开始Y坐标
                    mwiw=mww/parseInt(param_line);//每个自定义窗口的宽度
                    mwih=mwh/parseInt(param_list);//每个自定义窗口的高度
                    st=sames.st;//当前拆分的窗口的物理屏号
                }
            }
            /**************************
             * 判断操作方式
             */
            //showMes("w:"+sames.w+" h:"+sames.h);
            if((sames.w<dwh||sames.w==dwh)&&(sames.h<dwh||sames.h==dwh)){//如果是一个窗口则是拆分物理屏
                //	showMes("单屏拆分");
                //showMes("单屏拆分"+param_line+" "+param_list+" id:"+param_id);
                //showMes("单屏list:"+JSON.stringify(list),"red");
                //showMes("bx:"+bx+" by:"+by,"red");

                for(var i=0;i<param_line*param_list;i++){
                    entity=new Object();
                    entity.id=0;
                    entity.num=0;
                    if(sc!=0){//增加屏幕序号的属性
                        entity.sc=sc;
                    }
                    entity.x1=bx;
                    entity.y1=by;
                    entity.x2=bx+wiw;
                    entity.y2=by+wih;
                    entity.mx1=mbx;
                    entity.my1=mby;
                    entity.mx2=mbx+mwiw;
                    entity.my2=mby+mwih;
                    entity.lineWidth=1;
                    entity.fillColor="black";
                    entity.strokeColor="white";
                    entity.active=0;
                    entity.mt=1;
                    entity.st=st;
                    entity.w=wiw;
                    entity.h=wih;
                    entity.type=0;
                    if(i==0){
                        entity.id=param_id;
                        entity.num=sames.num;
                        list.splice(index,1,entity);
                    }else{
                        entity.id=getId(list);
                        entity.num=getId(list,"num");
//						entity.id=zid;
//						entity.num=zid;
                        index++;
                        list.splice(index,0,entity);
                    }
                    //	showMes("entity"+JSON.stringify(entity));
                    addList.push(entity);
                    // 开始分配窗口大小值
                    if ((i + 1) % param_line == 0) {
                        mbx = sames.mx1;
                        mby = mby + mwih;
                        bx=sames.x1;
                        by=by+wih;
                    }else{mbx = mbx + mwiw;
                        bx=bx+wiw;
                    }

                }
                var winNum=0;
                for(var i=0;i<list.length;i++){
                    if((list[i].w<dwh||list[i].h<dwh)&&list[i].sc==sc){
                        winNum++;
                    }
                }
                if(winNum>36){
                    upAlert(showJSTxt(indexJSList,34));
                    return null;
                }
//				var endNum5=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//				showMes("拆分进行："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算5："+(endNum5-endNum),"red");
            }else{//如果是两个以上就为拆分拼接屏
//				showMes("拼屏拆分");
                var sameList=new Array();
                var swn=0;
                var shn=0;
                cline=1;
//				showMes("list:"+JSON.stringify(list),"red");
//				showMes("list:"+JSON.stringify(sames),"red");
//				var str="";
                for(var i=0;i<list.length;i++){//计算当前窗口是由几乘几组成的
//					str+=" "+list[i].id;
                    if((list[i].w>dwh||list[i].h>dwh)&&list[i].st==sames.id){

                        if(checkLine(sames.x1,null,list[i].x1,null)){
                            shn++;
                        }
                        if(checkLine(sames.y1,null,list[i].y1,null)){
                            swn++;
                        }
                        sameList.push(list[i]);
                    }
                }
//				showMes("排序前："+str,"red");
//				str="";
                try {
                    var no=null;
                    //对拆分的合并对象进行分屏排序
                    for(var i=0;i<list.length;i++){
                        for(var j=0;j<list.length;j++){
                            if(list[i].st==sames.id&&list[i].st==list[j].st&&
                                ((list[i].y1<list[j].y1)||(list[i].y1==list[j].y1&&list[i].x1<list[j].x1))){
                                no=list[i];
                                list[i]=list[j];
                                list[j]=no;
                            }
                        }
                    }
//					var endNum2=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//					showMes("拆分进行："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算2："+(endNum2-endNum),"red");
//					var str="";
//					for(var i=0;i<list.length;i++){
//						str+=" "+list[i].id;
//					}
//					showMes("排序后:"+str);
                    //当拆分有行数比合并在行数大或者相等的时候并且拆分有列数比合并的列数大或者相等的时候
//					showMes("param_line:"+param_line+"  param_list:"+param_list+" swn:"+swn+" shn:"+shn);

                    if((param_line>swn||param_line==swn)&&(param_list>shn||param_list==shn)){
//					showMes("第一种拆分");
                        if((param_line%swn!=0||param_list%shn!=0)){
//						showMes("拆分失败,该窗口由"+shn+"行"+swn+"列的屏拼接,不能进行"+param_list+"行"+param_line+"列拆分");					
                            upAlert(showJSTxt(indexJSList,32));
                            return null;
                        }else{
                            var sw=param_line/swn;
                            var sh=param_list/shn;
                            wiw=ww/swn;
                            wih=wh/shn;
                            mwiw=mww/swn;
                            mwih=mwh/shn;
                            var a=0;//计算几个屏
//						showMes("swn"+swn+" shn:"+shn+" wiw:"+wiw+" wih:"+wih+" mwiw:"+mwiw+" mwih:"+mwih);
                            for(var i=0;i<list.length;i++){
                                if((list[i].w>dwh||list[i].h>dwh)&&list[i].st==sames.id){
                                    a++;
                                    if(list[i].id==9999){
                                        list[i].id=getId(list);
                                        list[i].num=getId(list,"num");
                                    }
                                    if(list[i].sc!=null){
                                        list[i].sc=list[i].sc;
                                    }else if(sc!=0){//设置屏幕序号
                                        list[i].sc=sc;
                                    }
                                    list[i].x1=bx;
                                    list[i].y1=by;
                                    list[i].x2=bx+wiw;
                                    list[i].y2=by+wih;
                                    list[i].mx1=mbx;
                                    list[i].my1=mby;
                                    list[i].mx2=mbx+mwiw;
                                    list[i].my2=mby+mwih;
                                    list[i].st=list[i].id;
                                    list[i].w=wiw;
                                    list[i].h=wih;
                                    if(a%swn!=0){
                                        mbx+=mwiw;
                                    }else{
                                        mbx=sames.mx1;
                                        mby+=mwih;
                                    }

                                }
                            }
                            try{
                                for(var i=0;i<list.length;i++){
                                    for(var j=0;j<sameList.length;j++){
                                        if(list[i].id==sameList[j].id){
                                            ctr_win(list[i].id,sw,sh,list);
                                        }
                                    }
                                }
                            }catch(e){
                                //	showMes("系统二次拆分失败:"+e,"red");
                            }
                        }
//					var endNum3=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//					showMes("拆分进行："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算3："+(endNum3-endNum),"red");
                    }else{//当拆分有行数比合并在行数小的时候或拆分有列数比合并的列数小的时候
//					showMes("第二种拆分");
                        if((swn%param_line!=0||shn%param_list!=0)){
                            //upAlert("拆分失败,该窗口由"+shn+"行"+swn+"列的屏拼接,不能进行"+param_list+"行"+param_line+"列拆分");					
                            upAlert(showJSTxt(indexJSList,32));
                            return null;
                        }else{
                            //	var newList=new Array();
                            var newObj=null;
                            var show=0;//显示的窗口数量
                            for(var i=0;i<param_line*param_list;i++){
                                newObj=new Object();
                                newObj.x1=bx;
                                newObj.y1=by;
                                newObj.x2=bx+wiw;
                                newObj.y2=by+wih;
                                newObj.mx1=mbx;
                                newObj.my1=mby;
                                newObj.mx2=mbx+mwiw;
                                newObj.my2=mby+mwih;
                                newObj.w=wiw/dwh;
                                newObj.h=wih/dwh;
                                newObj.list=new Array();
                                //找出拆分窗口所属的物理屏窗口
                                var cn=0;
                                var cbx=0;
                                var cby=0;
                                for(var j=0;j<list.length;j++){
                                    if(checkInWin((list[j].x1+1),(list[j].y1+1),(list[j].x2-1),(list[j].y2-1)
                                            ,newObj.x1,newObj.y1,newObj.x2,newObj.y2)&&list[j].st==sames.id){
                                        cn++;
                                        list[j].x1=cbx;
                                        list[j].y1=cby;
                                        list[j].x2=cbx+dwh;
                                        list[j].y2=cby+dwh;
                                        if(cn==1){
                                            show++;
                                            list[j].mx1=newObj.mx1;
                                            list[j].my1=newObj.my1;
                                            list[j].mx2=newObj.mx2;
                                            list[j].my2=newObj.my2;

                                            if(list[j].mx2!=0&&list[j].my2!=0&&show!=1){
                                                list[j].num=getId(list,"num");
                                                list[j].id=getId(list);
                                            }
                                            list[j].st=list[j].id;
                                            newObj.id=list[j].id;
                                        }else{
                                            list[j].mx1=0;
                                            list[j].my1=0;
                                            list[j].mx2=0;
                                            list[j].my2=0;
                                            list[j].st=newObj.id;
                                        }
                                        list[j].w=wiw;
                                        list[j].h=wih;
                                        if(cn%newObj.w!=0){
                                            cbx+=dwh;
                                        }else{
                                            cbx=0;
                                            cby+=dwh;
                                        }
                                        //newObj.list.push(list[j].id);	
                                    }
                                }
                                //newList.push(newObj);
                                if((i+1)%param_line!=0){
                                    bx+=wiw;
                                    mbx+=mwiw;
                                }else{
                                    bx=0;
                                    by+=wih;
                                    mbx=sames.mx1;
                                    mby+=mwih;
                                }
                            }
                        }
//					showMes("拆分："+JSON.stringify(list));
//					var endNum4=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//					showMes("拆分进行："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算4："+(endNum4-endNum),"red");
                    }
                } catch (e) {

                    showMes(e);
                }
            }
        }
//		var endNum10=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//		showMes("拆分完毕："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算10："+(endNum10-endNum),"red");
        /*******************************
         * 求出拆分前的总宽度,总高度,下标值
         *
         */
//		showMes("aaa");
//		showMes("拆分："+JSON.stringify(list),"red");

//		 readObjByList(list);
//		 return;
        //showMes("拆分数量："+list.length,"red");		
        return list;
    } catch (e) {

        showMes(e);
    }

}

/**********************************
 * 获取数组里最后一个被选中的窗口
 */
function getlastWin(){
    try {
        var list=xmlEntities;
        var thisObj=null;
        if(list!=null){
            for(var i=0;i<list.length;i++){
                if(list[i].strokeColor=="red"){
                    thisObj=list[i];
                }
            }
        }
        return thisObj;
    } catch (e) {
        setError("getlastWin",e);
    }

}
/**************************************
 * 删除漫游画中画
 * @returns
 */
function removeWin(){
    try {
        var win=getlastWin();//获取当前选择的最后一个窗口
        if(win==null){
            return ;
        }
        if(win.active==0){
            upAlert(showJSTxt(indexJSList,35));
            return false;
        }else{
            for(var i=0;i<xmlEntities.length;i++){
                if(xmlEntities[i].id==win.id){
                    xmlEntities.splice(i,1);
                }
            }
            var IFOlist=returnList("IFOlist");
//			showMes("IFOlist:"+IFOlist.length,"red");
            if(IFOlist!=null&&IFOlist.length>0){
                var idList=new Array();
                for(var i=0;i<IFOlist.length;i++){
                    if(IFOlist[i].outputId==win.id){
                        idList.push(IFOlist[i].id);
                    }
                }
                for(var i=0;i<idList.length;i++){
                    for(var j=0;j<IFOlist.length;j++){
                        if(idList[i]==IFOlist[j].id){
                            IFOlist.splice(j,1);
                        }
                    }
                }
            }
//			showMes("IFOlist:"+IFOlist.length,"blue");
            nwt=new Object();
            saveList("ouputXml",xmlEntities);
            sessionStorage.setItem("upIFOList",1);
            saveList("IFOlist",IFOlist);
            sessionStorage.setItem("upNum",1);
            readObjByList(xmlEntities, LK_CANVAS);
            if(LK_CAN_OBJ!=null){
                var rStr=(xmlEntities!=null)?getExt(1,"ouputXml",xmlEntities):"";
                LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
                var iStr=(IFOlist!=null)?getExt(1,"IFOlist",IFOlist):"";
                LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口

            }
//			sendJSONForServer("ouputXml",xmlEntities);	
//			clearPlayType(win.id);//清理回放缓存数据
        }
        return true;
    } catch (e) {
        setError("removeWin", e);
        return false;
    }
}//mracg.com

/**************************************
 * 发送控制输出命令
 * @param sType
 */
function contrlType(sType){
    try {
        var idList=new Array();
        var list =xmlEntities;
        for(var i=0;i<list.length;i++){//获取当前选择的所有窗口号
            if(list[i].strokeColor=="red"){
                idList.push(list[i].id);
            }
        }
//		showMes("rightId:"+idList,"red");
        var loginCode = returnSlist("loginCode");// 回去随机码
        if(loginCode==null){
            loginCode=[0x00,0x00,0x00,0x00];
        }
        var sendType=0x01;
        if(sType!=null){
            //根据参数修改发送命令码
            sendType=sType;
        }
        if (loginCode != null) {
            var binary = new Uint8Array(8+(idList.length*2));// 创建一个数组，必须固定长度
            binary = setCode(binary, loginCode, 0x00, 0x00, 0x02, sendType);
            var index=7;
            for(var i=0;i<idList.length;i++	){
                binary[(index+1)]=idList[i]/256;
                binary[(index+2)]=idList[i]%256;
                index+=2;
            }
            LK_CAN_OBJ.onExt(0,"02 "+zh(sendType) ,binary);//调用回调接口
//			showMes("st:"+st);
//			if (checkMes()) {
//				var str="";
//				for(var i=0;i<binary.length;i++){
//					str+=" "+binary[i];
//				}
//				checkSend(binary);
//			} else {
//				upAlert(showJSTxt(indexJSList,14)); 
//			}
        } else {
            return;
        }
    } catch (e) {

        setError("contrlType", e);
    }
}
/******************************************
 * 重置窗口
 */
function reset_win(){
    try {
        var x = getCanXY(LK_CANVAS).x;// 获取鼠标当前在画布里x轴的坐标
        var y = getCanXY(LK_CANVAS).y;// 获取鼠标当前在画布里Y轴坐标
        var clickObj=null;
        var id=0;
        if(xmlEntities!=null){
            var a=0;
            for(var i=0;i<xmlEntities.length;i++){
                if(xmlEntities[i].strokeColor=="red"&&xmlEntities[i].id!=9999){
                    a++;
                    clickObj=xmlEntities[i];
                }
            }
            if(a>1){
                upAlert(showJSTxt(indexJSList,36));
                return;
            }
            id=clickObj.id;
        }else{
            clickObj=getClickObjId(x,y);
            id=$("#objId").val();
        }
        //showMes(" id:"+id+   "   clickObj:"+JSON.stringify(clickObj));
        if(clickObj.active==1){
            upAlert(showJSTxt(indexJSList,37));
            return;
        }
        var list=returnList("ouputXml");
        var newList= new Array() ;
        try {
            newList=restore(list,id);
//				 for(var i=0;i<newList.length;i++){//打印相关注释
//					 if(newList[i].sc==3){
//						 showMes(JSON.stringify(newList[i]),"red"); 
//					 }
//				 }
            // showMes("list:"+JSON.stringify(newList),"red");
            if(newList!=null&&newList.length>0){
                var splices=new Array();
                var bool=true;
                try {
                    var ilist=returnList("IFOlist");
                    //showMes("ilist:"+JSON.stringify(ilist));
                    if(ilist!=null&&ilist.length>0){
                        if(newList[0].mt==null){
                            for(var i=0;i<ilist.length;i++){
                                bool=true;
                                for(var j=0;j<newList.length;j++){
                                    if(ilist[i].outputId==newList[j].id){
                                        bool=false;
                                    }
                                }
                                if(bool){
                                    splices.push(ilist[i].outputId);
                                }
                            }
                        }else if(newList[0].mt==1){
                            for(var i=0;i<list.length;i++){
                                bool=true;
                                for(var j=0;j<newList.length;j++){
                                    if(list[i].id==newList[j].id){
                                        bool=false;
                                    }
                                }
                                if(bool){
                                    splices.push(list[i].id);
                                }
                            }
                        }
                    }
                    //	showMes("splices:"+JSON.stringify(splices));
                    if(ilist!=null){//还原的时候把对应关系修改
                        for(var i=0;i<splices.length;i++){
                            for(var j=0;j<ilist.length;j++){
                                if(splices[i]==ilist[j].outputId){
                                    ilist.splice(j,1);
                                }
                            }
                        }
                        sessionStorage.setItem("upIFOList",1);
                        saveList("IFOlist",ilist);
                    }
                    //	showMes("重置："+JSON.stringify(newList),"blue");
                    //	readObjByList(newList);
                    var oldList=returnList("ouputXml");
                    newList=upAcWin(oldList,newList);//修改当前重置窗口的时候影响到的漫游、画中画的窗口
                    saveList("ouputXml",newList);
                    loadXml();
                    sessionStorage.setItem("upNum", "1");
                    var wins=returnList("ouputXml");
                    var ifo=returnList("IFOlist");
                    //showMes("ifo:"+JSON.stringify(ifo));
                    if(LK_CAN_OBJ!=null){
                        var rStr=getExt(1,"ouputXml",wins);
                        LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
                        var iStr=(ifo!=null)?getExt(1,"IFOlist",ifo):"";
                        LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口

                    }
//						sendJSONForServer("ouputXml", returnList("ouputXml"));
                }catch (e) {

                    //showMes("对应关系修改失败:"+e);
                }
            }
        } catch (e) {

            //	showMes("重置失败："+e);
        }
    } catch (e) {

        setError("reset_win", e);
    }
}
/***********************************
 * 显示自定义窗口操作
 */
function  showConfigCanval(){
    try {


        var divStr='<div class="lk_div lk_design" id="design">'+
            '<div class="dise">'+
            '<span class="wenzi1"> &nbsp;&nbsp;<span id ="zdyck_txt">'+$st(js_2,162)+'</span></span><span><img'+
            '	class="designCansel" src="'+CL_IMG+'" width="47" height="20">'+
            '</span>'+
            '</div>'+
            '<div class="dise_manage">'+
            '<canvas id="'+MY_CANVAS+'" onmousedown="dragImage(this)"></canvas>'+
            '</div>'+
            '<div class="dise_but">'+
            '<ul class="dise_ul">'+
            '<li><span><input type="button"'+
            '	class="designCansel but_but" id="zdycs_txt" value="'+$st(js_2,111)+'" />'+
            '</span>'+
            '</li>'+
            '<li><span><input type="button" class="but_but"'+
            '	id="save_design" value="'+$st(js_2,123)+'" />'+
            '</span>'+
            '</li>'+
            '</ul>'+
            '</div>'+
            '</div>';
        showMes("aaa");
        var list=returnList("ouputXml");

        if(list==null){

            return ;
        }

        $("body").append(back_div);
        $("body").append(divStr);
        var can=document.getElementById(LK_CANVAS);
        // showMes(can.clientWidth+" "+can.clientHeight+" "+list.length);
        objs=mappingXY(list,can.clientWidth,can.clientHeight,MY_CANVAS,1);//获取保存映射设窗口文件
        //showMes(JSON.stringify(objs));
        draw(MY_CANVAS,objs,"repeat");//把文件画出来	 


        /*****************************************
         *取消自定义操作
         */
        $(".designCansel").click(function(){
            cleanDesign();
        });
        /****************************************
         * 保存自定义窗口
         */
        $("#save_design").click(function(){
            if( saveDesign()){
                cleanDesign();
            }
        });

        /**********************************
         * 自定义右键点击
         */
        $("#deCan").bind("mousedown", (function(e) {
            if(li==null){
                li=new Array();
            }
            if (e.which == 3&&bcType==0) {
                var opertionn = {
                    name : "design"+getCanXY("design").x,// 可以再name后面加个随机数这样就等于从新建立一个菜单
                    offsetX : 2,
                    offsetY : -50,
                    textLimit : 20,
                    beforeShow : $.noop,
                    afterShow : $.noop
                };
                var imageMenuData=new Array();
                if(objs!=null&&objs.length>0){
                    var lo=null;
                    for(var i=0;i<objs.length;i++){
                        if(objs[i].mx2!=0&&objs[i].my2!=0){
                            if(li!=null){
                                lo=new Object();
                                if(objs[i].w<dwh||objs[i].h<dwh){//判断是否是拆分的小屏
                                    //通过拆分小屏计算出物理屏的尺寸
                                    lo.id=objs[i].st;
                                    var mx1=objs[i].mx1;
                                    var my1=objs[i].my1;
                                    var mx2=objs[i].mx2;
                                    var my2=objs[i].my2;
                                    for(var j=0;j<objs.length;j++){
                                        if(lo.id==objs[j].st){
                                            if(objs[j].mx1<mx1){mx1=objs[j].mx1;}
                                            if(objs[j].my1<my1){my1=objs[j].my1;}
                                            if(objs[j].mx2>mx2){mx2=objs[j].mx2;}
                                            if(objs[j].my2>my2){my2=objs[j].my2;}
                                        }
                                    }
                                    lo.w=parseFloat(mx2-mx1).toFixed(5);
                                    lo.h=parseFloat(my2-my1).toFixed(5);
                                }else{//获取物理屏和拼接屏的尺寸
                                    lo.id=objs[i].id;
                                    lo.w=parseFloat(objs[i].mx2-objs[i].mx1).toFixed(5);
                                    lo.h=parseFloat(objs[i].my2-objs[i].my1).toFixed(5);
                                }
                                var bool=true;
                                for(var j=0;j<li.length;j++){
                                    if(lo.w==li[j].w&&lo.h==li[j].h){
                                        bool=false;
                                        break;
                                    }
                                }
                                if(bool){
                                    li.push(lo);
                                }
                            }

                        }

                    }
                }
                var liObj=null;
                for(var i=0;i<li.length;i++){
                    for(var j=0;j<li.length;j++){
                        if(li[i].w<li[j].w||(li[i].w==li[j].w&&li[i].h<li[j].h)){
                            liObj=li[i];
                            li[i]=li[j];
                            li[j]=liObj;
                        }
                    }
                }
                if(li!=null&&li.length>0){
                    var menu_obj=null;
                    var mobj=null;
                    for(var i=0;i<li.length;i++){
                        menu_obj=new Array();
                        mobj=new Object();
                        mobj.text=" "+showJSTxt(indexJSList,54)+":  "+parseInt(li[i].w/10)+":"+parseInt(li[i].h/10);
                        mobj.func=function(){

                        };
                        menu_obj.push(mobj);
                        imageMenuData.push(menu_obj);
                    }
                }
                $(this).smartMenu(imageMenuData, opertionn);

            }

        }));
    } catch (e) {
        // TODO: handle exception
        setError("showConfigCanval",e);
    }
}

/*********************************************
 * 手动进行轮巡
 * @param param
 */
function nextInput(param){
    try {
        showMes("aaa");
        var winList=xmlEntities;//窗口数组
        var ifoList=returnList("IFOlist");//输入源数组
        var oiList=returnList("oiList");//对关系数组
        var redWin=new Array();//选中的窗口的对应关系数组
        if(winList!=null&&oiList!=null&&ifoList!=null){
            var obj;
            for(var i=0;i<winList.length;i++){
                if(winList[i].strokeColor=="red"){
                    obj=new Object();
                    obj.win=winList[i].id;
                    obj.thisInput=null;
                    obj.thisGn=null;
                    obj.inputs=new Array();
                    redWin.push(obj);
                }
            }
            if(redWin!=null){//选中的窗口进行操作
                for(var i=0;i<redWin.length;i++){
                    for(var j=0;j<oiList.length;j++){
                        if(redWin[i].win==oiList[j].oi){
                            redWin[i].thisInput=oiList[j].ii;
                            redWin[i].thisGn=oiList[j].gn;
                        }
                    }
                }
                for(var i=0;i<redWin.length;i++){
                    for(var j=0;j<ifoList.length;j++){
                        if(redWin[i].win==ifoList[j].outputId){
                            var bool=true;
                            for(var a=0;a<redWin[i].inputs.length;a++){//排除相同的输入源
                                if(ifoList[j].inputId==redWin[i].inputs[a].inputId&&
                                    ifoList[j].gn==redWin[i].inputs[a].gn){
                                    bool=false;
                                }
                            }
                            if(bool){
                                redWin[i].inputs.push(ifoList[j]);
                            }
                        }
                    }
                }
                //	showMes(JSON.stringify(redWin));
                orderList=new Array();//初始化命令数组
                var binary;
                var loginCode = returnSlist("loginCode");// 回去随机码
                if(loginCode==null){
                    loginCode=[0x00,0x00,0x00,0x00];//离线测试使用
                    //return;
                }
                for(var i=0;i<redWin.length;i++){
                    if(redWin[i].inputs!=null&&redWin[i].inputs.length>1){
                        var list=redWin[i].inputs;
                        //	showMes("进来了"+list.length,"blue");
                        for(var j=0;j<list.length;j++){
                            var tgn=0;
                            var lgn=0;
                            if(redWin[i].thisGn==null||redWin[i].thisGn==""){
                                tgn=0;
                            }
                            if(list[j].gn==null||list[j].gn==""){
                                lgn=0;
                            }
                            if(redWin[i].thisInput==list[j].inputId&&tgn==lgn){
                                var ix=0;
                                if(param==1){//前一个输入源
                                    if(j-1<0){
                                        ix=list.length-1;
                                    }else{
                                        ix=j-1;
                                    }
                                }else if(param==2){//后一个输入源
                                    if(j+1>=list.length){
                                        ix=0;
                                    }else{
                                        ix=j+1;
                                    }
                                }
                                //showMes(JSON.stringify(list[ix]),"red");
                                binary = new Uint8Array(13);// 创建一个数组，必须固定长度
                                binary = setCode(binary, loginCode, 0x00, 0x00, 0x02, 0x00);
                                binary[8] = list[ix].outputId/256;
                                binary[9] = list[ix].outputId%256;
                                binary[10] = list[ix].inputId/256;
                                binary[11] = list[ix].inputId%256;
                                binary[12] = (list[ix].gn!=null)?list[ix].gn:0;
                                LK_CAN_OBJ.onExt(0,"02 00",binary);//调用回调接口
//								var orderObj=new Object();
//								orderObj.name="切换输入源";
//								orderObj.local="ci";
//								orderObj.binary=binary;//获取当前的命令
//								orderList.push(orderObj);
                            }
                        }
                    }
                }
                //showMes("list:"+JSON.stringify(orderList),"blue");
                send_orderList();//发送命令数组
                //	showMes("提示：窗口切换下一个输入源成功","red");
            }
        }//
    } catch (e) {
        setError("lastInput",e);
    }
}


/************************************************
 * @mes 根据对应关系显示右键菜单的内容
 * @addTime 2016-11-7
 * @param imageMenuObj
 * @param windowId
 * @returns
 */
function updataRightKey(imageMenuObj,windowId){
    try {
        var p2pList=returnSlist("appList");//p2p输入源数组
        var oiList=returnList("oiList");//窗口
        if(p2pList!=null&&oiList!=null){//判断是否是P2P远程输入源
            var bool=false;
            var inputId=0;
            //判断窗口显示的输入源
            for(var i=0;i<oiList.length;i++){
                if(oiList[i].oi==windowId){
                    inputId=oiList[i].ii;
                }
            }
            if(inputId!=0){
                for(var i=0;i<p2pList.length;i++){
                    if(p2pList[i].id==inputId){
                        bool=true;
                    }
                }
            }
            if(bool){//判断当前对应关系是否是远程设备
//				showMes("显示");
                var keyList=new Array();
                for(var i=0;i<type_list.length;i++){
                    var keyObj=new Object();
                    keyObj.text=type_list[i].value;
                    switch (type_list[i].type) {
                        case 100:
                            keyObj.func=function(){
                                try {
                                    set_resolution(100);
                                } catch (e) {
                                    // TODO: handle exception
                                    setError("keyObj.func",e);
                                }
                            };
                            break;
                        case 101:
                            keyObj.func=function(){
                                try {
                                    set_resolution(101);
                                } catch (e) {
                                    // TODO: handle exception
                                    setError("keyObj.func",e);
                                }
                            };
                            break;
                        case 11:
                            keyObj.func=function(){
                                try {
                                    set_resolution(11);
                                } catch (e) {
                                    // TODO: handle exception
                                    setError("keyObj.func",e);
                                }
                            };
                            break;
                        case 10:
                            keyObj.func=function(){
                                try {
                                    set_resolution(10);
                                } catch (e) {
                                    // TODO: handle exception
                                    setError("keyObj.func",e);
                                }
                            };
                            break;
                        case 7:
                            keyObj.func=function(){
                                try {
                                    set_resolution(7);
                                } catch (e) {
                                    // TODO: handle exception
                                    setError("keyObj.func",e);
                                }
                            };
                            break;
                        case 6:
                            keyObj.func=function(){
                                try {
                                    set_resolution(6);
                                } catch (e) {
                                    // TODO: handle exception
                                    setError("keyObj.func",e);
                                }
                            };
                            break;
                        case 3:
                            keyObj.func=function(){
                                try {
                                    set_resolution(3);
                                } catch (e) {
                                    // TODO: handle exception
                                    setError("keyObj.func",e);
                                }
                            };
                            break;
                        default:
                            break;
                    }

                    keyList.push(keyObj);
                }
                imageMenuObj.splice(1, 0, keyList);//插入数据
            }

        }
        return imageMenuObj;
    } catch (e) {
        setError("updataRightKey",e);
    }
}




$(function(){
    /*************************************
     * 鼠标按下事件
     */

    // 点击按钮隐藏左边功能
//	$("#showImg").click(function(){
//	$(".left_bottom").attr("style","height:95%");
//	$(".left_top").hide();
//	$(".left_Middle").show();
//	});
//	// 点击按钮显示左边功能
//	$("#hideImg").click(function(){
//	$(".left_bottom").attr("style","height:47%");
//	$(".left_top").show();
//	$(".left_Middle").hide();
//	});
//	
    // 点击取消拆分按钮
//	$(".lk_canseltBut").click(function(){
//		showMes("aaaa");
//		$(".lk_faqbg").hide();
//		$(".lk_splitDiv").hide();
//	});
//	// 点击图片取消拆分按钮
//		$(".lk_canseltImg").click(function(){
//		$(".lk_faqbg").hide();
//		$(".lk_splitDiv").hide();
//	});

//	// 初始化取消按钮
//	$("#initCanselBut").click(function(){
//		$("#faqbg").hide();
//		$(".initDiv").hide();
//	});
//	// 初始化图片取消按钮
//	$("#initImg").click(function(){
//		$("#faqbg").hide();
//		$(".initDiv").hide();
//		
//	});






    //initHerf();


});


// 删除所有输出对象
function deleteAllObj() {
    localStorage.removeItem("ouputXml");
    localStorage.removeItem("IFOlist");
    localStorage.removeItem("decoderList");
    localStorage.removeItem("deviceList");
    localStorage.removeItem("modeList");
    localStorage.removeItem("groupList");
    localStorage.removeItem("caution");
    sendJSONForServer("ouputXml", null);
    xmlEntities = returnList("ouputXml");
    sessionStorage.setItem("upNum",1);
    localStorage.setItem("coUpdate",1);
    localStorage.setItem("grUpdate",1);
    localStorage.setItem("moUpdate",1);
    readObjByList();
    loadMinMode();
    addtree();
}



/**************************************
 * 加载临时切换是图像数据
 * @param winId
 */
function loadDragInput(winId){
    try {
        var dragList=returnList("dragList");
        var decoders=returnList("decoderList");
//		showMes("dragList:"+JSON.stringify(dragList));
        var str="";//显示当前是输入源字符串
        if(dragList==null){
            dragList=new Array();
        }
        if(decoders==null){
            decoders=new Array();
        }
        var dragObj=null;//当前窗口拖动输入源

        /*********************************************************
         * @time 2016-9-22
         * 显示手机APP的对应关系
         * begin
         */
        var appList=returnSlist("appList");//
        var appToWin=returnSlist("appToWin");
        if(appList!=null&&appToWin!=null){
            for(var i=0;i<appToWin.length;i++){
                if(appToWin[i].outputId==winId){
                    var obj = new Object();
                    obj.id = getId(dragList);
                    obj.outputId = ""+appToWin[i].outputId ;
                    obj.inputId = ""+appToWin[i].inputId ;
                    obj.gn="";
                    dragList.push(obj);
                }
            }
            for(var i=0;i<appList.length;i++){
                decoders.push(appList[i]);
            }

        }
        /*******************************
         * @time 2016-9-22
         * end
         */

        for(var i=0;i<dragList.length;i++){//找到当前窗口的对应关系
            if(dragList[i].outputId==winId){
                dragObj=dragList[i];
                break;
            }
        }

        if(dragObj!=null){
//			showMes("aaaaa："+JSON.stringify(dragObj),"red");
            dragObj.inputName=null;
            dragObj.grName=null;
            for(var i=0;i<decoders.length;i++){//找到对应关系的输入源内容
                if(decoders[i].id==dragObj.inputId){
                    dragObj.inputName=decoders[i].name;
                    dragObj.ip=decoders[i].location;
                    dragObj.grName="";
                    var number=dragObj.gn;
                    if(isNaN(number)==false&&number!=0&&//对应关系通道不为零
                        isNaN(decoders[i].gn)==false&&decoders[i].gn!=0//输入源通道不为零
                    ){
                        number=parseInt(number);//转换字符串为整数
                        var spList=null;
                        try {
                            spList=decoders[i].grName.split(",");//数组截取
                        } catch (e) {//错误处理
                            spList=null;
                        }
                        //	showMes("spList:"+JSON.stringify(spList)+" type:"+decoders[i].type);
                        if(spList!=null&&spList.length>=dragObj.gn){
                            if(decoders[i].type==1){
                                var ml="";
                                if(number%2==0){
                                    n=n/2;
                                    ml=showJSTxt(indexJSList,3);
                                }else{
                                    n=parseInt(n/2)+1;
                                    ml=showJSTxt(indexJSList,2);
                                }
                                dragObj.grName="("+spList[number-1]+":"+ml+")";
                            }else{
                                dragObj.grName="("+spList[number-1]+")";
                            }

                        }
                    }
                    break;
                }
            }
            if(dragObj.inputName!=null){
                str=showJSTxt(indexJSList,0.1)+""+dragObj.inputName+dragObj.grName;
            }


        }

        $("#dragInputInformation").html(str);
    } catch (e) {
        setError("loadDragInput",e);
    }
}



/*****************************************************
 * 加载对应关系
 */
function loadInput(){
    try {
        var outputId= $("#outputId option:selected").val();
//		showMes("outputId:"+outputId);
        var list =minIFO;
//			showMes("list:"+JSON.stringify(list),"blue");
        if($("#mode_select").val()!="select_0"){
            var id=$("#mode_select").val().substr(7);
            var models=returnList("modeList");
            if(models!=null){
                for(var i=0;i<models.length;i++){
                    if(models[i].id==id){
                        list=models[i].IFOlist;
                    }
                }
            }
        }

        loadDragInput(outputId);//调用显示临时参数
        if(list==null){
            return;
        }
        // 判断数组是否有对象
        if(list.length>0){
            // 清空表格的内容，实现刷新功能
            $("#input_table1 tr").remove();
            $("#input_table2 tr").remove();

            // 定义一个序号。用来在页面显示顺序的
            var idx=0;
            var idx2=0;
            var decoders=returnList("decoderList");
//			showMes("IFOList:"+JSON.stringify(list),"blue");
            //	showMes("输入:"+JSON.stringify(decoders),"red");
            var showType=0;//显示轮巡模式
            for(var i=0; i<list.length;i++){
//				 showMes(list[i].id+"outId:"+list[i].outputId+"inId:"+list[i].inputId
//						 +" outputId:"+outputId+" name:"+list[i].inputName+" bengin:"+list[i].beginTime+
//				 " end:"+list[i].endTime+" long:"+list[i].longTime);

                if(list[i].outputId==outputId){
                    var inputName=list[i].inputName;
                    var bool=false;
                    var type=0;
                    var dc_gn=null;
                    var n_na="";
                    if(decoders!=null){
                        for(var j=0;j<decoders.length;j++){
                            if(list[i].inputId==decoders[j].id){
                                bool=true;
                                inputName=decoders[j].name;
                                type=decoders[j].type;
                                dc_gn=decoders[j].gn;
                                n_na=decoders[j].grName;

                            }
                        }
                    }
//						showMes("bool:"+bool);
                    if(bool==false){
                        continue ;
                    }
//						showMes("i:"+i+" id:"+list[i].id,"red");
                    // 创建动态在网页插入的内容
                    var natStr="";
                    var nName=null;//通道名称数组
                    //获取输入源通道的名称
//						showMes("n_na:"+n_na+" dc_gn:"+dc_gn);
                    if(n_na!=null&&isNaN(dc_gn)==false){
                        nName=n_na.split(",");
                        nName=gName_split(nName);
                    }else if(isNaN(dc_gn)==false){
                        nName=new Array();
                        for(var a=0;a<dc_gn;a++){
                            nName.push(showJSTxt(indexJSList,1)+""+(a+1));
                        }
                    }
                    if(list[i].gn==null||list[i].gn==""||list[i].gn==0){
                        natStr="<td width='30%' class='wenzi'>"+inputName+"</td>";
                    }else{
                        var n=null;//通道号
                        if(list[i].gn.toString().indexOf("n")==-1){
                            n=list[i].gn;
                        }else{
                            n=list[i].gn.substr(1);
                        }
                        var natVal="";//通道名称
//							showMes("nName:"+nName+" n:"+n);
                        if(type==1&&nName!=null&&nName.length>0){//当ONVIF类型有通道的时候
                            if((n/2)>nName.length){
                                natVal="("+showJSTxt(indexJSList,1)+n+")";
                            }else{
                                if(n%2==0){
                                    n=n/2;
                                    natVal="("+nName[n-1]+":"+showJSTxt(indexJSList,3)+")";
                                }else{
                                    n=parseInt(n/2)+1;
                                    natVal="("+nName[n-1]+":"+showJSTxt(indexJSList,2)+")";
                                }
                            }
                        }else if(nName!=null&&nName.length>0){
                            natVal="("+nName[n-1]+")";
                        }else if(nName==null||nName==""){
                            natVal="("+showJSTxt(indexJSList,1)+list[i].gn+")";
                        }
                        natStr="<td width='30%' class='wenzi'>"+inputName+
                            "<span style='color:red'>"+natVal+"</span></td>";
                    }
                    var longTimeStr="";
                    if(list[i].longTime==""){
                        longTimeStr="<td width='20%' class='wenzi'></td>";
                    }else{
                        longTimeStr="<td width='20%' class='wenzi'>"+list[i].longTime+"s</td>";
                    }
                    var beginTimeStr="<td width='10%' class='wenzi'>"+list[i].beginTime+"</td>";
                    var endTimeStr="<td width='10%' class='wenzi'>"+list[i].endTime+"</td>";
                    // upAlert(newList[i].beginTime+ " "+newList[i].endTime);
                    var btnStr="<td width='46%' class='wenzi'>"+
                        "<span><input type='button' class='but_but'  onclick='updateInput(this)' id='"+list[i].id+"' value='"+showJSTxt(indexJSList,55)+"'/></span>&nbsp;" +
                        "<span><input type='button' class='but_but'  onclick='deleteInput(this)'  id='"+list[i].id+"'  value='"+showJSTxt(indexJSList,56)+"'/></span>&nbsp;"+
                        "<span><input type='button' class='but_but'  onclick='addInput(this)' id='"+list[i].id+"'  value='"+showJSTxt(indexJSList,57)+"'/></span></td>";
                    // 定义一个className用来保存不用的样式名称
                    var class_Name="";

                    // 根据需要把内容显示到浏览器上
                    if(list[i].longTime==""||list[i].longTime==null){
                    }else {
                        showType=1;
                        if(idx%2==0){
                            class_Name="ds1";
                        }else{
                            class_Name="ds2";
                        }
                        var idStr="<td width='5%' class='wenzi'>"+idx+"</td>";
                        $("#input_table1").append( "<tr class='"+class_Name+"'>"+idStr+natStr+longTimeStr+btnStr+"  </tr>");
                        idx++;
                    }
                    if(list[i].beginTime!=""&&list[i].endTime!=""){
                        if(showType==0){
                            showType=2;
                        }
                        if(idx2%2==0){
                            class_Name="ds1";
                        }else{
                            class_Name="ds2";
                        }
                        var idStr="<td width='5%' class='wenzi'>"+idx2+"</td>";
                        $("#input_table2").append( "<tr class='"+class_Name+"'> "+idStr+natStr+beginTimeStr+endTimeStr+btnStr+" </tr>");
                        idx2++;
                    }


                    // 标识序号自增

                }
            }
            if(timeType==0){
                //showMes("aaa");
                $("#radio3").prop("class","radio_on radio_size");
                $("#radio4").prop("class","radio_no radio_size");
//				$("#adBegin").val("");
//				$("#adEnd").val("");
                $(".input_play_table1").show();
                $(".input_play_table2").hide();
            }else{
                //showMes("bbb");
                $("#radio3").prop("class","radio_no radio_size");
                $("#radio4").prop("class","radio_on radio_size");
//				$("#adLong").val("");
                $(".input_play_table2").show();
                $(".input_play_table1").hide();
            }
        }if(list.length==0){
            $("#input_table1 tr").remove();
            $("#input_table2 tr").remove();
        }
    } catch (e) {

        setError("loadInput", e);
    }
}
/*
 * 功能： 根据id查找对象，返回对象所有信息 参数：list-->数组,id-->对象ID 返回值:返回一个对象
 */
function checkObjById(list ,id){
    var newList=new Array();
    newList=list;
    if(newList.length>0){
        for(var i=0;i<newList.length;i++){

            if(newList[i].id==id){
                return newList[i];
            }
        }
    }else{
        return null;
    }
}
var timeType=0;
/****************
 * 修改输入源信息
 * @param b
 */
function updateInput(b){
    try {
        show_cannal_modify(b.id);//显示div容器
    } catch (e) {
        setError("updateInput",e);
    }
//	if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
//		return false;
//	}

}

/*****************************
 *  删除输入源信息
 *  @param b
 **************************/
function deleteInput(b){
    try {


//	if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
//		return false;
//	}
        var id=b.id;
        var list=new Array();
        // 获取该数组
        list=minIFO;
        // 判断数组是否有数据
        showMes(list.length+" "+JSON.stringify(list));
        if(list!=null&&list.length>0){
            // 从新实例化一个数组接收删除数据之后的数组
            var index=0;
            for(var i=0;i<list.length;i++){
                if(list[i].id==id){
                    index=i;
                }
            }
            list.splice( index, 1 );
            showMes("new list:"+list.length);
            // var playType = sessionStorage.getItem("playType");// 获取本地播放模式

            // if (playType == null) {
            // playType = 1;
            // }
            // if (playType == 0) {
            // sendJSONForServer("IFOlist",list);
            // }
            // 把新数组保存本地覆盖之前的数组


            var selectedModeId= $("#mode_select").val().substr(7);

            if(selectedModeId==0){
                config_ifo(minIFO,$("#outputId").val());//把当前操作的窗口保存在缓存里面
                saveList("IFOlist",list);
                sessionStorage.setItem("upIFOList",1);//添加正在修改对应关系状态
                thisIFO=list;
                var iStr=(list!=null)?getExt(1,"IFOlist",list):"";
                LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口
            }else{
                var modeList=returnList("modeList");
                if(modeList!=null){
                    for(var i=0;i<modeList.length;i++){
                        if(modeList[i].id==selectedModeId){
                            modeList[i].IFOlist=list;
                        }
                    }
                    saveList("modeList",modeList);
                    localStorage.setItem("moUpdate","1");
                    var mStr=(modeList!=null)?getExt(1,"moder",modeList):"";
                    LK_CAN_OBJ.onExt(1,8,mStr);//调用回调接口
                }

            }
            minIFO=list;
            // 刷新数据
            // upAlert("删除成功！");
            loadInput();
        }
    } catch (e) {
        setError("deleteInput",e);
    }
}

function  addInput(b){
    try {
//		if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
//			return false;
//		}
        show_channal_add();
    } catch (e) {

        setError("addInput",e);
    }


}

$(function() {





    /*******************************************************************************
     *
     */
    $("#adInput").change(function(){
        var list=returnList("decoderList");
        var id=$("#adInput").val();
        if(id==0){

            $("#ga_li").hide();
            $("#gallery_num option").remove();
        }
        if(list!=null){
            for(var i=0;i<list.length;i++){
                if(list[i].id==id){
                    var bool=checkInputType(list[i].type);
                    if(bool==true&&(list[i].gn!=null&&list[i].gn!="")){
                        $("#ga_li").show();
                        $("#gallery_num option").remove();
                        for(var j=0;j<list[i].gn;j++){
                            $("#gallery_num").append("<option value='"+(j+1)+"'>"+(j+1)+"</option>");
                        }
                    }else{
                        $("#ga_li").hide();
                        $("#gallery_num option").remove();
                    }
                }
            }
        }
    });



// 点击修改窗口里的取消按钮，隐藏div窗口
    $("#upCancel").click(function(){
        $("#up_bg_img").hide();
        $("#up_ed_img").hide();
        $("#show_update").hide();
        $("#faqbg2").hide();
    });
// 点击修改窗口的图片取消按钮
    $("#updateDiv1_img").click(function(){
        $("#up_bg_img").hide();
        $("#up_ed_img").hide();
        $("#show_update").hide();
        $("#faqbg2").hide();
    });
    $(".addInput").click(function() {
        if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
            return false;
        }
        try {
            $("#adId").val(0);
            var output = $("#outputId option:selected").val();
            if (output == -1) {
                upAlert(showJSTxt(indexJSList,58));
                return;
            } else {
                var list=returnList("decoderList");
                if(list==null){
                    upAlert(showJSTxt(indexJSList,59));
                    return;
                }
                $("#adInput option").remove();
                $("#adInput").append("<option value='-1'>"+showJSTxt(indexJSList,60)+"</option>");
                $("#adOutId").val(output);
                for(var i=0;i<list.length;i++){
                    $("#adInput").append("<option value='"+list[i].id+"'>"+list[i].name+"</option>");
                }
                $("#faqbg2").show();
                $("#show_add").show();
                if (timeType == 0) {
                    $("#add_end").hide();
                    $("#add_long").show();
                    $("#adLong").focus();
                    $("#add_begin").hide();
                    $("#ad_me1").show();
                    $("#ad_me2").hide();
                } else {
                    $("#add_long").hide();
                    $("#add_begin").show();
                    $("#adBegin").focus();
                    $("#add_end").show();
                    $("#ad_me2").show();
                    $("#ad_me1").hide();
                }

                showDivAdd(output);
            }
        } catch (e) {

            setError("addInput",e);
        }
    });
    $("#add_cansel").click(function(){
        $("#up_bg_img").hide();
        $("#up_ed_img").hide();
        $("#show_add").hide();
        $("#faqbg2").hide();
        $("#ga_li").hide();
        $("#bg_img").hide();
        $("#ed_img").hide();
        $("#lt_img").hide();
    });
    $("#show_add_img").click(function(){
        $("#up_bg_img").hide();
        $("#up_ed_img").hide();
        $("#show_add").hide();
        $("#ga_li").hide();
        $("#faqbg2").hide();
        $("#bg_img").hide();
        $("#ed_img").hide();
        $("#lt_img").hide();
        var thisId=$("#outputId").val();
        var moId=$("#mode_select").val();//当前模式
        var ouId=$("#outputId").val();
        inputConfig(thisId);
        if(moId!="select_0"){
            moId=moId.substr(7);
            $("#mode_select option[value='select_"+moId+"']").attr("selected","selected");
            //$("#outputId option[value='"+ouId+"']").attr("selected","selected");
            var list=returnList("modeList");
            if(list!=null){
                for(var i=0;i<list.length;i++){
                    if(list[i].id==moId){
                        showWinMes(list[i].outputList,ouId);
                    }
                }
            }
        }
    });

    // 点击按钮添加输入源到输出通道
    $("#add_saveToInput").click(function(){

        if(timeType==1){
            if(checkBegin()==false||checkEnd()==false){
                return ;
            }
        }else{
            if(checkLong()==false){
                return;
            }
        }
        var decoderId=$("#adInput").val();// 获取输入源的ID;

        if(decoderId==-1){

            upAlert(showJSTxt(indexJSList,58));
            return
        }else{

            var outputId=$("#outputId").val();// 获取输出源的ID;
            var inputId=decoderId;// 获取输入源的ID;
            var galleryNum=null;

            if($("#gallery_num").val()==null||$("#gallery_num").val()==""){
                galleryNum=null;
            }else{
                galleryNum=parseInt($("#gallery_num").val());
            }
            var inputName=$("#adInput option:selected").text();// 获取输入源的名称
            var longtime=$("#adLong").val();// 获取时间轮训模式的时间
            var begintime=$("#adBegin").val();// 获取时间段的开始时间
            var endtime=$("#adEnd").val();// 获取时间段的结束时间
            var list=minIFO;// 从本地获取输入输出关系数组
            var newObject=new Object();// 实例一个对象
// upAlert(" 获取对象 输出序号："+outputId+" 输入序号："+inputId+" 输入名称："+inputName+"
// 轮训时间："+longtime+" 开始时间："+begintime+" 结束时间:"+endtime);

            var idIndex=0;// 用来做标识的序号
// 判断数组是否有数组

            if(list==null||list.length==0){
// upAlert("数组没数据");
// 当数组没有值的时候，从新添加数据
                newObject.id=1;// 给对象ID赋一个初始ID表示没第一个对象


                list=new Array();
            }else{
// 当数组有值的时候把对象加到数组最后
                var listNum=$("#adId").val();// 获取输入源和输出通道关系对象的Id号
// 判断是否为零：如果是在输入中插入新数据的情况ListNum就会有值,如果是把数据插入的最后面的情况listNum就为0.默认值也为0
// upAlert(list.length);
                if(listNum==0){
                    for(var i=0;i<list.length; i++){
                        idIndex++;
                    }
                }else{
                    for(var i=0;i<list.length;i++){
// upAlert(" ID:"+list[i].id+" listNum:"+listNum);
                        if(list[i].id==listNum){
                            idIndex=i+1;
                        }
                    }
                }
// upAlert("下标为："+idIndex+" 关系对象Id:"+listNum);
// upAlert("数据有数据，最大下标为:"+parseInt(list.length-1) +"数组长度"+list.length);
                var maxId=0;
                for(var i=0;i<list.length;i++){
                    if(list[i].id>maxId){
                        maxId=list[i].id;
                    }
                }
                maxId=maxId+1;
                newObject.id=getId(list);// 给对象ID赋一个最大的ID+1；
            }
// upAlert("开始长度："+list.length);//打印添加元素之前的数组长度
            newObject.outputId=outputId;// 给对象的输出通道ID赋值
            newObject.inputId=inputId;// 给对象输入通道ID赋值
            newObject.inputName=inputName;// 给输入通道Name赋值
            newObject.longTime=longtime;// 给时间轮训longTime赋值
            newObject.beginTime=begintime;// 给时间段开始时间beginTime赋值
            newObject.endTime=endtime;// 给时间段结束时间endTime赋值

            newObject.gn=galleryNum;

            list.splice( idIndex,0,newObject);// 添加数据
// 循环查看数组的元素
            // for(var i=0; i<list.length;i++){
            // upAlert(" 序号:"+list[i].id+" 输出序号："+list[i].outputId);
            // }
// var playType = sessionStorage.getItem("playType");// 获取本地播放模式




            var selectedModeId= $("#mode_select").val().substr(7);

            if(selectedModeId==0){
                saveList("IFOlist",list);
                thisIFO=list;
            }else{

                var modeList=returnList("modeList");
                if(modeList!=null){
                    for(var i=0;i<modeList.length;i++){
                        if(modeList[i].id==selectedModeId){
                            modeList[i].IFOlist=list;
                        }

                    }
                }
                saveList("modeList",modeList);
                localStorage.setItem("moUpdate","1");

            }
            minIFO=list;

            loadInput();// 从新加载数据
            $("#show_add").hide();	// 隐藏添加窗口
            $("#faqbg2").hide();
            $("#bg_img").hide();
            $("#ed_img").hide();
            $("#ga_li").hide();
            $("#lt_img").hide();
        }
    });

});


// 判断时间的正确性
function testTime(time1,time2,type){
    var t1=time1.split(":");
    var t2=time2.split(":");
    if(type=="big"){
        if( parseInt(t1[0])>parseInt(t2[0])){
            return true;
        }else if(parseInt(t1[0])==parseInt(t2[0])){
            if( parseInt(t1[1])>parseInt(t2[1])){
                return true;
            }else if(parseInt(t1[1])==parseInt(t2[1])){
                return false;
            }else{
                return false;
            }
        }else{
            return false;
        }


    }else if(type=="smoll"){
        if( parseInt(t1[0])<parseInt(t2[0])){
            return true;
        }else if(parseInt(t1[0])==parseInt(t2[0])){
            if( parseInt(t1[1])<parseInt(t2[1])){
                return true;
            }else if(parseInt(t1[1])==parseInt(t2[1])){
                return false;
            }else{
                return false;
            }
        }else{
            return false;
        }

    }
}

/****************************
 * 验证时间间隔
 * @param obj
 * @returns {Boolean}
 */
function checkLong(obj){
    var lt=$(obj).val();
    if(isNaN(lt)){
        $(obj).css("border","1px solid #E84141");
        return false;
    }
    if(lt.length<1){
        $(obj).css("border","1px solid #E84141");
        return false;
    }
    if(lt<1){
        $(obj).css("border","1px solid #E84141");
        return false;
    }else{

        $(obj).css("border","1px solid #999");
        return true;
    }
}
/**********************************
 * 验证时间段的开始时间
 * @param obj
 * @returns {Boolean}
 */
function checkBegin(obj){
    var  id=0;
    var bg=$(obj).val();
    var ze=/^(([0-1]\d)|(2[0-4])):[0-5]\d$/;
    if(bg.length==0){
        $(obj).css("border","1px solid #E84141");
        return false;
    }else{
        if(ze.test(bg)){
            var list =returnList("IFOlist");
            var objbg="00:00";
            var objed="24:00";
            var oi=$("#outputId").val();
            var lt=new Array();
            if(list!=null){
                for(var i=0;i<list.length;i++){
                    if(list[i].outputId==oi&&list[i].beginTime!=""&&list[i].endTime!=""){
                        lt.push(list[i]);
                    }
                }
            }
            if(id==0&&lt.length>0){
                objbg=lt[lt.length-1].endTime;
            }else{
                for(var i=0;i<lt.length;i++){
                    if(id==lt[i].id){
                        objbg=lt[i].endTime;
                        if((i+1)<lt.length){
                            objed=lt[i+1].beginTime;
                        }
                    }
                }
            }
            var bool1= testTime(bg,objbg,"big");
            var bool2=testTime(bg,objed,"smoll");
            if(bool1&&bool2){
                $(obj).css("border","1px solid #999");
                return true;
            }else{
                $(obj).css("border","1px solid #E84141");
                return false;
            }
        }else{
            $(obj).css("border","1px solid #E84141");
            return false;
        }
    }
}

/***********************
 *验证时间段结束时间
 *@param obj
 *@returns {Boolean}
 */
function checkEnd(obj){
    var id=0;
    var bg=$("#stt_bt").val();
    var ed=$(obj).val();
    var ze=/^(([0-1]\d)|(2[0-4])):[0-5]\d$/;
    // upAlert(ed.length+" "+bg.length);
    if(ed.length==0){
        $(obj).css("border","1px solid #E84141");
        return false;
    }else{
        if(ze.test(ed)){
            var list =returnList("IFOlist");
            var objbg=bg;
            var objed="24:00";
            var oi=$("#outputId ").val();
            var lt=new Array();
            if(list!=null){
                for(var i=0;i<list.length;i++){
                    if(list[i].outputId==oi&&list[i].beginTime!=""&&list[i].endTime!=""){
                        lt.push(list[i]);
                    }
                }
            }
            if(id==0){
                objed="24:00";
            }else{
                for(var i=0;i<lt.length;i++){
                    if(id==lt[i].id){
                        // objed=lt[i].endTime;
                        if((i+1)<lt.length){
                            objed=lt[i+1].beginTime;
                        }
                    }
                }
            }
            // upAlert("输入时间"+ed+ " 比较的结束时间:"+objbg+" 比较的开始时间："+objed);
            var  bool1= testTime(ed,objbg,"big");
            var	bool2=testTime(ed,objed,"smoll");
            if(bool1&&bool2){
                $(obj).css("border","1px solid #999");
                return true;
            }else{
                $(obj).css("border","1px solid #E84141");
                return false;
            }
        }else{
            $(obj).css("border","1px solid #E84141");
            return false;
        }
    }
}





var direction="";// 指令
var sending=false;// 发送状态
var sendCode=0x00;// 执行码
var param_2=0x00;// 执行码
var param_3=0;// 判断码
var downObjType=0;
/***************************************************************************
 * 名称：jquery加载块 作用： 参数： 调用公用属性： 生成私有属性： 调用其他的函数： 返回值：
 **************************************************************************/
$(function() {
    /***************************************************************************
     * 名称： 作用：鼠标移动到样式名为“jt”的便签上的时候替换图片 参数： 调用公用属性： 生成私有属性： 调用其他的函数： 返回值：
     **************************************************************************/
    $(".jt").mouseover(
        function() {
            $("#" + this.id).attr("src",
                "images/jt-" + this.id + "1.png");
        });
    /***************************************************************************
     * 名称： 作用：鼠标移动到样式名为“jt”的便签上的时候替换图片 参数： 调用公用属性： 生成私有属性： 调用其他的函数： 返回值：
     **************************************************************************/
    $(".jt").mouseout(
        function() {
            $("#" + this.id).attr("src",
                "images/jt-" + this.id + ".png");
        });


});



/***************************************************************************
 * 名称：sendControl 作用：根据公用函数的状态发送数据 参数： 调用公用属性：{sending:发送状态, sendCode:发送编码，
	 * thisIp:当前选中的摄像机的IP} 生成私有属性：{ip:保存当前摄像机的IP, loginCode:保存登录的随机码数组，
	 * binary:二进制数组，
	 *  } 调用其他的函数：{setCode()：根据参数把数据添加到二进制数据， checkSend()：发送数据的时候修改发送状态的函数} 返回值：
 **************************************************************************/
function sendControl(){
    if(sending==false){

        return;
    }
    var ip=thisIp;
    var num=thisNum;
// $("#ccc").append("<p>发送前检查："+sending+" 发送状态："+st+" ip:"+ip+"</p>");
    if(ip.length==0){
        upAlert(showJSTxt(indexJSList,61));
        sending=false;
        return;
    }
    var loginCode = returnSlist("loginCode");// 回去随机码
    if (loginCode != null) {
        if(sendCode==0x00){
            return;
        }
        var binary = new Uint8Array(13+ip.length);// 创建一个数组，必须固定长度
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x05, sendCode);
        binary[8]=param_2;
        binary[9]=0x00;
        binary[10]=0x00;
        binary[11]=0x00;
        binary[12]=num;
        for ( var i = 0; i < ip.length; i++) {
            binary[i + 13] = ip.substring(i, i + 1).charCodeAt();
        }
        var str="";
        for(var i=0;i<binary.length;i++){
            str=str+"  "+binary[i];
        }
        if(checkMes()){
//	showMes("开始发送命令："+str,"red");
            if(sendCode == 0x34){
                $("#faqbg").show();
                $("#yzw_mes").show();
            }
            checkSend(binary);
        }else{
            upAlert(showJSTxt(indexJSList,14));
        }
    }else{
        var ip=thisIp;
        if(sendCode==0x00){
            return;
        }
        var binary = new Uint8Array(13+ip.length);// 创建一个数组，必须固定长度
        binary[0]=0x00;
        binary[1]=0x00;
        binary[2]=0x00;
        binary[3]=0x00;
        binary[4]=0x00;
        binary[5]=0x00;
        binary[6]=0x05;
        binary[7]=sendCode;
        binary[8]=param_2;
        binary[9]=0x00;
        binary[10]=0x00;
        binary[11]=0x00;
        binary[12]=0x00;
        for ( var i = 0; i < ip.length; i++) {
            binary[i + 13] = ip.substring(i, i + 1).charCodeAt();
        }
        var str="";
        for(var i=0;i<binary.length;i++){
            str=str+"  "+binary[i];
        }
        showMes(str);
        initUl();
        // $("#ccc").append("<p>发送命令："+str+"</p>");


    }

}

/***************************************************************************
 * 名称：look 作用：根据参数获取命令码 参数：obj:对象 调用公用属性：{direction:对象ID, param_2:状态属性，
	 * param_3:状态属性， sendCode:发送码， sending:发送状态， } 生成私有属性：
 * 调用其他的函数：{checkMes()：检查上一次发送的数据是否返回， sendControl()：发送控制命令 } 返回值：
 **************************************************************************/
function look(obj){
    direction=obj.id;// 获取控制摄像机的命令
// showMes("look:"+direction);
    switch(direction){// 判断摄像机的命令
        case "zs":
            // 左上
            param_3=1;
            sendCode=0x15;
            break;
        case "sb":
            // 直上
            param_3=1;
            sendCode=0x11;
            break;
        case "ys":
            // 右上
            param_3=1;
            sendCode=0x19;
            break;
        case "zb":
            // 左边
            param_3=1;
            sendCode=0x14;
            break;
        case "zj":
            // 中间

            param_3=1;
            sendCode=0x70;
            break;
        case "yb":
            // 右边
            param_3=1;
            sendCode=0x18;
            break;
        case "zx":
            // 左下
            param_3=1;
            sendCode=0x16;
            break;
        case "xb":
            // 下边
            param_3=1;
            sendCode=0x12;
            break;
        case "yx":
            // 右下
            param_3=1;
            sendCode=0x1a;
            break;
        case "zt":
            // 变倍加
            param_3=1;
            sendCode=0x21;
            break;
        case "zw":
            // 变倍减
            param_3=1;
            sendCode=0x22;
            break;
        case "ff":
            // 变焦加
            param_3=1;
            sendCode=0x23;
            break;
        case "fn":
            // 变焦减
            param_3=1;
            sendCode=0x24;
            break;
        case "io":
            // 光圈加
            param_3=1;
            sendCode=0x25;
            break;
        case "ic":
            // 光圈减
            param_3=1;
            sendCode=0x26;
            break;
        case "dg":
            // 灯光
            param_3=2;
            sendCode=0x81;
            param_2=0x03;
            break;
        case "yus":
            // 雨刷
            param_3=2;
            sendCode=0x81;
            param_2=0x02;
            break;
        case "fzjj":
            // 辅助聚焦
            param_3=2;
            sendCode=0x81;
            param_2=0x07;
            break;
        case "jtcsh":
            // 镜头初始化
            param_3=2;
            sendCode=0x81;
            param_2=0x8;
            break;
    }
    sending=true;// 摄像机发送命令状态
    if(param_3==1){
        if(obj.id=="zj"){
            if(downObjType==0){
                downObjType=1;
                param_2=$("#textfield").val();
                $("#zj").attr("src","images/jt-zj1.png");
            }else if(downObjType==1){
                downObjType=0;
                param_2=0;
                $("#zj").attr("src","images/jt-zj.png");
            }
        }else{
            param_2=$("#textfield").val();
        }
    }
    // $("#ccc").append("<p>发送状态："+sending+" 方向："+sendCode+" 速度："+param_2+"
    // param_3:"+param_3+"</p>");数据
//$("#ccc").append("<p>开始发送</p>");
    sendControl();
}
/****************************************
 * 修改窗口坐标显示出来
 */
function up_case_show(x,y){
    if(buffer_one!=null&&buffer_one.length>0){
        param_list=buffer_one;
    }
    buffer_one=new Array();
    for(var i=0;i<param_list.length;i++){//循环计算移动的
        param_list[i].mx1=param_list[i].mx1-x;
        param_list[i].my1=param_list[i].my1-y;
        param_list[i].mx2=param_list[i].mx2-x;
        param_list[i].my2=param_list[i].my2-y;
        for(var j=0;j<objs.length;j++){
            if((objs[j].id!=9999&&objs[j].id==param_list[i].id)
                ||(objs[j].id==9999&&objs[j].sc==param_list[i].sc)){
                objs.splice(j,1);
            }
        }
        buffer_one.push(param_list[i]);
        objs.push(param_list[i]);
    }
    draw(MY_CANVAS,objs,"repeat");//重新生成画布
}

/***************************************************************************
 * 名称：mouseout 作用：鼠标离开对象的时候根据需要进行操作 参数： 调用公用属性：{sending:发送状态， param_2:发送函数，
	 * param_3:判断参数，
	 * 
	 *  } 生成私有属性： 调用其他的函数：sendControl():发送命令 返回值：
 **************************************************************************/
function mouseout(){

    if(sending==true){
        if(sendCode==0x70){
            return;
        }
        if(param_3==1){
            param_2=0x00;
            sendControl();
            sending=false;
        }else if(param_3==2){
// $("#ccc").append("<p>鼠标超出控件范围发送数据</p>");
            sendCode=0x82;
            sendControl();
            sending=false;
        }
    }
}




/***************************************************************************
 * 名称：cancelDrag 作用：鼠标松开的时候执行的函数 参数： 调用公用属性：{sending:发送状态， param_2:发送函数，
	 * param_3:判断参数，
	 * 
	 *  } 生成私有属性： 调用其他的函数：sendControl():发送命令 返回值：
 **************************************************************************/
function cancelDrag() {
    try {
//		showMes("鼠标松开开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"red");
        try {
            clean_log();//清空APP输入源窗口移动状态
        } catch (e) {
            // TODO: handle exception
        }

        if(pressID!=null){//清理音量移动状态
            loosen();
            return;
        }
        if(imgID!=null&&imgID.id=="tooltip"){//清理移动提示缓存
            upTip();
        }

        down = false;
        /************************
         * 操作自定义文件时松开鼠标按键的内容
         */
        mouseType=0;//还原鼠标状态
        if(imgID!=null&&imgID.id==MY_CANVAS){
            $(imgID).css("cursor","default");
            //showMes("objs:"+JSON.stringify(objs),"red");
            if(pType==2&&select_case!=null){
                //点击或者框选窗口的执行方法
                var list= getSelectwin(select_case,objs);
                var cont=0;//操作类型
                var w=select_case.x2-select_case.x1;
                var y =select_case.y2-select_case.y1;
                var mlist=new Array();
                if(w==0&&y==0){
                    for(var i=0;i<list.length;i++){
                        if(list[i].active==1){
                            cont=1;
                            mlist.push(list[i]);
                        } //
                    }
                }else {
                    for(var i=0;i<list.length;i++){
                        if(list[i].active==0){
                            cont=1;
                            mlist.push(list[i]);
                        }
                    }
                }//
//				for(var i=0;i<list.length;i++){
//					if((w!=0||y!=0)&&list[i].active==0){
//						mlist.push(list[i]);
//					}else if()
//				}
                if(cont==0){
                    param_list=list;
                }else{
                    param_list=mlist;
                }
                param=new Object();
                param.x1=getMin(param_list,"design").x;// 获取最小X坐标
                param.y1=getMin(param_list,"design").y;// 获取最小Y坐标
                param.x2=getMax(param_list,"design").x;// 获取最大X坐标
                param.y2=getMax(param_list,"design").y;// 获取最大Y坐标
                param.lineWidth=2;
                param.strokeColor="red";
                draw(MY_CANVAS,objs,"repeat");// 重新生成画布
                rectObj(param,MY_CANVAS);
                pType=3;//状态设为可拖动选择框
            }else{
                if(event.which==3){
                    return;
                }
                if(param!=null){
                    if(buffer_one!=null&&buffer_one.length==1&&buffer_one[0].active==1){//判断当前修改的是不是漫游窗口
                        var obj={"id":buffer_one[0].id,"x1":param.x1,"y1":param.y1,"x2":param.x2,"y2":param.y2};
                        var bool=checkAdd(obj,objs);//判断当前漫游窗口是否成立
                        //	showMes("bool:"+bool,"red");
                        if(bool==false){//如果漫游窗口后就清理当前操作的缓存
                            param_list=null;
                            buffer_one=null;//缓存选中的修改窗口
                            param=null;
                            var can=document.getElementById(LK_CANVAS);
                            var win_list=returnList("ouputXml");
                            if(win_list!=null){
                                objs=mappingXY(win_list,can.clientWidth,can.clientHeight,MY_CANVAS,1);//获取保存映射设窗口文件
                                //showMes(JSON.stringify(objs));
                                draw(MY_CANVAS,objs,"repeat");//把未修改前文件画出来
                            }
                            return;
                        }
                    }else{
                        if(objs!=null){//判断当前操作的数组是否为空
                            var bool=true;
                            var obj=null;
                            for(var i=0;i<objs.length;i++){
                                if(objs[i].active==1){
                                    obj={"id":objs[i].id,"x1":objs[i].mx1,"y1":objs[i].my1,
                                        "x2":objs[i].mx2,"y2":objs[i].my2};
                                    bool=checkAdd(obj,objs);//判断当前漫游窗口是否成立
                                    //	showMes("id:"+objs[i].id+"  bool:"+bool,"red");
                                    if(bool==false){
                                        param_list=null;
                                        buffer_one=null;//缓存选中的修改窗口
                                        param=null;
                                        var can=document.getElementById(LK_CANVAS);
                                        var win_list=returnList("ouputXml");
                                        if(win_list!=null){
                                            objs=mappingXY(win_list,can.clientWidth,can.clientHeight,MY_CANVAS,1);//获取保存映射设窗口文件
                                            //showMes(JSON.stringify(objs));
                                            draw(MY_CANVAS,objs,"repeat");//把未修改前文件画出来
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    //系统自动调正坐标
                    var yw=0;//移动X轴
                    var yh=0;//移动Y轴
                    var ix=new Array();//相靠的X轴窗口所在数组的下标
                    var iy=new Array();;//相靠的Y轴窗口所在数组的下标
                    var ds=deshu-1;
                    //deshu:是util.js的一个公用属性,表示每次移动多少个像素点
                    for(var i=0;i<objs.length;i++){
                        if((objs[i].my1<param.y1+1&&param.y1+1<objs[i].my2)||
                            (objs[i].my1<param.y2-1&&param.y2-1<objs[i].my2)||
                            (param.y1<objs[i].my1+1&&objs[i].my1+1<param.y2)||
                            (param.y1<objs[i].my2-1&&objs[i].my2-1<param.y2)){
                            if(objs[i].mx2-ds<param.x1&&param.x1<objs[i].mx2+ds){
                                yw=param.x1-objs[i].mx2;
                                ix.push(objs[i]);
                            }else if(objs[i].mx1-ds<param.x2&&param.x2<objs[i].mx1+ds){
                                yw=param.x2-objs[i].mx1;
                                ix.push(objs[i]);
                            }
                        }
                        if((objs[i].mx1<param.x1+1&&param.x1+1<objs[i].mx2)||
                            (objs[i].mx1<param.x2-1&&param.x2-1<objs[i].mx2)||
                            (param.x1<objs[i].mx1+1&&objs[i].mx1+1<param.x2)||
                            (param.x1<objs[i].mx2-1&&objs[i].mx2-1<param.x2)){
                            if(objs[i].my2-ds<param.y1&&param.y1<objs[i].my2+ds){
                                yh=param.y1-objs[i].my2;
                                iy.push(objs[i]);
                            }else if(objs[i].my1-ds<param.y2&&param.y2<objs[i].my1+ds){
                                yh=param.y2-objs[i].my1;
                                iy.push(objs[i]);
                            }
                        }
                    }
                    if(yw==0&&iy.length>0){
                        for(var i=0;i<iy.length;i++){
                            if(iy[i].mx1-ds<param.x1&&param.x1<iy[i].mx1+ds){
                                yw=param.x1-iy[i].mx1;
                            }else if(iy[i].mx2-ds<param.x2&&param.x2<iy[i].mx2+ds){
                                yw=param.x2-iy[i].mx2;
                            }
                        }
                    }
                    if(yh==0&&ix.length>0){
                        for(var i=0;i<ix.length;i++){
                            if(ix[i].my1-ds<param.y1&&param.y1<ix[i].my1+ds){
                                yh=param.y1-ix[i].my1;
                            }else if(ix[i].my2-ds<param.y2&&param.y2<ix[i].my2+ds){
                                yh=param.y2-ix[i].my2;
                            }
                        }
                    }
//						showMes("yw:"+yw+" yh:"+yh,"red");
//						showMes("objs1:"+objs.length,"red");
                    up_case_show(yw,yh);//重新画图
//						showMes("objs2:"+objs.length,"red");
                    param.x1=param.x1-yw;// 获取最小X坐标
                    param.y1=param.y1-yh;// 获取最小Y坐标
                    param.x2=param.x2-yw;// 获取最大X坐标
                    param.y2=param.y2-yh;// 获取最大Y坐标
                    param.lineWidth=2;
                    param.strokeColor="red";
                    rectObj(param,MY_CANVAS);

                }else if(param==null&&$("#design").css("display")=="block"){
                    try {
                        var index=getCanXY(MY_CANVAS);//获取当前鼠标所在的画布的坐标
                        object=getClickObjId(index.x,index.y,objs);// 获取当前点击的输出窗口
                        if(object!=null){
                            param_list= getWindow(object.st,objs);// 保存公用数组
                            param=new Object();
                            param.x1=getMin(param_list,"design").x;// 获取最小X坐标
                            param.y1=getMin(param_list,"design").y;// 获取最小Y坐标
                            param.x2=getMax(param_list,"design").x;// 获取最大X坐标
                            param.y2=getMax(param_list,"design").y;// 获取最大Y坐标
                            param.lineWidth=2;
                            param.strokeColor="red";
//								showMes("objs:"+JSON.stringify(objs),"blue");
                            draw(MY_CANVAS,objs,"repeat");// 重新生成画布
                            rectObj(param,MY_CANVAS);
                            buffer_one=param_list;
                        }
                    } catch (e) {

                        //showMes("错误:"+e,"black");
                    }
                }
                pType=0;//鼠标状态清0
                okeya=0;//移动公用函数清0
                okeyb=0;//移动公用函数清0
                okeyX=0;//放大缩小的公用函数清0
                okeyY=0;//放大缩小的公用函数清0
                //showMes("designType:"+designType+"  okeya:"+okeya+" okeyb:"+okeyb);
            }
        }else if(imgID!=null&&imgID.id==LK_CANVAS){

            param_list=new Array();
            if(xmlEntities!=null&&param!=null){
                for(var i=0;i<xmlEntities.length;i++){
                    if(xmlEntities[i].id==9999){
                        continue;
                    }
                    if(xmlEntities[0].mt==null&&xmlEntities[i].active!=1){
                        if(checkOverlap(xmlEntities[i].x1,xmlEntities[i].y1,xmlEntities[i].x2,xmlEntities[i].y2,param.x1,param.y1,param.x2,param.y2)){
                            param_list.push(xmlEntities[i]);
                        }
                    }else if(xmlEntities[0].mt==1&&xmlEntities[i].active!=1){
                        if(checkOverlap(xmlEntities[i].mx1,xmlEntities[i].my1,xmlEntities[i].mx2,xmlEntities[i].my2,param.x1,param.y1,param.x2,param.y2)){
                            param_list.push(xmlEntities[i]);
                        }
                    }
                }
            }
            if(param_list!=null&&param_list!=""&&param_list.length>1&&(addType==null||addType==0)){
                for(var i=0;i<xmlEntities.length;i++){
                    if ((typeof event.ctrlKey != "undefined") ? event.ctrlKey : event.modifiers
                        & event.CONTROL_MASK > 0){
                    }else{
                        xmlEntities[i].lineWidth=1;
                        xmlEntities[i].strokeColor="white";
                    }
                    for(var j=0;j<param_list.length;j++	){
                        if(xmlEntities[i].id==param_list[j].id){
                            if(xmlEntities[i].strokeColor=="red"){
                                xmlEntities[i].lineWidth=1;
                                xmlEntities[i].strokeColor="white";
                                break;
                            }else{
                                xmlEntities[i].lineWidth=2;
                                xmlEntities[i].strokeColor="red";
                                break;
                            }
                        }
                    }
                }
            }else if(param!=null&&(param.x2-param.x1>20&&param.y2-param.y1>20)&&addType==1){


                //添加漫游、画中画窗口
                var bool=	checkAdd(param);
                showMes("漫游窗口："+JSON.stringify(param));

                //	 param= update_addWin(xmlEntities,param);

                var return_list=null;
                if(bool){
                    // showMes("param:"+JSON.stringify(param));
                    var showParam= update_param(xmlEntities,param);
                    //	showMes("showParam:"+JSON.stringify(showParam));

//					var newList=xmlEntities.concat();
//					newList= addWin(newList,showParam);
                    if(showParam!=null){
                        return_list= addWin(xmlEntities,showParam);
                        readObjByList(return_list);
                    }else{
                        return_list=xmlEntities;
                        readObjByList(xmlEntities);
                    }
                    showMes("xmlEntities:"+JSON.stringify(xmlEntities),"red");

                    try {
                        saveList("ouputXml",return_list);
                        sessionStorage.setItem("upNum",1);
//						sendJSONForServer("ouputXml",return_list);	
                    } catch (e) {

                        showMes(e);
                    }
                }else{
                    return_list=returnList("ouputXml");
                    readObjByList(return_list);
                }
                var rStr=getExt(1,"ouputXml",return_list);
                LK_CAN_OBJ.onExt(1,1,rStr);

            }else if(addType==2){//修改漫游画中画的大小

//					if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//						loadXml();
//						closeAdd();
//						$("body").css("cursor","default");
//						return false;
//					}
                var bool=false;
                var in_num=0;
                for(var i=0;i<xmlEntities.length;i++){
                    if(xmlEntities[i].id==nwt.id){
                        in_num=xmlEntities[i].id;
                        param=new Object();
                        param.id=xmlEntities[i].id;
                        if(xmlEntities[i].mx2<xmlEntities[i].mx1){
                            var num=xmlEntities[i].mx2;
                            xmlEntities[i].mx2=xmlEntities[i].mx1;
                            xmlEntities[i].mx1=num;
                        }
                        if(xmlEntities[i].my2<xmlEntities[i].my1){
                            var num=xmlEntities[i].my2;
                            xmlEntities[i].my2=xmlEntities[i].my1;
                            xmlEntities[i].my1=num;
                        }
                        param.x1=xmlEntities[i].mx1;
                        param.y1=xmlEntities[i].my1;
                        param.x2=xmlEntities[i].mx2;
                        param.y2=xmlEntities[i].my2;
                        bool=checkAdd(param);//验证窗口的合法性
                    }
                }
                if(bool){
                    var showParam={"x1":param.x1,"y1":param.y1,"x2":param.x2,"y2":param.y2,
                        "lineWidth":2,"strokeColor":"red","fillColor":"black"};
                    showParam= update_param(xmlEntities,showParam);
                    if(showParam!=null){
//							showMes("showParam:"+JSON.stringify(showParam)+" id:"+param.id,"green");
                        for(var i=0;i<xmlEntities.length;i++){
                            if(xmlEntities[i].id==param.id){
                                xmlEntities[i].mx1=showParam.x1;
                                xmlEntities[i].my1=showParam.y1;
                                xmlEntities[i].mx2=showParam.x2;
                                xmlEntities[i].my2=showParam.y2;
                            }
                        }
                    }
                    readObjByList(xmlEntities, LK_CANVAS);
                    saveList("ouputXml",xmlEntities);
                    sessionStorage.setItem("upNum",1);
                    var rStr=getExt(1,"ouputXml",xmlEntities);
                    LK_CAN_OBJ.onExt(1,1,rStr);
//						sendJSONForServer("ouputXml",xmlEntities);	
                }else{
                    //还原状态
                    xmlEntities=returnList("ouputXml");
                    for(var i=0;i<xmlEntities.length;i++){
                        if(xmlEntities[i].id==in_num){
                            xmlEntities[i].strokeColor="red";
                            nwt=xmlEntities[i];
                        }else{
                            xmlEntities[i].strokeColor="white";
                        }
                    }
                    readObjByList(xmlEntities, LK_CANVAS);
                }

            }else if(addType==3){

                if(event.which==3){//当右键点击的时候当前操作取消
                    closeAdd();
                    return false;
                }
                if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
                    loadXml();
                    closeAdd();
                    $("body").css("cursor","default");
                    return false;
                }
                var move_mouse=getCanXY(LK_CANVAS);
                var move_w=move_mouse.x-gbt_x;
                var move_h=move_mouse.y-gbt_y;
                var zm=2;
                var fm=-2;
//					showMes("move_w:"+move_w+" move_h:"+move_h,"red");
                if(move_w>zm||move_h>zm||move_w<fm||move_h<fm){
//						showMes("双击","blue");
                }else{
//						showMes("双击","red");
                    loadXml();
                    closeAdd();
                    return false;
                }

                closeAdd();
                var bool=false;
                var in_num=0;
                for(var i=0;i<xmlEntities.length;i++){
                    if(xmlEntities[i].id==mdObj.id){
                        in_num=xmlEntities[i].id;
                        param=new Object();
                        param.id=xmlEntities[i].id;
                        if(xmlEntities[i].mt==null||xmlEntities[i].mt==0){
                            param.x1=xmlEntities[i].x1;
                            param.y1=xmlEntities[i].y1;
                            param.x2=xmlEntities[i].x2;
                            param.y2=xmlEntities[i].y2;
                        }else if(xmlEntities[i].mt==1){
                            param.x1=xmlEntities[i].mx1;
                            param.y1=xmlEntities[i].my1;
                            param.x2=xmlEntities[i].mx2;
                            param.y2=xmlEntities[i].my2;
                        }
                        bool=checkAdd(param);//验证窗口的合法性
                    }
                }
                if(bool){
                    var showParam={"x1":param.x1,"y1":param.y1,"x2":param.x2,"y2":param.y2,
                        "lineWidth":2,"strokeColor":"red","fillColor":"black"};
                    showParam= update_param(xmlEntities,showParam);
                    if(showParam!=null){
//							showMes("showParam:"+JSON.stringify(showParam)+" id:"+param.id,"green");
                        for(var i=0;i<xmlEntities.length;i++){
                            if(xmlEntities[i].id==param.id){
                                xmlEntities[i].mx1=showParam.x1;
                                xmlEntities[i].my1=showParam.y1;
                                xmlEntities[i].mx2=showParam.x2;
                                xmlEntities[i].my2=showParam.y2;
                            }
                        }
                    }
                    readObjByList(xmlEntities, LK_CANVAS);
                    saveList("ouputXml",xmlEntities);
                    sessionStorage.setItem("upNum",1);
                    var rStr=getExt(1,"ouputXml",xmlEntities);
                    LK_CAN_OBJ.onExt(1,1,rStr);
//						sendJSONForServer("ouputXml",xmlEntities);	
                }else{
                    //还原状态
                    xmlEntities=returnList("ouputXml");
                    for(var i=0;i<xmlEntities.length;i++){
                        if(xmlEntities[i].id==in_num){
                            xmlEntities[i].strokeColor="red";
                            nwt=xmlEntities[i];
                        }else{
                            xmlEntities[i].strokeColor="white";
                        }
                    }
                    readObjByList(xmlEntities, LK_CANVAS);
                }

            }
            param=null;//清理选择框缓存

//				showMes("鼠标松开param_list:"+param_list.length);
        }
        var c_type=0;
        c_type= localStorage.getItem("clickType");//获取双击点击效果

        if(type==1){// 是否拖动左边执行的输入源模块
            var ouputXml=returnList("ouputXml");
            if(ouputXml!=null){
                for(var i=0;i<ouputXml.length;i++){
                    for(var j=0;j<xmlEntities.length;j++){
                        if(ouputXml[i].id==xmlEntities[j].id){
                            ouputXml[i].strokeColor=xmlEntities[j].strokeColor;
                        }
                    }
                }
            }
            saveList("ouputXml",ouputXml);
            loadXml();
        }else if(type==0&&c_type==null){
            readObjByList(xmlEntities);
        }
        type=0;
        // showMes("鼠标松开:"+sending+" "+zh(sendCode)+" "+zh(param_3)+"</p>");
        if(sending==true){
            if(sendCode==0x70){
                return;
            }
            if(param_3==1){
                // $("#ccc").append("<p>鼠标松开发送数据</p>");
                param_2=0x00;
                sendControl();
                sending=false;
            }else if(param_3==2){
                sendCode=0x82;
                sendControl();
                sending=false;
            }
        }
//			showMes("鼠标松开结束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"red");

    } catch (e) {
        setError("cancelDrag",e);
    }

}
/****************************************
 * 判断这个数值是否在正确的范围之内
 * @param num
 * @param minNum
 * @param maxNum
 * @returns
 */
function checkWinXY(num, minNum,maxNum){
    var newNum=0;
    if ( num < ( 64 / minNum * maxNum ) ){
        newNum = 64 / minNum * maxNum;
    }else if ( num > maxNum - ( 64 / minNum * maxNum ) ) {
        newNum = maxNum - ( 64 / minNum * maxNum );
    }else{
        newNum = num;
    }
    return newNum;
}




/****************************************
 * 偏移显示添加窗口
 * @param paramList
 * @param param
 * @returns
 */
function update_param(paramList,param){
    try {
//	var size=(localStorage.getItme("size")!=null)?localStorage.getItme("size").split("/")[2]:1;
        var size=localStorage.getItem("size");
        if(size!=null){
            size=size.split("/")[2];
        }else{
            size=1;
        }
        if(size!=0&&size!=1){
            return param;
        }
        var width=0;
        var height=0;
        if(size==0){//判断物理屏的分辨率
            width=1024;
            height=720;
        }else if(size==1){
            width=1920;
            height=1080;
        }

        if(param.x2<param.x1){
            var a=param.x1;
            param.x1=param.x2;
            param.x2=a;
        }
        if(param.y2<param.y1){
            var b=param.y1;
            param.y1=param.y2;
            param.y2=b;
        }
        var newParam= param;
        var winList=restore(paramList);//转换为物理屏;
//	showMes("param:"+JSON.stringify(param));
//	showMes("list:" + JSON.stringify(winList));
        if(winList!=null){
            var beginWin=null;//开始坐标点所在的物理屏
            var endWin=null;//结束坐标点所在的物理屏
            var inBegin=null;//开始坐标点所在的窗口
            var inEnd=null;//结束坐标点所在的窗口
            for(var i=0;i<winList.length;i++){
                if(checkIndex(param.x1+0.1,param.y1+0.1,winList[i].x1,winList[i].y1,winList[i].x2,winList[i].y2)
                    &&winList[i].active!=1){
//				 winList[i])+"  bool:"+checkIndex(param.x1+0.1,param.y1+0.1,winList[i].x1,winList[i].y1,winList[i].x2,winList[i].y2));
//				showMes("bool:"+(param.x1!=winList[i].x2&&param.y1!=winList[i].y2),"red");
                    if(param.x1!=winList[i].x2&&param.y1!=winList[i].y2){
                        beginWin=winList[i];
                    }

                }
                if(checkIndex(param.x2-0.1,param.y2-0.1,winList[i].x1,winList[i].y1,winList[i].x2,winList[i].y2)
                    &&winList[i].active!=1&&param.x2!=winList[i].x1&&param.y2!=winList[i].y1){
                    endWin=winList[i];
                }
            }
//		showMes("beginWin:"+beginWin+" endWin:"+endWin);
//		showMes("param:"+JSON.stringify(param),"red");
            for(var i=0;i<paramList.length;i++){
                if(checkIndex(param.x1+0.1,param.y1+0.1,paramList[i].mx1,paramList[i].my1,
                        paramList[i].mx2,paramList[i].my2)&&paramList[i].active!=1&&param.x1!=paramList[i].mx2
                    &&param.y1!=paramList[i].my2&&paramList[i].id!=9999){
                    inBegin={"id":paramList[i].id,"x1":paramList[i].mx1,"y1":paramList[i].my1,
                        "x2":paramList[i].mx2,"y2":paramList[i].my2,"active":paramList[i].active};

                }
                if(checkIndex(param.x2-0.1,param.y2-0.1,paramList[i].mx1,paramList[i].my1,
                        paramList[i].mx2,paramList[i].my2)&&paramList[i].active!=1&&param.x2!=paramList[i].mx1&&
                    param.y2!=paramList[i].my1&&paramList[i].id!=9999){
                    inEnd={"id":paramList[i].id,"x1":paramList[i].mx1,"y1":paramList[i].my1,
                        "x2":paramList[i].mx2,"y2":paramList[i].my2,"active":paramList[i].active};
                }
            }
//		showMes("inBegin:"+inBegin+" inEnd:"+inEnd,"blue");
            if(inBegin==null||inEnd==null){

//			showMes("返回："+JSON.stringify(param));
                return param;
            }


//		showMes("id:"+beginWin.id+ "  id:"+endWin.id+" width:"+width+" height:"+height,"red");
            var wsize = width / ( beginWin.x2 - beginWin.x1 );
            var hsize = height / ( beginWin.y2 - beginWin.y1 );
            var bx = parseInt ( ( param.x1 - beginWin.x1 ) * wsize );//开始X坐标点所在的物理屏的正事坐标
            var by = parseInt ( ( param.y1 - beginWin.y1 ) * hsize);
            var ex = parseInt ( ( param.x2 - endWin.x1 ) * wsize);
            var ey = parseInt ( ( param.y2 - endWin.y1 ) * hsize);
            var minW = 1280;
            var minH = 720;
            var beginX = checkWinXY ( bx , minW , width );
            var beginY = checkWinXY ( by , minH , height );
            var endX = checkWinXY ( ex , minW , width );
            var endY = checkWinXY ( ey , minH , height );

//		showMes("wsize:"+wsize+" hsize:"+hsize+" bx:"+bx+" by:"+by+" ex:"+ex+" ey:"+ey,"red");
//		showMes("begin:("+beginX+" , "+beginY+") end:("+endX+" , "+endY+")");
            var bwList = getWindow ( beginWin.id , paramList );
//		showMes("length:"+bwList.length+" bwList:"+JSON.stringify(bwList),"red");
            //showMes("inBegin:"+JSON.stringify(inBegin),"blue");
            //	showMes("inEnd:"+JSON.stringify(inEnd),"blue");
            var beginObj=returnWHNum(paramList,inBegin);
            var endObj=returnWHNum(paramList,inEnd);
            //	showMes("beginObj:"+JSON.stringify(beginObj),"red");
            //	showMes("endObj:"+JSON.stringify(endObj),"red");
            //	showMes("beginObj:"+beginObj.w+" : "+beginObj.h+ "  end:"+endObj.w+" : "+endObj.h);
            var obj=returnWHNum(paramList,beginWin,1);
//		showMes("beginWin.id:"+beginWin.id+" endWin.id:"+endWin.id+ " obj:"+JSON.stringify(obj));
//		
            var num=0;//继续当前当前漫游窗口所做的物理屏总有多少个窗口
            var objList=obj.list;
            if(objList!=null){
                for(var i=0;i<objList.length;i++){
                    if(objList[i].id!=9999){
                        num++;
                    }
                }
            }
            if(beginWin.id==endWin.id&&num>1){//画中画
                var list=obj.list;
                var bool=true;
                for(var i=0;i<list.length;i++){
                    for(var j=0;j<list.length;j++){
                        if((list[i].mx2-list[i].mx1)-(list[j].mx2-list[j].mx1)>1||
                            (list[i].my2-list[i].my1)-(list[j].my2-list[j].my1)>1){
                            bool=false;
                            break;
                        }
                    }
                }
                //showMes("bool:"+bool);
                if(bool){
                    //showMes("list:"+JSON.stringify(list),"red");
                    for(var i=0;i<list.length;i++){
                        if(checkIndex(param.x1+0.1,param.y1+0.1,list[i].mx1,list[i].my1,list[i].mx2,list[i].my2)){
                            beginWin=list[i];
                        }
                        if(checkIndex(param.x2-0.1,param.y2-0.1,list[i].mx1,list[i].my1,list[i].mx2,list[i].my2)){
                            endWin=list[i];
                        }
                    }
                    //showMes("begin:"+JSON.stringify(beginWin)+"  endWin:"+JSON.stringify(endWin),"blue");
//				showMes("param.x1:"+param.x1+" param.y1:"+param.y1+" param.x2:"+param.x2+" param.y2:"+param.y2,"blue");
                    //showMes("w:"+obj.w+" h:"+obj.h,"red");
                    if(obj.w==2&&obj.h==2){
                        newParam.x1=checkMinNum(beginWin.mx1,beginWin.mx2,param.x1,8);
                        newParam.y1=checkMinNum(beginWin.my1,beginWin.my2,param.y1,8);
                        newParam.x2=checkMinNum(endWin.mx1,endWin.mx2,param.x2,8);
                        newParam.y2=checkMinNum(endWin.my1,endWin.my2,param.y2,8);
                    }else if(obj.w==3&&obj.h==3){
                        newParam.x1=checkMinNum(beginWin.mx1,beginWin.mx2,param.x1,2);
                        newParam.y1=checkMinNum(beginWin.my1,beginWin.my2,param.y1,2);
                        newParam.x2=checkMinNum(endWin.mx1,endWin.mx2,param.x2,2);
                        newParam.y2=checkMinNum(endWin.my1,endWin.my2,param.y2,2);
                    }else if((obj.w==4&&obj.h==4)||(obj.w==5&&obj.h==5)||(obj.w==6&&obj.h==6)){
                        newParam.x1=checkMinNum(beginWin.mx1,beginWin.mx2,param.x1,1);
                        newParam.y1=checkMinNum(beginWin.my1,beginWin.my2,param.y1,1);
                        newParam.x2=checkMinNum(endWin.mx1,endWin.mx2,param.x2,1);
                        newParam.y2=checkMinNum(endWin.my1,endWin.my2,param.y2,1);
                    }

                    if(newParam.x2-newParam.x1<5||newParam.y2-newParam.y1<5){
                        return null;
                    }
                }else{
                    for(var i=0;i<list.length;i++){
                        if(checkIndex(param.x1+0.1,param.y1+0.1,list[i].mx1,list[i].my1,list[i].mx2,list[i].my2)){
                            beginWin=list[i];
                        }
                        if(checkIndex(param.x2-0.1,param.y2-0.1,list[i].mx1,list[i].my1,list[i].mx2,list[i].my2)){
                            endWin=list[i];
                        }
                    }
                    if(obj.w>3||obj.h>3){
                        newParam.x1=checkMinNum(beginWin.mx1,beginWin.mx2,param.x1,1);
                        newParam.y1=checkMinNum(beginWin.my1,beginWin.my2,param.y1,1);
                        newParam.x2=checkMinNum(endWin.mx1,endWin.mx2,param.x2,1);
                        newParam.y2=checkMinNum(endWin.my1,endWin.my2,param.y2,1);
                    }
                }
                //showMes("obj:"+obj.w+"  h:"+obj.h +" newParam:"+JSON.stringify(newParam),"blue");
//			return null;
//			showMes("bool:"+	bool);
//			
            }else{
                //	showMes("beginWin:"+JSON.stringify(param),"red");
                //	showMes(JSON.stringify(paramList));s
                var aaa=true,bbb=true,ccc=true,ddd=true;
//				showMes("开始beginX:"+beginX+" beginY:"+beginY+" endX:"+endX+" endY:"+endY+" width:"+width+" height："+height);
//
//				showMes("变化beginX:"+beginX+" beginY:"+beginY+" endX:"+endX+" endY:"+endY);
                if(beginObj.w==3&&inBegin.mx1==inEnd.mx1&&inBegin.my1==inEnd.my1){
                    if(beginX<=(width/2)+1&&endX<=(width/2)+1){
                        beginX=0;
                        endX=(width/2);
                    }else if(beginX>=(width/2)&&beginX<width+1&&endX>=(width/2)&&endX<width+1){
                        beginX=(width/2);
                        endX=width;
                    }
                    if(beginY<=(height/2)+1&&endY<=(height/2)+1){
                        beginY=0;
                        endY=(height/2);
                    }else if(beginY>=(height/2)&&beginY<height+1&&endY>=(height/2)&&endY<height+1){
                        beginY=(height/2);
                        endY=height;
                    }
                }
                var bs=4;//
                var min_size=64;//靠边最小坐标
//				if(beginX!=0&&beginX<64){
//					if(min_size>32){
//						beginX=64;
//					}else{
//						beginX=0;
//					}
//				}else if(beginX!=width&&beginX>width-min_size){
//					if(min_size>width-32){
//						beginX=width;
//					}else{
//						beginX=width-64;
//					}
//				}
                while(aaa||bbb||ccc||ddd){//计算X坐标
                    if(aaa){
                        if((((beginX/width)*(parseInt(1280/beginObj.w /bs)*bs))%bs==0)&&
                            (((beginX/width)*(parseInt(1920/beginObj.w /bs)*bs))%bs==0)
                            &&beginX>min_size&&beginX<width-min_size&&
                            (beginX/width)*(1280/beginObj.w )>min_size&&
                            (width-beginX)/width*(1280/beginObj.w )>min_size

                        ){
                            aaa=false;
                        }else{
                            beginX++;

                        }
                        if(beginX>width){
                            aaa=false;
                            beginX=width;
                            break;
                        }
                    }
                    if(bbb){
                        if(( beginY / height ) * ( 720 / beginObj.h) % bs == 0 &&
                            ( beginY / height ) * ( 960 / beginObj.h) % bs == 0 &&
                            ( beginY / height ) * ( 1080 / beginObj.h) % bs == 0
                            &&beginY>min_size&&beginY<height-min_size&&
                            (beginY/height)*(720/beginObj.h )>min_size&&
                            (height-beginY)/height*(720/beginObj.h )>min_size
                        ){
                            bbb=false;
                        }else if (beginY == height ){
                            bbb = false ;
                        }else{
                            beginY ++ ;
                        }
                    }
                    if(ccc){
                        if((((endX/width)*(parseInt(1280/endObj.w /bs)*bs))%bs==0)&&
                            (((endX/width)*(parseInt(1920/endObj.w /bs)*bs))%bs==0)
                            &&endX>min_size&&endX<width-min_size&&
                            (endX/width)*(1280/beginObj.w )>min_size&&
                            (width-endX)/width*(1280/beginObj.w )>min_size){
                            ccc=false;
                        }else{
                            endX++;
                        }
                        if(endX>width){
                            ccc=false;
                            endX=width;
                        }
                    }
                    if(ddd){
                        if(( endY / height ) * ( 720 / endObj.h) % bs == 0 &&
                            ( endY / height ) * ( 960 / endObj.h) % bs == 0 &&
                            ( endY / height ) * ( 1080 / endObj.h) % bs == 0
                            &&endY>min_size&&endY<height-min_size&&
                            (endY/height)*(720/beginObj.h )>min_size&&
                            (height-endY)/height*(720/beginObj.h )>min_size){
                            ddd=false;
                        }else if( endY == height ){
                            ddd = false ;
                        }else{
                            endY ++ ;
                        }
                        if(endY>height){
                            endY=height;
                            ddd=false;
                        }
                    }
                    //showMes("当前：beginX:"+beginX+" beginY:"+beginY+" endX:"+endX+" endY:"+endY,"red");
                }

                //	showMes("width:"+width+" height:"+height);
                beginX=(beginX/wsize)+beginWin.x1;
                beginY=(beginY/hsize)+beginWin.y1;
                endX=(endX/wsize)+endWin.x1;
                endY=(endY/hsize)+endWin.y1;
                //	showMes("beginX:"+beginX+" endX:"+endX+" "+" beginY:"+beginY+ " endY:"+ endY ,"blue");
//				if(endX<beginX){
//					var a=beginX;
//					beginX=endX;
//					endX=a;
//				}
//				if(endY<beginY){
//					var b=beginY;
//					beginY=endY;
//					endY=b;
//				}
//				if(endX-beginX<15){
//					return param;
//				}
//				if(endY-beginY<15){
//					return param;
//				}
                //newParam={"x1":beginX,"y1":beginY,"x2":endX,"y2":endY,"lineWidth":2,"strokeColor":"red","fillColor":"black"};

            }

        }
//		showMes("newParam:"+JSON.stringify(newParam));
        return newParam;
    } catch (e) {

        setError("update_param",e);
        return null;
    }
}

/****************************************
 * 修改添加的漫游窗口
 * @param paramList
 * @param paramWin
 * @returns
 */
function update_addWin(paramList, paramWin){
    try {
        var obj=paramWin;
        var mlist=new Array();
        var list=paramList;
//	showMes("开始LIST:"+list.length);
        if(list!=null){//判断数组是否为空
            for(var i=0;i<list.length;i++){//获取跟当前框有重叠的物理屏窗口
                if(checkOverlap(paramWin.x1+1,paramWin.y1+1,paramWin.x2-1,paramWin.y2-1
                        ,list[i].mx1,list[i].my1,list[i].mx2,list[i].my2)&&list[i].active==0&&list[i].id!=9999){
                    if(list[i].w>dwh||list[i].h>dwh){
                        mlist.push(list[i]);
                        for(var j=0;j<list.length;j++){
                            if(list[j].id==9999&&list[i].id==list[j].st){
                                mlist.push(list[j]);
                            }
                        }
                    }else if(list[i].w==dwh&&list[i].h==dwh){
                        mlist.push(list[i]);
                    }else if(list[i].w<dwh||list[i].h<dwh){
                        var bool=true;
                        for(var a=0;a<mlist.length;a++){
                            if(mlist[a].sc==list[i].sc){
                                bool=false;
                            }
                        }
                        if(bool){
                            for(var j=0;j<list.length;j++){
                                if(list[i].sc==list[j].sc){
                                    mlist.push(list[j]);
                                }
                            }
                        }

                    }
                }
            }
            if(mlist.length>0){//判断重叠窗口数组是否为空
                var wh=returnWHNum(paramList,paramWin);
                var bool=false;
                if(wh.w>3||wh.h>3){
                    bool=true;
                }
                if(bool){
                    mlist=restore(mlist);//把重叠的窗口转换为物理屏
//				showMes("转换mlist:"+JSON.stringify(mlist),"red");
                    for(var i=0;i<mlist.length;i++){//求屏的中心点
                        if(checkIndex(paramWin.x1,paramWin.y1,mlist[i].x1,mlist[i].y1,mlist[i].x2,mlist[i].y2)){
//						showMes("最小窗口ID:"+mlist[i].id,"red");
                            obj.x1=(mlist[i].x2-mlist[i].x1)/2+mlist[i].x1;
                            obj.y1=(mlist[i].y2-mlist[i].y1)/2+mlist[i].y1;
                        }
                        if(checkIndex(paramWin.x2,paramWin.y2,mlist[i].x1,mlist[i].y1,mlist[i].x2,mlist[i].y2)){
//						showMes("最大窗口ID:"+mlist[i].id,"red");
                            obj.x2=(mlist[i].x2-mlist[i].x1)/2+mlist[i].x1;
                            obj.y2=(mlist[i].y2-mlist[i].y1)/2+mlist[i].y1;
                        }
                    }
                }
            }
        }
        return obj;
    } catch (e) {

        setError("update_addWin",e);
    }
}


var down = false;
var gbt_x, gbt_y, imgID,tdID,gbt_x1,gbt_w,
    gbt_h,divx,divy,mapx,mapy,objx,objs,
    param_list,param,pType,buffer_one,buffer_two;
var mdt=0;
var mdObj=null;
/***************************************************************************
 *鼠标按下时保存鼠标的状态文件
 * 名称：dragImage 作用：点击对象获取对象在当前页面的坐标，和鼠标在对象的坐标值 参数：obj:当前点击的对象
 * 调用公用属性：{
	 * gbt_imgID：当前对象，
	 * gbt_tdID：id为“gbt”的对象，
	 * gbt_x:鼠标在当前对象的X轴坐标， 
	 * gbt_y:鼠标在当前对象的Y轴坐标, 
	 * gbt_x1:“gbt”对象的起点X轴坐标, 
	 * gbt_w:“gbt”对象的结束X轴坐标,
	 * objs:当前操作的窗口数组,
	 * param_list:公用参数,
	 * param:公用参数
	 * pType:公用参数
	 * buffer_one:公用参数
	 * buffer_two:公用参数  
	 * down:鼠标状态}
 * mdObj:鼠标移动前的漫游窗口
 * mdt:设置点击放大缩小的类型:0=正常状态,1=左上角,2=右下角,3=右上角,4=左下角,5=左边,6=右边,7=上边,8=下边
 * 生成私有属性： 调用其他的函数： 返回值：
 **************************************************************************/
function dragImage(obj) {
//	showMes("鼠标按下开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"red");
    var bg_id="";
    imgID = obj;
    var index=null;
    index=getCanXY(obj.id);//获取当前鼠标所在的画布的坐标
    gbt_x=index.x;//保存鼠标按下的状态
    gbt_y=index.y;//保存鼠标按下的状态
    switch (imgID.id) {
        case "map_im"://小地图
            bg_id="map_rd";
            tdID=document.getElementById(bg_id);
            divx=document.getElementById("map_div").offsetLeft;
            divy=document.getElementById("map_div").offsetTop;
            mapx=document.getElementById("map_entity").offsetLeft;
            mapy=document.getElementById("map_entity").offsetTop;
            gbt_x=event.clientX-parseInt(divx)-parseInt(mapx);
            gbt_y=event.clientY - parseInt(divy)- parseInt(mapy);
            gbt_x1=tdID.offsetLeft;
            objx=imgID.offsetLeft;
            gbt_w=tdID.clientWidth+gbt_x1;
            break;
        case "sudu"://速度条
            bg_id="gbt";
            tdID=document.getElementById(bg_id);
            gbt_x = event.clientX - parseInt(imgID.offsetLeft);
            gbt_y = event.clientY - parseInt(imgID.offsetTop);
            gbt_x1=tdID.offsetLeft;
            gbt_w=tdID.clientWidth+gbt_x1;
            break;
        case MY_CANVAS://自定义
            if(objs==null){
                objs=returnList("ouputXml");//获取输出窗口配置文件
            }
            if(objs!=null){//判断数组是否为空
                var checkBool=true;
                if(param_list!=null){
                    for(var i=0;i<param_list.length;i++){
                        for(var j=0;j<param_list.length;j++){
                            if(param_list[i].st!=param_list[j].st){
                                checkBool=false;
                                break;
                            }
                        }
                    }
                }
                var m_val=9;//鼠标位置
                cline=10;
//			showMes("index:"+JSON.stringify(index)+" param:"+JSON.stringify(param),"red");
                if(index!=null&&param!=null){
                    m_val=position(index.x,index.y,param.x1,param.y1,param.x2,param.y2,MY_CANVAS);
                }
//			showMes("m_val"+m_val,"red");
                if(param!=null&&m_val!=9&&checkBool&&event.which!=3){//放大缩小
                    pType=1;
                    if(m_val>8){
                        mdt=0;
                    }else{
                        mdt=m_val;
                    }
//				showMes("m_val:"+m_val+"mdt:"+mdt,"red");
                }else if(getClickObjId(index.x,index.y,objs)==null&&event.which!=3){//选择窗口模式
                    pType=2;
                    param=null;//清理缓存选择的单个窗口
                    select_case=null;//清理缓存选择的窗口组
                    param_list=null;//清理缓存数组的所有子窗口
                    buffer_one=null;//清理缓存的修改后的窗口组
                }else if(param!=null&&checkIndex(index.x,index.y,param.x1,param.y1,param.x2,param.y2)){
                    pType=0;
                    buffer_one=null;//清理缓存
                }else if(event.which!=3){//把选择的窗口进行移动
                    pType=2;
                    param=null;//清理缓存选择的单个窗口
                    select_case=null;//清理缓存选择的窗口组
                    param_list=null;//清理缓存数组的所有子窗口
//				if(param!=null&&checkIndex(index.x,index.y,param.x1,param.y1,param.x2,param.y2)){//已经选择了窗口
//				
//				}else{//未选择窗口，重新选择窗口
//					object=getClickObjId(index.x,index.y,objs);// 获取当前点击的输出窗口
//					draw(MY_CANVAS,objs,"repeat");// 重新生成画布
//					param_list= getWindow(object.st,objs);// 保存公用数组
//				}
//				pType=0; 
//				buffer_one=null;//清理缓存
                }
//			showMes("pType:"+pType);
                if(param_list!=null){
                    param=new Object();
                    param.x1=getMin(param_list,"design").x;// 获取最小X坐标
                    param.y1=getMin(param_list,"design").y;// 获取最小Y坐标
                    param.x2=getMax(param_list,"design").x;// 获取最大X坐标
                    param.y2=getMax(param_list,"design").y;// 获取最大Y坐标
                    param.lineWidth=2;
                    param.strokeColor="red";
                    rectObj(param,MY_CANVAS);
                }
            }else{
                //	showMes("输出窗口文件为空!","red");

            }
            $(obj).css("cursor","pointer");
            //showMes("开始坐标:"+gbt_x+" "+gbt_y);
            break;
        case LK_CANVAS://画布
//		showMes("开始坐标:"+gbt_x+" "+gbt_y);

            /******************************
             * 对漫游、画中画操作
             */
            if(nwt!=null){
                moveXY=getCanXY(LK_CANVAS);
                cline=10;
                var ox1=0;
                var oy1=0;
                var ox2=0;
                var oy2=0;
                if(nwt.mt==null||nwt.mt==0){
                    //标准
                    ox1=nwt.x1;
                    oy1=nwt.y1;
                    ox2=nwt.x2;
                    oy2=nwt.y2;
                }else if(nwt.mt==1&&nwt.active==1){
                    //自定义
                    ox1=nwt.mx1;
                    oy1=nwt.my1;
                    ox2=nwt.mx2;
                    oy2=nwt.my2;
                }
                if(checkLine(moveXY.x,moveXY.y,ox2,oy2)==true||checkLine(moveXY.x,moveXY.y,ox1,oy1)==true){
                    addType=2;
                    $("#addWindow").val(showJSTxt(indexJSList,62));
                    $("body").css("cursor","se-resize");
                    if(checkLine(moveXY.x,moveXY.y,ox2,oy2)==true){
                        unwt=1;
                    }else if(checkLine(moveXY.x,moveXY.y,ox1,oy1)==true){
                        unwt=2;
                    }
                }else if(checkLine(moveXY.x,moveXY.y,ox2,oy1)==true||checkLine(moveXY.x,moveXY.y,ox1,oy2)==true){
                    addType=2;
                    $("#addWindow").val(showJSTxt(indexJSList,62));
                    $("body").css("cursor","ne-resize");
                    if(checkLine(moveXY.x,moveXY.y,ox2,oy1)==true){
                        unwt=3;
                    }else if(checkLine(moveXY.x,moveXY.y,ox1,oy2)==true){
                        unwt=4;
                    }
                }else if((checkLine(moveXY.x,null,ox1,null)==true||checkLine(moveXY.x,null,ox2,null)==true)&&
                    (moveXY.y>oy1&&moveXY.y<oy2)){
                    addType=2;
                    $("#addWindow").val(showJSTxt(indexJSList,62));
                    $("body").css("cursor","e-resize");
                    if(checkLine(moveXY.x,null,ox1,null)==true){
                        unwt=5;
                    }else if(checkLine(moveXY.x,null,ox2,null)==true){
                        unwt=6;
                    }
                }else if((checkLine(moveXY.y,null,oy1,null)==true||checkLine(moveXY.y,null,oy2,null)==true)
                    &&(moveXY.x>ox1&&moveXY.x<ox2)){
                    addType=2;
                    $("#addWindow").val(showJSTxt(indexJSList,62));
                    $("body").css("cursor","n-resize");
                    if(checkLine(moveXY.y,null,oy1,null)==true){
                        unwt=7;
                    }else if(checkLine(moveXY.y,null,oy2,null)==true){
                        unwt=8;
                    }
                }else if(checkIndex(moveXY.x,moveXY.y,ox1,oy1,ox2,oy2)){
                    addType=3;
                    $("#addWindow").val(showJSTxt(indexJSList,62));
                    //清空公用缓存函数
                    okeyX=0;//公用缓存函数
                    okeyY=0;//公用款存函数
                    okeya=0;//公用缓存函数
                    okeyb=0;//公用款存函数
                    if(xmlEntities!=null){
                        for(var i=0;i<xmlEntities.length;i++){
                            if(xmlEntities[i].active==1&&xmlEntities[i].strokeColor=="red"){
                                mdObj=new Object();
                                mdObj.id=xmlEntities[i].id;
                                mdObj.mx1=xmlEntities[i].mx1;
                                mdObj.my1=xmlEntities[i].my1;
                                mdObj.mx2=xmlEntities[i].mx2;
                                mdObj.my2=xmlEntities[i].my2;
//							showMes("mdObj:"+JSON.stringify(mdObj),"red");
                            }
                        }
                    }
                    $("body").css("cursor","pointer");
                }else{
                    $("body").css("cursor","default");
                }
            }
            break;
        default:
            break;
    }
    down = true;
//	showMes("鼠标按下结束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"red");
}


var okeyX=0;//公用缓存函数
var okeyY=0;//公用款存函数
var okeya=0;//公用缓存函数
var okeyb=0;//公用款存函数
var select_case;//公用缓存函数
/***************************************************************************
 * 名称：moveImage 作用：鼠标移动时执行的函数 参数： 调用公用属性：{down：鼠标状态， imgID:点击的对象， } 生成私有属性：
 * 调用其他的函数：sendControl():发送命令 返回值：
 *
 **************************************************************************/
function moveImage() {




    var deCan=document.getElementById(MY_CANVAS);
    var moveXY=null;
    var moveWidth=null;
    var moveHeight=null;
    var deCanW =null;
    var deCanH =null;
    var list_min=null;
    var list_max=null;
    if(deCan!=null&&deCan.clientWidth!=0&&deCan.clientHeight!=0){
        moveXY=getCanXY(MY_CANVAS);
        moveWidth=moveXY.x-gbt_x;
        moveHeight=moveXY.y-gbt_y;
        deCanW=document.getElementById(MY_CANVAS).clientWidth;
        deCanH=document.getElementById(MY_CANVAS).clientHeight;
        list_min=getMin(param_list,"design");
        list_max=getMax(param_list,"design");
    }
    if (down) {
        // $("#ccc").append("<p>event.x:"+event.x+" gbt_w:"+gbt_w+"
        // gbt_x1:"+gbt_x1+" gbt_x:"+gbt_x+" </P>");
        //showMes("对象ID："+imgID.id);
        switch (imgID.id) {
            case "map_im":
                var th_ex=event.clientX-divx-mapx;
                if(th_ex>=(gbt_w-6)){
                    imgID.style.left ="100px";
                }else if(th_ex<=(gbt_x1+6)){
                    imgID.style.left ="0px";
                }else{
//				showMes("th_ex:"+th_ex+"  gbt_x1:"+gbt_x1+" gbt_x:"+gbt_x+" objx:"+objx);
                    imgID.style.left = ((parseInt(th_ex) - parseInt(gbt_x))+objx)+"px";
                }
//			showMes(imgID.offsetLeft,"red");
                var img_num=(imgID.offsetLeft/2+10)*0.1;
//			showMes("imgID:"+img_num,"red");
                initCase(img_num);
                event.returnValue = false;
                break;
            case "sudu":
                if(event.x>=(gbt_w-2)){
                    imgID.style.left =(gbt_w-2)+"px";
                    $(".wbk").val(15);
                }else if(event.x<=(gbt_x1+14)){
                    imgID.style.left =(gbt_x1+14)+"px";
                    $(".wbk").val(0);
                }else{
                    $(".wbk").val(parseInt((event.x-(gbt_x1+14))/6));
                    imgID.style.left = (parseInt(event.x) - parseInt(gbt_x))+"px";
                }
                event.returnValue = false;
                break;
            case MY_CANVAS:
                designType=1;//设置移动的方式：0是以设定的像素移动；1是以1点像素移动
                if(param_list!=null&&objs!=null&&pType==0){
                    if((list_min.x+moveWidth<0||list_max.x+moveWidth>deCanW)&&
                        (list_min.y+moveHeight<0||list_max.y+moveHeight>deCanH)){
                    }else if(list_min.x+moveWidth<0||list_max.x+moveWidth>deCanW){
                        if(designType==0){
                            if(qiuyu(moveHeight)){
                                okeyb=moveHeight;
                            }else if(qiuyu(moveHeight+deshu/2)){
                                okeyb=moveHeight+5;
                            }else if(qiuyu(moveHeight-deshu/2)){
                                okeyb=moveHeight-5;
                            }
                        }else if(designType==1){
                            okeyb=moveHeight;
                        }
                    }else if(list_min.y+moveHeight<0||list_max.y+moveHeight>deCanH){
                        if(designType==0){
                            if(qiuyu(moveWidth)){
                                okeya=moveWidth;
                            }else if(qiuyu(moveWidth+deshu/2)){
                                okeya=moveWidth+5;
                            }else if(qiuyu(moveWidth-deshu/2)){
                                okeya=moveWidth-5;
                            }
                        }else if(designType==1){
                            okeya=moveWidth;
                        }
                    }else if(list_min.x+moveWidth>0&&list_min.x+moveWidth<deCanW
                        &&list_min.y+moveHeight>0&&list_max.y+moveHeight<deCanH){
                        if(designType==0){
                            if(qiuyu(moveWidth)){
                                okeya=moveWidth;
                            }else if(qiuyu(moveWidth+deshu/2)){
                                okeya=moveWidth+5;
                            }else if(qiuyu(moveWidth-deshu/2)){
                                okeya=moveWidth-5;
                            }
                            if(qiuyu(moveHeight)){
                                okeyb=moveHeight;
                            }else if(qiuyu(moveHeight+deshu/2)){
                                okeyb=moveHeight+5;
                            }else if(qiuyu(moveHeight-deshu/2)){
                                okeyb=moveHeight-5;
                            }
                        }else if(designType==1){
                            okeya=moveWidth;
                            okeyb=moveHeight;
                        }
                    }
                    buffer_one=new Array();//定义一个新数组
                    var newObj=null;//定义一个新对象
//					showMes("旧param_list:"+param_list.length,"yellow");
                    for(var i=0;i<param_list.length;i++){//循环计算移动的
                        newObj=new Object();
                        newObj.id=param_list[i].id;
                        if(param_list[i].num==null){
                            newObj.num=newObj.id;
                        }else{
                            newObj.num=param_list[i].num;
                        }
                        newObj.sc=param_list[i].sc;
                        newObj.x1=param_list[i].x1;
                        newObj.y1=param_list[i].y1;
                        newObj.x2=param_list[i].x2;
                        newObj.y2=param_list[i].y2;
                        newObj.lineWidth=param_list[i].lineWidth;
                        newObj.fillColor=param_list[i].fillColor;
                        newObj.strokeColor=param_list[i].strokeColor;
                        newObj.type=param_list[i].type;
                        newObj.mt=param_list[i].mt;
                        newObj.st=param_list[i].st;
                        newObj.w=param_list[i].w;
                        newObj.h=param_list[i].h;
                        newObj.mx1=param_list[i].mx1+okeya;
                        newObj.my1=param_list[i].my1+okeyb;
                        newObj.mx2=param_list[i].mx2+okeya;
                        newObj.my2=param_list[i].my2+okeyb;
                        newObj.active=param_list[i].active;
                        for(var j=0;j<objs.length;j++){
                            if(objs[j].id!=9999&&objs[j].id==param_list[i].id){
                                objs.splice(j,1);
                            }else if(objs[j].id==9999&&objs[j].sc==param_list[i].sc){
                                objs.splice(j,1);
                            }
                        }
                        buffer_one.push(newObj);
                        objs.push(newObj);
                    }
//					showMes("buffer_one:"+JSON.stringify(buffer_one),"red");
//					showMes("新obj:"+JSON.stringify(objs),"yellow");
                    draw(MY_CANVAS,objs,"repeat");//重新生成画布
                    param=new Object();
                    param.x1=getMin(buffer_one,"design").x;//获取最小X坐标
                    param.y1=getMin(buffer_one,"design").y;//获取最小Y坐标
                    param.x2=getMax(buffer_one,"design").x;//获取最大X坐标
                    param.y2=getMax(buffer_one,"design").y;//获取最大Y坐标
                    param.lineWidth=2;
                    param.strokeColor="red";
                    //showMes((param.x2-param.x1)+" "+(param.y2-param.y1));
                    rectObj(param,MY_CANVAS);
                    okeyX=0;//还原公用属性
                    okeyY=0;//还原公用属性
                }
                break;
            case LK_CANVAS:
                if(bcType==1){
                    //upAlert("放大情况下不能进行拖动操作");
                    return;
                }
                if(addType==0||addType==1||addType==2){//移动坐标
                    moveXY=getCanXY(LK_CANVAS);
                    param=new Object();
                    deCanW=document.getElementById(LK_CANVAS).clientWidth;
                    deCanH=document.getElementById(LK_CANVAS).clientHeight;
                    if((moveXY.x>deCanW&&moveXY.y>deCanH)||(moveXY.x<0&&moveXY.y<0)
                        ||(moveXY.x<0&&moveXY.y>deCanH)||(moveXY.y<0&&moveXY.x>deCanW)){
                    }else if(moveXY.x<0||moveXY.x>deCanW){
                        okeyY=moveXY.y;
                    }else if(moveXY.y<0||moveXY.y>deCanH){
                        okeyX=moveXY.x;
                    }else if((moveXY.x>0&&moveXY.x<deCanW)&&(moveXY.y>0&&moveXY.y<deCanH)){
                        okeyX=moveXY.x;
                        okeyY=moveXY.y;
                    }
                }
                if(addType==0||addType==1){//拖动状态为0和1的时候，0代表框选窗口，1代表新建窗口
                    var a=0;
                    var b=0;
                    var c=0;
                    var d=0;
                    if(gbt_x>okeyX){
                        a=okeyX;
                        c=gbt_x;
                    }else {
                        a=gbt_x;
                        c=okeyX;
                    }
                    if(gbt_y>okeyY){
                        b=okeyY;
                        d=gbt_y;
                    }else{
                        b=gbt_y;
                        d=okeyY;
                    }
                    param.x1=a;//获取最小X坐标
                    param.y1=b;//获取最小Y坐标
                    param.x2=c;//获取最大X坐标
                    param.y2=d;//获取最大Y坐标
                    param.lineWidth=2;
                    param.strokeColor="red";
                    //showMes(a+" "+c+" "+b+" "+d);
                    if(addType!=null&&addType==1){
                        param.fillColor="black";
                    }
                    readObjByList();
                    rectObj(param,LK_CANVAS);
                }else if(addType==2){
                    try {
//					showMes("okeyX:"+(okeyX-gbt_x)+" okeyY:"+(okeyY-gbt_y)+" obj"+JSON.stringify(nwt));
                        var newWin= up_win(nwt,unwt,okeyX,okeyY);
                        //showMes("newWin:"+JSON.stringify(newWin),"red");
                        for(var i=0;i<xmlEntities.length;i++){
                            if(xmlEntities[i].id==newWin.id){
                                xmlEntities[i]=newWin;
                            }
                        }
                        readObjByList();

                    } catch (e) {

                        setError("修改漫游、画中画窗口", e);
                    }

                }else if(addType==3){
                    try {
                        //	showMes("addType:"+addType,"red");
//					mdObj
                        $("body").css("cursor","pointer");
                        var move_mouse=getCanXY(LK_CANVAS);
                        var move_w=move_mouse.x-gbt_x;
                        var move_h=move_mouse.y-gbt_y;
//					showMes("gbt_x:"+gbt_x+" gbt_y:"+gbt_y+" x:"+move_mouse.x+" y:"+move_mouse.y+
//							" x2:"+move_w+"  y2:"+move_h);
                        var getObj=moveWin(mdObj,move_w,move_h);//获取移动后的窗口
                        if(xmlEntities!=null){
                            for(var i=0;i<xmlEntities.length;i++){
                                if(xmlEntities[i].id==getObj.id){
                                    xmlEntities[i].mx1=getObj.x1;
                                    xmlEntities[i].my1=getObj.y1;
                                    xmlEntities[i].mx2=getObj.x2;
                                    xmlEntities[i].my2=getObj.y2;

                                }
                            }
                        }
                        readObjByList();
                    } catch (e) {

                        showMes("移动窗口："+e,"red");
                    }
                }
                break;
            default:
                break;
        }

    }
    /***************************************************************************
     * 鼠标移动的时候判断是否在特定位置然后进行操作
     **************************************************************************/
    var deCan=document.getElementById(MY_CANVAS);
    if(deCan==null){

    }else if(deCan!=null&&deCan.clientWidth!=0&&deCan.clientHeight!=0){
        //当前鼠标是在自定模式上移动
        if(pType==1){//pType为1的时候是放大缩小窗口
            if(param_list!=null&&objs!=null){
                buffer_one=new Array();//定义一个新数组
                var paW=(list_max.x+moveWidth)-list_min.x;
                var paH=(list_max.y+moveHeight)-list_min.y;
                designType=0;//设置移动的方式：0是以设定的像素移动；1是以1点像素移动
                if((paW<30||list_max.x+moveWidth>deCanW)&&(paH<20||list_max.y+moveHeight>deCanH)){
                }else if(paW<30||list_max.x+moveWidth>deCanW){
                    if(designType==0){
                        if(qiuyu(moveHeight)){
                            okeyY=moveHeight;
                        }else if(qiuyu(moveHeight+deshu/2)){
                            okeyY=moveHeight+5;
                        }else if(qiuyu(moveHeight-deshu/2)){
                            okeyY=moveHeight-5;
                        }
                    }else if(designType==1){
                        okeyY=moveHeight;
                    }
                }else if(paH<20||list_max.y+moveHeight>deCanH){
                    if(designType==0){
                        if(qiuyu(moveWidth)){
                            okeyX=moveWidth;
                        }else if(qiuyu(moveWidth+deshu/2)){
                            okeyX=moveWidth+5;
                        }else if(qiuyu(moveWidth-deshu/2)){
                            okeyX=moveWidth-5;
                        }
                    }else if(designType==1){
                        okeyX=moveWidth;
                    }
                }else if(paW>30&&list_max.x+moveWidth<deCanW&&paH>20&&list_max.y+moveHeight<deCanH){
                    if(designType==0){
                        if(qiuyu(moveHeight)){
                            okeyY=moveHeight;
                        }else if(qiuyu(moveHeight+deshu/2)){
                            okeyY=moveHeight+5;
                        }else if(qiuyu(moveHeight-deshu/2)){
                            okeyY=moveHeight-5;
                        }
                        if(qiuyu(moveWidth)){
                            okeyX=moveWidth;
                        }else if(qiuyu(moveWidth+deshu/2)){
                            okeyX=moveWidth+5;
                        }else if(qiuyu(moveWidth-deshu/2)){
                            okeyX=moveWidth-5;
                        }
                    }else if(designType==1){
                        okeyY=moveHeight;
                        okeyX=moveWidth;
                    }

                }
                param=new Object();
                param.x1=list_min.x;//获取最小X坐标
                param.y1=list_min.y;//获取最小Y坐标
                param.x2=list_max.x;//获取最大X坐标
                param.y2=list_max.y;//获取最大Y坐标
                switch (mdt) {
                    case 1:
                        param.x1=list_min.x+okeyX;//获取最小X坐标
                        param.y1=list_min.y+okeyY;//获取最小Y坐标
                        break;
                    case 2:
                        param.x2=list_max.x+okeyX;//获取最大X坐标
                        param.y2=list_max.y+okeyY;//获取最大Y坐标
                        break;
                    case 4:
                        param.x2=list_max.x+okeyX;//获取最大X坐标
                        param.y1=list_min.y+okeyY;//获取最小Y坐标
                        break;
                    case 3:
                        param.x1=list_min.x+okeyX;//获取最小X坐标
                        param.y2=list_max.y+okeyY;//获取最大Y坐标
                        break;
                    case 5:
                        param.x1=list_min.x+okeyX;//获取最小X坐标
                        break;
                    case 6:
                        param.x2=list_max.x+okeyX;//获取最大X坐标
                        break;
                    case 7:
                        param.y1=list_min.y+okeyY;//获取最小Y坐标
                        break;
                    case 8:
                        param.y2=list_max.y+okeyY;//获取最大Y坐标
                        break;
                    default:

                        break;
                }
//						param.x1=list_min.x;//获取最小X坐标
//						param.y1=list_min.y;//获取最小Y坐标
//						param.x2=list_max.x+okeyX;//获取最大X坐标
//						param.y2=list_max.y+okeyY;//获取最大Y坐标
                param.lineWidth=2;
                param.strokeColor="red";
                var minx=param.x1;//开始X坐标
                var miny=param.y1;//开始Y坐标
                var param_width=param.x2-param.x1;
                var param_height=param.y2-param.y1;
                var list_width=list_max.x-list_min.x;
                var list_height=list_max.y-list_min.y;
                try {
                    var mappings=mappingList(param_list,list_width,list_height,param_width,param_height,1,minx,miny);
                    for(var i=0;i<mappings.length;i++){
                        for(var j=0;j<objs.length;j++){
                            if(objs[j].id==param_list[i].id){
                                objs.splice(j,1);
                            }
                        }
                        buffer_one.push(mappings[i]);
                        objs.push(mappings[i]);
                    }
                    draw(MY_CANVAS,objs,"repeat");//重新生成画布
                    rectObj(param,MY_CANVAS);
                }catch (e) {

                    //showMes("放大缩小功能出错:"+e);
                }
            }
        }else if(pType==2){//点击空白的地方拖动多选择窗口
            select_case=new Object();
            select_case.x1=gbt_x;//获取最小X坐标
            select_case.y1=gbt_y;//获取最小Y坐标
            select_case.x2=moveWidth+gbt_x;//获取最大X坐标
            select_case.y2=moveHeight+gbt_y;//获取最大Y坐标
            if(moveWidth+gbt_x<gbt_x){
                select_case.x2=gbt_x;//获取最大X坐标
                select_case.x1=moveWidth+gbt_x;//获取最小X坐标
            }
            if(moveHeight+gbt_y<gbt_y){
                select_case.y2=gbt_y;//获取最大Y坐标
                select_case.y1=moveHeight+gbt_y;//获取最小Y坐标
            }
            select_case.lineWidth=1;
            select_case.strokeColor="red";
            draw(MY_CANVAS,objs,"repeat");//重新生成画布
            rectObj(select_case,MY_CANVAS);

        }
        var idx= getCanXY(MY_CANVAS);

        if(mouseType==0&&pType!=1&&idx!=null&&param!=null){
            if(idx.x>=0&&idx.x<=deCan.clientWidth&&idx.y>=0&&deCan.clientHeight){//判断鼠标是否在自定义窗口内
                //showMes(idx.x+" "+idx.y+" "+param.x1+" "+param.y1);
                if(mouseType==0){
                    var checkBool=true;//定义一个接收判断能否放大的属性
                    if(param_list!=null){
                        for(var i=0;i<param_list.length;i++){
                            for(var j=0;j<param_list.length;j++){
                                if(param_list[i].st!=param_list[j].st){
                                    checkBool=false;
                                    break;
                                }
                            }
                        }
                    }
                    var id=MY_CANVAS;
                    cline=10;
                    if((checkLine(idx.x,idx.y,param.x2,param.y2)||
                        checkLine(idx.x,idx.y,param.x1,param.y1))&&checkBool){
                        $("#"+id).css("cursor", "se-resize");
                    }else if((checkLine(idx.x,idx.y,param.x2,param.y1)||
                        checkLine(idx.x,idx.y,param.x1,param.y2))&&checkBool){
                        $("#"+id).css("cursor","ne-resize");
                    }
                    else if((checkLine(idx.x,null,param.x1,null)||
                        checkLine(idx.x,null,param.x2,null))&&checkBool
                        &&(idx.y>param.y1&&idx.y<param.y2)){
                        $("#"+id).css("cursor","e-resize");
                    }else if((checkLine(idx.y,null,param.y1,null)||
                        checkLine(idx.y,null,param.y2,null))&&checkBool
                        &&(idx.x>param.x1&&idx.x<param.x2)){
                        $("#"+id).css("cursor","n-resize");
                    }
                    else{
                        $("#"+id).css("cursor","default");
                    }
                }

            }
        }
    }
    /******************************
     * 对漫游、画中画操作
     */
    //showMes("nwt:"+nwt);	
    if(nwt!=null){
        moveXY=getCanXY(LK_CANVAS);
        cline=10;
        var ox1=0;
        var oy1=0;
        var ox2=0;
        var oy2=0;
        if(nwt.mt==null||nwt.mt==0){
            //标准
            ox1=nwt.x1;
            oy1=nwt.y1;
            ox2=nwt.x2;
            oy2=nwt.y2;
        }else if(nwt.mt==1&&nwt.active==1){
            //自定义
            ox1=nwt.mx1;
            oy1=nwt.my1;
            ox2=nwt.mx2;
            oy2=nwt.my2;
        }
        if(checkLine(moveXY.x,moveXY.y,ox2,oy2)==true||checkLine(moveXY.x,moveXY.y,ox1,oy1)==true){
            $("body").css("cursor","se-resize");
        }else if(checkLine(moveXY.x,moveXY.y,ox2,oy1)==true||checkLine(moveXY.x,moveXY.y,ox1,oy2)==true){
            $("body").css("cursor","ne-resize");
        }else if((checkLine(moveXY.x,null,ox1,null)==true||checkLine(moveXY.x,null,ox2,null)==true)&&
            (moveXY.y>oy1&&moveXY.y<oy2)){
            $("body").css("cursor","e-resize");
        }else if((checkLine(moveXY.y,null,oy1,null)==true||checkLine(moveXY.y,null,oy2,null)==true)
            &&(moveXY.x>ox1&&moveXY.x<ox2)){
            $("body").css("cursor","n-resize");
        }else{
            $("body").css("cursor","default");
        }
    }
//	moveLeftDiv();
}

/****************************************
 * 移动左边窗口
 */
function moveLeftDiv(){
    try {


        // $("#ccc p").remove();
        /***************************************
         * 对左边输入源的显示操作
         */
        var div=document.getElementById("left_bk");
        var div1=document.getElementById("entityLeft");
        var div2=document.getElementById("body");
        var div3=document.getElementById("entityRight");
//		 showMes("left_bk:"+div.clientWidth+" entityLeft:"+div1.clientWidth+" entityRight:"+entityRight.offsetLeft);
        // $("#ccc").html("<p>("+div.clientWidth+")("+div1.clientWidth+")("+div3.offsetLeft+")</p>");
        if(type==0){
            if(event.x<=(div3.offsetLeft+5)&&event.x>=(div3.offsetLeft-5)){
                $(div2).css("cursor", "w-resize");
            }else{
                var ht=sessionStorage.getItem("thisHtml");
                if(ht!=null){
                    if(ht=="index"){
                        $(div2).css("cursor", "default");
                    }
                }
            }
        }
        if(type==1){
            // $("#bbb p").remove();
            var num =(event.x-parseInt(mx));
            if(parseInt(bw+num)>350){
                return;
            }else if( parseInt(bw+num)<220){
                return;
            }
            if(parseInt(bw+num)>300&&parseInt(bw+num)<350){
                tType=1;
                addtree();
            }else if(parseInt(bw+num)>210&&parseInt(bw+num)<300){
                tType=0;
                addtree();
            }
            // 
            // $("#bbb").html(div.clientHeight);
            if(div.clientHeight<400){
                $(div).css("width", parseInt(bw+num-5)+"px");
                $(div1).css("width", parseInt(lw+num)+"px");
                $(div3).css("width", parseInt(ew-(lw+num))+"px");
            }else{
                $(div).css("width", parseInt(bw+num-5)+"px");
                $(div1).css("width", parseInt(lw+num)+"px");
                $(div3).css("width", parseInt(ew-(lw+num))+"px");
            }
            // $("#ccc").html("<p>("+(event.x-parseInt(mx))+") "+parseInt(bw+num)+"
            // "+parseInt(lw+num)+" "+parseInt(ew-(lw+num))+"</p>");
            /***********************************************************************
             * 鼠标移动的时候判断是否在特定位置然后进行操作
             **********************************************************************/
        }
    } catch (e) {
        setError("moveLeftDiv",e);
    }
}


// 窗口打开的时候加载所有设备
function loadDevice(){
    var list =returnList("deviceList");
    if(list==null){
        return;
    }
    if(list.length!=0){
        $("#allDevice option").remove();
        $("#allDevice").append("<option value='0'>"+showJSTxt(indexJSList,60)+"</option>");
        for( var i=0;i<list.length;i++){
            $("#allDevice").append("<option value='"+list[i].id+"'>"+list[i].DN+"</option>");
        }
    }
}
/****************************
 * 根据ID把对象画出来
 * @param obj 画框的对象
 * @param id  画框的画布
 */
function rectObj(obj,id,xy) {
    try {
        var can = document.getElementById(id);
        var scrnWidth = can.clientWidth;
        var scrnHeight = can.clientHeight;
        var cxt = can.getContext("2d");
        // upAlert("aaa"+xmlEntities.length);
        if (obj != null) {
            //cxt.clearRect(beginX, beginY, scrnWidth, scrnHeight);
            var x1 =obj.x1;
            var y1 =obj.y1;
            var width = obj.x2- x1;
            var height = obj.y2 - y1;
            lineWidth = obj.lineWidth;
            lineColor = obj.strokeColor;
            cxt.beginPath();
            cxt.lineWidth = lineWidth;
            cxt.strokeStyle = lineColor;
            cxt.rect(x1, y1, width, height);
            if(obj.fillColor!=null){
                var img=document.getElementById("bcg");//获取图片
                cxt.drawImage(img,x1, y1, width, height);//话背景图片
            }
            cxt.stroke();
        } else {
            cxt.clearRect(beginX, beginY, scrnWidth, scrnHeight);
            return false;
        }
    } catch (e) {
        setError("rectObj", e);
    }

}
/******************************
 * 画合并窗口的信息
 */
function rectMer(list,id){

    var wins=null;//物理屏窗口
    var winObj=null;//物理屏对象
    if(list[0].mt!=null&&list[0].mt==1){
        wins=new Array();
        wins=restore(list);
    }
    for ( var i = 0; i < list.length; i++) {
        if(list[0].mt!=null&&list[0].mt==1&&list[i].mx2==0&&list[i].my2==0){
            for(var j=0;j<wins.length;j++){
                if(list[i].id==wins[j].id){
                    winObj=new Object();
                    winObj.x1=wins[j].mx1;
                    winObj.y1=wins[j].my1;
                    winObj.x2=wins[j].mx2;
                    winObj.y2=wins[j].my2;
                    winObj.linwWidth=1;
                    winObj.strokeColor="#383737";
                    rectObj(winObj,id);
                }
            }
        }
    }
}
/**********************************
 * @param map
 * 初始化MAP对像
 *********************************/
function initMap(map){
    var list=returnList("ouputXml");
    list=countMap(list,"map");
    readObjByList(list,"map");
    if(map!=null){
        rectObj(map,"map");
    }
}

function countMap(list,canId){
    var maxWidth=0;
    var maxHeight=0;
    if(list!=null){
        for(var i=0;i<list.length;i++){
            if(list[i].mx2>maxWidth)
                maxWidth=list[i].mx2;
            if(list[i].my2>maxHeight)
                maxHeight=list[i].my2;
        }
    }else{
        return null;
    }
    maxWidth=localStorage.getItem("canWidth");
    maxHeight=localStorage.getItem("canHeight");
    showMes("maxWidth:"+maxWidth+" maxHeight:"+maxHeight);
    var can = document.getElementById(canId);
    var scrnWidth = can.clientWidth;// 从CSS样式获得屏幕宽度
    var scrnHeight = can.clientHeight;// 从CSS样式获得屏幕高度
    can.width = scrnWidth;// 设置屏幕的宽度
    can.height = scrnHeight;// 设置屏幕的高度
    // upAlert("当前页面的长度:"+scrnWidth+"
    // 宽度:"+scrnHeight+"文件的长度:"+maxWidth+" 宽度："+maxHeight);
    var ratioX=scrnWidth/maxWidth;
    var ratioY=scrnHeight/maxHeight;
    // upAlert("ratioX:"+ratioX+" ratioY"+ratioY);
    for(var j=0;j<list.length;j++){
        list[j].mx1=list[j].mx1*ratioX;
        list[j].my1=list[j].my1*ratioY;
        list[j].mx2=list[j].mx2*ratioX;
        list[j].my2=list[j].my2*ratioY;
    }
    return list;
}

/*********************************
 * 生成一个框
 * @param num
 */
function initCase(num){
    var obj=new Object();//实例一个框的图像
    obj.x1=0;
    obj.y1=0;
    obj.x2=initX/num;
    obj.y2=initY/num;
    obj.strokeColor="red";
    obj.lineWidth=2;
    initObj=new Object();
    initObj=obj;
    var opList=returnList("ouputXml");
    if(opList!=null){
        for(var i=0;i<opList.length;i++){
            opList[i].mx1=opList[i].mx1*num;
            opList[i].mx2=opList[i].mx2*num;
            opList[i].my1=opList[i].my1*num;
            opList[i].my2=opList[i].my2*num;
        }
    }
    saveList("db_list",opList);
    mapEntities=opList;
    readObjByList(opList,LK_CANVAS);
    map_object=obj;
    showMes("obj:"+JSON.stringify(obj));
    //	showMes(" opList[0].x2:"+opList[0].x2+"  opList[0].y2:"+opList[0].y2,"red");
    initMap(obj);
}
/********************************
 *鼠标按下事件
 *********************************/
function method_down(obj){
    mix=event.clientX;
    miy=event.clientY;
    mouseType=1;
}
/*********************************
 *鼠标松开事件
 *********************************/
function method_up(obj){
    mouseType=0;
    if(map_object==null){
        return;
    }
    initObj.x1=map_object.x1;
    initObj.y1=map_object.y1;
    initObj.x2=map_object.x2;
    initObj.y2=map_object.y2;
}
/*************************************
 *鼠标移动事件
 *************************************/
function method_over(obj){
    var mouse_x=event.clientX;//鼠标X座标
    var mouse_y=event.clientY;//鼠标Y座标
    var img_obj=document.getElementById("map_im");
    var num =(img_obj.offsetLeft/2+10)*0.1;
    if(mouseType==1&&initObj!=null){
        var x=mouse_x-mix;
        var y=mouse_y-miy;
        $("#mes p").remove();

        //	showMes("initObj("+initObj.x1+","+initObj.y1+"),("+initObj.x2+","+initObj.y2+") 鼠标:("+x+","+y+")" ,"red");
        map_object=	new Object();
        if(initObj.x1+x<0){
            map_object.x1=0;
            map_object.x2=initObj.x2-initObj.x1;
        }else{
            if(initObj.x2+x>initX){
                map_object.x1=initX-(initObj.x2-initObj.x1);
                map_object.x2=initX;
            }else{
                map_object.x1=initObj.x1+x;
                map_object.x2=initObj.x2+x;
            }
        }
        if(initObj.y1+y<0){
            map_object.y1=0;
            map_object.y2=initObj.y2-initObj.y1;
        }else{
            if(initObj.y2+y>initY){
                map_object.y1=initY-(initObj.y2-initObj.y1);
                map_object.y2=initY;
            }else{
                map_object.y1=initObj.y1+y;
                map_object.y2=initObj.y2+y;
            }
        }
        //showMes("map_object:("+map_object.x1+","+map_object.y1+"),("+map_object.x2+","+map_object.y2+")");
        map_object.strokeColor="red";
        map_object.lineWidth=2;
        initMap(map_object);
        num_x=map_object.x1*num+map_object.x1*num;
        num_y=map_object.y1*num+map_object.y1*num;
//		var num_x1=map_object.x2*num+map_object.x2*num;
//			var num_y1=map_object.y2*num+map_object.y2*num;
//			showMes( "num:"+num+" map_object:("+num_x+","+num_y+")("+num_x1+","+num_y1+")","red");
        var list=returnList("ouputXml");

        if(list!=null){
            for(var i=0;i<list.length;i++){
                list[i].mx1=list[i].mx1*num-num_x;
                list[i].my1=list[i].my1*num-num_y;
                list[i].mx2=list[i].mx2*num-num_x;
                list[i].my2=list[i].my2*num-num_y;
            }
        }
        saveList("db_list",list);
        mapEntities=list;
        //showMes(JSON.stringify(list));
        readObjByList(list,LK_CANVAS);

    }
}


/**************************************
 *根据长度和时间把选择的输入组加到关系对应数组
 ***************************************/
function saveInputs(len,time){
    //showMes("len:"+len+" time:"+time,"red");
    var obj = null;
    for(var i=0;i<params.length;i++){
        for(var j=0;j<params.length;j++){
            if(params[i].my1+1<params[j].my1||
                (params[i].my1+1>params[j].my1&&params[i].my1-1<params[j].my1&&params[i].mx1<params[j].mx1)){
                obj=params[i];
                params[i]=params[j];
                params[j]=obj;
            }
        }
    }
    var IFO = returnList("IFOlist");
//			showMes("   params:" + JSON.stringify(params),"red");
//			
    //showMes("len:"+len,"red");
    //	showMes("删除前:" + JSON.stringify(IFO),"black");
    if (IFO != null && IFO.length != 0) {
        var delects = new Array();
        for ( var i = 0; i < IFO.length; i++) {
            for ( var j = 0; j < len; j++) {
                if (IFO[i].outputId == params[j].id) {
                    delects.push(i);
                }
            }
        }
        for ( var j = (delects.length - 1); j > -1; j--) {
            IFO.splice(delects[j], 1);
        }
    }
    //	showMes("......");
    var new_list=new Array();//新的输入源数组
    var obj = null;//公用对象
    for(var i=0;i<parami.length;i++){//找出所有输入源，包括NVR的通道
        if(checkInputType(parami[i].type)&&parami[i].gn!=""&&parami[i].gn!=0
            &&parami[i].gn!=null){
            var gn_num=0;
            if(parami[i].type==1){
                gn_num=parami[i].gn*2;
            }else{
                gn_num=parami[i].gn;
            }
            for(var j=0;j<gn_num;j++){
                obj={"id":parami[i].id,"name":parami[i].name,"gn":(j+1)};
                new_list.push(obj);
            }
        }else{
            obj={"id":parami[i].id,"name":parami[i].name,"gn":""};
            new_list.push(obj);
        }

    }
    //	showMes("new_list:"+JSON.stringify(new_list),"blue");
    for ( var i = 0; i < new_list.length; i++) {
        var index = i % params.length;
        obj = new Object();
        if (IFO != null && IFO.length != 0) {
            obj.id = getId(IFO);
        } else {
            IFO=new Array();
            obj.id = 1;
        }
        //	showMes("i:"+i+" params.length:"+params.length+" index:"+params.length+" id:"+params[index].id,"red");
        obj.outputId = params[index].id.toString();// 给对象的输出通道ID赋值
        obj.inputId = new_list[i].id;// 给对象输入通道ID赋值
        obj.inputName = new_list[i].name;// 给输入通道Name赋值
        obj.longTime = time+"";// 给时间轮训longTime赋值
        obj.beginTime = "";// 给时间段开始时间beginTime赋值
        obj.endTime = "";// 给时间段结束时间endTime赋值
        obj.gn = new_list[i].gn;
        IFO.push(obj);
    }
    for(var i=0;i<params.lengt;i++){
        clearPlayType(params[i].id);//清理切换输入源的窗口的录像回放缓存
    }
    //	showMes("修改后:" + JSON.stringify(IFO),"red");
    saveList("IFOlist", IFO);
    sessionStorage.setItem("sendIFO", "1");
    sendJSONForServer("IFOlist", IFO);
}
function cansal_seach(){
    $(".seach_input").hide();
    $("#faqbg").hide();
    $("#seach_txt").val("");
    $(".seach_ul li").remove();
    $(".seach_ul").append("<li style='color:red;width: 100%;text-align: center;'>"+showJSTxt(indexJSList,63)+"</li>");
}

function click_li(object){
    try {
        var ow=rightId;
        var id=0;
        var input_num=0;
        //showMes(".....");
        //showMes(time+"  "+ow);
        var list=returnList("decoderList");
        //showMes("输入文件："+list);
        var io_li=returnList("IFOlist");
        //showMes("关系对应文件："+io_li);
        var obj=null;
        if(list!=null){
            var nl = new Array();
            if(io_li!=null){
                for ( var i = 0; i < io_li.length; i++) {
                    if (io_li[i].outputId == ow) {
                        nl.push(io_li[i].id);
                    }
                }
                for ( var i = 0; i < io_li.length; i++) {
                    for ( var j = 0; j < nl.length; j++) {
                        if (io_li[i].id == nl[j]) {
                            io_li.splice(i, 1);
                        }
                    }
                }
            }else{
                io_li=null;
            }
            if(object.id.toString().indexOf("n")!=-1){
                var index=object.id.indexOf("n");
                id=object.id.substring(2,index);
                input_num=(object.id.substr(index+1));

            }else{
                id=object.id.substr(2);
                input_num=0;
            }
            //	showMes(id+" "+input_num);
            for(var i=0;i<list.length;i++){
                if(id==list[i].id){
                    obj=new Object();
                    if(io_li!=null){
                        obj.id=getId(io_li);
                    }else{
                        io_li=new Array();
                        obj.id=1;
                    }
                    obj.outputId=parseInt(ow);
                    obj.inputId=parseInt(id);
                    obj.inputName=list[i].name;
                    obj.longTime="1";
                    obj.beginTime="";
                    obj.endTime="";
                    if(input_num==0){
                        obj.gn="";
                    }else{
                        obj.gn="n"+input_num;
                    }
                    io_li.push(obj);
                }
            }
            //showMes("关系对应文件："+io_li.length,"red");
            sessionStorage.setItem("upIFOList",1);
            saveList("IFOlist",io_li);
            var loginCode = returnSlist("loginCode");// 回去随机码
            if(loginCode==null){
                loginCode=[0x00,0x00,0x00,0x00];
            }
            var dclist=returnList("decoderList");
            if(list!=null){
                for(var i=0;i<dclist.length;i++){
                    if(id==dclist[i].id){
                        thisIp = dclist[i].location;
                    }
                }
            }
            //clearPlayType(ow);//清理切换窗口的录像回放缓存
            if (loginCode != null) {
                var binary = new Uint8Array(13);// 创建一个数组，必须固定长度
                binary = setCode(binary, loginCode, 0x00, 0x00, 0x02, 0x00);
                binary[8] = ow/256;
                binary[9] = ow%256;
                binary[10] = id/256;
                binary[11] = id%256;
                binary[12] = input_num;
                LK_CAN_OBJ.onExt(0,"02 00",binary);//调用回调接口
                $(".lk_faqbg").remove();
                $(".lk_seach_input").remove();
//					if (checkMes()) {
//					//	showMes("binary:"+JSON.stringify(binary));
//						
//						//checkSend(binary);
//					} else {
//						upAlert(showJSTxt(indexJSList,14)); 
//					}
            }
//				cansal_seach();
        }

    } catch (e) {
        setError("切换错误：",e);
    }
}
//根据输入的文本和类型查询输入源
function in_fuc(obj){
    try {
        var type=$("#seach_type").val();

        var text=obj.value;
        var list =new Array();
        if(text==""){
            list=new Array();
            $(".seach_ul li").remove();
            $(".seach_ul").append("<li style='color:red;width: 100%;text-align: center;'>"+showJSTxt(indexJSList,63)+"</li>");
            return;
        }
        var in_li=returnList("decoderList");
        if(in_li!=null){
            if(type==0){
                for(var i=0;i<in_li.length;i++){
                    if(isFind(text,in_li[i].name)==true){
                        list.push(in_li[i]);
                    }

                }
            }else if(type==1){
                for(var i=0;i<in_li.length;i++){
                    if(isFind(text,in_li[i].location)==true){
                        list.push(in_li[i]);
                    }

                }
            }

            $(".seach_ul li").remove();
            var number=0;
            if(list!=null&&list.length>0){
                for(var i=0;i<list.length;i++){
                    var name="";
                    var ip="";
                    if(list[i].name.length>15){
                        name=list[i].name.substr(0,15)+"...";
                    }else{
                        name=list[i].name;
                    }
                    if(list[i].location.length>15){
                        ip=list[i].location.substr(0,15)+"...";
                    }else{
                        ip=list[i].location;
                    }
                    var naStr="<span class='tyc' style='width: 110px;'>"+name+"</span>";
                    var ipStr="<span class='tyc'  style='width: 110px;'>"+ip+"</span>";
                    var idStr=0;
                    var numStr="";
                    var bool=checkInputType(list[i].type);
                    if(bool==true&&(list[i].gn!=null&&list[i].gn!="")){
                        //showMes("NVR:"+list[i].gn);
                        var list_gn=0;//通道数量
                        var list_gName=null;//通道名称数组
                        if(list[i].type==1){
                            list_gn=list[i].gn*2;
                        }else{
                            list_gn=list[i].gn;
                        }
                        if(list[i].grName!=null&&list[i].grName!=""){
                            list_gName=list[i].grName.split(",");
                            list_gName=gName_split(list_gName);
                        }
                        //showMes("list_gName:"+JSON.stringify(list_gName));
                        for(var j=0;j<list_gn;j++){
                            number++;
                            idStr="<span class='tyc' style='width: 30px;'>"+number+"</span>";
                            var show_name="";
                            if(list_gName!=null&&list[i].type==1){
                                if(j%2==0){
                                    show_name=list_gName[parseInt(j/2)]+"("+showJSTxt(indexJSList,2)+")";
                                }else{
                                    show_name=list_gName[parseInt(j/2)]+"("+showJSTxt(indexJSList,3)+")";
                                }
                            }else if(list_gName==null&&list[i].type==1){
                                if(j%2==0){
                                    show_name=showJSTxt(indexJSList,1)+(parseInt(j/2)+1)+"("+showJSTxt(indexJSList,2)+")";
                                }else{
                                    show_name=showJSTxt(indexJSList,1)+(parseInt(j/2)+1)+"("+showJSTxt(indexJSList,3)+")";
                                }
                            }else if(list_gName!=null&&list[i].type!=1){
                                show_name=list_gName[j];
                            }else if(list_gName==null&&list[i].type!=1){
                                show_name=showJSTxt(indexJSList,1)+j;
                            }
                            numStr="<span class='tyc'  style='width: 110px;'>"+show_name+"</span>";
                            $(".seach_ul").append("<li class='input_li input_last' onclick='click_li(this)' id='li"+list[i].id+"n"+(j+1)+"'>"+idStr+naStr+ipStr+numStr+"</li>");
                        }
                    }else{
                        number++;
                        idStr="<span class='tyc' style='width: 30px;'>"+number+"</span>";
                        numStr="<span class='tyc'  style='width: 110px;'></span>";
                        $(".seach_ul").append("<li class='input_li input_last' onclick='click_li(this)' id='li"+list[i].id+"'>"+idStr+naStr+ipStr+numStr+"</li>");
                    }

                }
            }else{
                list=new Array();
                $(".seach_ul li").remove();
                $(".seach_ul").append("<li style='color:red;width: 100%;text-align: center;'>"+showJSTxt(indexJSList,63)+"</li>");
                return;
            }
        }
    } catch (e) {

        showMes("错误："+e);
    }
}
/********************
 * 把导航器恢复默认状态
 */
function cleanMap(){
    localStorage.removeItem("db_list");
    $(".map_div").hide();
    $("#map_im").css("left","0px");
    mapEntities=null;
    num_x=0;
    num_y=0;
}
/*********************
 * 取消用户自定义输出窗口的操作
 */
function cleanDesign(){
    $("#design").remove();
    $("#lk_faqbg").remove();
    objs=null;
    param=null;
    buffer_one=null;
    mouseType=0;
    pType=0;
}

/********************
 * 根据画图的ID和重复复制的方向,然后把输出窗口画上去
 * @param id
 * @param direction
 */
function draw(id,list,direction){
    try {
        var c=document.getElementById(id);//获取画图工具
        if(direction!=null){
            var ctx=c.getContext("2d");//设定格式
            ctx.clearRect(0,0,c.width,c.height);//清理数据
            var img=document.getElementById("lampa");//获取图片
            var pat=ctx.createPattern(img,direction);//指定图片复制的画布
            ctx.rect(0,0,c.width,c.height);//指定范围
            ctx.fillStyle=pat;//开始画
            ctx.fill();//结束
        }
        var caseList=getMyWindows(list);//
        var ct=c.getContext("2d");
        var cxt=c.getContext("2d");//设定格式
        var mx1=0;//显示
        var my1=0;//显示
        var mx2=0;//显示
        var my2=0;//显示
        var nwList=new Array();//漫游、画中画数组
        for ( var i = 0; i < list.length; i++) {//循环数组把输出窗口文件画出来
            if(list[i].active==1){
                //如果是漫游画中画窗口直接跳过
                nwList.push(list[i]);
                continue;
            }
            mx1 = list[i].mx1;//显示
            my1 = list[i].my1;//显示
            mx2=list[i].mx2;
            my2 =list[i].my2;
            width = mx2 - mx1;//显示
            height = my2 - my1;//显示
            lineWidth = list[i].lineWidth;
            lineColor = "#424040";
            fillColor = "black";
            if(list[i].id!=9999){
                cxt.beginPath();
                cxt.lineWidth = lineWidth;
                cxt.strokeStyle = lineColor;
                cxt.rect(mx1, my1, width, height);
                var img=document.getElementById("bcg");//获取图片
                cxt.drawImage(img,mx1, my1, width, height);//话背景图片
                cxt.stroke();
                var id =0;
                if(list[i].num==null){
                    id= list[i].id;
                }else{
                    id=list[i].num;
                }
                var fondX=0;
                var fondY=0;
                if(width>30){
                    fondX = mx1 + 10;
                    fondY = my1 + 13;
                }else{
                    fondX=mx1+2;
                    fondY = my1+10;
                }
                ///以下执行是画ID
                ctx.font = "10px 宋体";
                ctx.fillStyle = "white";
                ctx.lineWidth = 1;
                if(id!=9999){//不显示num或者ID号为9999数
                    ctx.fillText(id, fondX, fondY);
                }
            }
        }
        /******************************
         * 画合并窗口信息
         */
        var wins=null;
        var winObj=null;
        if(list[0].mt!=null&&list[0].mt==1){
            wins=new Array();
            wins=restore(list);
        }
//		 showMes("wins："+JSON.stringify(wins));
        for ( var i = 0; i < list.length; i++) {
            for(var j=0;j<wins.length;j++){
                if(wins[j].active==1){
                    //如果是漫游画中画窗口直接跳过
                    continue;
                }
                if(list[i].sc==wins[j].id){
                    winObj=new Object();
                    winObj.x1=wins[j].x1;
                    winObj.y1=wins[j].y1;
                    winObj.x2=wins[j].x2;
                    winObj.y2=wins[j].y2;
                    winObj.linwWidth=1;
                    winObj.strokeColor="#383737";
                    rectObj(winObj,MY_CANVAS);
                }
            }
            ct.font = "16px 伪宋";
            ct.fillStyle = "#FD0000";
            ct.lineWidth = 1;
            var str3="";
            if(caseList!=null){
                for(var j=0;j<caseList.length;j++){
                    if(caseList[j].active==1){
                        //判断如果是漫游、画中画跳过
                        continue;
                    }
                    rectObj(caseList[j],MY_CANVAS);
                    width=caseList[j].x2-caseList[j].x1;
                    height=caseList[j].y2-caseList[j].y1;
                    if(width>20&&height>10){
                        str3=parseInt((parseInt(width)/10))+" * "+parseInt((parseInt(height)/10));
                    }else{
                        str="...";
                    }
                    ct.fillText(str3, caseList[j].x2-(width/1.65), caseList[j].y2-(height/2.1));
                }
            }
        }
//	showMes("nwList:"+JSON.stringify(nwList));
        if(nwList.length>0){//画漫游、画中画窗口
            nwList=getMyWindows(nwList);//转换数据
            for(var i=0;i<nwList.length;i++){
                rectObj(nwList[i],MY_CANVAS);
                ctx.font = "10px 宋体";
                ctx.fillStyle = "white";
                ctx.lineWidth = 1;
                var fondX=0;
                var fondY=0;
                if(width>30){
                    fondX = nwList[i].x1 + 10;
                    fondY = nwList[i].y1 + 13;
                }else{
                    fondX = nwList[i].x1 + 2;
                    fondY = nwList[i].y1 + 10;
                }
                if(nwList[i].num!=9999){//不显示num或者ID号为9999数
                    ctx.fillText(nwList[i].num, fondX, fondY);
                }
            }
        }
    } catch (e) {

        setError("draw", e);
    }

}

/******************************************
 * 显示设计窗口
 */
function showDesign(){
    var list=returnList("ouputXml");
    if(list!=null){
        $("#faqbg").show();
        $("#design").show();
        var can=document.getElementById(LK_CANVAS);
        // showMes(can.clientWidth+" "+can.clientHeight+" "+list.length);
        objs=mappingXY(list,can.clientWidth,can.clientHeight,MY_CANVAS,1);//获取保存映射设窗口文件
        //showMes(JSON.stringify(objs));
        draw(MY_CANVAS,objs,"repeat");//把文件画出来	 
    }else{
        //showMes("请先创建输出窗口!","red"); 
    }
}
/**************************
 * 保存自定义模式文件
 */
function saveDesign(){
    if(objs!=null){//判断自定义缓存文件是否为空
        //使用冒泡查询
        var bool=true;
        var oneWin=0;
        var twoWin=0;
        for(var i=0;i<objs.length;i++){
            if(objs[i].active==1||objs[i].id==9999){
                //判断如果是自定义窗口就跳过
                continue;
            }
            for(var j=0;j<objs.length;j++){
                if(objs[i].id!=objs[j].id){
                    if(objs[j].active==1||objs[j].id==9999){
                        //判断如果是自定义窗口就跳过
                        continue;
                    }
                    /*************************
                     * 全方位缩小1个像素判断是否有重叠的
                     */
                    if(checkOverlap(objs[i].mx1+1,objs[i].my1+1,objs[i].mx2-1,objs[i].my2-1,
                            objs[j].mx1,objs[j].my1,objs[j].mx2,objs[j].my2)){
                        oneWin=objs[i].id;
                        twoWin=objs[j].id;
                        bool=false;
                        break;
                    }

                }
            }
        }
        if(bool==false){
            //	upAlert("第 "+oneWin+" 个窗口和第 "+twoWin+" 个窗口重叠");
            upAlert(showJSTxt(indexJSList,64));
            return false;
        }
        //showMes("全部通过");
        var can=document.getElementById(MY_CANVAS);
        var list= mappingXY(objs,can.clientWidth,can.clientHeight,LK_CANVAS,1);
//			showMes("list:"+JSON.stringify(list),"blue");
        var oldList=returnList("ouputXml");
        list=upAcWin(oldList,list);//修改当前移动窗口的时候影响到的漫游、画中画的窗口
        saveList("ouputXml",list);
        var rStr=getExt(1,"ouputXml",list);
        LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
//			sessionStorage.removeItem("upNum");
//			sendJSONForServer("ouputXml",list);
        loadXml();
        return true;
    }
}
/************************
 * 根据选择框获取自定义窗口数组
 * @param win
 * @param wins
 * @returns
 */
function getSelectwin(win,wins){
    if(win!=null&&wins!=null){
        var list=new Array();
        var bool=false;//定义一个判断函数
        for(var i=0;i<wins.length;i++){//循环数组查循
            /*********************
             *只要两个窗口互相有重叠就为真
             */
            if(wins[0].mt==null){//判断是否是自定义类型
                //调用验证重叠的方法
                if(checkOverlap(wins[i].x1,wins[i].y1wins[i].x2,wins[i].y2,win.x1,win.y1,win.x2,win.y2)){
                    bool=true;
                }
            }else if(wins[0].mt==1){
                //调用验证重叠的方法
                if(checkOverlap(wins[i].mx1,wins[i].my1,wins[i].mx2,wins[i].my2,win.x1,win.y1,win.x2,win.y2)){
                    bool=true;
                }
            }
            if(bool){//条件为真的时候
                var objs=null;
                if(wins[i].w<dwh||wins[i].h<dwh){
                    objs= getWindow(wins[i].st, wins);//根据窗口获取该窗口物理屏下的所有拆分窗口
                }else{
                    objs= getWindow(wins[i].id, wins);//根据窗口获取该窗口物理屏下的所有拆分窗口
                }
                if(objs!=null){
                    for(var j=0;j<objs.length;j++){//循环把所有拆分窗口增加到数组里
                        var bl=true;
                        for(var ix=0;ix<list.length;ix++){//查找增加数组,看该窗口是否以增加
                            if(list[ix].id!=9999&&objs[j].id==list[ix].id){
                                bl=false;
                                break;
                            }else if(list[ix].is==9999&&objs[j].sc==list[ix].sc){
                                bl=false;
                                break;
                            }
                        }
                        if(bl){//判断增加数组里没有该窗口时进行增加
                            list.push(objs[j]);
                        }
                    }
                }
            }
            bool=false;
        }
        return list;
    }else{
        return null;
    }
}

/********************************************************************
 * 显示窗口号
 * @param paramList
 * @param paramId
 */
function showWinMes(paramList,paramId){
    var list=null;
    if(paramList!=null){
        list=paramList;
    }else if($("#mode_select").val()!="select_0"){
        var mos=returnList("modeList");
        if(mos!=null){
            for(var i=0;i<mos.length;i++){
                if("select_"+mos[i].id==$("#mode_select").val()){
                    list=mos[i].outputList;
                }
            }
        }
    }else if(returnList("ouputXml")!=null){
        list=returnList("ouputXml");
    }
    var a=null;
    for(var i=0;i<list.length;i++){
        for(var j=0;j<list.length;j++){
            if(list[0].num!=null){
                if(parseInt(list[i].num)<parseInt(list[j].num)){
                    a=list[i];
                    list[i]=list[j];
                    list[j]=a;
                }
            }else{
                if(parseInt(list[i].id)<parseInt(list[j].id)){
                    a=list[i];
                    list[i]=list[j];
                    list[j]=a;
                }
            }
        }
    }
    $("#outputId option").remove();
    $("#outputId").append("<option value='-1'>"+showJSTxt(indexJSList,60)+"</option>");
    //showMes("list:"+JSON.stringify(list),"red");
    for(var i=0;i<list.length;i++){
        if(list[i].num!=9999){
            if(list[0].mt==null){
                $("#outputId").append(
                    "<option value='" + list[i].id + "'>"
                    + showJSTxt(indexJSList,65)+" "+list[i].num +"</option>");
            }else if(list[0].mt==1){
                if(list[i].mx2!=0&&list[i].my2!=0){
                    $("#outputId").append(
                        "<option value='" + list[i].id + "'>"
                        +showJSTxt(indexJSList,65)+" "+list[i].num  +"</option>");
                }
            }
        }
    }
    //显示当前选择窗口的对应关系
    try {
        if(rightId==null||rightId==""){
        }else{
            $("#outputId option[value='"+rightId+"']").attr("selected","true");
        }
    } catch (e) {

    }
    if(paramId!=null&&paramId!=""){
        $("#outputId option[value='"+paramId+"']").attr("selected","true");
    }

}
/*****************************
 * 显示通道号
 * @param list
 */
function showWinNum(paramList){
    var list=null;
    var winList=null;
//	 		showMes((paramList!=null)+" "+($("#mode_select").val()!="select_0")+" "+(returnList("ouputXml")!=null));
    if(paramList!=null){
        winList=paramList;
    }else if($("#mode_select").val()!="select_0"){
        var mos=returnList("modeList");
        if(mos!=null){
            for(var i=0;i<mos.length;i++){
                if("select_"+mos[i].id==$("#mode_select").val()){
                    winList=mos[i].outputList;
                }
            }
        }
    }else if(returnList("ouputXml")!=null){
        winList=returnList("ouputXml");
    }

    var top_tr="<tr><td class='va_td'>"+showJSTxt(indexJSList,66)+
        "</td><td class='va_td'>"+showJSTxt(indexJSList,96)+"</td><td class='ep_td'></td>"
        +"<td class='va_td'>"+showJSTxt(indexJSList,66)+
        "</td><td class='va_td'>"+showJSTxt(indexJSList,96)+"</td><td class='ep_td'></td>"
        +"<td class='va_td'>"+showJSTxt(indexJSList,66)+
        "</td><td class='va_td'>"+showJSTxt(indexJSList,96)+"</td></tr>";
    var em_tr="<tr><td class='ep_tr' colspan='8'></td></tr>";
    var em_td="<td class='ep_td'></td>";
    var va_tr="<tr>";
    $(".win_num tr").remove();
    $(".win_num").append(top_tr);
    var num=0;
    var id=0;
    var a=null;
    for(var i=0;i<winList.length;i++){
        for(var j=0;j<winList.length;j++){
            if(winList[0].num!=null){
                if(parseInt(winList[i].num)<parseInt(winList[j].num)){
                    a=winList[i];
                    winList[i]=winList[j];
                    winList[j]=a;
                }
            }else{
                if(parseInt(winList[i].id)<parseInt(winList[j].id)){
                    a=winList[i];
                    winList[i]=winList[j];
                    winList[j]=a;
                }
            }
        }
    }
    if(winList[0].mt==null){
        list=winList;
    }else if(winList[0].mt==1){
        list=new Array();
        for(var i=0;i<winList.length;i++){
            if(winList[i].mx2!=0&&winList[i].my2!=0){
                list.push(winList[i]);
            }
        }
    }
    if(list==null||list.length<1){
        //	showMes("没找到输出窗口文件!","red");
        return;
    }
    for(var i=0;i<list.length;i++){
        if(list[i].id==9999){
            continue;
        }
        id=list[i].id;//窗口ID号
        num=list[i].num;//窗口显示序号
        va_tr+="<td class='va_td'>"+num+"</td><td class='va_td'>" +
            "<input class='vl_td' id='tdi_"+id+"' value='"+num+"' style='width: 80%;' type='text'/>" +
            "</td>";
        if((i+1)%3==0){
            $(".win_num").append(va_tr+"</tr>");
            va_tr="<tr>";
            if((i+1)!=list.length){
                $(".win_num").append(em_tr);
            }

        }else{

            if((i+1)==list.length){
                $(".win_num").append(va_tr+"</tr>");
                va_tr="";
            }else{
                va_tr+=em_td;
            }
        }
    }
}
/****************************
 * 保存修改窗口号
 * @param paramList
 */
function saveWinNum(paramList){
    var newNumList=null;//定义一个接收修改后的序号数组
    var obj=null;//定义一个包括ID和修改后的序号对象
    var bool=true;
    $(".vl_td").each(function(){//循环所有序号输入框,获取ID和值
        if($(this).val()==null||$(this).val()==""){
            upAlert(showJSTxt(indexJSList,67));
            $(this).css("border","1px solid red");
            bool=false;
        }
        if(newNumList==null){//第一次实例数组
            newNumList=new Array();
            obj=new Object();
            obj.id=this.id.substr(4);
            obj.num=$(this).val();
            newNumList.push(obj);
        }else{
            for(var i=0;i<newNumList.length;i++){
                if($(this).val()==newNumList[i].num){//判断序号是否重复
                    bool=false;
                    upAlert(showJSTxt(indexJSList,68));
                    $(this).css("border","1px solid red");
                    $(this).css("color","red");
                    return;
                }else{
                    $(this).css("border","none");
                    $(this).css("color","black");
                }
            }
            if(bool){
                obj=new Object();
                obj.id=this.id.substr(4);
                obj.num=$(this).val();
                newNumList.push(obj);
            }
        }
        $(this).css("border","none");
    });
    if(bool==false){
        return;
    }
    var list=null;
    //判断修改的是哪个数组
    if(paramList!=null){
        list=paramList;
    }else if($("#mode_select").val()!="select_0"){
        var mos=returnList("modeList");
        if(mos!=null){
            for(var i=0;i<mos.length;i++){
                if("select_"+mos[i].id==$("#mode_select").val()){
                    list=mos[i].outputList;
                }
            }
        }
    }else if(returnList("ouputXml")!=null){
        list=returnList("ouputXml");
    }
//	 		//////////////////////////////
//	 		var str="";
//	 		for(var i=0;i<list.length;i++){
//	 			str+=" id:"+list[i].id+" num:"+list[i].num+" ,";
//	 		}
//	 		showMes("修改前:"+str);
//	 		///////////////////////////////
    //开始把正确的数据替换旧的数据
    for(var i=0,l=list.length;i<l;i++){
        for(var j=0,ls=newNumList.length;j<ls;j++){
            if(list[i].id==newNumList[j].id&&list[i].num!=null){
                list[i].num=newNumList[j].num;
            }
        }
    }
//	 		//<--
//	 		str="";
//	 		for(var i=0;i<list.length;i++){
//	 			str+=" id:"+list[i].id+" num:"+list[i].num+" ,";
//	 		}
//	 		showMes("修改后:"+str,"red");
//	 		//-->
    if($("#mode_select").val()!="select_0"){
        var mos=returnList("modeList");
        if(mos!=null){
            for(var i=0;i<mos.length;i++){
                if("select_"+mos[i].id==$("#mode_select").val()){
                    mos[i].outputList=list;
                }
            }
            saveList("modeList",mos);
            localStorage.setItem("moUpdate",1);
        }
    }else if(returnList("ouputXml")!=null){
        saveList("ouputXml",list);
        xmlEntities=list;
        readObjByList(list,LK_CANVAS);
        sessionStorage.setItem("upNum",1);
    }
    var rStr=getExt(1,"ouputXml",xmlEntities);
    LK_CAN_OBJ.onExt(1,1,rStr);//调用回调接口
    //sendJSONForServer("ouputXml", xmlEntities); 
    if(upConfirms(showJSTxt(indexJSList,69))){
    }else{
        $(".lk_faqbg").remove();
        $(".lk_cannal").remove();
        $("#allModeDiv").hide();
    }
    return list;
}
/****************************
 * 打开创建窗口模式
 */
function openAdd(){

    addType=1;
    add_win_name=$st(js_2,103.5);
    var list=returnList("ouputXml");
    for(var i=0;i<list.length;i++){
        list[i].strokeColor="white";
    }
    saveList("ouputXml", list);
    loadXml();
}
/****************************
 * 关闭创建窗口模式
 */
function closeAdd(){
    add_win_name=$st(js_2,103);
    addType=0;
}

/*********************************
 * 验证是否可以合并
 * @param params
 * @returns {Boolean}
 */
function checkHebin(params){
    try {
        if(params!=null&&params.length>0){
            var minXY=null;
            var maxXY=null;
            var winList=(returnList("ouputXml")!=null)?restore(returnList("ouputXml")):null;
            var winType=winList[0].mt;
            if(winType==null||winType==0){
                minXY=getMin(params);
                maxXY=getMax(params);
            }else if(winType==1){
                minXY=getMin(params,"design");
                maxXY=getMax(params,"design");
            }
            if(winList!=null){
                var px1=minXY.x;//窗口数组的最小X坐标
                var py1=minXY.y;//窗口数组的最小Y坐标
                var px2=maxXY.x;//窗口数组的最大X坐标
                var py2=maxXY.y;//窗口数组的最大Y坐标
                for(var i=0;i<params.length;i++){//循环判断物理窗口是不是一样的大小
                    var iw=0;
                    var ih=0;
                    if(winType==null||winType==0){
                        iw=params[i].x2-params[i].x1;
                        ih=params[i].y2-params[i].y1;
                    }else if(winType==1){
                        iw=params[i].mx2-params[i].mx1;
                        ih=params[i].my2-params[i].my1;
                    }
                    for(var j=0;j<params.length;j++){
                        var jw=0;
                        var jh=0;
                        if(winType==null||winType==0){
                            jw=params[j].x2-params[j].x1;
                            jh=params[j].y2-params[j].y1;
                        }else if(winType==1){
                            jw=params[j].mx2-params[j].mx1;
                            jh=params[j].my2-params[j].my1;
                        }
                        if(iw-jw>2||iw-jw<-2||ih-jh>2||ih-jh<-2){
                            //	showMes("error","blue");
                            return false;
                        }
                    }
                }
                var px=0;//第一个窗口的宽度
                var py=0;//第一个窗口的高度
                if(winType==null||winType==0){
                    px=params[0].x2-params[0].x1;
                    py=params[0].y2-params[0].y1;
                }else if(winType==1){
                    px=params[0].mx2-params[0].mx1;
                    py=params[0].my2-params[0].my1;
                }
//				showMes(" (px2-px1):"+(px2-px1)+" px:"+px+"  (py2-py1):"+(py2-py1)+" py:"+py);
                if((px2-px1+1)%px>2||(py2-py1+1)%py>2){//如果总宽总高对单个物理骗求余大于2个偏差点就为false
//					showMes(" "+((px2-px1+1)%px)+" "+((py2-py1+1)%py));
//					showMes("aaa");
                    return false;
                }
//				if((px2-px1)%px>2||(py2-py1)%py>2){//如果总宽总高对单个物理骗求余大于2个偏差点就为false
//					return false;
//				}
            }else{
//				showMes("bbb");
                return false;
            }
            return true;
        }else{
//	 		showMes("ccc");
            return false;
        }
    } catch (e) {
        setError("checkHebin", e);
        return false;
    }
}

/**************************************
 * 验证新增加的画中画漫游是否成立
 * @param param
 * @param paramList
 * @returns {Boolean}
 *
 */
function checkAdd(param,paramList){
    try {
        if(param==null){//验证数据是否为空
            return false;
        }else{
            var winList=xmlEntities;//窗口数组
            if(paramList!=null){
                winList=paramList;
            }
            var list=restore(winList);//物理屏窗口数组
            //	showMes("lsit:"+(list!=null)?"不为空："+list.length:"空");
            if(list!=null&&param!=null){
                var newList=new Array();//当前漫游窗口所在的物理屏数组
                var px1=param.x1;
                var py1=param.y1;
                var px2=param.x2;
                var py2=param.y2;
                if(px2<px1){
                    var a=px1;
                    px1=px2;
                    px2=a;
                }
                if(py2<py1){
                    var b=py1;
                    py1=py2;
                    py2=b;
                }
                if(px2-px1<15){
                    //alert("宽度不够");
                    return false;
                }
                if(py2-py1<15){
                    //alert("高度不够");
                    return false;
                }
                var winType=xmlEntities[0].mt;
                if(winType==null||winType==0){
                    upAlert(showJSTxt(indexJSList,71));
                    return false;
                }
                for(var i=0;i<list.length;i++){//获取跟当前框有重叠的物理屏窗口
                    if(checkOverlap(px1+0.1,py1+0.1,px2-0.1,py2-0.1,list[i].x1,list[i].y1,list[i].x2,list[i].y2)
                        &&list[i].active==0){
                        newList.push(list[i]);
                    }
                }
//				showMes("漫游param:"+JSON.stringify(param),"red");
//				showMes("newList:"+JSON.stringify(newList),"red");
                var minXY=null;//重叠区域窗口的最小坐标
                var maxXY=null;//重叠区域窗口的最大坐标
                minXY=getMin(newList);
                maxXY=getMax(newList);
                if(winType==null||winType==0){
                    for(var i=0;i<winList.length;i++){
                        if(winList[i].active==1&&param.id!=winList[i].id&&
                            checkOverlap((winList[i].x1+1),(winList[i].y1+1),(winList[i].x2-1),(winList[i].y2-1),
                                minXY.x,minXY.y,maxXY.x,maxXY.y)){
//							showMes("winList[i]:"+JSON.stringify(winList[i]));
                            upAlert(showJSTxt(indexJSList,72));
                            return false;
                        }
                    }
                }else if(winType==1){
                    for(var i=0;i<winList.length;i++){
                        if(winList[i].active==1&&param.id!=winList[i].id&&

                            checkOverlap((winList[i].mx1+1),(winList[i].my1+1),(winList[i].mx2-1),(winList[i].my2-1),
                                minXY.x,minXY.y,maxXY.x,maxXY.y)){
                            upAlert(showJSTxt(indexJSList,72));
                            return false;
                        }
                    }
                }
                var bool=false;
//				showMes("newList:"+newList.length);
//				var win_minXY=null;//重叠区域窗口的最小坐标
//				var win_maxXY=null;//重叠区域窗口的最大坐标
//				win_minXY=getMin(list);
//				win_maxXY=getMax(list);
                if(newList.length==1){//只有一个物理屏的时候
//					showMes("newList:"+JSON.stringify(newList),"red");
//					showMes("px1:"+px1+" py1:"+py1+" px2:"+px2+" py2:"+py2,"blue");
                    if(px1+0.1>newList[0].x1&&py1+0.1>newList[0].y1&&
                        px2-0.1<newList[0].x2&&py2-0.1<newList[0].y2){
                        return true;
                    }else {
                        upAlert(showJSTxt(indexJSList,73));
                        return false;
                    }
                }else if(newList.length>1){//多个物理屏的时候
                    bool=checkHebin(newList);//调用验证合并方法
//					showMes("bool:"+bool,"red");
                }
//				showMes("px1:"+px1+" py1:"+py1+" px2:"+px2+" py2:"+py2);
//				showMes("minXY:"+minXY.x+" "+minXY.y+" maxXY:"+maxXY.x+" "+maxXY.y);
                if(bool){
                    if(px1+0.1>minXY.x&&py1+0.1>minXY.y&&px2-0.1<maxXY.x&&py2-0.1<maxXY.y){
//						showMes("提示：添加漫游窗口","blue");
                        return true;
                    }else {
                        upAlert(showJSTxt(indexJSList,73));
                        return false;
                    }
                }else{
                    upAlert(showJSTxt(indexJSList,73));
                    return false;
                }
            }
        }
    }catch (e) {
        //setError("checkAdd", e);
        return false;
    }
}
function showDivAdd(paramId){
    try {
        txt_type=localStorage.getItem("txtType");
        if(txt_type==null||txt_type==""){
            txt_type=0;
        }
        if(txt_type==0){
            $("#s_r").attr("src","/api/img/jr_5.png");
            $("#d_l").attr("src","/api/img/cs_5.png");
        }else if(txt_type==1){
            $("#s_r").attr("src","/api/img/ejr_5.png");
            $("#d_l").attr("src","/api/img/ecs_5.png");
        }

        $("#index_title").html("&nbsp; "+showJSTxt(indexJSList,74)+
            "："+showJSTxt(indexJSList,53)+" > "+
            showJSTxt(indexJSList,75)+" "+paramId+"> "+showJSTxt(indexJSList,76));
        var div=document.getElementById("show_add");//获取容器
        var div_top=document.getElementById("sa_top");//获取容器头部
        var height=div.clientHeight-div_top.clientHeight;//
        $("#sa_entity").css("height",height+"px");
        $("#sa_entity").css("width",(div.clientWidth-20)+"px");
        var div_entity=document.getElementById("sa_entity");
        $(".ud_l").attr("style","height:"+(height-20)+"px; width:"+((div_entity.clientWidth-20)*0.45)+"px");
        $(".ud_c").attr("style","height:"+(height-20)+"px; width:"+((div_entity.clientWidth-20)*0.1)+"px");
        $(".ud_r").attr("style","height:"+(height-20)+"px; width:"+((div_entity.clientWidth-20)*0.43)+"px");
        var sae_c=document.getElementById("sae_c");
        var img_w=(sae_c.clientWidth*0.8);
        $(".sae_img").attr("width",(img_w-2)+"px");
        $(".sae_img").attr("height",(img_w-2)+"px");
        $(".ud_ul li").attr("style","width:100%;height:"+((div.clientHeight-40)*0.5)+"px;line-height:"+((div.clientHeight-40)*0.5)+"px");
        var ud_no_top=document.getElementById("ud_no_top");
        $(".ud_no_mes").css("max-height",((height-20)-ud_no_top.clientHeight)+"px");
        var ud_is_top=document.getElementById("ud_is_top");
        $(".ud_is_mes").css("max-height",((height-20)-ud_is_top.clientHeight)+"px");
        var decoders=returnList("decoderList");
        //	showMes("IFOlist:"+JSON.stringify(IFOlist));
        $("#ud_no_ul li").remove();
        if(decoders!=null&&decoders.length>0){
            //判断输入源数组是否为空
            var noCk="";//输入源选择框
            var noNum="";//输入源的序号
            var noName="";//输入源的名称
            var noIp="";//输入源的IP地址
            var noGn="";//输入源的通道号
            var show_name="";//显示名称




            for(var i=0;i<decoders.length;i++){
                noCk="<a class='ud_no_ck'><input class='udno_ck' id='udno_ck"+decoders[i].id+"'  type='checkbox'/></a>";
                noNum="<a class='ud_no_num'>"+decoders[i].num+"</a>";
                show_name=(decoders[i].name.length>15)?decoders[i].name.substr(0,15)+"...":decoders[i].name;
                noName="<a class='ud_no_name' title='"+decoders[i].name+"'>"+show_name+"</a>";
                if(decoders[i].location.length>16){
                    noIp="<a class='ud_no_ip' title='"+decoders[i].location+"'>"+decoders[i].location.substr(0,16)+"...</a>";
                }else{
                    noIp="<a class='ud_no_ip'  title='"+decoders[i].location+"'>"+decoders[i].location+"</a>";
                }
                if(checkInputType(decoders[i].type)&&(decoders[i].gn!=null&&decoders[i].gn!="")){
                    var names=null;
                    if(decoders[i].grName!=null&&decoders[i].grName!=""){
                        names=decoders[i].grName.split(",");
                    }else{
                        names=new Array();
                    }
                    if(names!=null&&names.length>0){//显示的时候清理通道地址
                        names=gName_split(names);
                    }
                    var de_num=0;
                    if(decoders[i].type==1&&isNaN(decoders[i].gn)==false&&decoders[i].gn>0){
                        de_num=decoders[i].gn*2;
                    }else{
                        de_num=decoders[i].gn;
                    }
                    for(var j=0;j<de_num;j++){
                        noCk="<a class='ud_no_ck'><input class='udno_ck' id='udno_ck"+decoders[i].id+"-"+j+"'   type='checkbox'/></a>";
                        show_name=(decoders[i].name.length>15)?decoders[i].name.substr(0,15)+"...":decoders[i].name;
                        noName="<a class='ud_no_name' id='udno_name"+decoders[i].id+"-"+j+"' title='"+decoders[i].name+"'>"+show_name+"</a>";
                        noNum="<a class='ud_no_num'>"+(decoders[i].num+j)+"</a>";
                        var ni=0;
                        var grName="";
                        if(decoders[i].type==1){
                            if(j%2==0){
                                ni=j/2;
                                grName=names[ni]+"("+showJSTxt(indexJSList,2)+")";
                            }else{
                                ni=parseInt(j/2);
                                grName=names[ni]+"("+showJSTxt(indexJSList,3)+")";
                            }

                        }else{
                            grName=names[j];
                        }
                        noGn="<a class='ud_no_gn' title='"+grName+"'>"+grName+"</a>";
                        $("#ud_no_ul").append("<li onclick='click_ud_li(this)' class='ud_no_li' id='ud_no_li"+decoders[i].id+"-"+j+"'>"+
                            noCk+noNum+noName+noIp+noGn
                            +"</li>");
                    }
                }else{
                    show_name=(decoders[i].name.length>15)?decoders[i].name.substr(0,15)+"...":decoders[i].name;
                    noName="<a class='ud_no_name' id='udno_name"+decoders[i].id+"' title='"+decoders[i].name+"'>"+show_name+"</a>";
                    noGn="<a class='ud_no_gn'></a>";
                    $("#ud_no_ul").append("<li onclick='click_ud_li(this)' class='ud_no_li'id='ud_no_li"+decoders[i].id+"'>"+
                        noCk+noNum+noName+noIp+noGn
                        +"</li>");
                }
            }
        }
        var val_li_width=$("#ud_no_ul .ud_no_li").css("width");
        //showMes("val_li_width:"+val_li_width);
        $(".ud_no_top").css("width",val_li_width);
        setud_r(paramId);//调用方法
        //var img_li_height=
        /* 
         updateDiv3的样式
         var div_top=document.getElementById("sa_top");
         var height=div.clientHeight-div_top.clientHeight;
         $("#sa_entity").css("height",height+"px");
         $(".ae_top").css("line-height",(height*0.15)+"px");
         $("#top_one a").each(function(){
         var className= $(this).attr("class");
         var width=$(this).css("width");
         showMes(" className:"+$(this).attr("class")+" width:"+$(this).css("width"));
         $("."+className+"_top").css("width",width);
         }); */
        //showMes("height:"+height); 

    } catch (e) {

        setError("showDivAdd", e);
    }

}
/************************************
 *写入以添加的对应关系
 */
function setud_r(paramId){
    try {
//			showMes("调用 paramId:"+paramId,"red");
        var modelList=returnList("modeList");
        var IFOlist=returnList("IFOlist");
        if(modelList!=null){
            var id=$("#mode_select").val();
            if(id!="select_0"){
                id=id.substr(7);
//				showMes("模式id:"+id);
                for(var i=0;i<modelList.length;i++){
                    if(modelList[i].id==id){
                        IFOlist=modelList[i].IFOlist;
                    }
                }
            }
        }
        var decoders=returnList("decoderList");
        $("#ud_is_ul li").remove();
        if(IFOlist!=null&&decoders!=null){
            var isCk="";//对应关系的选择框
            var isNum="";//对应关系的序号
            var isName="";//对应关系的输入源名称
            var isGn="";
            var isLt="";//对应关系的时间间隔
            var isBe="";//对应关系的时间段		
            var a=0;
            for(var i=0;i<IFOlist.length;i++){
                if(IFOlist[i].outputId==paramId){
                    var name="";
                    var grName="";
                    var dtype=0;
                    var gnum=0;
                    for(var j=0;j<decoders.length;j++){
                        if(IFOlist[i].inputId==decoders[j].id){
                            name=decoders[j].name;
                            dtype=decoders[j].type;
                            gnum=decoders[j].gn;
                            if(checkInputType(decoders[j].type)){
                                var names=null;
                                if(decoders[j].grName!=null&&decoders[j].grName!=""){
                                    names=decoders[j].grName.split(",");
                                }else{
                                    names=new Array();
                                }
                                if(names!=null&&names.length>0){//显示的时候清理通道地址
                                    names=gName_split(names);
                                }
//								showMes("names.length:"+names.length+" decoders[j].gn:"+decoders[j].gn);
//								showMes("names:"+JSON.stringify(names),"red");
//								showMes("IFOlist[i].gn:"+IFOlist[i].gn);
                                if(IFOlist[i].gn==null||IFOlist[i].gn==""||IFOlist[i].gn==0){
                                    grName="";
                                }else{
                                    var num_index=0;
                                    if(IFOlist[i].gn.toString().indexOf("n")==-1){
                                        num_index=IFOlist[i].gn;
                                    }else{
                                        num_index=IFOlist[i].gn.split("n")[1];
                                    }
                                    if(dtype==1){
                                        if(names!=""&&names!=null&&names.length>0){
                                            if((num_index-1)%2==0){
                                                grName=names[((num_index-1)/2)];
                                            }else{
                                                grName=names[(parseInt((num_index-1)/2))];
                                            }
                                        }else{
                                            grName=showJSTxt(indexJSList,1)+num_index;
                                        }
                                    }else{
                                        if(names.length==decoders[j].gn){
                                            grName=names[(num_index-1)];
                                        }else{
                                            grName=showJSTxt(indexJSList,1)+num_index;
                                        }
                                    }

                                }
                            }
                        }
                    }
//					showMes("name:"+name+" grName:"+grName+" gnum:"+gnum);
////					
                    if(name!=""&&name!=null){
                        a++;
                        isCk="<a class='ud_is_ck'><input class='ud_is_ck' id='ud_is_ck"+IFOlist[i].id+"'    type='checkbox'/></a>";
                        isNum="<a class='ud_is_num'>"+a+"</a>";
                        var showName=(name.length>15)?name.substr(0,15)+"...":name;
                        isName="<a class='ud_is_name' title='"+name+"'>"+showName+"</a>";
                        if(gnum!=0&&isNaN(gnum)==false&&gnum!=null){//输入源有通道数量的情况下进行显示通道名称处理
                            if(grName==null&&IFOlist[i].gn!=0&&isNaN(IFOlist[i].gn)==false){
                                if(dtype==1&&isNaN(gnum)==false&&IFOlist[i].gn<=(gnum*2)){
                                    var tgn="0";
                                    if(IFOlist[i].gn%2==0){
                                        tgn=IFOlist[i].gn/2+"("+showJSTxt(indexJSList,3)+")";
                                    }else{
                                        tgn=(parseInt(IFOlist[i].gn/2)+1)+"("+showJSTxt(indexJSList,2)+")";
                                    }
                                    grName=showJSTxt(indexJSList,1)+tgn;
                                }else{
                                    grName=showJSTxt(indexJSList,1)+IFOlist[i].gn;
                                }
                            }else if(grName!=null&&IFOlist[i].gn!=0&&isNaN(IFOlist[i].gn)==false){
                                if(dtype==1&&isNaN(gnum)==false&&IFOlist[i].gn<=(gnum*2)){
                                    var tgn="0";
                                    if(IFOlist[i].gn%2==0){
                                        tgn=grName+"("+showJSTxt(indexJSList,3)+")";
                                    }else{

                                        tgn=grName+"("+showJSTxt(indexJSList,2)+")";
                                    }
                                    grName=tgn;
                                }
                            }
                        }
                        isGn="<a class='ud_is_gn'>"+grName+"</a>";
                        //isLt="<a class='ud_is_lt'><input class='lt_txt' id='lt_txt"+IFOlist[i].id+"' disabled='disabled' style='width: 30px; height:20px;' type='text' value='"+IFOlist[i].longTime+"'/></a>";			
                        //isBe="<a class='ud_is_be'><input style=' width: 35px; height:20px;' type='text' disabled='disabled' value='"+IFOlist[i].beginTime+"'/>"+
                        //"-<input style='width: 35px;height:20px;' type='text' disabled='disabled' value='"+IFOlist[i].endTime+"'/></a>";
                        isLt="<a class='ud_is_lt'>"+IFOlist[i].longTime+"</a>";
                        isBe="<a class='ud_is_be'>"+IFOlist[i].beginTime+"-"+IFOlist[i].endTime+"</a>";
                        var str="<li class='ud_is_li' id='us_id"+IFOlist[i].id+"'>"+isCk+isNum+isName+isGn+isLt+isBe+"</li>";
                        $("#ud_is_ul").append(str);
                    }
                }
            }
        }
        var val_li_width=$("#ud_is_ul .ud_is_li").css("width");
        //	showMes("val_li_width:"+val_li_width);
        $(".ud_is_top").css("width",val_li_width);
    } catch (e) {

        setError("setud_r",e);
    }
}

function seach_input(){
    try {
        var value=$("#aess_text").val();
        var type=$("#ae_type").val();
        var findList=new Array();
        var decoders=returnList("decoderList");
        //	showMes("decoders:"+JSON.stringify(decoders));
        if(decoders!=null&&decoders.length>0){
            for(var i=0;i<decoders.length;i++){
                if(type==0){
                    if(isFind(value, decoders[i].location)){
                        if(checkInputType(decoders[i].type)&&(decoders[i].gn!=null&&decoders[i].gn!="")){
                            for(var j=0;j<decoders[i].gn;j++){
                                findList.push(decoders[i].id+"-"+j);
                            }
                        }else{
                            findList.push(decoders[i].id);
                        }

                    }
                }else if(type==1){

                    if(checkInputType(decoders[i].type)&&(decoders[i].gn!=null&&decoders[i].gn!="")){
                        for(var j=0;j<decoders[i].gn;j++){
                            if(value==decoders[i].num+j){
                                findList.push(decoders[i].id+"-"+j);
                            }
                        }
                    }else{
                        if(value==decoders[i].num){
                            findList.push(decoders[i].id);
                        }
                    }
                }else if(type==2){
                    if(isFind(value, decoders[i].name)){
                        if(checkInputType(decoders[i].type)&&(decoders[i].gn!=null&&decoders[i].gn!="")){
                            for(var j=0;j<decoders[i].gn;j++){
                                findList.push(decoders[i].id+"-"+j);
                            }
                        }else{
                            findList.push(decoders[i].id);
                        }
                    }
                }
            }
            $(".ud_no_li").css("background","white");
            var liId="";
            for(var i=0;i<findList.length;i++){
                liId="ud_no_li"+findList[i];
                $("#"+liId).css("background-color","#E77C7C");
                height++;
            }
            var hnum=0;
            var height=0;
            $(".ud_no_li").each(function(){
                hnum++;
                if(this.id==liId){
                    height=(hnum*24)-parseInt($("#ud_no_mes").css("height").split("px")[0])/2;
                }
            });
            var div = document.getElementById("ud_no_mes");
            div.scrollTop =height;
        }
    } catch (e) {

        setError("seach_input",e);
    }

}
/**********************************************
 *点击选择列表
 */
function click_ud_li(obj){
    try {
        var id=obj.id;
        $(".ud_no_li").css("background","white");
        $("#ud_no_tp").css("background","#999");
        $(obj).css("background","#67CCD0");
        var canva=document.getElementById("udno_ck"+id.substr(8));
        //var hideX=document.getElementById("ud_no_mes").scrollLeft;//获取隐藏的宽度ud_no_mes
        var hideY=document.getElementById("ud_no_mes").scrollTop;//获取隐藏的高度
        var canvaX=canva.offsetParent.offsetLeft+canva.offsetLeft;
        var canvaY=canva.offsetParent.offsetTop+canva.offsetTop-hideY;

        //	showMes("x:"+event.x+" y:"+event.y +"  x1:"+canvaX+" y1:"+canvaY +" hideX:"+hideX+" hideY:"+hideY);
        if(event.x>canvaX&&event.x<(canvaX+20)&&event.y>canvaY&&event.y<(canvaY+20)){

        }else{
            if($("#udno_ck"+id.substr(8)).prop("checked")==true){
                $("#udno_ck"+id.substr(8)).prop("checked",false);
            }else{
                $("#udno_ck"+id.substr(8)).prop("checked",true);
            }
        }


    }catch (e) {

        setError("click_ud_li",e);
    }
}
/*************************************
 *保存设置输入源设置的时间
 *
 */
function save_setTime(){
    try {
        var num=0;//添加对应关系的数量
        var ckbId="";
        var paramId=$("#adId").val();//判断是插入还是新添加
//		showMes("paramId:"+paramId,"red");
        var pi=-1;//插入的位置
        $(".udno_ck").each(function(){
            if($(this).prop("checked")==true){
                num++;
                ckbId=this.id.substr(7);
            }
        });
        var IFOlist=returnList("IFOlist");
        var moId=$("#mode_select").val();//获取当前操作的模式
        var molist=returnList("modeList");//获取模式数组
        if(moId!="select_0"){
            moId=moId.substr(7);
            if(molist!=null){
                for(var i=0;i<molist.length;i++){
                    if(molist[i].id==moId){
                        IFOlist=molist[i].IFOlist;
                    }
                }
            }
        }
        if(IFOlist==null){
            IFOlist=new Array();
        }
        if(IFOlist!=null&&paramId!=0){
            for(var i=0;i<IFOlist.length;i++){
                if(IFOlist[i].id==paramId){
                    pi=i;
                }
            }
            pi++;
        }
        if(num==1){
            var lt=$("#stt_lt").val();
            var bt=$("#stt_bt").val();
            var et=$("#stt_et").val();
            var bool=false;
//			showMes(lt+"  "+bt+"  "+et);
            try {
                if(lt!=null&&lt!=""){
                    var chl=checkLong($("#stt_lt"));
                    if(chl){
//					showMes("aaa");
//					//var sps=ckbId.splice("-");
//				//	showMes(" indexOf:"+ckbId.indexOf("-"));
//					showMes("ckbId:"+ckbId);
                        var IFOobj=new Object();
                        IFOobj.id=getId(IFOlist);
                        IFOobj.outputId=$("#outputId").val();
                        if(ckbId.indexOf("-")==-1){
                            IFOobj.inputId=ckbId;
                            IFOobj.gn= null;
                        }else{
                            IFOobj.inputId=ckbId.split("-")[0];
                            IFOobj.gn= parseInt(ckbId.split("-")[1])+1;
                        }
                        IFOobj.inputName=$("#udno_name"+ckbId).html();
                        IFOobj.longTime=lt;
                        IFOobj.beginTime="";
                        IFOobj.endTime="";
                        if(pi!=-1){
                            IFOlist.splice(pi,0, IFOobj);
                            pi++;
                        }else{
//						showMes("IFOobj:"+JSON.stringify(IFOobj));
                            IFOlist.push(IFOobj);
                        }
                    }else{
//					showMes("提示：时间间隔格式不正确","red");
                        return;
                    }
                    bool=true;
                }
            } catch (e) {

                showMes("e:"+e,"red");
            }
//			showMes("bool:"+bool);
            if((bt!=null&&bt!="")||(et!=null&&et!="")){
                if(checkBegin($("#stt_bt"))&&checkEnd($("#stt_et"))){
                    var IFOobj=new Object();
                    IFOobj.id=getId(IFOlist);
                    IFOobj.outputId=$("#outputId").val();
                    if(ckbId.indexOf("-")==-1){
                        IFOobj.inputId=ckbId;
                        IFOobj.gn= null;
                    }else{
                        IFOobj.inputId=ckbId.split("-")[0];
                        IFOobj.gn= parseInt(ckbId.split("-")[1])+1;
                    }
                    IFOobj.inputName=$("#udno_name"+ckbId).html();
                    IFOobj.longTime="";
                    IFOobj.beginTime=bt;
                    IFOobj.endTime=et;
                    if(pi!=-1){
                        IFOlist.splice(pi,0, IFOobj);
                        pi++;
                    }else{
                        IFOlist.push(IFOobj);
                    }
                }else{
                    //	showMes("提示：时间段格式不正确","red");
                    return;
                }
                bool=true;
            }
            if(bool==false){
                upAlert(showJSTxt(indexJSList,80));
                return;
            }
        }else if(num>1){
            var lt=$("#stt_lt").val();
            if(checkLong($("#stt_lt"))){
                $(".udno_ck").each(function(){
                    if($(this).prop("checked")==true){
                        ckbId=this.id.substr(7);
                        //var sps=ckbId.splice("-");

                        var IFOobj=new Object();
                        IFOobj.id=getId(IFOlist);
                        IFOobj.outputId=$("#outputId").val();
                        if(ckbId.indexOf("-")==-1){
                            IFOobj.inputId=ckbId;
                            IFOobj.gn= null;
                        }else{
                            IFOobj.inputId=ckbId.split("-")[0];
                            IFOobj.gn= parseInt(ckbId.split("-")[1])+1;
                        }
                        IFOobj.inputName=$("#udno_name"+ckbId).html();
                        IFOobj.longTime=lt;
                        IFOobj.beginTime="";
                        IFOobj.endTime="";
                        if(pi!=-1){
                            IFOlist.splice(pi,0, IFOobj);
                            pi++;
                        }else{
                            IFOlist.push(IFOobj);
                        }
                    }
                });

            }else{
                upAlert(showJSTxt(indexJSList,81));
                return;
            }
        }
        //showMes("IFOlist:"+JSON.stringify(IFOlist));
        var showIFO=null;//刷新窗口数据
        if(moId!="select_0"){
            for(var i=0;i<molist.length;i++){
                if(molist[i].id==moId){
                    molist[i].IFOlist=IFOlist;
                }
            }
            saveList("modeList",molist);
            var mStr=(molist!=null)?getExt(1,"moder",molist):"";
            LK_CAN_OBJ.onExt(1,8,mStr);//调用回调接口
            showIFO=IFOlist;
        }else{
            config_ifo(IFOlist,$("#outputId").val());//调用操作对应关系数组
            sessionStorage.setItem("upIFOList",1);
            saveList("IFOlist",IFOlist);
            var iStr=(IFOlist!=null)?getExt(1,"IFOlist",IFOlist):"";
            LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口
            showIFO=IFOlist;
        }
        setud_r($("#outputId").val());//刷新数据
//		showDivAdd($("#outputId").val());
        var thisId=$("#outputId").val();
        var moId=$("#mode_select").val();//当前模式
        var ouId=$("#outputId").val();
        inputConfig(thisId,showIFO);
        if(moId!="select_0"){
            moId=moId.substr(7);
            $("#mode_select option[value='select_"+moId+"']").attr("selected","selected");
            //$("#outputId option[value='"+ouId+"']").attr("selected","selected");
            var list=returnList("modeList");
            if(list!=null){
                for(var i=0;i<list.length;i++){
                    if(list[i].id==moId){
                        showWinMes(list[i].outputList,ouId);
                    }
                }
            }
        }
        $(".udno_ck").prop("checked",false);
        $(".lk_set_time").remove();

//		hide_setTime();//关闭添加窗口					
    }catch (e) {

        setError("save_setTime",e);
    }

}


/************************************
 * 判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期
 */
function isDate(mystring) {
    var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
    var str = mystring;
    if (str=="") return true;
    if (!reg.test(str)&&RegExp.$2<=12&&RegExp.$3<=31){
        return false;
    }
    return true;
}

/***********************************
 * 根据错误的消息显示当前错误的地方
 * @param list
 */
function showErrorLi(list){
    try {
        $(".mdszet_ll").css("background","none");
        for(var i=0;i<list.length;i++){
            $("#md_li_"+list[i]).css("background","#FAB2B2");
        }
    } catch (e) {

        setError("showErrorLi",e);
    }
}






/***********************************
 * 设置日期
 * @param obj
 */
function set_day(obj){
    try {
        var id=obj.id;

        var num=0;
        if(id!=null){//判断id!=null;
            num=id.substr(7);
        }
        //alert(num);
        WdatePicker({dateFmt:"yyyy-MM-dd",isShowWeek:true,onpicked:function(){
            //	showMes("调用 num:"+num+"  id:"+id+" this:"+this.id);
            if(id==null){
                id=this.id;
                num=id.substr(7);
            }
            var this_day=$dp.cal.getDateStr();//获取根据格式得到的日期
            $dp.$(id).value=this_day;//把日期显示出来
            var this_week=new Date(this_day).getDay();//根据日期返回星期几
            $("#md_week_"+num).attr("disabled","disabled");//星期几选项禁止操作
            if($("#md_hour_"+num).val()==""||$("#md_hour_"+num).val()==null){
                $("#md_hour_"+num).val("00:00");
            }
            $("#md_delete_"+num).focus();//把光标移到别的地方，可以继续操作选择时间
            $("#md_week_"+num+" option[value="+this_week+"]").attr("selected",true);//显示当前选择的星期
        }});
        if(obj.value==""||obj.value==null){//判断日期如果是空的情况下可以进行日期选择操作
            $("#md_week_"+num).attr("disabled",false);//星期几选项启动操作
        }
    } catch (e) {

        setError("set_day",e);
    }
}
/***********************************
 * 设置小时
 * @param obj
 */
function set_hour(obj){
    try {
        var id=obj.id;
        var num=0;
        if(id!=null){//判断id!=null;
            num=id.substr(8);
        }
        WdatePicker({dateFmt:"HH:mm",isShowWeek:true,onpicked:function(){
            $dp.$(id).value=$dp.cal.getDateStr();
            $("#md_delete_"+num).focus();//把光标移到别的地方，可以继续操作选择时间
        }});
        if(obj.value==null||obj.value==""){
            $(obj).val("00:00");
        }
    } catch (e) {

        setError("set_hour",e);
    }

}

var txt="";
/******************************
 * 只能输入数字。从0-32
 * 保存已经输入的正确的数字的值
 * @param obj
 */
function checkInputVoice(obj) {
    var value=obj.value;// 获取输入的字符串
    if(isNaN(obj.value)){// 判断是否是数字，
        obj.value=txt;// 如果不是数字则取已经保存在缓存里的txt值
        return false;
    }
    if(obj.value.split(".").length>1){// 判断是否出现小数点
        obj.value=txt;// 如果出现小数点则取已经保存在缓存里的txt值
        return false;
    }
    if(value<0||value>32){//判断这个是否是真确的端口
        obj.value=txt;// 
        return false;
    }
    txt=value;// 如果输入的内容是正确的则保存在缓存里
    obj.value=txt;// 把正确的显示出来
}
/***************************************
 * 点击窗口查看音量
 * @param winId
 *
 */
function get_voice(winId){
    try {
        var wins=xmlEntities;
        var voices=returnList("voiceList");
        if(voices==null){
            voices=new Array();
            return;
        }
        if(wins!=null&&voices!=null){
            for(var i=0;i<wins.length;i++){
                if(winId==wins[i].id){
                    for(var j=0;j<voices.length;j++){
                        var bs=(wins[i].sc%2==0)?wins[i].sc/2:parseInt(wins[i].sc/2)+1;
                        //	showMes("bs:"+bs,"red");
                        if(bs==voices[j].id&&wins[i].active!=1){
                            var num=bs=(wins[i].sc%2==0)?2:1;
                            var voice=0;
                            var state=1;
                            if(num==1){
                                voice=parseInt(voices[j].vc);
                                state=parseInt(voices[j].o1);
                            }else {
                                if(voices[j].vc2!=null){
                                    voice=parseInt(voices[j].vc2);
                                    state=parseInt(voices[j].o2);
                                }else{
                                    voice=parseInt(voices[j].vc);
                                    state=parseInt(voices[j].o1);
                                }

                            }
                            if(voice==127){
                                voice=128;

                            }
                            //showMes("voice:"+voice);
                            $("#voc").css("margin-left",((voice-40)*(128/(127-40)))+"px");
                            $("#volume").val(parseInt((voice-40)/2.75));

                            if(state==1){
                                $("#speaker").show();
                                $("#voice").hide();
                            }else {
                                $("#speaker").hide();
                                $("#voice").show();
                            }
                            return;
                        }
                    }
                    $("#volume").val(16);
                }
            }
        }
    } catch (e) {
        setError("get_voice",e);
    }
}


/*******************************
 * 实时设置窗口的音频输出
 * @param obj
 */
function set_voice(obj){
    try {
        if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
            return false;
        }
        //showMes("发送：","blue");
        if(checkMes()){
            var id=null;
            if(obj!=null){
                id=obj.id;
            }else{
                return;
            }
            var loginCode= returnSlist("loginCode");
            if(loginCode==null){
                loginCode=[0x00,0x00,0x00,0x00];
                //return;
            }
            var wins=xmlEntities;//窗口数组
            var winId=0;//窗口ID号
            var binary =new  Uint8Array(11);//命令
            var isOpen=0;//打开关闭
            var coder=0;//功能码
            var value=0;//值
            var volumeNum=$("#volume").val();//音量
            if(volumeNum==null||volumeNum==""){
                volumeNum=0;
                $("#volume").val(0);
            }
            volumeNum=parseInt(volumeNum);
            if(wins!=null){
                var num=0;
                for(var i=0;i<wins.length;i++){
                    if(wins[i].strokeColor=="red"&&wins[i].id!=9999){
                        winId=wins[i].id;
                        num++;
                    }
                }
                if(num>1){
                    upAlert(showJSTxt(indexJSList,103.1));
                    return;
                }else if(num==0){
                    upAlert(showJSTxt(indexJSList,103.2));
                    return;
                }
            }else{
                upAlert(showJSTxt(indexJSList,103.2));
                return;
            }
            //	showMes("id:"+id+" winId:"+winId);

            switch (id) {
                case "voice":
                    coder=0x02;
                    value=0x01;
                    isOpen=1;
                    $("#voice").hide();
                    $("#speaker").show();
                    break;
                case "speaker":
                    coder=0x02;
                    value=0x00;
                    isOpen=0;
                    $("#voice").show();
                    $("#speaker").hide();
                    break;
                case "voc":
                    //				if(volumeNum==null||volumeNum==""){
                    //					volumeNum=0;
                    //					$("#volume").val(0);
                    //				}
                    coder=0x03;
                    value=parseInt((volumeNum*2.75)+40);
                    if(value==128){
                        value=127;
                    }
                    //	showMes("value:"+value,"red");
                    break;
                default:
                    break;
            }
            binary = setCode(binary, loginCode, 0x00, 0x00, 0x0a,coder);//
            binary[8] =winId/256;
            binary[9] =winId%256;
            binary[10] =value;
            var list=returnList("voiceList");
            var wins=returnList("ouputXml");
            if(list!=null&&wins!=null){
                var wi=0;
                var cs=restore(wins);
                for(var i=0;i<wins.length;i++){
                    if(wins[i].id==winId){
                        for(var j=0;j<cs.length;j++){
                            if(cs[j].active!=1&&wins[i].mx1+1>cs[j].x1&&wins[i].mx1+1<cs[j].x2&&
                                wins[i].my1+1>cs[j].y1&&wins[i].my1+1<cs[j].y2){
                                wi=cs[j].id;
                            }
                        }
                    }
                }
                var bs=(wi%2==0)?wi/2:parseInt(wi/2)+1;

                for(var i=0;i<list.length;i++){
                    if(list[i].id==bs){
                        var nm=(wi%2==0)?2:1;
                        //showMes("id:"+id+" isOpen:"+isOpen+" nm:"+nm,"red");
                        if(id=="voc"){
                            if(nm==1){//第一个物理屏
                                list[i].vc=value;
                            }else{//第二个物理屏
                                list[i].vc2=value;
                            }
                        }else if(id=="voice"||id=="speaker"){
                            //	showMes("list[i].id:"+list[i].id+  "id:"+id+" isOpen:"+isOpen+" nm:"+nm,"blue");
                            //	 	 	  			if(list[i].tp==1&&list[i].tp2==1&&isOpen==0){
                            //		 	 	  			if(nm==1){//第一个物理屏
                            //		 	 	  				list[i].o1=isOpen;
                            //		 	 	  				list[i].o2=1;
                            //		 	 	  			}else{//第二个物理屏
                            //			 	 	  			list[i].o1=1;
                            //		 	 	  				list[i].o2=isOpen;
                            //		 	 	  			}
                            //	 	 	  			}else{
                            if(nm==1){//第一个物理屏
                                list[i].o1=isOpen;
                            }else{//第二个物理屏
                                list[i].o2=isOpen;
                            }
                            //	 	 	  			}

                        }
                    }
                }
                saveList("voiceList",list);
            }
            //showMes("list："+JSON.stringify(list));
            checkSend(binary);
            //	showMes("发送设置binary:"+JSON.stringify(binary),"red");
        }else{
//			upAlert("aaaaa");
//	 		upAlert(showJSTxt(paramJSTxt,1));
            setError("setViceo");
        }
    } catch (e) {
        setError("set_voice",e);
    }
}


/********************
 *鼠标按下选择IP,获取鼠标的当前X和Y值
 *@param obj
 */
function press(obj){
    pressID=obj.id;
    pressX=event.clientX;
    pressY=event.clientY;
    var thisObj=document.getElementById(pressID);
    pressObjX=thisObj.offsetLeft;
    pressObjY=thisObj.offsetTop;
    // showMes("pressObjX:"+pressObjX+" pressObjY:"+pressObjY +" pressX:"+pressX+" pressY:"+pressY);
}
/************************
 *鼠标移动的时候执行的内容
 *
 */
function shift(){
    //var str="";
    var x=event.clientX;
    //var y=event.clientY;
    var thisDivLeft=document.getElementById((pressID+"Video")).offsetLeft;
    //showMes("thisDivLeft:"+thisDivLeft+" left:"+((pressObjX+(x-pressX))-thisDivLeft));
    if((pressObjX+(x-pressX))<thisDivLeft){
        $("#"+pressID).css("margin-left","0px");
        $("#volume").val(0);
    }else if((pressObjX+(x-pressX))>thisDivLeft+128){
        $("#"+pressID).css("margin-left","128px");
        $("#volume").val(32);
    }else{
        $("#"+pressID).css("margin-left",((pressObjX+(x-pressX))-thisDivLeft)+"px");
        $("#volume").val(parseInt(parseInt(((pressObjX+(x-pressX))-thisDivLeft)/4)));
    }
}

/************************
 *鼠标松开的时候还原初始值
 *
 */
function  loosen(){
    pressID=null;//鼠标按下选择的标签ID;
    pressX=null;//鼠标按下的时候当前鼠标坐标X
    pressY=null;//鼠标按下的时候当前鼠标坐标Y
    var obj=new Object();
    obj.id="voc";
    try {
        set_voice(obj);
        //set_voice();
    } catch (e) {
        setError("loosen",e);
    }
}



/*******************************************************
 * 移动窗口
 * 备注:移动的窗口一定是要绝对定位。点击对象一定要在移动对象内。
 * @param overObj    需要移动有对象
 */
function moveTip(overObj){
    try {
        var mox=gbt_x;//鼠标按下的X坐标
        var moy=gbt_y;//鼠标按下的Y坐标
        var hideX = document.body.scrollLeft;// 获取隐藏的宽度
        var hideY = document.body.scrollTop;// 获取隐藏的高度
        var mouseX = (event.x + hideX);// 鼠标相对页面开始的X坐标
        var mouseY = (event.y + hideY);// 鼠标相对页面开始的Y坐标
        var bodyW = document.body.clientWidth;
        var bodyH = document.body.clientHeight;
        var overElement=document.getElementById(overObj);//移动对象
        var oeWidth=overElement.clientWidth;//当前移动对象的X坐标位置
        var oeHeight=overElement.clientHeight;//当前移动对象的Y坐标位置
        var left=mouseX-mox;
        var height=mouseY-moy;
        var divShowSize=5;//当提示框超出页面的时候，显示这个窗口的
        if(mouseX-10<0){//移动窗口超出左边页面
            left=0-(oeWidth-oeWidth/divShowSize);
        }else if(mouseX+20==bodyW||mouseX+20>bodyW){//移动窗口超出右边页面
            left=bodyW-(oeWidth/divShowSize);
        }
        if(mouseY-10<0){//移动窗口超出上边页面
            height=0-(oeHeight-oeHeight/divShowSize);
        }else if(mouseY==bodyH||mouseY>bodyH){//移动窗口超出下边页面
            height=bodyH-(oeHeight/divShowSize);
        }
        $("#"+overObj).css("left",left+"px");
        $("#"+overObj).css("top",height+"px");
// 			showMes("mox:"+mox+" moy:"+moy+"  mouseX:"+mouseX+" mouseY:"+mouseY+" bodyW:"+bodyW+ " bodyH:"+bodyH +"oeLeft:"+oeLeft+" oeTop:"+oeTop+
// 					"ovX:"+ovX+" ovY:"+ovY);
    } catch (e) {
        setError("moveTip",e);
    }
}
/***************************************************
 * 移动窗口结束
 */
function upTip(){
    try {
        imgID=null;
    } catch (e) {
        setError("upTip",e);
    }
}

var TIP_NAME="tip_";//保存到session，时间段内不提示时间的名称
var TIP_TIME=5;//设置时间段多少秒内不提示时间
/************************************************
 * 关闭窗口，参数（关闭窗口对象{"id"}）
 * @param closeObj
 */
function closeTip(closeObj){
    try {
        var id=closeObj.id;
        $("#"+id).hide();
        var loginName=sessionStorage.getItem("userName");
        sessionStorage.setItem(TIP_NAME+loginName,0);
    } catch (e) {
        setError("closeTip",e);
    }
}
/******************************************************
 * 显示窗口，参数（打开窗口对象{"id"：显示窗口Id,"mesId":显示消息divId,"mes":显示的消息内容,"topFunc":调用程序前的外置方法，"floorFunc":调用程序前后的外置方法}）
 * @param showObj
 */
function showTip(showObj){
    try {
        var loginName=sessionStorage.getItem("userName");
        var tipNum=sessionStorage.getItem(TIP_NAME+loginName);
        if(tipNum!=null&&tipNum<TIP_TIME){
            tipNum=parseInt(tipNum)+1;
            sessionStorage.setItem(TIP_NAME+loginName,tipNum);
            return;
        }else if(tipNum!=null&&tipNum==TIP_TIME){
            sessionStorage.removeItem(TIP_NAME+loginName);
        }
        var id=showObj.id;//提示框的Id
        var mesId=showObj.mesId;//显示消息有Id
        var mes=showObj.mes;//显示的消息
        if($("#"+id).css("display")=="none"){
            $("#"+id).show();
        }
        $("#"+mesId).html(mes);
    } catch (e) {
        setError("closeTip",e);
    }
}


/***************************************************
 * 关闭输出
 */
function clean_output(){
    try {
        var windows=xmlEntities;
        if(windows==null){
            windows=returnList("ouputList");
        }
        var loginCode = returnSlist("loginCode");// 回去随机码
        if(loginCode==null){
            loginCode=[0x00,0x00,0x00,0x00];
        }
        var IFOlist=returnList("IFOlist");
        //showMes("旧IFOlist:"+JSON.stringify(IFOlist),"red");
        var binary = new Uint8Array(13);// 创建一个数组，必须固定长度
        if(windows!=null&&windows.length>0){

//				if(upConfirms(showJSTxt(indexJSList,107))==false){
//					return;
//				}
            var winId=0;
            for(var i=0;i<windows.length;i++){
                if(windows[i].strokeColor=="red"){
                    winId=windows[i].id;
                    if (loginCode != null) {
                        binary = setCode(binary, loginCode, 0x00, 0x00, 0x02, 0x00);
                        binary[8] = winId/256;
                        binary[9] = winId%256;
                        binary[10] = 0;
                        binary[11] = 0;
                        binary[12] = 0;
                        //showMes("binary:"+JSON.stringify(binary));
//							checkSend(binary);//发送清理命令
                        LK_CAN_OBJ.onExt(0,"02 00",binary);//调用回调接口
                    }
                    if(IFOlist!=null){//删除对应关系文件
                        for(var j=0;j<IFOlist.length;j++){
                            if(IFOlist[j].outputId==winId){
                                IFOlist.splice(j,1);
                                j--;
                            }
                        }
                    }
                }
            }//
            if(winId==0){
                upAlert(showJSTxt(indexJSList,105));
                return false;
            }
//				showMes("新IFOlist:"+JSON.stringify(IFOlist),"blue");
//				showMes("新IFOlist:"+JSON.stringify(minIFO),"blue");

            sessionStorage.setItem("upIFOList",1);
            var iStr=(IFOlist!=null)?getExt(1,"IFOlist",IFOlist):"";
            LK_CAN_OBJ.onExt(1,7,iStr);//调用回调接口
//				sendJSONForServer("IFOlist",IFOlist);//发送对应文件	
            saveList("IFOlist",IFOlist);
            return true;
        }else{
            upAlert(showJSTxt(indexJSList,106));
        }
    } catch (e) {
        setError("clean_output",e);
    }
}
/****************************************************
 * 获取设备版本信息
 *
 */
function getDeviceType(){
    try {
        var loginCode = returnSlist("loginCode");

        if (loginCode == null||parent.socket==null) {

            return;
        }
        allNum=1;// 初始化总次数
        inNum=1;// 初始化第几次
        code.type=zh(3);
        code.num=zh(3);
        code.one=zh(loginCode[0]);
        code.tow=zh(loginCode[1]);
        code.three=zh(loginCode[2]);
        code.four=zh(loginCode[3]);
        thisSocket=parent.socket;
        sendBigFile();
    } catch (e) {
        setError("getDeviceType",e);
    }
}

var appDivId="appInput";

/********************************************************************************
 * 显示移动输入源
 * @addTime 2016-9-14
 * @updateTime 2016-11-7
 * @param paramList
 *
 */
function showAppInput(paramList,paramType){
    try {
        var inputs=new Array();
        if(paramList==null){//测试使用


            paramList="";
            for(var i=65536;i>65426;i--){
                if(i==65536){
                    paramList+=i+":"+i;
                }else{
                    paramList+=","+i+":"+i;
                }

            }
            inputs=updataAppInput(paramList);

        }else{//系统返回
//				$("#ccc").append("<p>不为空aaa:"+JSON.stringify(paramList)+"</p>");
            if(paramType!=null&&paramType==1){//矩阵输入源
                inputs=updataAppInput(paramList,1);
            }else{
                inputs=updataAppInput(paramList,0);
            }

        }
//			showMes("paramList:"+JSON.stringify(paramList));
//			$("#ccc").append("<p>paramList:"+paramList+"</p>");
        var idnexHtml=sessionStorage.getItem("thisHtml");


        if(inputs!=null&&idnexHtml=="index"){
            localStorage.setItem("inputs",paramList);//本地缓存
//				showMes("top:"+$(".resolution_div").css("top"));
            var div_top=$(".resolution_div").css("top");
            if(div_top==null||div_top=="-9999px"){
                initLog(350,600,"远程设备",appDivId,"");
            }else{
                $(".app_input_div").remove();
            }

//				var style="width:100%;height:100%;";
//				$("#"+appDivId).append("<ul style="+style+" id='app_ul'><ul>");
            var divStyle="width:100%;height:18px;line-height:18px;overflow: auto;white-space: nowrap;text-overflow: ellipsis; ";
            var numStyle="color:black;display:inline-block;max-width:80px; height:18px; line-height:18px;font-weight:bold;";
            var nameStyle="color:black;display:inline-block;max-width:200px; height:18px; line-height:18px; ";
            var inputImg="<img src='img/join.gif' style='width:18px;height:18px;vertical-align:middle;'/>";
            var topImg="<img src='img/base.gif' style='width:18px;height:18px;vertical-align:middle;'/>";
            var divStr="<div style='"+divStyle+"' id='app_input_tree' class='app_input_div' >"+topImg+"</div>";

            var style_str="";
            var set_span="";
            var res_name="resolutionNumber";
            var peer_type=localStorage.getItem(res_name);//获取本地缓存的分辨率
            peer_type=(peer_type==null)?7:peer_type;
            localStorage.setItem(res_name,peer_type);
            set_span="<span style='width:60px;height:30px;line-height:30px;display:inline-block;text-align:center;'>"+showJSTxt(indexJSList,29)+"：</span>" +
                "<select class='select_black' style='width: 80px; height: 23px;' id='"+res_name+"' onchange='click_videoCofig(this)'>";
            //显示分辨率单选框
            for(var i=0;i<type_list.length;i++){//公用缓存区里面 type_list
                var selectType="";
                if(peer_type==type_list[i].type){
                    selectType="selected='selected'";
                }else{
                    selectType="";
                }
                set_span+="<option value='"+type_list[i].type+"'"+selectType+">"+type_list[i].value+"</option>";
//					set_span+="<label class='"+className+" resolution_radio' onclick='click_resolution(this)' style='margin-left:12px;' id='resolution_radio_"+type_list[i].id+"'></label>";
//					set_span+="<span style='display:inline-block;line-height:30px; height:30px;margin-left:2px;'>"+type_list[i].value+"</span>";
            }
            set_span+="</select>";

            var code_span="";
            var code_name="codeNumber";
            if(code_list!=null){
                code_span="<span style='width:60px;height:30px;line-height:30px;display:inline-block;text-align:center;'>"+showJSTxt(indexJSList,29.5)+"：</span>" +
                    "<select class='select_black' style='width: 80px; height: 23px;' id='"+code_name+"' onchange='click_videoCofig(this)'>";
                var show_code=3;
                show_code=(localStorage.getItem(code_name)!=null)?localStorage.getItem(code_name):3;
                localStorage.setItem(code_name,show_code);//重新保存码率
                for(var i=0;i<code_list.length;i++){
                    var selectType="";
                    if(show_code==code_list[i].id){
                        selectType="selected='selected'";
                    }else{
                        selectType="";
                    }//
                    code_span+="<option value='"+code_list[i].id+"'"+selectType+">"+code_list[i].type+"</option>";
                }
                code_span+="</select>";
            }

            var selct_type_div="<div class='app_input_div' style='width:100%;height:30px;border-bottom:1px solid grey; '>" +
                ""+	set_span+code_span+
                "</div>";
            $("#"+appDivId).append(selct_type_div);
            $("#"+appDivId).append(divStr);
            var cHeight=parseInt($("#"+appDivId).css("height").split("px")[0]);
//				showMes("cHeight:"+cHeight);
            $("#app_input_tree").css("height",(cHeight-35)+"px");

            var P2PCodeList=returnList("P2PCodeList");
            P2PCodeList=(P2PCodeList==null)?new Array():P2PCodeList;//空数组处理
            for(var i=0;i<inputs.length;i++){//更新本地的获取的远程设备
                var input_code=inputs[i].location.substr(0,12);
                var bool=true;
                for(var j=0;j<P2PCodeList.length;j++){
                    if(input_code==P2PCodeList[j].code){
                        bool=false;
                    }
                }
                if(bool){
                    P2PCodeList.push({"code":input_code,"type":-1,"typeName":""});//默认为0， 0的情况下取总设置
                }
            }
            saveList("P2PCodeList",P2PCodeList);
//				showMes("input:"+JSON.stringify(inputs));

            /**********************
             * treeId 显示视图的id号
             * tName 视图内输入源id号的格式
             * tValue 视图内输入源列表
             */
                //输入源配置文件
//				var inputFile='[{"id":1,"num":1,"name":"224.168.1.200","typeName":"LOCAL","group":"0","location":"224.168.1.200;224.168.1.200","gn":null,"port":"1234;12346","stream":1,"userName":"admin","password":"admin","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":2,"num":2,"name":"192.168.10.180","typeName":"LOCAL","group":"0","location":"192.168.10.180","gn":null,"port":"80","stream":1,"userName":"admin","password":"admin","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":3,"num":3,"name":"192.168.10.181","typeName":"ONVIF","group":"0","location":"192.168.10.181","gn":null,"port":"80","stream":1,"userName":"admin","password":"admin","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":4,"num":4,"name":"192.168.10.198","typeName":"ONVIF","group":"0","location":"192.168.10.198","gn":null,"port":"80","stream":1,"userName":"admin","password":"12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":5,"num":5,"name":"192.168.10.201","typeName":"ONVIF","group":"0","location":"192.168.10.201","gn":null,"port":"80","stream":1,"userName":"admin","password":"12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":6,"num":6,"name":"192.168.10.211","typeName":"ONVIF","group":"0","location":"192.168.10.211","gn":null,"port":"80","stream":1,"userName":"admin","password":"12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":7,"num":7,"name":"192.168.10.212","typeName":"ONVIF","group":"0","location":"192.168.10.212","gn":null,"port":"80","stream":1,"userName":"admin","password":"12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":8,"num":8,"name":"192.168.10.213","typeName":"ONVIF","group":"0","location":"192.168.10.213","gn":null,"port":"80","stream":1,"userName":"admin","password":"12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":9,"num":9,"name":"192.168.10.214","typeName":"ONVIF","group":"0","location":"192.168.10.214","gn":null,"port":"80","stream":1,"userName":"admin","password":"12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":10,"num":10,"name":"192.168.10.215","typeName":"ONVIF","group":"0","location":"192.168.10.215","gn":null,"port":"80","stream":1,"userName":"admin","password":"12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":11,"num":11,"name":"rtsp","typeName":"RTSP","group":"0","location":"rtsp://192.168.2.14:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1;rtsp://192.168.2.14:554/Streaming/Channels/102?transportmode=unicast&profile=Profile_2","gn":null,"port":"554;","stream":1,"userName":"admin","password":"Admin12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":12,"num":12,"name":"sdfsd","typeName":"RTSP","group":"0","location":"sdfsdf;sdfsdf","gn":null,"port":"123;123","stream":1,"userName":"","password":"","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":13,"num":13,"name":"192.168.2.19","typeName":"ONVIF","group":"0","location":"192.168.2.19","gn":null,"port":"80","stream":1,"userName":"admin","password":"Admin12345","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":14,"num":14,"name":"192.168.10.176","typeName":"ONVIF","group":"0","location":"192.168.10.176","gn":null,"port":"80","stream":1,"userName":"Admin","password":"1234","remark":"","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":null,"ad":0},{"id":22,"num":44,"name":"nvr","typeName":"HIKVISION(NVR,DVR)","group":"0","location":"192.168.10.41","gn":8,"port":"554","stream":1,"userName":"admin","password":"12345","remark":"1","time":0,"fond":"","fondColor":"","fondSize":"","show":0,"grName":"通道1,通道2,通道3,通道4,通道5,通道6,通道7,通道8","ad":0}]';
//				inputs[0].list=JSON.parse(inputFile);
            showTree("app_input_tree",inputs);
//	 			var method="ondragend='tuodon(event)' ondragstart='xuanzhon(this)' ondrag='yidon(event)' " +
//				" class='node' href='javascript:vord(0)' onmousedown='mouseDownTree(this)' onclick='clickTree(this)' ondblclick='shuangji(this)'";
//		
//	 			var imgUrl="";
//				for(var i=0;i<inputs.length;i++){
//					if(i==inputs.length-1){
//						imgUrl="img/joinbottom.gif";
//					}else{
//						imgUrl="img/join.gif";
//					}
//					var code_id=inputs[i].location.substr(0,12);
//					inputImg="<img src='"+imgUrl+"' style='float:left;width:18px;height:18px;vertical-align:middle;'/>";
//					var peer_code=inputs[i].location.substr(0,12);//取前12位
//					var peer_type=0;
//					var inputNum="<span class='app_num' style='"+numStyle+"'>("+inputs[i].num+")</span>";
//					var showName="";
////					inputs[i].name+="aaaaaaaaaaaaaaaaaaaaaaa";
//					var strLenth=20;//显示字符串
//					if(inputs[i].name.length>strLenth){
//						showName=inputs[i].name.substr(0,strLenth)+"...";
//					}else{
//						showName=inputs[i].name;
//					}
//					var inputName="<span class='app_name' style='"+nameStyle+"' title='"+inputs[i].name+"'>."+showName+"</span>";
//					var d_type=inputs[i].location.substr(inputs[i].location.length-4,4);
//					var d_type_name="";
//					if(d_type=="fffe"){
//						d_type_name=showJSTxt(utilJSTxt,94);
//					}else if(d_type=="fffd"){
//						d_type_name=showJSTxt(utilJSTxt,95);
//					}else{
//						d_type_name="测试用户";
//					}
//					var inputLocation="<span class='app_name' style='"+nameStyle+"'>【"+d_type_name+"】</span>";
//					var divStr="<div style='"+divStyle+"' id='' class='app_input_div' >"+inputImg+
//					"<a "+method+" href='javascript:vord(0)'  id='sdt"+inputs[i].id+"'>"+inputNum+inputName+inputLocation+"</a></div>";
//					$("#"+appDivId).append(divStr);
//
//				}
        }else{//关闭界面 
            close_window_log();
            localStorage.removeItem("inputs");
        }
//			$("#ccc").append("<p>"+inputs.length+"</p>");
    } catch (e) {
        alert("showAppInput"+e);
    }
}




/**********************************
 * 请求视音频反回参数
 * @param pId
 * @param ptype
 */
function rCallBack(pId,pType,pError){
    try {
        var P2PCodeList=returnList("P2PCodeList");
        if(P2PCodeList!=null){
            var dName="";
            var dType="";
            for(var i=0;i<P2PCodeList.length;i++){
                if(P2PCodeList[i].id==pId){
                    dName=P2PCodeList[i].name;
                }
            }
            if(ptype==1){
                dType="视频";
            }else if(ptype==2){
                dType="音频";
            }
            upAlert("提示："+dName+"拒绝"+dType+"请求。");
        }
    } catch (e) {
        setError("rCallBack",e);
    }
}

/************************************
 * @mes 点击设置当前的状态
 * @param paramObj
 */
function click_videoCofig(paramObj,paramName){
    try {
        var value=$(paramObj).val();
        var id=paramObj.id;
//			showMes("id:"+id+" value:"+value);
        localStorage.setItem(id,value);//获取本地缓存的分辨率
//			var id=paramObj.id;
//			var paramStr="resolution_radio_";
//			var paramList=type_list;
//			
//			if(paramList!=null){
//				for(var i=0;i<paramList.length;i++){
//					if(id==paramStr+paramList[i].id){
//						$("#"+id).attr("class","resolution_on resolution_radio");
//						localStorage.setItem("resolutionNumber",paramList[i].type);//获取本地缓存的分辨率
//					}else{
//						$("#"+paramStr+paramList[i].id).attr("class","resolution_no resolution_radio");
//					}
//				}	
//			}
    } catch (e) {
        setError("click_videoCofig",e);
    }
}
/********************************************
 * @mes 修改右键显示的分辨率状态
 * @param paramText
 * @returns String
 */
function updataText(paramText){
    try {
        var peer_type=localStorage.getItem("resolutionNumber");//获取本地缓存的分辨率
        var P2PCodeList=returnList("P2PCodeList");//获取当前设置的p2p设置解码设置
        var p2pList=returnSlist("appList");//p2p输入源数组
        var oiList=returnList("oiList");//窗口s
        var rText=paramText;
        var windowId=rightId;//窗口ID

        var checkType=0;
        for(var i=0;i<type_list.length;i++){//显示默认设置的类型
            if(paramText==type_list[i].value){
                checkType=1;//
                if(peer_type==type_list[i].type){
                    checkType=2;
                }
            }
        }
        if(checkType==1){
            rText="<span style='color:black;'>"+paramText+"</span>";
        }else if(checkType==2){
            rText="<span style='color:red;'>"+paramText+"</span>";
        }else{
            return paramText;//不是设置分辨率
        }
//			
//			showMes("初始rText:"+rText);
        if(P2PCodeList!=null&&p2pList!=null&&oiList!=null){//判断是否是P2P远程输入源
            var inputId=0;
            var inputCode="";
            //判断窗口显示的输入源
            for(var i=0;i<oiList.length;i++){//获取输入源ID号
                if(oiList[i].oi==windowId){
                    inputId=oiList[i].ii;
                }
            }
            if(inputId!=0){
                for(var i=0;i<p2pList.length;i++){
                    if(p2pList[i].id==inputId){
                        inputCode=p2pList[i].location.substr(0,12);
                        for(var j=0;j<P2PCodeList.length;j++){
                            if(P2PCodeList[j].code==inputCode&&P2PCodeList[j].typeName!=""&&P2PCodeList[j].typeName==paramText){
                                //当前播放的分辨率
                                rText="<span style='color:red;'>"+paramText+"</span>";
                                break;
                            }else if(P2PCodeList[j].code==inputCode&&P2PCodeList[j].typeName!=""){
                                rText="<span style='color:black;'>"+paramText+"</span>";
                            }
                        }
                    }
                }
            }
        }
//			showMes("最后rText:"+rText);
        return rText;
    } catch (e) {
        setError("updataText",e);
    }
}
/**************************************
 * @mes 设置播放分辨率
 * @param paramType
 */
function set_resolution(paramType){
    try {
        var resolutionType=paramType;//分辨率
        var resolutionValue="";
        var windowId=parseInt(rightId);//窗口ID
        var input_device=0;//设备Id
        var inputId=0;//输入源ID
        var inputGn=0;//输入源通道
        var devNumber="";//序列号
        var code="";//p2p唯一码
        var P2PCodeList=returnList("P2PCodeList");
        var p2pList=returnSlist("appList");//p2p输入源数组
        var oiList=returnList("oiList");//对应关系
        for(var i=0;i<type_list.length;i++){
            if(resolutionType==type_list[i].type){
                resolutionValue=type_list[i].value;
            }
        }
        if(oiList!=null&&p2pList!=null){
            for(var i=0;i<oiList.length;i++){
                if(windowId==oiList[i].oi){
                    inputId=oiList[i].ii;//输入源id
                    inputGn=oiList[i].gn;//输入源通道号
                    input_device=oiList[i].di;//输入源设备id
                    for(var j=0;j<p2pList.length;j++){
                        if(p2pList[j].id==inputId){
                            code=p2pList[j].location.substr(0,12);
                        }
                    }

                }
            }
            var obj={"code":code,"type":resolutionType,"typeName":resolutionValue};
            var codeNumber=localStorage.getItem("codeNumber");
            codeNumber=(codeNumber!=null)?parseInt(codeNumber):3;
            if(P2PCodeList==null){
                P2PCodeList=new Array();
                P2PCodeList.push(obj);
            }else{
                for(var i=0;i<P2PCodeList.length;i++){
                    if(P2PCodeList[i].code==code){
                        P2PCodeList[i].type=obj.type;
                        P2PCodeList[i].typeName=obj.typeName;
                    }
                }
            }
            saveList("P2PCodeList",P2PCodeList);
            var loginCode = returnSlist("loginCode");// 回去随机码
            if (loginCode != null) {

                var returnType=playAPP(windowId,input_device,inputId,inputGn);//判断当前的输入源是否是P2P设备
//					var returnType=playAPP(inputId,windowId);
                var binary = new Uint8Array(13);// 创建一个数组，必须固定长度
                if(returnType==false){
                    binary = new Uint8Array(16);
                }if(input_device!=0){//远程矩阵的输入源
                    binary = new Uint8Array(17);
                }
                binary = setCode(binary, loginCode, 0x00, 0x00, 0x02, 0x00);
                binary[8] = windowId/256;
                binary[9] = windowId%256;
                binary[10] = inputId/256;
                binary[11] = inputId%256;
                binary[12] = inputGn;

                if(returnType==false){//判断是否是切换远程设备
                    binary[13] = 0;//占位符
                    var resolution=localStorage.getItem("resolutionNumber");
                    var codeNumber=localStorage.getItem("codeNumber");
                    resolution=(resolution==null)?7:resolution;//视频分辨率
                    resolution=parseInt(resolution);
                    codeNumber=(codeNumber==null)?3:codeNumber;//视频码率
                    codeNumber=parseInt(codeNumber);
                    binary[14] = resolution;
                    binary[15] = codeNumber;
                    if(input_device!=0){//设备id号
                        binary[16] = input_device%256;
                        binary[17] = parseInt(input_device/256);
                    }
                }
                if (checkMes()) {
//						showMes("binary:"+JSON.stringify(binary));
                    checkSend(binary);
                } else {
                    upAlert(showJSTxt(indexJSList,14));
                    return false;
                }
                /*********************************************
                 * @time 2016-9-22
                 * @mes 切换APP设备的输入源出来显示
                 */

                if(returnType==false){
                    return false;
                }
            }
        }

    } catch (e) {
        setError("set_resolution",e);
    }
}



/************************************************
 * 切换输入源
 * @param paramAPPId
 * @param paramWinId
 * @param deviceId
 * @param inputNum
 * @return boolean
 */
function playAPP(paramWinId,deviceId,inputId, inputNum){
    try {
        var appList=returnSlist("appList");//获取APP设备数组
        var appToWin=returnSlist("appToWin");//获取APP所在窗口播放对应关系
        var update=true;// true=本地输入源   false=远程输入源
        var devNumber=null;//设备序列号
        if(appList==null){
            appList=new Array();
        }
        if(appToWin==null){
            appToWin=new Array();
        }
        for(var i=0;i<appList.length;i++){//判断当前输入源是不是手机视频
            if(appList[i].id==inputId||appList[i].id==deviceId){
                update=false;
//					if(appList[i].list!=null){//手机客户端或者网页客户端
//						devNumber=appList[i].location;
//					}
            }

        }
        if(update==false){
            for(var i=0;i<appToWin.length;i++){
                if(appToWin[i].outputId==paramWinId&&appToWin[i].deviceId==deviceId){
                    update=false;
                    appToWin.splice(i,1);
                    i--;
                }
            }
            var obj={"id":getId(appToWin),"outputId":parseInt(paramWinId), "deviceId":deviceId, "inputId":parseInt(inputId),
                "inputName":"","longTime":1,"beginTime":"","endTime":"","gn":parseInt(inputNum)};
            appToWin.push(obj);//添加对应关系
            saveSessionList("appToWin",appToWin);
        }
        return update;
    } catch (e) {
        upAlert("playApp"+e);
    }
}


//




/****************************************************************************************************************************************************************
 * ************************************************************************************************************************************************************
 *  jquery代码
 *
 */
$(function(){




    /******************************
     * 点击打开用户自定义输出窗口框
     *
     */
    $(".nvaKay").click(function(){
        var id=this.id;
        var can=document.getElementById(LK_CANVAS);
        var cWidth= can.clientWidth;
        var cHeight=can.clientHeight;
        if(id=="nvaDesign"){
            if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
                return false;
            }
            if(unUpdateWin()==false){//如果当前正在触发报警状态禁止操作配置文件
                return false;
            }
            var list=returnList("ouputXml");
            if(list!=null&&list[0].mt!=null){
                if($(".map_div").css("display")!="none"){
                    upAlert(showJSTxt(indexJSList,82));
                    return;
                }
                showDesign();
            }
        }else if(id=="nvaMap"){
            if($("#design").css("display")!="none"){
                upAlert(showJSTxt(indexJSList,83));
                return;
            }
            if($(".map_div").css("display")=="none"){
                $(".map_div").show();
                var x=this.offsetLeft;
                var y=this.offsetTop;
                $(".map_div").css("left",(x-40)+"px");
                $(".map_div").css("top",(y+40)+"px");
                initX=cWidth/2;
                initY=cHeight/2;
//				  showMes("initX:"+initX+"  initY:"+initY);
                setSize("map",initX,initY);//根据窗口设置导航窗口大小
                $("#map_div").css("width",initX+"px");
                $("#map_div").css("height",(initY+50)+"px");
//				  setSize("map_div",(initX-6),initY);//根据窗口设置导航窗口大小
                var img_obj=document.getElementById("map_im");
                var img_num=(img_obj.offsetLeft/2+10)*0.1;
//				 showMes("imgID:"+img_num,"red");
                initCase(img_num);
            }else {
                localStorage.removeItem("db_list");
                cleanMap();
                loadXml();
            }
        }else if(id=="reset"){
//			 var str="";
//			 for(var i=0;i<2000;i++){
//				 if(i%32==0&&i%24==0&&i%16==0&&i%8==0&&i%6==0){
//					 str+=" "+i;
//				 }
//				 
//			 }
//			 showMes("str:"+str);
//			 countSize();
        }else if(id=="addWindow"){
            if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
                return false;
            }
            if(unUpdateWin()==false){//如果当前正在触发报警状态禁止操作配置文件
                return false;
            }
            if(addType==0){
                openAdd();
            }else{
                // closeAdd();
            }
        }
    });

    /*****************************
     * 选择操作窗口
     */
    $("#deCan").click(function(){
        var index=getCanXY(MY_CANVAS);
        var moveXY=getCanXY(MY_CANVAS);
        var moveWidth=moveXY.x-gbt_x;
        var moveHeight=moveXY.y-gbt_y;
        if(getClickObjId(index.x,index.y,objs)==null&&moveWidth==0&&moveHeight==0){
            buffer_one=null;
            buffer_two=0;
            param_list=null;
            select_case=null;
            param=null;
            draw(MY_CANVAS,objs,"repeat");// 重新生成画布
        }
    });
    /************************************
     * 点击显示导航窗口
     */
    $(".map").click(function(){
    });
    /***********************************
     * 隐藏导航窗口
     */
    $(".map_img").click(function(){
        cleanMap();
        loadXml();

    });

    $("#allDevice").change(function(){
        if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
            loadDevice();
            return false;
        }
        var obj=new Object();
        obj.id=this.value;
        connection(obj);
    });
    // 预置位操作
//	 $("#t_s").change(function(){// 选择查询的预置位
//		 $(".t_i").val(this.value);
//	 });
//	 $("#c_s").change(function(){// 选择查询的预置位
//		 $(".c_i").val(this.value);
//	 });
//	 $("#d_s").change(function(){// 选择删除的预置位
//		 $(".d_i").val(this.value);
//	 });
//	 

    function clear_input(id){
        if(isNaN($("#"+id).val())){
            $("#"+id).val("");
            $("#"+id).css("color","black");
            $("#"+id).css("border"," 1px solid #ccc");
        }
    }
    function check_input(id){
        if(isNaN($("#"+id).val())){
            $("#"+id).val("请输入数字");
            $("#"+id).css("color","red");
            $("#"+id).css("border"," 1px solid red");
            return false;
        }else if($("#"+id).val()>256||$("#"+id).val()<1){
            $("#"+id).val("请输入1-256");
            $("#"+id).css("color","red");
            $("#"+id).css("border"," 1px solid red");
            return false;
        }else{
            $("#"+id).css("color","black");
            $("#"+id).css("border"," 1px solid #ccc");
            return true;
        }
    }
    /*
     * 点击添加预置位输入框检查内容是否是数字
     */
    $("#t_i").click(function(){ clear_input("t_i");});
    $("#y_a").mouseover(function(){$("#y_a").attr("src","images/plus-1.png");});
    $("#y_a").mouseout(function(){$("#y_a").attr("src","images/plus.png");});
    /*
     * 点击查看预置位输入框检查内容是否是数字
     */
    $("#c_i").click(function(){clear_input("c_i");});
    $("#y_c").mouseover(function(){$("#y_c").attr("src","images/zoom-in-1.png");});
    $("#y_c").mouseout(function(){$("#y_c").attr("src","images/zoom-in.png");});
    /*
     * 点击删除预置位输入框检查内容是否是数字
     */
    $("#d_i").click(function(){clear_input("d_i");});
    $("#y_d").mouseover(function(){$("#y_d").attr("src","images/dl-1.png");});
    $("#y_d").mouseout(function(){$("#y_d").attr("src","images/dl.png");});
    /*
     * 点击添加按钮提交数据
     */
    $("#add_yzw").click(function(){
        if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
            return false;
        }
        var bool= check_input("t_i");
        if(bool){

            param_2=parseInt($("#t_i").val());
            sendCode=0x32;
            sending=true;
            sendControl();
            sending=false;
        }
    });

    /*
     * 点击预置位输入框
     */
    $("#check_yzw").click(function(){
        if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
            return false;
        }
        var bool= check_input("c_i");
        if(bool){

            param_2=parseInt($("#c_i").val());
            sendCode=0x31;
            sending=true;
            sendControl();
            sending=false;
        }
    });
    /*
     * 点击删除预置位输入框
     */
    $("#delete_yzw").click(function(){
        if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
            return false;
        }
        var bool= check_input("d_i");
        if(bool){
            param_2=parseInt($("#d_i").val());
            sendCode=0x33;
            sending=true;
            sendControl();
            sending=false;
        }
    });
    /****************************************
     * 右键点击搜索输入源
     ***************************************/
        //取消添加
    $(".long_cansal").click(function() {
        $("#a_l_t").hide();
        $("#all_long").val("");
    });
    /************************************
     *分配输入源同时设置时间段
     */
    $("#long_finish").click(function() {
        $("#a_l_t").hide();
        //showMes("params:"+JSON.stringify(params));
        var time = $("#all_long").val();
        var len = 0;
        if (params.length > parami.length) {
            len = parami.length;
        } else {
            len = params.length;
        }
        saveInputs(len,time);

    });
    /*****************************
     * 搜索输入源关闭按钮
     */
    $(".seach_input_img").click(function(){
        cansal_seach();
    });

    $("#deCan").click(function(){

    });
    /*********************************
     * 鼠标按下控制自定义窗口移动
     */
    var keyX=0;//X坐标
    var keyY=0;//Y坐标
//		$("html").keydown(function(event) {	
//		    var keyCode = event.keyCode; 
//		    
//		    switch (keyCode) {
//		    case 8://删除按键
//		    	if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
//					return false;
//				}
//				if(unUpdateWin()==false){//如果当前正在触发报警状态禁止操作配置文件
//					return false;
//				}
//		    	clean_output();
//				break;
//			case 37:
//				keyX--;
//				break;
//			case 38:
//				keyY--;
//				break;
//			case 39:
//				keyX++;
//				break;
//			case 40:
//				keyY++;
//				break;
//			default:
//				break;
//			}
//		    var bs=10;
////		    $("#dsm span").remove();////////////////////////////////////////////////////////////////////////
//		   // showMes(keyX+" "+keyY+" param_list:"+param_list.length+"pType"+pType);
////		    try{
////		    	var okeya=0;//键盘左右移动的数值
////		    	var okeyb=0;//键盘上下移动的数值
////		    	var list_min=getMin(param_list,"design");//获取当前选择的窗口的最小点的坐标
////				var list_max=getMax(param_list,"design");//获取当前选择的窗口的最大点有坐标
////		    	var deCanW=document.getElementById(MY_CANVAS).clientWidth;//获取当前画布的最大宽度
////			    var	deCanH=document.getElementById(MY_CANVAS).clientHeight;//获取当前画布的最大高度
////			    if(param_list!=null&&objs!=null&&(pType==0||pType==3)){//判断当前状态是选择了窗口准备移动的情况下才能进行操作
////			    	pType=0;
////			    	//upAlert("x:"+list_min.x+keyX+"y:"+list_min.y+keyY+" w:"+deCanW+" h:"+deCanH+" keyX:"+keyX*bs+" keyY:"+keyY*bs);
////					if((list_min.x+keyX*bs<0||list_max.x+keyX*bs>deCanW)&&
////						(list_min.y+keyY*bs<0||list_max.y+keyY*bs>deCanH)){
////					}else if(list_min.x+keyX*bs<0||list_max.x+keyX*bs>deCanW){
////						return;
////					}else if(list_min.y+keyY*bs<0||list_max.y+keyY*bs>deCanH){
////						return;
////					}else if(list_min.x+keyX*bs>0&&list_min.x+keyX*bs<deCanW
////							&&list_min.y+keyY*bs>0&&list_max.y+keyY*bs<deCanH){
////						okeya=keyX;
////						okeyb=keyY;
////					}
////						buffer_one=new Array();//定义一个新数组
////						var newObj=null;//定义一个新对象
////						for(var i=0;i<param_list.length;i++){//循环计算移动的
////							newObj=new Object();
////							newObj.id=param_list[i].id;
////							if(param_list[i].num==null){
////								newObj.num=newObj.id;
////							}else{
////								newObj.num=param_list[i].num;
////							}
////							newobj.sc=param_list[i].sc;
////							newObj.x1=param_list[i].x1;
////							newObj.y1=param_list[i].y1;
////							newObj.x2=param_list[i].x2;
////							newObj.y2=param_list[i].y2;
////							newObj.lineWidth=param_list[i].lineWidth;
////							newObj.fillColor=param_list[i].fillColor;
////							newObj.strokeColor=param_list[i].strokeColor;
////							newObj.active=param_list[i].active;
////							newObj.type=param_list[i].type;
////							newObj.mt=param_list[i].mt;
////							newObj.st=param_list[i].st;
////							newObj.w=param_list[i].w;
////							newObj.h=param_list[i].h;
////							newObj.mx1=param_list[i].mx1+(okeya*bs);
////							newObj.my1=param_list[i].my1+(okeyb*bs);
////							newObj.mx2=param_list[i].mx2+(okeya*bs);
////							newObj.my2=param_list[i].my2+(okeyb*bs);
////								for(var j=0;j<objs.length;j++){
////									if(objs[j].id==param_list[i].id){
////										objs.splice(j,1);
////									}
////								}
////								buffer_one.push(newObj);
////								objs.push(newObj);		
////						}
////						draw(MY_CANVAS,objs,"repeat");//重新生成画布
////						param=new Object();
////						param.x1=getMin(buffer_one,"design").x;//获取最小X坐标
////						param.y1=getMin(buffer_one,"design").y;//获取最小Y坐标
////						param.x2=getMax(buffer_one,"design").x;//获取最大X坐标
////						param.y2=getMax(buffer_one,"design").y;//获取最大Y坐标
////						param.lineWidth=2;
////						param.strokeColor="red";
////						//showMes((param.x2-param.x1)+" "+(param.y2-param.y1));
////						rectObj(param,MY_CANVAS);
////						okeyX=0;//还原公用属性
////						okeyY=0;//还原公用属性
////				}
////		    }catch (e) {
//			
////		    	showMes(e);
////			}
//		    //根据keycode判断按下的是哪个键 
//
//		});



    /************************************
     * 按下键盘触发事件
     */
    $("html").keyup(function(event) {
        var keyCode = event.keyCode;
        showMes("keyCode:"+keyCode);
        switch (keyCode) {
            case 37:
                keyX=0;
                break;
            case 38:
                keyY=0;
                nextInput(1);//快捷向上切换图像
//				$("#ccc span").remove();
//				$("#ccc p").remove();
                break;
            case 39:
                keyX=0;
                break;
            case 40:
                keyY=0;
                nextInput(2);//快捷向下切换图像
                break;
            case 46:
                //dedete键盘键
//				if(checkPagePower(showJSTxt(paramJSTxt,73),2)==false){
//					return false;
//				}
//				removeWin();
                break;

            default:
                break;
        }
//		    param_list=buffer_one;
        //根据keycode判断按下的是哪个键 

    });
//$("#openTable").click(function(){
//	
//	if(designType==0){
//		designType=1;
//		$(this).val("关闭微调");
//	}else{
//		designType=0;
//		$(this).val("打开微调");
//	}
//});

    $("#set_time_img").click(function(){
//隐藏设置时间DIV
        hide_setTime();
    });
    $("#stb_reset").click(function(){
//隐藏设置时间DIV
        hide_setTime();
    });

    /***************************************
     * 点击保存通道对应关系上传配置文件
     */
    $("#bcsry_txt").click(function() {

        if(checkMes()){
            clicktime=0;
        }else{
            if( clicktime==0){
                clicktime=1;
                objCT=setTimeout("checkTime()", 1000);
            }
            upAlert(showJSTxt(paramJSTxt,1));
            return;
        }
        if(upConfirms(showJSTxt(jsTxt,4))){
            var loginCode = returnSlist("loginCode");// 获取缓存中的随机码
            if (loginCode == null) {// 如果随机码为空，提示尚未登录
                //upAlert("您尚未登录");
                window.open("main/login.html","_self");
            } else {
                saveToServe();
            }
        }
    });


});


var win1='@846/641/373/2/2/1/1/[[{"id":1,"st":0,"cl":0,"pp":"1,1","up":"9.876733436055472,10.000000000000002,320.50000000000006,186.5"},{"id":2,"st":2,"cl":0,"pp":"2,2,0,0,140,140;5,5,140,0,280,140;6,6,280,0,420,140;7,7,0,140,140,280;8,8,140,140,420,420;9,9,0,280,140,420","up":"320.50000000000006,10.000000000000002,424.04108885464825,68.83333333333334;424.04108885464825,10.000000000000002,527.5821777092963,68.83333333333334;527.5821777092963,10.000000000000002,631.1232665639443,68.83333333333334;320.50000000000006,68.83333333333334,424.04108885464825,127.66666666666669;424.04108885464825,68.83333333333334,631.1232665639443,186.5;320.50000000000006,127.66666666666669,424.04108885464825,186.5"},{"id":3,"st":0,"cl":0,"pp":"3,3","up":"9.876733436055472,186.5,320.50000000000006,363"},{"id":4,"st":0,"cl":0,"pp":"4,4","up":"320.50000000000006,186.5,631.1232665639443,363"}]';
var win2='@752/641/373/2/2/1/1/[[{"id":1,"st":0,"cl":0,"pp":"1,1","up":"9.876733436055472,10.000000000000002,320.50000000000006,186.5"},{"id":2,"st":2,"cl":0,"pp":"2,2,0,0,140,140;5,5,140,0,280,140;6,6,280,0,420,140;7,7,0,140,140,420;8,8,140,140,420,420","up":"320.50000000000006,10.000000000000002,424.04108885464825,68.83333333333334;424.04108885464825,10.000000000000002,527.5821777092963,68.83333333333334;527.5821777092963,10.000000000000002,631.1232665639443,68.83333333333334;320.50000000000006,68.83333333333334,424.04108885464825,186.5;424.04108885464825,68.83333333333334,631.1232665639443,186.5"},{"id":3,"st":0,"cl":0,"pp":"3,3","up":"9.876733436055472,186.5,320.50000000000006,363"},{"id":4,"st":0,"cl":0,"pp":"4,4","up":"320.50000000000006,186.5,631.1232665639443,363"}]';
var s_w_type=0;
var s_w_timeout=null;
function testSpilit(){
    try {
        var wins=null;
        if(s_w_type==0){
            s_w_type=1;
//		 showMes("win1:"+win1.length);
            wins=fileToWin(win1);

//		 saveList("ouputXml",win1);
//		
        }else{
            s_w_type=0;

            wins=fileToWin(win2);
//		 saveList("ouputXml",win2);
        }
        showMes("length:"+wins.length);
//	 sendJSONForServer("ouputXml", win);
//	 loadXml();
//	 if(s_w_timeout!=null){
//		 clearTimeout(s_w_timeout);
//	 }
        s_w_timeout=setTimeout("testSpilit()", 2000);
    } catch (e) {
        // TODO: handle exception
        showMes("testSpilit"+e,"red");
    }

}

function closeSplit(){
    clearTimeout(s_w_timeout);
}

function fileToWin(pfile){
    try {
        var str=pfile;
//	showMes("str:"+str);
        var ix=str.indexOf("@");
        var bigFile=str.substring(ix+1);
        var textList=null;
        textList=bigFile.split("/");
//	showMes("bigFile:"+bigFile);
        var width=textList[1];
        var height=textList[2];
        localStorage.setItem("canWidth",width);
        localStorage.setItem("canHeight",height);
        var outputList=null;
        // 蒹容旧版
        if(textList[6]==1||textList[6]==0){//接收带视频制式的方法
            localStorage.setItem("size",textList[3]+"/"+textList[4]+"/"+textList[5]+"/"+textList[6]+"/");
            try{
                var bool=(textList[7].substr(0,1)==textList[7].substr(1,1));
                if(bool){
                    outputList=JSON.parse(textList[7].substr(1));
                }else{
                    outputList=JSON.parse(textList[7]);
                }
            }catch (e) {
                showMes("1e:"+e,"red");
                outputList=null;
            }

        }else{//接收不带视频制式的方法
            localStorage.setItem("size",textList[3]+"/"+textList[4]+"/"+textList[5]+"/");
            try{
                var bool=(textList[6].substr(0,1)==textList[6].substr(1,1));
                if(bool){
                    outputList=JSON.parse(textList[6].substr(1));
                }else{
                    outputList=JSON.parse(textList[6]);
                }

            }catch (e) {
                showMes("2e:"+e,"red");
                outputList=null;
            }

        }
        sessionStorage.setItem("lineNum",textList[3]);
        sessionStorage.setItem("listNum",textList[4]);
        outputList=replaceList("output",outputList,"get");
//	 showMes("aaaoutputList:"+JSON.stringify(outputList));
        saveList("ouputXml",outputList);
        loadXml();
        return outputList;
    } catch (e) {
        showMes("fileTowin"+e,"red");
    }
}






















var coLen=8;
var st=0;// 检查系统是否发送返回
var deshu=10;//求余
var dwh=420;//自定义模式的物理屏宽度和高度
var MAXNUM=9999;//窗口序号
var pb_socket=null;//公用scorket
var socketUser=null;//链接用户名
var socketPwd=null;//链接密码
var socketList=new Array();//链接数组
var deSignNum=20;//自定义模式输出文件距离边界的值
var updateTime=null;//标准模式转换为自定义模式，定时上传文件函数
var clicktime=0;//上传文件

var orderList=null;//登录发送命令数组
var orde_reback=null;//发送命令组心跳

var method_reback=null;//时间函数

var objCT=null;//时间触发器

var RESOLUTION_AUTO="autoType";//session中保存超出解码能力的KEY
var RESOLUTION_AUTO_LIST="autoList";//session中保存超出解码能力物理屏的key
/*******************************
 * 输入源类型
 */
var inputTypeList=[{"id":1,"name":"ONVIF"},{"id":2,"name":"RTSP"},{"id":26,"name":"RTMP"},
    {"id":4,"name":"HIKVISION(NVR,DVR)"}, /*{"id":5,"name":"XM(NVR,DVR)"}, */{"id":5,"name":"XM"},
    {"id":6,"name":"VOYA(NVR,DVR)"}, {"id":7,"name":"IDRS-7000HN"}, {"id":8,"name":"IDRS-7000HD"},
    {"id":9,"name":"DAHUA(NVR,DVR)"}, {"id":10,"name":"AEVISION"}, {"id":11,"name":"HOKUTO-M"},
    {"id":12,"name":"HOKUTO-V"}, {"id":13,"name":"ZAXTEAM"},/* {"id":14,"name":"TVT(NVR,DVR)"},*/
    {"id":27,"name":"TVT(3.0 NVR,DVR)"},{"id":28,"name":"TVT(N9000 NVR,DVR)"},
    {"id":15,"name":"LinkyView"}, {"id":16,"name":"Mainvan"}, {"id":17,"name":"LZG"},
    {"id":18,"name":"HCVSP"}, {"id":19,"name":"VIMICRO"}, {"id":20,"name":"CVMS"},
    {"id":21,"name":"UNIVIEW"}, {"id":22,"name":"MISNWAY"}, {"id":23,"name":"VISKING"},
    {"id":24,"name":"MULTICAST"},  {"id":25,"name":"Tiandy"},{"id":3,"name":"LOCAL"}
];
var nvrList=[1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,25,27,28];//nvr类型
var portList=[2,24,26];//可设子码流地址



/******************************
 * 动态加载css或者JS文件
 *dynamicLoading.css("test.css");
 *dynamicLoading.js("test.js");
 *****************************/
var dynamicLoading = {
    css: function(path){
        if(!path || path.length === 0){
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function(path){
        if(!path || path.length === 0){
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
};

/*****************************
 * 根据窗口分布显示图片
 * @param paramList
 * @param canId
 */
var vw=16;
var vh=16;
function showVoice(paramList,canId){
    try {
        if(paramList!=null){
            //	showMes("开始画图");
            var can=null;//画布
            if(canId!=null){
                can=document.getElementById(canId);
            }else{
                can=document.getElementById(LK_CANVAS);
            }
            var ctx = can.getContext("2d");//获取画布的操作类型
            var x=0;
            var y=0;
            var img=document.getElementById("voice");//获取图片
            for(var i=0;i<paramList.length;i++){
                x=paramList[i].x2-vw-2;
                y=paramList[i].y2-vh-2;
                ctx.drawImage(img,x, y, vw, vh);//话背景图片
            }
        }
    } catch (e) {
        setError("showVoice",e);
    }
}
/*****************************************
 * 点击声音
 * @returns {Boolean}
 */
function clickVoice(){
    try {
        var bool=true;
        if(xmlEntities!=null){
            var caseList=null;
            //showMes("list:"+JSON.stringify(list),"blue");
            caseList=getMyWindows(xmlEntities);
//			showMes("caseList:"+JSON.stringify(caseList),"blue");
            if(caseList!=null){
                for(var i=0;i<caseList.length;i++){

                }

            }
        }

        return bool;
    } catch (e) {
        setError("clickVoice",e);
    }
}

/***********************************
 * 初始化分辨率
 */
var sizeList = new Array();
sizeObj = new Object();
sizeObj.id = 2;
sizeObj.name = "1080p";
sizeObj.byte = 1;
sizeList.push(sizeObj);
sizeObj = new Object();
sizeObj.id = 5;
sizeObj.name = "1024*768";
sizeObj.byte = 4;
sizeList.push(sizeObj);
sizeObj = new Object();
sizeObj.id = 3;
sizeObj.name = "2048*1536";
sizeObj.byte = 2;
sizeList.push(sizeObj);
sizeObj = new Object();
sizeObj.id = 4;
sizeObj.name = "2560*1600";
sizeObj.byte = 3;
sizeList.push(sizeObj);
sizeObj = new Object();
sizeObj.id = 6;
sizeObj.name = "4K-1080P";
sizeObj.byte = 5;
sizeList.push(sizeObj);
sizeObj = new Object();
sizeObj.id = 7;
sizeObj.name = "4K-4K";
sizeObj.byte = 6;
sizeList.push(sizeObj);
var sizeObj = new Object();
sizeObj.id = 1;
sizeObj.name = "720p";
sizeObj.byte = 0;
sizeList.push(sizeObj);
/**********************************
 * 物理屏对象
 * @param id
 * @param list
 * @returns
 */
var Screen=function(id,list){
    return{
        id:(id!=null)?id:0,
        list:(list!=null)?list:null
    };
};

// 保存数组到缓存
function saveSessionList(parameterName, parameter){
    sessionStorage[parameterName]=JSON.stringify(parameter);

}

/*
 * 功能：根据字符串名字查找本地数据 参数:name-->字符串名字 返回值：一个对象数组
 */
function returnSlist(name){
    var bool="false";
    var list=new Array();
    for(var i=0;i<100; i++){
        if(sessionStorage.key(i)==name){
            bool="true";
        }
    }
    if(bool=="true"){
        try{
            list=JSON.parse(sessionStorage[name]);
        }catch (e) {

            list=null;
        }
        return list;
    }else{
        return null;
    }

}

// 保存数据

function returnSession(name){
    var bool="false";
    var parameter="";
    for(var i=0;i<100; i++){
        if(sessionStorage.key(i)==name){
            bool="true";
        }
    }
    if(bool=="true"){
        parameter= sessionStorage.getItem(name);
        return parameter;
    }else{
        return null;
    }
}
/********************************
 * 打印程序错误
 * @param methodName
 * @param error
 */
function setError(methodName,error){
    var str1=showJSTxt(utilJSTxt,1);
    var str2=showJSTxt(utilJSTxt,2);
    showMes(str1+"：“"+methodName+"”，"+str2+"："+error,"red");
}

/********************************
 * 弹出程序错误
 * @param methodName
 * @param error
 */
function alertError(methodName,error){
    upAlert(showJSTxt(utilJSTxt,1)+"：“"+methodName+"”，"+showJSTxt(utilJSTxt,2)+"："+error,"red");
}

/***************************
 * 保存文件到本地
 * @param listName
 * @param list
 */
function saveList(listName, list){
    try {
        localStorage[listName]=JSON.stringify(list);
    } catch (e) {
        setError("saveList", e);
    }
}

/*******************************************
 * 功能：根据字符串名字查找本地数据 参数:name-->字符串名字 返回值：一个对象数组
 */
function returnList(name){
    try {
        var bool="false";
        var list=new Array();
        for(var i=0;i<100; i++){
            if(localStorage.key(i)==name){
                bool="true";
            }
        }
//		var gParam=localStorage.getItem(name);
//		if(gParam!=null){
//			bool=true;
//		}else{
//			bool=false;
//		}
        if(bool=="true"){
            try{
                list=JSON.parse(localStorage.getItem(name));
            }catch(e){
                list=null;
            }
            return list;
        }else{
            return null;
        }
    } catch (e) {

        setError("returnList",e);
    }
}


/************************************
 * 获取对象数组最小的空闲ID list:窗口数组  num :获取序号的类型 "num"=窗口号 "sc"=物理屏号
 * @param list
 * @param num
 * @returns {Number}
 */
function getId(list,num) {
    try {
        if(list==null||list.length==0){
            return 1;
        }//
        /**********************************************
         * @time 2016-10-12
         * @mes 优化获取唯一的ID/序号功能
         */
        var map={};
        var l=list.length;
        var intNum=null;
        for(var i=0; i<l; i++){
            if(num==null){
                intNum=parseInt(list[i].id);
            }else if(num=="num"){
                intNum=parseInt(list[i].num);
            }else if(num=="sc"){
                intNum=parseInt(list[i].sc);
            }
            if(isNaN(intNum)){
                continue;
            }
            map["id"+intNum]=intNum;
        }
        var id = 0;
//		showMes("map:"+JSON.stringify(map));
        for(var i=0;i<l;i++){
            id++;
//			showMes("mapid:"+id+"  val:"+map["id"+id]);
            if(map["id"+id]==null){

                break;
            }
            if(i==l-1){
                l++;
            }
        }
        return id;
    } catch (e) {
        setError("getId",e);
    }
}

/***************************************
 *  判断是不是Google浏览器
 * @param url
 * @param type
 */
function isGoogle(url ,type){

    var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
    if (isChrome) {
        if(type==null){
            window.open("./"+url,"_self");
        }else{
            window.open("../"+url,"_self");
        }

    } else {
        var ht=sessionStorage.getItem("thisHtml");
        if(ht!=null){
            if(ht=="index"){
                window.open("./"+url,"_self");
            }else{
                window.open("../"+url,"_self");
            }
        }else{
            window.open("../"+url,"_self");
        }
    }
}
/********************************************
 * 判断是否是IE浏览器
 * @returns {Boolean}
 */
function $ig(){
    try {
        var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
        if(isChrome){
            return true;
        }else{
            return false;
        }
    } catch (e) {
        alertError("$ig",e);
    }
}


/***************************************************************************
 * 根据参数显示在消示框
 *
 * @param mes
 * @param color
 */
// function showMes(mes,color){
//	 var ht=sessionStorage.getItem("thisHtml");
////	 var myDate = new Date();//
////	 var thisTime=" &nbsp;"+showJSTxt(jsTxt,48)+myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()+" "+myDate.getHours()+
////		":"+myDate.getMinutes()+":"+myDate.getSeconds();//当前时间
//	 if(ht!=null&&ht=="index"){
//		var id="ccc";
//		var width=($("#mes_Item").css("width")!=null)?parseInt($("#mes_Item").css("width").split("px")[0])-20:"400";
//	//	$("#"+id).append("<span style='display:inline-block;min-height:20px; line-height:20px; word-wrap : break-word ; color:"+color+"; width:400px;'>"+thisTime+" " +mes+"</span>");
//		$("#"+id).append("<span style='display:inline-block;min-height:20px; line-height:20px; word-wrap : break-word ; color:"+color+"; min-width:400px; width:"+width+"px;'>"+mes+"</span>");
//		var div = document.getElementById("mes_Item");
//		if(div!=null){
//			div.scrollTop = div.scrollHeight;	
//		}else{
//			 div = document.getElementById("ccc");
//			 if(div!=null){
//				 div.scrollTop = div.scrollHeight;
//			 }
//			
//		}
//		
//	 }
// }


/***************************************************************************
 * 获取输出文件最大的坐标
 * @param list
 */
function getMax(list,type){
    try {
        var obj =new Object();
        obj.x=0;
        obj.y=0;
        if(list!=null){
            for(var i=0;i<list.length;i++){

                if(type!=null&&type=="design"){
                    if(list[i].mx2>obj.x){
                        obj.x=list[i].mx2;
                    }
                }else{
                    if(list[i].x2>obj.x){
                        obj.x=list[i].x2;
                    }
                }
                if(type!=null&&type=="design"){
                    if(list[i].my2>obj.y){
                        obj.y=list[i].my2;
                    }
                }else{
                    if(list[i].y2>obj.y){
                        obj.y=list[i].y2;
                    }
                }
            }
            return obj;
        }else{
            return null;
        }
    } catch (e) {

        showMes("getMax method error:"+e);
    }
}
/***************************************************************************
 * 获取输出文件最小的坐标
 *
 * @param list
 */
function getMin(list,type){
    try {
        var obj =null;
        if(list!=null){
            for(var i=0;i<list.length;i++){
                if(list[i].id==9999){
                    continue;
                }
                if(obj==null){
                    obj=new Object();
                    if(type!=null&&type=="design"){
                        obj.x=list[i].mx1;
                        obj.y=list[i].my1;
                    }else{
                        obj.x=list[i].x1;
                        obj.y=list[i].y1;
                    }
                }else{
                    if(type!=null&&type=="design"){
                        if(list[i].mx1<obj.x){
                            obj.x=list[i].mx1;
                        }
                    }else{
                        if(list[i].x1<obj.x){
                            obj.x=list[i].x1;
                        }
                    }
                    if(type!=null&&type=="design"){
                        if(list[i].my1<obj.y){
                            obj.y=list[i].my1;
                        }
                    }else{
                        if(list[i].y1<obj.y){
                            obj.y=list[i].y1;
                        }
                    }
                }

            }
            return obj;
        }else{
            return null;
        }
    } catch (e) {

        showMes("getMin method error:"+e);
    }
}

// 根据比例生成对应的对象
function initObj(list,width,heigth){
    var canvas=document.getElementById(LK_CANVAS);
    var canW=canvas.clientWidth;
    var canH=canvas.clientHeight;
    var wTimes=width/canW;
    var hTimes=heigth/canH;
    for(var i=0;i<list.length;i++){
        list[i].x1=parseFloat(list[i].x1)*wTimes;
        list[i].y1=parseFloat(list[i].y1)*hTimes;
        list[i].x2=parseFloat(list[i].x2)*wTimes;
        list[i].y2=parseFloat(list[i].y2)*hTimes;
    }
    localStorage['ouputXml']=JSON.stringify(list);
}
var strMesType=0;// 发送字符串状态
var bigFile="";// 发送的文件
var fileSize=0;// 文件大小
var toLength=30000;// 每一次发送的长度
var allNum=0;// 总共多少次
var inNum=1;// 第几次
var pStr="";
var code={one:"",tow:"",three:"",four:"",type:"",num:""};
var thisSocket=null;
function clearData(){
    strMesType=0;// 发送字符串状态
    bigFile="";// 发送的文件
    fileSize=0;// 文件大小
    allNum=1;// 总共多少次
    inNum=1;// 第几次
    pStr="";

    code={one:"",tow:"",three:"",four:"",type:"",num:""};

}



/*********************************
 * 发送配置文件
 */
function sendBigFile(){
    try {
        var bigFileStr=code.one+code.tow+code.three+code.four+code.type+code.num+zh(allNum)+zh(inNum);
        var sf="";
        st=1;
        if(objCT!=null){
            clearTimeout(objCT);
        }
        objCT=setTimeout("checkTime()", 1000);
        bigFile=(bigFile==null)?"":bigFile;//2016/5/7处理空文件
        if(inNum==1){
            sf=bigFile.substring((inNum-1)*toLength,toLength);
            if(sf.length==0){
                bigFileStr+="@";
            }else{
                bigFileStr+="@"+fileSize+"/"+pStr+sf;
            }
        }else{
            sf=bigFile.substr((inNum-1)*toLength,toLength);
            bigFileStr+="@"+sf;
        }//

        var ht= sessionStorage.getItem("thisHtml");
        if(code.type=="03"&&code.num=="02"){//2016/3/30 添加搜索协议功能
            bigFileStr+=$("#seach_type").val();//发送搜索类型
        }
//		alert("类型："+code.type+"文件："+code.num+" 总次："
//				 +allNum+" 第几次："+inNum+"长度："+bigFile.length+" 文件："+bigFileStr,"red");
        if(ht=="index"){
//		showMes("类型："+code.type+"文件："+code.num+" 总次："
//				 +allNum+" 第几次："+inNum+"长度："+bigFile.length+" 文件："+bigFileStr,"red");
        }else if(ht="18"){
//			if(code.num==1){
//				alert(bigFileStr);
//			}
            // $("#setMes").append("<p style='color:red;'>类型："+code.type+"
            // 文件："+code.num+" 总次："+allNum+" 第几次："+inNum+"
            // 长度："+bigFile.length+"</P>"); 
        }
//		 showMes("开始发送："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"green");
        thisSocket.send(bigFileStr);
//		 showMes("发送："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"green");

    } catch (e) {
        // TODO: handle exception
        alertError("sendBigFile",e);
    }
}

/**********************************
 * 根据坐标大小排序
 * @param paramObj
 */
function sortWindow(paramObj){
    try {
        var newObj=new Object();
        newObj.id=paramObj.id;
        newObj.st=paramObj.st;
        newObj.cl=paramObj.cl;
        newObj.pp="";
        newObj.up="";
        var list=paramObj.pp.split(";");
        var list2=paramObj.up.split(";");
        var no=null;
        var no2=null;
        //从新根据窗口的坐标从上到下，从左到右排序
        for(var i=0;i<list.length;i++){
            for(var j=i;j<list.length;j++){
                var win=list[i].split(",");
                var win2=list[j].split(",");
                win[3]=parseInt(win[3]);
                win2[3]=parseInt(win2[3]);
                win[2]=parseInt(win[2]);
                win2[2]=parseInt(win2[2]);
                if(((win[3]==win2[3]||win[3]+1>win2[3])&&win[2]>win2[2])||
                    (win[3]+1>win2[3]&&win[3]-1>win2[3])){
                    no=list[i];
                    list[i]=list[j];
                    list[j]=no;
                    no2=list2[i];
                    list2[i]=list2[j];
                    list2[j]=no2;
                }


//						if(((win[3]+1)>win2[3]&&win[3]!=win2[3])||
//							((win[3]+1)<win2[3]&&(win[3]-1)>win2[3]&&(win[2]+1)>win2[2])){
//							
//						}
            }
        }
        for(var i=0;i<list.length;i++){
            if(i==0){
                newObj.pp+=list[i];
                newObj.up+=list2[i];
            }else{
                newObj.pp+=";"+list[i];
                newObj.up+=";"+list2[i];
            }
        }
        return newObj;
    } catch (e) {
        alertError("sortWindow",e);
    }
}


/***************************************************************************
 * 根据名称和数组按需要保留数据
 * @param name  String
 * @param list  Array
 * @param type  String
 * @returns list  Array
 */
function replaceList(name,li,type){
    try {
        var li_length=0;
        var li_file_length=0;
        if(li!=null){
            li_length=li.length;
            li_file_length=JSON.stringify(li).length;
        }
//		 showMes("文件名称："+name+"  文件对象长度："+li_length+" 文件字符长度："+li_file_length,"red");
//		 var endNum=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//		showMes(name+"运算开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"green");
        var newList=new Array();
        var newObj=null;
        if(li==null){
            return;
        }
//		showMes("转变前:"+JSON.stringify(li),"red");
        if(name=="output"){
            if(type==null){
                //发送数据的时候转换整数
                for(var i=0;i<li.length;i++){
                    if(li[i].num!=null){
                        li[i].num=parseInt(li[i].num);
                    }
                }
            }

            if((li[0].mt!=null&&li[0].mt==1)||(li[0].pp!=null)){//自定义模式下转换
//			 	showMes("转换","black");
                if(type==null){
//			 			 var endNum2=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//						 showMes(name+"运算开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算2："+(endNum2-endNum),"green");
                    li=update_winXY(li);//解决误差坐标
//			 			 var endNum3=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//						 showMes(name+"运算开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算3："+(endNum3-endNum),"green");
//			 			showMes("准备获取物理屏："+JSON.stringify(li),"blue");
                    var list=restore(li);
//			 			 var endNum4=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//						 showMes(name+"运算开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算4："+(endNum4-endNum),"green");
//			 			showMes("获取物理屏："+JSON.stringify(list),"red");
//			 			showMes("list:"+JSON.stringify(li),"red");
                    //showMes("list:"+list[i]);
                    var tw_num=0;//每个窗口的窗口号
                    var tw_id=0;//每个窗口的ID号
//			 			var tw_sc=0;//每个窗口的物理屏号
                    for(var i=0;i<list.length;i++){
                        if(list[i].active==1){
                            /**********************
                             *转换漫游画中画数据
                             */
                            var mw=0;//漫游的总宽
                            var mh=0;//漫游的总高
                            var hn=0;//几行
                            var wn=0;//几列
                            var minXY=null;//最小值
                            var maxXY=null;//最大值
                            var zk=0;//总高
                            var zg=0;//总宽
                            var mlist=new Array();
                            for(var j=0;j<list.length;j++){//获取跟当前框有重叠的物理屏窗口
                                if(checkOverlap(list[i].x1+0.1,list[i].y1+0.1,list[i].x2-0.1,list[i].y2-0.1
                                        ,list[j].x1,list[j].y1,list[j].x2,list[j].y2)&&list[j].active==0){
                                    mlist.push(list[j]);
                                }
                            }
                            for(var j=0;j<li.length;j++){
                                if(list[i].id==li[j].sc){
                                    tw_num=li[j].num;
                                    tw_id=li[j].id;
//			 							tw_sc=li[j].sc;
                                }
                            }
                            minXY=getMin(mlist);//计算最小值
                            maxXY=getMax(mlist);//计算最大值
//			 					showMes("mlist:"+JSON.stringify(mlist));
                            for(var j=0;j<mlist.length;j++){
                                cline=1;
                                if(mlist[j].active==0){
                                    if(checkLine(minXY.x,null,mlist[j].x1,null)){
                                        hn++;
                                        mh+=dwh;
                                    }
                                    if(checkLine(minXY.y,null,mlist[j].y1,null)){
                                        wn++;
                                        mw+=dwh;
                                    }
                                }
                            }
                            var in_num=0;//标识函数
                            var mbx=0;//开始X坐标
                            var mby=0;//开始Y坐标
                            for(var j=0;j<list.length;j++){
                                if(list[i].id!=list[j].id){
                                    //调用返回重叠部分的方法
                                    var cObj=returnOverlap(list[i].x1,list[i].y1,list[i].x2,list[i].y2,
                                        list[j].x1,list[j].y1,list[j].x2,list[j].y2,list[j].id);
                                    if(cObj!=null){
                                        //把重叠的窗口运算成坐标点
                                        in_num++;
//					 						showMes("cObj:"+JSON.stringify(cObj),"blue");
                                        newObj=new Object();
                                        newObj.id=parseInt(cObj.id);//物理屏有ID号
                                        newObj.st=3;//物理屏状态
                                        newObj.cl=0;//是否是双击状态
                                        zk=dwh/(list[j].x2-list[j].x1);
                                        zg=dwh/(list[j].y2-list[j].y1);
//								 			showMes("dwh:"+dwh+" x1:"+list[j].mx1+" y1:"+list[j].my1+" x2:"+list[j].mx2+
//								 					" y2:"+list[j].my2+" hn:"+hn+" wn:"+wn+" mw:"+mw+" mh:"+mh+" zk:"+zk+" zg:"+zg,"black");
                                        var winx1=0;
                                        var winy1=0;
                                        var winx2=0;
                                        var winy2=0;
                                        var winw=0;
                                        var winh=0;
                                        var scox=0;
                                        var scoy=0;
                                        var scow=0;
                                        var scoh=0;
                                        winx1=((cObj.x1-list[j].x1)*zk);//漫游窗口相对坐标X1
                                        winy1=((cObj.y1-list[j].y1)*zg);//漫游窗口相对坐标Y1
                                        winx2=((cObj.x2-list[j].x1)*zk);//漫游窗口相对坐标X2
                                        winy2=((cObj.y2-list[j].y1)*zg);//漫游窗口相对坐标Y2
                                        winw=(list[i].x2-list[i].x1)*(mw/(maxXY.x-minXY.x));
                                        winh=(list[i].y2-list[i].y1)*(mh/(maxXY.y-minXY.y));
                                        scox=(cObj.x1-list[i].x1)/(list[i].x2-list[i].x1);
                                        scoy=(cObj.y1-list[i].y1)/(list[i].y2-list[i].y1);
                                        scow=(cObj.x2-cObj.x1)/(list[i].x2-list[i].x1);
                                        scoh=(cObj.y2-cObj.y1)/(list[i].y2-list[i].y1);
                                        winw=(isNaN(winw)==false)?winw:0;//2016/6/2 限定只能传数字
                                        winh=(isNaN(winh)==false)?winh:0;//2016/6/2 限定只能传数字
                                        scox=(isNaN(scox)==false)?scox:0;//2016/6/2 限定只能传数字
                                        scoy=(isNaN(scoy)==false)?scoy:0;//2016/6/2 限定只能传数字
                                        scow=(isNaN(scow)==false)?scow:0;//2016/6/2 限定只能传数字
                                        scoh=(isNaN(scoh)==false)?scoh:0;//2016/6/2 限定只能传数字
                                        newObj.pp=tw_id+","+tw_num+","+winx1+","
                                            +winy1+","+winx2+","+winy2+","+winw+","+winh+
                                            ","+scox+","+scoy+","+scow+","+scoh;//物理屏属性
                                        newObj.up=list[i].x1+","+list[i].y1+","+list[i].x2+","+list[i].y2;//客户端屏属性
                                        newList.push(newObj);
                                        if(in_num%wn!=0){
                                            mbx+=dwh;
                                        }else{
                                            mbx=0;
                                            mby+=dwh;
                                        }
                                    }
                                }
                            }
                            //showMes("newObj："+JSON.stringify(newObj));
                            continue;
                        }
                        newObj=new Object();
                        newObj.id=parseInt(list[i].id);//物理屏有ID号
                        newObj.st=0;//物理屏状态
                        newObj.cl=0;//是否是双击状态
                        newObj.pp="";//物理屏属性
                        newObj.up="";//客户端属性
                        for(var j=0;j<li.length;j++){
                            if(li[i].type==100){
                                newObj.cl=1;
                            }
                            /*************************
                             * 底层窗口
                             */
                            if(list[i].id==li[j].sc&&li[j].w==dwh&&li[j].h==dwh){//未拆分未合并的窗口
                                newObj.pp=""+li[j].id+","+li[j].num;
                                newObj.up=""+li[j].mx1+","+li[j].my1+","+li[j].mx2+
                                    ","+li[j].my2;
                            }else if(list[i].id==li[j].sc&&(li[j].w>dwh||li[j].h>dwh)){//合并的窗口
                                newObj.st=1;
                                var num=0;
                                var id=0;
                                var up="";
                                if(li[j].num==9999){
                                    id=li[j].st;
                                    for(var is=0;is<li.length;is++){
                                        if(id==li[is].id){
                                            num=li[is].num;
                                            up=""+li[is].mx1+","+li[is].my1+","+li[is].mx2+
                                                ","+li[is].my2;
                                        }
                                    }
                                }else{
                                    id=li[j].id;
                                    num=li[j].num;
                                    up=""+li[j].mx1+","+li[j].my1+","+li[j].mx2+
                                        ","+li[j].my2;
                                }
                                newObj.pp=id+","+num+","+li[j].x1+","+li[j].y1+
                                    ","+li[j].x2+","+li[j].y2+","+li[j].w+","+li[j].h;
                                newObj.up=up;
                            }else if(list[i].id==li[j].sc&&(li[j].w<dwh||li[j].h<dwh)){//拆分的窗口
                                newObj.st=2;
                                if(newObj.pp!=""){
                                    newObj.pp+=";";
                                    newObj.up+=";";
                                }
                                if(li[j].w==0&&li[j].h==0&&li[j].mx2!=0&&li[j].my2!=0){
                                    newObj.pp=li[j].id+","+li[j].num;
                                    newObj.up=li[j].mx1+","+li[j].my1+","+li[j].mx2+
                                        ","+li[j].my2+","+li[j].w+","+li[j].h;
                                    newObj.st=0;//物理屏状态
                                }else{
                                    newObj.pp+=li[j].id+","+li[j].num+","+li[j].x1+","+li[j].y1+
                                        ","+li[j].x2+","+li[j].y2;
                                    newObj.up+=li[j].mx1+","+li[j].my1+","+li[j].mx2+
                                        ","+li[j].my2;
                                }
                            }
                        }
                        if(newObj.st==2){//每个拆分窗口进行排序
//				 				showMes("newObj:"+JSON.stringify(newObj),"red");
                            newObj=sortWindow(newObj);
//				 				showMes("newObj:"+JSON.stringify(newObj),"blue");
                        }
                        newList.push(newObj);
                    }
                }else if(type=="get"){
                    var in_win=null;//物理屏ID数组
                    var in_win_obj=null;//物理屏ID函数
                    for(var i=0;i<li.length;i++){
                        if(in_win==null){
                            in_win=new Array();
                            in_win_obj=new Object();
                            in_win_obj.id=li[i].id;
                            in_win_obj.type=0;//物理屏类型，0=真是物理屏 3=虚拟物理屏
                            in_win_obj.wId=0; //虚拟物理屏ID号：0=真实物理屏没有虚拟物理屏ID号。其他任意数字为虚拟物理屏的ID号
                            in_win.push(in_win_obj);
                        }else{
                            var in_win_bool=true;//已经存在的物理屏ID
                            for(var j=0;j<in_win.length;j++){
                                if(li[i].id==in_win[j].id){
                                    in_win_bool=false;
                                }
                            }
                            if(in_win_bool){
                                in_win_obj=new Object();
                                in_win_obj.id=li[i].id;
                                in_win_obj.type=0;
                                in_win_obj.wId=0;
                                in_win.push(in_win_obj);
                            }
                        }
                    }
//			 			showMes("in_win:"+JSON.stringify(in_win));
                    for(var i=0;i<li.length;i++){
                        newObj=new Object();
                        if(li[i].st==0){
                            //原生未操作情况下窗口
                            try {
                                newObj.id=parseInt(li[i].pp.split(",")[0]);
                                newObj.num=parseInt(li[i].pp.split(",")[1]);
                                newObj.sc=li[i].id;
                                newObj.x1=0;
                                newObj.y1=0;
                                newObj.x2=dwh;
                                newObj.y2=dwh;
                                newObj.w=dwh;
                                newObj.h=dwh;
                                newObj.mt=1;
                                newObj.st=parseInt(li[i].pp.split(",")[0]);
                                newObj.mx1=parseFloat(li[i].up.split(",")[0]);
                                newObj.my1=parseFloat(li[i].up.split(",")[1]);
                                newObj.mx2=parseFloat(li[i].up.split(",")[2]);
                                newObj.my2=parseFloat(li[i].up.split(",")[3]);
                                newObj.lineWidth=1;
                                newObj.fillColor="black";
                                newObj.strokeColor="white";
                                newObj.active=0;
                                newObj.type=0;
                                newList.push(newObj);
                            } catch (e) {

                                showMes("转换错误1:"+e);
                            }
                        }else if(li[i].st==1){
                            //合并窗口
                            try{

                                var mx1=0;
                                var my1=0;
                                var mx2=0;
                                var my2=0;
                                if(li[i].pp.split(",")[2]==0&&li[i].pp.split(",")[3]==0){
                                    newObj.id=parseInt(li[i].pp.split(",")[0]);
                                    newObj.num=parseInt(li[i].pp.split(",")[1]);
                                    mx1=parseFloat(li[i].up.split(",")[0]);
                                    my1=parseFloat(li[i].up.split(",")[1]);
                                    mx2=parseFloat(li[i].up.split(",")[2]);
                                    my2=parseFloat(li[i].up.split(",")[3]);
                                }else{
                                    mx1=0;
                                    my1=0;
                                    mx2=0;
                                    my2=0;
                                    newObj.id=9999;
                                    newObj.num=9999;
                                }
                                newObj.sc=li[i].id;
                                newObj.x1=parseFloat(li[i].pp.split(",")[2]);
                                newObj.y1=parseFloat(li[i].pp.split(",")[3]);
                                newObj.x2=parseFloat(li[i].pp.split(",")[4]);
                                newObj.y2=parseFloat(li[i].pp.split(",")[5]);
                                newObj.w=parseFloat(li[i].pp.split(",")[6]);
                                newObj.h=parseFloat(li[i].pp.split(",")[7]);
                                newObj.mt=1;
                                newObj.st=li[i].pp.split(",")[0];
                                newObj.mx1=mx1;
                                newObj.my1=my1;
                                newObj.mx2=mx2;
                                newObj.my2=my2;
                                newObj.lineWidth=1;
                                newObj.fillColor="black";
                                newObj.strokeColor="white";
                                newObj.active=0;
                                newObj.type=0;
                                newList.push(newObj);
                            } catch (e) {

                                showMes("转换错误2:"+e);
                            }
                        }else if(li[i].st==2){
                            //拆分窗口
                            try{
                                var pps=li[i].pp.split(";");
                                var ups=li[i].up.split(";");
//			 					showMes("pps:"+pps.length+" ups:"+ups.length,"red");
//			 					showMes("pps:"+JSON.stringify(pps));
//			 					showMes("ups:"+JSON.stringify(ups));
                                if(pps.length==ups.length){
                                    for(var j=0;j<pps.length;j++){
//			 							showMes("id:"+pps[j].split(",")[0]+" num:"+pps[j].split(",")[0]);
                                        newObj=new Object();
                                        newObj.id=parseInt(pps[j].split(",")[0]);
                                        newObj.num=pps[j].split(",")[1];
                                        newObj.sc=li[i].id;
                                        newObj.x1=parseFloat(pps[j].split(",")[2]);
                                        newObj.y1=parseFloat(pps[j].split(",")[3]);
                                        newObj.x2=parseFloat(pps[j].split(",")[4]);
                                        newObj.y2=parseFloat(pps[j].split(",")[5]);
                                        newObj.w=newObj.x2-newObj.x1;
                                        newObj.h=newObj.y2-newObj.y1;
                                        newObj.mt=1;
                                        newObj.st=li[i].id;
                                        newObj.mx1=parseFloat(ups[j].split(",")[0]);
                                        newObj.my1=parseFloat(ups[j].split(",")[1]);
                                        newObj.mx2=parseFloat(ups[j].split(",")[2]);
                                        newObj.my2=parseFloat(ups[j].split(",")[3]);
                                        newObj.lineWidth=1;
                                        newObj.fillColor="black";
                                        newObj.strokeColor="white";
                                        newObj.active=0;
                                        newObj.type=0;
                                        newList.push(newObj);
                                    }
                                }
                            } catch (e) {

                                showMes("转换错误3:"+e);
                            }
                        }else if(li[i].st==3){
                            try {
                                var bool=true;
                                for(var j=0;j<in_win.length;j++){//判断新添加的虚拟物理屏是否存在，如果存在就不需要添加了
                                    if(in_win[j].wId==parseInt(li[i].pp.split(",")[0])&&in_win[j].type==li[i].st){
                                        bool=false;
                                        break;
                                    }
                                }
//				 					showMes("bool:"+bool+" li[i].id:"+li[i].id+"  li[i].st:"+li[i].st);
                                if(bool){
                                    //存放新的漫游画中画窗口
                                    newObj.id=parseInt(li[i].pp.split(",")[0]);
                                    newObj.num=parseInt(li[i].pp.split(",")[1]);
                                    var newSc=getId(in_win);
                                    in_win.push({"id":newSc,"type":3,"wId":newObj.id});
                                    newObj.sc=newSc;
                                    newObj.x1=0;
                                    newObj.y1=0;
                                    newObj.x2=420;
                                    newObj.y2=420;
                                    newObj.w=420;
                                    newObj.h=420;
                                    newObj.mt=1;
                                    newObj.st=parseInt(li[i].pp.split(",")[0]);
                                    newObj.mx1=parseFloat(li[i].up.split(",")[0]);
                                    newObj.my1=parseFloat(li[i].up.split(",")[1]);
                                    newObj.mx2=parseFloat(li[i].up.split(",")[2]);
                                    newObj.my2=parseFloat(li[i].up.split(",")[3]);
                                    newObj.lineWidth=1;
                                    newObj.fillColor="black";
                                    newObj.strokeColor="white";
                                    newObj.active=1;
                                    newObj.type=0;
                                    newList.push(newObj);
                                }
                            } catch (e) {
                                setError("转换漫游窗口数据出错", e);
                            }

                        }
                    }
                    for(var i=0;i<newList.length;i++){
                        if(isNaN(newList[i].num)){
                            newList[i].num=getId(newList,"num");
                        }
                    }
                }

                //	showMes("newList:"+JSON.stringify(newList),"red");
            }else{//标准模式下转换
                if(type=="get"){
                    newList= zhuanhuan(li);//调用转换方法
//			 			showMes("newList:"+JSON.stringify(newList),"red");	 
                }else{
                    for(var i=0;i<li.length;i++){
                        newObj=new Object();
                        newObj.id=li[i].id;
                        if(li[i].num==null){
                            newObj.num=li[i].id;
                        }else{
                            newObj.num=li[i].num;
                        }
                        newObj.x1=li[i].x1;
                        newObj.y1=li[i].y1;
                        newObj.x2=li[i].x2;
                        newObj.y2=li[i].y2;
//							 if(type=="get"){
//								newObj.lineWidth=1;
//								newObj.fillColor="black";
//								newObj.strokeColor="white";
//							 }
                        newObj.active=li[i].active;
                        newObj.type=li[i].type;
                        newList.push(newObj);
                    }
                }

            }

            if(newList.length>0){
//			 		 var endNum9=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//					 showMes(name+"运算线束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算9："+(endNum9-endNum),"green");
//			 		showMes("转换后:"+JSON.stringify(newList),"black");
                return newList;
            }else{
                newList=new Array();
            }
        }else if(name=="decoder"){
            var a=1;
            for ( var i = 0; i < li.length; i++) {
                newObj=new Object();
                newObj.id=parseInt(li[i].id);
                if(li[i].num==null||li[i].num==""||li[i].num==0){
                    var number=0;
                    var maxNum=0;
                    for(var j=0;j<li.length;j++){
                        if(li[j].num!=0&&li[j].num>0&&li[j].num>maxNum){
                            maxNum=li[j].num;
                        }
                    }
                    for(var j=0;j<li.length;j++){
                        if(li[j].num==maxNum){
                            if(li[j].gn!=null&&li[j].gn!=""&&li[j].gn!=0){
                                number=li[j].num+li[j].gn;
                            }else{
                                number=li[j].num+1;
                            }
                        }
                    }
                    newObj.num= number;
                    li[i].num=number;

                }else{
                    newObj.num=parseInt(li[i].num);
                }
                newObj.name=li[i].name;
                newObj.typeName=li[i].typeName;

                if(type=="get"){
                    newObj.type=4;//默认
                    for(var j=0;j<inputTypeList.length;j++){//通过名称获取类型ID
                        if(li[i].typeName==inputTypeList[j].name){
                            newObj.type=inputTypeList[j].id;
                        }
                        if(li[i].typeName=="XM(NVR,DVR)"){//兼容旧版本
                            newObj.type=5;
                        }

                    }
                }
                if(li[i].typeName=="TVT(NVR,DVR)"){
                    newObj.typeName="TVT(3.0 NVR,DVR)";
                    newObj.type=27;
                }
                newObj.group=li[i].group;
                newObj.location=li[i].location;
                newObj.gn=parseInt(li[i].gn);
                newObj.port=li[i].port;
                newObj.stream=li[i].stream;
                newObj.userName=li[i].userName;
                newObj.password=li[i].password;
                newObj.remark=li[i].remark;
                newObj.time= parseInt(li[i].time);
                newObj.fond=li[i].fond;
                newObj.fondColor=li[i].fondColor;
                newObj.fondSize=li[i].fondSize;
                newObj.show=parseInt(li[i].show);
                if(li[i].grName==null){
                    var grNum=newObj.gn;
                    if(grNum!=0&&grNum!=null&&grNum!=""){
                        newObj.grName=getNumberStr(grNum);
                    }else{
                        newObj.grName="";
                    }
                }else{
                    newObj.grName=li[i].grName;
                }
                if(li[i].ad==null){
                    newObj.ad=0;
                }else{
                    newObj.ad=li[i].ad;
                }
                newList.push(newObj);
                var bool=checkInputType(li[i].type);
                if(bool==true){
                    a=a+li[i].gn+1	;
                }else{
                    a=a+1;
                }
            }
        }else if(name=="ifo"){
            newList=new Array();
            newObj=null;
            var lis=returnList("decoderList");
            for(var i=0;i<li.length;i++){
                newObj=new Object();
                newObj.id=li[i].id;
                newObj.outputId=li[i].outputId;
                newObj.inputId=li[i].inputId;
                if(type=="get"){

                    if(lis!=null){
                        for(var j=0;j<lis.length;j++){
                            if(lis[j].id==li[i].inputId){
                                newObj.inputName=lis[j].name;
                            }
                        }
                    }else{
                        newObj.inputName="";
                    }
                }
                if(li[i].longTime==0&&(li[i].beginTime==""||li[i].beginTime==null)){
                    newObj.longTime=1;
                }else{
                    newObj.longTime=li[i].longTime;
                }
                newObj.beginTime=li[i].beginTime;
                newObj.endTime=li[i].endTime;
                try{
                    if(li[i].gn==null){
                        newObj.gn=null;
                    }else{
                        if(li[i].gn==""){
                            newObj.gn=null;
                        }else if(li[i].gn.toString().indexOf("n")==-1){
                            newObj.gn=parseInt(li[i].gn);
                        }else{
                            newObj.gn=parseInt(li[i].gn.substr(1));
                        }

                    }
                }catch (e) {

                    // showMes("对应关系失败","red");
                }

                newList.push(newObj);
            }
            if(type=="get"){
                newList=updateIFO(newList);
            }

        }else if(name=="moder"){
            var outputs=null;
            var output=null;
            for(var i=0;i<li.length;i++){
                newObj=new Object();
                newObj.id=parseInt(li[i].id);
                newObj.name=li[i].name;
                newObj.isShow=li[i].isShow;
                newObj.width=li[i].width;
                newObj.height=li[i].height;
                var o_list=li[i].outputList;
                if((o_list[0].mt!=null&&o_list[0].mt==1)||o_list[0].pp!=null){
                    if(type!=null&&type=="get"){
                        newObj.outputList=replaceList("output",o_list,"get");
                    }else{
                        newObj.outputList=replaceList("output",o_list);
                    }
                }else{
                    if(type!=null&&type=="get"){
                        sessionStorage.setItem("ts_s",newObj.isShow);//保存当前模式的初始化设置
                        localStorage.setItem("moUpdate",1);
//							 showMes("第"+(i+1)+"个输出文件转换前长度"+o_list.length,"#890DEC");
//							 showMes("第"+li[i].id+"个输出文件前："+JSON.stringify(o_list),"red");
                        outputs=replaceList("output",o_list,"get");
//							 showMes("第"+(i+1)+"个输出文件转换后长度"+outputs.length,"#890DEC");	
//							 showMes("第"+li[i].id+"个输出文件后："+JSON.stringify(outputs),"blue");
                    }else{
                        outputs=new Array();
                        for(var j=0 ; j<o_list.length;j++){
                            output=new Object();
                            output.id=o_list[j].id;
                            if(o_list[j].num==null){
                                output.num=o_list[j].id;
                            }else{
                                output.num=o_list[j].num;
                            }
                            output.x1=o_list[j].x1;
                            output.y1=o_list[j].y1;
                            output.x2=o_list[j].x2;
                            output.y2=o_list[j].y2;
                            if(type!=null&&type=="get"){
                                output.lineWidth=1;
                                output.fillColor="black";
                                output.strokeColor="white";
                                output.active=0;
                            }
                            output.type=o_list[j].type;
                            outputs.push(output);
                        }
                    }
                    newObj.outputList=outputs;
                }
                if(type!=null&&type=="get"){
                    newObj.IFOlist=replaceList("ifo",li[i].IFOlist,"get");
//							 showMes("第"+li[i].id+"个对应关系文件："+JSON.stringify(newObj.IFOlist),"black");
                }else{
                    newObj.IFOlist=replaceList("ifo",li[i].IFOlist);
                }
                newList.push(newObj);
            }
//				showMes("模式文件："+JSON.stringify(newList),"black");
        }else if(name=="caution"){
            for ( var i = 0; i < li.length; i++) {
                newObj=new Object();
                newObj.id=parseInt(li[i].id);//警点id
                newObj.tp=parseInt(li[i].tp);//警点类型
                newObj.wi=parseInt(li[i].wi);//警点窗口号ID号
                newObj.ii=parseInt(li[i].ii);//警点输入源ID号
                newObj.mi=parseInt(li[i].mi);//警点模式ID号
                newObj.oi=parseInt(li[i].oi);//警点输出口号
                newObj.gi=parseInt(li[i].gi);//警点输入源通道号
                newObj.dt=parseInt(li[i].dt);//警点打开状态
                newObj.to="";
                newObj.tc="";
                if(li[i].to!=null){
                    newObj.to=li[i].to;
                    if(newObj.to.split(":").length==3){
                        newObj.to=newObj.to.split(":")[0]+":"+newObj.to.split(":")[1];
                    }
                }

                if(li[i].tc!=null){
                    newObj.tc=li[i].tc;
                    if(newObj.tc.split(":").length==3){
                        newObj.tc=newObj.tc.split(":")[0]+":"+newObj.tc.split(":")[1];
                    }
                }
                //newObj.cl=parseInt(li[i].cl);
                if(type!=null&&type=="get"){
                    newObj.er=0;
                    var dl=returnList("caution");
//						var decoder=returnList("decoderList");
//						if(decoder!=null){//修改配置状态
//							for(var j=0;j<decoder.length;j++){
//								if(decoder[j].id==newObj.ii&&(decoder[j].gn==null||
//									decoder[j].gn==""||decoder[j].gn==0)){
//									newObj.gi=0;
//									localStorage.setItem("cautionType",1);
//								}
//							}
//						}
                    if(dl!=null){
                        for(var j=0;j<dl.length;j++){
                            if(dl[j].id==li[i].id){
                                if(dl[j].er!=null){
                                    newObj.er=dl[j].er;
                                }

                            }
                        }
                    }
                    var list=returnList("ints");
                    if(list!=null){
                        for(var j=0;j<list.length;j++){
                            if(li[i].id==list[j]){
                                newObj.er=1;
                            }
                        }
                    }
                }
                newList.push(newObj);
            }
        }
//		 var endNum10=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//		 showMes(name+"运算线束："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算10："+(endNum10-endNum),"green");
        //showMes("转变后:"+JSON.stringify(newList),"red");
        return newList;

    } catch (e) {
        setError("replaceList",e);
    }
}

/*
 * 发送文件到服务器保存
 * 
 */
function sendJSONForServer(listName,list,socket,coder){
    try {
        var loginCode=null;
        if(coder==null){
            loginCode=returnSlist("loginCode");
        }else{
            loginCode=coder;
        }
        if(loginCode==null){
            // upAlert("你尚未登录！");
            return;
        }
        clearData();
        if(socket==null){
            thisSocket=parent.socket;
        }else{
            thisSocket=socket;
        }

        allNum=1;// 初始化总次数
        inNum=1;// 初始化第几次
        code.type=zh(1);
        code.one=zh(loginCode[0]);
        code.tow=zh(loginCode[1]);
        code.three=zh(loginCode[2]);
        code.four=zh(loginCode[3]);
        // 判断数组是否没空，如果数组为空则清掉服务器数据
        var can="";
        var scrnWidth = "";
        var scrnHeight = "";
        if(listName=="ouputXml"){
            sessionStorage.removeItem("upNum");
            // showMes(localStorage.getItem("size"),"red");
            code.num=zh(1);
            var ht=sessionStorage.getItem("thisHtml");
            var bool=false;
            if(ht!=null&&ht=="index"){
                can = document.getElementById(LK_CANVAS);
                scrnHeight = can.clientHeight;// 画布总高度
                scrnWidth = can.clientWidth;// 画布总宽度
            }else{
                var maxX=0;
                var maxY=0;
                if(list==null||list.lengt==0){
                    scrnWidth=0;
                    scrnHeight=0;
                }else if(list[0].mt==null){
                    for ( var i = 0; i < list.length; i++) {
                        list[i].active = 0;
                        if(list[i].x2>maxX){
                            maxX=list[i].x2;
                        }
                        if(list[i].y2>maxY){
                            maxY=list[i].y2;
                        }
                    }
                    scrnWidth=Math.round(maxX);
                    scrnHeight=Math.round(maxY);
                }else if(list[0].mt==1){
                    scrnWidth=localStorage.getItem("canWidth");
                    scrnHeight=localStorage.getItem("canHeight");
                }
            }
            if(list!=null){
                if(list.length>0&&list[0].mt==1){
                    bool=true;
                }
            }
            //showMes("...");
            //showMes("开始装换："+JSON.stringify(list),"red");
            list=replaceList("output",list);
            //	showMes("转换后：list:"+JSON.stringify(list),"blue");
            //	return;
            //showMes("size:"+localStorage.getItem("size"),"red");
            pStr=scrnWidth+"/"+scrnHeight+"/"+localStorage.getItem("size");
            if(bool){
                pStr+="[";
            }
        }else if(listName=="deviceList"){
            code.num=zh(2);
            pStr="";
        }else if(listName=="decoderList"){
            code.num=zh(3);
            pStr="";
            list=replaceList("decoder",list);
            /****************************************************************************
             *
             */
        }else if(listName=="localList"){
            code.num=zh(4);
            pStr="";
        }else if(listName=="relationList"){
            code.num=zh(5);
            pStr="";
        }else if(listName=="groupList"){
            code.num=zh(6);
            pStr="";
        }else if(listName=="IFOlist"){
            code.num=zh(7);
//			if(sessionStorage.getItem("change_mode")==null){
//				localStorage.removeItem("new_ifo");//删除当前操作的缓存
//			}
            list=replaceList("ifo",list);
            pStr="";
        }else if(listName=="modeList"){
            code.num=zh(8);
            pStr="";
            list= replaceList("moder",list);
        }else if(listName=="caution"){
            code.num=zh(9);
            pStr="";
            list= replaceList("caution",list);
        }else if(listName=="mdlxList"){
            code.num=zh(13);
            pStr="";
        }else if(listName=="streamList"){
            code.num=zh(14);
            pStr="";
        }else if(listName=="transmit"){
            code.num=zh(15);
            pStr="";
        }else if(listName=="clientList"){
            code.num=zh(16);
            pStr="";
        }else if(listName=="clientGroup"){
            code.num=zh(17);
            pStr="";
        }else if(listName=="clientPlayList"){
            code.num=zh(18);
            pStr="";
        }else if(listName=="modelGroupList"){
            code.num=zh(19);
            pStr="";
        }
        else if(listName=="end"){
            code.num=zh(255);
            pStr="";
        }
        if(list==null||list.length==0){
            // $("#ccc").append("<p> 数组长度"+list+"</p>");
            bigFile="";
            fileSize=0;
            allNum=1;
        }else{
            // $("#ccc").append("<p> 数组长度："+list.length+"</p>");
//	 		if(list==null||list.length==0){
//	 			list=null;
//	 		}

            bigFile=JSON.stringify(list);
            fileSize=bigFile.length;
            allNum=parseInt(fileSize/toLength);// 总共多少次
            if(fileSize%toLength!=0){
                allNum+=1;
            };
        }
//	 	if(code.num=="07"){
//	 		alert("bigFile:"+bigFile);
//	 	}
//	 $("#ccc").append("<p style='display:inline-block;min-height:20px; color:white; white-space:normal;width:500px;'>准备发送文件：" +code.num+" , "+listName+
//			 " 总次数："+allNum+" 第几次："+inNum+"  文件："+bigFile.substr(0,100)+" </p>");   

        sendBigFile();// 发送文件
    } catch (e) {

        setError("sendJSONForServer", e);
    }
}

/*
 * 发送接收文件的命令
 */
function getJSONForServer(listName){
    var loginCode= returnSlist("loginCode");
    if(loginCode==null){
        // upAlert("你尚未登录！");
        return;
    }
    clearData();
    thisSocket=parent.socket;
    allNum=1;// 初始化总次数
    inNum=1;// 初始化第几次
    code.type=zh(2);// 发送状态
    code.one=zh(loginCode[0]);
    code.tow=zh(loginCode[1]);
    code.three=zh(loginCode[2]);
    code.four=zh(loginCode[3]);
    // upAlert("获取名称"+listName);
    if(listName=="ouputXml"){
        code.num=zh(1);
    }else if(listName=="deviceList"){
        code.num=zh(2);
    }else if(listName=="decoderList"){
        code.num=zh(3);
    }else if(listName=="localList"){
        code.num=zh(4);
    }else if(listName=="relationList"){
        code.num=zh(5);
    }else if(listName=="groupList"){
        code.num=zh(6);
    }else if(listName=="IFOlist"){
        localStorage.removeItem("new_ifo");//删除当前操作的缓存
        code.num=zh(7);
    }else if(listName=="modeList"){
        code.num=zh(8);
    }else if(listName=="caution"){
        code.num=zh(9);
    }else if(listName=="mdlxList"){
        code.num=zh(13);
    }else if(listName=="streamList"){
        code.num=zh(14);
    }else if(listName=="transmit"){
        code.num=zh(15);
    }else if(listName=="clientList"){
        code.num=zh(16);
    }else if(listName=="clientGroup"){
        code.num=zh(17);
    }else if(listName=="clientPlayList"){
        code.num=zh(18);
    }else if(listName=="modelGroupList"){
        code.num=zh(19);
    }
    sendBigFile();
}
var callbackType=0;
// 返回消息

// 根据规则传送编码
function setCode(uint9Array, loginCodeList, byte1, byte2, byte3, byte4) {
    if (uint9Array == null || uint9Array.length == 0) {
        // upAlert("uint8Array数组未实例化");
        return;
    } else {
        if (loginCodeList == null || loginCodeList.length != 4) {
            // upAlert("随机码数组不正确");
            return;
        } else {
            for ( var i = 0; i < loginCodeList.length; i++) {
                uint9Array[i] = loginCodeList[i];
            }
            uint9Array[4] = byte1;
            uint9Array[5] = byte2;
            uint9Array[6] = byte3;
            uint9Array[7] = byte4;
            return uint9Array;
        }

    }

}
/*******************************************************************************
 * list:输出窗口的数组 canId:输出窗口显示的canvas标签ID return array;
 * 根据输出窗口文件的数组和显示效果窗口的ID号返回合适该窗口的输出文件
 */
function countXY(list,canId){
    var maxWidth=0;
    var maxHeight=0;
    if(list!=null){
        for(var i=0;i<list.length;i++){
            if(list[i].x2>maxWidth)
                maxWidth=list[i].x2;
            if(list[i].y2>maxHeight)
                maxHeight=list[i].y2;
        }
    }else{
        return null;
    }
    var can = document.getElementById(canId);
    var scrnWidth = can.clientWidth;// 从CSS样式获得屏幕宽度
    var scrnHeight = can.clientHeight;// 从CSS样式获得屏幕高度
    can.width = scrnWidth;// 设置屏幕的宽度
    can.height = scrnHeight;// 设置屏幕的高度
// upAlert("当前页面的长度:"+scrnWidth+"
// 宽度:"+scrnHeight+"文件的长度:"+maxWidth+" 宽度："+maxHeight);
    var ratioX=scrnWidth/maxWidth;
    var ratioY=scrnHeight/maxHeight;
// upAlert("ratioX:"+ratioX+" ratioY"+ratioY);
    for(var j=0;j<list.length;j++){
        list[j].x1=list[j].x1*ratioX;
        list[j].y1=list[j].y1*ratioY;
        list[j].x2=list[j].x2*ratioX;
        list[j].y2=list[j].y2*ratioY;
    }
    return list;
}
/**********************************
 * 根据宽高映射新自定义窗口文件
 * @param list
 * @param list_width
 * @param list_height
 * @param case_width
 * @param case_height
 * @param minx
 * @param miny
 * @returns
 */
function mappingList(params,list_width,list_height,case_width,case_height,mt,minx,miny){
    var list=new Array();
    try{
        var ratioX=case_width/list_width;
        var ratioY=case_height/list_height;
        // showMes("ratioX:"+ratioX+" ratioY "+ratioY,"red");
        var minW=getMin(params,"design").x;//最小X坐标
        var minH=getMin(params,"design").y;//最小Y坐标
        var mow=0;//最小坐标偏移的X坐标值
        var moh=0;//最小坐标偏移的Y坐标值
        if(minx!=null&&miny!=null){
            mow=minW-minx;
            moh=minH-miny;
        }
        var newObj =null;
        for(var i=0;i<params.length;i++){
            newObj=new Object();
            newObj.id=params[i].id;
            if(params[i].num==null){
                newObj.num=params[i].id;
            }else{
                newObj.num=params[i].num;
            }
            newObj.sc=params[i].sc;
            newObj.lineWidth=params[i].lineWidth;
            newObj.fillColor=params[i].fillColor;
            newObj.strokeColor=params[i].strokeColor;
            newObj.type=params[i].type;
            newObj.active=params[i].active;
            newObj.x1=params[i].x1;
            newObj.y1=params[i].y1;
            newObj.x2=params[i].x2;
            newObj.y2=params[i].y2;
            newObj.mt=params[i].mt;
            if(params[i].st==null){
                newObj.st=params[i].id;
            }else{
                newObj.st=params[i].st;
                newObj.w=params[i].w;
                newObj.h=params[i].h;
            }
            if(mt==1){
                if(((params[i].mx1-minW)*ratioX+minW))
                    newObj.mx1=((params[i].mx1-minW)*ratioX+minW)-mow;
                newObj.my1=((params[i].my1-minH)*ratioY+minH)-moh;
                newObj.mx2=((params[i].mx2-minW)*ratioX+minW)-mow;
                newObj.my2=((params[i].my2-minH)*ratioY+minH)-moh;
            }else if(mt==2){
                newObj.mx1=(params[i].mx1*ratioX)-mow;
                newObj.my1=(params[i].my1*ratioY)-moh;
                newObj.mx2=(params[i].mx2*ratioX)-mow;
                newObj.my2=(params[i].my2*ratioY)-moh;
            }
            list.push(newObj);
        }
    }catch(e){
        //showMes("数组mappingList方法转换失败::"+e);
        setError(mappingList,e);
    }

    return list;
}

/********************************
 * 根据类型修改窗口的大小{win:窗口，type：修改类型,okeyX：鼠标当前X坐标,okeyY:鼠标当前Y坐标}
 * @param win
 * @param type
 * @param okeyX
 * @param okeyY
 * @returns {Object}
 */
function up_win(win,type,okeyX,okeyY){
    try {
        var x=parseInt(okeyX)-parseInt(gbt_x);//移动X坐标
        var y=parseInt(okeyY)-parseInt(gbt_y);//移动的Y坐标
        var obj=new Object();//保存返回的数据
        var param=new Object();
        if(win.mt==null||win.mt==0){
            //标准模式的坐标
            param.x1=win.x1;//获取最小X坐标
            param.y1=win.y1;//获取最小Y坐标
            param.x2=win.x2;//获取最大X坐标
            param.y2=win.y2;//获取最大Y坐标
        }else if(win.mt==1){
            //自定义模式的坐标
            param.x1=win.mx1;//获取最小X坐标
            param.y1=win.my1;//获取最小Y坐标
            param.x2=win.mx2;//获取最大X坐标
            param.y2=win.my2;//获取最大Y坐标
        }
//		showMes("type:"+type+" okeyX:"+okeyX+" okeyY:"+okeyY+" gbt_x:"+gbt_x+" gbt_y:"+gbt_y+" x:"+x+" y:"+y,"red");
        switch (type) {
            case 1:
                obj.x1=param.x1;
                obj.y1=param.y1;
                obj.x2=gbt_x+x;
                obj.y2=gbt_y+y;
                break;
            case 2:
                obj.x1=gbt_x+x;
                obj.y1=gbt_y+y;
                obj.x2=param.x2;
                obj.y2=param.y2;
                break;
            case 3:
                obj.x1=param.x1;
                obj.y1=gbt_y+y;
                obj.x2=gbt_x+x;
                obj.y2=param.y2;
                break;
            case 4:
                obj.x1=gbt_x+x;
                obj.y1=param.y1;
                obj.x2=param.x2;
                obj.y2=gbt_y+y;
                break;
            case 5:
                obj.x1=gbt_x+x;
                obj.y1=param.y1;
                obj.x2=param.x2;
                obj.y2=param.y2;
                break;
            case 6:
                obj.x1=param.x1;
                obj.y1=param.y1;
                obj.x2=gbt_x+x;
                obj.y2=param.y2;
                break;
            case 7:
                obj.x1=param.x1;
                obj.y1=gbt_y+y;
                obj.x2=param.x2;
                obj.y2=param.y2;
                break;
            case 8:
                obj.x1=param.x1;
                obj.y1=param.y1;
                obj.x2=param.x2;
                obj.y2=gbt_y+y;
                break;
            default:
                break;
        }
        if(win.mt==null||win.mt==0){
            //标准模式的坐标
            win.x1=obj.x1;//获取最小X坐标
            win.y1=obj.y1;//获取最小Y坐标
            win.x2=obj.x2;//获取最大X坐标
            win.y2=obj.y2;//获取最大Y坐标
        }else if(win.mt==1){
            //自定义模式的坐标
            win.mx1=obj.x1;//获取最小X坐标
            win.my1=obj.y1;//获取最小Y坐标
            win.mx2=obj.x2;//获取最大X坐标
            win.my2=obj.y2;//获取最大Y坐标
        }
        return win;
    } catch (e) {
        setError("up_win", e);
    }
}
/*********************************
 * 根据坐标值移动窗口
 * @param win
 * @param x
 * @param y
 * @returns Object;
 */
function moveWin(win,x,y){
    var newObj= new Object();
    var param=new Object();
    param.x1=win.mx1+x;
    param.y1=win.my1+y;
    param.x2=win.mx2+x;
    param.y2=win.my2+y;
//	showMes("param:"+JSON.stringify(param),"blue");
    var deCanW=document.getElementById(LK_CANVAS).clientWidth;
    var deCanH=document.getElementById(LK_CANVAS).clientHeight;
    if((param.x2>deCanW&&param.y2>deCanH)||(param.x1<0&&param.y1<0)
        ||(param.x1<0&&param.y2>deCanH)||(param.y1<0&&param.x2>deCanW)){//判断是否越界：分别是越界四个角
    }else if(param.x1<0||param.x2>deCanW||param.x1==0||param.x2==deCanW){//判断左右是否越界
        okeyY=param.y1;
        okeyb=param.y2;
    }else if(param.y1<0||param.y2>deCanH||param.y1==0||param.y2==deCanH){//判断上下是否越界
        okeyX=param.x1;
        okeya=param.x2;
    }else if((param.x1>0&&param.x2<deCanW)&&(param.y1>0&&param.y2<deCanH)){//判断是否没有越界
        okeyX=param.x1;
        okeyY=param.y1;
        okeya=param.x2;
        okeyb=param.y2;
    }
//	showMes("x:"+x+" y:"+y+" okeyX:"+okeyX+" okeyY:"+okeyY+" okeya:"+okeya+" okeyb:"+okeyb,"red");
    newObj.id=win.id;
    newObj.x1=okeyX;
    newObj.y1=okeyY;
    newObj.x2=okeya;
    newObj.y2=okeyb;
    newObj.lineWidth=1;
    newObj.strokeColor="red";
    newObj.fillColor="black";
    return newObj;
}


/****************************************
 * 根据输出文件和总宽总高映射成ID大小的输出文件
 * @param list
 * @param width
 * @param height
 * @param id
 * @param mt
 */
function mappingXY(list,width,height,canId,mt){
    var maxWidth=width;
    var maxHeight=height;
    if(list==null){
        return null;
    }
    //showMes("list:"+JSON.stringify(list),"black");

    var can = document.getElementById(canId);
    var scrnWidth = can.clientWidth;// 从CSS样式获得屏幕宽度
    var scrnHeight = can.clientHeight;// 从CSS样式获得屏幕高度
    can.width = scrnWidth;// 设置屏幕的宽度
    can.height = scrnHeight;// 设置屏幕的高度
    showMes("当前页面的长度:"+scrnWidth+" 宽度:"+scrnHeight+"文件的长度:"+maxWidth+" 宽度："+maxHeight,"blue");
    if(canId==LK_CANVAS){
        localStorage.setItem("canWidth",scrnWidth);
        localStorage.setItem("canHeight",scrnHeight);
    }
    //showMes("scrnWidth:"+scrnWidth+" scrnHeight:"+scrnHeight+" maxWidth:"+maxWidth+" maxHeight:"+maxHeight,"red");
    var ratioX=scrnWidth/maxWidth;
    var ratioY=scrnHeight/maxHeight;
//			showMes("ratioX:"+ratioX+" ratioY"+ratioY,"blue");

    for(var j=0;j<list.length;j++){
        if(mt==null){
            list[j].x1=list[j].x1*ratioX;
            list[j].y1=list[j].y1*ratioY;
            list[j].x2=list[j].x2*ratioX;
            list[j].y2=list[j].y2*ratioY;
        }else if(mt==1){
            list[j].mx1=list[j].mx1*ratioX;
            list[j].my1=list[j].my1*ratioY;
            list[j].mx2=list[j].mx2*ratioX;
            list[j].my2=list[j].my2*ratioY;
        }
    }
    //showMes("转换后list:"+JSON.stringify(list),"black");
    return list;
}
/*******************************************************************************
 * 发送数据
 */
var send_date=0;// 发送单个数据状态
var send_dates=0;// 发送文件组状态
var send_obj=null;// 检测发送单个文件是否超时对象
var send_objs=null;// 检测发送文件组是否超时对象
function dateOverTime(){
    if(send_type==1){
        upAlert(showJSTxt(utilJSTxt,67));
        send_type=0;
    }
}
function datesOverTime(){
    if(send_dates==1){
        upAlert(showJSTxt(utilJSTxt,67));
        send_type=0;
        send_dates=0;
    }
}
function sendData(socket,date,callback){
    if(sent_type==0){
        if(socket!=null){
            send_date=1;
            socket.send(date);
            send_obj=setTimeout("dateOverTime()", 10000);
            socket.onmessage=function(event){
                send_date=0;
                clearTimeout(send_obj);
                var socket=getCoket(this.url,socketList);// 获得当前返回的哪一个IP的SOCKET;
                callback.socket=socket;
                if (typeof event.data == "string") {
                    // upAlert(event.data);

                } else {

                }

            };
        }
    }else{
        upAlert(showJSTxt(indexJSList,14));
    }
}
// 发送数据改变状态
function checkSend(parameter){
    st=1;
    parent.socket.send(parameter);

    if(objCT!=null){
        clearTimeout(objCT);
        objCT= setTimeout("checkTime()", 1000);
    }else{
        objCT= setTimeout("checkTime()", 1000);
    }

}
/************************
 * 超时执行方法
 */
function outTimeMethod(){
    // showMes("st:"+st);
    try {
        //隐藏搜索预置位
        $("#faqbg").hide();
        $("#yzw_mes").hide();

        //隐藏搜索输入源
        $("#none").hide();
        $("#smDiv").hide();

        //隐藏搜素录像
        $("#lxnr_ul_val li").remove();
    } catch (e) {

        showMes(e);
    }
}
/***********************************************************************
 * 发送数据结束
 */
// 测试服务器响应超时
var tn=0;
function checkTime(){
    //showMes(tn);
    //	 alert("aa");
//			showMes("时间：tn:"+tn+"  st:"+st);

    if(tn>10){
        if(checkMes()){
        }else{
            // $("#ccc").append("<p style='color:yellow'>超时</p>");
            tn=0;// 计算超时时间
            st=0;//发送接收命令的状态
            loginTime=0;
            upAlert(showJSTxt(utilJSTxt,68));
            outTimeMethod();//执行超时方法

        }

    }else if(tn<=10){
        if(objCT!=null){
            clearTimeout(objCT);
        }
        if(st==0){
            tn=0;
            loginTime=0;
        }else{
            tn++;
            objCT= setTimeout("checkTime()", 1000);
        }
    }
}
/*******************
 * 检测是否返回响应
 */
function checkMes(){
    try {
        //	showMes("开始发送：st:"+st);
//			$s("开始发送：st:"+st);
        if(st==0){
            tn=0;
            return true;
        }else{
            return false;
        }
    } catch (e) {
        setError("checkMes", e);
    }

}



/************************
 * 心跳
 */
function xintiao(){

    var loginCode = returnSlist("loginCode");// 回去随机码
    // var year=null;
    var month=null;
    var day=null;
    var hours=null;
    var minutes=null;
    var seconds=null;
    var myDate = new Date();
    year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    if (month.toString().length == 1) {
        month = "0" + month;
    }
    day = myDate.getDate(); //获取当前日(1-31)
    if (day.toString().length == 1) {
        day = "0" + day;
    }
    hours = myDate.getHours(); //获取当前小时数(0-23)  
    if (hours.toString().length == 1) {
        hours = "0" + hours;
    }
    minutes = myDate.getMinutes(); //获取当前分钟数(0-59) ]
    if (minutes.toString().length == 1) {
        minutes = "0" + minutes;
    }

    seconds = myDate.getSeconds(); //获取当前秒数(0-59)
    if (seconds.toString().length == 1) {
        seconds = "0" + seconds;
    }

    //
    //childHtml.window.showMes(" bool:"+(seconds=="00"||seconds=="30")+" seconds:"+seconds);
    if(hours=="12"&&minutes=="00"&&seconds=="00"){
        childHtml.window.send_this_time(1);//index.html调用子页面的设置设备时间
    }
    if(loginCode!=null){
        var binary = new Uint8Array(8);// 创建一个数组，必须固定长度
        binary = setCode(binary, loginCode, 0x00, 0x00, 0xff, 0xff);
        //childHtml.window.showMes("心跳："+JSON.stringify(binary)+"  时间："+seconds,"red");
        if(isPhone()){//发送心跳

            socket.send(binary.buffer);
//					childHtml.window.$sms("心跳："+JSON.stringify(binary.buffer));
        }else{
            socket.send(binary);
//					childHtml.window.showMes("心跳："+JSON.stringify(binary)+"  时间："+seconds,"red");
        }
    }else{

    }
    var a= localStorage.getItem("setTime");
    if(a=="0"){
        return;
    }else{
        setTimeout("xintiao()", 1000);
    }
}
/*******************************************************************************
 * 给多个设备同时发心跳
 */
function xintiao_s(){
//	var myDate =new Date();
    if(socketList!=null){
        for(var i=0;i<socketList.length;i++){
            if(socketList[i].lc!=null){
                var binary = new Uint8Array(8);// 创建一个数组，必须固定长度
                binary = setCode(binary, socketList[i].lc, 0x00, 0x00, 0xFF, 0xFF);
                socketList[i].socket.send(binary);
            }
        }
    }
    if(xt!=null){
        clearTimeout(xt);
        xt= setTimeout("xintiao_s()", 1000);
    }else{
        xt= setTimeout("xintiao_s()", 1000);
    }

}
/**********************************
 *  十进制转换16进制字符串
 * @param num
 * @returns
 */
function zh(num){
    var a= num.toString(16);
    if(a.length==1){
        return "0"+a;
    }else{
        return a;
    }
}

/***************************
 *
 * @param event
 * @param len
 * @returns {Boolean}
 */
function check(event, len) {
    var e = window.event || event;
    if(e.ctrlKey || e.altKey || e.shiftKey || isFunKey(e.keyCode)) {
        return true;
    }
    var obj = e.srcElement || e.target;
    if(getLength(obj.value) >= len) {
        return false;
    }
    return true;
}


// 限制输入框输入的个数
function change(obj, len) {
    var txt = obj.value;
    if(getLength(txt) <= len) {
        return;
    }
    while(getLength(txt) > len) {
        txt = txt.substring(0, txt.length - 1);
    }

    obj.value = txt;
}

function getLength(str) {
    var len = 0;
    for(var i = 0; i < str.length; i++) {
        if(str.charCodeAt(i) < 0x80) {
            len++;
        }else{
            len += 2;
        }
    }
    return len;
}

function isFunKey(code) {
    // 8 --> Backspace
    // 35 --> End
    // 36 --> Home
    // 37 --> Left Arrow
    // 39 --> Right Arrow
    // 46 --> Delete
    // 112~123 --> F1~F12
    var funKeys = [8, 35, 36, 37, 39, 46];
    for(var i = 112; i <= 123; i++) {
        funKeys.push(i);
    }
    for(var i = 0; i < funKeys.length; i++) {
        if(funKeys[i] == code) {
            return true;
        }
    }
    return false;
}

/*******************************************************************
 * 名称：checkInputCode 作用：只能输入整数，或者按照参数规定的数 obj:输入框对象
 ******************************************************************/

var txt="";// 保存已经输入的正确的数字的值
function checkInputCode(obj,len) {
    var value=obj.value;// 获取输入的字符串
    if(obj.id=="all_long"){
        if(value==0){
            obj.value=1;// 如果不是数字则取已经保存在缓存里的txt值
            return false;
        }
    }
    if(isNaN(obj.value)){// 判断是否是数字，
        obj.value=txt;// 如果不是数字则取已经保存在缓存里的txt值
        return false;
    }
    if(obj.value.split(".").length>1){// 判断是否出现小数点
        obj.value=txt;// 如果出现小数点则取已经保存在缓存里的txt值
        return false;
    }
    if(len!=null&&len==5&&value>65025){//判断这个是否是真确的端口
        obj.value=txt;// 
        return false;
    }

    txt=value;// 如果输入的内容是正确的则保存在缓存里
    obj.value=txt;// 把正确的显示出来
}


/*******************************************************************
 * 名称:setIp
 *
 * @param str
 *  例："1:1,2:2,3:3,4:5,5:4"
 *   功能：把固定格式的参数拆分对应的id然后根据id查找对应的信息显示在窗口上
 */
function setIp(str,winlist){
    newSetIp(str,winlist);
}





/****************************************
 * 根据窗口的宽度生成不同长度的输入源名称信息
 * @param win
 * 窗口属性
 * @param ip
 * 输入源IP
 * @param gn
 * 输入源gn
 */
function getWinStr(win,ip,gn){
    try {
        var returnStr="";//返回的字符串
        var inputName="";
        var inputGroupName="";
        var width=0;
        var de_list=returnList("decoderList");
        if(de_list!=null){
            //输入源文件不为空的情况下
            for(var i=0;i<de_list.length;i++){
                if(de_list[i].id==ip){
                    returnStr=de_list[i].name;
                    if(gn!=null){
                        if(de_list[i].grName!=null&&de_list[i].grName!=""){
                            inputGroupName=	de_list[i].grName.split(",")[(gn-1)];
                        }
                    }
                }
            }
        }
        returnStr=inputName+"."+inputGroupName;
        if(win.mt==null||win.mt==0){
            width=win.x2-win.x1;
        }else if(param.mt==1){
            width=win.mx2-win.mx2;
        }
        if(width<75){
            returnStr=returnStr.substring(0, 1)+"...";
        }else if(width<120&&str.length>5){
            returnStr=returnStr.substring(0, 5)+"...";
        }
        return returnStr;
    } catch (e) {

        setError("getWinStr", e);
        return "";
    }
}
/*******************************************************************
 * 根据param1和param2来进行数据判断
 */
function isFind(param1, param2) {
    var len1 = param1.length;
    var len2 = param2.length;
    if (len1 > len2) {
        return false;
    }
    for ( var i = 0; i < (len2 - len1) + 1; i++) {
        if (param1 == param2.substring(i, i + len1)) {
            return true;
        }
    }
    return false;
}
/**************************
 * 根据ID,宽，高来设置一个对象的宽度和高度
 * @param id
 * @param width
 * @param height
 */
function setSize(id, width,height){
    var div=document.getElementById(id);
    if(width!=null)
        div.width=width;

    if(height!=null)
        div.height=height;
}
/************************
 * 根据数字参数通道名称
 * @param num
 * @param param
 * @returns
 */
function getNumberStr(num,param){
    try {


        if(isNaN(num)){
            return null;
        }else{
            var str="";
            if(param!=null&&param!=""){
                str=param;
                var list=null;
                try {
                    list=str.split(",");
                } catch (e) {

                    //showMes("拆分通道数组错误"+e);
                }

                // upAlert(num+" "+list.length);
                if(num>list.length){
                    for(var i=list.length;i<num;i++){
                        str+=","+showJSTxt(indexJSList,1)+(i+1);
                    }
                }else if(num<list.length){
                    var index=str.indexOf(list[num]);
                    str= str.substring(0,index-1);
                }
            }else{
                for(var i=0;i<num;i++){
                    if(i==0){
                        str+=showJSTxt(indexJSList,1)+(i+1);
                    }else{
                        str+=","+showJSTxt(indexJSList,1)+(i+1);
                    }
                }
            }
            return str;
        }
    } catch (e) {

        alertError("getNumberStr",e);
    }
}
/***************************
 * 显示窗口提示框;
 */
function upConfirms(){
    var str="";
    for(var i=0;i<arguments.length;i++){
        str+=""+arguments[i]+"\n";
    }
    str+="\n\n"+showJSTxt(utilJSTxt,70);
    return confirm(str);
}
function upAlert(){
    var str="";
    for(var i=0;i<arguments.length;i++){
        str+=""+arguments[i]+"\n";
    }
    str+="\n\n"+showJSTxt(utilJSTxt,70);
    return alert(str);
}

// 消息框		

var aleText="";//提示框常量！

/********************************
 * 验证输入源类型是否是NVR
 * @param obj
 * @returns {Boolean}
 */
function checkInputType(obj){

    for(var i=0;i<nvrList.length;i++){
        if(nvrList[i]==obj){
            return true;
        }
    }
    return false;
//					if(obj==1||obj==3||obj==4||obj==5||obj==6||obj==7||
//					   obj==8||obj==9||obj==10||obj==11||obj==12||
//					   obj==13||obj==14||obj==15||obj==16||obj==17||obj==18||obj==19||obj==20||obj==21){
//						return true;
//					}else{
//						return false;
//					}
}
/*******************************
 * 验证输入源的数量是否超出范围
 * @param list
 * @returns {Boolean}
 */
function checkCount(list){
    var count=localStorage.getItem("number");
    if(count==null||count==0){
        return true;
    }
    if(list!=null){
        var num=0;
        for(var i=0;i<list.length;i++){
            if(checkInputType(list[i].type)){
                num=num+list[i].gn;
            }else{
                num++;
            }
        }
        if(num>count){
            return false;
        }else{
            return true;
        }
    }else{
        return true;
    }
}
/*****************************
 * 验证(a,b)坐标是否在(x,y)(x2,y2)内
 * @param a
 * @param b
 * @param x
 * @param y
 * @param x
 * @param y
 * @returns {Boolean}
 */
function checkIndex(a,b,x,y,x2,y2){
    if(a>x&&a<x2&&b>y&&b<y2){
        return true;
    }
    return false;
}
/************************************************
 * 验证(a,b)(c,d)坐标是否和(x,y)(x2,y2)点有交点
 * @param a
 * @param b
 * @param c
 * @param d
 * @param x
 * @param y
 * @param x2
 * @param y2
 * @returns {Boolean}
 */
function checkOnWin(a,b,c,d,x,y,x2,y2){
    if(a>x&&c<x2&&b<y&&d>y2){
        return true;
    }
    return false;
}
/************************************************
 * 验证(a,b)(c,d)坐标是否在(x,y)(x2,y2)点内
 * @param a
 * @param b
 * @param c
 * @param d
 * @param x
 * @param y
 * @param x2
 * @param y2
 * @returns {Boolean}
 */
function checkInWin(a,b,c,d,x,y,x2,y2){
    if(a>x&&c<x2&&b>y&&d<y2){
        return true;
    }
    return false;
}
/***************************************
 * 验证(bx,by)(ex,ey)框和(bX,bY)(eX,eY)是否有重叠
 * @param bx
 * @param by
 * @param ex
 * @param ey
 * @param bX
 * @param bY
 * @param eX
 * @param eY
 * @returns {Boolean}
 */
function checkOverlap(bx,by,ex,ey,bX,bY,eX,eY){
    if(checkIndex(bx,by,bX,bY,eX,eY)||
        checkIndex(ex,by,bX,bY,eX,eY)||
        checkIndex(ex,ey,bX,bY,eX,eY)||
        checkIndex(bx,ey,bX,bY,eX,eY)||
        checkIndex(bx,by,bX,bY,eX,eY)||
        checkIndex(ex,ey,bX,bY,eX,eY)||
        checkIndex(bx,ey,bX,bY,eX,eY)||
        checkIndex(ex,by,bX,bY,eX,eY)||
        checkIndex(bX,bY,bx,by,ex,ey)||
        checkIndex(eX,bY,bx,by,ex,ey)||
        checkIndex(eX,eY,bx,by,ex,ey)||
        checkIndex(bX,eY,bx,by,ex,ey)||
        checkIndex(bX,bY,bx,by,ex,ey)||
        checkIndex(eX,eY,bx,by,ex,ey)||
        checkIndex(bX,eY,bx,by,ex,ey)||
        checkIndex(eX,bY,bx,by,ex,ey)||
        checkOnWin(bx,by,ex,ey,bX,bY,eX,eY)||
        checkOnWin(bX,bY,eX,eY,bx,by,ex,ey)){
        return true;
    }else{
        return false;
    }
}
/********************************
 * 把四个数值从小到大排列
 * @param a
 * @param b
 * @param c
 * @param d
 */
function getmiddle(a,b,c,d){
    try {
        var list=new Array();//把数据放进一个数组来进行排列
        list.push(a);
        list.push(b);
        list.push(c);
        list.push(d);
        for(var i=0;i<list.length;i++){
            for(var j=0;j<list.length;j++){
                if(list[i]<list[j]){//从小到大排列
                    var a=list[i];
                    list[i]=list[j];
                    list[j]=a;
                }
            }
        }
        return list;
    } catch (e) {

        setError("getmiddle", e);
    }
}
/*******************************************************************************
 * 计算返回两个窗口重叠的位置
 * @param bx
 * @param by
 * @param ex
 * @param ey
 * @param bX
 * @param bY
 * @param eX
 * @param eY
 * @param id
 */
function returnOverlap(bx,by,ex,ey,bX,bY,eX,eY,id){
    try {
        var obj=new Object();
        obj.id=id;
        //showMes("bx:"+bx+" by:"+by+" ex:"+ex+" ey:"+ey+" bX:"+bX+" bY:"+bY+" eX:"+eX+" eY:"+eY );
        if( (bX >= bx && bX <= ex && bY >= by && bY <= ey)||
            (bx >= bX && bx <= eX && bY >= by && bY <= ey)||
            (bX >= bx && bX <= ex && by >= bY && by <= eY)||
            (bx >= bX && bx <= eX && by >= bY && by <= eY)){
            var xlist= getmiddle(bx,ex,bX,eX);//调用排列四个坐标点的顺序方法
            var ylist= getmiddle(by,ey,bY,eY);//调用排列四个坐标点的顺序方法
            obj.x1=xlist[1];
            obj.y1=ylist[1];
            obj.x2=xlist[2];
            obj.y2=ylist[2];
            //showMes("obj:"+JSON.stringify(obj),"blue");
        }else{
            obj=null;
        }
        return obj;
    } catch (e) {
        setError("returnOverlap", e);
    }


}
/*******************************
 * 判断点是否在点上
 * @param a
 * @param b
 * @param x
 * @param y
 * @returns {Boolean}
 */
var cline=5;
function checkLine(a,b,x,y){
    if(b!=null&&y!=null){
        if(a + cline > x && a - cline < x && b+ cline > y && b - cline < y){
            return true;
        }
    }else{
        if(a + cline > x && a - cline < x){
            return true;
        }
    }

    return false;
}


/********************************
 * 求余数
 * @param num
 * @param yushu
 * @returns
 */
function qiuyu(num,yushu){
    if(yushu!=null){
        deshu=yushu;
    }
    if(num%deshu==0){
        return true;
    }else{
        return false;
    }
}
function getyu(num,yushu){
    if(yushu!=null){
        deshu=yushu;
    }
    var count=0;
    if(num%deshu>5){
        count=num+(10-(num%deshu));
    }else{
        count=num-(num%deshu);
    }

    return count;
}
/***********************************
 * 验证两个数的小数大小
 * @param aNum
 * @param bNum
 * @returns {Boolean}
 */
function checkSM(aNum,bNum){
//					showMes("aNum:"+aNum+" bNum:"+bNum);
    var asm=aNum-parseInt(parseFloat(aNum).toFixed(5));
    var bsm=bNum-parseInt(parseFloat(bNum).toFixed(5));
    if(bsm>asm||bsm==asm){
        return true;
    }else if(bsm<asm){
        return false;
    }
}

/*********************************
 * 定位系统
 * @param a
 * @param b
 * @param x
 * @param y
 * @param x2
 * @param y2
 * @param id
 * @returns {Number}
 */
function position(a,b,x1,y1,x2,y2,id){
    try {
        if(checkLine(a,b,x1,y1)){
            $("#"+id).css("cursor", "se-resize");
            return 1;
        }else if(checkLine(a,b,x2,y2)){
            $("#"+id).css("cursor", "se-resize");
            return 2;
        }else if(checkLine(a,b,x1,y2)){
            $("#"+id).css("cursor", "sw-resize");
            return 3;
        }else if(checkLine(a,b,x2,y1)){
            $("#"+id).css("cursor", "sw-resize");
            return 4;
        }else if(checkLine(a,null,x1,null)&&b>y1&&b<y2){
            $("#"+id).css("cursor", "w-resize");
            return 5;
        }else if(checkLine(a,null,x2,null)&&b>y1&&b<y2){
            $("#"+id).css("cursor", "w-resize");
            return 6;
        }else if(checkLine(b,null,y1,null)&&a>x1&&a<x2){
            $("#"+id).css("cursor", "s-resize");
            return 7;
        }else if(checkLine(b,null,y2,null)&&a>x1&&a<x2){
            $("#"+id).css("cursor", "s-resize");
            return 8;
        }else{
            $("#deCan").css("cursor", "default");
            return 9;
        }
    } catch (e) {

        setError("position",e);
    }

}
/***************************************
 * 根据对象ID获取当前鼠标所在对象的坐标
 *
 */
function getCanXY(id){
    try {
        var canva=document.getElementById(id);
        var index=new Object();
        var hideX=document.body.scrollLeft;//获取隐藏的宽度
        var hideY=document.body.scrollTop;//获取隐藏的高度
        var mouseX=(event.x+hideX);//鼠标相对页面开始的X坐标
        var mouseY=(event.y+hideY);//鼠标相对页面开始的Y坐标
        var canvaX=canva.offsetParent.offsetLeft+canva.offsetLeft;
        var canvaY=canva.offsetParent.offsetTop+canva.offsetTop;
        //alert("mouseX:"+mouseX+" mouseY:"+mouseY+" canvaX:"+canvaX+" canvaY:"+canvaY);
        index.x=mouseX-canvaX;
        index.y=mouseY-canvaY;
        return index;
    } catch (e) {

        setError("getCanXY", e);
    }

}
/******************
 * 把拆分合并的窗口恢复成初始化的状态并且拍好顺序
 * @param list
 * @param id
 * @returns
 */
function restore(list,paramid){

    var newList=new Array();
    var obj=null;
    var sc=0;//还原窗口指向的物理屏号
    if(list[0].mt==null){
        var en=sessionStorage.getItem("lineNum");//初始化每一行多少个窗口
        var tn=sessionStorage.getItem("listNum");//初始化每一列多少个
        var canvaNum = en * tn;// 多少个对象
        var maxX=getMax(list).x;//获取最大X坐标
        var maxY=getMax(list).y;//获取最大Y坐标
        var minX=getMin(list).x;//获取最小X坐标
        var minY=getMin(list).y;//获取最小Y坐标
        var beginX = minX;// 开始X轴坐标
        var beginY = minY;// 开始Y轴坐标
        var canvaWidth = (maxX-minX)/en;// 每个对象的宽度
        var canvaHeight = (maxY-minY)/tn;// 每个对象的高度 
        var thisWin=null;
        obj="";
        var initList=new Array();
        for ( var i = 0; i < canvaNum; i++) {
            // 把对象生成到数组里面
            obj = new Object();
            obj.id = (i+1);
            obj.num= obj.id;
            obj.x1 = beginX;
            obj.y1 = beginY;
            obj.x2 = beginX + canvaWidth;
            obj.y2 = beginY + canvaHeight;
            obj.lineWidth=0;
            obj.fillColor="black";
            obj.strokeColor="width";
            obj.active= 0;
            obj.type= 0;
            initList.push(obj);
            if ((i + 1) % en == 0) {
                beginX = minX;
                beginY = beginY + canvaHeight;
            } else {
                beginX = beginX + canvaWidth;
            }
        }
        if(paramid!=null){//重置窗口功能
            for(var i=0;i<list.length;i++){//获取窗口的对象
                if(list[i].id==paramid){
                    thisWin=new Object();
                    thisWin.id =list[i].id;
                    thisWin.num= list[i].num;
                    thisWin.x1=list[i].x1;
                    thisWin.y1=list[i].y1;
                    thisWin.x2=list[i].x2;
                    thisWin.y2=list[i].y2;
                    thisWin.lineWidth=1;
                    thisWin.fillColor="black";
                    thisWin.strokeColor="white";
                    thisWin.active= 0;
                    thisWin.type= 0;
                }
            }
//							showMes(" width:"+canvaWidth+" height:"+canvaHeight+ " w:"+(thisWin.x2-thisWin.x1)/canvaWidth+
//									" h:"+(thisWin.y2-thisWin.y1)/canvaHeight);
            if((thisWin.x2-thisWin.x1)-1>canvaWidth||(thisWin.y2-thisWin.y1)-1>canvaHeight){
                //合并窗口重置操作
                var mes=new Array();
                mes=ctr_win(paramid,(thisWin.x2-thisWin.x1)/canvaWidth,(thisWin.y2-thisWin.y1)/canvaHeight,list);

                newList=mes;
//								showMes("newList:"+JSON.stringify(newList),"red");
//								showMes("mes:"+mes.length,"red");
            }else if((thisWin.x2-thisWin.x1)+1<canvaWidth||(thisWin.y2-thisWin.y1)+1<canvaHeight){
                //拆分窗口重置操作
                var sps=new Array();
                for(var i=0;i<initList.length;i++){
                    if(checkOverlap(thisWin.x1+1,thisWin.y1+1,thisWin.x2-1,thisWin.y2-1,
                            initList[i].x1,initList[i].y1,initList[i].x2,initList[i].y2)){
                        for(var j=0;j<list.length;j++){
                            if(checkOverlap(list[j].x1+1,list[j].y1+1,list[j].x2-1,list[j].y2-1,
                                    initList[i].x1,initList[i].y1,initList[i].x2,initList[i].y2)){
                                sps.push(list[j].id);
                                if(list[j].y1<thisWin.y1||
                                    (list[j].y1+1>thisWin.y1&&list[j].y1-1<thisWin.y1&&list[j].x1<thisWin.x1)){
//													showMes("id:"+list[j].id+" list[j].y1:"+list[j].y1+" thisWin.y1:"+thisWin.y1,"red");
                                    thisWin.id=list[j].id;
                                    thisWin.num=list[j].num;
                                    thisWin.x1=initList[i].x1;
                                    thisWin.y1=initList[i].y1;
                                }
                            }

                        }

                        thisWin.x2=initList[i].x2;
                        thisWin.y2=initList[i].y2;
                    }
                }
                if(sps.length>0){
                    for(var i=0;i<sps.length;i++){
                        for(var j=0;j<list.length;j++){
                            if(list[j].id==thisWin.id){
                                list[j]=thisWin;
                            }
                            if(sps[i]==list[j].id&&list[j].id!=thisWin.id){
                                list.splice(j,1);
                            }
                        }
                    }
                }
                newList=list;
            }
        }else{
            newList=initList;//返回所有的初始化窗口
        }

        //	showMes("还原:"+JSON.stringify(newList));
    }else if(list[0].mt==1){//自定义模式

        if(paramid!=null){
            //找出指向的物理屏号
            for(var i=0;i<list.length;i++){
                if(paramid==list[i].id){
                    newList=new Array();
                    sc=list[i].sc;
                    if(list[i].w>dwh||list[i].h>dwh){
                        for(var j=0;j<list.length;j++){
                            if((list[j].w>dwh||list[j].h>dwh)&&list[j].st!=list[i].id){
                                newList.push(list[j]);
                            }else if((list[j].w<dwh||list[j].h<dwh)&&list[j].sc!=list[i].sc){
                                newList.push(list[j]);
                            }else if((list[j].w==dwh&&list[j].h==dwh)&&list[j].sc!=list[i].sc){
                                newList.push(list[j]);
                            }
                        }
                    }else{
                        //找出不需要还原的窗口
                        for(var j=0;j<list.length;j++){
                            if(list[i].sc!=list[j].sc){
                                newList.push(list[j]);
                            }
                        }
                    }
                }
            }
//							showMes("newList:"+JSON.stringify(newList),"blue");
        }
        for(var i=0;i<list.length;i++){
            obj=null;
            if(paramid!=null&&list[i].sc==sc){
                //已经被拆分的物理屏窗口
                if((list[i].w<dwh||list[i].h<dwh)&&list[i].x1==0&&list[i].y1==0){
                    //	showMes("第一："+list[i].id);
                    obj=new Object();
                    obj.id=list[i].id;
                    obj.num = list[i].num;//序号,系统默认生成,可修改
                    obj.sc=list[i].sc;
                    obj.x1=0;
                    obj.y1=0;
                    obj.x2=dwh;
                    obj.y2=dwh;
                    obj.mx1=list[i].mx1;
                    obj.my1=list[i].my1;
                    obj.mx2=list[i].mx2;
                    obj.my2=list[i].my2;
                    obj.lineWidth = list[i].lineWidth;//窗口边框大小
                    obj.strokeColor = list[i].strokeColor;//窗口边框颜色
                    obj.fillColor = list[i].fillColor;//窗口背景颜色
                    obj.active = list[i].active;//窗口状态
                    obj.type = list[i].type;//窗口类型:标准,放大
                    obj.w=dwh;
                    obj.h=dwh;
                    obj.mt=1;
                    obj.st=list[i].id;
                    for(var j=0;j<list.length;j++){
                        if(list[i].sc==list[j].sc){
                            if(list[j].mx1<obj.mx1){
                                obj.mx1=list[j].mx1;
                            }
                            if(list[j].my1<obj.my1){
                                obj.my1=list[j].my1;
                            }
                            if(list[j].mx2>obj.mx2){
                                obj.mx2=list[j].mx2;
                            }
                            if(list[j].my2>obj.my2){
                                obj.my2=list[j].my2;
                            }
                        }
                    }
                    var bool=true;
                    for(var a=0;a<newList.length;a++){
                        if(newList[a].id==obj.id){
                            bool=false;
                        }
                    }
                    if(bool){
                        newList.push(obj);
                    }
                    //没有拆分的物理屏窗口
                }else if(list[i].w==dwh&&list[i].h==dwh){
                    //showMes("第二："+list[i].id);
                    newList.push(list[i]);
                    //已经合并的物理屏窗口
                }else if(list[i].w>dwh||list[i].h>dwh){
                    if(list[i].id==list[i].st){//获取最左上角的窗口值
                        //	showMes("第三："+list[i].id);
                        obj=new Object();
                        //showMes("list[i].mx1:"+list[i].mx1+" list[i].mx2:"+list[i].mx2+" list[i].my1:"+list[i].my1+" list[i].my2:"+list[i].my2,"blue");
                        var mzk=list[i].mx2-list[i].mx1;//画布显示的窗口总宽度
                        var mzg=list[i].my2-list[i].my1;//画布显示的窗口总高度
                        obj.id=list[i].id;
                        obj.num = list[i].num;//序号,系统默认生成,可修改
                        obj.sc=list[i].sc;
                        obj.x1=0;
                        obj.y1=0;
                        obj.x2=dwh;
                        obj.y2=dwh;
                        obj.mx1=list[i].mx1;
                        obj.my1=list[i].my1;
                        obj.mx2=mzk/(list[i].w/list[i].x2)+list[i].mx1;
                        obj.my2=mzg/(list[i].h/list[i].y2)+list[i].my1;
                        obj.lineWidth = list[i].lineWidth;//窗口边框大小
                        obj.strokeColor = list[i].strokeColor;//窗口边框颜色
                        obj.fillColor = list[i].fillColor;//窗口背景颜色
                        obj.active = list[i].active;//窗口状态
                        obj.type = list[i].type;//窗口类型:标准,放大
                        obj.w=dwh;
                        obj.h=dwh;
                        obj.mt=1;
                        obj.st=list[i].st;
                        newList.push(obj);
                        for(var j=0;j<list.length;j++){
                            if(list[j].id==9999&&list[i].id==list[j].st){//循环获取当前合并的显示窗口是由哪些物理屏组成的
                                //showMes("第四："+list[j].id);
                                obj=new Object();
                                obj.id= getId(newList);
                                obj.num = getId(newList,"num");//序号,系统默认生成,可修改
                                obj.sc=list[j].sc;
                                obj.x1=0;
                                obj.y1=0;
                                obj.x2=dwh;
                                obj.y2=dwh;
                                obj.mx1=list[j].mx1;
                                obj.my1=list[j].my1;
                                if(list[j].x1==0){
                                    obj.mx1=list[i].mx1;
                                }else{
                                    obj.mx1=mzk/(list[i].w/list[j].x1)+list[i].mx1;
                                }
                                if(list[j].y1==0){
                                    obj.my1=list[i].my1;
                                }else{
                                    obj.my1=mzg/(list[i].h/list[j].y1)+list[i].my1;
                                }
                                obj.mx2=mzk/(list[j].w/list[j].x2)+list[i].mx1;
                                obj.my2=mzg/(list[j].h/list[j].y2)+list[i].my1;
                                obj.lineWidth = list[i].lineWidth;//窗口边框大小
                                obj.strokeColor = list[i].strokeColor;//窗口边框颜色
                                obj.fillColor = list[i].fillColor;//窗口背景颜色
                                obj.active = list[i].active;//窗口状态
                                obj.type = list[i].type;//窗口类型:标准,放大
                                obj.w=dwh;
                                obj.h=dwh;
                                obj.mt=1;
                                obj.st=obj.id;
                                newList.push(obj);
                            }
                        }
                    }

                }
            }else if(paramid==null){
                //已经被拆分的物理屏窗口
                if((list[i].w<dwh||list[i].h<dwh)&&list[i].x1==0&&list[i].y1==0){
                    //	showMes("第一："+list[i].id);
                    obj=new Object();
                    obj.id=list[i].sc;
                    obj.x1=list[i].mx1;
                    obj.y1=list[i].my1;
                    obj.x2=list[i].mx2;
                    obj.y2=list[i].my2;
                    obj.active=list[i].active;
                    for(var j=0;j<list.length;j++){
                        if((list[j].w<dwh||list[j].h<dwh)&&list[i].sc==list[j].sc){
                            if(list[j].mx1<obj.x1){
                                obj.x1=list[j].mx1;
                            }
                            if(list[j].my1<obj.y1){
                                obj.y1=list[j].my1;
                            }
                            if(list[j].mx2>obj.x2){
                                obj.x2=list[j].mx2;
                            }
                            if(list[j].my2>obj.y2){
                                obj.y2=list[j].my2;
                            }
                        }
                    }
                    var bool=true;
                    for(var a=0;a<newList.length;a++){
                        if(newList[a].id==obj.id){
                            bool=false;
                        }
                    }
                    if(bool){
                        newList.push(obj);
                    }

                    //没有拆分的物理屏窗口
                }else if(list[i].w==dwh&&list[i].h==dwh){
                    //showMes("第二："+list[i].id);
                    var obj={"id":list[i].sc,"x1":list[i].mx1,"y1":list[i].my1,"x2":list[i].mx2,"y2":list[i].my2,"active":list[i].active};
                    newList.push(obj);
                    //已经合并的物理屏窗口
                }else if(list[i].w>dwh||list[i].h>dwh){
//									旧if(list[i].id==list[i].st){//获取最左上角的窗口值
                    if(list[i].id!=9999){
                        //	showMes("第三："+list[i].id);
                        obj=new Object();
                        //showMes("list[i].mx1:"+list[i].mx1+" list[i].mx2:"+list[i].mx2+" list[i].my1:"+list[i].my1+" list[i].my2:"+list[i].my2,"blue");
                        var mzk=list[i].mx2-list[i].mx1;//画布显示的窗口总宽度
                        var mzg=list[i].my2-list[i].my1;//画布显示的窗口总高度
                        obj.id=list[i].sc;
                        obj.x1=list[i].mx1;
                        obj.y1=list[i].my1;
                        obj.x2=mzk/(list[i].w/list[i].x2)+list[i].mx1;
                        obj.y2=mzg/(list[i].h/list[i].y2)+list[i].my1;
                        obj.active=list[i].active;
                        newList.push(obj);
                        for(var j=0;j<list.length;j++){
//											旧if(list[i].id!=list[j].id&&list[i].id==list[j].st){//循环获取当前合并的显示窗口是由哪些物理屏组成的
                            if(list[j].id==9999&&list[i].id==list[j].st){//循环获取当前合并的显示窗口是由哪些物理屏组成的
                                //showMes("第四："+list[j].id);
                                obj=new Object();
                                obj.id=list[j].sc;//获取新的ID号
                                obj.x1=list[j].mx1;
                                obj.y1=list[j].my1;
                                if(list[j].x1==0){
                                    obj.x1=list[i].mx1;
                                }else{
                                    obj.x1=mzk/(list[i].w/list[j].x1)+list[i].mx1;
                                }
                                if(list[j].y1==0){
                                    obj.y1=list[i].my1;
                                }else{
                                    obj.y1=mzg/(list[i].h/list[j].y1)+list[i].my1;
                                }
                                obj.x2=mzk/(list[j].w/list[j].x2)+list[i].mx1;
                                obj.y2=mzg/(list[j].h/list[j].y2)+list[i].my1;
                                obj.active=list[j].active;
                                newList.push(obj);
                            }
                        }
                    }

                }
            }
        }
        var no=null;
        //从新根据窗口的坐标从上到下，从左到右排序
        for(var i=0;i<newList.length;i++){
            for(var j=0;j<newList.length;j++){
                if(newList[i].y1+1<newList[j].y1||
                    (newList[i].y1+1>newList[j].y1&&newList[i].y1-1<newList[j].y1&&newList[i].x1<newList[j].x1)){
                    no=newList[i];
                    newList[i]=newList[j];
                    newList[j]=no;
                }
            }
        }


    }

    return newList;
}


/***************************************
 * 根据对象ID获取当前鼠标所在对象的开始坐标
 *
 */
function getObjXY(id){
    var canva=document.getElementById(id);
    var index=new Object();
    var canvaX=canva.offsetParent.offsetLeft+canva.offsetLeft;
    var canvaY=canva.offsetParent.offsetTop+canva.offsetTop;
    index.x=canvaX;
    index.y=canvaY;
    return index;
}
/***********************************************
 * 显示设备信息，并且操作
 * @param params
 * @param callback
 */
function showSelectDiv(params,callback){
    try {
        //隐藏背景DIV
        var hide_bc ="<div id='hide_bc'></div>";
        //标题头部DIV对象
        var imgsrc="";
        var ht=sessionStorage.getItem("thisHtml");
        if(ht!=null&&ht=="index"){
            imgsrc="assets/an1.gif";
        }else{
            imgsrc="../assets/an1.gif";
        }
        var dise_div="<div class='dise'><span class='wenzi1' style='line-height: 26px;'> &nbsp;"+showJSTxt(utilJSTxt,71)+"</span>"+
            "<span><img  onclick='unsend_ad()' src='"+imgsrc+"' width='47' height='20'></span></div>";
        //div对象
        var de_div="<div><table class='dv_ta' id='ta_top'>"+
            "<tr><td class='td1' style='border-right: 1px solid grey; '>"+showJSTxt(utilJSTxt,72)+":<input onclick='select_ac(this)' style='vertical-align: middle;'type='checkbox'/></td>"+
            " <td  class='td2' style='width:34%;border-right: 1px solid grey; '  >"+showJSTxt(utilJSTxt,73)+"</td><td  class='td3' style='width:34%;'  >"+showJSTxt(utilJSTxt,74)+"</td></tr></table><div>"+
            "<div id='div_val' ><table id='ta_val' class='dv_ta' ></table></div>"+
            "<table id='ta_but' ><tr><td colspan='2'><span><input class='but_but' onclick='send_ad()' value='"+showJSTxt(utilJSTxt,75)+"' type='button'/></span>"+
            " <span><input onclick='unsend_ad()' class='but_but' value='"+showJSTxt(utilJSTxt,76)+"' type='button'/></span></td></tr></table>";
        //容器DIV对象
        var div="<div id='s_d_d'>"+dise_div+de_div+"<div>";
        var list=returnList("deviceList");
        if(list!=null&&list.length>0){
            $("body").append(hide_bc);//显示隐藏背景DIV
            $("body").append(div);//显示设备DIV
            var cb_str="";
            var nm_str="";
            var dv_str="";
            var thisIP=$("#ip").html();
            socketList=new Array();
            for(var i=0;i<list.length;i++){
                cb_str="<td class='dv_td1'><input class='check_dv' id='dv"+list[i].id+"' type='checkbox'/></td>";
                nm_str="<td class='dv_td2'>"+list[i].DN+"</td>";
                dv_str="<td class='dv_td3'>"+list[i].L+"</td>";
                if(thisIP==list[i].L){

                }else{
                    $("#ta_val").append("<tr>"+cb_str+nm_str+dv_str+"</tr>");
                }

            }
        }
        //callback(true);
    }catch(e){

        setError("showSelectDiv", e);
    }
}
function select_ac(obj){
    try {
        if($(obj).prop("checked")==true){
            $(".check_dv").each(function(){
                $(this).prop("checked",true);
            });
        }else{
            $(".check_dv").each(function(){
                $(this).prop("checked",false);
            });
        }
    } catch (e) {

        setError("select", e);
    }

}
/******************************
 * 同步输入源到选择的设备
 */
function send_ad(){
    var sels=new Array();
    var dvs=returnList("deviceList");
//	showMes("ip:"+$("#ip").html());
    if(dvs!=null){
        $(".check_dv").each(function(obj){
            //轮巡所有复选框
            if($(this).prop("checked")){
                var id=this.id.substr(2);
                for(var i=0;i<dvs.length;i++){
                    //找出选择的设备
                    if(dvs[i].id==id&&dvs[i].L!="192.168.10.70"){
                        sels.push(dvs[i]);
                    }
                }
            }
        });
//		showMes("list:"+JSON.stringify(sels));
        if(sels.length>0){
            //准备发送
//			showMes("开始发送");
            var decoders=returnList("decoderList");
            sendWebFile(sels,0,"decoderList",decoders);
            setTimeout("showsocket()", 2000);
        }
        unsend_ad();

    }

}
/**************************************
 * 把窗口取消掉
 */
function unsend_ad(){
    $("#hide_bc").remove();
    $("#s_d_d").remove();
}

/************************************
 * 向服务器发送数据
 * @param list
 * @param num
 */
function sendWebFile(list,num,fileName,file){
    try {
//		showMes("sendWebFile:"+list.length+" num:"+num+" fileName:"+fileName+" file:"+file.length,"red");
        if(list.length!=0){
            var thisIp=$("#ip").html();
            var thisUser=$("#uName").html();

            if(list[num].L==thisIp&&list[num].U==thisUser){
                sendJSONForServer(fileName,file);
                num++;
                sendWebFile(list,num,fileName,file);
            }else{
                newConnect(list[num].L,list[num].U,list[num].P,function(mes){
                    // upAlert( list[num].L+" "+mes +" "+num+" "+list.length);
//					showMes("mes:"+mes,"login");
                    if(mes=="login"){
//						showMes("login","black");
                        var loginCode= returnSlist("newloginCode");
                        if(loginCode==null){
                            // upAlert("你尚未登录！");
                            return;
                        }
                        sendJSONForServer(fileName,file,pb_socket,loginCode);
                        pb_socket.onclose=function(){
                            sessionStorage.removeItem("newloginCode");
                            sessionStorage.setItem("xintiaoType","1");
                        };
                        pb_socket.onmessage=function (event){
                            if (typeof event.data == "string") {
                                pb_socket.close();
                                if(num<(list.length-1)){
                                    num++;
                                    sendWebFile(list,num,fileName,file);
                                }
                            } else {
                                pb_socket.close(1000);
                                clearTimeout(objCT);
                                st=0;
                                var bytes = new Uint8Array(event.data);
                                var sst="";
                                for(var i=0;i<bytes.length;i++){
                                    sst=sst+"  "+ bytes[i];
                                }
                                if(num<(list.length-1)){
                                    num++;
                                    sendWebFile(list,num,fileName,file);
                                }
                            }
                        };
                    }else{
                        if(mes=="error"){
                            upAlert(showJSTxt(utilJSTxt,77)+pb_socket.URL.substr(5)+showJSTxt(utilJSTxt,78)+","+showJSTxt(utilJSTxt,79));
                        }else if(mes=="debug"){
                            upAlert(showJSTxt(utilJSTxt,77)+pb_socket.URL.substr(5)+showJSTxt(utilJSTxt,78)+","+showJSTxt(utilJSTxt,80));
                        }
                        pb_socket.close(1000);
                        if(num<(list.length-1)){
                            num++;
                            sendWebFile(list,num,fileName,file);
                        }
                    }
                });
            }
        }
    } catch (e) {

        setError("sendWebFile", e);
    }
}
/***************************************************************************
 * 名称：connect;
 * 参数：ip=连接websocket的IP地址，userName=登录的用户名，password=登录的用户密码，callback=回调函数
 * 功能：用来检查传进来的ip,userName,password是否能够登录设备， 成功与否就会在callback回调函返回一个值提供给其他程序调用
 *
 **************************************************************************/
function newConnect(ip,userName,password,callback){
    try {
//		showMes("newConnect  ip:"+ip+" name:"+userName+" pwd:"+password);
        socketUser=userName;
        socketPwd=password;
        try{
            pb_socket=new WebSocket("ws://"+ip+":9880");
        }catch(e){
            upAlert('error');
            return;
        }
        pb_socket.binaryType = 'arraybuffer';// 设为可以传送二进制数组数据
        // 当websocket握手成功的时候执行下面的函数
        pb_socket.onopen = function() {
            sendLoginMes(socketUser,socketPwd,pb_socket);// 发送登录验证
            sessionStorage.setItem("xintiaoType","0");// 设置心跳状态
            var socketObj=new Object();
            socketObj.url=pb_socket.URL;
            socketObj.socket=pb_socket;
            socketList.push(socketObj);
            newxintiao();// 开启心跳
        };
        // 当webscoket有信息返回的时候执行下面的函数
        pb_socket.onmessage=function (event){
            var loginCode = new Array();// 定义一个接收随机码的数组
            // 判断返回的类型是字符串或者二进制
            if (typeof event.data == "string") {
            } else {
                var bytes = new Uint8Array(event.data);// 建立一个二进制字符数组
                // 判断是否是登录命令
                if (bytes[6]==0&&bytes[7] == 1 && bytes[8] == 0) {
                    for ( var i = 0; i < 4; i++) {
                        loginCode[i] = bytes[i];
                    }
                    saveSessionList("newloginCode", loginCode);
                    callback("login");
                }else if(bytes[6]==0&&bytes[7] == 1 && (bytes[8] == 2||bytes[8] == 1)) {
                    callback("debug");
                    sessionStorage.setItem("xintiaoType","1");
//					pb_socket.close(1000, '登录失败');
                    sessionStorage.removeItem("newloginCode");
                }
            }
        };
        // 当服务器错误执行下面的函数
        pb_socket.onerror=function (event) {
            callback("error");
            sessionStorage.setItem("xintiaoType","1");
        };
        // 当服务器关闭执行下面的函数
        pb_socket.onclose=function () {
            sessionStorage.setItem("xintiaoType","1");
        };
    } catch (e) {

        setError("newConnect", e);
    }
}
/***************************************************************************
 * 名称：newxintiao()
 * 作用：给连接上的websocket服务器发心跳状态
 **************************************************************************/
function newxintiao(){
    try {
        var loginCode = returnSlist("newloginCode");// 回去随机码
        if(loginCode!=null){
            var binary = new Uint8Array(8);// 创建一个数组，必须固定长度
            binary = setCode(binary, loginCode, 0x00, 0x00, 0xFF, 0xFF);
            // upAlert(binary.length);
            pb_socket.send(binary);
        }
        var ty= sessionStorage.getItem("xintiaoType");
        if(ty=="1"){
            return;
        }else{
            setTimeout("newxintiao()", 1000);
        }
    } catch (e) {

        setError("newxintiao", e);
    }
}
/********************************
 * 发送登陆命令
 * @param user
 * @param pwd
 * @param socket
 * @returns {Boolean}
 */
function sendLoginMes(user,pwd,socket) {
    try {
        var reg = new RegExp(/^[0-9a-zA-Z]{1,16}$/);//
        if (user.length == 0 || pwd.length == 0) {
            upAlert(showJSTxt(loginJSList,6));
            socket.close();
            return false;
        } else if (reg.test(user) == false
            || reg.test(pwd) == false) {
            upAlert(showJSTxt(loginJSList,7));
            socket.close();
            return false;
        } else {
            var longStr = user + "@" + pwd;// 拼接登录字符串
            // var random= parseInt(Math.pow(10,16))*
            // parseFloat(Math.random());
            var binary = new Uint8Array(longStr.toString().length + 8);// 创建一个数组，必须固定长度
            binary[0] = 0x00;// 固定 编码 随机码序号1
            binary[1] = 0x00;// 固定编码 随机码序号2
            binary[2] = 0x00;// 固定编码 随机码序号3
            binary[3] = 0x00;// 固定编码 随机码序号4
            binary[4] = 0x00;// 固定 编码 包序号高8 位
            binary[5] = 0x00;// 固定编码 包序号低8 位
            binary[6] = 0x00;// 固定编码 功能码0
            binary[7] = 0x01;// 固定编码 功能码 1
            for ( var i = 0; i < longStr.length; i++) {
                binary[i + 8] = longStr.substring(i, i + 1).charCodeAt();
            }
            socket.send(binary);
            // upAlert("以发送");	
        }
    } catch (e) {

        setError("sendLoginMes", e);
    }
}
/***********************************
 * 修改socket状态
 * @param socket
 */
function upsocket(socket){
    if(socketList!=null&&socketList.length>0){
        for(var i=0;i<socketList.length;i++){
            if(socketList[i].url==socket.URL){
                socketList[i].socket=socket;
            }
        }
    }
}
/************************************
 * 关闭所有socket
 */
function showsocket(){
    if(socketList!=null&&socketList.length>0){
        for(var i=0;i<socketList.length;i++){
            socketList[i].socket.close(1000,"关闭");
        }
        pb_socket.close(1000,"关闭");

    }
}
/*********************************************
 * 初始化标准模式窗口数组
 * @param width
 * @param height
 * @param wNum
 * @param hNum
 * @param mt
 * @returns {Array}
 */
function  createWins(width,height,wNum,hNum,mt){
    try {
        var list=new Array();//返回数据数组
        var entity=null;//每个窗口的对象
        var beginX=0;//开始坐标
        var beginY=0;//结束坐标
        var canvaWidth=width/wNum;
        var canvaHeight=height/hNum;
        var designWidth=width-deSignNum;//自定义的总宽
        var desingHeight=height-deSignNum;//自定义的总高
        var dbx = deSignNum/2;// 自定义模式开始X轴坐标
        var dby = deSignNum/2;// 自定义模式开始Y轴坐标
        var dcw = designWidth / wNum;// 自定义模式每个对象的宽度
        var dch = desingHeight/ hNum;// 自定义模式每个对象的高度
        for ( var int = 0; int < (wNum*hNum); int++) {
            // 把对象生成到数组里面
            entity = new Object();
            entity.id = int + 1;
            entity.num= int +1;//自定义窗口号
            entity.sc=entity.id;//物理屏号
            entity.x1 = beginX;
            entity.y1 = beginY;
            entity.x2 = beginX + canvaWidth;
            entity.y2 = beginY + canvaHeight;
            entity.lineWidth = 1;
            entity.fillColor = "black";
            entity.strokeColor = "white";
            entity.active = 0;
            entity.type = 0;
            if(mt==1){//自定义模式的属性
                entity.x1 = 0;
                entity.y1 = 0;
                entity.x2 = dwh;
                entity.y2 = dwh;
                entity.st=int + 1;
                entity.w=dwh;
                entity.h=dwh;
                entity.mt=1;
                entity.mx1 =dbx;
                entity.my1 =dby;
                entity.mx2 =dbx+dcw;
                entity.my2 =dby+dch;
            }
            list.push(entity);//把对象增加到数组
            if ((int + 1) % wNum == 0) {
                beginX = 0;
                beginY = beginY + canvaHeight;
                if(mt!=null&&mt==1){//自定义模式
                    dbx = deSignNum/2;
                    dby=dby+dch;
                }
            } else {
                beginX = beginX + canvaWidth;
                if(mt!=null&&mt==1){//自定义模式
                    dbx=dbx+dcw;
                }
            }
        }

        return list;
    } catch (e) {

        setError("createWins", e);
    }
}

/*******************************************
 * 把标准模式改为自定义模式地
 * @param li
 * @returns {Array}
 */
function zhuanhuan(li){
    try {
        var list=new Array();
        var sizes=localStorage.getItem("size").split("/");
        if(sessionStorage.getItem("ts_s")!=null){
            //获取各种模式的物理屏分布对象
            sizes=sessionStorage.getItem("ts_s").split("/");
            sessionStorage.removeItem("ts_s");
        }
        var wn=sizes[1];//几行
        var hn=sizes[0];//几列
        //showMes("li:"+JSON.stringify(li),"red");
        var cw=0;//总宽
        var ch=0;//总高
        cw=getMax(li).x;
        ch=getMax(li).y;
        var wins=createWins(cw,ch,wn,hn);//创建物理屏窗口
        var ow=cw/wn;//单个窗口的宽度
        var oh=ch/hn;//单个窗口的高度
        //showMes("wn:"+wn+" hn:"+hn+" cw:"+cw+" ch:"+ch+" wins:"+JSON.stringify(wins));	
        var nl=new Array();
        if(wins!=null&&wins.length>0){
            //判断生成的物理屏窗口是否为空
            var no=null;
            for(var i=0;i<wins.length;i++){
                //循环计算物理屏窗口所重叠的窗口
                no=new Object();
                no.id=wins[i].id;
                no.x1=wins[i].x1;
                no.y1=wins[i].y1;
                no.x2=wins[i].x2;
                no.y2=wins[i].y2;
                no.type=0;
                no.list=new Array();
                var lo=null;
                for(var j=0;j<li.length;j++){
                    //循环显示窗口的数组
                    if(checkOverlap(wins[i].x1,wins[i].y1,wins[i].x2,wins[i].y2,
                            (li[j].x1+1),(li[j].y1+1),(li[j].x2-1),(li[j].y2-1))&&li[j].active!=1){
                        lo=new Object();
                        lo.id=li[j].id;
                        if(li[j].num==null){
                            lo.num=lo.id;
                        }else{
                            lo.num=li[j].num;
                        }
                        lo.sc=wins[i].sc;//物理屏号
                        lo.x1=li[j].x1;
                        lo.y1=li[j].y1;
                        lo.x2=li[j].x2;
                        lo.y2=li[j].y2;
                        if((li[j].x2-li[j].x1-0.1)>(wins[i].x2-wins[i].x1)||(li[j].y2-li[j].y1-0.1)>(wins[i].y2-wins[i].y1)){
                            no.type=1;
                        }else if(no.list.length>0){
                            no.type=2;
                        }
                        no.list.push(lo);
                    }
                }
                nl.push(no);
            }
        }
//			showMes("aaa");
//			showMes("nl:"+JSON.stringify(nl),"red");
        var newno=null;
        var idList=new Array();
        var upList=new Array();//修改ID的数组
        for(var i=1;i<(wn*hn+1);i++){
            //提取窗口数组的ID生成ID数组,为计算合并窗口产生物理屏窗的ID作运算
            var idObj={"id":i};
            idList.push(idObj);
        }
//			showMes("idList:"+JSON.stringify(idList),"blue");
        cline=1;
//			showMes("bbb");
        for(var i=0;i<nl.length;i++){
            newno={"id":nl[i].id,"num":nl[i].id,"sc":nl[i].id,"x1":0,"y1":0,"x2":dwh,"y2":dwh,"w":dwh,"h":dwh,
                "mx1":nl[i].x1,"my1":nl[i].y1,"mx2":nl[i].x2,"my2":nl[i].y2,"mt":1,"st":nl[i].id,
                "lineWidth":1,"fillColor":"black","strokeColor":"white","active":0,"type":0};
//				showMes("ccc");
            if(nl[i].type==0){
                try {
                    var upObj=new Object();
                    upObj.oldId=nl[i].list[0].id;
                    upObj.newId=nl[i].id;
                    upList.push(upObj);//保存ID修改的状态
                    newno.id=nl[i].id;
                    newno.num=nl[i].list[0].num;
                    newno.mx1=nl[i].list[0].x1;
                    newno.my1=nl[i].list[0].y1;
                    newno.mx2=nl[i].list[0].x2;
                    newno.my2=nl[i].list[0].y2;
                    list.push(newno);
                } catch (e) {

                    showMes("eee"+e,"red");
                }
            }else if(nl[i].type==1){
                try {
                    var wnum=0;//横跨几个物理屏
                    var hnum=0;//纵跨几个物理屏
                    var wList=new Array();//物理屏数组
                    //获取所有的合并窗口的第一个物理屏为运算单位
                    for(var j=0;j<wins.length;j++){
                        //运算当前窗口是由几个物理屏窗口合并的
                        if(checkOverlap(nl[i].list[0].x1,nl[i].list[0].y1,nl[i].list[0].x2,nl[i].list[0].y2,
                                (wins[j].x1+1),(wins[j].y1+1),(wins[j].x2-1),(wins[j].y2-1))){
                            if(checkLine(nl[i].list[0].x1,null,wins[j].x1,null)){
                                hnum++;
                                var wObj=new Object();
                                wObj.id=getId(wList);
                                wObj.y=wins[j].y1;
                                wObj.list=new Array();
                                wList.push(wObj);
                            }
                            if(checkLine(nl[i].list[0].y1,null,wins[j].y1,null)){
                                wnum++;
                            }

                        }
                    }
//					showMes(" wList:"+wList.length,"red");
                    for(var a=0;a<wList.length;a++){
                        for(var b=0;b<wins.length;b++){
                            if(checkLine(wList[a].y,null,wins[b].y1,null)
                                &&checkOverlap(nl[i].list[0].x1,nl[i].list[0].y1,
                                    nl[i].list[0].x2,nl[i].list[0].y2,
                                    (wins[b].x1+1),(wins[b].y1+1),(wins[b].x2-1),(wins[b].y2-1))){
                                wList[a].list.push(wins[b]);
                                var lis=wList[a].list;
                                for(var c=0;c<lis.length;c++){
                                    for(var d=0;d<lis.length;d++){
                                        if(lis[c].x1<lis[d].x1){
                                            var obj=lis[c];
                                            lis[c]=lis[d];
                                            lis[d]=obj;
                                        }
                                    }
                                }
                                wList[a].list=lis;
                            }
                        }
                    }
                    for(var a=0;a<wList.length;a++){
                        for(var b=0;b<wList.length;b++){
                            if(wList[a].y<wList[b].y){
                                var obj=wList[a];
                                wList[a]=wList[b];
                                wList[b]=obj;
                            }
                        }
                    }
                    var ai=0;
                    var bi=0;
                    for(var a=0;a<wList.length;a++){
                        for(var b=0;b<wList[a].list.length;b++){
                            var tb=wList[a].list[b];
                            if(checkLine(tb.x1,tb.y1,nl[i].x1,nl[i].y1)){
                                bi=a+1;
                                ai=b+1;
                            }
                        }
                    }
//					showMes("id:"+nl[i].id+" x1:"+((ai*dwh)-dwh)+" y1:"+((bi*dwh)-dwh)+" x2:"+(ai*dwh)+" y2:"+(bi*dwh),"#9010F5");
//					showMes("wList："+JSON.stringify(wList),"red");
                    newno={"id":nl[i].id,"num":nl[i].list[0].num,"sc":nl[i].id,"x1":((ai*dwh)-dwh),
                        "y1":((bi*dwh)-dwh),"x2":(ai*dwh),"y2":(bi*dwh),
                        "w":wnum*dwh,"h":hnum*dwh,"mx1":nl[i].list[0].x1,"my1":nl[i].list[0].y1,
                        "mx2":nl[i].list[0].x2,"my2":nl[i].list[0].y2,"mt":1,"st":nl[i].list[0].id,"lineWidth":1,
                        "fillColor":"black","strokeColor":"white","active":0,"type":0};
                    if(checkLine(nl[i].x1,nl[i].y1,nl[i].list[0].x1,nl[i].list[0].y1)){
                        var upObj=new Object();
                        upObj.oldId=nl[i].list[0].id;
                        upObj.newId=newno.id;
                        upList.push(upObj);//保存修改窗口ID的数据

                    }else{
                        newno.id=9999;
                        newno.num=9999;
                        newno.mx1=0;
                        newno.my1=0;
                        newno.mx2=0;
                        newno.my2=0;
                    }
                    list.push(newno);
                } catch (e) {

                    showMes("fff"+e,"red");
                }
            }else if(nl[i].type==2){
                try {
                    for(var j=0;j<nl[i].list.length;j++){
                        newno={"id":nl[i].list[j].id,"num":nl[i].list[j].num,"sc":nl[i].id,"x1":0,"y1":0,"x2":dwh,"y2":dwh,"w":dwh,"h":dwh,
                            "mx1":nl[i].x1,"my1":nl[i].y1,"mx2":nl[i].x2,"my2":nl[i].y2,"mt":1,"st":nl[i].id,
                            "lineWidth":1,"fillColor":"black","strokeColor":"white","active":0,"type":0};
                        if(checkLine(nl[i].x1,nl[i].y1,nl[i].list[j].x1,nl[i].list[j].y1)){
                            newno.id=nl[i].id;
                        }else{
                            newno.id=getId(idList);
                            idList.push({"id":newno.id});
                        }
                        var upObj=new Object();
                        upObj.oldId=nl[i].list[j].id;
                        upObj.newId=newno.id;
                        upList.push(upObj);//保存修改窗口ID的数据
                        newno.x1=(dwh/ow)*(nl[i].list[j].x1-nl[i].x1);
                        newno.y1=(dwh/oh)*(nl[i].list[j].y1-nl[i].y1);
                        newno.x2=(dwh/ow)*(nl[i].list[j].x2-nl[i].x1);
                        newno.y2=(dwh/oh)*(nl[i].list[j].y2-nl[i].y1);
                        newno.w=newno.x2-newno.x1;
                        newno.h=newno.y2-newno.y1;
                        newno.mx1=nl[i].list[j].x1;
                        newno.my1=nl[i].list[j].y1;
                        newno.mx2=nl[i].list[j].x2;
                        newno.my2=nl[i].list[j].y2;
                        list.push(newno);
                    }
                } catch (e) {

//						showMes("ggg"+e,"red");
                }
            }
        }
//			showMes("ddd");
//			showMes("newnl:"+JSON.stringify(list),"blue");
        var dcw=(cw-deSignNum)/cw;
        var dch=(ch-deSignNum)/ch;
//		showMes("dcw:"+dcw+" dch:"+dch,"red");
        for(var i=0;i<list.length;i++){
            if(list[i].mx2!=0&&list[i].my2!=0){
                list[i].mx1=(list[i].mx1*dcw)+deSignNum/2;
                list[i].my1=(list[i].my1*dch)+deSignNum/2;
                list[i].mx2=(list[i].mx2*dcw)+deSignNum/2;
                list[i].my2=(list[i].my2*dch)+deSignNum/2;
            }
        }
        saveList("upIFO", upList);
        sessionStorage.setItem("upType",1);//保存当前有对标准模式转换成自定义模式的操作状态
        return list;
    } catch (e) {

        setError("zhuanhuan", e);
    }
}
/*************************************
 * 获取物理屏下的所有chuan
 * @param list
 * @param id
 */
function get_win(list,id){

}

/***************************************
 * 根据ID修改对应关系的数据
 * @param list
 * @returns {Array}
 */
function updateIFO(list){
    try {
        var upList=returnList("upIFO");
        if(upList!=null){
//			showMes("upList:"+JSON.stringify(upList),"blue");
            var IFOlist=null;
//			showMes("list:"+(list!=null)+" length:"+list.length,"yellow");
            if(list!=null){
                IFOlist=list;
            }else{
                IFOlist=returnList("IFOlist");
            }
//			showMes("oldIFOlist:"+JSON.stringify(IFOlist),"black");
            var uped=new Array();
            if(IFOlist!=null&&IFOlist.length>0){
                for(var i=0;i<upList.length;i++	){
                    for(var j=0;j<IFOlist.length;j++){
                        if(IFOlist[j].outputId==upList[i].oldId){
                            var bool=true;
                            for(var a=0;a<uped.length;a++){
                                if(IFOlist[j].id==uped[a]){
                                    bool=false;
                                }
                            }
                            if(bool){
                                IFOlist[j].outputId=upList[i].newId;
                                uped.push(IFOlist[j].id);
                            }

                        }
                    }
                }
            }
            localStorage.removeItem("upIFO");
//			showMes("newIFOlist:"+JSON.stringify(IFOlist),"blue");
            //saveList("IFOlist",IFOlist);
            //sendJSONForServer("ouputXml", returnList("ouputXml"));
            return IFOlist;
        }else{
            return list;
        }
    } catch (e) {

        setError("updateIFO", e);
        return list;
    }
}
/******************************
 * 显示当前IP标签的位置
 * @param paramId
 */
function showThisId(paramId){
    try {
        //	showMes("thisID:"+paramId,"red");
        var obj=document.getElementById(paramId);//获取当前输入源的对象
        var div = document.getElementById("left_bk");//获取容器的对象
        if(div==null||obj==null){
            return ;
        }
        //	showMes("top:"+obj.offsetTop+" div:"+div.offsetTop);
        var height=(obj.offsetTop-div.offsetTop)-(div.clientHeight/2);//计算显示的位置
        //showMes("height:"+height);
        div.scrollTop = height;
    } catch (e) {

        setError("showThisId",e);
    }
}
/*************************
 * 判断是手机或者是电脑
 */
function isPhone(){
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)) {
        return true;
    } else {
        return false;
    }
}
/***********************
 * 清理缓存集合
 */
function cleanItem(){
    localStorage.removeItem("oiList");
    localStorage.removeItem("oi");
    localStorage.removeItem("caution");
}
/***********************************
 * 验证当前选择框的状态
 * @param paramId
 * @returns {Boolean}
 */
function checkBox(paramId){
    var bool=true;
    var url=$("#"+paramId).css("background-image");//图片路径
    var imgName="";
    imgName=url.substr(url.indexOf("img")+4,url.length-2);//找出图片有名称
    if (imgName.indexOf('"')==-1) {//第一步处理
        imgName=imgName.substring(0, imgName.indexOf(")"));
    } else {
        imgName=imgName.substring(0, imgName.indexOf(")")-1);
    }
    if(imgName.indexOf('"')!=-1){//第二步处理
        imgName=imgName.replace('"','');
    }
    if(imgName=="tick_on.png"){
        bool=true;
    }else if(imgName=="tick_no.png"){
        bool=false;
    }else if(imgName==""){
        bool=false;
    }
    return bool;
}
/*************************************
 * 检查单选框
 * @param paramId
 * @returns {Boolean}
 */
function checkRadio(paramId){
    var bool=true;
    var url=$("#"+paramId).css("background-image");//图片路径
    var imgName="";
    imgName=url.substr(url.indexOf("img")+4,url.length-2);//找出图片有名称
    imgName=imgName.substring(0, imgName.indexOf(")"));
    if(imgName=="radio_on.png"){
        bool=true;
    }else if(imgName=="radio_no.png"){
        bool=false;
    }else if(imgName==""){
        bool=false;
    }
    return bool;
}
/************************************************
 * 根据窗口返回与窗口重叠的窗口是由几分割组成的
 * @param paramList
 * @param paramWin
 * @param type
 * @returns {Object}
 */
function returnWHNum(paramList,paramWin,type){
    try {
        var obj = new Object();
        obj.w=0;
        obj.h=0;
        obj.list=null;

        var wins=(type==null)?restore(paramList):paramList;//装换成物理屏
        var list=new Array();
        for(var i = 0;i < wins.length;i ++ ){
            if(type==null){
                if(checkOverlap(paramWin.x1+1,paramWin.y1+1,paramWin.x2-1,paramWin.y2-1
                        ,wins[i].x1,wins[i].y1,wins[i].x2,wins[i].y2)&&wins[i].active==0){
                    list.push(wins[i]);
                }
            }else if(type==1){
                if(checkOverlap(paramWin.x1+1,paramWin.y1+1,paramWin.x2-1,paramWin.y2-1
                        ,wins[i].mx1,wins[i].my1,wins[i].mx2,wins[i].my2)&&wins[i].active==0){
//					if(wins[i].id==7){
//						showMes("x1:"+(paramWin.x1+1)+" y1:"+(paramWin.y1+1)+" x2:"+(paramWin.x2-1)
//								+" y2:"+(paramWin.y2-1)
//								+" mx1:"+wins[i].mx1+" my1:"+wins[i].my1+
//								" mx2:"+wins[i].mx2+" my2:"+wins[i].my2,"green");
//					}

                    list.push(wins[i]);
                }
            }

        }
        if(list.length>0){
            var minX=null;
            var minY=null;
            obj.list=list;//返回当前运算的数组
            //	showMes("list:"+JSON.stringify(list),"red");
            for(var i=0;i<list.length;i++){
                if(type==null){
                    if(minX==null||list[i].x1<minX)
                        minX=list[i].x1;
                    if(minY==null||list[i].y1<minY)
                        minY=list[i].y1;
                }else if(type==1){
                    if(minX==null||list[i].mx1<minX)
                        minX=list[i].mx1;
                    if(minY==null||list[i].my1<minY)
                        minY=list[i].my1;
                }
            }
            for(var i=0;i<list.length;i++){
                if(type==null){
                    if(checkLine(minX,null,list[i].x1,null))
                        obj.h++;
                    if(checkLine(minY,null,list[i].y1,null))
                        obj.w++;
                }else if(type==1){
                    if(checkLine(minX,null,list[i].mx1,null))
                        obj.h++;
                    if(checkLine(minY,null,list[i].my1,null))
                        obj.w++;
                }

            }
        }
        return obj;
    } catch (e) {

        setError("returnWHNum",e);
    }

}
/***************************************
 * 根据参数条件获取数值
 * @param paramMin
 * @param paramMax
 * @param num
 * @param type
 * @returns
 */
function checkMinNum(paramMin,paramMax,num,type){
    try {
        var paramList=new Array();
        for(var i=0;i<=type;i++){
            var number=paramMin+(paramMax-paramMin)*(i/type);
            paramList.push(number);
        }

        var minNum=null;
        var returnNum=0;
        var list=new Array();
        for(var i=0;i<paramList.length;i++){
            var obj=new Object();
            obj.oNum=paramList[i];
            obj.nNum=(num-paramList[i]>0)?(num-paramList[i]):((num-paramList[i])*-1);
            list.push(obj);
        }
//		showMes("obj:"+JSON.stringify(list)+" num:"+num,"red");
        for(var i=0;i<list.length;i++){
            if(minNum==null||list[i].nNum<minNum){
                minNum=list[i].nNum;
                returnNum=list[i].oNum;
            }
        }
        return returnNum;
    } catch (e) {

        setError("checkMinNum",e);
    }

}

/******************************************
 * 根据权限返回操作提示
 * @param mes
 * @param index
 * @returns {Boolean}
 */
function checkPagePower(mes,index){
    try {
        var power=sessionStorage.getItem("manager");
        if(power!=null&&power!=""){
            power=power.substr(index,1);
        }
        if(power==null||power==1){
            upAlert(mes);
            return false;
        }
        return true;
    } catch (e) {

        alertError("checkPagePower",e);
    }

}
/******************************
 * 获取是否显示分辨率的状态
 */
function getFBL(){
    var loginCode= returnSlist("loginCode");
    if(loginCode==null){
        return null;
    }else{
        var binary = new  Uint8Array(8);
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x06,0x1e);//
        if(checkMes()){
            checkSend(binary);
        }else{
            upAlert(showJSTxt(paramJSTxt,1));
        }
    }

}

/********************************************
 * 根据窗口数组的变化修改漫游画中画的窗口
 * @param oList
 * @param nList
 * @returns
 */
function upAcWin(oList,nList){
    try {
        var upwins=new Array();//当前发生变化的窗口
        var upacw=new Array();//当前需要偏移的漫游画中画窗口
        for(var i=0;i<nList.length;i++){//查找当前进行修改的窗口
            var bool=true;
            for(var j=0;j<oList.length;j++){
                if(nList[i].id!=9999){
                    if(nList[i].id==oList[j].id){
                        bool=false;
                        if(nList[i].mx1!=oList[j].mx1|| nList[i].my1!=oList[j].my1||
                            nList[i].mx2!=oList[j].mx2|| nList[i].my2!=oList[j].my2){
                            upwins.push(nList[i]);
                        }
                    }
                }else{
                    bool=false;
                }
            }
            if(bool){
                upwins.push(nList[i]);
            }
        }

        //showMes("upwins:"+JSON.stringify(upwins));
        for(var i=0;i<upwins.length;i++){//查找当前修改的窗口所挨着的漫游画中画窗口
            for(var j=0;j<nList.length;j++){
                if(nList[j].active==1&&checkOverlap(upwins[i].mx1,upwins[i].my1,upwins[i].mx2,
                        upwins[i].my2,nList[j].mx1,nList[j].my1,nList[j].mx2,nList[j].my2)){
                    upacw.push(nList[j]);
                }
            }
        }
//	showMes("需要修改的漫游："+JSON.stringify(upacw),"red");
        for(var i=0;i<upacw.length;i++){//开始针对选中的漫游、画中画窗口进行运算。
            var obj={"id:":upacw[i].id,"x1":upacw[i].mx1,"y1":upacw[i].my1,
                "x2":upacw[i].mx2,"y2":upacw[i].my2};
            var newObj=update_param(nList,obj);
            //	showMes("newObj:"+JSON.stringify(newObj),"blue");
            upacw[i].mx1=newObj.x1;
            upacw[i].my1=newObj.y1;
            upacw[i].mx2=newObj.x2;
            upacw[i].my2=newObj.y2;

        }
        for(var i=0;i<nList.length;i++){
            for(var j=0;j<upacw.length;j++){
                if(nList[i].id==upacw[j].id){
                    nList[i]=upacw[j];
                }
            }
        }
        return nList;
    } catch (e) {

        setError("upAcWin",e);
    }
}
var CM_NUM=3;//定时不做同步处理
/********************************************
 * 修改对应关系
 * @param ifo_list
 * @param io_list
 */
function modifyIFO(ifo,io){
    try {
        var clickModeNum=sessionStorage.getItem("clickMode");//获取切换模式状态
        if(clickModeNum!=null&&clickModeNum<CM_NUM){//3秒
            clickModeNum=parseInt(clickModeNum)+1;
            sessionStorage.setItem("clickMode",clickModeNum);
            return ifo;
        }else if(clickModeNum!=null&&clickModeNum==CM_NUM){
            sessionStorage.removeItem("clickMode");
        }
        if(ifo==null){
            return null;
        }
        if(io==null){
            return ifo;
        }
        for(var i=0;i<io.length;i++){
            var bool=true;
            var num=0;
            var index=0;
            for(var j=0;j<ifo.length;j++){
                if(io[i].oi==ifo[j].outputId){
                    bool=false;
                    num++;
                    index=j;
                }
            }
            if(num==1){
                ifo[index].inputId=""+io[i].ii;
                ifo[index].longTime=""+1;
                ifo[index].gn=io[i].gn;
            }
            if(bool==true){
                io[i].gn=(io[i].gn==0)?0:io[i].gn;
                var ifoObj={"id":getId(ifo),"inputName":"","outputId":""+io[i].oi,
                    "inputId":""+io[i].ii,"longTime":""+1,"beginTime":"","endTime":"",
                    "gn":io[i].gn};
//				$("#ccc").append("<span style='color:red;'>ifo:添加对应关系"+JSON.stringify(ifoObj)+"</span>");
                ifo.push(ifoObj);
            }//
        }
        return ifo;
//		$("#ccc").append("<span>ifo:"+JSON.stringify(ifo)+"</span>");
    } catch (e) {
        setError("modifyIFO",e);
    }
}

/*******************************************
 * 根据paramList判断是否修复对应关系列表
 * @param ifo_list
 * @param io_list
 */
function upifoList(ifo_list,io_list){
    try {
        var paramList=io_list;//系统返回的对应关系数组
//		showMes("ifo_list:"+ifo_list+" paramList:"+paramList);
        if(ifo_list==null){//如果对应关系没空的情况下初始化一下对应关系
            ifo_list=new Array();
        }
        if(ifo_list!=null&&paramList!=null){
            //	$("#ccc").append("<p style='color:red;'>准备开始</p>");
            var old_list=returnList("oiList");//旧的系统返回对应关系
            var win_list=returnList("ouputXml");//输出窗口显示数组

            var new_ifo=returnList("new_ifo");//当前修改的缓存
//			$("#ccc").append("<p>"+JSON.stringify(new_ifo)+"</p>");
//			var noFindWin=new Array();//找出对应关系里面当前窗口不存在的ID数组
            var up_list=null;
            if(win_list!=null&&ifo_list!=null){//删除当前对应关系里面窗口已经不存在的对应关系
//				$("#ccc").append("<p style='color:black;'>删除不存在窗口的对应关系前："+JSON.stringify(ifo_list)+"</p>");
                for(var i=0;i<ifo_list.length;i++){
                    var bool=false;
                    for(var j=0;j<win_list.length;j++){
                        if(ifo_list[i].outputId==win_list[j].id	){
                            bool=true;
                        }
                    }
                    if(bool==false){
                        ifo_list.splice(i,1);
                        i--;
                    }
                }
//				$("#ccc").append("<p style='color:black;'>删除不存在窗口的对应关系后："+JSON.stringify(ifo_list)+"</p>");
            }
            if(win_list!=null&&new_ifo!=null){//删除不存在窗口的缓存对应关系
//				$("#ccc").append("<p>删除不存在窗口的缓存对应关系前："+new_ifo.length+"</p>");
                for(var i=0;i<new_ifo.length;i++){
                    var bool=false;
                    for(var j=0;j<win_list.length;j++){
                        if(new_ifo[i].win==win_list[j].id){
                            bool=true;
                        }
                    }
                    if(bool==false){
                        new_ifo.splice(i,1);
                        i--;
                    }
                }
//				$("#ccc").append("<p>删除不存在窗口的缓存对应关系后："+new_ifo.length+"</p>");
            }
            if(old_list!=null&&win_list!=null){//判断对应关系是否发生了变化
                //	$("#ccc").append("<p style='color:red;'>判断新旧对应关系是否发现变化</p>");
                for(var i=0;i<paramList.length;i++){
                    var bool=true;//如果新的对应在旧的对应关系不存在则为真
                    for(var j=0;j<old_list.length;j++){
                        if(paramList[i].gn==""||paramList[i].gn==null){
                            paramList[i].gn=0;
                        }
                        if(old_list[j].gn==""||old_list[j].gn==null){
                            old_list[j].gn=0;
                        }
                        if(paramList[i].oi==old_list[j].oi&&paramList[i].ii==old_list[j].ii&&
                            paramList[i].gn==old_list[j].gn){
                            bool=false;
                        }
                    }
                    if(bool){
                        if(up_list==null){
                            up_list=new Array();
                        }
                        up_list.push(paramList[i]);
                    }
                }
            }
//			$("#ccc").append("<p style='color:blue;'>判断结果："+JSON.stringify(up_list)+"</p>");
            if(ifo_list!=null){//判断接收的对应关系和本地的对应关系对比，接收的对应关系是否存在
                for(var i=0;i<paramList.length;i++){
                    var boolean=true;
                    for(var j=0;j<ifo_list.length;j++){
                        var gn=(ifo_list[j].gn!=null)?ifo_list[j].gn:0;
                        if(ifo_list[j].gn==""||ifo_list[j].gn==null){
                            gn=0;
                        }
                        if(paramList[i].gn==""||paramList[i].gn==null){
                            paramList[i].gn=0;
                        }
                        if(paramList[i].oi==ifo_list[j].outputId&&
                            paramList[i].ii==ifo_list[j].inputId&&
                            paramList[i].gn==gn){
                            boolean=false;
                        }
                    }
                    if(boolean){
                        if(up_list==null){
                            up_list=new Array();
                        }
                        up_list.push(paramList[i]);
                    }
                }
            }
            if(up_list!=null){
                for(var a=0;a<up_list.length;a++){
                    ifo_obj=up_list[a];
                    var this_ifo=new Array();
                    for(var i=0;i<ifo_list.length;i++){//找出当前窗口所有的对应关系
                        if(ifo_list[i].outputId==ifo_obj.oi){
                            this_ifo.push(ifo_list[i]);
                        }
                    }
//					var str="";//打印返回的数据是否正确
//					if(this_ifo!=null){
//						for(var i=0;i<this_ifo.length;i++){
//							str+=" oi:"+this_ifo[i].outputId+ " ii:"+this_ifo[i].inputId;
//						}
//					}
                    //	$("#ccc").append("<p style='color:red;'>this_ifo："+ str +" up_list:"+JSON.stringify(up_list)+"</p>");
                    var bool=true;//如果对应关系不存在则为真,存在则为假
                    //	$("#ccc").append("<p style='color:blue;'>new_ifo:"+JSON.stringify(new_ifo)+"</p>");
                    if(new_ifo!=null){//判断当前窗口的对应关系是否已经修改过。
                        for(var i=0;i<new_ifo.length;i++){
                            if(new_ifo[i].win==ifo_obj.oi&&new_ifo[i].list!=null){
                                bool=false;
                            }
                        }
                    }
                    for(var i=0;i<this_ifo.length;i++){//判断当前物理屏显示的输入源是否在该窗口的对应关系里面
                        if(this_ifo[i].gn==null||this_ifo[i].gn==""){
                            this_ifo[i].gn=0;
                        }
                        if(ifo_obj.gn==null||ifo_obj.gn==""){
                            ifo_obj.gn=0;
                        }
                        if(this_ifo[i].inputId==ifo_obj.ii&&this_ifo[i].gn==ifo_obj.gn){
                            bool=false;
                        }
                    }
                    //	$("#ccc").append("<p>bool:"+bool+" 窗口id:"+ifo_obj.oi+"</p>");
                    if(bool){
                        //	showMes("第"+a+"次修改前："+(ifo_list!=null)?ifo_list.length:"","yellow");
                        if(this_ifo!=null&&ifo_list!=null){
                            for(var i=0;i<ifo_list.length;i++){
                                for(var j=0;j<this_ifo.length;j++){
                                    if(ifo_list[i].id==this_ifo[j].id){
                                        ifo_list.splice(i,1);
                                        i=0;
                                    }
                                }
                            }
                        }
                        if(ifo_obj.gn==null||ifo_obj.gn==""){//针对通道号进行数据处理
                            ifo_obj.gn=0;
                        }
                        var ifoObj={"id":getId(ifo_list),"inputName":"","outputId":ifo_obj.oi,
                            "inputId":ifo_obj.ii,"longTime":1,"beginTime":"","endTime":"",
                            "gn":ifo_obj.gn};

                        ifo_list.push(ifoObj);
                        //	showMes("第"+a+"次修改前修改后："+(ifo_list!=null)?ifo_list.length:"","blue");
                    }
                }
            }

        }
//		$("#ccc").append("<p>最后："+JSON.stringify(ifo_list)+"</p");
        return ifo_list;
    } catch (e) {

        setError("upifoList",e);
    }
}
/**************************
 * 新的缓存对应关系
 * new_ifo=[
 * 			{"id":0,"win"0,"list":[]},
 * 			{"id":1,"win"1,"list":[]},
 * ]
 *
 */

/**********************************
 * 根据窗口号保存当前操作的对应关系
 * @param ifos
 * @param winId
 * @param wins
 */
function config_ifo(ifos,winId,wins){
    try {
        var paramList=ifos;
        var new_ifo=returnList("new_ifo");
        var config_list=null;
        for(var i=0;i<paramList.length;i++){
            if(paramList[i].outputId==winId){
                if(config_list==null){
                    config_list=new Array();
                }
                config_list.push(paramList[i]);
            }
        }
        if(new_ifo==null){
            var outputList=returnList("ouputXml");
            if(wins!=null){
                outputList=wins;
            }
            if(outputList!=null){
                new_ifo=new Array();//创建缓存数组
                var obj=null;
                for(var i=0;i<outputList.length;i++){//建立一个保存所有窗口对应关系的容器
                    obj={"id":getId(new_ifo),"win":outputList[i].id,"list":null};
                    new_ifo.push(obj);
                }
            }
        }
        //保存点前操作的对应关系
        for(var i=0;i<new_ifo.length;i++){
            if(new_ifo[i].win==winId){
                new_ifo[i].list=(config_list!=null)?config_list:[];
            }
        }
        //showMes("new_ifo:"+JSON.stringify(new_ifo),"red");
        saveList("new_ifo",new_ifo);
    } catch (e) {

        setError("config_ifo",e);
    }
}
/******************************************
 * 根据窗口数组合对应关系数组生成新的操作对应关系列表
 * @param paramWins
 * @param paramIfos
 */
function init_new_ifo(paramWins,paramIfos){
    try {
        //$("#ccc p").remove();
        //$("#ccc span").remove();
//		showMes("IFOList:"+JSON.stringify(paramIfos),"red");
        if(paramWins!=null&&paramIfos!=null){
            localStorage.removeItem("new_ifo");
            for(var i=0;i<paramWins.length;i++){
                config_ifo(paramIfos,paramWins[i].id,paramWins);
            }
            //showMes("list:"+localStorage.getItem("new_ifo"),"yellow");
        }
    } catch (e) {

    }
}
/****************************
 * 求两个数的差的绝对正数
 * @param num1
 * @param num2
 * @returns
 */
function get_pnum(num1,num2){
    var obj=new Object();
    if(num1>num2){
        obj.num=num1-num2;
        obj.min=num2;
    }else{
        obj.num=num2-num1;
        obj.min=num1;
    }
    return obj;
}

/****************************************
 * 清理误差数值
 * @param winList
 * @returns
 */
function update_winXY(winList){
    try {
        var list =winList;
        var bjNum=0.000001;
        var num=0;
        var num2=0;
        if(list!=null){
            for(var i=0;i<list.length-1;i++){
                for(var j=i+1;j<list.length;j++){
                    num2++;
                    if(list[i].mx1!=list[j].mx1){
                        var obj=get_pnum(list[i].mx1,list[j].mx1);
                        if(obj.num<bjNum){
//							showMes(" id:"+ list[i].id+" : "+ list[j].id+
//									"list[i].mx1:"+list[i].mx1+" list[j].mx1:"+list[j].mx1);
                            list[i].mx1=obj.min;
                            list[j].mx1=obj.min;
                            num++;
                            bool=true;
                        }
                    }
                    if(list[i].mx2!=list[j].mx2){
                        var obj=get_pnum(list[i].mx2,list[j].mx2);
                        if(obj.num<bjNum){
//							showMes(" id:"+ list[i].id+" : "+ list[j].id+
//									"list[i].mx2:"+list[i].mx2+" list[j].mx2:"+list[j].mx2);
                            list[i].mx2=obj.min;
                            list[j].mx2=obj.min;
                            num++;
                            bool=true;
                        }
                    }
                    if(list[i].my1!=list[j].my1){
                        var obj=get_pnum(list[i].my1,list[j].my1);
                        if(obj.num<bjNum){
//							showMes(" id:"+ list[i].id+" : "+ list[j].id+
//									"list[i].my2:"+list[i].my1+" list[j].my2:"+list[j].my1);
                            list[i].my1=obj.min;
                            list[j].my1=obj.min;
                            num++;
                            bool=true;
                        }
                    }
                    if(list[i].my2!=list[j].my2){
                        var obj=get_pnum(list[i].my2,list[j].my2);
                        if(obj.num<bjNum){
//							showMes(" id:"+ list[i].id+" : "+ list[j].id+
//									"list[i].my2:"+list[i].my2+" list[j].my2:"+list[j].my2);
                            list[i].my2=obj.min;
                            list[j].my2=obj.min;
                            num++;
                            bool=true;
                        }
                    }
                    if(list[i].mx1!=list[j].mx2){
                        var obj=get_pnum(list[i].mx1,list[j].mx2);
                        if(obj.num<bjNum){
//							showMes(" id:"+ list[i].id+" : "+ list[j].id+
//									"list[i].mx1:"+list[i].mx1+" list[j].mx2:"+list[j].mx2);
                            list[i].mx1=obj.min;
                            list[j].mx2=obj.min;
                            num++;
                            bool=true;
                        }
                    }
                    if(list[i].my1!=list[j].my2){
                        var obj=get_pnum(list[i].my1,list[j].my2);
                        if(obj.num<bjNum){
//							showMes(" id:"+ list[i].id+" : "+ list[j].id+
//									"list[i].my1:"+list[i].my1+" list[j].my2:"+list[j].my2);
                            list[i].my1=obj.min;
                            list[j].my2=obj.min;
                            num++;
                            bool=true;
                        }
                    }

                }
            }
        }
//		showMes("num:"+num+" num2:"+num2,"red");
        return list;
    } catch (e) {

        alertError("update_winXY",e);
    }
}
/*************************************
 * 触发报警的时候禁止修改窗口配置文件
 * @returns {Boolean}
 */
function unUpdateWin(){
    try {
        var bool=true;
        var io=returnList("oiList");
        if(io!=null){
//			showMes("io:"+JSON.stringify(io),"red");
            for(var i=0;i<io.length;i++){
                if(io[i].er!=null&&io[i].er!=0){
                    bool=false;
                }
            }
        }
        if(bool==false){
            upAlert(showJSTxt(indexJSList,97));
        }
        return bool;
    } catch (e) {

        setError("unUpdateWin",e);
    }
}



/***********************************************************
 * @author llm
 * @see 该方法
 * @time 2015-3-23
 * @param paramWinList
 * @returns {Array}
 */
function countSize(paramWinList){
    try {
        var list=new Array();//反回结果数组
        var wins=null;//显示窗口数组
        var winc=null;//物理屏窗口数组
        var oiList=returnList("oiList");
        if(oiList==null||oiList.length<1){//对应关系数组
            return null;
        }
        var IOS=new Array();
        /*************************************************************
         * @time 2016-10-11
         * @mes 优化查询窗口对应关系
         */
        var oMap={};//map地图
        for(var i=0;i<oiList.length;i++){//把重复的窗口数据清理掉

            if(oMap["id"+oiList[i].oi]==null){
                oMap["id"+oiList[i].oi]=oiList[i];
                IOS.push(oiList[i]);
            }

        }
//		showMes("oMap:"+JSON.stringify(oMap));
        if(paramWinList!=null&&paramWinList.length>0){//窗口显示数组
            wins=paramWinList;
        }else{
            wins=returnList("ouputXml");
        }
        winc=restore(wins);//计算物理屏窗口
//		showMes("winc:"+JSON.stringify(winc));
//		for(var i=0;i<winc.length;i++){
//			for(var j=0;j<winc.length;j++){
//				if(winc[i].id<winc[j].id){
//					var a=winc[i];
//					winc[i]=winc[j];
//					winc[j]=a;
//				}
//			}
//		}
        var obj=new Object();
        obj.cif=0;//cif分辨率
        obj.d1=0;//d1分辨率
        obj.sp=0;//720p分辨率
        obj.op=0;//1080P分辨率
        obj.fp=0;//300万分辨率
        obj.fop=0;//4K分辨率
        obj.fk=0;//超4K分辨率
        var num=0;//芯片ID
        var size=0;//分辨率宽
        var w=0;//宽
        var h=0;//高
        var cif=352*288;//CIF分辨率128
        var d1=720*576;//在D1分辨率64
        var sp=1280*960;//720P分辨率32
        var op=1920*1080;//1080P分辨率16
        var fp=2048*1536;//300万分辨率12
        var fop=2560*1600;//400万分辨率8
        var sizeStr = localStorage.getItem("size");
        var winSize=sizeStr.split("/")[2];
//		showMes("winc:"+winc.length+" wins:"+wins.length+" IOS:"+IOS.length+"  wins:"+JSON.stringify(wins));
        for(var i=0;i<winc.length;i++){
            if(winc[i].active==0){
                for(var j=0;j<wins.length;j++){
                    var winId=0;
                    if(wins[j].w<dwh||wins[j].h<dwh){
                        if(wins[j].sc==winc[i].id){
                            winId=wins[j].id;
                        }
                    }else if(wins[j].w==dwh&&wins[j].h==dwh){
                        if(wins[j].sc==winc[i].id){
                            winId=wins[j].id;
                        }else if(wins[j].active==1){
                            if(checkIndex(wins[j].mx1,wins[j].my1,winc[i].x1-0.1,winc[i].y1-0.1,
                                    winc[i].x2+0.1,winc[i].y2+0.1)){
                                winId=wins[j].id;
                            }
                        }
                    }else if((wins[j].w>dwh||wins[j].w>dwh)&&wins[j]!=9999){
                        if(wins[j].sc==winc[i].id){
                            winId=wins[j].id;
                        }
                    }

                    if(winId!=0&&winId!=9999){
//						showMes("winId:"+winId+"  winc[i].id:"+winc[i].id,"blue");
                        /*************************************************************
                         * @time 2016-10-11
                         * @mes 优化查询窗口对应关系
                         */
                        var iosObj=oMap["id"+winId];
//					showMes("isoObj:"+JSON.stringify(iosObj),"red");
                        if(iosObj!=null){
                            w=parseInt(iosObj.tp.split("*")[0]);
                            h=parseInt(iosObj.tp.split("*")[1]);
                            if(w*h==0){
                            }else if(w*h<cif||w*h==cif){
                                obj.cif+=1;
                                size+=1;
                            }else if(w*h<d1||w*h==d1){
                                obj.d1+=1;
                                size+=2;
                            }else if(w*h<sp||w*h==sp){
                                obj.sp+=1;
                                size+=4;
                            }else if(w*h<op||w*h==op){
                                obj.op+=1;
                                size+=8;
                            }else if(w*h<fp||w*h==fp){
                                obj.fp+=1;
                                size+=10.6;
                            }else if(w*h<fop||w*h==fop){
                                obj.fop+=1;
                                size+=16;
                            }else if(w*h>fop){
                                obj.fk+=1;
                                size+=32;
                            }
                        }
                    }
                }
                var wn=0;
                if(winSize==6){
                    wn=1;
                }else{
                    wn=2;
                }
                //	showMes("wn:"+wn +" i:"+i,"red");
                if((i+1)%wn==0){
                    num++;
                    obj.size=parseInt(size);
                    size=0;
                    obj.id=num;
                    list.push(obj);
                    obj=new Object();
                    obj.cif=0;//cif分辨率
                    obj.d1=0;//d1分辨率
                    obj.sp=0;//720p分辨率
                    obj.op=0;//1080P分辨率
                    obj.fp=0;//300万分辨率
                    obj.fop=0;//4K分辨率
                    obj.fk=0;//超4K分辨率
                }
            }

        }
//		showMes("list:"+list.length+" 数组:"+JSON.stringify(list));
        $("#winCode").remove();
        var show_str="";
        var autoType=false;
        var autoList=new Array();
        var autoNum=0;
        if(list!=null&&list.length>0){
            for(var i=0;i<list.length;i++){
                if(list[i].size>128){
//					showMes("list[i].size:"+list[i].size);
                    autoType=true;
                    if(winSize==6){
                        show_str+="<span style='display:inline-block;width:100%;'>警告：第"+(list[i].id)+"个物理屏窗口可能超出解码能力"+
                            "["+list[i].size+"]。</span>";
                        autoList.push(list[i].id);
                        autoNum++;
                    }else{
                        show_str+="<span style='display:inline-block;width:100%;'>警告：第"+(list[i].id*2-1)+"和第"+(list[i].id*2)+
                            "个物理屏窗口可能超出解码能力["+list[i].size+"]。</span>";
                        autoList.push((list[i].id*2-1));
                        autoList.push((list[i].id*2));
                        autoNum++;
                    }
                }
            }//
            if(autoType){//超出分辨率
                $("#ccc").append("<p id='winCode' style='color:red;line-height:24px;'>"+show_str+"</p>");

                showTip({"id":"tooltip","mesId":"tooltip_content","mes":show_str});//调用超出分辨率提示框
                if(autoNum>3){
                    $("#tooltip_content").css("overflow","auto");
                }else{
                    $("#tooltip_content").css("overflow","");
                }
                sessionStorage.setItem(RESOLUTION_AUTO,autoType);
                sessionStorage.setItem(RESOLUTION_AUTO_LIST,JSON.stringify(autoList));
            }else{
                closeTip({"id":"tooltip"});//
                sessionStorage.removeItem(RESOLUTION_AUTO);//清理缓存
                sessionStorage.removeItem(RESOLUTION_AUTO_LIST);//清理缓存
            }
        }
        return list;
    } catch (e) {
        showMes("计算:"+e);//
    }
}

/******************************************
 * 根据状态修改输入源的通道名称
 * @param str
 * @param paramType
 * @returns {String}
 */
function up_grName(str,paramType){
    try {
        var newStr="";
        if(str!=null){
            var type=0;
            if(paramType==null){
                type=$("#type").html();
            }else{
                type=paramType;
            }

            if(paramType==null){
                if(type==3){
                    var strs=str.split(",");
                    for(var i=0;i<strs.length;i++){
                        if(strs[i].indexOf("]")!=-1){
                            strs[i]=strs[i].split("]")[1];
                        }
                        if(i==0){
                            newStr=strs[i];
                        }else{
                            newStr+=","+strs[i];
                        }
                    }
                }else{
                    newStr=str;
                }
            }else{
                var strs=str.split(",");
                for(var i=0;i<strs.length;i++){
                    if(strs[i].indexOf("]")!=-1){
                        strs[i]=strs[i].split("]")[1];
                    }
                    if(i==0){
                        newStr=strs[i];
                    }else{
                        newStr+=","+strs[i];
                    }
                }
            }
        }else{
            newStr=str;
        }
        return newStr;
    } catch (e) {

        alertError("up_grName",e);
    }
}
/******************************
 * 主动获取双击放大状态
 */
function get_blclickType(){
    try {
        var loginCode= returnSlist("loginCode");
        if(loginCode==null){
            // upAlert("你尚未登录！");
            localStorage.setItem("clickType",thisType);
            return;
        }
        var binary = new  Uint8Array(8);
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x06,0x0e);//
        if(checkMes()){
            //	showMes("发送获取："+JSON.stringify(binary));
            checkSend(binary);
        }else{
            upAlert(showJSTxt(paramJSTxt,1));
        }
    } catch (e) {

        alertError("get_blclickType",e);
    }
}
/**************************
 * 根据参数把通道的地址去掉
 * @param param
 * @param types
 */
function gName_split(param,types){
    try {
        if(param!=null){
            if(types==null||types==0){//转换数组
                var list=param;
                for(var i=0;i<list.length;i++){
                    if(list[i].indexOf("]")!=-1){
                        list[i]=list[i].split("]")[1];
                    }
                }
                return list;
            }else{//转换字符串
                if(param.indexOf("]")!=-1){
                    param=param.split("]")[1];
                }
                return param;
            }
        }
    } catch (e) {

        alertError("gName_split",e);
    }
}
/**************************************
 * 验证对应关系，把窗口不存在，输入源不存在的对应关系清理掉。
 * @param paramList
 */
function checkIO(paramList){
    try {
        var list=paramList;//系统接收到的对应关系
        var decoders=returnList("decoderList");
        var wins=returnList("ouputXml");
        var P2PList=returnSlist("appList");//获取P2P输入源
        if(list!=null&&decoders!=null&&wins!=null){//输出窗口存在，输入源存在，对应关系存在
            //$("#ccc").append("<p>开始IO:"+JSON.stringify(list)+"</p>");
            //清理不存在窗口的对应关系
            for(var i=0;i<list.length;i++){
                var bool=true;
                for(var j=0;j<wins.length;j++){
                    if(list[i].oi==wins[j].id){
                        bool=false;
                        break;
                    }
                }
                if(bool){
                    list.splice(i,1);
                    i=0;
                }
            }
            if(P2PList!=null){
                Array.prototype.push.apply(decoders, P2PList);  //合并两个数组

            }
            //清理不存在输入源的对应关系
            for(var i=0;i<list.length;i++){
                var bool=true;
                for(var j=0;j<decoders.length;j++){
                    if(list[i].ii==decoders[j].id){
                        bool=false;
                        break;
                    }
                }
                if(bool){
                    list.splice(i,1);
                    i=0;
                }
            }


            //	$("#ccc").append("<p>结束IO:"+JSON.stringify(list)+"</p>");
        }else{
            list=null;
        }
        return list;
    } catch (e) {
        setError("checkIO",e);
        //showMes("checkIO",e);
    }
}

/*******************************************
 *发送电脑时间到服务器
 */
function send_this_time(sendType){
    try {
        var year=null;
        var month=null;
        var day=null;
        var hours=null;
        var minutes=null;
        var seconds=null;
        var myDate = new Date();
        year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        if (month.toString().length == 1) {
            month = "0" + month;
        }
        day = myDate.getDate(); //获取当前日(1-31)
        if (day.toString().length == 1) {
            day = "0" + day;
        }
        hours = myDate.getHours(); //获取当前小时数(0-23)  
        if (hours.toString().length == 1) {
            hours = "0" + hours;
        }
        minutes = myDate.getMinutes(); //获取当前分钟数(0-59) ]
        if (minutes.toString().length == 1) {
            minutes = "0" + minutes;
        }
        seconds = myDate.getSeconds(); //获取当前秒数(0-59)
        if (seconds.toString().length == 1) {
            seconds = "0" + seconds;
        }
        var loginCode = returnSlist("loginCode");// 回去随机码
        if (loginCode != null) {
            var binary = null;// 创建一个数组，必须固定长度
            binary = new Uint8Array(14);
            binary = setCode(binary, loginCode, 0x00, 0x00, 0x06, 0x00);
            binary[8] = (parseInt(year)-2000);
            binary[9] = month;
            binary[10] = day;
            binary[11] = hours;
            binary[12] = minutes;
            binary[13] = seconds;
            // upAlert(senStr);
            //hours=="12"&&minutes=="00"&&
//				var str="";
//				for(var i=0;i<binary.length;i++){
//					str+=zh(binary[i])+"  ";
//				}
//				alert(str);
            if(checkMes()&&sendType!=null){

                sessionStorage.setItem("loginTime",1);
                checkSend(binary);
            }
            return binary;

        }else{
            return null;
        }
    } catch (e) {
        alertError("send_this_time",e);
    }
}

/******************************************
 * 设置登录发送的命令
 */
function set_orderList(){
    try {
        var loginCode= returnSlist("loginCode");
        if(loginCode==null){
            return;
        }
        orderList=new Array();
        var orderObj=new Object();
        orderObj.name="同步本地和服务器的时间";
        orderObj.local="loginTime";
        orderObj.binary=send_this_time();//获取当前的命令
        orderList.push(orderObj);
//		orderObj=new Object();
//		orderObj.name="获取分辨率";
//		orderObj.binary=orderObj();
//		orderList.push(orderObj);
        var binary =new  Uint8Array(8);//获取音频的命令
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x0a,0x00);
        orderObj=new Object();
        orderObj.name="getVoice";
        orderObj.binary=binary;
        orderList.push(orderObj);
        /*var binary =new  Uint8Array(8);//获取流媒体地址类型
         binary = setCode(binary, loginCode, 0x00, 0x00, 0x0b,0x02);
         orderObj=new Object();
         orderObj.name="获取用户获取流媒体地址类型";
         orderObj.binary=binary;
         orderList.push(orderObj);*/
    } catch (e) {
        alertError("set_orderList",e);
    }

}



/******************************
 * 发送命令组
 * @param paramList
 */
//
function send_orderList(){
    try {
        //showMes("orderList:"+JSON.stringify(orderList),"red");
        if(orderList!=null&&orderList.length>0){//命令数组不为空
            if(st==0){
                for(var i=0;i<orderList.length;i++){//
                    if(orderList[i].binary!=null){
                        //showMes("当前发送："+orderList[i].name);
                        sessionStorage.setItem(orderList[i].local,1);
                        checkSend(orderList[i].binary);
                        orderList.splice(i,1);//删除当前命令数组的命令
                        break;
                    }else{
                        continue;
                    }
                }
            }
            if(orde_reback!=null){
                clearTimeout(orde_reback);
            }
            //showMes("st:"+st);
            orde_reback=setTimeout("send_orderList()",500);
        }else{
            //showMes("发送命令组完成");
            clearTimeout(orde_reback);
        }
    } catch (e) {
        setError("send_orderList",e);
    }


}

var methodList=null;//时间函数
var methodtime=5;//时间间隔
/**********************************************
 * 设置时间函数调用方法
 * @param paramList
 */
function send_orderMethods(paramList){
    try {
        if(method_reback!=null){
            clearTimeout(method_reback);
        }
        if(paramList!=null){
            methodList=paramList;
        }
//		showMes("开始发送paramList.length:"+methodList.length+" st:"+st,"red");
        if(methodList!=null&&methodList.length>0){
            for(var i=0;i<methodList.length;i++){
                if (checkMes()) {
                    methodList[i].method();
                    methodList.splice(i,1);
                    break;
                }
            }
            if(methodList.length>0){
                method_reback=setTimeout("send_orderMethods()", methodtime);
            }
        }
    } catch (e) {
        $e("timeMethod",e);
    }
};
/***********************************
 * 验证两个日期的大小
 * @param param1
 * @param param2
 * @returns {Boolean}
 */
function check_ll(param1,param2){
    try {
        var bool=true;
        if((param1==null||param1=="")&&param2!=null&&param2!=""){
            bool=true;
        }
        if((param2==null||param2=="")&&param1!=null&&param1!=""){
            bool=false;
        }
        if((param1!=null&&param1!="")&&(param2!=null&&param2!="")){
            var d1=new Date(param1.replace(/\-/g,'/')),
                d2=new Date(param2.replace(/\-/g,'/'));
            if(d1<d2){
                bool=true;
            }else{
                bool=false;
            }
        }
        return bool;
    } catch (e) {

        setError("check_ll",e);
    }
}
/************************************
 * 验证两个时间的大小
 * @param startTime
 * @param endTime
 * @returns {Boolean}
 */
function validTime(startTime,endTime){
    try {
        if(startTime!=null&&startTime!=""&&endTime!=null&&endTime!=""){
            var arr1 = startTime.split(":");
            var arr2 = endTime.split(":");
            var date1=new Date("1979","01","01",parseInt(arr1[0]),parseInt(arr1[1]),0);
            var date2=new Date("1979","01","01",parseInt(arr2[0]),parseInt(arr2[1]),0);
            if(date1.getTime()<date2.getTime()) {
                return true;
            }else{
                return false;
            }
        }else if((startTime==null||startTime=="")&&endTime!=null&&endTime!=""){
            return true;
        }else if((endTime==null||endTime=="")&&startTime!=null&&startTime!=""){
            return false;
        }

    } catch (e) {

        setError("validTime",e);
    }

}
/*****************************************
 * 比较两个完整的时间大小
 * @param time1
 * @param time2
 * @returns {Boolean}
 */
function compare_time(time1,time2){
    try {
        var bool=true;
        //showMes("time1:"+time1+" time2:"+time2);
        var year1=time1.split(" ")[0].split("-")[0];
        var month1=time1.split(" ")[0].split("-")[1];
        var day1=time1.split(" ")[0].split("-")[2];
        var hh1=time1.split(" ")[1].split(":")[0];
        var mm1=time1.split(" ")[1].split(":")[1];
        var ss1=time1.split(" ")[1].split(":")[2];
        var year2=time2.split(" ")[0].split("-")[0];
        var month2=time2.split(" ")[0].split("-")[1];
        var day2=time2.split(" ")[0].split("-")[2];
        var hh2=time2.split(" ")[1].split(":")[0];
        var mm2=time2.split(" ")[1].split(":")[1];
        var ss2=time2.split(" ")[1].split(":")[2];
//		showMes(year1+" "+month1+" "+day1+" "+hh1+" "+mm1+" "+ss1,"red");
//		showMes(year2+" "+month2+" "+day2+" "+hh2+" "+mm2+" "+ss2,"red");
        var date1=new Date(year1,month1,day1,hh1,mm1,ss1);
        var date2=new Date(year2,month2,day2,hh2,mm2,ss2);
        if(date1.getTime()<=date2.getTime()) {
            bool= true;
        }else{
            bool= false;
        }
        return bool;
    } catch (e) {
        setError("compare_time",e);
    }
}

/*********************************************
 * 判断IP的大小
 * @param param1
 * @param param2
 * @returns {Boolean}
 */
function pdip(param1,param2){
    try {
        var list1=param1.split(".");
        for(var i=0;i<list1.length;i++){
            list1[i]=parseInt(list1[i]);
        }
        var list2=param2.split(".");
        for(var i=0;i<list2.length;i++){
            list2[i]=parseInt(list2[i]);
        }
        if(list1[0]<list2[0]){
            return true;
        }else if(list1[0]>list2[0]){
            return false;
        }else{
            if(list1[1]<list2[1]){
                return true;
            }else if(list1[1]>list2[1]){
                return false;
            }else{
                if(list1[2]<list2[2]){
                    return true;
                }else if(list1[2]>list2[2]){
                    return false;
                }else{
                    if(list1[3]<list2[3]){
                        return true;
                    }else {
                        return false;
                    }
                }
            }
        }

    } catch (e) {
        alertError("pdip",e);
    }
}

/*************************************
 * 保存音频输出设置
 * @param param
 */
function setAllVoice(param){
    try {
        var list=new Array();
        if(param==null||param.length<10){
            return null;
        }else{
            var type=0;
            var type2=0;
            var voice=0;
            var voice2=0;
            var coding=0;
            var sampling=0;
            var op1=1;
            var op2=1;
            if((param.length-8)%8!=0){
                upAlert(showJSTxt(paramJSTxt,100.5));
                return;
            }
            //alert("param:"+JSON.stringify(param));
            var lt=(param.length-8)/8;
            for(var i=0;i<lt;i++){
                type=param[i*8+8];
                type2=param[i*8+9];
                coding=param[(i*8)+10];
                sampling=param[(i*8)+11];
                voice=param[(i*8)+12];
                voice2=param[(i*8)+13];
                op1=param[(i*8)+14];
                op2=param[(i*8)+15];
                var obj=new Object();
                obj.id=(i+1);
                obj.tp=type;
                obj.tp2=type2;
                obj.vc=voice;
                obj.vc2=voice2;
                obj.bm=coding;
                obj.cy=sampling;
                obj.o1=op1;
                obj.o2=op2;
                list.push(obj);
            }
            //alert("voiceList:"+JSON.stringify(list)); 
            saveList("voiceList",list);
        }
    } catch (e) {
        alertError("setAllVoice",e);
        return null;
    }
}

/*************************************************************
 *加载所有音频输出设置
 *@param paramList
 **************************************************************/
function loadAllData(paramList){
    try {
        var list=null;
        if(paramList==null){//数据不为空
            list=returnList("voiceList");
        }else{
            list=paramList;
        }
//		if(list==null){
//			return;
//		}
        var wl=returnList("ouputXml");
        if(list!=null&&wl!=null){
            for(var i=0;i<wl.length;i++){//排序
                for(var j=0;j<wl.length;j++){
                    if(parseInt(wl[i].num)<parseInt(wl[j].num)){
                        var obj=wl[i];
                        wl[i]=wl[j];
                        wl[j]=obj;
                    }
                }
            }
            var wd=restore(wl);
            for(var i=0;i<wd.length;i++){//删除漫游画中画，计算有多少个物理屏
                if(wd[i].active==1){
                    wd.splice(i,1);
                    i=0;
                }
            }
            var bs=(wd.length%2==0)?wd.length/2:parseInt(wd.length/2)+1;
            if(bs>list.length){//根据窗口添加数据
                var i=list.length;
                for(i;i<bs;i++){
                    var obj=new Object();
                    obj.id=wd[i].id;
                    obj.tp=1;
                    obj.tp2=1;
                    obj.vc=62;//声音默认值16*4
                    obj.vc2=62;//声音默认值16*4
                    obj.bm=1;
                    obj.cy=0;
                    obj.o1=1;
                    obj.o2=1;
                    list.push(obj);
                }
            }else if(bs<list.length){//根据窗口删除数据
                var i=bs;
                var l=list.length-bs;
                list.splice(i,l);
            }
            //	alert("se:"+JSON.stringify(se));
            var ckb="";
            var num="";
            var ypsc="";
            var bmgs="";
            var cyl="";
            $("#all_win li").remove();
            for(var i=0;i<list.length;i++){
                ckb='<span class="ckb"  ><span id="ckb_'+list[i].id+'" onclick="clickVoice(this)" class="ckb_img but_uncheck" >'+
                    '</span></span>';
                num='<span class="wup" >'+list[i].id+'</span>';
                ypsc='<span class="ypsc" ><select onchange="setVoiceType()"'+
                    'id="sc_'+list[i].id+'" class="asl scgs ">'+
                    '<option value="1">'+showJSTxt(paramJSTxt,100.1)+'</option><option value="0">'+showJSTxt(paramJSTxt,100.2)+'</option></select></span>';
                bmgs='<span class="bggs"><select onchange="setVoiceType()"'+
                    'id="bm_'+list[i].id+'" class="asl bmgs">'+
                    '<option value="1">G71A</option><option value="5">G71U</option><option value="0">ADPCMA</option>'+
                    '<option value="2">G726</option><option value="3">LPCM</option><option value="4">AAC</option></select></span>';
                cyl='<span class="cyl"><select onchange="setVoiceType()"'+
                    'id="cy_'+list[i].id+'"  class="asl cyl">'+
                    '<option value="0">8000Hz</option><option value="1">12000Hz</option>'+
                    '<option value="2">11025Hz</option><option value="3">16000Hz</option>'+
                    '<option value="4">22050Hz</option><option value="5">24000Hz</option>'+
                    '<option value="6">32000Hz</option><option value="7">44100Hz</option>'+
                    '<option value="8">48000Hz</option></select></span>';
                var li="<li class='win_div' id='win_div_"+list[i].id+"' >"+ckb+num+ypsc+bmgs+cyl+"</li>";
                $("#all_win").append(li);
                $("#sc_"+list[i].id).val(list[i].tp);
                $("#bm_"+list[i].id).val(list[i].bm);
                $("#cy_"+list[i].id).val(list[i].cy);
            }
        }

    } catch (e) {
        alertError("loadAllData",e);
    }
}

/********************************************
 * 发送输出预设值
 */
function setVoiceType(){
    try {
        if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
            return false;
        }
        var list=new Array();
        $(".win_div").each(function(){
            var obj=new Object();
            var id=this.id.substr(8);
            obj.id=parseInt(id);
            obj.tp=parseInt($("#sc_"+id).val());
            obj.tp2=parseInt($("#sc_"+id).val());
            obj.bm=parseInt($("#bm_"+id).val());
            obj.cy=parseInt($("#cy_"+id).val());
            list.push(obj);
        });
        var loginCode= returnSlist("loginCode");
        if(loginCode==null){
            loginCode=[0x00,0x00,0x00,0x00];
            //return;
        }
        var binary =new  Uint8Array(8+(list.length*4));//命令
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x0a,0x01);
        for(var i=0;i<list.length;i++){
            binary[8+(i*4)]=list[i].tp;
            binary[9+(i*4)]=list[i].tp2;
            binary[10+(i*4)]=list[i].bm;
            binary[11+(i*4)]=list[i].cy;
        }
        //alert("长度："+binary.length+"  数据："+JSON.stringify(binary));
        if(checkMes()){
            checkSend(binary);
        }else{
            upAlert(showJSTxt(paramJSTxt,1));
        }
    } catch (e) {
        alertError("setVoiceType",e);
    }
}

/*****************************************************
 * 一键修改选择的值
 */
function upAllVoice(){
    try {
        if(checkPagePower(showJSTxt(paramJSTxt,73),5)==false){
            return false;
        }
        var num=0;
        $(".ckb_img").each(function(){
            if($(this).attr("class")=="ckb_img but_check"){
                num++	;
            }
        });
        if(num==0){
            upAlert(showJSTxt(paramJSTxt,100.4));
            return;
        }

        var tp=$("#avt").val();//输出类型
        var bm=$("#abm").val();//编码格式
        var cy=$("#acy").val();//采样率
        var list=returnList("voiceList");
        $(".ckb_img").each(function(){
            if($(this).attr("class")=="ckb_img but_check"){
                var id=this.id.substr(4);
                $("#sc_"+id).val(tp);
                $("#bm_"+id).val(bm);
                $("#cy_"+id).val(cy);
                if(list!=null){
                    for(var i=0;i<list.length;i++){
                        if(list[i].id==id){
                            list[i].tp=tp;
                            list[i].bm=bm;
                            list[i].cy=cy;
                        }
                    }
                }
            }
        });
        setVoiceType();//发送修改的值
    } catch (e) {
        alertError("upAllVoice",e);
    }
}

/**********************************
 * 选择所有窗口输出效果
 * @param obj
 */
function selectAllVoice(obj){
    try {
        var bool=true;
        if($(obj).attr("class")=="but_check"){
            bool=false;
            $(obj).attr("class","but_uncheck");
        }else{
            bool=true;
            $(obj).attr("class","but_check");
        }
        if(bool==true){
            $(".ckb_img").attr("class","ckb_img but_check");
        }else{
            $(".ckb_img").attr("class","ckb_img but_uncheck");
        }
    } catch (e) {
        alertError("selectAllVoice",e);
    }
}

/******************************************************
 *登录向服务器发送获取所有音频设置命令
 ******************************************************/
function getAllVoiceData(){
    try {
        var loginCode= returnSlist("loginCode");
        if(loginCode==null){
            loginCode=[0x00,0x00,0x00,0x00];
            return;
        }
        var binary =new  Uint8Array(8);//命令
        binary = setCode(binary, loginCode, 0x00, 0x00, 0x0a,0x00);
        if(checkMes()){
            checkSend(binary);
            //	showMes("发送获取binary:"+JSON.stringify(binary),"red");
        }else{
            upAlert(showJSTxt(paramJSTxt,1));
        }
    } catch (e) {
        alertError("getAllVoiceData",e);
    }
}

/********************************************
 * 点击选择窗口
 * @param obj
 */
function clickVoice(obj){
    try {
        if($(obj).attr("class")=="ckb_img but_check"){
            $(obj).attr("class","ckb_img but_uncheck");
        }else{
            $(obj).attr("class","ckb_img but_check");
        }
        var num=0;
        $(".ckb_img").each(function(){
            if($(this).attr("class")=="ckb_img but_check"){
                num++	;
            }
        });
        if(num>0){
            $("#all_cim").attr("class","but_check");
        }else{
            $("#all_cim").attr("class","but_uncheck");
        }
    } catch (e) {
        alert("clickVoice",e);
    }
}

/***************************************************************************
 * 根据参数显示在消示框
 *
 * @param mes
 * @param color
 */
function $s(mes,color){
    try {
        var ID="show_mes";
        if(document.getElementById(ID)==null){
            return;
        }
        $("#"+ID).append("<span style='display:inline-block;height:20px; line-height:20px; word-wrap : break-word ; color:"+color+"; width:100%;'>"+mes+"</span>");
        var div = document.getElementById(ID);
        if(div!=null){
            div.scrollTop = div.scrollHeight;
        }else{
            div = document.getElementById(ID);
            div.scrollTop = div.scrollHeight;
        }
    } catch (e) {

    }

}

/***********************************
 * 获取当前的状态
 * @returns
 */
function $gt(){
    try {
        var type=localStorage.getItem("stream_type");
        if(type==null){//获取用户获取流媒体地址的类型
            type=0;
        }
        return type;
    } catch (e) {
        alertError("$gt",e);
    }
}

/**************************************************
 * 保存当前窗口显示的对应关系
 * @param ifoList
 * @param IOlist
 */
function showThisInput(IOlist){
    try {
        var dragList=new Array();
        if(IOlist==null){
            IOlist=new Array();
        }
        var number=0;
        for(var i=0;i<IOlist.length;i++){
            var obj = new Object();
            number++;
            obj.id = number;
            obj.outputId = IOlist[i].oi ;
            obj.inputId = IOlist[i].ii ;
            obj.gn= IOlist[i].gn;
            obj.di=(IOlist[i].di!=null)?IOlist[i].di:0;
            dragList.push(obj);
        }
//			showMes("dragList:"+JSON.stringify(dragList));
        saveList("dragList", dragList);
    } catch (e) {
        alertError("showThisInput",e);
    }
}
/*******************************************
 * 转换字符串为unicode
 * @param strings
 * @returns {String}
 */
var sp="\\";//拆分字符
function $zu(strings){
    try {
        var str="";
        if(strings!=""&&strings!=null){
            for(var i=0;i<strings.length;i++){
                if(str==""){
                    str+=""+escape(strings.substring(i,i+1));
                }else{
                    str+=sp+escape(strings.substring(i,i+1));
                }
            }
        }
        return str;
    } catch (e) {
        return "";
    }
}
/**********************************************
 * 转换unicode为字符串
 * @param unicode
 * @returns {String}
 */
function $zc(unicode){
    try {
        var str="";
        if(unicode!=""&&unicode!=null){
            if(unicode.indexOf(sp)!=-1){
                var codeList=unicode.split(sp);
                if(codeList!=null){
                    for(var i=0;i<codeList.length;i++){
                        if(codeList[i].indexOf("%")!=-1){
                            str+=unescape(codeList[i]);
                        }else{
                            str+=codeList[i];
                        }
                    }
                }
            }
        }

//			alert("转换后："+str);
    } catch (e) {
//			alert("错误："+e);
        return "";
    }
}
/*****************************
 * 随机数
 * @returns {String}
 */
function $r(){
    try {
        var domNum="";
        domNum=Math.random(); //随机数
        var myDate = new Date();
        domNum+= myDate.getSeconds();
        return domNum;
    } catch (e) {
        return null;
    }

}

/*************************************
 *16进制转换英文字符串
 */
function binToAscii(num) {
    var str1 = "";
    var str="";
    num=num.toString(2);
    if (typeof num != 'String') {
        str = num.toString();
    }
    var Hlong = Math.ceil(str.length / 8);
    for ( var i = 0; i < Hlong; i++) {
        str1 += String.fromCharCode(parseInt(str.substring(i * 8,(i + 1) * 8), 2));
    }
    return str1;

}

/*************************************************
 * 获取当前时间
 * @returns {___obj30}
 */
function getThisTime(){
    try {
        var month=null;
        var day=null;
        var hours=null;
        var minutes=null;
        var seconds=null;
        var millis=null;
        var myDate = new Date();
        year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        if (month.toString().length == 1) {
            month = "0" + month;
        }
        day = myDate.getDate(); //获取当前日(1-31)
        if (day.toString().length == 1) {
            day = "0" + day;
        }
        hours = myDate.getHours(); //获取当前小时数(0-23)  
        if (hours.toString().length == 1) {
            hours = "0" + hours;
        }
        minutes = myDate.getMinutes(); //获取当前分钟数(0-59) ]
        if (minutes.toString().length == 1) {
            minutes = "0" + minutes;
        }

        seconds = myDate.getSeconds(); //获取当前秒数(0-59)
        if (seconds.toString().length == 1) {
            seconds = "0" + seconds;
        }
        millis=myDate.getMilliseconds();  //获取当前毫秒数(0-999)
        if (millis.toString().length == 1) {
            millis = "00" + millis;
        }else if(millis.toString().length == 2){
            millis = "0" + millis;
        }
        var obj=new Object();
        obj.month=month;
        obj.day=day;
        obj.minutes=minutes;
        obj.seconds=seconds;
        obj.millis=millis;
        return obj;
    } catch (e) {
        alert("getTime",e);
    }
}


/************************************
 * @mes 新显示对应关系
 * @param str
 * @param winlist
 */
function  newSetIp(str,winlist){//
    try {
        var openNum=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//			showMes("对应关系开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis,"blue");
//			showMes("str:"+str);
        var li=null;
        try {
            if(str==null||str==""){
                li=new Array();
            }else{
                li=str.split(",");// 拆分字符串

            }
        } catch (e) {
            li=new Array();
        }
        var can = document.getElementById(LK_CANVAS);
        var scrnWidth = can.clientWidth;
        var scrnHeight = can.clientHeight;
        var ct = can.getContext("2d");
        var cxt =can.getContext("2d");
        var ctx =can.getContext("2d");
        var IO=new Array();// 建立一个参数数组,把拆分完的的数据放进去

        var ints=new Array();
        var alarm =new Array();
        var spObj=null;
        for(var i=0;i<li.length;i++){//拆分从系统获取的对应关系
            if(li[i].split(":").length>4){
                var obj=new Object();
//			showMes("li[i]:"+li[i]);
                spObj=li[i].split(":");
                obj.oi=spObj[0];//窗口号ID
                obj.ii=spObj[1];//输入源ID
                obj.gn=spObj[2];//通道号
                obj.tp=spObj[3];//类型
                obj.cd=spObj[4];//窗口输出状态  0=正常 ，2=输出已关闭，6=录像回放
                if(spObj[5]!=null){//警点号 0=无警 ，>0为警点号
                    try {
                        if(li[i].split(":")[5]!=null){//是否有警
                            obj.er=	li[i].split(":")[5];
                            if(obj.er!=0){
                                var alarmObj=new Object();
                                alarmObj.wi=obj.oi;
                                alarmObj.er=obj.er;
                                alarm.push(alarmObj);
                                ints.push(obj.er);
                            }

                        }else{
                            obj.er=	0;
                        }
                    } catch (e) {
                        showMes(""+e );
                    }
                }
                if(spObj[6]!=null){
                    /**********************
                     * @time 2016-12-16
                     * @mes 获取远程设备序列号
                     */
                    obj.di=spObj[6];//远程矩阵设备id号
                }

                IO.push(obj);
            }
        }
        IO=checkIO(IO);//检查对应关系的正确性
        showThisInput(IO);//保存当前显示的输入源
        //showMes("ints:"+ints);
        var ifo_list=returnList("IFOlist");
////		$("#ccc").append("<p class='tobudy' style='color:blue;width:100%;line-height:24px;display:block;'>同步对应关系："+JSON.stringify(ifo_list)+"</p>");
//		showMes("upIFOList:"+sessionStorage.getItem("upIFOList"));

        if(sessionStorage.getItem("upIFOList")==null){
            ifo_list=modifyIFO(ifo_list,IO);
            saveList("IFOlist",ifo_list);
        }
//		ifo_list=upifoList(ifo_list,IO);

//		/*********************
//		 * @time 2016-9-22
//		 * @mes 显示手机的对应关系在相应的窗口上
//		 * @begin
//		 */
//		var appToWin=returnSlist("appToWin");
//		if(appToWin!=null){
//			for(var i=0;i<appToWin.lenght;i++){
//				ifo_list.push(appToWin);
//			}
//		}
//		/*********************
//		 * @time 2016-9-22
//		 * @mes 显示手机的对应关系在相应的窗口上
//		 * @end
//		 */
        saveList("ints",ints);
        saveList("alarm",alarm);//
//		timeOutSP(ints);//调用报警提示灯。
        saveList("oiList",IO);
//			var endNum2=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//			showMes("对应关系开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算2："+(endNum2-openNum),"blue");
        var olist=new Array();
        if(winlist!=null){
            olist=winlist;
        }else{
            olist= returnList("ouputXml");
        }
        var dlist=returnList("decoderList");
        if(olist==null||dlist==null){
            return;
        }
        var dMap={};//输入源Map地图
        for(var i=0;i<dlist.length;i++){
            dMap["id"+dlist[i].id]=dlist[i];
        }
//		 showMes("dMap:"+JSON.stringify(dMap));
//		 showMes("IO:"+JSON.stringify(IO),"red");
//		 upAlert(olist.length+" "+dlist.length);
        if(olist.length!=0&&dlist.length!=0){
            for(var i=0;i<olist.length;i++){
                var x=0;
                var y=0;
                var ow=0;//当前窗口的宽度
                var oh=0;//当前窗口的高度
                if(olist[0].mt==null){//标准模式
                    ow=olist[i].x2-olist[i].x1;
                    oh=olist[i].y2-olist[i].y1;
                    x=parseFloat(olist[i].x1)+5;
                    y=parseFloat(olist[i].y2)-5;
                }else if(olist[0].mt==1){
                    ow=olist[i].mx2-olist[i].mx1;
                    oh=olist[i].my2-olist[i].my1;
                    x=parseFloat(olist[i].mx1)+5;
                    y=parseFloat(olist[i].my2)-5;
                }
                /**********************************************
                 * 窗口宽度少于40的时候，不显示对应关系在窗口上
                 */
                if(ow<40){
                    continue;
                }
//				   showMes(JSON.stringify(olist));
                for(var a=0;a<IO.length;a++){
                    if(IO[a].oi==olist[i].id){
                        var ip="";//输入源IP地址
                        var tp="";//输出分辨率
                        var ml="";//码流
                        var gn="0";//输入源的通道号
                        var grNum="";//输入源通道名称
                        grNum=IO[a].gn;
                        var er="0";
                        try {
                            if(IO[a].er!=null){
                                er=IO[a].er;
                            }else{
                                er="0";
                            }
                        } catch (e) {

                            //	showMes(""+e);
                        }
                        //查找对应关系的输入源有名称
//							showMes("list:"+JSON.stringify(IO)	,"red");
                        if(dMap!=null){
                            var decoder=dMap["id"+IO[a].ii];
                            var appDecoder=returnSlist("appList");//p2p输入源数组
//								showMes("appDecoder:"+JSON.stringify(appDecoder));
//								showMes(" decoder:"+JSON.stringify(decoder),"red");
                            if(decoder==null&&appDecoder!=null){
                                for(var b=0;b<appDecoder.length;b++){
                                    if(IO[a].ii==appDecoder[b].id){
                                        decoder=appDecoder[b];
                                        grNum=decoder.gn;
                                    }
                                }
                            }
                            if(grNum!=0&&decoder!=null){
//									showMes("aaaa");
                                try{
                                    var grName=null;
                                    if(decoder!=null){
                                        if(decoder.type==1){
                                            if(grNum!=null&&grNum!=""&&grNum!=0){
                                                if(grNum%2==0){
                                                    ml=showJSTxt(indexJSList,3);
                                                }else{
                                                    ml=showJSTxt(indexJSList,2);
                                                }
                                            }
                                            if(grNum%2==0){
                                                grNum=grNum/2;
                                            }else{
                                                grNum=parseInt(grNum/2)+1;
                                            }
                                            /*******************************
                                             * @tiem 2016-10-21
                                             * @mes 判断接收的对应关系和本地输入源内容不一致
                                             */
                                            if(decoder.grName!=null&&decoder.grName!=""&&decoder.grName.indexOf(",")!=-1){
                                                grName=decoder.grName.split(",");
                                                if(grName!=null&&grName.length>0){
                                                    gn=grName[(grNum-1)];
                                                    if(gn.indexOf("]")!=-1){
                                                        gn=gn.split("]")[1];
                                                    }
                                                    ip=decoder.name+"."+gn;
                                                }
                                            }
                                            ip=decoder.name;
                                        }else{
                                            ip=decoder.name+"."+showJSTxt(indexJSList,1)+grNum;
                                        }
                                    }
                                }catch (e) {
//										showMes("  拆分失败"+e+"  通道数量："+grNum);
                                }
                            }else if(decoder!=null){
//									showMes("bbbb");
                                ml="";
//									showMes("decoder:"+JSON.stringify(decoder));
                                if(decoder.name!=null){
                                    ip=decoder.name;
                                    var address=decoder.location;
//										showMes("ip:"+ip+" decoder.location:"+decoder.location);
                                    if(decoder.type==100){
                                        var d_type=address.substr(address.length-4,4);
//											showMes("d_type:"+d_type);


//											showMes("d_type:"+d_type+"  ip:"+ip);
                                        var d_type_name="";
                                        if(d_type=="fffe"){
                                            d_type_name=showJSTxt(utilJSTxt,94);
                                        }else if(d_type=="fffd"){
                                            d_type_name=showJSTxt(utilJSTxt,95);
                                        }else{
                                            d_type_name="测试用户";
                                        }
                                        ip+="【"+d_type_name+"】";
                                    }
                                }
//									showMes("ip:"+ip	);
                            }
                        }

                        //	showMes("fbl:"+localStorage.getItem("fblType"));
                        if(localStorage.getItem("fblType")==null||
                            localStorage.getItem("fblType")==0){
                            tp=IO[a].tp+ml;
                        }else{
                            tp="";
                        }


                        if(ow<75){//判断窗口的大小显示多大的内容

                            //ip=ip.substring(0, 1)+"...";
                            tp="";
                        }else  if(ow<120){
                            try {//自动适当的调整字符串大小
                                if(tp.indexOf("0*0")==-1&&tp.length>6){
                                    var tpWidth=tp.length*6+(tp.length-9)*6;
                                    var clean_width=parseInt(tpWidth-ow);
                                    //showMes("num:"+olist[i].num+" tpWidth:"+tpWidth+" clean_width:"+clean_width);
                                    if(clean_width>0){
                                        var clean_num=parseInt((clean_width%6==0)?clean_width/6:clean_width/6+1);
                                        tp=tp.substring(0, tp.length-clean_num);
                                    }
                                }
                            } catch (e) {

                                //showMes("e:"+e);
                            }
//						    	if(gn!=0){
//						    			ip=ip.substring(0, 5)+"...";
//						    	}else{
//						    			ip=ip.substring(0, 5)+"...";
//						    	}
                        }
                        if(ow>40){
//					    		showMes("删除前id:"+ip);
                            var nameWidth=ip.length*6+12+9;
//					    		showMes("nameWidth:"+nameWidth);
                            var clean_w=parseInt(nameWidth-ow);
                            if(clean_w>0){
                                var clean_n=parseInt((clean_w%6==0)?clean_w/6:clean_w/6+1);
                                ip=ip.substring(0, ip.length-clean_n)+"...";
                            }
//						    	showMes("删除后id:"+ip);
                        }
//					    	upAlert(IO[a].ii+" "+IO[a].tp+" "+x+" "+y);
                        ct.font = "10px 宋体";
                        ct.lineWidth = 1;
                        if(er!=null&&er!=0){
                            ct.fillStyle = "red";//
                            ct.fillText(ip, x, y);
                            if(oh>20){//判断高度是否足够
                                if(IO[a].cd==2){//输出已经关闭的情况下
                                    if(ow>80){
                                        //	ct.fillText(tp+"  "+showJSTxt(indexJSList,23), x, (y-15));
                                        ct.fillText(showJSTxt(indexJSList,23), x, (y-15));
                                    }else if(ow>40&&ow<80){
                                        //	ct.fillText(tp+"  "+showJSTxt(utilJSTxt,69), x, (y-15));
                                        ct.fillText(showJSTxt(utilJSTxt,69), x, (y-15));
                                    }
                                }else{
                                    ct.fillText(tp, x, (y-15));
                                }
                                if(oh>35){
                                    ct.fillText("A"+er, x, (y-25));
                                }
                            }
                        }else{
                            if(IO[a].cd=="1"){
                                ct.fillStyle = "red";// 颜色红色
                            }else if(IO[a].cd=="2"||IO[a].cd=="4"){
                                ct.fillStyle = "blue";// 颜色蓝色
                            } else{
                                ct.fillStyle = "white";// 颜色白色
                            }
                            ct.fillText(ip, x, y);
                            if(oh>20){//判断高度是否足够
                                if(IO[a].cd==2){
                                    if(ow>80){
                                        //ct.fillText(tp+"  "+showJSTxt(indexJSList,23), x, (y-15));
                                        ct.fillText(showJSTxt(indexJSList,23), x, (y-15));
                                    }else if(ow>40&&ow<80){
                                        //ct.fillText(tp+"  "+showJSTxt(utilJSTxt,69), x, (y-15));
                                        ct.fillText(showJSTxt(utilJSTxt,69), x, (y-15));
                                    }
                                }else if(IO[a].cd==4){
                                    if(ow<120){
                                        ct.fillText(tp, x, (y-15));
                                    }else{
                                        ct.fillText(tp+" "+showJSTxt(js_1,45), x, (y-15));
                                    }

                                }else{
                                    ct.fillText(tp, x, (y-15));
                                }
                            }
                        }
                    }
                }
            }
        }
//		  var endNum3=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//			showMes("对应关系开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算3："+(endNum3-openNum),"blue");
        countSize(olist);//运行窗口解码能力
//		var endNum3=parseInt(getThisTime().seconds)*1000+parseInt(getThisTime().millis);
//		showMes("对应关系开始："+getThisTime().minutes+"-"+ getThisTime().seconds+"-"+getThisTime().millis+"  总计算4："+(endNum3-openNum),"blue");
    } catch (e) {

        if(isPhone()){
            showMes("newSetIp method error:"+e,"red","log");
        }else{
            showMes("newSetIp method error:"+e);
        }

    }


}



var loginList=null;
var indexTXTList=null;
var inputTXTList=null;
var paramTXTList=null;
var loginJSList=null;
var indexJSList=null;
var inputJSList=null;
var paramJSTxt=null;
var utilJSTxt=null;
var jsTxt=null;
var js_1=null;
var js_2=null;//流媒体
var txt_type=0;
/************************************
 * 设置网页显示的文字
 * @param paramList
 */
function loadTxt(paramList){
    try {
        txt_type=localStorage.getItem("txtType");
        if(txt_type==null||txt_type==""){
            txt_type=0;
        }
        var value="";
        for(var i=0;i<paramList.length;i++){
            if(txt_type==0){
                value=paramList[i].C_val;
            }else if(txt_type==1){
                value=paramList[i].E_val;
                if(value==""){
                    value=paramList[i].C_val;
                }
            }else if(txt_type==2){
                value=paramList[i].F_val;
                if(value==""){
                    value=paramList[i].C_val;
                }
            }
            if(paramList[i].type=="value"){
                $("#"+paramList[i].id).val(value);
            }else if(paramList[i].type=="html"){
                $("#"+paramList[i].id).html(value);
            }else if(paramList[i].type=="title"){
                $("#"+paramList[i].id).attr("title",value);
            }else if(paramList[i].type=="placeholder"){
                $("#"+paramList[i].id).attr("placeholder",value);
            }
        }
    } catch (e) {
        // TODO: handle exception
        alertError("加载语言错误",e);
    }

}
/******************************************
 * 简化获取数组的文字方法
 * @param list
 * @param number
 * @returns
 *
 */
function $st(list,number){
    try {
        return showJSTxt(list,number);
    } catch (e) {
        alertError("$st",e);
    }
}

/******************************************
 * 获取数组的文字
 * @param list
 * @param number
 * @returns
 */
function showJSTxt(list,number){
    try {
        //	alert("number:"+number);
        txt_type=localStorage.getItem("txtType");
        if(txt_type==null||txt_type==""){
            txt_type=0;
        }
        var value="";
        for(var i=0;i<list.length;i++){
            if(list[i].id==number){
                if(txt_type==0){
                    value=list[i].C_val;
                    return value;
                }else if(txt_type==1){
                    value=list[i].E_val;
                    if(value==""){
                        value=list[i].C_val;
                    }
                    return value;
                }else if(txt_type==2){
                    value=list[i].F_val;
                    if(value==""){
                        value=list[i].C_val;
                    }
                    return value;
                }
            }
        }
        return "提示：操作完成。";
    } catch (e) {
        // TODO: handle exception
        //alert(e);
    }

}



indexJSList=[
    {"id":"0.1","E_val":"Current window display input source：","F_val":"當前窗口顯示的輸入源：","C_val":"当前窗口显示的输入源："},
    {"id":"1","E_val":"Chnanl","F_val":"通道","C_val":"通道"},
    {"id":"2","E_val":"Main Stream","F_val":"主碼流","C_val":"主码流"},
    {"id":"3","E_val":"Sub Stream","F_val":"子碼流","C_val":"子码流"},
    {"id":"4","E_val":"Custom Mode","F_val":"自訂模式","C_val":"自定义模式"},
    {"id":"5","E_val":"Custom Scrn","F_val":"自訂視窗大小和位置","C_val":"自定义窗口大小和位置"},
    {"id":"6","E_val":"STD Mode","F_val":"標準模式","C_val":"标准模式"},
    {"id":"7","E_val":"The window size and position are allocated by system","F_val":"系統分配視窗大小和位置","C_val":"系统分配窗口大小和位置"},
    {"id":"8","E_val":"Splitting Failure","F_val":"拆分失敗","C_val":"拆分失败"},
    {"id":"9","E_val":"Channel Number","F_val":"通道數量","C_val":"通道数量"},
    {"id":"10","E_val":"News：Rows and columns must greater than 1.","F_val":"提示：行數和列數必須大於一","C_val":"提示：行数和列数必须大于一"},
    {"id":"11","E_val":"News：Please select a pixel.","F_val":"提示：請選擇解析度。","C_val":"提示：请选择分辨率。"},
    {"id":"12","E_val":"News：Please select the number of rows.","F_val":"提示：請選擇初始化的行數。","C_val":"提示：请选择初始化的行数。"},
    {"id":"13","E_val":"News：Please select the number of columns.","F_val":"提示：請選擇初始化的列數。","C_val":"提示：请选择初始化的列数。"},
    {"id":"14","E_val":"News：The server is busy,please wait...","F_val":"提示：伺服器正在忙，請稍後...","C_val":"提示：服务器正在忙，请稍后..."},
    {"id":"15","E_val":"News：Roaming window cannot be enlarge in single screen enlarge mode.","F_val":"提示：漫遊不能單屏放大.","C_val":"提示：漫游不能单屏放大."},
    {"id":"16","E_val":"News：Splicing window can't be enlarge in single screen enlarge mode.","F_val":"提示：拼接屏不能進行雙擊單屏放大。","C_val":"提示：拼接屏不能进行双击单屏放大。"},
    {"id":"17","E_val":"News：The screen which is not splited don't need to enlarge in single screen enlarge mode.","F_val":"提示：未拆分的物理屏不需要雙擊單屏放大。","C_val":"提示：未拆分的物理屏不需要双击单屏放大。"},
    {"id":"18","E_val":"News：window has changed, please update.","F_val":"提示：輸出視窗已發生變化，請同步數據再進行操作！","C_val":"提示：输出窗口已发生变化，请同步数据再进行操作！"},
    {"id":"19","E_val":"","F_val":"提示:請關閉導航器，再進行雙擊放大效果","C_val":"提示:请关闭导航器，再进行双击放大效果"},
    {"id":"20","E_val":"Window is under a state of double-click amplification  in the window  please double click exit amplification state operation again.","F_val":"提示：視窗正處於雙擊放大模式,請在視窗雙擊滑鼠退出放大模式再操作。","C_val":"提示：窗口正处于双击放大模式,请在窗口双击鼠标退出放大模式再操作。"},
    {"id":"21","E_val":"Normal","F_val":"正常","C_val":"正常"},
    {"id":"22","E_val":"Unnormal","F_val":"不正常","C_val":"不正常"},
    {"id":"23","E_val":"Output Closed","F_val":"輸出已關閉","C_val":"输出已关闭"},
    {"id":"24","E_val":"Window","F_val":"輸出視窗","C_val":"输出窗口"},
    {"id":"25","E_val":"State","F_val":"狀態","C_val":"状态"},
    {"id":"26","E_val":"Input Name","F_val":"設備名稱","C_val":"设备名称"},
    {"id":"27","E_val":"Input IP","F_val":"設備IP","C_val":"设备IP"},
    {"id":"28","E_val":"Channel","F_val":"通道號","C_val":"通道号"},
    {"id":"29","E_val":"Pixel","F_val":"解析度","C_val":"分辨率"},
    {"id":"29.5","E_val":"Bit Rate","F_val":"碼率","C_val":"码率"},

    {"id":"30","E_val":"Error：Merge failed.","F_val":"提示：合併失敗，該規則不能合併。","C_val":"提示：合并失败，该规则不能合并。"},
    {"id":"31","E_val":"Error：The windows want to be merged are not the save size.","F_val":"提示：合併的視窗大小不一致。","C_val":"提示：合并的窗口大小不一致。"},
    {"id":"32","E_val":"Error：Split failed.","F_val":"提示：拆分失敗，該規則不能拆分。","C_val":"提示：拆分失败，该规则不能拆分。"},
    {"id":"33","E_val":"Current Mode","F_val":"當前模式","C_val":"当前模式"},
    {"id":"34","E_val":"Split failed, the window number out of range.","F_val":"提示：拆分失敗,視窗數量超出範圍!","C_val":"提示：拆分失败,窗口数量超出范围!"},
    {"id":"35","E_val":"News：Only roaming and PIP window can be deleted.","F_val":"提示：只能刪除漫遊、畫中畫窗","C_val":"提示：只能删除漫游、画中画窗"},
    {"id":"36","E_val":"News：Can't reset multiple Windows at same time.","F_val":"提示：不能同時對多個視窗進行重置。","C_val":"提示：不能同时对多个窗口进行重置。"},
    {"id":"37","E_val":"News：Roaming and PIP window can't be reset.","F_val":"提示：漫遊、畫中畫視窗不能進行重置。","C_val":"提示：漫游、画中画窗口不能进行重置。"},
    {"id":"38","E_val":"News：Please select a splited window.","F_val":"提示：請選擇拆分的視窗。","C_val":"提示：请选择拆分的窗口。"},
    {"id":"39","E_val":"News：Please select the rows and columns.","F_val":"提示：請選擇拆分的行和列的數。","C_val":"提示：请选择拆分的行和列的数。"},
    {"id":"40","E_val":"Please select a splited window.","F_val":"提示：請選擇拆分的視窗。","C_val":"提示：请选择拆分的窗口。"},
    {"id":"41","E_val":"Split","F_val":"拆分","C_val":"拆分"},
    {"id":"42","E_val":"Error：Roaming and PIP window can't be splited.","F_val":"提示：漫遊、畫中畫視窗不能進行拆分。","C_val":"提示：漫游、画中画窗口不能进行拆分。"},
    {"id":"43","E_val":"Merge","F_val":"合併","C_val":"合并"},
    {"id":"44","E_val":"News：Roaming and PIP window cannot be merged.","F_val":"提示：漫遊畫中畫視窗不能進行合併。","C_val":"提示：漫游画中画窗口不能进行合并。"},
    {"id":"45","E_val":"News：Please press the 'Ctrl' key and select merge.","F_val":"提示：請按住Ctrl鍵點擊左鍵選擇合併。","C_val":"提示：请按住Ctrl键点击左键选择合并。"},
    {"id":"46","E_val":"Delete PIP","F_val":"刪除畫中畫、漫遊","C_val":"删除画中画、漫游"},
    {"id":"47","E_val":"Reset Screen","F_val":"重置螢幕","C_val":"重置屏幕"},
    {"id":"48","E_val":"Open Output","F_val":"啟動視窗輸出","C_val":"启动窗口输出"},
    {"id":"49","E_val":"Close Output","F_val":"停止視窗輸出","C_val":"停止窗口输出"},
    {"id":"50","E_val":"Open Tour","F_val":"啟動視窗循環","C_val":"启动窗口轮巡"},
    {"id":"51","E_val":"Close Tour","F_val":"停止視窗循環","C_val":"停止窗口轮巡"},
    {"id":"52","E_val":"Search Input","F_val":"搜尋輸入源","C_val":"搜索输入源"},
    {"id":"53","E_val":"Channel Manage","F_val":"通道管理","C_val":"通道管理"},
    {"id":"54","E_val":"Size","F_val":"尺寸","C_val":"尺寸"},
    {"id":"55","E_val":"Modify","F_val":"修改","C_val":"修改"},
    {"id":"56","E_val":"Delete","F_val":"刪除","C_val":"删除"},
    {"id":"57","E_val":"Add","F_val":"添加","C_val":"添加"},
    {"id":"58","E_val":"News：Please select a window.","F_val":"提示：請選擇輸出通道！","C_val":"提示：请选择输出通道！"},
    {"id":"59","E_val":"News：Did not find the input source, please input data in the input page.","F_val":"提示：未查找到輸入源，請到輸入頁面輸入數據。","C_val":"提示：未查找到输入源，请到输入页面输入数据。"},
    {"id":"60","E_val":"Please Select","F_val":"請選擇","C_val":"请选择"},
    {"id":"61","E_val":"News：Please select a camera.","F_val":"提示：請選擇操作的攝像機。","C_val":"提示：请选择操作的摄像机。"},
    {"id":"62","E_val":"Open PIP","F_val":"開啟添加視窗","C_val":"开启添加窗口"},
    {"id":"63","E_val":"There is no related data finded","F_val":"沒有搜尋到相關數據","C_val":"没有搜索到相关数据"},
    {"id":"64","E_val":"News：window can't overlap.","F_val":"提示：移動視窗不能重疊","C_val":"提示：移动窗口不能重叠"},
    {"id":"65","E_val":"Window","F_val":"視窗","C_val":"窗口"},
    {"id":"66","E_val":"Old Number","F_val":"舊視窗號","C_val":"旧窗口号"},
    {"id":"67","E_val":"News：Window number can't be empty.","F_val":"提示：視窗號不能為空。","C_val":"提示：窗口号不能为空。"},
    {"id":"68","E_val":"News：Window number is repeated.","F_val":"提示：視窗號存在重複。","C_val":"提示：窗口号存在重复。"},
    {"id":"69","E_val":"News：Window number is changed! Continue to operate channel management?","F_val":"提示：視窗號修改成功!是否繼續操作通道管理?","C_val":"提示：窗口号修改成功!是否继续操作通道管理?"},
    {"id":"70","E_val":"Shut PIP","F_val":"關閉添加視窗","C_val":"关闭添加窗口"},
    {"id":"71","E_val":"News：Standard mode window can not add roaming window.","F_val":"提示：標準模式視窗不能添加漫遊視窗。","C_val":"提示：标准模式窗口不能添加漫游窗口。"},
    {"id":"72","E_val":"News：Window conflict with other roaming or PIP window.","F_val":"提示：視窗與其他的漫遊或者畫中畫衝突。","C_val":"提示：窗口与其他的漫游或者画中画冲突。"},
    {"id":"73","E_val":"Error：PIP or roaming window cross the border.","F_val":"提示：畫中畫、漫遊視窗已越界。","C_val":"提示：画中画、漫游窗口已越界。"},
    {"id":"74","E_val":"Current Position","F_val":"當前位置","C_val":"当前位置"},
    {"id":"75","E_val":"Window","F_val":"視窗","C_val":"窗口"},
    {"id":"76","E_val":"Add Input Channel","F_val":"添加輸入通道","C_val":"添加输入通道"},
    {"id":"77","E_val":"News：Please select the input source which need to be set.","F_val":"提示：請選擇需要設定的輸入源。","C_val":"提示：请选择需要设置的输入源。"},
    {"id":"78","E_val":"Set the same time interval for multiple Inputs.","F_val":"多個輸入源進行同樣的時間間隔設定","C_val":"多个输入源进行同样的时间间隔设置"},
    {"id":"79","E_val":"Time segment and time interval can be set at the same time.","F_val":"時間間隔與時間段兩種設定可以同時填寫","C_val":"时间间隔与时间段两种设置可以同时填写"},
    {"id":"80","E_val":"News：Please set input source for output.","F_val":"提示：請對輸入源進行輸出設定。","C_val":"提示：请对输入源进行输出设置。"},
    {"id":"81","E_val":"News：The format of time tnterval is error.","F_val":"提示：時間間隔格式不正確。","C_val":"提示：时间间隔格式不正确。"},
    {"id":"82","E_val":"News：Please close the navigator and open the custom Settings again.","F_val":"提示：請關閉導航器再打開自訂視窗設定。","C_val":"提示：请关闭导航器再打开自定义窗口设置。"},
    {"id":"83","E_val":"News：Please close the custom Settings then open the navigator.","F_val":"提示：請關閉自訂視窗設定再打開導航器。","C_val":"提示：请关闭自定义窗口设置再打开导航器。"},
    {"id":"84","E_val":"News：The input source group does not have any input source.","F_val":"提示：該輸入組沒有輸入源。","C_val":"提示：该输入组没有输入源。"},
    {"id":"85","E_val":"News：Window is under the state of double-click amplification mode, please double click left key of mouse to exit this mode at first.","F_val":"提示：視窗正處於雙擊放大模式,請在視窗雙擊滑鼠退出放大模式再操作。","C_val":"提示：窗口正处于双击放大模式,请在窗口双击鼠标退出放大模式再操作。"},
    {"id":"86","E_val":"News：Input is null.","F_val":"提示：輸入源為空！","C_val":"提示：输入源为空！"},
    {"id":"87","E_val":"News：Window has changed, please click update first.","F_val":"提示：輸出視窗已發生變化，請同步數據再進行操作！","C_val":"提示：输出窗口已发生变化，请同步数据再进行操作！"},
    {"id":"88","E_val":"News：Multiple Windows can't switch the camera at the same time.","F_val":"提示：多個視窗不能進行攝像機切換。","C_val":"提示：多个窗口不能进行摄像机切换。"},
    {"id":"89","E_val":"News：Please select a window.","F_val":"提示：請選擇視窗。","C_val":"提示：请选择視窗。"},
    {"id":"90","E_val":"News：No mode can be covered  please create a new mode.","F_val":"提示：沒有模式可覆蓋，請新增。","C_val":"提示：没有模式可覆盖，请新增。"},
    {"id":"91","E_val":"News：Please input mode name.","F_val":"提示：請輸入模式名。","C_val":"提示：请输入模式名。"},
    {"id":"92","E_val":"News：Please select a mode to cover.","F_val":"提示：請選擇覆蓋的模式。","C_val":"提示：请选择覆盖的模式。"},
    {"id":"93","E_val":"News：Please close the navigator and then to switch mode.","F_val":"提示：請關閉導航器,再進行模式切換功能。","C_val":"提示：请关闭导航器,再进行模式切换功能。"},
    {"id":"94","E_val":"News：Whether to switch this mode?","F_val":"提示框：是否切換到該模式？","C_val":"提示框：是否切换到该模式？"},
    {"id":"95","E_val":"TW","F_val":"有警","C_val":"有警"},
    {"id":"96","E_val":"New Number","F_val":"新視窗號","C_val":"新窗口号"},
    {"id":"97","E_val":"News：Is alarming, not allowed to change window.","F_val":"提示：觸發報警下不能進行視窗操作。","C_val":"提示：触发报警下不能进行窗口操作。"},
    {"id":"98","E_val":"Mode Manage","F_val":"模式轮巡管理","C_val":"模式轮巡管理"},
    {"id":"99","E_val":"Replay","F_val":"錄影回放管理","C_val":"录像回放管理"},
    {"id":"100","E_val":"Last(Manual Tour)","F_val":"上一個","C_val":"上一个"},
    {"id":"101","E_val":"Next(Manual Tour)","F_val":"下一個","C_val":"下一个"},
    {"id":"102","E_val":"Keyboard “↑” Button","F_val":"電腦鍵盤“↑”鍵","C_val":"电脑键盘“↑”键"},
    {"id":"103","E_val":"Keyboard “↓” Button","F_val":"電腦鍵盤“↓”鍵","C_val":"电脑键盘“↓”键"},
    {"id":"103.1","E_val":"News：Don't allow multiple windows to output audio at the same time.","F_val":"提示：不能同時控制多個視窗音訊輸出.","C_val":"提示：不能同时控制多个窗口音频输出."},
    {"id":"103.2","E_val":"News：Please select a window to output audio.","F_val":"提示：請選擇一個視窗進行音訊輸出.","C_val":"提示：请选择一个窗口进行音频输出."},
    {"id":"103.3","E_val":"Name","F_val":"名稱","C_val":"名称"},
    {"id":"103.4","E_val":"Address","F_val":"地址","C_val":"地址"},
    {"id":"103.5","E_val":"S/N","F_val":"序號","C_val":"序号"},
    {"id":"103.6","E_val":"Name","F_val":"名稱","C_val":"名称"},
    {"id":"104","E_val":"Clean Input","F_val":"清空視窗","C_val":"清空窗口"},
    {"id":"105","E_val":"News:Please select a window to clean the input source","F_val":"提示：請選擇視窗進行清空視窗的輸入源。","C_val":"提示：请选择窗口进行清空窗口的输入源。"},
    {"id":"106","E_val":"News:Window is not initialized.","F_val":"提示：尚未初始化視窗，請進行視窗初始化操作。","C_val":"提示：尚未初始化窗口，请进行窗口初始化操作。"},
    {"id":"107","E_val":"News:Clean currently selected window's input source?","F_val":"提示:是否清空當前選擇視窗的輸入源？","C_val":"提示:是否清空当前选择窗口的输入源？"},
    {"id":"108","E_val":"News:The video file cannot be search many days","F_val":"提示:不能進行跨天查詢錄影檔？","C_val":"提示：不能进行跨天查询录像文件。"},
    {"id":"109","E_val":"News:Switch video failed,plate	beyond the decoding ability.","F_val":"提示:切換圖像失敗，當前板卡已經超出解碼能力。","C_val":"提示：切换图像失败，当前板卡已经超出解码能力。"}

];
paramJSTxt=[{"id":"1","E_val":"News：The server is busy, please later...","F_val":"提示：伺服器正在忙，請稍後...","C_val":"提示：服务器正在忙，请稍后..."},
    {"id":"1.5","E_val":"News：Serial number has been copied","F_val":"提示：序列號已複製","C_val":"提示：序列号已复制"},
    {"id":"2","E_val":"Error：Operation failure.","F_val":"提示：操作失敗","C_val":"提示：操作失败"},
    {"id":"3","E_val":"Error：Add failure","F_val":"提示：添加失敗","C_val":"提示：添加失败"},
    {"id":"4","E_val":"Error：Update failure.","F_val":"提示：修改失敗","C_val":"提示：修改失败"},
    {"id":"5","E_val":"Error：Delete failure.","F_val":"提示：刪除失敗","C_val":"提示：删除失败"},
    {"id":"6","E_val":"Modify","F_val":"修     改","C_val":"修     改"},
    {"id":"7","E_val":"Delete","F_val":"刪     除","C_val":"删     除"},
    {"id":"8","E_val":"Twice input password is not the same","F_val":"兩次輸入密碼不相同","C_val":"两次输入密码不相同"},
    {"id":"9","E_val":"Cannot null","F_val":"不能為空","C_val":"不能为空"},
    {"id":"10","E_val":"Length fond can't bigger than 16 and special character is not allowed.","F_val":"字元不能大於16位元,不能有特殊符號","C_val":"字符不能大于16位,不能有特殊符号"},
    {"id":"11","E_val":"News：Whether to restart?","F_val":"提示框：是否重啟設備？","C_val":"提示框：是否重启设备？"},
    {"id":"12","E_val":"News：Please login","F_val":"提示：尚未登錄","C_val":"提示：尚未登录"},
    {"id":"13","E_val":"News：No permission to restart.","F_val":"提示：您沒有許可權重啟設備。","C_val":"提示：您没有权限重启设备。"},
    {"id":"14","E_val":"News：Whether to restore factory settings?  ","F_val":"提示框：是否複位出廠值設定？","C_val":"提示框：是否复位出厂值设置？"},
    {"id":"15","E_val":"News：No permission to restore factory settings.","F_val":"提示：你沒有許可權複位出廠值設定。","C_val":"提示：你没有复位出厂值设置。"},
    {"id":"16","E_val":"Error：Address error.","F_val":"提示：地址不正確","C_val":"提示：地址不正确"},
    {"id":"17","E_val":"News：IP address already exists.","F_val":"提示：IP地址已存在","C_val":"提示：IP地址已存在"},
    {"id":"18","E_val":"News：Network segment already exists.","F_val":"提示：該網段已存在","C_val":"提示：该网段已存在"},
    {"id":"19","E_val":"IP Address ","F_val":"IP地址(I)","C_val":"IP地址(I)"},
    {"id":"20","E_val":"Subnet Mask ","F_val":"子網掩碼(U)","C_val":"子网掩码(U)"},
    {"id":"21","E_val":"Error： Length error","F_val":"提示：長度不正確","C_val":"提示：长度不正确"},
    {"id":"22","E_val":"Primary Device","F_val":"主解碼器","C_val":"主解码器"},
    {"id":"23","E_val":"Connect","F_val":"連  接","C_val":"连  接"},
    {"id":"24","E_val":"slave Device","F_val":"從解碼器","C_val":"从解码器"},
    {"id":"25","E_val":"Error：Find no device or user name or password error.","F_val":"提示：沒有找到設備,或者使用名和密碼錯誤。","C_val":"提示：没有找到设备,或者用户名和密码错误。"},
    {"id":"26","E_val":"Name is null","F_val":"設備名不能為空","C_val":"设备名不能为空"},
    {"id":"27","E_val":"Input device number","F_val":"請輸入設備編號","C_val":"请输入设备编号"},
    {"id":"28","E_val":"Number already exists","F_val":"該設備編號已存在","C_val":"该设备编号已存在"},
    {"id":"29","E_val":"Input name","F_val":"請輸入使用名","C_val":"请输入用户名"},
    {"id":"30","E_val":"Input password","F_val":"請輸入密碼","C_val":"请输入密码"},
    {"id":"31","E_val":"Input device IP","F_val":"請輸入設備IP","C_val":"请输入设备IP"},
    {"id":"32","E_val":"Please input device number","F_val":"請輸入設備號碼","C_val":"请输入设备号码"},
    {"id":"33","E_val":"Please input device namse","F_val":"請輸入設備名稱","C_val":"请输入设备名称"},
    {"id":"34","E_val":"Please input old password","F_val":"請輸入舊密碼","C_val":"请输入旧密码"},
    {"id":"35","E_val":"Please input new password","F_val":"請輸入新密碼","C_val":"请输入新密码"},
    {"id":"36","E_val":"Error：Data error","F_val":"提示：數據不正確","C_val":"提示：数据不正确"},
    {"id":"37","E_val":"Error：Browser does not support sending files.","F_val":"提示：該流覽器不支持發送檔","C_val":"提示：该浏览器不支持发送文件"},
    {"id":"38","E_val":"News：Please select file","F_val":"提示：請選擇升級檔","C_val":"提示：请选择升级文件"},
    {"id":"39","E_val":"Error：Output file error. ","F_val":"提示：輸出檔異常，請重新下載或者聯繫客服。","C_val":"提示：输出文件异常，请重新下载或者联系客服。"},
    {"id":"40","E_val":"Error：Gorup file error.","F_val":"提示：分組檔異常，請重新下載或者聯繫管理員。","C_val":"提示：分组文件异常，请重新下载或者联系管理员。"},
    {"id":"41","E_val":"Error：Input to output data error.","F_val":"提示：對應關係檔異常，請重新下載或者聯繫管理員。","C_val":"提示：对应关系文件异常，请重新下载或者联系管理员。"},
    {"id":"42","E_val":"Error：Mode date error.","F_val":"提示：模式檔異常，請重新下載或者聯繫管理員。","C_val":"提示：模式文件异常，请重新下载或者联系管理员。"},
    {"id":"43","E_val":"Error：Get data error.","F_val":"提示：返回錯誤","C_val":"提示：返回错误"},
    {"id":"44","E_val":"News：Import success.","F_val":"提示：導入成功","C_val":"提示：导入成功"},
    {"id":"45","E_val":"News：Do you update IP address","F_val":"是否將IP地址修改為","C_val":"是否将IP地址修改为"},
    {"id":"46","E_val":"IP Address","F_val":"IP地址","C_val":"IP地址"},
    {"id":"47","E_val":"Subnet Mask","F_val":"子網掩碼","C_val":"子网掩码"},
    {"id":"48","E_val":"Gateway","F_val":"網關地址","C_val":"网关地址"},
    {"id":"49","E_val":"Preferred DNS","F_val":"首選DNS伺服器","C_val":"首选DNS服务器"},
    {"id":"50","E_val":"Alternate DNS","F_val":"備用DNS伺服器","C_val":"备用DNS服务器"},
    {"id":"51","E_val":"Error：Subnet mask error.","F_val":"提示：子網掩碼格式不正確","C_val":"提示：子网掩码格式不正确"},
    {"id":"52","E_val":"Error：Gateway error.","F_val":"提示：網關地址不正確","C_val":"提示：网关地址不正确"},
    {"id":"53","E_val":"News：Import success.","F_val":"提示：導入成功,設備將重新啟動,請重新登錄","C_val":"提示：导入成功,设备将重新启动,请重新登录"},
    {"id":"54","E_val":"Error：Set IP address failed. ","F_val":"提示：IP地址設定失敗","C_val":"提示：IP地址设置失败"},
    {"id":"55","E_val":"Error：System file error.","F_val":"提示：系統檔已失效","C_val":"提示：系统文件已失效"},
    {"id":"56","E_val":"Error：Upgrade failed.","F_val":"提示：升級檔超時！請檢查網路或者檔。","C_val":"提示：升级文件超时！请检查网络或者文件。"},
    {"id":"57","E_val":"News：Upgrade successful, please login again.","F_val":"提示：系統已升級，請重新登錄！","C_val":"提示：系统已升级，请重新登录！"},
    {"id":"58","E_val":"News：Upgrade success. please clear cache of browser and login again.","F_val":"提示：設備已升級，請您清理流覽器流覽緩存然後重新登錄。","C_val":"提示：设备已升级，请您清理浏览器浏览缓存然后重新登录。"},
    {"id":"59","E_val":"News：Upgrade success.","F_val":"提示：介面檔升級成功。","C_val":"提示：界面文件升级成功。"},
    {"id":"60","E_val":"Error：Upgrade failed.","F_val":"提示：升級失敗，是否重新升級？","C_val":"提示：升级失败，是否重新升级？"},
    {"id":"61","E_val":"News：Please confirm the file is correct, otherwise device will crash.","F_val":"提示：請檢查系統升級檔是否正確，如果檔錯誤可能導致系統出錯。","C_val":"提示：请检查系统升级文件是否正确，如果文件错误可能导致系统出错。"},
    {"id":"62","E_val":"News：Please confirm the file is correct, otherwise web page will error?","F_val":"提示：請檢查流覽器升級檔是否正確，如果檔錯誤可能導致網頁顯示出錯。","C_val":"提示：请检查浏览器升级文件是否正确，如果文件错误可能导致网页显示出错。"},
    {"id":"63","E_val":"News：Please confirm the file is correct, otherwise local UI will crash?","F_val":"提示：請檢查流覽器升級檔是否正確，如果檔錯誤可能導致鍵盤操作失敗。","C_val":"提示：请检查浏览器升级文件是否正确，如果文件错误可能导致键盘操作失败。"},
    {"id":"64","E_val":"Error：Please select the correct file.","F_val":"提示：請選擇正確的檔。","C_val":"提示：请选择正确的文件。"},
    {"id":"65","E_val":"Error：Please fill in the correct data.","F_val":"提示：請填入正確的數據。","C_val":"提示：请填入正确的数据。"},
    {"id":"66","E_val":"News：Add successful, whether to open the input source management page?","F_val":"提示:添加成功，是否跳轉到添加輸入源管理頁面？","C_val":"提示:添加成功，是否跳转到添加输入源管理页面？"},
    {"id":"67","E_val":"News：No permissions to add input group.","F_val":"提示：對不起，您沒有許可權添加輸入組。","C_val":"提示：对不起，您没有权限添加输入组。"},
    {"id":"68","E_val":"News：No permissions to modify intput group.","F_val":"提示：對不起，您沒有許可權修改輸入組。","C_val":"提示：对不起，您没有权限修改输入组。"},
    {"id":"69","E_val":"News：No permissions to delete input group.","F_val":"提示：對不起，您沒有許可權刪除輸入組。","C_val":"提示：对不起，您没有权限删除输入组。"},
    {"id":"70","E_val":"Current color","F_val":"當前選擇顏色為","C_val":"当前选择颜色为"},
    {"id":"71","E_val":"News：Please input port.","F_val":"提示：請輸入埠號。","C_val":"提示：请输入端口号。"},
    {"id":"72","E_val":"Error：Date error.","F_val":"提示：時間格式不正確。","C_val":"提示：时间格式不正确。"},
    {"id":"73","E_val":"News：No permissions to operate.","F_val":"提示：對不起，您沒有許可權操作此功能。","C_val":"提示：对不起，您没有权限操作此功能。"},
    {"id":"74","E_val":"News：No mode is select, make the current state as mode?","F_val":"提示：尚未選擇模式，是否把當前輸出視窗作為模式？","C_val":"提示：尚未选择模式，是否把当前输出窗口作为模式？"},
    {"id":"75","E_val":"News：Please create mode at first.","F_val":"提示：請先建立模式再進行選擇。","C_val":"提示：请先建立模式再进行选择。"},
    {"id":"76","E_val":"Current","F_val":"當前","C_val":"当前"},
    {"id":"77","E_val":"null","F_val":"空","C_val":"空"},
    {"id":"78","E_val":"News：Do you want set alarm again, old aram data will be deleted?","F_val":"提示：是否重新設定警點？舊的警點設定將被刪除。","C_val":"提示：是否重新设置警点？旧的警点设置将被删除。"},
    {"id":"79","E_val":"News：Set alarm successful, do you want to set action of alarm? ","F_val":"提示：警點設定成功，是否跳轉到報警聯動頁面？","C_val":"提示：警点设置成功，是否跳转到报警联动页面？"},
    {"id":"81","E_val":"Source","F_val":"警點來源","C_val":"警点来源"},
    {"id":"82","E_val":"S/N","F_val":"警點號","C_val":"警点号"},
    {"id":"83","E_val":"Window","F_val":"顯示視窗","C_val":"显示窗口"},
    {"id":"84","E_val":"Input","F_val":"輸入源","C_val":"输入源"},
    {"id":"85","E_val":"Channel","F_val":"通道名稱","C_val":"通道名称"},
    {"id":"86","E_val":"Mode","F_val":"模式","C_val":"模式"},
    {"id":"87","E_val":"Output","F_val":"輸出","C_val":"输出"},
    {"id":"88","E_val":"Open/Close","F_val":"設防/撤防","C_val":"设防/撤防"},
    {"id":"89","E_val":"Web port","F_val":"網口(W)","C_val":"网口(W)"},
    {"id":"90","E_val":"MAC Address：","F_val":"MAC地址:","C_val":"MAC地址:"},
    {"id":"91","E_val":"News：Update IP address?","F_val":"提示：是否修改IP地址?","C_val":"提示：是否修改IP地址?"},
    {"id":"92","E_val":"Error：Local data error, please download again.","F_val":"提示：本地輸入設定檔異常，請重新下載或者聯繫管理員。","C_val":"提示：本地输入配置文件异常，请重新下载或者联系管理员。"},
    {"id":"93","E_val":"News：Please input source file.","F_val":"提示：請選擇輸入原始檔案","C_val":"提示：请选择输入源文件"},
    {"id":"93.1","E_val":"News：Alarm file error.","F_val":"提示：報警檔錯誤","C_val":"提示：报警文件错误"},
    {"id":"94","E_val":"News：Please select config file.","F_val":"提示：請選擇設定檔","C_val":"提示：请选择配置文件"},
    {"id":"99","E_val":"Main Stream","F_val":"主碼流","C_val":"主码流"},
    {"id":"100","E_val":"Sub-Stream","F_val":"子碼流","C_val":"子码流"},
    {"id":"100.1","E_val":"Voice","F_val":"音訊輸出","C_val":"音频输出"},
    {"id":"100.2","E_val":"HDMI","F_val":"HDMI輸出","C_val":"HDMI输出"},
    {"id":"100.3","E_val":"Voice/HDMI","F_val":"同時輸出","C_val":"同时输出"},
    {"id":"100.4","E_val":"News：Please select one or more screen to operate.","F_val":"提示：請選擇一個或者多個顯示幕進行設定.","C_val":"提示：请选择一个或者多个显示屏进行配置."},
    {"id":"100.5","E_val":"Error：Audio data error.","F_val":"提示：獲取的音訊輸出數據不正確","C_val":"提示：获取的音频输出数据不正确"},
    {"id":"101","E_val":"Device added.","F_val":"設備已添加.","C_val":"设备已经添加."},
    {"id":"102","E_val":"Window Invalid","F_val":"視窗無效 ","C_val":"窗口无效"},
    {"id":"103","E_val":"Input Invalid.","F_val":"輸入源無效 ","C_val":"输入源无效"},
    {"id":"104","E_val":"News：Upgrade success.","F_val":"提示：字形檔檔升級成功。","C_val":"提示：字库文件升级成功。"},
    {"id":"105","E_val":"News：Please confirm the file is correct, otherwise show font will error.","F_val":"提示：請檢查字形檔檔是否正確，如果檔錯誤可能導致字幕顯示錯誤。","C_val":"提示：请检查字库文件是否正确，如果文件错误可能导致字幕显示错误。"},
    {"id":"106","E_val":"Timing Open","F_val":"定時設防 ","C_val":"定时设防"},
    {"id":"107","E_val":"Timing Close","F_val":"定時撤防 ","C_val":"定时撤防"},
    {"id":"108","E_val":"Batch Open","F_val":"一鍵設防 ","C_val":"一键设防"},
    {"id":"109","E_val":"Batch Close","F_val":"一鍵撤防 ","C_val":"一键撤防"},
    {"id":"110","E_val":"News：Upgrade success.","F_val":"提示：Logo圖片升級成功。","C_val":"提示：Logo图片升级成功。"},

    {"id":"111","E_val":"News：Please confirm the logo picture is correct, otherwise show  will error.",
        "F_val":"提示：請檢查頁面Logo圖片是否正確，如果Logo圖片錯誤可能導致幕顯示錯誤。","C_val":"提示：请检查页面logo图片修改文件是否正确，如果logo图片错误可能导致网页显示出错！"},
    {"id":"113","E_val":"News:Logo image modify successful.","F_val":"提示:logo圖片切換 成功.","C_val":"提示：logo图片切换成功."},
    {"id":"114","E_val":"News:Logo image modify failure.","F_val":"提示:logo圖片切換失敗 .","C_val":"提示：logo图片切换失败."},
    {"id":"115","E_val":"News:Platform parameter gettings successful.","F_val":"提示:平臺參數設定成功.","C_val":"提示：平台参数设置成功."},
    {"id":"116","E_val":"News:Platform parameter gettings failure.","F_val":"提示:平臺參數設定失敗 .","C_val":"提示：平台参数设置失败."},
    {"id":"117","E_val":"News:Platform parameter gettings failure.","F_val":"提示:平臺參數获取失敗 .","C_val":"提示：平台参数获取失败."}
];




utilJSTxt=[{"id":"1","E_val":"Error：System error","F_val":"提示：很遺憾你碰到了系統錯誤","C_val":"提示：很遗憾你碰到了系统错误"},
    {"id":"2","E_val":"Message","F_val":"錯誤資訊","C_val":"错误信息"},
    {"id":"3","E_val":"Error：Upload error.","F_val":"提示：上傳錯誤","C_val":"提示：上传错误"},
    {"id":"4","E_val":"The number of input sources beyond the prescribed amount","F_val":"輸入源超出限定路數","C_val":"输入源超出限定路数"},
    {"id":"5","E_val":"provisions","F_val":"限定","C_val":"限定"},
    {"id":"6","E_val":"News：Switching mode successful.","F_val":"提示：切換模式成功","C_val":"提示：切换模式成功"},
    {"id":"6.2","E_val":"News：Switching mode failed,the current model has not been uploaded to the server.","F_val":"提示：切換模式失敗,當前模式尚未上傳伺服器.","C_val":"提示：切换模式失败,当前模式尚未上传服务器."},
    {"id":"6.5","E_val":"News：Switching mode failed.","F_val":"提示：切換模式失敗","C_val":"提示：切换模式失败"},
    {"id":"7","E_val":"News：Switching group successful.","F_val":"提示：切換組成功","C_val":"提示：切换组成功"},
    {"id":"8","E_val":"News：Upload successful.","F_val":"提示：上傳成功","C_val":"提示：上传成功"},
    {"id":"9","E_val":"Error：Failure to send data.","F_val":"提示：發送數據失敗","C_val":"提示：发送数据失败"},
    {"id":"10","E_val":"Error：Failed to receive date.","F_val":"提示：接收檔失敗","C_val":"提示：接收文件失败"},
    {"id":"11","E_val":"Error：Content of the data is missing.","F_val":"提示：返回數據異常，檔的內容缺失","C_val":"提示：返回数据异常，文件的内容缺失"},
    {"id":"12","E_val":"Whether to add","F_val":"是否添加","C_val":"是否添加"},
    {"id":"13","E_val":"Error：Failed to load the input source data.","F_val":"提示：加載輸入原始檔案失敗","C_val":"提示：加载输入源文件失败"},
    {"id":"14","E_val":"News：Download successful.","F_val":"提示：下載成功","C_val":"提示：下载成功"},
    {"id":"15","E_val":"Error：Download data error, please download again.","F_val":"提示：下載數據有異常請重新下載","C_val":"提示：下载数据有异常请重新下载"},
    {"id":"16","E_val":"Error：Download data error.","F_val":"提示：下載數據出錯","C_val":"提示：下载数据出错"},
    {"id":"17","E_val":"News：Search failed.","F_val":"提示：搜尋失敗","C_val":"提示：搜索失败"},
    {"id":"18","E_val":"News：There is no data be searched.","F_val":"提示：沒有搜尋到任何數據。","C_val":"提示：没有搜索到任何数据。"},
    {"id":"19","E_val":"News：Device is not actived, please activeing.","F_val":"提示：設備尚未啟動，請啟動。","C_val":"提示：设备尚未激活，请激活。"},
    {"id":"20","E_val":"Error：Login failed.","F_val":"提示：登錄失敗","C_val":"提示：登录失败"},
    {"id":"21","E_val":"Error：Failed to generate the canvas, please init device according to the number of screen.","F_val":"提示：生成畫布失敗，請根據物理屏的個數設定分佈。","C_val":"提示：生成画布失败，请根据物理屏的个数设置分布。"},
    {"id":"22","E_val":"Error：Merger failed.","F_val":"提示：合併失敗","C_val":"提示：合并失败"},
    {"id":"23","E_val":"Error：Switching failed.","F_val":"提示：切換操作失敗","C_val":"提示：切换操作失败"},
    {"id":"24","E_val":"Error：Operation failed.","F_val":"提示：操作失敗","C_val":"提示：操作失败"},
    {"id":"25","E_val":"Error：Open the output failed.","F_val":"提示:啟動輸出失敗","C_val":"提示:启动输出失败"},
    {"id":"26","E_val":"Error：Close the output failed","F_val":"提示:停止輸出失敗","C_val":"提示:停止输出失败"},
    {"id":"27","E_val":"Error：Open tour failed.","F_val":"提示:啟動循環失敗","C_val":"提示:启动轮巡失败"},
    {"id":"28","E_val":"Error：Close tour failed.","F_val":"提示:停止循環失敗","C_val":"提示:停止轮巡失败"},
    {"id":"29","E_val":"News：Set window number display successful.","F_val":"提示：設定視窗號顯示設定成功。","C_val":"提示：设置窗口号显示配置成功。"},
    {"id":"30","E_val":"News：Set window number displays failed.","F_val":"提示：設定視窗號顯示設定失敗","C_val":"提示：设置窗口号显示配置失败"},
    {"id":"31","E_val":"Error：There is no fork in the device.","F_val":"提示：系統缺少字形檔","C_val":"提示：系统缺少字库"},
    {"id":"32","E_val":"Error：Failed to get window number display configuration.","F_val":"提示：取得視窗號顯示設定失敗","C_val":"提示：获取窗口号显示配置失败"},
    {"id":"33","E_val":"News：Eliminate alarm successful.","F_val":"提示：消警成功","C_val":"提示：消警成功"},
    {"id":"34","E_val":"Error：Eliminate alarm failed.","F_val":"提示：消警失敗","C_val":"提示：消警失败"},
    {"id":"35","E_val":"News：Set the alarm successful.","F_val":"提示：設防成功","C_val":"提示：设防成功"},
    {"id":"36","E_val":"Error：Set the alarm failed.","F_val":"提示：設防失敗","C_val":"提示：设防失败"},
    {"id":"37","E_val":"News：Cancel the alarm successful.","F_val":"提示：撤防成功","C_val":"提示：撤防成功"},
    {"id":"38","E_val":"Error：Cancel the alarm failed.","F_val":"提示：撤防失敗","C_val":"提示：撤防失败"},
    {"id":"39","E_val":"News：The camera has no preset.","F_val":"提示：該攝像機沒有情境位","C_val":"提示：该摄像机没有预置位"},
    {"id":"40","E_val":"Error：Get preset date failed.","F_val":"提示：返回情境位失敗","C_val":"提示：返回预置位失败"},
    {"id":"41","E_val":"News：Set device time successful.","F_val":"提示：修改設備時間成功","C_val":"提示：修改设备时间成功"},
    {"id":"42","E_val":"Error：Set device time failed.","F_val":"提示：修改設備時間失敗","C_val":"提示：修改设备时间失败"},
    {"id":"43","E_val":"News：Set IP address successful.","F_val":"提示：設定地址成功","C_val":"提示：设置IP地址成功"},
    {"id":"44","E_val":"Error：Set IP address  failed.","F_val":"提示：修改地址失敗","C_val":"提示：修改IP地址失败"},
    {"id":"45","E_val":"News：Set the serial successful.","F_val":"提示：修改串口成功","C_val":"提示：修改串口成功"},
    {"id":"46","E_val":"Error：Set the serial failed.","F_val":"提示：修改串口失敗","C_val":"提示：修改串口失败"},
    {"id":"47","E_val":"Error：Failed to get device information.","F_val":"提示：獲取設備資訊失敗","C_val":"提示：获取设备信息失败"},
    {"id":"48","E_val":"Error：Restore factory setting failed.","F_val":"提示：複位出廠值設定失敗","C_val":"提示：复位出厂值设置失败"},
    {"id":"49","E_val":"News：Restore Settings successful, the device will reboot,please login again.","F_val":"提示：複位出廠值設定成功,系統重啟請重新登錄。","C_val":"提示：复位出厂值设置成功,系统重启请重新登录。"},
    {"id":"50","E_val":"Error：Restart failed.","F_val":"提示：設備重啟失敗","C_val":"提示：设备重启失败"},
    {"id":"51","E_val":"News：Get serial number failed.","F_val":"提示：返回序列號失敗","C_val":"提示：返回序列号失败"},
    {"id":"52","E_val":"Inactive","F_val":"未啟動","C_val":"未激活"},
    {"id":"53","E_val":"Activated","F_val":"已啟動","C_val":"已激活"},
    {"id":"54","E_val":"Permanent","F_val":"永久","C_val":"永久"},
    {"id":"55","E_val":"Day","F_val":"天","C_val":"天"},
    {"id":"56","E_val":"News：Set up the successful.","F_val":"提示：設定成功","C_val":"提示：设置成功"},
    {"id":"57","E_val":"Error：Set up the failed.","F_val":"提示：設定失敗","C_val":"提示：设置失败"},
    {"id":"58","E_val":"Error：Set video format failed.","F_val":"提示：設定視頻制式失敗","C_val":"提示：设置视频制式失败"},
    {"id":"59","E_val":"Error：Set baudrate failed .","F_val":"提示：設定串列傳輸速率失敗","C_val":"提示：设置波特率失败"},
    {"id":"60","E_val":"Error：Get serial configuration failed.","F_val":"提示：獲取串口設定失敗","C_val":"提示：获取串口配置失败"},
    {"id":"61","E_val":"Error：Set output display Settings failed.","F_val":"提示：設定輸出顯示設定失敗","C_val":"提示：设置输出显示设置失败"},
    {"id":"62","E_val":"News：Set port number successful.","F_val":"提示：設定埠號成功","C_val":"提示：设置端口号成功"},
    {"id":"63","E_val":"Error：Set port number failed.","F_val":"提示：設定埠號失敗","C_val":"提示：设置端口号失败"},
    {"id":"64","E_val":"Error：Set port number failed.","F_val":"提示：設定埠號失敗，該埠號已存在","C_val":"提示：设置端口号失败，该端口号已存在"},
    {"id":"65","E_val":"Error：Get port number failed.","F_val":"提示：獲取埠號設定失敗","C_val":"提示：获取端口号设置失败"},
    {"id":"66","E_val":"Error：Device files Error.","F_val":"提示：系統檔已失效","C_val":"提示：系统文件已失效"},
    {"id":"67","E_val":"Error：The device response timeout, please contact administrator.","F_val":"提示：伺服器回應超時，請聯繫管理員。","C_val":"提示：服务器响应超时，请联系管理员。"},
    {"id":"68","E_val":"Error：Device response timeout, please check the network and device.","F_val":"提示：設備回應超時，請檢查網路和設備是否正常","C_val":"提示：设备响应超时，请检查网络和设备是否正常"},
    {"id":"69","E_val":"Close","F_val":"關閉","C_val":"关闭"},
    {"id":"70","E_val":"Warning: Do not select “Prevent this page from creating additional dialogues.”","F_val":"警告：請不要選擇“防止此網頁產生其他對話方塊”","C_val":"警告：请不要选择“禁止此页再显示对话框”"},
    {"id":"71","E_val":"Synchronous Input","F_val":"同步輸入源","C_val":"同步输入源"},
    {"id":"72","E_val":"All","F_val":"全選","C_val":"全选"},
    {"id":"73","E_val":"Device Name","F_val":"設備名稱","C_val":"设备名称"},
    {"id":"74","E_val":"Device IP","F_val":"設備IP地址","C_val":"设备IP地址"},
    {"id":"75","E_val":"Yes","F_val":"確定","C_val":"确定"},
    {"id":"76","E_val":"No","F_val":"取消","C_val":"取消"},
    {"id":"77","E_val":"News：Send data to the device.","F_val":"提示：發送數據到設備","C_val":"提示：发送数据到设备"},
    {"id":"78","E_val":"fail","F_val":"失敗","C_val":"失败"},
    {"id":"79","E_val":"News：Connection device failed.","F_val":"提示：鏈接設備失敗","C_val":"提示：链接设备失败"},
    {"id":"80","E_val":"News：Login device failed.","F_val":"提示：登錄設備失敗","C_val":"提示：登录设备失败"},
    {"id":"81","E_val":"Status:Big","F_val":"狀態：放大","C_val":"状态：放大"},
    {"id":"82","E_val":"Big","F_val":"放大","C_val":"放大"},
    {"id":"83","E_val":"News：Download output date successful.","F_val":"提示：同步下載輸出視窗設定檔成功。","C_val":"提示：同步下载输出窗口配置文件成功。"},
    {"id":"84","E_val":"News：Download input date successful.","F_val":"提示：同步下載輸入源設定檔成功。","C_val":"提示：同步下载输入源配置文件成功。"},
    {"id":"85","E_val":"News：Download input of output date successful.","F_val":"提示：同步下載本地輸入通道設定檔成功。","C_val":"提示：同步下载本地输入通道配置文件成功。"},
    {"id":"86","E_val":"News：Download mode date successful.","F_val":"提示：同步下載對應關係設定檔成功。","C_val":"提示：同步下载对应关系配置文件成功。"},
    {"id":"87","E_val":"News：Download output date successful.","F_val":"提示：同步下載模式設定檔成功。","C_val":"提示：同步下载模式配置文件成功。"},
    {"id":"88","E_val":"News：Download mode change date successful.","F_val":"提示：同步下載模式定時切換設定檔成功。","C_val":"提示：同步下载模式定时切换配置文件成功。"},
    {"id":"89","E_val":"News：Download alarm date successful.","F_val":"提示：同步下載報警設定檔成功。","C_val":"提示：同步下载报警配置文件成功。"},
    {"id":"90","E_val":"News：Download input group file successful.","F_val":"提示：同步下載輸入組設定檔成功。","C_val":"提示：同步下载输入组配置文件成功。"},
    {"id":"91","E_val":"News：Set Auto Reboot System successful.","F_val":"提示：設定自動重啟系統成功。","C_val":"提示：设置自动重启系统成功。"},
    {"id":"92","E_val":"News：Set Auto Reboot System failed.","F_val":"提示：設定自動重啟系統失败。","C_val":"提示：设置自动重启系统失败。"},
    {"id":"93","E_val":"News：Get Auto Reboot System failed.","F_val":"提示：獲取自動重啟系統失败。","C_val":"提示：获取自动重启系统失败。"},
    {"id":"94","E_val":"App Video","F_val":"手機視頻","C_val":"手机"},
    {"id":"95","E_val":"PC Video","F_val":"電腦視頻","C_val":"电脑"}

];



jsTxt=[{"id":"1","E_val":"News：IP address or file path is null.","F_val":"提示：輸入源IP地址/路徑不能為空。","C_val":"提示：输入源IP地址/路径不能为空。"},
    {"id":"2","E_val":"News：IP address exist.","F_val":"提示：此IP輸入源已存在，請填寫新IP。","C_val":"提示：此IP输入源已存在，请填写新IP。"},
    {"id":"3","E_val":"News：Please input number.","F_val":"請輸入數量","C_val":"请输入数量"},
    {"id":"4","E_val":"News：Update local data to the server, the server data will be modified.","F_val":"提示：將本機內容同步到伺服器，伺服器內容將會被修改。","C_val":"提示：将本机内容同步到服务器，服务器内容将会被修改。"},
    {"id":"5","E_val":"News：Download server data to local  local data will be modified.","F_val":"提示：將伺服器內容同步到本地，本地內容將會被修改。","C_val":"提示：将服务器内容同步到本地，本地内容将会被修改。"},
    {"id":"6","E_val":"News：Please press 'Ctrl' button and then click the right mouse button and choose merge.","F_val":"提示：請按住Ctrl鍵點擊右鍵選擇合併。","C_val":"提示：请按住Ctrl键点击右键选择合并。"},
    {"id":"7","E_val":"News：Refresh page.","F_val":"提示：將會刷新本頁面。","C_val":"提示：将会刷新本页面。"},
    {"id":"8","E_val":"News：Do you want to open system manage?","F_val":"提示:是否打開設備管理？","C_val":"提示:是否打开设备管理？"},
    {"id":"9","E_val":"News：There is no alarm action data, please create.","F_val":"提示：報警聯動設備找不到設定的模式檔,請重新創建報警警點設定。","C_val":"提示：报警联动设备找不到配置的模式文件,请重新创建报警警点设置。"},
    {"id":"10","E_val":"Inner","F_val":"內部","C_val":"内部"},
    {"id":"11","E_val":"External","F_val":"外部","C_val":"外部"},
    {"id":"12","E_val":"Random","F_val":"隨機","C_val":"随机"},
    {"id":"13","E_val":"Please Select","F_val":"請選擇","C_val":"请选择"},
    {"id":"14","E_val":"Open","F_val":"撤防","C_val":"撤防"},
    {"id":"15","E_val":"Close","F_val":"設防","C_val":"设防"},
    {"id":"16","E_val":"Number trigger the alarm","F_val":"警點有警","C_val":"警点有警"},
    {"id":"17","E_val":"Error：Alarm action Error： can not find the correspondcamera.","F_val":"提示：聯動警報錯誤，找不到對應的攝像機。","C_val":"提示：联动警报错误，找不到对应的摄像机。"},
    {"id":"18","E_val":"Error：Alarm error, no alarm action configuration data exist.","F_val":"提示：報警失敗操作，找不到該報警輸入警點請檢查報警聯動設定檔。","C_val":"提示：报警失败操作，找不到该报警输入警点请检查报警联动配置文件。"},
    {"id":"19","E_val":"Error：Alarm error, no alarm configuration data exist.","F_val":"提示：報警失敗，找不到該報警設定檔。","C_val":"提示：报警失败，找不到该报警配置文件。"},
    {"id":"20","E_val":"Error：Clear alarm error, the alarm is closed.","F_val":"提示：消警操作無效，該警點處於關閉狀態","C_val":"提示：消警操作无效，该警点处于关闭状态"},
    {"id":"21","E_val":"Error：Clear alarm error, the alarm is normal.","F_val":"提示：消警操作無效，該警點處於正常狀態。","C_val":"提示：消警操作无效，该警点处于正常状态。"},
    {"id":"22","E_val":"Error：Open alarm error, the alarm is normal.","F_val":"提示：打開報警操作無效，該警點處於正常狀態。","C_val":"提示：打开报警操作无效，该警点处于正常状态。"},
    {"id":"23","E_val":"Error：Open alarm error, no alarm configuration data exist.","F_val":"提示：打開報警操作無效，找不到該報警設定檔。","C_val":"提示：打开报警操作无效，找不到该报警配置文件。"},
    {"id":"24","E_val":"Error：Close alarm error, the alarm is closed.","F_val":"提示：關閉報警操作無效，該警點未打開。","C_val":"提示：关闭报警操作无效，该警点未打开。"},
    {"id":"25","E_val":"Error：Clean alarm error, no alarm configuration data exist.","F_val":"提示：消警失敗，找不到該報警設定檔。","C_val":"提示：消警失败，找不到该报警配置文件。"},
    {"id":"26","E_val":"All","F_val":"全部","C_val":"全部"},
    {"id":"27","E_val":"Home Page","F_val":"首頁","C_val":"首页"},
    {"id":"28","E_val":"System","F_val":"系統管理","C_val":"系统管理"},
    {"id":"29","E_val":"Input","F_val":"輸入管理","C_val":"输入管理"},
    {"id":"30","E_val":"Output","F_val":"輸出管理","C_val":"输出管理"},
    {"id":"31","E_val":"File","F_val":"同步管理","C_val":"同步管理"},
    {"id":"32","E_val":"Alarm","F_val":"報警管理","C_val":"报警管理"},
    {"id":"33","E_val":"Exit","F_val":"退出","C_val":"退出"},
    {"id":"34","E_val":"Input Manage","F_val":"輸入源管理","C_val":"输入源管理"},
    {"id":"35","E_val":"Gorup Manage","F_val":"輸入組管理","C_val":"输入组管理"},
    {"id":"36","E_val":"Initialize","F_val":"初始化","C_val":"初始化"},
    {"id":"37","E_val":"Download","F_val":"下載數據","C_val":"下载数据"},
    {"id":"38","E_val":"Upload","F_val":"上傳數據","C_val":"上传数据"},
    {"id":"39","E_val":"Alarm Initialize","F_val":"報警警點設定","C_val":"报警警点设置"},
    {"id":"40","E_val":"Channel Manage","F_val":"通道管理","C_val":"通道管理"},
    {"id":"41","E_val":"Mode Manage","F_val":"模式管理","C_val":"模式管理"},
    {"id":"42","E_val":"Alarm Config ","F_val":"報警聯動設定","C_val":"报警联动设置"},
    {"id":"43","E_val":"System Manage","F_val":"系統設定","C_val":"系统设置"},
    {"id":"44","E_val":"User Manage","F_val":"使用名管理","C_val":"用户管理"},
    {"id":"45","E_val":"Device Manage","F_val":"設備管理","C_val":"设备管理"},
    {"id":"46","E_val":"News：Please use 'Ctrl + W' or 'Alt + F' to close the browser.","F_val":"提示：請用Ctrl+W或者alt+F4主動關閉流覽器。","C_val":"提示：请用Ctrl+W或者alt+F4主动关闭浏览器。"},
    {"id":"47","E_val":"News：Do you logout system?","F_val":"提示:是否退出本操作系統。","C_val":"提示:是否退出本操作系统。"},
    {"id":"48","E_val":"Date：","F_val":"時間：","C_val":"时间："},
    {"id":"49","E_val":"Window","F_val":"視窗","C_val":"窗口"},
    {"id":"50","E_val":"Num","F_val":"警點","C_val":"警点"},
    {"id":"51","E_val":"Home Page","F_val":"首頁","C_val":"首页"},
    {"id":"52","E_val":"Not find","F_val":"不存在的","C_val":"不存在的"},
    {"id":"53","E_val":"Stream Manage","F_val":"流媒体管理","C_val":"流媒体管理"},
    {"id":"54","E_val":"Transmit Config","F_val":"轉發管理","C_val":"转发管理"},
    {"id":"55","E_val":"Dibbler Config","F_val":"點播管理","C_val":"点播管理"}

];

js_1=[{"id":"1","E_val":"Please Select","F_val":"請選擇","C_val":"请选择"},
    {"id":"1.3","E_val":"Never","F_val":"从不","C_val":"从不"},
    {"id":"1.5","E_val":"Everyday","F_val":"每日","C_val":"每日"},
    {"id":"2","E_val":"Monday","F_val":"星期一","C_val":"星期一"},
    {"id":"3","E_val":"Tuesday","F_val":"星期二","C_val":"星期二"},
    {"id":"4","E_val":"Wednesday","F_val":"星期三","C_val":"星期三"},
    {"id":"5","E_val":"Thursday ","F_val":"星期四","C_val":"星期四"},
    {"id":"6","E_val":"Friday","F_val":"星期五","C_val":"星期五"},
    {"id":"7","E_val":"Saturday","F_val":"星期六","C_val":"星期六"},
    {"id":"8","E_val":"Sunday","F_val":"星期日","C_val":"星期日"},
    {"id":"9","E_val":"Mode data is null, please create a mode first.","F_val":"提示：模式檔為空，請保存模式再進行定時切換添加操作。","C_val":"提示：模式文件为空，请保存模式再进行定时切换添加操作。"},
    {"id":"10","E_val":"News：Mode data is null.","F_val":"提示：尚未添加模式定時切換設定或者模式檔為空。","C_val":"提示：尚未添加模式定时切换设置或者模式文件为空。"},
    {"id":"11","E_val":"News：Please set date.","F_val":"提示：請對任意一種時間格式進行設定。","C_val":"提示：请对任意一种时间格式进行设置。"},
    {"id":"12","E_val":"News：Please select a mode to modify.","F_val":"提示：請選擇模式進行設定。","C_val":"提示：请选择模式进行设置。"},
    {"id":"13","E_val":"News：Data duplication.","F_val":"提示：日期、時間定時切換設定出現重複，請重新設定。","C_val":"提示：日期、时间定时切换设置出现重复，请重新设置。"},
    {"id":"14","E_val":"News：Data duplication.","F_val":"提示：星期、時間定時切換設定出現重複，請重新設定。","C_val":"提示：星期、时间定时切换设置出现重复，请重新设置。"},
    {"id":"15","E_val":"News：Mode timing switch is saved in the local, whether uploaded to the server?","F_val":"提示：模式定時切換已保存在本地，是否上傳到伺服器？","C_val":"提示：模式定时切换已保存在本地，是否上传到服务器？"},
    {"id":"16","E_val":"News：Data duplication.","F_val":"提示：星期、時間定時切換設定出現重複，請重新設定。","C_val":"提示：星期、时间定时切换设置出现重复，请重新设置。"},
    {"id":"17","E_val":"News：Data duplication.","F_val":"提示：星期、時間定時切換設定出現重複，請重新設定。","C_val":"提示：星期、时间定时切换设置出现重复，请重新设置。"},
    {"id":"18","E_val":"News：Data duplication.","F_val":"提示：星期、時間定時切換設定出現重複，請重新設定。","C_val":"提示：星期、时间定时切换设置出现重复，请重新设置。"},
    {"id":"19","E_val":"Device","F_val":"搜尋设备","C_val":"搜索设备"},
    {"id":"19.5","E_val":"Platform","F_val":"搜尋平臺","C_val":"搜索平台"},
    {"id":"20","E_val":"Automatic Video","F_val":"自動錄影","C_val":"自动录像"},
    {"id":"21","E_val":"Manual Video","F_val":"手動錄影","C_val":"手动录像"},
    {"id":"22","E_val":"Motion Detecting","F_val":"移動偵測","C_val":"移动侦测"},
    {"id":"23","E_val":"Sensor Alarm","F_val":"探頭報警","C_val":"探头报警"},
    {"id":"24","E_val":"Video Loss","F_val":"視頻丟失","C_val":"视频丢失"},
    {"id":"25","E_val":"Keep Alarm","F_val":"遮擋報警","C_val":"遮挡报警"},
    {"id":"26","E_val":"Human Body Detection","F_val":"人體檢測","C_val":"人体检测"},
    {"id":"27","E_val":"News：Please add NVR/DVR first.","F_val":"提示：請添加NVR/DVR設備再進行查詢。","C_val":"提示：请添加NVR/DVR设备再进行查询。"},
    {"id":"28","E_val":"News：No video to replay.","F_val":"提示：當前時間段沒有可回放的錄影。","C_val":"提示：当前时间段没有可回放的录像。"},
    {"id":"29","E_val":"News：Please select a video file to replay.","F_val":"提示：請選擇錄影進行回放操作。","C_val":"提示：请选择录像进行回放操作。"},
    {"id":"30","E_val":"News：Cannot select multi-window to be replay.","F_val":"提示：禁止選擇多個視窗錄影回放操作,允許選擇多個視窗錄影停止回放操作。","C_val":"提示：禁止选择多个窗口录像回放操作,允许选择多个窗口录像停止回放操作。"},
    {"id":"31","E_val":"News：Please select video to replay.","F_val":"提示：請選擇視窗或者錄影視頻再進行回放操作。","C_val":"提示：请选择窗口或者录像视频再进行回放操作。"},
    {"id":"32","E_val":"News：The current video file playing is the first video file, do you want to play the last video file?","F_val":"提示：現在播放的是搜尋的第一個錄影檔，是否播放搜尋的最後一個檔","C_val":"提示：现在播放的是搜索的第一个录像文件，是否播放搜索的最后一个文件"},
    {"id":"33","E_val":"News：The current video file playing is the last video file, do you want to play the first video file?","F_val":"提示：現在播放的是搜尋的最後一個錄影檔，是否播放搜尋的第一個檔","C_val":"提示：现在播放的是搜索的最后一个录像文件，是否播放搜索的第一个文件"},
    {"id":"34","E_val":"Video File","F_val":"錄影檔","C_val":"录像文件"},
    {"id":"35","E_val":"Play Type","F_val":"播放狀態","C_val":"播放状态"},
    {"id":"36","E_val":"Normal","F_val":"正常","C_val":"正常"},
    {"id":"37","E_val":"speed","F_val":"快進","C_val":"快进"},
    {"id":"38","E_val":"Pause","F_val":"暫停","C_val":"暂停"},
    {"id":"39","E_val":"Back Play","F_val":"倒播","C_val":"倒播"},
    {"id":"40","E_val":"Fast Reverse","F_val":"快退","C_val":"快退"},
    {"id":"41","E_val":"News：No video file exist at this time point.","F_val":"提示：當前時間點不存在錄影視頻。","C_val":"提示：当前时间点不存在录像视频。"},
    {"id":"42","E_val":"All Video","F_val":"所有錄影","C_val":"所有录像"},
    {"id":"43","E_val":"Error：Replay video failed.","F_val":"提示：回放錄影視頻失敗。","C_val":"提示：回放录像视频失败。"},
    {"id":"44","E_val":"News：No video file exist.","F_val":"提示：未查詢到任何錄影數據。","C_val":"提示：未查询到任何录像数据。"},
    {"id":"45","E_val":"Replay Video","F_val":"錄影重播","C_val":"录像回放"},
    {"id":"46","E_val":"News：The current time there is no video.","F_val":"提示：請選擇正確的時間進行回放。","C_val":"提示：请选择正确的时间进行回放。"},
    {"id":"47","E_val":"News：The current time there is no video.","F_val":"提示：請選擇正確的開始時間和結束時間進行錄影查詢。","C_val":"提示：请选择正确的开始时间和结束时间进行录像查询。"},
    {"id":"48","E_val":"News：The start time cannot be greater than end time.","F_val":"提示：查詢條件的開始時間不能比結束時間大。","C_val":"提示：查询条件的开始时间不能比结束时间大。"},
    {"id":"49","E_val":"News：Search NVR/DVR video failure.","F_val":"提示：查詢NVR/DVR錄影資訊失敗。","C_val":"提示：查询NVR/DVR录像信息失败。"},
    {"id":"50","E_val":"News：Replay video failure.","F_val":"提示：回放錄影視頻失敗。","C_val":"提示：回放录像视频失败。"},
    {"id":"51","E_val":"On Line","F_val":"線上","C_val":"在线"},
    {"id":"52","E_val":"Off Line","F_val":"離線","C_val":"离线"},
    {"id":"53","E_val":"Logined","F_val":"已登錄","C_val":"已登录"},
    {"id":"54","E_val":"News:Searching...","F_val":"提示：正在查詢...","C_val":"提示：正在查询..."}
];

js_2=[{"id":"1","E_val":"News:User name cannot be empty. ","F_val":"提示：使用名不能為空。","C_val":"提示：用户名不能为空。"},
    {"id":"2","E_val":"News:User name cannot be more than 20 digits or in English .",
        "F_val":"提示：使用名長度不能超過20個數字或英文字元。","C_val":"提示：用户名长度不能超过20个数字或英文字符。"},
    {"id":"3","E_val":"News:User name can only be entered in English or number.","F_val":"提示：使用名只能輸入英文或數字。","C_val":"提示：用户名只能输入英文或数字。"},
    {"id":"4","E_val":"News:Password can not be empty. ","F_val":"提示：密碼不能為空。","C_val":"提示：密码不能为空。"},
    {"id":"5","E_val":"News:Password length can not be more than 20 digits or English characters. ",
        "F_val":"提示：密碼長度不能超過20個數字或英文字元。","C_val":"提示：密码长度不能超过20个数字或英文字符。"},
    {"id":"6","E_val":"News:Password can only be entered in English or number. ",
        "F_val":"提示：密碼只能輸入英文或數字。","C_val":"提示：密码只能输入英文或数字。"},
    {"id":"7","E_val":"News:Password cannot be empty.","F_val":"提示：確認密碼不能為空。","C_val":"提示：确认密码不能为空。"},
    {"id":"8","E_val":"News:Again password cannot be more than 20 digits or in english. ",
        "F_val":"提示：確認密碼長度不能超過20個數字或英文字元。","C_val":"提示：确认密码长度不能超过20个数字或英文字符。"},
    {"id":"9","E_val":"News:Again password can only be entered in English or number ","F_val":"提示：確認密碼只能輸入英文或數字。","C_val":"提示：确认密码只能输入英文或数字。"},
    {"id":"10","E_val":"News:Two times the password is not consistent .","F_val":"提示：兩次輸入的密碼不一致。","C_val":"提示：两次输入的密码不一致。"},
    {"id":"11","E_val":"News:Name cannot be empty.","F_val":"提示：名稱不能為空。","C_val":"提示：名称不能为空。"},
    {"id":"12","E_val":"News:Name length should not exceed 20 digits or English characters, or 10 Chinese characters.",
        "F_val":"提示：名稱長度不能超過20個數字或英文字元，或者10個中文字符。","C_val":"提示：名称长度不能超过20个数字或英文字符，或者10个中文字符。"},
    {"id":"13","E_val":"News:Please enter a user name.","F_val":"提示：請輸入使用名名稱。","C_val":"提示：请输入用户名称。"},
    {"id":"14","E_val":"News:Phone number is not correct, please re-enter.","F_val":"提示：手機號碼不正確，請重新輸入。","C_val":"提示：手机号码不正确，请重新输入。"},//
    {"id":"15","E_val":"News:QQ not correct, please re-enter .","F_val":"提示：QQ不正確，請重新輸入。","C_val":"提示：QQ不正确，请重新输入。"},
    {"id":"16","E_val":"News:Mailbox is not correct, please re-enter. ","F_val":"提示：郵箱不正確，請重新輸入。","C_val":"提示：邮箱不正确，请重新输入。"},//
    {"id":"17","E_val":"News:Please enter the old password, and the new password. ","F_val":"提示：請輸入舊密碼，和新密碼。","C_val":"提示：请输入旧密码，和新密码。"},
    {"id":"18","E_val":"News:Old password error, please re-enter. ","F_val":"提示：舊密碼錯誤，請重新輸入。","C_val":"提示：旧密码错误，请重新输入。"},//
    {"id":"19","E_val":"News:Two times the password is not consistent .please re-enter. ",
        "F_val":"提示：兩次輸入的密碼不一致，請重新輸入。","C_val":"提示：两次输入的密码不一致，请重新输入。"},
    {"id":"20","E_val":"News:User name error, user name already exists.","F_val":"提示：使用名錯誤，使用名已存在。","C_val":"提示：用户名错误，用户名已存在。"},//
    {"id":"21","E_val":"News:User name error, user name cannot be empty.","F_val":"提示：使用名錯誤，使用名不能為空。","C_val":"提示：用户名错误，用户名不能为空。"},
    {"id":"22","E_val":"News:Password error, password can not be empty.","F_val":"提示：密碼錯誤，密碼不能為空。","C_val":"提示：密码错误，密码不能为空。"},//
    {"id":"23","E_val":"News:Name error, name cannot be empty.","F_val":"提示：名稱錯誤，用户名稱不能為空。","C_val":"提示：用户名称错误，用户名称不能为空。"},
    {"id":"24","E_val":"News:Name error, name already exists.","F_val":"提示：名稱錯誤，名稱已存在。","C_val":"提示：用户名称错误，用户名称已存在。"},//
    {"id":"25","E_val":"News:Add user success.","F_val":"提示：添加使用名成功。","C_val":"提示：添加用户成功。"},
    {"id":"26","E_val":"Input Source ","F_val":"輸入源","C_val":"输入源"},//
    {"id":"27","E_val":"News:Group name already exists. Please re-enter the source. ",
        "F_val":"提示：分組名稱已存在，請重新輸入源。","C_val":"提示：分组名称已存在，请重新输入源。"},//
    {"id":"28","E_val":"New Group ","F_val":"新建分組","C_val":"新建分组"},//
    {"id":"29","E_val":"Users","F_val":"用戶數","C_val":"用户数"},//
    {"id":"30","E_val":"Online ","F_val":"線上數","C_val":"在线数"},//
    {"id":"31","E_val":"Add User","F_val":"添加使用名","C_val":"添加用户"},
    {"id":"32","E_val":"Modify User","F_val":"修改使用名","C_val":"修改用户"},//
    {"id":"33","E_val":"Please Select","F_val":"請選擇","C_val":"请选择"},
    {"id":"34","E_val":"News:Has not yet added to the user, please click the “Add User” to do the operation.",
        "F_val":"提示：尚未添加用戶，請點擊“添加用戶”再進行操作。","C_val":"提示：尚未添加用户，请点击“添加用户”再进行操作。"},//
    {"id":"35","E_val":"Add","F_val":"添加","C_val":"添加"},
    {"id":"36","E_val":"Modify","F_val":"修改","C_val":"修改"},//
    {"id":"37","E_val":"News:Please select a group or user to delete the operation.","F_val":"提示：請選擇分組或者用戶進行刪除操作。","C_val":"提示：请选择分组或者用户进行删除操作。"},//
    {"id":"38","E_val":"News:Please select a group or user to disconnect the connection.",
        "F_val":"提示：請選擇分組或者用戶進行斷開連接的操作。","C_val":"提示：请选择分组或者用户进行断开连接的操作。"},//
    {"id":"39","E_val":"User Name","F_val":"使用名","C_val":"用户名"},//
    {"id":"40","E_val":"All User","F_val":"所有使用名","C_val":"所有用户"},//
    {"id":"41","E_val":"News:Please enter a group name or user name to search again.",
        "F_val":"提示：請輸入分組名稱或者用戶名稱再進行搜索查詢。","C_val":"提示：请输入分组名称或者用户名称再进行搜索查询。"},
    {"id":"42","E_val":"Group search results","F_val":"分組搜索結果","C_val":"分组搜索结果"},//你叫前台现在立刻去拿回来。然后你自己再改密码
    {"id":"43","E_val":"User search results","F_val":"使用名搜索結果","C_val":"用户搜索结果"},
    {"id":"44","E_val":"News:Query is not the result, please click the “Add Group” button to add the operation.",
        "F_val":"提示：查詢不到結果，請點擊“添加分組”按鍵進行添加操作。","C_val":"提示：查询不到结果，请点击“添加分组”按键进行添加操作。"},//
    {"id":"45","E_val":"News:Not added a group, click the “Add Group” button to add the operation.",
        "F_val":"提示：尚未添加分組，請點擊“添加分組”按鍵進行添加操作。","C_val":"提示：尚未添加分组，请点击“添加分组”按键进行添加操作。"},
    {"id":"46","E_val":"News:Query is not the result, please click the “Add User” button to add operation.",
        "F_val":"提示：查詢不到結果，請點擊“添加使用名”按鍵進行添加操作。","C_val":"提示：查询不到结果，请点击“添加用户”按键进行添加操作。"},//
    {"id":"47","E_val":"News:Not added to the user, please click the “Add User” button to add the operation.",
        "F_val":"提示：尚未添加使用名，請點擊“添加使用名”按鍵進行添加操作。","C_val":"提示：尚未添加用户，请点击“添加用户”按键进行添加操作。"},//
    {"id":"48","E_val":"All Group","F_val":"所有分組","C_val":"所有分组"},

    {"id":"49","E_val":"Show User","F_val":"查看使用名","C_val":"查看用户"},//
    {"id":"50","E_val":"Save","F_val":"保存","C_val":"保存"},//
    {"id":"51","E_val":"Not Connect","F_val":"未連接","C_val":"未连接"},
    {"id":"52","E_val":"OffLine ","F_val":"離線","C_val":"离线"},//
    {"id":"53","E_val":"OnLine","F_val":"線上","C_val":"在线"},
    {"id":"54","E_val":"Group","F_val":"所在分組","C_val":"所在分组"},//
    {"id":"55","E_val":"Connect State","F_val":"連接狀態","C_val":"连接状态"},
    {"id":"56","E_val":"OnLine State","F_val":"線上狀態","C_val":"在线状态"},//很近
    {"id":"57","E_val":"Stream Address","F_val":"流地址","C_val":"流地址"},//
    {"id":"58","E_val":"Userinfo","F_val":"使用名資訊","C_val":"用户信息"},//
    {"id":"59","E_val":"Groupinfo","F_val":"分組資訊","C_val":"分组信息"},//
    {"id":"60","E_val":"No Group","F_val":"未加入分組","C_val":"未加入分组"},//
    {"id":"61","E_val":"User Name","F_val":"使用名名稱","C_val":"用户名称"},
    {"id":"62","E_val":"Group Name","F_val":"分組名稱","C_val":"分组名称"},//
    {"id":"63","E_val":"All User","F_val":"所有使用名","C_val":"所有用户"},
    {"id":"64","E_val":"OnLine User","F_val":"線上使用名","C_val":"在线用户"},//
    {"id":"65","E_val":"News:The user name is not correct, please re-enter.","F_val":"提示：使用名不正確，請重新輸入。","C_val":"提示：用户名不正确，请重新输入。"},
    {"id":"66","E_val":"News:The password is incorrect. Please re-enter the password.","F_val":"提示：密碼不正確，請重新輸入。","C_val":"提示：密码不正确，请重新输入。"},//
    {"id":"67","E_val":"News:Please enter a user name.","F_val":"提示：請輸入使用名名稱。","C_val":"提示：请输入用户名称。"},//
    {"id":"68","E_val":"News:Whether to switch the streaming media server, the input source configuration of the current streaming media server will be deleted after the switch mode is switched mode.",
        "F_val":"提示：是否切換流媒體伺服器，切換模式後當前流媒體伺服器的輸入源配置將被刪除。",
        "C_val":"提示：是否切换流媒体服务器，切换模式后当前流媒体服务器的输入源配置将被删除。"},//
    {"id":"69","E_val":"VOD Server","F_val":"點播伺服器","C_val":"点播服务器"},//
    {"id":"70","E_val":"Forwarding Server","F_val":"轉發伺服器","C_val":"转发服务器"},//
    {"id":"71","E_val":"Added","F_val":"已添加","C_val":"已添加"},
    {"id":"72","E_val":"Not Add","F_val":"未添加","C_val":"未添加"},//
    {"id":"73","E_val":"News:Please click on the “Select Input” button to add the input source for forwarding configuration.",
        "F_val":"提示：請點擊“選擇輸入源”按鈕添加輸入源進行轉發配置。","C_val":"提示：请点击“选择输入源”按钮添加输入源进行转发配置。"},
    {"id":"74","E_val":"News:The input source is empty, please enter the input source management to add configuration.",
        "F_val":"提示：輸入源為空，請進入輸入源管理進行添加配置。","C_val":"提示：输入源为空，请进入输入源管理进行添加配置。"},//
    {"id":"75","E_val":"Open","F_val":"開啟","C_val":"开启"},
    {"id":"76","E_val":"News:Do not close the currently selected stream address forwarding?",
        "F_val":"提示：是否關閉當前選擇的流地址轉發？","C_val":"提示：是否关闭当前选择的流地址转发？"},//
    {"id":"77","E_val":"News:Please select a stream address to set.","F_val":"提示：請選擇流地址進行設定。","C_val":"提示：请选择流地址进行设置。"},//
    {"id":"78","E_val":"News:Please select the input source to carry on the address forwarding, and then carry on the forwarding settings.",
        "F_val":"提示：請選擇輸入源進行流地址轉發,再進行流地址轉發設定。","C_val":"提示：请选择输入源进行流地址转发,再进行流地址转发设置。"},//
    {"id":"79","E_val":"News:Please add the input source for streaming media forwarding operation.",
        "F_val":"提示：請添加輸入源再進行流媒體轉發操作。","C_val":"提示：请添加输入源再进行流媒体转发操作。"},//
    {"id":"80","E_val":"News:Failed to obtain stream media forwarding configuration file.",
        "F_val":"提示：獲取流媒體轉發配置檔失敗。","C_val":"提示：获取流媒体转发配置文件失败。"},//
    {"id":"81","E_val":"News:Failed to set the user access to the stream media address type.",
        "F_val":"提示：設定使用名獲取流媒體地址類型失敗。","C_val":"提示：设置用户获取流媒体地址类型失败。"},//
    {"id":"82","E_val":"News:Set the user to obtain the success of streaming media address type.",
        "F_val":"提示：設定用戶獲取流媒體地址類型成功。","C_val":"提示：设置用户获取流媒体地址类型成功。"},//
    {"id":"83","E_val":"News:Gets the stream media forwarding address failed.","F_val":"提示：獲取流媒體轉發地址失敗。","C_val":"提示：获取流媒体转发地址失败。"},//
    {"id":"84","E_val":"News:Tip: the system allocation of resources is full.","F_val":"提示：系統分配資源已滿。","C_val":"提示：系统分配资源已满。"},//
    {"id":"85","E_val":"News:Failed to get logged on user information.","F_val":"提示：獲取已經登陸用戶資訊失敗。","C_val":"提示：获取已经登陆用户信息失败。"},//
    {"id":"86","E_val":"News:Failed to obtain user connection status.","F_val":"提示：獲取用戶連接狀態失敗。","C_val":"提示：获取用户连接状态失败。"},//
    {"id":"87","E_val":"News:The current video source can not be broadcast, please replace the video source.",
        "F_val":"提示：當前視頻源不能播放，請更換視頻源。","C_val":"提示：当前视频源不能播放，请更换视频源。"},//
    {"id":"88","E_val":"News:The current video source is full or no play.","F_val":"提示：當前視頻源播放資源已經滿或禁止播放。","C_val":"提示：当前视频源播放资源已经满或禁止播放。"},//
    {"id":"89","E_val":"News:The current video source can not be broadcast, please replace the video source.",
        "F_val":"提示：當前視頻源不能播放，請更換視頻源。","C_val":"提示：当前视频源不能播放，请更换视频源。"},//
    {"id":"90","E_val":"News:RTSP address of the currently playing video source ","F_val":"提示：當前播放視頻源的RTSP地址","C_val":"提示：当前播放视频源的RTSP地址"},//
    {"id":"91","E_val":"News:Please select model.","F_val":"提示：請選擇模式。","C_val":"提示：请选择模式。"},//
    {"id":"92","E_val":"News:Please input time round robin.","F_val":"提示：請輸入時間間隔輪巡。","C_val":"提示：请输入时间间隔轮巡。"},//
    {"id":"93","E_val":"News:Please mode round robin.","F_val":"提示：請選擇模式輪巡組。","C_val":"提示：请选择模式轮巡组。"},//
    {"id":"94","E_val":"News:Delete mode failed.","F_val":"提示：當前所刪除的模式不在此模式輪巡組中。","C_val":"提示：当前所删除的模式不在此模式轮巡组中。"},//
    {"id":"95","E_val":"Invoke","F_val":"調用","C_val":"调用"},//
    {"id":"96","E_val":"News:Modify failed.","F_val":"提示：修改失敗，請先把9分割改為子碼流。","C_val":"提示：修改失败，请先把9分割改为子码流。"},//
    {"id":"97","E_val":"News:Modify failed.","F_val":"提示：修改失敗，請先把16分割改為子碼流。","C_val":"提示：修改失败，请先把16分割改为子码流。"},//
    {"id":"98","E_val":"News:Setting mode round robin failed.","F_val":"提示：設定模式輪巡類型失敗。","C_val":"提示：设置模式轮巡类型失败。"},//
    {"id":"98.5","E_val":"News:Setting mode round robin success.","F_val":"提示：設定模式輪巡類型成功。","C_val":"提示：设置模式轮巡类型成功。"},//
    {"id":"99","E_val":"News:Getting mode round robin failed.","F_val":"提示：獲取模式輪巡類型失敗。","C_val":"提示：获取模式轮巡类型失败。"},//
    {"id":"100","E_val":"News:Invoking mode round robin failed.","F_val":"提示：調用模式輪巡組進行輪巡失敗。","C_val":"提示：调用模式轮巡组进行轮巡失败。"},//
    {"id":"101","E_val":"News:Getting mode round robin group failed.","F_val":"提示：獲取模式輪巡組失敗。","C_val":"提示：获取模式轮巡组失败。"},//
    {"id":"102","E_val":"News:Invoking mode round robin group failed.","F_val":"提示：調用模式組進行輪巡失敗。","C_val":"提示：调用模式组进行轮巡失败。"},//
    {"id":"103","E_val":"Open PIP","F_val":"開啟添加視窗","C_val":"开启添加窗口"},
    {"id":"103.5","E_val":"Shut PIP","F_val":"關閉添加視窗","C_val":"关闭添加窗口"},
    {"id":"104","E_val":"Initialize","F_val":"初始化","C_val":"初始化"},
    {"id":"104.5","E_val":"Initialize Window","F_val":"初始化視窗","C_val":"初始化窗口"},
    {"id":"105","E_val":"News：Mode data is null.","F_val":"提示：模式檔為空。","C_val":"提示：模式文件为空。"},
    {"id":"106","E_val":"Pixel","F_val":"解析度","C_val":"分辨率"},
    {"id":"107","E_val":"Video Standard","F_val":"視頻制式","C_val":"视频制式"},
    {"id":"108","E_val":"Row","F_val":"行","C_val":"行"},
    {"id":"109","E_val":"Column","F_val":"列","C_val":"列"},
    {"id":"110","E_val":"Init","F_val":"初始化","C_val":"初始化"},
    {"id":"111","E_val":"Cancel","F_val":"取消","C_val":"取消"},
    {"id":"112","E_val":"Split Window","F_val":"視窗拆分","C_val":"窗口拆分"},
    {"id":"113","E_val":"Split","F_val":"拆分","C_val":"拆分"},
    {"id":"114","E_val":"The search input source is empty .","F_val":"尚未搜尋輸入源。","C_val":"尚未搜索输入源。"},
    {"id":"115","E_val":"Please Input Data","F_val":"請輸入內容","C_val":"请输入内容"},
    {"id":"116","E_val":"S/N","F_val":"序號","C_val":"序号"},
    {"id":"117","E_val":"Name","F_val":"名稱","C_val":"名称"},
    {"id":"118","E_val":"IP","F_val":"IP地址","C_val":"IP地址"},
    {"id":"119","E_val":"Channel Number","F_val":"通道號","C_val":"通道号"},
    {"id":"120","E_val":"Select Mode","F_val":"模式選擇","C_val":"模式选择"},
    {"id":"121","E_val":" Modify Number","F_val":"視窗號修改","C_val":"窗口号修改"},
    {"id":"122","E_val":"News：The window is the only and cannot be empty","F_val":"提示:視窗號是唯一且不能為空的","C_val":"提示:窗口号是唯一且不能为空的"},
    {"id":"123","E_val":"Save","F_val":"保存","C_val":"保存"},
    {"id":"124","E_val":"Cancel","F_val":"取消修改","C_val":"取消修改"},
    {"id":"125","E_val":"Out Channel","F_val":"輸出通道","C_val":"输出通道","type":"html"},
    {"id":"126","E_val":"Time Interval","F_val":"時間間隔循環","C_val":"时间间隔轮巡","type":"html"},
    {"id":"127","E_val":"Time Segment","F_val":"時間段循環","C_val":"时间段轮巡","type":"html"},
    {"id":"128","E_val":"Input","F_val":"輸入源","C_val":"输入源","type":"html"},
    {"id":"129","E_val":"Time Interval","F_val":"時間間隔","C_val":"时间间隔","type":"html"},
    {"id":"129.5","E_val":"Interval","F_val":"時間間隔","C_val":"时间间隔","type":"html"},
    {"id":"130","E_val":"Operate","F_val":"操作","C_val":"操作","type":"html"},
    {"id":"131","E_val":"Begin","F_val":"開始時間","C_val":"开始时间","type":"html"},
    {"id":"132","E_val":"End","F_val":"結束時間","C_val":"结束时间","type":"html"},
    {"id":"133","E_val":"Add","F_val":"添加","C_val":"添加","type":"value"},
    {"id":"134","E_val":"Close","F_val":"關閉","C_val":"关闭"},
    {"id":"135","E_val":"Modify Message","F_val":"資訊修改","C_val":"信息修改"},
    {"id":"136","E_val":"Nam","F_val":"名稱","C_val":"名称"},
    {"id":"137","E_val":"Long Time","F_val":"時長","C_val":"时长"},
    {"id":"138","E_val":"News：Time interval in seconds, can enter the Numbers.","F_val":"提示：時間間隔是以秒為單位，只能輸入數字","C_val":"提示：时间间隔是以秒为单位，只能输入数字"},
    {"id":"139","E_val":"News：Time is 24 hours, example: 01:01.","F_val":"提示：時間段是以24小時制,例子：01:01(1點1分)","C_val":"提示：时间段是以24小时制,例子：01:01(1点1分)"},
    {"id":"140","E_val":"Search","F_val":"搜尋","C_val":"搜索","type":"html"},
    {"id":"141","E_val":"Address/Number/Name","F_val":"輸入源地址/序號/名稱","C_val":"输入源地址/序号/名称"},
    {"id":"142","E_val":"Address","F_val":"地址","C_val":"地址"},
    {"id":"143","E_val":"Segment","F_val":"時間段","C_val":"时间段"},
    {"id":"144","E_val":"Set Time","F_val":"設定時間","C_val":"设置时间","type":"html"},
    {"id":"145","E_val":"Tip","F_val":"提示","C_val":"提示","type":"html"},
    {"id":"146","E_val":"Can set the yime segment and yime interval at the same time","F_val":"時間間隔與時間段兩種設定可以同時填寫","C_val":"时间间隔与时间段两种设置可以同时填写"},
    {"id":"147","E_val":"Second","F_val":"整數單位秒(s)","C_val":"整数单位秒(s)","type":"placeholder"},
    {"id":"148","E_val":"Mode Round Robin Type","F_val":"當前模式輪巡的類型","C_val":"当前模式轮巡的类型","type":"html"},
    {"id":"149","E_val":"Timing Switch Round Robin","F_val":"模式定時切換輪巡","C_val":"模式定时切换轮巡","type":"html"},
    {"id":"150","E_val":"Mode Group Round Robin","F_val":"按模式輪巡組輪巡","C_val":"按模式轮巡组轮巡","type":"html"},
    {"id":"151","E_val":"Set Type","F_val":"设置类型","C_val":"设置类型","type":"value"},
    {"id":"152","E_val":"Date","F_val":"日期","C_val":"日期","type":"html"},
    {"id":"153","E_val":"Time","F_val":"時間","C_val":"时间","type":"html"},
    {"id":"154","E_val":"Week","F_val":"星期","C_val":"星期","type":"html"},
    {"id":"155","E_val":"Open/Close","F_val":"打開/關閉","C_val":"打开/关闭","type":"html"},
    {"id":"156","E_val":"Mode Name","F_val":"模式名稱","C_val":"模式名称","type":"html"},
    {"id":"157","E_val":"Add ","F_val":"加入輪巡","C_val":"加入轮巡","type":"value"},
    {"id":"158","E_val":"Mode Group","F_val":"模式輪巡組","C_val":"模式轮巡组","type":"html"},
    {"id":"159","E_val":"Open","F_val":"開始輪巡","C_val":"开始轮巡","type":"value"},
    {"id":"160","E_val":"Stop","F_val":"停止輪巡","C_val":"停止轮巡","type":"value"},//
    {"id":"161","E_val":"Remove","F_val":"刪除","C_val":"删除","type":"html"},
    {"id":"162","E_val":"Custom Windows Manage","F_val":"自訂輸出視窗管理","C_val":"自定义输出窗口管理","type":"html"},
    {"id":"163","E_val":"Video Replay","F_val":"錄影回放管理","C_val":"录像回放管理","type":"title"},
    {"id":"164","E_val":"","F_val":"NVR/DVR ：","C_val":"NVR/DVR ：","type":"html"},
    {"id":"165","E_val":"Channel Name：","F_val":"通道名稱：","C_val":"通道名称：","type":"html"},
    {"id":"166","E_val":"Search Type：","F_val":"搜尋類型：","C_val":"搜索类型：","type":"html"},
    {"id":"167","E_val":"Video Type：","F_val":"錄影類型：","C_val":"录像类型：","type":"html"},
    {"id":"168","E_val":"Begin Time：","F_val":"開始時間：","C_val":"开始时间：","type":"html"},
    {"id":"169","E_val":"End Time：","F_val":"結束時間：","C_val":"结束时间：","type":"html"},
    {"id":"170","E_val":"Search","F_val":"查詢","C_val":"查询","type":"value"},
    {"id":"171","E_val":"Select","F_val":"選擇","C_val":"选择","type":"html"},
    {"id":"172","E_val":"S/N","F_val":"序號","C_val":"序号","type":"html"},
    {"id":"173","E_val":"File","F_val":"錄影檔","C_val":"录像文件","type":"html"},
    {"id":"174","E_val":"Date","F_val":"錄影日期","C_val":"录像日期","type":"html"},
    {"id":"175","E_val":"Window：","F_val":"輸出視窗：","C_val":"输出窗口：","type":"html"},
    {"id":"176","E_val":"Replay Date：","F_val":"回放日期：","C_val":"回放日期：","type":"html"},
    {"id":"177","E_val":"Time Replay ：","F_val":"按時間回放：","C_val":"按时间回放：","type":"html"},
    {"id":"178","E_val":"Replay","F_val":"回放","C_val":"回放","type":"value"},
    {"id":"179","E_val":"News：Click the blue area to playback or select the time point in the “Time Replay ” input box and click “Replay” button to replay.","F_val":"提示：點擊到藍色區域快速開始回放錄影,或者在“按時間回放”輸入框選擇時間點擊“回放”按鈕開始回放。","C_val":"提示：点击到蓝色区域快速开始回放录像,或者在“按时间回放”输入框选择时间点击“回放”按钮开始回放。","type":"html"},

//	       {"id":"106","E_val":"","F_val":"","C_val":""},//
//	       {"id":"107","E_val":"","F_val":"","C_val":""},//
//	       {"id":"108","E_val":"","F_val":"","C_val":""},//
//	       {"id":"109","E_val":"","F_val":"","C_val":""},//
];














/*
 * smartMenu.js 智能上下文菜单插件
 * http://www.zhangxinxu.com/
 *
 * Copyright 2011, zhangxinxu
 *
 * 2011-05-26 v1.0	编写
 * 2011-06-03 v1.1	修复func中this失准问题
 * 2011-10-10 v1.2  修复脚本放在<head>标签中层无法隐藏的问题
 * 2011-10-30 v1.3  修复IE6~7下二级菜单移到第二项隐藏的问题
 * 2016-02-25 v2.0  添加了title属性的写入
 */

(function($) {
    var D = $(document).data("func", {});
    $.smartMenu = $.noop;
    $.fn.smartMenu = function(data, options) {

        var B = $("body"), defaults = {
            name : "",
            offsetX : 2,
            offsetY : 2,
            textLimit : 30,
            beforeShow : $.noop,
            afterShow : $.noop
        };
        var params = $.extend(defaults, options || {});
        var htmlCreateMenu = function(datum) {
            var dataMenu = datum || data, nameMenu = datum ? Math.random()
                .toString() : params.name, htmlMenu = "", htmlCorner = "", clKey = "smart_menu_";
            if ($.isArray(dataMenu) && dataMenu.length) {
                htmlMenu = '<div id="smartMenu_' + nameMenu + '" class="'
                    + clKey + 'box">' + '<div class="' + clKey + 'body">'
                    + '<ul class="' + clKey + 'ul">';
                var nums=0;
                $.each(dataMenu,function(i, arr) {
                    if (i) {htmlMenu = htmlMenu + '<li class="'+ clKey+ 'li_separate">&nbsp;</li>';}
                    if ($.isArray(arr)) {
                        $.each(arr,function(j, obj) {
                            var text = obj.text, htmlMenuLi = "", strTitle = "", rand = Math
                                .random().toString().replace(".","");
                            var title=(obj.title!=null)?obj.title:"";
                            if (text) {
                                if (text.length > params.textLimit) {
                                    text = text.slice(0,params.textLimit)+ "…";
                                    strTitle = ' title="'+ obj.text	+ '"';
                                }
                                nums++;
                                //自定义显示内容区域
//	 							if(text=="720P"){
//	 								text="<span style='color:red;'>720P</span>";
//	 							}
                                /********************************
                                 * @mes 自定义设置显示颜色
                                 * @addTime=2016-11-7
                                 */
//	 							text=updataText(text);
                                if ($.isArray(obj.data)&& obj.data.length) {
                                    htmlMenuLi = '<li class="'+ clKey+ 'li" data-hover="true">'
                                        + htmlCreateMenu(obj.data)+ '<a href="javascript:" class="'
                                        + clKey+ 'a"'+ strTitle+ ' id="youjian'+nums+'" title="'+title+'"  data-key="'+ rand+ '"><i class="'
                                        + clKey+ 'triangle"></i>'+ text+ '</a>'+ '</li>';
                                } else {
                                    if(defaults.name.substring(0,6)=="design"){
                                        htmlMenuLi = '<li class="'+ clKey+ 'li">'+ '<a href="javascript:" class="'
                                            + clKey+ 'a"'+ strTitle+ ' onclick="designThis(this)" title="'+title+'" id="design'+nums+'" data-key="'+ rand+ '">'+ text+ '</a>'+ '</li>';

                                    }else{
                                        htmlMenuLi = '<li class="'+ clKey+ 'li">'+ '<a href="javascript:" class="'
                                            + clKey+ 'a"'+ strTitle+ '  title="'+title+'" data-key="'+ rand+ '">'+ text+ '</a>'+ '</li>';
                                    }
                                }
                                htmlMenu += htmlMenuLi;
                                var objFunc = D.data("func");
                                objFunc[rand] = obj.func;
                                D.data("func",objFunc);
                            }
                        });
                    }
                });
                htmlMenu = htmlMenu + '</ul>' + '</div>' + '</div>';
            }
            return htmlMenu;
        }, funSmartMenu = function() {

            var idKey = "#smartMenu_", clKey = "smart_menu_", jqueryMenu = $(idKey+ params.name);
            if (!jqueryMenu.size()) {
                $("body").append(htmlCreateMenu());
                // 事件
                $(idKey + params.name + " a").bind("click",function() {
                    var key = $(this).attr("data-key"), callback = D.data("func")[key];
                    if ($.isFunction(callback)) {
                        callback.call(D.data("trigger"));
                    }
                    $.smartMenu.hide();
                    return false;
                });
                $(idKey + params.name + " li").each(function() {
                    var isHover = $(this).attr("data-hover"), clHover = clKey+ "li_hover";
                    $(this).hover(function() {
                        var jqueryHover = $(this).siblings("." + clHover);
                        jqueryHover.removeClass(clHover).children("."+ clKey+ "box").hide();
                        jqueryHover.children("."+ clKey+ "a").removeClass(clKey+ "a_hover");
                        if (isHover) {
                            $(this).addClass(clHover).children("."+ clKey+ "box").show();
                            $(this).children("."+ clKey+ "a").addClass(clKey+ "a_hover");
                        }
                    });

                });
                return $(idKey + params.name);
            }
            return jqueryMenu;
        };

        $(this).each(function() {
            this.oncontextmenu = function(e) {
                // 回调
                if ($.isFunction(params.beforeShow)) {
                    params.beforeShow.call(this);
                }
                e = e || window.event;
                // 阻止冒泡
                e.cancelBubble = true;
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                // 隐藏当前上下文菜单，确保页面上一次只有一个上下文菜单
                $.smartMenu.hide();
                var st = D.scrollTop();
                var jqueryMenu = funSmartMenu();
                if (jqueryMenu) {
                    jqueryMenu.css({
                        display : "block",
                        left : e.clientX + params.offsetX,
                        top : e.clientY + st + params.offsetY
                    });
                    D.data("target", jqueryMenu);
                    D.data("trigger", this);
                    // 回调
                    if ($.isFunction(params.afterShow)) {
                        params.afterShow.call(this);
                    }
                    return false;
                }
            };
        });
        if (!B.data("bind")) {
            B.bind("click", $.smartMenu.hide).data("bind", true);
        }
    };
    $.extend($.smartMenu, {
        hide : function() {
            var target = D.data("target");
            if (target && target.css("display") === "block") {
                target.hide();
                target.remove();
            }
        },
        removeevent : function(event) {
            var target = D.data("target");
            if (target) {
                target.remove();
                if ($.isFunction(event)) {
                    event.call(this);
                }
            }
        },
        remove : function() {
            var target = D.data("target");
            if (target) {
                target.remove();
            }
        }
    });
})(jQuery);



/***********************************
 * reback.js录像回话
 */

var lx_down = null;// 录像鼠标按下坐标
var lx_div = null;// 录像对话框的宽高
var clickColor = "#B0AFB6";// 单击背景颜色
var MAXNUM=9999;

// 录像类型
var videoType = [{
    "id" : 8,
    "val" : showJSTxt(js_1,42)
}, {
    "id" : 2,
    "val" : showJSTxt(js_1,20)
}, {
    "id" : 1,
    "val" : showJSTxt(js_1,21)
}, {
    "id" : 3,
    "val" : showJSTxt(js_1,22)
}, {
    "id" : 4,
    "val" : showJSTxt(js_1,23)
}, {
    "id" : 5,
    "val" : showJSTxt(js_1,24)
}, {
    "id" : 6,
    "val" : showJSTxt(js_1,25)
}, {
    "id" : 7,
    "val" : showJSTxt(js_1,26)
} ];
/*******************************************************************************
 * 打开录像回放管理
 ******************************************************************************/
function playback_video() {
    try {
        // rightId窗口ID
        var decoders = returnList("decoderList");// 输入源数组
        if (decoders != null) {
            $("#lxhf_div").show();
            $("#lxnr_ul_val li").remove();
            playback_show_nvr();// 调用显示NVR/DVR
        } else {
            upAlert(showJSTxt(js_1,27));
        }
    } catch (e) {//
        setError("playback_video", e);
    }
}
/*******************************************************
 * 把接收的数据进行处理
 * @param param
 */
function zh_name(param){
    try {
        if(param!=null){
            var str = param.split("/");
            var date = str[2];
            var time = str[4].split("[")[0];
            var begin = (time.split("-")[0]).split(".")[0] + ":"
                + (time.split("-")[0]).split(".")[1] + ":"
                + (time.split("-")[0]).split(".")[2];
            var end = (time.split("-")[1]).split(".")[0] + ":"
                + (time.split("-")[1]).split(".")[1] + ":"
                + (time.split("-")[1]).split(".")[2];
            var obj= date+" "+begin+"/"+date+" "+end;
            return obj;
        }
    } catch (e) {
        setError("zh_name",e);
    }
}

/*******************************************************************************
 * 保存转换后的录像名称
 * @param sInputId
 * @param sChannal
 * @param strs
 */
function zh_time(strs,sInputId,sChannal) {
    try {
        // str="/idea0/2016-01-16/002/11.00.00-12.00.00[R][@337c2][2].h264";
//	 		showMes("进来");
//	 		if($("#lxhf_div").css("display")!="block"){
//	 			upAlert("提示：尚未打开录像回放管理界面。");
//	 			return;
//	 		}
        if (strs != null&&strs!="") {
            var list = strs.split(",");
            //	showMes("list:"+JSON.stringify(list));
            // localStorage.removeItem("video_list");
            var videos = returnList("video_list");
            var video_obj = new Object();
            video_obj.id =0;
            video_obj.gn=0;
            if(sInputId!=null&&sChannal!=null){//获取
                video_obj.id =sInputId;
                video_obj.gn=sChannal;
            }
//	 			if($("#lxhf_div").css("display")=="block"||$("#lxhf_div").css("display")=="inline-block"){
//	 				video_obj.id = $("#lx_ip").val();
//	 				video_obj.gn = $("#lx_td").val();
//	 			}

            video_obj.dv=1;
            video_obj.type = 8;
            video_obj.list = new Array();
            showMes("video_obj:"+JSON.stringify(video_obj));
            if (list != null) {
                var vs = new Array();
                for ( var i = 0; i < list.length; i++) {
                    var str = list[i];
                    var date = "";
                    var time = "";
                    var begin = "";
                    var end = "";
                    var obj = new Object();
                    if (str != null && str != "") {
                        str = str.split("/");
                        date = str[2];
                        time = str[4].split("[")[0];
                        begin = (time.split("-")[0]).split(".")[0] + ":"
                            + (time.split("-")[0]).split(".")[1] + ":"
                            + (time.split("-")[0]).split(".")[2];
                        end = (time.split("-")[1]).split(".")[0] + ":"
                            + (time.split("-")[1]).split(".")[1] + ":"
                            + (time.split("-")[1]).split(".")[2];
                        obj.id = list[i];
                        obj.name = begin + "-" + end;
                        obj.date = date + " " + begin;
//	 						 showMes("begin:"+begin+" end:"+end,"red");
                        obj.begin = time_zh_num(begin);
                        obj.end = time_zh_num(end);
                        if(obj.begin>obj.end){
                            obj.end=time_zh_num("23:59:59");
                        }
                        vs.push(obj);
                    }
                }
                // 数组排序
                for ( var i = 0; i < vs.length; i++) {
                    for ( var j = 0; j < vs.length; j++) {
                        // showMes("bool:"+compare_time(vs[i].date,vs[j].date));
                        if (compare_time(vs[i].date, vs[j].date)) {
                            var a = vs[i];
                            vs[i] = vs[j];
                            vs[j] = a;
                        }
                    }
                }
                if (vs != null) {
                    video_obj.list = vs;
                }
                // showMes("video:"+JSON.stringify(video_obj));
                var bool = true;
                if (videos != null) {
                    for ( var i = 0; i < videos.length; i++) {
                        if (videos[i].id == video_obj.id
                            && videos[i].gn == video_obj.gn) {
                            videos[i] = video_obj;
                            bool = false;
                        }
                    }
                    if (bool) {
                        videos.push(video_obj);
                    }
                } else {
                    videos = new Array();
                    videos.push(video_obj);
                }
            }
            showMes("videos:"+JSON.stringify(videos));
            saveList("video_list", videos);
            if($("#lxhf_div").css("display")=="block"||$("#lxhf_div").css("display")=="inline-block"){
                showMes("显示："+JSON.stringify(videos));
                playback_show_allVideo(videos);// 调用显示所有查询录像的方法
            }

        }else{
            if($("#lxhf_div").css("display")=="block"||$("#lxhf_div").css("display")=="inline-block"){
                $("#lxnr_ul_val li").remove();
                $("#lxnr_ul_val").append("<li style='width:100%;line-height:24px;text-align:center; color:red;'>"+showJSTxt(js_1,44)+"</li>");
            }
        }
    } catch (e) {
        setError("zh_time", e);
    }
}
/*******************************************************************************
 * 把时间转换为秒数
 *
 * @param timeStr
 * @returns {Number}
 */
function time_zh_num(timeStr) {
    try {
        var num = 0;
        var hh = 0;
        var mm = 0;
        var ss = 0;
        if (timeStr != null && timeStr.split(":").length == 3) {
            hh = parseInt(timeStr.split(":")[0]);
            mm = parseInt(timeStr.split(":")[1]);
            ss = parseInt(timeStr.split(":")[2]);
        }
        num = (hh * 3600) + (mm * 60) + ss;
        return num;
    } catch (e) {
        setError("time_zh_num", e);
    }
}

/*******************************************************************************
 * 把秒数转换为时间
 *
 * @param num
 * @returns {String}
 */
function num_zh_time(num) {
    try {
        var str = "";
        var hh = "";
        var mm = "";
        var ss = "";
        if (num != null && isNaN(num) == false) {
            var h = parseInt(num / 3600);
            hh = (h > 9) ? h : "0" + h;
            var m = parseInt((num % 3600) / 60);
            mm = (m > 9) ? m : "0" + m;
            var s = (num % 3600) % 60;
            ss = (s > 9) ? s : "0" + s;
            str = hh + ":" + mm + ":" + ss;
        }
        return str;
    } catch (e) {
        setError("num_zh_time", e);
    }
}

/*******************************************************************************
 * 点击窗口查看当前NVR/DVR的所有录像视频
 *
 * @param obj
 ******************************************************************************/
function playback_click_win(obj) {
    try {
        var winId = obj.win;
        if ($("#lxrq_div").css("display") == "block"
            && $("#lxhf_div").css("display") == "block") {
            $("#lxtl_win option[value='" + winId + "']").attr("selected",
                "selected");
            sessionStorage.setItem("lxwin", winId);// 保存当前操作的状态
            var oiList = returnList("oiList");// 对应关系
            var list = returnList("decoderList");
            var inputId = 0;
            var inputGn = 0;
            if (oiList != null) {
                for ( var j = 0; j < oiList.length; j++) {
                    if (oiList[j].oi == winId) {
                        inputId = oiList[j].ii;
                        inputGn = oiList[j].gn;
                    }
                }
                for ( var i = 0; i < list.length; i++) {
                    if (list[i].type != 1 && checkInputType(list[i].type)
                        && list[i].id == inputId) {
                        $("#lx_ip option[value='" + inputId + "']").attr(
                            "selected", "selected");
                        playback_change_nvr({"value" : inputId});
                        $("#lx_td option[value='" + inputGn + "']").attr(
                            "selected", "selected");
                    }
                }
            }
        }
    } catch (e) {
        setError("playback_click_win", e);
    }
}
/*******************************************************************************
 * 显示所有小时
 ******************************************************************************/
function playback_show_hours() {
    try {
        $("#lxnr_num li").remove();
        for ( var i = 0; i <= 24; i++) {
            $("#lxnr_num").append(
                "<li class='lxnr_num_li' id='lxnr_num_li" + i + "'>" + i
                + "</li>");
        }
        palyback_show_canvas();// 图像显示当前什么时间存在录像文件
    } catch (e) {
        setError("playback_show_hours", e);
    }
}
/*******************************************************************************
 * 显示有录像的时间
 *
 * @param paramList
 * @param paramObj
 */
function palyback_show_canvas(paramList, paramObj) {
    try {
        // showMes("list:"+JSON.stringify(paramList));
        var can = document.getElementById("video_reback");
        var scrnWidth = can.clientWidth;// 从CSS样式获得屏幕宽度
        var scrnHeight = can.clientHeight;// 从CSS样式获得屏幕高度
        can.width = scrnWidth;// 设置屏幕的宽度
        can.height = scrnHeight;// 设置屏幕的高度
        var x1 = 0;
        var y1 = 0;
        var case_w = scrnWidth / 24;
        var case_h = scrnHeight;
        var cxt = can.getContext("2d");
        for ( var i = 0; i <= 24; i++) {
            cxt.beginPath();
            cxt.lineWidth = 0.5;
            cxt.strokeStyle = "white";
            cxt.fillStyle = "grey";
            cxt.rect(x1, y1, case_w, case_h);
            cxt.fill();
            cxt.stroke();
            x1 = x1 + case_w;
        }
        var blue_w = scrnWidth / 86400;
        var case_h = scrnHeight;
        var cxt = can.getContext("2d");
        x1 = 0;
        y1 = 0;
//	 		showMes("paramList:"+JSON.stringify(paramList));
        if (paramList != null) {
            for ( var i = 0; i < paramList.length; i++) {
                cxt.beginPath();
                cxt.lineWidth = 0.5;
                cxt.strokeStyle = "white";
                cxt.fillStyle = "#2D7AEF";
                x1 = paramList[i].b * blue_w;
                if( paramList[i].e==0){
                    w=(86399 - paramList[i].b) * blue_w;
                }else{
                    w = paramList[i].e * blue_w - paramList[i].b * blue_w;
                }
                cxt.rect(x1, y1, w, case_h);
                cxt.fill();
                cxt.stroke();
            }
        }
        if (paramObj != null) {
            // showMes("paramObj:"+paramObj,"blue");
            var text=$("#lxtl_tm").val();
            var centerx=scrnWidth/2-25;
            var centery=12;
            var cxt = can.getContext("2d");
            cxt.beginPath();
            cxt.lineWidth = 1;
            cxt.strokeStyle = "red";
            cxt.fillStyle = "red";
            cxt.rect(paramObj, y1, 1, case_h);
            cxt.fill();
            cxt.stroke();
//	 			if(paramObj>30){
//	 				centerx=paramObj-25;
//	 			}else if(paramObj<=30){
//	 				centerx=paramObj;
//	 			}else if(scrnWidth-paramObj<30){
//	 				centerx=paramObj-50;
//	 			}
//	 			
//	 			var ct = can.getContext("2d");
//	 			ct.font = "10px 宋体";
//	 			ct.fillStyle = "white";// 颜色红色
//	 			ct.lineWidth = 1;
//	 			ct.fillText(text, centerx, centery);
        }
    } catch (e) {
        setError("palyback_show_canvas", e);
    }
}
/*******************************************************************************
 * 点击鼠标显示鼠标标记的时间
 *
 * @param obj
 * @param param
 */
function click_canvas(obj,param) {
    try {
        var videos = returnList("video_list");
        // showMes("videos:"+JSON.stringify(videos),"red");
//	 		showMes("obj:"+obj+"  param:"+param);
        if (videos != null) {// 判断搜索的数据是否为空
            var ii = $("#lx_ip").val();
            var gn = $("#lx_td").val();
            var date = $("#lxtl_sj").val();
            var can = document.getElementById("video_reback");
            var scrnWidth = can.clientWidth;// 从CSS样式获得屏幕宽度
            var bl = 86400 / scrnWidth;
            var thisXY = getCanXY("video_reback");

            var hideX=document.getElementById("lxrq_div").scrollLeft;
            thisXY.x=thisXY.x+hideX;
            var num = parseInt(thisXY.x * bl);
//	 			 showMes("XY:"+JSON.stringify(thisXY)+" num:"+num+" date:"+date+" hideX:"+hideX,"red");
            var list = null;
            for ( var i = 0; i < videos.length; i++) {
                if (videos[i].id == ii && videos[i].gn == gn) {
                    list = videos[i].list;
                }
            }
            //	showMes("list:"+JSON.stringify(list));
            if (list != null) {// 判断当前日期下录像文件不为空
                var times = new Array();
                var s_bool = false;
                var id = "";
                for ( var i = 0; i < list.length; i++) {
                    if (list[i].date.split(" ")[0] == date.split(" ")[0]) {
                        var tm = new Object();
                        tm.b = list[i].begin;
                        tm.e = list[i].end;
                        if (tm.b <= num && num < tm.e) {
                            s_bool = true;
                            id = list[i].id;
                        }
                        times.push(tm);
                    }
                }
                if (s_bool) {// 是否在有效范围
                    // showMes("times:"+JSON.stringify(times));
                    $("#name_id").val(id);
                    var time = num_zh_time(num);
                    $("#lxtl_tm").val(time);
                    palyback_show_canvas(times, thisXY.x);
                    if(param==2){

                        time_play();
                    }

                } else {
                    $("#lxtl_tm").val("");
                    palyback_show_canvas(times);
                }
            }
        }

    } catch (e) {
        setError("click_canvas", e);
    }
}

/*******************************************************************************
 * 显示搜索条件
 ******************************************************************************/
function playback_show_nvr() {
    try {
        var decoders = returnList("decoderList");// 输入源数组
        var oiList = returnList("oiList");// 对应关系
        var playList=returnList("playList");//录像文件对应关系
        var videoList=returnList("video_list");//录像文件列表
        var wins = returnList("ouputXml");// 窗口文件
        var winId = 0;// 输出窗口号
        var ls=null;//
        var obj=null;//当前窗口的录像回放对应关系
        if (rightId != null) {
            winId = rightId;
            //	showMes("winId:"+winId+" playList:"+(playList!=null)+" videoList:"+(videoList!=null));
            if(playList!=null&&videoList!=null&&winId!=0){
                for(var i=0;i<playList.length;i++){
                    if(playList[i].wi==winId){
                        obj=new Object();
                        obj.ii=playList[i].ii;
                        obj.gn=playList[i].gn;
                        obj.nm=playList[i].nm;
                        obj.begin="";
                        obj.end="";
                    }
                }
                //	showMes("obj:"+JSON.stringify(obj),"red");
                if(obj!=null){
                    //compare_time(begin, revideo[j].date)
                    for(var i=0;i<videoList.length;i++){
                        if(videoList[i].id==obj.ii&&videoList[i].gn==obj.gn){
                            ls=videoList[i].list;
                        }
                    }
                    if(ls!=null){
                        for(var i=0;i<ls.length;i++){
                            if(i==0){
                                obj.begin=ls[i].date.split(" ")[0]+" 00:00:00";
                                obj.end=ls[i].date.split(" ")[0]+" 23:59:59";
                            }else{
                                if(compare_time(ls[i].date,obj.begin )){
                                    obj.begin=ls[i].date.split(" ")[0]+" 00:00:00";
                                }

                                if(compare_time(obj.end,ls[i].date)){
                                    obj.end=ls[i].date.split(" ")[0]+" 23:59:59";
                                }
                            }
                        }
                        //	 showMes("obj:"+JSON.stringify(obj),"blue");	
                        //	playback_show_allVideo(videoList);
                    }
                }
            }
        }
        var inputId = 0;// 输入源ID号
        var inputGn = 0;// 输入源通道号
        $("#lx_ip option").remove();
        $("#lx_td option").remove();
        $("#lx_ss option").remove();
        $("#lx_lx option").remove();
        $("#lxtl_win option").remove();
        var grName = null;
        var grnum=null;
        var index=0;
        var nvr=new Object();
        var deviceMes="";
        if(localStorage.getItem("sys")!=null){
            deviceMes=localStorage.getItem("sys").toString();
        }
        var showInputType=0;//是否显示摄像机
        // 搜索类型
        var seachType = [ {
            "id" : 1,
            "val" :showJSTxt(js_1,19)
        }
        ];
        if(deviceMes.indexOf("XMC")!=-1){//如果是熊迈就添加熊迈平台
            seachType.push({"id" : 2,"val" :showJSTxt(js_1,19.5)});
            showInputType=1;
        }
        if (decoders != null) {//显示所有
//	 			showMes("decoders:"+JSON.stringify(decoders));
            for ( var i = 0; i < decoders.length; i++) {// 显示所有NVR/DVR
                var condition=decoders[i].type != 3 &&decoders[i].type != 1 && checkInputType(decoders[i].type)
                    &&isNaN(decoders[i].gn)==false&&decoders[i].gn>0;
                if(showInputType==1){
                    condition=true;
                }
                if (condition) {
                    if (oiList != null) {
                        for ( var j = 0; j < oiList.length; j++) {
                            if (oiList[j].oi == winId) {
                                inputId = oiList[j].ii;
                                inputGn = oiList[j].gn;
                            }
                        }
                    }
                    $("#lx_ip").append(
                        "<option value='" + decoders[i].id + "'>"
                        + decoders[i].name + "</option>");
                    if(index==0){//第一次显示
                        index=i;
                        nvr.value=decoders[i].id;
                    }
                    if (decoders[i].id == inputId) {
                        $("#lx_ip option[value='" + inputId + "']").attr(
                            "selected", "selected");
                        index=i;
                        nvr.value=decoders[i].id;
                    }
                }
            }

            grName = decoders[index].grName;
            grnum=decoders[index].gn;
//	 			showMes("grnum:"+grnum,"red");
            if((grName!=null&&grName!="")||(grnum!=null&&grnum!="")){
                var names =null;
                try{
                    names=grName.split(",");
                }catch (e) {
                }
                if (names == null) {// 自动生成通道名称
                    var gn_num = 0;
                    names = new Array();
                    if (decoders[index].gn.indexof("n") != -1) {
                        gn_num = decoders[index].gn.split("n")[1];
                    } else {
                        gn_num = decoders[index].gn;
                    }
                    for ( var j = 1; j <= gn_num; j++) {
                        names.push(showJSTxt(indexJSList, 1) + "" + j);
                    }
                }
                names = gName_split(names);
                for ( var j = 0; j < names.length; j++) {// NVR通道显示
                    $("#lx_td").append(
                        "<option value='" + (j + 1) + "'>" + names[j]
                        + "</option>");
                    if ((j + 1) == inputGn) {
                        $("#lx_td option[value='" + inputGn + "']").attr(
                            "selected", "selected");
                    }
                }
            }else{//显示没有通道

            }

        }

        for ( var i = 0; i < seachType.length; i++) {// 录像存储位置显示
            $("#lx_ss").append(
                "<option value='" + seachType[i].id + "'>"
                + seachType[i].val + "</option>");
        }
        for ( var i = 0; i < videoType.length; i++) {// 录像类型显示
            if ($("#lx_ss").val() == "1") {
                $("#lx_lx").append(
                    "<option value='" + videoType[0].id + "'>"
                    + videoType[0].val + "</option>");
                break;
            } else {
                $("#lx_lx").append(
                    "<option value='" + videoType[i].id + "'>"
                    + videoType[i].val + "</option>");
            }
        }
        var myDate = new Date();
        var month = ((myDate.getMonth() + 1) > 9) ? (myDate.getMonth() + 1)
            : "0" + (myDate.getMonth() + 1);
        var day = (myDate.getDate() > 9) ? myDate.getDate() : "0"
        + myDate.getDate();
        var beginTime = myDate.getFullYear() + "-" + month + "-" + day
            + " 00:00:00";// 当前凌晨时间
        var endTime = myDate.getFullYear() + "-" + month + "-" + day
            + " 23:59:59";// 当前午夜时间
        $("#sech_begin").val(beginTime);
        $("#sech_end").val(endTime);
        if (wins != null) {
            // showMes("wins:"+JSON.stringify(wins),"red");
            for(var i=0;i<wins.length;i++){
                for(var j=0;j<wins.length;j++){
                    if(parseInt(wins[i].num)<parseInt(wins[j].num)){
                        var objs=wins[i];
                        wins[i]=wins[j];
                        wins[j]=objs;
                    }
                }
            }
            for ( var i = 0; i < wins.length; i++) {
                if(wins[i].num!=9999){
                    $("#lxtl_win").append(
                        "<option value='" + wins[i].id + "'>" + wins[i].num
                        + "</option>");
                }
            }

            $("#lxtl_win option[value='" + winId + "'] ").attr("selected",
                "selected");
        } else {
            $("#lxtl_win").append("<optiom value='0'>"+showJSTxt(indexJSList,60)+"</option>");
        }
        if(obj!=null&&ls!=null){//显示当前操作的状态
            $("#lx_ip option[value='" + obj.ii + "']").attr(
                "selected", "selected");
            $("#lx_td option[value='" + obj.gn + "']").attr(
                "selected", "selected");
            $("#sech_begin").val(obj.begin);
            $("#sech_end").val(obj.end);

        }
        playback_show_hours();// 显示所有小时
        if(obj!=null&&ls!=null){//默认显示的内容
            playback_show_allVideo(videoList,obj.nm);//显示当前操作的内容
        }else{
            playback_show_allVideo();
        }
        //showMes("nvr:"+JSON.stringify(nvr));
        playback_change_nvr(nvr);//默认显示NVR录像回放文件
    } catch (e) {
        setError("playback_show_nvr", e);
    }

}
/*******************************************************************************
 * 选择NVR的时候自动把通道显示出来
 ******************************************************************************/
function playback_change_nvr(obj) {
    try {
        var val = obj.value;
        var list = returnList("decoderList");
        $("#lx_td option").remove();
        if (list != null) {
            var grName = null;
            for ( var i = 0; i < list.length; i++) {
                if (list[i].id == val) {
                    grName = list[i].grName;
                }
            }
            if(grName!=null&&grName!=""){
                var names = grName.split(",");
                // showMes("names:"+JSON.stringify(names));
                if (names == null) {// 自动生成通道名称
                    var gn_num = 0;
                    names = new Array();
                    if (decoders[i].gn.indexof("n") != -1) {
                        gn_num = decoders[i].gn.split("n")[1];
                    } else {
                        gn_num = decoders[i].gn;
                    }
                    for ( var j = 1; j <= gn_num; j++) {
                        names.push(showJSTxt(indexJSList, 1) + "" + j);
                    }
                }
                names = gName_split(names);
                for ( var j = 0; j < names.length; j++) {// NVR通道显示
                    $("#lx_td").append(
                        "<option value='" + (j + 1) + "'>" + names[j]
                        + "</option>");
                }
            }else{
//	 				$("#lx_td").append(
//	 						"<option value='0'>" + showJSTxt(indexJSList, 1) +"0 </option>");
            }
        }
        playback_show_allVideo();// 调用查询录像数据方法
    } catch (e) {
        setError("playback_change_nvr", e);
    }
}

/*******************************************************************************
 * 判断录像视频是否存在
 *
 * @param obj
 ******************************************************************************/
function playback_change_type(obj) {
    try {
        var value = obj.value;
        $("#lx_lx option").remove();
        if (value == 1) {
            $("#lx_lx").append(
                "<option value='" + videoType[0].id + "'>"
                + videoType[0].val + "</option>");
        } else if (value == 2) {
            for ( var i = 0; i < videoType.length; i++) {
                $("#lx_lx").append(
                    "<option value='" + videoType[i].id + "'>"
                    + videoType[i].val + "</option>");
            }
        }
        playback_show_allVideo();// 调用查询录像数据方法
    } catch (e) {
        setError("playback_change_type", e);
    }
}
/*******************************************************************************
 * 搜索NVR通道的录像
 ******************************************************************************/
function playback_seach_order() {
    try {
        // if(checkPower(showJSTxt(inputJSList,32))==false){//调用查询权限的方法
        // return;
        // }
        //localStorage.removeItem("playList");
        var CbeginTime = 0;// 查询开始时间
        var CendTime = 0;// 查询结束时间
        CbeginTime = $("#sech_begin").val();
        CendTime = $("#sech_end").val();
        if(CbeginTime.split(" ")[0]!=CendTime.split(" ")[0]){//限制只能查询同一天
            upAlert(showJSTxt(indexJSList,108));
            return;
        }
        $("#lxnr_ul_val li").remove();
        $("#lxnr_ul_val").append("<li style='width:100%;line-height:24px;text-align:center; color:red;'>"+showJSTxt(js_1,54)+"</li>");
        var begin = $("#sech_begin").val();
        var end = $("#sech_end").val();
        if(begin==null||begin==""||end==null||end==""){
            upAlert(showJSTxt(js_1,47));
            return;
        }else if(compare_time(end,begin)){
            upAlert(showJSTxt(js_1,48));
            return;
        }
        if($("#lx_ip").val()==null||$("#lx_ip").val()==""){
            upAlert(showJSTxt(js_1,27));
            return;
        }
        var loginCode = returnSlist("loginCode");
        if (loginCode == null) {// 测试例子
            // loginCode=[11,22,33,44];
//	 			var list = "/idea0/2016-01-16/002/01.00.00-02.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-16/002/02.00.00-03.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-16/002/03.00.00-04.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-17/002/04.00.00-05.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-17/002/07.00.00-08.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-17/002/09.00.00-10.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-16/002/10.00.00-11.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-16/002/11.00.00-12.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-16/002/12.00.00-13.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-16/002/14.00.00-15.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-16/002/16.00.00-17.00.00[R][@337c2][2].h264,"
//	 					+ "/idea0/2016-01-16/002/18.00.00-19.00.00[R][@337c2][2].h264";
//	 			zh_time(list);
//	 			return;
            loginCode=[0x00,0x00,0x00,0x00];
        }
        clearData();
        allNum = 1;// 初始化总次数
        inNum = 1;// 初始化第几次
        code.type = zh(4);
        code.num = zh(1);
        code.one = zh(loginCode[0]);
        code.tow = zh(loginCode[1]);
        code.three = zh(loginCode[2]);
        code.four = zh(loginCode[3]);
        bigFile = "";
        //	thisSocket = parent.socket;
        var nvrId = 0;// NVR ID号
        var nvrNum = 0;// NVR 通道号
        var deviceType=0;//录像存储位置
        var videoType = 0;// 录像类型
        var beginTime = 0;// 查询开始时间
        var endTime = 0;// 查询结束时间
        nvrId = parseInt($("#lx_ip").val());
        nvrNum = parseInt($("#lx_td").val());
        videoType = parseInt($("#lx_lx").val());
        deviceType = parseInt($("#lx_ss").val());
        beginTime = $("#sech_begin").val();
        endTime = $("#sech_end").val();
        if(beginTime.split(" ")[0]!=endTime.split(" ")[0]){//限制只能查询同一天
            upAlert(showJSTxt(indexJSList,108));
            return;
        }
        if (beginTime != null) {
            beginTime = beginTime.split(" ")[0] + "T" + beginTime.split(" ")[1];
        }

        if (endTime != null) {
            endTime = endTime.split(" ")[0] + "T" + endTime.split(" ")[1];
        }
        if(deviceType==2){//判断是否是搜索平台
            if(nvrNum==null||nvrNum==""||isNaN(nvrNum)){
                nvrNum=0;
            }
            nvrNum=parseInt(nvrNum)+4096;
//	 			showMes("nvrNum:"+nvrNum);
        }
        bigFile = nvrId + "," + nvrNum+ "," + videoType + ","
            + beginTime + "," + endTime;
        var rStr="@"+bigFile.length+"/"+bigFile;
        LK_CAN_OBJ.onExt(1,41,rStr);//调用回调接口

//	 		if(checkMes()){
//	 			//showMes("发送命令:");
//	 			sendBigFile();// 发送获取录像列表
//	 	 	}else{
//	 	 		upAlert(showJSTxt(indexJSList,14));
//	 	 	}
    } catch (e) {
        setError("playback_seach_order", e);
    }
}

/*******************************************************************************
 * 显示搜索的录像视频
 * @param paramList
 * @param paramName
 ******************************************************************************/
function playback_show_allVideo(paramList,paramName) {
    try {
        var list = null;
        /*
         * 服务器获取经过处理的数组
         */
        if (paramList != null) {
            list = paramList;// 参数传递的数组
        } else if (paramList == null&& localStorage.getItem("video_list") != null) {
            list = returnList("video_list");// 缓存数据
        }

        if (list != null) {
            var id = $("#lx_ip").val();
            var gn = $("#lx_td").val();
            var type = $("#lx_lx").val();
            var dv=$("#lx_ss").val();
            var begin = $("#sech_begin").val();
            var end = $("#sech_end").val();
            if(begin==null||begin==""||end==null||end==""){//判断为空
                upAlert(showJSTxt(js_1,47));
                return;
            }else if(compare_time(end,begin)){//判断数据正确性
                upAlert(showJSTxt(js_1,48));
                return;
            }
            var check_str = "";// 复选框
            var num_str = "";// 序号
            var name_str = "";// 名称
            var date_str = "";// 时间
            $(".lxnr_ul_val li").remove();
            $("#lxtl_sj option").remove();
            var index = 0;
            var dateList = new Array();
            for ( var i = 0; i < list.length; i++) {// 循环显示所有数组
                if (list[i].id == id && list[i].gn == gn
                    && list[i].type == type&&list[i].dv==dv) {
                    // showMes("compare_time(begin,list[i].date):"+compare_time(begin,list[i].date)+
                    // "
                    // compare_time(list[i].date,end):"+compare_time(list[i].date,end));
                    var revideo = list[i].list;
//	 					 showMes("value:"+JSON.stringify(revideo),"red");
                    for ( var j = 0; j < revideo.length; j++) {
                        if (compare_time(begin, revideo[j].date)
                            && compare_time(revideo[j].date, end)) {
                            var rq = revideo[j].date;
                            // var tm=revideo[j].date.split(" ")[1];
                            index++;
                            var bo = true;
                            for ( var a = 0; a < dateList.length; a++) {
                                if (rq.split(" ")[0] == dateList[a].date
                                        .split(" ")[0]) {
                                    bo = false;
                                    var tm = new Object();
                                    tm.b = revideo[j].begin;
                                    tm.e = revideo[j].end;
                                    dateList[a].list.push(tm);
                                }
                            }
                            if (bo) {
                                var obj = new Object();
                                obj.date = rq;
                                obj.list = new Array();
                                var tm = new Object();
                                tm.b = revideo[j].begin;
                                tm.e = revideo[j].end;
                                obj.list.push(tm);
                                dateList.push(obj);
                            }
                            var day = rq.split(" ")[0];
                            num_str = "<span class='lxnr_xh'>" + index
                                + "</span>";
                            name_str = "<span class='lxnr_wj'  >"
                                + revideo[j].name + "</span>";
                            date_str = "<span class='lxnr_sj' >" + day
                                + "</span>";
                            //showMes("paramName:"+paramName,"black");
                            if(paramName!=null&&paramName==revideo[j].id){

                                $(".lxnr_ul_val").append(
                                    "<li class='lxnr_li' style='background-color:"+clickColor+"' id='file_"+ revideo[j].id
                                    + "' ondblclick='playback_dblclick(this)'>"
                                    + check_str + num_str+ name_str + date_str+ "</li>");
                            }else{
                                $(".lxnr_ul_val").append(
                                    "<li class='lxnr_li' id='file_"+ revideo[j].id
                                    + "' ondblclick='playback_dblclick(this)'>"
                                    + check_str + num_str+ name_str + date_str+ "</li>");
                            }
                        }
                    }
                }
            }
            palyback_show_canvas(null);
            // 把搜索到的日期都列出来
            for ( var i = 0; i < dateList.length; i++) {
                var day = dateList[i].date.split(" ")[0];
                $("#lxtl_sj").append(
                    "<option value='" + dateList[i].date + "'>" + day
                    + "</option>");
                if (i == 0) {
                    // 显示当前日期的所有录像时间
                    palyback_show_canvas(dateList[i].list);
                }
            }
        }
    } catch (e) {
        setError("playback_show_allVideo", e);
    }
}
/***********************************************
 * 选择日期显示当前日期的录像文件
 * @param obj
 */
function select_date(obj){
    try {
        var list = getThisList();// 获取当天的录像数组
        //showMes("list:"+JSON.stringify(list),"red");
        var paramList=new Array();
        for(var i=0;i<list.length;i++){
            var obj=new Object();
            obj.b=list[i].begin;
            obj.e=list[i].end;
            paramList.push(obj);
        }
        $("#lxtl_tm").val("");
        palyback_show_canvas(paramList);
    } catch (e) {
        setError("select_date",e);
    }
}

/***************************************
 * 清理回放录像缓存
 * @param winId
 */
function clearPlayType(winId){
    try {
        var playList=returnList("playList");
        if(winId==0||winId==null){//清理所有窗口的回放录像缓存
            playList=new Array();
            saveList("playList",playList);
            winId=0;

        }else if(playList!=null){
            for(var i=0;i<playList.length;i++){
                if(playList[i].wi==winId||playList[i].nm==""||playList[i].nm==null){
                    playList.splice(i,1);
                    i=0;
                }
            }
            saveList("playList",playList);
        }
        up_replay_img(winId);
    } catch (e) {
        setError("clearPlayType",e);
    }
}

/********************************************
 * 点击窗口查看当前播放的状态
 * @param winId
 */
function click_win_showType(winId){
    try {
        var list=returnList("playList");//播放状态数组

        var out=xmlEntities;//窗口数组
        if(out==null||out.length<1){
            return;
        }
        if(list==null||list.length<1){
            return;
        }//
        var ids=new Array();//多个ID选中的时候
        if(out!=null){//多个窗口操作
            for(var i=0;i<out.length;i++){
                if(out[i].strokeColor=="red"){
                    ids.push(out[i].id);
                }
            }
            //	showMes("ids:"+JSON.stringify(ids));
            if(ids.length>1){
                for(var i=0;i<ids.length;i++){
                    for(var j=0;j<list.length;j++){
                        if(ids[i]==list[j].wi){
                            winId=ids[i];
                        }
                    }
                }
            }
        }
        if($("#lxhf_div").css("display")=="block"&&$("#lxrq_div").css("display")=="block"){
            rightId=winId;
            //	showMes("rightId:"+rightId,"red");
            playback_show_nvr();//显示内容
        }

        if(list!=null){
            var obj=null;//刷新状态的时候
            for(var i=0;i<list.length;i++){
                if(list[i].wi==winId){
                    list[i].id=1;
                    obj=list[i];
                }else{
                    list[i].id=0;
                }
            }
            //判断缓存对应关系是否正常，把不正确的清理掉
            for(var i=0;i<list.length;i++){
                if(list[i].nm==null||list[i].nm==""	){
                    list.splice(i,1);
                    i=0;
                }
            }
            saveList("playList",list);

        }

        up_replay_img(winId);// 刷新状态
    } catch (e) {
        setError("click_win_showType",e);
    }
}

/*******************************************************************************
 * 双击播放录像文件
 *
 * @param obj
 */
function playback_dblclick(obj) {
    try {
        var id = obj.id.substr(5);
        // showMes("id:"+id);
        $(".lxnr_li").css("background-color", "white");
        $(obj).css("background-color", clickColor);
        // showMes("class:"+$(check_box).attr("class")+" id:"+check_box.id);
        var winId = parseInt($("#lxtl_win").val());
        var inputId = parseInt($("#lx_ip").val());
        var name = id;
        var playObj = new Object();
        playObj.wi = winId;
        playObj.ii = inputId;
        playObj.gn = parseInt($("#lx_td").val());
        playObj.nm = id;
        playObj.pt = 1;
        playObj.pn = 1;
        playObj.id = 1;
        save_play_type(playObj);// 保存操作录像文件状态
        var loginCode = returnSlist("loginCode");
        if(loginCode==null){
            loginCode=[0x00,0x00,0x00,0x00];

        }
        if (loginCode != null) {
            clearData();
            allNum = 1;// 初始化总次数
            inNum = 1;// 初始化第几次
            code.type = zh(4);
            code.num = zh(2);
            code.one = zh(loginCode[0]);
            code.tow = zh(loginCode[1]);
            code.three = zh(loginCode[2]);
            code.four = zh(loginCode[3]);
            bigFile = "";
            thisSocket = parent.socket;
            bigFile = winId + "," + inputId+ "," + name;
            var rStr="@"+bigFile.length+"/"+bigFile;
            LK_CAN_OBJ.onExt(1,42,rStr);//调用回调接口
//	 			if(checkMes()){
//	 			//	showMes("bigFile:"+JSON.stringify(bigFile),"red");
//	 				sendBigFile();// 发送获取录像列表
//	 		 	}else{
//	 		 		upAlert(showJSTxt(indexJSList,14));
//	 		 	}
        }
    } catch (e) {
        setError("playback_dblclick", e);
    }
}

/*******************************************************************************
 * 保存当前操作的状态
 *
 * @param paramObj
 */
function save_play_type(paramObj) {
    try {
        // showMes("paramObj:"+JSON.stringify(paramObj),"red");
        var list = returnList("playList");
        //showMes("list:"+JSON.stringify(list));
        if (list == null) {
            list = new Array();
        }
        var bool = true;
        for ( var i = 0; i < list.length; i++) {
            if (list[i].wi == paramObj.wi) {
                list[i] = paramObj;
                bool = false;
            } else {
                list[i].id = 0;
            }
        }
        if (bool) {
            list.push(paramObj);
        }
        saveList("playList", list);
        up_replay_img();// 刷新状态
    } catch (e) {
        setError("save_play_type", e);
    }
}
/*******************************************************************************
 * 修改控制录像视频图片按钮
 * @param winId
 */
function up_replay_img(winId) {
    try {
        var list = returnList("playList");
        if (list != null) {
            var bool = false;
            var playType = 0;
            for ( var i = 0; i < list.length; i++) {
                if(winId!=null){
                    if (list[i].wi==winId&&list[i].id == 1) {
                        playType = list[i].pt;
                        bool = true;
                    }
                }else{
                    if (list[i].id == 1) {
                        playType = list[i].pt;
                        bool = true;
                    }
                }

            }
            //	showMes("winId:"+winId+" bool:"+bool);
            if (bool) {
                $(".hf_img").each(function() {
                    if(this.id=="hf_qp"){
                        return;
                    }
                    var path = $(this).attr("src").split("_")[0] + "_";
                    // var
                    // num=$(this).attr("src").split("_")[1].substr(0,1);
                    var index = ($(this).attr("src").split("_")[1]).split(".")[0].substr(1);
                    var png = ($(this).attr("src").split("_")[1]).split(".")[1];
                    // showMes("path:"+path+" num:"+num+"
                    // index:"+index+" png:"+png);
                    var src = path + "1" + index + "." + png;
                    // showMes("src:"+src,"red");
                    $(this).attr("src", src);
                    if (playType == 1) {
                        $("#hf_bf").hide();
                        $("#hf_zt").show();
                        $("#hf_hf").show();
                    } else if (playType == 2) {
                        $("#hf_hf").show();
                        $("#hf_zt").hide();
                        $("#hf_bf").show();
                    } else if (playType ==3) {
                        $("#hf_hf").hide();
                        $("#hf_zt").show();
                        $("#hf_bf").show();
                    }else {
                        $("#hf_bf").show();
                        $("#hf_hf").show();
                        $("#hf_zt").hide();
                    }
                });
            } else {//找不到回放缓存
                $(".hf_img").each(function() {
                    if(this.id=="hf_qp"){
                        return;
                    }
                    var path = $(this).attr("src").split("_")[0] + "_";
                    // var
                    // num=$(this).attr("src").split("_")[1].substr(0,1);
                    var index = ($(this).attr("src").split("_")[1])
                        .split(".")[0].substr(1);
                    var png = ($(this).attr("src").split("_")[1])
                        .split(".")[1];
                    // showMes("path:"+path+" num:"+num+"
                    // index:"+index+" png:"+png);
                    var src = path + "2" + index + "." + png;
                    // showMes("src:"+src,"red");
                    $(this).attr("src", src);
                });
                $("#hf_bf").show();
                $("#hf_hf").show();
                $("#hf_zt").hide();
            }
        }
    } catch (e) {
        setError("up_replay_img", e);
    }
}

/*******************************************************************************
 * 设置搜索开始时间
 *
 * @param obj
 */
function set_day_time(obj) {
    try {

        if (lx_down != null) {
            return;
        }
        var id = obj.id;
        WdatePicker({
            dateFmt : "yyyy-MM-dd HH:mm:ss",
            isShowWeek : true,
            onpicked : function() {
                $dp.$(id).value = $dp.cal.getDateStr();

                $("#lx_seach").focus();// 把光标移到别的地方，可以继续操作选择时间
            }
        });
        if(obj.value!=null&&obj.value!=""	){
            playback_show_allVideo();// 调用查询录像数据方法
        }

        /*
         * if(obj.value==null||obj.value==""){ var myDate=new Date(); var
         * month=((myDate.getMonth()+1)>9)?(myDate.getMonth()+1):"0"+(myDate.getMonth()+1);
         * var day=(myDate.getDate()>9)?myDate.getDate():"0"+myDate.getDate();
         * var thisTime=myDate.getFullYear()+"-"+month+"-"+day +"
         * 00:00:00";//当前时间 $(obj).val(thisTime); }
         */
    } catch (e) {
        setError("set_beginTime", e);
    }
}
/*******************************************************************************
 * 返回某一天的所有录像文件
 *
 * @returns {Array}
 */
function getThisList() {
    try {
        var list = new Array();
        var date = $("#lxtl_sj").val();
        var ii = $("#lx_ip").val();
        var gn = $("#lx_td").val();
        var videos = returnList("video_list");
        var times = null;
        for ( var i = 0; i < videos.length; i++) {
            if (videos[i].id == ii && videos[i].gn == gn) {
                times = videos[i].list;
            }
        }
        //	showMes("times:" + JSON.stringify(times), "red");
        if (times != null) {
            for ( var i = 0; i < times.length; i++) {
                if (times[i].date.split(" ")[0] == date.split(" ")[0]) {
                    list.push(times[i]);
                }
            }
        }
        return list;
    } catch (e) {
        // TODO: handle exception
    }
}

/*******************************************************************************
 * 设置小时
 *
 * @param obj
 */
function set_hour_time(obj) {
    try {
        if (lx_down != null) {
            return;
        }
        var id = obj.id;
        WdatePicker({
            dateFmt : "HH:mm:ss",
            isShowWeek : true,
            onpicked : function() {
                $dp.$(id).value = $dp.cal.getDateStr();
                val = $dp.cal.getDateStr();
                $("#lx_seach").focus();// 把光标移到别的地方，可以继续操作选择时间
            }
        });

    } catch (e) {
        setError("set_beginTime", e);
    }
}
/*******************************************************************************
 * 判断当前的时间点是否存在
 */
function check_hour_tiem() {
    var list = getThisList();// 获取当天的录像数组
    var val = $("#lxtl_tm").val();
    var num = time_zh_num(val);// 把时间转换为多少秒
    var bool = true;
    // showMes("val:"+val+ " num:"+num+" list:"+JSON.stringify(list));
    for ( var i = 0; i < list.length; i++) {
        if (list[i].begin <= num && num < list[i].end) {
            bool = false;
        }
    }
    if (bool) {
        upAlert(showJSTxt(js_1,28));
        return false;
    } else {
        return true;
    }
}
/*******************************************************************************
 * 根据时间点播放录像
 */
function time_play() {
    try {
        //showMes("aaaa");
        if (check_hour_tiem == false) {// 判断当前时间是否合理
            return;
        }
        var video_name = $("#name_id").val();// 发送的文件名

        var winId = parseInt($("#lxtl_win").val());// 发送窗口ID
        var inputId = parseInt($("#lx_ip").val());// 发送的设备ID
        var time = time_zh_num($("#lxtl_tm").val());// 时间点
        var list = getThisList();// 获取当天的录像数组
        if(time==null||time==""||list==null||list.length==0){
            upAlert(showJSTxt(js_1,46));
            return;
        }
        var s_time = 0;
        for ( var i = 0; i < list.length; i++) {
            if (list[i].begin <= time && time < list[i].end) {
                s_time = time - list[i].begin;
                video_name=list[i].id;
            }
        }
        if(s_time==0){
            upAlert(showJSTxt(js_1,41));
            return ;
        }
        //showMes("窗口："+winId+" 输入源："+inputId+" 时间："+s_time+" 名称："+video_name);
        var liId="file_"+video_name;
        var playObj=new Object();
        playObj.wi=winId;
        playObj.ii=inputId;
        playObj.gn=$("#lx_td").val();
        playObj.pt=1;
        playObj.pn=1;
        playObj.id=1;
        playObj.nm=video_name;
        save_play_type(playObj);//保存当前播放模式
        $(".lxnr_li").each(function(){
            if(this.id==liId){
                $(this).css("background-color",clickColor);
                var obj=document.getElementById(this.id);//获取当前输入源的对象
                var div = document.getElementById("lxnr_ul_val");//获取容器的对象
                if(div==null||obj==null){
                    return ;
                }
                //	showMes("top:"+obj.offsetTop+" div:"+div.offsetTop);
                var height=(obj.offsetTop-div.offsetTop)-(div.clientHeight/2);//计算显示的位置
                //showMes("height:"+height);
                div.scrollTop = height;
            }else{
                $(this).css("background-color","white");
            }
        });

        var loginCode = returnSlist("loginCode");
        if(loginCode==null){
            loginCode=[0x00,0x00,0x00,0x00];
        }
        if (loginCode != null) {
            clearData();
            allNum = 1;// 初始化总次数
            inNum = 1;// 初始化第几次
            code.type = zh(4);
            code.num = zh(3);
            code.one = zh(loginCode[0]);
            code.tow = zh(loginCode[1]);
            code.three = zh(loginCode[2]);
            code.four = zh(loginCode[3]);
            bigFile = "";
            thisSocket = parent.socket;
            bigFile = winId + "," + inputId + "," + video_name + ","
                + s_time;
            //showMes("bigFile:" + bigFile);
            var rStr="@"+bigFile.length+"/"+bigFile;
            LK_CAN_OBJ.onExt(1,43,rStr);//调用回调接口
//	 			if(checkMes()){
//	 				sendBigFile();// 发送获取录像列表
//	 		 	}else{
//	 		 		upAlert(showJSTxt(indexJSList,14));
//	 		 	}//

        }
    } catch (e) {
        setError("time_play", e);
    }
}

/*******************************************************************************
 * 判断鼠标在窗口的那个部位
 *
 ******************************************************************************/
function checkXW() {
    try {
        var x = parseInt(event.x);
        // var y=parseInt(event.y);
        var left = parseInt($("#lxhf_div").css("left").split(".")[0]);
        // var top=parseInt($("#lxhf_div").css("top").split(".")[0]);
        var width = parseInt($("#lxhf_div").css("width").split(".")[0]);
        if ((left - 5) < x && x < (left + 5)) {
            // showMes("x:"+x+" y:"+y+" left:"+left+" top:"+top+"
            // bool:"+((left-10)<x&&x<(left+10)));
            $("#lxhf_div").css("cursor", "e-resize");
            $(".entity").css("cursor", "e-resize");
            return 1;
        } else if (left + width - 5 < x && x < left + width + 5) {
            $("#lxhf_div").css("cursor", "e-resize");
            $(".entity").css("cursor", "e-resize");
            return 2;
        } else {
            $("#lxhf_div").css("cursor", "default");
            $(".entity").css("cursor", "default");
            return 0;
        }
    } catch (e) {
        setError("checkXW", e);
    }

}
/*******************************************************************************
 * 播放/快播视频
 *
 * @param type
 * @param sd
 * @param winId
 */
function play_video(type, sd, winId) {
    try {
        var loginCode = returnSlist("loginCode");// 回去随机码
        if (loginCode == null) {
            loginCode=[0x00,0x00,0x00,0x00];
        }
        var binary = null;
        if(sd==0&&type==0x03){//暂停命令
            binary = new Uint8Array(11);
            binary = setCode(binary, loginCode, 0x00, 0x00, 0x08, 0x00);
            binary[8] = type;
            binary[9] = winId / 256;
            binary[10] = winId % 256;
        }else if(sd==0&&type==0x04){//停止播放命令
            var num=winId.length*2;
            binary = new Uint8Array(9+num);
            binary = setCode(binary, loginCode, 0x00, 0x00, 0x08, 0x00);
            binary[8] = type;
            for(var i=0;i<winId.length;i++){
                var a=9+(i*2);
                var b=9+(i*2)+1;
                binary[a] = winId[i] / 256;
                binary[b] = winId[i] % 256;
            }
        }else{//播放、倒播、快进、快退
            binary = new Uint8Array(12);
            binary = setCode(binary, loginCode, 0x00, 0x00, 0x08, 0x00);
            binary[8] = type;
            binary[9] = winId / 256;
            binary[10] = winId % 256;
            binary[11] = sd;
        }

        //	var rStr="@"+bigFile.length+"/"+bigFile;
        LK_CAN_OBJ.onExt(0,"08 00",binary);//调用回调接口
//	 			if (checkMes()) {
//	 				checkSend(binary);
//	 			} else {
//	 				upAlert(showJSTxt(paramJSTxt, 1));
//	 			}
        //	showMes("发送：" + JSON.stringify(binary), "blue");

    } catch (e) {
        // TODO: handle exception
        setError("play_video", e);
    }
}
/*******************************************************************************
 * 停止播放
 *
 * @param type
 * @param winId
 */
//function stop_video(type, winId) {
//	 	try {
//	 		var loginCode = returnSlist("loginCode");// 回去随机码
//	 		if (loginCode != null) {
//	 			var binary = new Uint8Array(11);
//	 			binary = setCode(binary, loginCode, 0x00, 0x00, 0x08, 0x00);
//	 			binary[8] = type;
//	 			binary[9] = winId / 256;
//	 			bianry[10] = winId % 256;
//	 			if (checkMes()) {
//	 				checkSend(binary);
//	 				showMes("发送：" + JSON.stringify(binary), "red");
//	 			} else {
//	 				upAlert(showJSTxt(paramJSTxt, 1));
//	 			}
//	 		} else {
//	 			upAlert(showJSTxt(paramJSTxt, 12));
//	 		}
//	 	} catch (e) {
//	 		// TODO: handle exception
//	 		setError("play_video", e);
//	 	}
//}
/*******************************************************************************
 * 播放上一个/下一个文件
 *
 * @parma type
 * @param winId
 * @param inputId
 * @param gn
 * @param name
 */
function next_video(type, winId, inputId, gn, name) {
    try {
        var loginCode = returnSlist("loginCode");
        var videos = returnList("video_list");
        var playList=returnList("playList");
        var nextName = "";
//	 		showMes("type:"+type+" winId:"+winId+" inputId:"+inputId+" gn:"+gn+" name:"+name,"red");
//	 		showMes("videos:"+JSON.stringify(videos),"blue");
//	 		showMes("playList:"+JSON.stringify(playList),"black");
        if (videos != null&&playList!=null) {
            for ( var i = 0; i < videos.length; i++) {
                if (videos[i].id == inputId && videos[i].gn == gn) {
                    var list = videos[i].list;
                    for ( var j = 0; j < list.length; j++) {
                        if (list[j].id == name) {
                            if(type == 1&&j-1<0){
                                if(upConfirms(showJSTxt(js_1,32))){
                                    nextName = list[(list.length - 1)].id;
                                }else{
                                    return false;
                                }

                            }else if(type == 2&&j+1>list.length-1){
                                if(upConfirms(showJSTxt(js_1,33))){
                                    nextName = list[0].id;
                                }else{
                                    return false;
                                }
                            }else {
                                if (type == 1) {
                                    nextName = list[(j - 1)].id;
                                } else if (type == 2) {
                                    nextName = list[(j + 1)].id;
                                }
                            }

                        }
                    }
                }
            }
            for(var i=0;i<playList.length;i++){
                if(playList[i].wi==winId){
                    playList[i].nm=nextName;
                }
            }
            saveList("playList",playList);
        }
        if(loginCode==null){
            loginCode=[0x00,0x00,0x00,0x00];
        }
        if (loginCode != null) {
            clearData();
            allNum = 1;// 初始化总次数
            inNum = 1;// 初始化第几次
            code.type = zh(4);
            code.num = zh(2);
            code.one = zh(loginCode[0]);
            code.tow = zh(loginCode[1]);
            code.three = zh(loginCode[2]);
            code.four = zh(loginCode[3]);
            bigFile = "";
            thisSocket = parent.socket;
            bigFile = winId + "," + inputId + "," + nextName;
            //showMes("bigFile:" + bigFile);
            //	alert("aaa");
            var str="@"+bigFile.length+"/"+bigFile;
            LK_CAN_OBJ.onExt(1,42,str);//调用回调接口
//	 			if(checkMes()){
//	 				sendBigFile();// 发送获取录像列表
//	 		 	}else{
//	 		 		upAlert(showJSTxt(indexJSList,14));
//	 		 	}
        }
    } catch (e) {
        setError("next_video", e);
    }
}
///***********************************
// * 判断录像回放是是否关闭
// */
//function check_closeReplay(){
//	 	try {
//	 		if($("#lxhf_div").css("display")=="block"){
//	 			if(upConfirms("提示：是否关闭录像回放管理进行其他操作？")){
//	 				$("#lxtl_win").hide();
//	 				return true;
//	 			}else{
//	 				return false;
//	 			}	
//	 		}else{
//	 			return true;
//	 		}
//	 	} catch (e) {
//	 		setError("check_closeReplay",e);
//	 	}
//}
//
/*****************************
 * 输出改变的时候修改回放窗口数据
 */
function check_openReplay(){
    try {
        var wins=returnList("ouputXml");
        if(wins!=null){
            $("#lxtl_win option").remove();
            for(var i=0;i<wins.length;i++){
                for(var j=0;j<wins.length;j++){
                    if(wins[i].num<wins[j].num){
                        var a=wins[i];
                        wins[i]=wins[j];
                        wins[j]=a;
                    }
                }
            }
            for(var i=0;i<wins.length;i++){
                if(wins[i].num!=MAXNUM){
                    $("#lxtl_win").append("<option value='"+wins[i].id+"'>"+wins[i].num+"</option>");
                }
            }
        }
    } catch (e) {
        setError("check_openReplay",e);
    }
}

$(function() {




    /***************************************************************************
     * 控制视频播放点击事件
     */
    $(".hf_img").click(
        function() {

            var id = this.id;// 按钮ID号
            if (id == "hf_qp") {
                if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
                    return false;
                }
                playback_video();
                return;
            }
            var num = $(this).attr("src").split("_")[1].substr(0, 1);
            if (num == 2) {
                return;
            }
            if(checkPagePower(showJSTxt(paramJSTxt,73),3)==false){
                return false;
            }
            var list = returnList("playList");
            var out = xmlEntities;

            var type = 0x00;// 发送的命令类型
            var pn = 0x00;// 发送播放的速度
            var winId = 0;// 窗口的ID号
            var wins=null;//窗口数组
            var name = "";// 发送的文件
            var inputId = 0;// 输入源ID号
            var gn = 0;// 通道号
            var pt = 0;// 类型
            if (list == null) {
                upAlert(showJSTxt(js_1,29));
                return;
            } else {
                var bool = true;
                for ( var i = 0; i < list.length; i++) {
                    if (list[i].id == 1) {
                        bool = false;
                    }
                }
                if (bool) {
                    upAlert(showJSTxt(js_1,29));
                    return;
                }
            }
            if (out != null) {
                var num = 0;
                for ( var i = 0; i < out.length; i++) {
                    if (out[i].strokeColor == "red") {
                        winId = out[i].id;
                        if(wins==null){
                            wins=new Array();
                        }
                        wins.push(out[i].id);
                        num++;
                    }
                }
                if (num > 1&&id != "hf_tz") {
                    upAlert(showJSTxt(js_1,30));
                    return;
                } else if (num == 0) {
                    upAlert(showJSTxt(js_1,31));
                    return;
                }
            }
            if (id != "hf_kt" && id != "hf_kb") {// 保存播放的状态
                for ( var i = 0; i < list.length; i++) {
                    if (list[i].wi == winId) {
                        list[i].pn = 1;
                        list[i].id = 1;
                        if (id == "hf_bf" || id == "hf_syw"
                            || id == "hf_xyw") {
                            list[i].pt = 1;
                        } else if (id == "hf_zt") {
                            list[i].pt = 2;
                        } else if (id == "hf_tz") {
                            list[i].pt = 0;
                        } else if (id == "hf_hf") {
                            list[i].pt = 3;
                        }
                        pt = list[i].pt;
                        name = list[i].nm;
                        inputId = list[i].ii;
                        gn = list[i].gn;
                    } else {
                        list[i].id = 0;
                    }
                }
                pn = 0x01;// 速度默认为1
            } else  {// 保存快进、快退
                //	showMes("快进：" + pn, "red");
//	 					showMes("winId:"+winId+" list:"+JSON.stringify(list),"blue");
                for ( var i = 0; i < list.length; i++) {
                    if (list[i].wi == winId) {
                        if ((id == "hf_kb" && list[i].pt == 3)
                            || (id == "hf_kt" && list[i].pt == 1)) {
                            list[i].pn = 4;
                        }
                        if (list[i].pn < 4) {
                            list[i].pn++;
                        } else if (list[i].pn == 4) {
                            list[i].pn = 1;
                        }
                        if (id == "hf_kb") {
                            list[i].pt = 1;
                        } else if (id == "hf_kt") {
                            list[i].pt = 3;
                        }
                        pt = list[i].pt;
                        name = list[i].nm;
                        pn = list[i].pn;
                        list[i].id = 1;
                    } else {
                        list[i].id = 0;
                    }
                }
            }
//	 				showMes("id:" + id + " winId:" + winId + " input:" + inputId
//	 						+ " gn:" + gn + " pt:" + pt + " pn:" + pn + " name:"
//	 						+ name, "red");
            saveList("playList", list);
            switch (id) {
                case "hf_bf":
                    type = 0x01;
                    play_video(type, pn, winId);// 发送播放命令
                    $("#hf_bf").hide();
                    $("#hf_zt").show();
                    $("#hf_hf").show();
                    break;
                case "hf_hf":
                    type = 0x02;
                    play_video(type, pn, winId);// 发送回放命令
                    $("#hf_bf").show();
                    $("#hf_zt").show();
                    $("#hf_hf").hide();
                    break;
                case "hf_zt":
                    type = 0x03;
                    play_video(type,0, winId);// 发送暂停
                    $("#hf_bf").show();
                    $("#hf_zt").hide();
                    $("#hf_hf").show();
                    break;
                case "hf_tz":
                    type = 0x04;
                    //	showMes("wins:"+JSON.stringify(wins));
                    if(wins!=null&&wins.length>0){
                        for(var i=0;i<wins.length;i++){
                            for(var j=0;j<list.length;j++){
                                if(wins[i]==list[j].wi){
                                    list.splice(j,1);//删除命令
                                }
                            }
                        }
                        for(var i=0;i<list.length;i++){
                            list[i].id=0;
                        }
                        saveList("playList",list);
                        up_replay_img();
                        play_video(type,0, wins);// 发送停止
                    }
                    //showMes("list:"+JSON.stringify(list));
                    $("#hf_bf").show();
                    $("#hf_zt").hide();
                    $("#hf_hf").show();
                    break;
                case "hf_syw":
                    next_video(1, winId, inputId, gn, name);// 发送上一个文件
                    $("#hf_bf").hide();
                    $("#hf_zt").show();
                    $("#hf_hf").show();
                    break;
                case "hf_xyw":
                    next_video(2, winId, inputId, gn, name);// 发送下一个文件
                    $("#hf_bf").hide();
                    $("#hf_zt").show();
                    $("#hf_hf").show();
                    break;
                case "hf_kb":
                    type = 0x01;
                    play_video(type, pn, winId);// 发送快速播放命令
                    $("#hf_bf").hide();
                    $("#hf_zt").show();
                    $("#hf_hf").show();
                    break;
                case "hf_kt":
                    type = 0x02;
                    play_video(type, pn, winId);// 发送块退命令
                    $("#hf_bf").show();
                    $("#hf_zt").show();
                    $("#hf_hf").hide();
                    break;
                default:
                    break;
            }

        });




});



// document.onkeydown = function() { if (event.keyCode == 116) { event.keyCode =
// 0; event.cancelBubble = true; return false; } };
//  

			 





