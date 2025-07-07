"use client";

import { useState, useEffect } from 'react';
import { fetchAutos } from '@/features/autos/services';
import MantenimientoList from "@/features/mantenimiento/components/MantenimientoList";
import { Car, History } from 'lucide-react';
import { AutoConImagenes } from '@/features/autos/types';
import Error from 'next/error';

function MantenimientoPage() {
    const [autos, setAutos] = useState<AutoConImagenes[]>([]);
    const [selectedAutoId, setSelectedAutoId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Auto seleccionado actual
    const selectedAuto = autos.find(auto => auto.id === selectedAutoId) || null;
    
    // Cargar los autos al montar el componente
    useEffect(() => {
        const loadAutos = async () => {
            try {
                setLoading(true);
                const autosData = await fetchAutos();
                setAutos(autosData);
                
                // Seleccionar el primer auto por defecto (si hay alguno)
                if (autosData.length > 0) {
                    setSelectedAutoId(autosData[0].id);
                }
            } catch (err) {
                console.error('Error cargando autos:', err);
                setError('Error al cargar los vehículos');
            } finally {
                setLoading(false);
            }
        };
        
        loadAutos();
    }, []);

    // Manejar cambio de auto seleccionado
    const handleAutoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const autoId = parseInt(e.target.value);
        setSelectedAutoId(autoId);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-base-200/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-base-300 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <History className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-primary">Historial de Mantenimientos</h1>
                        </div>
                        <p className="text-base-content/70 text-sm ml-1">
                            Consulta y gestiona el historial de mantenimiento de tus vehículos
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        {loading ? (
                            <div className="animate-pulse bg-base-300 h-10 w-64 rounded-md"></div>
                        ) : error ? (
                            <div className="text-error text-sm">{error}</div>
                        ) : (
                            <div className="form-control">
                                <label className="input-group">
                                    <select 
                                        className="select select-bordered w-full md:w-64 bg-base-100/70 focus:bg-base-100"
                                        value={selectedAutoId || ''}
                                        onChange={handleAutoChange}
                                    >
                                        <option value="" disabled>Seleccione un vehículo</option>
                                        {autos.map(auto => (
                                            <option key={auto.id} value={auto.id}>
                                                {auto.marca} {auto.modelo} ({auto.anio})
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedAuto ? (
                <MantenimientoList 
                    autoId={selectedAuto.id} 
                    autoMarca={selectedAuto.marca} 
                    autoModelo={selectedAuto.modelo} 
                />
            ) : loading ? (
                <div className="bg-base-200 rounded-lg p-10 text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-base-content/70">Cargando vehículos...</p>
                </div>
            ) : autos.length === 0 ? (
                <div className="alert alert-info">
                    <p>No hay vehículos registrados en el sistema.</p>
                </div>
            ) : (
                <div className="bg-base-200 rounded-lg p-10 text-center">
                    <Car className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                    <p className="text-lg font-medium">Selecciona un vehículo para ver su historial</p>
                </div>
            )}
        </div>
    );
}

export default MantenimientoPage;