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
        //当滚动时触发
        //console.info(slideEvt);
        //获取当前滚动的值，可能有重复
        // console.info(slideEvt.value);
    }).on('change', function (e) {
        //当值发生改变的时候触发
        //console.info(e);
        //获取旧值和新值
        console.info(e.value.oldValue + '--' + e.value.newValue);
    });

    $("#jt_videoRegion .jt_oneGrid").show();
    $('#jt_videoRegion .jt_oneGrid div').click(function(){
        $(this).css("border","2px solid red");
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
                $(this).css("border","2px solid red");
            });
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide2").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
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
                $(this).css("border","2px solid red");
                $('#jt_videoRegion .jt_fourGrid div').not(this).css("border","1px solid white");
            });
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide3").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
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
                $(this).css("border","2px solid red");
                $('#jt_videoRegion .jt_sixGrid div').not(this).css("border","1px solid white");
            });
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide4").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
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
                $(this).css("border","2px solid red");
                $('#jt_videoRegion .jt_sevenGrid div').not(this).css("border","1px solid white");
            });
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide5").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
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
                $(this).css("border","2px solid red");
                $('#jt_videoRegion .jt_nineGrid div').not(this).css("border","1px solid white");
            });
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide6").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
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
                $(this).css("border","2px solid red");
                $('#jt_videoRegion .jt_tenGrid div').not(this).css("border","1px solid white");
            });
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide7").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
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
                $(this).css("border","2px solid red");
                $('#jt_videoRegion .jt_twelveGrid div').not(this).css("border","1px solid white");
            });
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide8").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
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
                $(this).css("border","2px solid red");
                $('#jt_videoRegion .jt_thirteenGrid div').not(this).css("border","1px solid white");
            });
        }else{
            alert("切换失败");
        }
    });
    $(".jt_mSLB #jt_hide9").click(function(){
        var msg = "是否改变其模板";
        if(confirm(msg) == true){
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
                $(this).css("border","2px solid red");
                $('#jt_videoRegion .jt_sixteenGrid div').not(this).css("border","1px solid white");
            });
        }else{
            alert("切换失败");
        }
    });
});