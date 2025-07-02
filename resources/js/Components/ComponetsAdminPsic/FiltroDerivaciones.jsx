export default function FiltroDerivaciones({ filtros, setFiltros }) {

    const carreras = [
        { value: 'Todos', label: 'Todas las carreras' },
        { value: 'DSI', label: 'DSI' },
        { value: 'ASH', label: 'ASH' },
        { value: 'CO', label: 'CO' },
        { value: 'EA', label: 'EA' },
        { value: 'EN', label: 'EN' },
        { value: 'MA', label: 'MA' },
        { value: 'MP', label: 'MP' },
        { value: 'GOT', label: 'GOT' },
        { value: 'EI', label: 'EI' },
        { value: 'TLC', label: 'TLC' }
    ];
    const ciclos = [
        { value: 'Todos', label: 'Todas los ciclos' },
        { value: '1er', label: '1er' },
        { value: '2do', label: '2do' },
        { value: '3ro', label: '3ro' },
        { value: '4to', label: '4to' },
        { value: '5to', label: '5to' },
        { value: '6to', label: '6to' }
    ];
    const handleFiltroChange = (campo, valor) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };
    const limpiarFiltros = () => {
        setFiltros({ carrera: 'Todos', ciclo: 'Todos' });
    };
    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Header con filtros */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">

                <div className="flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                        <div className="flex-[2]">
                            <label className="block text-sm font-medium text-indigo-100 mb-2">
                                Programas de estudios
                            </label>
                            <select
                                value={filtros.carrera}
                                onChange={(e) => handleFiltroChange('carrera', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            >
                                {carreras.map(carrera => (
                                    <option key={carrera.value} value={carrera.value}>
                                        {carrera.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1.7">
                            <label className="block text-sm font-medium text-indigo-100 mb-2">
                                Semestre
                            </label>
                            <select
                                value={filtros.ciclo}
                                onChange={(e) => handleFiltroChange('ciclo', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                {ciclos.map(ciclo => (
                                    <option key={ciclo.value} value={ciclo.value}>
                                        {ciclo.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className="mb-0 mt-1">
                            <button
                                onClick={limpiarFiltros}
                                className="bg-black bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
