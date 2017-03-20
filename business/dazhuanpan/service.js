
/**
 * 业务逻辑判断
 */

import Cookies from './cookies';
import Lottery from './lottery';
import Data from './data';
import Win from './win';

let service = {
    isPhone(){
        if(!Data.loginParams.telephone || Data.loginParams.telephone.length < 11){
            Data.statusError = "error-tel-num";
            return false;
        }

        if (!(/^13[0-9]{9}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|12[012356789][0-9]{8}|147[0-9]{8}$/.test(Data.loginParams.telephone))) {
            Data.statusError = "error-tel-style";
            return false;
        }
        return true;
    },
    isCode(){
        if(!Data.loginParams.code || Data.loginParams.code.length < 1){
            Data.statusError = "error-code-num";
            return false;
        }
        return true;
    },

    loginSuccess(data){
        // 错误状态制为空
        Data.statusError = undefined;
        Data.loginParams.puid = data.ffuid;
        Cookies.setCookie("phone", Data.loginParams.telephone, 30);
        Cookies.setCookie("puid", Data.loginParams.puid, 30);
    },
    sendError(meta){
        Data.statusError = 'error-return';
        meta && (Data.errorMsg = meta.msg);
    },

    // --------------------Http 请求 ----------------------
    /**
     * 根据商户获取当前有效活动
     */
    getPrizeList(fn){
        Vue.http.post('/ffapi/activity/useable/activity', {
            merchant_id: Data.merchant_id
        }).then(function(data){
            Data.statusOpen = data.body.result.status;
            Data.prizes = data.body.result.winning_gifts;
            Data.activity_id = data.body.result.id;
            Data.activity_desc = (data.body.result.desc + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br\>$2');
            Lottery.setPrizes(Data.prizes, "id");

            Data.loading = false;
        }, function(data){
            alert((data && data.body && data.body.meta) || "获取活动失败");
        });
    },
    /**
     * 获取验证码，并判断使用登录还是注册
     */
    getCode(){
        if((Data.downNum <= 60 && Data.downNum >= 0)){
            return;
        }
        if(!this.isPhone()) return;

        Vue.http.post('/ffapi/user/send/sms', {
            phone: Data.loginParams.telephone
        }).then(function(data){
            Data.statusLogin = data.body.result.data.type; // 1调用注册，2调用登录
            Data.statusError = undefined;
            Data.errorMsg = "";
            // 倒计时
            Data.downNum = 61;
            Data.down = setInterval(() => {
                Data.downNum--;
                if(Data.downNum < 0){
                    clearInterval(Data.down);
                }
            }, 1000);
        }, function(data){
            service.sendError(data.body.meta);
        });
    },
    login(){
        Vue.http.post('/ffapi/user/login', {
            phone: Data.loginParams.telephone,
            code: Data.loginParams.code,
            merchant_id: Data.merchant_id
        }).then(function(data){
            service.loginSuccess(data.body.result);
            Win.hideWin();
        }, function(data){
            service.sendError((data && data.body && data.body.meta) || "登录失败，请重试");
        });
    },
    register(){
        Vue.http.post('/ffapi/user/reg', {
            phone: Data.loginParams.telephone,
            code: Data.loginParams.code,
            merchant_id: Data.merchant_id
        }).then(function(data){
            service.loginSuccess(data.body.result);
            Win.hideWin();
        }, function(data){
            service.sendError((data && data.body && data.body.meta) || "登录失败，请重试");
        });
    },
    play(){
        Vue.http.post('/ffapi/activity/play', {
            activity_id: Data.activity_id,
            merchant_id: Data.merchant_id,
            phone: Data.loginParams.telephone,
            platform: 1,
            puid: Data.loginParams.puid
        }).then(function(data){
            Lottery.lotteryMove(data.body.result.id, ()=>{
                
                Data.loading = false;
                if(data.body.result.id === 0){// 未中奖
                    Win.tipWinShow("status-out");
                }else{ // 已中奖
                    Data.gift_name = data.body.result.winning_name;
                    Win.tipWinShow("status-in"); 
                }
            });
        }, function(data){
            Data.loading = false;
            if(data && data.body && data.body.meta && data.body.meta.errno === 1522008){
                Win.tipWinShow("status-no");
            }else{
                alert("参与失败");// TODO
            }
            
        });
    },
    order(){
        Vue.http.post('/ffapi/activity/myorder', {
            phone: Data.loginParams.telephone,
        }).then(function(data){
            Data.loading = false;
            Data.myorder = data.body.result;
            Data.show.win_owner = true;
        }, function(){
            Data.loading = false;
        });
    },
    /**
     * 获取accessToken
     */
    accesstoken(){
        Vue.http.post('/ffapi/common/accesstoken', {
            url: encodeURIComponent(window.location.href),
        }).then(function(data){
            let temp = data.body.result;
            ffanSDK.config({
                appKey: temp.appKey,  //第三方应用appKey
                ts: temp.ts,  //签名时使用的时间戳
                nonceStr: temp.nonceStr,  //用来生成签名的随机串
                signature: temp.signature,  //生成的签名
                url: temp.url,  //当前页面的url 请使用urlEncode对url进行处理
            });
        });
    }
}

export default service;