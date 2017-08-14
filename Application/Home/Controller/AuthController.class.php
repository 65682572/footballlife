<?php

namespace Home\Controller;

/**
 * 权限管理控制器
 */
class AuthController extends AdminController
{

    /**
     * 授权页面AJAX
     */
    public function access()
    {
        $groupId = I('post.groupid');
        $all_rules = M('AuthRule')->order('id asc')->select();
        $arr = array();
        $new_arr = array();
        if ($groupId) {
            $group = M('UserRole')->where("id = $groupId")->find();
            $rules = explode(',', $group['rules']);

            M('AuthRule')->where('parentid')->select();
            foreach ($all_rules as $v) {
                if ($v['parentid'] == 0) {
                    $res = M('AuthRule')->field('title as text, id')->where("parentid = '$v[id]'")->select();
                    if (in_array($v['id'], $rules)) {
                        $arr = array(
                            array(
                                'text' => $v['title'],
                                'id' => $v['id'],
                                'state' => array('opened' => true, 'selected' => true),
                                'children' => $res
                            )
                        );
                    } else {
                        $arr = array(
                            array(
                                'text' => $v['title'],
                                'id' => $v['id'],
                                'state' => array('opened' => true),
                                'children' => $res
                            )
                        );
                    }

                } else {
                    break;
                }
                $new_arr = array_merge($new_arr, $arr);
            }
        }
        
        $this->ajaxReturn($new_arr);
    }

    /**
     * 授权页面提交
     */
    public function accessSubmit()
    {
        $id = I('id');
        $data = I('data');
        $userrole = M('UserRole','','DB_CONFIG_LINK');
        $str = substr($data, 0, strlen($data) - 1);
        $res = $userrole->where(array(
            'id' => $id
        ))->save(array('rules' => $str));

        $this->ajaxReturn(['result' => $res]);
    }
}
