<?php

namespace Home\Controller;

use Home\Model\AuthRuleModel;
use Think\Controller;

class AdminController extends Controller
{
    public $uid;
    public $userInfo;
    public $firmid;
    public $firminfo;
    public $formatfirm;
    public $message;
    public $userFace;
    public $operation;

    protected function _initialize()
    {
        //手机上调用WEB页面时验证及登录
        $mToken = I('get.token');
        $mUid = I('get.uid');
        if (!empty($mToken) && !empty($mUid)) {
            $result = M('UserToken')->where("uid = '$mUid' AND token = '$mToken'")->find();
            if ($result) {
                \Home\Model\MemberModel::autoLogin($mUid);
            }
        }

        define('UID', is_login());        
        /*生成全局公用图像 end*/
        /*生成全局公用版权 logo start*/
        $public = M("firm")->where(["id" => session('lastfirmid')])->find();
        $public['copyright'] = htmlentities($public['copyright']);
        session('public',$public);
        $this->assign("lastfirmname", $public['name']);
        /*生成全局公用版权 logo  end*/

        //登陆状态检测
        $uid = is_login();
        if (!$uid) {
            redirect('/login');
        }

        $this->checkAdminSession();
        //获取当前路由
        $rule = strtolower(MODULE_NAME . '/' . CONTROLLER_NAME . '/' . ACTION_NAME);
        $this->assign('controllerPath', $rule);        

        // 是否是超级管理员
        $level = M('User')->field('level')->where("id = $uid")->find();
        if ($level['level'] == 1) {
            define('IS_ROOT', true);
        } else {
            define('IS_ROOT', false);
        }

//        // 检测访问权限
//        $access = $this->accessControl();
//        if ($access === false) {
//            $this->error('403:禁止访问');
//        } elseif ($access === null) {
//            $dynamic = $this->checkDynamic();//检测动态权限
//            if ($dynamic === null) {
//                //检测非动态权限
////                $rule = strtolower(MODULE_NAME . '/' . CONTROLLER_NAME . '/' . ACTION_NAME);
//                if (in_array($rule, C('EXCEPTION_URL'))) {
//                } elseif (!$this->checkRule($rule, array('in', '1,2'))) {
//                    if (is_null(M('AuthRule')->where("name = '$rule'")->find())) {
//                        if (is_null(M('AuthLog')->where("content = '$rule'")->find())) {
//                            M('AuthLog')->add(['content' => $rule]);
//                        }
//                    }
//                    $this->error('未授权访问!');
//                }
//            } elseif ($dynamic === false) {
//                $this->error('未授权访问!');
//            }
//        }
        //获取当前用户详情
        $userInfo = \Home\Model\UserModel::getUserInfoByIds($uid);
        $this->uid = $uid;
        $this->userInfo = $userInfo;
        $this->assign("userinfo", $userInfo);
        $this->assign("usermobile", $userInfo['mobile']);
        //获取当前机构下的用户列表
        $ww['lastfirmid'] = session('lastfirmid');
        $ww['loginstatus'] = '1';
        $myfrimuserlist = M('user')->where($ww)->select();
        $this->assign('myfrimuserlist', $myfrimuserlist);
        //获取输入源数据
        $vlist = \Home\Model\DeviceModel::videoList_all();
        //仿p2p数据源格式封装输入源数据
        foreach ($vlist as $key => $value) {
            $vuuid = $value['device_serial'];
            $vinput = $value['video_input'];
            $videolist2[$vuuid]['v'] = unserialize($vinput);
            // $vlist[$key]['video_input'] = unserialize($vinput);
            $videolist2[$vuuid]['n'] = $value['name'];
            $videolist2[$vuuid]['t'] = $value['t'];
            $videolist2[$vuuid]['state'] = $value['state'];
        }
        $this->assign('videolist2', json_encode($videolist2));
        //获取共享资源
        $sharelist = $this->getSharelistByDid();
        $this->assign('sharelist', json_encode($sharelist));
        //检查用户lastfrimid
        $this->ckFirm();
        //获取有权限的在线设备列表
        $this->setdevicelist();
    }

    public function getSharelistByDid($a)
    {
        if($a == 'all'){
            $devicelist = M('ModulesDevice')->order("id desc")->select();
        }else{
            $devicelist = \Home\Model\DeviceModel::deviceList();
            $uid = UID;
            // $devicelist = M('ModulesDevice')->where("status = 1 AND userid = $uid AND (t = '1' or t = '2')")->order("id desc")->select();
        }
        $ss = [];
        if($devicelist && count($devicelist)>0){
            foreach ($devicelist as $key => $value) {
                $did = $value['uuid'];
                $sharemap = M('ShareMap','','DB_CONFIG_LINK');
                $ret = $sharemap->alias('a')
                ->field("c.`name` as rname, c.type as rtype, c.name, d.`uuid` as desuuid,d.`name` as desname,a.uuid,a.isall,a.n,a.g,a.nname,a.type,a.destination")
                ->join("left join link_modules_device as c on a.uuid = c.uuid")
                ->join("left join link_modules_device as d on a.destination = d.uuid")
                ->where("a.destination in ('$did','all') and a.n > 0")
                ->select();

                foreach ($ret as $k => $v) {
                    $ret[$k]['id'] = $v['n'];
                    $ret[$k]['typesName'] = "共享资源";
                    $ret[$k]['share'] = 1;
                    if ($v['g']>0) {
                        $ret[$k]['gn'] = 1;
                        $ret[$k]['grName'] = "通道".$v['g'];
                    }
                    $rs = $v['rtype'];
                    while ($rs > 0) {
                        $ppid = $rs;
                        $w3['id'] = $rs;
                        $rs = M('Type')->where($w3)->getfield('pid');
                    }
                    if ($ppid) {
                        $ret[$k]['ppid'] = $ppid;
                    } else {
                        $ret[$k]['ppid'] = 0;
                    }
                }                
                $ss = array_merge($ss,$ret);
            }
        }
        return $ss;
    }

    /**
     * 设置机构
     */
    public function ckFirm()
    {
        $this->firmid = $this->userInfo['lastfirmid'];
        $firmlist = \Home\Model\FirmModel::getFirmFromGroup($this->uid);
        if ($firmlist) {
            if ($this->firmid == 0) {
                $this->firmid = (int)array_keys($firmlist)[0];
                \Home\Model\UserModel::editUser(['lastfirmid' => $this->firmid], $this->uid);
            }
        }
        $this->firminfo = $firmlist[$this->firmid];
        $this->formatfirm = array_values(\Home\Model\FirmModel::formatFirm($this->uid));
        $this->assign("formatfirm", json_encode($this->formatfirm));
        $this->assign("firminfo", $this->firminfo);
        
        // if ($this->firmid == 0) {
        //     redirect('/Prepare');
        // }
    }

    public function setdevicelist(){
        //机构下的设备列表
        $shareall = $this->shareisall();
        if (is_array($shareall)) {
            $list = \Home\Model\DeviceModel::deviceList($this->firmid);
            $map['uuid'] = array('in',$shareall);
            $list2 = M('ModulesDevice')->field("*, status as isshare")->where($map)->select();
            $list = array_merge($list,$list2);
        }elseif($shareall){
            $list = M('ModulesDevice')->where("status = 1")->select();
        }else{
            $list = \Home\Model\DeviceModel::deviceList($this->firmid);
        }
        foreach ($list as $k => $v) {
            $where['id'] = $v["firmid"];
            $list[$k]['firmName'] = M('firm')->where($where)->getField('name');
            if ($v["type"]) {
                $w['id'] = $v["type"];
                $list[$k]['typesName'] = M('type')->where($w)->getField('name');
            }
            if ($v["types"]) {
                $w2['id'] = $v["types"];
                $list[$k]['catename'] = M('types')->where($w2)->getField('name');
            }
            $rs = $v['type'];
            while ($rs > 0) {
                $ppid = $rs;
                $w3['id'] = $rs;
                $rs = M('Type')->where($w3)->getfield('pid');
            }
            if ($ppid) {
                $list[$k]['ppid'] = $ppid;
            } else {
                $list[$k]['ppid'] = 0;
            }
        }
        $this->assign('list2', json_encode($list));
    }

    public function shareisall(){
        $mobile = session('user_auth.mobile');
        $myuuid = $mobile."_0";
        $sharemap = M('ShareMap','','DB_CONFIG_LINK');
        $w['destination'] = $myuuid;
        $w['uuid'] = 'all';
        if ($myuuid) {
            $res = $sharemap->where($w)->find();
            if ($res) {
                return true;
            }else{
                $ww['destination'] = $myuuid;
                $ww['n'] = 0;
                $reslist = $sharemap->where($ww)->getField('uuid',true);
                if ($reslist) {
                    return $reslist;
                }else{
                    return false;
                }
                
            }
        }else{
            return false;
        }        
    }

    /**
     * 通用分页列表数据集获取方法
     *
     *  可以通过url参数传递where条件,例如:  index.html?name=asdfasdfasdfddds
     *  可以通过url空值排序字段和方式,例如: index.html?_field=id&_order=asc
     *  可以通过url参数r指定每页数据条数,例如: index.html?r=5
     *
     * @param sting|Model $model 模型名或模型实例
     * @param array $where where查询条件(优先级: $where>$_REQUEST>模型设定)
     * @param array|string $order 排序条件,传入null时使用sql默认排序或模型属性(优先级最高);
     *                              请求参数中如果指定了_order和_field则据此排序(优先级第二);
     *                              否则使用$order参数(如果$order参数,且模型也没有设定过order,则取主键降序);
     *
     * @param array $base 基本的查询条件
     * @param boolean $field 单表模型用不到该参数,要用在多表join时为field()方法指定参数
     *
     * @return array|false
     * 返回数据集
     */
    protected function lists($model, $where = array(), $order = '', $base = array(), $field = true, $fetchSql = false)
    {
        $options = array();
        $REQUEST = (array)I('get.');
        if (is_string($model)) {
            $model = M($model);
        }

        $OPT = new \ReflectionProperty($model, 'options');
        $OPT->setAccessible(true);

        $pk = $model->getPk();
        if ($order === null) {
            //order置空
        } elseif (isset($REQUEST['_order']) && isset($REQUEST['_field']) && in_array(strtolower($REQUEST['_order']),
                array('desc', 'asc'))
        ) {
            $options['order'] = '`' . $REQUEST['_field'] . '` ' . $REQUEST['_order'];
        } elseif ($order === '' && empty($options['order']) && !empty($pk)) {
            $options['order'] = $pk . ' desc';
        } elseif ($order) {
            $options['order'] = $order;
        }
        unset($REQUEST['_order'], $REQUEST['_field']);

        $options['where'] = array_filter(array_merge((array)$base, /*$REQUEST,*/
            (array)$where), function ($val) {
            if ($val === '' || $val === null) {
                return false;
            } else {
                return true;
            }
        });
        if (empty($options['where'])) {
            unset($options['where']);
        }
        $options = array_merge((array)$OPT->getValue($model), $options);
        $total = $model->where($options['where'])->count();


        if (isset($REQUEST['r'])) {
            $listRows = (int)$REQUEST['r'];
        } else {
            $listRows = C('LIST_ROWS') > 0 ? C('LIST_ROWS') : 10;
        }
        $page = new \Think\Page($total, $listRows, $REQUEST);
        if ($total > $listRows) {
            $page->setConfig('theme', '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END% %HEADER%');
        }
        $p = $page->showOther();

        $this->assign('_page', $p ? $p : '');
        $this->assign('_total', $total);
        $options['limit'] = $page->firstRow . ',' . $page->listRows;

        $model->setProperty('options', $options);

        if ($fetchSql) {
            $result = $model->fetchSql(true)->field($field)->select();
        } else {
            $result = $model->field($field)->select();
        }
        return $result;
    }

    /**
     * 权限检测
     * @param string $rule 检测的规则
     * @param string $mode check模式
     * @return boolean
     */
    final protected function checkRule($rule, $type = AuthRuleModel::RULE_URL, $mode = 'url')
    {
        if (IS_ROOT) {
            return true;//管理员允许访问任何页面
        }
        static $Auth = null;
        if (!$Auth) {
            $Auth = new \Think\Auth();
        }
        if (!$Auth->check($rule, UID, $type, $mode)) {
            return false;
        }
        return true;
    }

    /**
     * 检测是否是需要动态判断的权限
     * @return boolean|null
     *      返回true则表示当前访问有权限
     *      返回false则表示当前访问无权限
     *      返回null，则会进入checkRule根据节点授权判断权限
     */
    protected function checkDynamic()
    {
        if (IS_ROOT) {
            return true;//管理员允许访问任何页面
        }
        return null;//不明,需checkRule
    }

    /**
     *
     * @return boolean|null  返回值必须使用 `===` 进行判断
     *
     *   返回 **false**, 不允许任何人访问(超管除外)
     *   返回 **true**, 允许任何管理员访问,无需执行节点权限检测
     *   返回 **null**, 需要继续执行节点权限检测决定是否允许访问
     */
    final protected function accessControl()
    {
        if (IS_ROOT) {
            return true;//管理员允许访问任何页面
        }
        $allow = C('ALLOW_VISIT');
        $deny = C('DENY_VISIT');
        $check = strtolower(CONTROLLER_NAME . '/' . ACTION_NAME);
        if (!empty($deny) && in_array_case($check, $deny)) {
            return false;//非超管禁止访问deny中的方法
        }
        if (!empty($allow) && in_array_case($check, $allow)) {
            return true;
        }
        return null;//需要检测节点权限
    }

    /**
     *curl访问网址函数
     **/
    public function curl($url = '')
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        $result = curl_exec($ch);
        curl_close($ch);
        $data = json_decode($result, true);
        return $data;
    }

    /**
     * 控制器访问此方法 可在view上得到操作（operation）变量
     * @param $controllerPath 可以传路径使用路径规则，默认为当前页面路径，格式'home/map/maplist'(区分大小写)
     */
    protected function getLastOperation($controllerPath = null)
    {
        $uid = UID;
        if (empty($controllerPath)) {
            $controllerPath = strtolower(MODULE_NAME . '/' . CONTROLLER_NAME . '/' . ACTION_NAME);
        }
        $res = M('LastOperation')->where("uid = $uid AND controller = '$controllerPath'")->find();
        if ($res) {
            $this->operation = unserialize($res['operation']);
            $this->assign('operation', $this->operation);
        } else {
            $param = array();
            $param['uid'] = UID;
            $param['controller'] = $controllerPath;
            M('LastOperation')->add($param);
            $this->assign('operation', '');
        }
    }

    /*
     * ajax轮询此方法 把操作（operation）存入mysql 间隔：5秒
     */
    public function setOperation($grid='')
    {
        $uid = UID;
        //传参是php调用，无参数是ajax调用
        if (!empty($grid)) {
            $data['curGrid'] = $grid;
            $controllerPath = "home/matrix/monitor";
            $param['operation'] = serialize($data);
            $res = M('LastOperation')->where("uid = $uid AND controller = '$controllerPath'")->save($param);
        }else{
            $controllerPath = I('controllerPath');
            $operation = serialize(I('operation'));
            $param['operation'] = $operation;
            M('LastOperation')->where("uid = $uid AND controller = '$controllerPath'")->save($param);
        }
    }

    public function getDeviceList($uuid = '')
    {
        if (empty($uuid)) {
            $type = 'ajax';
            $uuid = I('post.matrixId', '', 'trim');
        }
        if (!empty($uuid)) {
            $result = M('VideoList')->where("device_serial = '$uuid'")->getField('video_input');
            $result = unserialize($result);

            if ($result) {
                if ($type == 'ajax') {
                    $this->ajaxReturn(['status' => true, 'data' => $result]);
                } else {
                    return $result;
                }

            } else {
                if ($type == 'ajax') {
                    $this->ajaxReturn(['status' => false, 'msg' => '输入源不在线，无法读取输入源']);
                } else {
                    return array();
                }

            }
        }
    }

    //更新登陆时间
    private function checkAdminSession()
    {
        $nowTime = time();
        $sTime = session('lastLoginTime');
        $expireTime = session('loginExpireTime') ? session('loginExpireTime') : 3600;

        /* 更新数据库登录信息 */
        $data = array(
            'logintime' => $nowTime
        );

        \Home\Model\UserModel::editUser($data, UID);

        if (($nowTime - $sTime) > $expireTime) {
            session('user_auth', null);
            session('user_auth_sign', null);
            cookie('user_auth', null);
            cookie('user_auth_sign', null);
            session_destroy();
            $this->redirect('/login');
//            $this->error('登录超时，请重新登录', U('login'));
        } else {
            session('lastLoginTime', $nowTime);
        }
    }

}