
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSignUpFormStyled() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(false);
  
  try {
    // Paso 1: Registrar el usuario
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellido,
          es_admin: true
        }
      }
    });
    
    if (authError) throw authError;
    
    // Paso 2: Crear el perfil utilizando una transacción o RPC
    if (authData.user) {
      // Usar una función RPC que tenga permisos especiales
      const { error: profileError } = await supabase.rpc('create_admin_profile', {
        user_id: authData.user.id,
        user_nombre: nombre,
        user_apellido: apellido
      });
      
      if (profileError) {
        console.error("Error creating profile:", profileError);
        setError("La cuenta se creó, pero hubo un problema configurando tu perfil. Contacta al administrador.");
        return;
      }
      
      setSuccess(true);
    }
  } catch (error) {
    console.error("Signup error:", error);
    setError((error as Error).message);
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-center">Crear Cuenta Administrativa</h2>
      
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>¡Cuenta creada con éxito! Por favor revise su correo para confirmar.</span>
        </div>
      )}
      
      {!success ? (
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                placeholder="Juan"
                className="input input-bordered w-full"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Apellido</span>
              </label>
              <input
                type="text"
                placeholder="Pérez"
                className="input input-bordered w-full"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Correo electrónico</span>
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Contraseña</span>
            </label>
            <input
              type="password"
              placeholder="Min. 6 caracteres"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/70">Debe contener al menos 6 caracteres</span>
            </label>
          </div>
          
          <button 
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta administrativa'}
            {!loading && <UserPlus className="w-4 h-4 ml-2" />}
          </button>
        </form>
      ) : (
        <div className="text-center py-6">
          <p className="text-success mb-4">
            Hemos enviado un correo de confirmación a <strong>{email}</strong>
          </p>
          <p className="text-base-content/70 mb-4">
            Por favor revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
          </p>
          <button 
            className="btn btn-outline btn-primary"
            onClick={() => setSuccess(false)}
          >
            Registrar otra cuenta
          </button>
        </div>
      )}
    </div>
  );
}