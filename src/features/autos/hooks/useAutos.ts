import { useState, useEffect, useCallback } from 'react';
import { fetchAutos } from '../services';
import { AutoConImagenes } from '../types';

export function useAutos() {
  const [autos, setAutos] = useState<AutoConImagenes[]>([]);
  const [filteredAutos, setFilteredAutos] = useState<AutoConImagenes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Función para cargar los autos
  const loadAutos = useCallback(async () => {
    try {
      setLoading(true);
      const autosData = await fetchAutos();
      setAutos(autosData);
      setFilteredAutos(autosData);
      setError(null);
    } catch (err) {
      console.error("Error cargando autos:", err);
      setError("Error al cargar el inventario de vehículos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para refrescar los datos
  const refreshAutos = useCallback(() => {
    loadAutos();
  }, [loadAutos]);

  // Cargar datos iniciales
  useEffect(() => {
    loadAutos();
  }, [loadAutos]);

  // Filtrar autos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAutos(autos);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = autos.filter(auto => {
        return (
          auto.marca.toLowerCase().includes(lowerCaseSearchTerm) ||
          auto.modelo.toLowerCase().includes(lowerCaseSearchTerm) ||
          auto.color?.toLowerCase().includes(lowerCaseSearchTerm) ||
          auto.anio.toString().includes(lowerCaseSearchTerm)
        );
      });
      setFilteredAutos(filtered);
    }
  }, [searchTerm, autos]);

  return { 
    autos, 
    filteredAutos, 
    loading, 
    error, 
    searchTerm, 
    setSearchTerm, 
    setAutos,
    refreshAutos 
  };
}