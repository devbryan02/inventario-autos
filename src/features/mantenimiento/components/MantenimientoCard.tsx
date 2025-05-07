"use client";

import { Mantenimiento } from '@/features/autos/types';
import { Calendar, Route, DollarSign, FileText, Wrench, MoreVertical, Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, formatDate } from '../utils';

interface MantenimientoCardProps {
  mantenimiento: Mantenimiento;
  onEdit?: (mantenimiento: Mantenimiento) => void;
  onDelete?: (id: number) => void;
}

export function MantenimientoCard({ mantenimiento, onEdit, onDelete }: MantenimientoCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  
  const getBadgeColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'preventivo': 
        return 'badge-primary';
      case 'correctivo': 
        return 'badge-warning';
      case 'revision': 
        return 'badge-info';
      case 'cambio de aceite': 
        return 'badge-success';
      default: 
        return 'badge-secondary';
    }
  };

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-300">
      <div className="card-body p-4">
        {/* Cabecera con tipo de mantenimiento y menú de opciones */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              <span className={`badge ${getBadgeColor(mantenimiento.tipo || 'Otro')} badge-sm`}>
                {mantenimiento.tipo || 'Otro'}
              </span>
            </div>
            <h3 className="font-semibold text-base mt-1">{mantenimiento.descripcion}</h3>
          </div>
          
          {/* Menú de acciones si hay handlers */}
          {(onEdit || onDelete) && (
            <div className="relative">
              <button 
                className="btn btn-ghost btn-xs btn-circle"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div 
                  className="absolute right-0 mt-1 p-2 bg-base-100 shadow-lg rounded-box z-10 min-w-32 border border-base-300"
                  onMouseLeave={() => setShowMenu(false)}
                >
                  {onEdit && (
                    <button 
                      className="btn btn-ghost btn-xs w-full justify-start text-sm gap-2 mb-1"
                      onClick={() => {
                        onEdit(mantenimiento);
                        setShowMenu(false);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      className="btn btn-ghost btn-xs w-full justify-start text-error text-sm gap-2"
                      onClick={() => {
                        onDelete(mantenimiento.id!);
                        setShowMenu(false);
                      }}
                    >
                      <Trash className="w-3 h-3" />
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Detalles del mantenimiento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary/70" />
            <span className="text-base-content/70">Fecha:</span>
            <span>{formatDate(mantenimiento.fecha)}</span>
          </div>
          
          {mantenimiento.costo !== null && mantenimiento.costo !== undefined && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary/70" />
              <span className="text-base-content/70">Costo:</span>
              <span className="font-medium">{formatCurrency(mantenimiento.costo)}</span>
            </div>
          )}
          
          {mantenimiento.kilometraje && (
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-primary/70" />
              <span className="text-base-content/70">Kilometraje:</span>
              <span>{mantenimiento.kilometraje.toLocaleString()} km</span>
            </div>
          )}
        </div>
        
        {/* Nota o detalles si existe */}
        {mantenimiento.nota && (
          <div className="mt-3 flex items-start gap-1">
            <FileText className="w-4 h-4 text-primary/70 mt-0.5" />
            <p className="text-sm text-base-content/80">{mantenimiento.nota}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MantenimientoCard;