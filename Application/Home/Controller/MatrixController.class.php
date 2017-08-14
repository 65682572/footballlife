<?php

namespace Home\Controller;

use Home\Model\DeviceModel;
use Home\Model\MemberModel;

class MatrixController extends AdminController
{
    //成员登陆权限控制，应转移到OrganizationController控制器
    public function authControl()
    {
        $this->display();
    }

    /*ajax 所有页面返回矩阵*/
    public function commonAjaxDevice()
    {
        $result = \Home\Model\DeviceModel::deviceList($this->firmid);
        $this->ajaxReturn($result);
    }

    // /*ajax 返回左边菜单
    // */
    // public function ajaxGetLeftMenu()
    // {
    //     $pathName = I("pathName", '', 'trim');

    //     if (!$pathName) {
    //         $this->ajaxReturn(array('status' => false, 'data' => 'pathname为空.'));
    //     }
    //     $obj = M('category');
    //     $pi = $obj->where(array('point_templet' => $pathName))->find();

    //     if ($pi['pid']) {
    //         $pi = $obj->where(array('cateid' => $pi['pid']))->find();
    //         if ($pi['pid']) {
    //             $pi = $obj->where(array('cateid' => $pi['pid']))->find();
    //         }
    //     }

    //     $pathName = $pi['point_templet'];
    //     $pid = $obj->where(array('point_templet' => $pathName, 'pid' => 0))->getField('cateid');
    //     $getAllCate = $obj->where("pid = $pid")->select();
    //     $getAllCate = $this->getChildCate($obj, $getAllCate);

    //     echo json_encode($getAllCate, JSON_UNESCAPED_UNICODE);
    // }

    // /* ajaxGetLeftMenu 递归调用方法*/
    // public function getChildCate($obj, $getAllCate)
    // {
    //     foreach ($getAllCate as $k => $v) {
    //         $arr = $obj->where("pid = {$v['cateid']}")->select();
    //         if ($arr) {
    //             array_push($getAllCate[$k], $arr);
    //             $this->getChildCate($obj, $arr);

    //         } else {
    //             continue;
    //         }
    //     }
    //     return $getAllCate;
    // }

    //设备运维页展示
    public function index()
    {        
        $list = \Home\Model\DeviceModel::deviceList($this->firmid);
        $this->assign('list', $list);
        if (I('matrix_id')) {
            session('matrix_id', I('matrix_id'));
        }
        if (!empty(session('matrix_id'))) {

            $id = session('matrix_id');
            // $data = M('VideoList')->where("device_id = '$id'")->find();
            $device = M('ModulesDevice')->where("id = '$id'")->find();
            // if (!empty($data)) {
            $data = json_decode($data['data'], true);
            $this->assign('data', $data);
            $this->assign('id', $device['id']);
            $this->assign('matrixname', $device['name']);
            $this->assign('arrCount', count($data));
            // }
            $this->assign('matrixId', $device['uuid']);
        }
        $this->assign('matrix_id', session('matrix_id'));
        $this->display();

    }

    public function test()
    {

    }

    //ajax获取输入源列表，未完成未启用
    public function videoList()
    {
        if (IS_AJAX) {
            $id = I('post.id', '', 'intval');
            $data = I('post.data');
            if (is_string($data)) {
                $videoData = $data;
                $param = array(
                    'device_id' => $id,
                    'data' => $videoData,
                    'time' => time()
                );
                if (!empty($videoData)) {
                    $res = M('VideoList')->where("device_id = '$id'")->find();
                    if (empty($res)) {
                        M('VideoList')->add($param);
                    } else {
                        M('VideoList')->where("device_id = '$id'")->save($param);
                    }
                }
            } elseif (empty($data)) {

            }
        }
    }

    //给手机端使用的设备运维页
    public function indexAz()
    {
        $this->assign('uuid', I('uuid'));
        $input = M('video_list')->where(['device_serial' => I('uuid')])->getField('video_input');
        $this->assign('input', json_encode(unserialize($input)));
        $this->display();
    }

    public function getmodulelist()
    {
        $uid = session('user_auth.uid');
        $modulelist = M('MonitorModule')->where("userid = '$uid'")->select();        
        $this->ajaxReturn($modulelist);
    }

    public function modelMsg(){
        //模式列表
        $uid = session('user_auth.uid');
        $modulelist = M('MonitorModule')->where("userid = '$uid'")->select();
        $this->assign('modulelist', $modulelist);
        $this->display();
    }

    public function modelEdit(){
        $flag  = ['status'=>false, 'msg'=>'操作失败！'];
        $id = I('id')?:0;
        $name = I('name');
        $action = I('action');
        if ($action == "edit") {
            $data['name'] = $name;
            $res = M('MonitorModule')->where("id = $id")->save($data);
            if ($res) {
                $flag  = ['status'=>true, 'msg'=>'修改成功！'];
            }
        }
        if ($action == "del") {
            $res = M('MonitorModule')->where("id = $id")->delete();
            if ($res) {
                $flag  = ['status'=>true, 'msg'=>'删除成功！'];
            }
        }        
        $this->ajaxReturn($flag);
    }

    public function monitor()
    {
        $this->getLastOperation('home/matrix/monitor');
        $uid = session('user_auth.uid');
        $mapList = M('MapList')->where("uid = '$uid'")->select();
        $this->assign('mapList', $mapList);
        $usern = session('user_auth.username');
        $this->assign('username', $usern);
        //设备列表处理开始,已移入Admin下setdevicelist()函数
        $this->assign('list', $this->list);
        //页面还原数据与模式切换处理开始
        $moduleId = I('moduleId', '', 'intval');
        if (!empty($moduleId)) {
            $moduleData = M('MonitorModule')->where("userid = '$uid' AND id = '$moduleId'")->find();
            //保存当前切换
            $this->setOperation($moduleData['grid']);
            $this->assign('moduleId', $moduleData['grid']);
            $this->assign('mid', $moduleData['id']);
            $this->assign('modulename', $moduleData['name']);
            $this->assign('mymonitor', json_encode($moduleData));
        } else {
            $ww["userid"] = $uid;
            $ww["firmid"] = $this->firmid;
            $ww["type"] = 1;
            $mymonitor = M('operatelog')->where($ww)->find();
            $this->assign('mymonitor', json_encode($mymonitor));
        }
        //页面还原数据处理结束

        //模式列表
        $modulelist = M('MonitorModule')->where("userid = '$uid'")->select();
        $this->assign('modulelist', $modulelist);

        if (I('matrix_id')) {
            session('matrix_id', I('matrix_id'));
        }
        if (!empty(session('matrix_id'))) {
            $id = session('matrix_id');
            $data = M('VideoList')->where("device_id = '$id'")->find();
            $device = M('ModulesDevice')->where("id = '$id'")->find();
            // if (!empty($data)) {
            $data = json_decode($data['data'], true);
            $this->assign('data', $data);
            $this->assign('id', $device['id']);

            $this->assign('matrixname', $device['name']);
            $this->assign('arrCount', count($data));
            // }

        }
        //我有权限的设备列表，供js用
        $this->assign('mydevice', json_encode($list));
        //当前矩阵的uuid
        $this->assign('matrix_id', session('matrix_id'));
        //设备分类树
        $typetree = $this->typetree($list);
        $this->assign('typetree', $typetree);
        $this->display();
    }

    //分类树
    public function typetree($list)
    {
        $type = M("Type")->where(['status' => 1])->select();
        foreach ($type as $key => $value) {
            foreach ($list as $i => $b) {
                if ($value['id'] == $b['type']) {

                    $ww['device_serial'] = $b['uuid'];
                    $vlist = M('VideoList')->where($ww)->getField('video_input');

                    if ($vlist) {
                        $b['videolist'] = unserialize($vlist);
                    }
                    $type[$key]['devices'][] = $b;
                }
            }
        }

        function findChild(&$arr, $id, $list)
        {
            $childs = array();
            foreach ($arr as $k => $v) {
                if ($v['pid'] == $id) {
                    $childs[] = $v;
                }
            }
            return $childs;
        }

        function build_tree($rows, $root_id, $list)
        {
            $childs = findChild($rows, $root_id, $list);
            if (empty($childs)) {
                return null;
            }
            foreach ($childs as $k => $v) {
                $rescurTree = build_tree($rows, $v['id']);
                if (null != $rescurTree) {
                    $childs[$k]['childs'] = $rescurTree;
                }
            }
            return $childs;
        }

        $tree = build_tree($type, 0, $list);
        return $tree;
    }

    //分类树 jstree 地图api用
    public function typeTreeTwo($list)
    {
        $type = M("Type")->where(['status' => 1])->select();
        foreach ($type as $key => $value) {
//            $type[$key]['id'] = 'id_' . $value['id'];
            $type[$key]['text'] = $value['name'];
            foreach ($list as $i => $b) {
                $list[$i]['text'] = $b['name'];
                if ($value['id'] == $b['type']) {
                    $ww['device_serial'] = $b['uuid'];
                    $vlist = M('VideoList')->where($ww)->getField('video_input');

                    if ($vlist) {
                        $newvlist = unserialize($vlist);
                        foreach ($newvlist as $k => $v) {
                            $newvlist[$k]['text'] = $v['name'];
                            $newvlist[$k]['id'] = $b['uuid'] . '_' . $v['id'] . '_0';
                            $newvlist[$k]['isneed'] = 'true';
                            if(!empty($v['grName'])){
                                $childarr = explode(',',$v['grName']);
                                foreach($childarr as $ck => $cv){
                                    $childarr[$ck] = [
                                        'id' => $b['uuid'] . '_' . $v['id'] . '_' . ($ck+1),
                                        'text' => $cv,
                                        'isneed'=>'true',
                                        'isleaf'=>'true'
                                    ];
                                }
                                $newvlist[$k]['children'] = $childarr;
                            }
                        }
                        if($b['addnewcol']){
                            array_unshift($newvlist,['id'=>$b['uuid'].'_all_0','text'=>'自动共享该设备：'.$b['name'],'isneed'=>'true']);
                        }
                        $b['children'] = $newvlist;
                    }
                    $type[$key]['children'][] = $b;
                }
            }
        }

        function findChild(&$arr, $id, $list)
        {
            $childs = array();
            foreach ($arr as $k => $v) {
                if ($v['pid'] == $id) {
                    $childs[] = $v;
                }
            }
            return $childs;
        }

        function build_tree($rows, $root_id, $list)
        {
            $childs = findChild($rows, $root_id, $list);
            if (empty($childs)) {
                return null;
            }
            foreach ($childs as $k => $v) {
                $rescurTree = build_tree($rows, $v['id']);
                if (null != $rescurTree) {
                    $childs[$k]['children'] = $rescurTree;
                }
            }
            return $childs;
        }

        $tree = build_tree($type, 0, $list);
        return $tree;
    }

    /**
     * 新增与编辑操作记录，保存首页用户操作的最终结果，供操作还原用
     */
    public function monitor_log()
    {
        $firmid = session('lastfirmid');
        // if (!$firmid) {
        //     $flag  = ['status'=>true, 'msg'=>'您的所属机构信息异常，操作失败！'];
        //     $this->ajaxReturn($flag);
        // }else{
        $userid = session('user_auth.uid');
        $description = I('description');
        $where["userid"] = $userid;
        $where["type"] = 1;
        $r = M("operatelog")->where($where)->getfield("id");

        if ($r) {
            $w["id"] = $r;
            $data2['description'] = $description;
            $data2['firmid'] = $firmid;
            $data2['createtime'] = time();
            $res = M('operatelog')->where($w)->save($data2);

        } else {
            $data['description'] = $description;
            $data['firmid'] = $firmid;
            $data['userid'] = $userid;
            $data['type'] = 1;
            $data['modulesid'] = 0;
            $data['createtime'] = time();
            $res = M('operatelog')->add($data);
        }

        // if ($res) {
        //     $flag  = ['status'=>true, 'msg'=>'新增成功！'];
        // }
        // }
        $this->ajaxReturn($res);
    }

    //前台随机生成传感器数据并保存（已废弃）
    public function eledata_log()
    {
        // $firmid = session('lastfirmid');
        // if (!$firmid) {
        //     $flag  = ['status'=>true, 'msg'=>'您的所属机构信息异常，操作失败！'];
        //     $this->ajaxReturn($flag);
        // }else{
        // $userid = session('user_auth.uid');
        $deviceid = I('deviceid');
        $action = I('action');
        if ($deviceid) {
            if ($action == 'get') {
                $w['deivceid'] = $deviceid;
                $res = M('element')->where($w)->limit('20')->select();
                foreach ($res as $key => $value) {
                    $flag[]['name'] = $value['name'];
                    $v = [$value['name'], $value['value']];
                    $flag[]['value'] = $v;
                }
                $this->ajaxReturn(json_encode($flag));
            } else {
                $name = I('name');
                $value = I('value');
                $type = I('type');
                $data['name'] = $name;
                $data['deviceid'] = I('deviceid');
                $data['value'] = implode('|', $value);
                $data['type'] = $type;
                $data['time'] = time();
                $res = M('element')->add($data);
            }
        }
    }

    /**
     * 新增与编辑首页模式
     */
    public function monitor_module()
    {
        $firmid = session('lastfirmid');
        $userid = session('user_auth.uid');
        $action = I('action');
        $name = I('name');
        $description = I('description');
        $grid = I('grid');
        if ($action == "add") {
            $repe = $this->anti_repe("MonitorModule", "name", $name);
            if ($repe) {
                $flag = ['status' => false, 'msg' => '模式名重复！'];
                $this->ajaxReturn($flag);
            } else {
                $data['description'] = $description;
                $data['firmid'] = $firmid;
                $data['grid'] = $grid;
                $data['name'] = $name;
                $data['userid'] = $userid;
                $data['type'] = 1;
                $data['createtime'] = time();
                $res = M('MonitorModule')->add($data);
                if ($res) {
                    $flag = ['status' => true, 'msg' => '添加模式成功！'];
                } else {
                    $flag = ['status' => false, 'msg' => '添加模式失败！'];
                }

            }
        }

        if ($action == "save") {
            $id = I('id');
            if (!$id) {
                $flag = ['status' => false, 'msg' => '您未选择模式！'];
                $this->ajaxReturn($flag);
            }
            $w["id"] = $id;
            $data2['grid'] = $grid;
            $data2['description'] = $description;
            $data2['createtime'] = time();
            $res = M('MonitorModule')->where($w)->save($data2);
            if ($res) {
                $flag = ['status' => true, 'msg' => '保存模式成功！'];
            } else {
                $flag = ['status' => false, 'msg' => '未选择模式无法保存！'];
            }
        }
        $this->ajaxReturn($flag);
    }

    //查找指定数据表里指定字段等于指定值的单行
    public function anti_repe($date = "", $field = "", $value = "")
    {
        $where[$field] = $value;
        $res = M($date)->where($where)->find();
        return $res;
    }

    //模糊查找某矩阵的输入源数据，矩阵uuid包含搜索关键词
    public function searchKeyword()
    {
        if (IS_AJAX) {
            $keyword = I('post.keyword');
            $id = session('matrix_id');
            $data = M('VideoList')->where("device_id = '$id'")->find();
            $search_arr = array();
            if (!empty($keyword) && !empty($data)) {
                $data = json_decode($data['data'], true);
                foreach ($data as $k => $v) {
                    if (strstr($v['name'], $keyword)) {
                        $search_arr[$k] = $v;
                    }
                }
                if (!empty($search_arr)) {
                    $this->ajaxReturn($search_arr);
                }
            }
        }
    }

    /**
     * 设备管理
     */
    public function deviceMsg()
    {
        $list = \Home\Model\DeviceModel::deviceList($this->firmid);
        $tagtypes = \Home\Model\DeviceModel::tagtypes();
        $tagtypes = hd_array_column($tagtypes, [], 'id');
        foreach ($list as $k => $v) {
            $where['id'] = $v["firmid"];
            $list[$k]['firmName'] = M('firm')->where($where)->getField('name');
            if ($v["types"]) {
                $w['id'] = $v["types"];
                $list[$k]['typesName'] = M('types')->where($w)->getField('name');
            }
            if ($v["type"]) {
                $w2['id'] = $v["type"];
                $list[$k]['catename'] = M('type')->where($w2)->getField('name');
            }
            if($v["brands_id"]){
                $w3['brand_id'] = $v["brands_id"];
                $list[$k]['brand_name'] = M('brand')->where($w3)->getField('name');
            }
            if($v["marking_id"]){
                $w4['marking_id'] = $v["marking_id"];
                $list[$k]['marking_name'] = M('marking')->where($w4)->getField('name');
            }
            if($v["version_id"]){
                $w5['version_id'] = $v["version_id"];
                $list[$k]['version_name'] = M('brand_version')->where($w5)->getField('name');
            }
        }
//        $list = \Home\Model\DeviceModel::getDeviceList($this->firmid,UID);

        $list = array_map(function ($v) use ($tagtypes) {
            // $v['catename'] = $tagtypes[$v['types']]['name'];
            // $v['groupid'] = $tagtypes[$v['types']]['id'];
            $v['state'] = $v['state'] != 0 ? '在线' : '离线';
            $v['configsarr'] = json_decode($v['configs'], true);
            $v['configs'] =  json_decode($v['configs'], true);
            return $v;
        }, $list);
        //错开的分类
        $list3 = M('type')->order('id desc')->select();
        $list3 = \Home\Model\DeviceModel::get_level_type($list3);
        $this->assign('list3', $list3);
        //参数
        $paramlist = \Home\Model\DeviceModel::paramList();
        $this->assign('paramlist', $paramlist);
        //品牌
        $brands = M("brand")->where(['firmid' => session('lastfirmid')])->select();
        foreach ($brands as $k => $v) {
            $brands[$k]['marking'] = M("marking")->where(['brand_id' => $v['brand_id']])->select();
            $brands[$k]['version'] = M("brand_version")->where(['brand_id' => $v['brand_id']])->select();
        }
//        $sharedata = \Home\Model\DeviceModel::getShareMap();
//        $sharelist = \Home\Model\DeviceModel::unionOneDestination($sharedata);
        $typearr = array_filter(array_unique(array_column($list,'typesName')));
        $this->assign('typearr', $typearr);
        $firmarr = array_filter(array_unique(array_column($list,'firmName')));
        $this->assign('firmarr', $firmarr);
        $catearr = array_filter(array_unique(array_column($list,'catename')));
        $this->assign('catearr', $catearr);
        $this->assign('brands', $brands);
        $this->assign('json_brands', json_encode($brands));
        $uid = session('user_auth.uid');
        $where['userid'] = $uid;
        $list2 = M('types')->where($where)->select();
        $this->assign('list2', $list2);
        $this->assign('tagtypes', $tagtypes);
        $this->assign('list', $list);
        $this->display();

    }


    /**
     * 删除分组
     */
    public function delClassify()
    {
        $id = I("id");
        $where['id'] = $id;
        $res = M('types')->where($where)->delete();
        if ($res) {
            $flag = ['status' => true, 'msg' => '删除成功！'];
        }
        $this->ajaxReturn($flag);
    }

    /**
     * 新增与编辑分组
     */
    public function classify_add_ok()
    {
        $firmid = session('lastfirmid');
        if (!$firmid) {
            $flag = ['status' => true, 'msg' => '您的所属机构信息异常，操作失败！'];
            $this->ajaxReturn($flag);
        } else {
            $userid = session('user_auth.uid');
            $classifyname = I('classifyname');
            $action = I("action");
            if ($classifyname) {
                if ($action == "addClassifyAction") {
                    $data['name'] = $classifyname;
                    $data['firmid'] = $firmid;
                    $data['userid'] = $userid;
                    $data['type'] = 1;
                    $data['status'] = 1;
                    $data['createtime'] = time();
                    $res = M('types')->add($data);
                    if ($res) {
                        $flag = ['status' => true, 'msg' => '新增成功！'];
                    }
                }

                if ($action == "editClassifyAction") {
                    $where['id'] = I('id');
                    $data['firmid'] = $firmid;
                    $data['name'] = $classifyname;
                    $data['createtime'] = time();
                    $res = M('types')->where($where)->save($data);
                    if ($res) {
                        $flag = ['status' => true, 'msg' => '修改成功！'];
                    }
                }

            }
        }
        $this->ajaxReturn($flag);
    }

    /**
     * 获取经纬度(已废弃)
     */
    // public function getXy()
    // {
    //     $ret = \Home\Model\DeviceModel::getXy($this->firmid);
    //     $this->ajaxReturn($ret);
    // }

    /**
     * 设置经纬度(已废弃)
     */
    // public function setXy()
    // {
    //     $ip = I("ip");
    //     $lng = I('lng');
    //     $lat = I('lat');
    //     $status = I("status");

    //     if (empty($ip)) {
    //         $this->ajaxReturn(['status' => false, 'msg' => 'IP地址不能为空']);
    //     }

    //     $data = [
    //         'lng' => $lng,
    //         'lat' => $lat,
    //         'status' => $status
    //     ];
    //     $ret = \Home\Model\DeviceModel::setXy($data, $this->firmid, $ip);

    //     $this->ajaxReturn($ret);
    // }

    //测试代码
    public function test1()
    {
        // $res = pushSocketMsg("publish", $res2['name'] . '设备' . '【' . $res1['name'] . '】' . "掉线了！");
        $mc = new \Memcached();
        $mc->addServer("localhost", 11211);
        $deviceInfo = $mc->get('device_info');
        
        var_dump($deviceInfo);

    }

    public function getDeviceListForShareDevice()
    {
        $list = M('ModulesDevice')->where('status = 1')->order("id desc")->select();
        foreach ($list as $k => $v) {
            $where['id'] = $v["firmid"];
            $list[$k]['firmName'] = M('firm')->where($where)->getField('name');
            if ($v["type"]) {
                $w['id'] = $v["type"];
                $list[$k]['typesName'] = M('type')->where($w)->getField('name');
            }
            if ($v["types"]) {
                $w2['id'] = $v["types"];
                $list[$k]['catename'] = M('types')->where($w2)->getField('name');
            }
            $rs = $v['type'];
            while ($rs > 0) {
                $ppid = $rs;
                $w3['id'] = $rs;
                $rs = M('Type')->where($w3)->getfield('pid');
            }
            $list[$k]['ppid'] = $ppid;
        }
        $typetree = $this->typetreeTwo($list);

        $this->ajaxReturn($typetree);

    }

    public function getDeviceListForAddDevice()
    {
        $list = \Home\Model\DeviceModel::deviceList($this->firmid);
        $list = getArrayUniqueByKeys($list);
        $tagtypes = \Home\Model\DeviceModel::tagtypes();
        $tagtypes = hd_array_column($tagtypes, [], 'id');

        foreach ($list as $k => $v) {
            $where['id'] = $v["firmid"];
            $list[$k]['firmName'] = M('firm')->where($where)->getField('name');
            if ($v["types"]) {
                $w['id'] = $v["types"];
                $list[$k]['typesName'] = M('type')->where($w)->getField('name');
            }
            if ($v["type"]) {
                $w2['id'] = $v["type"];
                $list[$k]['catename'] = M('types')->where($w2)->getField('name');
            }

        }
        $list = array_map(function ($v) use ($tagtypes) {
            // $v['catename'] = $tagtypes[$v['types']]['name'];
            // $v['groupid'] = $tagtypes[$v['types']]['id'];
            $v['state'] = $v['state'] != 0 ? '在线' : '离线';
            $v['configsarr'] = json_decode($v['configs'], true);
            return $v;
        }, $list);

        if (!empty($list)) {
            $this->ajaxReturn(['status' => true, 'data' => $list]);
        } else {
            $this->ajaxReturn(['status' => false, 'msg' => '请添加设备后再进行分享']);
        }

    }

    public function searchOrg()
    {
        if (IS_AJAX) {
            $keyword = I('post.keyword', '', 'trim');
            if (!empty($keyword)) {
                $res = M('Firm')->where("id LIKE '%$keyword%' or name LIKE '%$keyword%'")->select();
                if ($res) {
                    $this->ajaxReturn(['status' => true, 'data' => $res]);
                } else {
                    $this->ajaxReturn(['status' => false, 'msg' => '未找到相关机构信息']);
                }
            }
        }
    }

    public function addShareList()
    {
        if (IS_AJAX) {
            $dataDevice = I('post.dataDevice'); //设备
            $dataOrg = I('post.dataOrg'); //机构
            $resData = serialize(I('post.resData')); //资源
            $shareListModel = M('ShareList');

            if (empty($dataDevice) && empty($dataOrg)) {
                $this->ajaxReturn(['status' => false, 'msg' => '请选择需要共享设备或机构']);
            }
            if (empty($resData)) {
                $this->ajaxReturn(['status' => false, 'msg' => '请选择需要被共享的资源']);
            }

            if (!empty($dataOrg)) {
                $allFirm = $shareListModel->field('firm_id')->select();
                foreach ($allFirm as $v) {
                    foreach ($dataOrg as $v1) {
                        if ($v['firm_id'] == $v1) {
                            $this->ajaxReturn(['status' => false, 'msg' => '无法共享给已共享过的机构，请进入共享管理页面编辑']);
                        }
                    }
                }
                $shareListModel->startTrans();
                foreach ($dataOrg as $v) {
                    $data['user_id'] = UID;
                    $data['type'] = 1;
                    $data['firm_id'] = $v;
                    $data['device_id'] = 0;
                    $data['resource'] = $resData;
                    $data['time'] = time();
                    $res = $shareListModel->add($data);
                    if (!$res) {
                        $shareListModel->rollback();
                        $this->ajaxReturn(['status' => false, 'msg' => '添加失败']);
                    }
                }
            }

            if (!empty($dataDevice)) {
                $allMatrix = $shareListModel->field('device_id')->select();
                foreach ($allMatrix as $v) {
                    foreach ($dataDevice as $v1) {
                        if ($v['share_matrix_id'] == $v1) {
                            $this->ajaxReturn(['status' => false, 'msg' => '无法共享已共享过的设备，请进入共享管理页面编辑']);
                        }
                    }
                }
                foreach ($dataDevice as $v) {
                    $data['user_id'] = UID;
                    $data['type'] = 2;
                    $data['firm_id'] = 0;
                    $data['device_id'] = $v;
                    $data['resource'] = $resData;
                    $data['time'] = time();
                    $res = M('ShareList')->add($data);
                    if (!$res) {
                        $shareListModel->rollback();
                        $this->ajaxReturn(['status' => false, 'msg' => '添加失败']);
                    }
                }
            }

            if ($res) {
                $shareListModel->commit();
                $this->ajaxReturn(['status' => true, 'msg' => '添加成功']);
            }
        }
    }

    public function getResource()
    {
        $id = I('post.id');
        $uid = UID;

        $res = M('ShareList')->field('resource')->where("user_id = $uid AND id = $id")->find();

        if ($res) {
            $this->ajaxReturn(['status' => true, 'data' => unserialize($res['resource'])]);
        } else {
            $this->ajaxReturn(['status' => false, 'msg' => '查询错误']);
        }
    }
    public function getResourceForMatrixId()
    {
        $id = I('post.id');
        $uid = UID;

        if (!empty($id)) {
            $res = M('ShareList')->field('resource')->where("user_id = $uid AND device_id = $id")->find();

            if ($res) {
                $this->ajaxReturn(['status' => true, 'data' => unserialize($res['resource'])]);
            } else {
                $this->ajaxReturn(['status' => false, 'msg' => '该设备暂未添加共享']);
            }
        } else {
            $this->ajaxReturn(['status' => false, 'msg' => '参数错误']);
        }

    }

    public function editShareList()
    {
        $uid = UID;
        $shareId = I('post.id');
        $resource = serialize(I('post.resource'));
        $data['resource'] = $resource;
        if (empty($resource)) {
            $this->ajaxReturn(['status' => false, 'msg' => '没有选中任何设备']);
        }
        $res = M('ShareList')->where("id = $shareId AND user_id = $uid")->save($data);

        if ($res) {
            $this->ajaxReturn(['status' => true, 'msg' => '修改成功']);
        } else {
            $this->ajaxReturn(['status' => false, 'msg' => '修改失败']);
        }
    }

    public function editShareListForMatrixId()
    {
        $uid = UID;
        $shareId = I('post.id');
        $resource = serialize(I('post.resource'));
        $data['resource'] = $resource;
        if (empty($resource)) {
            $this->ajaxReturn(['status' => false, 'msg' => '没有选中任何设备']);
        }
        $res = M('ShareList')->where("device_id = $shareId AND user_id = $uid")->save($data);

        if ($res) {
            $this->ajaxReturn(['status' => true, 'msg' => '修改成功']);
        } else {
            $this->ajaxReturn(['status' => false, 'msg' => '修改失败']);
        }
    }

    public function delShareList()
    {
        $uid = UID;
        $deleteId = I('post.id');
        $res = M('ShareList')->where("id = $deleteId AND user_id = $uid")->delete();

        if ($res) {
            $this->ajaxReturn(['status' => true, 'msg' => '删除成功']);
        } else {
            $this->ajaxReturn(['status' => false, 'msg' => '删除失败']);
        }
    }

    public function shareDeviceManage()
    {
        $uid = UID;
        $shareList = M('ShareList')
            ->field('link_share_list.*, a.name as firmname, b.name as devicename')
            ->join('__FIRM__ a on __SHARE_LIST__.firm_id = a.id', 'left')
            ->join('__MODULES_DEVICE__ b on __SHARE_LIST__.device_id = b.id', 'left')
            ->where("user_id = $uid")->select();
        $this->assign('shareList', $shareList);
        $this->display();
    }

    public function shareAuth()
    {
        $matrixId = I('');

    }

    //ajax获取curl数据
    public function get_curl($url = "")
    {
        $url = I('url');
        $ch1 = curl_init();
        // $post_data = array('type' => $type,'content' => $content,'to' => $to);
        curl_setopt($ch1, CURLOPT_URL, $url);
        curl_setopt($ch1, CURLOPT_HEADER, 0);
        curl_setopt($ch1, CURLOPT_RETURNTRANSFER, 1);
        $cu = curl_exec($ch1);
        curl_close($ch1);
        $this->ajaxReturn($cu);
    }
    public function getShareByDevice(){
//        G('begin');
        $did = I('did');
        if(!$did){
            $this->ajaxReturn(['status' => false, 'msg' => '设备不合法！']);
        }
        $res = \Home\Model\DeviceModel::getShareByDid($did);
//        G('end');
//        \Think\Log::write(G('begin','end').'s','INFO','','');
        $this->ajaxReturn(['status' => true, 'msg' => '','data' => $res]);
    }

    /**
     * 共享列表
     */
    public function shareList(){
        $firmid = session('lastfirmid');
        if(!$firmid){
            $shareConfig = [];
        }else{
            $shareConfig = \Home\Model\DeviceModel::getShareConfig($firmid);
        }
        $this->assign('shareConfig',$shareConfig);
        $this->display();
    }
    /**
     *
     */
    public function getConfigById(){
        $id = I('post.id');
        if(!$id){
            $this->ajaxReturn(['status' => false, 'msg' => '无效数据']);
        }
        $res = DeviceModel::getConfigById($id);
        if(!empty($res)){
            $this->ajaxReturn(['status' => true, 'msg' => '', 'data' => $res]);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '无效数据']);
        }
    }

    /**
     * 获取所有的设备
     * 1：机构 2设备
     */

    public function getAllDeviceAndOrg(){
        $fid = session('lastfirmid');
        if(!$fid){
            $this->ajaxReturn(['status' => false, 'msg' => '无对应机构']);
        }
        $device = \Home\Model\DeviceModel::getAllDevices($fid);
        if(empty($device)){
            $this->ajaxReturn(['status' => false, 'msg' => '无设备信息，请先添加设备']);
        }
        array_unshift($device,['uuid'=>'all','name'=>'所有设备']);
        $data = [
            'device' => [
                'data' => $device,
            ],
        ];
        $this->ajaxReturn(['status' => true, 'msg' => '', 'data' => $data]);
    }

    /**
     * 获取所有资源
     */
    public function getAllResource()
    {
        $firmid = session('lastfirmid');
//        $list = M('ModulesDevice')->where("status = 1 and firmid = {$firmid}")->field('\'addnewcol\',id,name,uuid,type')->order("id desc")->select();
//        $typetree = $this->typetreeTwo($list);
//        array_unshift($typetree,['id'=>'all_0_0','text'=>'所有资源','isneed'=>'true']);//print_r($typetree);exit();
        if(!$firmid){
            $this->ajaxReturn(['status' => false, 'msg' => '无对应机构']);
        }
        $typetree = \Home\Model\DeviceModel::getAllResourceType($firmid);
        if(!empty($typetree)){
            array_unshift($typetree,['id'=>'all_0_0','text'=>'所有资源','isneed'=>'true']);
        }
        $this->ajaxReturn($typetree);
    }

    /**
     * 资源删除
     */
    public function shareDel(){
        $did = I('post.did');
        $res = \Home\Model\DeviceModel::deleteShare($did);
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '操作失败！']);
        }
    }

    /**
     * 共享保存
     */
    public function shareSave()
    {
        $deviceData = I('post.dataDevice'); //设备
        $resData = I('post.resData'); //资源
        $savetype = I('post.savetype');//1新增  2修改
        $configname = I('post.configname','');
        $firmid = session('lastfirmid');
        if(!is_array($deviceData)){
            $deviceData = (array)$deviceData;
        }
        if(!empty($deviceData)){
            $deviceData = \Home\Model\DeviceModel::buildDevData($deviceData);//过滤设备数据
            $resData = \Home\Model\DeviceModel::buildResData($resData);//过滤资源数据
            $saveData = \Home\Model\DeviceModel::buildData($deviceData,$resData);
            if($savetype == 2){
                \Home\Model\DeviceModel::deleteShareByDid($deviceData);
            }else{
                \Home\Model\DeviceModel::dealConfig(1,$resData,$deviceData,$configname,0,0,0,$firmid);
            }
            $res = \Home\Model\DeviceModel::saveShareAndLog($saveData,$deviceData,$resData,0,0,$firmid);
            $this->ajaxReturn($res);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '请先选择设备！']);
        }
    }

    /**
     * 共享配置修改
     */
    public function shareConfigSave()
    {
        $id = I('post.id',0);
        $configname = I('post.configname','');
        $deviceData = I('post.dataDevice'); //设备
        $resData = I('post.resData'); //资源
        $firmid = session('lastfirmid');
        if(!is_array($deviceData)){
            $deviceData = (array)$deviceData;
        }
        if(!$id){
            $this->ajaxReturn(['status' => false, 'msg' => '无效配置项！']);
        }
        if(!empty($deviceData)){
            $deviceData = \Home\Model\DeviceModel::buildDevData($deviceData);//过滤设备数据
            $resData = \Home\Model\DeviceModel::buildResData($resData);//过滤资源数据
            $res = \Home\Model\DeviceModel::dealConfig(2,$resData,$deviceData,$configname,$id,0,0,$firmid);
            if($res){
                $saveData = \Home\Model\DeviceModel::buildData($deviceData,$resData);
                $res = \Home\Model\DeviceModel::saveShareAndLog($saveData,$deviceData,$resData,0,0,$firmid);
                $this->ajaxReturn($res);
            }else{
                $this->ajaxReturn(['status' => false, 'msg' => '修改共享配置失败！']);
            }
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '请先选择设备！']);
        }
    }
    /**
     * 共享配置删除
     */
    public function deleteConfig(){
        $id = I('post.id');
        if(!$id){
            $this->ajaxReturn(['status' => false, 'msg' => '无效配置项！']);
        }
        $res = \Home\Model\DeviceModel::deleteConfig($id);
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '删除成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '删除失败！']);
        }
    }
public function aa(){
    header('Content-type:html/text;charset=utf-8');
//    $a = DeviceModel::buildApiShare('15874275350_1');
    header('content-type:html/text;charset=utf-8');
    $a = DeviceModel::buildConfigFile('18675236452_0');
    print_r($a);
}
    /**
     * 共享操作日志列表
     */
    public function shareLog()
    {
        $firmid = session('lastfirmid');
        $shareConfig = \Home\Model\DeviceModel::getShareConfig($firmid);
        $this->assign('shareConfig',$shareConfig);
        $this->display();
    }

}
