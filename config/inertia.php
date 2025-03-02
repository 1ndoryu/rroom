<?php

return [
    'ssr' => [
        'enabled' => env('INERTIA_SSR_ENABLED', true),
        'bundle'  => env('INERTIA_SSR_BUNDLE', public_path('build/ssr.js')),
    ],
];
