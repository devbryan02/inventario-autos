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
    } catch (err) {
      setError("Error al cargar los datos de precios. Por favor, inténtalo de nuevo más tarde.");
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
    } catch (err) {
      setError("Error al cargar las estadísticas generales. Por favor, inténtalo de nuevo más tarde.");
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