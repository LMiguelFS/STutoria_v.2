import React, { useState, useEffect } from 'react';

export default function EstadUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [carreras, setCarreras] = useState([]);
    const [selectedCarrera, setSelectedCarrera] = useState('Todos');
    const [selectedUsuario, setSelectedUsuario] = useState('Todos');

    useEffect(() => {
        // Fetch usuarios and carreras from API or props
        fetchUsuarios();
        fetchCarreras();
    }, []);

    const fetchUsuarios = async () => {
        // Simulate fetching usuarios
        const fetchedUsuarios = [
            { id: 1, name: 'Usuario 1', carrera: 'DSI' },
            { id: 2, name: 'Usuario 2', carrera: 'ASH' },
            // ... more usuarios
        ];
        setUsuarios(fetchedUsuarios);
    };

    const fetchCarreras = async () => {
        // Simulate fetching carreras
        const fetchedCarreras = ['Todos', 'DSI', 'ASH', 'CO', 'EA'];
        setCarreras(fetchedCarreras);
    };

    return (

        <div className="border p-4 rounded shadow flex flex-col items-center justify-center">
            <h2 className="text-lg font-bold mb-2">Carreras</h2>
            {/* Aquí se puede colocar un gráfico real con Chart.js o Recharts */}
            <div className="w-full h-48 bg-gray-100 flex items-end justify-around">
                <div className="w-4 h-24 bg-indigo-600"></div>
                <div className="w-4 h-32 bg-indigo-600"></div>
                <div className="w-4 h-28 bg-indigo-600"></div>
            </div>
        </div>
    );
}
