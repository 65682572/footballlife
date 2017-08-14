<?php
namespace Home\Widget;
use Think\Controller;

class PictureUploadWidget extends Controller {
    
    
    /**   
     $param["btn_name"]     = "haibao";                    //上传按钮名称
     $param["upload_name"]  = "image";                     //表单提交name值
     $param["model"]        = "ExpertIntroduce";           //存储图片id字符串的模型类
     $param["field"]        = "image";                     //存储图片id字符串的字段名称
     $param["item_id"]      = "1" ;                        //存储图片id字符串的模型类的id
     $param["size"]         = "300*300";                   //图片大小
     $param["css_width"]    = "3";                         //设置表单宽度
     $param["css_width_right"] = "9";                       //设置表单右侧的样式 默认是9
      $param['p_key']                                        //主键
     $param["img_mark_name"]= "方案介绍图片"                   //标示上传图片的名称      */
    
    
    /**
     * 由 PICTURE_UPLOAD 上传单张图片
     */
    public function uploadOneByPicture($param)
    {
        //获取图片字符串
        $img_str = '';
        if(intval($param["item_id"])>0){
            if($param['p_key']){
                $img_str  = M($param["model"],"","DB_CONFIG_LINK")->where($param['p_key']."=".intval($param["item_id"]))->getField($param["field"]);
            }else{
                $img_str  = M($param["model"],"","DB_CONFIG_LINK")->where("id=".intval($param["item_id"]))->getField($param["field"]);
            }
        }
      
        $imginfo = [];
        if($img_str!== ""  && intval($img_str)>0){
           $imginfo["id"] = $img_str;
           $imginfo["filepath"] =  D("Picture")->where("id=".$img_str)->getField("filepath");
        }
        $param["img_str"]  =  $img_str;
        $this->assign("imginfo",$imginfo);
        $this->assign("param",$param);

        $this->display("UploadTemplate/uploadone");
    }

    /**
     * 由 PICTURE_UPLOAD 上传多张图片
     */
    public function uploadMoreByPicture($param)
    {
        //获取图片字符串
        $img_str = '';
        if($param["item_id"]>0){
            if($param['p_key']){
                $img_str  = D($param["model"])->where($param['p_key']."=".intval($param["item_id"]))->getField($param["field"]);
            }else{
                $img_str  = D($param["model"])->where("id=".intval($param["item_id"]))->getField($param["field"]);
            }
        }

        $imglist = [];
        if($img_str !=""){
            $temp_arr = str2arr($img_str);
            foreach($temp_arr as $key =>$val){
                $imglist[$key]["id"]        = $val;
                $imglist[$key]["filepath"]  = D("Picture")->where("id=".$val)->getField("filepath");
            }

        }
        $param["img_str"]  =  $img_str;
        $this->assign("imglist",$imglist);
        $this->assign("param",$param);
        $this->display("UploadTemplate/uploadmore");
    }
}