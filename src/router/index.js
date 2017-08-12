import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from '../components/Dashboard.vue';
import Backups from '../components/Backups.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: Dashboard,
            name: 'dashboard',
        },
        {
            path: '/backups',
            component: Backups,
            name: 'backups',
        },
    ],
});
