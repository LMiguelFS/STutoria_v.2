import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head } from '@inertiajs/react';

export default function GestionUsuarios({ auth }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestión de Usuarios
                </h2>
            }
        >
            <Head title="GUsuarios" />

            <div className="p-6 space-y-7">
                {/* Filtros y totales */}
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Carreras:</label>
                    <select className="border px-2 py-1">
                        <option>Todos</option>
                        <option>DSI</option>
                        <option>ASH</option>
                        <option>CO</option>
                        <option>EA</option>
                        <option>EN</option>
                        <option>MA</option>
                        <option>MP</option>
                        <option>GOT</option>
                        <option>EI</option>
                        <option>TLC</option>
                    </select>
                    <label className="text-sm font-medium">Usuario:</label>
                    <select className="border px-2 py-1">
                        <option>Todos</option>
                        <option>Tutores</option>
                        <option>Psicología</option>
                    </select>
                    <label className="text-sm font-medium">Filtro:</label>
                    <input type="text" className="border px-2 py-1 rounded" placeholder="Buscar tutor..." />
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-ce font-medium">N° Tutores=</span>
                        <input
                            type="text"
                            value="128"
                            readOnly
                            className="border px-2 py-1 w-20 text-center bg-gray-100"
                        />
                    </div>

                    <PrimaryButton>
                        <span className="text-sm">Añadir Usuario</span>
                    </PrimaryButton>

                </div>
                {/* Sección principal dividida en 3 columnas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* === Tutores === */}
                    <div className="border p-4 rounded shadow">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-bold">Tutores</h2>

                        </div>

                        <table className="w-full border mb-2">
                            <thead>
                                <tr className="bg-gray-200 text-sm">
                                    <th className="border px-2 py-1">Nombre</th>
                                    <th className="border px-2 py-1">Correo</th>
                                    <th className="border px-2 py-1">Carrera</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Aquí irían los tutores con .map() */}
                                <tr>
                                    <td className="border px-2 py-1">Juan Pérez</td>
                                    <td className="border px-2 py-1">juan@correo.com</td>
                                    <td className="border px-2 py-1">Ingeniería</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Paginación */}
                        <div className="flex justify-between items-center">
                            <button className="text-xl">{'<'}</button>
                            <select className="border px-2 py-1">
                                <option>1</option>
                                <option>2</option>
                            </select>
                            <button className="text-xl">{'>'}</button>
                        </div>
                    </div>

                    {/* === Psicólogos === */}
                    <div className="border p-4 rounded shadow">
                        <h2 className="text-lg font-bold mb-2">Psicólogo</h2>

                        <table className="w-full border mb-2">
                            <thead>
                                <tr className="bg-gray-200 text-sm">
                                    <th className="border px-2 py-1">Nombre</th>
                                    <th className="border px-2 py-1">Especialidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-2 py-1">Ana Ruiz</td>
                                    <td className="border px-2 py-1">Clínica</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Paginación */}
                        <div className="flex justify-between items-center">
                            <button className="text-xl">{'<'}</button>
                            <select className="border px-2 py-1">
                                <option>1</option>
                                <option>2</option>
                            </select>
                            <button className="text-xl">{'>'}</button>
                        </div>
                    </div>

                    {/* === Gráfico === */}
                    <div className="border p-4 rounded shadow flex flex-col items-center justify-center">
                        <h2 className="text-lg font-bold mb-2">Carreras</h2>
                        {/* Aquí se puede colocar un gráfico real con Chart.js o Recharts */}
                        <div className="w-full h-48 bg-gray-100 flex items-end justify-around">
                            <div className="w-4 h-24 bg-indigo-600"></div>
                            <div className="w-4 h-32 bg-indigo-600"></div>
                            <div className="w-4 h-28 bg-indigo-600"></div>
                        </div>
                    </div>
                </div>


            </div>
        </AuthenticatedLayout>
    );
}
