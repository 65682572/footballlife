<?php

namespace Home\Controller;

use Home\Model\DeviceModel;
use Home\Model\EventModel;
use Workerman\Events\Ev;

class AlertController extends AdminController
{
    public function alertOperation(){
        $this->display('Alert/alertOperation');
    }
    public function alertDevice(){
        $this->display('Alert/alertChild/alertDevice');
    }
    public function alertType(){
        $this->display('Alert/alertChild/alertType');
    }

    //事件列表
    public function alertEvent(){
        $eventmodel = new EventModel();
        $list = $eventmodel->getEventList();
        $this->assign('list',$list);
        $this->display('Alert/alertChild/alertEvent');
    }

    //新增
    public function addEvent(){
        $name = I('name');
        $code = I('code');
        $remark = I('remark');
        if(!$name){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写事件名称！']);
        }
        if(!$code){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写事件编码！']);
        }
        $data = [
            'name' => $name,
            'code' => $code,
            'remark' => $remark,
            'createtime' => time(),
            'user_id' => UID
        ];
        $eventmodel = new EventModel();
        if(!$eventmodel->checkData($data,'_table')){
            $this->ajaxReturn(['status' => false, 'msg' => $eventmodel->getError()]);
        }
        $res = $eventmodel->addEvent($data);
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '操作失败！']);
        }
    }

    //修改
    public function modifyEvent(){
        $id = I('id');
        $name = I('name');
        $code = I('code');
        $remark = I('remark');
        if(!$name){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写事件名称！']);
        }
        if(!$code){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写事件编码！']);
        }
        $data = [
            'name' => $name,
            'code' => $code,
            'remark' => $remark,
            'modifytime' => time(),
            'user_id' => UID
        ];
        $eventmodel = new EventModel();
        if(!$eventmodel->checkData($data,'_table',$id)){
            $this->ajaxReturn(['status' => false, 'msg' => $eventmodel->getError()]);
        }
        $res = $eventmodel->modifyEvent($data,$id);
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '操作失败！']);
        }
    }

    //删除
    public function delEvent(){
        $id = I('id');
        if(!$id){
            $this->ajaxReturn(['status' => false, 'msg' => '无效数据！']);
        }
        $eventmodel = new EventModel();
        $res = $eventmodel->delEvent($id);
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '操作失败！']);
        }
    }

    //响应列表
    public function alertMode(){
        $eventmodel = new EventModel();
        $list = $eventmodel->getResponseList();
        $this->assign('list',$list);
        $this->display('Alert/alertChild/alertMode');
    }

    //新增
    public function addResponse(){
        $name = I('name');
        $code = I('code');
        $remark = I('remark');
        if(!$name){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写响应名称！']);
        }
        if(!$code){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写响应编码！']);
        }
        $data = [
            'name' => $name,
            'code' => $code,
            'remark' => $remark,
            'createtime' => time(),
            'user_id' => UID
        ];
        $eventmodel = new EventModel();
        if(!$eventmodel->checkData($data,'_restable')){
            $this->ajaxReturn(['status' => false, 'msg' => $eventmodel->getError()]);
        }
        $res = $eventmodel->addResponse($data);
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '操作失败！']);
        }
    }

    //修改
    public function modifyResponse(){
        $id = I('id');
        $name = I('name');
        $code = I('code');
        $remark = I('remark');//print_r($remark);exit();
        if(!$name){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写响应名称！']);
        }
        if(!$code){
            $this->ajaxReturn(['status' => false, 'msg' => '请填写响应编码！']);
        }
        $data = [
            'name' => $name,
            'code' => $code,
            'remark' => $remark,
            'modifytime' => time(),
            'user_id' => UID
        ];
        $eventmodel = new EventModel();
        if(!$eventmodel->checkData($data,'_restable',$id)){
            $this->ajaxReturn(['status' => false, 'msg' => $eventmodel->getError()]);
        }
        $res = $eventmodel->modifyResponse($data,$id);
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '操作失败！']);
        }
    }

    //删除
    public function delResponse(){
        $id = I('id');
        if(!$id){
            $this->ajaxReturn(['status' => false, 'msg' => '无效数据！']);
        }
        $eventmodel = new EventModel();
        $res = $eventmodel->delResponse($id);
        if($res){
            $this->ajaxReturn(['status' => true, 'msg' => '操作成功！']);
        }else{
            $this->ajaxReturn(['status' => false, 'msg' => '操作失败！']);
        }
    }

    /*
     * 报警设置
     */
    public function rspList()
    {
        $eventModel = new EventModel();
        $list = $eventModel->getRspList(UID);
        $response = $eventModel->getResponseList();
        $event = $eventModel->getEventList();
        $device = DeviceModel::getAllDevices($this->firmid);
        $this->assign('response', $response);
        $this->assign('event', $event);
        $this->assign('device', $device);
        $this->assign('list', $list);
        $this->display('Alert/alertChild/alertBindLink');
    }

    /**
     * 新增报警设置
     */
    public function saveRelation(){
        $device = I('device');
        $event = I('event');
        $response = I('response');
        $remark = I('remark');
        $destination = I('destination','');
        $type = I('type',1);
        $id = I('id',0);
        if(!$device || !$event || !$response || !$type){
            $this->ajaxReturn(['status'=>false,'msg'=>'缺少参数']);
        }
        if($type == 2 && !$id){
            $this->ajaxReturn(['status'=>false,'msg'=>'无效数据']);
        }
        $data = [
            'firm_id' => $this->firmid,
            'user_id' => UID,
            'event_id' => $event,
            'response_id' => $response,
            'device_id' => $device,
            'time' => time(),
            'remark' => $remark,
            'destination' => $destination
        ];
        $eventModel = new EventModel();
        $res = $eventModel->saveRelation($data,$id,$type);
        if($res){
            $this->ajaxReturn(['status' => true,'msg'=>'操作成功']);
        }else{
            $this->ajaxReturn(['status' => false,'msg'=>'操作失败']);
        }
    }

    /**
     * 删除报警配置
     */
    public function deleteRelation(){
        $id = I('id',0);
        if(!$id){
            $this->ajaxReturn(['status'=>false,'msg'=>'无效数据']);
        }
        $eventModel = new EventModel();
        $res = $eventModel->deleteRelation($id);
        if($res){
            $this->ajaxReturn(['status' => true,'msg'=>'操作成功']);
        }else{
            $this->ajaxReturn(['status' => false,'msg'=>'操作失败']);
        }
    }

    public function test(){
        $code = I('code','');
        $device = I('device','');
        if(!$code || !$device){
            echo 'You must provide code and device of paramaters.';
            return;
        }
        $str = sprintf("2@%s@did@%s",$device,$code);
        $eventObj = new EventModel();
        $eventObj->triggerAlarm($str);
    }

    public function testAlert(){
        //http://www.msu7.net:2121/?type=alarm&to=102&content={%22title%22:%22test%22,%22content%22:%22%E6%B5%8B%E8%AF%95%E6%8A%A5%E8%AD%A6%EF%BC%8C%E8%B7%B3%E8%BD%AC%EF%BC%9F%22,%22url%22:%22/Map/mapManage%22}
        //http://www.msu7.net/Alert/testAlert?code=A001001&type=1&device=09090909_4
        //54e63f12212341260001000300000000
        $code = I('code','open');
        $uuid = I('uuid','54e63f12212341260001000300000000');
        $eventObj = new EventModel();
        if($code == 'open'){
            $func = 'openAlarm';
        }else{
            $func = 'eliminateAlarm';
        }
        $eventObj->$func($uuid);
    }

    public function pushSocketAlert($type = "", $content = '', $to = "")
    {
        $ch1 = curl_init();
        $post_data = array('type' => $type,'content' => $content,'to' => $to);
        curl_setopt($ch1, CURLOPT_URL, C('SITE_URL'));
        curl_setopt($ch1, CURLOPT_PORT, 2121);
        curl_setopt($ch1, CURLOPT_HEADER, 0);
        curl_setopt($ch1, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch1, CURLOPT_POST, 1);
        curl_setopt($ch1, CURLOPT_POSTFIELDS, $post_data);
        $cu = @curl_exec($ch1);
        curl_close($ch1);
        return $cu;
    }

    /**
     * 报警日志
     */
    public function alarmLog(){
        $eventModel = new EventModel();
        $userid = UID;
//        $list = $eventModel->getAlarmLog(0,$userid);
        $list = $eventModel->getAlarmLog();
        $this->assign('list', $list);
        $this->display('Alert/alertChild/alertLog');
    }
}