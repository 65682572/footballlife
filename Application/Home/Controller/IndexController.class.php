<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends AdminController {

    protected function _initialize(){
        parent::_initialize();
        //临时登陆代码
        if ($this->uid) {
            $user = M('ChatUser')->alias('a')->join("left join ".C('DB_PREFIX')."chat_userinfo as b on a.id = b.uid")->where("a.id = $this->uid")->find();
        }else{
            $user = M('ChatUser')->alias('a')->join("left join ".C('DB_PREFIX')."chat_userinfo as b on a.id = b.uid")->where("a.id = 1")->find();
        }        
        $this->userinfoField = M('ChatUserinfo')->getDbFields();
        session('uid',$user['id']);
        session('username',$user['username']);
        // $this->uid = $user['id'];
        //临时登陆代码结束
        //获取工作列表
        $this->works = M('ChatWorks')->alias('a')->field('a.*,b.name as hirer')->join("left join ".C('DB_PREFIX')."firm as b on b.id = a.creatid")->select();
        //获取房间号
        $this->room_id = I("room_id");
        if (!$this->room_id) {
            $this->room_id = 1;
        }
        session('room_id',$this->room_id);
        //设置当前用户数据
        $this->userinfo = $user;
        $this->userinfo['room_id'] = $this->room_id;
    }

    public function index()
    {
        redirect('/main');
        $this->display();
    }

    public function myfrimuserget(){
        //公告在线人数
        $firmid = session('lastfirmid');
        $userid = session('user_auth.uid');       
        
        //当前上线或下线用户的uid及firmid
        $where['lastfirmid'] = $firmid;
        $where['loginstatus'] = '1';
        $myfirmuser = M('user')->where($where)->count();
        //当前所属机构下所有用户统计
        $w1['firmid'] = $firmid;
        $myalluser = M('GroupUser')->where($w1)->count();
        //广播以上信息
        $flag = ['uid' => $userid, 'lastfirmid' => $firmid, 'myusersum' => $myfirmuser, 'myalluser' => $myalluser];
        $this->ajaxreturn($flag);
    }

    public function setdevicestate(){
        $action = I('action');
        $uid = I('uid'); //获取当前上线或下线的用户id
        $uidarray = explode('_', $uid);

        $w2['id'] = $uid;
        $mobile = M('user')->where($w2)->getfield('mobile');
        if ($mobile) {
            if ($uidarray[1] == 1) {
                $mobile = $mobile."_1";
            }else{
                $mobile = $mobile."_0";
            }
            $www['uuid'] = $mobile;
            if ($action == "login") {
                $res = M('ModulesDevice')->where($www)->setField('state',1);
            }else{
                $res = M('ModulesDevice')->where($www)->setField('state',0);
            }            
        }
        $flag = ['uuid' => $mobile, 'res' => $res];
        $this->ajaxreturn($flag);
    }

    //随机生成英文
    public function getRandomString($len, $chars=null)
    {
        if (is_null($chars)){
            $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }  
        mt_srand(10000000*(double)microtime());
        for ($i = 0, $str = '', $lc = strlen($chars)-1; $i < $len; $i++){
            $str .= $chars[mt_rand(0, $lc)];  
        }
        return $str;
    }

    /*
     * 概率算法，
     * $proArr是一个预先设置的数组，
     * 假设数组为：array(100,200,300，400)，
     * 开始是从1,1000 这个概率范围内筛选第一个数是否在他的出现概率范围之内， 
     * 如果不在，则将概率空间，也就是k的值减去刚刚的那个数字的概率空间，
     */
    public function get_rand($proArr) { 
        $result = '';  
        //概率数组的总概率精度
        $proSum = array_sum($proArr);
        //概率数组循环 
        foreach ($proArr as $key => $proCur) { 
            $randNum = mt_rand(1, $proSum); 
            if ($randNum <= $proCur) { 
                $result = $key; 
                break; 
            } else { 
                $proSum -= $proCur; 
            }       
        } 
        unset ($proArr);  
        return $result; 
    } 

    function gailu($prize_arr,$t){
    /*
     * 概率抽取
     * 注意其中的v为抽中概率必须为整数，你可以将对应项的v设置成0，即意味着该项抽中的几率是0，
     * 数组中v的总和（基数），基数越大越能体现概率的准确性。
     * 本例中v的总和为100，那么平板电脑对应的 中奖概率就是1%，
     * 如果v的总和是10000，那中奖概率就是万分之一了。
     * 
     * 通过概率计算函数get_rand获取抽中的奖项id。
     * 将抽中的数组保存在数组$res['yes']中，
     * 而剩下的未抽中的信息保存在$res['no']中，
     * $t是类型，不同的类型随机的逻辑不同 1表示进球概率(暂时未使用T)
     */
        foreach ($prize_arr as $key => $val) { 
            $arr[$val['id']] = $val['v']; 
        }
        // if ($t == 1) {
            shuffle($arr);
        // }        
        $rid = $this->get_rand($arr); //根据概率获取奖项id
        $res['yes'] = $prize_arr[$rid]; //中奖项

        unset($prize_arr[$rid]); //将中奖项从数组中剔除，剩下未中奖项 
        shuffle($prize_arr); //打乱数组顺序 
        for($i=0;$i<count($prize_arr);$i++){ 
            $pr[] = $prize_arr[$i]; 
        } 
        $res['no'] = $pr; 
        return $res;
    }
}