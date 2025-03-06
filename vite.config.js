import react from '@vitejs/plugin-react';
import fs from 'fs';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

// --- Configuración de la base URL ---
const isProduction = process.env.APP_ENV === 'production';
const baseUrl = isProduction ? '/rroom/' : '/';  // <--- ¡CLAVE!

// --- Configuración del host y HTTPS ---
const host = isProduction ? 'wandori.us' : process.env.APP_HOST || 'localhost';
const useHttps = isProduction;

let serverConfig = {
    host,
    port: 5173,
    hmr: isProduction
        ? false
        : {
              host,
              clientPort: 5173,
          },
};

if (useHttps) {
    serverConfig.https = {
        //  Ajuste para rutas relativas en producción, si es necesario.
        key: isProduction ? fs.readFileSync('/etc/letsencrypt/live/wandori.us/privkey.pem') : null, //No necesitamos el certificado cuando es development
        cert: isProduction ? fs.readFileSync('/etc/letsencrypt/live/wandori.us/fullchain.pem') : null,
    };
}

export default defineConfig({
    base: baseUrl,  // <--- ¡Añadido aquí!
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