import { AlertCircle, Check } from 'lucide-react';

interface NotificationsProps {
    error: string | null;
    success: boolean;
}

export function Notifications({ error, success }: NotificationsProps) {
    return (
        <>
            {error && (
                <div className="alert alert-error">
                    <AlertCircle className="h-6 w-6" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <Check className="h-6 w-6" />
                    <span>Auto registrado correctamente</span>
                </div>
            )}
        </>
    );
}