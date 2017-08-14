<?php
namespace Home\Model;
use Think\Cache;

/**
 *
 *
 * 计数器
 *
 *
 * @package Shake\Model
 * @since 2016-04-29
 *
 * @author xinjie <xinjie110120@163.com>
 * $Id$
 *
 */
class Captcha extends Securimage{
    private $redis;
    private $redis_key;

    const REDIS_DB_INDEX = 0;
    const REDIS_KEY_PREFIX = 'API_CAPTCHA_CODE_';

    public function __construct($key)
    {
        global $app;
        $this->app = $app;
        $this->redis = Cache::getInstance('Redis');
        $this->redis_key = self::REDIS_KEY_PREFIX . $key;

        parent::__construct();
        $this->namespace = 'LinkLogin';
    }

    /**
     *
     * @overide
     *
     */
    protected function saveData()
    {
        $this->redis->set($this->redis_key, $this->code, 600);
    }

    /**
     *
     * @overide
     *
     */
    protected function getCode()
    {
        $result = $this->redis->get($this->redis_key);
        empty($result) && $result = '';
        return $result;
    }

    /**
     * 检查验证码
     */
    public function check_code($code)
    {
        $result = $this->check($code);
        $this->redis->delete($this->redis_key);
        return $result;
    }

    /**
     * 输出图片
     */
    public function output_image()
    {
        $this->image_width = 214;
        $this->image_height = 60;
        $this->text_scale = 0.6; //字体比例

        $this->show();
    }
}