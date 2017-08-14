$(document).ready(function(){
    $(".jt_bottomMenu").hide();
    $("#openMenu").click(function(){
        $(".jt_bottomMenu").toggle();/* 当分辨率缩小到一定程度时给展开菜单按钮绑定开关按钮 */
    });
    $("#jt_canCel").click(function(){/* 注销登录 */
        if (confirm("您确定要退出控制面板吗？")){
            top.location = "../login.php";
        }
        return false;
    });
    /* 动态添加元素并添加警点列表圆的类名 */
    var list = $(".jt_threeList ul li");
    var a = $("<a class='jt_threeWhiteRound'></a>");
    for( i = 0; i < list.length + 1; i ++ ){
        list.append(a);
    }
});