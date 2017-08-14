<?php
/**
 * 系统公共库文件
 * 主要定义系统公共函数库
 */

const ONETHINK_ADDON_PATH = './Addons/';

/**
 * 检测用户是否登录
 * @return integer 0-未登录，大于0-当前登录用户ID
 */
function is_login()
{
    $user = session('user_auth');
    $sign = session('user_auth_sign');
    if (empty($user) && cookie('user_auth')) {
        $user = cookie('user_auth');
        $sign = cookie('user_auth_sign');
        session('user_auth', $user);
        session('user_auth_sign', $sign);
    }

    if (empty($user)) {
        return 0;
    } else {
        return $sign == data_auth_sign($user) ? (int)$user['uid'] : 0;
    }
}

/**
 * 获取登录信息
 * info：id,username,email,mobile
 */
function get_user($info)
{

    $user = session('user_auth');
    if ($info) {
        return $user[$info];
    } else {
        return $user;
    }
}

function mobile_reg($mobile)
{
    //检查手机是否已经被注册
    $muinfo = M("User", "", "DB_CONFIG_LINK")->where(['mobile' => ['eq', $mobile]])->find();
    return $muinfo;
}

/**
 * 用正则表达式验证手机号码(中国大陆区)
 * @param integer $phone 所要验证的手机号
 * @return boolean
 */
function is_mobile($phone)
{
    if (!$phone) {
        return false;
    }
    return preg_match('#^13[\d]{9}$|14^[0-9]\d{8}|^15[0-9]\d{8}$|^17[0-9]\d{8}$|^18[0-9]\d{8}$#',
        $phone) ? true : false;
}

/**
 * 用正则表达式验证邮箱地址
 * @param integer $email 所要验证的邮箱
 * @return boolean
 */
function is_email($email)
{
    $pattern = "/^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i";
    if (preg_match($pattern, $email)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 系统非常规MD5加密方法
 * @param  string $str 要加密的字符串
 * @return string
 */
function think_ucenter_md5($str, $key)
{
    return '' === $str ? '' : md5($str . $key);
}

/**
 * 字符串转换为数组，主要用于把分隔符调整到第二个参数
 * @param  string $str 要分割的字符串
 * @param  string $glue 分割符
 * @return array
 */
function str2arr($str, $glue = ',')
{
    return explode($glue, $str);
}

/**
 * 数组转换为字符串，主要用于把分隔符调整到第二个参数
 * @param  array $arr 要连接的数组
 * @param  string $glue 分割符
 * @return string
 */
function arr2str($arr, $glue = ',')
{
    return implode($glue, $arr);
}

/**
 * 字符串截取，支持中文和其他编码
 * @static
 * @access public
 * @param string $str 需要转换的字符串
 * @param string $start 开始位置
 * @param string $length 截取长度
 * @param string $charset 编码格式
 * @param string $suffix 截断显示字符
 * @return string
 */
function msubstr($str, $start = 0, $length, $charset = "utf-8", $suffix = true)
{
    if (function_exists("mb_substr")) {
        $slice = mb_substr($str, $start, $length, $charset);
    } elseif (function_exists('iconv_substr')) {
        $slice = iconv_substr($str, $start, $length, $charset);
        if (false === $slice) {
            $slice = '';
        }
    } else {
        $re['utf-8'] = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xff][\x80-\xbf]{3}/";
        $re['gb2312'] = "/[\x01-\x7f]|[\xb0-\xf7][\xa0-\xfe]/";
        $re['gbk'] = "/[\x01-\x7f]|[\x81-\xfe][\x40-\xfe]/";
        $re['big5'] = "/[\x01-\x7f]|[\x81-\xfe]([\x40-\x7e]|\xa1-\xfe])/";
        preg_match_all($re[$charset], $str, $match);
        $slice = join("", array_slice($match[0], $start, $length));
    }
    $len = mb_strlen($str, $charset);

    if ($len > $length) {
        $suffixstr = '...';
    } else {
        $suffixstr = '';
    }


    return $suffix ? $slice . $suffixstr : $slice;
}

/**
 * 系统加密方法
 * @param string $data 要加密的字符串
 * @param string $key 加密密钥
 * @param int $expire 过期时间 单位 秒
 * @return string
 */
function think_encrypt($data, $key = '', $expire = 0)
{
    $key = md5(empty($key) ? C('DATA_AUTH_KEY') : $key);
    $data = base64_encode($data);
    $x = 0;
    $len = strlen($data);
    $l = strlen($key);
    $char = '';

    for ($i = 0; $i < $len; $i++) {
        if ($x == $l) {
            $x = 0;
        }
        $char .= substr($key, $x, 1);
        $x++;
    }

    $str = sprintf('%010d', $expire ? $expire + time() : 0);

    for ($i = 0; $i < $len; $i++) {
        $str .= chr(ord(substr($data, $i, 1)) + (ord(substr($char, $i, 1))) % 256);
    }
    return str_replace(array('+', '/', '='), array('-', '_', ''), base64_encode($str));
}

/**
 * 系统解密方法
 * @param  string $data 要解密的字符串 （必须是think_encrypt方法加密的字符串）
 * @param  string $key 加密密钥
 * @return string
 */
function think_decrypt($data, $key = '')
{
    $key = md5(empty($key) ? C('DATA_AUTH_KEY') : $key);
    $data = str_replace(array('-', '_'), array('+', '/'), $data);
    $mod4 = strlen($data) % 4;
    if ($mod4) {
        $data .= substr('====', $mod4);
    }
    $data = base64_decode($data);
    $expire = substr($data, 0, 10);
    $data = substr($data, 10);

    if ($expire > 0 && $expire < time()) {
        return '';
    }
    $x = 0;
    $len = strlen($data);
    $l = strlen($key);
    $char = $str = '';

    for ($i = 0; $i < $len; $i++) {
        if ($x == $l) {
            $x = 0;
        }
        $char .= substr($key, $x, 1);
        $x++;
    }

    for ($i = 0; $i < $len; $i++) {
        if (ord(substr($data, $i, 1)) < ord(substr($char, $i, 1))) {
            $str .= chr((ord(substr($data, $i, 1)) + 256) - ord(substr($char, $i, 1)));
        } else {
            $str .= chr(ord(substr($data, $i, 1)) - ord(substr($char, $i, 1)));
        }
    }
    return base64_decode($str);
}

/**
 * 数据签名认证
 * @param  array $data 被认证的数据
 * @return string       签名
 */
function data_auth_sign($data)
{
    //数据类型检测
    if (!is_array($data)) {
        $data = (array)$data;
    }
    ksort($data); //排序
    $code = urlencode(http_build_query($data)); //url编码并生成query字符串
    $sign = sha1($code); //生成签名
    return $sign;
}

/**
 * 对查询结果集进行排序
 * @access public
 * @param array $list 查询结果
 * @param string $field 排序的字段名
 * @param array $sortby 排序类型
 * asc正向排序 desc逆向排序 nat自然排序
 * @return array
 */
function list_sort_by($list, $field, $sortby = 'asc')
{
    if (is_array($list)) {
        $refer = $resultSet = array();
        foreach ($list as $i => $data) {
            $refer[$i] = &$data[$field];
        }
        switch ($sortby) {
            case 'asc': // 正向排序
                asort($refer);
                break;
            case 'desc':// 逆向排序
                arsort($refer);
                break;
            case 'nat': // 自然排序
                natcasesort($refer);
                break;
        }
        foreach ($refer as $key => $val) {
            $resultSet[] = &$list[$key];
        }
        return $resultSet;
    }
    return false;
}

/**
 * 把返回的数据集转换成Tree
 * @param array $list 要转换的数据集
 * @param string $pid parent标记字段
 * @param string $level level标记字段
 * @return array
 */
function list_to_tree($list, $pk = 'id', $pid = 'pid', $child = '_child', $root = 0)
{
    // 创建Tree
    $tree = array();
    if (is_array($list)) {
        // 创建基于主键的数组引用
        $refer = array();
        foreach ($list as $key => $data) {
            $refer[$data[$pk]] =& $list[$key];
        }
        foreach ($list as $key => $data) {
            // 判断是否存在parent
            $parentId = $data[$pid];
            if ($root == $parentId) {
                $tree[] =& $list[$key];
            } else {
                if (isset($refer[$parentId])) {
                    $parent =& $refer[$parentId];
                    $parent[$child][] =& $list[$key];
                }
            }
        }
    }
    return $tree;
}

/**
 * 将list_to_tree的树还原成列表
 * @param  array $tree 原来的树
 * @param  string $child 孩子节点的键
 * @param  string $order 排序显示的键，一般是主键 升序排列
 * @param  array $list 过渡用的中间数组，
 * @return array        返回排过序的列表数组
 */
function tree_to_list($tree, $child = '_child', $order = 'id', &$list = array())
{
    if (is_array($tree)) {
        foreach ($tree as $key => $value) {
            $reffer = $value;
            if (isset($reffer[$child])) {
                unset($reffer[$child]);
                tree_to_list($value[$child], $child, $order, $list);
            }
            $list[] = $reffer;
        }
        $list = list_sort_by($list, $order, $sortby = 'asc');
    }
    return $list;
}

/**----------------------------------------------------------
 * 在数据列表中搜索
 * +----------------------------------------------------------
 * @param array $list 数据列表
 * @param mixed $condition 查询条件
 * 支持 array('name'=>$value) 或者 name=$value
 * @return array
 */
function list_search($list, $condition)
{
    if (is_string($condition)) {
        parse_str($condition, $condition);
    }
    // 返回的结果集合
    $resultSet = array();
    if ($list) {
        foreach ($list as $key => $data) {
            $find = false;
            foreach ($condition as $field => $value) {
                if (isset($data[$field])) {
                    if (0 === strpos($value, '/')) {
                        $find = preg_match($value, $data[$field]);
                    } elseif ($data[$field] == $value) {
                        $find = true;
                    }
                }
            }
            if ($find) {
                $resultSet[] =   &$list[$key];
            }
        }
    }
    return $resultSet;
}

/**
 * 格式化字节大小
 * @param  number $size 字节数
 * @param  string $delimiter 数字和单位分隔符
 * @return string            格式化后的带单位的大小
 */
function format_bytes($size, $delimiter = '')
{
    $units = array('B', 'KB', 'MB', 'GB', 'TB', 'PB');
    for ($i = 0; $size >= 1024 && $i < 5; $i++) {
        $size /= 1024;
    }
    return round($size, 2) . $delimiter . $units[$i];
}

/**
 * 设置跳转页面URL
 * 使用函数再次封装，方便以后选择不同的存储方式（目前使用cookie存储）
 */
function set_redirect_url($url)
{
    cookie('redirect_url', $url);
}

/**
 * 获取跳转页面URL
 * @return string 跳转页URL
 */
function get_redirect_url()
{
    $url = cookie('redirect_url');
    return empty($url) ? __APP__ : $url;
}

/**
 * 处理插件钩子
 * @param string $hook 钩子名称
 * @param mixed $params 传入参数
 * @return void
 */
function hook($hook, $params = array())
{
    \Think\Hook::listen($hook, $params);
}

/**
 * 获取插件类的类名
 * @param strng $name 插件名
 */
function get_addon_class($name)
{
    $class = "Addons\\{$name}\\{$name}Addon";
    return $class;
}

/**
 * 获取插件类的配置文件数组
 * @param string $name 插件名
 */
function get_addon_config($name)
{
    $class = get_addon_class($name);
    if (class_exists($class)) {
        $addon = new $class();
        return $addon->getConfig();
    } else {
        return array();
    }
}

/**
 * 插件显示内容里生成访问插件的url
 * @param string $url url
 * @param array $param 参数
 * @author 麦当苗儿 <zuojiazi@vip.qq.com>
 */
function addons_url($url, $param = array())
{
    $url = parse_url($url);
    $case = C('URL_CASE_INSENSITIVE');
    $addons = $case ? parse_name($url['scheme']) : $url['scheme'];
    $controller = $case ? parse_name($url['host']) : $url['host'];
    $action = trim($case ? strtolower($url['path']) : $url['path'], '/');

    /* 解析URL带的参数 */
    if (isset($url['query'])) {
        parse_str($url['query'], $query);
        $param = array_merge($query, $param);
    }

    /* 基础参数 */
    $params = array(
        '_addons' => $addons,
        '_controller' => $controller,
        '_action' => $action,
    );
    $params = array_merge($params, $param); //添加额外参数
    if (strtolower(MODULE_NAME) == 'admin') {
        return U('Admin/Addons/execute', $params);
    } else {
        return U('Home/Addons/execute', $params);

    }

}

/**
 * 时间戳格式化
 * @param int $time
 * @return string 完整的时间显示
 */
function time_format($time = null, $format = 'Y-m-d H:i')
{
    $time = $time === null ? NOW_TIME : intval($time);
    return date($format, $time);
}

/**
 * 记录行为日志，并执行该行为的规则
 * @param string $action 行为标识
 * @param string $model 触发行为的模型名
 * @param int $record_id 触发行为的记录id
 * @param int $user_id 执行行为的用户id
 * @return boolean
 */
function action_log($action = null, $model = null, $record_id = null, $user_id = null)
{

    //参数检查
    if (empty($action) || empty($model) || empty($record_id)) {
        return '参数不能为空';
    }
    if (empty($user_id)) {
        $user_id = is_login();
    }

    //查询行为,判断是否执行
    $action_info = M('Action')->getByName($action);
    if ($action_info['status'] != 1) {
        return '该行为被禁用或删除';
    }

    //插入行为日志
    $data['action_id'] = $action_info['id'];
    $data['user_id'] = $user_id;
    $data['action_ip'] = ip2long(get_client_ip());
    $data['model'] = $model;
    $data['record_id'] = $record_id;
    $data['create_time'] = NOW_TIME;

    //解析日志规则,生成日志备注
    if (!empty($action_info['log'])) {
        if (preg_match_all('/\[(\S+?)\]/', $action_info['log'], $match)) {
            $log['user'] = $user_id;
            $log['record'] = $record_id;
            $log['model'] = $model;
            $log['time'] = NOW_TIME;
            $log['data'] = array('user' => $user_id, 'model' => $model, 'record' => $record_id, 'time' => NOW_TIME);
            foreach ($match[1] as $value) {
                $param = explode('|', $value);
                if (isset($param[1])) {
                    $replace[] = call_user_func($param[1], $log[$param[0]]);
                } else {
                    $replace[] = $log[$param[0]];
                }
            }
            $data['remark'] = str_replace($match[0], $replace, $action_info['log']);
        } else {
            $data['remark'] = $action_info['log'];
        }
    } else {
        //未定义日志规则，记录操作url
        $data['remark'] = '操作url：' . $_SERVER['REQUEST_URI'];
    }

    M('ActionLog')->add($data);

    if (!empty($action_info['rule'])) {
        //解析行为
        $rules = parse_action($action, $user_id);

        //执行行为
        $res = execute_action($rules, $action_info['id'], $user_id);
    }
}

/**
 * 解析行为规则
 * 规则定义  table:$table|field:$field|condition:$condition|rule:$rule[|cycle:$cycle|max:$max][;......]
 * 规则字段解释：table->要操作的数据表，不需要加表前缀；
 *              field->要操作的字段；
 *              condition->操作的条件，目前支持字符串，默认变量{$self}为执行行为的用户
 *              rule->对字段进行的具体操作，目前支持四则混合运算，如：1+score*2/2-3
 *              cycle->执行周期，单位（小时），表示$cycle小时内最多执行$max次
 *              max->单个周期内的最大执行次数（$cycle和$max必须同时定义，否则无效）
 * 单个行为后可加 ； 连接其他规则
 * @param string $action 行为id或者name
 * @param int $self 替换规则里的变量为执行用户的id
 * @return boolean|array: false解析出错 ， 成功返回规则数组
 */
function parse_action($action = null, $self)
{
    if (empty($action)) {
        return false;
    }

    //参数支持id或者name
    if (is_numeric($action)) {
        $map = array('id' => $action);
    } else {
        $map = array('name' => $action);
    }

    //查询行为信息
    $info = M('Action')->where($map)->find();
    if (!$info || $info['status'] != 1) {
        return false;
    }

    //解析规则:table:$table|field:$field|condition:$condition|rule:$rule[|cycle:$cycle|max:$max][;......]
    $rules = $info['rule'];
    $rules = str_replace('{$self}', $self, $rules);
    $rules = explode(';', $rules);
    $return = array();
    foreach ($rules as $key => &$rule) {
        $rule = explode('|', $rule);
        foreach ($rule as $k => $fields) {
            $field = empty($fields) ? array() : explode(':', $fields);
            if (!empty($field)) {
                $return[$key][$field[0]] = $field[1];
            }
        }
        //cycle(检查周期)和max(周期内最大执行次数)必须同时存在，否则去掉这两个条件
        if (!array_key_exists('cycle', $return[$key]) || !array_key_exists('max', $return[$key])) {
            unset($return[$key]['cycle'], $return[$key]['max']);
        }
    }

    return $return;
}

/**
 * 执行行为
 * @param  array $rules 解析后的规则数组
 * @param  int $action_id 行为id
 * @param  array $user_id 执行的用户id
 * @return boolean false 失败 ， true 成功
 */
function execute_action($rules = false, $action_id = null, $user_id = null)
{
    if (!$rules || empty($action_id) || empty($user_id)) {
        return false;
    }

    $return = true;
    foreach ($rules as $rule) {

        //检查执行周期
        $map = array('action_id' => $action_id, 'user_id' => $user_id);
        $map['create_time'] = array('gt', NOW_TIME - intval($rule['cycle']) * 3600);
        $exec_count = M('ActionLog')->where($map)->count();
        if ($exec_count > $rule['max']) {
            continue;
        }

        //执行数据库操作
        $Model = M(ucfirst($rule['table']));
        $field = $rule['field'];
        $res = $Model->where($rule['condition'])->setField($field, array('exp', $rule['rule']));

        if (!$res) {
            $return = false;
        }
    }
    return $return;
}

//基于数组创建目录和文件
function create_dir_or_files($files)
{
    foreach ($files as $key => $value) {
        if (substr($value, -1) == '/') {
            mkdir($value);
        } else {
            @file_put_contents($value, '');
        }
    }
}

if (!function_exists('array_column')) {
    function array_column(array $input, $columnKey, $indexKey = null)
    {
        $result = array();
        if (null === $indexKey) {
            if (null === $columnKey) {
                $result = array_values($input);
            } else {
                foreach ($input as $row) {
                    $result[] = $row[$columnKey];
                }
            }
        } else {
            if (null === $columnKey) {
                foreach ($input as $row) {
                    $result[$row[$indexKey]] = $row;
                }
            } else {
                foreach ($input as $row) {
                    $result[$row[$indexKey]] = $row[$columnKey];
                }
            }
        }
        return $result;
    }
}

/**
 * 调用系统的API接口方法（静态方法）
 * api('User/getName','id=5'); 调用公共模块的User接口的getName方法
 * api('Admin/User/getName','id=5');  调用Admin模块的User接口
 * @param  string $name 格式 [模块名]/接口名/方法名
 * @param  array|string $vars 参数
 */
function api($name, $vars = array())
{
    $array = explode('/', $name);
    $method = array_pop($array);
    $classname = array_pop($array);
    $module = $array ? array_pop($array) : 'Common';
    $callback = $module . '\\Api\\' . $classname . 'Api::' . $method;
    if (is_string($vars)) {
        parse_str($vars, $vars);
    }
    return call_user_func_array($callback, $vars);
}

/**
 * 根据条件字段获取指定表的数据
 * @param mixed $value 条件，可用常量或者数组
 * @param string $condition 条件字段
 * @param string $field 需要返回的字段，不传则返回整个数据
 * @param string $table 需要查询的表
 * @param string $db 需要切换的数据库
 */
function get_table_field($value = null, $condition = 'id', $field = null, $table = null, $db = null)
{
    if (empty($value) || empty($table)) {
        return false;
    }

    //拼接参数
    $map[$condition] = $value;
    if (!empty($db)) {
        $info = M(ucfirst($table), C('DB_PREFIX'), $db)->where($map);
    } else {
        $info = M(ucfirst($table))->where($map);
    }
    if (empty($field)) {
        $info = $info->field(true)->find();
    } else {
        $info = $info->getField($field);
    }
    return $info;
}

/**
 * 检查$pos(推荐位的值)是否包含指定推荐位$contain
 * @param number $pos 推荐位的值
 * @param number $contain 指定推荐位
 * @return boolean true 包含 ， false 不包含
 */
function check_document_position($pos = 0, $contain = 0)
{
    if (empty($pos) || empty($contain)) {
        return false;
    }

    //将两个参数进行按位与运算，不为0则表示$contain属于$pos
    $res = $pos & $contain;
    if ($res !== 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * 获取数据的所有子孙数据的id值
 */
function get_stemma($pids, Model &$model, $field = 'id')
{
    $collection = array();

    //非空判断
    if (empty($pids)) {
        return $collection;
    }

    if (is_array($pids)) {
        $pids = trim(implode(',', $pids), ',');
    }
    $result = $model->field($field)->where(array('pid' => array('IN', (string)$pids)))->select();
    $child_ids = array_column((array)$result, 'id');

    while (!empty($child_ids)) {
        $collection = array_merge($collection, $result);
        $result = $model->field($field)->where(array('pid' => array('IN', $child_ids)))->select();
        $child_ids = array_column((array)$result, 'id');
    }
    return $collection;
}


/**
 * 删除文件或文件夹
 */
function rmdirr($dirname)
{
    if (!file_exists($dirname)) {
        return false;
    }
    if (is_file($dirname) || is_link($dirname)) {
        return unlink($dirname);
    }
    $dir = dir($dirname);
    if ($dir) {
        while (false !== $entry = $dir->read()) {
            if ($entry == '.' || $entry == '..') {
                continue;
            }
            rmdirr($dirname . DIRECTORY_SEPARATOR . $entry);
        }
    }
    $dir->close();
    return rmdir($dirname);
}

/**
 * 获取图片
 * @param string $path
 */
function get_image($path)
{
    if (empty($path)) {
        return false;
    }
    return substr(C('PICTURE_UPLOAD.rootPath'), 1) . $path;
}


/**
 * 插入队列
 *
 * @param    string $name 队列名
 * @param    string $data 队列数据
 * @param    bool $opt 队列操作方式[插入/读取 _默认读取]
 * @return   bool/array
 */
function queue_execute($name, $data, $opt = true)
{
    //创建队列对象
    $queue = queue_object_create();

    //插入/读取
    $result = ($opt === true) ? $queue->put($name, $data) : $queue->gets($name);

    //处理结果
    return $result;
}

/**
 * 创建队列对象
 *
 * @return   object
 */
function queue_object_create()
{
    //引入类库
    import('Lib.Com.Httpsqs');

    //初始化客户端
    $queue = new Httpsqs(C('HTTPSQS_HOST'), C('HTTPSQS_PORT'), C('HTTPSQS_AUTH'), C('HTTPSQS_CHARSET'));

    return $queue;
}

/**
 * 比对当前时间相隔天数 分钟数
 * @param timestamp $time 时间差
 */
function time2Units($time)
{

    $year = floor($time / 60 / 60 / 24 / 365);
    $time -= $year * 60 * 60 * 24 * 365;
    $month = floor($time / 60 / 60 / 24 / 30);
    $time -= $month * 60 * 60 * 24 * 30;
    $week = floor($time / 60 / 60 / 24 / 7);
    $time -= $week * 60 * 60 * 24 * 7;
    $day = floor($time / 60 / 60 / 24);
    $time -= $day * 60 * 60 * 24;
    $hour = floor($time / 60 / 60);
    $time -= $hour * 60 * 60;
    $minute = floor($time / 60);
    $time -= $minute * 60;
    $second = $time;
    $elapse = '';

    $unitArr = array(
        '年' => 'year',
        '个月' => 'month',
        '周' => 'week',
        '天' => 'day',
        '小时' => 'hour',
        '分钟' => 'minute',
        '秒' => 'second'
    );

    foreach ($unitArr as $cn => $u) {
        if ($$u > 0) {
            $elapse = $$u . $cn;
            break;
        }
    }

    return $elapse;
}

function question_image2arr($file)
{

    $file = str_replace(array('||'), '|', $file);
    return explode('|', $file);
}

/**
 * 根据用户的userid来散列获取分表名称
 *
 * @param  int $userid 用户表主键
 * @return boolean
 */
function spf_table($userid, $num = 64)
{
    return intval(sprintf('%02x', intval($userid) % $num));
}

/**
 * 将秒数转化为 00:00:00 形式字符串
 * $seconds  秒数
 * $fomate   格式
 */
function format_time($seconds, $fomate)
{
    $hour = floor($seconds / 3600);
    $minute = floor(($seconds % 3600) / 60);
    $second = floor($seconds % 60);
    $hh = strlen(strval($hour)) < 2 ? '0' . $hour : $hour;
    $mm = strlen(strval($minute)) < 2 ? '0' . $minute : $minute;
    $ss = strlen(strval($second)) < 2 ? '0' . $second : $second;
    $search = array("hh", "mm", "ss");
    $replace = array($hh, $mm, $ss);
    $replace_time = str_replace($search, $replace, $fomate);
    return $replace_time;
}

/**
 * 计算时间戳距离现在的小时数
 * @param  $time   时间戳
 * @return string
 */
function count_hours($time)
{
    $difftime = $time - time();
    $difftime = $difftime > 0 ? $difftime : 0;
    $hour = $difftime / 3600;
    $leavetime = format_time($difftime, "hh小时mm分钟");
    if ($hour >= 12) {
        //大于12小时
        return '<span style="color:blue">' . $leavetime . '</span>';
    } elseif ($hour < 12 && $hour > 6) {
        //大于6小时小于12小时
        return '<span style="color:rgb(203, 140, 43)">' . $leavetime . '</span>';
    } else {
        //小于6小时
        if ($hour < 1) {
            $minute = $difftime / 60;
            return '<span style="color:rgb(203, 140, 43)">' . intval($minute) . '分钟</span>';
        } else {
            return '<span style="color:red">' . $leavetime . '</span>';
        }
    }


}

/**
 * 获取图片列表
 * @param  $imglist  图片id列表     "93,96,63"
 */
function getAnswerImg($imglist)
{
    if (!$imglist) {
        return false;
    }
    $array = array();
    $imgarr = explode(",", $imglist);
    if (is_array($imgarr)) {
        foreach ($imgarr as $key => $val) {
            $array[$key]["id"] = $val;
            $array[$key]["img_url"] = D("Picture")->where("id=" . $val)->getField("filepath");
            $array[$key]["img_name"] = D("Picture")->where("id=" . $val)->getField("filename");

            $array[$key]["img_url"] = add_img_host($array[$key]["img_url"]);
        }
    }
    return $array;
}

/**
 * 获取图片路径
 * @param  $imglist  图片id    "93"
 */
function getImgPath($img)
{
    if (!$img) {
        return false;
    }

    //return \Common\Model\PicModel::get($img);

    $filepath = D("Picture")->where("id=" . $img)->getField("filepath");
    return add_img_host($filepath);
}

/**
 * 获取图片路径
 * @param  $imglist  图片id    "93"
 */
function getFreeImgPath($img)
{
    if (!$img) {
        return false;
    }

    return \Common\Model\PicModel::getFree($img);
}

/**
 * 记录用户日志
 */
function user_log($data)
{
    $log = M('Operatelog', '', 'DB_CONFIG_LINK');
    return $log->add($data);
}

/**
 * 发送短信
 */
function send_sms($data, $type, $mobile)
{
    $smsApi = D('Common/Sms', 'Api');
    return $smsApi->send($data, $type, $mobile);
}

/**
 * 发送邮件
 */
function send_email($data, $type, $mail)
{
    $mailApi = D('Common/Mail', 'Api');
    return $mailApi->send($data, $type, $mail);
}

/**
 * 获取队列名 自动加上前缀
 */
function get_httpsqs_name($name)
{
    $http = C('HTTPSQS');
    return C('HTTPSQS_PREFIX') . $http[$name];
}

/**
 *
 * @param  $string    加密的字符串
 * @param string $operation 加密 还是解密
 * @param string $key key  加密密钥
 * @param number $expiry 过期时间
 * @return string           返回加密字符串
 */
function email_sign($string, $operation = 'DECODE', $key = '', $expiry = 0)
{
    $ckey_length = 4;

    $key = md5($key ? $key : C("DATA_AUTH_KEY"));
    $keya = md5(substr($key, 0, 16));
    $keyb = md5(substr($key, 16, 16));
    $keyc = $ckey_length ? ($operation == 'DECODE' ? substr($string, 0, $ckey_length) : substr(md5(microtime()),
        -$ckey_length)) : '';

    $cryptkey = $keya . md5($keya . $keyc);
    $key_length = strlen($cryptkey);

    $string = $operation == 'DECODE' ? base64_decode(substr($string, $ckey_length)) : sprintf('%010d',
            $expiry ? $expiry + time() : 0) . substr(md5($string . $keyb), 0, 16) . $string;
    $string_length = strlen($string);

    $result = '';
    $box = range(0, 255);

    $rndkey = array();
    for ($i = 0; $i <= 255; $i++) {
        $rndkey[$i] = ord($cryptkey[$i % $key_length]);
    }

    for ($j = $i = 0; $i < 256; $i++) {
        $j = ($j + $box[$i] + $rndkey[$i]) % 256;
        $tmp = $box[$i];
        $box[$i] = $box[$j];
        $box[$j] = $tmp;
    }

    for ($a = $j = $i = 0; $i < $string_length; $i++) {
        $a = ($a + 1) % 256;
        $j = ($j + $box[$a]) % 256;
        $tmp = $box[$a];
        $box[$a] = $box[$j];
        $box[$j] = $tmp;
        $result .= chr(ord($string[$i]) ^ ($box[($box[$a] + $box[$j]) % 256]));
    }

    if ($operation == 'DECODE') {
        if ((substr($result, 0, 10) == 0 || substr($result, 0, 10) - time() > 0) && substr($result, 10,
                16) == substr(md5(substr($result, 26) . $keyb), 0, 16)
        ) {
            return substr($result, 26);
        } else {
            return '';
        }
    } else {
        return $keyc . str_replace('=', '', base64_encode($result));
    }

}

/**
 * 设置缓存
 * @param  string $key 缓存key
 * @param  array $arr 组合key相应参数
 * @param  array|string $data 保存的数据
 * @param  int $exp 过期时间0永久(秒)
 * @return bool
 */
function set_cache($key, $arr = array(), $data, $exp = 0)
{
    if ($arr) {
        $key = $key . '_' . arr2str($arr, '_');
    }
    return S($key, $data, $exp);
}

/**
 * 获取缓存
 * @param  string $key 缓存key
 * @param  array $arr 组合key相应参数
 * @return array|string
 */
function get_cache($key, $arr = array())
{
    if ($arr) {
        $key = $key . '_' . arr2str($arr, '_');
    }
    return S($key);
}

/**
 * 删除缓存
 * @param  string $key 缓存key
 * @param  array $arr 组合key相应参数
 * @return bool
 */
function del_cache($key, $arr = array())
{
    if ($arr) {
        $key = $key . '_' . arr2str($arr, '_');
    }
    return S($key, null);
}

/**
 *绑定图片服务器地址
 *
 */
function add_img_host($imgpath = "")
{
    if ($imgpath === "") {
        return false;
    }
    $imgpath = C("IMG_HOST") . $imgpath;
    return $imgpath;
}

/**
 *删除图片服务器上图片
 * $filepath 图片相对路径    如： "/Uploads/picture/20140814/xxx.jpg"
 */
function del_img($filepath)
{
    $config = C("UPLOAD_FTP_CONFIG");
    $config_host = C("IMG_HOST");
    if ($config_host != "") {
        if (is_array($config)) {
            //连接服务器
            $link = ftp_connect($config['host'], $config['port'], $config['timeout']);
            if ($link) {

                if (ftp_login($link, $config['username'], $config['password'])) {

                    if (ftp_delete($link, $filepath)) {

                        return true;

                    } else {
                        return false;

                    }
                }
                ftp_close($link);
            }
        }
    } else {
        @unlink("." . $filepath);
    }
    return false;
}

/**
 * 过滤编辑器图片  添加图片服务器地址
 * $str  编辑器内容
 */
function filter_editor_img($str = "")
{
    preg_replace("<img.*src=[\"](.*?)[\"].*?>", $str, $str);
    return $str;
}

/**
 * 获取多维数组的交集
 *
 */
function get_intersect($array = array())
{
    if (count($array) > 0) {
        $array_a = $array[0];
        foreach ($array as $key => $val) {
            $array_a = array_intersect($array_a, $val);
        }
        return $array_a;
    } else {

        return false;
    }

}

/**
 * 获取用户真实姓名
 */

function get_truename($uid)
{
    if (!$uid) {
        return false;
    }

    $truename = D("User/UserProfile")->where("user_id=" . $uid)->getField("true_name");
    if (!$truename) {
        $truename = get_user_name($uid);
    }
    return $truename;
}

/**
 * 获取所属机构名称
 **/

function get_firmname($id)
{
    if ($id) {
        $firmname = M('firm')->where('id=' . $id)->getField('name');
        if ($firmname) {
            return $firmname;
        } else {
            return '无所属机构';
        }
    } else {
        return '无所属机构';
    }
}

/**
 * 获取方案名称
 */

function get_coursename($packid = 0)
{

    if (!$packid) {
        return false;
    }

    $pinfo = D("Package/CourseMember")->where("id=" . $packid)->field("term_id,course_name")->find();

    $term_name = D("Course/CourseTerm")->where("id=" . intval($pinfo['term_id']))->getField("title");

    return $pinfo["course_name"] ? $pinfo["course_name"] : $term_name;
}

/**
 * 加载后台设置配置文件
 */
function loadconfig()
{
    $config = S('GLOBALS_CONFIG_LIST');
    $cache_off = I("cache_off", 0);
    if (!$config || $cache_off) {
        $config = api('Config/lists');
        S('GLOBALS_CONFIG_LIST', $config);
    }
    C($config); //添加配置
}

/**
 * 输出带PRE的调试信息
 *
 * @param mixed $param1 ,$param2...$paramN
 * @return void
 */
function pre()
{
    $args = func_get_args();
    echo "<pre>\n";
    foreach ($args as $v) {
        print_r($v);
        echo "\n";
    }
    echo "</pre>\n";
}

/**
 * 根据给定时间参数与当前时间的差值转化时间格式
 *
 *    今天内的时间将格式化为:
 *       刚刚 / N秒前/ N分钟前 / 半小时前 / N小时前
 *    昨天/前天内的时间将格式化为:
 *       (昨天|前天)HH:II
 *    7 天内的时间将格式化为:
 *       N天前
 *    1 年内的时间将格式化为: (此处还存在一点问题，应分为今年内的和年前的，但出于效率考量，暂定为此，以后找到了好的方法再行优化)
 *       MM-DD HH:II
 *    1 年前的时间将格式化为:
 *       YYYY-MM-DD HH:II
 *
 * @param string $datetime 日期时间字符串,支持的格式请参考strtotime
 * @param boolean $is_timestamp 当$datetime为时间戳时设为true
 * @return string
 */
function date_custom($datetime, $is_timestamp = false)
{
    static $OFFSET = 28800; // 8 小时时差
    static $ONEDAY = 86400; // 1 天
    static $REMAINS = 57599; // 86400 - 28800 - 1 秒

    $tformat = 'H:i';
    $dtformat = 'm-d H:i';

    // 当前时间
    $now = $_SERVER['REQUEST_TIME'];
    $seconds = $now % $ONEDAY;
    $midnight = $now - $seconds + $REMAINS;
    // 给定日期
    $timestamp = (is_numeric($datetime) || $is_timestamp) ? $datetime : strtotime($datetime);
    // 与今日最后一秒时间差
    $xdiff = $midnight - $timestamp;
    // 天数差
    $days = intval($xdiff / $ONEDAY);
    // 与当前时间的差值
    $diff = $now - $timestamp;
    // 补上时差
    $timestamp += $OFFSET;

    if ($days == 0) {
        if ($diff > 3600) {
            return intval($diff / 3600) . '小时前';
        } elseif ($diff > 1800) {
            return '半小时前';
        } elseif ($diff > 60) {
            return intval($diff / 60) . '分钟前';
        } elseif ($diff > 0) {
            return $diff . '秒前';
        } elseif ($diff == 0) {
            return '刚刚';
        }
    } else {
        if ($days <= 7) {
            if ($days == 1) {
                return '昨天' . gmdate($tformat, $timestamp);
            } else {
                if ($days == 2) {
                    return '前天' . gmdate($tformat, $timestamp);
                }
            }
            return $days . '天前';
        } else {
            $this_year = (int)date('Y', $now);
            $that_year = (int)date('Y', $timestamp);
            if ($this_year !== $that_year) {
                $dtformat = 'Y-m-d H:i';
            }
        }
    }
    return gmdate($dtformat, $timestamp);
}

/**
 * 返回的值的一列$input阵列，确定由columnKey。或者，您可以提供一个indexKey指数的$input数组中的值从indexKey列返回的数组中的值。
 * 像从数据库获取一列，但返回是数组（扩展：获取多列）
 * @param array $input 一个多维数组（记录集），拉一列值
 * @param mixed $columnKey 返回值的列。想要检索的列值可以是整数键，或者它可能是一个关联数组，字符串键名。
 *                                扩展功能：数组，
 *                                    传递array()，则直接返回所有数据，
 *                                    array('key1', 'key2', ....)，则返回对应相应的key所对应的值，索引保持不变
 * @param mixed $indexKey 列返回的数组中的索引/键使用。此值可以是该列的整数键，或者它可以是字符串键的名称。（可选）
 *
 * @return array
 */
function hd_array_column($input, $columnKey, $indexKey = null)
{
    $result = array();

    if (!is_array($input)) {
        return $result;
    }

    $isFetchAll = false;
    foreach ($input as $item) {
        if (is_array($columnKey)) // 数组
        {
            if (empty($columnKey)) {
                $isFetchAll = true;
            }

            if (!empty($columnKey) || $isFetchAll) {
                $tempItem = '';
                if (!$isFetchAll) {
                    foreach ($columnKey as $colKey) {
                        if (isset($item[$colKey])) {
                            $tempItem[$colKey] = $item[$colKey];
                        }
                    }
                } else {
                    $tempItem = $item;
                }

                if (null !== $indexKey && isset($item[$indexKey]) && !is_array($item[$indexKey])) {
                    $result[$item[$indexKey]] = $tempItem;
                } else {
                    $result[] = $tempItem;
                }
            }
        } else // 整数、字符串
        {
            if (isset($item[$columnKey])) {
                if (null !== $indexKey && isset($item[$indexKey]) && !is_array($item[$indexKey])) {
                    $result[$item[$indexKey]] = $item[$columnKey];
                } else {
                    $result[] = $item[$columnKey];
                }
            }
        }
    }

    return $result;
}

/**
 * 系统同步登陆
 */
function link_sys_login()
{
    $user_auth = cookie('user_auth') ? cookie('user_auth') : session('user_auth');
    $user_auth_sign = cookie('user_auth_sign') ? cookie('user_auth_sign') : session('user_auth_sign');
    $user_auth = json_encode($user_auth);
    $urlObj = new \Org\Net\Url();
    $url = $_SERVER['HTTP_HOST'] . "/Sys/login";
    $urlObj->post($url, array('user_auth' => $user_auth, 'user_auth_sign' => $user_auth_sign));
}

/**
 * 系统同步登陆
 */
function link_sys_loginout()
{
    $urlObj = new \Org\Net\Url();
    $url = "/Sys/loginout";
    $urlObj->post($url, array());
}

/**
 * 检测来路域名是否合法
 */
function check_referer_domain()
{
    $domain_name = $_SERVER['HTTP_REFERER'];  //来路链接

    $domain_host = parse_url($domain_name)['host'];

    if (substr($domain_host, -9) != "msu7.net") {
        return false;
    }
    return true;
}

/**
 * P2P回调函数
 * @param string $str //返回设备IP端口信息
 * @param int $status 0：登录P2P服务器；1：登出P2P服务器；2：获取所有注册到P2P的设备信息；3 获取特定注册到P2P服务器的设备信息
 * @param int $flag 成功还是失败，大于零是成功，小于等0是失败
 */
function Msu7ServerDataBack($str = '', $status, $flag)
{
//    if (!empty($str)) {
        session_start();
        $arr = explode('$', $str);
//        if ($arr[1] == '00000000000000000000000000000000') {
//            return;
//        }
        $statu = dechex($status);
        $url = "uuid=" . (int)$arr[0] . "$" . $arr[1];
        $source = fopen("/home/wwwroot/www.msu7.net/testlog1.log", 'a+');
        fwrite($source,
            'str:=>' . $str . '   ' . 'status:=>' . $statu . '   ' . '   ' . 'date:=>' . date('Y-m-d H:i:s'));
        fclose($source);
        $uid = empty($_SESSION['devlink_']['user_auth']['uid']) ? 0 : $_SESSION['devlink_']['user_auth']['uid'];
        $time = time();
        $mc = new \Memcached();
        $mc->addServer("localhost", 11211);
        $deviceInfo = $mc->get('device_info');
        $device = $arr[1];
        if ($device) {
            $res1 = M("modules_device")->where(['uuid' => $device])->find();
            if ($res1['name']) {
                $devicename = $res1['name'];
            } else {
                $devicename = $device;
            }
            $res2 = M("type")->where(['id' => $res1['type']])->find();
            if ($statu == 10000000) {
                $newInfo[$arr[1]] = trim($arr[0]);
                $deviceInfo = array_merge($deviceInfo, $newInfo);
                $mc->replace('device_info', $deviceInfo);
                $setstate = M('ModulesDevice')->where(['uuid' => $device])->save(['state' => 1]);
                if (!$setstate) {
                    var_dump($device . " set login error!");
                } else {
                    pushSocketMsg("publish", $res2['name'] . '【' . $devicename . '】' . "上线了！");
                }

                //设备上线后请求刷新输入源
                $suuid = (int)$arr[0] . "$" . $arr[1];
                msu7server_send($suuid, '0x11000003');

                if ($device && $uid) {
                    M('operatelog')->add([
                        'userid' => $uid,
                        'type' => 3,
                        'description' => "$device 上线了",
                        'createtime' => $time
                    ]);
                }
                //设备上线触发主动拉取共享修改事件
                \Home\Model\DeviceModel::shareBePushed($str);
            } elseif ($statu == 10000001) {
//                unset($deviceInfo[$arr[1]]);
//                $mc->replace('device_info', $deviceInfo);
//                $setstate = M('ModulesDevice')->where(['uuid' => $device])->save(['state' => 0]);
//                if (!$setstate) {
//                    var_dump($device . " set logout error!");
//                } else {
//                    pushSocketMsg("publish", $res2['name'] . '【' . $devicename . '】' . "注销了！");
//                }
//
//                if ($device && $uid) {
//                    M('operatelog')->add([
//                        'userid' => $uid,
//                        'type' => 3,
//                        'description' => "$device 注销了",
//                        'createtime' => $time
//                    ]);
//                }
            } elseif ($statu == 10000003) {
                unset($deviceInfo[$arr[1]]);
                $mc->replace('device_info', $deviceInfo);
                $setstate = M('ModulesDevice')->where(['uuid' => $device])->save(['state' => 0]);
                if (!$setstate) {
//                    var_dump($device . " set offline error");
                } else {
                    pushSocketMsg("publish", $res2['name'] . '【' . $devicename . '】' . "掉线了！");
                }

                if ($device && $uid) {
                    M('operatelog')->add([
                        'userid' => $uid,
                        'type' => 3,
                        'description' => "$device 掉线了",
                        'createtime' => $time
                    ]);
                }
            } elseif ($statu == 11000003) {
                $result = file_get_contents("/tmp/config/$device/web_config3.txt");
                if ($result) {
                    preg_match('/\/(\[.*])/', $result, $match);
                    $val = serialize(json_decode($match[1], true));
                    if (M('VideoList')->where(array("device_serial" => $device))->find()) {
                        M('VideoList')->where(array("device_serial" => $device))->save(array(
                            'device_serial' => $device,
                            'video_input' => $val,
                            'time' => time()
                        ));
                    } else {
                        M('VideoList')->add(array('device_serial' => $device, 'video_input' => $val, 'time' => time()));
                    }

                    //存入memcached

                    try {
                        $mc = new Memcached();
                        $mc->addServer("localhost", 11211);
                        //初始化  device_list  总数组
                        $mc->get('device_list');
                        $is_defined = $mc->getResultCode();

                        $content = ['device_serial' => $device, 'video_input' => $match[1], 'time' => time()];

                        if ($is_defined == 16) {
                            $mem_devcie = [];
                            //add.
                            array_push($mem_devcie, [$content['device_serial'] => $content]);
                            $mc->add('device_list', $mem_devcie);
                        } else {
                            $mem_devcie = $mc->get('device_list');
                            //save.
                            foreach ($mem_devcie as $k => $v) {
                                $key_exists = array_key_exists($content['device_serial'], $v);
                                if ($key_exists) {
                                    $mem_devcie[$k] = [$content['device_serial'] => $content];
                                    break;
                                }
                            }
                            $mc->replace('device_list', $mem_devcie);
                        }
                    } catch (\Exception $e) {
                        echo 'Memcache:' . $e->getMessage();
                        echo '异常代码:' . $e->getCode();
                        echo '异常文件:' . $e->getFile();
                        echo '所在行:' . $e->getLine();
                    }
                }
            }elseif($statu == 50000000 || $statu == 50000001 || $statu == 52000003 || $statu == 52000004){
                //警点报警0x50000000、数据:“socket连接号$设备序列号$报警设备ID$警点号
                //警点消警0x50000001、数据:“socket连接号$设备序列号$报警设备ID$警点号
                $alertModel = new \Home\Model\EventModel();
                $alertModel->test($str);
                if($statu == 50000000){
                    //报警
//                    $alertModel->triggerAlarm($str);
                }else{
                    //消警
                    //$alertModel->eliminateAlarm($str);
                }
            }
        }

    return 0;
//    }
}

function mysql_insert($sql,$print = false){
    if($print) return $sql;
    $mysqli = new \mysqli("127.0.0.1", "root", "67hgt$#Dr503d", "link");
    $mysqli->query($sql);
    $mysqli->close();
}
//读取输入源写入数据库   /tmp/config/'这个用uuid（54e63f300a64d8db3cb81966ebf2ffff）代替'/web_config3.txt
function getInputAdd()
{
    $mc = new Memcached();
    $mc->addServer("127.0.0.1", 11211);
    $res = $mc->get('device_array');
    if (is_array($res) && $mc->getResultCode() != 16) {
        foreach ($res as $k => $v) {
            $device = explode('$', $v['uuid'])[1];
            $result = file_get_contents("/tmp/config/$device/web_config3.txt");
            if ($result) {
                preg_match('/\/(\[.*])/', $result, $match);
                $val = serialize(json_decode($match[1], true));
                if (M('VideoList')->where(array("device_serial" => $res))->find()) {
                    M('VideoList')->where(array("device_serial" => $res))->save(array(
                        'device_serial' => $res,
                        'video_input' => $val,
                        'time' => time()
                    ));
                } else {
                    M('VideoList')->add(array('device_serial' => $res, 'video_input' => $val, 'time' => time()));
                }
            }
        }
    }
}

function pushSocketMsg($type = "", $content = "", $to = "")
{

    $ch1 = curl_init();
    $post_data = array('type' => $type,'content' => $content,'to' => $to);
    curl_setopt($ch1, CURLOPT_URL, C('SITE_URL'));
    curl_setopt($ch1, CURLOPT_PORT, 2121);
    curl_setopt($ch1, CURLOPT_HEADER, 0);
    curl_setopt($ch1, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch1, CURLOPT_POST, 1);
    curl_setopt($ch1, CURLOPT_POSTFIELDS, $post_data);
    $cu = @curl_exec($ch1);
    curl_close($ch1);
}

function currentPath($pathInfo)
{
    if (strtolower(MODULE_NAME . '/' . CONTROLLER_NAME . '/' . ACTION_NAME) == $pathInfo) {
        return true;
    }

    return false;


}
//缩略图
function imgThump($file_path,$thump_path,$height,$width)
{
    $image = new \Think\Image();
    $image->open($file_path);
    // 按照原图的比例生成一个最大为150*150的缩略图并保存为thumb.jpg
    $image->thumb($height, $width)->save($thump_path);
}

//获取机构下面的所有部门
function get_group($firmid,$res_data = [],$pid=0){
    //拿出当前机构下面的部门
    $group = M('firm_group')->where(['firmid'=>$firmid,'status'=>1])->select();

    if($group){
        foreach($group as $key => $value ){
            if($value['parentid'] == $pid){

                //获取这个部门下面的所有用户id
                $res_uid = M('group_user')->where(['groupid'=>$value['id'] , 'status' => 1])->select();
                if($res_uid){
                   /* $group[$key]['userinfo'] = [];*/
                    foreach($res_uid as $v){
                        $user_res = M('user')->where(['id'=>$v['userid'],'status'=>1])->field('id,username,mobile')->find();
                        if($user_res && !in_array($group[$key]['userinfo'],$user_res)){
                            /*array_push($group[$key]['userinfo'],$user_res);*/
                            $group[$key]['userinfo_uid'] .= $user_res['id'] .',';
                            $group[$key]['userinfo_username'] .= $user_res['username'].',';
                            $group[$key]['userinfo_mobile'] .= $user_res['mobile'].',';
                        }

                    }
                    $group[$key]['userinfo_uid'] = substr($group[$key]['userinfo_uid'],0,strlen($group[$key]['userinfo_uid'])-1);
                    $group[$key]['userinfo_username'] = substr($group[$key]['userinfo_username'],0,strlen($group[$key]['userinfo_username'])-1);
                    $group[$key]['userinfo_mobile'] = substr($group[$key]['userinfo_mobile'],0,strlen($group[$key]['userinfo_mobile'])-1);
                }
               //封装数组
                //截取去后一位字符串

                $res_data[$value['id']] = $group[$key];
                unset($group[$key]);
            }
        }
        if($group){
            foreach($group as $key => $value){
                foreach($res_data as $k => $v){
                    if($k == $value['parentid']){
                        //获取这个部门下面的所有用户id
                        $res_uid = M('group_user')->where(['groupid'=>$value['id'] , 'status' => 1])->select();
                        if($res_uid){

                            foreach($res_uid as $v){
                                $user_res = M('user')->where(['id'=>$v['userid'],'status'=>1])->field('id,username,mobile')->find();
                                if($user_res && !in_array($value[$key]['userinfo'],$user_res)){

                                    $value['userinfo_uid'] .= $user_res['id'].',';
                                    $value['userinfo_username'] .= $user_res['username'].',';
                                    $value['userinfo_mobile'] .= $user_res['mobile'].',';
                                }

                            }
                            $value['userinfo_uid'] = substr($value['userinfo_uid'],0,strlen($value['userinfo_uid'])-1);
                            $value['userinfo_username'] = substr($value['userinfo_username'],0,strlen($value['userinfo_username'])-1);
                            $value['userinfo_mobile'] = substr($value['userinfo_mobile'],0,strlen($value['userinfo_mobile'])-1);
                        }
                        //封装数组

                        $res_data[$k][$value['id']] = $value;
                        unset($group[$key]);
                    }
                }
            }
        }
        //三级
        if($group){
            foreach($group as $key => $value){
                foreach($res_data as $k => $v){
                    foreach($v as $ke => $val){
                        if(is_array($val)){
                            if($ke == $value['parentid']){

                                //获取这个部门下面的所有用户id
                                $res_uid = M('group_user')->where(['groupid'=>$value['id'] , 'status' => 1])->select();
                                if($res_uid){

                                    foreach($res_uid as $v){
                                        $user_res = M('user')->where(['id'=>$v['userid'],'status'=>1])->field('id,username,mobile')->find();
                                        if($user_res && !in_array($value[$key]['userinfo'],$user_res)){

                                            $value['userinfo_uid'] .= $user_res['id'].',';
                                            $value['userinfo_username'] .= $user_res['username'].',';
                                            $value['userinfo_mobile'] .= $user_res['mobile'].',';
                                        }

                                    }
                                    $value['userinfo_uid'] = substr($value['userinfo_uid'],0,strlen($value['userinfo_uid'])-1);
                                    $value['userinfo_username'] = substr($value['userinfo_username'],0,strlen($value['userinfo_username'])-1);
                                    $value['userinfo_mobile'] = substr($value['userinfo_mobile'],0,strlen($value['userinfo_mobile'])-1);
                                }

                                //封装数组

                                $res_data[$k][$ke][$value['id']] = $value;
                                unset($group[$key]);
                            }
                        }
                    }
                }
            }
        }
        //四级
        if($group){
            foreach($group as $key => $value){
                foreach($res_data as $k => $v){
                    foreach($v as $ke => $val){
                        foreach($val as $ke1 => $val1){
                            if(is_array($val1)){
                                if($ke1 == $value['parentid']){

                                    //获取这个部门下面的所有用户id
                                    $res_uid = M('group_user')->where(['groupid'=>$value['id'] , 'status' => 1])->select();
                                    if($res_uid){

                                        foreach($res_uid as $v){
                                            $user_res = M('user')->where(['id'=>$v['userid'],'status'=>1])->field('id,username,mobile')->find();
                                            if($user_res && !in_array($value[$key]['userinfo'],$user_res)){

                                                $value['userinfo_uid'] .= $user_res['id'].',';
                                                $value['userinfo_username'] .= $user_res['username'].',';
                                                $value['userinfo_mobile'] .= $user_res['mobile'].',';
                                            }
                                        }
                                        $value['userinfo_uid'] = substr($value['userinfo_uid'],0,strlen($value['userinfo_uid'])-1);
                                        $value['userinfo_username'] = substr($value['userinfo_username'],0,strlen($value['userinfo_username'])-1);
                                        $value['userinfo_mobile'] = substr($value['userinfo_mobile'],0,strlen($value['userinfo_mobile'])-1);
                                    }
                                    //封装数组

                                    $res_data[$k][$ke][$ke1][$value['id']] = $value;
                                    unset($group[$key]);
                                }
                            }
                        }

                    }
                }
            }
        }

    }
    return $res_data;
}

/*
 *公用tree
 * $array  数据库获取的二维数组
 * $ret   是索引目录
 * */
function common_tree($array ,$ret,$fieldName){
    $group = $array;
    $return = $ret;//索引目录
    $parent='';

    foreach ($return as $k=>$v) {
        if ($v["$fieldName"] >= 0) {
            $return[$v["$fieldName"]]['child'][$v['id']] = &$return[$k];

        } else {
//找到根目录
            $parent = &$return[$k];
        }
    }
    return $return[0]['child'];
}

/*
 *公用tree
 * $ret   是索引目录 键名以编号代替
 * $num_digit    当前编号的编码位数  3 ，2 等
 * */
function common_number_tree($ret,$fieldName,$num_digit){
    $return = $ret;//索引目录
    $parent='';
    foreach ($return as $k=>$v) {
        $number_digit = strlen($v["$fieldName"]);
        if ($number_digit > $num_digit) {
            $p_index_num = mb_substr($v["$fieldName"],0,($number_digit-$num_digit)) ;
            $return[$p_index_num]['child'][$v['number']] = &$return[$k];
            unset($return[$k]);
        } else {
            $parent = &$return[$k];
        }
    }
    return $return;
}


//获取机构下面的所有部门
function get_groupaz($firmid,$res_data = [],$pid=0){
    //拿出当前机构下面的部门
    $group = M('firm_group')->where(['firmid'=>$firmid,'status'=>1])->select();
    if($group){
        foreach($group as $key => $value ){
            if($value['parentid'] == $pid){
                //获取这个部门下面的所有用户id
                $res_uid = M('group_user')->where(['groupid'=>$value['id'] , 'status' => 1])->select();
                if($res_uid){
                    /* $group[$key]['userinfo'] = [];*/
                    foreach($res_uid as $v){
                        $user_res = M('user')->where(['id'=>$v['userid'],'status'=>1])->field('id,username,mobile')->find();
                        if($user_res && !in_array($group[$key]['userinfo'],$user_res)){
                            /*array_push($group[$key]['userinfo'],$user_res);*/
                            $group[$key]['userinfo_uid'] .= $user_res['id'] .',';
                            $group[$key]['userinfo_username'] .= $user_res['username'].',';
                            $group[$key]['userinfo_mobile'] .= $user_res['mobile'].',';
                        }
                    }
                    $group[$key]['userinfo_uid'] = substr($group[$key]['userinfo_uid'],0,strlen($group[$key]['userinfo_uid'])-1);
                    $group[$key]['userinfo_username'] = substr($group[$key]['userinfo_username'],0,strlen($group[$key]['userinfo_username'])-1);
                    $group[$key]['userinfo_mobile'] = substr($group[$key]['userinfo_mobile'],0,strlen($group[$key]['userinfo_mobile'])-1);
                }
                //封装数组
                //截取去后一位字符串
                $res_data[$value['id']] = $group[$key];
                unset($group[$key]);
            }
        }
        if($group){
            foreach($group as $key => $value){
                foreach($res_data as $k => $v){
                    if($k == $value['parentid']){
                        //获取这个部门下面的所有用户id
                        $res_uid = M('group_user')->where(['groupid'=>$value['id'] , 'status' => 1])->select();
                        if($res_uid){
                            foreach($res_uid as $v){
                                $user_res = M('user')->where(['id'=>$v['userid'],'status'=>1])->field('id,username,mobile')->find();
                                if($user_res && !in_array($value[$key]['userinfo'],$user_res)){
                                    $value['userinfo_uid'] .= $user_res['id'].',';
                                    $value['userinfo_username'] .= $user_res['username'].',';
                                    $value['userinfo_mobile'] .= $user_res['mobile'].',';
                                }
                            }
                            $value['userinfo_uid'] = substr($value['userinfo_uid'],0,strlen($value['userinfo_uid'])-1);
                            $value['userinfo_username'] = substr($value['userinfo_username'],0,strlen($value['userinfo_username'])-1);
                            $value['userinfo_mobile'] = substr($value['userinfo_mobile'],0,strlen($value['userinfo_mobile'])-1);
                        }
                        //封装数组
                        $res_data[$k][$value['id']] = $value;
                        unset($group[$key]);
                    }
                }
            }
        }
        //三级
        if($group){
            foreach($group as $key => $value){
                foreach($res_data as $k => $v){
                    foreach($v as $ke => $val){
                        if(is_array($val)){
                            if($ke == $value['parentid']){
                                //获取这个部门下面的所有用户id
                                $res_uid = M('group_user')->where(['groupid'=>$value['id'] , 'status' => 1])->select();
                                if($res_uid){
                                    foreach($res_uid as $v){
                                        $user_res = M('user')->where(['id'=>$v['userid'],'status'=>1])->field('id,username,mobile')->find();
                                        if($user_res && !in_array($value[$key]['userinfo'],$user_res)){
                                            $value['userinfo_uid'] .= $user_res['id'].',';
                                            $value['userinfo_username'] .= $user_res['username'].',';
                                            $value['userinfo_mobile'] .= $user_res['mobile'].',';
                                        }
                                    }
                                    $value['userinfo_uid'] = substr($value['userinfo_uid'],0,strlen($value['userinfo_uid'])-1);
                                    $value['userinfo_username'] = substr($value['userinfo_username'],0,strlen($value['userinfo_username'])-1);
                                    $value['userinfo_mobile'] = substr($value['userinfo_mobile'],0,strlen($value['userinfo_mobile'])-1);
                                }
                                //封装数组
                                $res_data[$k][$ke][$value['id']] = $value;
                                unset($group[$key]);
                            }
                        }
                    }
                }
            }
        }
        //四级
        if($group){
            foreach($group as $key => $value){
                foreach($res_data as $k => $v){
                    foreach($v as $ke => $val){
                        foreach($val as $ke1 => $val1){
                            if(is_array($val1)){
                                if($ke1 == $value['parentid']){
                                    //获取这个部门下面的所有用户id
                                    $res_uid = M('group_user')->where(['groupid'=>$value['id'] , 'status' => 1])->select();
                                    if($res_uid){
                                        foreach($res_uid as $v){
                                            $user_res = M('user')->where(['id'=>$v['userid'],'status'=>1])->field('id,username,mobile')->find();
                                            if($user_res && !in_array($value[$key]['userinfo'],$user_res)){
                                                $value['userinfo_uid'] .= $user_res['id'].',';
                                                $value['userinfo_username'] .= $user_res['username'].',';
                                                $value['userinfo_mobile'] .= $user_res['mobile'].',';
                                            }
                                        }
                                        $value['userinfo_uid'] = substr($value['userinfo_uid'],0,strlen($value['userinfo_uid'])-1);
                                        $value['userinfo_username'] = substr($value['userinfo_username'],0,strlen($value['userinfo_username'])-1);
                                        $value['userinfo_mobile'] = substr($value['userinfo_mobile'],0,strlen($value['userinfo_mobile'])-1);
                                    }
                                    //封装数组
                                    $res_data[$k][$ke][$ke1][$value['id']] = $value;
                                    unset($group[$key]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    $res_data = array_values($res_data);
    foreach($res_data as $k=>$v){
        $res_data[$k]['list'] = [];
       foreach($v as $k1 => $v1){
           if(is_array($v1)){
                array_push($res_data[$k]['list'],$v1);
                unset($res_data[$k][$k1]);
                $open = true;
           }
           if($res_data[$k]['list']){
               foreach($res_data[$k]['list'] as $k2 => $v2){
                   if(is_array($v2)){
                       $res_data[$k]['list'][$k2]['list'] = [];
                       foreach($v2 as $k3 => $v3){
                           if(is_array($v3)){
                                array_push($res_data[$k]['list'][$k2]['list'],$v3);
                                 unset($res_data[$k]['list'][$k2][$k3]);
                           }
                            //四级
                           if($res_data[$k]['list'][$k2]['list']){
                               foreach($res_data[$k]['list'][$k2]['list'] as $k4 => $v4){
                                   if(is_array($v4)){
                                       $res_data[$k]['list'][$k2]['list'][$k4]['list'] = [];
                                       foreach($v4 as $k5=>$v5){
                                           if(is_array($v5)){
                                               array_push($res_data[$k]['list'][$k2]['list'][$k4]['list'],$v5);
                                               unset($res_data[$k]['list'][$k2]['list'][$k4][$k5]);
                                           }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
       }
    }
    return $res_data;
}

//获取机构下面用户
function get_firm_user($lastFirmId){
    $user_info = [];
    $userid = [];
    $res_userid = M('group_user')->where(['firmid'=>$lastFirmId , 'status' => 1])->field('userid')->select();
    foreach($res_userid as $v){
        array_push($userid,$v[userid]);
    }
    $userid = array_unique($userid);
    foreach ($userid as $v){
        $userinfo = M('user')->where(['id'=>$v])->field('id,mobile,username')->find();
        if($userinfo){
            array_push($user_info,$userinfo);
        }
    }
    return $user_info;
}

/*针对任意键值来进行去重*/
function getArrayUniqueByKeys($arr)
{
    $arr_out = [];
    foreach ($arr as $k => $v) {
        // $key_out = $v['id']."-".$v['age'];
        $key_out = $v['id']; //提取内部一维数组的key(name age)作为外部数组的键  

        if (array_key_exists($key_out, $arr_out)) {
            continue;
        } else {
            $arr_out[$key_out] = $arr[$k]; //以key_out作为外部数组的键
            $arr_wish[$k] = $arr[$k];  //实现二维数组唯一性
        }
    }
    $arr2 = [];
    $arr_wish = array_merge($arr_wish,$arr2);

    return $arr_wish;
}

//多维数组遍历
    function arr_foreach ($arr,$list) 
    {
        if (!is_array ($arr)) 
        {
            return false;
        }

        foreach ($arr as $key => $val ) 
        {
            if (is_array ($val['childs'])) 
            {
                arr_foreach ($val['childs']);
            } 
            // else 
            // {
            //     //遍历成功时打印结果
            //     // break;
            //     // if ($list) {
            //     //    $str[]=$val[$list];
            //     // }else{
            //     //    $str[]=$val;
            //     // }

            // }
            $str[]=$val;
        }
        return $str;
    }

/**
 * 发送HTTP请求方法
 * @param  string $url    请求URL
 * @param  string $port    请求端口
 * @param  array  $params 请求参数
 * @param  string $method 请求方法GET/POST
 * @return array  $data   响应数据
 */
 function http($url, $port, $params, $method = 'GET', $header = array(), $multi = false){
    $opts = array(
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_HTTPHEADER     => $header
    );
    $opts[CURLOPT_PORT] = $port;
    /* 根据请求类型设置特定参数 */
    switch(strtoupper($method)){
        case 'GET':
            $opts[CURLOPT_URL] = $url . '?' . http_build_query($params);
            break;
        case 'POST':
            //判断是否传输文件
            $params = $multi ? $params : http_build_query($params);
            $opts[CURLOPT_URL] = $url;
            $opts[CURLOPT_POST] = 1;
            $opts[CURLOPT_POSTFIELDS] = $params;
            break;
        default:
            throw new Exception('不支持的请求方式！');
    }
    /* 初始化并执行curl请求 */
    $ch = curl_init();
    curl_setopt_array($ch, $opts);
    $data  = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);
    if($error) throw new Exception('请求发生错误：' . $error);
    return  $data;
 }

 function getMaxNumber($exits_group){
     $number = 0;
     if($exits_group){
         foreach($exits_group as $k => $v){
             $v['number'] = $v['number'];
             if( $v['number'] > $number)
             {
                 $number = $v['number'];
             }
         }
     }
     return $number;
 }

 //获取当前的最新编号编号
    function  getNewNumber($exits_type,$data,$p_num){
     if($exits_type){
         $number = getMaxNumber($exits_type);
         //用来处理最前面0因为相加后消失,如果为1开头，则直接加一即可
         $num_before_len = strlen($number);
         $number += 1;
         $num_after_len = strlen($number);
         //001  变为  1 则为2    010 变为 10 则为 1
         if($num_before_len - strlen($number) == 2){
             $data['number'] = '00' . "$number";
         }
         elseif($num_before_len - strlen($number) == 1)
         {
             $data['number'] = '0' . "$number";
         }
         else
         {
             $data['number'] = "$number";
         }
     }else
     {
         $number = $p_num . '001';
         $data['number'] = "$number";
     }

        return $data;
    }

 function is_firm_creator(){
     if(!M('firm')->where(['userid'=>session('user_auth.uid'),'id'=>session('lastfirmid')])->find()){        
        return true;
     }else{
        return false;
     }
 }

//分类替换下面的子级分类
function changeSunNumber($child,$data){
    if(is_array($child)){
        foreach($child as $key => $val){
            $save_number = $data['number'] . mb_substr($val['number'],strlen($val['number'])-3);
            M("type")->where(['id'=>$val['id']])->save(['number'=>$save_number]);
            if(is_array($val['child'])){
                changeSunNumber($val['child'],$data);
            }
        }
    }
}



//机构删除检验是否删除
function firm_exits_sun($firmId , $uid)
{
    $where = ['status'=>1,'id'=>$firmId,'userid'=>$uid];
    if(M('firm')->where($where)->find()){
        return ['status'=>false,'msg'=>'非机构创建者不能执行此操作','data'=>[]];
    }

    $exits = false;
    $all_table = ['firm_group'=>'部门','gro_user'=>'成员','modules_device'=>'设备'];

    foreach ($all_table as $k => $v)
    {
       $res = M($k)->where(['status' => 1 , 'firmid' => $firmId ])->find();
       if($res){
           return ['status'=>false,'msg'=>'请先删除' . $v ,'data'=>[]];
       }
        $exits = true;
    }

    if($exits){
        return ['status'=>$exits,'msg'=>'未发现其他子关联','data'=>[]];
    }

}

function exitstFirm(){
    if(!session('lastfirmid')){
        $this->ajaxReturn(['status'=>false, 'msg'=>'不存在机构', 'data'=>[]]) ;
    }
}

/**
 * 发送邮件
 * @param  string $address 需要发送的邮箱地址 发送给多个地址需要写成数组形式
 * @param  string $subject 标题
 * @param  string $content 内容
 * @return boolean       是否成功
 */
function sendEmail($address,$subject,$content){
    $email_smtp=C('EMAIL_SMTP');
    $email_username=C('EMAIL_USERNAME');
    $email_password=C('EMAIL_PASSWORD');
    $email_from_name=C('EMAIL_FROM_NAME');
    $email_smtp_secure=C('EMAIL_SMTP_SECURE');
    $email_port=C('EMAIL_PORT');
    if(empty($email_smtp) || empty($email_username) || empty($email_password) || empty($email_from_name)){
        return array("status"=>false,"msg"=>'邮箱配置不完整');
    }
    require_once './ThinkPHP/Library/Org/Nx/class.phpmailer.php';
    require_once './ThinkPHP/Library/Org/Nx/class.smtp.php';
    $phpmailer=new \Phpmailer();
    // 设置PHPMailer使用SMTP服务器发送Email
    $phpmailer->IsSMTP();
    // 设置设置smtp_secure
    $phpmailer->SMTPSecure=$email_smtp_secure;
    // 设置port
    $phpmailer->Port=$email_port;
    // 设置为html格式
    $phpmailer->IsHTML(true);
    // 设置邮件的字符编码'
    $phpmailer->CharSet='UTF-8';
    // 设置SMTP服务器。
    $phpmailer->Host=$email_smtp;
    // 设置为"需要验证"
    $phpmailer->SMTPAuth=true;
    // 设置用户名
    $phpmailer->Username=$email_username;
    // 设置密码
    $phpmailer->Password=$email_password;
    // 设置邮件头的From字段。
    $phpmailer->From=$email_username;
    // 设置发件人名字
    $phpmailer->FromName=$email_from_name;
    // 添加收件人地址，可以多次使用来添加多个收件人
    if(is_array($address)){
        foreach($address as $addressv){
            $phpmailer->AddAddress($addressv);
        }
    }else{
        $phpmailer->AddAddress($address);
    }
    // 设置邮件标题
    $phpmailer->Subject=$subject;
    // 设置邮件正文
    $phpmailer->Body=$content;
    // 发送邮件。
    if(!$phpmailer->Send()) {
        $phpmailererror=$phpmailer->ErrorInfo;
        return array("status"=>false,"message"=>$phpmailererror);
    }else{
        return array("status"=>true);
    }
}