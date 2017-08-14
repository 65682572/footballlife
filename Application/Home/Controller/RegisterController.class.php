<?php

namespace Home\Controller;

use Think\ChuanglanSmsApi;
use Think\Verify;

class RegisterController extends BaseController
{
    /**
     * 首页
     */
    public function index()
    {
        $this->display('register');
    }
    /**
     * 验证码
     */
    public function verifyDisplay(){
        $v = new Verify(['length'=>4]);
        $v->entry();
    }

    /**
     * 验证验证码
     */
    public function verify_check($code,$id=""){
        $v = new Verify();
        return $v->check($code, $id);
    }

    /*
     * 注册
     */
    public function register()
    {
        $mobile = I("post.mobile");
        $username = I("post.username");
        $vcode = I("post.vcode");
        $password = I("post.password");
        $verify = I("post.verify");

        /*if (!\Home\Model\UserModel::checkMobileCode($mobile, $vcode, $key = \Home\Model\UserModel::MOBILE_REGISTER_VERIFY_CODE)){
            // todo $this->ajaxReturn(['status'=>false, 'msg'=>'短信验证码错误！']);
        }*/
//        if(!$this->verify_check($verify)){
//            $this->ajaxReturn(['status'=>false,'msg'=>'验证码错误']);
//        }
        $ret = \Home\Model\MemberModel::register($mobile, $password, $username);
        $ret['msg'] = \Home\Model\MemberModel::$err_msg[$ret['code']];
        $this->ajaxReturn($ret);
    }

    //发送短信验证码
    public function sendSms()
    {
        $mobile = I('post.mobile', '', 'trim');
        if (!\Home\Model\MemberModel::checkMobile($mobile)) {
            $this->ajaxReturn(['status' => false, 'msg' => '手机格式错误！']);
        }

        $res = M('MobileCode')->where("mobile = $mobile")->find();
        $code = rand(100000, 999999);
        if ($res) {
            $diffTime = time() - $res['time'];
            if ($diffTime < 60) {
                $this->ajaxReturn(['status' => false, 'msg' => '请勿频繁请求验证码！']);
            } else {
                ChuanglanSmsApi::sendSMS($mobile, "【MSU智慧平台】您好，您的验证码是" . $code);
                $param['code'] = $code;
                $param['time'] = time();
                M('MobileCode')->where("mobile = '$mobile'")->save($param);
                $ret = ['status' => true, 'code' => $code, 'msg' => "发送成功！"];
            }
        } else {
            ChuanglanSmsApi::sendSMS($mobile, "【MSU智慧平台】您好，您的验证码是" . $code);
            $param['mobile'] = $mobile;
            $param['code'] = $code;
            $param['time'] = time();
            M('MobileCode')->add($param);
            $ret = ['status' => true, 'code' => $code, 'msg' => "发送成功！"];
        }

        $this->ajaxReturn($ret);
    }

    public function sendMessage()
    {
        $mobile = I('mobile', '', 'trim');
        if (!\Home\Model\MemberModel::checkMobile($mobile)) {
            $this->ajaxReturn(['status' => false, 'msg' => '手机格式错误！']);
        }

        if (mobile_reg($mobile)) {
            $this->ajaxReturn(['status' => false, 'msg' => '您输入的手机号已注册！']);
        }
        $res = \Home\Model\MemberModel::isMobileReg($mobile);

        if ($res['status'] == true) {
            $code = rand(100000, 999999);
            $codeData = M('MobileCode')->where("mobile = '$mobile'")->find();
            if ($codeData) {
                $diffTime = time() - $codeData['time'];
                if ($diffTime < 60) {
                    $diffTime = 60 - $diffTime;
                    $this->ajaxReturn(['status' => false, 'msg' => '请勿频繁请求验证码！']);
                } else {
                    ChuanglanSmsApi::sendSMS($mobile, "【MSU智慧平台】您好，您的验证码是" . $code);
                    $param['code'] = $code;
                    $param['time'] = time();
                    M('MobileCode')->where("mobile = '$mobile'")->save($param);
                }
            } else {
                ChuanglanSmsApi::sendSMS($mobile, "【MSU智慧平台】您好，您的验证码是" . $code);
                $param['mobile'] = $mobile;
                $param['code'] = $code;
                $param['time'] = time();
                M('MobileCode')->add($param);
            }
        }
        $this->ajaxReturn($res);
    }

    //忘记密码
    public function lostPwd()
    {
        $this->display('lostPwd');
    }

    //忘记密码
    public function findPwd()
    {
        $mobile = I("post.tel");
        $vcode = I("post.code");

        if (empty($mobile) || empty($vcode)) {
            redirect("/register/lostPwd");
        }

        if (!is_mobile($mobile)) {
            redirect("/register/lostPwd");
        }

        $info = \Home\Model\MemberModel::mobileUinfo($mobile);
        if (empty($info)) {
            redirect("/register/lostPwd");
        }

        $this->assign('mobile', $mobile);
        $this->assign('vcode', $vcode);
        $this->display('findpwd');
    }

    //设置密码
    public function setPwd()
    {
        $mobile = I("post.mobile");
        $vcode = I("post.vcode");
        $password = I("post.password");
        $password_confirm = I("post.password_confirm");

        if (empty($password) || empty($password_confirm)) {
            $this->ajaxReturn(["status" => false, "msg" => "密码不能为空！"]);
        }

        if ($password != $password_confirm) {
            $this->ajaxReturn(["status" => false, "msg" => "密码不一致！"]);
        }

        if (empty($mobile) || empty($vcode)) {
            $this->ajaxReturn(["status" => false, "msg" => "账号不正确！"]);
        }

        $info = \Home\Model\MemberModel::mobileUinfo($mobile);
        if (empty($info)) {
            $this->ajaxReturn(["status" => false, "msg" => "账号不正确！"]);
        }

        $codeData = M('MobileCode')->where("mobile = '$mobile'")->find();
        if ($codeData['code'] != $vcode) {
            $this->ajaxReturn(["status" => false, "msg" => "验证码错误，等待2秒自动跳转！"]);
        } elseif ((time() - $codeData['time']) > 600) {
            $this->ajaxReturn(["status" => false, "msg" => "验证码过期，请重新发送验证码，等待2秒自动跳转！！"]);
        }

        $flag = \Home\Model\MemberModel::findPwd($mobile, $password);
        if (!$flag) {
            $this->ajaxReturn(["status" => false, "msg" => "修改失败！"]);
        }

        $this->ajaxReturn(["status" => true, "msg" => "修改成功，请重新登录！"]);
    }
}