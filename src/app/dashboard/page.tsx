"use client";

import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Car,
    Users,
    BarChart3,
    ArrowUp,
    ArrowDown,
    Settings,
} from 'lucide-react';
import EstadisticasCard from '@/features/estadisticas/components/EstadisticasCard';
import InventariosState from '@/features/estadisticas/components/InventariosState';
import { useAutos } from '@/features/autos/hooks/useAutos';
import Link from 'next/link';

function DashboardPage() {
    const { autos, loading: autosLoading } = useAutos();
    const [autosRecientes, setAutosRecientes] = useState<any[]>([]);

    // Calcular autos recientes
    useEffect(() => {
        if (autos && autos.length > 0) {
            // Ordenar por fecha de ingreso (más recientes primero)
            const recientes = [...autos]
                .sort((a, b) => {
                    return new Date(b.fecha_ingreso).getTime() - new Date(a.fecha_ingreso).getTime();
                })
                .slice(0, 5); // Tomar los 5 más recientes

            setAutosRecientes(recientes);
        }
    }, [autos]);

    // Función para formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Título y descripción */}
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                </div>
                <p className="text-base-content/70 mt-2 ml-1">
                    Vista general del inventario de autos y estadísticas clave del negocio
                </p>
            </div>

            {/* Primera fila - Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-base-content/60 uppercase font-medium">Inventario Total</p>
                                <h3 className="text-2xl font-bold mt-1">{autosLoading ? '...' : autos.length}</h3>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Car className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <div className="flex items-center mt-3">
                            <div className={`text-xs ${autos.length > 0 ? 'text-success' : 'text-warning'} flex items-center`}>
                                {autos.length > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                                {autosLoading ? '...' : `${autos.length} vehículos disponibles`}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-base-content/60 uppercase font-medium">Mantenimientos</p>
                                <h3 className="text-2xl font-bold mt-1">--</h3>
                            </div>
                            <div className="bg-accent/10 p-2 rounded-lg">
                                <Settings className="w-5 h-5 text-accent" />
                            </div>
                        </div>
                        <div className="flex items-center mt-3">
                            <div className="text-xs text-base-content/60 flex items-center">
                                <Link href="/dashboard/mantenimientos" className="hover:underline text-accent">
                                    Ver historial de mantenimientos
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Segunda fila - Estado de Inventario */}
            <div className="mb-6">
                <InventariosState />
            </div>

            {/* Tercera fila - Gráfico de precios y tabla recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Gráfico de Comparación de Precios - Ocupa 2/3 del ancho */}
                <div className="lg:col-span-2">
                    <EstadisticasCard />
                </div>

                {/* Autos Recientes - Ocupa 1/3 del ancho */}
                <div className="card bg-base-200/70 backdrop-blur-sm shadow-xl">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="card-title text-primary">Autos Recientes</h2>
                            <Link href="/dashboard/autos" className="btn btn-sm btn-ghost">
                                Ver todos
                            </Link>
                        </div>

                        {autosLoading ? (
                            <div className="flex justify-center items-center p-12">
                                <div className="loading loading-spinner loading-md"></div>
                            </div>
                        ) : autosRecientes.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-base-content/70">No hay autos registrados</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Auto</th>
                                            <th>Estado</th>
                                            <th>Ingreso</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {autosRecientes.map(auto => (
                                            <tr key={auto.id} className="hover:bg-base-300/30">
                                                <td>
                                                    <Link href={`/dashboard/autos/${auto.id}`} className="hover:text-primary font-medium">
                                                        {auto.marca} {auto.modelo}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span className={`badge badge-sm ${auto.estado === 'listo' ? 'badge-success' :
                                                        auto.estado === 'reparacion' ? 'badge-warning' :
                                                            auto.estado === 'vendido' ? 'badge-secondary' :
                                                                'badge-ghost'
                                                        }`}>
                                                        {auto.estado}
                                                    </span>
                                                </td>
                                                <td className="text-xs">{formatDate(auto.fecha_ingreso)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enlaces Rápidos */}
            <div className="card bg-base-200/50 shadow-sm border border-base-300">
                <div className="card-body">
                    <h2 className="card-title text-primary mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/dashboard/autos/agregar" className="btn btn-outline">
                            <Car className="mr-2 h-4 w-4" /> Agregar Auto
                        </Link>
                        <Link href="/dashboard/autos" className="btn btn-outline">
                            <BarChart3 className="mr-2 h-4 w-4" /> Ver Inventario
                        </Link>
                        <Link href="/dashboard/mantenimientos" className="btn btn-outline">
                            <Settings className="mr-2 h-4 w-4" /> Mantenimientos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;