<?php

namespace Home\Controller;

class MapController extends AdminController
{
    public function mapSetting()
    {
        $this->display();

    }

    public function addMap()
    {
        $mapName = I('post.mapName', '', 'trim');
        $mapType = I('post.mapType', '', 'intval');
        if (empty($mapName) or empty($mapType)) {
            // $this->error('请填写地图名称');
            $this->ajaxReturn(['status' => false, 'msg' => '请填写地图名称']);
        }

        if ($mapType == 2) {
            $fileObj = new \Think\Upload();
//             $fileObj->maxSize = 100 * 1024 * 1024;
            $fileObj->exts = array('jpg', 'gif', 'png', 'jpeg');
            $fileObj->rootPath = './Uploads/map/';
            $res = $fileObj->uploadOne($_FILES['offlineMap']);

            if (!$res) {
                // $this->error($fileObj->getError());
                $this->ajaxReturn(['status' => false, 'msg' => $fileObj->getError()]);
            } else {
                $param['map_img'] = $res['savepath'] . $res['savename'];
            }
        }
        $param['map_type'] = $mapType;
        $param['uid'] = UID;
        $param['firmid'] = $this->firmid;
        $param['map_name'] = $mapName;
        $param['time'] = time();
        $res = M('MapList')->add($param);

        if ($res) {
            $this->ajaxReturn(['status' => true, 'msg' => '添加成功']);
            // $this->success('添加成功');
        } else {
            $this->ajaxReturn(['status' => false, 'msg' => '添加失败']);
            // $this->error('添加失败');
        }
    }

    public function editMap()
    {
        $id = I('post.id', '', 'intval');
        $mapName = I('post.mapName', '', 'trim');
        $mapType = I('post.mapType', '', 'intval');
        if (empty($mapName) or empty($mapType)) {
            $this->ajaxReturn(['status' => false, 'msg' => '请填写地图名称']);
        }

        if ($mapType == 2) {
            $fileObj = new \Think\Upload();
//             $fileObj->maxSize = 100 * 1024 * 1024;
            $fileObj->exts = array('jpg', 'gif', 'png', 'jpeg');
            $fileObj->rootPath = './Uploads/map/';
            $res = $fileObj->uploadOne($_FILES['offlineMap']);

            if (!$res) {
                $this->ajaxReturn(['status' => false, 'msg' => $fileObj->getError()]);
                // $this->error($fileObj->getError());
            } else {
                $param['map_img'] = $res['savepath'] . $res['savename'];
            }
        }
        $param['map_type'] = $mapType;
        $param['map_name'] = $mapName;
        $param['time'] = time();
        $res = M('MapList')->where("id = '$id'")->save($param);
        if ($res) {
            $this->ajaxReturn(['status' => true, 'msg' => '修改成功']);
            // $this->success('修改成功');
        } else {
            $this->ajaxReturn(['status' => true, 'msg' => '修改失败']);
            // $this->error('修改失败');
        }
    }

    public function mapManage()
    {
        $this->getLastOperation();
        $uid = UID;
        $mapListId = I('get.mapListId');
        $alarmId = I('get.alarmId', '');

        $userFirmList = \Home\Model\FirmModel::getFirmIdFromGroup($this->uid);
        $firmUser = \Home\Model\DeviceModel::firmUsers($userFirmList);

        $sql = '';
        foreach ($firmUser as $k => $v) {
            if ($k != count($firmUser) - 1) {
                $sql .= 'uid = ' . $v . ' or ';
            } else {
                $sql .= 'uid = ' . $v;
            }
        }

        $data = M('MapList')->where($sql)->select();
        $imgUrl = M('MapList')->field('map_img')->where("id = '$mapListId'")->find();
        $operationMapId = $this->operation['mapListId'];
        if (I('is_skip') != 1) {
            if (!empty($operationMapId) && empty($mapListId)) {
                if ($mapListId != $operationMapId) {
                    $data = M('MapList')->where("id = '$operationMapId'")->find();
                    header('Location: /Map/mapManage/mapListId/' . $this->operation['mapListId'] . '/mapType/' . $data['map_type']);
                }
            }
        }
        $mapAddress = M('MapAddress')->where("uid = '$uid'")->select();
        $user = \Home\Model\UserModel::getUserByFirm($this->firmid);
        $track = array();
        $time = time() - 100;
        foreach ($user as $k => $v) {
            $track[$v['id'] . '-' . $v['username'] . '-' . $v['mobile']] = M('Rtlocation')->where("userid = {$v['id']} AND create_time > $time")->order('create_time desc')->limit(1)->select();
        }

        $onlineMobileUser = [];
        foreach ($track as $k => $v) {
            if (!empty($v[0])) {
                $k = explode('-', $k);
                $onlineMobileUser[$k[0]][] = $v[0]['lng'];
                $onlineMobileUser[$k[0]][] = $v[0]['lat'];
            }
        }

        if (count($onlineMobileUser > 0)) {
            foreach ($onlineMobileUser as $k => $v) {
                $res = M('Avatar')->where("userid = $k")->find();
                $avatarName = explode('|', $res['avatar_name']);
                $onlineMobileUser[$k][2] = $res['filepath'] . $avatarName[2];
            }
        }

        $list = \Home\Model\DeviceModel::deviceList($this->firmid);
        foreach ($list as $k => $v) {
            $where['id'] = $v["firmid"];
            $list[$k]['firmName'] = M('firm')->where($where)->getField('name');
            if ($v["type"]) {
                $w['id'] = $v["type"];
                $list[$k]['typesName'] = M('type')->where($w)->getField('name');
            }
            if ($v["types"]) {
                $w2['id'] = $v["types"];
                $list[$k]['catename'] = M('types')->where($w2)->getField('name');
            }
            $rs = $v['type'];
            while ($rs > 0) {
                $ppid = $rs;
                $w3['id'] = $rs;
                $rs = M('Type')->where($w3)->getfield('pid');
            }
            if ($ppid) {
                $list[$k]['ppid'] = $ppid;
            } else {
                $list[$k]['ppid'] = 0;
            }
        }
        $typeTree = $this->typetree($list);

        $this->assign('alarmId', $alarmId);
        $this->assign('list2', json_encode($list));
        $this->assign('typeTree', $typeTree);
        $this->assign('track', $track);
        $this->assign('onlineMobileUserAvatar', $onlineMobileUser);
        $this->assign('mapAddress', $mapAddress);
        $this->assign('mapListId', $mapListId);
        $this->assign('mapType', I('get.mapType'));
        $this->assign('data', $data);
        $this->assign('imgUrl', $imgUrl['map_img']);
        $this->display();
    }

    //分类树
    public function typetree($list)
    {
        $type = M("Type")->where(['status' => 1])->select();
        foreach ($type as $key => $value) {
            foreach ($list as $i => $b) {
                if ($value['id'] == $b['type']) {

                    $ww['device_serial'] = $b['uuid'];
                    $vlist = M('VideoList')->where($ww)->getField('video_input');

                    if ($vlist) {
                        $b['videolist'] = unserialize($vlist);
                    }
                    $type[$key]['devices'][] = $b;
                }
            }
        }

        function findChild(&$arr, $id, $list)
        {
            $childs = array();
            foreach ($arr as $k => $v) {
                if ($v['pid'] == $id) {
                    $childs[] = $v;
                }
            }
            return $childs;
        }

        function build_tree($rows, $root_id, $list)
        {
            $childs = findChild($rows, $root_id, $list);
            if (empty($childs)) {
                return null;
            }
            foreach ($childs as $k => $v) {
                $rescurTree = build_tree($rows, $v['id']);
                if (null != $rescurTree) {
                    $childs[$k]['childs'] = $rescurTree;
                }
            }
            return $childs;
        }

        $tree = build_tree($type, 0, $list);
        return $tree;
    }

    public function mapList()
    {
        $uid = UID;
        $data = M('MapList')->alias('a')->field('a.*,b.name')->join('__FIRM__ as b ON a.firmid = b.id', 'LEFT')->where("uid = '$uid'")->select();
        $addressData = M('MapAddress')->where("uid = '$uid'")->select();
        $this->assign('addressData', $addressData);
        $this->assign('data', $data);
        $this->display();
    }

    public function delMapList()
    {
        $uid = UID;
        $deleteId = I('get.deleteId');
        $res = M('MapList')->where("uid = '$uid' AND id = '$deleteId'")->delete();

        if ($res) {
            $this->success('删除成功');
        } else {
            $this->error('删除失败');
        }
    }

    public function mapLayout()
    {
        $this->getLastOperation('home/map/mapmanage');
        $uid = UID;
        $mapListId = I('get.mapListId');
        $cut = I('cut'); //页面上切换我的地图与自动还原最后一次的地图功能冲突，这里用cut变量区别。
        $data = M('MapList')->where("uid = '$uid'")->select();
        $lastdata = M('MapList')->where("id = '$mapListId'")->find();
        $imgUrl = M('MapList')->field('map_img')->where("id = '$mapListId'")->find();
        $operationMapId = $this->operation['mapListId'];
        if (!$cut) {
            if (!empty($operationMapId)) {
                if ($mapListId != $operationMapId) {
                    $data = M('MapList')->where("id = '$operationMapId'")->find();
                    header('Location: /Map/mapLayout/mapListId/' . $this->operation['mapListId'] . '/mapType/' . $data['map_type']);
                }
            }
        }
        $mapAddress = M('MapAddress')->where("uid = '$uid'")->select();


        $list = \Home\Model\DeviceModel::deviceList($this->firmid);
        foreach ($list as $k => $v) {
            $where['id'] = $v["firmid"];
            $list[$k]['firmName'] = M('firm')->where($where)->getField('name');
            if ($v["type"]) {
                $w['id'] = $v["type"];
                $list[$k]['typesName'] = M('type')->where($w)->getField('name');
            }
            if ($v["types"]) {
                $w2['id'] = $v["types"];
                $list[$k]['catename'] = M('types')->where($w2)->getField('name');
            }
            $rs = $v['type'];
            while ($rs > 0) {
                $ppid = $rs;
                $w3['id'] = $rs;
                $rs = M('Type')->where($w3)->getfield('pid');
            }
            if ($ppid) {
                $list[$k]['ppid'] = $ppid;
            } else {
                $list[$k]['ppid'] = 0;
            }
        }
        $typeTree = $this->typetree($list);

        $this->assign('list2', json_encode($list));
        $this->assign('typeTree', $typeTree);
        $this->assign('mapAddress', $mapAddress);
        $this->assign('mapListId', $mapListId);
        $this->assign('mapType', I('get.mapType'));
        $this->assign('data', $data);
        $this->assign('lastmapname', $lastdata['map_name']);
        $this->assign('imgUrl', $imgUrl['map_img']);
        $this->assign('jsonData', $this->getCamList());
        $this->display();
    }

    public function getCamList()
    {
        $uid = UID;
        $matrixList = \Home\Model\DeviceModel::deviceList($this->firmid);
        $allList = array();
        foreach ($matrixList as $k => $v) {
            $allList[$k] = $this->getDeviceList($v['uuid']);
            $allList[$k]['id'] = $v['uuid'];
            $allList[$k]['name'] = $v['name'];
            if ($v['type'] == 170) {
                $allList[$k]['icon'] = '/Uploads/typeico/2017-06-29/59545ee3aca58.png';
                $allList[$k]['type'] = '用户电脑';
            } else {
                if ($v['type'] == 171) {
                    $allList[$k]['icon'] = '/Uploads/typeico/2017-06-29/59545ef47cd98.png';
                    $allList[$k]['type'] = '用户手机';
                } else {
                    $allList[$k]['icon'] = '/Public/common/images/icon_juZhen3.png';
                    $allList[$k]['type'] = '矩阵';
                }
            }

        }
        $jsonData = array();
        $newList = array();
        foreach ($allList as $k => $v) {
            if (!empty($v['icon'])) {
                $jsonData[$k]['icon'] = $v['icon'];
            }
            if (!empty($v['type'])) {
                $jsonData[$k]['li_attr']['type'] = $v['type'];
            }
            $jsonData[$k]['text'] = $v['name'];
            $jsonData[$k]['id'] = $v['id'];
            $jsonData[$k]['state'] = ["opened" => true];
            if (count($v) > 4) {
                foreach ($v as $k1 => $v1) {
                    if (is_array($v1)) {
                        $newList[$k1]['text'] = $v1['name'];
                        $newList[$k1]['id'] = $v['id'] . '_' . $v1['id'];
                        $newList[$k1]['type'] = 'level1';
                        $newList[$k1]['li_attr'] = array(
                            'name' => $v1['name'],
                            'type' => '摄像头',
                            'ip' => $v1['location'],
                            'matrixid' => $v['id']
                        );
                    }
                }
                $jsonData[$k]['children'] = $newList;
            } else {
                $jsonData[$k]['children'] = array();
            }
        }
//dumpd($jsonData);
        return json_encode($jsonData);
    }

    public function addMapMark()
    {
        if (IS_AJAX) {
            $info = serialize(I('post.info'));
            $lng = I('post.lng');
            $lat = I('post.lat');
            $camId = I('post.camId');
            $mapListId = I('post.map_list_id');
            $matrixId = I('post.matrixid');
            $uid = UID;

            if (!empty($info) && !empty($lng) && !empty($lat) && !empty($camId) && !empty($mapListId) && !empty($matrixId)) {
                $auth = M('MapList')->where("id = '$mapListId'")->find();
                if ($auth['uid'] != $uid) {
                    $this->ajaxReturn(['status' => false, 'msg' => '没有权限操作该地图']);
                }

                $arr = array(
                    'uid' => $uid,
                    'info' => $info,
                    'lng' => $lng,
                    'lat' => $lat,
                    'cam_id' => $camId,
                    'matrix_id' => $matrixId,
                    'map_list_id' => $mapListId
                );
                $res = M('MapMark')->add($arr);
                if ($res) {
                    $this->ajaxReturn(['status' => true]);
                }
//                dump($res);
            }
        }
    }

    public function getMarkList()
    {
        if (IS_AJAX) {
            $mapListId = I('map_list_id');

            if (empty($mapListId)) {
                return;
            }

//            $userFirmList = \Home\Model\FirmModel::getFirmIdFromGroup($this->uid);
//            $firmUser = \Home\Model\DeviceModel::firmUsers($userFirmList);
//
//            $sql = '';
//            foreach ($firmUser as $k => $v) {
//                if ($k != count($firmUser) - 1) {
//                    $sql .= 'uid = ' . $v . ' or ';
//                } else {
//                    $sql .= 'uid = ' . $v;
//                }
//            }

            $res = M('MapMark')->where("map_list_id = '$mapListId'")->select();

            foreach ($res as $k => $v) {
                $res[$k]['info'] = unserialize($v['info']);
            }

            $this->ajaxReturn($res);
        }
    }

    public function modifyMark()
    {
        $uid = UID;
        $camId = I('post.camId');
        $lng = I('post.lng');
        $lat = I('post.lat');
        $mapListId = I('post.map_list_id');
        $matrixId = I('post.matrixid');

        $param = array(
            'lng' => $lng,
            'lat' => $lat
        );
        $res = M('MapMark')->where("uid = '$uid' AND cam_id = '$camId' AND map_list_id = '$mapListId' AND matrix_id = '$matrixId'")->save($param);
        if ($res) {
            $this->ajaxReturn(['status' => 'ok']);
        } else {
            $this->ajaxReturn(['status' => 'false']);
        }
    }

    public function delMark()
    {
        if (IS_AJAX) {
            $camId = I('get.camId', '', 'trim');
            $uid = UID;
            $mapListId = I('get.map_list_id');
            $matrixId = I('get.matrixid');
            if ($camId == 'undefined') {
                $camId = 0;
            }
            $res = M('MapMark')->where("uid = '$uid' AND cam_id = '$camId' AND map_list_id = '$mapListId' AND matrix_id = '$matrixId'")->delete();

            if ($res) {
                $this->ajaxReturn(['status' => 'ok']);
            }
        }

    }

    public function getAddress()
    {
        if (IS_GET) {
            $uid = UID;

            if ($uid > 0) {
                $res = M('MapAddress')->where("uid = $uid")->select();
                if ($res) {
                    $this->ajaxReturn($res);
                }
            }
        }
    }

    public function addAddress()
    {
        if (IS_POST) {
            $param['uid'] = UID;
            $param['origin_name'] = I('post.originName', '', 'trim');
            $param['custom_name'] = I('post.customName', '', 'trim');
            $param['lat'] = I('post.lat', '', 'trim');
            $param['lng'] = I('post.lng', '', 'trim');
            /*cui*/
            $param['map_list_id'] = I('mapListId', '');
            $param['type'] = I('mapType', '');
            /*cui*/
            if (!empty($param['map_list_id']) && !empty($param['type']) && !empty($param['uid']) && !empty($param['origin_name']) && !empty($param['custom_name']) && !empty($param['lat']) && !empty($param['lng'])) {
                $res = M('MapAddress')->add($param);
                if ($res) {
                    $this->success('添加成功');
                }
            }
        }
    }

    public function delAddress()
    {
        $delId = I('get.id');
        $res = M('MapAddress')->where("id = '$delId'")->delete();

        if ($res) {
            $this->success('删除成功');
        } else {
            $this->error('删除失败');
        }
    }

    public function getMatrixName()
    {
        $matrixId = I('post.matrixId');
        $data = M('ModulesDevice')->where("uuid = '$matrixId'")->find();

        $this->ajaxReturn($data);
    }

    public function getPolyline()
    {
        $user = \Home\Model\UserModel::getUserByFirm($this->firmid);
        $time = time() - 100;

        foreach ($user as $k => $v) {
            $track[$v['id']] = M('Rtlocation')->where("userid = {$v['id']} AND create_time > $time")->order('create_time desc')->limit(2)->select();
        }
//        $userSql = '';
//        foreach($user as $k => $v) {
//            if ($k != count($user) - 1 ) {
//                $userSql .= 'userid = ' . $v['id'] . ' or ';
//            } else {
//                $userSql .= 'userid = ' . $v['id'];
//            }
//        }
//        $time = time() - 100;
//        $data = M('Rtlocation')->where("($userSql) AND create_time > '$time'")->order('create_time desc')->limit(2)->select();

        if ($track) {
            $this->ajaxReturn($track);
        } else {
            $this->ajaxReturn([]);
        }
    }

    public function allFirmUser()
    {
        $user = \Home\Model\UserModel::getUserByFirm($this->firmid);

        if ($user) {
            $this->ajaxReturn($user);
        } else {
            $this->ajaxReturn([]);
        }
    }

    public function searchTrack()
    {
        $dateStart = I('post.dateStart', '', 'intval');
        $dateEnd = I('post.dateEnd', '', 'intval');
        $userInfo = I('post.userInfo');
        $trackData = [];
        if (!empty($dateStart) && !empty($dateEnd) &&$dateEnd > $dateStart) {
            foreach ($userInfo as $k => $v) {
                $trackData[$v['id']] = M('Rtlocation')->where("userid = {$v} AND create_time > $dateStart AND create_time < $dateEnd")->select();
            }
        }

        if ($trackData) {
            $this->ajaxReturn($trackData);
        };
    }

    public function getMapImg()
    {
        $id = I('post.map_list_id');

        if (!empty($id)) {
            $res = M('MapList')->where("id = $id")->getField('map_img');
            $this->ajaxReturn(['imgUrl' => $res]);
        }
    }
}