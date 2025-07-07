"use client";

import { useEstadisticas } from '../hooks/useEstadisticas';
import PrecioCompraVentaChart from './PrecioCompraVentaChart';
import { RefreshCw } from 'lucide-react';

export default function EstadisticasCard() {
  const { preciosData, loading, error, refreshData } = useEstadisticas();
  
  return (
    <div className="card bg-base-200/70 backdrop-blur-sm shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-2">
          <h2 className="card-title text-primary">Estadísticas de Inventario</h2>
          <button 
            className="btn btn-sm btn-ghost btn-circle" 
            onClick={refreshData}
            disabled={loading}
            title="Actualizar estadísticas"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <PrecioCompraVentaChart 
          data={preciosData} 
          loading={loading} 
          error={error}
          onRefresh={refreshData}
        />
      </div>
    </div>
  );
}