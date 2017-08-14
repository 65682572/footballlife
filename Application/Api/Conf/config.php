<?php
define("IPHONE_LINK_APPID", 1); //ios设备
define("ANDROID_LINK_APPID", 2); //android设备
define("WEB_LINK_APPID", 3); //第三方访问

return [
    'SITE_URL' => "http://www.msu7.net/",
    'APPID' => [
        IPHONE_LINK_APPID => [
            'name'   => 'iPhone',
            'key'    => 'e64e9f6c25d17f390addfb1acd9ba7d8',
            'secret' => '7be1234fb0b81881793e1cdd9c554398',
        ],
        ANDROID_LINK_APPID => [
            'name'   => 'android',
            'key'    => '573bbd2fbdua6bac082ff4727d952ba3',
            'secret' => 'aed7216edf68dm1d9d702306c003a07e',
        ],
        WEB_LINK_APPID => [
            'name'   => '第三方访问接口',
            'key'    => 'cdcf58c1cded283d4ye37a320a8fe492',
            'secret' => '6468033f3dcb8baya1588953ee95b285',
        ]
    ],
    'SKEY' => 'dsfjvsnv4%^VSSvd#@$',
    'SITES' => [
        '1' => ['connect_name'=>'微信', 'connect_flag'=>'wx'],
        '2' => ['connect_name'=>'QQ', 'connect_flag'=>'qq']
    ]
];