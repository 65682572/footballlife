<?php

namespace Home\Controller;


class SystemSetController extends AdminController
{
    //以下只做了界面，未做功能
    public function timeSet(){
        $this->display('SystemSet/basicSet/timeSet');
    }
    public function effectSet(){
        $this->display('SystemSet/basicSet/effectSet');
    }
    public function outputDisplaySet(){
        $this->display('SystemSet/basicSet/outputDisplaySet');
    }
    public function streamSet(){
        $this->display('SystemSet/basicSet/streamSet');
    }
    public function systemSet(){
        $this->display('SystemSet/basicSet/systemSet');
    }
    public function windowSet(){
        $this->display('SystemSet/basicSet/windowSet');
    }
    public function audioSet(){
        $this->display('SystemSet/basicSet/audioSet');
    }
    public function networkSet(){
        $this->display('SystemSet/networkSet/networkSet');
    }
    public function sDKPortSet(){
        $this->display('SystemSet/networkSet/sDKPortSet');
    }
    public function platformSet(){
        $this->display('SystemSet/networkSet/platformSet');
    }
    public function serialPortSet(){
        $this->display('SystemSet/serialPortSet/serialPortSet');
    }
    public function streamingSet(){
        $this->display('SystemSet/streamingSet/streamingSet');
    }
    public function activeDevice(){
        $this->display('SystemSet/system/activeDevice');
    }
    public function importExport(){
        $this->display('SystemSet/system/importExport');
    }
    public function reset(){
        $this->display('SystemSet/system/reset');
    }
    public function restartDevice(){
        $this->display('SystemSet/system/restartDevice');
    }
    public function systemInfo(){
        $this->display('SystemSet/system/systemInfo');
    }
    public function systemSetA(){
        $this->display('SystemSet/systemSetA');
    }
    public function specifications(){
        $this->display('SystemSet/specification');
    }
    public function parameterSet(){
        $this->display('SystemSet/system/parameterSet');
    }
    public function pluginsLoad(){
        $this->display('SystemSet/system/pluginsLoad');
    }
    //以上只做界面，未做功能

    //设备分组管理
    public function deviceGroup(){
        // $uid = session('user_auth.uid');
        // $where['userid'] = $uid;
        $where['firmid'] = $this->firmid;
        $list2 = M('types')->where($where)->select();
        $this->assign('list2',$list2);
        $this->display('SystemSet/deviceGroup');
    }

    //设备分类列表
    public function typeAdd(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        // $uid = session('user_auth.uid');
        $list = M('type')->order('id desc')->select();
        $ret = [];
        foreach ($list as $v){
            $ret[$v['id']] = [
                'id' => $v['id'],
                'name' => $v['name'],
                'pid' => $v['pid'],
                'bindid' => $v['bindid'],
                'status' => $v['status'],
                'createtime' => $v['createtime'],
                'icon' => $v['icon'],
                'number' => $v['number'],
                'number_prefixes' => $v['number_prefixes'],
                'child' => ''
            ];
        }
        $list = common_tree($list,$ret,'pid');
        /*通过编号拿出分类
         * foreach ($list as $v){
            $ret[$v['number']] = [
                'id' => $v['id'],
                'name' => $v['name'],
                'pid' => $v['pid'],
                'bindid' => $v['bindid'],
                'status' => $v['status'],
                'createtime' => $v['createtime'],
                'icon' => $v['icon'],
                'number' => $v['number'],
                'number_prefixes' => $v['number_prefixes'],
                'child' => ''
            ];
        }
        $list = common_number_tree($ret,'number',3);*/
        $tagtypes = M('type')->where('pid = 0')->order('id desc')->select();
        $this->assign('list', $list);
        $this->assign('tagtypes', $tagtypes);
        //参数
        $paramlist = \Home\Model\DeviceModel::paramList();
        $this->assign('paramlist',$paramlist);
        $this->display();
    }

    //通过分类id获取分类详情
    public function type_get_id(){
        $where['id'] = I('id');
        $res = M('type')->where($where)->find();
        $this->ajaxReturn($res);
    }

    //分类添加与分类编辑
    public function type_add_ok(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        $flag = ['status'=>false,'msg'=>'添加失败！'];    
        $action = I("action");
        $classifyname = I('classifyname');
        $bindevent = I('bindevent');
        if(M('type')->where(['name'=>$classifyname,'status'=>1])->find()){
            $flag = ['status'=>false,'msg'=>'分类名重复'];
            $this->ajaxReturn($flag);
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
                $param['map_img'] = $res['file_url']['savepath'] . /*'thump' .*/ $res['file_url']['savename'];
                /*imgThump('./Uploads/typeico/'.$res['file_url']['savepath'] . $res['file_url']['savename'],'./Uploads/typeico/'.$param['map_img'],30,30);*/
                $data['icon'] = '/Uploads/typeico/' . $param['map_img'];
            }
        }elseif($action == 'addClassifyAction')
        {
            $this->ajaxReturn(['status'=>false,'msg'=>'上传设备分类图标','data'=>[]]);
        }
         
        if ($classifyname) {
            if ($action == "addClassifyAction"){
                $data['name'] = $classifyname;
                $data['status'] = 1;
                $data['createtime'] = time();
                $data['bindevent'] = $bindevent;
                $data['pid'] = I('pid') != 0 ? I('pid') : 0;
                $data['number'] = I('typeNumber');
                $data['number_prefixes'] = I('numberPrefixes')?I('numberPrefixes'):'SBLX';
                if(strlen($data['number'])>3){
                    $this->ajaxReturn(['status'=>false,'msg'=>'当前编号超过3位数','data'=>[]]);
                }
                //顶级分类的编号自动生成
                if(!$data['number'] && $data['pid'] == 0){
                    //分两种情况 小于10  小于100
                    $exits_type = M("type")->where(['pid'=>0,'status'=>1])->select();
                    $number = getMaxNumber($exits_type);
                    $number += 1;
                    if($number < 10)
                    {
                        $data['number'] = '00'."$number";
                    }
                    elseif($number < 100 && $number > 10)
                    {
                        $data['number'] = '0'."$number";
                    }
                    else
                    {
                        $data['number'] = "$number";
                    }
                }

                //其他等级自动生成编号
                if(!$data['number']&& $data['pid'] != 0)
                {
                    //上级部门编号
                    $p_num = I("number");
                    $p_num_length = strlen($p_num)+3;
                    $exits_type = M('type')->where("char_length(number) = $p_num_length and number LIKE '$p_num%' and status = 1")->select();
                    //如果当前部门下面没有部门则直接加一
                    $data = getNewNumber($exits_type,$data,$p_num);

                }
                if($data['number'] && $data['pid'] != 0){
                    $p_num= M("type")->where(['id'=>$data['pid'],'status'=>1])->getField('number');
                    $data['number'] = $p_num . $data['number'];
                }
                $is_number_exits = M("type")->where(['number'=> $data['number'],'status'=>1])->find();
                if($is_number_exits){
                    $this->ajaxReturn(['status'=>false,'msg'=>'此编号已被使用！']);
                }

                $res = M('type')->add($data);
                if ($res) {
                    $flag = ['status'=>true,'msg'=>'添加成功！'];
                }
            }
        }else{
            $flag = ['status'=>false,'msg'=>'请输入分类名称'];
        }

        if ($action == "editClassifyAction"){
            $id = I('id');
            $where['id'] = I('id');
            $editDeviceName = I('editDeviceName');
            $data['name'] = $editDeviceName;
            $data['createtime'] = time();
            $data['status'] = 1;
            $data['bindid'] = I('bindevent');
            if(I('pid'))  $data['pid'] = I('pid');

            if(strlen(I('typeNumber'))>3 ){
                $this->ajaxReturn(['status'=>false,'msg'=>'当前编号超过3位数','data'=>[]]);
            }
            elseif ( strlen(I('typeNumber'))< 3 )
            {
                $this->ajaxReturn(['status'=>false,'msg'=>'填写三位数编号','data'=>[]]);
            }

            //分两种情况  用户更改了上级分类  未更改上级分类
            if(M("type")->where($where)->getField('pid') == $data['pid']){
                if($data['pid']){
                    $p_number = M('type')->where(['id'=>$data['pid']])->getField('number');
                    $data['number'] = $p_number . I('typeNumber');
                }
                else
                {
                    $data['number'] = I('typeNumber');
                }
            }
            else
            {
                $p_num = M("type")->where(['id'=>$data['pid']])->getField('number');
                $p_num_length = strlen($p_num)+3;
                $exits_type = M('type')->where("char_length(number) = $p_num_length and number LIKE '$p_num%' and status = 1")->select();
                $data = getNewNumber($exits_type,$data,$p_num);
                //两件事  根据所选上级生成新的编号   改变当前分类的的下级编号保证同步
                $self_number = M("type")->where($where)->getField('number');
                $self_number_length = strlen($self_number);
                $ret = [];
                $list = M("type")->where("char_length(number) > $self_number_length and number LIKE '$self_number%' and status = 1")->field('id,pid,number')->select();

                //有子分类则开始处理下级的分类
                if($list){
                    foreach($list as $k=>$v){
                        $ret[$v['number']] = [
                            'id' => $v['id'],
                            'pid' => $v['pid'],
                            'number' => $v['number'],
                            'child' => ''
                        ];
                    }
                    $serialize_arr = common_number_tree($ret,'number',3);

                    foreach ($serialize_arr as $k=>$v){
                        $child = $v['child'];
                        changeSunNumber($child, $data);
                    }
                }

            }

            $is_number_exits = M("type")->where(['number'=> $data['number'],'status'=>1])->find();
            if($is_number_exits && $is_number_exits['id']!=$id){
                $this->ajaxReturn(['status'=>false,'msg'=>'此编号已被使用！']);
            }
            $res = M('type')->where($where)->save($data);
            if ($res) {
                $flag = ['status'=>true,'msg'=>'修改成功！'];
            }

        }
        $this->ajaxReturn($flag);
    }


    public function delClassify()
    {
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        $id = I("id");
        $w['pid'] = $id;
        $w['status'] = 1;
        $is_exits = M("modules_device")->where(['type'=>$id,'status'=>1])->find();
        if($is_exits){
            $this->ajaxReturn(["status"=>false, "msg"=>"有设备使用此分类，先删除对应分类设备！" , 'data' => [] ]);
        }
        $res = M('type')->where($w)->find();
        if ($res) {
            $flag  = ["status"=>false, "msg"=>"下有子分类，不能删除！"];
        }else{
            $where['id'] = $id;
            $res = M('type')->where($where)->delete();
            if ($res) {
                $flag  = ["status"=>true, "msg"=>"删除成功！"];
            }
        }        
        $this->ajaxReturn($flag);
    }

    public function specification(){
        $brands = M("brand")->where(['firmid'=>session('lastfirmid')])->select();
        $this->assign('brands',$brands);
        $this->display();
    }

    public function addBrand(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        is_firm_creator();
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
                $param['logoimg'] = $res['logoimg']['savepath'] . /*'thump' .*/ $res['logoimg']['savename'];
                // imgThump('./Uploads/typeico/'.$res['logoimg']['savepath'] . $res['logoimg']['savename'],'./Uploads/typeico/'.$param['logoimg'],30,30);
                $data['logoimg'] = '/Uploads/typeico/' . $param['logoimg'];
            }
        }
        $data['name'] = empty(I('name'))? null : I('name');
        if($data['name'] && M("brand")->where(['name' => $data['name'],'firmid'=>session('lastfirmid')])->find()){
            $this->ajaxReturn(["status"=>false, "msg"=>"品牌名称重复！"]);
        }
        $data['userid'] = session('user_auth')['uid'];
        $data['firmid'] = session('lastfirmid');
        $data['company'] = empty(I('company'))? null : I('company');
        $data['intro'] = empty(I('intro'))? null : I('intro');
        $res = M("brand")->add($data);
        if($res){
            $this->ajaxReturn(["status"=>true, "msg"=>"品牌添加成功！"]);
        }else{
            $this->ajaxReturn(["status"=>true, "msg"=>"品牌添加失败！"]);
        }
    }

    public function editBrand(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        is_firm_creator();
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
                $param['logoimg'] = $res['logoimg']['savepath'] . /*'thump' .*/ $res['logoimg']['savename'];
                // imgThump('./Uploads/typeico/'.$res['logoimg']['savepath'] . $res['logoimg']['savename'],'./Uploads/typeico/'.$param['logoimg'],30,30);
                $data['logoimg'] = '/Uploads/typeico/' . $param['logoimg'];
            }
        }
        $data['name'] = empty(I('name'))? null : I('name');
        if(I('company')) $data['company'] = I('company');
        if(I('intro')) $data['intro'] = I('intro');
        $data['userid'] = session('user_auth')['uid'];
        $data['firmid'] = session('lastfirmid');

        $res = M("brand")->where(['brand_id' =>I('brand_id')])->save($data);
        if($res){
            $this->ajaxReturn(["status"=>true, "msg"=>"品牌更新成功！"]);
        }else{
            $this->ajaxReturn(["status"=>true, "msg"=>"品牌更新失败！"]);
        }
    }

    public function delBrand(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        if(I('brand_id')) $res = M("brand")->where(['brand_id' =>I('brand_id')])->delete();
        if($res){
            $this->ajaxReturn(["status"=>true, "msg"=>"品牌删除成功！"]);
        }else{
            $this->ajaxReturn(["status"=>true, "msg"=>"品牌删除失败！"]);
        }

    }

/*型号管理*/
    public function typeNumber(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        //用来品牌切换显示数据 ajax
        if(IS_AJAX)
        {
            $brand_id = I('brand_id');
            $typedata = M('marking')->where(['firmid'=>session('lastfirmid'),'brand_id'=>$brand_id])->select();
            foreach ($typedata as $k=>$v){
                $typedata[$k]['brand_name'] = M('brand')->where(['brand_id'=>$v['brand_id']])->getField('name');
            }
            $this->ajaxReturn(["status"=>true, "msg"=>"" , 'data'=>$typedata]);

        }
        else
        {

            $typedata = M('marking')->where(['firmid'=>session('lastfirmid')])->select();
            foreach ($typedata as $k=>$v){
                $typedata[$k]['brand_name'] = M('brand')->where(['brand_id'=>$v['brand_id']])->getField('name');
            }
            $this->assign('typedata',$typedata);
            $this->assign('brands',M('brand')->where(['firmid'=>session('lastfirmid')])->select());
            $this->display('SystemSet/typeNumber');
        }

    }

    //型号添加
    public function addmarking(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        is_firm_creator();
        $data['intro'] = I('marking_intro','');
        $data['name'] = I('marking_name','');
        $data['event'] = I('marking_event','');
        $data['brand_id'] = I('brand_id','');
        $data['firmid'] = session('lastfirmid');
        $data['userid'] =  session('user_auth')['uid'];
        if(empty($data['name']) &&  $data['brand_id']) $this->ajaxReturn(["status"=>false, "msg"=>"参数错误" , 'data'=>[]]);
        if(M('marking')->where(['brand_id'=> $data['brand_id'],'name'=>$data['name']])->find())
        {
            $this->ajaxReturn(["status"=>false, "msg"=>"当前型号已存在" , 'data'=>[]]);
        }
        $res = M('marking')->add($data);
        if($res)
        {
            $this->ajaxReturn(["status"=>true, "msg"=>"添加成功" , 'data'=>['id'=>$res]]);
        }
        else
        {
            $this->ajaxReturn(["status"=>false, "msg"=>"添加失败" , 'data'=>[]]);
        }
    }

    //型号编辑
    public function editmarking(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        if( I('marking_intro','')){
            $data['intro'] = I('marking_intro','');
        }
        if( I('marking_name','')){
            $data['name'] = I('marking_name','');
        }
        if( I('marking_event','')){
            $data['event'] = I('marking_event','');
        }
        if( I('marking_id','')){
            $data['marking_id'] = I('marking_id','');
        }

        if( I('brand_id','')){
            $data['brand_id'] = I('brand_id','');
        }
        if(!$data['intro'] &&  !$data['name'] && !$data['marking_id']){
            $this->ajaxReturn(["status"=>false, "msg"=>"参数错误" , 'data'=>[]]);
        }
        if(!$data['marking_id']) $this->ajaxReturn(["status"=>false, "msg"=>"参数错误" , 'data'=>[]]);

        $res = M('marking')->where(['marking_id'=>$data['marking_id']])->save($data);
        if($res !== false)
        {
            $this->ajaxReturn(["status"=>true, "msg"=>"编辑成功" , 'data'=>['id'=>$res]]);
        }
        else
        {
            $this->ajaxReturn(["status"=>false, "msg"=>"编辑失败" , 'data'=>[]]);
        }
    }

    //型号删除
    public function delmarking(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();

        if(!I('marking_id','')) $this->ajaxReturn(["status"=>false, "msg"=>"参数错误" , 'data'=>[]]);

        $res = M('marking')->where(['marking_id'=>I('marking_id','')])->delete();
        if($res !== false)
        {
            $this->ajaxReturn(["status"=>true, "msg"=>"删除成功" , 'data'=>['id'=>$res]]);
        }
        else
        {
            $this->ajaxReturn(["status"=>false, "msg"=>"删除失败" , 'data'=>[]]);
        }
    }

    //版本管理
    public function editionMsg(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        //用来品牌切换显示数据 ajax
        if(IS_AJAX)
        {
            $brand_id = I('brand_id');
            $typedata = M('brand_version')->where(['firmid'=>session('lastfirmid'),'brand_id'=>$brand_id])->select();
            foreach ($typedata as $k=>$v){
                $typedata[$k]['brand_name'] = M('brand')->where(['brand_id'=>$v['brand_id']])->getField('name');
            }
            $this->ajaxReturn(["status"=>true, "msg"=>"" , 'data'=>$typedata]);

        }
        else
        {
            $typedata = M('brand_version')->where(['firmid'=>session('lastfirmid')])->select();
            foreach ($typedata as $k=>$v){
                $typedata[$k]['brand_name'] = M('brand')->where(['brand_id'=>$v['brand_id']])->getField('name');
            }
            $this->assign('typedata',$typedata);
            $this->assign('brands',M('brand')->where(['firmid'=>session('lastfirmid')])->select());
            $this->display();
        }
    }

    //版本新增
    public function addVersion(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        is_firm_creator();
        $data['intro'] = I('intro','');
        $data['name'] = I('name','');
        $data['brand_id'] = I('brandId','');
        $data['firmid'] = session('lastfirmid');
        $data['userid'] =  session('user_auth')['uid'];
        if(empty($data['name']) &&  $data['brand_id']) $this->ajaxReturn(["status"=>false, "msg"=>"参数错误" , 'data'=>[]]);
        if(M('marking')->where(['brand_id'=> $data['brand_id'],'name'=>$data['name']])->find())
        {
            $this->ajaxReturn(["status"=>false, "msg"=>"当前版本已存在" , 'data'=>[]]);
        }
        $res = M('brand_version')->add($data);
        if($res)
        {
            $this->ajaxReturn(["status"=>true, "msg"=>"添加成功" , 'data'=>['id'=>$res]]);
        }
        else
        {
            $this->ajaxReturn(["status"=>false, "msg"=>"添加失败" , 'data'=>[]]);
        }
    }

    public function editVersion(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
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
            $this->ajaxReturn(["status"=>false, "msg"=>"参数错误" , 'data'=>[]]);
        }
        if(!$data['version_id']) $this->ajaxReturn(["status"=>false, "msg"=>"参数错误" , 'data'=>[]]);

        $res = M('brand_version')->where(['version_id'=>$data['version_id']])->save($data);
        if($res !== false)
        {
            $this->ajaxReturn(["status"=>true, "msg"=>"编辑成功" , 'data'=>['id'=>$res]]);
        }
        else
        {
            $this->ajaxReturn(["status"=>false, "msg"=>"编辑失败" , 'data'=>[]]);
        }
    }

    public function delVersion(){
        if(!IS_ROOT){
            $this->error('未授权访问!');
        }
        exitstFirm();
        if(!I('versionId','')) $this->ajaxReturn(["status"=>false, "msg"=>"参数错误" , 'data'=>[]]);

        $res = M('brand_version')->where(['version_id'=>I('versionId','')])->delete();
        if($res !== false)
        {
            $this->ajaxReturn(["status"=>true, "msg"=>"删除成功" , 'data'=>['id'=>$res]]);
        }
        else
        {
            $this->ajaxReturn(["status"=>false, "msg"=>"删除失败" , 'data'=>[]]);
        }
    }
}