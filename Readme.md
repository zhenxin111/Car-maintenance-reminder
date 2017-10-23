## 作业实现主题
> 设计⼀个脚本来统计提醒⻋辆保养情况。汽⻋保养分为每⼀万公⾥保养和定期保养两种，另外汽⻋除保养之外，达到⼀定条件，则会进⼊报废。

### 每1万公⾥保养提醒规则如下：
+ 汽⻋每跑1万公⾥(含)就要保养⼀次，距离1万公⾥还差500公⾥(含)的时候就要开始提醒
+ 为了简化规则，不需考虑未及时保养或者重复保养的场景，以及不需考虑上次实际保养时间和⼤修时间

### 定期保养提醒规则如下：
+ 3年以下⻋辆每12个⽉定期保养⼀次
+ 3年及以上⻋辆每6个⽉定期保养⼀次
+ 若⻋辆有⼤修，则每3个⽉就需要定期保养⼀次
+ 定期保养全部提前⼀个⽉开始提醒，直到需要保养的那天(含)为⽌
+ 在计算⽉份时，只需考虑⽉份，不需考虑⽇期，如07⽉31⽇和8⽉1⽇之间也差⼀个⽉，在计算年份时，只需要考虑年份，不需考虑⽉和⽇，如2016年12⽉31⽇和2017年1⽉1⽇也认为相差⼀年。
+ 为了简化规则，不需考虑未及时保养或者重复保养的场景，以及不需考虑上次实际保养时间和⼤修时间

### ⻋辆报废规则如下：
+ ⼀般⻋辆6年（据购买⽇期加6*365=2190天）开始报废
+ 若⻋辆有⼤修，报废年限降为3年（据购买⽇期加3*365=1095天）
+ 报废⻋辆提前⼀个⽉开始提醒（提前⼀个⽉提醒，不需要考虑⽇，⽐如 03⽉28⽇ ⻋辆报废，那么 02⽉01⽇ 即可开始提醒）

### 注意：
+ 如果⻋辆已经开始提醒报废或已经报废，则⽆需保养
+ 如果⻋辆同时需要每1万公⾥保养和定期保养，则按每1万公⾥保养计

## 作业使用说明

### 文件内容

本作业包含三个文件：
+ index.html 作业程序入口
+ carReminder.js javascript程序实现
+ Readme.txt 作业说明

### 使用步骤：

+ 作业上传形式为压缩包，解压至文件夹；
+ 作业程序入口文件为index.html，可右击使用Chrome浏览器打开（也可以是其他主流浏览器）；
+ 本作业使用网页的表单输入方式，进行交互测试；
+ 只需将测试用例复制粘贴至表单内，点击提交按钮，即可得到程序输出结果；
+ 重复测试前，点击"清空输出"按钮，清空上一次的输出内容；


