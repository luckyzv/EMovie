# MovieP

基于Scott老师视频所做的项目

所使用的技术点：
`Express`，`pug`，`Mongodb`，`grunt`，`bootstrap`，`jquery`等

实现了如下功能：

（1）登录/注册功能。使用Mongodb存储用户信息到users集合中

（2）session记录。使用express-session来保存session到Mongodb数据库sessions集合中

（3）电影条目CRUD。使用Mongoose操作数据库实现电影条目增加、电影搜索、电影条目删除、电影条目更新

（4）评论功能。用户登陆后可对电影进行评论，也可对其他用户进行评论回复

（5）电影分类功能。可以对电影按照类别进行分类

（6）分页功能。对多个电影条目进行分页展示。

目前仍处于不完善阶段，日后会逐渐更新。

### 项目执行

电脑需有Node、Npm

`npm install grunt` 安装前端打包工具
`npm install` 安装依赖
执行 `> grunt`

打开浏览器。http://localhost:3000