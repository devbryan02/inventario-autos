"use client";

import AutoForm from './AgregarAutoForm';
import { AutoFormProps } from '../types';

function EditarAutoForm({ autoId, onSubmitSuccess }: Omit<AutoFormProps, 'isEdit'>) {
    if (!autoId) {
        console.error("EditarAutoForm requiere un autoId");
        return <div className="alert alert-error">ID de vehículo no proporcionado</div>;
    }
    
    return (
        <AutoForm 
            autoId={autoId} 
            onSubmitSuccess={onSubmitSuccess}
            isEdit={true}
        />
    );
}

export default EditarAutoForm;