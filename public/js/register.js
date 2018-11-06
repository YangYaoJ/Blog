$('.menu img').click(function(event) {
	$('.menu ul').slideToggle(100)
});
$('.log').click(function (e) {
    e.preventDefault();
    location.href="http://localhost:8989/login/"
});
// $('button').click(function(event) {
// 	if($('#exampleInputEmail1').val()==''){
// 		$('.user').html('请输入正确用户名');
// 		$('.user').css('color', 'red');
// 	}else{
// 		$.ajax({
// 			url: 'http://localhost:8989/user',
// 			type: 'post',
// 			dataType: 'json',
// 			data: {param1: $('#exampleInputEmail1').val()},
// 			success:function(res){
// 				console.log(res)
// 			}
// 		})
//
// 	}
// });

/*############*/
//用户名失去焦点事件
$('#exampleInputEmail1').blur(function () {
    if($(this).val()==''){
        $('.user-tip').html('请输入用户名');
        $('.user-tip').css('color','red')
    }else{
        $.ajax({
            url: 'http://localhost:8989/user',
            type: 'get',
            dataType: 'json',
            data: {param1: $(this).val()},
            success:function(res,status,xhr){
                console.log(res.status)
                if(res.status=='ok'){
                    $('.user-tip').html('下一步');
                    $('.user-tip').css('color','green')
                }else{
                    $('.user-tip').html('用户名已存在')
                    $('.user-tip').css('color','red')
                }
            }
        })
    }
});

//密码失去焦点事件
$('.pass').blur(function () {
   if($(this).val() =='' || $(this).val().length<8){
       $('.pass-tip').html('请输入8位或者8位以上的密码');
       $('.pass-tip').css('color','red')
   }
   else{
       $('.pass-tip').html('下一步');
       $('.pass-tip').css('color','green')
   }
});

//确认密码失去焦点事件
$('.con-pass').blur(function () {
    if($('.con-pass').val()=='' || $(this).val().length<8){
        $('.con-pass-tip').html('请输入8位或者8位以上的密码');
        $('.con-pass-tip').css('color','red');
    }
   else if($('.con-pass').val() ===$('.pass').val()){
       $('.con-pass-tip').html('下一步');
       $('.con-pass-tip').css('color','green');
   }
   else{
       $('.con-pass-tip').html('密码不相同');
       $('.con-pass-tip').css('color','red');
   }
});

//个性签名失去焦点事件
// $('.aboutMe').blur(function () {
//    if($('.aboutMe').val()==''){
//        $('.aboutMe-tip').html('请输入个性签名');
//        $('.aboutMe-tip').css('color','red')
//    }else{
//        $('.aboutMe-tip').html('下一步');
//        $('.aboutMe-tip').css('color','green')
//    }
// });

//注册提交事件
$('form').submit(function(e) {
	var flag=true;
	if($('#exampleInputEmail1').val()==''){
		flag=false;
        $('.user-tip').html('请输入用户名');
        $('.user-tip').css('color','red')
	}
	else if($('.user-tip').html()==='用户名已存在'){
        flag=false;
        $('.user-tip').html('用户名已存在');
        $('.user-tip').css('color','red')
    }
	else {
        $('.user-tip').html('下一步');
        $('.user-tip').css('color','green')
	}
	if($('.pass').val()==''){
		flag=false;
        $('.pass-tip').html('请输入8位或者8位以上的密码');
        $('.pass-tip').css('color','red')
	}else{
        $('.pass-tip').html('下一步');
        $('.pass-tip').css('color','green')
	}
    if($('.con-pass').val()==''){
        flag=false;
        $('.con-pass-tip').html('请再次输入8位或者8位以上的密码');
        $('.con-pass-tip').css('color','red')
    }else{
        $('.con-pass-tip').html('下一步');
        $('.con-pass-tip').css('color','green')
    }
    if($('.aboutMe').val()==''){
        flag=false;
        $('.aboutMe-tip').html('请输入个性签名');
        $('.aboutMe-tip').css('color','red')
    }else{
        $('.aboutMe-tip').html('下一步');
        $('.aboutMe-tip').css('color','green')
    }
	if(!flag || flag){
		e.preventDefault();
	}
    if(flag){
        $.ajax({
            url: 'http://localhost:8989/save',
            type: 'get',
            dataType: 'json',
            data: {name: $('#exampleInputEmail1').val(),pass:$('.pass').val(),aboutMe:$('.aboutMe').val()},
            success:function(res,status,xhr){
                console.log(res.status);

                    // 页面跳转
                    if(res.status=='注册数据插入成功')
                    location.href="http://localhost:8989/create"
            }
        })
    }

});


