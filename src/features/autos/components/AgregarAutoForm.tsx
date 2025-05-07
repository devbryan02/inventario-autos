"use client";

import { FormFields } from './FormFields';
import { Notifications } from './Notifications';
import { SubmitButton } from './SubmitButton';
import { useAutoForm } from '../hooks/useAutoForm';
import { AutoFormProps } from '../types';
import { useEffect } from 'react';

function AutoForm({ autoId, onSubmitSuccess, isEdit = false }: AutoFormProps = {}) {
    const { state, handleChange, handleSubmit } = useAutoForm(autoId);
    const { formData, loading, success, error, isLoading } = state;

    // Usamos useEffect para llamar onSubmitSuccess solo una vez cuando el estado cambia a éxito
    useEffect(() => {
        if (success && onSubmitSuccess) {
            onSubmitSuccess();
        }
    }, [success, onSubmitSuccess]);

    // Determinamos el mensaje de éxito
    const successMessage = success ? (isEdit ? "Vehículo actualizado correctamente" : success) : null;

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-base-100 rounded-lg shadow-lg">
                {/* Notifications area - appears at the top when needed */}
                {(error || success) && (
                    <div className="px-6 pt-5">
                        <Notifications 
                            error={error} 
                            success={!!successMessage} // Convertimos a boolean
                        />
                        
                        {/* Si hay mensaje de éxito, lo mostramos aparte */}
                        {successMessage && (
                            <div className="alert alert-success mt-2">
                              <span>{successMessage}</span>
                            </div>
                        )}
                    </div>
                )}
                
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : (
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <FormFields 
                                formData={formData} 
                                handleChange={handleChange} 
                                isEdit={isEdit}
                            />
                            <div className="divider" />      
                            <div className="flex justify-end">
                                <SubmitButton loading={loading} label={isEdit ? "Actualizar Vehículo" : "Agregar Vehículo"} />
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AutoForm;