// import Vue from 'vue'


export default function(){

    var routerMap = [
        {
            name: 'dazhuanpan.index',
            path: prefix('/dazhuanpan/index'),
            meta: { title: '幸运大转盘'},
            component: resolve => require(['business/dazhuanpan/index'], resolve)
        }
    ];


    function prefix(path=''){

        return '/' + MODULE_NAME + path;

    }

    return routerMap;
}