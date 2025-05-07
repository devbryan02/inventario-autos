// Tipo principal del auto
export type Auto = {
    id: number
    marca: string
    modelo: string
    anio: number
    kilometraje: number | null
    color: string | null
    numero_serie?: string | null
    estado: 'reparacion' | 'listo' | 'vendido' | 'entregado'
    precio_compra: number | null
    precio_venta: number | null
    fecha_ingreso: string
    observaciones?: string | null
    created_at: string
  }
  
  // Mantenimiento relacionado a un auto
  export type Mantenimiento = {
    id?: number
    auto_id: number
    tipo: string | null
    fecha: string
    descripcion: string
    costo: number | null
    kilometraje: number | null
    nota: string | null
    created_at?: string
    updated_at?: string
    // Para relaciones anidadas desde consultas JOIN
    autos?: {
      marca: string
      modelo: string
    }
  }
  
  // Imagen relacionada a un auto
  export type ImagenAuto = {
    id: number
    auto_id: number
    url_imagen: string
    descripcion?: string | null
  }


 // Añade esto a tus tipos existentes

export interface AutoFormProps {
    autoId?: number;
    onSubmitSuccess?: () => void;
    isEdit?: boolean;
}

// Resto de tus tipos...
  
  export interface AutoFormState {
    formData: Partial<Auto>;
    loading: boolean;
    success: boolean;
    error: string | null;
  }

export type AutoConImagenes = Auto & {
  imagenes: ImagenAuto[]
}

  