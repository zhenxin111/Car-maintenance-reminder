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


    //��ȡ��ǰʱ��
    var date = line[0].split(" ");
    var submitdate = new Date(date[date.length-1]);

    line.shift();
    //��������Ϣ�������
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

    //�����ϳ�����Ϣ
    var w = writeOff(cars,submitdate);
    var writeoffCar = w[0];
    var writeoffedCar = w[1];

    //����ÿһ���ﱣ���ĳ���
    var distancerelatedCar = distanceRelated(cars);

    //���Ѷ��ڱ����ĳ�����Ϣ
    var timerelatedCar = timeRelated(cars,submitdate);

    //�Ѿ���ʼ���ѱ��ϵĳ��������豣��
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
    //ͬʱ��Ҫ���ڱ�����ÿһ���ﱣ������ÿһ�����
    for(var n = 0; n<distancerelatedCar.length;n++){
        var disCar = distancerelatedCar[n];
        for(var k = 0;k<timerelatedCar.length;k++){
            var timeCar =timerelatedCar[k];
            if(disCar.license == timeCar.license){
                timerelatedCar.splice(k,1);
            }
        }
    }

    //�������������Ϣ
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
        var _car = [];   //�¶���
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
//��Ҫ���Ѷ��ڱ����ĳ���
function timeRelated(cars,submitdate){
    var timerelated = [];
    for(var car in cars){
        //��������
        var purchaseDate = new Date(cars[car].purchaseDate);
        var buydateY = purchaseDate.getFullYear();
        var buydateM = purchaseDate.getMonth()+1;
        var buydateD = purchaseDate.getDate();


        //��ǰ����
        var newtimeY = submitdate.getFullYear();
        var newtimeM = submitdate.getMonth()+1;
        var newtimeD = submitdate.getDate();

        //�������ڼ��������
        var months = monthDiff(submitdate,purchaseDate);
//            var overtime = transferCouponValueTime();

        if(cars[car].overhaul == "T"){//�д��ޣ�ÿ�����±���һ��

            if((months+1)%3 == 0 || (newtimeD <= buydateD && months%3 == 0) ){ //��ǰһ���¿ɿ�ʼ���ѣ�ǰһ���²��ñȽ����ڣ����£�������Ҫ��������ǰ
                var c = {
                    "license":cars[car].license,
                    "brand":cars[car].brand
                };
                timerelated.push(c);

            }
        }else{
            if(newtimeY - buydateY < 3){//3�����£�ÿ12���¶��ڱ���һ��
                if((months+1)%12 == 0 || (newtimeD <= buydateD && months%12 == 0) ){ //��ǰһ���¿ɿ�ʼ���ѣ�ǰһ���²��ñȽ����ڣ����£�������Ҫ��������ǰ
                    var c = {
                        "license":cars[car].license,
                        "brand":cars[car].brand
                    };
                    timerelated.push(c);

                }

            }else if(newtimeY - buydateY >= 3){
                if((months+1)%6 == 0 || (newtimeD <= buydateD &&  months%6 == 0) ){ //��ǰһ���¿ɿ�ʼ���ѣ�ǰһ���²��ñȽ����ڣ����£�������Ҫ��������ǰ
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

//��Ҫ����ÿ1���ﱣ���ĳ���
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

//��Ҫ���ѱ��ϵĳ���
function writeOff(cars,submitdate){
    var writeoff =[];
    var writeoffed =[]; //���ѱ��Ϻ��ѱ��ϳ�����Ϣ�ռ�


    for (var car in cars){
//            alert(cars[car]);
//            alert(cars[car].overhaul);
        if(cars[car].overhaul == "T" ){//��������д��ޣ�3���ʼ����
            var overtime = new Date(transferCouponValueTime(cars[car].purchaseDate,3*365));
        }else{ //��������޴��ޣ�6���ʼ����
            var overtime = new Date(transferCouponValueTime(cars[car].purchaseDate,6*365));
        }
        //��ֹ���ڵ��·�
        var overtimeY = overtime.getFullYear();
        var overtimeM = overtime.getMonth()+1;
        var overtimeD = overtime.getDate();
        //��ǰ�·�
        var newtimeY = submitdate.getFullYear();
        var newtimeM = submitdate.getMonth()+1;
        var newtimeD = submitdate.getDate();

        var c = {
            "license":cars[car].license,
            "brand":cars[car].brand
        };

        //��ǰ��ݵ��ڽ�ֹ�������ʱ���Ƚ��·ݣ����ڽ������ʱֱ�ӱ��ϣ�ֱ�����ѱ���
        if(newtimeY == overtimeY){
            if(((newtimeM == overtimeM) && (newtimeD < overtimeD)) || newtimeM == (overtimeM-1)  ){ //��Ҫע����ǣ����ݲ���������������ﱨ�����ں󣬲��ٽ�������,�����������Ǵ����ڣ�����ʱ��ǰһ���¡���������������ʱ���գ�������
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
    var write = new Array(writeoff,writeoffed); //������������ֵ
    return write;
}

//������ʼ���ڼ�����Ч���ڵĽ�ֹ����
function transferCouponValueTime(startDate,valueTime){
    var date = new Date(startDate);
    var newDate = new Date(date.getFullYear(),date.getMonth(),date.getDate()+valueTime);

    return newDate.Format("yyyy-MM-dd");

}

// ��ʱ�����ʽת��
Date.prototype.Format = function(fmt){
    var o = {
        "M+": this.getMonth()+1, // �·�
        "d+": this.getDate()   //����
    };
    if(/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
    for(var k in o){
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;

}

//�����������ڵ�������
function monthDiff(date1,date2){
    var months;
    months = Math.abs(date1.getFullYear()-date2.getFullYear())*12;
    months -= date2.getMonth()+1;
    months += date1.getMonth()+1;
    return months;

}
//�����������ڵ�������
function dateDiff(date1,date2){
    var d1 = Date.parse(date1);
    var d2 = Date.parse(date2);
    var days = Math.abs((d1-d2))/1000/60/60/24;
    return days;
}
//���ư�����ĸ˳������
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