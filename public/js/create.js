$('.menu img').click(function(event) {
    $('.menu ul').slideToggle(100)
});

$('.re-log').click(function () {
    alert('确认退出？');
    location.href='http://localhost:8989/quit/'
});

//页面加载时点赞的颜色渲染
function load(){
    for(var k=0;k<$('.my-li').length;k++){
        if($('.my-li').eq(k).children('.clearfix').children('.zan').children('.yj-hidden').html()==='yyj'){
            $('.my-li').eq(k).children('.clearfix').children('.zan').children('.my-zan').addClass('praise')
        }
    }

}
load();
//标题失去焦点事件

$('.my-title').blur(function () {
    if($('.my-title').val()==''){
        $('.title-tip').html('请输入标题');
        $('.title-tip').css('color','red');
    }
    else{
        $('.title-tip').html('');
    }
});

//博客内容失去焦点事件
$('.my-content').blur(function () {
    if($('.my-content').val()==''){
        $('.content-tip').html('请输入内容');
        $('.content-tip').css('color','red');
    }
    else{
        $('.content-tip').html('');
    }
});

//发布事件
var judge=true;
let socket =io();
$('.yj-submit').click(function (e) {
        e.preventDefault();
        if ($('.my-title').val()=='') {
            $('.title-tip').html('请输入标题');
            $('.title-tip').css('color','red');
            judge=false;
        }
        else{
            judge=true
        }
        if ($('.my-content').val()==''){
            $('.content-tip').html('请输入内容');
            $('.content-tip').css('color','red');
            judge=false;
        }
        else{
            judge=true
        }
        if(judge){
            var str=tim();
            socket.emit('chat', {user:$('.author').html(),title: $('.my-title').val(), content: $('.my-content').val(), time: str,zan:0,review:0});

            $.ajax({
                url:'http://localhost:8989/blog',
                type:'post',
                dataType:'json',
                data:{author:$('.author').html(),title:$('.my-title').val(),content:$('.my-content').val(),time:str,review:0,zan:0},
                success:function (res) {
                    if($('.data-id').html()==='_id'){
                        console.log('判断成功！');
                        console.log(res.id);
                        $('.data-id').eq(0).html(res.id);
                        $('.yj-ul').children('.my-li:last-child').remove();
                    }
                }
            });
            $('.my-title').val('');
            $('.my-content').val('');
        }
    }
);

socket.on('send',(msg)=>{

    var tag=$(`<li class="my-li"><span class="data-id">_id</span><span class="blog-author">${msg.user}:</span><span class="blog-title">${msg.title}</span><p class="blog-content">${msg.content}</p><div class="clearfix"><div class="time">${msg.time}</div><div class="review"><span class="glyphicon glyphicon-comment my-review"></span><span class="review-num">${msg.review}</span></div><div class="zan"><p class="yj-hidden">?</p><span class="glyphicon glyphicon-thumbs-up my-zan"></span> <span class="zan-number">${msg.zan}</span></div></div><div class="add"><div class="rev"><input type="text" placeholder="请输入评论" class="input-rev" onblur="yjblur(this)"><button class="btn btn-primary sub" onclick="subm(this)">发布</button></div><ul class="list-unstyled addUl"></ul></div></li>`);

    $('.yj-ul').prepend(tag);
});

function subm(a){
    if($(a).siblings('.input-rev').val()===''){
        $(a).siblings('.input-rev').css('border','1px solid red')
    }
    else{

        var str=tim();
        var tag1=$(`<li><span class="review-person">${$('.author').html()}:</span><span class="review-con">${$(a).siblings('.input-rev').val()}</span><span class="review-time">${str}</span></li>`);

        $(a).parent().parent('.add').children('ul').append(tag1);

        //评论发布前的评论数
        var reviewNum = $(a).parent().parent().parent().children('.clearfix').children('.review')
            .children('.review-num').html();

        //评论发布后的评论数
        $(a).parent().parent().parent().children('.clearfix').children('.review')
            .children('.review-num').html(parseInt(reviewNum)+1);

        var reviewNumber = $(a).parent().parent().parent().children('.clearfix').children('.review')
            .children('.review-num').html();

        $.ajax({
            url:'http://localhost:8989/reviewAdd',
            dateType:'json',
            type:'post',
            data:{id:$(a).parent().parent().parent().children('.data-id').html(),reviewPer:$('.author').html(),reviewCon:$(a).parent('.rev').children('.input-rev').val(),reviewTime:str,reviewNumber:reviewNumber},
            success:function () {
                console.log('yes');
            }
        });

        $(a).parent('.rev').children('.input-rev').val('');
    }
}


function yjblur() {
    if($('.input-rev').val()===''){
        console.log("请输入评论内容!")
    }
}


//点赞事件委托
$(".yj-ul").delegate(".my-zan","click",function (e) {

    if($(this).css('color')==='rgb(80, 80, 80)'){
        $(this).css('color','red');
        $(this).parent().children('.zan-number').html(parseInt($(this).parent().children('.zan-number').html())+1);
        $.ajax({
            url:'http://localhost:8989/praiseAdd',
            type:'post',
            dataType: 'json',
            data:{id:$(this).parent().parent().parent().children('.data-id').html(),user:$('.author').html(),number:$(this).parent().children('.zan-number').html()},
            success:function () {

            }
        })
    }
    else{
        $(this).css('color','#505050');
        $(this).parent().children('.zan-number').html(parseInt($(this).parent().children('.zan-number').html())-1);
        $.ajax({
            url:'http://localhost:8989/praiseDel',
            type:'post',
            dataType: 'json',
            data:{id:$(this).parent().parent().parent().children('.data-id').html(),user:$('.author').html(),number:$(this).parent().children('.zan-number').html()},
            success:function () {

            }
        })
    }
});

//评论事件委托
$('.yj-ul').delegate(".my-review","click",function (e) {
    if($(this).parent().parent().parent().children('.add').css('display')==='none'){
        $(this).parent().parent().parent().children('.add').css('display','block');
    }
    else{
        $(this).parent().parent().parent().children('.add').css('display','none');
    }
});

//点击加载更多事件


// 懒加载事件，窗口滚动事件
// $(window).scroll(function (event) {
//     // console.log($(document).scrollTop());
//     // console.log($('.my-li').eq(parseInt($('.my-li').length) - 6).offset().top);
//     if($(document).scrollTop()>$('.my-li').eq(parseInt($('.my-li').length) - 6).offset().top){
//         console.log("超出咯")
//         $.ajax({
//             url:'http://localhost:8989/loadMore',
//             type:'post',
//             dataType:'json',
//             data:{length:$('.my-li').length},
//             success:function (res) {
//                 if(res.ok){
//                     for(var i=0;i<res.list.length;i++){
//                         if(res.list[i].praiseWho.indexOf($('.author').html()) !== -1){
//                             res.list[i].color='yyj';
//                         }
//                         else{
//                             res.list[i].color='false';
//                         }
//
//                         var tag=$(`<li class="my-li"><span class="data-id">${res.list[i]._id}</span><span class="blog-author">${res.list[i].author }:</span><span class="blog-title">${res.list[i].title}</span><p class="blog-content">${res.list[i].content}</p><div class="clearfix"><div class="time">${res.list[i].time}</div><div class="review"><span class="glyphicon glyphicon-comment my-review"></span><span class="review-num">${res.list[i].review}</span></div><div class="zan"><p class="yj-hidden">${res.list[i].color}</p><span class="glyphicon glyphicon-thumbs-up my-zan"></span> <span class="zan-number">${res.list[i].zan}</span></div></div><div class="add"><div class="rev"><input type="text" placeholder="请输入评论" class="input-rev" onblur="yjblur(this)"><button class="btn btn-primary sub" onclick="subm(this)">发布</button></div><ul class="list-unstyled addUl"></ul></div></li>`);
//
//                         $('.yj-ul').append(tag);
//                     }
//                     for(var j=0;j<res.list.length;j++){
//                         if($('.yj-hidden').eq(parseInt(res.length)+j).html()==='yyj'){
//                             $('.my-zan').eq(parseInt(res.length)+j).addClass('praise')
//                         }
//                     }
//                 }
//             }
//         })
//     }
// });

//时间格式
function tim() {
    var date = new Date();
    //月
    if((date.getMonth()+1)<10){
        var month = '0'+(date.getMonth()+1)
    }
    else{
        var month = (date.getMonth()+1)
    }
    //日格式
    if(date.getDay()<10){
        var day = '0'+date.getDate();
    }
    else{
        var day = date.getDate()
    }
    //时格式
    if(date.getHours()<10){
        var hour = '0'+date.getHours();
    }
    else{
        var hour = date.getHours()
    }
    //分钟格式
    if(date.getMinutes()<10){
        var minute = '0'+date.getMinutes();
    }
    else{
        var minute = date.getMinutes()
    }
    //秒钟格式
    if(date.getSeconds()<10){
        var second = '0'+date.getSeconds();
    }
    else{
        var second = date.getSeconds();
    }
    var str = date.getFullYear() + '/' + month + '/' + day + '-' + hour + ':' + minute +':'+second;
    return(str)
}


//节流
function throttle (func, wait) {
    let lastTime = null
    let timeout
    return function () {
        let context = this
        let now = new Date()
        // 如果上次执行的时间和这次触发的时间大于一个执行周期，则执行
        if (now - lastTime - wait > 0) {
            // 如果之前有了定时任务则清除
            if (timeout) {
                clearTimeout(timeout)
                timeout = null
            }
            func.apply(context, arguments)
            lastTime = now
        } else if (!timeout) {
            timeout = setTimeout(() => {
                // 改变执行上下文环境
                func.apply(context, arguments)
            }, wait)
        }
    }
}

// 由于闭包的存在，调用会不一样
let throttleRun = throttle(() => {
    if($(document).scrollTop()>$('.my-li').eq(parseInt($('.my-li').length) - 6).offset().top){
        console.log("超出咯")
        $.ajax({
            url:'http://localhost:8989/loadMore',
            type:'post',
            dataType:'json',
            data:{length:$('.my-li').length},
            success:function (res) {
                if(res.ok){
                    for(var i=0;i<res.list.length;i++){
                        if(res.list[i].praiseWho.indexOf($('.author').html()) !== -1){
                            res.list[i].color='yyj';
                        }
                        else{
                            res.list[i].color='false';
                        }

                        var tag=$(`<li class="my-li"><span class="data-id">${res.list[i]._id}</span><span class="blog-author">${res.list[i].author }:</span><span class="blog-title">${res.list[i].title}</span><p class="blog-content">${res.list[i].content}</p><div class="clearfix"><div class="time">${res.list[i].time}</div><div class="review"><span class="glyphicon glyphicon-comment my-review"></span><span class="review-num">${res.list[i].review}</span></div><div class="zan"><p class="yj-hidden">${res.list[i].color}</p><span class="glyphicon glyphicon-thumbs-up my-zan"></span> <span class="zan-number">${res.list[i].zan}</span></div></div><div class="add"><div class="rev"><input type="text" placeholder="请输入评论" class="input-rev" onblur="yjblur(this)"><button class="btn btn-primary sub" onclick="subm(this)">发布</button></div><ul class="list-unstyled addUl"></ul></div></li>`);

                        $('.yj-ul').append(tag);
                    }
                    for(var j=0;j<res.list.length;j++){
                        if($('.yj-hidden').eq(parseInt(res.length)+j).html()==='yyj'){
                            $('.my-zan').eq(parseInt(res.length)+j).addClass('praise')
                        }
                    }
                }
                if(res.list.length<8){
                    $('.load-data').html('到底部了！')
                }
            }
        })
    }

}, 600);
window.addEventListener('scroll', throttleRun);


$(window).scroll(function () {
    var height=(document.documentElement.clientHeight == 0) ? document.body.clientHeight : document.documentElement.clientHeight;
    if($(document).scrollTop()>height){
        $('.scroll').slideDown(200);
    }
    else{
        $('.scroll').slideUp(200);
    }
});

//回到顶部点击事件
$('.scroll').click(function () {
    $('html,body').animate({
        scrollTop: 0
    }, 800);
    $('.scroll').css('display','none')
});