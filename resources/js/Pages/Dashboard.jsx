import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout1 from '@/Layouts/AuthenticatedLayout1';
import '../../css/panelGeneral.css';
import PanelRegistrar from '../Pages/PanelOpciones/panelRegistrar';
import PanelReportes from '../Pages/PanelOpciones/panelReportes';
import Notificaciones from '../Pages/PanelOpciones/notificaciones';
import ModificarD from '../Pages/PanelModificadores/panelGeneralEditacion';
import Estadistica from '../Pages/Estadistica/panel';

export default function Dashboard() {

    const [selectedOption, setSelectedOption] = useState('En este apartado podrás crear registros de sesiones individuales, grupales y registrar a alumnos');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    return (
        <AuthenticatedLayout1>
            <Head title="Panel" />
            <div className="flex">
                {/* Panel izquierdo */}
                <div className="bg-purple-900 text-white w-65   p-4 flex flex-col items-center space-y-4 shadow-lg">
                    {[
                        { label: 'REGISTRAR', img: '/img/GenerarI.png', description: '---En este apartado podrás crear registros de sesiones individuales, grupales y registrar a alumnos---' },
                        { label: 'CONSULTAR', img: '/img/Buscar_I.png', description: 'En este apartado podrás buscar registros individuales/grupales o de alumnos y poder modificar o eliminar' },
                        { label: 'NOTIFICAR', img: '/img/notificacion_I.png', description: '----En este apartado podrás buscar sesiones individuales próximas y notificar al estudiante----' },
                        { label: 'ESTADÍSTICA', img: '/img/analitica.png', description: 'En este apartado podrás visualizar estadistica de los diferentes analisis de las sesiones de tutoria' },
                        { label: 'REPORTES ', img: '/img/Reporte.png', description: '-------En este apartado podrás generar informes grupales e individuales de las sesiones realizadas-------' },
                    ].map((option) => (
                        <button
                            key={option.label}
                            className={`flex items-center  h-35 px-7 py-10 text-lg font-semibold rounded-lg transition-all duration-300 ${selectedOption === option.description ? 'bg-purple-700 text-yellow-300' : 'bg-purple-800 hover:bg-purple-700'}`}
                            onClick={() => handleOptionClick(option.description)}
                        >
                            <img src={option.img} alt={option.label} className="w-12 h-12 mr-4" />
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>

                {/* Contenido principal */}
                <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300">
                    <center>
                        <div className="flex-1 p-6">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl font-semibold text-purple-800">
                                    {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
                                </h3>
                            </div>
                        </div>
                    </center>
                    <center>
                        <div className="flex-1 p-6">
                            <div className="bg-white p-4 rounded-lg shadow-md mx-auto max-h-30">
                                {selectedOption === '---En este apartado podrás crear registros de sesiones individuales, grupales y registrar a alumnos---' && <PanelRegistrar />}
                                {selectedOption === '-------En este apartado podrás generar informes grupales e individuales de las sesiones realizadas-------' && <PanelReportes />}
                                {selectedOption === '----En este apartado podrás buscar sesiones individuales próximas y notificar al estudiante----' && <Notificaciones />}
                                {selectedOption === 'En este apartado podrás buscar registros individuales/grupales o de alumnos y poder modificar o eliminar' && <ModificarD />}
                                {selectedOption === 'En este apartado podrás visualizar estadistica de los diferentes analisis de las sesiones de tutoria' && <Estadistica />}
                            </div>
                        </div>
                    </center>
                </div>
            </div>
        </AuthenticatedLayout1>
    );
}
