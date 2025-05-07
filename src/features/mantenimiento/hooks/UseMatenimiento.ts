import { useState, useEffect, useCallback } from 'react';
import {
  createMantenimiento,
  getMantenimientoById,
  getMantenimientosByAutoId,
  getAllMantenimientos,
  updateMantenimiento,
  deleteMantenimiento
} from '../MantenimientoService';
import { Mantenimiento } from '../../autos/types';
import Swal from 'sweetalert2';

interface UseMantenimientoProps {
  autoId?: number;
  mantenimientoId?: number;
  initialLoad?: boolean;
}

export function useMantenimiento({ 
  autoId, 
  mantenimientoId,
  initialLoad = true 
}: UseMantenimientoProps = {}) {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [currentMantenimiento, setCurrentMantenimiento] = useState<Mantenimiento | null>(null);
  const [loading, setLoading] = useState<boolean>(initialLoad);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar mantenimientos según los parámetros proporcionados
  const fetchMantenimientos = useCallback(async () => {
    if (!initialLoad) return;
    
    try {
      setLoading(true);
      setError(null);

      let data: Mantenimiento[] = [];
      
      if (mantenimientoId) {
        // Si se proporciona un ID específico, carga ese mantenimiento
        const item = await getMantenimientoById(mantenimientoId);
        if (item) {
          setCurrentMantenimiento(item);
          data = [item];
        }
      } else if (autoId) {
        // Si se proporciona un autoId, carga todos los mantenimientos de ese auto
        data = await getMantenimientosByAutoId(autoId);
      } else {
        // Si no se proporciona ningún filtro, carga todos los mantenimientos
        data = await getAllMantenimientos();
      }
      
      setMantenimientos(data);
    } catch (err: any) {
      console.error("Error cargando mantenimientos:", err);
      setError(err.message || "Error al cargar los mantenimientos");
    } finally {
      setLoading(false);
    }
  }, [autoId, mantenimientoId, initialLoad]);

  // Cargar datos al montar el componente o cuando cambien las dependencias
  useEffect(() => {
    fetchMantenimientos();
  }, [fetchMantenimientos]);

  // Crear un nuevo registro de mantenimiento
  const createNewMantenimiento = async (data: Omit<Mantenimiento, 'id'>) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const newMantenimiento = await createMantenimiento(data);
      
      if (newMantenimiento) {
        setMantenimientos(prev => [newMantenimiento, ...prev]);
        setSuccess("Mantenimiento registrado correctamente");
        
        // Notificación de éxito
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Mantenimiento registrado',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        
        return newMantenimiento;
      }
      return null;
    } catch (err: any) {
      console.error("Error creando mantenimiento:", err);
      setError(err.message || "Error al registrar el mantenimiento");
      
      // Notificación de error
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'Error',
        text: err.message || "Error al registrar el mantenimiento",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
      
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  // Actualizar un registro de mantenimiento existente
  const updateExistingMantenimiento = async (id: number, data: Partial<Mantenimiento>) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const updatedMantenimiento = await updateMantenimiento(id, data);
      
      if (updatedMantenimiento) {
        // Actualizar el estado local con el mantenimiento actualizado
        setMantenimientos(prev => 
          prev.map(item => item.id === id ? updatedMantenimiento : item)
        );
        
        if (currentMantenimiento?.id === id) {
          setCurrentMantenimiento(updatedMantenimiento);
        }
        
        setSuccess("Mantenimiento actualizado correctamente");
        
        // Notificación de éxito
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Mantenimiento actualizado',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        
        return updatedMantenimiento;
      }
      return null;
    } catch (err: any) {
      console.error("Error actualizando mantenimiento:", err);
      setError(err.message || "Error al actualizar el mantenimiento");
      
      // Notificación de error
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'Error',
        text: err.message || "Error al actualizar el mantenimiento",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
      
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar un registro de mantenimiento
  const removeMantenimiento = async (id: number) => {
    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: '¿Eliminar registro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      width: '20rem',
      padding: '1rem',
    });
    
    if (!result.isConfirmed) return false;
    
    try {
      setSubmitting(true);
      setError(null);
      
      await deleteMantenimiento(id);
      
      // Actualizar el estado local eliminando el mantenimiento
      setMantenimientos(prev => prev.filter(item => item.id !== id));
      
      if (currentMantenimiento?.id === id) {
        setCurrentMantenimiento(null);
      }
      
      // Notificación de éxito
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Registro eliminado',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      
      return true;
    } catch (err: any) {
      console.error("Error eliminando mantenimiento:", err);
      setError(err.message || "Error al eliminar el registro de mantenimiento");
      
      // Notificación de error
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'Error',
        text: err.message || "Error al eliminar el registro",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
      
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Refrescar los datos
  const refreshData = () => {
    fetchMantenimientos();
  };

  // Limpiar estado
  const resetState = () => {
    setSuccess(null);
    setError(null);
  };

  return {
    mantenimientos,
    currentMantenimiento,
    loading,
    error,
    submitting,
    success,
    createMantenimiento: createNewMantenimiento,
    updateMantenimiento: updateExistingMantenimiento,
    deleteMantenimiento: removeMantenimiento,
    refreshData,
    resetState,
  };
}