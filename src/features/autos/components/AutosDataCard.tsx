"use client";
import Image from 'next/image';
import { Car, Calendar, Search, AlertCircle, Plus, Eye, Gauge, ImageOff, Trash2, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useAutos } from '../hooks/useAutos';
import { useDeleteAuto } from '../hooks/useDeleteAuto';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MantenimientoList from '@/features/mantenimiento/components/MantenimientoList';
import { AutoConImagenes } from '../types';

function AutosDataCard() {
    const router = useRouter();
    const { filteredAutos, autos, loading, error, searchTerm, setSearchTerm, refreshAutos } = useAutos();
    const { confirmAndDelete, loading: deleteLoading } = useDeleteAuto(() => refreshAutos());

    // Estado para controlar qué auto tiene el modal de mantenimiento abierto
    const [mantenimientoAutoId, setMantenimientoAutoId] = useState<number | null>(null);
    const [selectedAuto, setSelectedAuto] = useState<AutoConImagenes | null>(null);

    // Función útil para navegación programática (opcional, ya que se usa Link más adelante)
    const navigateToDetails = (autoId: number) => {
        router.push(`/dashboard/autos/${autoId}`);
    };

    // Abrir modal de mantenimiento
    const openMantenimientoModal = (auto: AutoConImagenes) => {
        setMantenimientoAutoId(auto.id);
        setSelectedAuto(auto);
    };

    // Cerrar modal de mantenimiento
    const closeMantenimientoModal = () => {
        setMantenimientoAutoId(null);
        setSelectedAuto(null);
    };

    if (loading) {
        return (
            <div className="card bg-base-200 shadow-xl p-8 bg-opacity-70 backdrop-blur">
                <div className="flex flex-col items-center justify-center p-12">
                    <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                    <p className="text-base-content/70 font-medium">Cargando inventario...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card bg-base-200 shadow-xl p-6 bg-opacity-70 backdrop-blur">
                <div className="alert alert-error bg-opacity-90">
                    <AlertCircle className="h-6 w-6" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="card bg-base-200 shadow-xl bg-opacity-80 backdrop-blur">
                <div className="card-body">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="card-title text-primary font-bold flex items-center gap-2">
                            <Car className="h-6 w-6" />
                            Inventario de Autos
                        </h2>

                        {/* Barra de búsqueda */}
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Buscar vehículos..."
                                className="input input-bordered w-full pl-10 bg-base-100/50 focus:bg-base-100"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-3 h-5 w-5 text-base-content/50" />
                        </div>
                    </div>

                    {filteredAutos.length === 0 ? (
                        <div className="alert bg-base-100/50">
                            <AlertCircle className="h-6 w-6 text-info" />
                            <span>{searchTerm ? 'No se encontraron vehículos que coincidan con tu búsqueda.' : 'No hay autos en el inventario.'}</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredAutos.map((auto) => (
                                <div
                                    key={auto.id}
                                    className="card bg-gradient-to-br from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-all shadow-md hover:shadow-lg overflow-hidden"
                                >
                                    {/* Sección de imagen con enlace clickable */}
                                    <figure
                                        className="h-40 relative bg-base-300/50 cursor-pointer"
                                        onClick={() => navigateToDetails(auto.id)}
                                    >
                                        {auto.imagenes && auto.imagenes.length > 0 ? (
                                            <Image
                                                src={auto.imagenes[0].url_imagen}
                                                alt={`${auto.marca} ${auto.modelo}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-full text-base-content/50">
                                                <ImageOff className="h-8 w-8 mb-2" />
                                                <span className="text-sm">Sin imagen disponible</span>
                                            </div>
                                        )}
                                    </figure>

                                    <div className="card-body p-4">
                                        {/* Título con estilo clickable */}
                                        <h3
                                            className="card-title text-base-content cursor-pointer hover:text-primary transition-colors"
                                            onClick={() => navigateToDetails(auto.id)}
                                        >
                                            <span className="text-primary font-bold">{auto.marca}</span>
                                            <span className="text-base-content/80">{auto.modelo}</span>
                                        </h3>

                                        <div className="flex flex-wrap gap-2 my-2">
                                            <div className="badge badge-ghost gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {auto.anio}
                                            </div>
                                            {auto.kilometraje && (
                                                <div className="badge badge-ghost gap-1">
                                                    <Gauge className="h-3 w-3" />
                                                    {auto.kilometraje.toLocaleString()} km
                                                </div>
                                            )}
                                            {auto.color && (
                                                <div className="badge badge-ghost gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                    {auto.color}
                                                </div>
                                            )}
                                            {auto.estado && (
                                                <div className={`badge ${auto.estado === 'listo' ? 'badge-success' :
                                                    auto.estado === 'reparacion' ? 'badge-warning' :
                                                        auto.estado === 'vendido' ? 'badge-secondary' :
                                                            'badge-ghost'} badge-sm`}>
                                                    {auto.estado}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-xs opacity-70">Precio</span>
                                                <span className="font-bold text-lg">
                                                    S/{auto.precio_compra?.toLocaleString() || 'N/A'}
                                                </span>
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="flex gap-1">
                                                {/* Botón de mantenimiento */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openMantenimientoModal(auto);
                                                    }}
                                                    className="btn btn-sm btn-ghost btn-circle bg-info/10 hover:bg-info/20"
                                                    title="Historial de mantenimiento"
                                                >
                                                    <Wrench className="h-5 w-5 text-info" />
                                                </button>

                                                <Link
                                                    href={`/dashboard/autos/${auto.id}`}
                                                    className="btn btn-sm btn-ghost btn-circle bg-primary/10 hover:bg-primary/20"
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="h-5 w-5 text-primary" />
                                                </Link>

                                                {/* Botón para eliminar */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        confirmAndDelete(auto.id, auto.marca, auto.modelo);
                                                    }}
                                                    className="btn btn-sm btn-ghost btn-circle bg-error/10 hover:bg-error/20"
                                                    title="Eliminar vehículo"
                                                    disabled={deleteLoading}
                                                >
                                                    <Trash2 className="h-5 w-5 text-error" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-6">
                        <Link href='/dashboard/autos/agregar' className="btn btn-sm btn-primary gap-1">
                            <Plus className="h-4 w-4" />
                            Agregar vehículo
                        </Link>
                        <div className="badge badge-primary badge-outline p-3">
                            {filteredAutos.length} de {autos.length} vehículos
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para Mantenimiento */}
            {mantenimientoAutoId && selectedAuto && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-base-100 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-base-300 flex justify-between items-center sticky top-0 bg-base-100 z-10">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Wrench className="h-5 w-5 text-primary" />
                                Mantenimiento - {selectedAuto.marca} {selectedAuto.modelo}
                            </h3>
                            <button
                                onClick={closeMantenimientoModal}
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-0">
                            <MantenimientoList
                                autoId={mantenimientoAutoId}
                                autoMarca={selectedAuto.marca}
                                autoModelo={selectedAuto.modelo}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AutosDataCard;