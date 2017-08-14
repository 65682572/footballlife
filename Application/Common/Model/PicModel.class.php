<?php
namespace Common\Model;
use Think\Model;
class PicModel extends Model
{
	protected $autoCheckFields = false;
	
	//缓存 KEY
    const MC_PIC_INFO = 'PICTURE_INFO_ID_%s';
	
	//缓存 KEY  自由资源 课程 阅读
    const MC_FREEFILES_INFO = 'FREE_FILES_INFO_ID_%s';

	/**
	 * 获取图片路劲
	 * @param in  $id  主键ID
	 * @return string
	 */
	public static function get($id, $field = 'filepath')
	{
		
		$id = intval($id);
		if(!$id)return false;
		
		$info = self::getInfo($id);
	
		$filepath = '';
		if($info)$filepath = $info['filepath'];
		
		return $filepath;
	}
	
	/**
	 * 获取图片相关信息
	 * @param  in  $id  主键ID
	 * @return array
	 */
	public static function getInfo($id)
	{
		$id = intval($id);
		if(!$id)return false;
		
		$key  = sprintf(self::MC_PIC_INFO, $id);
		$info = S($key);
		
		if($info && !I('cache_off'))return $info;
		
		$info = D("Picture")->find($id);
		if($info){
			$info['filepath'] = add_img_host($info['filepath']);
			S($key, $info, 600);
		}
		return $info;
	}
	
	
	/**
	 * 获取自由图片路劲
	 * @param in  $id  主键ID
	 * @return string
	 */
	public static function getFree($id, $field = 'filepath')
	{
		
		$id = intval($id);
		if(!$id)return false;
		
		$info = self::getFreeInfo($id);
	
		$filepath = '';
		if($info)$filepath = $info['filepath'];
		
		return $filepath;
	}
	
	/**
	 * 获取自由图片相关信息
	 * @param  in  $id  主键ID
	 * @return array
	 */
	public static function getFreeInfo($id)
	{
		$id = intval($id);
		if(!$id)return false;
		
		$key  = sprintf(self::MC_FREEFILES_INFO, $id);
		$info = S($key);
		
		if($info && !I('cache_off'))return $info;
		
		$info = D("Admin/CourseFreeFiles")->find($id);
		if($info){
			$info['filepath'] = add_img_host($info['filepath']);
			S($key, $info, 600);
		}
		return $info;
	}
}