import { createRouter, createWebHistory,createMemoryHistory, type RouteRecordRaw } from "vue-router";
import { useUser } from "../stores/user.ts";
import Cookies from 'js-cookie';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'index',
        component: ()=>import('../views/LandingPage/Index.vue'),
    },
    {
        path: '/login',
        beforeEnter: (_to, _from, next) => {
            useUser().getToken ? next('/dashboard') : next()
        },
        name: 'login',
        component: ()=>import('../views/auth/Login.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component:  ()=>import('../views/auth/Register.vue'),
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component:  ()=>import('../views/dashboard/DashboardLayout.vue'),
        beforeEnter: (_to, _from, next) => {
            useUser().getToken ? next() : next('/')
        },
        children: [
            {
                path: "",
                name: '/dashboard.index',
                component:  ()=>import('../views/dashboard/Index.vue'),
            },
            {
                path: '/categories',
                name: 'categories.index',
                component:  ()=>import('../views/categories/Categories.vue'),
            },
            {
                path: '/products',
                name: 'products.index',
                component:  ()=>import('../views/products/Product.vue'),
            },
            {
                path: '/customers',
                name: 'customer.index',
                component:  ()=>import('../views/customers/Customer.vue'),
            },
            {
                path: '/users',
                name: 'user.index',
                component:  ()=>import('../views/profil/Profil.vue'),
            },
            {
                path: '/transactions',
                name: 'transaction.index',
                component:  ()=>import('../views/transactions/Transaction.vue'),
            },
            {
                path: '/transactions/print',
                name: 'transaction.print',
                component:  ()=>import('../views/transactions/print/Print.vue'),
            },
            {
                path: '/sales',
                name: 'sales.index',
                component:  ()=>import('../views/sales/Sales.vue'),
            },
            {
                path: '/profits',
                name: 'profit.index',
                component:  ()=>import('../views/profits/Profits.vue'),
            },
        ]
    },
];

export function createVueRouter() {
    const router = createRouter({
        history: import.meta.env.SSR
            ? createMemoryHistory()
            : createWebHistory(),
        routes
    });


    router.beforeEach((to, _from, next) => {

        const userStore = useUser();

        if (!userStore.token || !userStore.user) {
            const token = Cookies.get('token');
            const user = Cookies.get('user');

            if (token && user) {
                userStore.token = token;
                userStore.user = JSON.parse(user);
            }
        }


        if (to.name === 'login' && userStore.getToken) {
            return next({ name: 'dashboard.index' });
        }


        if (to.path.startsWith('/dashboard') && !userStore.getToken) {
            return next({ name: 'login' });
        }


        return next();
    });

    return router;
}