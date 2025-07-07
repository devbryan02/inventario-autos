import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { addAuto, fetchAutoById, updateAuto } from '../services';
import { Auto } from '../types';
import { useRouter } from 'next/navigation';

// Actualizar el tipo inicial para permitir valores null en campos opcionales
// y restringir 'estado' a los valores válidos
interface FormState {
    marca: string;
    modelo: string;
    anio: number;
    color: string | null;
    kilometraje: number | null;
    precio_compra: number | null;
    precio_venta: number | null;
    numero_serie: string | null;
    observaciones: string | null;
    fecha_ingreso: string;
    estado: "listo" | "reparacion" | "vendido" | "entregado";
}

const initialFormState: FormState = {
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    color: '',
    kilometraje: 0,
    precio_compra: 0,
    precio_venta: 0,
    numero_serie: '',
    observaciones: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    estado: 'listo',  
};

export function useAutoForm(autoId?: number) {

    const router = useRouter();;

    const [state, setState] = useState({
        formData: { ...initialFormState },
        loading: false,
        success: null as string | null,
        error: null as string | null,
        isLoading: !!autoId, // Estado de carga inicial si es modo edición
    });

    // Si hay un autoId, carga los datos existentes
    useEffect(() => {
        if (!autoId) return;

        const loadAutoData = async () => {
            try {
                const autoData = await fetchAutoById(autoId);
                
                // Asegurarse de que la fecha tenga el formato correcto para el input
                const formattedDate = autoData.fecha_ingreso 
                    ? new Date(autoData.fecha_ingreso).toISOString().split('T')[0] 
                    : new Date().toISOString().split('T')[0];
                
                // Verificamos que el estado sea válido antes de asignarlo
                const validEstado = ['listo', 'reparacion', 'vendido', 'entregado'].includes(autoData.estado || '')
                    ? (autoData.estado as FormState['estado'])
                    : 'listo';
                
                // Normalizamos los datos para asegurar compatibilidad de tipos
                const normalizedData: FormState = {
                    marca: autoData.marca || '',
                    modelo: autoData.modelo || '',
                    anio: autoData.anio || new Date().getFullYear(),
                    color: autoData.color || '',
                    kilometraje: autoData.kilometraje || 0,
                    precio_compra: autoData.precio_compra || 0,
                    precio_venta: autoData.precio_venta || 0,
                    numero_serie: autoData.numero_serie || '',
                    observaciones: autoData.observaciones || '',
                    fecha_ingreso: formattedDate,
                    estado: validEstado
                };
                
                setState(prev => ({
                    ...prev,
                    formData: normalizedData,
                    isLoading: false
                }));
            } catch (error) {
                console.error("Error al cargar datos del vehículo:", error);
                setState(prev => ({
                    ...prev,
                    error: "No se pudieron cargar los datos del vehículo",
                    isLoading: false
                }));
            }
        };

        loadAutoData();
    }, [autoId]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Caso especial para el campo estado
        if (name === 'estado') {
            // Verificar que el valor sea uno de los estados permitidos
            if(['listo', 'reparacion', 'vendido', 'entregado'].includes(value)) {
                setState({
                    ...state,
                    formData: {
                        ...state.formData,
                        [name]: value as FormState['estado']
                    }
                });
            }
            return;
        }
        
        // Convertir a número si el tipo es numérico
        const parsedValue = type === 'number' ? parseFloat(value) || 0 : value;
        
        setState({
            ...state,
            formData: {
                ...state.formData,
                [name]: parsedValue
            }
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        setState({ ...state, loading: true, error: null, success: null });

        try {
            if (autoId) {
                // Modo edición
                await updateAuto(autoId, state.formData as Partial<Auto>);
                setState({
                    ...state,
                    loading: false,
                    success: "Vehículo actualizado correctamente"
                });
            } else {
                // Modo creación
                await addAuto(state.formData as Auto);
                setState({
                    ...state,
                    loading: false,
                    formData: { ...initialFormState },
                    success: "Vehículo agregado correctamente"
                });
                router.push('/dashboard/autos'); // Redirigir a la lista de autos después de agregar
            }
        } catch (error) {
            setState({
                ...state,
                loading: false,
                error: error instanceof Error ? error.message : "Error al procesar el formulario"
            });
            console.error("Error en el formulario:", error);
        }
    };

    return {
        state,
        handleChange,
        handleSubmit
    };
}