import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout1 from '@/Layouts/AuthenticatedLayout1';
import '../../css/panelGeneral.css';
import PanelRegistrar from '../Pages/PanelOpciones/panelRegistrar';
import PanelReportes from '../Pages/PanelOpciones/panelReportes';
import Notificaciones from '../Pages/PanelOpciones/notificaciones';
import ModificarD from '../Pages/PanelModificadores/panelGeneralEditacion';
import Estadistica from '../Pages/Estadistica/panel';
import Derivacion from '../Pages/PanelOpciones/derivacion';

export default function Dashboard() {
    const [selectedOption, setSelectedOption] = useState('En este apartado podrás crear registros de sesiones individuales, grupales y registrar a alumnos');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <AuthenticatedLayout1>
            <Head title="Panel" />
            <div className="flex min-h-screen bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300">
                {/* Sidebar mejorado */}
                <div className="bg-purple-900 text-white w-20 md:w-44 lg:w-60 p-2 md:p-4 flex flex-col items-center space-y-3 md:space-y-8 shadow-lg min-h-screen transition-all duration-300">
                    <span className="text-lg font-bold mb-0.25 hidden md:block">Opciones</span>
                    {[
                        { label: 'REGISTRAR', img: '/img/GenerarI.png', description: 'En este apartado podrás crear registros de sesiones individuales, grupales y registrar a alumnos prueba' },
                        { label: 'CONSULTAR', img: '/img/Buscar_I.png', description: 'En este apartado podrás buscar registros individuales/grupales o de alumnos y poder modificar o eliminar' },
                        { label: 'NOTIFICAR', img: '/img/notificacion_I.png', description: 'En este apartado podrás buscar sesiones individuales próximas y notificar al estudiante' },
                        { label: 'ESTADÍSTICA', img: '/img/analitica.png', description: 'En este apartado podrás visualizar estadistica de los diferentes analisis de las sesiones de tutoria' },
                        { label: 'REPORTES ', img: '/img/Reporte.png', description: 'En este apartado podrás generar informes grupales e individuales de las sesiones realizadas' },
                        { label: 'DERIVACIóN ', img: '/img/derivacion.png', description: 'En este apartado podrás derivar a un alumno al area de Psicología' },
                    ].map((option) => (
                        <button
                            key={option.label}
                            className={`flex flex-col md:flex-row items-center w-16 md:w-full px-2 md:px-4 py-3 md:py-5 text-xs md:text-base font-semibold rounded-xl transition-all duration-300
                                ${selectedOption === option.description
                                    ? 'bg-purple-700 text-yellow-300 scale-105 shadow-lg'
                                    : 'bg-purple-800 hover:bg-purple-700 hover:scale-105'}
                                focus:outline-none`}
                            onClick={() => handleOptionClick(option.description)}
                        >
                            <img src={option.img} alt={option.label} className="w-8 h-8 md:w-10 md:h-10 mb-1 md:mb-0 md:mr-3" />
                            <span className="hidden md:inline">{option.label}</span>
                        </button>
                    ))}
                </div>

                {/* Contenido principal mejorado */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-2 md:p-6">
                    <div className="w-full max-w-6xl flex flex-col gap-6">
                        <div className="bg-white/80 p-4 md:p-8 rounded-2xl shadow-xl mb-2 text-center">
                            <h3 className="text-xl md:text-3xl font-bold text-purple-800">
                                {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
                            </h3>
                        </div>
                        <div className="bg-white p-2 md:p-8 rounded-2xl shadow-lg flex-1 flex items-center justify-center min-h-[350px] md:min-h-[450px]">
                            <div className="w-full h-full flex items-center justify-center">
                                {selectedOption === 'En este apartado podrás crear registros de sesiones individuales, grupales y registrar a alumnos prueba' && <PanelRegistrar />}
                                {selectedOption === 'En este apartado podrás generar informes grupales e individuales de las sesiones realizadas' && <PanelReportes />}
                                {selectedOption === 'En este apartado podrás buscar sesiones individuales próximas y notificar al estudiante' && <Notificaciones />}
                                {selectedOption === 'En este apartado podrás buscar registros individuales/grupales o de alumnos y poder modificar o eliminar' && <ModificarD />}
                                {selectedOption === 'En este apartado podrás visualizar estadistica de los diferentes analisis de las sesiones de tutoria' && <Estadistica />}
                                {selectedOption === 'En este apartado podrás derivar a un alumno al area de Psicología' && <Derivacion />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout1>
    );
}
