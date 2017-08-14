<?php

namespace Think;

class Link_Redis
{
    protected $_host = '127.0.0.1';
    protected $_port = 6379;
    protected $_password = '';
    protected $_dbindex = 0;
    protected $_prefix = 0;

    protected $_auth = false;
    protected $_redis;
    protected $_redis_group_key = 'r_g_';
    protected $_server_id;
    protected $_redis_client = 'extension';

    /**
     * 是否需要登陆验证
     */
    protected $_need_password = false;

    /**
     * 不需要用服务器id
     */
    protected $_without_server_id = false;


    public function __construct()
    {
        $this->connect();
    }

    /**
     * 链接
     */
    public function connect()
    {
        $this->_redis = new Redis();
        $this->_redis->pconnect($this->_host, $this->_port);

        if ($this->_need_password) {
            $this->auth();
        }

    }

    public function __destruct()
    {
// 		if( !empty( $redis_config) )
// 		{
// 			if( !empty( $redis_config['single'] ))
// 			{
// 				if($redis_config['single']==1)
// 				{
// 					$this->getRedisObject()->close();
// 				}
// 			}
// 		}
    }
}