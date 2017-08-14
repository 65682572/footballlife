<?php
namespace Home\Model;
use Think\Model;

class DeviceModel extends Model
{
    const LINK_TYPE_DEVICE = 1;

    /**
     * 获取标签类别
     * @param int $type
     * @return mixed
     */
    public static function tagtypes($type = self::LINK_TYPE_DEVICE)
    {
        $ret = M("Types","","DB_CONFIG_LINK")->where(['type'=>['eq',$type],'status'=>['eq',1]])->select();
        return $ret;
    }
    /**
     * 获取设备分类
     * type表
     */
    public static function getType()
    {
        $res = M("Type")->where(['status'=>1])->select();
        return $res;
    }
    /**
     * 获取机构
     * type表
     */
    public static function getFirm()
    {
        $res = M("firm")->select();
        return $res;
    }
    /**
     * 添加编辑设备信息
     * @param $filed
     * @param $id
     * @return array
     */
    public static function editDevice($filed, $id = 0)
    {
        if (!is_array($filed) || empty($filed)){
            return ["status"=>false, "msg"=>'参数不能为空！'];
        }

        //新增的情况 只会新增ID
        $obj = M('ModulesDevice','','DB_CONFIG_LINK');
        if($id > 0){

                $flag = $obj->where(['id'=>['eq', $id]])->save($filed);
        }else{
            $filed['createtime'] = time();
            //用来判断当前序列号是否被创建
            if(!$obj->where(['uuid'=>$filed['uuid']])->find()){
                $flag = $obj->add($filed);
                $id = $obj->getLastInsID();
            }else{
                return ["status"=>false, "msg"=>'序列号已经存在！'];
            }
        }

        $flag = boolval($flag);
        if($flag){
            return ["status"=>true, "msg"=>'成功！', 'id'=>$id];
        }

        return ["status"=>false, "msg"=>'操作失败！'];
    }

    /**
     * 设备列表
     * @return mixed
     */
    public static function deviceList($firmid = 0)
    {
        $uid = UID;
        if ($firmid) {
            $firmuser = M('GroupUser')->where("firmid = $firmid")->order("id desc")->getfield("userid",true);            
            $firmuser = implode(',', $firmuser);
            $list = M('ModulesDevice')->where("status = 1 AND ( userid = $uid or firmid = $firmid or (userid in ($firmuser) AND (t=1 or t=2)))")->order("id desc")->select();
        }else{
            $list = M('ModulesDevice')->where("status = 1 AND userid = $uid")->order("id desc")->select();
        }        

        return $list;
    }

//     public static function getDeviceList($firmid = 0,$userid){
//         if(!$firmid || ! $userid) return [];
//         $sql = <<<SQL
// SELECT
// b.`name` AS firmName,
// c.`name` AS typesName,
// d.`name` AS catename,
// e.`name` AS brand_name,
// f.`name` AS marking_name,
// g.`name` AS version_name,
// a.*
// FROM
// 	link_modules_device AS a
// LEFT JOIN link_firm AS b ON a.firmid = b.id
// LEFT JOIN link_types AS c ON a.types = c.id
// LEFT JOIN link_type AS d ON a.type = c.id
// LEFT JOIN link_brand AS e ON a.brands_id = e.brand_id
// LEFT JOIN link_marking AS f ON a.marking_id = f.marking_id
// LEFT JOIN link_brand_version AS g ON a.version_id = g.version_id
// where a.userid = {$userid} and a.firmid = {$firmid} ORDER BY a.id desc
// SQL;
//         $res = M()->query($sql);
//         return $res;
//     }

    /*
     * 输入源数据
     */
    public static function videoList_all(){
        $videolist = M('VideoList','','DB_CONFIG_LINK');
        $w['video_input'] = array('neq','');
        $res = $videolist
            ->alias('a')
            ->field('a.id,a.device_serial,a.video_input,b.name,b.t,b.state')
            ->join(" left join ".C('DB_PREFIX')."modules_device as b on b.uuid=a.device_serial and a.video_input<>'' ")
            ->where($w)
            ->select();
        if ($res) {
            foreach ($res as $key => $value) {
                $videolist2[$key]['video_input'] = unserialize($value['video_input']);
            }
        }
        return $res;
    }

    /**
     *获取某设备原始共享资源列表
     */
    public static function getOriginalShare($destinationid){
        if(!$destinationid) return [];
        $share = M('shareMap');
        $where['destination'] = ['in',[$destinationid,'all']];
        $res = $share->where($where)->field('uuid,isall,n,nname,g,type,destination')->distinct(true)->select();
        $data = [];
        if(!empty($res)){
            if(in_array('all',array_column($res,'uuid'))){
                //全系统所有资源
                $device = M('ModulesDevice')->where("status = 1")->field('uuid')->distinct(true)->select();
                foreach($device as $dv){
                    $data[$dv] = [[
                        'n' => 0,
                        'g' => 0
                    ]];
                }
            }else{
                foreach($res as $v){
                    $data[$v['uuid']][] = [
                        'n' => $v['n'],
                        'g' => $v['g']
                    ];
                }
                //自动共享所有资源的（uuid=uuid，isall=1，n=0）设备，去掉该设备下其他资源
                foreach($data as $a => $d){
                    if(in_array('0',array_column($d,'n'))){
                        $data[$a] = [[
                            'n' => 0,
                            'g' => 0
                        ]];
                    }
                }
            }
        }
        return $data;
    }
    /**
     * 组装api所需共享数据格式
     */
    public static function buildApiShare($uuid){
        if(!$uuid) return [];
        $data = self::getOriginalShare($uuid);
        if(!empty($data)){
            if(array_key_exists($uuid,$data)){
                unset($data[$uuid]);
            }
            $where['device_serial'] = ['in',array_keys($data)];
            $where['video_input'] = ['neq',''];
            $rarr = M('videoList')->where($where)->field('device_serial,video_input')->select();
            $ra = array_column($rarr,null,'device_serial');
            if(!empty($ra)){
                $ret = [];
                foreach($data as $dk => $dv){
                    $rinfo = unserialize($ra[$dk]['video_input']);
                    foreach($dv as $dvk => $dvv){
                        if($dvv['n'] == 0){
                            foreach($rinfo as $rk => $rv){
                                $rv['uuid'] = $dk;
                                $rv['gr'] = '';
                                if($rv['grName'] != ''){
                                    $rv['gr'] = 0;
                                }
                                $ret[($dk.'_'.$rv['id'])] = $rv;
                            }
                        }else{
                            $idarr = array_column($rinfo,null,'id');
                            if($ret[($dk.'_'.$dvv['n'])]){
                                $ret[($dk.'_'.$dvv['n'])]['gr'] .= ','.$dvv['g'];
                            }else{
                                $ret[($dk.'_'.$dvv['n'])] = $idarr[$dvv['n']];
                                $ret[($dk.'_'.$dvv['n'])]['uuid'] = $dk;
                                if($dvv['g'] == 0){
                                    $ret[($dk.'_'.$dvv['n'])]['gr'] = '';
                                }else{
                                    $ret[($dk.'_'.$dvv['n'])]['gr'] = $dvv['g'];
                                }
                            }
                        }
                    }
                }
                return $ret;
            }else{
                return [];
            }
        }else{
            return [];
        }
    }


    /**
     * uuid_n_g_nname  某个资源
     * uuid_all_0_allname  设备下所有资源
     * all_0_0_allname 全部资源
     */
    public static function buildResData($resData){
        $data = [];$final=[];
        foreach($resData as $v){
            $varr = explode('_',$v);
            $vk = $varr[0];
            $data[$vk][] = [
                'n' => $varr[1],
                'g' => $varr[2],
                'nname' => $varr[3]
            ];
        }
        if(array_key_exists('all',$data)){
            return [['uuid'=>'all','n'=>0,'g'=>0,'nname'=>'全系统所有资源']];
        }
        foreach($data as $n => $m){
            if(in_array('all',array_column($m,'n'))){
                $final[] = [
                    'uuid' => $n,
                    'n' => 'all',
                    'g' => 0,
                    'nname' => '所有资源'
                ];
            }else{
                foreach($m as $b){
                    if(!$b['nname']){
                        $b['nname'] = self::getResourceName($n,$b['n'],$b['g']);
                    }
                    $final[] = [
                        'uuid' => $n,
                        'n' => $b['n'],
                        'g' => $b['g'],
                        'nname' => $b['nname'],
                    ];
                }
            }
        }
        return $final;
    }

    /**
     * 获取资源名称
     */
    public static function getResourceName($uuid,$n,$g=0){
        if(!$uuid || !$n) return '';
        $r = M('videoList')->where("device_serial = '$uuid'")->field('video_input')->find();
        if(empty($r) || !$r['video_input']){
            return '';
        }else{
            $rarr = unserialize($r['video_input']);
            $rarr2 = array_column($rarr,null,'id');
            $nname = $rarr2[$n]['name'];
            if($g != 0){
                $garr = explode(',',$rarr2[$n]['grName']);
                $gname = $garr[($g-1)];
                $rt = $nname . ':' . $gname;
                return $rt;
            }else{
                return $nname;
            }
        }
    }

    /**
     * [101,102,all]
     */
    public static function buildDevData($deviceData){
        if(in_array('all',$deviceData)){
            $deviceData = ['all'];
        }
        return $deviceData;
    }

    public static function buildData($deviceData,$resData,$uid=0){
        if(!$uid) $uid = UID;
        $saveData = [];
        $commonData = [
            'modifytime' => time(),
            'userid' => $uid
        ];
        foreach($deviceData as $k => $v){
            foreach($resData as $d => $e){
                if($v != 'all' && ($e['uuid'] == $v)){
                    continue;//过滤自己共享给自己 除了所有对所有
                }
                if($e['n'] == 'all'){
                    array_push($saveData,array_merge(['uuid'=>$e['uuid'],'isall'=>1,'n'=>0,'g'=>0,'nname'=>$e['nname'],'destination'=>$v],$commonData));
                }else{
                    array_push($saveData,array_merge(['uuid'=>$e['uuid'],'isall'=>0,'n'=>$e['n'],'g'=>$e['g'],'nname'=>$e['nname'],'destination'=>$v],$commonData));
                }
            }
        }
        return $saveData;
    }

    /**
     * 获取所有资源分类树
     */
    public static function getAllResourceType($firmid=0){
        if(!$firmid){
            return [];
        }
        $users = M('groupUser')->where("firmid=$firmid")->distinct(true)->field('userid')->select();
        $useridarr = implode(',',array_column($users,'userid'));
        $sql = <<<SQL
SELECT
	CONCAT('device',id) as id,name as text,uuid,type
FROM
	link_modules_device AS a
WHERE
	a.`status` = 1
AND
a.firmid = $firmid
UNION select CONCAT('device',id) as id,name as text,uuid,type from link_modules_device AS b where b.`status` = 1 and b.firmid = 0 and b.userid in($useridarr)
SQL;
        $device = M()->query($sql);
//        $device = M('ModulesDevice')->where($map)->field('CONCAT(\'device\',id) as id,name as text,uuid,type')->order("id desc")->select();
        $type = M("Type")->field('id,name as text,pid,icon')->where(['status' => 1])->select();
        $typearr = array_column($type,null,'id');
        $uuidarr = array_column($device,'uuid');
        $devicearr = array_column($device,null,'uuid');
        $where['device_serial'] = ['in',$uuidarr];
        if(!$uuidarr){
            return [];
        }
        $vedio_list = M('videoList')->field('device_serial,video_input')->where($where)->select();
        foreach($vedio_list as $vk => $ve){
            $resourceinfo = unserialize($ve['video_input']);
            $resoucearr = [];
            if(!empty($resourceinfo)){
                foreach ($resourceinfo as $nk => $nv) {
                    $resoucearr[$nk]['text'] = $nv['name'];
                    $resoucearr[$nk]['id'] = $ve['device_serial'] . '_' . $nv['id'] . '_0';
                    $resoucearr[$nk]['isneed'] = 'true';
                    if(!empty($nv['grName'])){
                        $childarr = explode(',',$nv['grName']);
                        foreach($childarr as $ck => $cv){
                            $childarr[$ck] = [
                                'id' => $ve['device_serial'] . '_' . $nv['id'] . '_' . ($ck+1),
                                'text' => $cv,
                                'isneed'=>'true',
                                'isleaf'=>'true'
                            ];
                        }
                        $resoucearr[$nk]['children'] = $childarr;
                    }
                }
                array_unshift($resoucearr,['id'=>$ve['device_serial'].'_all_0','text'=>'自动共享该设备：'.$devicearr[$ve['device_serial']]['text'],'isneed'=>'true']);
                $devicearr[$ve['device_serial']]['children'] = $resoucearr;
            }
        }
        foreach($devicearr as $dk => $dv){
            if(isset($typearr[$dv['type']])){
                $typearr[$dv['type']]['children'][] = $dv;
            }
        }
        $res = [];
        foreach($typearr as $k => $v){
            if(!empty($typearr[$v['pid']])){
                if(empty($typearr[$v['pid']]['children'])){
                    $typearr[$v['pid']]['children'] = [];
                }
                $typearr[$v['pid']]['children'][] = &$typearr[$v['id']];
            }else{
                $res[] = &$typearr[$v['id']];
            }
        }
        return $res;//exit();
    }

    /**
     * 组装矩阵需要的配置文件
     */
    public static function buildConfigFile($destinationid){
        if(!$destinationid) return [];
        $share = M('shareMap');
        $where['destination'] = ['in',[$destinationid,'all']];
        $res = $share->where($where)->field('uuid,isall,n,nname,g,type,destination')->distinct(true)->select();
        //按矩阵需要的格式组装数据

        $data = [];$final = [];
        if(!empty($res)){
            if(in_array('all',array_column($res,'uuid'))){
                //全系统所有资源
                $device = M('ModulesDevice')->where("status = 1")->field('uuid,name')->distinct(true)->select();
                foreach($device as $dv){
                    $data[$dv['uuid']] = [[
                        'un' => $dv['name'],
                        'n' => 0,
                        'g' => 0
                    ]];
                }
            }else{
                foreach($res as $v){
                    $data[$v['uuid']][] = [
                        'un' => $v['nname'],
                        'n' => $v['n'],
                        'g' => $v['g']
                    ];
                }
                //自动共享所有资源的（uuid=uuid，isall=1，n=0）设备，去掉该设备下其他资源
                foreach($data as $a => $d){
                    if(in_array('0',array_column($d,'n'))){
                        $data[$a] = [[
                            'un' => $d[0]['un'],
                            'n' => 0,
                            'g' => 0
                        ]];
                    }
                }
            }
        }
        foreach($data as $x => $y){
            $p = [];
            foreach($y as $j){
                $p[] = [
                    't' => 1,
                    'n' => $j['n'],
                    'g' => $j['g'],
                ];
            }
            $final[] = [
                'uuid' => $x,
                'nm' => $y[0]['un'],
                'p' => $p,
            ];
        }
        return $final;
    }
    /**
     * 新增加的设备触发共享事件
     */
    public static function newDeviceBePush($uuid = null){
        if(!$uuid) return false;
        //查询该设备有没有自动共享给别的设备
        $res = M('shareMap')->where(['uuid'=>['in',['all',$uuid]]])->field('destination')->distinct(true)->select();
        $devices = array_column($res,'destination');
        if(!empty($devices)){
            M('shareCron')->add(['devices'=>serialize($devices),'createtime'=>time()]);
        }
    }

    /**
     * 设备上线触发共享信息推送
     */
    public static function shareBePushed($str){
        $arr = explode('$',$str);
        $uuid = $arr[1];
        $socketno = $arr[0];
        if(!$uuid || !$socketno) return false;
        $push = M('shareNotonline')->where(['uuid'=>['eq',$uuid],'status'=>['eq',0]])->find();
        if(!empty($push)){
            $pushData = unserialize($push['resource']);
            $json = json_encode($pushData,JSON_UNESCAPED_UNICODE);
            $rand = rand(1000,10000);
            if(!empty($pushData)){
                //socket发送  socket连接号$设备序列号$输入源配置数据
                $pstring = $socketno.'$'.$uuid.'$@'.$rand.'/'.$json;
            }else{
                $pstring = $socketno.'$'.$uuid.'$@'.$rand.'/';
            }
            msu7server_send($pstring, '0x12000064');
            M('shareNotonline')->where(['id'=>$push['id']])->save(['status'=>1,'modifytime'=>time()]);
        }
    }

    /**
     *
     */
    public static function pushNow($devlist,$id=0){
        $sharecron = M('shareCron');
        $shareNotonline = M('shareNotonline');
        $date = date('y_m_d');
        if(!empty($devlist)){
            if(in_array('all',$devlist)){
                $de = M('modulesDevice')->where('status = 1')->field('uuid')->select();
                $devlist = array_column($de,'uuid');
            }
            $mc = new \Memcached();
            foreach($devlist as $k => $v){
                $socketno = '';//socket连接号
                $uuid = $v;
                $pushData = \Home\Model\DeviceModel::buildConfigFile($v);
                $mc->addServer('127.0.0.1', 11211);
                $socketarr = $mc->get('device_info');
                if(array_key_exists($uuid,$socketarr)){
                    $socketno = $socketarr[$uuid];
                }else{
                    \Think\Log::write($uuid.':设备不在线。','INFO','',C('LOG_PATH').'cron_'.$date.'.log');
                    $notonline = $shareNotonline->where("status = 0 and uuid='$uuid'")->find();
                    if(!empty($notonline)){
                        $shareNotonline->where("status = 0 and uuid='$uuid'")->save(['resource'=>serialize($pushData),'createtime'=>time()]);
                    }else{
                        $shareNotonline->add(['uuid'=>$uuid,'resource'=>serialize($pushData),'createtime'=>time()]);
                    }
                    continue;
                }
                $json = json_encode($pushData,JSON_UNESCAPED_UNICODE);
                $rand = rand(1000,10000);
                //todo 发送给该设备
                if(!empty($pushData)){
                    //socket发送  socket连接号$设备序列号$输入源配置数据
                    $pstring = $socketno.'$'.$uuid.'$@'.$rand.'/'.$json;
                }else{
                    $pstring = $socketno.'$'.$uuid.'$@'.$rand.'/';
                }
                $r = \Home\Model\DeviceModel::curlCommon('http://115.159.117.149:2345/MsgPush/start','post',['pst'=>$pstring,'ty' => '0x12000064']);
                if($r){
                    \Think\Log::write($uuid.'发送成功。数据：'.$pstring,'INFO','',C('LOG_PATH').'cron_'.$date.'.log');
                }else{
                    $notonline = $shareNotonline->where("uuid='$uuid'")->find();
                    if(!empty($notonline)){
                        $shareNotonline->where("uuid='$uuid'")->save(['resource'=>serialize($pushData),'createtime'=>time()]);
                    }else{
                        $shareNotonline->add(['uuid'=>$uuid,'resource'=>serialize($pushData),'createtime'=>time()]);
                    }
                    \Think\Log::write($uuid.'发送失败。','INFO','',C('LOG_PATH').'cron_'.$date.'.log');
                }
            }
            if($id){
                $sharecron->where(['id'=>['eq',$id]])->save(['status'=>1,'modifytime'=>time()]);
            }
        }else{
            \Think\Log::write('无待发送数据======','INFO','',C('LOG_PATH').'cron_'.$date.'.log');
        }
    }

    /**
     * 共享改变触发事件
     */
    public static function getShareCron(){
        $sharecron = M('shareCron');
        $cron = $sharecron->where('status = 0')->order('id asc')->find();
        $devlist = unserialize($cron['devices']);
        self::pushNow($devlist,$cron['id']);
    }

    public static function curlCommon($url,$type = 'get',$data){
        if(!$url || !$type || !$data){
            return false;
        }
        if(!empty($data)){
            $data = http_build_query($data);
        }
        if($type == 'get'){
            $url = $url . '?' . $data;
        }
        $con = curl_init($url);
        curl_setopt($con, CURLOPT_HEADER, false);
        if($type == 'post'){
            curl_setopt($con, CURLOPT_POST,true);
            curl_setopt($con, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($con, CURLOPT_RETURNTRANSFER,true);
        $output = curl_exec($con);
        curl_close($con);
        return $output;
    }
    /**
     * 获取设备下的所有共享资源列表tree
     */
    public static function getListByDevice($darr = []){
        if(empty($darr)){
            return [];
        }
        $device = M('ModulesDevice')->where("status = 1")->field('CONCAT(\'device\',id) as id,name as text,uuid,type')->order("id desc")->select();
        $uuidarr = array_column($device,'uuid');
        $devicearr = array_column($device,null,'uuid');
        $where['device_serial'] = ['in',$uuidarr];
        $vedio_list = M('videoList')->field('device_serial,video_input')->where($where)->select();
        foreach($vedio_list as $vk => $ve){
            $resourceinfo = unserialize($ve['video_input']);
            $resoucearr = [];
            if(!empty($resourceinfo)){
                foreach ($resourceinfo as $nk => $nv) {
                    $nkk = $ve['device_serial'] . '_' . $nv['id'] . '_0';
                    $resoucearr[$nkk]['text'] = $nv['name'];
                    $resoucearr[$nkk]['id'] = $ve['device_serial'] . '_' . $nv['id'] . '_0';
                    $resoucearr[$nkk]['isneed'] = 'true';
                    if(!empty($nv['grName'])){
                        $childarr = explode(',',$nv['grName']);
                        $car = [];
                        foreach($childarr as $ck => $cv){
                            $ckk = $ve['device_serial'] . '_' . $nv['id'] . '_' . ($ck+1);
                            $car[$ckk] = [
                                'id' => $ckk,
                                'text' => $cv,
                                'isneed'=>'true',
                                'isleaf'=>'true'
                            ];
                        }
                        $resoucearr[$nkk]['children'] = $car;
                    }
                }
                $devicearr[$ve['device_serial']]['children'] = $resoucearr;
            }
        }
        $res = [];$ll = [];
        foreach($darr as $dk => $dv){
            $rlist = \Home\Model\DeviceModel::getShareByDid($dv);
            foreach($rlist as $rk => $rv){
                $l = explode('_',$rk);
                $ll[$dv][$l[0]][] = ['n'=>$l[1],'g'=>$l[2]];
            }
        }
        header("Content-type:text/html;charset=utf-8");
        print_r($ll);//print_r($devicearr);
        foreach($ll as $lk => $lv){//lk 机构id,lvk资源uuid,lvvv资源具体信息[n=>1,g=>1]
            $res[$lk] = [];
            foreach($lv as $lvk => $lvv){
                if($lvk == 'all'){
                    $res[$lk] = $devicearr;
                    continue;
                }else{
                    foreach($lvv as $lvvk => $lvvv){
                        if($lvvv['n'] == 'all'){
                            $res[$lk][$lvk] = $devicearr[$lvk];
                            continue;
                        }else{
                            if(empty($res[$lk][$lvk])){
                                $res[$lk][$lvk] = [
                                    'id' => $devicearr[$lvk]['id'],
                                    'text' => $devicearr[$lvk]['text'],
                                    'uuid' => $devicearr[$lvk]['uuid'],
                                    'type' => $devicearr[$lvk]['type'],
                                ];
                            }
                            $kkkk = $lvk.'_'.$lvvv['n'].'_'.$lvvv['g'];
                            if($lvvv['g'] == 0){
                                $res[$lk][$lvk]['children'][$kkkk] = $devicearr[$lvk]['children'][$kkkk];
                            }else{
                                $vvvv = $lvk.'_'.$lvvv['n'].'_0';
                                if(empty($res[$lk][$lvk]['children'][$vvvv])){
                                    $res[$lk][$lvk]['children'][$vvvv] = [
                                        'id' => $devicearr[$lvk]['children'][$vvvv]['id'],
                                        'text' => $devicearr[$lvk]['children'][$vvvv]['text'],
                                        'isneed' => $devicearr[$lvk]['children'][$vvvv]['isneed'],
                                    ];
                                }
                                $res[$lk][$lvk]['children'][$vvvv]['children'][$kkkk] = $devicearr[$lvk]['children'][$vvvv]['children'][$kkkk];
                            }
                        }
                    }
                }
            }
        }
        print_r($res);
    }

    /**
     * @param $did
     * @return 获取设备的所有共享资源详细列表
     */
    public static function getSharelistByDid(){
        $devicelist = \Home\Model\DeviceModel::deviceList(session('lastfirmid'));
        $ss = [];
        if($devicelist && count($devicelist)>0){
            foreach ($devicelist as $key => $value) {
                $did = $value['id'];
                $sharemap = M('ShareMap','','DB_CONFIG_LINK');
                $ret = $sharemap->alias('a')
                ->field("c.`name` as rname,a.uuid,a.isall,a.n,a.g,a.nname,a.type,a.destination")
                ->join("left join link_modules_device as c on a.uuid = c.uuid")
                ->where("a.destination in ($did,'all')")
                ->select();

                foreach ($ret as $k => $v) {
                    $ret[$k]['id'] = $v['n'];
                    $ret[$k]['name'] = $v['nname'];
                    $ret[$k]['typesName'] = "共享资源";
                    $ret[$k]['share'] = 1;
                    if ($v['g']>0) {
                        $ret[$k]['gn'] = 1;
                        $ret[$k]['grName'] = "通道".$v['g'];
                    }
                }                
                $ss = array_merge($ss,$ret);
            }
        }
        return $ss;
    }

    /**
     * @param $did
     * @return 获取单个设备的所有共享资源
     */
    public static function getShareByDid($did){
        if(!$did){
            return [];
        }else{
            $sql = <<<SQL
SELECT distinct
	c.`name` as rname,a.uuid,a.isall,a.n,a.g,a.nname,a.type,a.destination
FROM
	`link_share_map` AS a
left join	link_modules_device as c on a.uuid = c.uuid
where a.destination in ('$did','all')
ORDER BY a.destination desc,uuid,n,g
SQL;
            $res = M('shareMap')->query($sql);
            //按矩阵需要的格式组装数据
            $data = [];$final = [];
            if(!empty($res)){
                if(in_array('all',array_column($res,'uuid'))){
                    //全系统所有资源
                    return ['all_0_0' => 'all_0_0_全系统所有资源'];
                }else{
                    $ret = [];$all = [];
                    foreach($res as $rv){
                        if($rv['isall'] == 1){
                            $all[] = $rv['uuid'];
                        }
                    }
                    foreach($res as $rrv){
                        if(in_array($rrv['uuid'],$all) && $rrv['isall'] != 1){
                            continue;
                        }else{
                            $k = $rrv['isall'] == 1 ? ($rrv['uuid'].'_all_0') : ($rrv['uuid'].'_'.$rrv['n'].'_'.$rrv['g']);
                            $n = $rrv['isall'] == 1 ? ($rrv['rname'].$rrv['nname']) : ($rrv['rname'].':'.$rrv['n'].':'.$rrv['g'].'('.$rrv['nname'].')');
                            $ret[$k] = $n;
                        }
                    }
                    return $ret;
                }
            }
        }
    }

    public static function unionOneDestination($data){
        $sharelist = [];
        if(empty($data)) return $sharelist;
        foreach($data as $k => $v){
            if(!empty($sharelist[$v['destination']])){
                $r = $v['isall'] == 1 ? ($v['rname'].$v['nname']) : ($v['rname'].':'.$v['n'].':'.$v['g'].'('.$v['nname'].')');
                $sharelist[$v['destination']]['resource'][] = $r;
                $rid = $v['isall'] == 1 ? ($v['uuid'].'_all_0') : ($v['uuid'].'_'.$v['n'].'_'.$v['g']);
                $sharelist[$v['destination']]['rid'] .= '|'.$rid;
            }else{
                $sharelist[$v['destination']] = [
                    'desid' => $v['destination'],
//                    'dname' => $v['destination'] == 'all' ? '所有设备' : $v['dname'],
                    'rid' => $v['isall'] == 1 ? ($v['uuid'].'_all_0') : ($v['uuid'].'_'.$v['n'].'_'.$v['g'])
                ];
                if($v['uuid'] == 'all'){
                    $r = '全系统所有资源';
                }else{
                    $r = $v['isall'] == 1 ? ($v['rname'].$v['nname']) : ($v['rname'].':'.$v['n'].':'.$v['g'].'('.$v['nname'].')');
                }
                $sharelist[$v['destination']]['resource'][] = $r;
            }
        }
        return $sharelist;
    }

    /**
     * 获取所有设备
     */
    public static function getAllDevices($firmid=0){
        $where['status'] = ['eq',1];
        if(!$firmid){
            return [];
        }
        $users = M('groupUser')->where("firmid=$firmid")->distinct(true)->field('userid')->select();
        $useridarr = implode(',',array_column($users,'userid'));//dumpd($useridarr);
        $sql = <<<SQL
SELECT
	*
FROM
	link_modules_device AS a
WHERE
	a.`status` = 1
AND
a.firmid = $firmid
UNION select * from link_modules_device AS b where b.`status` = 1 and b.firmid = 0 and b.userid in($useridarr)
SQL;
        $list = M()->query($sql);
//        $list = M('ModulesDevice')->where($where)->field('uuid,name')->order("id desc")->select();
        return $list;
    }

    /**
     * 获取所有机构
     */
    public static function getAllFirms(){
        $list = M('firm')->where("status = 1")->field('id,name')->order("id desc")->select();
        return $list;
    }

    /**
     * 获取已被共享所有资源的设备或者机构
     * 1：机构 2设备
     */
    public static function getalreadyShare($field){
        $list = M('ShareMap')->where('isall = 1 and type != 0')->field($field)->select();
        return $list;
    }

    /**
     * 获取共享操作日志列表
     */
    public function getShareLog($uid = 0,$pagesize = null,$pagenum = null)
    {
        if(!$uid){
            $where = '1=1';
        }else{
            $where = "link_share_log.userid = $uid";
        }
        $list = M('shareLog')->join('link_user ON link_user.id = link_share_log.userid')
            ->field('link_user.username,link_share_log.*')->where($where)->order('link_share_log.id desc');
        if($pagesize && $pagenum){
            $list = $list->page($pagenum,$pagesize);
        }
        $list = $list->select();
        return $list;
    }

    /**
     * 获取共享操作日志列表
     */
    public function getShareConfig($firmid = 0,$uid = 0,$pagesize = null,$pagenum = null)
    {
        $where = '1=1';
        if($uid){
            $where .= " and link_share_config.userid = $uid";
        }
        if($firmid){
            $where .= " and link_share_config.firmid = $firmid";
        }
        $list = M('shareConfig')->join('link_user ON link_user.id = link_share_config.userid')
            ->field('link_user.username,link_share_config.*')->where($where)->order('link_share_config.id desc');
        if($pagesize && $pagenum){
            $list = $list->page($pagenum,$pagesize);
        }
        $list = $list->select();
        return $list;
    }

    /**
     * 获取单条配置信息
     */
    public static function getConfigById($id){
        if(!$id){
            return false;
        }else{
            $res = M('shareConfig')->where(['id'=>$id])->find();
            if(!empty($res)){
                $res['device'] = unserialize($res['device']);
                $res['devicename'] = unserialize($res['devicename']);
                $res['resource'] = unserialize($res['resource']);
                $res['resourcename'] = unserialize($res['resourcename']);
            }
            return $res;
        }
    }

    /**
     * 清空某设备原来的共享信息
     */
    public static function deleteShareByDid($did){
        if(!$did) return false;
        $res = M('shareMap')->where(['destination' => ['in',$did]])->delete();
        return $res;
    }

    /**
     * 删除共享信息
     */
    public static function deleteShare($did,$uid=0,$stype=0){
        if(!$did) return false;
        if(!$uid) $uid = UID;
        \Home\Model\DeviceModel::deleteShareByDid($did);
        $logdata = \Home\Model\DeviceModel::buildLogData([$did],[],$uid,$stype);
        M('shareLog')->add($logdata);
        $crondata = [
            'devices' => serialize([$did]),
            'createtime' => time(),
        ];
        $res = M('shareCron')->add($crondata);
        return $res;
    }
    /**
     *
     */
    public static function deleteConfig($id){
        if(!$id) return false;
        $od = self::deleteConfigById($id);
        if($od){
            M('shareConfig')->where(['id'=>$id])->delete();
            $crondata = [
                'devices' => $od['device'],
                'createtime' => time(),
            ];
            $res = M('shareCron')->add($crondata);
            return $res;
        }else{
            return false;
        }
    }
    /**
     * 根据id删除配置
     */
    public static function deleteConfigById($id){
        if(!$id) return false;
        $res = M('shareConfig')->find($id);
        $map = M('shareMap');
        if(!empty($res)){
            $deviceData = unserialize($res['device']);
            $resData = unserialize($res['resource']);
            foreach($deviceData as $k => $v){
                foreach($resData as $d => $e){
                    $w = array_combine(['uuid','n','g'],explode('_',$e));
                    $w['destination'] = $v;
                    $map->where($w)->delete();
                }
            }
            return $res;
        }
        return false;
    }
    /**
     * 处理原来的共享配置逻辑
     */
    public static function dealConfig($type,$newResource=[],$newDevice=[],$configname='',$id=0,$userid=0,$stype=0,$firmid=0){
        //$type:1 新增 ;2 修改
        if(empty($newDevice)) return false;
        if($type == 2 && !$id) return false;
        if(!$userid) $userid = UID;
        if($type == 2){
            self::deleteConfigById($id);
        }
        $data = self::buildLogData($newDevice,$newResource,$userid,$stype,$firmid);
        if($configname){
            $data['configname'] = $configname;
        }
        if($type == 2){
            $ret = M('shareConfig')->where(['id'=>$id])->save($data);
        }else{
            $ret = M('shareConfig')->add($data);
        }
        return $ret;
    }

    /**
     * 共享信息保存
     * $saveData 要保存的 组装好了的数据
     * $dataDevice 原始设备数组
     * $resData 原始资源数组
     */
    public static function saveShareAndLog($saveData,$dataDevice,$resData,$userid=0,$stype=0,$firmid=0){
        $sharemodel = M('shareMap');
        if(!$userid) $userid = UID;
        $sharemodel->startTrans();
        try{
            $sharemodel->addAll($saveData);
            $logdata = \Home\Model\DeviceModel::buildLogData($dataDevice,$resData,$userid,$stype,$firmid);
            $res = M('shareLog')->add($logdata);
            $crondata = [
                'devices' => serialize($dataDevice),
                'createtime' => time(),
            ];
            $res = M('shareCron')->add($crondata);
            //实时推送共享
//            self::pushNow($dataDevice);
            if($res){
                $sharemodel->commit();
                return ['status' => true, 'msg' => '操作成功！'];
            }else{
                $sharemodel->rollback();
                return ['status' => false, 'msg' => '操作失败！'];
            }
        }catch(Think\Exception $e){
            $error = $e->getMessage();
            $sharemodel->rollback();
            return ['status' => false, 'msg' => $error];
        }
    }

    /**
     * 组装共享日志数据
     */
    public static function buildLogData($dataDevice,$resData,$userid=0,$stype=0,$firmid=0){
        $where['uuid'] = ['in',$dataDevice];
        if(in_array('all',$dataDevice)){
            $firms = [['id'=>'all','name'=>'所有设备']];
        }else{
            $firms = M('modulesDevice')->where($where)->field('uuid,name')->select();
        }
//        print_r($firms);exit();
        $rdata = [];
        $rname = [];
        if(!empty($resData)){
            $uuidarr = array_column($resData,'uuid');
            $uwhere['uuid'] = ['in',$uuidarr];
            $uuidname = M('modulesDevice')->where($uwhere)->field('uuid,name')->select();
            $namearr = [];
            foreach($uuidname as $uk => $uv){
                $namearr[$uv['uuid']] = $uv['name'];
            }
            foreach($resData as $k => $v){
                $id = $v['uuid'].'_'.$v['n'].'_'.$v['g'];
                array_push($rdata,$id);
                if($v['uuid'] == 'all'){
                    $name = '全系统所有资源';
                }else{
                    $name = $namearr[$v['uuid']] . ':' . $v['n'] .':'.$v['g']. '(' . $v['nname'] . ')';
                }
                array_push($rname,['id'=>$id,'name'=>$name]);
            }
        }
        $logdata = [
            'firmid' => $firmid,
            'userid' => $userid,
            'device' => serialize($dataDevice),
            'devicename' => serialize($firms),
            'resource' => serialize($rdata),
            'resourcename' => serialize($rname),
            'sourcetype' => $stype,
            'time' => time()
        ];
        return $logdata;
    }

    /**
     * 获取共享信息
     */
    public static function getShareMap(){
        $sql = 'SELECT distinct
	c.`name` as rname,a.uuid,a.isall,a.n,a.g,a.nname,a.type,a.destination
FROM
	`link_share_map` AS a
left join	link_modules_device as c on a.uuid = c.uuid
ORDER BY a.destination desc,uuid,n,g';
        $list = M('shareMap')->query($sql);
        return $list;
    }

    /**
     * 发起soket查询更新设备输入源
     * @param $uuid
     * @return bool
     */
    public static function sendP2p($uuid)
    {
        if (empty($uuid)){
            return false;
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://www.msu7.net:2345/?uuid=$uuid&argu=0x11000003");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $output = curl_exec($ch);
        curl_close($ch);

        return true;
    }

    /**
     * 获取经纬度
     * @param $firmid
     * @return array
     */
    public static function getXy($firmid)
    {
        $firmid = intval($firmid);
        if ($firmid < 1){
            return [];
        }

        $obj = M('Xy','','DB_CONFIG_LINK');
        $list = $obj->where(['firmid'=>['eq', $firmid], 'status'=>['eq', 1]])->select();

        if (empty($list)){
            return [];
        }

        $data = [];
        foreach ($list as $v){
            array_push($data, [
                'ip' => $v['ip'],
                'lng' => $v['lng'],
                'lat' => $v['lat']
            ]);
        }

        return $data;
    }

    /**
     * 设置经纬度
     * @param $filed
     * @param int $id
     * @return array
     */
    public static function setXy($filed, $firmid = 0, $ip= '')
    {
        if (!is_array($filed) || empty($filed)){
            return ["status"=>false, "msg"=>'参数不能为空！'];
        }

        //新增的情况 只会新增ID
        $obj = M('Xy','','DB_CONFIG_LINK');
        if($firmid > 0 && !empty($ip)){
            $filed['updatetime'] = time();
            $flag = $obj->where(['firmid'=>['eq', $firmid], 'ip' => ['eq', $ip]])->save($filed);
        }else{
            $filed['createtime'] = time();
            $flag = $obj->add($filed);
        }

        $flag = boolval($flag);
        if($flag){
            return ["status"=>true, "msg"=>'成功！'];
        }

        return ["status"=>false, "msg"=>'操作失败！'];
    }

    /**
     * 获取三级分类
     *
     */
    public static function get_level_type($all_type,$res_data = [],$pid=0 )
    {
        if($all_type){
            foreach($all_type as $key => $value ){
                if($value['pid'] == $pid){
                    $all_type[$key]['is_level'] = 1;
                    $res_data[$value['id']] = $all_type[$key];
                    unset($all_type[$key]);
                }
            }
            if($all_type){
                foreach($all_type as $key => $value){
                    foreach($res_data as $k => $v){
                        if($k == $value['pid']){
                            $value['is_level'] = 2;
                            $res_data[$k][$value['id']] = $value;
                            unset($all_type[$key]);
                        }
                    }
                }
            }

            if($all_type){
                foreach($all_type as $key => $value){
                    foreach($res_data as $k => $v){
                        foreach($v as $ke => $val){
                            if(is_array($val)){
                                if($ke == $value['pid']){
                                    $value['is_level'] = 3;
                                    $res_data[$k][$ke][$value['id']] = $value;
                                    unset($all_type[$key]);
                                }
                            }
                        }
                    }
                }
            }

            if($all_type){
                foreach($all_type as $key => $value){
                    foreach($res_data as $k => $v){
                        foreach($v as $ke => $val){
                            if(is_array($val)){
                                foreach($val as $ke4 => $val4) {
                                    if ($ke4 == $value['pid']) {
                                        $value['is_level'] = 4;
                                        $res_data[$k][$ke][$ke4][$value['id']] = $value;
                                        unset($all_type[$key]);
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }

        return $res_data;

    }

    /**
     * 判断当前是否超过四级分类
     *$pid 当前的上级ID
     */
    public static function is_three_level($pid, $is_level = 1)
    {
        if($pid == 0)
        {
            return $is_level;
        }
        $level = M('type')->where(['id'=>$pid])->find();
        if($level['pid'] != 0)
        {
            $is_level += 1;
            self::is_three_level((int)$level['pid'],$is_level);
        }
        return $is_level;
    }

    /**
     * 获取有权限使用的参数列表
     *
     */
    public static function paramList(){
        $firmid = session('lastfirmid');
        $userid = session('user_auth.uid');
        $w['userid'] = $userid;
        $w['firmid'] = $firmid;
        $res = M('paramet')->where($w)->select();
        foreach ($res as $key => $value) {
            $where['parametid'] = $value['id'];
            $res[$key]['paramvalue'] = M('DeviceParamet')->where($where)->getfield('paramvalue');
        }
        return $res;
    }

    /**
     * 取得所属机构下所有设备
     * $param array $userFirmList
     */
    public static function getAllDevice($userFirmList, $page, $rows, $type = 0, $types = 0, $keywords = null)
    {
        $sql1 = '';

        foreach ($userFirmList as $k => $v) {
            if ($k == count($userFirmList) - 1) {
                $sql1 .= 'a.firmid = ' . $v;
            } else {
                $sql1 .= 'a.firmid = ' . $v . ' or ';
            }
        }

        $sql2 = '';

        $userList = self::firmUsers($userFirmList);

        foreach ($userList as $k => $v) {
            if ($k == count($userList) - 1) {
                $sql2 .= 'userid = ' . $v;
            } else {
                $sql2 .= 'userid = ' . $v . ' or ';
            }
        }

        if (!empty($sql1) && !empty($sql2)) {
            $sql = '(' . $sql1 . ' or ' . $sql2 . ') AND a.status = 1';
        } elseif (!empty($sql1)) {
            $sql = '(' . $sql1 . ') AND a.status = 1';
        } elseif (!empty($sql2)) {
            $sql = '(' . $sql2 . ') AND a.status = 1';
        } else {
            return [];
        }

        if ($type > 0 && empty($types)) {
            $sql .= ' AND a.type = ' . $type;
        } elseif ($types > 0 && empty($type)) {
            $sql .= ' AND a.types = ' . $types;
        } elseif ($type > 0 && $types > 0) {
            $sql .= ' AND a.type = ' . $type . ' AND a.types = ' . $types;
        }

        if (isset($keywords)) {
            $sql .= ' AND a.name LIKE \'%' . $keywords . '%\'';
        }

        $res = M('ModulesDevice')->alias('a')->field('a.*,b.m_icon_online,b.m_icon_offline')->join('__TYPE__ as b ON a.type = b.id', 'left')->where($sql)->order('state desc')->page($page . ',' . $rows)->select();

        return $res;
    }

    /**
     * 获取机构下的用户
     * @param array $userFirmList
     * @return array userArray
     */
    public static function firmUsers($userFirmList)
    {
        if (!is_array($userFirmList)) {
            return [];
        }

        $sql = '';

        foreach ($userFirmList as $k => $v) {
            if ($k == count($userFirmList) - 1) {
                $sql .= 'firmid = ' . $v;
            } else {
                $sql .= 'firmid = ' . $v . ' or ';
            }
        }

        $ret = M('GroupUser')->field('userid')->where("($sql) AND status = 1")->select();

        $list = hd_array_column($ret, 'userid');
        !is_array($list) && $list = [];
        $list = array_unique($list);
        $list = array_values($list);

        return $list;
    }

}