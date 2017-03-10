if(ENV === 'local' || ENV === 'rd'){

    require('business/index.html');
}

import business from 'business/business';
import routerMap from './router';

var router = new VueRouter({
    mode: 'history',
    routes: routerMap()
});

var app = new Vue({
    router: router,
    render: h => h(business)
})

document.addEventListener('DOMContentLoaded', function () {
    app.$mount('#app')
})
