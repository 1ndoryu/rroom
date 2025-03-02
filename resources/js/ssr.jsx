// resources/js/ssr.jsx
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { renderToString } from 'react-dom/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        resolve: (name) => {
            const pagePromise = resolvePageComponent(
                `./Pages/${name}.jsx`,
                import.meta.glob('./Pages/**/*.jsx')
            );
            return pagePromise.then((module) => {
                // Ya se esta pasando el default, no es necesario volver a pasarlo
                return module;
            });
        },
        setup: ({ App, props }) => {
            return <App {...props} />;
        },
    })
);