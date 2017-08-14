<?php
namespace Home\Controller;
class DeviceController extends AdminController {
    /**
     * 设备管理
     */
    // public function index()
    // {
    //     $list = \Home\Model\DeviceModel::deviceList($this->firmid);
    //     $tagtypes= \Home\Model\DeviceModel::tagtypes();
    //     $tagtypes = hd_array_column($tagtypes,[],'id');
    //     $list = array_map(function($v) use($tagtypes){
    //         $v['catename'] = $tagtypes[$v['type']]['name'];
    //         $v['groupid'] = $tagtypes[$v['type']]['id'];
    //         $v['state'] = $v['ip'] != '' ? '在线': '离线';
    //         $v['configsarr'] = json_decode($v['configs'], true);
    //         return $v;
    //     }, $list);

    //     $this->assign('tagtypes', $tagtypes);
    //     $this->assign('list', $list);
    //     $this->display();
    // }

    //设备分组已废弃
    // public function classify(){
    //     $uid = session('user_auth.uid');
    //     $where['userid'] = $uid;
    //     $list = M('types')->where($where)->select();
    //     $this->assign('list', $list);
    //     $this->display();
    // }

    //自动补用户设备，临时用
    public function autoaddd(){
        $userlist = M('User')->select();
        foreach ($userlist as $key => $value) {
            \Home\Model\MemberModel::newUserAddDevice($value);
        }
    }

    /**
     * 删除分组
     */
    // public function delClassify()
    // {
    //     $id = I("id");
    //     $where['id'] = $id;
    //     $res = M('types')->where($where)->delete();
    //     if ($res) {
    //         $flag  = ['status'=>true, 'msg'=>'删除成功！'];
    //     }
    //     $this->ajaxReturn($flag);
    // }

    /**
     * 新增与编辑分组
     */
    // public function classify_add_ok(){
    //     $firmid = session('lastfirmid');
    //     $userid = session('user_auth.uid');
    //     $classifyname = I('classifyname');
    //     $action = I("action");
    //     if ($classifyname) {
    //         if ($action == "addClassifyAction"){
    //         $data['name'] = $classifyname;
    //         $data['firmid'] = $firmid;
    //         $data['userid'] = $userid;
    //         $data['type'] = 1;
    //         $data['status'] = 1;
    //         $data['createtime'] = time();
    //             $res = M('types')->add($data);
    //             if ($res) {
    //                 $flag  = ['status'=>true, 'msg'=>'新增成功！'];
    //             }
    //         }

    //         if ($action == "editClassifyAction"){
    //             $where['id'] = I('id');
    //             $data['firmid'] = $firmid;
    //             $data['name'] = $classifyname;
    //             $data['createtime'] = time();
    //             $res = M('types')->where($where)->save($data);
    //             if ($res) {
    //                 $flag  = ['status'=>true, 'msg'=>'修改成功！'];
    //             }
    //         }

    //     }
    //     $this->ajaxReturn($flag);
    // }

    //新增与编辑参数
    public function addParam(){
        $flag  = ['status'=>false, 'msg'=>'操作失败！'];
        $firmid = session('lastfirmid');
        $userid = session('user_auth.uid');
        $paramName = I('paramName');
        $action = I("action");
        if ($paramName) {
            if ($action == "addparam"){
            $data['pid'] = I('id');
            $data['userid'] = $userid;
            $data['firmid'] = $firmid;
            $data['name'] = $paramName;
            $data['value'] = I('paramValue');
            $data['remarke'] = I('paramDesc');
            $data['type'] = I('paramType');
            $data['time'] = time();
                $res = M('paramet')->add($data);
                if ($res) {
                    $flag  = ['status'=>true, 'msg'=>'新增成功！'];
                }
            }

            if ($action == "editparam"){
                $where['id'] = I('paramid');
                $where['userid'] = $userid;
                $where['firmid'] = $firmid;
                $data['name'] = $paramName;
                $data['value'] = I('paramValue');
                $data['remarke'] = I('paramDesc');
                $data['time'] = time();
                $res = M('paramet')->where($where)->save($data);
                if ($res) {
                    $flag  = ['status'=>true, 'msg'=>'修改成功！'];
                }
            }
        }
        $this->ajaxReturn($flag);
    }

    //设备与参数绑定
    public function bindParam(){
        $flag  = ['status'=>false, 'msg'=>'操作失败！'];
        $where['parametid'] = I('id');
        $r = M('DeviceParamet')->where($where)->find();
        if ($r) {
            $data['paramvalue'] = I('paramvalue');
            $res = M('DeviceParamet')->where($where)->save($data);
        }else{
            $data['parametid'] = I('id');
            $data['deviceid'] = I('deviceid');
            $data['paramvalue'] = I('paramvalue');
            $res = M('DeviceParamet')->add($data);
        }
        if ($res) {
            $flag  = ['status'=>true, 'msg'=>'修改成功！'];
        }
        $this->ajaxReturn($flag);
    }

    /**
     * 删除参数
     */
    public function delParam()
    {
        $flag  = ['status'=>false, 'msg'=>'删除失败！'];
        $id = I("id");
        $where['id'] = $id;
        $res = M('paramet')->where($where)->delete();
        if ($res) {
            $w['parametid'] = I('id');
            $r = M('DeviceParamet')->where($w)->delete();
            $flag  = ['status'=>true, 'msg'=>'删除成功！'];
        }
        $this->ajaxReturn($flag);
    }

    //获取设备参数
    public function getParam(){
        $deviceid = I("deviceid");
        $firmid = session('lastfirmid');
        $userid = session('user_auth.uid');
        $w['userid'] = $userid;
        $w['firmid'] = $firmid;
        $paramet = M('paramet','','DB_CONFIG_LINK');
        $res = $paramet>alias('a')
            ->field('a.*,b.paramvalue')
            ->join("left join ".C('DB_PREFIX')."device_paramet as b on a.id = b.parametid and b.deviceid = $deviceid")
            ->where($w)
            ->select();
        $this->ajaxReturn($res);
    }

    //添加与编辑设备，在添加与编辑成功后主动查询设备在线状态
    public function editDevice()
    {
        $firmid = session('lastfirmid');
        /*不允许非机构创建者修改增加设备*/
        // if(!M("firm")->where(['id'=>$firmid,'userid'=>session("user_auth.uid")])->find()){
        //     $this->ajaxReturn(['status' => false, 'msg' => '非机构创建者，不能创建修改设备！']);
        // }
        if (!$firmid) {
            $flag = ['status' => false, 'msg' => '您没有所属机构，无法添加设备！'];
            $this->ajaxReturn($flag);
        } else {
            $id = I("id");
            $devicename = I("devicename");
            $uuid = I("uuid");
            $action = I("action");
            $remark = I("remark");
            $name = I("name");
            $password = I("password");
            $type = I('type');


            $flag = ['status' => false, 'msg' => '操作失败！'];

            if (empty($devicename) || (empty($uuid) && $id < 1)) {
                goto A;
            }

            $data = [
                'firmid' => $this->firmid,
                'userid' => $this->uid,
                'name' => $devicename,
                'intro' => $remark,
                // 'type' => \Home\Model\DeviceModel::LINK_TYPE_DEVICE,
                'type' => I('types'),
                'status' => 1,
                'state' => 0,
                'ip' => '',
                'configs' => '',
                'types' => $type,
                'brands_id' => I('brandId'),
                'marking_id' => I('markingId'),
                'version_id' => I('versionId')
            ];
            if (!empty($name) && !empty($password) ) {
                $arr_configs = [['name'=>$name,'pwd' =>$password]];
                $data['configs'] = json_encode($arr_configs);
            }

            //添加
            if ($action == "addDeviceAction") {
                $data['uuid'] = $uuid;
                $data['t'] = $this->autocheckT($uuid);
                $flag = \Home\Model\DeviceModel::editDevice($data);
                if($flag['status'] == true){
                    //触发新增设备自动共享给拥有全系统共享资源的设备
                    \Home\Model\DeviceModel::newDeviceBePush($uuid);
                }
                // if ($flag['status'] === true) {
                //     $param['device_id'] = $flag['id'];
                //     $param['time'] = time();
                //     M('VideoList')->add($param);
                // }
            }

            //编辑
            if ($action == "modifyDeviceAction") {
                $data2 = [
                'name' => $devicename,
                'intro' => $remark,
                // 'type' => \Home\Model\DeviceModel::LINK_TYPE_DEVICE,
                'type' =>I('types') ,
                'status' => 1,
                'state' => 0,
                'ip' => '',
                'types' => $type
            ];
                if(I('brandId')){
                    $data2['brands_id'] = I('brandId');
                }
                if(I('markingId')){
                    $data2['marking_id'] = I('markingId');
                }
                if(I('versionId')){
                    $data2['version_id'] = I('versionId');
                }
                if (!empty($name) && !empty($password) ) {
                    $arr_configs = [['name'=>$name,'pwd' =>$password]];
                    $data2['configs'] = json_encode($arr_configs);
                }
                if ($id > 0) {
                    $flag = \Home\Model\DeviceModel::editDevice($data2, $id);
                }
            }
        }

        //查询设备在线状态
        $this->soketsend($uuid);

        A:
        $this->ajaxReturn($flag);
    }

    //通过uuid自动判断其t值（矩阵序列号规则已变，但判断条件是32位，目前有效）
    public function autocheckT($uuid= ''){
        $classData = explode('_', $uuid);
        if ($classData[1] >= 0 && $classData[1] != null) {
            if ($classData[1] == 0) {
                $deviceT = 2;
            } else{
                $deviceT = $classData[1];
            }
        } else {
            if (strlen($classData[0]) == 32) {
                $deviceT = 3;
            }
        }
        return $deviceT;
    }

    //自动修正设备的T值
    public function autosetDeviceT(){
        $devicelist = M('ModulesDevice')->select();
        foreach ($devicelist as $key => $value) {
            $data['t'] = $this->autocheckT($value['uuid']);
            $flag = \Home\Model\DeviceModel::editDevice($data,$value['id']);
            var_dump($$data);
        }        
    }

    //发送soket指令
    public function soketsend($uuid=""){
        if ($uuid) {
            $mc = new \Memcached();
            $mc->addServer("localhost", 11211);
            $deviceInfo = $mc->get('device_info');
            $soketid = $deviceInfo[$uuid];
            if ($soketid) {
                M('ModulesDevice')->where(['uuid'=>$uuid])->save(['state' => 1]);
                $suuid = $soketid."$".$uuid;
                \Home\Model\DeviceModel::sendP2p($suuid);
            }

        }
    }

    // public function tsend(){
    //     $uuid = '54e63f300b6255b3c68d7d3f9767ffff';
    //     $mc = new \Memcached();
    //     $mc->addServer("localhost", 11211);
    //     $deviceInfo = $mc->get('device_info');
    //     $soketid = $deviceInfo[$uuid];
    //     if ($soketid) {
    //         M('ModulesDevice')->where(['uuid'=>$uuid])->save(['state' => 1]);
    //         $suuid = $soketid."$".$uuid;
    //         \Home\Model\DeviceModel::sendP2p($suuid);
    //     }
    // }

    /**
     * 删除设备
     */
    public function delDevice()
    {
        $id = I("id");
        $id = intval($id);
        $flag = ["status"=>false, "msg"=>'操作失败！'];
        // $flag = M("modules_device")->where(["id"=>$id])->delete();
        $where['id'] = $id;
        // $where['type'] = array('egt',0);
        $ss = M('Modules_device')->where($where)->delete();
        if($ss){
            $flag = ["status"=>true, "msg"=>'删除成功！', 'id'=>$id];
        }

        $this->ajaxReturn($flag);
    }

    /**
     * 获取经纬度
     */
    // public function getXy()
    // {
    //     $ret = \Home\Model\DeviceModel::getXy($this->firmid);
    //     $this->ajaxReturn($ret);
    // }

    /**
     * 设置经纬度
     */
    // public function setXy()
    // {
    //     $ip = I("ip");
    //     $lng = I('lng');
    //     $lat = I('lat');
    //     $status = I("status");

    //     if (empty($ip)){
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

    /*
     * 告警
     */
    public function alarmUser()
    {
        $alarmId = I('alarmId', '');
        if (!empty($alarmId)) {
            $uid = UID;
            $data = M('MapMark')->join('__MAP_LIST__ ON __MAP_MARK__.map_list_id = __MAP_LIST__.id')->where("link_map_list.uid = '$uid' AND matrix_id = '$alarmId'")->find();

            $mapListId = $data['map_list_id'];
            $mapType = $data['map_type'];

            $info['title'] = '报警通知';
            $info['content'] = '传感器报警！是否跳转到地图页查看报警信息？';
            $info['url'] = '/Map/mapManage/mapListId/' . $mapListId . '/mapType/' . $mapType . '/alarmId/' . $alarmId;
            pushSocketMsg('alarm', json_encode($info), $this->uid);
        }
    }

    //获取传感器数据
    public function getCGQvalue(){
        $type = I('type')?:'wd';
        //type1为温度2为湿度
        if ($type == '1') {
            $cgqlist = M('wendutable1','cgq_','DB_CONFIG_TEST');
        }
        if ($type == '2') {
            $cgqlist = M('201708-54e63f001092d8e5974ed8e92d01ffff-00-0000000001','cgq_','DB_CONFIG_TEST');
        }
        if ($cgqlist) {
            $res2 = $cgqlist->order(array('id'=>'desc'))->limit(100)->avg('Value');
            $res = $cgqlist->order(array('id'=>'desc'))->limit(1)->select();
            $res[0]['avg'] = $res2;
            $this->ajaxReturn($res);
        }else{
            $this->ajaxReturn('');
        }
    }
}