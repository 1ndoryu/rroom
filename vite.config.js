import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.APP_URL, // Usa APP_URL directamente.  ¡Mucho más limpio!
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
            '@svgs': path.resolve(__dirname, 'resources/assets/svgs'), // Si tienes la carpeta
            'ziggy-vue': path.resolve('vendor/tightenco/ziggy/dist/vue.es.js'),  //Si usas vue
            ziggy: path.resolve('vendor/tightenco/ziggy/dist'),//Si usas ziggy
        },
    },
    ssr: {
        noExternal: ['@inertiajs/react'], // Solo si usas SSR
    },
    server: {
        host: 'localhost',
        port: 5173,
    },
});