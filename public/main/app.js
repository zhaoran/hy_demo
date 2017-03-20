if(ENV === 'local' || ENV === 'rd'){

    require('business/index.html');
}

import business from 'business/business';
import routerMap from './router';
import interceptors from './interceptors';

var router = new VueRouter({
    mode: 'history',
    routes: routerMap()
});

router.afterEach((to, from) => {
    
    if (to.meta.title) {
        document.title = to.meta.title;
    }

});

Vue.http.interceptors.push(interceptors);

var app = new Vue({
    router: router,
    render: h => h(business)
})

document.addEventListener('DOMContentLoaded', function () {
    app.$mount('#app')
})
