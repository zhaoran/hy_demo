/**
 * 数据控制
 */

let data = {
    // 登录参数
    loginParams: {
        puid: "",
        telephone: "",
        code: ""
    },
    // 活动id
    activity_id: undefined,
    // 活动规则
    activity_desc: undefined,
    // 商户id
    merchant_id: '001',
    // 中奖信息
    gift_name: "", 
    // 弹窗显示
    show: {
        win_rule: false,
        win_tip: false,
        win_owner: false,
    },
    // 页面加载中
    loading: true,
    // 活动是否开始  0未开始、2已结束
    statusOpen: 0, 
    // 窗口状态 
    // status-end 结束、status-in 中奖、status-login 登录、
    // status-no 已用完、status-out 未中奖、status-un 未开始
    // status-error 错误信息
    statusWin: undefined,
    // 错误状态
    statusError: undefined,
    // 错误信息
    errorMsg: undefined,
    statusLogin: 0, // 1调用注册，2调用登录
    down: undefined, // 倒计时实例
    downNum: 61, // 倒计时秒数
    myorder: [], // 中奖列表信息
    images: {
        zp_2: require("./images/zp2.png"),
        zp_btn_3: require("./images/zp_btn_3.png"),
        title: require("./images/title.png"),
        gif: require("./images/gif.gif"),
        rule: require("./images/rule.png"),
        win_rule: require("./images/win_rule.png"),
        win_tip: require("./images/win_tip.png"),
        win_owner: require("./images/win_owner.jpg"),
        win_close: require("./images/win_close.png"),
        owner: require("./images/owner.png"),
        error: require("./images/error.jpg"),
        logo_default: require("./images/logo_default.png"),
        item_expried: require("./images/item_expried.png"),
        item_used: require("./images/item_used.png"),
    },
    // 大转盘奖品
    prizes: [
        // {id: 1, winning_name: "一等奖"},
        // {id: 2, winning_name: "二等奖"},
        // {id: 3, winning_name: "三等奖"},
        // {id: 4, winning_name: "四等奖"},
        // {id: 5, winning_name: "5等奖"},
        // {id: 0, winning_name: "sorry"},
    ]
}

export default data;