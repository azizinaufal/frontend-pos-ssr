import { createApp as createVueApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createVueRouter } from './routes';
// import VueApexCharts from 'vue3-apexcharts';
// import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";
import './style.css';


export function createApp() {
    const app = createVueApp(App);
    const pinia = createPinia();
    const router = createVueRouter();

    app.use(pinia)
        .use(router)
        // .use(VueAwesomePaginate);
    // .use(VueApexCharts)

    return { app, router, pinia };
}