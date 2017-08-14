<?php

/**
 * @author            operl
 * @date              2015-06-19
 * @time              10:43
 * @description       邮件发送接口 
 * @email             cmlq@qq.com
 */

namespace Common\Api;
use Think\Controller;

class MailApi extends Controller{
	
	/**
	 * 发送邮件  队列发送
	 * @param  array    $data   相应的参数，用于替换模板
	 * @param  string   $type   邮件类型  对应于模板名称
	 * @param  string   $mail   接收地址
     * @return bool
	 */
	public function send($data ,$type ,$mail)
	{
		//获取邮件内容
		$content = $this->data($data, $type);
		 $subject  = "";

        if(!$content || !$subject)return false;

		//邮件队列
		C('HTTPSQS_HOST', '112.124.13.181');
		C('HTTPSQS_AUTH', 'midas2016');
		
		$arr    = array(C('WEB_SITE'), $mail, $subject, $content);
		$status = queue_execute('maillist', json_encode($arr));
		if($status){
			$data['uid'] = ($data['uid'])?$data['uid']:0;
			M('MailsmsLog')->add(array('user_id'=>$data['uid'], 'log_type'=>'mail' ,'type'=>$type, 'to'=>$mail, 'created_time'=>NOW_TIME));	
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
			$logo    = 'http://'.$_SERVER['HTTP_HOST'].C('WEB_LOG');
			$find    = array('<{data_code}>', '<{domain}>','<{logo}>', '<{time}>', '<{web_title}>', '<{email}>');
			$replace = array($data['code'], $_SERVER['HTTP_HOST'], $logo, date('Y-m-d'), C('WEB_SITE'), $data['email']);
			$str = str_replace($find, $replace, $str);
		}
		return $str;
	}
	
	
	/**
	 * 根据相应类型 返回对应模板内容
	 * @param  array    $data   相应的参数，用于替换模板
	 * @param  string   $type   邮件类型  对应于模板名称
	 * @return string           渲染后的内容
	 */
	public function templet($data, $type)
	{
        //日志提醒
        C("DEFAULT_THEME","default");
		$this->assign('data', $data);
		$content = $this->fetch('Common@Mail:'.$type);
		return $content;
	}
	
	/**
	 * 获取相应的标题
	 */
	public function subject($type)
	{

        $arr   = L('email');
        $title = $arr[$type];
        if(empty($title))$title = '';
        //日志提醒
		return $title;
	}
	
}

?>