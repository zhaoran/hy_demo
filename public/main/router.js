// import Vue from 'vue'


export default function(){

    var routerMap = [
        {
            name: 'dazhuanpan.index',
            path: prefix('/dazhuanpan/index'),
            component: resolve => require(['business/dazhuanpan/index'], resolve)
        },
        {
            name: 'dazhuanpan.prizeList',
            path: prefix('/dazhuanpan/prize_list'),
            component: resolve => require(['business/dazhuanpan/prize_list'], resolve)
        }
    ];


    function prefix(path=''){

        return '/' + MODULE_NAME + path;

    }

    return routerMap;
}