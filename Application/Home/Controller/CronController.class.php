<?php
namespace Home\Controller;
use Think\Controller;
if (php_sapi_name() != 'cli'){
    die("is not cli");
}
class CronController extends Controller{
    public function __construct(){ }
    public function index() { }
    public function p2plist()
    {
        while(true){
            $ret = queue_execute('sqs_p2plist', '', false);
            $data = json_decode($ret['data'], true);
            if (!empty($data['uuid'])){
                $find = M("ModulesDevice","","DB_CONFIG_LINK")->where(['uuid'=>['eq', $data['uuid']]])->select();
                if (!empty($find)){
                    foreach ($find as $v){
                        M("ModulesDevice","","DB_CONFIG_LINK")->where(["id"=>$v['id']])->save(['ip'=>$data['ip'],'port'=>$data['port'],'state'=>1]);
                    }
                }
            }
            sleep(1);
        }
    }

    public function ckp2plist()
    {
        $list = M("ModulesDevice","","DB_CONFIG_LINK")->field("uuid")->select();
        if(!empty($list)){
            $uuids = [];
            foreach ($list as $v){
                array_push($uuids, $v['uuid']);
            }
            $uuids = array_unique($uuids);
            foreach ($uuids as $uuid){
                \Home\Model\DeviceModel::sendP2p($uuid);
            }
        }
        sleep(1);
    }

    /**
     * 资源共享推送给设备
     */

    public function pushToDevice(){
        \Home\Model\DeviceModel::getShareCron();
    }
}