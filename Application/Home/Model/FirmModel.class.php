<?php
namespace Home\Model;

use Think\Model;

class FirmModel extends Model
{
    const MC_FIRM_INFO = 'FIRM_INFO_%s';//userid
    static $_filed_user = ['parentid', 'userid', 'name', 'intro', 'verify', 'status'];
    static $_filed_group = ['parentid', 'firmid', 'name', 'intro', 'status', 'createtime', 'issuper', 'times', 'rules','number'];
    static $_filed_inviting = ['firmid', 'userid', 'groupid', 'mobile', 'status', 'createtime'];
    static $_filed_application = ['to_firmid', 'from_userid', 'to_userid', 'updatetime', 'status', 'createtime'];
    const INVITE_STATUS_1 = 1;
    const INVITE_STATUS_2 = 2;
    const INVITE_STATUS_0 = 0;
    const SUPERNUM = 1;
    public static $_invite_status = [
        self::INVITE_STATUS_1 => '通过',
        self::INVITE_STATUS_2 => '拒绝',
        self::INVITE_STATUS_0 => '未接收',
    ];


    /**
     * set firm
     * @param array $filed
     * @param int $firmid
     * @return bool|mixed
     */
    public static function setUserFirm($filed, $firmid = 0)
    {
        if (!is_array($filed) || empty($filed)) {
            return ["status" => false, "msg" => '参数不能为空！'];
        }

        if (count(array_diff(array_keys($filed), self::$_filed_user)) > 0) {
            return ["status" => false, "msg" => '参数错误！'];
        }

        //新增的情况 只会新增ID
        $obj = M('Firm', '', 'DB_CONFIG_LINK');
        if ($firmid > 0) {
            $flag = $obj->where(['id' => ['eq', $firmid]])->save($filed);
        } else {
            $filed['createtime'] = time();
            $flag = $obj->add($filed);
            $firmid = $obj->getLastInsID();
        }

        $flag = boolval($flag);
        if ($flag) {
            return ["status" => true, "msg" => '成功！', 'firmid' => $firmid];
        }

        return ["status" => false, "msg" => '操作失败！'];
    }

    /**
     * @param $name
     * @return mixed
     */
    public static function ckfirmname($name)
    {
        return M("Firm", "", "DB_CONFIG_LINK")->where(['name' => ['eq', $name]])->find();
    }

    /**
     * 用户所在的机构
     * @param $userid
     * @return array
     */
    public static function getFirmFromGroup($userid)
    {
        $userid = intval($userid);
        $allfirm = self::getFirm();
        if (empty($allfirm)) {
            return [];
        }

        $list = [];
        $allfirm = hd_array_column($allfirm, [], 'id');
        $ret = M('GroupUser', '', 'DB_CONFIG_LINK')->where([
            'userid' => ['eq', $userid],
            'status' => ['eq', 1]
        ])->select();
        $firmids = hd_array_column($ret, 'firmid');
        !is_array($firmids) && $firmids = [];

        $firmids = array_unique($firmids);

        foreach ($firmids as $id) {
            $list[$id] = $allfirm[$id];
        }

        return $list;
    }

    /**
     * 用户所在的所有机构的ID
     * @param $userid
     * @return array
     */
    public static function getFirmIdFromGroup($userId)
    {
        $userId = intval($userId);
        $list = [];
        $res = M('GroupUser', '', 'DB_CONFIG_LINK')->where([
            'userid' => ['eq', $userId],
            'status' => ['eq', 1]
        ])->select();

        $firmIdArr = hd_array_column($res, 'firmid');
        !is_array($firmIdArr) && $firmIdArr = [];
        $list = array_unique($firmIdArr);
        $list = array_values($list);

        return $list;
    }

    /**
     * get all firm
     * @param int $id
     * @return array|mixed
     */
    public static function getFirm($id = 0)
    {
        $id = intval($id);
        $list = M("Firm")->where(['status' => ['eq', 1]])->select();
        $list = hd_array_column($list, [], 'id');

        if ($id > 0) {
            $list[$id];
        }
        return $list;
    }

    /**
     * 邀请列表
     * @param $uid
     * @return array|mixed
     */
    public static function inviting($mobile, $status = 0)
    {
        if (empty($mobile)) {
            return [];
        }

        $list = M('Inviting', '', 'DB_CONFIG_LINK')->where([
            'mobile' => ['eq', $mobile],
            'status' => $status
        ])->select();
        return $list;
    }

    /**
     * @param $filed
     * @param int $id
     * @return array
     */
    public static function editInviing($filed, $id = 0)
    {
        if (!is_array($filed) || empty($filed)) {
            return ["status" => false, "msg" => '参数不能为空！'];
        }

        if (count(array_diff(array_keys($filed), self::$_filed_inviting)) > 0) {
            return ["status" => false, "msg" => '参数错误！'];
        }

        //新增的情况 只会新增ID
        $obj = M('Inviting', '', 'DB_CONFIG_LINK');
        if ($id > 0) {
            $flag = $obj->where(['id' => ['eq', $id]])->save($filed);
        } else {
            $filed['createtime'] = time();
            $flag = $obj->add($filed);
            $id = $obj->getLastInsID();
        }

        $flag = boolval($flag);
        if ($flag) {
            return ["status" => $flag, "msg" => '成功！', 'id' => $id];
        }

        return ["status" => $flag, "msg" => '操作失败！'];
    }

    /**
     * 获取单条申请信息
     * @param $id
     * @return array|mixed
     */
    public static function getAppById($id, $status = 0)
    {
        if((int)$id <= 0){
            return [];
        }
        $list = M('application')->where([
            'id' => $id,
            'status' => $status
        ])->find();
        return $list;
    }

    /**
     * 编辑申请信息
     * @param int $id
     * @return array
     */
    public static function updateApply($filed, $id = 0)
    {
        if (!is_array($filed) || empty($filed)) {
            return ["status" => false, "msg" => '参数不能为空！'];
        }

        if (count(array_diff(array_keys($filed), self::$_filed_application)) > 0) {
            return ["status" => false, "msg" => '参数错误！'];
        }

        //新增的情况 只会新增ID
        $flag = M('application')->where(['id' => ['eq', $id]])->save($filed);
        $flag = boolval($flag);
        if ($flag) {
            return ["status" => $flag, "msg" => '成功！', 'id' => $id];
        }

        return ["status" => $flag, "msg" => '操作失败！'];
    }

    /**
     * 获取已加入机构列表
     * @param $uid
     * @return array|mixed
     */
    public static function getJoinFirm($uid)
    {
        if (!$uid) {
            return [];
        }
        $list = M('GroupUser')->where(['userid' => $uid, 'verify' => 1,'status' => 1])->select();
        return $list;
    }

    /**
     * 获取已申请列表
     * @param $uid
     * @return array|mixed
     */
    public static function getAppFirm($uid)
    {
        if (!$uid) {
            return [];
        }
        $list = M('application')->where(['from_userid' => $uid, 'verify' => 1, 'status' => 0])->select();
        return $list;
    }

    /**
     * 获取申请列表
     * @param $uid
     * @return array|mixed
     */
    public static function appList($uid = '' , $status = 0)
    {
        if(!$uid){
            $uid = session('user_auth.uid');
        }
        $list = M('application')->table([
            'link_application' => 'a',
            'link_firm' => 'b',
            'link_user' => 'c'
            ])
            ->where("a.to_userid = {$uid}
AND a.`status` = {$status}
and a.to_firmid = b.id
and  c.id = a.from_userid")->field('a.*,b.`name` as firmname,c.username')->select();
        return $list;
    }
    /**
     * 获取申请列表
     * @param $uid
     * @return array|mixed
     */
    public static function apiAppList($uid = '' , $status = 0)
    {
        if(!$uid){
            $uid = session('user_auth.uid');
        }
        $sql = <<<SQL
SELECT
	a.*, b.`name` AS firmname,
	c.username,
	d.`filepath`,
	d.`original_name`
FROM
	`link_application` `a` 
	join `link_firm` `b` on a.to_firmid = b.id 
	join `link_user` `c` on c.id = a.from_userid 
	LEFT JOIN `link_avatar` `d` ON a.from_userid = d.userid
WHERE
	(
		a.to_userid = $uid
		AND a.`status` = $status
	)
SQL;

        $list = M('application')->query($sql);
        return $list;
    }
    /**
     * 新增申请列表
     * @param array $firms
     * @return array
     */
    public static function addApplication($firms)
    {
        if (!is_array($firms) || empty($firms)) {
            return ["status" => false, "msg" => '无对应的机构！'];
        }
        //组装数据
        $uid = session('user_auth.uid');
        $createtime = time();
        foreach ($firms as $key => $value) {
            $data = [
                'from_userid' => $uid,
                'to_userid' => $value['userid'],
                'to_firmid' => $value['id'],
                'createtime' => $createtime
            ];
            $ret = M('application')->add($data);
        }
        if ($ret) {
            return ["status" => true, "msg" => '申请提交成功！'];
        }else{
            return ["status" => false, "msg" => '申请提交失败！'];
        }
    }

    /**
     * 新增申请列表
     * @param array $firms
     * @return array
     */
    public static function apiAddApplication($firms , $uid)
    {
        if (!is_array($firms) || empty($firms)) {
            return ["status" => false, "msg" => '无对应的机构！'];
        }
        //组装数据
        $uid = $uid;
        $createtime = time();
        foreach ($firms as $key => $value) {
            $data = [
                'from_userid' => $uid,
                'to_userid' => $value['userid'],
                'to_firmid' => $value['id'],
                'createtime' => $createtime
            ];
            $ret = M('application')->add($data);
        }
        if ($ret) {
            return ["status" => true, "msg" => '申请提交成功！'];
        }else{
            return ["status" => false, "msg" => '申请提交失败！'];
        }
    }

    /**
     * 创建分组
     * @param $filed
     * @param int $id
     * @return array
     */
    public static function initFirmGroup($filed, $id = 0)
    {
        if (!is_array($filed) || empty($filed)) {
            return ["status" => false, "msg" => '参数不能为空！'];
        }

        if (count(array_diff(array_keys($filed), self::$_filed_group)) > 0) {
            return ["status" => false, "msg" => '参数错误！'];
        }

        //新增的情况 只会新增ID
        $obj = M('FirmGroup', '', 'DB_CONFIG_LINK');
        if ($id > 0) {
            $flag = $obj->where(['id' => ['eq', $id]])->save($filed);
        } else {
            $filed['createtime'] = time();
            $flag = $obj->add($filed);
            $id = $obj->getLastInsID();
        }

        $flag = boolval($flag);
        if ($flag) {
            return ["status" => $flag, "msg" => '成功！', 'id' => $id];
        }

        return ["status" => $flag, "msg" => '操作失败！'];
    }

    /**
     * 添加用户到组
     * @param $filed
     * @param $id
     * @return bool|mixed
     */
    public static function initGroupUser($filed, $id = 0)
    {
        if (!is_array($filed) || empty($filed)) {
            return ["status" => false, "msg" => '参数不能为空！'];
        }

        //新增的情况 只会新增ID
        $obj = M('GroupUser', '', 'DB_CONFIG_LINK');
        if ($id > 0) {
            $flag = $obj->where(['id' => ['eq', $id]])->save($filed);
        } else {
            $filed['createtime'] = time();
            $flag = $obj->add($filed);
            $id = $obj->getLastInsID();
        }

        $flag = boolval($flag);
        if ($flag) {
            return ["status" => true, "msg" => '成功！', 'id' => $id];
        }

        return ["status" => false, "msg" => '操作失败！'];
    }

    /**
     * 获取机构下的用户
     * @param $firmid
     * @param int $groupid
     * @param int $existid
     * @return array
     */
    public static function firmUsers($firmid, $groupid = 0, $existid = 0, $status = 1)
    {
        if ($firmid < 1) {
            return [];
        }

        $where = ['firmid' => ['eq', $firmid], 'userid' => ['neq', $existid]];
        if ($status != 'all') {
            $where['status'] = ['eq', $status];
        }

        if ($groupid > 0) {
            $where['groupid'] = ['eq', $groupid];
        }
        $ret = M('GroupUser', '', 'DB_CONFIG_LINK')->where($where)->order('id desc')->select();
        $res = M('firm_group')->where(['firmid'=>$firmid])->select();
        $data = [];
        foreach($res as $k=>$v){
            array_push($data,$v['id']);
        }
        foreach($ret as $k=>$v){
            if(!in_array($v['groupid'],$data)){
               /* unset($ret[$k]);*/
                $ret[$k]['groupid'] = 0;

            }
        }
        return $ret;
    }

    /**
     * 获取部门信息
     * @param int $firmid
     * @return array|mixed
     * @param int $groupid
     */
    public static function firmGroup($firmid, $groupid = 0)
    {
        $firmid = intval($firmid);
        if ($firmid < 1) {
            return [];
        }

        $list = M("FirmGroup", '', 'DB_CONFIG_LINK')->where([
            'firmid' => ['eq', $firmid],
            'status' => ['eq', 1]
        ])->select();
        $list = hd_array_column($list, [], 'id');
        /*$list[0] = ['name' => '未分组'];*/
        $list[0] = ['name' => '无部门'];
        if ($groupid > 0) {
            return $list[$groupid];
        }
        return $list;
    }

    /**
     * 得到格式化的机构数据
     * @param $uid
     * @return array
     */
    public static function formatFirm($uid)
    {
        if ($uid < 1) {
            return [];
        }

        $ret = self::getFirmFromGroup($uid);

        ksort($ret);

        //标准输出格式
        $firms = [];
        foreach ($ret as $v) {
            if ($v['id']) {
                $firms[] = [
                    "text" => $v['name'],
                    "id" => $v['id'],
                    'parentid' => $v['parentid'],
                    "state" => ['opened' => true],
                    "type" => "level2",
                    "intro" => $v['intro'],
                    'copyright' => $v['copyright'],
                    'logoimg' => $v['logoimg'],
                    "not_self_firm" => $v['not_self_firm'],
                    "not_self_name" => $v['not_self_name'],
                    "verify" => $v['verify']
                ];
            }
        }

        /*判断是不是当前登录用户自己创建的机构*/
        foreach ($firms as $k=>$v){
            if(!M('firm')->where(['id'=>$v['id'],'userid'=>session('user_auth.uid')])->find()){
                $firms[$k]['not_self_firm'] = 'style="display:none"';
                $firms[$k]['not_self_name'] = '退出机构';
            }else
            {
                $firms[$k]['not_self_firm'] = false;
                $firms[$k]['not_self_name'] = '删&nbsp;除';

            }
        }

        //获取最顶层的数据
//        foreach ($firms as &$v) {
//            $rec = self::_rec($firms, $v['id']);
//            if (!empty($rec)) {
//                $ids = hd_array_column($rec, 'id');
//                foreach ($firms as $kt => $tm) {
//                    if (in_array($tm['id'], $ids)) {
//                        unset($firms[$kt]);
//                    }
//                }
//                $v['children'] = $rec;//二级
//                foreach ($v['children'] as &$vv) {
//                    $rec = self::_rec($firms, $vv['id']);
//                    if (!empty($rec)) {
//                        $ids = hd_array_column($rec, 'id');
//                        foreach ($firms as $kt => $tm) {
//                            if (in_array($tm['id'], $ids)) {
//                                unset($firms[$kt]);
//                            }
//                        }
//                        $vv['children'] = $rec;//三级
//                        foreach ($vv['children'] as &$vvv) {
//                            $rec = self::_rec($firms, $vvv['id']);
//                            if (!empty($rec)) {
//                                $ids = hd_array_column($rec, 'id');
//                                foreach ($firms as $kt => $tm) {
//                                    if (in_array($tm['id'], $ids)) {
//                                        unset($firms[$kt]);
//                                    }
//                                }
//                                $vvv['children'] = $rec;//四级
//                                foreach ($vvv['children'] as &$vvvv) {
//                                    $rec = self::_rec($firms, $vvvv['id']);
//                                    if (!empty($rec)) {
//                                        $ids = hd_array_column($rec, 'id');
//                                        foreach ($firms as $kt => $tm) {
//                                            if (in_array($tm['id'], $ids)) {
//                                                unset($firms[$kt]);
//                                            }
//                                        }
//                                        $vvvv['children'] = $rec;//五级
//                                    }
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//        }

        return $firms;
    }

    /**
     * @param $arr
     * @param $key
     * @return array
     */
    private static function _rec($arr, $key)
    {
        $rec = [];
        if (empty($key)) {
            return;
        }
        foreach ($arr as $v) {
            if ($v['parentid'] == $key) {
                array_push($rec, $v);
            }
        }

        return $rec;
    }

    /**
     * 检查是否有子机构
     * @param $firmid
     * @return bool
     */
    public static function chFirmSon($firmid)
    {
        $ret = M("Firm")->where(['parentid' => ['eq', $firmid], 'status' => ['eq', 1]])->find();
        return !empty($ret) && is_array($ret) ? true : false;
    }

    /**
     * 删除机构下的部门
     * @param $firmid
     * @return bool
     */
    public static function delFirmGroupByFirmid($firmid)
    {
        if ($firmid < 1) {
            return false;
        }
        return M("FirmGroup")->where(['firmid' => ['eq', $firmid]])->delete();
    }

    /**
     * 删除机构下的用户
     * @param $firmid
     * @param $groupid
     * @return bool
     */
    public static function delFirmGroupUserByFirmid($firmid, $groupid = 0)
    {
        if ($firmid < 1) {
            return false;
        }

        $where = ['firmid' => ['eq', $firmid]];
        if ($groupid > 0) {
            $where['groupid'] = ['eq', $groupid];
        }
        return M("GroupUser")->where($where)->delete();
    }


    /**
     * 邀请信息
     * @param $mobile
     * @param int $limit
     * @return array|mixed
     */
    public static function inviteMessage($mobile, $limit = 0)
    {
        $list = \Home\Model\FirmModel::inviting($mobile);
        empty($list) && $list = [];
        $invitelist = $limit > 0 ? array_slice($list, 0, $limit) : $list;

        $uids = hd_array_column($invitelist, 'userid');
        $uinfos = \Home\Model\UserModel::getUserInfoByIds($uids);
        $firminfos = \Home\Model\FirmModel::getFirm();
        foreach ($invitelist as & $v) {
            $v['firmname'] = $firminfos[$v['firmid']]['name'];
            $v['username'] = $uinfos[$v['userid']]['username'];
        }

        return $invitelist;
    }

    /**
     * 申请信息
     * @param int $limit
     * @return array|mixed
     */
    public static function applicationMessage($limit = 0)
    {
        $list = \Home\Model\FirmModel::appList();
        empty($list) && $list = [];
        $applist = $limit > 0 ? array_slice($list, 0, $limit) : $list;

        return $applist;
    }

    /**
     *检测机构是否被批准创建成功
     */
    public function changeVerify($id, $status)
    {
        $res = M('Firm')->where("id = $id")->save(['verify' => $status]);

        return $res;
    }
}