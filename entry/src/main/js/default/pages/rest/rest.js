import router from '@system.router';
import geolocation from '@system.geolocation';
export default{
    data: {
        add: "add",
        skip: "skip",
        text: "0",
        time: 0,
        percnet: 0,
        totalTime: 0
    },
    onShow(){
        this.initData();
    },
    initData(){
        const context = this;
        FeatureAbility.subscribeMsg({
            success: function(data) {
                console.log(data.message);
                if(data.message.split("-")[0] === "rest"){
                    context.totalTime = parseInt(data.message.split("-")[1]);
                    context.time = context.totalTime;
                    context.text = context.convertedTime(context.time);
                    context.delay(context);
                }else{
                    console.log("bad" );
                }
            },
            fail: function(data, code) {
                console.log('handing fail, message: ' + data + ', code: ' + code);
            }
        });
    },
    addTime(){
        this.totalTime += 20;
        this.time += 20;
    },
    sendMessage(text){
        FeatureAbility.sendMsg({
        deviceId: 'remote',
        bundleName: 'homeworkout.homeworkouts.noequipment',
        abilityName: 'com.huawei.hiwearkit.sdk',
        message: text,
        success: function() {
            console.log('FA has been installed.');
        },
        fail: function(data, code) {
            console.log('handing fail, message: ' + data + ', code: ' + code);
        } 
        });
    },
    clickAdd(){
        this.sendMessage(this.add);
        this.addTime();
    },
    clickSkip(){
        this.sendMessage(this.skip);
        this.skipToStart();
    },
    skipToStart(){
        router.replace({
            uri: "pages/start/start"
        })
    },
    delay(context){
        if(context.time > 0){
            setTimeout(function(){
                geolocation.getLocation({
                    success: function(data) {
                        console.log("" + context.time + "|" + context.totalTime);
                        context.time -= 1;
                        context.text = context.convertedTime(context.time);
                        context.percnet = (context.totalTime - context.time) / context.totalTime * 100
                        context.delay(context);
                    },
                    fail: function(data, code) {
                        console.log("fail to get location. code:" + code);
                    }
                })
            },1000);
        } else {
            this.skipToStart();
        }  
    },
    convertedTime(time){
        var min = "00";
        var sec = "00";
        if(parseInt(time / 60) < 10){
            min = "0" + parseInt(time / 60);
        }else{
            min = "" + parseInt(time / 60);
        }
        if(time % 60 < 10){
            sec = "0" + (time % 60);
        }else{
            sec = "" + (time % 60);
        }
        return min + ":" + sec
    }
}