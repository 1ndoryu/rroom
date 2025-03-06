import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

const baseUrl = process.env.APP_ENV === 'production' ? '/rroom/' : '/'; // Correcto

export default defineConfig({
    base: baseUrl,  // Correcto
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            ssr: 'resources/js/ssr.jsx', //  Considera si realmente necesitas SSR
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@svgs': path.resolve(__dirname, 'resources/assets/svgs'),  // Asumiendo que tienes esta carpeta
            'ziggy-vue': path.resolve('vendor/tightenco/ziggy/dist/vue.es.js'), // Solo si usas Vue *y* Ziggy
            ziggy: path.resolve('vendor/tightenco/ziggy/dist'), // Solo si usas Ziggy
        },
    },
    ssr: {
        noExternal: ['@inertiajs/react'], // Solo si usas SSR
    },
    //  SIMPLIFICACIÓN DRÁSTICA del servidor de desarrollo
    server: {
        host: 'localhost', //  Usa localhost directamente
        port: 5173,       //  Puerto por defecto
        //  https: false,   //  ¡No necesitamos HTTPS en desarrollo!
        //  hmr: false,     //  HMR suele funcionar bien por defecto.  Quítalo a menos que tengas problemas *específicos* con HMR.
    },
});