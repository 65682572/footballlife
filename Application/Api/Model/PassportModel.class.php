<?php
namespace Api\Model;
use Think\Model;

class PassportModel extends Model{

    /**
     * @since 2016.12.16
     * @auther 辛杰
     *
     * @api 登录
     * @methods Passport.login
     *
     * @param 需要POST过来的参数列表：
     * <pre>
     *
     * name : 用户ID
     * pwd : 密码 type == 2时传递短信验证码(短信验证码不需要rsa加密)
     * type : 类型 1 密码登录  默认2短信验证码
     *
     * </pre>
     *
     *
     * @return array 返回的JSON数据格式
     *
     * <pre>
     *
     * 请求成功时：
     * array(
     *  'status' => 200,
     *  'result' => array(
     *      'userid' => 'id',
     *      'username' => '昵称',
     *      'avatar' => '头像',
     *      'sign' => '登录签名'
     * ));
     * </pre>
     *
     */
    public static function login()
    {
        $mobile = I("name");
        $password = I("pwd");
        $uuid = I("uuid");
        $token = I("token");
        $appid = I("appid");
        $type = I("type");
        $vcode = I("vcode");

        empty($type) && $type = 1;
        //多次登录出现验证码
        $req_freq_obj = new \Home\Model\RequestFrequency($uuid, 5, 60); // 5次/1分钟
        if ($req_freq_obj->limited()){
            if (!$vcode){
                return ['status' => 203, 'msg' => ["errormsg" => "请输入验证码！"]];
            }else{
                $key = self::_gen_captcha_key();
                $img = new \Home\Model\Captcha($key);
                $chk = $img->check_code($vcode);
                if (!$chk){
                    return ['status' => 203, 'msg' => ["errormsg" => "验证码错误！"]];
                }
            }
        }

        if ($type == 1){//密码登录
            $ret = \Home\Model\MemberModel::login($mobile, $password);
        }else if($type == 2){
            //短信验证码登录
            if ($password == 8888){
                $ret['status'] = true;
                $mobileUinfo = \Home\Model\MemberModel::mobileUinfo($mobile);
                $ret['uid'] = $mobileUinfo['id'];
            }
        }

        if ($ret['status'] == true){
            $userid = (int) $ret['uid'];
            $userinfo = \Home\Model\UserModel::getUserInfoByIds($userid);
            $avatar = \Home\Model\UserModel::getAvatar($userid);
            $data = [
                'userid'=> $userid,
                'username'=> $userinfo['username'],
                'avatar'=> "http://".$_SERVER["SERVER_NAME"] . $avatar,
                'sign'=> \Home\Model\MemberModel::getApiSign($userid),
            ];

            //记录uuid对应userid
            $cond = [
                'userid' => $userid,
                'uuid' => $uuid,
                'token' => $token,
                'appid' => $appid
            ];
            \Home\Model\MemberModel::editApiUuid($cond, $userid);

            return ['status' => 200, 'msg' => $data];
        }

        if ($ret['code'] == \Home\Model\MemberModel::LOGIN_ERROR_MOBILE_PWD){
            $req_freq_obj->record(); //密码错误访问计数加1
        }

        return ['status' => 201, 'msg' => ["errormsg" => \Home\Model\MemberModel::$err_msg[$ret['code']]]];
    }

    /**
     * @since 2016.12.16
     * @auther 辛杰
     *
     * @api退出登录
     *
     * @methods Passport.logout
     *
     * <pre>
     * </pre>
     *
     * @return array 返回的JSON数据格式
     *
     * <pre>
     *
     * 上传成功时：
     * array(
     *  'status' => 200,
     *  'result' => array(
     *      'errormsg' => '退出登录成功!'
     * ));
     *
     * </pre>
     *
     */
    public static function logout()
    {
        \Home\Model\MemberModel::logout();
        return ['status' => 200, 'msg' =>['errormsg' => '退出登录成功！']];
    }

    /**
     * @since 2016.12.19
     * @auther 辛杰
     *
     * @api 发送短信验证码
     * @methods Passport.sendMobileCode
     *
     * @param 发送验证码 注意传递 type参数 1登录 2注册 3找回密码 可以不传，默认1
     *
     * <pre>
     * 需要POST过来的参数列表：
     * name : 手机号
     * type : 1登录 2注册 3找回密码 默认1
     * </pre>
     *
     *
     * @return array 返回的JSON数据格式
     *
     * <pre>
     *
     * 上传成功时：
     * array(
     *  'status' => 200,
     *  'result' => array(
     *      'code' => 8888
     *      'type' => 1 1登录 2注册 3找回密码
     * ));
     *
     * </pre>
     */
    public static function sendMobileCode()
    {
        $mobile = I("name");
        $type = I("type");

        empty($type) && $type = 1;
        $req_freq_obj = new \Home\Model\RequestFrequency("send$type".'_'.$mobile, 1, 60); // 1次/1分钟
        if($req_freq_obj->limited()){
            return ['status' => 201, 'msg' => ["errormsg" => "您操作太频繁了！"]];
        }

        $data = [
            'code' => 8888,
            'type' => $type
        ];

        $req_freq_obj->record();
        return ['status' => 200, 'msg' => $data];
    }

    /**
     * @since 2016.12.16
     * @auther 辛杰
     *
     * @api 获取验证码
     * @methods Passport.getCaptcha
     *
     * <pre>
     * </pre>
     *
     * @return string
     *
     * <pre>
     * 验证码图片
     * </pre>
     *
     */
    public static function getCaptcha()
    {
        $key = self::_gen_captcha_key();
        $img = new \Home\Model\Captcha($key);
        $img->output_image();
    }

    /**
     * @ignore
     * 生成验证码的key
     * @return bool|string
     */
    private static function _gen_captcha_key()
    {
        $uuid = I('uuid');
        if (empty($uuid)){
            return false;
        }

        $sid = md5(implode('_', ['LinkLogin', $uuid]));
        return $sid;
    }
}
