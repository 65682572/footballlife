<?php
namespace Home\Controller;

use Think\Controller;
use Workerman\Worker;
// use Workerman\WebServer;
use GatewayWorker\Gateway;
use GatewayWorker\BusinessWorker;
use GatewayWorker\Register;
use Workerman\Autoloader;

// use PHPSocketIO\SocketIO;
class ChatController extends Controller
{
    public function start()
    {
        echo "now start Chatserver";
        // 自动加载类
        require_once __DIR__ . '/../../vendor/autoload.php';

        if (strpos(strtolower(PHP_OS), 'win') === 0) {
            exit("start.php not support windows, please use start_for_win.bat\n");
        }

        // 检查扩展
        if (!extension_loaded('pcntl')) {
            exit("Please install pcntl extension. See http://doc3.workerman.net/appendices/install-extension.html\n");
        }
        if (!extension_loaded('posix')) {
            exit("Please install posix extension. See http://doc3.workerman.net/appendices/install-extension.html\n");
        }

        // 标记是全局启动
        define('GLOBAL_START', 1);

        // register 服务必须是text协议
        $register = new Register('text://127.0.0.1:1236');

        // bussinessWorker 进程
        $worker = new BusinessWorker();
        // worker名称
        $worker->name = 'ChatBusinessWorker';
        // bussinessWorker进程数量
        $worker->count = 4;
        // 服务注册地址
        $worker->registerAddress = '127.0.0.1:1236';
        $worker->eventHandler = 'Home\Controller\ChateventController';

        // gateway 进程
        $gateway = new Gateway("Websocket://0.0.0.0:7272");
        // 设置名称，方便status时查看
        $gateway->name = 'ChatGateway';
        // 设置进程数，gateway进程数建议与cpu核数相同
        $gateway->count = 4;
        // 分布式部署时请设置成内网ip（非127.0.0.1）
        $gateway->lanIp = '127.0.0.1';
        // 内部通讯起始端口，假如$gateway->count=4，起始端口为4000
        // 则一般会使用4000 4001 4002 4003 4个端口作为内部通讯端口 
        $gateway->startPort = 2300;
        // 心跳间隔
        $gateway->pingInterval = 10;
        // 心跳数据
        $gateway->pingData = '{"type":"ping"}';
        // 服务注册地址
        $gateway->registerAddress = '127.0.0.1:1236';

        //WebServer
        // $web = new WebServer("http://0.0.0.0:55151");
        // // WebServer进程数量
        // $web->count = 2;
        // $web->addRoot('test.msu7.net', APP_PATH . '/Chat/Web');


        Worker::runAll();
    }

    public function start1(){
        echo "now start Chatserver";
        // 自动加载类
        require_once __DIR__ . '/../../vendor/autoload.php';
        // register 服务必须是text协议
        $register = new Register('text://127.0.0.1:1236');
        Worker::runAll();
    }

    public function start2(){
        echo "now start bussinessserver";
        // 自动加载类
        require_once __DIR__ . '/../../vendor/autoload.php';
        // bussinessWorker 进程
        $worker = new BusinessWorker();
        // worker名称
        $worker->name = 'ChatBusinessWorker';
        // bussinessWorker进程数量
        $worker->count = 4;
        // 服务注册地址
        $worker->registerAddress = '127.0.0.1:1236';
        $worker->eventHandler = 'Home\Controller\ChateventController';
        Worker::runAll();
    }

    public function start3(){
        echo "now start gatewayserver";
        // 自动加载类
        require_once __DIR__ . '/../../vendor/autoload.php';
        // gateway 进程
        $gateway = new Gateway("Websocket://0.0.0.0:7272");
        // 设置名称，方便status时查看
        $gateway->name = 'ChatGateway';
        // 设置进程数，gateway进程数建议与cpu核数相同
        $gateway->count = 4;
        // 分布式部署时请设置成内网ip（非127.0.0.1）
        $gateway->lanIp = '127.0.0.1';
        // 内部通讯起始端口，假如$gateway->count=4，起始端口为4000
        // 则一般会使用4000 4001 4002 4003 4个端口作为内部通讯端口 
        $gateway->startPort = 2300;
        // // 心跳间隔
        // $gateway->pingInterval = 10;
        // // 心跳数据
        // $gateway->pingData = '{"type":"ping"}';
        // 服务注册地址
        $gateway->registerAddress = '127.0.0.1:1236';
        Worker::runAll();
    }
}