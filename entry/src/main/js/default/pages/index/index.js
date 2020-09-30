import router from '@system.router';
import brightness from '@system.brightness';
import app from '@system.app';

export default{
    data: {
        timeText: "00:00",
        time: 0,
        times: 'x0',
        totalTime: 0,
        process: 0,
        text: '',
        buttonText: '',
        notStartText: '',
        showCycle: false,
        showTimes: false,
        showTotal: false,
        showText: true,
    },
    onInit: function () {
        this.notStartText = this.$t('strings.open_app');
        this.getMsg();
    },
    onReady: function() {
        this.setBrightnessKeepScreenOn();
    },
    onShow: function () {
        let _this = this;
        //保持屏幕常亮
        _this.setBrightnessKeepScreenOn();
        var timer = setInterval(function () {
            _this.setBrightnessKeepScreenOn();
        },3 * 60 * 1000);
    },
    onDestroy: function() {
        FeatureAbility.unsubscribeMsg();
    },
    setBrightnessKeepScreenOn: function() {
        brightness.setKeepScreenOn({
            keepScreenOn: true,
            success: function() {
            },
            fail: function(data, code) {
            }
        });
    },
    getMsg: function() {
        var self = this;

        FeatureAbility.subscribeMsg({
            success: function(data) {
                if(JSON.stringify(data.message) !== undefined){
                    self.showTotalFun(self);

                    var json = JSON.parse(data.message);
                    if('time' in json){
                        self.time = parseInt(json.time);
                        self.totalTime = parseInt(json.totalTime);
                        self.process = (1.0 - (self.time - 1) / self.totalTime) * 100;
                        self.timeText = self.convertedTime(self.time);
                        self.showCycleFun(self);
                        console.log('getmsg success time: ' + self.time + '|' + self.totalTime + '|' + self.process);
                    }else if ('totalTime' in json){
                        self.times = 'x' + json.totalTime;
                        self.showTimesFun(self);
                    }else if ('msg' in json){
                        self.text = json.msg;
                        self.buttonText = self.changeTextFun(self);
                        console.log('getmsg success text: ' + self.text);
                    }

                    self.showTextFun(self);
                    if (self.text === 'exit') {
                        app.terminate();
                    }
                }else {
                    console.log('getmsg undefined');
                }
                self.setBrightnessKeepScreenOn();
            },
            fail: function(data, code) {
                console.log('getmsg fail: ' + code);
            }
        });
    },
    showTotalFun: function(self){
        if(self.showTotal === false){
            self.showTotal = true;
            self.showText = false;
        }
    },
    showCycleFun: function(self){
        if(self.showCycle === false){
            self.showCycle = true;
            self.showTimes = false;
        }
    },
    showTimesFun: function(self){
        if(self.showTimes === false){
            self.showTimes = true;
            self.showCycle = false;
        }
    },
    showTextFun: function(self){
        if(self.text === 'finish'){
            self.notStartText = self.$t('strings.not_start');
            if(self.showTotal === true && self.showText === false){
                self.showCycle = false;
                self.showTimes = false;
                self.showTotal = false;
                self.showText = true;
            }
        }
        if (self.text === 'wait') {
            self.notStartText = self.$t('strings.wait');
            if(self.showTotal === true && self.showText === false){
                self.showCycle = false;
                self.showTimes = false;
                self.showTotal = false;
                self.showText = true;
            }
        }
        if (self.text === 'open') {
            self.notStartText = self.$t('strings.not_start');
            if(self.showTotal === true && self.showText === false){
                self.showCycle = false;
                self.showTimes = false;
                self.showTotal = false;
                self.showText = true;
            }
        }
    },
    changeTextFun: function(self){
        switch(self.text){
            case 'next': return self.$t('strings.next');
            case 'skip': return self.$t('strings.skip');
            case 'pause': return self.$t('strings.pause');
            case 'resume': return self.$t('strings.resume');
            case 'finish': return self.$t('strings.finish');
        }
    },
    clickButton: function(){
        if(this.text === 'resume' || this.text === 'pause' || this.text === 'skip' || this.text === 'next'){
            this.sendMsg();
        }
        this.setBrightnessKeepScreenOn();
    },
    sendMsg: function(){
        let self = this;

        FeatureAbility.sendMsg({
            deviceId : 'remote',
            bundleName: 'homeworkout.homeworkouts.noequipment',
            abilityName: 'homeworkout.homeworkouts.noequipment',
            message: self.text,
            success: function(data) {
                console.info('success sendMsg');
            },
            fail: function(data, code) {
                console.info('fail sendMsg');
            }
        });
    },
    convertedTime: function(time){
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
    },
    touchMove: function(e){
        if(e.direction === "right"){
            app.terminate();
        }
    }
}