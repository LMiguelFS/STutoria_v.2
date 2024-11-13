import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Primero intenta buscar en Pages
        const pages = import.meta.glob('./Pages/**/*.jsx');
        // Luego intenta buscar en components
        const components = import.meta.glob('./components/**/*.jsx');

        // Devuelve el componente encontrado
        return resolvePageComponent(
            `./Pages/${name}.jsx`, pages) || resolvePageComponent(`./components/${name}.jsx`, components);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
