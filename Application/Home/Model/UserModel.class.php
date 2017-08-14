<?php
namespace Home\Model;
use Think\Model;

class UserModel extends Model
{
    const MOBILE_REGISTER_VERIFY_CODE = 'mobile_%s_verify_code';
    const MOBILE_BIND_VERIFY_CODE = 'mobilebind_%s_verify_code';
    const MOBILE_FINDPWD_VERIFY_CODE = 'mobilefindpwd_%s_verify_code';
    public static $sms_type = [
        1 => self::MOBILE_REGISTER_VERIFY_CODE,
        2 => self::MOBILE_BIND_VERIFY_CODE,
        3 => self::MOBILE_FINDPWD_VERIFY_CODE
    ];

    const MC_USER_INFO = 'SHAKEUSER_INFO_%s';
    const MC_USER_AVATARA = 'SHAKEUSER_AVATARA_%s';
    const AVATAR_DEFAULT = '/Public/common/images/profile_small.jpg';

    //图像大小
    const AVATAR_SIZE_40x40 = 40;
    const AVATAR_SIZE_60x60 = 60;
    const AVATAR_SIZE_80x80 = 80;

    //静态缓存
    private static $_avatara_cache = [];
    private static $_userinfo_cache = [];

    private static $_filed_user = [
        'username',
        'mobile',
        'email',
        'password',
        'salt',
        'status',
        'intro',
        'loginstatus',
        'logintime',
        'loginip',
        'loginplatform',
        'passfailnum',
        'passfailtime',
        'passfailip',
        'createtime',
        'lastfirmid'
    ];

    /**
     * 获取用户基本信息
     * @param   int|array $ids
     * @param   bool $iscache
     * @return  array [[userid=>cname]]
     */
    public static function getUserInfoByIds($ids, $iscache = true)
    {
        $paramtype = gettype($ids);
        $ids = (array)$ids;

        if (empty($ids)) {
            return [];
        }

        //先取静态缓存
        $data = [];
        if ($iscache) {
            foreach ($ids as $id) {
                if (isset(self::$_userinfo_cache[$id])) {
                    $data[$id] = self::$_userinfo_cache[$id];
                }
            }
        }

        $mc_key = $mc_info = $exists_id = $not_exists_id = [];
        $cache = \Think\Cache::getInstance();
        if ($iscache) {
            foreach ($ids as $item) {
                $mc_key[] = sprintf(self::MC_USER_INFO, $item);
            }
            $mc_info = $cache->get($mc_key);
            if (!empty($mc_info)) {
                foreach ($mc_info as $k => $v) {
                    $int_k = (int)preg_replace('/[^\d]/', '', $k);
                    $mc_info[$int_k] = $v;
                    unset($mc_info[$k]);
                }
                unset($k);
                $data += $mc_info;
            }
        }

        $exists_id = array_keys($data);
        $not_exists_id = array_diff($ids, $exists_id);

        if (!empty($not_exists_id)) {
            $rows = M('User', '', 'DB_CONFIG_LINK')->field('*')->where(['id' => ['IN', $not_exists_id]])->select();
            foreach ($rows as $val) {
                $data[$val['id']] = $val;
                self::$_userinfo_cache[$val['id']] = $data[$val['id']];
                if ($iscache) {
                    $cache->set(sprintf(self::MC_USER_INFO, $val['id']), $data[$val['id']], 3600);
                }
            }
        }

        /*生成全局公用图像 start*/
        $userFace = M("avatar")->where(["userid" => UID])->find();
        $userFace = $userFace["filepath"] . explode('|', $userFace["avatar_name"])[1];

        //排序和整合数据 根据进入的ID进行排序
        $ret = [];
        // $avatars = self::getAvatar($ids);
        foreach ($ids as $id) {
            $id = intval($id);
            if ($id > 0 && isset($data[$id])) {
                // $data[$id]['avatar'] = $avatars[$id];
                $data[$id]['avatar'] = $userFace;
                $ret[$id] = $data[$id];
            }
        }

        return $paramtype == 'integer' ? $ret[$ids[0]] : $ret;
    }

    /**
     * 批量获取用户头像
     * @param $ids
     * @param bool $iscache
     * @return array
     */
    public static function getAvatar($ids, $iscache = true)
    {
        $paramtype = gettype($ids);
        $ids = (array)$ids;

        if (empty($ids)) {
            return [];
        }

        //先取静态缓存
        $data = [];
        if ($iscache) {
            foreach ($ids as $id) {
                if (isset(self::$_avatara_cache[$id])) {
                    $data[$id] = self::$_avatara_cache[$id];
                }
            }
        }

        //取MC缓存
        $cache = \Think\Cache::getInstance();
        $mc_key = $mc_info = $exists_id = $not_exists_id = [];
        if ($iscache) {
            foreach ($ids as $item) {
                $mc_key[] = sprintf(self::MC_USER_AVATARA, $item);
            }
            $mc_info = $cache->get($mc_key);
            if (!empty($mc_info)) {
                foreach ($mc_info as $k => $v) {
                    $int_k = (int)preg_replace('/[^\d]/', '', $k);
                    $mc_info[$int_k] = $v;
                    unset($mc_info[$k]);
                }
                unset($k);
                $data += $mc_info;
            }
        }

        $exists_id = array_keys($data);
        $not_exists_id = array_diff($ids, $exists_id);

        if (!empty($not_exists_id)) {
            $rows = M('UserAvatar', '', 'DB_CONFIG_LINK')->where(['userid' => ['IN', $not_exists_id]])->select();
            if (!empty($rows)) {
                foreach ($rows as $val) {
                    $data[$val['userid']] = $val['path'] . $val['avatarname'];
                    self::$_avatara_cache[$val['userid']] = $data[$val['userid']];
                    $cache->set(sprintf(self::MC_USER_AVATARA, $val['userid']), $data[$val['userid']], 3600);
                }
            }
        }

        //按照传入的顺序进行排序
        $ret = [];
        foreach ($ids as $id) {
            $ret[$id] = isset($data[$id]) ? $data[$id] : self::AVATAR_DEFAULT;
        }

        return $paramtype == 'integer' ? $ret[$ids[0]] : $ret;
    }

    /**
     * @param $filed
     * @param int $userid
     * @return bool
     */
    public static function editUser($filed, $id = 0)
    {
        $id = intval($id);
        $filed = (array)$filed;
        if ($id < 0 || !is_array($filed) || empty($filed)) {
            return false;
        }

        if (count(array_diff(array_keys($filed), self::$_filed_user)) > 0) {
            return false;
        }
        $filed['sss'] = 1;
        //新增的情况 只会新增ID
        $obj = M('User', '', 'DB_CONFIG_LINK');
        if ($id == 0) {
            $flag = $obj->add($filed);
            $id = $obj->getLastInsID();
        } else {
            $flag = $obj->where(["id" => ['eq', $id]])->save($filed);
        }

        if ($flag) {
            self::clearUserInfoMc($id);
            return $id;
        }

        return true;
    }

    //获取当前机构下所有成员的详细信息，包含用户详情、头像、所属机构、所属部门
    public static function getAllUserInfo($firmid){
        if(!$firmid) return [];
        $sql = <<<SQL
SELECT
	GROUP_CONCAT(d.name) as gname,GROUP_CONCAT(d.id) as gid,CONCAT(c.filepath,c.original_name) as filepath,b.*
FROM
	link_group_user AS a
INNER JOIN link_user AS b ON a.userid = b.id
LEFT JOIN link_avatar AS c ON a.userid = c.userid
LEFT JOIN link_firm_group as d on a.groupid = d.id
where a.firmid = $firmid
GROUP BY b.id
ORDER BY b.id desc
SQL;
        $res = M()->query($sql);
        return $res;
    }

    /**
     * @param $id
     */
    public static function clearUserInfoMc($id)
    {
        $cache = \Think\Cache::getInstance();
        $key = sprintf(self::MC_USER_INFO, $id);
        $flag = false;
        $i = 0;
        while ($i < 3 && $flag == $flag) {
            $cache->rm($key);
            $i++;
        }
    }

    /**
     * @param $mobile 检测手机验证码
     * @param $code
     * @param string $key
     * @return string
     */
    public static function checkMobileCode($mobile, $code, $key = self::MOBILE_REGISTER_VERIFY_CODE)
    {
        if (empty($mobile) || empty($code)) {
            return false;
        }

        $code_cache = sprintf($key, $mobile);
        if (S($code_cache) != $code) {
            return false;
        }

        return true;
    }

    /**
     * 发送短信验证码
     * @param $mobile
     * @param string $type
     * @return array
     */
    public static function sendSms($mobile, $type = 1)
    {
        if (empty($mobile)) {
            return ['status' => false, 'msg' => "手机格式错误！"];
        }

        $sms_type = \Home\Model\UserModel::$sms_type;
        empty($sms_type[$type]) && $type = 1;

       $key = $sms_type[$type];
        $code_cache = sprintf($key, $mobile);
        $req_freq_obj = new \Home\Model\RequestFrequency($code_cache, 1, 60); // 1次/1分钟
        if ($req_freq_obj->limited()) {
            return ['status' => false, 'msg' => "您操作太频繁了！"];
        }

        //发送短信验证码
        $code = rand(100000, 999999);
        $data = ['code' => $code];
       /* return  $code;*/
        if (send_sms($data, 'regcode', $mobile)) {
            S($code_cache, $code, 600);
            $req_freq_obj->record();
            return ['status' => true, 'msg' => "发送成功！"];
        }

       return ['status' => false, 'msg' => "发送失败，请重试！"];
    }

    //邀请别人加入的列表？？
    public static function isvistlist($uid)
    {
        $obj = M("Inviting", "", "DB_CONFIG_LINK")->where(['invituserid' => $uid])->select();
    }

    public static function getUserByFirm($fid){
        if(!$fid){
            return [];
        }
        $res = M()->table([
                'link_group_user' => 'a',
                'link_user' => 'b'
            ])->where("a.userid = b.id and a.status = 1 and a.firmid = {$fid}")->distinct(true)->field('b.*')->select();

        return $res;
    }

    //通过机构部门ID获取指定部门下用户信息
    public static function getUserByFirmGroup($fid,$gid){
        if(!$fid || !$gid){
            return [];
        }
        $res = M()->table([
                'link_group_user' => 'a',
                'link_user' => 'b'
            ])->where("a.userid = b.id and a.status = 1 and
 a.groupid = {$gid} and a.firmid = {$fid}")->field('b.*')->select();

        return $res;
    }

    /*批量添加用户*/
    public static function save_import($fid,$data,$common){
        $res = ['status' => false, 'msg' => '数据格式错误！'];
        $data = self::delNotRightInfo($data);
        if(empty($data)){
            return ['status' => false, 'msg' => '无可用数据！'];
        }
        $adddata = [];
        $gid = M("firm_group")->where(['firmid'=>$fid,'name'=>'超级管理员'])->getField('id');
        try{
            foreach ($data as $k => $v) {
                $obj = M('User');
                $userinfo = array_merge($common,['username' => $v['B'], 'mobile' => $v['A']]);
                $obj->add($userinfo);
                $id = $obj->getLastInsID();
                $data = [
                    'firmid' => $fid,
                    'groupid' => $gid,
                    'userid' => $id,
                    'status' => 1,
                    'times' => 0
                ];
                $res = \Home\Model\FirmModel::initGroupUser($data);
                if($res){
                    \Home\Model\MemberModel::newUserAddDevice($userinfo);
                }
            }
        }catch(\Exception $e){
            return ['status' => false, 'msg' => $e->getMessage()];
        }
        return ['status' => true, 'msg' => "导入成功！初始密码为link654321，记得尽快修改密码！"];
    }

    /*去除不合法的手机号码和已经注册了的手机号码*/
    public static function delNotRightInfo($data){
        $mobiles = array_column($data, 'A');
        $info = M("User")->where(['mobile' => ['in', $mobiles]])->field('mobile')->select();
        $alreadyReg = array_column($info,'mobile');
        foreach ($data as $k => $v) {
            if(!is_mobile($v['A']) || in_array($v['A'],$alreadyReg)){
                unset($data[$k]);
            }
        }
        return $data;
    }
}


?>