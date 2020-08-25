import device from '@system.device';
export default {
  onCreate() {
    
    console.info("Application onCreate" + this.getInfo());
  },
  onDestroy() {
    console.info("Application onDestroy");
  },
  getInfo(){
    device.getInfo({
    success: function(data) {
      console.log("" + data.product + "|" + data.model);
    },
    fail: function(data, code) {
      console.log("fail get device info code:"+ code);
    }
    })
  }
};
