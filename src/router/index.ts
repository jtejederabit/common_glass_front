import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/Customers.vue'),
        },
    ],
});

router.beforeEach((to, _ , next) => {
    if (to.path === '/' && !to.query.currentPage) {
        // Si la ruta es / afegim el query currentPage amb el valor 1 per tal de no afectar la paginació d'altres vistes
        // que utilitzin la mateixa DataTable
        next({ path: '/', query: { currentPage: '1' }});
    } else {
        next();
    }
});

export default router;
