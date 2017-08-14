<?php
namespace Common\Controller;
use Think\Controller;

class IndexController extends Controller{
    // public function msu()
    // {
    //     msu7server_init("linkviewlist");
    //     sleep(6);
    //     while(true){
    //         $ret = queue_execute('sqs_msu', '', false);
    //         $data = json_decode($ret['data'], true);
    //         if (!empty($data)){
    //             msu7server_send($data['uuid'], 3);
    //             sleep(6);
    //         }
    //     }
    // }
}