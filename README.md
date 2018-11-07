# blog
微博发布介绍(https://yangyaoj.github.io/blog/)

1.前端运用bootstrap框架配合媒体查询以及模板引擎完成。

2.此源码实现微博发表，有用户注册，用户登录和微博发表3个界面构成。

3.运用了node.js中的npm包管理工具，用到的模块包括http,body-parser,express,express-session,md5,mongodb,nedb-session-store,scoket.io以及模板引擎以及使用到数据库mongodb

4.整个流程为：先注册账号，通过ajax把注册信息发送到服务器，服务器把注册信息存储到浏览器session文件和数据库中，然后跳转到微博发表界面（create.ejs），在session设置的有效期内当前用户可以直接跳到微博发布界面（create.js）,微博发布界面中实现微博发表，点赞和评论功能，页面滚动用了函数节流实现了懒加载

5.相关界面：localhost/register(用户注册)，localhost/login(登录界面)，localhost/create(微博发布)

6.使用步骤1：下载并安装node.js.参考网址：https://www.cnblogs.com/zhouyu2017/p/6485265.html

7.使用步骤2：下载mongoDB并安装。参考网址；http://www.runoob.com/mongodb/mongodb-window-install.html

8.使用步骤3：在根目录下(如： C:\ 或者 D:\ 等 )创建data文件夹，然后再data文件夹下创建db文件夹，然后在mongoDB安装目录的bin目录中通过shift+鼠标右键打开命令行，然后输入mongod --dbpath 前面创建的数据文件的地址（例如：c:\data\db）连接到数据库，保持开启状态

9.使用步骤4：把此源码下载解压后在当前目录下通过shift+鼠标右键打开命令行执行node app.js开启服务器

10.使用步骤5：浏览器打开localhost:8989/register注册账号并体验！
