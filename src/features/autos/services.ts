import { supabase } from "@/lib/supabase";
import { Auto, AutoConImagenes, ImagenAuto } from "./types";

export async function fetchAutos(): Promise<AutoConImagenes[]> {
  const { data, error } = await supabase
    .from("autos")
    .select(`
      *,
      auto_imagenes(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching autos:", error);
    return [];
  }

  // Transformar el resultado para que coincida con el tipo AutoConImagenes
  const autosConImagenes = data.map(item => {
    const { auto_imagenes, ...auto } = item;
    return {
      ...auto,
      imagenes: auto_imagenes as ImagenAuto[]
    } as AutoConImagenes;
  });

  return autosConImagenes;
}

export const fetchAutoById = async (id: number) => {
  const { data, error } = await supabase
    .from('autos')
    .select(`
      *,
      auto_imagenes(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(`Error al obtener el auto: ${error.message}`);
  
  // Transformar el resultado
  const { auto_imagenes, ...auto } = data;
  return {
    ...auto,
    imagenes: auto_imagenes as ImagenAuto[]
  } as AutoConImagenes;
};

export async function addAuto(newAuto: Auto): Promise<Auto | null> {
  const { data, error } = await supabase
    .from("autos")
    .insert([newAuto])
    .select("*")
    .single();

  if (error) {
    console.error("Error adding auto:", error);
    return null;
  }

  return data as Auto;
}

export const insertImageInAuto = async (imagen: Omit<ImagenAuto, 'id'>) => {
  console.log("Intentando insertar imagen:", imagen);
  
  const { data, error } = await supabase
    .from('auto_imagenes')
    .insert(imagen)
    .select();

  console.log("Resultado de inserción:", { data, error });

  if (error) {
    console.error('Error insertando imagen:', error);
    throw new Error(`Error al insertar imagen: ${error.message}`);
  }
  
  return data;
}

export const updateAuto = async (id: number, updatedAuto: Partial<Auto>): Promise<AutoConImagenes> => {
  // Primero actualizamos el auto
  const { error } = await supabase
    .from("autos")
    .update(updatedAuto)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating auto:", error);
    throw new Error(`Error al actualizar el auto: ${error.message}`);
  }
  
  // Luego obtenemos el auto completo con sus imágenes
  return await fetchAutoById(id);
};

export const deleteAuto = async (id: number): Promise<void> => {
  // Primero eliminamos todas las imágenes asociadas al auto
  const { error: imageError } = await supabase
    .from("auto_imagenes")
    .delete()
    .eq("auto_id", id);

  if (imageError) {
    console.error("Error deleting auto images:", imageError);
    throw new Error(`Error al eliminar las imágenes del auto: ${imageError.message}`);
  }

  // Una vez eliminadas las imágenes, podemos eliminar el auto
  const { error } = await supabase
    .from("autos")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting auto:", error);
    throw new Error(`Error al eliminar el auto: ${error.message}`);
  }
};