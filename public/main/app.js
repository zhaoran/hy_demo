if(ENV === 'local' || ENV === 'rd'){

    require('business/index.html');
}

import 'public/third_party/zepto';
import Vue from 'vue';
import VueRouter from 'vue-router';
import routerMap from './router';
import Business from 'business/business';

Vue.use(VueRouter);

var router = new VueRouter({
    base: '/' + MODULE_NAME,
    mode: 'history',
    routes: routerMap
});

router.afterEach((to, from) => {
    
    if (to.meta.title) {
        document.title = to.meta.title;
    }

});


var app = new Vue({
    router: router,
    render: h => h(Business)
})

document.addEventListener('DOMContentLoaded', function () {
    app.$mount('#app')
})
