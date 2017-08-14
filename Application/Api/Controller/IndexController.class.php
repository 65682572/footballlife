<?php
namespace Api\Controller;
use Think\Controller;
ob_start();

class IndexController extends Controller{
    private static $cfg = [];

    /**
     * 错误码
     * @var array
     */
    public static $errorCodes = [
        // 通用错误
        200 => '没有错误',
        201 => '账户或者密码错误',
        202 => '重复性操作',
        203 => '需要验证码',
        500 => '参数不足',
        501 => '调用类或方法不存在',
        502 => '不支持的输出格式',
        503 => '没有设备ID',
        504 => '未知错误码',
        510 => '不存在的APP',
        511 => '错误的APP key',
        512 => '错误的APP Sign',
        513 => '客户端时间不正确',
        514 => '登录信息已失效，请到"设置"页面退出登录后重新登录'
    ];

    public function __construct()
    {
        $cfg = C("APPID");
        if (empty($cfg)){
            $this->outError(500);
        }
        self::$cfg = C("APPID");
    }

    /**
     * 主程序入口
     */
    public function index()
    {
        $clienttime = I('time', '', 'int');   //客户端时间戳
        $appid = I('appid');  //appid
        $method = I('method'); //函数名称
        $api_key = I('appkey'); //秘钥
        $appsign = I('appsign'); //签名
        $uuid = I('uuid');//设备ID

        if (empty($uuid) && $appid != WEB_LINK_APPID){
            $this->outError(503);
        }

        if (!in_array($appid, [IPHONE_LINK_APPID, ANDROID_LINK_APPID, WEB_LINK_APPID])){
            $this->outError(510);
        }

        $server_time = $_SERVER['REQUEST_TIME'];
        $diff_time = $server_time - $clienttime;
        if (abs($diff_time) >= 600){
            $this->outError(513);
        }

        //支持get和post
        $params = $_GET;
        $params_p = $_POST;
        $params = array_merge((array)$params, (array)$params_p);

        if ($api_key != self::$cfg[$appid]['key']){
            $this->outError(511);
        }

        unset($params['appsign']);
        $tmp_sign = self::_genBaseString($params, self::$cfg[$appid]['secret']);
        if ($tmp_sign != $appsign){
            $this->outError(512);
        }

        if (empty($method)){
            $this->outError(501);
        }

        list($module, $action) = explode(".", $method);
        $module = ucfirst($module);

        $filename = dirname(dirname(__FILE__)) .  "/Model/{$module}Model.class.php";
        if (!file_exists($filename)){
            $this->outError(501);
        }

        require_once($filename);
        if (!method_exists("\\Api\\Model\\{$module}Model", $action)){
            $this->outError(501);
        }

        $module = "\\Api\\Model\\{$module}Model";
        $ret = $module::$action();

        if ($ret['status'] === false || ($ret['status'] != 200 && $ret['status'] !== true)){
            $code = $ret['status'] === false ? 504 : $ret['status'];
            $this->outError($code, $ret['msg']['errormsg']);
        }

        $this->output(['status' => 200, 'result' => $ret['msg']]);
    }

    /**
     * 生成待签名的字符串
     *
     * @param array $params API调用的请求参数集合的关联数组，不包含sign参数
     * @param string $secret 密钥
     * @return string 返回待签名的字符串
     */
    private static function _genBaseString($params, $secret)
    {
        $str = '';

        ksort($params); // 字典序升序进行排序
        foreach ($params as $k => $v) {
            $str .= "$k=$v";
        }

        $str .= $secret;
        $str = md5($str);

        return $str;
    }

    /**
     * 错误输出
     *
     * @ignore
     * @access proteced
     * @param Integer $errorCode 错误状态码
     * @param array $extData 附加的错误信息
     */
    public function outError($errorCode, $errmsg = '')
    {
        /** 清理输出缓冲 */
        static::_clearOutputBuffer();

        if (!isset(self::$errorCodes[$errorCode]))
            return $this->outError(504);
        else{
            $errorMsg = self::$errorCodes[$errorCode];
        }

        if (!empty($errmsg)){
            $errorMsg = $errmsg;
        }

        $arr_json = [];
        $arr_json['status'] = $errorCode;
        $arr_json['result']['errormsg'] = $errorMsg;

        $result = [
            'status' => $arr_json['status'],
            'result' => $arr_json['result']
        ];

        header('Content-type: application/json');
        if (strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false){
            ob_start ("ob_gzhandler");
        }
        exit(json_encode($result));
    }

    /**
     *
     * 响应输出函数
     * @access proteced
     * @param array $result  API调用返回结果 格式统一为 array('status'=> status code , "result" => array(....))
     */
    public static function output($result)
    {
        /** 清理输出缓冲 */
        static::_clearOutputBuffer();

        header('Content-type: application/json');
        if (strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false)
        {
            ob_start ("ob_gzhandler");
        }

        $data = json_encode($result, JSON_UNESCAPED_UNICODE);
        exit($data);
    }

    /**
     * 错误返回结果
     * @param  mixed  $err_msg   错误消息
     * @param  mixed  $err_code  错误代码
     * @return  array
     **/
    protected static function _errorResult($err_msg,$err_code=201)
    {
        return array(
            'status' => $err_code,
            'result' => array('errormsg' => $err_msg)
        );
    }

    /**
     * 正常返回结果
     * @param  mixed  $data  返回数据
     * @param  mixed  $status_code  状态代码
     * @return  array
     **/
    protected static function _result($data,$status_code=200)
    {
        return array(
            'status' => $status_code,
            'result' => $data
        );
    }

    /**
     * 清理输出缓冲区
     *     index.php 入口有ob_start, 用于截取结果输出前的错误信息
     *     PC端会照常输出, 手机UA访问时不输出
     **/
    protected static function _clearOutputBuffer()
    {
        $err_txt = ob_get_clean();
        $ua = ( isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '');
        if (!empty($err_txt) && preg_match('/MSIE|Maxthon|Firefox|Opera|Safari|Chrome/is',$ua)) {
            echo $err_txt;
        }
    }
}