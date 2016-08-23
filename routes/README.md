# API 描述

##用户模块

登录	|/user/login
:------:|-------------
get		|render('login')
post	|jsonp
nickname|用户昵称,长度不能少于4
password|用户密码，长度不能少于4

注册	|/user/register
:------:|-------------
get		|render('register')
post	|jsonp
nickname|用户昵称,长度不能少于4
usermail|用户邮箱
password|用户密码，长度不能少于4

注销	|/user/logout
:------:|-------------
get		|redirect('login')
post	|redirect('login')

## 任务模块

显示任务    |/reminder/list/:nav
:------:|-------------
action  |今日任务
wait    |待完成任务
done    |已完成任务

任务操作    |/reminder/:shortid/:opt
:------:|-------------
detail  |查看指定任务细节
delete  |删除指定任务
done    |结束指定任务
remember|完成指定任务（当天）
enhance |需加强指定任务（当天）