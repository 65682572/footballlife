<?php
namespace Common\Api;
use Think\Controller;

class SmsApi extends Controller{
	
	/**
	 * 发送短信  队列发送
	 * @param  array    $data   相应的参数，用于替换模板
	 * @param  string   $type   短信类型  对应于模板
	 * @param  string   $mail   接收地址
	 */
	public function send($data ,$type ,$mobile)
	{
	    C("DEFAULT_THEME","default");

		//获取短信内容
		$content = $this->data($data, $type);
		if(!$content)return false;

		//追加短信签名
		$content.= C('SMS_SIGN');
		
		//短信队列
		C('HTTPSQS_HOST', '');//todo
		C('HTTPSQS_AUTH', '');//todo
		
		$arr    = array($mobile, $content);
		$status = queue_execute('smslist', json_encode($arr));
		if($status){
			$data['uid'] = ($data['uid'])?$data['uid']:0;
			M('MailsmsLog','','DB_CONFIG_LINK')->add(array('user_id'=>$data['uid'], 'log_type'=>'sms' ,'type'=>$type, 'to'=>$mobile, 'created_time'=>NOW_TIME));
		}
		return $status;
	}
	
	/**
	 * 根据相应类型 返回对应模板内容  取数据库模版
	 * @param  array    $data   相应的参数，用于替换模板
	 * @param  string   $type   邮件类型  对应于模板名称
	 * @return string           渲染后的内容
	 */
	public function data($data, $type)
	{
		$str     = '';
		$content = D('ContentManage');
		$info    = $content->where("content_title= '".$type."'")->find();
		if($info){
			$str     = $info['content'];
			$find    = array('<{code}>');
			$replace = array($data['code']);
			$str = str_replace($find, $replace, $str);
		}
		return $str;
	}
	
	
	/**
	 * 根据相应类型 返回对应模板内容
	 * @param  array    $data   相应的参数，用于替换模板
	 * @param  string   $type   短信类型  对应于模板名称
	 * @return string           渲染后的内容
	 */
	public function templet($data, $type)
	{
        /**
         * 可以考虑 语言配置 使用L调用  只需要在zh-cn.php 配置
         * L('FILE_FORMAT', array('format' => 'jpeg,png,gif,jpg','maximum' => '2MB'))
         */
		$this->assign($data);
		$content = $this->fetch('Common@Sms:'.$type);
		return $content;
	}
	
}

?>