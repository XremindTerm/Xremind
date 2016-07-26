# Xremind

### 数据库设计
1.reminders表

字段名	|类型		|注释
:------:|:---------:|--------------------------------
id		|int(11)	|索引(Key)
uid		|int(11)	|用户编号(FKey)
data	|text		|存放提醒项目的参数(JSON格式)
target	|varcher(15)|下次提醒时间戳
interval|varcher(15)|下次提醒间隔
status	|varchar(10)|标记提醒项目状态：wait\|action\|done


```javascript  
    var init =new Date().getTime(); //项目初次建立的时间戳
    var interval=5*60*1000;         //下次提醒的时间间隔(ms)
    var target=init+interval;       //下次提醒命中的时间戳
    setInterval(function(){
        if(new Date().getTime()>=target){  //若当前时间该提醒了
            console.log('action');
            interval=newInterval();       //更新下次更新时间
            target+=interval;		      //更新下次命中时间
        }
    },1000);
```
