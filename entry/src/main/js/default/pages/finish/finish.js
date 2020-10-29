import app from '@system.app';

export default{
    data: {
        exerciseTimes: '',
        exerciseKcal: '',
        exerciseDuration: ''
    },
    onInit: function () {
        this.getMsg();
    },
    getMsg: function() {
        var self = this;
        FeatureAbility.subscribeMsg({
            success: function(data) {
                if(JSON.stringify(data.message) !== undefined){
                    var json = JSON.parse(data.message);
                    if ('exercises' in json) {
                        self.exerciseTimes = json.exercises;
                        self.exerciseKcal = json.kcal;
                        self.exerciseDuration = json.duration;
                        console.log('finish: ' +
                        self.exerciseTimes + ' | ' +
                        self.exerciseKcal + ' | ' +
                        self.exerciseDuration);
                    }
                    if ('msg' in json && json.msg === 'exit') {
                        app.terminate();
                        console.log('getmsg terminate');
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
    onclick: function () {
        app.terminate();
    }
}