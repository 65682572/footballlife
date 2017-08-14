<?php
/**
 * 上传附件和上传视频
 * User: Jinqn
 * Date: 14-04-09
 * Time: 上午10:17
 */
include "Uploader.class.php";
$basedir = dirname(dirname(dirname(dirname(dirname(__FILE__)))));
$basedir = str_replace("\\", "/",$basedir);
$conf_dir = $basedir."/Application/Common/Conf/";                     //    公共文件夹配置路径
$upload_config = include($conf_dir."upload.php");
$ftp_config    = $upload_config["UPLOAD_FTP_CONFIG"];     //ftp  上传配置
$editor_driver = $upload_config["EDITOR_UPLOAD_DRIVER"];

/* 上传配置 */
$base64 = "upload";
switch (htmlspecialchars($_GET['action'])) {
    case 'uploadimage':
        $config = array(
            "pathFormat" => $CONFIG['imagePathFormat'],
            "maxSize" => $CONFIG['imageMaxSize'],
            "allowFiles" => $CONFIG['imageAllowFiles'],
			"ftp_config" => $ftp_config,
        );
        $fieldName = $CONFIG['imageFieldName'];
		$base64 = strtolower($editor_driver) === "ftp"? "ftp_upload":"upload";
        break;
    case 'uploadscrawl':
        $config = array(
            "pathFormat" => $CONFIG['scrawlPathFormat'],
            "maxSize" => $CONFIG['scrawlMaxSize'],
            "allowFiles" => $CONFIG['scrawlAllowFiles'],
            "oriName" => "scrawl.png"
        );
        $fieldName = $CONFIG['scrawlFieldName'];
        $base64 = "base64";
        break;
    case 'uploadvideo':
        $config = array(
            "pathFormat" => $CONFIG['videoPathFormat'],
            "maxSize" => $CONFIG['videoMaxSize'],
            "allowFiles" => $CONFIG['videoAllowFiles']
        );
        $fieldName = $CONFIG['videoFieldName'];
        $base64 = strtolower($editor_driver) === "ftp"? "ftp_upload":"upload";
        break;
    case 'uploadfile':
        $config = array(
            "pathFormat" => $CONFIG['filePathFormat'],
            "maxSize" => $CONFIG['fileMaxSize'],
            "allowFiles" => $CONFIG['fileAllowFiles'],
            "ftp_config" => $ftp_config,
        );
        $fieldName = $CONFIG['fileFieldName'];
        $base64 = strtolower($editor_driver) === "ftp"? "ftp_upload":"upload";
        break;
    default:
        $config = array(
            "pathFormat" => $CONFIG['filePathFormat'],
            "maxSize" => $CONFIG['fileMaxSize'],
            "allowFiles" => $CONFIG['fileAllowFiles']
        );
        $fieldName = $CONFIG['fileFieldName'];
        break;
}


/* 生成上传实例对象并完成上传 */
$up = new Uploader($fieldName, $config, $base64 );



/**
 * 得到上传文件所对应的各个参数,数组结构
 * array(
 *     "state" => "",          //上传状态，上传成功时必须返回"SUCCESS"
 *     "url" => "",            //返回的地址
 *     "title" => "",          //新文件名
 *     "original" => "",       //原始文件名
 *     "type" => ""            //文件类型
 *     "size" => "",           //文件大小
 * )
 */

/* 返回数据 */
return json_encode($up->getFileInfo());
