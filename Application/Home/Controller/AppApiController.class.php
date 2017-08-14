<?php

namespace Home\Controller;

use Home\Model\DeviceModel;
use Home\Model\FirmModel;
use Think\Controller;
use Think\ChuanglanSmsApi;
use Think\Auth;

class AppApiController extends Controller
{
    private $uid;

    //ERR
    const SUCCESS_REQUEST = 0;
    const EMPTY_MATRIX_ID = -9;
    const EMPTY_MOBILE_OR_PASS = -10;
    const EMPTY_CODE_OR_MOBILE = -11;
    const REPEAT_SEND = -12;
    const WRONG_CODE = -13;
    const NOT_FIND_DEVICE_CLASS = -14;
    const INVALID_TOKEN = -15;
    const EXPIRED_CODE = -16;
    const OPERATION_FAILED = -17;
    const INPUT_DELETE_MATRIX_ID = -18;
    const NOT_FIND_ID = -19;
    const PARAMETER_ERROR = -20;
    const INTERNAL_ERROR = -21;
    const NOT_FIND_MATRIX_INFO = -22;
    const EMPTY_DEVICE_LIST = -23;
    const EMPTY_MARKER_LIST = -24;
    const UPLOAD_FILE_EXT = -25;
    const MOBILE_EXITS = -26;
    const DATA_NOT_EXITS = -27;
    const FIRM_NAME_EXITS = -28;
    const FIRM_NOT_EXITS = -29;
    const MOBILE_NOT_TRUE = -30;
    const INVITE_DATA_EMPTY = -31;
    const LOCATION_NOT_EXIT = -32;
    const GROUP_NAME_EXITS = -33;
    const PLEESE_UPLOAD_GROUPNAME = -34;
    const NOT_INVALID_edit = -35;
    const CREATE_GROUP_FALSE = -36;
    const EDIT_GROUP_FALSE = -37;
    const DEL_GROUP_FALSE = -38;
    const DEL_GROUP_EXITS_SUN = -39;
    const GROUP_NOT_MEMBER = -40;
    const NOT_SELECT_DATA = -41;
    const NOT_SELECT_INPUT = -42;
    const CAN_NOT_ADDED = -43;
    const ADD_FAILED = -44;
    const INFO_NOT_FOUND = -45;
    const EMPTY_SHARE_LIST = -46;
    const DELETE_FAILED = -47;
    const FAILED_MODIFY = -48;
    const BRAND_NAME_EXITS = -49;
    const BRAND_ADD_FALSE = -50;
    const BRAND_EDIT_FALSE = -51;
    const BRAND_DEL_FALSE = -52;
    const MARKING_NAME_EXITS = -53;
    const MARKING_ADD_FALSE = -54;
    const NOT_FIRM_CREATER = -55;
    const VERSION_NAME_EXITS = -56;
    const NOT_AGAIN_JOIN = -57;
    const NO_AUTH = -58;


    //SUC
    const SEND_MESSAGE_SUCCESS = 1;
    const SUCCESS_MODIFY = 2;
    const INVITE_JOIN_SUCCESS = 3;
    const INVITE_JOIN_TRUE = 4;
    const INVITE_JOIN_FALSE = 5;
    const CREATE_GROUP_TRUE = 6;
    const EDIT_GROUP_TRUE = 7;
    const DEL_GROUP_TRUE = 8;
    const ADD_SUCCESS = 9;
    const DELETE_SUCCESS = 10;
    const BRAND_ADD_SUCCESS = 11;
    const BRAND_EDIT_SUCCESS = 12;
    const BRAND_DEL_SUCCESS = 13;
    const MARKING_ADD_SUCCESS = 14;

    public static $err_msg = [
        self::EMPTY_MATRIX_ID => 'UID或矩阵ID不能为空',
        self::EMPTY_MOBILE_OR_PASS => '手机或者密码不能为空',
        self::EMPTY_CODE_OR_MOBILE => '验证码或手机号不能为空',
        self::REPEAT_SEND => '请勿频繁请求验证码',
        self::WRONG_CODE => '验证码不正确',
        self::NOT_FIND_DEVICE_CLASS => '没有找到设备类型',
        self::INVALID_TOKEN => '无效TOKEN',
        self::EXPIRED_CODE => '验证码已经过期，请重新获取验证码',
        self::OPERATION_FAILED => '操作失败！',
        self::INPUT_DELETE_MATRIX_ID => '请输入要删除的矩阵ID',
        self::NOT_FIND_ID => '没有该矩阵ID或事务执行失败',
        self::PARAMETER_ERROR => '参数错误',
        self::INTERNAL_ERROR => '内部错误',
        self::NOT_FIND_MATRIX_INFO => '没有矩阵信息',
        self::EMPTY_DEVICE_LIST => '设备列表为空',
        self::EMPTY_MARKER_LIST => '没有地图标记',
        self::UPLOAD_FILE_EXT => '非法文件上传',
        self::MOBILE_EXITS => '该号码已被注册',
        self::DATA_NOT_EXITS => '地图尚未添加点',
        self::FIRM_NAME_EXITS => '机构名称已经存在',
        self::FIRM_NOT_EXITS => '当前没有机构',
        self::MOBILE_NOT_TRUE => '没有符合规范的手机号',
        self::INVITE_DATA_EMPTY => '暂无邀请数据',
        self::LOCATION_NOT_EXIT => '地图位置数据不存在',
        self::GROUP_NAME_EXITS => '部门已存在',
        self::PLEESE_UPLOAD_GROUPNAME => '上传部门名称',
        self::NOT_INVALID_edit => '请不要无效编辑',
        self::CREATE_GROUP_FALSE => '部门创建失败',
        self::EDIT_GROUP_FALSE => '部门编辑失败',
        self::DEL_GROUP_FALSE => '部门删除失败',
        self::DEL_GROUP_EXITS_SUN => '当前部门存在下级部门，请先删除下级部门',
        self::GROUP_NOT_MEMBER => '当前部门下面无用户',
        self::NOT_SELECT_DATA => '请选择需要共享设备或机构',
        self::NOT_SELECT_INPUT => '请选择需要被共享的资源',
        self::CAN_NOT_ADDED => '无法共享给已共享过的机构/设备，请进入共享管理页面编辑',
        self::ADD_FAILED => '添加失败',
        self::INFO_NOT_FOUND => '未找到相关机构信息',
        self::EMPTY_SHARE_LIST => '没有共享设备',
        self::DELETE_FAILED => '删除失败',
        self::FAILED_MODIFY => '修改失败',
        self::BRAND_NAME_EXITS => '品牌名称重复',
        self::BRAND_ADD_FALSE => '品牌创建失败',
        self::BRAND_EDIT_FALSE => '品牌编辑失败',
        self::BRAND_DEL_FALSE => '品牌删除失败',
        self::MARKING_NAME_EXITS => '型号规格已存在',
        self::MARKING_ADD_FALSE =>'型号创建失败',
        self::NOT_FIRM_CREATER => '非机构创建者，不能此操作',
        self::VERSION_NAME_EXITS => '版本名已存在',
        self::NOT_AGAIN_JOIN => '已经申请加入',
        self::NO_AUTH => '没有权限操作该地图'

    ];

    public static $suc_msg = [
        self::SUCCESS_REQUEST => '操作成功',
        self::SUCCESS_MODIFY => '修改成功',
        self::SEND_MESSAGE_SUCCESS => '【MSU智慧平台】您好，您的验证码是',
        self::INVITE_JOIN_SUCCESS => '邀请已发送',
        self::INVITE_JOIN_TRUE => '接受邀请成功',
        self::INVITE_JOIN_FALSE => '拒绝邀请成功',
        self::CREATE_GROUP_TRUE => '部门创建成功',
        self::EDIT_GROUP_TRUE => '部门编辑成功',
        self::DEL_GROUP_TRUE => '部门删除成功',
        self::ADD_SUCCESS => '添加成功',
        self::DELETE_SUCCESS => '删除成功',
        self::BRAND_ADD_SUCCESS => '品牌添加成功',
        self::BRAND_EDIT_SUCCESS => '品牌编辑成功',
        self::BRAND_DEL_SUCCESS => '品牌删除成功',
        self::MARKING_ADD_SUCCESS=>'型号创建成功'
    ];
    private function apiReturn($status, $code, $list = [])
    {
        if ($status === true) {
            $this->ajaxReturn([
                'status' => $status,
                'code' => $code,
                'msg' => self::$suc_msg[$code],
                'result' => ['list' => $list]
            ], 'json', JSON_UNESCAPED_UNICODE);
        } else {
            $this->ajaxReturn([
                'status' => $status,
                'code' => $code,
                'msg' => self::$err_msg[$code],
                'result' => ['list' => $list]
            ], 'json', JSON_UNESCAPED_UNICODE);
        }
    }

    private function tokenVerify()
    {
        $this->uid = I('uid', '', 'intval');
        $token = I('token', '', 'trim');
        if (empty($this->uid) or empty($token)) {
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }

        $res = M('UserToken')->where("uid = '$this->uid' AND token = '$token'")->find();
        if (!$res) {
            $this->apiReturn(false, self::INVALID_TOKEN);
        }
    }

    private function setToken($username, $password)
    {
        $salt = 'linkyview';
        return md5($username . $password . time() . rand(100, 999) . $salt);
    }

    public function login()
    {
        $userName = I('userName', '', 'trim');
        $passWord = I('passWord', '', 'trim');
        $devicetype = I('deviceType', '', 'trim');

        $ret = \Home\Model\MemberModel::mLogin($userName, $passWord, $devicetype);
        if ($ret['status'] === true) {
            $userToken = M('UserToken')->where("uid = '$ret[result][list][uid]'")->find();
            if ($userToken) {
                $ret['result']['list']['token'] = $this->setToken($userName, $passWord);
                $param['token'] = $ret['result']['list']['token'];
                $param['time'] = time();
                M('UserToken')->where("uid = '$ret[result][list][uid]'")->save($param);
            } else {
                $ret['result']['list']['token'] = $this->setToken($userName, $passWord);
                $param['uid'] = $ret['result']['list']['uid'];
                $param['token'] = $ret['result']['list']['token'];
                $param['time'] = time();
                M('UserToken')->add($param);
            }
        }
        $ret['result']['list'] = (object)$ret['result']['list'];
        $this->ajaxReturn($ret, 'json');
    }

    public function register()
    {

        $mobile = I('mobile', '', 'trim');
        $code = I('code', '', 'trim');
        $this->checkCode($mobile, $code);
        $passWord = I('passWord', '', 'trim');
        $nickName = I('nickName', '', 'trim');

        if (empty($mobile) or empty($passWord)) {
            $this->apiReturn(false, self::EMPTY_MOBILE_OR_PASS);
        }

        $ret = \Home\Model\MemberModel::register($mobile, $passWord, $nickName);
        if ($ret['status'] === true) {
            $ret['result']['list']['token'] = $this->setToken($mobile, $passWord);
            $param['uid'] = $ret['result']['list']['uid'];
            $param['token'] = $ret['result']['list']['token'];
            $param['time'] = time();

            M('UserToken')->add($param);
        }
        $ret['result']['list']['nickName'] = $nickName;
        $this->ajaxReturn($ret);
    }

    private function checkCode($mobile, $code)
    {
        if (empty($code) or empty($mobile)) {
            $this->apiReturn(false, self::EMPTY_CODE_OR_MOBILE);
        }

        $codeData = M('MobileCode')->where("mobile = '$mobile'")->find();

        if ($codeData['code'] != $code) {
            $this->apiReturn(false, self::WRONG_CODE);
        } elseif ((time() - $codeData['time']) > 600) {
            $this->apiReturn(false, self::EXPIRED_CODE);
        }
    }

    public function findPass()
    {
        $mobile = I('mobile', '', 'trim');
        $code = I('code', '', 'trim');
        $this->checkCode($mobile, $code);
        $newPass = I('newPass', '', 'trim');

        $res = \Home\Model\MemberModel::mFindPwd($mobile, $newPass);

        if (is_int($res) or $res === true) {
            $this->apiReturn(true, self::SUCCESS_MODIFY);
        } elseif ($res['status'] === false) {
            $this->ajaxReturn($res);
        } else {
            $this->apiReturn(false, self::INTERNAL_ERROR);
        }

    }

    public function deviceList()
    {
        $this->tokenVerify();
        $uuid = I('uuid', '');
        /*  if (empty($this->uid) or empty($matrixId)) {
              $this->apiReturn(false, self::EMPTY_MATRIX_ID);
          }*/
       /* $mc = new \Memcached();
        $mc->addServer("127.0.0.1", 11211);
        $res = $mc->get('device_menu');
        foreach ($res as $k => $v) {
            $device = strpos($v, '$') ? explode('$', $v)[1] : 0;
            if (!$device) {
                continue;
            }
            if ($uuid == $device) {
                $allInput = file_get_contents("/tmp/config/$device/web_config3.txt");
                preg_match('/\/(\[.*])/', $allInput, $match);
                $result = json_decode($match[1], true);
                break;
            }
        }*/
        $result = M('video_list')->where(['device_serial'=>$uuid])->getField('video_input');
        $result = unserialize($result);
        if(I("typeNames")){
            $arr = ['HIKVISION(NVR,DVR)','XM(NVR,DVR)','XM','VOYA(NVR,DVR)',
                'IDRS-7000HN','IDRS-7000HD','DAHUA(NVR,DVR)','AEVISION','HOKUTO-M',
                'HOKUTO-V','ZAXTEAM','TVT(NVR,DVR)','LinkyView','Mainvan','LZG','HCVSP',
                'VIMICRO','CVMS','UNIVIEW','MISNWAY','VISKING','Tiandy','TVT(3.0 NVR,DVR)',
                'TVT(N9000 NVR,DVR)','HAOYUNTECH','HTCAT','BLUESKY'
            ];
            foreach($result as $k=>$v){
                if(!in_array($v['typeName'],$arr)){
                    unset($result[$k]);
                }
            }
        }
        $result = array_values($result);
        /*  $res = M('VideoList')->field('link_video_list.data')->join('__MODULES_DEVICE__ ON __VIDEO_LIST__.device_id = __MODULES_DEVICE__.id')->where("link_modules_device.userid = '$this->uid' AND link_video_list.device_id = '$matrixId'")->find();*/
        /*  $res = M('VideoList')->where(array('device_serial' => $uuid))->getField('video_input');*/
        if ($result) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $result);
        } else {
            $this->apiReturn(false, self::EMPTY_DEVICE_LIST);
        }
    }

    public function getDeviceAndShare(){
        $this->tokenVerify();
        $uuid = I('uuid', '');
        $result = M('video_list')->where(['device_serial'=>$uuid])->getField('video_input');
        $result = unserialize($result);
        if(I("typeNames")){
            $arr = ['HIKVISION(NVR,DVR)','XM(NVR,DVR)','XM','VOYA(NVR,DVR)',
                'IDRS-7000HN','IDRS-7000HD','DAHUA(NVR,DVR)','AEVISION','HOKUTO-M',
                'HOKUTO-V','ZAXTEAM','TVT(NVR,DVR)','LinkyView','Mainvan','LZG','HCVSP',
                'VIMICRO','CVMS','UNIVIEW','MISNWAY','VISKING','Tiandy','TVT(3.0 NVR,DVR)',
                'TVT(N9000 NVR,DVR)','HAOYUNTECH','HTCAT','BLUESKY'
            ];
            foreach($result as $k=>$v){
                if(!in_array($v['typeName'],$arr)){
                    unset($result[$k]);
                }
            }
        }
        $r = array_values($result);
        $share = DeviceModel::buildApiShare($uuid);
        $s = array_values($share);
        $res = array_merge((array)$r,(array)$s);
        if (!empty($res)) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::EMPTY_DEVICE_LIST);
        }
    }

    public function matrixList()
    {
        $this->tokenVerify();
        //获取被邀请人号码。去查询被邀请并答应的记录
        $mobile = M('user')->where(['id'=>$this->uid])->getField('mobile');
        //获取用户自身创建的机构ID
        $self_firm_id = M('firm')->where(['userid'=>$this->uid])->field('id')->select();
        //获取邀请过当前用户的机构创建id
        $invite_firm_id = M('inviting')->where(['mobile'=>$mobile,'status'=>1])->field('firmid')->select();
        $all_firmid = array_values(array_merge($self_firm_id,$invite_firm_id));
        $all_firmid2 = M('application')->where(['from_userid'=>$this->uid,'status'=>1])->field('to_firmid as firmid')->select();
        $all_firmid = array_values(array_merge($all_firmid,$all_firmid2));
        $all_firm_id = [];
        //二维转一维
        foreach($all_firmid as $k=>$v){
            $all_firm_id[$k] = isset($v['id']) ? $v['id'] : $v['firmid'];
        }
        $all_firm_id = array_unique($all_firm_id);
        $res = [];
        if (empty(I('type')) && empty(I('types'))) {
            foreach($all_firm_id as $v){
                $res1 = M('ModulesDevice')->field('id, name, uuid,type,intro,configs,types,state,firmid,userid')->where(['firmid'=>$v])->order('state desc')->select();
                $res = array_merge($res,$res1);
            }
        } elseif (empty(I('type')) && !empty(I('types'))) {
            foreach($all_firm_id as $v){
                $res1 = M('ModulesDevice')->field('id, name, uuid,type,intro,configs,types,state,firmid,userid')->where([
                    'firmid'=>$v,
                    'types' => I('types')
                ])->order('state desc')->select();
                $res = array_merge($res,$res1);
            }
        } elseif (!empty(I('type')) && empty(I('types'))) {
            foreach($all_firm_id as $v){
                $res1 = M('ModulesDevice')->field('id, name, uuid,type,intro,configs,types,state,firmid,userid')->where([
                    'firmid'=>$v,
                    'type' => I('type')
                ])->order('state desc')->select();
                $res = array_merge($res,$res1);
            }
        } else {
            foreach($all_firm_id as $v){
                $res1 = M('ModulesDevice')->field('id, name, uuid,type,intro,configs,types,state,firmid,userid')->where([
                    'firmid'=>$v,
                    'type' => I('type'),
                    'types' => I('types')
                ])->order('state desc')->select();
                $res = array_merge($res,$res1);
            }
        }

        foreach ($res as $k => $v) {
            $res[$k]['configs'] = json_decode($v['configs'], true);
            $res[$k]['types'] = $v['types'] == 0 ? null : $v['types'];
            $icon = M("type")->where(['id'=>$v['type']])->getField('icon');
            if($icon){
                $res[$k]['icon'] = 'http://'.$_SERVER['HTTP_HOST']. $icon;
            }else{
                $res[$k]['icon'] = null;
            }
        }
        if (I('SinPageNum') && I('pageNum')) {
            $SinPageNum = I('SinPageNum');
            $pageNum = I('pageNum');
            $pageNum = ($pageNum - 1) * $SinPageNum;
            $res = array_slice($res,$pageNum,$SinPageNum);
        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::NOT_FIND_MATRIX_INFO);
        }
    }

    public function matrixList2()
    {
        $this->tokenVerify();
        //获取被邀请人号码。去查询被邀请并答应的记录
        $mobile = M('user')->where(['id'=>$this->uid])->getField('mobile');
        //获取用户自身创建的机构ID
        $self_firm_id = M('firm')->where(['userid'=>$this->uid])->field('id')->select();
        //获取邀请过当前用户的机构创建id
        $invite_firm_id = M('inviting')->where(['mobile'=>$mobile,'status'=>1])->field('firmid')->select();
        $all_firmid = array_values(array_merge($self_firm_id,$invite_firm_id));
        $all_firmid2 = M('application')->where(['from_userid'=>$this->uid,'status'=>1])->field('to_firmid as firmid')->select();
        $all_firmid = array_values(array_merge($all_firmid,$all_firmid2));
        $all_firm_id = [];
        //二维转一维
        foreach($all_firmid as $k=>$v){
            $all_firm_id[$k] = isset($v['id']) ? $v['id'] : $v['firmid'];
        }
        $res = [];
        if (empty(I('type')) && empty(I('types'))) {
            foreach($all_firm_id as $v){
                $res1 = M('ModulesDevice')->field('id, name, uuid,state,userid')->where(['firmid'=>$v])->order('state desc')->select();
                $res = array_merge($res,$res1);
            }
        } elseif (empty(I('type')) && !empty(I('types'))) {
            foreach($all_firm_id as $v){
                $res1 = M('ModulesDevice')->field('id, name, uuid,state,userid')->where([
                    'firmid'=>$v,
                    'types' => I('types')
                ])->order('state desc')->select();
                $res = array_merge($res,$res1);
            }
        } elseif (!empty(I('type')) && empty(I('types'))) {
            foreach($all_firm_id as $v){
                $res1 = M('ModulesDevice')->field('id, name, uuid,state,userid')->where([
                    'firmid'=>$v,
                    'type' => I('type')
                ])->order('state desc')->select();
                $res = array_merge($res,$res1);
            }
        } else {
            foreach($all_firm_id as $v){
                $res1 = M('ModulesDevice')->field('id, name, uuid,state,userid')->where([
                    'firmid'=>$v,
                    'type' => I('type'),
                    'types' => I('types')
                ])->order('state desc')->select();
                $res = array_merge($res,$res1);
            }
        }

        foreach ($res as $k => $v) {
            $res[$k]['types'] = $v['types'] == 0 ? null : $v['types'];
            $icon = M("type")->where(['id'=>$v['type']])->getField('icon');
            if($icon){
                $res[$k]['icon'] = 'http://'.$_SERVER['HTTP_HOST']. $icon;
            }else{
                $res[$k]['icon'] = null;
            }
        }
        $data = [];
        foreach($res as $k=>$v){
            if($v['state'] != 1){
                array_push($data,$v);
                unset($res[$k]);
            }
        }
        $res = array_merge($res,$data);
        if (I('SinPageNum') && I('pageNum')) {
            $SinPageNum = I('SinPageNum');
            $pageNum = I('pageNum');
            $pageNum = ($pageNum - 1) * $SinPageNum;
            $res = array_slice($res,$pageNum,$SinPageNum);
        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, array_values($res));
        } else {
            $this->apiReturn(false, self::NOT_FIND_MATRIX_INFO);
        }
    }

    /**
     * 设备列表
     */
    public function deviceListInfo()
    {
        $this->tokenVerify();
        $pageNum = I('pageNum', '', 'intval');
        $pageSize = I('pageSize', '', 'intval');
        $firmId = I('firmId', '', 'intval');
        $type = I('type', '', 'intval');
        $types = I('types', '', 'intval');
        $keywords = I('keywords', '');

        if (isset($keywords)) {
            $res = DeviceModel::getAllDevice([$firmId], $pageNum, $pageSize, $type, $types, $keywords);
        } elseif ($firmId > 0) {
            $res = DeviceModel::getAllDevice([$firmId], $pageNum, $pageSize, $type, $types);
        } else { //兼容老版本
            $userFirmList = FirmModel::getFirmIdFromGroup($this->uid);
            $res = DeviceModel::getAllDevice($userFirmList, $pageNum, $pageSize, $type, $types);
        }

        foreach ($res as $k => $v) {
            if (!empty($v['configs'])) {
                $res[$k]['configs'] = json_decode($v['configs'], true);
            } else {
                $res[$k]['configs'] = null;
            }
        }

        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::NOT_FIND_MATRIX_INFO);
        }
    }

    public function getMatrixInfo()
    {
        $this->tokenVerify();
        $matrix_id = I("matrixId");
        if(!$matrix_id){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        $res = M("ModulesDevice")->where(['id' => $matrix_id])->field('id,name,uuid,type,firmid,types,userid,state,configs,intro')->select();
        if($res){
            $res[0]['firmname'] = M("firm")->where(['id'=>$res[0]['firmid']])->getField('name');
            $type = M("type")->where(['id'=>$res[0]['type']])->find();
            $res[0]['typename'] = $type['name'];
            $res[0]['icon'] = 'http://'.$_SERVER['HTTP_HOST'].$type['icon'];
            $types = M("types")->where(['id'=>$res[0]['types']])->find();
            $res[0]['typesname'] = $types['name'];
            if($res[0]['configs']){
                $res[0]['configs'] = json_decode($res[0]['configs'], true);
            }else{
                $res[0]['configs'] = null;
            }
        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::NOT_FIND_MATRIX_INFO);
        }
    }


    public function sendMessage()
    {
        $mobile = I('mobile', '', 'trim');
        $res = \Home\Model\MemberModel::isMobileReg($mobile);

        if ($res['status'] == true) {
            $code = rand(100000, 999999);
            $codeData = M('MobileCode')->where("mobile = '$mobile'")->find();
            if ($codeData) {
                $diffTime = time() - $codeData['time'];
                if ($diffTime < 60) {
                    $diffTime = 60 - $diffTime;
                    $this->apiReturn(false, self::REPEAT_SEND);
                } else {
                    ChuanglanSmsApi::sendSMS($mobile, self::$suc_msg[self::SEND_MESSAGE_SUCCESS] . $code);
                    $param['code'] = $code;
                    $param['time'] = time();
                    M('MobileCode')->where("mobile = '$mobile'")->save($param);
                }
            } else {
                ChuanglanSmsApi::sendSMS($mobile, self::$suc_msg[self::SEND_MESSAGE_SUCCESS] . $code);
                $param['mobile'] = $mobile;
                $param['code'] = $code;
                $param['time'] = time();
                M('MobileCode')->add($param);
            }
        }

        $this->ajaxReturn($res);
    }

    public function addMatrix()
    {
        $this->tokenVerify();
        $id = $this->uid;
        $uuid = I('uuid', '', 'trim');
        $intro = I('intro');
        $deviceName = I('deviceName', '', 'trim');
        $userName = I('userName', '', 'trim');
        $password = I('password', '', 'trim');
        $type = I('type', '', 'intval');
        $isUpdate = I('isUpdate', '', 'intval');
        $types = I('types', '', 'intval');
        $firmid =  I('firmId', '', 'intval');
        if (empty($deviceName) || (empty($uuid) && $id < 1)) {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }

        $data = [
            'firmid' => $firmid,
            'userid' => $this->uid,
            'name' => $deviceName,
            'intro' => $intro,
            'type' => $type,
            'status' => 1,
            'state' => 0,
            'ip' => '',
            'configs' => '',
            types => $types
        ];

        if (!empty($userName) && !empty($password)) {
            $arr_configs = [];
            array_push($arr_configs, [
                'name' => $userName,
                'pwd' => $password
            ]);
            $data['configs'] = json_encode($arr_configs);
        }

        $data['uuid'] = $uuid;
        $obj = M('ModulesDevice', '', 'DB_CONFIG_LINK');
        if ($isUpdate == 1) {
            $data = [
                'firmid' => $firmid,
                'userid' => $this->uid,
                'name' => $deviceName,
                'intro' => $intro,
                'type' => $type,
                'status' => 1,
                'ip' => '',
                'configs' => '',
                types => $types
            ];
            $res = $obj->where(['userid' => ['eq', $id], 'uuid' => ['eq', $uuid]])->save($data);
        } else {
            $data['createtime'] = time();
            $res = $obj->add($data);
            $id = $obj->getLastInsID();
        }

        if (!$res) {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }/* elseif ($isUpdate != 1) {
            $param['device_id'] = $res;
            $param['time'] = time();
            M('VideoList')->add($param);
        }*/

        $this->apiReturn(true, self::SUCCESS_REQUEST);

    }

    public function delMatrix()
    {
        $this->tokenVerify();
        $delId = I('delId', '', 'intval');
        if (empty($delId)) {
            $this->apiReturn(false, self::INPUT_DELETE_MATRIX_ID);
        }
        $mdModel = M('ModulesDevice');
        /*$mdModel->startTrans();*/

        $res = $mdModel->where("userid = $this->uid AND id = '$delId'")->delete();
        /* $resTwo = M('VideoList')->where("device_id = '$delId'")->delete();*/

        if ($res /*&& $resTwo*/) {
            /* $mdModel->commit();*/
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            /*$mdModel->rollback();*/
            $this->apiReturn(false, self::NOT_FIND_ID);
        }
    }

    public function typeList()
    {
        $res = M('Type')->field('id, name,icon')->where('status = 1')->select();
        foreach($res as $k=>$v){
            $res[$k]['icon'] = 'http://'.$_SERVER['HTTP_HOST'].$v['icon'];
        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::NOT_FIND_DEVICE_CLASS);
        }
    }


    public function typesList()
    {
        $this->tokenVerify();
        $firmId = I('firmId', '', 'intval');
        $res = M('Types')->field('id, name')->where(['userid' => $this->uid, 'firmid' => $firmId])->select();
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::NOT_FIND_DEVICE_CLASS);
        }
    }

    public function addTypes()
    {
        if (empty(I('userId')) || empty(I('name'))) {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
        $data =
            [
                'firmid' => I('firmId', 0),
                'userid' => I('userId'),
                'name' => I('name'),
                'type' => I('type', 0),
                'status' => 1,
                'createtime' => time()
            ];
        $res = M('Types')->add($data);

        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::NOT_FIND_DEVICE_CLASS);
        }
    }

    public function getAllMarker()
    {
        $this->tokenVerify();
        if (I('SinPageNum') && I('pageNum')) {
            $SinPageNum = I('SinPageNum');
            $pageNum = I('pageNum');
            $pageNum = ($pageNum - 1) * $SinPageNum;
            $res = M('MapMark')->field('id,info,lng,lat,cam_id,uid,map_list_id')->where("uid = $this->uid")->limit("$pageNum , $SinPageNum")->select();
        } else {
            $res = M('MapMark')->field('id,info,lng,lat,cam_id,uid,map_list_id')->where("uid = $this->uid")->select();
        }
        if ($res) {
            foreach ($res as $k => $v) {
                /*unserialize($res[$k]['info']);*/
                $res[$k]['info'] = unserialize($v['info']);
                $res_arr = M("MapList")->where(array(
                    "uid" => $v['uid'],
                    "id" => $v['map_list_id'],
                    "map_type" => 2
                ))->find();
                if ($res_arr) {
                    unset($res[$k]);
                }
            }
            $this->apiReturn(true, self::SUCCESS_REQUEST, array_values($res));
        } else {
            $this->apiReturn(false, self::EMPTY_MARKER_LIST, $res);
        }
    }

    public function versionManage()
    {
        $versionName = I('versionName', '', 'trim');
        $versionCode = I('versionCode', '', 'trim');
        $updateNote = I('updateNote', '', 'trim');
        if ($versionName && $versionCode && $updateNote) {
            if (M('version')->find()) {
                M('version')->where(" versionName != '' ")->save([
                    'versionName' => $versionName,
                    'versionCode' => $versionCode,
                    'updateNote' => $updateNote
                ]);
            } else {
                M('version')->add([
                    'versionName' => $versionName,
                    'versionCode' => $versionCode,
                    'updateNote' => $updateNote
                ]);
            }
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $res = M('version')->find();
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        }
    }


    public function addMap()
    {
        $this->tokenVerify();
        $mapName = I('mapName', '', 'trim');
        $mapType = I('mapType', '');
        $firmId = I('firmId', '', 'intval');
        $mapPic = base64_decode(I('mapPic'));
        $ext = 'jpeg';
        /////////分 离线  在线   maptype判断
        if (empty($mapName) || ( $mapType == 2 && empty($mapPic) ))
        {
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        if($mapType == 2 && $mapPic)
        {

            $file_name = date('Y-m-d') . '/' . md5(time() . $mapName) . '.' . $ext;
            if (!file_exists('./Uploads/map/' . date('Y-m-d'))) {
                mkdir('./Uploads/map/' . date('Y-m-d'), 0777);
            }
            if (!file_put_contents('./Uploads/map/' . $file_name, $mapPic)) {
                $this->apiReturn(false, self::INTERNAL_ERROR);
            }
            $param['map_img'] = $file_name;
        }
        $param['map_type'] = $mapType;
        $param['map_name'] = $mapName;
        $param['time'] = time();
        $param['uid'] = $this->uid;
        $param['firmId'] = $firmId;
        $res = M('MapList')->add($param);

        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function getPersonalMap()
    {
        $this->tokenVerify();
        $pageSize = I('pageSize', '', 'intval');
        $pageNum = I('pageNum', '', 'intval');
        $firmId = I('firmId', '', 'intval');

        if (!empty($firmId)) {

            $userFirmList = \Home\Model\FirmModel::getFirmIdFromGroup($firmId);
            $firmUser = \Home\Model\DeviceModel::firmUsers($userFirmList);

            $sql = '';
            foreach ($firmUser as $k => $v) {
                if ($k != count($firmUser) - 1) {
                    $sql .= 'uid = ' . $v . ' or ';
                } else {
                    $sql .= 'uid = ' . $v;
                }
            }

            if (!empty($pageNum) && !empty($pageSize)) {
                $res = M("map_list")->where($sql)->page($pageNum . ',' . $pageSize)->select();
            } else {
                $res = M("map_list")->where($sql)->select();
            }

            if ($res) {
                foreach ($res as $k => $v) {
                    $res[$k]['map_img'] = 'http://' . $_SERVER['HTTP_HOST'] . '/Uploads/map/' . $v['map_img'];
                    $res[$k]['time'] = date('Y-m-d', $v['time']);
                }
                $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
            } else {
                $this->apiReturn(false, self::OPERATION_FAILED);
            }
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function addMapMark()
    {
        $this->tokenVerify();
        $info = json_decode(I('info'), true);
        $infoArr = serialize($info);
        $lng = I('lng');
        $lat = I('lat');
        $camId = I('camId');
        $mapListId = I('Map_list_id');

        if (!empty($infoArr) && !empty($lng) && !empty($lat) && !empty($mapListId)) {
            $res = M('MapList')->where("id = '$mapListId'")->find();
            if ($res['uid'] != $this->uid) {
                $this->apiReturn(false, self::NO_AUTH);
            }

            $arr = array(
                'uid' => $this->uid,
                'info' => $infoArr,
                'lng' => $lng,
                'lat' => $lat,
                'matrix_id' => $info['matrixid'],
                'cam_id' => $camId,
                'map_list_id' => $mapListId
            );
            $res = M('MapMark')->add($arr);

            $lastInsId = M('MapMark')->getLastInsID();

            $data = M('MapMark')->where("id = $lastInsId")->find();
            $data['info'] = unserialize($data['info']);

            if ($res) {
                $this->apiReturn(true, self::SUCCESS_REQUEST, $data);
            } else {
                $this->apiReturn(false, self::DATA_NOT_EXITS);
            }
        } else {
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
    }

    public function getMapAllMark()
    {
        $this->tokenVerify();
        $mapListId = I('Map_list_id');

        if (!$mapListId) {
            $this->apiReturn(false, self::PARAMETER_ERROR);
        } else {
            $res = M('MapMark')->where("map_list_id = '$mapListId'")->field('id,info,lng,lat,cam_id')->select();
        }

        if ($res) {
            foreach ($res as $k => $v) {
                $res[$k]['info'] = unserialize($v['info']);
            }
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }

    public function delMapMark()
    {
        $is_delAll = I('delAll', '');
        $mapListId = I('Map_list_id');
        $markId = I('markId');
        $this->tokenVerify();

        $auth = M('MapList')->where("id = '$mapListId'")->find();
        if ($auth['uid'] != $this->uid) {
            $this->apiReturn(false, self::NO_AUTH);
        }

        if (!$is_delAll) {
            if (!$markId) {
                $this->apiReturn(false, self::PARAMETER_ERROR);
            }

            $res = M('MapMark')->where(array('id' => $markId))->delete();
        } else {
            if (!$mapListId or !$this->uid) {
                $this->apiReturn(false, self::PARAMETER_ERROR);
            }

            $res = M('MapMark')->where(array('map_list_id' => $mapListId, 'uid' => $this->uid))->delete();
        }

        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }

    public function delPersonalMap()
    {
        $mapListId = I('Map_list_id', '');
        $this->tokenVerify();
        if (!$mapListId) {
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        $auth = M('MapList')->where("id = '$mapListId'")->find();
        if ($auth['uid'] != $this->uid) {
            $this->apiReturn(false, self::NO_AUTH);
        }
        $res = M("map_list")->where(array('id' => $mapListId, 'uid' => $this->uid))->delete();
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }

    public function checkMobile()
    {
        $mobile = I('mobile');
        if (!$mobile) {
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        $res = M('user')->where(array("mobile" => $mobile))->find();
        if ($res) {
            $this->apiReturn(false, self::MOBILE_EXITS);
        } else {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        }
    }

    public function getDeviceType()
    {
        if (I('SinPageNum') && I('pageNum')) {
            $SinPageNum = I('SinPageNum');
            $pageNum = I('pageNum');
            $pageNum = ($pageNum - 1) * $SinPageNum;
            $res = M('types')->where("status = 1")->field('id,firmid,userid,name,type,status')->limit("$pageNum , $SinPageNum")->select();
        } else {
            $res = M('types')->where("status = 1")->field('id,firmid,userid,name,type,status')->select();
        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }

    public function addMapAddress()
    {
        $this->tokenVerify();
        $data['lat'] = I('lat', '', 'trim');
        $data['lng'] = I('lng', '', 'trim');
        $data['uid'] = $this->uid;
        $data['origin_name'] = I('addName', '', 'trim');
        $data['custom_name'] = I('customName', '', 'trim');
        $data['type'] = I('type');
        if(I('mapListId')){
            $data['map_list_id'] = I('mapListId');
        }else{
            $data['map_list_id'] = M('map_list')->where(['map_type'=>1])->getField('id');
        }
        if (empty($data['lat']) || empty($data['lng'])) {
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        if (M("map_address")->where(['lat' => $data['lat'], 'lng' => $data['lng'], 'uid' => $data['uid']])->find()) {
            $res = M("map_address")->where([
                'lat' => $data['lat'],
                'lng' => $data['lng'],
                'uid' => $data['uid']
            ])->save($data);
        } else {
            $res = M("map_address")->add($data);
        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }

    public function getMapAddress()
    {
        $this->tokenVerify();
        $uid = $this->uid;
        $key_word = I('keyWord', '', 'trim');
        if ($key_word) {
            if (I('SinPageNum') && I('pageNum')) {
                $SinPageNum = I('SinPageNum');
                $pageNum = I('pageNum');
                $pageNum = ($pageNum - 1) * $SinPageNum;
                $res = M("map_address")->where([
                    'custom_name' => ['like', "%$key_word%"],
                    'uid' => $uid
                ])->limit("$pageNum , $SinPageNum")->select();
            } else {
                $res = M("map_address")->where(['custom_name' => ['like', "%$key_word%"], 'uid' => $uid])->select();
            }
            if (!$res) {
                $res = M("map_address")->where(['origin_name' => ['like', "%$key_word%"], 'uid' => $uid])->select();
            }
        } else {
            if (I('SinPageNum') && I('pageNum')) {
                $SinPageNum = I('SinPageNum');
                $pageNum = I('pageNum');
                $pageNum = ($pageNum - 1) * $SinPageNum;
                $res = M("map_address")->where(['uid' => $uid])->limit("$pageNum , $SinPageNum")->select();
            } else {
                $res = M("map_address")->where(['uid' => $uid])->select();
            }
        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }

    public function delMapAddress() {
        $this->tokenVerify();
        $res = M("map_address")->where(['uid' => $this->uid , 'id' => I('id')])->delete();
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }


    public function editMapAddress() {
        $this->tokenVerify();
        $res = M("map_address")->where(['uid' => $this->uid , 'id' => I('id')])->save(['custom_name'=>I('customName')]);
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }

    public function getUserInfo() {
        $this->tokenVerify();
        $user = M('user')->where(['id'=>$this->uid])->find();
        $avtar = M('avatar')->where(['userid'=>$this->uid])->find();
        $user['avatar'] = $avtar['filepath'].$avtar['original_name']?'http://' . $_SERVER['HTTP_HOST'] . $avtar['filepath'].$avtar['original_name']:null;
        $user['nickname'] = $user['username'];
        unset($user['username']);
        if ($user) {
            $this->apiReturn(true, self::SUCCESS_REQUEST , $user);
        } else {
            $this->apiReturn(false, self::DATA_NOT_EXITS);
        }
    }

    public function editUserInfo() {
        $this->tokenVerify();
        if(I('address',null,'trim')) $save['address'] = I('address',null,'trim');
        if(I('wxnum',null,'trim')) $save['wxnum'] = I('wxnum',null,'trim');
        if(I('qqnum',null,'trim')) $save['qqnum'] = I('qqnum',null,'trim');
        if(I('workunit',null,'trim')) $save['workunit'] = I('workunit',null,'trim');
        if(I('databirth',null,'trim')) $save['databirth'] = I('databirth',null,'trim');
        if(I('realname',null,'trim')) $save['realname'] = I('realname',null,'trim');
        if(I('username',null,'trim')) $save['username'] = I('username',null,'trim');
        if(I('email',null,'trim')) $save['email'] = I('email',null,'trim');
        if(I('status',null,'trim')) $save['status'] = I('status',null,'trim');
        if(I('intro',null,'trim')) $save['intro'] = I('intro',null,'trim');
        if(I('loginplatform',null,'trim')) $save['loginplatform'] = I('loginplatform',null,'trim');
        if(I('level',null,'trim')) $save['level'] = I('level',null,'trim');
        if(I('lastfirmid',null,'trim')) $save['lastfirmid'] = I('lastfirmid',null,'trim');
        $res = M("user")->where(['id'=>$this->uid])->save($save);
        if(I('avatar')){
            $mapPic = base64_decode(I('avatar'));
            $ext = 'jpeg';
            $path = date('Y-m-d') . '/';
            $original_name = md5(time() . rand(100,1000)) . '.' . $ext;
            $avatar_name = time() . rand(100,1000) . '.' . $ext;
            $file_name =  $original_name;
            if (!file_exists('./Uploads/avatar/' . $path)) {
                mkdir('./Uploads/avatar/' . $path, 0777);
            }
            if (file_put_contents('./Uploads/avatar/' .$path. $file_name, $mapPic) === false) {
                $this->apiReturn(false, self::INTERNAL_ERROR);
            }

            $data = ['userid'=>$this->uid , 'filepath'=>'/Uploads/avatar/'.$path , 'original_name'=>$original_name , 'ext'=>$ext , 'createtime'=>time()];

            imgThump('.'.$data['filepath'].$original_name , '.'.$data['filepath']. '80_'.$avatar_name, 80,80);
            $data['avatar_name'] = '80_'.$avatar_name.'|';
            imgThump('.'.$data['filepath'].$original_name , '.'.$data['filepath']. '60_'.$avatar_name, 60,60);
            $data['avatar_name'] .= '60_'.$avatar_name.'|';
            imgThump('.'.$data['filepath'].$original_name , '.'.$data['filepath']. '40_'.$avatar_name, 40,40);
            $data['avatar_name'] .= '40_'.$avatar_name;

            if(M("avatar")->where(['userid'=>$this->uid])->find()){
                $res = M("avatar")->where(['userid'=>$this->uid])->save($data);
            }else{
                $res = M("avatar")->add($data);
            }
        }

        if ($res !== false) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }

    }

    public function addFirm(){
        $this->tokenVerify();
        $name = I("name");
        $intro = I("intro");
        if(M('firm')->where(['name' => $name])->find()){
            $this->apiReturn(true, self::FIRM_NAME_EXITS);
        }
        if(I('logoImg')){
            $Pic = base64_decode(I('logoImg'));
            $ext = 'jpeg';
            if (empty($Pic)) {
                $this->apiReturn(false, self::PARAMETER_ERROR);
            }
            $file_name = date('Y-m-d') . '/' . md5(time() . rand(100,999)) . '.' . $ext;
            if (!file_exists('./Uploads/typeico/' . date('Y-m-d'))) {
                mkdir('./Uploads/typeico/' . date('Y-m-d'), 0777);
            }
            if (!file_put_contents('./Uploads/typeico/' . $file_name, $Pic)) {
                $this->apiReturn(false, self::INTERNAL_ERROR);
            }

        }


        $data = [
            'userid' => $this->uid,
            'name' => $name,
            'intro' => $intro,
            'parentid' => 0,
            'status' => 1,
            'createtime' => time(),
            'logoimg' =>'/Uploads/typeico/' . $file_name
        ];
        $res = M('firm')->add($data);
        $firmid = M('firm')->getLastInsID();
        if ($res) {
            //创建分组
            $ret = \Home\Model\FirmModel::initFirmGroup([
                'firmid' => $firmid,
                'parentid' => 0,
                'name' => '超级管理员',
                'status' => 1,
                'issuper' => 1,
                'times' => 0
            ]);
            //将用户加入到对应用户分组中默认0
            \Home\Model\FirmModel::initGroupUser([
                'firmid' => $firmid,
                'userid' => $this->uid,
                'groupid' => $ret['id'],
                'times' => 0
            ]);

            //切换到新建的机构
            $setfirm = \Home\Model\UserModel::editUser(['lastfirmid' => $firmid], $this->uid);
            if(is_int($setfirm)){
                session('lastfirmid', $firmid);
                Auth::getAuthListS($setfirm, 1); //权限存入session*/
            }
        }

        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function delFirm(){
        $this->tokenVerify();
        $firmid = I('firmId');
        if(I('firmId')) $res = M('firm')->where(['id' => $firmid])->delete();
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }


    public function editFirm(){
        $this->tokenVerify();
        $firmid = I('firmId');
        if(!I('firmId')) $this->apiReturn(false, self::PARAMETER_ERROR);
        if(I('name')) $data['name'] = I('name');
        if(I('intro')) $data['intro'] = I('intro');
        $data['userid'] = $this->uid;
        $data['createtime'] = time();
        if(I('logoImg')){
            $Pic = base64_decode(I('logoImg'));
            $ext = 'jpeg';
            if (empty($Pic)) {
                $this->apiReturn(false, self::PARAMETER_ERROR);
            }
            $file_name = date('Y-m-d') . '/' . md5(time() . rand(100,999)) . '.' . $ext;
            if (!file_exists('./Uploads/typeico/' . date('Y-m-d'))) {
                mkdir('./Uploads/typeico/' . date('Y-m-d'), 0777);
            }
            if (!file_put_contents('./Uploads/typeico/' . $file_name, $Pic)) {
                $this->apiReturn(false, self::INTERNAL_ERROR);
            }
            $data['logoimg'] = '/Uploads/typeico/' . $file_name;
        }
        $res = M('firm')->where(['id' => $firmid])->save($data);

        if ($res !== false) {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function getFirm(){
        $this->tokenVerify();
       /* $mobile = I('mobile');*/ //被邀请人的手机号码
        /*$res_firmid = M('inviting')->where(['mobile'=>$mobile,'status'=>'1'])->field('firmid')->select();
        $res1 = [];
        foreach($res_firmid as $k => $v){
            $res2 = M('firm')->where(['id' => $v['firmid']])->field('userid,id,name,intro,createtime,logoimg')->select();
            $res1 = array_merge($res1,$res2);
        }*/
       /* $res = M('firm')->where(['userid' => $this->uid])->field('userid,id,name,intro,createtime,logoimg')->select();
        $res = array_merge($res,$res1);*/
        $sql=<<<SQL
SELECT
	DISTINCT b.`userid`, b.`name`, b.`intro`, b.`id`, b.`createtime`,b.`logoimg`
FROM
	 `link_firm` `b`
	  LEFT JOIN `link_group_user` `a` ON a.firmid = b.id
WHERE
	(
		a.userid = $this->uid 
		AND a.`status` = 1
	)
SQL;


        $res = M()->query($sql);
        foreach($res as $k => $v){
            if($res[$k]['logoimg']){
                $res[$k]['logoimg'] = 'http://' . $_SERVER['HTTP_HOST'].  $v['logoimg'];
            }else{
                $res[$k]['logoimg'] = null;
            }

        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST,$res);
        } else {
            $this->apiReturn(false, self::FIRM_NOT_EXITS);
        }
    }

    public function inviteJoinFirm(){
        $this->tokenVerify();
        $this->firmid = I('firmId');
        $tel = I("tel");
        $tel = str_replace('，', ',', $tel);
        $tel = explode(',', $tel);
        $mobile = [];
        foreach ($tel as $v) {
            if (is_mobile($v)) {
                array_push($mobile, $v);
            }
        }
        if (empty($mobile)) $this->apiReturn(false, self::MOBILE_NOT_TRUE );
        $mobile = array_unique($mobile);
        foreach ($mobile as $v){
            $data = [
                'userid' => $this->uid,
                'firmid' => $this->firmid,
                'mobile' => $v,
                'groupid' => 0,
                'status' => 0,
                'createtime' => time()
            ];
            $res = M('inviting')->add($data);
        }
        if($res){
            $this->apiReturn(true, self::INVITE_JOIN_SUCCESS);
        }else{
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function inviteList(){
        $this->tokenVerify();
        $mobile = I('mobile');
        if(!$mobile)  $this->apiReturn(false, self::PARAMETER_ERROR);
        if (I('SinPageNum') && I('pageNum')) {
            $SinPageNum = I('SinPageNum');
            $pageNum = I('pageNum');
            $pageNum = ($pageNum - 1) * $SinPageNum;
            $res = \Home\Model\FirmModel::inviteMessage($mobile);
            $res = array_slice($res,$pageNum,$SinPageNum);
        } else {
            $res = \Home\Model\FirmModel::inviteMessage($mobile);
        }
        $model = M('firm');
        foreach($res as $k=>$v){
            $find_firm = $model->where(['id'=>$v['firmid']])->find();
            $res[$k]['logoImg'] = 'http://' . $_SERVER['HTTP_HOST']. '/Uploads/typeico/' . $find_firm['logoimg']?'http://' . $_SERVER['HTTP_HOST']. '/Uploads/typeico/'.$find_firm['logoimg']:null;
            $res[$k]['intro'] = $find_firm['intro']?$find_firm['intro']:null;
        }
        if($res){
            $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
        }else{
            $this->apiReturn(false, self::INVITE_DATA_EMPTY);
        }
    }

    public function joinFirm(){
        $this->tokenVerify();
        $mobile = I("mobile");
        if(!$mobile)$this->apiReturn(false, self::PARAMETER_ERROR);
        //同意邀请
        if(I('status') == 1){
            $id = I("inviteId",'','intval');
            $list =  \Home\Model\FirmModel::inviting($mobile);
            $list = hd_array_column($list, [], 'id');
            $info = $list[$id];
            if (empty($info) || !is_array($info)){
                $this->apiReturn(false, self::OPERATION_FAILED);
            }
            $info['groupid'] = M("firm_group")->where(['firmid'=>$info['firmid'],'name'=>'超级管理员'])->getField('id');
            $data = [
                'firmid' => $info['firmid'],
                'groupid' => $info['groupid'],
                'userid' => $this->uid,
                'status' => 1,
                'times' => 0
            ];
            $ret = \Home\Model\FirmModel::initGroupUser($data);
            if($ret['status']){
                \Home\Model\FirmModel::editInviing(['status'=>1], $id);
                $this->apiReturn(true, self::INVITE_JOIN_TRUE);
            }


        }
        //放弃邀请
        if(I('status') == 2){
            $id = I("inviteId",'','intval');
            \Home\Model\FirmModel::editInviing(['status'=>2], $id);
            $this->apiReturn(true, self::INVITE_JOIN_FALSE);
        }

    }

    public function getFirmMember(){
        $this->tokenVerify();
        $firm_id = I('firmId');
        $res_userid = M('group_user')->where(['firmid'=>$firm_id])->field('userid')->select();

        $res = [];
        foreach($res_userid as $v){
            array_push($res,$v['userid']);
        }
        $res_userid = array_unique($res);


        $res = [];
        foreach($res_userid as $k=>$v){
            $data = M("user")->where(['id'=>$v])->find();
            if(!$data) continue;
            $avtar = M('avatar')->where(['userid'=>$v])->find();
            $data['avatar'] = $avtar['filepath'].$avtar['original_name']?'http://' . $_SERVER['HTTP_HOST'] . $avtar['filepath'].$avtar['original_name']:null;
            array_push($res,$data);
        }
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST , $res);
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }

    }

    public function pushLocation(){
        $this->tokenVerify();
        $data['token'] = I('token');
        $data['create_time'] = time();
        $data['lng'] = I('lng');
        $data['lat'] = I('lat');
        $data['userid'] = $this->uid;
        if( !$data['lng'] || !$data['lat']){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        /*if(M('rtlocation')->where(['create_time'=>['ELT',time()-86400],'userid'=>['EQ',$this->uid]])->find()){
            M('rtlocation')->where(['create_time'=>['ELT',time()-86400],'userid'=>['EQ',$this->uid]])->delete();
        }*/
        $res = M('rtlocation')->add($data);
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST );
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function getLocation(){
        $uid = I('uid');
        $res = M('rtlocation')->where(['create_time'=>['EGT',time()-300],'userid'=>['EQ',$uid]])->select();
        if ($res) {
            $this->apiReturn(true, self::SUCCESS_REQUEST ,$res);
        } else {
            $this->apiReturn(false, self::LOCATION_NOT_EXIT);
        }
    }

    public function getGroupMember(){
        $this->tokenVerify();
        $groupId =  I('groupId','');
        $firmId = I('firmId','');
        if(empty($groupId) && empty($firmId)) $this->apiReturn(false, self::PARAMETER_ERROR);
        $res_group = M('group_user')->where(['groupid'=>$groupId,'firmid'=>$firmId , 'status' => 1])->field('userid')->select();
        if(!$res_group)
        {
            $this->apiReturn(false, self::GROUP_NOT_MEMBER);
        }
        $user_info = [];
        foreach($res_group as $k=>$v){
            $user = M('user')->where(['id'=>$v['userid']])->find();
            $avtar = M('avatar')->where(['userid'=>$user['id']])->find();
            $user['avatar'] = $avtar['filepath'].$avtar['original_name']?'http://' . $_SERVER['HTTP_HOST'] . $avtar['filepath'].$avtar['original_name']:null;
            array_push($user_info,$user);
        }
        if ($user_info) {
            $this->apiReturn(true, self::SUCCESS_REQUEST ,$user_info);
        } else {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function addGroup(){
        $this->tokenVerify();
        $data['name'] = I('groupName');
        if(!M('firm')->where(['userid'=>$this->uid,'id'=>I('firmId')])->find()){
            $this->apiReturn(false, self::NOT_FIRM_CREATER);
        }
        //作为上级部门ID，一维数组中只有一个groupID
        $data['parentid'] = (array)I('groupParentid',[]);
        $data['parentid'] = $data['parentid'][0] == null ? 0 :$data['parentid'][0];
        $data['intro'] = I('groupIntro');
        $data['firmid'] = I('firmId','');
        $data['createtime'] = time();
        $data['status'] = 1;
        if(M('firm_group')->where(['firmid'=> $data['firmid'],'name'=> $data['name']])->find()){
            $this->apiReturn(false, self::GROUP_NAME_EXITS);
        }
        $res = M('firm_group')->add($data);
        if($res){
            $this->apiReturn(true, self::CREATE_GROUP_TRUE);
        }else{
            $this->apiReturn(false, self::CREATE_GROUP_FALSE);
        }
    }


    public function editGroup(){
        $this->tokenVerify();
        $user_id = json_decode(I('userId'));
        if(!I('groupId')){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        if(!M('firm')->where(['userid'=>$this->uid,'id'=>I('firmId')])->find()){
            $this->apiReturn(false, self::NOT_FIRM_CREATER);
        }
        //用来更新部门
        if(I('groupName')){
            $data['name'] = I('groupName');
        }/*else{
            $this->apiReturn(false, self::PLEESE_UPLOAD_GROUPNAME);
        }*/
        if(I('groupParentid')){
            $data['parentid'] = (array)I('groupParentid',[]);
            $data['parentid'] = $data['parentid'][0];
        }
        if(I('groupIntro')) $data['intro'] = I('groupIntro');
        $data['createtime'] = time();
        $data['status'] = 1;
        if( !count($user_id) && !I('groupIntro') && M('firm_group')->where(['firmid'=>I('firmId'),'name'=>$data['name']])->find()){
            $this->apiReturn(false, self::NOT_INVALID_edit);
        }
        $res = M('firm_group')->where(['id'=>I('groupId')])->save($data);

        //为部门添加员工
        if($res !== false && $user_id[0] != ''){
            //获取此次编辑之前的部门成员数据
            $edit_before = M('group_user')->where(['firmid'=>I('firmId'),'groupid'=>I('groupId'),'status' => 1])->select();
            //将机构部门下面的所有用户初始化为禁止状态
            M('group_user')->where(['firmid'=>I('firmId'),'groupid'=>I('groupId')])->save(['status'=>0]);
            //之前部门有当前编辑的用户则更新。否则插入

            foreach($user_id as $v){
                if(M('group_user')->where(['firmid'=>I('firmId'),'groupid'=>I('groupId'),'userid'=>$v])->find()){
                    $res = M('group_user')->where(['firmid'=>I('firmId'),'groupid'=>I('groupId'),'userid'=>$v])->save(['status'=>1,'createtime'=>time()]);
                }else{
                    $res = M('group_user')->add(['firmid'=>I('firmId'),'groupid'=>I('groupId'),'userid'=>$v,'status'=>1,'createtime'=>time(),'times'=>0]);
                }
            }
        }
        elseif($res !== false)
        {
            $res = M('group_user')->where(['firmid'=>I('firmId'),'groupid'=>I('group_id')])->save(['status'=>0,'createtime'=>time()]);
        }

        if($res !== false){
            $this->apiReturn(true, self::EDIT_GROUP_TRUE);
        }else{
            $this->apiReturn(false, self::EDIT_GROUP_FALSE);
        }
    }

    public function delGroup(){
        $this->tokenVerify();
        $group_id = explode(',',I('groupId'));
        $firmId = I('firmId');
        if(!M('firm')->where(['userid'=>$this->uid,'id'=>$firmId])->find()){
            $this->apiReturn(false, self::NOT_FIRM_CREATER);
        }
        //首先检查部门下面是否有子部门，如果有子部门则先删除子部门
        foreach($group_id as $k=>$v){
            $is_sun = M('firm_group')->where(['parentid'=>$v,'status'=>1])->find();
            if($is_sun)
            {
                $this->apiReturn(false, self::DEL_GROUP_EXITS_SUN);
            }

            $del_res = M('firm_group')->where(['id'=>$v])->save(['status'=>0]);

            if($del_res !== false)
            {
                $del_res = M('group_user')->where(['firmid'=>$firmId,'groupid'=>$v])->delete();
            }
        }
        if($del_res !== false){
            $this->apiReturn(true, self::DEL_GROUP_FALSE);
        }else{
            $this->apiReturn(false, self::DEL_GROUP_TRUE);
        }
    }

    public function getGroup(){
        $firm_id = I('firmId');
        $res = get_groupaz($firm_id);
        if($res !== false)
        {
            $this->apiReturn(true, self::SUCCESS_REQUEST,$res);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function addShareDevice()
    {
        $this->tokenVerify();
        $uid = $this->uid;
        $stype = I('post.stype');
        $deviceData = json_decode(I('post.dataDevice'), true); //设备
//        $dataOrg = json_decode(I('post.dataOrg'), true);; //机构
        $resData = json_decode(I('post.resData')); //资源
        if(!empty($deviceData)){
            $deviceData = \Home\Model\DeviceModel::buildDevData($deviceData);//过滤设备数据
            $resData = \Home\Model\DeviceModel::buildResData($resData);//过滤资源数据
            $saveData = \Home\Model\DeviceModel::buildData($deviceData,$resData,$uid);
            $res = \Home\Model\DeviceModel::saveShareAndLog($saveData,$deviceData,$resData,$uid,$stype);
            if($res['status']){
                $this->apiReturn(true, self::SUCCESS_REQUEST);
            }else{
                $this->apiReturn(false, self::OPERATION_FAILED);
            }
        }else{
            $this->apiReturn(false, self::NOT_SELECT_DATA);
        }
    }

    public function shareLogList()
    {
        $this->tokenVerify();
        $uid = $this->uid;
        $pagesize = I('pagesize');//每页多少条数据
        $pagenum = I('pagenum');//第几页
        $shareLog = \Home\Model\DeviceModel::getShareLog($uid,$pagesize,$pagenum);
        foreach($shareLog as $k => $v){
            $shareLog[$k]['device'] = unserialize($v['device']);
            $shareLog[$k]['devicename'] = unserialize($v['devicename']);
            $shareLog[$k]['resource'] = unserialize($v['resource']);
            $shareLog[$k]['resourcename'] = unserialize($v['resourcename']);
        }
        if (!empty($shareLog)) {
            $this->apiReturn(true, self::SUCCESS_REQUEST, $shareLog);
        } else {
            $this->apiReturn(false, self::EMPTY_SHARE_LIST);
        }

    }

    public function getShareByDeviceid(){
        $this->tokenVerify();
        $did = I('post.deviceid');
        $res = \Home\Model\DeviceModel::getShareByDid($did);
        if(!empty($res)){
            $ret = [];
            foreach($res as $k => $v){
                $ret[] = [
                    'id' => $k,
                    'name' => $v
                ];
            }
            $this->apiReturn(true, self::SUCCESS_REQUEST, $ret);
        }else{
            $this->apiReturn(false, self::EMPTY_SHARE_LIST);
        }
    }

    public function searchOrg()
    {
        $this->tokenVerify();
        $keyword = I('post.keyword', '', 'trim');
        if (!empty($keyword)) {
            $res = M('Firm')->where("id LIKE '%$keyword%' or name LIKE '%$keyword%'")->select();
            foreach ($res as $k => $v) {
                $res[$k]['logoimg'] = C('SITE_URL') . $v['logoimg'];
            }
            if ($res) {
                $this->apiReturn(true, self::SUCCESS_REQUEST, $res);
            } else {
                $this->apiReturn(false, self::INFO_NOT_FOUND);
            }
        }

    }

    public function modifyShareDevice()
    {
        $this->tokenVerify();
        $uid = $this->uid;
        $stype = I('post.stype');
        $deviceData = json_decode(I('post.dataDevice')); //设备
        $resData = json_decode(I('post.resData')); //资源
        if(!empty($deviceData)){
            $deviceData = \Home\Model\DeviceModel::buildDevData($deviceData);//过滤设备数据
            $resData = \Home\Model\DeviceModel::buildResData($resData);//过滤资源数据
            $saveData = \Home\Model\DeviceModel::buildData($deviceData,$resData,$uid);
            \Home\Model\DeviceModel::deleteShareByDid($deviceData);
            $res = \Home\Model\DeviceModel::saveShareAndLog($saveData,$deviceData,$resData,$uid,$stype);
            if($res['status']){
                $this->apiReturn(true, self::SUCCESS_REQUEST);
            }else{
                $this->apiReturn(false, self::OPERATION_FAILED);
            }
        }else{
            $this->apiReturn(false, self::NOT_SELECT_DATA);
        }
    }

    public function delShareDevice()
    {
        $this->tokenVerify();
        $uid = $this->uid;
        $did = I('post.deviceid');
        $stype = I('post.stype');
        $res = \Home\Model\DeviceModel::deleteShare($did,$uid,$stype);
        if ($res) {
            $this->apiReturn(true, self::DELETE_SUCCESS);
        } else {
            $this->apiReturn(false, self::DELETE_FAILED);
        }
    }

    public function addBrand(){
        $this->tokenVerify();
        if(!I('name') || !I('firmId')){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        $firmId = I('firmId');
        if(I('brandPic')){
            $brandPic = base64_decode(I('brandPic'));
            $ext = 'jpeg';
            $file_name = date('Y-m-d') . '/' . md5(time() . rand(100,999)) . '.' . $ext;
            if (!file_exists('./Uploads/typeico/' . date('Y-m-d'))) {
                mkdir('./Uploads/typeico/' . date('Y-m-d'), 0777);
            }
            if (!file_put_contents('./Uploads/typeico/' . $file_name, $brandPic)) {
                $this->apiReturn(false, self::INTERNAL_ERROR);
            }

            $data['logoimg'] = '/Uploads/typeico/' . $file_name;
        }


        $data['name'] = empty(I('name'))? null : I('name');
        if($data['name'] && M("brand")->where(['name' => $data['name'],'firmid'=>$firmId])->find()){
            $this->apiReturn(false, self::BRAND_NAME_EXITS);
        }
        $data['userid'] = $this->uid;
        $data['firmid'] = $firmId;
        $data['company'] = empty(I('company'))? null : I('company');
        $data['intro'] = empty(I('intro'))? null : I('intro');
        $res = M("brand")->add($data);
        if($res){
            $this->apiReturn(true, self::BRAND_ADD_SUCCESS);
        }else{
            $this->apiReturn(false, self::BRAND_ADD_FALSE);
        }
    }


    public function editBrand(){
        $this->tokenVerify();
        if(!I('brandId')  && !I('brandPic') && !I('name') && !I('intro')){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        if(I('brandPic')){
            $brandPic = base64_decode(I('brandPic'));
            $ext = 'jpeg';
            $file_name = date('Y-m-d') . '/' . md5(time() . rand(100,999)) . '.' . $ext;
            if (!file_exists('./Uploads/typeico/' . date('Y-m-d'))) {
                mkdir('./Uploads/typeico/' . date('Y-m-d'), 0777);
            }
            if (!file_put_contents('./Uploads/typeico/' . $file_name, $brandPic)) {
                $this->apiReturn(false, self::INTERNAL_ERROR);
            }

            $data['logoimg'] = '/Uploads/typeico/' . $file_name;
        }
        if(I('name')){
            $data['name'] = I('name');
        }
        if(I('company')) $data['company'] = I('company');
        if(I('intro')) $data['intro'] = I('intro');
        $res = M("brand")->where(['brand_id' =>I('brandId')])->save($data);
        if($res !== false){
              $this->apiReturn(true, self::BRAND_EDIT_SUCCESS);
        }else{
            $this->apiReturn(false, self::BRAND_EDIT_FALSE);
        }
    }

    public function delBrand(){
        $this->tokenVerify();
        if(!I('brandId')){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        if(I('brandId')) $res = M("brand")->where(['brand_id' =>I('brandId')])->delete();
        if($res){
            $this->apiReturn(true,self::DELETE_SUCCESS);
        }else{
            $this->apiReturn(false,self::DELETE_FAILED);
        }
    }


    public function getBrand(){
        $this->tokenVerify();
        if(!I('firmId')){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        $res = M("brand")->where(['firmid'=>I('firmId')])->select();
        foreach($res as $k=>$v){
            $res[$k]['logoimg'] = 'http://'. $_SERVER['HTTP_HOST'] .$v['logoimg'];
        }
        if($res){
            $this->apiReturn(true,  self::SUCCESS_REQUEST,$res);
        }else{
            $this->apiReturn(false,  self::OPERATION_FAILED);
        }
    }

    public function addMarking(){
        $this->tokenVerify();
        $data['intro'] = I('intro','');
        $data['name'] = I('name','');
        $data['event'] = I('event','');
        $data['brand_id'] = I('brandId','');
        $data['userid'] =  $this->uid;
        $data['firmid'] =  I('firmId','');
        if(!$data['name'] &&  !$data['brand_id']) $this->apiReturn(false, self::PARAMETER_ERROR);
        if(M('marking')->where(['brand_id'=> $data['brand_id'],'name'=>$data['name']])->find())
        {
            $this->apiReturn(false, self::MARKING_NAME_EXITS);
        }
        $res = M('marking')->add($data);
        if($res)
        {
            $this->apiReturn(true, self::MARKING_ADD_SUCCESS);
        }
        else
        {
            $this->apiReturn(false, self::MARKING_ADD_FALSE);
        }
    }

    public function editmarking(){
        $this->tokenVerify();
        if( I('intro','')){
            $data['intro'] = I('intro','');
        }
        if( I('name','')){
            $data['name'] = I('name','');
        }
        if( I('markingEvent','')){
            $data['event'] = I('event','');
        }
        if( I('markingId','')){
            $data['marking_id'] = I('markingId','');
        }

        if(!$data['intro'] &&  !$data['name'] && !$data['marking_id']){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        if(!$data['marking_id']) $this->apiReturn(false, self::PARAMETER_ERROR);

        $res = M('marking')->where(['marking_id'=>$data['marking_id']])->save($data);
        if($res !== false)
        {
            $this->apiReturn(true, self::SUCCESS_MODIFY);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }


    public function delMarking(){
        $this->tokenVerify();
        if(!I('markingId','')) $this->apiReturn(false, self::PARAMETER_ERROR);

        $res = M('marking')->where(['marking_id'=>I('markingId','')])->delete();
        if($res !== false)
        {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function getMarking(){
        $this->tokenVerify();
        if(!I('brandId','')) $this->apiReturn(false, self::PARAMETER_ERROR);

        $res = M('marking')->where(['brand_id'=>I('brandId','')])->select();
        if($res)
        {
            $this->apiReturn(true, self::SUCCESS_REQUEST,$res);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }


    public function addVersion(){
        $this->tokenVerify();
        $data['intro'] = I('intro','');
        $data['name'] = I('name','');
        $data['brand_id'] = I('brandId','');
        $data['firmid'] = I('firmId','');
        $data['userid'] =  $this->uid;
        if(empty($data['name']) &&  $data['brand_id']) $this->apiReturn(false, self::PARAMETER_ERROR);
        if(M('marking')->where(['brand_id'=> $data['brand_id'],'name'=>$data['name']])->find())
        {
            $this->apiReturn(false, self::VERSION_NAME_EXITS);
        }
        $res = M('brand_version')->add($data);
        if($res)
        {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function editVersion(){
        if( I('intro','')){
            $data['intro'] = I('intro','');
        }
        if( I('name','')){
            $data['name'] = I('name','');
        }
        if( I('versionId','')){
            $data['version_id'] = I('versionId','');
        }

        if( I('brandId','')){
            $data['brand_id'] = I('brandId','');
        }
        if(!$data['intro'] &&  !$data['name'] && !$data['version_id']){
            $this->apiReturn(false, self::PARAMETER_ERROR);
        }
        if(!$data['version_id']) $this->apiReturn(false, self::PARAMETER_ERROR);

        $res = M('brand_version')->where(['version_id'=>$data['version_id']])->save($data);
        if($res !== false)
        {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function getVersion(){
        $this->tokenVerify();
        if(!I('brandId','')) $this->apiReturn(false, self::PARAMETER_ERROR);

        $res = M('brand_version')->where(['brand_id'=>I('brandId','')])->select();
        if($res)
        {
            $this->apiReturn(true, self::SUCCESS_REQUEST,$res);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function delVersion(){
        if(!I('versionId','')) $this->apiReturn(false, self::PARAMETER_ERROR);

        $res = M('brand_version')->where(['version_id'=>I('versionId','')])->delete();
        if($res !== false)
        {
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }

    public function getExits(){
        $this->tokenVerify();
        if(!I('firmId','')) $this->apiReturn(false, self::PARAMETER_ERROR);
        $res = M('group_user')->where(['userid'=>$this->uid,'firmid'=>I('firmId','')])->find();
        if($res)
        {
            $this->apiReturn(true, self::SUCCESS_REQUEST,true);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED,false);
        }
    }

    public function initiativeJoinFirm()
    {
        $this->tokenVerify();
        $ids = I("firmId");
        $alreadyJoin = \Home\Model\FirmModel::getJoinFirm($this->uid);
        $alreadyApp = \Home\Model\FirmModel::getAppFirm($this->uid);
        $alreadyJoin = array_column($alreadyJoin, 'firmid');
        $alreadyApp = array_column($alreadyApp, 'to_firmid');
        if(in_array($ids,$alreadyJoin) || in_array($ids,$alreadyApp)){
            $this->apiReturn(false, self::NOT_AGAIN_JOIN);
        }
        $firms = M('firm')->where(['id' => ['in',$ids]])->select();
        $res = \Home\Model\FirmModel::apiAddApplication($firms,$this->uid);
        if($res['status'] === true){
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }


    public function getInitJoinFirmMember()
    {
        $this->tokenVerify();
        $res = \Home\Model\FirmModel::apiAppList($this->uid);
        foreach ($res as $k=>$v){
            if($v['filepath'].$v['original_name']){
                $res[$k]['logoImg'] = 'http://'.$_SERVER['HTTP_HOST'].$v['filepath'].$v['original_name'];
            }else
            {
                $res[$k]['logoImg'] = null;
            }
        }
        if($res){
            $this->apiReturn(true, self::SUCCESS_REQUEST , $res);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }
    }


    public function allowJoinFirm()
    {
        $this->tokenVerify();
        $id = I("id",'','intval');
        $isType = I("isType");
        if($isType == 1){
            $info =  \Home\Model\FirmModel::getAppById($id);
            if (empty($info) || !is_array($info)){
                $this->apiReturn(false, self::PARAMETER_ERROR);
            }
            $info['groupid'] = M("firm_group")->where(['firmid'=>$info['to_firmid'],'name'=>'超级管理员'])->getField('id');
            $data = [
                'firmid' => $info['to_firmid'],
                'groupid' => $info['groupid'],
                'userid' => $info['from_userid'],
                'status' => 1,
                'times' => 0
            ];
            $ret = \Home\Model\FirmModel::initGroupUser($data);
            if($ret['status']){
                \Home\Model\FirmModel::updateApply(['status'=>1,'updatetime' => time()], $id);
            }
        }elseif($isType == 2)
        {
            $ret =  M("application")->where(['id'=>$id])->delete();
            if($ret){
                $ret = ['status'=>true,'msg'=>'拒绝成功','data'=>[]];
            }
        }

        if($ret['status']){
            $this->apiReturn(true, self::SUCCESS_REQUEST);
        }
        else
        {
            $this->apiReturn(false, self::OPERATION_FAILED);
        }

    }



}