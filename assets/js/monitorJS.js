// thediv = new Object();
thediv = "";
$(document).ready(function () {
    $(".grid").click(function(){
        parent.$("#ctrl").removeAttr("data-id");
    });
    $(".grid").attr({
        "ondrop":"drop(event)",
        "ondragover":"allowDrop(event)"
    });
    $("#speedSlide").bind("input propertychange",function(){
        var value=$(this).val();
        if(value){
            $("#speedSlide").attr("data-slider-value",value);
        }else{
            $("#speedSlide").attr("data-slider-value","1");
        }
    });
    $('#speedSlide').slider({
        formatter: function (value) {
            return value;
        }
    }).on('slide', function (slideEvt) {
        // 当滚动时触发
        // console.info(slideEvt);
        // 获取当前滚动的值，可能有重复
        // console.info(slideEvt.value);
    }).on('change', function (e) {
        // 当值发生改变的时候触发
        // console.info(e);
        // 获取旧值和新值
        console.info(e.value.oldValue + '--' + e.value.newValue);
    });
    $("#jt_videoRegion .jt_oneGrid").show();
    $('#jt_videoRegion .jt_oneGrid div').click(function(){
        chick2(this);
    });
    $("#jt_videoRegion .jt_fourGrid").hide();
    $("#jt_videoRegion .jt_sixGrid").hide();
    $("#jt_videoRegion .jt_sevenGrid").hide();
    $("#jt_videoRegion .jt_tenGrid").hide();
    $("#jt_videoRegion .jt_nineGrid").hide();
    $("#jt_videoRegion .jt_twelveGrid").hide();
    $("#jt_videoRegion .jt_thirteenGrid").hide();
    $("#jt_videoRegion .jt_sixteenGrid").hide();
    $(".jt_mSLB #jt_hide1").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 1}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").show();
            $("#jt_videoRegion .jt_fourGrid").hide();
            $("#jt_videoRegion .jt_sixGrid").hide();
            $("#jt_videoRegion .jt_sevenGrid").hide();
            $("#jt_videoRegion .jt_tenGrid").hide();
            $("#jt_videoRegion .jt_nineGrid").hide();
            $("#jt_videoRegion .jt_twelveGrid").hide();
            $("#jt_videoRegion .jt_thirteenGrid").hide();
            $("#jt_videoRegion .jt_sixteenGrid").hide();
            $('#jt_videoRegion .jt_oneGrid div').click(function(){
                chick2(this);
            });
            video_res(".jt_oneGrid");
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide2").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 2}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").hide();
            $("#jt_videoRegion .jt_fourGrid").show();
            $("#jt_videoRegion .jt_sixGrid").hide();
            $("#jt_videoRegion .jt_sevenGrid").hide();
            $("#jt_videoRegion .jt_tenGrid").hide();
            $("#jt_videoRegion .jt_nineGrid").hide();
            $("#jt_videoRegion .jt_twelveGrid").hide();
            $("#jt_videoRegion .jt_thirteenGrid").hide();
            $("#jt_videoRegion .jt_sixteenGrid").hide();
            $('#jt_videoRegion .jt_fourGrid div').click(function(){
                chick2(this);
                $('#jt_videoRegion .jt_fourGrid div').not(this).css("border","1px solid rgba(0, 250, 250, 0.8)");
            });
            video_res(".jt_fourGrid");
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide3").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 3}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").hide();
            $("#jt_videoRegion .jt_fourGrid").hide();
            $("#jt_videoRegion .jt_sixGrid").show();
            $("#jt_videoRegion .jt_sevenGrid").hide();
            $("#jt_videoRegion .jt_tenGrid").hide();
            $("#jt_videoRegion .jt_nineGrid").hide();
            $("#jt_videoRegion .jt_twelveGrid").hide();
            $("#jt_videoRegion .jt_thirteenGrid").hide();
            $("#jt_videoRegion .jt_sixteenGrid").hide();
            $('#jt_videoRegion .jt_sixGrid div').click(function(){
                chick2(this);
                $('#jt_videoRegion .jt_sixGrid div').not(this).css("border","1px solid rgba(0, 250, 250, 0.8)");
            });
            video_res(".jt_sixGrid");
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide4").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 4}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").hide();
            $("#jt_videoRegion .jt_fourGrid").hide();
            $("#jt_videoRegion .jt_sixGrid").hide();
            $("#jt_videoRegion .jt_sevenGrid").show();
            $("#jt_videoRegion .jt_tenGrid").hide();
            $("#jt_videoRegion .jt_nineGrid").hide();
            $("#jt_videoRegion .jt_twelveGrid").hide();
            $("#jt_videoRegion .jt_thirteenGrid").hide();
            $("#jt_videoRegion .jt_sixteenGrid").hide();
            $('#jt_videoRegion .jt_sevenGrid div').click(function(){
                chick2(this);
                $('#jt_videoRegion .jt_sevenGrid div').not(this).css("border","1px solid rgba(0, 250, 250, 0.8)");
            });
            video_res(".jt_sevenGrid");
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide5").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 5}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").hide();
            $("#jt_videoRegion .jt_fourGrid").hide();
            $("#jt_videoRegion .jt_sixGrid").hide();
            $("#jt_videoRegion .jt_sevenGrid").hide();
            $("#jt_videoRegion .jt_tenGrid").hide();
            $("#jt_videoRegion .jt_nineGrid").show();
            $("#jt_videoRegion .jt_twelveGrid").hide();
            $("#jt_videoRegion .jt_thirteenGrid").hide();
            $("#jt_videoRegion .jt_sixteenGrid").hide();
            $('#jt_videoRegion .jt_nineGrid div').click(function(){
                chick2(this);
                $('#jt_videoRegion .jt_nineGrid div').not(this).css("border","1px solid rgba(0, 250, 250, 0.8)");
            });
            video_res(".jt_nineGrid");
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide6").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 6}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").hide();
            $("#jt_videoRegion .jt_fourGrid").hide();
            $("#jt_videoRegion .jt_sixGrid").hide();
            $("#jt_videoRegion .jt_sevenGrid").hide();
            $("#jt_videoRegion .jt_tenGrid").show();
            $("#jt_videoRegion .jt_nineGrid").hide();
            $("#jt_videoRegion .jt_twelveGrid").hide();
            $("#jt_videoRegion .jt_thirteenGrid").hide();
            $("#jt_videoRegion .jt_sixteenGrid").hide();
            $('#jt_videoRegion .jt_tenGrid div').click(function(){
                chick2(this);
                $('#jt_videoRegion .jt_tenGrid div').not(this).css("border","1px solid rgba(0, 250, 250, 0.8)");
            });
            video_res(".jt_tenGrid");
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide7").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 7}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").hide();
            $("#jt_videoRegion .jt_fourGrid").hide();
            $("#jt_videoRegion .jt_sixGrid").hide();
            $("#jt_videoRegion .jt_sevenGrid").hide();
            $("#jt_videoRegion .jt_tenGrid").hide();
            $("#jt_videoRegion .jt_nineGrid").hide();
            $("#jt_videoRegion .jt_twelveGrid").show();
            $("#jt_videoRegion .jt_thirteenGrid").hide();
            $("#jt_videoRegion .jt_sixteenGrid").hide();
            $('#jt_videoRegion .jt_twelveGrid div').click(function(){
                chick2(this);
                $('#jt_videoRegion .jt_twelveGrid div').not(this).css("border","1px solid rgba(0, 250, 250, 0.8)");
            });
            video_res(".jt_twelveGrid");
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide8").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 8}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").hide();
            $("#jt_videoRegion .jt_fourGrid").hide();
            $("#jt_videoRegion .jt_sixGrid").hide();
            $("#jt_videoRegion .jt_sevenGrid").hide();
            $("#jt_videoRegion .jt_tenGrid").hide();
            $("#jt_videoRegion .jt_nineGrid").hide();
            $("#jt_videoRegion .jt_twelveGrid").hide();
            $("#jt_videoRegion .jt_thirteenGrid").show();
            $("#jt_videoRegion .jt_sixteenGrid").hide();
            $('#jt_videoRegion .jt_thirteenGrid div').click(function(){
                chick2(this);
                $('#jt_videoRegion .jt_thirteenGrid div').not(this).css("border","1px solid rgba(0, 250, 250, 0.8)");
            });
            video_res(".jt_thirteenGrid");
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide9").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
            $.ajax({
                url: '/Map/setOperation',
                type: 'post',
                data: {controllerPath: 'home/matrix/monitor', operation: {curGrid: 9}},
                success: function (res) {

                }
            });
            $("#jt_videoRegion .jt_oneGrid").hide();
            $("#jt_videoRegion .jt_fourGrid").hide();
            $("#jt_videoRegion .jt_sixGrid").hide();
            $("#jt_videoRegion .jt_sevenGrid").hide();
            $("#jt_videoRegion .jt_tenGrid").hide();
            $("#jt_videoRegion .jt_nineGrid").hide();
            $("#jt_videoRegion .jt_twelveGrid").hide();
            $("#jt_videoRegion .jt_thirteenGrid").hide();
            $("#jt_videoRegion .jt_sixteenGrid").show();
            $('#jt_videoRegion .jt_sixteenGrid div').click(function(){
                chick2(this);
                $('#jt_videoRegion .jt_sixteenGrid div').not(this).css("border","1px solid rgba(0, 250, 250, 0.8)");
            });
            video_res(".jt_sixteenGrid");
        }else{
            alert("切换失败");
        }
    });
});
function chick2(obj){
    $(obj).css("border","2px solid red");
    thediv = obj;
    selfDevice = $(obj).children().attr('id');
}