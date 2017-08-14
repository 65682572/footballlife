<?php
namespace Home\Controller;

use Think\Auth;

class MainController extends AdminController
{
    /**
     * 后台首页
     */
    public function index()
    {
        // $this->display();
        if(is_login()){
            redirect('/Matrix/monitor');
        }else{
            $this->assign("mobile",cookie("mobile"));
            $this->assign("password",cookie("password"));
            $this->display('login');
        }
    }

    public function changeFirm()
    {
        $firmid = I("post.firmid");
        if ($firmid < 1) {
            $this->ajaxReturn(['status' => false, 'msg' => '参数错误！']);
        }

        $firms = \Home\Model\FirmModel::getFirmFromGroup($this->uid);
        $firmids = hd_array_column($firms, 'id');
        if (!in_array($firmid, $firmids)) {
            $this->ajaxReturn(['status' => false, 'msg' => '参数错误！']);
        }

        $flag = \Home\Model\UserModel::editUser(['lastfirmid' => $firmid], $this->uid);
        if(is_int($flag)){
            session('lastfirmid', $firmid);
            Auth::getAuthListS($flag, 1); //权限存入session
        }
        if ($flag) {
            $this->ajaxReturn(['status' => true, 'msg' => '成功！']);
        }
        $this->ajaxReturn(['status' => false, 'msg' => '参数错误！']);
    }

    /**
     *机构管理
     */
    public function firm()
    {
        $this->display();
    }

    /**
     * 添加机构
     */
    public function createfirm()
    {
        $action = I("action");
        $name = I("name");
        $intro = I("intro");
        $id = I("id");

        if (empty($action) || !in_array($action,
                ['createOrgAction', 'addOrgAction', 'modifyOrgAction', 'delOrgAction'])
        ) {
            $this->ajaxReturn(['status' => false, 'msg' => '参数错误！']);
        }

        $flag = ['status' => 'false', 'msg' => '未知错误！'];
        switch ($action) {
            case 'createOrgAction':
                $ret = \Home\Model\FirmModel::ckfirmname($name);
                if (is_array($ret) && !empty($ret)) {
                    $this->ajaxReturn(["status" => false, "msg" => '该名称已经存在，请选择另外一个响亮的名称吧！']);
                }
                $flag = \Home\Model\FirmModel::setUserFirm([
                    'userid' => $this->uid,
                    'name' => $name,
                    'intro' => $intro,
                    'parentid' => 0,
                    'status' => 1
                ]);
                break;
            case 'addOrgAction':
                $ret = \Home\Model\FirmModel::ckfirmname($name);
                if (is_array($ret) && !empty($ret) && $ret['id'] != $id) {
                    $this->ajaxReturn(["status" => false, "msg" => '该名称已经存在，请选择另外一个响亮的名称吧！']);
                }
                $flag = \Home\Model\FirmModel::setUserFirm([
                    'userid' => $this->uid,
                    'name' => $name,
                    'intro' => $intro,
                    'parentid' => $id,
                    'status' => 1
                ]);
                break;
            case 'modifyOrgAction':
                $flag = \Home\Model\FirmModel::setUserFirm(['name' => $name, 'intro' => $intro], $id);
                break;
            case 'delOrgAction':
                //如果机构有子机构则不允许删除
                if (\Home\Model\FirmModel::chFirmSon($id)) {
                    $this->ajaxReturn(["status" => false, "msg" => '机构下有子机构，不允许删除！']);
                }
                $flag = \Home\Model\FirmModel::setUserFirm(['status' => 0], $id);
                break;
        }

        if ($flag['status'] && in_array($action, ['addOrgAction', 'createOrgAction'])) {
            $firmid = $flag['firmid'];
            $res = \Home\Model\UserModel::editUser(['lastfirmid' => $firmid], $this->uid);
            if(is_int($res)){
                session('lastfirmid', $firmid);
                Auth::getAuthListS($res, 1); //权限存入session
            }
            //创建分组
            $ret = \Home\Model\FirmModel::initFirmGroup([
                'firmid' => $flag['firmid'],
                'parentid' => 0,
                'name' => '超级管理员',
                'status' => 1,
                'issuper' => 1,
                'times' => 0
            ]);
            //将用户加入到对应用户分组中默认0
            \Home\Model\FirmModel::initGroupUser([
                'firmid' => $flag['firmid'],
                'userid' => $this->userinfo['id'],
                'groupid' => $ret['id'],
                'times' => 0
            ]);
        }

        if ($flag['status'] && $action == 'delOrgAction') {
            //删除该机构下的用户分组，以及用户信息
            \Home\Model\FirmModel::delFirmGroupByFirmid($id);
            \Home\Model\FirmModel::delFirmGroupUserByFirmid($id);
        }
        $this->ajaxReturn($flag);
    }

    /**
     * 部门管理
     */
    public function group()
    {
        $firmid = (int)I('id');
        $firmid < 1 && $firmid = $this->firmid;
        $firmlist = \Home\Model\FirmModel::getFirmFromGroup($this->uid);
        foreach ($firmlist as & $vu) {
            $vu['isck'] = $vu['id'] == $firmid ? 1 : 0;
        }

        //部门列表
        $list = \Home\Model\FirmModel::firmGroup($firmid);

        //当前机构下的部门用户
        $groups = [];

        //机构下的所有用户
        $users = \Home\Model\FirmModel::firmUsers($firmid);
        $uids = hd_array_column($users, 'userid');
        $uinfos = \Home\Model\UserModel::getUserInfoByIds($uids);
        foreach ($users as $v) {
            $groups[$v['groupid']][] = $uinfos[$v['userid']]['username'];
        }

        //组合数据
        foreach ($list as & $v) {
            $v['users'] = implode(',', $groups[$v['id']]);
        }

        $this->assign("list", $list);
        $this->assign("groups", $groups);
        $this->assign("firmlist", $firmlist);
        $this->display();
    }

    /**
     * 获取
     */
    public function groupUser()
    {
        $firmid = I("firmid");
        $groupid = I("groupid");

        $firmid = intval($firmid);
        $groupid = intval($groupid);

        $firmid < 1 && $firmid = $this->firmid;

        if ($firmid < 1 || $groupid < 1) {
            $this->ajaxReturn(['status' => false, 'msg' => []]);
        }

        //机构下的所有用户列表
        $list = $groupuids = $uids = [];
        $ret = \Home\Model\FirmModel::firmUsers($firmid);
        if (empty($ret)) {
            $this->ajaxReturn(['status' => false, 'msg' => []]);
        }

        foreach ($ret as $v) {
            $uids[] = $v['userid'];
            if ($v['groupid'] == $groupid) {
                array_push($groupuids, $v['userid']);
            }
        }

        $uids = array_unique($uids);
        $uinfos = \Home\Model\UserModel::getUserInfoByIds($uids);
        foreach ($uinfos as $v) {
            array_push($list, [
                'id' => $v['id'],
                'username' => $uinfos[$v['id']]['username'],
                'mobile' => $uinfos[$v['id']]['mobile'],
                'isck' => in_array($v['id'], $groupuids) ? 'checked' : ''
            ]);
        }

        $this->ajaxReturn(['status' => true, 'msg' => $list]);
    }

    /**
     * 编辑用户组的用户
     */
    public function editGroupUser()
    {
        $firmid = I("firmid");
        $groupid = I("groupid");
        $uids = I("uids");

        $firmid = intval($firmid);
        $groupid = intval($groupid);

        if ($firmid < 1) {
            $this->ajaxReturn(['status' => false, 'msg' => "参数错误！"]);
        }

        $ret = \Home\Model\FirmModel::firmUsers($firmid, $groupid, 0, 'all');

        //逻辑处理
        $existid = [];
        foreach ($ret as $v) {
            if ($v['status'] > 0 && !in_array($v['userid'], $uids)) {
                \Home\Model\FirmModel::initGroupUser(['status' => 0], $v['id']);
            }
            if ($v['status'] == 0 && in_array($v['userid'], $uids)) {
                \Home\Model\FirmModel::initGroupUser(['status' => 1], $v['id']);
            }
            array_push($existid, $v['userid']);
        }

        //新增
        $no_existid = array_diff($uids, $existid);
        foreach ($no_existid as $id) {
            \Home\Model\FirmModel::initGroupUser([
                'userid' => $id,
                'groupid' => $groupid,
                'firmid' => $firmid,
                'status' => 1,
                'times' => 0
            ]);
        }

        $this->ajaxReturn(['status' => true, 'msg' => "更改成功！"]);
    }

    /**
     * 创建部门
     */
    public function creategroup()
    {
        $firmid = session('lastfirmid');
        if ($firmid==0) {
            $flag  = ['status'=>false, 'msg'=>'您没有所属机构，无法添加分类！'];
            $this->ajaxReturn($flag);
        }
        $name = I("name");
        $groupid = I("groupid");
        $intro = I("intro");
        $action = I("action");

        $flag = ['status' => false, 'msg' => '操作失败！'];

        //添加
        if ($action == 'modifyOrgAction') {
            $flag = \Home\Model\FirmModel::initFirmGroup([
                'name' => $name,
                'intro' => $intro,
                'firmid' => $this->firmid,
                'parentid' => 0,
                'status' => 1
            ]);
            if ($flag['status'] == true) {
                $fg = \Home\Model\FirmModel::initGroupUser([
                    'userid' => $this->uid,
                    'groupid' => $flag['id'],
                    'firmid' => $this->firmid,
                    'status' => 1,
                    'times' => 0
                ]);
                if ($fg['status'] == false) {
                    //todo 日志
                }
            }
        }

        //编辑
        if ($action == 'modifyEditAction') {
            if ($groupid > 0) {
                $flag = \Home\Model\FirmModel::initFirmGroup(['name' => $name, 'intro' => $intro], $groupid);
            }
        }

        //删除
        if ($action == 'modifyDelAction') {
            if ($groupid == 0) {
                $this->ajaxReturn(['status' => true, 'msg' => '不能删除默认分组']);
            }

            //默认超级管理组不允许删除
            $groupinfo = \Home\Model\FirmModel::firmGroup($this->firmid, $groupid);
            if (empty($groupinfo)) {
                $this->ajaxReturn($flag);
            }

            if ($groupinfo['issuper'] == \Home\Model\FirmModel::SUPERNUM) {
                $this->ajaxReturn(['status' => false, 'msg' => '不能删除管理员组！']);
            }

            $flag = \Home\Model\FirmModel::initFirmGroup(['status' => 0], $groupid);
            if ($flag['status'] == true) {
                //删除组下的用户
                $fg = \Home\Model\FirmModel::delFirmGroupUserByFirmid($this->firmid, $groupid);
                if ($fg['status'] == false) {
                    //todo 日志
                }
                $this->ajaxReturn(['status' => true, 'msg' => '删除成功！']);
            }
        }
        $this->ajaxReturn($flag);
    }

    /**
     *邀请
     */
    public function invite()
    {        
        $this->display();
    }

    /**
     * 单个邀请
     */
    public function singleInvite()
    {
        $tel = I("tel");
        $tel = str_replace('，', ',', $tel);
        $tel = explode(',', $tel);

        $mobile = [];
        foreach ($tel as $v) {
            if (is_mobile($v)) {
                array_push($mobile, $v);
            }
        }

        if (empty($mobile)) {
            $this->ajaxReturn(['status' => false, 'msg' => '没有符合规范的手机号!']);
        }

        $mobile = array_unique($mobile);
        if (in_array($this->userInfo['mobile'], $mobile)) {
            $this->ajaxReturn(['status' => false, 'msg' => '不能邀请自己！']);
        }
        foreach ($mobile as $v) {
            $data = [
                'userid' => $this->uid,
                'firmid' => $this->firmid,
                'mobile' => $v,
                'groupid' => 0,
                'status' => 0,
                'createtime' => time()
            ];
            $flag = \Home\Model\FirmModel::editInviing($data);
            if ($flag['status'] == false) {
                $this->ajaxReturn(['status' => false, 'msg' => $v . ',' . $flag['msg']]);
            }else{
                $userinfo = \Home\Model\MemberModel::mobileUinfo($data['mobile']);
                pushSocketMsg("publish",$this->userInfo['username']."邀请您加入机构！",$userinfo['id']);
            }
        }

        $this->ajaxReturn(['status' => true, 'msg' => '发起邀请成功!']);
    }

    /**
     *用户管理
     */
    public function user()
    {
        $groupid = I("group");
        $groupid = intval($groupid);

        $list = \Home\Model\FirmModel::firmUsers($this->firmid, $groupid);
        $uids = hd_array_column($list, 'userid');

        //用户姓名
        $userinfo = \Home\Model\UserModel::getUserInfoByIds($uids);

        //部门名称
        $grouplist = \Home\Model\FirmModel::firmGroup($this->firmid);

        //整合数据
        foreach ($list as & $v) {
            $v['username'] = $userinfo[$v['userid']]['username'];
            $v['groupname'] = $grouplist[$v['groupid']]['name'];
        }

        $this->assign("grouplist", $grouplist);
        $this->assign("list", $list);
        $this->display();
    }

    /**
     * 编辑用户
     */
    public function edituser()
    {
        $id = I("id");
        $groupid = (int)I("groupid");
        $intro = I("intro");

        if ($id < 1) {
            $this->ajaxReturn(['status' => false, 'msg' => '参数不正确！']);
        }

        $flag = \Home\Model\FirmModel::initGroupUser(['groupid' => $groupid, 'intro' => $intro], $id);
        $this->ajaxReturn($flag);
    }

    /**
     * 删除用户
     */
    public function deluser()
    {
        $id = I("id");
        if ($id < 1) {
            $this->ajaxReturn(['status' => false, 'msg' => '参数不正确！']);
        }

        $list = \Home\Model\FirmModel::firmUsers($this->firmid);
        $ids = hd_array_column($list, 'id');
        if (!in_array($id, $ids)) {
            $this->ajaxReturn(['status' => false, 'msg' => '您没有权限！']);
        }

        $flag = \Home\Model\FirmModel::initGroupUser(['status' => 0], $id);
        $this->ajaxReturn($flag);
    }

    /**
     * 权限分类
     */
    public function authSort()
    {
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        $data = M('AuthLog')->select();
        $class = M('AuthRule')->field('title')->where('parentid = 0')->select();
        $this->assign('data', $data);
        $this->assign('class', $class);
        $this->display();
    }

    /**
     * 编辑权限分类
     */
    public function authEdit()
    {
        if(!IS_ROOT){
            $this->error('未授权访问');
        }
        $classify = I('post.classify');
        $router = I('post.router');
        $title = I('post.title');
        $id = M('AuthRule')->field('id')->where("title = '$classify'")->find();

        $arr = array(
            'type' => 1,
            'name' => $router,
            'title' => $title,
            'status' => 1,
            'parentid' => $id['id'],
        );
        $res = \Home\Model\AuthRuleModel::addRule($arr);

        M('AuthLog')->where("content = '$router'")->delete();

        $this->ajaxReturn($res);
    }

    /**
     * 新增权限分类
     */
    public function authAdd()
    {
        if(!IS_ROOT){
            $this->error('未授权访问');
        }
        $router = I('post.router');
        $title = I('post.title');

        $arr = array(
            'type' => 1,
            'name' => $router,
            'title' => $title,
            'status' => 1,
            'parentid' => 0
        );
        $res = \Home\Model\AuthRuleModel::addRule($arr);

        M('AuthLog')->where("content = '$router'")->delete();

        $this->ajaxReturn($res);
    }
}