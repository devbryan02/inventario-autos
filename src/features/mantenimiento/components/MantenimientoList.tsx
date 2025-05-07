"use client";

import { useState } from 'react';
import { useMantenimiento } from '../hooks/UseMatenimiento';
import MantenimientoCard from './MantenimientoCard';
import MantenimientoForm from './MantenimientoForm';
import { Mantenimiento } from '@/features/autos/types';
import { HistoryIcon, Plus, Search, AlertCircle, FileX } from 'lucide-react';

interface MantenimientoListProps {
  autoId: number;
  autoMarca?: string;
  autoModelo?: string;
}

export function MantenimientoList({ autoId, autoMarca, autoModelo }: MantenimientoListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    mantenimientos, 
    loading, 
    error, 
    refreshData,
    deleteMantenimiento
  } = useMantenimiento({ autoId });

  // Filtra mantenimientos según el término de búsqueda
  const filteredMantenimientos = mantenimientos.filter(item => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.descripcion?.toLowerCase().includes(searchLower)) ||
      (item.tipo?.toLowerCase().includes(searchLower)) ||
      (item.nota?.toLowerCase().includes(searchLower))
    );
  });

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMantenimiento(null);
  };

  const handleFormSuccess = () => {
    refreshData();
    handleFormClose();
  };

  const handleEdit = (mantenimiento: Mantenimiento) => {
    setEditingMantenimiento(mantenimiento);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    deleteMantenimiento(id).then(success => {
      if (success) refreshData();
    });
  };

  // Función para agrupar mantenimientos por año
  const groupByYear = (mantenimientos: Mantenimiento[]) => {
    const groups: Record<string, Mantenimiento[]> = {};
    
    mantenimientos.forEach(item => {
      if (!item.fecha) return;
      
      const year = new Date(item.fecha).getFullYear().toString();
      if (!groups[year]) {
        groups[year] = [];
      }
      
      groups[year].push(item);
    });
    
    // Ordenar grupos por año descendente
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  };

  const mantenimientosPorAno = groupByYear(filteredMantenimientos);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="loading loading-spinner loading-md text-primary"></div>
        <span className="ml-2 text-base-content/70">Cargando historial de mantenimiento...</span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
            <HistoryIcon className="h-5 w-5" />
            Historial de Mantenimiento
          </h2>
          {autoMarca && autoModelo && (
            <p className="text-sm text-base-content/70 mt-1">
              {autoMarca} {autoModelo}
            </p>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto">
          {/* Barra de búsqueda */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar mantenimientos..."
              className="input input-bordered w-full md:w-64 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-base-content/50" />
          </div>
          
          {/* Botón para agregar nuevo mantenimiento */}
          <button 
            className="btn btn-primary btn-sm md:w-auto gap-1"
            onClick={() => {
              setEditingMantenimiento(null);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nuevo mantenimiento
          </button>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="alert alert-error mb-4">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Formulario como modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-base-300">
              <h3 className="font-bold text-lg">
                {editingMantenimiento ? 'Editar Mantenimiento' : 'Registrar Mantenimiento'}
              </h3>
            </div>
            <div className="p-6">
              <MantenimientoForm
                autoId={autoId}
                mantenimientoId={editingMantenimiento?.id}
                onSuccess={handleFormSuccess}
                onCancel={handleFormClose}
                isModal={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lista de mantenimientos agrupados por año */}
      {mantenimientosPorAno.length > 0 ? (
        <div className="space-y-8">
          {mantenimientosPorAno.map(([year, items]) => (
            <div key={year} className="space-y-3">
              <h3 className="font-semibold text-lg border-b border-base-300 pb-2 flex items-center gap-2">
                <span className="text-primary">{year}</span>
                <span className="badge badge-sm badge-primary badge-outline">{items.length}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(mantenimiento => (
                  <MantenimientoCard
                    key={mantenimiento.id}
                    mantenimiento={mantenimiento}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-base-200/50 rounded-lg border border-dashed border-base-300">
          <FileX className="h-12 w-12 text-base-content/30" />
          <p className="mt-4 text-base text-base-content/70">
            {searchTerm ? 'No se encontraron mantenimientos que coincidan con tu búsqueda.' : 'No hay registros de mantenimiento.'}
          </p>
          <button 
            className="btn btn-primary btn-sm mt-3"
            onClick={() => {
              setEditingMantenimiento(null);
              setShowForm(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Registrar primer mantenimiento
          </button>
        </div>
      )}
      
      {/* Contador de mantenimientos */}
      {filteredMantenimientos.length > 0 && (
        <div className="flex justify-end mt-6">
          <div className="badge badge-neutral badge-outline p-3 text-neutral-content">
            {filteredMantenimientos.length} registros de mantenimiento
          </div>
        </div>
      )}
    </div>
  );
}

export default MantenimientoList;