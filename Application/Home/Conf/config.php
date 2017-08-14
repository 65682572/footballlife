<?php
return [
    'LOAD_EXT_FILE' => 'string',
    'menu' => [
        1 => [
            'name' => '首页',
            'router' => 'matrix/monitor'
        ],
        2 => [
            'name' => '设备运维',
            'router' => ''
        ],
        3 => [
            'name' => '检索回放',
            'router' => ''
        ],
        4 => [
            'name' => '地图运维',
            'router' => ''
        ],
        5 => [
            'name' => '报警运维',
            'router' => ''
        ],
        6 => [
            'name' => '监控运维',
            'router' => ''
        ],
        7 => [
            'name' => '场景应用',
            'router' => ''
        ],
        8 => [
            'name' => '系统设置',
            'router' => ''
        ],
    ],
    'submenu' => [
        1 => [],
        2 => [
            [
                'name' => '设备运维',
                'router' => 'matrix/index'
            ],
            [
                'name' => '设备管理',
                'router' => 'matrix/devicemsg',
                'submenu' => [
                    [
                        'name' => '设备管理',
                        'router' => 'matrix/devicemsg'
                    ],
                    [
                        'name' => '品牌管理',
                        'submenu' => [
                            [
                                'name' => '品牌',
                                'router' => 'systemSet/specification',
                            ],
                            [
                                'name' => '型号规格',
                                'router' => 'systemSet/typenumber',
                            ]
                        ]
                    ]
                ]
            ]
        ],
        3 => [],
        4 => [],
        5 => [],
        6 => [],
        7 => [],
        8 => [],
    ]
];