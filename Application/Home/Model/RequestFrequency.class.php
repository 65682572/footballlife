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
class RequestFrequency{
    private $redis;
    private $key;
    private $limit_times;
    private $limit_period;

    const REDIS_DB_INDEX = 0;
    const REDIS_KEY_PREFIX = 'API_REQUEST_FREQ_';

    public function __construct($key, $limit_times, $limit_period)
    {
        $this->redis =  Cache::getInstance('Redis');
        $this->key = self::REDIS_KEY_PREFIX . $key;
        $this->limit_times = (int)$limit_times;
        $this->limit_period = (int)$limit_period;
    }

    /**
     * 访问次数加1
     */
    public function record()
    {
        if ($this->redis->exists($this->key))
        {
            $this->redis->incr($this->key);
        }
        else
        {
           $this->redis->set($this->key, 1, $this->limit_period);
        }
    }

    /**
     * 判断访问是否受频次限制
     */
    public function limited()
    {
        $times = (int)$this->redis->get($this->key);
        return $times >= $this->limit_times;
    }
}