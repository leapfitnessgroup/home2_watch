import router from '@system.router';
export default{
    data: {
        start: "start"
    },
    clickStart(){
        router.replace({
            uri : "pages/ready/ready"
        })
    }
}