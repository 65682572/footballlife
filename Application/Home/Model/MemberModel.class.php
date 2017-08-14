<?php

namespace Home\Model;

use Think\Model;
use Think\Auth;

class MemberModel extends Model
{
    const REG_ERROR_NONE = 0;
    const LOGIN_ERROR_NONE = 1;
    const SEND_SUCCESS = 2;

    const REG_ERROR_MOBILE = -1;
    const REG_ERROR_USERNAME = -2;
    const REG_ERROR_PASSWD = -3;
    const REG_ERROR_MOBILE_EXIST = -4;
    const REG_ERROR_MOBILE_DATABASE = -5;
    const LOGIN_ERROR_MOBILE_EXIST = -6;
    const LOGIN_ERROR_MOBILE_BLACK = -7;
    const LOGIN_ERROR_MOBILE_PWD = -8;
    const WRONG_MOBILE_OR_PASS = -14;
    const NOT_FOUND_USER = -15;

    public static $err_msg = [
        self::REG_ERROR_NONE => '注册成功！',
        self::REG_ERROR_MOBILE => '手机格式不正确！',
        self::REG_ERROR_USERNAME => '昵称格式不正确！',
        self::REG_ERROR_PASSWD => '密码格式不正确！',
        self::REG_ERROR_MOBILE_EXIST => '该账号已存在！',
        self::REG_ERROR_MOBILE_DATABASE => '未知错误原因！',
        self::LOGIN_ERROR_MOBILE_EXIST => '用户名不存在！',
        self::LOGIN_ERROR_MOBILE_BLACK => '账号被禁！',
        self::LOGIN_ERROR_MOBILE_PWD => '密码错误！',
        self::WRONG_MOBILE_OR_PASS => '请输入正确的手机号和新密码！',
        self::NOT_FOUND_USER => '找不到该用户！'
    ];

    public static $suc_msg = [
        self::LOGIN_ERROR_NONE => '登陆成功！',
        self::REG_ERROR_NONE => '注册成功!',
        self::SEND_SUCCESS => '发送成功!',
    ];

    const PLATFORM_PC = 1;
    const PLATFORM_IOS = 2;
    const PLATFORM_ANDROID = 3;
    const PLATFORM_WEB = 4;

    /**
     * 注册一个新用户
     * @param  string $username 用户名
     * @param  string $password 用户密码
     * @param  string $mobile 用户手机号码
     * @return integer 注册成功-用户信息，注册失败-错误编号
     */
    public static function register($mobile, $password, $username)
    {
        $data = array(
            'username' => $username,
            'password' => $password,
            'mobile' => $mobile,
        );

        //验证手机
        if (!self::checkMobile($mobile)) {
            return ['status' => false, 'code' => self::REG_ERROR_MOBILE, 'msg' => self::$err_msg[self::REG_ERROR_MOBILE], 'result' => ['list' => []]];
        }

        //检查手机是否已经被注册
        $muinfo = self::mobileUinfo($mobile);
        if (!empty($muinfo)) {
            return ['status' => false, 'code' => self::REG_ERROR_MOBILE_EXIST, 'msg' => self::$err_msg[self::REG_ERROR_MOBILE_EXIST], 'result' => ['list' => []]];
        }

        //检查昵称是否合法
        if (!self::checkUserName($username)) {
            return ['status' => false, 'code' => self::REG_ERROR_USERNAME, 'msg' => self::$err_msg[self::REG_ERROR_USERNAME], 'result' => ['list' => []]];
        }

        //检查密码合法性
        if (!self::checkPwd($password)) {
            return ['status' => false, 'code' => self::REG_ERROR_PASSWD, 'msg' => self::$err_msg[self::REG_ERROR_PASSWD], 'result' => ['list' => []]];
        }

        //设置盐盖     其他数据
        $data['salt'] = substr(md5($password . C("SALT_KEY")), 5, 4);
        $data['password'] = think_ucenter_md5($password, $data['salt']);
        $data['status'] = 1;
        $data['createtime'] = time();

        /* 添加用户 */
        $uid = \Home\Model\UserModel::editUser($data);
        if (!$uid) {
            return ['status' => false, 'code' => self::REG_ERROR_MOBILE_DATABASE, 'msg' => self::$err_msg[self::REG_ERROR_MOBILE_DATABASE], 'result' => ['list' => []]];
        }        
        self::mAutoLogin($uid);
        $user = M('User')->where("id = $uid")->find();
        self::autoadddevice($user); //自动创建设备
        self::autoadddevice($user, 1); //自动创建移动设备
        return ['status' => true, 'code' => self::REG_ERROR_NONE, 'msg' => self::$suc_msg[self::REG_ERROR_NONE], 'result' => ['list' => ['uid' => $uid]]];
    }

    //验证是否手机注册
    public static function isMobileReg($mobile)
    {
        //验证手机
        if (!self::checkMobile($mobile)) {
            return ['status' => false, 'code' => self::REG_ERROR_MOBILE, 'result' => ['list' => []]];
        }

       // //检查手机是否已经被注册
       // $muinfo = self::mobileUinfo($mobile);
       // if (!empty($muinfo)) {
       //     return ['status' => false, 'code' => self::REG_ERROR_MOBILE_EXIST];
       // }

        return ['status' => true, 'code' => self::SEND_SUCCESS, 'msg' => self::$suc_msg[self::SEND_SUCCESS], 'result' => ['list' => []]];
    }

    /**
     * 用户登录
     * @param $mobile
     * @param $password
     * @param int $isuid
     * @return bool|mixed
     */
    public static function login($mobile, $password)
    {
        if (!self::checkMobile($mobile)) {
            return ['status' => false, 'code' => self::REG_ERROR_MOBILE];
        }

        if (!self::checkPwd($password)) {
            return ['status' => false, 'code' => self::REG_ERROR_PASSWD];
        }

        //检查手机是否注册
        $user = self::mobileUinfo($mobile);
        if (empty($user) || !is_array($user)) {
            return ['status' => false, 'code' => self::LOGIN_ERROR_MOBILE_EXIST];
        }

        if ($user['status'] != 1) {
            return ['status' => false, 'code' => self::LOGIN_ERROR_MOBILE_BLACK];
        }

//        $user1 = \Home\Model\UserModel::getUserInfoByIds($user['id']);

        if (think_ucenter_md5($password, $user['salt']) === $user['password']) {
            $res = self::autoLogin($user['id']);
            return $res;
        }

        return ['status' => false, 'code' => self::LOGIN_ERROR_MOBILE_PWD];
    }

    /**
     * 用户登录
     * @param $mobile
     * @param $password
     * @param int $isuid
     * @return bool|mixed
     */
    public static function mLogin($mobile, $password, $devicetype)
    {
        if (!self::checkMobile($mobile)) {
            return [
                'status' => false,
                'code' => self::REG_ERROR_MOBILE,
                'msg' => self::$err_msg[self::REG_ERROR_MOBILE],
                'result' => ['list' => []]
            ];
        }

        if (!self::checkPwd($password)) {
            return [
                'status' => false,
                'code' => self::REG_ERROR_PASSWD,
                'msg' => self::$err_msg[self::REG_ERROR_PASSWD],
                'result' => ['list' => []]
            ];
        }

        //检查手机是否注册
        $user = self::mobileUinfo($mobile);
        if (empty($user) || !is_array($user)) {
            return [
                'status' => false,
                'code' => self::LOGIN_ERROR_MOBILE_EXIST,
                'msg' => self::$err_msg[self::LOGIN_ERROR_MOBILE_EXIST],
                'result' => ['list' => []]
            ];
        }

        if ($user['status'] != 1) {
            return [
                'status' => false,
                'code' => self::LOGIN_ERROR_MOBILE_BLACK,
                'msg' => self::$err_msg[self::LOGIN_ERROR_MOBILE_BLACK],
                'result' => ['list' => []]
            ];
        }        

        if (think_ucenter_md5($password, $user['salt']) === $user['password']) {
            self::mAutoLogin($user['id']);
            // self::autoadddevice($user, $devicetype); //自动创建移动设备
            $avatar = M("avatar")->where(['userid'=>$user['id']])->find();
            $user['avatar'] = $avatar['filepath'].$avatar['original_name']?'http://' . $_SERVER['HTTP_HOST'] . $avatar['filepath'].$avatar['original_name']:null;
            return [
                'status' => true,
                'code' => self::LOGIN_ERROR_NONE,
                'msg' => self::$suc_msg[self::LOGIN_ERROR_NONE],
                'result' => [
                    'list' =>
                        array_merge(['uid' => $user['id'] , 'nickname' => $user['username']],$user)
                ]
            ];
        }        

        return [
            'status' => false,
            'code' => self::LOGIN_ERROR_MOBILE_PWD,
            'msg' => self::$err_msg[self::LOGIN_ERROR_MOBILE_PWD],
            'result' => ['list' => []]
        ];
    }

    /**
     * 退出
     */
    public static function logout()
    {
        session('user_auth', null);
        session('user_auth_sign', null);
        cookie('user_auth', null);
        cookie('user_auth_sign', null);
        session_destroy();
    }

    /**
     * 记录用户登录状态
     * @param  integer $uid 用户id
     */
    public static function autoLogin($uid)
    {
        $confirm = I('confirm');
        if ($confirm != 3) {
            $res = M('Session')->where("session_userid = $uid")->find();
            if ($res['session_expire'] > time()) {
                if ($confirm == 0) {
                    $data = M('User')->where("id = $uid")->find();
                    $ip = $data['loginip'];
                    $location = file_get_contents('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' . $ip);
                    $location = json_decode($location, true);
                    return ['status' => false, 'code' => -99, 'data' => ['ip' => $data['loginip'], 'location' => $location['country'] . ' - ' . $location['province'] . ' - ' . $location['city']]];
                } else if ($confirm == 1) {
                    pushSocketMsg('relogin', '您的账号被其他人登录了！', $uid);
                    M('Session')->where("session_userid = $uid")->delete();
                }
            }
        }
        $user = \Home\Model\UserModel::getUserInfoByIds($uid);
        session('lastLoginTime', $user[$uid]['logintime']);
        /* 更新登录信息 */
        $data = array(
            'loginstatus' => 1,
            'logintime' => time(),
            'loginip' => get_client_ip(),
            'loginplatform' => self::PLATFORM_PC
        );

        $uid = \Home\Model\UserModel::editUser($data, $uid);
        $user = \Home\Model\UserModel::getUserInfoByIds($uid);


        /* 记录登录SESSION和COOKIES */
        $auth = array(
            'uid' => $user['id'],
            'username' => $user['username'],
            'mobile' => $user['mobile'],
            'logintime' => $user['logintime'],
            'loginip' => $user['loginip'],
            'loginplatform' => $user['loginplatform'],
        );
        //新用户首次登陆
        if($user['lastfirmid'] == 0){
            //在机构下添加的用户
            if($res = M('GroupUser')->where("userid = {$user['id']}")->find()){
                $user['lastfirmid'] = $res['firmid'];
            }
        }
        session('lastfirmid', $user['lastfirmid']);
        session('lastLoginTime', time());
        session(array('name' => 'session_id', 'expire' => 3600 * 24)); //初始化设置
        session('user_auth', $auth);
        session('user_auth_sign', data_auth_sign($auth));
        cookie('user_auth', $auth);
        cookie('user_auth_sign', data_auth_sign($auth));

        Auth::getAuthListS($user['id'], 1); //权限存入session
        // pushSocketMsg("publish",$user['username']."上线了！",""); //推送上线信息给所有人
        return ['status' => true, 'code' => self::LOGIN_ERROR_NONE, 'uid' => $user['id']];
    }

    public static function newUserAddDevice($user){
        if(empty($user)) return;
        self::autoadddevice($user,0);
        self::autoadddevice($user,1);
    }

    //登录时自动创建设备
    public static function autoadddevice($user, $devicetype = 0){
        if ($user) {
            if ($devicetype == 0) {
                $devicename = $user['username'].'的计算机';
                $deviceuuid = $user['mobile'].'_'.$devicetype;
                $deviceT = 2;
                $dtype = M("type")->where("name = '用户电脑'")->getfield('id');
            }

            if ($devicetype == 1) {
                $devicename = $user['username'].'的移动设备';
                $deviceuuid = $user['mobile'].'_'.$devicetype;
                $deviceT = 1;
                $dtype = M("type")->where("name = '用户手机'")->getfield('id');
            }
        
            $data = [
                'firmid' => 0,
                'userid' => $user['id'],
                'name' => $devicename,
                'intro' => '',
                'type' => $dtype,
                't' => $deviceT,
                'status' => 1,
                'state' => 0,
                'ip' => '',
                'configs' => ''
            ];
            $data['uuid'] = $deviceuuid;
            $flag = \Home\Model\DeviceModel::editDevice($data);
            $data2 = [
                'device_id' => $flag['id'],
                'device_serial' => $deviceuuid,
                'time' => time()
            ];
            $res = M('VideoList')->where("device_serial = '$deviceuuid'")->find();
            if (!$res) {
                M('VideoList')->add($data2);
            }
        }        
    }

    public static function mAutoLogin($uid)
    {
        /* 更新登录信息 */
        $data = array(
            'loginstatus' => 1,
            'logintime' => time(),
            'loginip' => get_client_ip(),
            'loginplatform' => self::PLATFORM_PC
        );

        $uid = \Home\Model\UserModel::editUser($data, $uid);
        $user = \Home\Model\UserModel::getUserInfoByIds($uid);

    }

    /**
     * @param $mobile
     * @return bool
     */
    public static function checkMobile($mobile)
    {
        if (!is_mobile($mobile)) {
            return false;
        }

        return true;
    }

    /**
     * @param $mobile
     * @return mixed
     */
    public static function mobileUinfo($mobile)
    {
        return M("User", "", "DB_CONFIG_LINK")->where(['mobile' => ['eq', $mobile]])->find();
    }

    /**
     * @param $username
     * @return bool
     */
    public static function checkUserName($username)
    {
        if (empty($username)) {
            return false;
        }

        return true;
    }

    /**
     * @param $passwd
     * @return bool
     */
    public static function checkPwd($passwd)
    {
        if (empty($passwd) || strlen($passwd) < 6 || strlen($passwd) > 14) {
            return false;
        }

        return true;
    }

    /**
     * 修改密码
     * @param $mobile
     * @param $password
     * @return bool
     */
    public static function findPwd($mobile, $password)
    {
        if (!self::checkMobile($mobile) || !self::checkPwd($password)) {
            return false;
        }

        $uinfo = self::mobileUinfo($mobile);
        if (empty($uinfo)) {
            return false;
        }

        //设置盐盖     其他数据
        $data['salt'] = substr(md5($password . C("SALT_KEY")), 5, 4);
        $data['password'] = think_ucenter_md5($password, $data['salt']);

        return \Home\Model\UserModel::editUser($data, $uinfo['id']);
    }

    /**
     * 找回密码
     * @param $mobile
     * @param $password
     * @return bool
     */
    public static function mFindPwd($mobile, $password)
    {
        if (!self::checkMobile($mobile) || !self::checkPwd($password)) {
            return ['status' => false, 'code' => self::WRONG_MOBILE_OR_PASS, 'msg' => self::$err_msg[self::WRONG_MOBILE_OR_PASS], 'result' => ['list' => []]];
        }

        $uinfo = self::mobileUinfo($mobile);
        if (empty($uinfo)) {
            return ['status' => false, 'code' => self::NOT_FOUND_USER, 'msg' => self::$err_msg[self::NOT_FOUND_USER], 'result' => ['list' => []]];
        }

        //设置盐盖     其他数据
        $data['salt'] = substr(md5($password . C("SALT_KEY")), 5, 4);
        $data['password'] = think_ucenter_md5($password, $data['salt']);

        return \Home\Model\UserModel::editUser($data, $uinfo['id']);
    }

    /**
     * 检查签名
     * @param $userid
     * @param $sign
     * @return bool
     */
    public static function checkApiSign($userid, $sign)
    {
        if (is_string($sign) && strlen($sign) == 32) {
            $ssid = md5($userid . C("SKEY"));
            session_id($ssid);
            if (!isset($_SESSION)) {
                session_start();
            }
            session_write_close();
            if (isset($_SESSION['UserId']) && $_SESSION['UserId'] == $userid && isset($_SESSION['Sign'])) {
                return $sign == $_SESSION['Sign'];
            }
            $correct_sign = self::getApiSign($userid);
            return $correct_sign === $sign;
        }

        return false;
    }

    /**
     * 清除缓存的Sign
     */
    public static function clearApiSign($userid)
    {
        $ssid = md5($userid . C("SKEY"));
        session_id($ssid);
        if (!isset($_SESSION)) {
            session_start();
        }

        unset($_SESSION['UserId']);
        unset($_SESSION['Sign']);
        unset($_SESSION);

        session_destroy();
    }

    /**
     * 设置登录签名
     * @param $userid
     * @return string
     */
    public static function getApiSign($userid)
    {
        $userid = intval($userid);
        if ($userid < 1) {
            return "";
        }

        //获取签名key
        $skey = C("SKEY");

        //生成一个唯一的sessionid
        $ssid = md5($userid . $skey);
        session_id($ssid);
        if (!isset($_SESSION)) {
            session_start();
        }

        $sign = "";
        if (isset($_SESSION['UserId']) && $_SESSION['UserId'] == $userid && isset($_SESSION['Sign'])) {
            $sign = $_SESSION['Sign'];
        }

        //从数据中取信息
        if (empty($sign) || strlen($sign) != 32) {
            $userinfo = \Home\Model\UserModel::getUserInfoByIds($userid);
            $sign = substr($userinfo['password'], 0, 16) . $skey;
            $sign = md5($sign);
            $_SESSION['UserId'] = $userid;
            $_SESSION['Sign'] = $sign;
        }

        session_write_close();
        return $sign;
    }

    /**
     * API登录设置uuid
     * @param $filed
     * @param $userid
     * @return bool|mixed
     */
    public static function editApiUuid($filed, $userid)
    {
        $userid = intval($userid);
        $filed = (array)$filed;
        if ($userid < 0 || !is_array($filed) || empty($filed)) {
            return false;
        }

        $uuidinfo = \Home\Model\MemberModel::getApiUuid($userid);
        if (empty($uuidinfo)) {
            $filed['createtime'] = time();
            $flag = M('Uuid', '', 'DB_CONFIG_LINK')->add($filed);
        } else {
            $flag = M('Uuid', '', 'DB_CONFIG_LINK')->where(["userid" => ['eq', $userid]])->save($filed);
        }

        return $flag;
    }

    /**
     * 获取 APIuuid
     * @param $userid
     * @return mixed
     */
    public static function getApiUuid($userid)
    {
        $userid = intval($userid);

        $ret = M('Uuid', '', 'DB_CONFIG_LINK')->where(['userid' => ['eq', $userid]])->find();
        return $ret;
    }
}