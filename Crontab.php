<?php
/**
 * Created by PhpStorm.
 * User: john
 * Date: 2017/5/10
 * Time: 11:11
 * device_array 应该是用户点击之后再msu7server_send那边存进队列的。这边就应该获取。
 */
while (1) {

    $mc = new Memcached();
    $mc->addServer("localhost", 11211);
    $res = $mc->get('device_menu');
    $mysqli = new \mysqli("127.0.0.1", "root", "67hgt$#Dr503d", "link");
    $result = $mysqli->query("select * from link_modules_device  WHERE uuid != ''");
    $arr = $result->fetch_all(MYSQLI_ASSOC);

    if ($mc->getResultCode() != 16 && is_array($res)) {
        $uuid1 = [];
        foreach($res as $key=>$val){
            $uuid = explode('$',$val)[1];
            array_push($uuid1,$uuid);
        }
        foreach ($arr as $k => $v) {
            $uuid = $v['uuid'];
            if(in_array($uuid,$uuid1)){
                $sql = "UPDATE link_modules_device SET state = '1' WHERE uuid = '$uuid'";
                echo $sql;
                $mysqli->query($sql);
            }else{
                $mysqli->query("UPDATE link_modules_device SET state = '0' WHERE uuid = '$uuid' ");
            }
        }

        $mysqli->close();
    }

    sleep(20);
}