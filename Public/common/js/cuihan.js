$(function(){
    /*
     ·/SystemSet/specification
     */
//新增品牌名称
    $('.addTrue').on('click',function () {
        var brandName = $("#addDeviceName").val();
        var logoimg = $("#addLogoImg")[0].files[0];
        var company = $(".addCompany").val();
        var intro = $("#addIntro").val();
        var formobj = $("#form");
        if(!brandName){
            publicAlert({title:'提示信息',content:'请填写品牌名称！',icon:'fa fa-rocket'},false);
            return;
        }
        if(!company){
            publicAlert({title:'提示信息',content:'请填写公司名称！',icon:'fa fa-rocket'},false);
            return;
        }
        var formdata = new FormData(formobj);
        formdata.append('name',brandName);
        formdata.append('logoimg',logoimg);
        formdata.append('company',company);
        formdata.append('intro',intro);
        var request = new XMLHttpRequest();
        request.open("POST", "/SystemSet/addBrand");
        request.send(formdata);
        request.onload = function(oEvent) {
            var res = JSON.parse(oEvent.currentTarget.response);
            if (oEvent.currentTarget.status == 200) {
                if(res.status){
                    $(this).attr('disabled','disabled');
                    publicAlert({title:'提示信息',content:res.msg,icon:'fa fa-rocket'},true);
                }else{
                    publicAlert({title:'提示信息',content:res.msg,icon:'fa fa-rocket'},false);
                }
            }
        };
    });
    //编辑品牌管理
    $('.editbtn').on('click',function () {
        var brand_id = $(this).attr('data-id');
        $("#editDeviceName").val($(this).attr('data-name'));
        $(".editCompany").val($(this).attr('data-company'));
        $("#editIntro").val($(this).attr('data-intro'));
        $('.editTrue').on('click',function () {
            var brandName = $("#editDeviceName").val();
            var logoimg = $("#aeditLogoImg")[0].files[0];
            var company = $(".editCompany").val();
            var intro = $("#editIntro").val();
            var formobj = $("#form");
            var formdata = new FormData(formobj);
            formdata.append('name',brandName);
            formdata.append('logoimg',logoimg);
            formdata.append('company',company);
            formdata.append('intro',intro);
            formdata.append('brand_id',brand_id);
            var request = new XMLHttpRequest();
            request.open("POST", "/SystemSet/editBrand");
            request.send(formdata);
            request.onload = function(oEvent) {
                var res = JSON.parse(oEvent.currentTarget.response);
                if (oEvent.currentTarget.status == 200) {
                    if(res.status){
                        $(this).attr('disabled','disabled');
                        publicAlert({title:'提示信息',content:res.msg,icon:'fa fa-rocket'},true);
                    }else{
                        publicAlert({title:'提示信息',content:res.msg,icon:'fa fa-rocket'},false);
                    }
                }
            };
        });
    });
    /*品牌删除*/
    $(".deltrue").on('click',function () {
        var did = $(this).attr('data-id');
        publicConfirm({title:'提示信息',content:'确定删除吗？',icon:'fa fa-rocket'},did);
    });
});
