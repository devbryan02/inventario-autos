import { Save, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
    loading: boolean;
    label?: string;
}

export function SubmitButton({ loading, label = "Agregar Vehículo" }: SubmitButtonProps) {
    return (
        <button 
            type="submit" 
            className={`btn btn-primary ${loading ? 'pointer-events-none' : ''}`} 
            disabled={loading}
        >
            {loading ? (
                <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Procesando...</span>
                </>
            ) : (
                <>
                    <Save size={20} />
                    <span>{label}</span>
                </>
            )}
        </button>
    );
}