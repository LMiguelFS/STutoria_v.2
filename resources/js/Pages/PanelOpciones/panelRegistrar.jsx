import React, { useState } from "react";
import '../../../css/RegistroGrupalList.css';
import Registro from "../PanelRegistrar/RegistroAlumno";
import RegistroIndi from "../PanelRegistrar/registrosessionindividual";
import RegistroGrupalForm from "../PanelRegistrar/RegistroGrupal";
import BusquedaAlumno from "../PanelRegistrar/busquedaAlumnoRI";
import { usePage } from '@inertiajs/react';

export default function PanelRegistrar() {
    const [showMainModal, setShowMainModal] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [mensajeGlobal, setMensajeGlobal] = useState('');
    const [mostrarPanel, setMostrarPanel] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const { auth } = usePage().props;

    const openIndividualSession = () => {
        setShowSearchModal(true);
        setShowMainModal(false);
    };

    const handleAlumnoSelect = (alumno) => {
        setSelectedAlumno(alumno);
        setSelectedComponent(<RegistroIndi
            alumno={alumno}
            onClose={closeAllModals}
        />);
        setShowSearchModal(false);
        setShowMainModal(true);
    };

    const closeAllModals = () => {
        setShowMainModal(false);
        setShowSearchModal(false);
        setSelectedComponent(null);
        setSelectedAlumno(null);
    };

    return (
        <>
            {/* Contenedor de los botones */}
            <div className="flex-1 p-10 bg-gray-200">
                <div className="bg-white p-12 rounded-xl max-w-7xl shadow-lg flex space-x-12 justify-center">

                    <button onClick={openIndividualSession} className="flex flex-col items-center">
                        <img src="/img/alumno.png" alt="Botón 1" className="w-24 h-24 mb-4" />
                        <h2 className="text-center text-lg font-semibold">SESIONES INDIVIDUALES</h2>
                    </button>

                    <button onClick={() => {
                        setSelectedComponent(<RegistroGrupalForm onClose={closeAllModals} />);
                        setShowMainModal(true);
                    }} className="flex flex-col items-center">
                        <img src="/img/registroGrupal.png" alt="Botón 2" className="w-24 h-24 mb-4" />
                        <h2 className="text-center text-lg font-semibold">SESIONES GRUPALES</h2>
                    </button>

                    <button onClick={() => {
                        setSelectedComponent(<Registro onClose={closeAllModals} />);
                        setShowMainModal(true);
                    }} className="flex flex-col items-center">
                        <img src="/img/nino.png" alt="Botón 3" className="w-24 h-24 mb-4" />
                        <h2 className="text-center text-lg font-semibold">REGISTRAR ESTUDIANTES</h2>
                    </button>
                </div>
            </div>

            {/* Modal de búsqueda */}
            {showSearchModal && (
                <BusquedaAlumno
                    onClose={closeAllModals}
                    onSelect={handleAlumnoSelect}
                />
            )}

            {/* Modal principal */}
            {showMainModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-12 rounded-xl max-w-7xl shadow-lg flex relative">

                        <button
                            className="absolute top-4 right-4 text-red-500 text-lg font-semibold"
                            onClick={closeAllModals}
                        >
                            ❌
                        </button>
                        <div className="flex-1 overflow-auto">
                            {selectedComponent}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
