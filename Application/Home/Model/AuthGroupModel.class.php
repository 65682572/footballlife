<?php

namespace Home\Model;
use Think\Model;

/**
 * 用户组模型类
 * Class AuthGroupModel
 */
class AuthGroupModel extends Model {
    const TYPE_ADMIN                = 1;                   // 管理员用户组类型标识
    const MEMBER                    = 'user';
    const AUTH_GROUP_ACCESS         = 'group_user';        // 关系表表名
    const AUTH_GROUP                = 'firm_group';        // 用户组表名
    const AUTH_EXTEND_CATEGORY_TYPE = 1;                   // 分类权限标识
    const AUTH_EXTEND_MODEL_TYPE    = 2;                   // 分类权限标识
//    const AUTH_RULES                = '1,2,3,4,6,7,8';     // 默认权限

}

