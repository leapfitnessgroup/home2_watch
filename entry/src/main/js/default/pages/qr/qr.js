import app from '@system.app';

export default{
    touchMove: function(e){
        if(e.direction === "right"){
            app.terminate();
        }
    }
}