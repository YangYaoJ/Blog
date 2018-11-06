$('.menu img').click(function(event) {
	$('.menu ul').slideToggle(100)
});
//用户名失去焦点事件
$('#exampleInputEmail1').blur(function () {
    if($(this).val()==''){
        $('.user-tip').html('请输入用户名')
    }else{
        $.ajax({
            url: 'http://localhost:8989/user',
            type: 'get',
            dataType: 'json',
            data: {param1: $(this).val()},
            success:function(res,status,xhr){
                console.log(res.status)
                if(res.status=='ok'){
                    $('.user-tip').html('进入下一步');
                }else{
                    $('.user-tip').html('用户名已存在')
                }
            }
        })
    }
});

$('button').click(function(event) {
	if($('#exampleInputEmail1').val()==''){
		$('.user').html('请输入正确用户名');
		$('.user').css('color', 'red');
	}else{
		$.ajax({
			url: 'http://localhost:8989/user',
			type: 'post',
			dataType: 'json',
			data: {param1: $('#exampleInputEmail1').val()},
			success:function(res){
				console.log(res)
			}
		})

	}
});