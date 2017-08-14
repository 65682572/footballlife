<?php
namespace Home\Controller;
use Think\Controller;
use Workerman\Worker;
use GatewayWorker\Lib\Gateway;
use Workerman\Lib\Timer;
use Workerman\Autoloader;
// use PHPSocketIO\SocketIO;
class ChateventController extends IndexController
{
    public $works;

    // protected function _initialize()
    // {
    //     parent::_initialize();
    //     $this->works = M('Works')->select();
    //     // $this->uid = session('user_auth.uid');
    // }
    /**
    * 有消息时
    * @param int $client_id
    * @param mixed $message
    */
   public static function onMessage($client_id, $message)
   {
        // debug
        echo "client:{$_SERVER['REMOTE_ADDR']}:{$_SERVER['REMOTE_PORT']} gateway:{$_SERVER['GATEWAY_ADDR']}:{$_SERVER['GATEWAY_PORT']}  client_id:$client_id session:".json_encode($_SESSION)." onMessage:".$message."\n";
        
        // 客户端传递的是json数据
        $message_data = json_decode($message, true);        
        if(!$message_data)
        {
            return ;
        }
        //读取工作列表
        $message_data['works'] = M('ChatWorks')->alias('a')->field('a.*,b.name')->join("left join ".C('DB_PREFIX')."firm as b on b.id = a.creatid")->where("ratify = 1")->select();
        // $message_data['works'] = $this->works;
        
        // 根据类型执行不同的业务
        switch($message_data['type'])
        {
            // 客户端回应服务端的心跳
            case 'pong':
                return;
            // 客户端登录 message格式: {type:login, name:xx, room_id:1} ，添加到客户端，广播给所有客户端xx进入聊天室
            case 'login':
                // 判断是否有房间号
                if(!isset($message_data['room_id']))
                {
                    throw new \Exception("\$message_data['room_id'] not set. client_ip:{$_SERVER['REMOTE_ADDR']} \$message:$message");
                }
                
                // 把房间号昵称放到session中
                $room_id = $message_data['room_id'];
                $client_name = htmlspecialchars($message_data['client_name']);
                $_SESSION['room_id'] = $room_id;
                $_SESSION['client_name'] = $client_name;
              
                // 获取房间内所有用户列表 
                $clients_list = Gateway::getClientSessionsByGroup($room_id);
                foreach($clients_list as $tmp_client_id=>$item)
                {
                    $clients_list[$tmp_client_id] = $item['client_name'];
                }
                $clients_list[$client_id] = $client_name;
                
                // 转播给当前房间的所有客户端，xx进入聊天室 message {type:login, client_id:xx, name:xx} 
                $new_message = array('type'=>$message_data['type'], 'client_id'=>$client_id, 'room_id'=>$room_id, 'client_name'=>htmlspecialchars($client_name), 'time'=>date('Y-m-d H:i:s'));
                Gateway::sendToGroup($room_id, json_encode($new_message));
                Gateway::joinGroup($client_id, $room_id);
               
                // 给当前用户发送用户列表 
                $new_message['client_list'] = $clients_list;
                Gateway::sendToCurrentClient(json_encode($new_message));
                return;
                
            // 客户端发言 message: {type:say, to_client_id:xx, content:xx}
            case 'say':
                // 非法请求
                if(!isset($_SESSION['room_id']))
                {
                    throw new \Exception("\$_SESSION['room_id'] not set. client_ip:{$_SERVER['REMOTE_ADDR']}");
                }
                $room_id = $_SESSION['room_id'];
                $client_name = $_SESSION['client_name'];
                
                // 私聊
                if($message_data['to_client_id'] != 'all')
                {
                    $new_message = array(
                        'type'=>'say',
                        'from_client_id'=>$client_id, 
                        'from_client_name' =>$client_name,
                        'to_client_id'=>$message_data['to_client_id'],
                        'content'=>"<b>对你说: </b>".nl2br(htmlspecialchars($message_data['content'])),
                        'time'=>date('Y-m-d H:i:s'),
                    );
                    Gateway::sendToClient($message_data['to_client_id'], json_encode($new_message));
                    $new_message['content'] = "<b>你对".htmlspecialchars($message_data['to_client_name'])."说: </b>".nl2br(htmlspecialchars($message_data['content']));
                    return Gateway::sendToCurrentClient(json_encode($new_message));
                }
                
                $new_message = array(
                    'type'=>'say', 
                    'from_client_id'=>$client_id,
                    'from_client_name' =>$client_name,
                    'to_client_id'=>'all',
                    'content'=>nl2br(htmlspecialchars($message_data['content'])),
                    'time'=>date('Y-m-d H:i:s'),
                );
                return Gateway::sendToGroup($room_id ,json_encode($new_message));

            // 公告 message: {type:say, to_client_id:xx, content:xx}
            case 'anno':
                // 非法请求
                if(!isset($_SESSION['room_id']))
                {
                    throw new \Exception("\$_SESSION['room_id'] not set. client_ip:{$_SERVER['REMOTE_ADDR']}");
                }
                $room_id = $_SESSION['room_id'];
                $client_name = $_SESSION['client_name'];
                
                $new_message = array(
                    'type'=>'say', 
                    'from_client_id'=>$client_id,
                    'from_client_name' =>$client_name,
                    'to_client_id'=>'all',
                    'content'=>nl2br(htmlspecialchars($message_data['content'])),
                    'time'=>date('Y-m-d H:i:s'),
                );
                return Gateway::sendToGroup($room_id ,json_encode($new_message));

            //工作
            case 'mywork':
                // 非法请求
                if(!isset($_SESSION['room_id']))
                {
                    throw new \Exception("\$_SESSION['room_id'] not set. client_ip:{$_SERVER['REMOTE_ADDR']}");
                }
                $message_data['client_id'] = $client_id;
                $message_data['room_id'] = $_SESSION['room_id'];
                $message_data['client_name'] = $_SESSION['client_name'];
                
                //发送开始通知
                $new_message = array(
                    'type'=>'mywork', 
                    'from_client_id'=>$message_data['client_id'],
                    'from_client_name' =>$message_data['client_name'],
                    'to_client_id'=>$message_data['client_id'],
                    'content'=>"您正在工作......",
                    'time'=>date('Y-m-d H:i:s'),
                );
                Gateway::sendToClient($message_data['client_id'], json_encode($new_message));
                //开始定时任务
                $time_interval = 10;
                $timer_id = Timer::add($time_interval, array('Home\Controller\ChateventController', 'sendMyworkMsg'), array($message_data, &$timer_id));

            //竞赛
        }
   }

   public function sendMyworkMsg($message_data, $timer_id){
        $uid = $message_data['uid'];
        if ($uid) {
            $myinfo = M('ChatUser')->alias('a')->join("left join ".C('DB_PREFIX')."chat_userinfo as b on a.id = b.uid")->where("a.id = $uid")->find();
            $message = array(
                'type'=>'mywork', 
                'from_client_id'=>$message_data['client_id'],
                'from_client_name' =>$message_data['client_name'],
                'to_client_id'=>$message_data['client_id'],
                'time'=>date('Y-m-d H:i:s'),
            );
            if ($myinfo['ene']>0 && $myinfo['money']>0) {
                Vendor('getgailu');
                $gailu = new \getgailu();
                $thisworks = $gailu::gailu($message_data['works']);
                $message['content'] = $message_data['client_name']."在".$thisworks['yes']['name'].$thisworks['yes']['name'];
                $data = [];
                $gain = "";
                $worksarr = unserialize($thisworks['yes']['value']);
                foreach ($worksarr as $key => $value) {
                    $data[$value['name']] = array('exp',$value['name'].$value['value']);
                    $gain = $gain.$value['name'].":".$value['value']." ";
                }
                $message['content'] = $message_data['client_name']."在".$thisworks['yes']['name'].$thisworks['yes']['name']."时,".$gain;
                $res = M('ChatUserinfo')->where("uid = $uid")->save($data);
                if ($res) {
                    Gateway::sendToClient($message_data['client_id'], json_encode($message));
                }                
            }
            else{
                $message['content'] = "您的精力或金币不够，无法继续工作！";
                Gateway::sendToClient($message_data['client_id'], json_encode($message));
                Timer::del($timer_id);
            }
        }
    }

   /**
    * 当客户端断开连接时
    * @param integer $client_id 客户端id
    */
   public static function onClose($client_id)
   {
       // debug
       echo "client:{$_SERVER['REMOTE_ADDR']}:{$_SERVER['REMOTE_PORT']} gateway:{$_SERVER['GATEWAY_ADDR']}:{$_SERVER['GATEWAY_PORT']}  client_id:$client_id onClose:''\n";
       
       // 从房间的客户端列表中删除
       if(isset($_SESSION['room_id']))
       {
           $room_id = $_SESSION['room_id'];
           $new_message = array('type'=>'logout', 'from_client_id'=>$client_id, 'from_client_name'=>$_SESSION['client_name'], 'time'=>date('Y-m-d H:i:s'));
           Gateway::sendToGroup($room_id, json_encode($new_message));
       }
   }
}

