<?php

return [
    //开启路由
    'URL_ROUTER_ON' => true,
    //路由配置
    'URL_ROUTE_RULES' => [
        'mailbox/:id\d' => '/user/mailbox',//私信
    ]
];