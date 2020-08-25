import router from '@system.router';
import geolocation from '@system.geolocation';
export default{
    data: {
        time: 0,
        percnet: 0,
        totalTime: 0,
        skip:"skip"
    },
    onShow(){
        const context = this;
        FeatureAbility.subscribeMsg({
            success: function(data) {
                console.log(data.message);
                if(data.message.split("-")[0] === "ready"){
                    context.totalTime = parseInt(data.message.split("-")[1]);
                    context.time = context.totalTime;
                    context.percnet = (context.totalTime - context.time) / context.totalTime * 100
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
    goIndex(){
        router.replace ({
            uri : "pages/start/start"
        });
    },
    onAniStop(){
        this.goIndex();
    },
    delay(context){
        if(context.time > 0){
            console.log("" + context.time);
            setTimeout(function(){
                geolocation.getLocation({
                    success: function(data) {
                        console.log( context.totalTime + "|" + data.time);
                        context.time -= 1;
                        context.percnet = (context.totalTime - context.time) / context.totalTime * 100
                        context.delay(context);
                    },
                    fail: function(data, code) {
                        console.log("fail to get location. code:" + code);
                    }
                })
            },1000);
        } else {
            this.onAniStop();
        }
    },
    clickSkip(){
        const context = this;
        FeatureAbility.sendMsg({
            deviceId: 'remote',
            bundleName: 'homeworkout.homeworkouts.noequipment',
            abilityName: 'com.huawei.hiwearkit.sdk',
            message: this.skip,
            success: function() {
                context.goIndex();
                console.log('FA has been installed.');
            },
            fail: function(data, code) {
                console.log('handing fail, message: ' + data + ', code: ' + code);
            } 
        });
    }
    
}