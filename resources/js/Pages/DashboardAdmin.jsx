import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function DashboardPsicologo({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Panel del Psicólogo" />

            <div className="py-6 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6 transition-colors duration-300">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            👩‍⚕️ Bienvenido(a), {auth.user.name}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded shadow text-center">
                                <h2 className="text-xl font-semibold dark:text-white">Alumnos registrados</h2>
                                <p className="text-3xl mt-2 font-bold text-[#4b0082] dark:text-indigo-300">128</p>
                            </div>

                            <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded shadow text-center">
                                <h2 className="text-xl font-semibold dark:text-white">Derivaciones realizadas</h2>
                                <p className="text-3xl mt-2 font-bold text-[#4b0082] dark:text-indigo-300">42</p>
                            </div>

                            <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded shadow text-center">
                                <h2 className="text-xl font-semibold dark:text-white">Sesiones activas</h2>
                                <p className="text-3xl mt-2 font-bold text-[#4b0082] dark:text-indigo-300">5</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
