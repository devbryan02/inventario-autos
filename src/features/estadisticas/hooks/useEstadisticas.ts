import { useState, useEffect, useCallback } from 'react';
import { fetchPreciosCompraVenta, fetchEstadisticasGenerales } from '../services/estadisticasService';
import { PrecioCompraVenta, EstadisticasGenerales } from '../types/estadisticas.type';

export function useEstadisticas() {
  const [preciosData, setPreciosData] = useState<PrecioCompraVenta[]>([]);
  const [estadisticasGenerales, setEstadisticasGenerales] = useState<EstadisticasGenerales | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPreciosData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data: PrecioCompraVenta[] = await fetchPreciosCompraVenta();
      setPreciosData(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Error al cargar los datos de precios. Por favor, inténtalo de nuevo más tarde.";
      setError(errorMessage);
      console.error('Error cargando datos de precios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEstadisticasGenerales = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data: EstadisticasGenerales = await fetchEstadisticasGenerales();
      setEstadisticasGenerales(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Error al cargar las estadísticas generales. Por favor, inténtalo de nuevo más tarde.";
      setError(errorMessage);
      console.error('Error cargando estadísticas generales:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para recargar todos los datos
  const refreshData = useCallback((): void => {
    loadPreciosData();
    loadEstadisticasGenerales();
  }, [loadPreciosData, loadEstadisticasGenerales]);

  // Cargar datos iniciales
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    preciosData,
    estadisticasGenerales,
    loading,
    error,
    refreshData
  };
}