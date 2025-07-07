"use client";

import { useState, FormEvent, useEffect } from 'react';
import { Mantenimiento } from '@/features/autos/types';
import { useMantenimiento } from '../hooks/UseMatenimiento';
import { 
  Wrench, Calendar, DollarSign, FileText, Route, 
  Save, Loader, AlertCircle, CheckCircle2
} from 'lucide-react';

interface MantenimientoFormProps {
  autoId: number;
  mantenimientoId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const TIPOS_MANTENIMIENTO = [
  'Preventivo',
  'Correctivo',
  'Revisión',
  'Cambio de Aceite',
  'Cambio de Neumáticos',
  'Frenos',
  'Batería',
  'Eléctrico',
  'Otro'
];

export function MantenimientoForm({
  autoId,
  mantenimientoId,
  onSuccess,
  onCancel,
  isModal = false
}: MantenimientoFormProps) {
  const initialState: Omit<Mantenimiento, 'id'> = {
    auto_id: autoId,
    tipo: 'Preventivo',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    costo: null,
    kilometraje: null,
    nota: '',
  };
  
  const [formData, setFormData] = useState<typeof initialState>(initialState);
  const [formTouched, setFormTouched] = useState(false);
  
  const { 
    currentMantenimiento, 
    submitting, 
    success, 
    error,
    createMantenimiento, 
    updateMantenimiento
  } = useMantenimiento({
    mantenimientoId: mantenimientoId,
    initialLoad: !!mantenimientoId
  });

  // Cargar datos existentes si es edición
  useEffect(() => {
    if (currentMantenimiento) {
      const formattedDate = currentMantenimiento.fecha 
        ? new Date(currentMantenimiento.fecha).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];
      
      setFormData({
        auto_id: currentMantenimiento.auto_id,
        tipo: currentMantenimiento.tipo || 'Otro',
        descripcion: currentMantenimiento.descripcion || '',
        fecha: formattedDate,
        costo: currentMantenimiento.costo,
        kilometraje: currentMantenimiento.kilometraje,
        nota: currentMantenimiento.nota || ''
      });
    }
  }, [currentMantenimiento]);

  // Callback de éxito
  useEffect(() => {
    if (success && onSuccess) {
      onSuccess();
    }
  }, [success, onSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (!formTouched) setFormTouched(true);
    
    if (type === 'number') {
      const numValue = value === '' ? null : parseFloat(value);
      setFormData({ ...formData, [name]: numValue });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.descripcion.trim()) {
      return;
    }
    
    try {
      if (mantenimientoId) {
        await updateMantenimiento(mantenimientoId, formData);
      } else {
        await createMantenimiento(formData);
        // Resetear formulario si es creación exitosa
        if (!error) {
          setFormData(initialState);
          setFormTouched(false);
        }
      }
    } catch (err) {
      console.error("Error en el formulario:", err);
    }
  };

  // Determinar el modo (creación o edición)
  const isEditMode = !!mantenimientoId;
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className={`${isModal ? '' : 'card bg-base-200/50 backdrop-blur-sm shadow-lg p-6 max-w-xl mx-auto border border-base-300'} 
                  transition-all duration-300 ease-in-out ${success ? 'scale-100' : ''}`}
    >
      {!isModal && (
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-primary">
              {isEditMode ? 'Actualizar Mantenimiento' : 'Registrar Mantenimiento'}
            </h2>
          </div>
          <p className="text-sm text-base-content/70 ml-1">
            {isEditMode 
              ? 'Actualiza los detalles del mantenimiento según sea necesario.' 
              : 'Completa el formulario para registrar un nuevo mantenimiento.'}
          </p>
        </header>
      )}
      
      <div className="space-y-6">
        {/* Sección: Información Principal */}
        <div className="p-4 bg-base-100/40 rounded-lg border border-base-300">
          <h3 className="text-sm font-semibold mb-3 text-base-content/70 uppercase">Información Principal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de mantenimiento */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1 text-base-content/80">
                  <Wrench className="w-4 h-4 text-primary/70" /> Tipo
                </span>
              </label>
              <select
                name="tipo"
                value={formData.tipo || ''}
                onChange={handleChange}
                className="select select-bordered w-full bg-base-100/70 focus:bg-base-100 transition-colors"
                required
              >
                {TIPOS_MANTENIMIENTO.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            
            {/* Fecha */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1 text-base-content/80">
                  <Calendar className="w-4 h-4 text-primary/70" /> Fecha
                </span>
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="input input-bordered w-full bg-base-100/70 focus:bg-base-100 transition-colors"
                required
              />
            </div>
            
            {/* Descripción */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1 text-base-content/80">
                  <FileText className="w-4 h-4 text-primary/70" /> Descripción
                </span>
              </label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="input input-bordered w-full bg-base-100/70 focus:bg-base-100 transition-colors"
                placeholder="Ej. Cambio de aceite y filtros"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Sección: Detalles Adicionales */}
        <div className="p-4 bg-base-100/40 rounded-lg border border-base-300">
          <h3 className="text-sm font-semibold mb-3 text-base-content/70 uppercase">Detalles Adicionales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Costo */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1 text-base-content/80">
                  <DollarSign className="w-4 h-4 text-primary/70" /> Costo
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-base-content/50">S/</span>
                <input
                  type="number"
                  name="costo"
                  value={formData.costo ?? ''}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-8 bg-base-100/70 focus:bg-base-100 transition-colors"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            {/* Kilometraje */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-1 text-base-content/80">
                  <Route className="w-4 h-4 text-primary/70" /> Kilometraje
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="kilometraje"
                  value={formData.kilometraje ?? ''}
                  onChange={handleChange}
                  className="input input-bordered w-full pr-12 bg-base-100/70 focus:bg-base-100 transition-colors"
                  placeholder="0"
                  min="0"
                />
                <span className="absolute right-3 top-3 text-base-content/50">km</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sección: Notas */}
        <div className="p-4 bg-base-100/40 rounded-lg border border-base-300">
          <label className="label">
            <span className="label-text font-medium flex items-center gap-1 text-base-content/80">
              <FileText className="w-4 h-4 text-primary/70" /> Notas adicionales
            </span>
          </label>
          <textarea
            name="nota"
            value={formData.nota || ''}
            onChange={handleChange}
            className="textarea textarea-bordered w-full h-24 bg-base-100/70 focus:bg-base-100 transition-colors"
            placeholder="Información adicional sobre el mantenimiento realizado..."
          ></textarea>
        </div>
      
        {/* Mensajes de estado */}
        {error && (
          <div className="alert alert-error bg-error/10 text-error border border-error/30">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
        
        {success && !isModal && (
          <div className="alert alert-success bg-success/10 text-success border border-success/30">
            <CheckCircle2 className="h-5 w-5" />
            <p>Mantenimiento {isEditMode ? 'actualizado' : 'registrado'} correctamente</p>
          </div>
        )}
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end gap-2 mt-6">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-outline btn-neutral hover:bg-base-300 transition-colors"
            disabled={submitting}
          >
            Cancelar
          </button>
        )}
        
        <button 
          type="submit" 
          className={`btn ${isEditMode ? 'btn-info' : 'btn-primary'} shadow-md hover:shadow-lg transition-all duration-300`}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin mr-2" />
              <span className="animate-pulse">
                {isEditMode ? 'Actualizando...' : 'Guardando...'}
              </span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? 'Actualizar' : 'Guardar'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default MantenimientoForm;