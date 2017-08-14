<?php

namespace Home\Controller;

use Think\Controller;

class LoginController extends Controller
{
    /**
     * 首页
     */
    public function index()
    {
        if (is_login()) {
            redirect('/main');
        } else {
            $this->assign("mobile", cookie("mobile"));
            $this->assign("password", cookie("password"));
            $this->display('login');
        }
    }

    /**
     * 用户登录
     */
    public function login()
    {

        $mobile = I("post.mobile");
        $password = I("post.password");
        $ret = \Home\Model\MemberModel::login($mobile, $password);
        if ($ret['code'] == -99) {
            $this->ajaxReturn($ret);
        }
        $ret['msg'] = \Home\Model\MemberModel::$err_msg[$ret['code']];
        if (I('post.ck') == true) {
            session('loginExpireTime', 864000);
            cookie("mobile", $mobile, 3600);
            cookie("password", $password, 3600);
        }
        $this->ajaxReturn($ret);
    }

    /**
     * 退出登录
     */
    public function logout()
    {
        \Home\Model\MemberModel::logout();
        $value = cookie('user_auth');
        if (empty($value)) {
            redirect('/login');
        }
    }
}