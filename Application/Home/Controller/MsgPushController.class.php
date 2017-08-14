<?php

namespace Home\Controller;

use Think\Controller;
use Workerman\Worker;
use PHPSocketIO\SocketIO;

class MsgPushController extends Controller
{
    public function start()
    {
        include __DIR__ . '/../../vendor/autoload.php';

        if (strpos(strtolower(PHP_OS), 'win') === 0) {
            exit("start.php not support windows, please use start_for_win.bat\n");
        }

        $mc = new \Memcached();
        $mc->addServer("localhost", 11211);
        $mc->delete('online_device');
        $mc->add('online_device',array());

        $sender_io = new SocketIO(2120);
        $sender_io->on('connection', function ($socket) use($sender_io) {
            $socket->on('login', function ($uid) use ($socket, $sender_io) {
                global $uidConnectionMap;
                if (isset($socket->uid)) {
                    return;
                }
                $uid = (string)$uid;
                if (!isset($uidConnectionMap[$uid])) {
                    $uidConnectionMap[$uid] = 0;
                }
                ++$uidConnectionMap[$uid];
                $socket->join($uid);
                $socket->uid = $uid;
                $w['id'] = $socket->uid;
                $res = M('user')->where($w)->setField('loginstatus',1);
                $lastfirmid = M('user')->where($w)->getField('lastfirmid');
                $flag = ['uid' => $socket->uid, 'lastfirmid' => $lastfirmid];
                $sender_io->emit('login', $flag);
            });

            $socket->on('disconnect', function () use ($socket, $sender_io) {
                if (!isset($socket->uid)) {
                    return;
                }
                $w['id'] = $socket->uid;
                $res = M('user')->where($w)->setField('loginstatus',0);
                $lastfirmid = M('user')->where($w)->getfield('lastfirmid');
                $flag = ['uid' => $socket->uid, 'lastfirmid' => $lastfirmid];
                $sender_io->emit('logout', $flag);
                global $uidConnectionMap;
                if (--$uidConnectionMap[$socket->uid] <= 0) {
                    unset($uidConnectionMap[$socket->uid]);
                }
            });
        });

        $sender_io->on('workerStart', function () use ($sender_io) {
            $inner_http_worker = new Worker('http://0.0.0.0:2121');
            $inner_http_worker->count = 1;
            $inner_http_worker->onMessage = function ($http_connection, $data) use ($sender_io) {
                global $uidConnectionMap;
                $_POST = $_POST ? $_POST : $_GET;
                switch (@$_POST['type']) {
                    case 'publish':
                        $to = @$_POST['to'];
                        $_POST['content'] = htmlspecialchars(@$_POST['content']);
                        /*将推送记录存放到operatelog表 start*/
                        $uid = empty(session('user_auth')['uid'])?0:session('user_auth')['uid'];
                        $time = time();
                        $firmid = session('lastfirmid');
                        // $mysqli = new \mysqli("127.0.0.1", "root", "67hgt$#Dr503d", "link");
                        $data = ['userid' => $uid , 'firmid' => $firmid , 'type' => 2 ,
                                'createtime' => $time , 'description' => $_POST['content']];
                        M('operatelog')->add($data);
                        /*将推送记录存放到operatelog表 end*/
                        if ($to) {
                            $sender_io->to($to)->emit('new_msg', $_POST['content']);
                        } else {
                            $sender_io->emit('new_msg', @$_POST['content']);
                        }

                        if ($to && !isset($uidConnectionMap[$to])) {
                            return $http_connection->send('offline');
                        } else {
                            return $http_connection->send('ok');
                        }
                        break;
                    case 'relogin':
                        $to = @$_POST['to'];
                        $_POST['content'] = htmlspecialchars(@$_POST['content']);

                        if ($to) {
                            $sender_io->to($to)->emit('relogin', $_POST['content']);
                        }

                        if ($to && !isset($uidConnectionMap[$to])) {
                            return $http_connection->send('offline');
                        } else {
                            return $http_connection->send('ok');
                        }
                        break;
                    case 'alarm':
                        $to = @$_POST['to'];
                        $_POST['content'] = @$_POST['content'];

                        if ($to) {
                            $sender_io->to($to)->emit('alarm', $_POST['content']);
                        }

                        if ($to && !isset($uidConnectionMap[$to])) {
                            return $http_connection->send('offline');
                        } else {
                            return $http_connection->send('ok');
                        }
                        break;
                    case 'testalert':
                        $to = @$_POST['to'];
                        $data = @$_POST['content'];
                        if ($to) {
                            $sender_io->to($to)->emit('testalert', $data);
                        }
                        if ($to && !isset($uidConnectionMap[$to])) {
                            return $http_connection->send('offline');
                        } else {
                            return $http_connection->send('ok');
                        }
                        break;
                }
                return $http_connection->send('fail');
            };

            $inner_http_worker->listen();

        });

        $tcp_worker = new Worker("tcp://0.0.0.0:2123");
        $tcp_worker->count = 1;
        $tcp_worker->onMessage = function($connection, $data) use ($mc)
        {

            $res = $mc->get('online_device');

            if ($mc->getResultCode() != 16 && is_array($res) && is_mobile($data)) {
                $res[$connection->id] = $data;
                $uuid = $data . '_1';
                $result = M('Modules_device')->where("uuid = '$uuid'")->save(['state' => 1]);
                $mc->replace('online_device', $res);
                $connection->send($result);

            }

            $connection->onClose = function($connection) use ($mc)
            {
                $res = $mc->get('online_device');
//                var_dump($res);
                $mobile = $res[$connection->id];
//                var_dump($mobile);
                if (!empty($mobile)) {
                    $uuid = $mobile . '_1';
                    $result = M('Modules_device')->where("uuid = '$uuid'")->save(['state' => 0]);
                    unset($res[$connection->id]);
                    $mc->replace('online_device', $res);
                    $connection->send($result);
                }
            };
        };


        $http_worker = new Worker("http://0.0.0.0:2345");
        $http_worker->count = 1;
        $http_worker->onMessage = function($connection, $data)
        {
            if ($data['get']['init'] == 1){
                //初始化设备状态以及缓存
                $mc = new \Memcached();
                $mc->addServer("localhost", 11211);
                $mc->delete('device_info');
                $mc->add('device_info',array());
                M("ModulesDevice")->where(array('uuid'=>['NEQ'=>'']))->save(['state'=>'0']);
                msu7server_init("linkviewlist");
            }
            $uuid = $data['get']['uuid'];
            $argu = $data['get']['argu'];

            if(!empty($uuid)){
                $mc = new \Memcached();
                $mc->addServer("localhost", 11211);
                $mc->get('device_array');
                $is_exits = 0;
                if($mc->getResultCode() == 16){
                    $mc->add('device_array',array(array('uuid'=>$uuid,'argu'=>$argu)));
                } else {
                    $res = $mc->get('device_array');
                    foreach($res as $k=>$v){
                        if($v == array('uuid'=>$uuid,'argu'=>$argu)){
                            $is_exits = 1;
                            break;
                        }
                    }
                    if(!$is_exits){
                        array_push($res,array('uuid'=>$uuid,'argu'=>$argu));
                        $mc->replace('device_array',$res);
                    }
                }

                msu7server_send($uuid,$argu);
            }
            $arr = ['0x12000064','0x12000001','0x52000003','0x52000004'];
            if(in_array($_POST['ty'],$arr)){
                msu7server_send($_POST['pst'], $_POST['ty']);
            }
            $connection->send('hi:'.$uuid);
        };

        Worker::runAll();
    }
}