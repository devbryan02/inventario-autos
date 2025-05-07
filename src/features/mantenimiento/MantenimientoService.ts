import { supabase } from "@/lib/supabase";
import { Mantenimiento } from "../autos/types";

/**
 * Crea un nuevo registro de mantenimiento
 * @param mantenimiento Datos del mantenimiento a crear
 * @returns El mantenimiento creado o null en caso de error
 */
export async function createMantenimiento(mantenimiento: Omit<Mantenimiento, 'id'>): Promise<Mantenimiento | null> {
  const { data, error } = await supabase
    .from("historial_mantenimiento")
    .insert([mantenimiento])
    .select("*")
    .single();

  if (error) {
    console.error("Error al crear mantenimiento:", error);
    throw new Error(`Error al crear el registro de mantenimiento: ${error.message}`);
  }

  return data;
}

/**
 * Obtiene un registro de mantenimiento por su ID
 * @param id ID del mantenimiento a obtener
 * @returns El mantenimiento encontrado o null si no existe
 */
export async function getMantenimientoById(id: number): Promise<Mantenimiento | null> {
  const { data, error } = await supabase
    .from("historial_mantenimiento")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error al obtener mantenimiento:", error);
    throw new Error(`Error al obtener el registro de mantenimiento: ${error.message}`);
  }

  return data;
}

/**
 * Obtiene todos los registros de mantenimiento de un vehículo
 * @param autoId ID del vehículo
 * @returns Lista de mantenimientos del vehículo
 */
export async function getMantenimientosByAutoId(autoId: number): Promise<Mantenimiento[]> {
  const { data, error } = await supabase
    .from("historial_mantenimiento")
    .select("*")
    .eq("auto_id", autoId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al obtener mantenimientos del vehículo:", error);
    throw new Error(`Error al obtener el historial de mantenimiento: ${error.message}`);
  }

  return data || [];
}

/**
 * Obtiene todos los registros de mantenimiento
 * @returns Lista completa de mantenimientos
 */
export async function getAllMantenimientos(): Promise<Mantenimiento[]> {
  const { data, error } = await supabase
    .from("historial_mantenimiento")
    .select("*, autos(marca, modelo)")
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al obtener todos los mantenimientos:", error);
    throw new Error(`Error al obtener el historial completo de mantenimiento: ${error.message}`);
  }

  return data || [];
}

/**
 * Actualiza un registro de mantenimiento existente
 * @param id ID del mantenimiento a actualizar
 * @param mantenimiento Datos actualizados del mantenimiento
 * @returns El mantenimiento actualizado
 */
export async function updateMantenimiento(
  id: number, 
  mantenimiento: Partial<Mantenimiento>
): Promise<Mantenimiento | null> {
  const { data, error } = await supabase
    .from("historial_mantenimiento")
    .update(mantenimiento)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error al actualizar mantenimiento:", error);
    throw new Error(`Error al actualizar el registro de mantenimiento: ${error.message}`);
  }

  return data;
}

/**
 * Elimina un registro de mantenimiento
 * @param id ID del mantenimiento a eliminar
 */
export async function deleteMantenimiento(id: number): Promise<void> {
  const { error } = await supabase
    .from("historial_mantenimiento")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar mantenimiento:", error);
    throw new Error(`Error al eliminar el registro de mantenimiento: ${error.message}`);
  }
}

/**
 * Obtiene estadísticas básicas de mantenimiento
 * @returns Estadísticas de mantenimiento
 */
export async function getMantenimientoStats(): Promise<{
  total: number;
  costoTotal: number;
  porTipo: Record<string, number>;
}> {
  const { data, error } = await supabase
    .from("historial_mantenimiento")
    .select("*");

  if (error) {
    console.error("Error al obtener estadísticas de mantenimiento:", error);
    throw new Error(`Error al obtener estadísticas de mantenimiento: ${error.message}`);
  }

  const stats = {
    total: data.length,
    costoTotal: data.reduce((sum, item) => sum + (item.costo || 0), 0),
    porTipo: data.reduce((acc, item) => {
      const tipo = item.tipo || 'otros';
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return stats;
}

/**
 * Busca registros de mantenimiento según criterios
 * @param query Términos de búsqueda
 * @returns Lista de mantenimientos que coinciden con la búsqueda
 */
export async function searchMantenimientos(query: string): Promise<Mantenimiento[]> {
  const { data, error } = await supabase
    .from("historial_mantenimiento")
    .select("*, autos(marca, modelo)")
    .or(`descripcion.ilike.%${query}%, tipo.ilike.%${query}%`);

  if (error) {
    console.error("Error al buscar mantenimientos:", error);
    throw new Error(`Error al buscar registros de mantenimiento: ${error.message}`);
  }

  return data || [];
}