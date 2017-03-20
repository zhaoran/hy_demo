<template>
    <div class="p-dazhuanpan-index">
        <div class="bg bg_1"></div>
        <div class="bg bg_2"></div>
        <div class="bg bg_3"></div>
        <!-- 我的奖品 -->
        <img :src="images.owner" alt="" class="owner" @click="ownerClick" v-show="loginParams.puid">
        <!-- 大转盘。有盘阴影 -->
        <div class="lottery">
            <!-- 大转盘可转动部分 -->
            <div id="lottery" class="cont">
                <!-- 大转盘背景 -->
                <img :src="images.zp_2" alt="">
                <!-- 大转盘gif灯光 -->
                <div class="gif"></div>
                <!-- 大转盘奖项 -->
                <!-- <canvas class="inner" ></canvas> -->
            </div>
            <!-- 大转盘按钮 -->
            <div id="lotteryBtn" class="btn" @click="lotteryClick">
                <img :src="images.zp_btn_3" class="inner" alt="">
            </div>
            <!-- 活动规则按钮 -->
            <img :src="images.rule" alt="" class="rule" @click="ruleWinShow">
        </div>
        <!-- 活动规则 -->
        <div class="win_rule" v-show="show.win_rule">
            <img :src="images.win_rule" alt="" class="win_img_bg">
            <img :src="images.win_close" alt="" class="win_close" @click="hideWin">
            <div class="content">
                <div class="title">活动规则</div>
                <div class="detail">
                    {{activity_desc}}
                </div>
            </div>
        </div>
        <!-- 所有提示弹窗 -->
        <div class="win_tip" v-show="show.win_tip">
            <!-- 背景 -->
            <img :src="images.win_tip" alt="" class="win_img_bg">
            <!-- 关闭 -->
            <img :src="images.win_close" alt="" class="win_close" @click="hideWin">
            <!-- 铺盖内容 -->
            <div class="tip-show" :class="[statusWin]">
                <div class="tip-button" @click="tipButtonClick"></div>
                <!-- 登录专享 -->
                <div v-show="statusWin == 'status-login'">
                    <input v-model="loginParams.telephone" type="number" class="input-phone">
                    <input v-model="loginParams.code" type="number" class="input-code">
                    <div id="error" class="error" v-show="statusError">
                        <img :src="images.error" alt="">
                        <div class="msg" v-show="statusError=='error-return'">{{errorMsg}}</div>
                        <div class="msg" v-show="statusError=='error-tel-num'">手机号位数不正确</div>
                        <div class="msg" v-show="statusError=='error-tel-style'">手机号格式不正确</div>
                        <div class="msg" v-show="statusError=='error-code-num'">请输入验证码</div>
                    </div>
                    <div class="code-msg">
                        <div class="inner" @click="getCode" v-show="downNum > 60 || downNum < 0">获取验证码</div>
                        <div class="inner" @click="getCode" v-show="downNum >= 0 && downNum <= 60">{{downNum}}s</div>
                    </div>
                </div>
                <!-- 中奖专享 -->
                <div v-show="statusWin == 'status-in'" class="status-in-msg">
                    获得{{gift_name}}
                </div>
            </div>
        </div>
        <!-- 我得奖品 -->
        <div class="win_owner" v-show="show.win_owner">
            <img :src="images.win_owner" alt="" class="win_img_bg">
            <img :src="images.win_close" alt="" class="win_close" @click="hideWin">
            <div class="win_owner-list">
                <div class="win_owner-item" v-for="(item, index) in myorder" :class="{isUsed: item.status === 1, isExpried: item.status === 2}">
                    <div class="left">
                        
                    </div>
                    <div class="right">
                        <div class="name">{{item.gift_name}}</div>
                        <div class="code">{{item.code}}</div>
                        <div class="time">{{item.expired_at}}</div>
                    </div>
                </div>
            </div>
            <!-- myorder -->
        </div>
        <div class="model" v-show="show.win_tip || show.win_rule || show.win_owner"></div>
    </div>
</template>

<script>
    require('public/third_party/jQueryRotate.js');    
    import Cookies from './cookies';
    import Lottery from './lottery';
    import Data from './data';
    import Win from './win';
    import Service from './service';

    export default{
        data(){
            return Data;
        },
        methods:{
            init(){
                Data.loading = true;
                this.initSize();
                this.initDate();
                // 初始化大转盘
                Lottery.init({
                    dom: $("#lottery"),
                    sideSize: $(".gif").width() * 0.6818,
                    className: "inner"
                });
                // 判断进入的环境
                if(this.isffan()){
                    alert("进入飞凡app了");
                    this.load_ffan();
                }else{
                    console.log("============", "进入本地环境", "=============");
                    this.load_local();
                }
                
            },
            initSize(){
                setTimeout(()=>{
                    $("body").css("font-size", 20 * $("body").width() / 750 + "px")
                    $(".code-msg .inner").css("line-height", $(".code-msg .inner").height() + "px");
                    $(".status-login .error").css("line-height", $(".status-login .error").height() + "px");
                    $(".status-in-msg").css({
                        "line-height": $(".status-in-msg").height() + "px",
                        "font-size": 35 * $("body").width() / 750 + "px"
                    });
                    $(".win_rule .content").css({
                        "font-size": 28 * $("body").width() / 750 + "px"
                    });
                }, 0);
            },
            initDate(){

                // 登录信息
                Data.loginParams.telephone = Cookies.getCookie("phone");
                Data.loginParams.puid = Cookies.getCookie("puid");
                // 商户id 
                Data.merchant_id = this.$route.query.merchantid || "001";
            },

            isffan(){
                return window.navigator.userAgent.indexOf("ffan") > 0;
            },

            load_ffan(){
                Service.accesstoken();
                // 验证通过 ready 函数
                ffanSDK.ready((sdk) => {
                    alert("ready");
                    // config 信息验证通过后会执行 ready 方法
                    ffanSKD.setTitle({"title": "幸运大转盘"});
                    Service.getPrizeList();
                });

                // 校验失败的 error 函数
                ffanSDK.error((res) => {
                    alert("error");

                });
            },
            load_local(){
                Service.getPrizeList();
            },
            lotteryClick(){
                if(Data.loading) return;

                if(Data.statusOpen === 0){// 未开始
                    Win.tipWinShow("status-un");
                }else if(Data.statusOpen === 2){// 已结束
                    Win.tipWinShow("status-end");
                }else if(!Data.loginParams.puid){// 未登录
                    this.initSize();
                    Win.tipWinShow("status-login");
                }else if(Data.loginParams.puid){// 已登录
                    Service.play();
                }
                
            },
            lotteryMove(id, msg){
                Lottery.lotteryMove(id, ()=>{
                    if(id === 0){// 未中奖
                        Win.tipWinShow("status-out");
                    }else{ // 已中奖
                        Data.gift_name = msg;
                        Win.tipWinShow("status-in"); 
                    }
                });
            },
            // 显示规则窗口
            ruleWinShow(){
                Win.ruleWinShow();
            },
            // 显示提示信息窗口
            tipWinShow(statusWin){
                Win.tipWinShow(statusWin);
            },
            // 关闭窗口
            hideWin(){
                Win.hideWin();
            },



            ownerClick(){
                if(!Data.loginParams.puid){// 未登录
                    this.initSize();
                    Win.tipWinShow("status-login");
                }else{
                    Service.order();
                }
            },

            tipButtonClick(){
                Data.statusError = undefined;
                switch(Data.statusWin){
                    case 'status-login' :
                        if(Service.isPhone() && Service.isCode())
                            Data.statusLogin === 1 ? Service.register() : Service.login();
                        break;
                    case 'status-in' :
                        // 中奖之后做什么
                        Win.hideWin();
                        break;
                    default:
                        Win.hideWin();
                        break;
                }
            },
            getCode(){
                Service.getCode();
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.init();
            })
        },
        beforeDestroy(){
            Data.down && clearInterval(Data.down);
        }
    }
</script>

<style lang="less">
    @import './index.less';
</style>