<?php
namespace Home\Controller;
use Think\ChuanglanSmsApi;
class UserController extends AdminController {
    /**
     * 个人中心
     */
    public function index()
    {
        redirect('/user/personal');
    }

    public function basicSettings ()
    {
        $list = \Home\Model\FirmModel::inviteMessage($this->userInfo['mobile']);
        $list3 = \Home\Model\FirmModel::applicationMessage();
        $firm_name = M("firm")->where(['id'=>session('lastfirmid')])->find();
        $firm_name = $firm_name == null ? "未选择机构" : $firm_name['name'];
        $type = M("GroupUser")->where(['firmid'=>session('lastfirmid'),'userid'=>$this->userInfo['id']])->find();
        $firmid = session('lastfirmid');
        $userid = $this->userInfo['id'];
        $sql = <<<SQL
SELECT DISTINCT b.`name`
FROM  `link_firm_group` b LEFT JOIN `link_group_user` a ON a.groupid = b.id
WHERE(a.`firmid` = $firmid AND a.`userid` = $userid ) 
SQL;

        $type = M()->query($sql);
        $groupName = '';
       foreach ($type as $k=>$v){
           $groupName .= $v['name'] . '&nbsp&nbsp&nbsp';
       }
        $type = $type == null ? "未选择部门" : $type['name'];
        $this->assign("list2", $list);
        $this->assign("list3", $list3);
        $this->assign("count", count($list));
        $this->assign("firm_name", $firm_name);
        $this->assign("type", $groupName);
        $this->assign('userFace',$this->userInfo['avatar']);
        $this->display();
    }
    /**
     * 我的消息(已废弃)
     */
    public function maillist()
    {
        $list = \Home\Model\FirmModel::inviteMessage($this->userInfo['mobile']);
        $this->assign("list", $list);
        $this->assign("count", count($list));
        $this->display();
    }

    /**
     * 我的消息(暂未完成)
     */
    public function mailbox()
    {
        $id = I("id");
        $list = \Home\Model\FirmModel::inviteMessage($this->userInfo['mobile']);
        $list = hd_array_column($list,[],'id');
        $this->assign("info", $list[$id]);
        $this->assign("count", count($list));
        $this->assign('userFace',$this->userFace);
        $this->display();
    }
    /**
     * 我的消息new(未使用)
     */
    public function mailboxNew()
    {
        $id = I("id");
        $list = \Home\Model\FirmModel::inviteMessage($this->userInfo['mobile']);
        $list = hd_array_column($list,[],'id');
        $this->assign('userFace',$this->userFace);
        $this->assign("info", $list[$id]);
        $this->assign("count", count($list));
        $this->display();
    }

    //接受邀请加入机构
    public function accpetinvite()
    {
        $id = I("id",'','intval');
        $list =  \Home\Model\FirmModel::inviting($this->userInfo['mobile']);
        $list = hd_array_column($list, [], 'id');
        $info = $list[$id];
        if (empty($info) || !is_array($info)){
            $this->ajaxReturn(['status'=>false, 'msg'=>'参数错误！']);
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
        }
        $this->ajaxReturn($ret);
    }

    /**
     * 审核申请
     */
    public function accpetApply()
    {
        $id = I("id",'','intval');
        $info =  \Home\Model\FirmModel::getAppById($id);
        if (empty($info) || !is_array($info)){
            $this->ajaxReturn(['status'=>false, 'msg'=>'参数错误！']);
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
        $this->ajaxReturn($ret);
    }

    /**
     * 个人中心(已废弃)
     */
    public function personal()
    {
        $this->display();
    }

    /**
     *ajax修改信息(暂未使用，待前端启用)
     */
    public function editpersonal()
    {
        $username = I("username");
        $email = I("email");
        $intro = I("intro");

        $file = I("file");
        if (!empty($file)){
            $tmp = explode(',', $file);
            $tmp_ext = explode('/',$tmp[0]);
            $tmp_ext = explode(';',$tmp_ext[1]);
            $files['file'] = base64_decode($tmp[1]);
            $files['ext'] = $tmp_ext[0];
            $fileDriver   = "local";
            $file_obj = new \Home\Model\AvatarModel('Avatar', '', 'DB_CONFIG_LINK');
            $info = $file_obj->uploadStream($files, \Home\Model\AvatarModel::$_config_['AVATAR_UPLOAD'], $fileDriver, C("UPLOAD_{$fileDriver}_CONFIG"), $this->uid);
            if($info['status'] == true){
                $res = $info['msg']['file'];
                $names = $res['avatar_name'];
                $names = explode('|', $names);
                $avatar = $res['filepath'] . $names[0];
            }
        }

        $flag = \Home\Model\UserModel::editUser(['username'=>$username,'email'=>$email,'intro'=>$intro], $this->uid);
        if (!$flag){
            $this->ajaxReturn(['status'=>false,'msg'=>'修改失败！','avatar'=>$avatar]);
        }
        $this->ajaxReturn(['status'=>true,'msg'=>'修改成功！']);
    }

    /**
     *上传头像
     */
    public function avatar()
    {
        $post = I('img');
        $avatar = new \Home\Model\AvatarModel('Avatar', '', 'DB_CONFIG_LINK');
        $res = $avatar->base64Avatar($post,$this->uid);
        $this->ajaxReturn($res);
        
        // $fileDriver = "local";
        // $file_obj = new \Home\Model\AvatarModel('Avatar', '', 'DB_CONFIG_LINK');
        // $info = $file_obj->upload($fileArr, \Home\Model\AvatarModel::$_config_['AVATAR_UPLOAD'], $fileDriver, C("UPLOAD_{$fileDriver}_CONFIG"), $this->uid);
        // if($info['status'] == true){
        //     $res = $info['msg']['file'];
        //     $names = $res['avatar_name'];
        //     $names = explode('|', $names);
        //     $avatar = $res['filepath'] . $names[0];
        //     echo $avatar;
        // }

        // $this->ajaxReturn($info);
    }

    /**
     * 修改密码
     */
    public function modifypassword()
    {
        $this->display();
    }

    //找回密码并修改密码
    public function findPwd()
    {
        $mobile = I("post.tel");
        $vcode = I("post.code");
        if (empty($mobile) || empty($vcode)){
            redirect("/user/modifypassword");
        }

        if ($mobile != $this->userInfo['mobile']){
            redirect("/user/modifypassword");
        }

        /*if (!\Home\Model\UserModel::checkMobileCode($mobile, $vcode, $key = \Home\Model\UserModel::MOBILE_FINDPWD_VERIFY_CODE)){
            //todo redirect("/user/modifypassword");
        }*/

        $this->display('findpwd');
    }

    /**
     * 账号解绑
     */
    public function unbind()
    {
        $this->display();
    }

    public function dounbind()
    {
        $mobile = I("post.mobile");
        $vcode = I("post.code");

        if (empty($mobile) || empty($vcode)){
            $this->ajaxReturn(["status"=>false, "msg"=>"手机和验证码不能为空！"]);
        }

        if ($mobile == $this->userInfo['mobile']){
            $this->ajaxReturn(["status"=>false, "msg"=>"该手机是您目前的账号！"]);
        }

        $minfo = \Home\Model\MemberModel::mobileUinfo($mobile);
        if (is_array($minfo) && !empty($minfo)){
            $this->ajaxReturn(["status"=>false, "msg"=>"该手机已经被使用！"]);
        }

        $ret = \Home\Model\UserModel::editUser(['mobile'=>$mobile],$this->uid);
        if(!$ret){
            $this->ajaxReturn(["status"=>false, "msg"=>"修改失败！"]);
        }

        $this->ajaxReturn(["status"=>true, "msg"=>"修改成功！"]);
    }

    /**
     * 通信录
     */
    public function contact()
    {
        $this->display();
    }

    //设置密码
    public function setPwd()
    {
        $password = I("post.password");
        $password_confirm = I("post.password_confirm");

        if (empty($password) || empty($password_confirm)){
            $this->ajaxReturn(["status"=>false, "msg"=>"密码不能为空！"]);
        }

        if ($password != $password_confirm){
            $this->ajaxReturn(["status"=>false, "msg"=>"密码不一致！"]);
        }

        $flag = \Home\Model\MemberModel::findPwd($this->userInfo['mobile'], $password);

        if (!$flag){
            $this->ajaxReturn(["status"=>false, "msg"=>"修改失败！"]);
        }

        $this->ajaxReturn(["status"=>true, "msg"=>"修改成功，请重新登录！"]);
    }

    //发送短信验证码
    public function sendSms()
    {
        $mobile = I("post.tel");
        $code = rand(100000, 999999);
        if (!\Home\Model\MemberModel::checkMobile($mobile)){
            $this->ajaxReturn(['status'=>false, 'msg'=>'手机格式错误！']);
        }
        ChuanglanSmsApi::sendSMS($mobile, '【MSU智慧平台】您好，您的验证码是'. $code);
        $ret = ['status' => true,'code' => $code , 'msg' => "发送成功！"];
        $this->ajaxReturn($ret);
    }

}