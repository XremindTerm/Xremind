### 数据库设计
1.reminders表：记录记忆任务数据

字段名	|类型		|注释
:------:|:---------:|--------------------------------
id		|int(11)	|索引(Key)
uid		|int(11)	|用户编号(FKey)
data	|text		|存放记忆项目的参数(JSON格式)
target	|varchar(15)|下次提醒时间戳
create  |varchar(15)|项目建立时间戳
interval|varchar(15)|下次提醒间隔
status	|varchar(10)|标记记忆项目状态：wait(默认)\|action\|done

```javascript  
/**
 *
 * 逻辑分析：
 *    [wait]=>[action]
 *    @conditions:target<=nT && status=wait
 *    @modify:status=action,add into table `reports`

 *    [action]=>[wait]
 *    @conditions:event 记住了
 *    @modify:status=wait,target+=interval,reports status=ok

 *    @conditions:event 需加强
 *    @modify:status=wait,target+=interval,reports status=enhance

 *    @conditions:target-nT >=1000*60*60*12 && status=action //超时
 *    @modify:status=wait,target+=interval,reports status=undone

 *    [action]=>[done]
 *    @conditions:event 完成
 *    @modify:status=done
 
 *    [action]=>[delete]
 *    @conditions:event 删除
 *    @modify:delete thsi reminder
 *
 */
```

2.users表：记录用户数据

字段名  |类型       |注释
:------:|:---------:|--------------------------------
id      |int(11)    |索引(Key)
usermail|varchar(30)|用户邮箱
password|varchar(35)|用户密码(MD5)
nickname|varchar(30)|用户昵称
img     |varchar(30)|用户头像

3.reports表：记录记忆任务的完成情况

字段名  |类型       |注释
:------:|:---------:|--------------------------------
id      |int(11)    |索引(Key)
rid     |int(11)    |对应reminders的id
uid     |int(11)    |对应users的id
state   |varchar(20)|执行情况，默认undone
fulfill |varchar(15)|任务生效/完成时间
