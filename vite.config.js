// vite.config.js
import react from '@vitejs/plugin-react';
import fs from 'fs';
import laravel from 'laravel-vite-plugin';
import path from 'path'; // Importa 'path'
import { defineConfig } from 'vite';

// Para producción usamos el dominio real
const isProduction = process.env.APP_ENV === 'production';
const host = isProduction ? 'wandori.us' : process.env.APP_HOST || 'localhost';
const useHttps = isProduction;

let serverConfig = {
    host,
    port: 5173,
    // Si estamos en producción, deshabilitamos HMR para que no se intente conectarse vía WebSocket
    hmr: isProduction
        ? false
        : {
              host,
              clientPort: 5173,
          },
};

if (useHttps) {
    serverConfig.https = {
        key: fs.readFileSync(`/etc/letsencrypt/live/wandori.us/privkey.pem`),
        cert: fs.readFileSync(`/etc/letsencrypt/live/wandori.us/fullchain.pem`),
    };
}

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {

        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@svgs': path.resolve(__dirname, 'resources/assets/svgs'),
            'ziggy-vue': path.resolve('vendor/tightenco/ziggy/dist/vue.es.js'),
            ziggy: path.resolve('vendor/tightenco/ziggy/dist'),
        },
    },
    ssr: {

        noExternal: ['@inertiajs/react'],
    },
});
