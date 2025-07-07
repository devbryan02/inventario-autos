"use client";

import { 
  CircularProgressbar, 
  CircularProgressbarWithChildren,
  buildStyles 
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Car, ShoppingCart, Tag, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { useEstadisticas } from '../hooks/useEstadisticas';
import { formatCurrency } from '@/lib/utils';
export default function InventariosState() {
  const { estadisticasGenerales: stats, loading, error, refreshData } = useEstadisticas();

  const colors = {
    listo: '#10b981', // verde
    reparacion: '#f59e0b', // ámbar
    vendido: '#3b82f6', // azul
    entregado: '#8b5cf6' // púrpura
  };
  
  const renderProgressBar = (estado: string) => {
    if (!stats) return null;
    const count = stats.contadorEstados[estado] || 0;
    const percentage = stats.totalAutos > 0 ? (count / stats.totalAutos) * 100 : 0;
    
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 mb-2">
          <CircularProgressbar
            value={percentage}
            text={`${count}`}
            styles={buildStyles({
              textSize: '30px',
              pathColor: colors[estado as keyof typeof colors] || '#6b7280',
              textColor: colors[estado as keyof typeof colors] || '#6b7280',
              trailColor: '#e5e7eb',
            })}
          />
        </div>
        <span className="text-xs capitalize font-medium">{estado}</span>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="card bg-base-200/70 backdrop-blur-sm shadow-xl h-[295px]">
        <div className="card-body flex items-center justify-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card bg-base-200/70 backdrop-blur-sm shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <h2 className="card-title text-primary">Estado de Inventario</h2>
          </div>
          <div className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-12 w-12 text-error mb-3" />
            <h3 className="text-lg font-bold mb-1">Error al cargar datos</h3>
            <p className="text-base-content/70 text-center mb-4">{error}</p>
            <button onClick={refreshData} className="btn btn-sm btn-primary">
              <RefreshCw className="h-4 w-4 mr-2" /> Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="card bg-base-200/70 backdrop-blur-sm shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-2">
            <h2 className="card-title text-primary">Estado de Inventario</h2>
            <button onClick={refreshData} className="btn btn-sm btn-ghost btn-circle">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center justify-center h-48">
            <p className="text-base-content/70">No hay datos disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  // Calcular el porcentaje de ganancia promedio
  const gananciaPromedio = stats.promedioCompra > 0 
    ? ((stats.promedioVenta - stats.promedioCompra) / stats.promedioCompra) * 100
    : 0;
  
  return (
    <div className="card bg-base-200/70 backdrop-blur-sm shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-2">
          <h2 className="card-title text-primary">Estado de Inventario</h2>
          <button 
            onClick={refreshData} 
            className="btn btn-sm btn-ghost btn-circle"
            title="Actualizar estadísticas"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        
        {/* Estadísticas de vehículos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col p-3 bg-base-100/60 rounded-lg border border-base-300 shadow-sm">
            <div className="flex items-center mb-2 text-primary">
              <Car className="h-5 w-5 mr-2" />
              <span className="text-xs font-semibold uppercase">Total</span>
            </div>
            <span className="text-2xl font-bold">{stats.totalAutos}</span>
            <span className="text-xs text-base-content/70 mt-1">Vehículos</span>
          </div>
          
          <div className="flex flex-col p-3 bg-base-100/60 rounded-lg border border-base-300 shadow-sm">
            <div className="flex items-center mb-2 text-primary">
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span className="text-xs font-semibold uppercase">Inversión</span>
            </div>
            <span className="text-2xl font-bold">{formatCurrency(stats.totalCompra)}</span>
            <span className="text-xs text-base-content/70 mt-1">Compra total</span>
          </div>
          
          <div className="flex flex-col p-3 bg-base-100/60 rounded-lg border border-base-300 shadow-sm">
            <div className="flex items-center mb-2 text-primary">
              <Tag className="h-5 w-5 mr-2" />
              <span className="text-xs font-semibold uppercase">Proyección</span>
            </div>
            <span className="text-2xl font-bold">{formatCurrency(stats.totalVenta)}</span>
            <span className="text-xs text-base-content/70 mt-1">Venta proyectada</span>
          </div>
          
          <div className="flex flex-col p-3 bg-base-100/60 rounded-lg border border-base-300 shadow-sm">
            <div className="flex items-center mb-2 text-primary">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="text-xs font-semibold uppercase">Ganancia</span>
            </div>
            <span className={`text-2xl font-bold ${stats.gananciaProyectada > 0 ? 'text-success' : 'text-error'}`}>
              {formatCurrency(stats.gananciaProyectada)}
            </span>
            <span className="text-xs text-base-content/70 mt-1">Proyectada</span>
          </div>
        </div>
        
        {/* Estado de los vehículos y margen promedio */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          <div className="col-span-1 md:col-span-2 flex flex-col p-3 bg-base-100/60 rounded-lg border border-base-300 shadow-sm">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              <span className="text-xs font-semibold uppercase text-base-content/80">Margen Promedio</span>
            </div>
            
            <div className="flex items-center justify-center py-1">
              <div className="w-20 h-20 mx-auto">
                <CircularProgressbarWithChildren
                  value={gananciaPromedio}
                  styles={buildStyles({
                    pathColor: gananciaPromedio > 20 ? colors.listo : gananciaPromedio > 10 ? colors.reparacion : '#ef4444',
                    trailColor: '#e5e7eb',
                  })}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-bold">{gananciaPromedio.toFixed(1)}%</span>
                  </div>
                </CircularProgressbarWithChildren>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center text-xs mt-2">
              <div>
                <div className="font-medium">Promedio compra</div>
                <div>{formatCurrency(stats.promedioCompra)}</div>
              </div>
              <div>
                <div className="font-medium">Promedio venta</div>
                <div>{formatCurrency(stats.promedioVenta)}</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-3 flex justify-around p-3 bg-base-100/60 rounded-lg border border-base-300 shadow-sm">
            <div className="text-center">
              {renderProgressBar('listo')}
            </div>
            <div className="text-center">
              {renderProgressBar('reparacion')}
            </div>
            <div className="text-center">
              {renderProgressBar('vendido')}
            </div>
            <div className="text-center">
              {renderProgressBar('entregado')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}