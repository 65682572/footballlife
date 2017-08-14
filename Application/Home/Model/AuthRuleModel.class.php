<?php

namespace Home\Model;

use Think\Model;

/**
 * 权限规则模型
 */
class AuthRuleModel extends Model
{
    const RULE_URL = 1;
    const RULE_MAIN = 2;
    static $_filed_authrule = ['type', 'name', 'title', 'status', 'parentid'];

    public static function addRule($filed)
    {
        if (!is_array($filed)) {
            return ["status" => false, "msg" => '参数不能为空！'];
        }

        if (count(array_diff(array_keys($filed), self::$_filed_authrule)) > 0) {
            return ["status" => false, "msg" => '参数错误！'];
        }

        $auth_rule = M('AuthRule');
        $res = $auth_rule->add($filed);

        if ($res) {
            return ["status" => true, "msg" => '操作成功！'];
        }

        return ["status" => false, "msg" => '操作失败！'];
    }
}