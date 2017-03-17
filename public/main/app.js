if(ENV === 'local' || ENV === 'rd'){

    require('business/index.html');
}

// require('public/third_party/jquery.easing.min.js');
// require('public/third_party/jQueryRotate.js');    

import business from 'business/business';
import routerMap from './router';

var router = new VueRouter({
    mode: 'history',
    routes: routerMap()
});

router.afterEach((to, from) => {
    
    if (to.meta.title) {
        document.title = to.meta.title;
    }

});

var app = new Vue({
    router: router,
    render: h => h(business)
})

document.addEventListener('DOMContentLoaded', function () {
    app.$mount('#app')
})
