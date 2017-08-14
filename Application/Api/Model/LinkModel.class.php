<?php
namespace Api\Model;
use Think\Model;

class LinkModel extends Model{

    /**
     * @since 2016.5.16
     * @auther 辛杰
     *
     * @api 登录
     * @methods Link.deviceList
     *
     *  @param
     * 需要POST过来的参数列表：
     * <pre>
     * userid : 用户ID
     * sign : 签名
     * </pre>
     *
     * @return array 返回的JSON数据格式
     *
     * <pre>
     *
     * 请求成功时：
     * array(
     *  'status' => 200,
     *  'result' => array(
     *          [
     *              'name' => '深圳矩阵',
     *              'deviceid' => '54e63f333333412613e0dfce5f0bffff',
     *              'ip' => '61.141.167.210',
     *              'port' => '33767',
     *              'username' => 'admin',
     *              'pwd' => 'admin123',
     *          ],
     *          []
     *      )
     * );
     * </pre>
     *
     */
    public static function deviceList2()
    {
        $userid = I("userid");
        $sign = I("sign");

        if ($userid < 1 || empty($sign)){
            return ['status' => 201, 'msg' => ["errormsg" => "请先登录！"]];
        }

        if (!\Home\Model\MemberModel::checkApiSign($userid, $sign)){
            return ['status' => 201, 'msg' => ["errormsg" => "请先登录！"]];
        }

        /*
        //设备类型
        $tagtypes= \Home\Model\DeviceModel::tagtypes();
        $tagtypes = hd_array_column($tagtypes,[],'id');

        //用户有权限的机构下有权限的设备列表
        $firmids = [1,2,3,4];//todo
        $list = [];
        foreach ($firmids as $firmid){
            $tmp = \Home\Model\DeviceModel::deviceList($firmid);
            if (!empty($tmp) && is_array($tmp)){
                $list = array_merge($list, $tmp);
            }
        }

        //重组数据
        $list = array_map(function($v) use($tagtypes){
            $v['catename'] = $tagtypes[$v['type']]['name'];
            $v['state'] = $v['state'] == 1 ? '在线': '离线';
            $v['configsarr'] = json_decode($v['configs'], true);
            return $v;
        }, $list);
        */

        $list = [
            [
                'name' => '深圳矩阵',
                'deviceid' => '54e63f333333412613e0dfce5f0bffff',
                'ip' => '61.141.167.210',
                'port' => '33767',
                'username' => 'admin',
                'pwd' => 'admin123',
            ],
            [
                'name' => '深圳矩阵2',
                'deviceid' => '54e63f333333412613e0dfce5f0b0001',
                'ip' => '61.141.167.210',
                'port' => '33767',
                'username' => 'admin',
                'pwd' => 'admin123',
            ],
        ];

        return ['status' => 200, 'msg' => $list];
    }
}
