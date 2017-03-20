/**
 * 大转盘控制
 */


export default {
    /**
     * 初始化
     * @param  {Object} data 参数对象
     *                       dom, sideSize, className
     * @return {document}      canvas
     */
    init(data){
        addDom(data.dom, data.sideSize, data.className);
    },
    /**
     * 设置奖品
     * @param {Array} prizes   奖品列表
     * @param {String} indexKey 奖品关键key
     */
    setPrizes(prizes, indexKey){
        setDate(prizes);
        drawBase();
        drawItem(prizes, indexKey);
    },
    /**
     * 移动大转盘
     * @param  {String}   id 要移动的位置
     * @param  {Function} fn 回调方法
     */
    lotteryMove(id, fn){
        lotteryMove(id, fn);
    }
}

let canvas      = undefined;
let ctx         = undefined;
let idForIndex  = [];

let styleObj = ["#fbdd0d", "#f6c500", "#f6ae00"];
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
let styleArr = [
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
];

let config = {
    length:     0,
    startAngle: 0,              // 起始角度
    arc:        0,              // 每项奖品圆周角度
    width:      300,
    height:     300,
    inRadius:   50,             //大转盘内圆的半径
    outRadius:  100,
    textRadius: 155,            //大转盘奖品位置距离圆心的距离
    fontStyle:  "26px STHeitiSC Medium",
    lineHeight: 17,
    rsAngle:    0
};

function getJsDom(dom){
    return dom.length ? dom[0] : dom;
}

function addDom(dom, sideSize, className){
    canvas = document.createElement("canvas");
    canvas.className = className;
    canvas.width = sideSize;
    canvas.height = sideSize;
    getJsDom(dom).appendChild(canvas);
}

function setDate(prizes){
    config.length = prizes.length;
    // 根据奖品个数计算圆周角度
    config.arc = Math.PI / (config.length / 2);
    // 起始角度
    config.startAngle = -Math.PI*0.5;
    // config.startAngle = -Math.PI*0.5 - config.arc / 2;

    config.width = canvas.width;

    config.height = canvas.height;
    //大转盘内圆的半径
    config.inRadius = config.width / 2 * 168 / 436; 
    //大转盘外圆的半径
    config.outRadius = config.width / 2;
    // 文字半径
    config.textRadius = config.width / 2 * 350 / 438; 
    // 文字样式
    config.fontStyle = "700 " + 30 * window.document.body.clientWidth / 750 + "px STHeitiSC Medium";
}

function drawBase(){

    ctx = canvas.getContext("2d");
    //在给定矩形内清空一个矩形
    ctx.clearRect(0, 0, config.width, config.height);
    //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式  
    ctx.strokeStyle = "#fe6869";
    //font 属性设置或返回画布上文本内容的当前字体属性
    ctx.font = config.fontStyle;
}

function drawItem(prizes, indexKey){
    for (let i = 0; i < config.length; i++) {
        idForIndex[prizes[i][indexKey]] = i;

        let angle = config.startAngle + i * config.arc;
        ctx.fillStyle = styleArr[config.length][i];
        ctx.beginPath();
        //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）    
        ctx.arc(config.width/2, config.height/2, config.outRadius, angle, angle + config.arc, false);
        ctx.arc(config.width/2, config.height/2, config.inRadius, angle + config.arc, angle, true);
        ctx.stroke();
        ctx.fill();
        //锁画布(为了保存之前的画布状态)
        ctx.save();

        //----绘制奖品开始----
        ctx.fillStyle = "#e95124";
        var text = prizes[i].winning_name;
        //translate方法重新映射画布上的 (0,0) 位置
        ctx.translate(config.width/2 + Math.cos(angle + config.arc / 2) * config.textRadius, config.height/2 + Math.sin(angle + config.arc / 2) * config.textRadius);

        //rotate方法旋转当前的绘图
        ctx.rotate(angle + config.arc / 2 + Math.PI / 2);
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);

        //把当前画布返回（调整）到上一个save()状态之前 
        ctx.restore();
        //----绘制奖品结束----
    }
}

function lotteryMove(id, fn){
    // TODO 中奖位置计算
    let curIndex = idForIndex[id];
    
    config.rsAngle = 360/(config.length)*(curIndex+0.5)

    $("#lottery").rotate({
        angle: 0,
        animateTo: 1440 - config.rsAngle,
        duration: 4500,
        // duration: 2250,
        // animateTo: 360 - _resultAngle,
        easing: $.easing.easeInOutQuart,
        callback:function(){
            fn && fn();
        }
    });
}
