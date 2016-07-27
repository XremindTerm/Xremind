# API 描述

##用户模块

登录	|/users/login
:------:|-------------
get		|render('login')
post	|jsonp
nickname|用户昵称,长度不能少于4
password|用户密码，长度不能少于4

注册	|/users/register
:------:|-------------
get		|render('register')
post	|jsonp
nickname|用户昵称,长度不能少于4
usermail|用户邮箱
password|用户密码，长度不能少于4

注销	|/users/logout
:------:|-------------
get		|redirect('login')
post	|redirect('login')