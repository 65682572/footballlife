<?php

namespace Home\Controller;
use Think\Auth;

class OrganizationController extends AdminController
{
    //机构列表
    public function organizationMsg(){
        $firmlist = array_values(\Home\Model\FirmModel::formatFirm($this->uid));
        $this->assign('formatfirm',$firmlist);
        $this->display();
    }

    //暂时未使用的函数
    public function verify() {
        if (IS_ROOT) {
            $data = M('Firm')->alias('a')->field('a.*,b.username')->join('__USER__ as b ON a.userid = b.id', 'LEFT')->where('verify = 0')->select();

            $this->assign('data', $data);
            $this->display();
        } else {
            $this->error('未授权的访问');
        }
    }

    /**
     * 部门管理
     */
    public function  branchMsg(){
        $firmid = (int)I('id');
        $firmid < 1 && $firmid = $this->firmid;
        $this->assign('firmid',$firmid);
        $group = M('firm_group')->where(['firmid'=>session('lastfirmid'),'status'=>1])->select();
        //获取机构下用户
        $firm_user = get_firm_user(session('lastfirmid'));
        $list  = get_group(session('lastfirmid'));
        $group = M("firm_group")->where(['firmid'=>session('lastfirmid'),'status'=>1])->select();
        $ret = [];
        foreach ($group as $v){
            $ret[$v['id']] = [
                'id' => $v['id'],
                'name' => $v['name'],
                'parentid' => $v['parentid'],
                'intro' => $v['intro'],
                'issuper' => $v['issuper'],
                'rules' => $v['rules'],
                'status' => $v['status'],
                'createtime' => $v['createtime'],
                'number' => $v['number'],
                'child' => ''
            ];
        }
        $tree = common_tree($group,$ret,'parentid');
        $this->assign("list", $list);
        $this->assign("tree", $tree);
        $this->display();
    }

    /*
     * ajax 获取当前机构下面的用户并区分当前部门下面的用户，做到指示
     * param groupid
     * */
    public function get_group_user(){
        $firm_user = get_firm_user(session('lastfirmid'));

        //获取部门下面的用户
        $groupId =  I('groupid');
        if(!$groupId){
            $this->ajaxReturn(['status'=>false,'msg'=>'参数错误']);
        }
        $res_group = M('group_user')->where(['groupid'=>$groupId,'firmid'=>session('lastfirmid') , 'status' => 1])->field('userid')->select();
        $userid = [];
        foreach ($res_group as $v){
            if(!in_array($v['userid'],$userid)){
                array_push($userid,$v['userid']);
            }
        }
        foreach($firm_user as $k=>$v){
            if(in_array($v['id'],$userid)){
                $firm_user[$k][is_exits] = true;
            }else{
                $firm_user[$k][is_exits] = false;
            }
        }
        $this->ajaxReturn(['status'=>true,'msg'=>'获取部门成员成功','data'=>$firm_user]);
    }

    /*创建部门new
       创建部门
    */
    public function create_group(){
        $gpid = I('pid')?:0;
        $data['name'] = I('group_name');
        //作为上级部门ID，一维数组中只有一个groupID
        $data['parentid'] = (array)I('group_parentid',[]);
        $data['parentid'] = $data['parentid'][0] == null ? 0 :$data['parentid'][0];
        $data['intro'] = I('group_intro');
        $data['firmid'] = session('lastfirmid');
        $data['createtime'] = time();
        $data['status'] = 1;
        $data['number'] = I('group_number');

        if(!$data['name'])
        {
            $this->ajaxReturn(['status'=>false,'msg'=>'请填写部门名称','data'=>[]]) ;
        }

        if(strlen($data['number']) > C('GROUP_NUMBER'))
        {
            $this->ajaxReturn(['status'=>false,'msg'=>'当前编号超过'. C('GROUP_NUMBER') .'位数','data'=>[]]) ;
        }
        //1，当用户选择了上级部门，先获取上级部门的number 然后拼接成当前部门的最新number   2，并检测当前number是否存在
        if($data['number'] && $data['parentid'] != 0 )
        {
            $number = M("firm_group")->where(['id'=>$data['parentid']])->getField('number');
            $data['number'] = $number.$data['number'];
            $exits_number = M("firm_group")->where(['firmid'=>session('lastfirmid'),'number'=>$data['number'],'status'=>1])->find();
            if($exits_number){
                $this->ajaxReturn(['status'=>false,'msg'=>'当前机构下此编号已被其他部门使用','data'=>[]]) ;
            }
        }

        //不填写编号  自动生成编号  顶级部门
        if(!$data['number']&& $data['parentid'] == 0)
        {
           /* $this->ajaxReturn(['status'=>true,'msg'=>'部门编号参数错误','data'=>[]]);*/
           //parentid  为零则为一级，默认两位数  不为零  则去找到parentID的number长度来判断
           $exits_group = M("firm_group")->where(['firmid'=>session('lastfirmid'),'parentid'=>0,'status'=>1])->select();
           $number = getMaxNumber($exits_group);
           $number += 1;
           if($number < 10)
           {
               $data['number'] = '0'."$number";
           }
           else
           {
               $data['number'] = "$number";
           }

        }
        //其他等级自动生成编号
        if(!$data['number']&& $data['parentid'] != 0)
        {
            $p_num = I("number");
            $p_num_length = strlen($p_num)+C('GROUP_NUMBER');
            $exits_group = M('firm_group')->where("char_length(number) = $p_num_length and number LIKE '$p_num%' and status = 1")->select();
            //如果当前部门下面没有部门则直接加一
            if($exits_group){
                $number = getMaxNumber($exits_group);
                //用来处理最前面0因为相加后消失,如果为1开头，则直接加一即可
                $num_len = strlen($number);
                $number += 1;
                if($num_len > strlen($number)){
                    $data['number'] = '0' . "$number";
                }else
                {
                    $data['number'] = "$number";
                }
            }
            else
            {
                $number = $p_num . '01';
                $data['number'] = "$number";
            }
        }
       //判断当前编号被占用   顶级部门判断
        if($data['number'])
        {
            $exits_number = M("firm_group")->where(['firmid'=>session('lastfirmid'),'number'=>$data['number'],'status'=>1])->find();
            if($exits_number)
            {
                $this->ajaxReturn(['status'=>false,'msg'=>'当前机构下此编号已被其他部门使用','data'=>[]]) ;
            }
        }
        $w['firmid'] = session('lastfirmid');
        $w['name'] = $data['name'];
        $w['status'] = 1;
        $w['parentid'] = $gpid;
        if(M('firm_group')->where($w)->find()){
            $this->ajaxReturn(['status'=>false,'msg'=>'当前部门已存在','data'=>[]]);
        }
        $res = M('firm_group')->add($data);
        if($res){
            $this->ajaxReturn(['status'=>true,'msg'=>'部门创建成功','data'=>[]]);
        }else{
            $this->ajaxReturn(['status'=>true,'msg'=>'部门创建异常','data'=>[]]);
        }

    }

    /*
     * 编辑部门 new
     * param 新增部门成员ID   array
     * param group_parentid  array
     * */
    public function edit_group(){
        $user_id = (array)I('userid');

        if(!I('group_id')){
            $this->ajaxReturn(['status'=>false,'msg'=>'参数错误','data'=>[]]);
        }
        //部门编号检查 赋值  二位属于自己的字符
        if(I('group_number')){
            $pid = M("firm_group")->where(['id'=>I('group_id')])->getField('parentid');
            $p_num = M("firm_group")->where(['id'=>$pid])->getField('number');
            $data['number'] = $p_num . I('group_number');
        }
        //用来更新部门
        if(I('group_name')){
            $data['name'] = I('group_name');
        }else{
            $this->ajaxReturn(['status'=>false,'msg'=>'请上传部门名称','data'=>[]]);
        }
        if(I('group_parentid')){
            $data['parentid'] = (array)I('group_parentid',[]);
            $data['parentid'] = $data['parentid'][0];
        }
        if(I('group_intro')) $data['intro'] = I('group_intro');
        $data['createtime'] = time();
        $data['status'] = 1;
        if( !count($user_id) && !I('group_intro') && M('firm_group')->where(['firmid'=>session('lastfirmid'),'name'=>$data['name']])->find()){
            $this->ajaxReturn(['status'=>false,'msg'=>'请不要无效编辑','data'=>[]]);
        }
        $res = M('firm_group')->where(['id'=>I('group_id')])->save($data);

        //为部门添加员工
        if($res !== false && $user_id[0] != ''){
            //获取此次编辑之前的部门成员数据
            $edit_before = M('group_user')->where(['firmid'=>session('lastfirmid'),'groupid'=>I('group_id'),'status' => 1])->select();
            //将机构部门下面的所有用户初始化为禁止状态
            M('group_user')->where(['firmid'=>session('lastfirmid'),'groupid'=>I('group_id')])->save(['status'=>0]);
            //之前部门有当前编辑的用户则更新。否则插入
            foreach($user_id as $v){
                if(M('group_user')->where(['firmid'=>session('lastfirmid'),'groupid'=>I('group_id'),'userid'=>$v])->find()){

                    $res = M('group_user')->where(['firmid'=>session('lastfirmid'),'groupid'=>I('group_id'),'userid'=>$v])->save(['status'=>1,'createtime'=>time()]);
                }else{
                    $res = M('group_user')->add(['firmid'=>session('lastfirmid'),'groupid'=>I('group_id'),'userid'=>$v,'status'=>1,'createtime'=>time(),'times'=>0]);
                }
            }
        }
        elseif($res !== false)
        {
            $res = M('group_user')->where(['firmid'=>session('lastfirmid'),'groupid'=>I('group_id')])->save(['status'=>0,'createtime'=>time()]);
        }

        if($res !== false){
            $this->ajaxReturn(['status'=>true,'msg'=>'编辑部门成功','data'=>[]]);
        }else{
            $this->ajaxReturn(['status'=>false,'msg'=>'编辑部门失败','data'=>[]]);
        }

    }


    /*
     * 获取编号
     *pid  父级ID
     * dbName 数据库名称
     * numQulity 编号 位数
    */
    public function ajaxBackNum(){
        $pid = I('pid');
        $dbName = I('dbName');
        $numQulity = I('numQulity');
        $model = M($dbName);
        //上级编号
        $p_num = $model->where(['id'=>$pid])->getField('number');
        $p_num_length = strlen($p_num)+$numQulity;
        $exits_type = $model->where("char_length(number) = $p_num_length and number LIKE '$p_num%' and status = 1")->select();
        //如果当前部门下面没有部门则直接加一
        $data['number'] = 0;
        $data = getNewNumber($exits_type,$data,$p_num);
        $number = substr($data['number'],strlen($data['number'])-$numQulity);
        $this->ajaxReturn(['status'=>true , 'msg'=>'返回编号成功' , 'data'=>[$number]]);
    }

    /*删除部门*/
    public function del_group(){
        $group_id = I('group_id');
        //检查部门下面是否有用户
        $is_member = M('group_user')->where(['firmid'=>session('lastfirmid'),'groupid'=>$group_id,'status'=>1])->find();

        if($is_member){
            $this->ajaxReturn(['status'=>false,'msg'=>'当前部门存在用户，请点编辑去除部门用户','data'=>[]]);
        }
        //首先检查部门下面是否有子部门，如果有子部门则先删除子部门
        $is_sun = M('firm_group')->where(['parentid'=>$group_id,'status'=>1])->find();
        if($is_sun){
            $this->ajaxReturn(['status'=>false,'msg'=>'当前部门存在下级部门，请先删除下级部门','data'=>[]]);
        }
        $del_res = M('firm_group')->where(['id'=>$group_id])->save(['status'=>0]);
        if($del_res !== false){
            $del_res = M('group_user')->where(['firmid'=>session('lastfirmid'),'groupid'=>$group_id])->delete();
        }

        if($del_res !== false){
            $this->ajaxReturn(['status'=>true,'msg'=>'部门删除成功','data'=>[]]);
        }else{
            $this->ajaxReturn(['status'=>false,'msg'=>'部门删除失败','data'=>[]]);
        }

    }


    /*部门成员展示 */
    public function memberShow()
    {
        $group_id = I('groupid');
        //部门下的所有用户
        $firmid = session('lastfirmid');
        $groupid = $group_id;
        $user = \Home\Model\UserModel::getUserByFirmGroup($firmid,$groupid);
        foreach($user as $k => $v){
            if(!$v['intro']) $user[$k]['intro']='未备注';
        }
        if($user){
            $this->ajaxReturn(['status'=>true, 'msg'=>'返回成功', 'data'=>$user]);
        }else
        {
            $this->ajaxReturn(['status'=>false, 'msg'=>'当前无成员信息', 'data'=>[]]);
        }


    }

    /*批量添加成员*/
    public function batchAddUser(){
        $fid = I('fid');
        if(!$fid){
            $this->ajaxReturn(['status' => false, 'msg' => '无对应机构！']);
        } 
        $fileObj = new \Think\Upload();
        // $fileObj->maxSize = 100 * 1024 * 1024;
        $fileObj->exts = array('xls', 'xlsx');
        $fileObj->rootPath = './Uploads/user/';
        if (!file_exists('./Uploads/user/')) {
            mkdir('./Uploads/typeico/', 0777);
        }
        $res = $fileObj->uploadOne($_FILES['efile']);//print_r($res);exit();
        if (!$res) {
            $this->ajaxReturn(['status' => false, 'msg' => $fileObj->getError()]);
        } else {
            $filepath = './Uploads/user/' . $res['savepath'] . $res['savename'];
            $data = $this->import_excel($filepath, $res['ext']);
            $common = array(
                'password' => 'link654321',
                'lastfirmid' => 0,
            );
            //设置盐盖     其他数据
            $common['salt'] = substr(md5($common['password'] . C("SALT_KEY")), 5, 4);
            $common['password'] = think_ucenter_md5($common['password'], $common['salt']);
            $common['status'] = 1;
            $common['createtime'] = time();
            $res = \home\model\UserModel::save_import($fid,$data,$common);
            unlink($filepath);
            $this->ajaxReturn($res);
        }
    }

     /**
     * 导入excel文件
     * @param  string $file excel文件路径
     * @return array        excel文件内容数组
     */
    public function import_excel($filename, $exts='xls')
    {
        //导入PHPExcel类库，因为PHPExcel没有用命名空间，只能inport导入
        import("Org.Util.PHPExcel");
        import("Org.Util.PHPExcel.IOFactory");
        //创建PHPExcel对象，注意，不能少了\
        $PHPExcel = new \PHPExcel();
        //如果excel文件后缀名为.xls，导入这个类
        if($exts == 'xls'){
            import("Org.Util.PHPExcel.Reader.Excel5");
            $PHPReader = new \PHPExcel_Reader_Excel5();
        }else if($exts == 'xlsx'){
            import("Org.Util.PHPExcel.Reader.Excel2007");
            $PHPReader = new \PHPExcel_Reader_Excel2007();
        }
        //载入文件
        $PHPExcel = $PHPReader->load($filename);
        //获取表中的第一个工作表，如果要获取第二个，把0改为1，依次类推
        $currentSheet = $PHPExcel->getSheet(0);
        //获取总列数
        // $allColumn = $currentSheet->getHighestColumn();
        //获取总行数
        $allRow = $currentSheet->getHighestRow();
        //循环获取表中的数据，$currentRow表示当前行，从哪行开始读取数据，索引值从0开始
        $data = array();
        for($rowIndex=2;$rowIndex<=$allRow;$rowIndex++){        //循环读取每个单元格的内容。注意行从1开始，列从A开始
            for($colIndex='A';$colIndex<='B';$colIndex++){
                $addr = $colIndex.$rowIndex;
                $cell = $currentSheet->getCell($addr)->getValue();
                if($cell instanceof PHPExcel_RichText){ //富文本转换字符串
                    $cell = $cell->__toString();
                }
                $data[$rowIndex][$colIndex] = $cell;
            }
        }
        return $data;
    }

    //切换机构
    public function changeFirm()
    {
        $firmid = I("post.firmid");
        if ($firmid < 1) {
            $this->ajaxReturn(['status' => false, 'msg' => '参数错误！']);
        }

        /*更改用户表lastfirmid*/
        M("user")->where(['id'=>$this->userInfo['id']])->save(['lastfirmid'=>$firmid]);

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
            session('lastfirmid', $firmid);
            $this->ajaxReturn(['status' => true, 'msg' => '成功！']);
        }
        $this->ajaxReturn(['status' => false, 'msg' => '参数错误！']);
    }

    /**
     *机构管理(已废弃)
     */
    public function firm()
    {

        $this->display();
    }

    /**
     *获取未加入的机构
     */
    public function getNotJoinOrg()
    {

        $id = $this->uid;
        $firms = \Home\Model\FirmModel::getFirm();
        if(!empty($firms)){
            $data = [];
            foreach ($firms as $key => $value) {
                $data[$key]['id'] = $value['id'];
                $data[$key]['text'] = $value['name'];
            }
            $alreadyJoin = \Home\Model\FirmModel::getJoinFirm($this->uid);
            $alreadyApp = \Home\Model\FirmModel::getAppFirm($this->uid);
            $res = [
                'alreadyJoin' => array_column($alreadyJoin, 'firmid'),
                'alreadyApp' => array_column($alreadyApp, 'to_firmid'),
                'data' => $data
            ];
            $this->ajaxReturn(['status' => true, 'msg' => '成功！', 'data' => $res]);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '无数据！']);
        }
    }

    /**
     *加入机构
     */
    public function joinFirm()
    {

        $ids = I("ids");
        $firms = M('firm')->where(['id' => ['in',$ids]])->select();
        //print_r($firms);exit();
        $res = \Home\Model\FirmModel::addApplication($firms);
        $this->ajaxReturn($res);
    }

    /**
     * 添加与编辑机构
     */
    public function createfirm()
    {
        $action = I("action");
        $name = I("name");
        $intro = I("intro");
        $id = I("id");

        if (empty($action) || !in_array($action,['createOrgAction', 'addOrgAction', 'modifyOrgAction', 'delOrgAction','editOrgAction', 'verifyPass', 'verifyReject'])
        ) {
            $this->ajaxReturn(['status' => false, 'msg' => '参数错误！']);
        }

        $flag = ['status' => 'false', 'msg' => '未知错误！'];
        switch ($action) {
            case 'createOrgAction':
                //创建机构
                $ret = \Home\Model\FirmModel::ckfirmname($name);
                if (is_array($ret) && !empty($ret)) {
                    $this->ajaxReturn(["status" => false, "msg" => '该名称已经存在，请选择另外一个响亮的名称吧！']);
                }
                $flag = \Home\Model\FirmModel::setUserFirm([
                    'userid' => $this->uid,
                    'name' => $name,
                    'intro' => $intro,
                    'parentid' => 0,
                    'verify' => 0,
                    'status' => 1
                ]);
                break;
            case 'addOrgAction':
                //创建子机构
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
                //修改子机构
                $flag = \Home\Model\FirmModel::setUserFirm(['name' => $name, 'intro' => $intro], $id);
                break;
            case 'delOrgAction':
                /*if(M("firm_group")->where(['firmid'=>session('lastfirmid'),'status'=>1])->find()){
                    $this->ajaxReturn(["status" => false, "msg" => '机构下有部门，不允许删除！']);
                }*/
                $ret = firm_exits_sun(session('lastfirmid'), session('user_auth.uid'));
                if($ret['status'] === false){
                    $this->ajaxReturn($ret);
                }
                //如果机构有子机构则不允许删除
                if (\Home\Model\FirmModel::chFirmSon($id)) {
                    $this->ajaxReturn(["status" => false, "msg" => '机构下有子机构，不允许删除！']);
                }
                $flag = \Home\Model\FirmModel::setUserFirm(['status' => 0], $id);
                if($id == session('user_auth.uid')){
                    $firmid = M('GroupUser')->where(['userid'=>session('user_auth.uid'),'status'=>1])->find();
                    session('lastfirmid',$firmid['firmid']);
                }
                break;
            case 'editOrgAction':
                //判断当前用户是否为创建机构，非创建者不能编辑
                $userid = M('firm')->where(['id'=>I('id')])->getField('userid');
                if(session('user_auth')['uid'] != $userid){
                    $this->ajaxReturn(["status" => false, "msg" => '非机构创建者不能编辑！']);
                }
                if ($_FILES) {
                    $fileObj = new \Think\Upload();
                    $fileObj->exts = array('jpg', 'gif', 'png', 'jpeg');
                    $fileObj->rootPath = './Uploads/typeico/';
                    if (!file_exists('./Uploads/typeico/')) {
                        mkdir('./Uploads/typeico/', 0777);
                    }
                    $res = $fileObj->upload($_FILES);
                    if (!$res) {
                        $this->error($fileObj->getError());
                    } else {
                        $param['logoimg'] = $res['logoimg']['savepath'] . $res['logoimg']['savename'];
                        $data['logoimg'] = '/Uploads/typeico/'. $param['logoimg'];
                    }
                }
                if(I("copyright")) $data['copyright'] = I("copyright");
                $data['name'] = I('name');
                $data['intro'] = I('intro');
                M('firm')->where(array('id'=>I('id')))->save($data);
                $this->ajaxReturn(["status" => true, "msg" => '编辑成功！']);
                break;
            case 'verifyPass':
                $id = I('id', '', 'intval');
                if ($id > 0) {
                    $res = D('Firm')->changeVerify($id, 1);
                    if ($res) {
                        $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
                    } else {
                        $this->ajaxReturn(['status' => true, 'msg' => '操作失败！']);
                    }

                }
                break;
            case 'verifyReject':
                $id = I('id', '', 'intval');
                if ($id > 0) {
                    $res = D('Firm')->changeVerify($id, 2);
                    if ($res) {
                        $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
                    } else {
                        $this->ajaxReturn(['status' => true, 'msg' => '操作失败！']);
                    }
                }
                break;
        }
        if ($flag['status'] && in_array($action, ['addOrgAction', 'createOrgAction'])) {
            //创建分组
            $ret = \Home\Model\FirmModel::initFirmGroup([
                'firmid' => $flag['firmid'],
                'parentid' => 0,
                'name' => '超级管理员',
                'status' => 1,
               /* 'issuper' => 1,*/
                'issuper' => 1,
                'times' => 0,
                'number' => '01'
            ]);
            //将用户加入到对应用户分组中默认0
            \Home\Model\FirmModel::initGroupUser([
                'firmid' => $flag['firmid'],
                'userid' => $this->userinfo['id'],
                'groupid' => $ret['id'],
                'times' => 0
            ]);

            //切换到新建的机构
//            $setfirm = \Home\Model\UserModel::editUser(['lastfirmid' => $flag['firmid']], $this->userinfo['id']);
//            if(is_int($setfirm)){
//                session('lastfirmid', $flag['firmid']);
//                Auth::getAuthListS($setfirm, 1); //权限存入session
//            }
        }

        if ($flag['status'] && $action == 'delOrgAction') {
            //删除该机构下的用户分组，以及用户信息
            \Home\Model\FirmModel::delFirmGroupByFirmid($id);
            \Home\Model\FirmModel::delFirmGroupUserByFirmid($id);
            // $getfirm = M("firm")->where(['userid'=>$this->userInfo['id']])->find();
            //切换到空机构
            if (session("lastfirmid")==$id) {
                $fid = 0;
                session('lastfirmid', $fid);
            }
            
        }

        $this->ajaxReturn($flag);
    }

    /**
     * 获取(未使用)
     */
    // public function groupUser()
    // {
    //     $firmid = I("firmid");
    //     $groupid = I("groupid");

    //     $firmid = intval($firmid);
    //     $groupid = intval($groupid);

    //     $firmid < 1 && $firmid = $this->firmid;

    //     if ($firmid < 1 || $groupid < 1) {
    //         $this->ajaxReturn(['status' => false, 'msg' => []]);
    //     }

    //     //机构下的所有用户列表
    //     $list = $groupuids = $uids = [];
    //     $ret = \Home\Model\FirmModel::firmUsers($firmid);
    //     if (empty($ret)) {
    //         $this->ajaxReturn(['status' => false, 'msg' => []]);
    //     }

    //     foreach ($ret as $v) {
    //         $uids[] = $v['userid'];
    //         if ($v['groupid'] == $groupid) {
    //             array_push($groupuids, $v['userid']);
    //         }
    //     }

    //     $uids = array_unique($uids);
    //     $uinfos = \Home\Model\UserModel::getUserInfoByIds($uids);
    //     foreach ($uinfos as $v) {
    //         array_push($list, [
    //             'id' => $v['id'],
    //             'username' => $uinfos[$v['id']]['username'],
    //             'mobile' => $uinfos[$v['id']]['mobile'],
    //             'isck' => in_array($v['id'], $groupuids) ? 'checked' : ''
    //         ]);
    //     }

    //     $this->ajaxReturn(['status' => true, 'msg' => $list]);
    // }

    /**
     * 编辑用户组的用户(未使用)
     */
    // public function editGroupUser()
    // {
    //     $firmid = I("firmid");
    //     $groupid = I("groupid");
    //     $uids = I("uids");

    //     $firmid = intval($firmid);
    //     $groupid = intval($groupid);

    //     if ($firmid < 1) {
    //         $this->ajaxReturn(['status' => false, 'msg' => "参数错误！"]);
    //     }

    //     $ret = \Home\Model\FirmModel::firmUsers($firmid, $groupid, 0, 'all');

    //     //逻辑处理
    //     $existid = [];
    //     foreach ($ret as $v) {
    //         if ($v['status'] > 0 && !in_array($v['userid'], $uids)) {
    //             \Home\Model\FirmModel::initGroupUser(['status' => 0], $v['id']);
    //         }
    //         if ($v['status'] == 0 && in_array($v['userid'], $uids)) {
    //             \Home\Model\FirmModel::initGroupUser(['status' => 1], $v['id']);
    //         }
    //         array_push($existid, $v['userid']);
    //     }

    //     //新增
    //     $no_existid = array_diff($uids, $existid);
    //     foreach ($no_existid as $id) {
    //         \Home\Model\FirmModel::initGroupUser([
    //             'userid' => $id,
    //             'groupid' => $groupid,
    //             'firmid' => $firmid,
    //             'status' => 1,
    //             'times' => 0
    //         ]);
    //     }

    //     $this->ajaxReturn(['status' => true, 'msg' => "更改成功！"]);
    // }

    /**
     * 创建部门（未使用）
     */
    // public function creategroup()
    // {
    //     $name = I("name");
    //     $groupid = I("groupid");
    //     $intro = I("intro");
    //     $action = I("action");

    //     $flag = ['status' => false, 'msg' => '操作失败！'];

    //     //添加
    //     if ($action == 'modifyOrgAction') {
    //         $flag = \Home\Model\FirmModel::initFirmGroup([
    //             'name' => $name,
    //             'intro' => $intro,
    //             'firmid' => $this->firmid,
    //             'parentid' => 0,
    //             'status' => 1
    //         ]);
    //         if ($flag['status'] == true) {
    //             $fg = \Home\Model\FirmModel::initGroupUser([
    //                 'userid' => $this->uid,
    //                 'groupid' => $flag['id'],
    //                 'firmid' => $this->firmid,
    //                 'status' => 1,
    //                 'times' => 0
    //             ]);
    //             if ($fg['status'] == false) {
    //                 //todo 日志
    //             }
    //         }
    //     }

    //     //编辑
    //     if ($action == 'modifyEditAction') {
    //         if ($groupid > 0) {
    //             $flag = \Home\Model\FirmModel::initFirmGroup(['name' => $name, 'intro' => $intro], $groupid);
    //         }
    //     }

    //     //删除
    //     if ($action == 'modifyDelAction') {
    //         if ($groupid == 0) {
    //             $this->ajaxReturn(['status' => true, 'msg' => '不能删除默认分组']);
    //         }

    //         //默认超级管理组不允许删除
    //         $groupinfo = \Home\Model\FirmModel::firmGroup($this->firmid, $groupid);
    //         if (empty($groupinfo)) {
    //             $this->ajaxReturn($flag);
    //         }

    //         if ($groupinfo['issuper'] == \Home\Model\FirmModel::SUPERNUM) {
    //             $this->ajaxReturn(['status' => false, 'msg' => '不能删除管理员组！']);
    //         }

    //         $flag = \Home\Model\FirmModel::initFirmGroup(['status' => 0], $groupid);
    //         if ($flag['status'] == true) {
    //             //删除组下的用户
    //             $fg = \Home\Model\FirmModel::delFirmGroupUserByFirmid($this->firmid, $groupid);
    //             if ($fg['status'] == false) {
    //                 //todo 日志
    //             }
    //             $this->ajaxReturn(['status' => true, 'msg' => '删除成功！']);
    //         }
    //     }
    //     $this->ajaxReturn($flag);
    // }


    /**
     *邀请(未使用)
     */
    // public function invite()
    // {
    //     $this->display();
    // }

    /**
     * 单个邀请
     */
    public function singleInvite()
    {
        if(is_firm_creator())$this->ajaxReturn(['status' => false, 'msg' => '非本机构创建者不能此操作，请切换到自己机构!']);
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
            }
        }

        $this->ajaxReturn(['status' => true, 'msg' => '发起邀请成功!']);
    }

    /**
     *用户管理
     */
    public function userMsg()
    {
        $list = \Home\Model\UserModel::getAllUserInfo($this->firmid);//print_r($list);
        $this->assign("list", $list);
        $firmname = M('firm')->where(['id'=>$this->firmid])->getField('name');
        $this->assign("firmname", $firmname);
        $this->assign("firmid", $this->firmid);
        $this->display();
    }

    /**
     * 新增用户
     */
    public function newUser(){
        $firmid = I("post.firmid");
        $username = I("post.username");
        $mobile = I("post.mobile");
        $password = I("post.password");
        if(!$firmid || !$username || !$mobile || !$password){
            $this->ajaxReturn(['status' => false,'msg' => '请填写必填项']);
        }
        $re = M("User")->where(['mobile' => $mobile])->field('mobile')->select();
        if(!empty($re)){
            $this->ajaxReturn(['status' => false,'msg' => '该手机号码已经被注册了']);
        }
        $salt = substr(md5($password . C("SALT_KEY")), 5, 4);
        $passwordmd5 = think_ucenter_md5($password, $salt);
        $userinfo = array(
            'username' => $username,
            'mobile' => $mobile,
            'salt' => $salt,
            'password' => $passwordmd5,
            'status' => 1,
            'createtime' => time(),
            'lastfirmid' => 0
        );
        try{
            $obj = M('user');
            $obj->add($userinfo);
            $uid = $obj->getLastInsID();
            if(!$uid){
                $this->ajaxReturn(['status' => false,'msg' => '保存失败']);
            }
            $gid = M("firm_group")->where(['firmid'=>$firmid,'name'=>'超级管理员'])->getField('id');
            $data = [
                'firmid' => $firmid,
                'groupid' => $gid,
                'userid' => $uid,
                'status' => 1,
                'times' => 0
            ];
            $ret = \Home\Model\FirmModel::initGroupUser($data);
            if(!$ret){
                $this->ajaxReturn(['status' => false,'msg' => '保存失败']);
            }else{
                //新增用户添加对应的设备
                $userinfo['id'] = $uid;
                \Home\Model\MemberModel::newUserAddDevice($userinfo);
                $this->ajaxReturn(['status' => true,'msg' => '保存成功']);
            }
        }catch(\Exception $e){
            $this->ajaxReturn(['status' => false,'msg' => '保存失败']);
        }

    }

    /**
     * 编辑用户
     * param group_id array
     */
    public function edituser()
    {
        $firmid = I('firmid');
        $userid = I('userid');
        $username = I('username');
        $mobile = I('mobile');
        $group = I('group');
        $intro = I('intro');
        if(!$userid){
            $this->ajaxReturn(['status' => false, 'msg' => '无效用户！']);
        }
        $userModel = M('user');
        if(!$username || !$mobile){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写姓名和手机号！']);
        }
        $existName = $userModel->where(['username'=>['eq',$username],'id'=>['neq',$userid]])->find();
        if(!empty($existName)){
            $this->ajaxReturn(['status' => false, 'msg' => '该姓名已存在！']);
        }
        $existMobile = $userModel->where(['mobile'=>['eq',$mobile],'id'=>['neq',$userid]])->find();
        if(!empty($existMobile)){
            $this->ajaxReturn(['status' => false, 'msg' => '该手机号码已存在！']);
        }
        $oldusername = $userModel->where(['id'=>$userid])->getField('username');
        $data = [
            'username' => $username,
            'intro' => $intro,
            'mobile' => $mobile,
        ];
        $res = $userModel->where("id = $userid")->save($data);
        if($res){
            if($oldusername != $username){
                M('modulesDevice')->where(['userid'=>$userid,'name'=>$oldusername.'的电脑'])->setField('name',$username.'的电脑');
                M('modulesDevice')->where(['userid'=>$userid,'name'=>$oldusername.'的移动设备'])->setField('name',$username.'的移动设备');
            }
            M('groupUser')->where(['firmid'=>['eq',$firmid],'userid'=>['eq',$userid]])->delete();
            if($group){
                $gd = [];
                foreach(explode(',',$group) as $vb){
                    $gd[]  = [
                        'firmid' => $firmid,
                        'groupid' => $vb,
                        'userid' => $userid,
                        'status' => 1,
                        'createtime' => time()
                    ];
                }
                M('groupUser')->addAll($gd);
            }else{
                M('groupUser')->add(['firmid'=>$firmid,'userid' => $userid,'status' => 1,'createtime' => time()]);
            }
            $this->ajaxReturn(['status' => true, 'msg' => '修改成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '修改失败！']);
        }
    }

    /**
     * 删除用户
     */
    public function deluser()
    {
        $userid = I('userid');
        if(!$userid){
            $this->ajaxReturn(['status' => false, 'msg' => '参数错误！' ,'data' => []]);
        }
        M('user')->where(['id'=>$userid])->delete();
        $res = M('group_user')->where(['userid'=>$userid])->delete();
        M('modulesDevice')->where(['userid'=>$userid,'firmid' => 0])->delete();
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '删除成功！' ,'data' => []]);
        }else{
            $this->ajaxReturn(['status' => true, 'msg' => '删除失败！' ,'data' => []]);
        }
    }

    /**
     * 获取部门树
     */
    public function getGroupTree(){
        $firmid = $this->firmid;
        $groups = M('firmGroup')->where(['firmid'=>$firmid,'status'=>1])->field('id,parentid,name as text')->select();
        $res = [];
        $groups = array_column($groups,null,'id');
        foreach($groups as $k => $v){
            if(!empty($groups[$v['parentid']])){
                if(empty($groups[$v['parentid']]['children'])){
                    $groups[$v['parentid']]['children'] = [];
                }
                $groups[$v['parentid']]['children'][] = &$groups[$v['id']];
            }else{
                $res[] = &$groups[$v['id']];
            }
        }
        if(!empty($res)){
            $this->ajaxReturn(['status' => true, 'msg' => '获取成功！' ,'data' => $res]);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '无数据！']);
        }
    }

    /**
     * 权限分类，超级管理员的功能
     */
    public function authorityMsg()
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
        is_firm_creator();
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
        // if(!IS_ROOT){
        //     $this->error('未授权访问');
        // }
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

    /* 角色管理 */
    public function roleMsg(){
        $firmid = session('lastfirmid');
        $uid = $this->uid;
        $a = [];
        $user_groups = M('UserRolebind')->where("userid=$uid and firmid=$firmid")->getfield('role');
        if ($user_groups) {
            $user_groups = explode(',', $user_groups);        
            if ($user_groups) {
                foreach ($user_groups as $k => $v) {
                    $user_rules = M('UserRole')->where("id=$v")->getfield('rules');
                    if ($user_rules) {
                        $sss = explode(',', $user_rules);
                        $a = array_merge($a,$sss);
                    }                
                }
            }
        }
        $rolelist = $this->rolelist();
        $this->assign('rolelist',$rolelist);
        $this->display();
    }

    //角色树，jstree专用
    public function rolelist_ajax(){
        $rolelist = $this->rolelist();
        $userid = I('userid');
        $userrolebind = M('UserRolebind','','DB_CONFIG_LINK');
        $w['firmid'] = $this->firmid;
        $w['userid'] = $userid ;
        $roles = $userrolebind->where($w)->getField('role');
        $thisroles = explode(',', $roles);
        if ($thisroles) {
            foreach ($rolelist as $k => $v) {
                foreach ($thisroles as $key => $value) {
                    if ($v['id'] == $value) {
                        $rolelist[$k]['state'] = array('opened' => true, 'selected' => true);
                    }
                }
            }
        }        
        $this->ajaxReturn($rolelist);
    }

    //角色列表查询供调用
    function rolelist(){
        $userrole = M('UserRole','','DB_CONFIG_LINK');
        $w['firmid'] = $this->firmid;
        $rolelist = $userrole
        ->alias('a')
        ->field('a.*,b.name as firmname,a.name as text')
        ->join("left join ".C('DB_PREFIX')."firm as b on a.firmid = b.id")
        ->where($w)
        ->select();
        return $rolelist;
    }

    /**
     * 角色添加或编辑
     */
    public function role_ok()
    {
        $name = I('name');
        $intro = I('intro');
        $action = I('action');        
        $userrole = M('UserRole','','DB_CONFIG_LINK');
        if ($action == 'add') {
            $arr = array(
                'firmid' => $this->firmid,
                'name' => $name,
                'intro' => $intro
            );
            $res = $userrole->add($arr);
        }

        if ($action == 'edit') {
            $id = I('id');
            $arr = array(
                'name' => $name,
                'intro' => $intro
            );
            $w['id'] = $id;
            $res = $userrole->where($w)->save($arr);
        }
        
        $this->ajaxReturn($res);
    }

    //角色删除
    public function role_del(){
        $id = I('id');
        if ($id) {
            $userrole = M('UserRole','','DB_CONFIG_LINK');
            $w['id'] = $id;
            $res = $userrole->where($w)->delete();
        }
        $this->ajaxReturn($res);
    }

    //角色绑定
    public function rolebind(){
        $userid = I('userid');
        $data = I('data');        
        $role = substr($data, 0, strlen($data) - 1);
        $userrolebind = M('UserRolebind','','DB_CONFIG_LINK');
        $w['userid'] = $userid;
        $w['firmid'] = $this->firmid;
        $r = $userrolebind->where($w)->find();
        if ($r) {
            $res = $userrolebind->where($w)->setfield('role',$role);
        }else{
            $arr = array('userid' => $userid,'firmid' => $this->firmid,'role' => $role);
            $res = $userrolebind->add($arr);
        }        
        $this->ajaxReturn($res);
    }

}