<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/3/10
 * Time: 11:35
 */

namespace Home\Controller;

use Think\Controller;

class TestController extends Controller
{
    public function index()
    {
        $topMenu = C('menu');
        $submenu = C('submenu');

        foreach ($topMenu as $k => $v) {
            echo '<b>' . $v['name'] . '</b><br>';
//            echo '<b>'.$v['router'] . '</b><br>';
            foreach ($submenu[$k] as $v1) {
                echo "&nbsp;--" . $v1['name'] . '<br>';
                if (!empty($v1['submenu'])) {
                    foreach ($v1['submenu'] as $v2) {
                        echo "&nbsp;&nbsp;--" . $v2['name'] . '<br>';
                        if (!empty($v1['submenu'])) {
                            foreach ($v2['submenu'] as $v3) {
                                echo "&nbsp;&nbsp;&nbsp;--" . $v3['name'] . '<br>';
                            }
                        }
                    }
                }
//                echo $v1['router'].'<br>';
            }
            echo '------------------------<br>';
        }
    }

    public function search()
    {
        $topMenu = C('menu');
        $submenu = C('submenu');

        $this->MulitarraytoSingle($topMenu, '设备运维');
//        $this->MulitarraytoSingle($submenu, '设备运维');
    }

    private function MulitarraytoSingle($array, $str = '')
    {
        if (is_array($array)) {
            foreach ($array as $key => $value) {
//                echo $value['name'];
                if (is_array($value)) {
                    $this->MulitarraytoSingle($value, $str);
                } else {
                    if ($value == $str) {
                        echo $array[$key];
                    }
                }
            }
        }
    }

    public function test () {
        $type = I('type');
        echo $this->createSerialNumber($type);
//        eval('echo 1200*12;') ;
    }

    /**
     * 生成随机序列号
     * @param $type
     *  1 android 2 ios
     *  3 pc
     *  4 matrix
     *  5 sensor(温湿度)
     *  6 camera
     * @return bool|string
     */
    private function createSerialNumber($type)
    {

        // random mac address
        $chars = '1234567890ABCDEF';
        mt_srand(10000000 * (double)microtime());
        for ($i = 0, $str = '', $lc = strlen($chars) - 1; $i < 12; $i++) {
            $str .= (string)$chars[mt_rand(0, $lc)];
        }

        // random 4 numbers
        $str .= (string)rand(1000, 9999);

        // company code
        $str .= '0001'; // Linkyview

        // device class
        switch ($type) {
            case 1:
                $str .= '00010000';
                break;
            case 2:
                $str .= '00010001';
                break;
            case 3:
                $str .= '00020000';
                break;
            case 4:
                $str .= '00030000';
                break;
            case 5:
                $str .= '00040001';
                break;
            case 6:
                $str .= '00050000';
                break;
            default :
                return false;
        }

        // retain
        $str .= '0000';

        return $str;
    }

    public function testmc()
    {
        $mc = new \Memcached();
        $mc->addServer("localhost", 11211);
        $res = $mc->get('online_device');
        var_dump($res);
    }
}