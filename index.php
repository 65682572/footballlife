<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用入口文件

// 检测PHP环境
if(version_compare(PHP_VERSION,'5.3.0','<'))  die('require PHP > 5.3.0 !');

// 开启调试模式 建议开发阶段开启 部署阶段注释或者设为false
define('APP_DEBUG', true);

// 定义应用目录
define('APP_PATH','./Application/');

// 定义运行时目录
define('RUNTIME_PATH','./Runtime/');

//应用模式
//define('APP_STATUS','home');

//生成一个模块
//define('BIND_MODULE','Forum');

// 引入ThinkPHP入口文件
/*ini_set("session.save_handler", "user");*/
require './ThinkPHP/ThinkPHP.php';


// 亲^_^ 后面�