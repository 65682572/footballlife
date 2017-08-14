<?php
return [
    //开启路由
    'URL_ROUTER_ON' => true,
    //路由配置
    'URL_ROUTE_RULES' => [
        'user/mailbox/:id\d' => 'user/mailbox',//私信
        'main/group/:id\d' => 'main/group',//部门管理机构切换
        'matrix/:id\d/:name\w' => 'matrix/',//设备管理
    ]
];