<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2017/7/21
 * Time: 16:05
 */
namespace Home\Model;

use Think\Exception;
use Think\Model;

class EventModel
{
    private $_table = 'alarm_event';
    private $_restable = 'alarm_response';
    private $_rspTable = 'alarm_relationship';
    private $_deviceTable = 'modules_device';
    private $_relationTable = 'alarm_relationship';
    private $_logTable = 'alarm_log';
    private $_error = '';

    public function getEventList(){
        $obj = M($this->_table);
        $data = $obj->where(['status' => 1])->select();
        return $data;
    }

    public function addEvent($data){
        if(empty($data)){
            return false;
        }
        $obj = M($this->_table);
        if($obj->add($data)){
            return true;
        }else{
            return false;
        }
    }

    public function modifyEvent($data,$id){
        if(empty($data) || !$id){
            return false;
        }
        $obj = M($this->_table);
        if($obj->where(['id'=>$id])->save($data)){
            return true;
        }else{
            return false;
        }
    }

    public function checkData($data,$table='',$id = null){
        if(empty($data) || !$table){
            $this->_error = '无效数据';
            return false;
        }
        if($data['code']){
            $where['code'] = ['eq',$data['code']];
            if($id){
                $where['id'] = ['neq',$id];
            }
            $res = M($this->$table)->where($where)->find();
            if(!empty($res)){
                $this->_error = '该编码已存在';
                return false;
            }
        }else{
            $this->_error = '请填写编码';
            return false;
        }
        return true;
    }

    public function delEvent($id){
        if(!$id){
            return false;
        }
        $obj = M($this->_table);
        if($obj->delete($id)){
            return true;
        }else{
            return false;
        }
    }

    public function getResponseList(){
        $obj = M($this->_restable);
        $data = $obj->where(['status' => 1])->select();
        return $data;
    }

    public function addResponse($data){
        if(empty($data)){
            return false;
        }
        $obj = M($this->_restable);
        if($obj->add($data)){
            return true;
        }else{
            return false;
        }
    }

    public function modifyResponse($data,$id){
        if(empty($data) || !$id){
            return false;
        }
        $obj = M($this->_restable);
        if($obj->where(['id'=>$id])->save($data)){
            return true;
        }else{
            return false;
        }
    }

    public function delResponse($id){
        if(!$id){
            return false;
        }
        $obj = M($this->_restable);
        if($obj->delete($id)){
            return true;
        }else{
            return false;
        }
    }

    public function getRspList($uid)
    {
        $rsTable = '__' . strtoupper($this->_restable) . '__'; //响应
        $eventTable = '__' . strtoupper($this->_table) . '__'; //事件
        $deviceTable = '__' . strtoupper($this->_deviceTable) . '__'; //设备
        $obj = M($this->_rspTable);
        $data = $obj
            ->alias('a')
            ->field("a.destination,a.id,a.remark,a.time,a.event_id,a.response_id,a.device_id,b.name as rsName,c.name as eventName,d.name as deviceName")
            ->join("$rsTable as b ON b.code = a.response_id", 'left')
            ->join("$eventTable as c ON c.code = a.event_id", 'left')
            ->join("$deviceTable as d ON d.uuid = a.device_id", 'left')
            ->where("a.user_id = $uid")->select();
        return $data;
    }

    public function saveRelation($data,$id,$type){
        if(empty($data)) return false;
        if($type != 1 && !$id) return false;
        if($type != 1){
            return M($this->_rspTable)->where(['id'=>$id])->save($data);
        }else{
            return M($this->_rspTable)->add($data);
        }
    }

    public function deleteRelation($id){
        if(!$id) return false;
        return M($this->_rspTable)->where(['id'=>$id])->delete();
    }

    public function getAlert($code,$device){
        if(!$code || !$device){
            return false;
        }
        $rsTable = '__' . strtoupper($this->_restable) . '__'; //响应
        $deviceTable = '__' . strtoupper($this->_deviceTable) . '__'; //设备
        $relationTable = '__' . strtoupper($this->_relationTable) . '__'; //设置
        $obj = M($this->_table);
        $data = $obj
            ->alias('a')
            ->field("a.name as ename,c.name as rname,d.name as dname,b.device_id,b.event_id,b.response_id,b.destination,b.user_id,b.firm_id")
            ->join("$relationTable as b ON a.code = b.event_id", 'left')
            ->join("$rsTable as c ON b.response_id = c.code", 'left')
            ->join("$deviceTable as d ON d.uuid = b.device_id", 'left')
            ->where(['a.code' => $code,'b.device_id'=>$device])->select();
        return $data;
    }
    /**
     * 警点报警
     * @param $str :“socket连接号$设备序列号$报警设备ID$警点号
     */
    public function triggerAlarm($str){
        list($socketno,$device,$did,$code) = explode('@',$str);
//        $logstr = '报警信息：'.$str;
        $res = $this->getAlert($code,$device);
//        $date = date('y_m_d');
        $data = [
            'device' => $device,
            'event' => $code,
            'triggertime' => date('Y_m_d H:i:s'),
            'triggerdata' => $str,
        ];
        if(!empty($res)){
            foreach($res as $v){
                $fun = $v['response_id'];
                $data['response'] = $fun;
                $data['belongfirm'] = $v['firm_id'];
                $data['belonguser'] = $v['user_id'];
                $data['responsedata'] = json_encode($v,JSON_UNESCAPED_UNICODE);
                $data['destination'] = $v['destination'];
                if($fun && method_exists($this,$fun)){
                    try{
                        $res = $this->$fun($str,$v);
                        $data['status'] = (int)$res['status'];
                        if($res['status']){
                            $data['msg'] = '执行响应事件成功';
//                            \Think\Log::write($logstr.'；响应事件：'.var_export($v,true).'；执行响应事件成功。','INFO','',C('LOG_PATH').'alarm_'.$date.'.log');
                        }else{
                            $data['msg'] = '执行响应事件失败：'.$res['msg'];
//                            \Think\Log::write($logstr.'；响应事件：'.var_export($v,true).'；执行响应事件失败：'.$res['msg'].'。','INFO','',C('LOG_PATH').'alarm_'.$date.'.log');
                        }
                    }catch(Exception $e){
                        $er = $e->getMessage();
                        $data['status'] = 0;
                        $data['msg'] = '执行响应事件失败：'.$er;
//                        \Think\Log::write($logstr.'；响应事件：'.var_export($v,true).'；执行响应事件失败：'.$er.'。','INFO','',C('LOG_PATH').'alarm_'.$date.'.log');
                    }
                }else{
                    $data['status'] = 0;
                    $data['msg'] = '未编写对应响应逻辑';
//                    \Think\Log::write($logstr.'；响应事件：'.var_export($v,true).'；未编写对应响应逻辑。','INFO','',C('LOG_PATH').'alarm_'.$date.'.log');
                }
            }
        }else{
            $data['status'] = 0;
            $data['msg'] = '无对应报警联动';
//            \Think\Log::write($logstr.'；无对应报警联动。','INFO','',C('LOG_PATH').'alarm_'.$date.'.log');
        }
        M('AlarmLog')->add($data);
    }

    /**
     * 警点消警
     * @param $str : socket连接号$设备序列号$报警设备ID$警点号
     */
    public function eliminateAlarm($uuid){
//        $uuid = '54e63f00102b0a6c0001000300000000';
        $mc = new \Memcached();
        $mc->addServer('127.0.0.1', 11211);
        $socketarr = $mc->get('device_info');
        if(array_key_exists($uuid,$socketarr)){
            $socketno = $socketarr[$uuid];
            $pstring = $socketno.'$54e63f00102b0a6c0001000300000000$3$0';
            $r = \Home\Model\DeviceModel::curlCommon('http://115.159.117.149:2345/MsgPush/start','post',['pst'=>$pstring,'ty' => '0x52000004']);
            dump($r);
        }else{
            echo $uuid.'不在线';
        }
    }

    public function sendSMS($str,$v){
        $content = '您好，您设置的报警联动被触发，触发设备：'.$v['dname'].'；触发事件：'.$v['ename'].'；响应事件：'.$v['rname'];
        $mobile = $v['destination'];
        if(is_mobile($mobile)){
            \Think\ChuanglanSmsApi::sendSMS($mobile,$content);
            return ['status'=>true,'msg'=>'success'];
        }else{
            return ['status'=>false,'msg'=>'非法手机号'];
        }
    }

    public function sendEmail($str,$v)
    {
        $address = $v['destination'];
        if(!is_email($address)){
            return ['status'=>false,'msg'=>'非法邮箱'];
        }
        $title = '报警联动触发邮件提醒';
        $content = '您好，您设置的报警联动被触发：<br>触发设备：'.$v['dname'].'；<br>触发事件：'.$v['ename'].'；<br>响应事件：'.$v['rname'].'；';
        $res = sendEmail($address,$title,$content);
        return $res;
    }

    public function mobileAlert($str,$v)
    {

    }

    public function openAlarm($uuid)
    {
        //socket连接号$设备序列号$报警设备ID$警点号
//        $uuid = $v['destination'];
//        $uuid = '54e63f00102b0a6c0001000300000000';
        $mc = new \Memcached();
        $mc->addServer('127.0.0.1', 11211);
        $socketarr = $mc->get('device_info');
        if(array_key_exists($uuid,$socketarr)){
            $socketno = $socketarr[$uuid];
            $pstring = $socketno.'$54e63f00102b0a6c0001000300000000$3$0';
            $r = \Home\Model\DeviceModel::curlCommon('http://115.159.117.149:2345/MsgPush/start','post',['pst'=>$pstring,'ty' => '0x52000003']);
            \Think\Log::write('send==================:'.$pstring,'INFO','',C('LOG_PATH').'alarm_'.date('y_m_d').'.log');
            dump($r);
        }else{
            \Think\Log::write('send==================:'.$uuid.'不在线','INFO','',C('LOG_PATH').'alarm_'.date('y_m_d').'.log');
        }
    }

    public function test($str)
    {
        $date = date('y_m_d');
        \Think\Log::write('str==================:'.$str,'INFO','',C('LOG_PATH').'alarm_'.$date.'.log');
    }

    /**
     * 获取报警日志
     */
    public function getAlarmLog($firmid=0,$userid=0)
    {
        $where = [];
        if($firmid){
            $where['belingfirm'] = ['eq',$firmid];
        }elseif($userid){
            $where['belonguser'] = ['eq',$userid];
        }else{
            $where = '1=1';
        }
        $rt = '__' . strtoupper($this->_restable) . '__'; //响应
        $dt = '__' . strtoupper($this->_deviceTable) . '__'; //设备
        $et = '__' . strtoupper($this->_table) . '__'; //事件
        $res = M($this->_logTable)->alias('a')
            ->field('a.status,a.msg,a.destination,a.triggertime,b.name as dname,c.name as rname,d.name as ename')
            ->join("$dt as b ON a.device = b.uuid", 'left')
            ->join("$rt as c ON a.response = c.code", 'left')
            ->join("$et as d ON a.event = d.code", 'left')
            ->where($where)->order('a.id desc')->select();
        return $res;
    }

    public function getError(){
        return $this->_error;
    }
}