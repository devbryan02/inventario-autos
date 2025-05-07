import imageCompression from 'browser-image-compression'
import { supabase } from '@/lib/supabase'

export const uploadAutoImage = async (file: File, autoId: number): Promise<string> => {
  // Opciones de compresión
  const options = {
    maxSizeMB: 0.5, 
    maxWidthOrHeight: 1024, 
    useWebWorker: true,
  }

  // Comprimir imagen
  const compressedFile = await imageCompression(file, options)

  const filePath = `${autoId}/${Date.now()}-${compressedFile.name}`

  // Subir archivo comprimido
  const { error } = await supabase.storage
    .from('autos')
    .upload(filePath, compressedFile)

  if (error) throw new Error(`Error al subir imagen: ${error.message}`)

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from('autos')
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
