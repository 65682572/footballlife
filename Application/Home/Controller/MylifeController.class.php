<?php
namespace Home\Controller;
use Think\Controller;
use Workerman\Worker;
require_once APP_PATH.'vendor/workerman/GatewayClient/Gateway.php';
// use Workerman\Autoloader;
use GatewayClient\Gateway;
use Workerman\Lib\Timer;
use Workerman\Connection\AsyncTcpConnection;
use Workerman\Autoloader;

class MylifeController extends IndexController
{
    public $works;
    public $room_id;
    public $uid;
    public $userinfo;
    public $userinfoField;

    protected function _initialize()
    {
        parent::_initialize();

        //设置属性事件
        $this->contestevent = array(
            '0' => array(
                'id' => '1',
                'v' => '2', 
            'name' => '爆发', 
            'value' => '*1.42'
            ),
            '1' => array(
                'id' => '2',
                'v' => '20',
            'name' => '上升', 
            'value' => '*1.25'
            ),
            '2' => array(
                'id' => '3',
                'v' => '100',
            'name' => '正常', 
            'value' => '*1.00'
            ),
            '3' => array(
                'id' => '4',
                'v' => '20',
            'name' => '下降', 
            'value' => '*0.81'
            ),
            '4' => array(
                'id' => '5',
                'v' => '1',
            'name' => '大跌', 
            'value' => '*0.68'
            )
        );
        //设置伤情事件
        $this->combatevent = array(
            '0' => array(
                'id' => '1',
                'v' => '1',
            'name' => '大腿撞伤', 
            'value' => '*0.77'
            ),
            '1' => array(
                'id' => '2',
                'v' => '15',
            'name' => '肌肉拉伤', 
            'value' => '*0.87'
            ),
            '2' => array(
                'id' => '3',
                'v' => '51',
            'name' => '肌肉擦伤', 
            'value' => '*1.02'
            ),
            '3' => array(
                'id' => '4',
                'v' => '10',
            'name' => '扭伤了', 
            'value' => '*0.91'
            ),
            '4' => array(
                'id' => '5',
                'v' => '1',
            'name' => '疝气发作', 
            'value' => '*0.55'
            ),
            '5' => array(
                'id' => '6',
                'v' => '20',
            'name' => '小腿挫伤', 
            'value' => '*0.96'
            )
        );
        //设置攻门事件
        $this->jinqiuevent = array(
            '0' => array(
                'id' => '1',
                'v' => '20',
            'name' => '射正，却被门将扑出！', 
            'value' => '*0.77'
            ),
            '1' => array(
                'id' => '2',
                'v' => '20',
            'name' => '大力射门！球被门将拍飞了！', 
            'value' => '*0.87',
            'j' => 1
            ),
            '2' => array(
                'id' => '3',
                'v' => '20',
            'name' => '门前射失！', 
            'value' => '*1.02'
            ),
            '3' => array(
                'id' => '4',
                'v' => '10',
            'name' => '门前绊倒！裁判未判罚点球！', 
            'value' => '*0.91'
            ),
            '4' => array(
                'id' => '5',
                'v' => '20',
            'name' => '射高了！他浪费了一个绝佳机会！', 
            'value' => '*0.55'
            ),
            '5' => array(
                'id' => '6',
                'v' => '10',
            'name' => '射偏了，莫非他与门柱有基情？', 
            'value' => '*0.96'
            )
        );
        //射门成功事件
        $this->ballinevent = array(
            '0' => array(
                'id' => '1',
                'v' => '1', 
            'name' => '30米外吊射入门，世界波~~~漂亮的进球！', 
            'value' => '*1.42'
            ),
            '1' => array(
                'id' => '2',
                'v' => '30',
            'name' => '一腿怒射，球进了！', 
            'value' => '*1.25'
            ),
            '2' => array(
                'id' => '3',
                'v' => '100',
            'name' => '进球！', 
            'value' => '*1.00'
            ),
            '3' => array(
                'id' => '4',
                'v' => '20',
            'name' => '一记漂亮的孤线球，进了！', 
            'value' => '*0.81'
            ),
            '4' => array(
                'id' => '5',
                'v' => '10',
            'name' => '吊射入门，他展示了无与伦与的掌控力！', 
            'value' => '*0.68'
            )
        );
        
    }

    public function index(){
        //单个工作数组
        $work = array(
            '0' => array(
            'name' => 'ene', 
            'value' => '1'
            )
        );
        $dataser = serialize($work);
        // var_dump($dataser);

        // Vendor('getgailu');
        //         $gailu = new \getgailu();
        //         $thisworks = $gailu::gailu($this->works);
        //         var_dump($thisworks['yes']);
        //生成随机AI
        // for ($i=0; $i < 30; $i++) { 
        //     $data2 = array(
        //         'name' => $this->getRandomString(rand(4,9)), 
        //         'str' => 1000+rand(100,1000),
        //         'agi' => 1000+rand(100,1000),
        //         );
        //     M("ChatUserai")->add($data2);
        // }
        // $dataser = serialize($data);

        // foreach ($ss as $key => $value) {
        //     $data2[$value['name']] = array('exp',$value['name'].$value['value']);
        //     $gain = $gain.$value['name'].":".$value['value']." ";
        // }
        // var_dump($gain);
        // M('ChatUserinfo')->where("uid = $this->uid")->save($data2);
        // $uid = $this->uid;
        // $userailist = M('ChatUserai')->select();
        // $myinfo = M('ChatUserinfo')->alias('a')->field('a.*,b.username as name')->join("left join ".C('DB_PREFIX')."user as b on b.id = $this->uid")->where("uid = $this->uid")->find();
        // $sss = array_push($userailist, $myinfo);
        // var_dump($userailist);
        // $username = $this->userInfo['username'];
        $client_name = session('username');
        $this->assign('userinfo',$this->userinfo);
        $this->assign('uid',$this->userinfo['id']);
        $this->assign('username',$client_name);
        $this->display();
    }

    public function firm(){
        $this->display();
    }

    //匹配参赛阵容
    public function contestFirest(){
        if ($this->userinfo['ene']<=100) {
            $flag  = ['status'=>false, 'msg'=>'您的精力不够！'];
            $this->ajaxReturn($flag);
        }
        $myplace = I('myplace');
        $action = I('action');
        
        //列出AI队友列表，排除ID与玩家相同的
        $userailist = M('ChatUser')->where("id != $this->uid AND type=1")->select();
        if ($action == 'firest') {
            // $myinfo = M('ChatUserinfo')->alias('a')->field('a.*,b.username as name,b.id')->join("left join ".C('DB_PREFIX')."user as b on b.id = $this->uid")->where("uid = $this->uid")->find();
            //选队友
            foreach(array_rand($userailist,10) as $val){
                $userailist[$val]['group'] = 'm';
                $data_last[]=$userailist[$val];
            }
            $this->userinfo['group'] = 'm';
            array_push($data_last, $this->userinfo);
            //选对手
            foreach(array_rand($userailist,11) as $val){
                $userailist[$val]['group'] = 'e';
                $data_last[]=$userailist[$val];
            }

            $mygroup = $data_last;
        }
        session('mygroup',$mygroup); //设置本队与敌队数据
        $this->ajaxReturn($mygroup);
    }

    //计算比赛结果
    public function contestSecond(){
        $contestgroupname = array('m' =>'我方' , 'e' =>'敌方');
        //比赛前扣除精力
        if ($this->userinfo['ene']>100) {
            M('ChatUser')->where("id = $this->uid")->setDec('ene',100);
        }else{
            $flag  = ['status'=>false, 'msg'=>'您的精力不够！'];
            $this->ajaxReturn($flag);
        }
        // 设置GatewayWorker服务的Register服务ip和端口，请根据实际情况改成实际值
        Gateway::$registerAddress = '127.0.0.1:1236';
        $m = 0; //我方总分
        $e = 0; //敌方总分
        $new_message = array(
            'type'=>'mycontest', 
            'from_client_id'=>$this->uid,
            'from_client_name' =>$this->userInfo['username'],
            'to_client_id'=>$this->uid,
        );
        $mygroup = session('mygroup');
        for ($i=0; $i < 9; $i++) {                     
            $action = I('action');
            //本队成员分别计算战力，判断意外事件
            foreach ($mygroup as $key => $value) {
                $resmycombat = $this->getUserCombat($value);
                if ($resmycombat['hurtevent'] !== '正常') {
                    //获取伤情奖
                    $mygroup[$key]['jiang'] = $this->get_award($mygroup[$key]['jiang'],3);

                    $new_message['group'] = $value['group'];
                    $new_message['content'] = "伤情： ".$contestgroupname[$value['group']].$value['username'].$resmycombat['hurtevent']."!!!";

                    $new_message['time'] = date('Y-m-d H:i:s');
                    Gateway::sendToUid($this->uid,json_encode($new_message));
                }
                //获取奖励
                $mygroup[$key]['jiang'] = $this->get_award($mygroup[$key]['jiang'],1);
                //汇总本轮两队各自战力
                if ($value['group'] == 'm') {
                    $myCombat += $resmycombat['value'];
                }else{
                    $eqCombat += $reseqcombat['value']; 
                }                
                //记录个体战力，也用于概率
                $mygroup[$key]['v'] = $resmycombat['value'];
               
            }
            //战力值取小数点后2位
            $myCombat = round($myCombat,2);
            $eqCombat = round($eqCombat,2);
            //比赛的当前时间节点
            $jqtime = 10*$i+rand(1,9); //进球分钟
            $jqsec = rand(1,59); //进球秒钟

            //计算正在攻门的人
            $jqer = $this->gailu($mygroup);
            //如果随机到1，计算进球事件，否则计算攻门事件
            if (rand(1,3) == 1) {
                $jqevent = $this->get_jingqiu($this->ballinevent);
                if ($jqer['yes']['group'] == 'm') {
                    $m++;
                }else{
                    $e++;
                }
            }else{
                //抽取攻门事件
                $jqevent = $this->gailu($this->jinqiuevent);
            }
            $new_message['group'] = $jqer['yes']['group'];
            $new_message['content'] = "第".$jqtime."分".$jqsec."秒，".$contestgroupname[$jqer['yes']['group']]."【".$jqer['yes']['username']."】".$jqevent['yes']['name']; 
            //通知当前实时分数
            $new_message['m'] = $m;
            $new_message['e'] = $e;
            $new_message['time'] = date('Y-m-d H:i:s');
            Gateway::sendToUid($this->uid,json_encode($new_message));
        }
        //写入奖励
        $this->setjiang($mygroup);
        if ($m > $e) {
            $flag  = ['status'=>true, 'msg'=>'我方胜！', 'group'=>$mygroup];
        }
        if ($m < $e) {
            $flag  = ['status'=>true, 'msg'=>'我方负！', 'group'=>$mygroup];
        }
        if ($m == $e) {
            $flag  = ['status'=>true, 'msg'=>'双方战平！', 'group'=>$mygroup];
        }
        $this->ajaxReturn($flag);
    }

    //写入奖励
    public function setjiang($arr){
        foreach ($arr as $key => $value) {
            foreach ($value['jiang'] as $k => $v) {
                $data[$k] = array('exp',$k."+".$v);
            }
            $ww['uid'] = $value['id'];
            $res = M('ChatUserinfo')->where($ww)->save($data);
            $w['id'] = $value['id'];
            $datamoney['money'] = array('exp',"money+".rand(100,190));
            $res = M('ChatUser')->where($w)->save($datamoney);
        }       
    }

    //数组相加
    public function arr_jia($a,$b){
        // function jiajia($a, $b){
        //     return $a + $b;
        // }
        $c = array_map(function($a, $b){
            return $a + $b;
        }, $a, $b);        
        return $c;
    }

    //对参赛成员奖励
    //$type：1参与奖 2进球奖 3伤情奖
    //加入奖励后将传进来的数组返回
    public function get_award($arr,$type){
        switch ($type) {
            case 1:
                $a = 10;
                $b = 15;
                if (is_array($arr)) {
                    $arr['str'] = $arr['str']+rand($a,$b);
                    $arr['agi'] = $arr['agi']+rand($a,$b);
                   
                }else{
                    $arr['str'] = rand($a,$b);
                    $arr['agi'] = rand($a,$b); 
                }                
                break;
            case 2:
                $a = 15;
                $b = 21;
                if (is_array($arr)) {
                    $arr['str'] = $arr['str']+rand($a,$b);
                    $arr['agi'] = $arr['agi']+rand($a,$b);                    
                }else{
                    $arr['str'] = rand($a,$b);
                    $arr['agi'] = rand($a,$b); 
                }
                break;
            case 3:
                $a = 18;
                $b = 25;
                if (is_array($arr)) {
                    $arr['str'] = $arr['str']+rand($a,$b);
                    $arr['agi'] = $arr['agi']+rand($a,$b);                    
                }else{
                    $arr['str'] = rand($a,$b);
                    $arr['agi'] = rand($a,$b); 
                }
                break;
            default:
                # code...
                break;
        }
        return $arr;
    }

    //判断谁进球
    public function get_jingqiu($thisarr){
        //通过概率函数计算本轮进球者,返回结果分yes与no
        $data = $this->gailu($thisarr,1);
        return $data;
    }

    //从数组中随机抽取
    // public function get_array_rand($thisarr,$num){
    //     $arrand = array_rand($thisarr,$num);
    //     if ($num == 1) {
    //         $data[0] = $thisarr[$arrand];
    //     }
    //     if ($num >1) {
    //         foreach($arrand as $val){
    //             $data[]=$thisarr[$val];
    //         }
    //     }                
    //     return $data;
    // }

    //参赛者战力计算
    public function getUserCombat($thisuserinfo = []){ 
        $combtext = '';
        //此处循环对象有bug，把后续写入的v等数据也纳入战力计算，需指定战力相关字段来循环       
        foreach ($thisuserinfo as $key => $value) {            
            if (in_array($key, $this->userinfoField) && $key != 'uid') {
                if (!is_array($value)) {
                    //计算属性随机事件，得到数组
                    $comb = $this->getContestEvent($value);
                    //将属性随机事件拼接
                    $combtext = $combtext." ".$key.$comb['yes']['name'];
                    $thisuserinfo['combat'] += $comb['attrvalue'];
                }               
            }
        }
        $thisuserinfo['combtext'] = $combtext;

        //伤病设置
        $theCombatarr = $this->setHurt($thisuserinfo['combat']);
        //将最终战力写入用户信息里
        $thisuserinfo['value'] = $theCombatarr['value'];
        $thisuserinfo['hurtevent'] = $theCombatarr['event'];
        return $thisuserinfo;
    }
    //伤情判断
    public function setHurt($theCombat){        
        //随机到1则触发伤情判断
        $randevent = rand(1,79);
        if ($randevent == 1) {
            $cevent = $this->gailu($this->combatevent);
            $ass = "return ".$theCombat.$cevent['yes']['value'].";";         
            // $res = eval($ass);
            $theCombatarr['value'] = $res;
            $theCombatarr['event'] = $cevent['yes']['name'];
        }else{
            $theCombatarr['value'] = $theCombat;
            $theCombatarr['event'] = '正常';
        }        
        return $theCombatarr;
    }

    //参赛者属性随机事件
    public function getContestEvent($attr){
        $cevent = $this->gailu($this->contestevent);
        $ass = "return ".$attr.$cevent['yes']['value'].";"; 
        $cevent['attrvalue'] = eval($ass);
        return $cevent;
    }

    //获取用户信息
    public function userinfoAjax(){
        $userinfo = M('ChatUser')->alias('a')->join("left join ".C('DB_PREFIX')."chat_userinfo as b on a.id = b.uid")->where("a.id = $this->uid")->find();
        $this->ajaxReturn($userinfo);
    }

    //绑定uid与client_id
    public function bind(){
        $client_id = I('client_id');        
        // 设置GatewayWorker服务的Register服务ip和端口，请根据实际情况改成实际值
        Gateway::$registerAddress = '127.0.0.1:1236';
        // 假设用户已经登录，用户uid和群组id在session中        
        $group_id = $this->room_id;
        // var_dump($this->uid);
        // client_id与uid绑定
        Gateway::bindUid($client_id, $this->uid);
        $clientidlist = Gateway::getClientIdByUid($this->uid);
        // var_dump($clientidlist);
        // 加入某个群组（可调用多次加入多个群组）
        Gateway::joinGroup($client_id, $group_id);
    }

    //添加工作
    public function addworks(){
        $userinfofield = $this->userinfoField;
        $userinfofield[] = 'money';
        $this->assign("userinfofield",$this->userinfoField);
        $this->display();
    }

    public function addworksok(){
        if (is_post()) {
            $work = array(
                '0' => array(
                'name' => 'ene', 
                'value' => '-2'
                ),
                '1' => array(
                'name' => 'str', 
                'value' => '+1'
                ),
                '2' => array(
                'name' => 'agi', 
                'value' => '+1'
                ),
                '3' => array(
                'name' => 'money', 
                'value' => '+100'
                )
            );
            $dataser = serialize($work);
        }
    }
}

