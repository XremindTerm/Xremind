# Xremind

### 数据库设计
1.reminders表

字段名	|类型	|注释
:------:|:-----:|--------------------------------
id		|key	|索引
data	|text	|存放提醒项目的参数(JSON格式)
count	|int	|项目持续的天数
target	|int	|项目下次提醒的天数
interval|int 	|下次提醒间隔
status	|varchar|标记提醒项目状态：wait|action|done
