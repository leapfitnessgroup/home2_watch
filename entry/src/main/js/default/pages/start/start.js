import router from '@system.router';
export default {
  data: {
    startorpause:"resume",
    back:"back",
    next: "next"
  },
  cancelGetMessage(){
    FeatureAbility.unsubscribeMsg();
  },
  sendMessage(text){
    FeatureAbility.sendMsg({
      deviceId: 'remote',
      bundleName: 'homeworkout.homeworkouts.noequipment',
      abilityName: 'com.huawei.hiwearkit.sdk',
      message: text,
      success: function() {
        if(text !== "back" && text !== "next"){
          if(text === "resume"){
              text = "pause"
          }else{
              text = "resume"
          }
        }
        console.log('FA has been installed.');
      },
      fail: function(data, code) {
        console.log('handing fail, message: ' + data + ', code: ' + code);
      } 
    });
    return text;
  },
  clickBack(){
    this.sendMessage(this.back);
    this.backToIndex();
  },
  clickStartOrPause(){
    this.startorpause = this.sendMessage(this.startorpause);
  },
  nextPage(){
    router.replace({
        uri: "pages/rest/rest"
    })
  },
  backToIndex(){
    router.replace({
      uri: "pages/index/index"
    }) 
  },
  clickNext(){
    this.sendMessage(this.back);
    const context = this;
    FeatureAbility.subscribeMsg({
        success: function(data) {
            console.log(`${data.deviceId}: ${data.message}`);
            if(data.message === "next"){
                context.nextPage();
            }else if(data.message === "finish"){
                context.backToIndex();
            }
        },
        fail: function(data, code) {
            console.log('handing fail, message: ' + data + ', code: ' + code);
        }
    });
  }
}
