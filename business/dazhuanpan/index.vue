<template>
    <div class="p-dazhuanpan-index">
        <div class="bg bg_1"></div>
        <div class="bg bg_2"></div>
        <div class="bg bg_3"></div>
        <!-- 我的奖品 -->
        <img :src="images.owner" alt="" class="owner" @click="ownerClick" v-show="loginParams.telephone">
        <!-- 大转盘。有盘阴影 -->
        <div class="lottery">
            <!-- 大转盘可转动部分 -->
            <div id="lottery" class="cont">
                <!-- 大转盘背景 -->
                <img :src="images.zp_2" alt="">
                <!-- 大转盘gif灯光 -->
                <div class="gif"></div>
                <!-- 大转盘奖项 -->
                <canvas class="inner"></canvas>
            </div>
            <!-- 大转盘按钮 -->
            <div id="lotteryBtn" class="btn" @click="lotteryClick"></div>
            <!-- 活动规则 -->
            <img :src="images.rule" alt="" class="rule" @click="ruleWinShow">
        </div>
        <!-- 活动规则 -->
        <div class="win_rule" v-show="show.win_rule">
            <img :src="images.win_rule" alt="" class="win_img_bg">
            <img :src="images.win_close" alt="" class="win_close" @click="hideWin">
            <div class="content">
                <div class="title">活动规则</div>
                <div class="detail">
                    1. 活动规则<br>
                    2. 活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则活动规则<br>
                    3. 111111111111111111111111111111111111111111111111111111111<br>
                    4. jsefjisefj fseifjiesfjiesfj f esjif jifjesf jesifjesfiejs i eifjefefefefefefe<br>
                </div>
            </div>
        </div>
        <!-- 所有弹窗 -->
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
                    <div class="error" v-show="statusError">
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
        <div class="model" v-show="show.win_tip || show.win_rule"></div>
    </div>
</template>

<script>
    import Cookies from './cookies';

    export default{
        data(){
            let styleObj = ["#fbdd0d", "#f6c500", "#f6ae00"];
            return {
                loginParams: {
                    puid: "",
                    telephone: "",
                    code: ""
                },
                idForIndex: {}, // 奖项id对应数组索引
                activity_id: undefined,
                merchant_id: '001',
                gift_name: "", // 中奖信息
                show: {
                    win_rule: false,
                    win_tip: false,
                },
                loading: true,
                statusOpen: 0, // 0未开始、2已结束
                statusWin: undefined,
                statusError: undefined,
                errorMsg: undefined,
                statusLogin: 1, // 1调用注册，2调用登录
                down: undefined, // 倒计时实例
                downNum: 61, // 倒计时秒数
                myorder: [], // 中奖列表信息
                images: {
                    zp_2: require("./images/zp2.png"),
                    gif: require("./images/gif.gif"),
                    rule: require("./images/rule.png"),
                    win_rule: require("./images/win_rule.png"),
                    win_tip: require("./images/win_tip.png"),
                    win_close: require("./images/win_close.png"),
                    owner: require("./images/owner.png"),
                    error: require("./images/error.jpg"),
                },
                canvas: undefined,
                ctx: undefined,
                arc: undefined,     //根据奖品个数计算圆周角度
                textWidth: undefined,
                /**
                 * 颜色数组
                 * 二色块：12
                 * 三色块：123
                 * 四色块：1212
                 * 五色块：12123
                 * 六色块：121212
                 * 七色块：1231232
                 * 八色块：12121212
                 * 九色块：123123123
                 * 十色块：1212121212 
                 * @type {Array}
                 */
                styleArr: [
                    [],
                    [],
                    [styleObj[0], styleObj[1]],
                    [styleObj[0], styleObj[1], styleObj[2]],
                    [styleObj[0], styleObj[1], styleObj[0], styleObj[1]],
                    [styleObj[0], styleObj[1], styleObj[0], styleObj[1], styleObj[2]],
                    [styleObj[0], styleObj[1], styleObj[0], styleObj[1], styleObj[0], styleObj[1]],
                    [styleObj[0], styleObj[1], styleObj[2], styleObj[0], styleObj[1], styleObj[2], styleObj[1]],
                    [styleObj[0], styleObj[1], styleObj[0], styleObj[1], styleObj[0], styleObj[1], styleObj[0], styleObj[1]],
                    [styleObj[0], styleObj[1], styleObj[2], styleObj[0], styleObj[1], styleObj[2], styleObj[0], styleObj[1], styleObj[2]],
                    [styleObj[0], styleObj[1], styleObj[0], styleObj[1], styleObj[0], styleObj[1], styleObj[0], styleObj[1], styleObj[0], styleObj[1]],
                ],
                // 大转盘奖品
                prizes: undefined,
                // 大转盘配置
                config: {
                    startAngle: 0,
                    width:482,
                    height:482,
                    insideRadius:50,            //大转盘内圆的半径
                    textRadius:155,             //大转盘奖品位置距离圆心的距离
                    fontStyle:"26px STHeitiSC Medium",
                    lineHeight : 17
                },
                resultAngle: 360/(8)*(3-0.5),
                lotteryBoo: false,
            }
        },
        methods:{
            init(){
                this.loading = true;
                // this.statusWin = "status-login";
                // debugger;
                this.initSize();
                this.initDate();
                this.getPrizeList();
                
                // this.ruleWinShow();
                // this.tipWinShow("status-in");
                // this.initSize();
                // this.gift_name = "一等奖";
                // this.tipWinShow("status-login");
            },
            initSize(){
                setTimeout(function(){
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
                }, 0)
            },
            initDate(){
                this.canvas = $("canvas");
                // this.config.startAngle = Math.PI*(1.5-1/this.prize.length);
                this.config.startAngle = 0;
                this.config.width = this.canvas.width();
                this.config.height = this.canvas.width();
                //大转盘内圆的半径
                this.config.insideRadius = this.config.width / 2 * 186 / 436; 
                // this.config.insideRadius = 0; 
                this.config.textRadius = this.config.width * 200 / 643; 
                //大转盘外圆的半径
                this.config.outsideRadius = this.config.width / 2; 

                // 登录信息
                this.loginParams.telephone = Cookies.getCookie("phone");
                this.loginParams.puid = Cookies.getCookie("puid");
                // 商户id
                this.merchant_id = "001";
            },
            drawBase(){
                this.ctx = this.canvas[0].getContext("2d");
                //根据奖品个数计算圆周角度
                this.arc = Math.PI / (this.prizes.length / 2);
                //在给定矩形内清空一个矩形
                this.ctx.clearRect(0, 0, this.config.width, this.config.height);
                //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
                this.ctx.strokeStyle = "#fe6869";
                this.textWidth = parseInt(600/(this.prizes.length<6?6:this.prizes.length))
                //font 属性设置或返回画布上文本内容的当前字体属性
                this.ctx.font = this.config.fontStyle;
            },
            drawItem(){
                for (let i = 0; i < this.prizes.length; i++) {
                    this.idForIndex[this.prizes[i].id] = i;

                    let angle = this.config.startAngle + i * this.arc;
                    this.ctx.fillStyle = this.styleArr[this.prizes.length][i];
                    this.ctx.beginPath();
                    //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
                    this.ctx.arc(this.config.width/4, this.config.height/8, this.config.outsideRadius, angle, angle + this.arc, false);
                    this.ctx.arc(this.config.width/4, this.config.height/8, this.config.insideRadius, angle + this.arc, angle, true);
                    this.ctx.stroke();
                    this.ctx.fill();
                    //锁画布(为了保存之前的画布状态)
                    this.ctx.save();

                    // //----绘制奖品开始----
                    // this.ctx.fillStyle = "#000";
                    // var text = this.prizes[i].winning_name;
                    // //translate方法重新映射画布上的 (0,0) 位置
                    // this.ctx.translate(this.config.width/2 + Math.cos(angle + this.arc / 2) * this.config.textRadius, this.config.height/2 + Math.sin(angle + this.arc / 2) * this.config.textRadius);

                    // //rotate方法旋转当前的绘图
                    // this.ctx.rotate(angle + this.arc / 2 + Math.PI / 2);
                    // this.ctx.fillText(text, -this.ctx.measureText(text).width / 2, this.prizes[i].img_url?-50:0);

                    // //把当前画布返回（调整）到上一个save()状态之前 
                    // this.ctx.restore();
                    // //----绘制奖品结束----
                    console.log("drawItem绘制" + i + " end");
                }

                function loop(){

                }
                this.loading = false;
            },
            lotteryClick(){
                if(this.loading) return;

                if(this.statusOpen === 0){// 未开始
                    this.tipWinShow("status-un");
                }else if(this.statusOpen === 2){// 已结束
                    this.tipWinShow("status-end");
                }else if(!this.loginParams.telephone){// 未登录
                    this.initSize();
                    this.tipWinShow("status-login");
                }else if(this.loginParams.telephone){// 已登录
                    this.play();
                }
                
            },
            lotteryMove(id, msg){
                // TODO 中奖位置计算
                let curIndex = this.idForIndex[id];
                

                this.resultAngle = 360/(this.prizes.length)*(curIndex-0.5)
                let _this = this;
                $("#lottery").rotate({
                // $("#lotteryBtn").rotate({
                    angle: 0,
                    animateTo: 1440 - _this.resultAngle,
                    duration: 4500,
                    // duration: 2250,
                    // animateTo: 360 - _resultAngle,
                    easing: $.easing.easeInOutQuart,
                    callback:function(){
                        if(id === 0){// 未中奖
                            _this.tipWinShow("status-out");
                        }else{ // 已中奖
                            _this.gift_name = msg;
                            _this.tipWinShow("status-in"); // TODO 中奖信息
                        }  
                    }
                });
            },
            // 显示规则窗口
            ruleWinShow(){
                this.show.win_rule = true;
            },
            // 显示提示信息窗口
            tipWinShow(statusWin){
                this.show.win_tip = true;
                this.statusWin = statusWin;
            },
            // 关闭窗口
            hideWin(){
                this.show.win_rule = false;
                this.show.win_tip = false;
                this.statusWin = undefined;
            },



            ownerClick(){
                this.order();
                // this.$router.push({name: "dazhuanpan.prizeList", query: {id: "1"}});
            },
            tipButtonClick(){
                this.statusError = undefined;
                switch(this.statusWin){
                    case 'status-login' :
                        if(this.isPhone() && this.isCode())
                            this.statusLogin === 1 ? this.register() : this.login();
                        break;
                    case 'status-in' :
                        // 中奖之后做什么
                        this.hideWin();
                        break;
                    default:
                        this.hideWin();
                        break;
                }
            },



            isPhone(){
                if(!this.loginParams.telephone || this.loginParams.telephone.length < 11){
                    this.statusError = "error-tel-num";
                    return false;
                }

                if (!(/^13[0-9]{9}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|12[012356789][0-9]{8}|147[0-9]{8}$/.test(this.loginParams.telephone))) {
                    this.statusError = "error-tel-style";
                    return false;
                }
                return true;
            },
            isCode(){
                if(!this.loginParams.code || this.loginParams.code.length < 1){
                    this.statusError = "error-code-num";
                    return false;
                }
                return true;
            },
        //     if(code.length == 0){
        //     $("#reg .tips").text("验证码不正确，请重新获取验证码！");
        //     return false;
        // }
            loginSuccess(data){
                // 错误状态制为空
                this.statusError = undefined;
                this.loginParams.puid = data.ffuid;
                Cookies.setCookie("phone", this.loginParams.telephone, 30);
                Cookies.setCookie("puid", this.loginParams.puid, 30);
            },
            sendError(meta){
                this.statusError = 'error-return';
                meta && (this.errorMsg = meta.msg);
            },

            // --------------------Http 请求 ----------------------
            /**
             * 根据商户获取当前有效活动
             */
            getPrizeList(fn){
                this.$http.post('/ffapi/activity/useable/activity', {
                    merchant_id: this.merchant_id
                }).then(function(data){
                    if(data && data.body && data.body.meta && data.body.meta.errno === 0){
                        this.statusOpen = data.body.result.status;
                        this.prizes = data.body.result.winning_gifts;
                        this.activity_id = data.body.result.id;

                        this.drawBase();
                        this.drawItem();
                        // this.drawImg(0);
                    }else{
                        
                    }
                }, function(data){
                    
                });
            },
            /**
             * 获取验证码，并判断使用登录还是注册
             */
            getCode(){
                if((this.downNum <= 60 && this.downNum >= 0)){
                    return;
                }
                if(!this.isPhone()) return;

                this.$http.post('/ffapi/user/send/sms', {
                    phone: this.loginParams.telephone
                }).then(function(data){
                    let temp = data.body;
                    if(temp && temp.meta && temp.meta.errno === 0 ){
                        this.statusLogin = temp.result.data.type; // 1调用注册，2调用登录
                        this.statusError = undefined;
                        this.errorMsg = "";
                        // 倒计时
                        this.downNum = 61;
                        this.down = setInterval(() => {
                            this.downNum--;
                            if(this.downNum < 0){
                                clearInterval(this.down);
                            }
                        }, 1000);
                    }else{
                        this.secondError(temp.meta);
                    }
                }, function(data){
                    this.secondError(data.body.meta);
                });
            },
            login(){
                this.$http.post('/ffapi/user/login', {
                    phone: this.loginParams.telephone,
                    code: this.loginParams.code,
                    merchant_id: this.merchant_id
                }).then(function(data){
                    if(data && data.body && data.body.meta && data.body.meta.errno === 0){
                        this.loginSuccess(data.body.result);
                        this.hideWin();
                    }else{
                        this.sendError(data.body.meta);
                    }
                }, function(data){
                    this.sendError("登录失败，请重试");
                });
            },
            register(){
                this.$http.post('/ffapi/user/reg', {
                    phone: this.loginParams.telephone,
                    code: this.loginParams.code,
                    merchant_id: this.merchant_id
                }).then(function(data){
                    if(data && data.body && data.body.meta && data.body.meta.errno === 0){
                        this.loginSuccess(data.body.result);
                        this.hideWin();
                    }else{
                        this.sendError(data.body.meta);
                    }
                }, function(data){
                    this.sendError("登录失败，请重试");
                });
            },
            play(){
                this.$http.post('/ffapi/activity/play', {
                    activity_id: this.activity_id,
                    merchant_id: this.merchant_id,
                    phone: this.loginParams.telephone,
                    platform: 1,
                    puid: this.loginParams.puid
                }).then(function(data){
                    if(data && data.body && data.body.meta && data.body.meta.errno === 0){
                        // if(data.body.result.gift_id === 0){// 未中奖
                        //     this.tipWinShow("status-out");
                        // }else{// 中奖
                            this.lotteryMove(data.body.result.id, data.body.result.winning_name);
                        // }
                    }else{
                        alert("参与失败");// TODO
                    }
                }, function(data){
                    alert("参与失败");// TODO
                });
            },
            order(){
                this.$http.post('/ffapi/activity/myorder', {
                    phone: this.loginParams.telephone,
                }).then(function(data){
                    if(data && data.body && data.body.meta && data.body.meta.errno === 0){
                        this.myorder = data.body.resutl;
                    }
                });
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.init();
                
            })
        }
    }
</script>

<style lang="less">
    @import './index.less';
</style>