import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

async function createServer() {
    const app = express();

    let vite;
    if (!isProd) {
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom'
        });

        app.use(vite.middlewares);
    } else {

        app.use(express.static(path.resolve(__dirname, 'dist/client'), { index: false }));
    }


    app.use('*', async (req, res, next) => {
        const url = req.originalUrl;

        try {
            let template, render;
            if (!isProd) {
                template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule('/src/entry-server.ts')).render;
            } else {
                template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
                render = (await import('./dist/server/entry-server.js')).render;
            }


            const cookie = req.headers.cookie || '';
            const { html: appHtml, initialState } = await render(url, cookie);
            const html = template
                .replace(`<!--app-html-->`, appHtml)
                .replace(
                    '/*ssr-initial-state*/',
                    `window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}`
                );

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            if(vite) vite.ssrFixStacktrace(e);
            next(e);
        }
    });

    const port = process.env.PORT || 5173;
    app.listen(port, () => {
        console.log(`Frontend SSR Server running at http://localhost:${port}`);
    });
}

createServer();