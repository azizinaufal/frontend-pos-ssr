import { createApp } from './main';

(async () => {
    const { app, router, pinia } = createApp();
    const VueApexCharts = (await import('vue3-apexcharts')).default;
    const VueAwesomePaginate = (await import('vue-awesome-paginate')).default;

    app.use(VueApexCharts);
    app.use(VueAwesomePaginate);


    if (window.__INITIAL_STATE__) {
        pinia.state.value = window.__INITIAL_STATE__;
    }

    await router.isReady();

    app.mount('#app');
})();