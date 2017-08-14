<?php
namespace Home\Controller;
use Think\Controller;
class BaseController extends Controller {

    protected function _initialize()
    {
        $uid = is_login();
        if ($uid > 0){
            redirect('/main');
        }
    }

    /**
     * 移动端判断
     */
    public function isMobie()
    {
        $isMobie = preg_match('/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i', trim($_SERVER['HTTP_USER_AGENT']));
        if($isMobie)C('SERVICE_CODE', '');
    }
}