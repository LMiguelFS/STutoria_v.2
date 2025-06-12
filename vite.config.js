import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'], // Asegúrate de incluir el archivo correcto
            refresh: true, // Activa la recarga automática
        }),
        react(),
    ],
    server: {
        host: 'localhost', // Cambia esto por tu IP local
        port: 8000, // Puerto del servidor de desarrollo
    },
});
