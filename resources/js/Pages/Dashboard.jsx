import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout1 from '@/Layouts/AuthenticatedLayout1';
import '../../css/panelGeneral.css';
import PanelRegistrar from '../Pages/PanelOpciones/panelRegistrar';
import PanelReportes from '../Pages/PanelOpciones/panelReportes';

export default function Dashboard() {
    const [selectedOption, setSelectedOption] = useState('En este apartado podras crear registros de sesiones individuales, grupales y registrar a alumnos');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <AuthenticatedLayout1

        >
            <Head title="Panel" />

            <div className="flex">
                {/* Panel izquierdo */}
                <div className="bg-blue-900 text-white w-64 h-screen p-4 flex flex-col items-center space-y-4">

                    <button
                        className={`flex items-center justify-between w-full px-10 py-5 text-lg font-semibold rounded-lg ${selectedOption === 'En este apartado podras crear registros de sesiones individuales, grupales y registrar a alumnos' ? 'bg-blue-700' : ''
                            }`}
                        onClick={() => handleOptionClick('En este apartado podras crear registros de sesiones individuales, grupales y registrar a alumnos')}
                    >
                        {/* Texto a la izquierda */}
                        <span>REGISTRAR</span>

                        {/* Imagen a la derecha y centrada */}
                        <img src="/img/GenerarI.png" alt="Registrar" className="w-12 h-15 ml-9" />
                    </button>

                    <button
                        className={`flex items-center justify-between w-full px-10 py-5 text-lg font-semibold rounded-lg ${selectedOption === 'En este apartado podras buscar registros individuales/grupales o de alumnos y poder modificar o eliminar' ? 'bg-blue-700' : ''
                            }`}
                        onClick={() => handleOptionClick('En este apartado podras buscar registros individuales/grupales o de alumnos y poder modificar o eliminar')}
                    >
                        {/* Texto a la izquierda */}
                        <span>CONSULTAR</span>
                        <img src="/img/Buscar_I.png" alt="Consultar" className='w-12 h-15 ml-6' />

                    </button>

                    <button
                        className={`flex items-center justify-between w-full px-10 py-5 text-lg font-semibold rounded-lg ${selectedOption === 'En este apartado podras buscar sesiones individuales proximas y poder notificar a dicho estudiane' ? 'bg-blue-700' : ''
                            }`}
                        onClick={() => handleOptionClick('En este apartado podras buscar sesiones individuales proximas y poder notificar a dicho estudiane')}
                    >
                        <span>NOTIFICAR</span>
                        <img src="/img/notificacion_I.png" alt="Notificaciones" className="w-12 h-15 ml-10" />

                    </button>
                    <button
                        className={`flex items-center justify-between w-full px-10 py-5 text-lg font-semibold rounded-lg ${selectedOption === 'estadistica' ? 'bg-blue-700' : ''
                            }`}
                        onClick={() => handleOptionClick('estadistica')}
                    >
                        <span>ESTADISTICA</span>
                        <img src="/img/analitica.png" alt="Estadística" className="w-12 h-15 ml-4" />

                    </button>
                    <button
                        className={`flex items-center justify-between w-full px-10 py-5 text-lg font-semibold rounded-lg ${selectedOption === 'En este apartado podras generar informes grupales e individuales de las sesiones realizadas' ? 'bg-blue-700' : ''
                            }`}
                        onClick={() => handleOptionClick('En este apartado podras generar informes grupales e individuales de las sesiones realizadas')}
                    >
                        <span>REPORTE</span>
                        <img src="/img/Reporte.png" alt="Reporte" className="w-12 h-15 ml-12" />
                    </button>
                </div>

                <div className="flex flex-col min-h-screen bg-gray-100">
                    {/* Contenedor del cuadro de texto */}
                    <center>
                        <div className="flex-1 p-6 bg-gray-100">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <center>
                                    <h3 className="text-2xl font-semibold text-gray-800">
                                        {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
                                    </h3>
                                </center>
                            </div>
                        </div>
                    </center>

                    {/* Contenedor del segundo panel que estará debajo  */}
                    <center>
                        <div className="flex-1 p-6 bg-gray-100">
                            <div className="bg-white p-4 rounded-lg shadow-ml mx-auto max-h-30 ">
                                <center>
                                    {selectedOption === 'En este apartado podras crear registros de sesiones individuales, grupales y registrar a alumnos' ? (
                                        <PanelRegistrar />
                                    ) : (
                                        <h3 className="text-2xl font-semibold text-gray-800">
                                            {/* Aquí puedes agregar contenido alternativo si es necesario */}
                                        </h3>
                                    )}
                                    {selectedOption === 'En este apartado podras generar informes grupales e individuales de las sesiones realizadas' ? (
                                        <PanelReportes />
                                    ) : (
                                        <h3 className="text-2xl font-semibold text-gray-800">
                                            {/* Aquí puedes agregar contenido alternativo si es necesario */}
                                        </h3>
                                    )}
                                </center>
                            </div>
                        </div>
                    </center>
                </div>

            </div>
        </AuthenticatedLayout1>
    );
}
