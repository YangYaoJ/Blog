$('.menu img').click(function(event) {
    $('.menu ul').slideToggle(100)
});
$('.regi').click(function (e) {
    e.preventDefault()
    location.href="http://localhost:8989/register/"
});

var proving = true;
//用户名失去焦点事件
$('#exampleInputEmail1').blur(function () {
    if($(this).val()==''){
        $('.user-tip').html('请输入用户名');
        $('.user-tip').css('color','red');
        proving = false;
    }
    else{
        proving = true;
    }
});
//密码失去焦点事件
$('#exampleInputPassword1').blur(function () {
    if($(this).val()==''){
        $('.pass-tip').html('请输入密码');
        $('.pass-tip').css('color','red');
        proving = false;
    }
    else{
        proving = true;
    }
});

function logi(){
    if(proving){
        $.ajax({
            url:'http://localhost:8989/proving',
            type:'post',
            dataType:'json',
            data:{user:$('#exampleInputEmail1').val(),pass:$('#exampleInputPassword1').val()},
            success:function (res,status,xhr) {
                if(res.status=='匹配用户成功'){
                    location.href="http://localhost:8989/create";
                    console.log('登录成功');
                }else{
                    $('.user-tip').html('用户名或密码错误');
                    $('.user-tip').css('color','red');
                    $('.pass-tip').html('用户名或密码错误');
                    $('.pass-tip').css('color','red');
                }
            }

        })
    }
}

$('.login').click(function () {
    logi();
});

// 键盘按下的时候
$('input').keydown(function(e) {
    // 键值
    if(e.keyCode==13){
        logi();
    }

});