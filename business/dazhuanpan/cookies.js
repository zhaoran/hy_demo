/**
 * cookie 控制
 */

export default {
    //设置cookie
    setCookie(name, value, days){
        this.delCookie(name);
        var exp = new Date();
        exp.setTime(exp.getTime() + days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";
    },
    //读取cookie
    getCookie: function(name){
        var arr, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr = document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    },
    //删除cookie
    delCookie: function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1 * 24 * 60 * 60 * 1000);
        var cval = this.getCookie(name);
        if(cval != null){
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+";path=/";
        }
    }
}