$(function() {
    $('.footable-res').footable();
    $('#footable-res2').footable().bind('footable_filtering', function(e) {
        var selected = $('.filter-status').find(':selected').text();
        if (selected && selected.length > 0) {
            e.filter += (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
            e.clear = !e.filter;
        }
    });
    $('.clear-filter').click(function(e) {
        e.preventDefault();
        $('.filter-status').val('');
        $('table.demo').trigger('footable_clear_filter');
    });
    $('.filter-status').change(function(e) {
        e.preventDefault();
        $('table.demo').trigger('footable_filter', {
            filter: $('#filter').val()
        });
    });
    $('.filter-api').click(function(e) {
        e.preventDefault();
        // get the footable filter object
        var footableFilter = $('table').data('footable-filter');
        alert('about to filter table by "tech"');
        // filter by 'tech'
        footableFilter.filter('tech');
        // clear the filter
        if (confirm('clear filter now?')) {
            footableFilter.clearFilter();
        }
    });
    /* 过滤查找 */
    $('#drpPublisher2').editableSelect({
        bg_iframe: true,
        onSelect: function(list_item,value) {
            filterNameList(value);
        },
        case_sensitive: false,
        items_then_scroll: 10,
        isFilter:true
    });
    $("#drpPublisher2_sele").attr({
        'placeholder':'请输入或选择设备名',
        'onkeydown':'filterNameList(this)'
    });
});
/* 通用输入多选方法 */
function checkSearch(value){
    var keyw = $(value).val().toLowerCase();
    var dataLi = $(value).parent().parent().parent().find('li');
    $(dataLi).each(function(){
        var that = $(this);
        var name = that.text().toLowerCase();
        if(name.indexOf(keyw) >= 0){
            that.removeClass('jt_xiaLaHover');
        }else{
            that.addClass('jt_xiaLaHover');
        }
    });
}

/* 通用点击加入图标 */
function clickIcon_ok(value){
    if($(value).find("i").attr("class") == "glyphicon glyphicon-ok"){
        $(value).find("i").attr("class","");
    }else{
        $(value).find("i").attr("class","glyphicon glyphicon-ok");
    }
}
/* 通用点击加入图标 单选 */
function clickIcon_ok_radio(value){
    if($(value).find("i").attr("class") == "glyphicon glyphicon-ok"){
        $(value).find("i").attr("class","");
    }else{
        var pid = $(value).parent().attr('id');
        $('#'+pid+' .glyphicon-ok').attr("class","");
        $(value).find("i").attr("class","glyphicon glyphicon-ok");
    }
}
/* 通用名称过滤查找选择 */
function filterNameList(value){
    setTimeout(function(){
        var sry1 = $(value).parent().parent().children().children().find('tr');
        var result = $("#drpPublisher2_sele").val().toLowerCase();
        for(i = 0; i < sry1.length; i++){
            if($(sry1[i]).attr("data-search") == 'search'){
                var deviceName = $(sry1[i]).find("td:nth-child(2)");
                var isValue = deviceName.text().toLowerCase().indexOf(result);
                if(isValue >= 0){
                    $(sry1[i]).css("display","table");
                }else{
                    $(sry1[i]).css("display","none");
                }
            }
        }
    },100);
}
/* 通用表格上下拉框选择匹配 */
function publicMsgSearch(valueS,parme){
	setTimeout(function(){
        var sry1 = $(valueS).parent().parent().children().children().find('tr');
        var result = $(valueS).find("option:selected").text().toLowerCase();
        for(i = 0; i < sry1.length; i++){
            if($(sry1[i]).attr("data-search") == 'search'){
            	if($(valueS).find("option:selected").val() == 0){
    				$(sry1[i]).css("display","table");
    				funcRefresh(this);
                }else{
                	var deviceName = $(sry1[i]).find(parme);
	                var isValue = deviceName.text().toLowerCase().indexOf(result);
	                if(isValue >= 0){
	                    $(sry1[i]).css("display","table");
	                }else{
	                    $(sry1[i]).css("display","none");
	                }
                }
            }
        }
    },100);
}
/* 输入、选择框还原 */
function funcRefresh(valueS){
	$("#drpPublisher2_sele").val("");
	filterNameList(valueS);
}
/* 选择多少条数据 */
function selectChange(id){
    var selectId = $(id).attr("id");
    var objS = document.getElementById(selectId);
    var optionVal = objS.options[objS.selectedIndex].value;
    switch(optionVal){
        case '0':
            $("#Footable").find("table").attr("data-page-size","10");
            $("#changeSelectVal").find("option[value='0']").attr("selected","true");
            break;
        case '1':
            $("#Footable").find("table").attr("data-page-size","20");
            $("#changeSelectVal").find("option[value='1']").attr("selected","true");
            break;
        case '2':
            $("#Footable").find("table").attr("data-page-size","30");
            $("#changeSelectVal").find("option[value='2']").attr("selected","true");
            break;
        case '3':
            $("#Footable").find("table").attr("data-page-size","40");
            $("#changeSelectVal").find("option[value='3']").attr("selected","true");
            break;
        case '4':
            $("#Footable").find("table").attr("data-page-size","50");
            $("#changeSelectVal").find("option[value='4']").attr("selected","true");
            break;
        case '5':
            $("#Footable").find("table").attr("data-page-size","60");
            $("#changeSelectVal").find("option[value='5']").attr("selected","true");
            break;
        case '6':
            $("#Footable").find("table").attr("data-page-size","70");
            $("#changeSelectVal").find("option[value='6']").attr("selected","true");
            break;
        case '7':
            $("#Footable").find("table").attr("data-page-size","80");
            $("#changeSelectVal").find("option[value='7']").attr("selected","true");
            break;
        case '8':
            $("#Footable").find("table").attr("data-page-size","90");
            $("#changeSelectVal").find("option[value='8']").attr("selected","true");
            break;
        case '9':
            $("#Footable").find("table").attr("data-page-size","100");
            $("#changeSelectVal").find("option[value='9']").attr("selected","true");
            break;
    }
}
/* 添加设备模拟select行为 */
function jt_clickLi_select(value){
    $(".jt_bgSearch").hide();
    var text = value.innerHTML;
    var change = document.getElementById("jt_changeText");
    change.innerText = text;
    change.setAttribute('value',value.getAttribute('value'));
    ajaxGetNum(value.getAttribute('value'), '/Organization/ajaxBackNum' , '#creatGroupNumber' , 'FirmGroup' , 2);
    $(".jt_showUl").hide();
}
/* 修改模拟select1样式行为 */
function jt_clickDiv_select1(){
    $(".jt_clickDiv_select").css("border","1px solid #45B6B0");
    if($(".jt_showUl").css("display")=="none"){
        $(".jt_showUl").show();
    }else{
        $(".jt_showUl").hide();
    }
}
/* 修改模拟select1行为 */
function jt_clickLi_select1(value){
    $(".jt_bgSearch").hide();
    var text = value.innerHTML;
    var change = document.getElementById("jt_changeText1");
    change.innerText = text;
    change.setAttribute('value',value.getAttribute('value'));
    ajaxGetNum(value.getAttribute('value'), '/Organization/ajaxBackNum' , '#createtypenum' , 'type' , 3);
    $(".jt_showUl").hide();
}
/* 修改模拟select1行为 */
function jt_clickLi_select2(value){
    $(".jt_bgSearch").hide();
    var text = value.innerHTML;
    var change = document.getElementById("jt_changeText2");
    change.innerText = text;
    change.setAttribute('value',value.getAttribute('value'));
    /*ajaxGetNum(value.getAttribute('value'), '/Organization/ajaxBackNum' , '#edittypenum' , 'type' , 3);*/
    $(".jt_showUl").hide();
}
/* 修改模拟select1样式行为 */
function jt_clickDiv_select(){
    $(".jt_clickDiv_select").css("border","1px solid #45B6B0");
    if($(".jt_showUl").css("display")=="none"){
        $(".jt_showUl").show();
    }else{
        $(".jt_showUl").hide();
    }
}
/* 通用增加表格序号 */
$(document).ready(function(){
    var len = $('table tr').not('tfoot tr').length;
    for(var i = 1; i < len; i++){
        $('table tr:eq(' + i + ') td:first').not('tfoot tr td').text(i);
    }
});
/* 报警运维信息表增加表格序号 */
$(document).ready(function(){
    var len = $('.jt_infoSpecial table tr').not('tfoot tr').length;
    for(var i = 1; i < len; i++){
        $('.jt_infoSpecial table tr:eq(' + i + ') td:first').not('tfoot tr td').text(i);
    }
});
/* 报警运维设备管理添加输入设备增加表格序号 */
$(document).ready(function(){
    var len = $('#addInputDevice table tr').not('tfoot tr').length;
    for(var i = 1; i < len; i++){
        $('#addInputDevice table tr:eq(' + i + ') td:first').not('tfoot tr td').text(i);
    }
});
/* 设备管理添加参数增加表格序号 */
$(document).ready(function(){
    var len = $('#canshuSet table tr').not('tfoot tr').length;
    for(var i = 1; i < len; i++){
        $('#canshuSet table tr:eq(' + i + ') td:first').not('tfoot tr td').text(i);
    }
});
/*
* 分类   部门   点击上级部门自动获得  最新num  自动填充编号
* parentId 上级ID
* url 请求的地址
* option  元素的标记
* */

function ajaxGetNum(parentId, url , option , dbName , numQulity){
    var pid = 0;
    if(parentId) pid = parentId;
    $.post(url , {pid:pid , dbName:dbName , numQulity:numQulity} , function (resData) {
        if(resData.status){
            $(option).val(resData.data[0]);
        }
    });
}
