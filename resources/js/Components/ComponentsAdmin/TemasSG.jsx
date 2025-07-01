import React, { useEffect, useState } from "react";

export default function TemasSG({ userId, onSeleccionChange }) {
    const [temas, setTemas] = useState([]);
    const [checked, setChecked] = useState({});

    useEffect(() => {
        if (!userId) return;
        fetch(`/api/temas-grupales/${userId}`)
            .then(res => res.json())
            .then(data => {
                setTemas(data);
                // Inicializa todos los checkbox como activos
                const initialChecked = {};
                data.forEach(item => {
                    initialChecked[item.id] = true;
                });
                setChecked(initialChecked);
            });
    }, [userId]);

    useEffect(() => {
        // Cada vez que checked cambie, notifica los IDs seleccionados
        if (onSeleccionChange) {
            const seleccionados = Object.entries(checked)
                .filter(([id, val]) => val)
                .map(([id]) => Number(id));
            onSeleccionChange(seleccionados);
        }
    }, [checked, onSeleccionChange]);

    const handleCheck = (id) => {
        setChecked(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Función para seleccionar/deseleccionar todos
    const handleSelectAll = () => {
        const todosMarcados = temas.every(tema => checked[tema.id]);
        const nuevoEstado = {};
        temas.forEach(tema => {
            nuevoEstado[tema.id] = !todosMarcados;
        });
        setChecked(nuevoEstado);
    };

    // Verificar si todos están seleccionados
    const todosMarcados = temas.length > 0 && temas.every(tema => checked[tema.id]);
    const algunosMarcados = temas.some(tema => checked[tema.id]);

    return (
        <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
                <h3 className="text-white font-semibold text-sm mb-2">Temas avanzado Sesiones grupales</h3>

                {/* Checkbox para seleccionar todos */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={todosMarcados}
                        ref={input => {
                            if (input) input.indeterminate = algunosMarcados && !todosMarcados;
                        }}
                        onChange={handleSelectAll}
                        className="accent-violet-500"
                    />
                    <label className="text-gray-300 text-xs">Seleccionar todos</label>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 py-1 overflow-auto">
                <table className="min-w-full text-sm text-gray-300">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 text-left">#</th>
                            <th className="px-2 py-1 text-left">Tema</th>
                            <th className="px-2 py-1 text-center">Lista</th>
                        </tr>
                    </thead>
                    <tbody>
                        {temas.map((tema, idx) => (
                            <tr key={tema.id} className="border-b border-gray-700">
                                <td className="px-2 py-1">{idx + 1}</td>
                                <td className="px-2 py-1">{tema.Tema}</td>
                                <td className="px-2 py-1 text-center">
                                    <input
                                        type="checkbox"
                                        checked={checked[tema.id] || false}
                                        onChange={() => handleCheck(tema.id)}
                                        className="accent-violet-500"
                                    />
                                </td>
                            </tr>
                        ))}
                        {temas.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-4 text-gray-400">Sin temas</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
