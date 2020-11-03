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
                    var json = JSON.parse(data.message);
                    if ('msg' in json && json.msg === 'exit') {
                        app.terminate();
                        console.log('getmsg terminate');
                    } else {
                        self.backToIndex();
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
    touchMove: function(e){
        if(e.direction === "right"){
            app.terminate();
        }
    },
    backToIndex: function () {
        router.replace({
            uri: "pages/index/index",
        });
    }
}