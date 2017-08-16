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