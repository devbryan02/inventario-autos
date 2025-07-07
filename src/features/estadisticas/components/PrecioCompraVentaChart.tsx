"use client";

import { useRef, useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { PrecioCompraVenta } from '../types/estadisticas.type';
import { DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PrecioCompraVentaChartProps {
  data: PrecioCompraVenta[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-base-100 p-3 shadow-lg rounded-lg border border-base-300 text-sm">
        <p className="font-medium text-base text-primary mb-2">{item.nombre}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <span className="text-base-content/70">Compra:</span>
          <span className="font-medium">{formatCurrency(item.precio_compra)}</span>
          
          <span className="text-base-content/70">Venta:</span>
          <span className="font-medium">{formatCurrency(item.precio_venta)}</span>
          
          <span className="text-base-content/70">Ganancia:</span>
          <span className={`font-medium ${item.diferencia > 0 ? 'text-success' : 'text-error'}`}>
            {formatCurrency(item.diferencia)}
          </span>
          
          <span className="text-base-content/70">Margen:</span>
          <span className={`font-medium ${item.porcentajeGanancia > 0 ? 'text-success' : 'text-error'}`}>
            {item.porcentajeGanancia.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function PrecioCompraVentaChart({ 
  data, 
  loading = false,
  error = null, 
  onRefresh 
}: PrecioCompraVentaChartProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  
  // Verificar si necesitamos mostrar botones de scroll
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  }, [data]);
  
  // Funciones de scroll
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current: container } = scrollContainerRef;
      const scrollAmount = container.clientWidth * 0.75;
      
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Determinar el ancho mínimo del gráfico basado en la cantidad de datos
  const chartWidth = Math.max(data.length * 100, 500);

  if (loading) {
    return (
      <div className="w-full bg-base-200/50 rounded-lg p-8 flex items-center justify-center h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <div className="loading loading-bars loading-lg text-primary"></div>
          <p className="text-base-content/70">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-base-200/50 rounded-lg p-8 flex items-center justify-center h-[350px]">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-error mb-3" />
          <h3 className="font-bold text-lg mb-2">Error al cargar datos</h3>
          <p className="text-base-content/70 mb-4">{error}</p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="btn btn-sm btn-primary"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </button>
          )}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full bg-base-200/50 rounded-lg p-8 flex items-center justify-center h-[350px]">
        <div className="text-center max-w-md">
          <DollarSign className="mx-auto h-12 w-12 text-base-content/30 mb-3" />
          <h3 className="font-bold text-lg mb-2">No hay datos disponibles</h3>
          <p className="text-base-content/70">No se encontraron autos con información de precios para mostrar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] bg-base-100/50 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-base-300 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-base flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Comparativa Precio Compra vs Venta
          </h3>
          <p className="text-xs text-base-content/60 mt-0.5">
            Comparación de precios por vehículo ({data.length} autos)
          </p>
        </div>
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="btn btn-sm btn-ghost btn-circle"
            title="Refrescar datos"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Contenedor con scroll */}
      <div className="relative">
        {/* Botones de scroll */}
        {showScrollButtons && (
          <>
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 btn btn-circle btn-sm bg-base-100/80 backdrop-blur-sm shadow-md"
              onClick={() => scroll('left')}
            >
              &lt;
            </button>
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 btn btn-circle btn-sm bg-base-100/80 backdrop-blur-sm shadow-md" 
              onClick={() => scroll('right')}
            >
              &gt;
            </button>
          </>
        )}
        
        {/* Contenedor con scroll horizontal */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div style={{ width: `${chartWidth}px`, height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="nombre"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `S/ ${value.toLocaleString()}`}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar 
                  name="Precio Compra" 
                  dataKey="precio_compra" 
                  fill="#9333ea" // púrpura
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  name="Precio Venta" 
                  dataKey="precio_venta" 
                  fill="#10b981" // verde
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}