const express=require('express');
const app=express();
const ejs=require('ejs');
const db=require('./model/db.js');
const md5=require('md5');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// 转化id的类型
const ObjectId=require('mongodb').ObjectId;

const http=require('http').Server(app);
const io=require('socket.io')(http);

// session
var session = require('express-session');
// 持久化
var NedbStore = require('nedb-session-store')( session );
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:20000000
    },
    // 配置持久化
    store: new NedbStore({
        filename: 'path_to_nedb_persistence_file.db'
    })
}));

app.set('view engine','ejs');
app.use('/public',express.static('./public'));
app.get(`/`,(req,res)=>{
    res.render('register')
});
app.get(`/register`,(req,res)=>{
    res.render('register')
});
app.get(`/create`,(req,res)=>{
    console.log(req.session.user);
    if(req.session.login){
        db.find('blog','review',{},res,(a)=>{
            for(var j=0;j<a.length;j++){
                if(a[j].praiseWho.indexOf(req.session.user) !== -1){
                    a[j].color='yyj';
                }
                else{
                    a[j].color='false';
                }
            }

                res.render('create',{user:req.session.user,list:a.splice(0,8)})


        },{time:-1})
    }
    else{
        res.render('login')
    }
});

app.get(`/login`,(req,res)=>{
    res.render('login')

});
app.get(`/user`,(req,res)=>{
    var user=req.query.param1;

    db.find('blog','User',{name:user},res,function(res1){
        console.log(res1);
        // res1得到的是查询之后的数据，数组。
        if(res1.length==0){
            res.send({"status":"ok"});
        }else{
            res.send({"status":"用户名已存在"})
        }
    },{time:-1})
});

app.get('/save',(req,res)=>{
    req.session.user=req.query.name;
    req.session.login=true;
    var user = req.query.name;
    var pass = req.query.pass;
    var aboutMe = req.query.aboutMe;
    db.insert('blog','User',{name:user,pass:md5(md5(pass)),aboutMe:aboutMe},res,function () {
        res.send({'status':'注册数据插入成功'});
    })
});

app.post('/proving',urlencodedParser,(req,res)=>{
    var user=req.body.user;
    var pass=req.body.pass;
    req.session.user=req.body.user;
    req.session.login=true;
    db.find('blog','User',{name:user,pass:md5(md5(pass))},res,function (res1) {
        if(res1.length==0){
            res.send({'status':'用户不存在'})
        }
        else{
            res.send({'status':'匹配用户成功'})
        }

    })
});

app.get('/quit',(req,res)=>{
    req.session.user=null;
    req.session.login=false;
    res.redirect('http://localhost:8989/login/')
});

//评论发布
app.post('/blog',urlencodedParser,(req,res)=>{
   var title=req.body.title;
   var content=req.body.content;
   var time=req.body.time;
   var review=req.body.review;
   var zan=req.body.zan;
   var author=req.body.author;
   db.insert('blog','review',{author:author,title:title,content:content,time:time,review:review,zan:zan,praiseWho:[],aboutRev:[]},res,function (a) {
       res.send({id:a.ops[0]._id});
   })
});

//点赞+1
app.post('/praiseAdd',urlencodedParser,(req,res)=>{
   var praiseWho=req.body.user;
   var praiseNum=req.body.number;
   var dataid=ObjectId(req.body.id);
    var praiseNumber=parseInt(praiseNum);

    db.update('blog','review',{_id:dataid},res,{$set:{zan:praiseNumber}},function () {
        res.send({'status':'更新数据成功'});
    });
    db.update('blog','review',{_id:dataid},res,{$addToSet:{praiseWho:praiseWho}},function () {
    })
});

//点赞-1
app.post('/praiseDel',urlencodedParser,(req,res)=>{
    var praiseWho=req.body.user;
    var dataid=ObjectId(req.body.id);
    var praiseNum=req.body.number;
    var praiseNumber=parseInt(praiseNum);

    db.update('blog','review',{_id:dataid},res,{$set:{zan:praiseNumber}},function () {
        res.send({'status':'更新数据成功'});
    });
    db.update('blog','review',{_id:dataid},res,{$pull:{praiseWho:praiseWho}},function () {
    })
});


//评论增删事件
app.post('/reviewAdd',urlencodedParser,(req,res)=>{
    var dataid=ObjectId(req.body.id);
    var reviewNum=parseInt(req.body.reviewNumber);

    db.update('blog','review',{_id:dataid},res,{$set:{review:reviewNum}},function () {
        res.send({'status':'更新数据成功'});
        console.log(typeof(dataid));
    });

    db.update('blog','review',{_id:dataid},res,{$addToSet:{aboutRev:{
        reviewPer:req.body.reviewPer,
        reviewCon:req.body.reviewCon,
        reviewTime:req.body.reviewTime,
            }}},function () {
    })

});

//加载更多数据
app.post('/loadMore',urlencodedParser,(req,res)=>{
   var length=req.body.length;
   db.find('blog','review',{},res,(a)=>{
       res.send({ok:true,list:a.splice(length,8),length:length})
   },{time:-1});
});


io.on('connection',(socket)=>{
    console.log('connect');
    // 接收数据，第一个参数：本次连接名字。第二个参数：收到的数据
    socket.on('chat',(msg)=>{
        io.emit('send',msg);
    })
});

http.listen('8989','localhost',()=>{
    console.log("server is running!")
});