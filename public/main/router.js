// import Vue from 'vue'


export default [
    {
        name: 'home',
        path: '/', 
        meta: { title: '首页'},
        component: resolve => require(['business/home/home'], resolve)
    },
    {
        name: 'detail',
        path: '/detail/:id',
        meta: { title: '详情'}, 
        component: resolve => require(['business/detail/detail'], resolve)
    },
    {
        name: 'channel',
        path: '/channel/:name',
        meta: { title: '频道'}, 
        component: resolve => require(['business/channel/channel'], resolve)
    }       
];


    