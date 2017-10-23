/**
 * Created by zhen on 2017/10/15.
 */
function clearInfo(){
    var output = document.getElementById("output");
    output.innerHTML = " ";
}
function CarInfo(){
    var info = document.getElementsByTagName("textarea")[0].value;
    var output = document.getElementById("output");
    var line=info.split("\n");


    //提取当前时间
    var date = line[0].split(" ");
    var submitdate = new Date(date[date.length-1]);

    line.shift();
    //将汽车信息存入对象
    var cars =[];
    for(var i =0; i< line.length;i++){
        var carinfo = line[i].split("|");
        cars[i]={};
        cars[i].license = carinfo[0];
        cars[i].purchaseDate = carinfo[1];
        cars[i].brand = carinfo[2];
        cars[i].runMiles = carinfo[3];
        cars[i].overhaul = carinfo[4];
    }

    //待报废车辆信息
    var w = writeOff(cars,submitdate);
    var writeoffCar = w[0];
    var writeoffedCar = w[1];

    //提醒每一万公里保养的车辆
    var distancerelatedCar = distanceRelated(cars);

    //提醒定期保养的车辆信息
    var timerelatedCar = timeRelated(cars,submitdate);

    //已经开始提醒报废的车辆，无需保养
    for(var i=0;i<writeoffedCar.length; i++){
        var writeCar = writeoffedCar[i];
        for(var j =0; j<distancerelatedCar.length;j++){
            var disCar = distancerelatedCar[j];
            if(writeCar.license == disCar.license){
                distancerelatedCar.splice(j,1);
            }
        }
        for(var k = 0;k<timerelatedCar.length;k++){
            var timeCar =timerelatedCar[k];
            if(writeCar.license == timeCar.license){
                timerelatedCar.splice(k,1);
            }
        }
    }
    //同时需要定期保养和每一万公里保养，按每一万公里计
    for(var n = 0; n<distancerelatedCar.length;n++){
        var disCar = distancerelatedCar[n];
        for(var k = 0;k<timerelatedCar.length;k++){
            var timeCar =timerelatedCar[k];
            if(disCar.license == timeCar.license){
                timerelatedCar.splice(k,1);
            }
        }
    }

    //排序输出提醒信息
    var str = "Reminder<br>==================<br>* Time-related maintenance coming soon...<br>"+outputFormat(timerelatedCar)+"<br><br>* Distance-related maintenance coming soon...<br>"+outputFormat(distancerelatedCar)+"<br><br>* Write-off coming soon...<br>"+outputFormat(writeoffCar);
//
    output.innerHTML = str;

}

//
function outputFormat(carinfo){
    var carinfo = brandSort(carinfo);
    var car1 = [];
    for(var i=0; i<carinfo.length;i++){
        var val = 1;
        var brand1 = carinfo[i].brand;
        var _car = [];   //新对象
        var str ="";
        _car.push(carinfo[i].license);

        for(var j = i+1;j<carinfo.length;){
            var brand2 = carinfo[j].brand;
            if(brand1 == brand2){
                val++;
                _car.push(", "+carinfo[j].license);
                //
                carinfo.splice(j,1);
            }else{
                j++;
            }
        }

        for(var k= 0 ;k<_car.length;k++){
            str += _car[k];
        }
        car1.push(brand1+": "+val+" ("+str+")");

    }
    var str1 = "";
    for(var n =0;n<car1.length;n++){
        str1 += car1[n]+"<br>";
    }
    return str1;
}
//需要提醒定期保养的车辆
function timeRelated(cars,submitdate){
    var timerelated = [];
    for(var car in cars){
        //购买日期
        var purchaseDate = new Date(cars[car].purchaseDate);
        var buydateY = purchaseDate.getFullYear();
        var buydateM = purchaseDate.getMonth()+1;
        var buydateD = purchaseDate.getDate();


        //当前日期
        var newtimeY = submitdate.getFullYear();
        var newtimeM = submitdate.getMonth()+1;
        var newtimeD = submitdate.getDate();

        //两个日期间相差月数
        var months = monthDiff(submitdate,purchaseDate);
//            var overtime = transferCouponValueTime();

        if(cars[car].overhaul == "T"){//有大修，每三个月保修一次

            if((months+1)%3 == 0 || (newtimeD <= buydateD && months%3 == 0) ){ //提前一个月可开始提醒，前一个月不用比较日期；当月，日在需要保养当天前
                var c = {
                    "license":cars[car].license,
                    "brand":cars[car].brand
                };
                timerelated.push(c);

            }
        }else{
            if(newtimeY - buydateY < 3){//3年以下，每12个月定期保养一次
                if((months+1)%12 == 0 || (newtimeD <= buydateD && months%12 == 0) ){ //提前一个月可开始提醒，前一个月不用比较日期；当月，日在需要保养当天前
                    var c = {
                        "license":cars[car].license,
                        "brand":cars[car].brand
                    };
                    timerelated.push(c);

                }

            }else if(newtimeY - buydateY >= 3){
                if((months+1)%6 == 0 || (newtimeD <= buydateD &&  months%6 == 0) ){ //提前一个月可开始提醒，前一个月不用比较日期；当月，日在需要保养当天前
                    var c = {
                        "license":cars[car].license,
                        "brand":cars[car].brand
                    };
                    timerelated.push(c);

                }
            }
        }

    }
    return timerelated;
}

//需要提醒每1公里保养的车辆
function distanceRelated(cars){
    var distancerelated = [];

    for(var car in cars){
        if(cars[car].runMiles <= 10000){
            if(cars[car].runMiles >= (10000-500) && cars[car].runMiles <= 10000){
                var c = {
                    "license":cars[car].license,
                    "brand":cars[car].brand
                };
                distancerelated.push(c);
            }
        }else if((cars[car].runMiles%10000) >= (10000-500) && (cars[car].runMiles%10000) <= 10000){
            var c = {
                "license":cars[car].license,
                "brand":cars[car].brand
            };
            distancerelated.push(c);

        }
    }
    return distancerelated;
}

//需要提醒报废的车辆
function writeOff(cars,submitdate){
    var writeoff =[];
    var writeoffed =[]; //提醒报废和已报废车辆信息收集


    for (var car in cars){
//            alert(cars[car]);
//            alert(cars[car].overhaul);
        if(cars[car].overhaul == "T" ){//如果车辆有大修，3年后开始报废
            var overtime = new Date(transferCouponValueTime(cars[car].purchaseDate,3*365));
        }else{ //如果车辆无大修，6年后开始报废
            var overtime = new Date(transferCouponValueTime(cars[car].purchaseDate,6*365));
        }
        //截止日期的月份
        var overtimeY = overtime.getFullYear();
        var overtimeM = overtime.getMonth()+1;
        var overtimeD = overtime.getDate();
        //当前月份
        var newtimeY = submitdate.getFullYear();
        var newtimeM = submitdate.getMonth()+1;
        var newtimeD = submitdate.getDate();

        var c = {
            "license":cars[car].license,
            "brand":cars[car].brand
        };

        //当前年份等于截止日期年份时，比较月份；大于截至年份时直接报废，直接提醒报废
        if(newtimeY == overtimeY){
            if(((newtimeM == overtimeM) && (newtimeD < overtimeD)) || newtimeM == (overtimeM-1)  ){ //需要注意的是，根据测试用例结果：到达报废日期后，不再进行提醒,即报废提醒是存在于：报废时间前一个月——————报废时间日（不含）
                writeoff.push(c);
                writeoffed.push(c);
            }else if(newtimeM == overtimeM && newtimeD >= overtimeD){
                writeoffed.push(c);
            }else if(newtimeM > overtimeM){
                writeoffed.push(c);
            }
        }else if(newtimeY > overtimeY){

            writeoffed.push(c);
        }

    }
    var write = new Array(writeoff,writeoffed); //返回两个数组值
    return write;
}

//计算起始日期加上有效日期的截止日期
function transferCouponValueTime(startDate,valueTime){
    var date = new Date(startDate);
    var newDate = new Date(date.getFullYear(),date.getMonth(),date.getDate()+valueTime);

    return newDate.Format("yyyy-MM-dd");

}

// 将时间戳格式转换
Date.prototype.Format = function(fmt){
    var o = {
        "M+": this.getMonth()+1, // 月份
        "d+": this.getDate()   //日期
    };
    if(/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
    for(var k in o){
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;

}

//计算两个日期的月数差
function monthDiff(date1,date2){
    var months;
    months = Math.abs(date1.getFullYear()-date2.getFullYear())*12;
    months -= date2.getMonth()+1;
    months += date1.getMonth()+1;
    return months;

}
//计算两个日期的天数差
function dateDiff(date1,date2){
    var d1 = Date.parse(date1);
    var d2 = Date.parse(date2);
    var days = Math.abs((d1-d2))/1000/60/60/24;
    return days;
}
//车牌按首字母顺序排列
function brandSort(carinfo){
    var compare = function(obj1,obj2){
        var b1 = obj1.brand;
        var b2 = obj2.brand;
        if(b1 < b2){
            return -1;
        }else if(b1 > b2){
            return 1;
        }else{
            return 0;
        }
    };
    return carinfo.sort(compare);
}