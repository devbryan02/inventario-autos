import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginFormStyled() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    // Intento de inicio de sesión con Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) throw signInError;
    
    if (!data || !data.user) {
      throw new Error('No se pudo iniciar sesión. Intenta nuevamente.');
    }

    console.log("Usuario autenticado:", data.user.id);
    
    // Modificación para diagnóstico: Consulta sin filtros
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
      
    console.log("Muestra de perfiles:", allProfiles);
    console.log("Error consultando perfiles:", allProfilesError);

    // Ahora intentamos obtener el perfil específico
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('es_admin')
      .eq('id', data.user.id)
      .single();

    console.log("Perfil del usuario:", profileData);
    console.log("Error detallado:", JSON.stringify(profileError));

    // Desactivar temporalmente la verificación para pruebas
    if (profileError) {
      console.error("Error obteniendo perfil:", profileError);
      // Comentado temporalmente para pruebas
      throw new Error('Error al verificar permisos de administrador');
    
    }

    // Si no hay datos de perfil o no es admin, cerrar sesión
    if (!profileData || !profileData.es_admin) {
      await supabase.auth.signOut();
      throw new Error('Acceso denegado. Solo administradores pueden ingresar.');
    }
    
    // Redirigir al dashboard después del inicio de sesión exitoso
    console.log("Inicio de sesión exitoso, redirigiendo...");
    window.location.href = '/dashboard';
    
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    setError(error instanceof Error ? error.message : 'Ocurrió un error desconocido');
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-center">Acceso Administrativo</h2>

      {error && (
        <div className="alert alert-error mb-4 flex items-start">
          <AlertCircle className="stroke-current shrink-0 h-6 w-6 mt-0.5" />
          <span className="ml-2">{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="form-control w-full mb-4">
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

        <div className="form-control w-full mb-6">
          <label className="label">
            <span className="label-text">Contraseña</span>
          </label>
          <input
            type="password"
            placeholder="•••••••••"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="label flex justify-between">
            <span className="label-text-alt">
              <a href="#" className="link link-hover text-xs">¿Olvidaste tu contraseña?</a>
            </span>
          </label>
        </div>

        <button
          type="submit"
          className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </button>
      </form>

      {/* Mensaje de debug para desarrollo */}
      <div className="mt-6 text-xs text-center text-base-content/60">
        <p>¿Problemas para iniciar sesión? Asegúrate de:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Verificar tu email</li>
          <li>Haber confirmado tu cuenta desde el email de registro</li>
          <li>Tener permisos de administrador asignados</li>
        </ul>
      </div>
    </div>
  );
}