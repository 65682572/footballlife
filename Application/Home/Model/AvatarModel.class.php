<?php
namespace Home\Model;
use Think\Model;
use Think\Upload;
use Think\Image;

/**
 *
 *
 * 上传头像
 *
 *
 * @package Shake\Model
 * @since 2016-04-29
 *
 * @author xinjie <xinjie110120@163.com>
 * $Id$
 *
 */
class AvatarModel extends Model{

    /* 图片上传相关配置 */
    public static $_config_ = [
        'AVATAR_UPLOAD' => [
            'mimes' => '',//允许上传的文件MiMe类型
            'maxSize' => 3145728,//上传的文件大小限制 3*1024*1024
            'exts' => 'jpg,gif,png,jpeg',//上传的文件类型限制
            'autoSub' => true,//自动子目录保存文件
            'subName' => ['date', 'Y/md'],//子目录创建方式，[0]-函数名，[1]-参数，多个参数使用数组
            'rootPath' => './Uploads',//保存根路径
            'savePath' => '/avatar/',//保存路径
            'saveName' => ['uniqid', ''],//上传文件命名规则，[0]-函数名，[1]-参数，多个参数使用数组
            'saveExt' => '',//文件保存后缀，空则使用原后缀
            'replace' => false,//存在同名是否覆盖
            'hash' => true,//是否生成hash编码
            'callback' => false//检测文件是否存在回调函数，如果存在返回文件信息数组
        ],
        'MAP_UPLOAD' => [
            'mimes' => '',//允许上传的文件MiMe类型
            'maxSize' => 104857600,//上传的文件大小限制 100*1024*1024
            'exts' => 'jpg,gif,png,jpeg',//上传的文件类型限制
            'autoSub' => true,//自动子目录保存文件
            'subName' => ['date', 'Y/md'],//子目录创建方式，[0]-函数名，[1]-参数，多个参数使用数组
            'rootPath' => './Uploads',//保存根路径
            'savePath' => '/map/',//保存路径
            'saveName' => ['uniqid', ''],//上传文件命名规则，[0]-函数名，[1]-参数，多个参数使用数组
            'saveExt' => '',//文件保存后缀，空则使用原后缀
            'replace' => false,//存在同名是否覆盖
            'hash' => true,//是否生成hash编码
            'callback' => false//检测文件是否存在回调函数，如果存在返回文件信息数组
        ],
        'FILE_UPLOAD' => [
            'mimes' => '',//允许上传的文件MiMe类型
            'maxSize' => 104857600,//上传的文件大小限制 100*1024*1024
            'exts' => 'csv,xls,xlsx',//上传的文件类型限制
            'autoSub' => true,//自动子目录保存文件
            'subName' => ['date', 'Y/md'],//子目录创建方式，[0]-函数名，[1]-参数，多个参数使用数组
            'rootPath' => './Uploads',//保存根路径
            'savePath' => '/file/',//保存路径
            'saveName' => ['uniqid', ''],//上传文件命名规则，[0]-函数名，[1]-参数，多个参数使用数组
            'saveExt' => '',//文件保存后缀，空则使用原后缀
            'replace' => false,//存在同名是否覆盖
            'hash' => true,//是否生成hash编码
            'callback' => false//检测文件是否存在回调函数，如果存在返回文件信息数组
        ]
    ];
    /**
     * 二进制图片上传
     * @param $files
     * @param $setting
     * @param string $driver
     * @param null $config
     * @param $userid
     * @return bool|string
     */
    public function uploadStream($files, $setting, $driver = 'Local', $config = null, $userid)
    {
        if ($userid < 1){
            return false;
        }

        /* 上传文件 */
        $setting['removeTrash'] = [$this, 'removeTrash'];
        $Upload = new Upload($setting, $driver, $config);
        $info = $Upload->uploadStream($files);

        if (!$info){
            return false;
        }

        //头像进入数据库
        $obj = M('UserAvatar','','DB_CONFIG_LINK');
        $ret = $obj->where(['userid'=>['eq', $userid]])->find();
        if (empty($ret)){
            $info['userid'] = $userid;
            $info['createtime'] = time();
            $obj->add($info);
        }else{
            $obj->where(['userid'=>['eq', $userid]])->save($info);
        }

        return $info['path'] . $info['avatarname'];
    }

    /**
     * 二进制图片上传电子地图
     * @param $files
     * @param $setting
     * @param string $driver
     * @param null $config
     * @param $userid
     * @param string $name
     * @return bool|string
     */
    public function uploadStreamMap($files, $setting, $driver = 'Local', $config = null, $userid, $name = '')
    {
        if ($userid < 1){
            return false;
        }

        /* 上传文件 */
        $setting['removeTrash'] = [$this, 'removeTrash'];
        $Upload = new Upload($setting, $driver, $config);
        $info = $Upload->uploadStream($files, $name);

        if (!$info){
            return false;
        }

        return $info['path'] . $info['avatarname'];
    }

    /**
     * 文件上传
     * @param  array  $files   要上传的文件列表（通常是$_FILES数组）
     * @param  array  $setting 文件上传配置
     * @param  string $driver  上传驱动名称
     * @param  array  $config  上传驱动配置
     * @return array           文件上传成功后的信息
     */
    public function upload($files, $setting, $driver = 'Local', $config = null, $userid){
        /* 上传文件 */
        $setting['removeTrash'] = [$this, 'removeTrash'];
        $Upload = new Upload($setting, $driver, $config);
        $info   = $Upload->upload($files);

        //缩略图
        $image  = new Image();

        if($info){ //文件上传成功，记录文件信息
            $db_obj =  M('Avatar','','DB_CONFIG_LINK');
            foreach ($info as $key => &$value) {
                /* 已经存在文件记录 */
                if(isset($value['id']) && is_numeric($value['id'])){
                    continue;
                }
                /* 记录文件信息 */
                $value['filepath'] = substr($setting['rootPath'], 1).$value['savepath'];	//在模板里的url路径
                $value['userid']  = $userid;
                $value['original_name'] = $value['savename'];

                $nameArr = explode('.',$value['savename']);
                $rootPath = substr($setting['rootPath'], 1).$value['savepath'];

                $header_80 = $nameArr[0].'_80.'.$nameArr[1];
                $header_60 = $nameArr[0].'_60.'.$nameArr[1];
                $header_40 = $nameArr[0].'_40.'.$nameArr[1];
                $header_20 = $nameArr[0].'_20.'.$nameArr[1];
                $image->open('.'.$value['filepath'].$value['savename']);

                $image->thumb(80, 80)->save('./'.$rootPath.$header_80, NULL, 100);
                $image->thumb(60, 60)->save('./'.$rootPath.$header_60, NULL, 100);
                $image->thumb(40, 40)->save('./'.$rootPath.$header_40, NULL, 100);
                $image->thumb(20, 20)->save('./'.$rootPath.$header_20, NULL, 100);

                //ftp上传图片
                if(strtolower(C('AVATAR_UPLOAD_DRIVER')) == "ftp"){
                    $config_host =   C('UPLOAD_FTP_CONFIG');
                    $config_path =   $setting;
                    $config      =   array_merge($config_host,$config_path);
                    $ftpUploader  = new \Think\Upload\Driver\Ftp($config);
                    /* 检测上传根目录 */
                    if(!$ftpUploader->checkRootPath($config["rootPath"])){
                        $this->error = $ftpUploader->getError();
                    }
                    /* 检查上传目录 */
                    if(!$ftpUploader->checkSavePath($value['savepath'])){
                        $this->error = $ftpUploader->getError();
                    }
                    $file_arr = array(
                        //原始图片
                        array(
                            "savepath"=>$value['savepath'],
                            "savename"=>$value["savename"],
                            "tmp_name"=>'.'.$value['filepath'].$value['savename']
                        ),
                        //80
                        array(
                            "savepath"=>$value['savepath'],
                            "savename"=>$header_80,
                            "tmp_name"=>'./'.$rootPath.$header_80
                        ),
                        array(
                            "savepath"=>$value['savepath'],
                            "savename"=>$header_60,
                            "tmp_name"=>'./'.$rootPath.$header_60
                        ),

                        array(
                            "savepath"=>$value['savepath'],
                            "savename"=>$header_40,
                            "tmp_name"=>'./'.$rootPath.$header_40
                        ),
                        array(
                            "savepath"=>$value['savepath'],
                            "savename"=>$header_20,
                            "tmp_name"=>'./'.$rootPath.$header_20
                        )
                    );
                    foreach($file_arr as $v){
                        if($ftpUploader->save($v)){
                            unlink($v["tmp_name"]);
                        }
                    }
                }

                $value['avatar_name'] = $header_80.'|'.$header_60.'|'.$header_40.'|'.$header_20;
                $isEx = $db_obj->field('id')->where('userid='.$userid)->find();
                if( $db_obj->create($value)){
                    if($isEx){
                        $id = $db_obj->where('id='.$isEx['id'])->save($value);
                    }else{
                        $id = $db_obj->add();
                    }
                    $value['id'] = $id;
                } else {
                    unset($info[$key]);
                }
            }
            return ['status' => true, 'msg' => $info]; //文件上传成功
        } else {
            $this->error = $Upload->getError();
            \Think\Log::write($this->error,'WARN');

            return ['status' => false, 'msg' => $this->error];
        }
    }

    //头像上传(base64方式)
    public function base64Avatar($img,$uid){
        $imgname = time().'.jpg';
        $setting = self::$_config_['AVATAR_UPLOAD'];
        $subpath = date('Y').'/'.date('md').'/';
        $savepath = $setting['rootPath'].$setting['savePath'].$subpath;
        if(!file_exists($savepath)) {
            mkdir($savepath, 0777);
        }
        $imginfo = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $img));
        $n = file_put_contents($savepath.$imgname, $imginfo);
        if($n <= 0 || !$uid){
            unlink($savepath.$imgname);
            return ['status' => false,'msg' => '数据格式错误！'];
        }else{
            $thumb = self::createThumb($savepath,$imgname);
            $adata = [
                'userid' => $uid,
                'filepath' => substr($savepath,1),
                'original_name' => $imgname,
                'ext' => 'jpg',
                // 'size' => '',
                // 'md5' => '',
                // 'sha1' => '',
                'created_time' => time(),
            ];
            $adata['avatar_name'] = implode('|',$thumb);
            $res = $this->saveAvatar($adata);
            $rt = ['status' => false, 'msg' => '上传失败！'];
            if(!$res){
                return $rt;
            }elseif($res === true){
                return ['status' => true, 'msg' => '上传成功！'];
            }else{
                $rt['msg'] = $res;
                return $rt;
            }
        }

    }

    //保存头像
    public function saveAvatar($data){
        if(empty($data)) return false;
        $db_obj = M('avatar');
        $isEx = $db_obj->field('id')->where('userid='.$data['userid'])->find();
        if( $db_obj->create($data)){
            try{
            if($isEx){
                $db_obj->where('id='.$isEx['id'])->save($data);
            }else{
                $db_obj->add();
            }
            }catch(\Think\Exception $e){
                $error = $e->getMessage();
                return $error;
            }
            return true;
        } else {
           return false;
        }
    }
    //生成缩略图
    public static function createThumb($savepath,$imgname){
        if(!$savepath || !$imgname) return false;
        //缩略图
        $image  = new Image();
        $nameArr = explode('.',$imgname);
        $header_80 = $nameArr[0].'_80.'.$nameArr[1];
        $header_60 = $nameArr[0].'_60.'.$nameArr[1];
        $header_40 = $nameArr[0].'_40.'.$nameArr[1];
        $header_20 = $nameArr[0].'_20.'.$nameArr[1];
        $image->open($savepath.$imgname);
        $image->thumb(80, 80)->save($savepath.$header_80, NULL, 100);
        $image->thumb(60, 60)->save($savepath.$header_60, NULL, 100);
        $image->thumb(40, 40)->save($savepath.$header_40, NULL, 100);
        $image->thumb(20, 20)->save($savepath.$header_20, NULL, 100);
        return [$header_80,$header_60,$header_40,$header_20];
    }

    public function uploadFile($files, $setting, $driver = 'Local', $config = null, $userid){
        /* 上传文件 */
        $setting['removeTrash'] = [$this, 'removeTrash'];
        $Upload = new Upload($setting, $driver, $config);
        return $Upload->uploadFile($files);
    }


    /**
     * 删除
     * @param $data
     */
    public function removeTrash($data)
    {
        M('Avatar','','DB_CONFIG_LINK')->where(['id'=>$data['id']])->delete();
    }

}