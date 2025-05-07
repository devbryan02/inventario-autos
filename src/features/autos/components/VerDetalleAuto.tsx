"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Car, DollarSign, Tag, ImagePlus, FileText, CalendarDays, ClipboardList, ArrowLeft, Image as ImageIcon, Edit } from "lucide-react";
import { fetchAutoById } from "@/features/autos/services";
import { AutoConImagenes } from "@/features/autos/types";
import AgregarImagenModal from "@/features/autos/components/AgregarImagenModal";
import EditarAutoForm from "@/features/autos/components/EditarAutoForm";
import Link from "next/link";

function VerDetallesAuto() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auto, setAuto] = useState<AutoConImagenes | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadAutoDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchAutoById(Number(id));
        setAuto(data as AutoConImagenes);
      } catch (err: any) {
        console.error("Error cargando detalles del auto:", err);
        setError(err.message || "Error al cargar los detalles del vehículo");
      } finally {
        setLoading(false);
      }
    };

    loadAutoDetails();
  }, [id]);

  // Handlers para los modales
  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);
  
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);
  
  const handleImageSuccess = async () => {
    closeImageModal();
    refreshAutoData();
  };
  
  const handleEditSuccess = async () => {
    closeEditModal();
    refreshAutoData();
  };
  
  const refreshAutoData = async () => {
    if (id) {
      try {
        const refreshedAuto = await fetchAutoById(Number(id));
        setAuto(refreshedAuto as AutoConImagenes);
      } catch (error) {
        console.error("Error al refrescar los datos:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="flex flex-col items-center justify-center h-64">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-base-content/70">Cargando detalles del vehículo...</p>
        </div>
      </div>
    );
  }

  if (error || !auto) {
    return (
      <div className="min-h-screen p-6">
        <div className="alert alert-error">
          <p>{error || "No se encontró el vehículo"}</p>
          <Link href="/dashboard/autos" className="btn btn-outline btn-sm mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Volver al inventario
          </Link>
        </div>
      </div>
    );
  }

  // Datos organizados para mostrar
  const detallesPrincipales = [
    { label: 'Marca', value: auto.marca },
    { label: 'Modelo', value: auto.modelo },
    { label: 'Año', value: auto.anio },
    { label: 'Color', value: auto.color || 'N/A', showColorDot: !!auto.color }
  ];

  const infoTecnica = [
    { label: 'Kilometraje', value: auto.kilometraje ? `${auto.kilometraje.toLocaleString()} km` : 'N/A' },
    { label: 'Número de serie', value: auto.numero_serie || 'N/A' }
  ];

  const infoFinanciera = [
    { label: 'Precio de compra', value: auto.precio_compra ? `S/${auto.precio_compra.toLocaleString()}` : 'N/A' },
    { label: 'Precio de venta', value: auto.precio_venta ? `S/${auto.precio_venta.toLocaleString()}` : 'N/A' }
  ];

  const tieneMargen = auto.precio_compra && auto.precio_venta;
  const margen = tieneMargen ? auto.precio_venta! - auto.precio_compra! : 0;
  const margenPositivo = margen > 0;
  
  // Verificar imágenes
  const tieneImagenes = auto.imagenes && Array.isArray(auto.imagenes) && auto.imagenes.length > 0;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300 rounded-lg overflow-hidden">
        {/* Cabecera */}
        <div className="p-4 md:p-6 bg-base-100/30">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/autos" className="btn btn-circle btn-ghost hover:bg-base-300">
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-2">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Car className="text-primary h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold text-primary">{auto.marca}</h1>
                  <span className="text-base-content/70 text-sm">{auto.modelo} · {auto.anio}</span>
                </div>
              </div>
            </div>
            
            <div>
              <span className={`badge ${
                auto.estado === 'listo' ? 'badge-success' :
                auto.estado === 'reparacion' ? 'badge-warning' :
                auto.estado === 'vendido' ? 'badge-secondary' :
                'badge-ghost'}`}>
                {auto.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Galería de imágenes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium text-primary flex items-center gap-2">
                <ImageIcon size={20} />
                Galería de imágenes
              </h2>
              <button onClick={openImageModal} className="btn btn-sm btn-ghost gap-1 hover:bg-primary/10">
                <ImagePlus size={16} />
                Agregar imagen
              </button>
            </div>
            
            {tieneImagenes ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 rounded-lg overflow-hidden">
                {auto.imagenes.map((img) => (
                  <div key={img.id || img.url_imagen} className="aspect-square relative bg-base-100 rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={img.url_imagen}
                      alt={img.descripcion || `${auto.marca} ${auto.modelo}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-base-100/40 p-8 rounded-lg border border-dashed border-base-content/20">
                <div className="flex flex-col items-center justify-center gap-3 py-12">
                  <ImageIcon size={48} className="text-base-content/30" />
                  <p className="text-base-content/60 text-lg">Este vehículo no tiene imágenes</p>
                  <button onClick={openImageModal} className="btn btn-primary mt-2 gap-1">
                    <ImagePlus size={18} />
                    Agregar imagen
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divisor con degradado */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent my-6"></div>

          {/* Información detallada */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-5">
              {/* Detalles Principales */}
              <div className="bg-base-100/50 p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-primary flex items-center gap-2 mb-3">
                  <Tag size={18} />
                  Detalles Principales
                </h3>

                <div className="space-y-3">
                  {detallesPrincipales.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-base-content/70">{item.label}:</span>
                      {item.showColorDot ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-primary"></div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ) : (
                        <span className="font-medium">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Información Técnica */}
              <div className="bg-base-100/50 p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-primary flex items-center gap-2 mb-3">
                  <FileText size={18} />
                  Información Técnica
                </h3>

                <div className="space-y-3">
                  {infoTecnica.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-base-content/70">{item.label}:</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-5">
              {/* Información Financiera */}
              <div className="bg-base-100/50 p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-primary flex items-center gap-2 mb-3">
                  <DollarSign size={18} />
                  Información Financiera
                </h3>

                <div className="space-y-3">
                  {infoFinanciera.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-base-content/70">{item.label}:</span>
                      <span className="font-bold">{item.value}</span>
                    </div>
                  ))}
                  
                  {tieneMargen && (
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Margen:</span>
                      <span className={`font-bold ${margenPositivo ? 'text-success' : 'text-error'}`}>
                        S/{margen.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Estado y Fechas */}
              <div className="bg-base-100/50 p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-primary flex items-center gap-2 mb-3">
                  <CalendarDays size={18} />
                  Estado y Fechas
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/70">Estado:</span>
                    <span className={`badge ${
                      auto.estado === 'listo' ? 'badge-success' :
                      auto.estado === 'reparacion' ? 'badge-warning' :
                      auto.estado === 'vendido' ? 'badge-secondary' :
                      'badge-ghost'}`}>
                      {auto.estado}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-base-content/70">Fecha de ingreso:</span>
                    <span className="font-medium">{formatDate(auto.fecha_ingreso)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Observaciones - ancho completo */}
          {auto.observaciones && (
            <div className="bg-base-100/50 p-4 rounded-lg shadow-sm mt-4">
              <h3 className="font-medium text-primary flex items-center gap-2 mb-3">
                <ClipboardList size={18} />
                Observaciones
              </h3>
              <p className="text-base-content/90 whitespace-pre-wrap">{auto.observaciones}</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 mt-8">
            <Link href="/dashboard/autos" className="btn btn-ghost">
              <ArrowLeft size={18} className="mr-1" />
              Volver
            </Link>
            <button onClick={openEditModal} className="btn btn-primary">
              <Edit size={18} className="mr-1" />
              Editar detalles
            </button>
          </div>
        </div>
      </div>

      {/* Modal para agregar imágenes */}
      <AgregarImagenModal 
        auto={auto}
        isOpen={isImageModalOpen}
        onClose={closeImageModal}
        onSuccess={handleImageSuccess}
      />
      
      {/* Modal para editar */}
      {isEditModalOpen && (
        <div className="modal modal-open bg-black/40 backdrop-blur-sm">
          <div className="modal-box w-11/12 max-w-5xl bg-base-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Editar Vehículo
            </h2>
            
            <EditarAutoForm 
              autoId={Number(id)} 
              onSubmitSuccess={handleEditSuccess} 
            />
            
            <div className="modal-action mt-2">
              <button onClick={closeEditModal} className="btn btn-sm btn-circle absolute right-2 top-2">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerDetallesAuto;