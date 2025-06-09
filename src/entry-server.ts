import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
import { useUser } from './stores/user';

export async function render(url: string, cookieHeader: string) {
    const { app, router, pinia } = createApp();

    router.push(url);
    await router.isReady();

    if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=').map(c => c.trim());
            if(key) acc[key] = decodeURIComponent(value);
            return acc;
        }, {});

        const token = cookies['token'];
        const userJson = cookies['user'];

        if (token && userJson) {
            try {
                const user = JSON.parse(userJson);

                const userStore = useUser(pinia);
                userStore.token = token;
                userStore.user = user;
            } catch (e) {
                console.error("Gagal mem-parsing cookie user di server", e);
            }
        }
    }


    const ctx = {};
    const html = await renderToString(app, ctx);

    const initialState = pinia.state.value;

    return { html, initialState };
}