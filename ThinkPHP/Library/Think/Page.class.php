<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK IT ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 麦当苗儿 <zuojiazi@vip.qq.com> <http://www.zjzit.cn>
// +----------------------------------------------------------------------
namespace Think;

class Page{
    public $firstRow; // 起始行数
    public $listRows; // 列表每页显示行数
    public $parameter; // 分页跳转时要带的参数
    public $totalRows; // 总行数
    public $totalPages; // 分页总页面数 
    public $rollPage   = 5;// 分页栏每页显示的页数
	public $lastSuffix = true; // 最后一页是否显示总页数

    private $p       = 'p'; //分页参数名
    private $url     = ''; //当前链接URL
    private $nowPage = 1;

	// 分页显示定制
    private $config  = array(
        'header' => '<span class="rows">共 %TOTAL_ROW% 条记录</span>',
        'prev'   => '<<',
        'next'   => '>>',
        'first'  => '1...',
        'last'   => '...%TOTAL_PAGE%',
        'theme'  => '%FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%',
    );

    /**
     * 架构函数
     * @param array $totalRows  总的记录数
     * @param array $listRows  每页显示记录数
     * @param array $parameter  分页跳转的参数
     */
    public function __construct($totalRows, $listRows=20, $parameter = array()) {
        C('VAR_PAGE') && $this->p = C('VAR_PAGE'); //设置分页参数名称
        /* 基础设置 */
        $this->totalRows  = $totalRows; //设置总记录数
        $this->listRows   = $listRows;  //设置每页显示行数
        $this->parameter  = empty($parameter) ? $_GET : $parameter;
        $this->nowPage    = empty($_GET[$this->p]) ? 1 : intval($_GET[$this->p]);
        $this->nowPage    = $this->nowPage>0 ? $this->nowPage : 1;
        $this->firstRow   = $this->listRows * ($this->nowPage - 1);
    }

    /**
     * 定制分页链接设置
     * @param string $name  设置名称
     * @param string $value 设置值
     */
    public function setConfig($name,$value) {
        if(isset($this->config[$name])) {
            $this->config[$name] = $value;
        }
    }

    /**
     * 生成链接URL
     * @param  integer $page 页码
     * @return string
     */
    private function url($page){
        return str_replace(urlencode('[PAGE]'), $page, $this->url);
    }

    /**
     * 组装分页链接
     * @return string
     */
    public function show() {
        if(0 == $this->totalRows) return '';

        /* 生成URL */
        $this->parameter[$this->p] = '[PAGE]';
        $this->url = U(ACTION_NAME, $this->parameter);
        /* 计算分页信息 */
        $this->totalPages = ceil($this->totalRows / $this->listRows); //总页数
        if(!empty($this->totalPages) && $this->nowPage > $this->totalPages) {
            $this->nowPage = $this->totalPages;
        }

        /* 计算分页零时变量 */
        $now_cool_page      = $this->rollPage/2;
		$now_cool_page_ceil = ceil($now_cool_page);
		$this->lastSuffix && $this->config['last'] = $this->totalPages;

        //上一页
        $up_row  = $this->nowPage - 1;
        $up_page = $up_row > 0 ? '<a class="prev" href="' . $this->url($up_row) . '">' . $this->config['prev'] . '</a>' : '';

        //下一页
        $down_row  = $this->nowPage + 1;
        $down_page = ($down_row <= $this->totalPages) ? '<a class="next" href="' . $this->url($down_row) . '">' . $this->config['next'] . '</a>' : '';

        //第一页
        $the_first = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage - $now_cool_page) >= 1){
            $the_first = '<a class="first" href="' . $this->url(1) . '">' . $this->config['first'] . '</a>';
        }

        //最后一页
        $the_end = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage + $now_cool_page) < $this->totalPages){
            $the_end = '<a class="end" href="' . $this->url($this->totalPages) . '">' . $this->config['last'] . '</a>';
        }

        //数字连接
        $link_page = "";
        for($i = 1; $i <= $this->rollPage; $i++){
			if(($this->nowPage - $now_cool_page) <= 0 ){
				$page = $i;
			}elseif(($this->nowPage + $now_cool_page - 1) >= $this->totalPages){
				$page = $this->totalPages - $this->rollPage + $i;
			}else{
				$page = $this->nowPage - $now_cool_page_ceil + $i;
			}
            if($page > 0 && $page != $this->nowPage){

                if($page <= $this->totalPages){
                    $link_page .= '<a class="num" href="' . $this->url($page) . '">' . $page . '</a>';
                }else{
                    break;
                }
            }else{
                if($page > 0 && $this->totalPages != 1){
                    $link_page .= '<span class="current">' . $page . '</span>';
                }
            }
        }

        //替换分页内容
        $page_str = str_replace(
            array('%HEADER%', '%NOW_PAGE%', '%UP_PAGE%', '%DOWN_PAGE%', '%FIRST%', '%LINK_PAGE%', '%END%', '%TOTAL_ROW%', '%TOTAL_PAGE%'),
            array($this->config['header'], $this->nowPage, $up_page, $down_page, $the_first, $link_page, $the_end, $this->totalRows, $this->totalPages),
            $this->config['theme']);
        return "<div>{$page_str}</div>";
    }
    
    
    /**
     * 组装分页链接
     * @return string
     */
    public function showHomepagenav() {
        if(0 == $this->totalRows) return '';
    
        $this->setConfig("prev","<");
        $this->setConfig("next",">");
        $this->setConfig("first","<<");
        $this->setConfig("last",">>");
        
        /* 生成URL */
        $this->parameter[$this->p] = '[PAGE]';
        $this->url = U(ACTION_NAME, $this->parameter);
        /* 计算分页信息 */
        $this->totalPages = ceil($this->totalRows / $this->listRows); //总页数
        if(!empty($this->totalPages) && $this->nowPage > $this->totalPages) {
            $this->nowPage = $this->totalPages;
        }
    
        /* 计算分页零时变量 */
        $now_cool_page      = $this->rollPage/2;
        $now_cool_page_ceil = ceil($now_cool_page);
        $this->lastSuffix && $this->config['last'] = $this->totalPages;
    
        //上一页
        $up_row  = $this->nowPage - 1;
        $up_page = $up_row > 0 ? '<a class="link" href="' . $this->url($up_row) . '" page="'.$up_row.'">' . $this->config['prev'] . '</a>&nbsp;&nbsp;&nbsp;&nbsp;' : '';
    
        //下一页
        $down_row  = $this->nowPage + 1;
        $down_page = ($down_row <= $this->totalPages) ? '<a class="link" href="' . $this->url($down_row) . '"  page="'.$down_row.'">' . $this->config['next'] . '</a>&nbsp;&nbsp;&nbsp;&nbsp;' : '';
    
        //第一页
        $the_first = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage - $now_cool_page) >= 1){
            $the_first = '<a class="link" href="' . $this->url(1) . '"  page="1">' . $this->config['first'] . '</a>&nbsp;&nbsp;&nbsp;&nbsp;';
        }
    
        //最后一页
        $the_end = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage + $now_cool_page) < $this->totalPages){
            $the_end = '<a class="link" href="' . $this->url($this->totalPages) . '" page="'.$this->totalPages.'">' . $this->config['last'] . '</a>&nbsp;&nbsp;&nbsp;&nbsp;';
        }
    
        //数字连接
        $link_page = "";
        for($i = 1; $i <= $this->rollPage; $i++){
            if(($this->nowPage - $now_cool_page) <= 0 ){
                $page = $i;
            }elseif(($this->nowPage + $now_cool_page - 1) >= $this->totalPages){
                $page = $this->totalPages - $this->rollPage + $i;
            }else{
                $page = $this->nowPage - $now_cool_page_ceil + $i;
            }
            if($page > 0 && $page != $this->nowPage){
    
                if($page <= $this->totalPages){
                    $link_page .= '<a class="link" href="' . $this->url($page) . '" page="'.$page.'">' . $page . '</a>&nbsp;&nbsp;&nbsp;&nbsp;';
                }else{
                    break;
                }
            }else{
                if($page > 0 && $this->totalPages != 1){
                    $link_page .= '<a class="link current" href="' . $this->url($page) . '" page="'.$page.'">' . $page . '</a>&nbsp;&nbsp;&nbsp;&nbsp;';
                    //$link_page .= '<span class="current">' . $page . '</span>';
                }
            }
        }
        
        //替换分页内容
        $page_str = str_replace(
            array('%HEADER%', '%NOW_PAGE%', '%UP_PAGE%', '%DOWN_PAGE%', '%FIRST%', '%LINK_PAGE%', '%END%', '%TOTAL_ROW%', '%TOTAL_PAGE%'),
            array($this->config['header'], $this->nowPage, $up_page, $down_page, $the_first, $link_page, $the_end, $this->totalRows, $this->totalPages),
            $this->config['theme']);
        return "<div class='page-block1'>{$page_str}</div>";
    }
    
    
    
    
	
	/**
	 * 后台分页样式
	 */
	public function showOther()
	{
		
		$this->config['header'] = '<li><a class="rows">共 %TOTAL_ROW% 条记录</a></li>';

		if(0 == $this->totalRows) return '';

        /* 生成URL */
        $this->parameter[$this->p] = '[PAGE]';
        $this->url = U(ACTION_NAME, $this->parameter);
        /* 计算分页信息 */
        $this->totalPages = ceil($this->totalRows / $this->listRows); //总页数
        if(!empty($this->totalPages) && $this->nowPage > $this->totalPages) {
            $this->nowPage = $this->totalPages;
        }

        /* 计算分页零时变量 */
        $now_cool_page      = $this->rollPage/2;
		$now_cool_page_ceil = ceil($now_cool_page);
		$this->lastSuffix && $this->config['last'] = $this->totalPages;

        //上一页
        $up_row  = $this->nowPage - 1;
        $up_page = $up_row > 0 ? '<li class="prev"><a href="' . $this->url($up_row) . '">' . $this->config['prev'] . '</a>' : '';

        //下一页
        $down_row  = $this->nowPage + 1;
        $down_page = ($down_row <= $this->totalPages) ? '<li><a class="next" href="' . $this->url($down_row) . '">' . $this->config['next'] . '</a></li>' : '';

        //第一页
        $the_first = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage - $now_cool_page) >= 1){
            $the_first = '<li><a class="first" href="' . $this->url(1) . '">' . $this->config['first'] . '</a></li>';
        }

        //最后一页
        $the_end = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage + $now_cool_page) < $this->totalPages){
            $the_end = '<li><a class="end" href="' . $this->url($this->totalPages) . '">' . $this->config['last'] . '</a></li>';
        }

        //数字连接
        $link_page = "";
        for($i = 1; $i <= $this->rollPage; $i++){
			if(($this->nowPage - $now_cool_page) <= 0 ){
				$page = $i;
			}elseif(($this->nowPage + $now_cool_page - 1) >= $this->totalPages){
				$page = $this->totalPages - $this->rollPage + $i;
			}else{
				$page = $this->nowPage - $now_cool_page_ceil + $i;
			}
            if($page > 0 && $page != $this->nowPage){

                if($page <= $this->totalPages){
                    $link_page .= '<li><a href="' . $this->url($page) . '">' . $page . '</a></li>';
                }else{
                    break;
                }
            }else{
                if($page > 0 && $this->totalPages != 1){
                    $link_page .= '<li class="active"><a href="#">' . $page . '</a></li>';
                }
            }
        }

        //替换分页内容
        $page_str = str_replace(
            array('%HEADER%', '%NOW_PAGE%', '%UP_PAGE%', '%DOWN_PAGE%', '%FIRST%', '%LINK_PAGE%', '%END%', '%TOTAL_ROW%', '%TOTAL_PAGE%'),
            array($this->config['header'], $this->nowPage, $up_page, $down_page, $the_first, $link_page, $the_end, $this->totalRows, $this->totalPages),
            $this->config['theme']);
        return "<ul class='pagination pagination-sm m-0'>{$page_str}</ul>";
	}
	
	
	/**
	 * 后台课时资源添加分页样式
	 */
	public function showAjaxOther()
	{
		
		$this->config['header'] = '<li><a class="rows">共 %TOTAL_ROW% 条记录</a></li>';
		
		$this->config['first'] = 1;
		$this->config['last']  = $this->totalPages;
	
		
		if(0 == $this->totalRows) return '';

        /* 生成URL */
        $this->parameter[$this->p] = '[PAGE]';
        $this->url = U(ACTION_NAME, $this->parameter);
        /* 计算分页信息 */
        $this->totalPages = ceil($this->totalRows / $this->listRows); //总页数
        if(!empty($this->totalPages) && $this->nowPage > $this->totalPages) {
            $this->nowPage = $this->totalPages;
        }

        /* 计算分页零时变量 */
        $now_cool_page      = $this->rollPage/2;
		$now_cool_page_ceil = ceil($now_cool_page);
		$this->lastSuffix && $this->config['last'] = $this->totalPages;

        //上一页
        $up_row  = $this->nowPage - 1;
        $up_page = $up_row > 0 ? '<li class="prev"><a class="link j-page-btns" href="' . $this->url($up_row) . '">' . $this->config['prev'] . '</a>' : '';

        //下一页
        $down_row  = $this->nowPage + 1;
        $down_page = ($down_row <= $this->totalPages) ? '<li><a class="next link j-page-btns" href="' . $this->url($down_row) . '">' . $this->config['next'] . '</a></li>' : '';

        //第一页
        $the_first = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage - $now_cool_page) >= 1){
            $the_first = '<li><a class="first link j-page-btns" href="' . $this->url(1) . '">' . $this->config['first'] . '</a></li>';
        }

        //最后一页
        $the_end = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage + $now_cool_page) < $this->totalPages){
            $the_end = '<li><a class="end link j-page-btns" href="' . $this->url($this->totalPages) . '">' . $this->config['last'] . '</a></li>';
        }

        //数字连接
        $link_page = "";
        for($i = 1; $i <= $this->rollPage; $i++){
			if(($this->nowPage - $now_cool_page) <= 0 ){
				$page = $i;
			}elseif(($this->nowPage + $now_cool_page - 1) >= $this->totalPages){
				$page = $this->totalPages - $this->rollPage + $i;
			}else{
				$page = $this->nowPage - $now_cool_page_ceil + $i;
			}
            if($page > 0 && $page != $this->nowPage){

                if($page <= $this->totalPages){
                    $link_page .= '<li><a class="link j-page-btns" href="' . $this->url($page) . '">' . $page . '</a></li>';
                }else{
                    break;
                }
            }else{
                if($page > 0 && $this->totalPages != 1){
                    $link_page .= '<li><a href="javascript:;" class="link current">' . $page . '</a></li>';
                }
            }
        }

        //替换分页内容
        $page_str = str_replace(
            array('%HEADER%', '%NOW_PAGE%', '%UP_PAGE%', '%DOWN_PAGE%', '%FIRST%', '%LINK_PAGE%', '%END%', '%TOTAL_ROW%', '%TOTAL_PAGE%'),
            array($this->config['header'], $this->nowPage, $up_page, $down_page, $the_first, $link_page, $the_end, $this->totalRows, $this->totalPages),
            $this->config['theme']);
        return "{$page_str}";
	}
	
	/**
	 * 前台分页样式
	 */
	public function showHomePage()
	{
		$this->config['header'] = '';
		//$this->config['prev'] = '';
		//$this->config['next'] = '';
		//$this->config['header'] = '共有%TOTAL_ROW%记录，分%TOTAL_PAGE%页，当前页%NOW_PAGE%，每页显示'.$this->listRows.'条记录&nbsp;&nbsp;&nbsp;&nbsp;';
		$this->config['prev'] = '&nbsp;<span class="icon-img gray-chevron-left"></span>&nbsp';
		$this->config['next'] = '&nbsp;<span class="icon-img gray-chevron-right"></span>&nbsp';
		
		if(0 == $this->totalRows) return '';
		
        /* 生成URL */
        $this->parameter[$this->p] = '[PAGE]';
        $this->url = U(ACTION_NAME, $this->parameter);
        /* 计算分页信息 */
        $this->totalPages = ceil($this->totalRows / $this->listRows); //总页数
        if(!empty($this->totalPages) && $this->nowPage > $this->totalPages) {
            $this->nowPage = $this->totalPages;
        }
		
		if(1 == $this->totalPages) return '';

        /* 计算分页零时变量 */
        $now_cool_page      = $this->rollPage/2;
		$now_cool_page_ceil = ceil($now_cool_page);
		$this->lastSuffix && $this->config['last'] = $this->totalPages;

        //上一页
        $up_row  = $this->nowPage - 1;
        $up_page = $up_row > 0 ? '<li><a class="link" href="' . $this->url($up_row) . '" page="'.$up_row.'">' . $this->config['prev'] . '</a></li>' : '<li><a class="link">'.$this->config['prev'].'</a></li>';

        //下一页
        $down_row  = $this->nowPage + 1;
        $down_page = ($down_row <= $this->totalPages) ? '<li><a class="link" href="' . $this->url($down_row) . '"  page="'.$down_row.'">' . $this->config['next'] . '</a></li>' : '<li><a class="link">'.$this->config['next'].'</a></li>';

        //第一页
        $the_first = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage - $now_cool_page) >= 1){
            $the_first = '<li><a class="link" href="' . $this->url(1) . '" page="1">' . $this->config['first'] . '</a></li>';
        }

        //最后一页
        $the_end = '';
        if($this->totalPages > $this->rollPage && ($this->nowPage + $now_cool_page) < $this->totalPages){
            $the_end = '<li><a class="link" href="' . $this->url($this->totalPages) . '"  page="'.$this->totalPages.'">' . $this->config['last'] . '</a></li>';
        }

        //数字连接
        $link_page = "";
        for($i = 1; $i <= $this->rollPage; $i++){
			if(($this->nowPage - $now_cool_page) <= 0 ){
				$page = $i;
			}elseif(($this->nowPage + $now_cool_page - 1) >= $this->totalPages){
				$page = $this->totalPages - $this->rollPage + $i;
			}else{
				$page = $this->nowPage - $now_cool_page_ceil + $i;
			}
            if($page > 0 && $page != $this->nowPage){

                if($page <= $this->totalPages){
                    $link_page .= '<li><a class="link" href="' . $this->url($page) . '" page="'.$page.'">' . $page . '</a></li>';
                }else{
                    break;
                }
            }else{
                if($page > 0 && $this->totalPages != 1){
                    $link_page .= '<li class="current"><a class="link" href="javascript:;" page="'.$page.'">' . $page . '</a></li>';
                }
            }
        }

        //替换分页内容
        $page_str = str_replace(
            array('%HEADER%', '%NOW_PAGE%', '%UP_PAGE%', '%DOWN_PAGE%', '%FIRST%', '%LINK_PAGE%', '%END%', '%TOTAL_ROW%', '%TOTAL_PAGE%'),
            array($this->config['header'], $this->nowPage, $up_page, $down_page, $the_first, $link_page, $the_end, $this->totalRows, $this->totalPages),
            $this->config['theme']);
        return "{$page_str}";
	}
	
	
	
	
}
