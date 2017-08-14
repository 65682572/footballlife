<?php
namespace Home\Controller;
use Think\Controller;
class PrepareController extends Controller {
    private $userinfo;
    private $invite;
    private $uid;

    public function _initialize()
    {
        $this->uid = is_login();
        if ($this->uid < 1){
            redirect('/login');
        }

        $this->userinfo = \Home\Model\UserModel::getUserInfoByIds($this->uid);
        $this->invite = \Home\Model\FirmModel::inviting($this->userinfo['mobile']);
    }

    public function index()
    {
        if (!empty($this->invite)){
            $invitelist = $this->invite;
            $uids = hd_array_column($invitelist,'userid');
            $uinfos = \Home\Model\UserModel::getUserInfoByIds($uids);
            $firminfos = \Home\Model\FirmModel::getFirm();
            foreach ($invitelist as & $v){
                $v['firmname'] = $firminfos[$v['firmid']]['name'];
                $v['username'] = $uinfos[$v['userid']]['username'];
            }

            $this->assign('userinfo',$this->userinfo);
            $this->assign('invitelist',$invitelist);
            $this->display('invite');
        }else{
            if (\Home\Model\FirmModel::getFirmFromGroup($this->uid)){
                redirect('/main');
            }

            $this->display();
        }
    }

    public function invite()
    {
        $status = I("status");
        $firmid = I("id");
        if ($firmid < 1 || !in_array($status, array_keys(\Home\Model\FirmModel::$_invite_status))){
            $this->ajaxReturn(['status'=>false, 'msg'=>'参数错误！']);
        }

        $flag = \Home\Model\FirmModel::editInviing(['status'=> $status], $firmid);
        if ($flag){
            //将用户加入到对应用户分组中默认0
            \Home\Model\FirmModel::initGroupUser(['firmid'=>$firmid, 'userid'=>$this->uid,'groupid'=>0,'time'=>0]);
            //修改最后一次登录的firmid
            \Home\Model\UserModel::editUser(['lastfirmid'=>$firmid], $this->uid);
            $this->ajaxReturn(['status'=>true, 'msg'=>'成功！']);
        }

        $this->ajaxReturn(['status'=>false, 'msg'=>'操作失败！']);
    }

    public function createFirm()
    {
        $name = trim(I("name"));
        $intro = trim(I("intro"));

        if (empty($name)){
            $this->ajaxReturn(["status"=>false, "msg"=>'名称不能为空！']);
        }

        if (empty($intro)){
            $this->ajaxReturn(["status"=>false, "msg"=>'描述不能为空！']);
        }

        $ret = \Home\Model\FirmModel::ckfirmname($name);
        if (is_array($ret) && !empty($ret)){
            $this->ajaxReturn(["status"=>false, "msg"=>'该名称已经存在，请选择另外一个响亮的名称吧！']);
        }

        $data = [
            'parentid' => 0,
            'userid' => $this->uid,
            'name' => $name,
            'intro' => $intro,
            'status' => 1
        ];
        $ret = \Home\Model\FirmModel::setUserFirm($data);
        if (!$ret['status']){
            $this->ajaxReturn(["status"=>false, "msg"=>$ret['msg']]);
        }

        $firmid = $ret['firmid'];
        //创建分组
        $ret = \Home\Model\FirmModel::initFirmGroup(['firmid'=>$firmid,'parentid'=>0,'name'=>'超级管理员','status'=>1,'issuper'=>1]);
        //将用户加入到对应用户分组中默认0
        \Home\Model\FirmModel::initGroupUser(['firmid'=>$firmid, 'userid'=>$this->uid, 'groupid'=>$ret['id'],'time'=>0]);
        //修改最后一次登录的firmid
        \Home\Model\UserModel::editUser(['lastfirmid'=>$firmid], $this->uid);
        $this->ajaxReturn(["status"=>true, "msg"=>'添加成功！']);
    }
}