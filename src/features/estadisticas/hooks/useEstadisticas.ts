import { useState, useEffect } from 'react';
import { fetchPreciosCompraVenta, fetchEstadisticasGenerales } from '../services/estadisticasService';
import { PrecioCompraVenta, EstadisticasGenerales } from '../types/estadisticas.type';

export function useEstadisticas() {
  const [preciosData, setPreciosData] = useState<PrecioCompraVenta[]>([]);
  const [estadisticasGenerales, setEstadisticasGenerales] = useState<EstadisticasGenerales | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPreciosData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPreciosCompraVenta();
      setPreciosData(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar datos de precios');
      console.error('Error cargando datos de precios:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEstadisticasGenerales = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEstadisticasGenerales();
      setEstadisticasGenerales(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar estadísticas generales');
      console.error('Error cargando estadísticas generales:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar todos los datos
  const refreshData = () => {
    loadPreciosData();
    loadEstadisticasGenerales();
  };

  // Cargar datos iniciales
  useEffect(() => {
    refreshData();
  }, []);

  return {
    preciosData,
    estadisticasGenerales,
    loading,
    error,
    refreshData
  };
}