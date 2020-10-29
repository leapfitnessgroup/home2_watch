import app from '@system.app';
import router from '@system.router';

export default{
    onInit: function () {
        this.getMsg();
    },
    getMsg: function() {
        var self = this;
        FeatureAbility.subscribeMsg({
            success: function(data) {
                if(JSON.stringify(data.message) !== undefined){
                    if (self.text === 'exit') {
                        app.terminate();
                    } else {
                        self.goIndexPage();
                    }
                    console.log('getmsg success: ' + '');
                }else {
                    console.log('getmsg undefined');
                }
            },
            fail: function(data, code) {
                console.log('getmsg fail: ' + code);
            }
        });
    },
    touchMove: function(e){
        if(e.direction === "right"){
            app.terminate();
        }
    },
    goIndexPage: function () {
        router.replace({
            uri: "pages/index/index",
        });
    }
}