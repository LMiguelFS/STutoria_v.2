import React, { useState } from "react";
import Registro from "../PanelOpciones/Registro"; // Asegúrate de que la ruta al componente Registro sea correcta
import RegistroIndi from "../PanelOpciones/registrosessionindividual";

export default function PanelRegistrar() {
    const [showModal, setShowModal] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);

    const openModal = (component) => {
        setSelectedComponent(component);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedComponent(null);
    };

    return (
        <>
            {/* Contenedor de los botones */}
            <div className="flex-1 p-10 bg-gray-200">
                <div className="bg-white p-12 rounded-xl max-w-3xl shadow-lg flex space-x-12 justify-center">

                    <button onClick={() => openModal(<RegistroIndi />)} className="flex flex-col items-center">
                        <img src="/img/alumno.png" alt="Botón 1" className="w-24 h-24 mb-4" />
                        <h2 className="text-center text-lg font-semibold">SESIONES INDIVIDUALES</h2>
                    </button>

                    <button onClick={() => openModal()} className="flex flex-col items-center">
                        <img src="/img/registroGrupal.png" alt="Botón 2" className="w-24 h-24 mb-4" />
                        <h2 className="text-center text-lg font-semibold">SESIONES GRUPALES</h2>
                    </button>

                    <button onClick={() => openModal(<Registro />)} className="flex flex-col items-center">
                        <img src="/img/nino.png" alt="Botón 3" className="w-24 h-24 mb-4" />
                        <h2 className="text-center text-lg font-semibold">REGISTRAR ESTUDIANTES</h2>
                    </button>

                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-12 rounded-lg shadow-lg max-w-2xl w-full">
                        <button
                            className="text-red-500 text-lg font-semibold mb-6"
                            onClick={closeModal}
                        >
                            Cerrar
                        </button>
                        {/* Renderiza el componente seleccionado en el modal */}
                        {selectedComponent}
                    </div>
                </div>
            )}
        </>
    );
}
