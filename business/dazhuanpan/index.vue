<template>
    <div class="p-dazhuanpan-index">
        <div class="bg bg_1"></div>
        <div class="bg bg_2"></div>
        <div class="bg bg_3"></div>
        <!-- 我的奖品 -->
        <img :src="images.owner" alt="" class="owner" @click="ownerClick">
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
            <div id="lotteryBtn" class="btn" @click="lotteryClick(2)"></div>
            <!-- 活动规则 -->
            <img :src="images.rule" alt="" class="rule" @click="ruleWinShow">
        </div>
        <!-- 活动规则 -->
        <div class="win_rule" v-show="show.win_rule">
            <img :src="images.win_rule" alt="" class="win_img_bg">
            <img :src="images.win_close" alt="" class="win_close" @click="hideWin">
        </div>
        <!-- 所有弹窗 -->
        <div class="win_tip" v-show="show.win_tip">
            <!-- 背景 -->
            <img :src="images.win_tip" alt="" class="win_img_bg">
            <!-- 关闭 -->
            <img :src="images.win_close" alt="" class="win_close" @click="hideWin">
            <!-- 铺盖内容 -->
            <div class="tip-show" :class="[status]">
                <div class="tip-button" @click="tipButtonClick"></div>
                <!-- 登录专享 -->
                <div v-show="status == 'status-login'">
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
            </div>
        </div>
    </div>
</template>

<script>
    import Cookies from './cookies';

    export default{
        data(){
            let styleObj = ["#fbdd0d", "#f6c500", "#f6ae00"];
            return {
                loginParams: {
                    telephone: "",
                    code: ""
                },
                show: {
                    win_rule: false,
                    win_tip: false,
                },
                status: "status-login",
                statusError: undefined,
                errorMsg: undefined,
                statusLogin: 1, // 1调用注册，2调用登录
                down: undefined,
                downNum: 61,
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
                prizes: [
                    {id: 1, name: "一等奖", img_url: "http://img0.t.rongyi.com/51f9d9b431d65584ab00005b/20170314/6a6f6abff2d3481d720ec67a69766b1d.png"}, 
                    {id: 2, name: "二等奖", img_url: "http://img0.t.rongyi.com/51f9d9b431d65584ab00005b/20170314/c45f365cd1ea8e5ce2d171faddeb103c.png"}, 
                    {id: 3, name: "三等奖", img_url: "http://img0.t.rongyi.com/51f9d9b431d65584ab00005b/20170314/80c618227c54313bb2710a6d7fdb3072.png"}],
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
                // debugger;
                this.initSize();
                this.initDate();
                this.drawBase();
                this.drawItem();
                // this.drawImg(0);
                this.getPrizeList();
                this.tipWinShow();
            },
            initSize(){
                setTimeout(function(){
                    $("body").css("font-size", 20 * $("body").width() / 750 + "px")
                    $(".code-msg .inner").css("line-height", $(".code-msg .inner").height() + "px");
                    $(".status-login .error").css("line-height", $(".status-login .error").height() + "px");
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
                for (var i = 0; i < this.prizes.length; i++) {
                    var angle = this.config.startAngle + i * this.arc;
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
                    // var text = this.prizes[i].name;
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
            },
            lotteryClick(curIndex){
                this.show.win_tip = true;
            },
            lotteryMove(curIndex){
                this.resultAngle = 360/(8)*(curIndex-0.5)
                $("#lottery").rotate({
                // $("#lotteryBtn").rotate({
                    angle: 0,
                    animateTo: 1440 - this.resultAngle,
                    duration: 4500,
                    // duration: 2250,
                    // animateTo: 360 - _resultAngle,
                    easing: $.easing.easeInOutQuart,
                    callback:function(){
                        
                    }
                });
            },
            // 显示规则窗口
            ruleWinShow(){
                this.show.win_rule = true;
            },
            // 显示提示信息窗口
            tipWinShow(){
                this.show.win_tip = true;
            },
            // 关闭窗口
            hideWin(){
                this.show.win_rule = false;
                this.show.win_tip = false;
                this.status = undefined;
            },



            ownerClick(){
                this.$router.push({name: "dazhuanpan.prizeList", query: {id: "1"}});
            },
            tipButtonClick(){
                this.statusError = undefined;
                switch(this.status){
                    case 'status-login' :
                        if(this.isPhone() && this.isCode())
                            this.statusLogin === 1 ? this.register() : this.login();
                        break;
                    case 'status-in' : 
                        break;
                    default:

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
            loginSuccess(){
                // 错误状态制为空
                this.statusError = undefined;
                Cookies.setCookie("phone", this.loginParams.telephone, 30);
            },
            secondError(meta){
                this.statusError = 'error-return';
                meta && (this.errorMsg = meta.msg);
            },

            // --------------------Http 请求 ----------------------
            /**
             * 根据商户获取当前有效活动
             */
            getPrizeList(){
                this.$http.post('/ffapi/activity/useable/activity', {merchant_id: "001"})
            },
            /**
             * 获取验证码，并判断使用登录还是注册
             */
            getCode(){
                if((this.downNum <= 60 && this.downNum >= 0)){
                    return;
                }
                if(!this.isPhone()) return;

                this.$http.post('/ffapi/user/send/sms', {phone: "13812341234"}).then(function(data){
                    let temp = data.body;
                    if(temp && temp.meta && temp.meta.errno === 0 ){
                        this.statusLogin = temp.result.data.type; // 1调用注册，2调用登录
                        this.statusError = undefined;
                        this.errorMsg = "";
                        // TODO 倒计时
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
                    code: this.loginParams.code
                }).then(function(data){
                    if(data && data.body && data.body.meta && data.body.meta.errno === 0){
                        this.loginSuccess();
                    }else{
                        this.secondError(data.body.meta);
                    }
                }, function(data){
                    this.secondError(data.body.meta);
                });
            },
            register(){
                this.$http.post('/ffapi/user/reg', {
                    phone: this.loginParams.telephone,
                    code: this.loginParams.code
                }).then(function(data){
                    if(data && data.body && data.body.meta && data.body.meta.errno === 0){
                        this.loginSuccess();
                    }else{
                        this.secondError(data.body.meta);
                    }
                }, function(data){
                    this.secondError(data.body.meta);
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