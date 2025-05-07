"use client";
import { useState, useRef, ChangeEvent } from 'react';
import { ImagePlus, Upload, X, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { insertImageInAuto } from '../services';
import { Auto } from '../types';
import Image from 'next/image';
import { uploadAutoImage } from '@/lib/supabase-storage';

interface AgregarImagenModalProps {
    auto: Auto | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

function AgregarImagenModal({ auto, isOpen, onClose, onSuccess }: AgregarImagenModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [descripcion, setDescripcion] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mostrar formulario solo si un auto está seleccionado y el modal está abierto
    if (!auto || !isOpen) return null;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Restablecer estados
        setError(null);
        setSuccess(false);

        // Validación básica de archivos
        if (!selectedFile.type.startsWith('image/')) {
            setError('El archivo seleccionado no es una imagen válida');
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('La imagen es demasiado grande. El tamaño máximo es 5MB');
            return;
        }

        setFile(selectedFile);

        // Crear URL de vista previa
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        // Limpiar URL al desmontar para evitar fugas de memoria
        return () => URL.revokeObjectURL(objectUrl);
    };

    // Actualiza el manejo de errores en handleSubmit:

    const handleSubmit = async () => {
        if (!file || !auto) return;

        try {
            setLoading(true);
            setError(null);

            // Usar el servicio uploadAutoImage para subir la imagen a Supabase Storage
            const imageUrl = await uploadAutoImage(file, auto.id);
            console.log("Imagen subida exitosamente:", imageUrl);

            // Guardar la relación en la base de datos
            await insertImageInAuto({
                auto_id: auto.id,
                url_imagen: imageUrl,
                descripcion: descripcion || null
            });

            setSuccess(true);

            // Limpiar el formulario después de un breve retraso para mostrar el mensaje de éxito
            setTimeout(() => {
                setFile(null);
                setPreviewUrl(null);
                setDescripcion('');

                if (onSuccess) onSuccess();
                onClose();
            }, 1500);

        } catch (err: any) {
            console.error('Error detallado:', err);
            setError(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <dialog open={isOpen} className="modal modal-open bg-black/50 backdrop-blur-sm">
            <div className="modal-box bg-gradient-to-br from-base-200 to-base-300 shadow-xl border border-base-300 max-w-lg">
                <div className="relative">
                    {/* Encabezado */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <div className="bg-primary/20 p-2 rounded-lg">
                                <ImagePlus className="text-primary h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-primary">Agregar Imagen</span>
                                <span className="text-base-content/70 text-sm font-normal">
                                    {auto.marca} {auto.modelo} ({auto.anio})
                                </span>
                            </div>
                        </h3>
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-circle btn-ghost hover:bg-error/20 hover:text-error transition-all"
                            disabled={loading}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Divisor con gradiente */}
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6"></div>

                    {/* Área de carga de archivos */}
                    <div className="space-y-6">
                        {error && (
                            <div className="alert alert-error bg-opacity-80 flex items-center gap-2">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="alert alert-success bg-opacity-80 flex items-center gap-2">
                                <CheckCircle2 size={18} />
                                <span>Imagen agregada correctamente</span>
                            </div>
                        )}

                        <div
                            onClick={loading ? undefined : triggerFileInput}
                            className={`border-2 border-dashed rounded-lg p-8 text-center ${loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} transition-all
                ${previewUrl ? 'border-primary border-opacity-50' : 'border-base-content border-opacity-20 hover:border-opacity-40'}`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                disabled={loading}
                            />

                            {previewUrl ? (
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={previewUrl}
                                        alt="Vista previa"
                                        fill
                                        className="object-contain rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <Camera className="h-12 w-12 text-primary/50 mb-2" />
                                    <p className="text-base-content/70 mb-2">Haz clic para seleccionar una imagen</p>
                                    <p className="text-xs text-base-content/50">JPG, PNG • Máximo 5MB</p>
                                </div>
                            )}
                        </div>

                        {/* Descripción opcional */}
                        <div className="form-control">
                            <label className="label py-1">
                                <span className="label-text font-medium">Descripción (opcional)</span>
                            </label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="textarea textarea-bordered h-20 focus:ring-2 focus:ring-primary/30 transition-all"
                                placeholder="Descripción de la imagen..."
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            onClick={onClose}
                            className="btn btn-sm btn-ghost"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!file || loading}
                            className="btn btn-sm btn-primary"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-xs"></span>
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <Upload size={16} />
                                    Subir imagen
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Fondo con click para cerrar */}
            <div className="modal-backdrop" onClick={loading ? undefined : onClose}></div>
        </dialog>
    );
}

export default AgregarImagenModal;