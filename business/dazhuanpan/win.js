/**
 * 弹窗控制
 */

import Data from './data';

let win = {
    // 显示规则窗口
    ruleWinShow(){
        Data.show.win_rule = true;
    },
    // 显示提示信息窗口
    tipWinShow(statusWin){
        Data.show.win_tip = true;
        Data.statusWin = statusWin;
    },
    // 关闭窗口
    hideWin(){
        Data.show.win_rule = false;
        Data.show.win_tip = false;
        Data.statusWin = undefined;
        Data.show.win_owner = false;

        // 清理登录数据
        if(!Data.loginParams.puid){
            Data.loginParams.telephone = undefined;
        }
    }
};

export default win;