import router from '@system.router';
import brightness from '@system.brightness';
import app from '@system.app';
import {P2pClient, Message, Builder} from "../wearengine"
import vibrator from '@system.vibrator'

export default{
    data: {
        timeText: "00:00",
        time: 0,
        times: 'x0',
        totalTime: 0,
        process: 0,
        text: '',
        buttonText: '',
        openText: '',
        showTextAndImg: false,
        showTotalAndButton: false,
        showCycle: false,
        showTimes: false,
    },
    onInit: function () {
        this.ping(this);
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
//    onHide: function () {
//         this.stopFlg = true;
//         this.tabIndex = 1;
//         this.sendMsg({'eventFlg':'15',})
//    },
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
                    if ('msg' in json) {
                        self.text = json.msg;
                        self.buttonText = self.changeTextFun(self);
                        console.log('getmsg success text: ' + self.text);
                    }
                    if ('time' in json) {
                        self.time = parseInt(json.time);
                        self.totalTime = parseInt(json.totalTime);
                        if (self.time === 1 && self.text === 'pause') {
                            self.callVibrate();
                        }
                        self.process = (1.0 - (self.time - 1) / self.totalTime) * 100;
                        self.timeText = self.convertedTime(self.time);
                        self.showCycleFun(self);
                        console.log('getmsg success time: ' + self.time + '|' + self.totalTime + '|' + self.process);
                    } else if ('totalTime' in json){
                        self.times = 'x' + json.totalTime;
                        self.showTimesFun(self);
                        console.log('getmsg success times: ' + self.times);
                    }

                    self.showTextFun(self);
                    if (self.text === 'exit') {
                        app.terminate();
                    }
                }else {
                    console.log('getmsg undefined');
                }
            },
            fail: function(data, code) {
                console.log('getmsg fail: ' + code);
            }
        });
    },
    showTotalFun: function(self){
        if(self.showTotalAndButton === false){
            self.showTotalAndButton === true;
            self.showTextAndImg = false;
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
            self.goFinishPage();
        }
        if (self.text === 'wait') {
            self.openText = self.$t('strings.wait');
            self.showTextAndImg = true;
        }
    },
    changeTextFun: function(self){
        switch(self.text){
            case 'next': return self.$t('strings.next');
            case 'skip': return self.$t('strings.skip');
            case 'pause': return self.$t('strings.pause');
            case 'resume': return self.$t('strings.resume');
        }
    },
    clickButton: function(){
        if(this.text === 'resume' || this.text === 'pause' || this.text === 'skip' || this.text === 'next'){
            this.sendMsg();
            if (this.text === 'next') {
                this.callVibrate()
            }
        }
        this.setBrightnessKeepScreenOn();
    },
    callVibrate: function () {
        vibrator.vibrate({
            mode: "short",
            success() {
                console.log("success to vibrate");
            },
            fail(data, code) {
                console.log(`handle fail, data = ${data}, code = ${code}`);
            }
        });
    },
    sendMsg: function(){
        let self = this;

        FeatureAbility.sendMsg({
            deviceId : 'remote',
            bundleName: 'homeworkout.homeworkouts.noequipment',
            abilityName: '',
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
    },
    ping: function (self) {
        self.showTextAndImg = true;

        // 步骤1：创建点对点通信对象
        var p2pClient = new P2pClient();
        var peerPkgName = 'homeworkout.homeworkouts.noequipment';
        var peerFinger = '46F848490B6171ECDC15946E999D2A66EC1F410A2DC955E00D9A5552221DAD0B';

        // 步骤2：设置需要通信的手机侧对应的三方应用包名
        p2pClient.setPeerPkgName(peerPkgName);
        p2pClient.setPeerFingerPrint(peerFinger);

        // 步骤3：检测手机侧对应的第三方应用是否在线
        p2pClient.ping({
            onSuccess: function() {
                setTimeout(function () {self.showOpenText(self);},1001);
                console.log('ping success');
            },
            onFailure: function() {
                setTimeout(function () {self.goQRPage();},1000);
                console.log('ping failed');
            },
            onPingResult: function(resultCode) {
                console.log('ping PingResult: ' + resultCode.data + resultCode.code);
            },
        });
    },
    goQRPage: function () {
        router.replace({
            uri: "pages/qr/qr",
        });
    },
    goFinishPage: function () {
        router.replace({
            uri: "pages/finish/finish",
        });
    },
    showOpenText: function (self) {
        if (self.text === '') {
            self.openText = self.$t('strings.open_app');
        }
    }
}