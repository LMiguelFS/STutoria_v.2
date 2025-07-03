import React, { useState } from "react";
import '../../../css/RegistroGrupalList.css';
import Registro from "../PanelRegistrar/RegistroAlumno";
import Estadisticacategoria from "../Estadistica/estadistica";
import Estadisticasatencion from "./estadisticaatencion";


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
                <div className="bg-white p-12 rounded-xl max-w-7xl shadow-lg flex space-x-12 justify-center">

                    <button onClick={() => openModal(<Estadisticacategoria />)} className="flex flex-col items-center">
                        <img src="/img/graficoCategoria.png" alt="Botón 1" className="w-24 h-24 mb-4" />
                        <h2 className="text-center text-lg font-semibold">ESTADISTICA CATEGORIA</h2>
                    </button>

                    <button onClick={() => openModal(<Estadisticasatencion />)} className="flex flex-col items-center">
                        <img src="/img/graficoInvestigacion.png" alt="Botón 2" className="w-24 h-24 mb-4" />
                        <h2 className="text-center text-lg font-semibold">SESIONES INDIVIDUALES</h2>
                    </button>

                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-12 rounded-xl max-w-7xl shadow-lg flex">
                        {/* Botón "Cerrar" */}
                        <div className="mr-4">
                            <button
                                className="text-red-500 text-lg font-semibold"
                                onClick={closeModal}
                            >
                                Cerrar
                            </button>
                        </div>
                        {/* Contenido del modal */}
                        <div className="flex-1 overflow-auto">
                            {selectedComponent}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
