"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Tipo para información del usuario
export type UserInfo = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  es_admin: boolean;
  avatar_url?: string;
  lastLoginAt: string;
};

// Tipo para el contexto
type UserContextType = {
  userInfo: UserInfo | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  updateUserInfo: (data: Partial<UserInfo>) => void;
};

// Crear el contexto
const UserContext = createContext<UserContextType>({
  userInfo: null,
  isLoading: true,
  logout: async () => { },
  updateUserInfo: () => { },
});

// Hook para usar el contexto
export const useUser = () => useContext(UserContext);

// Proveedor del contexto
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Función para cargar el usuario
    const loadUser = async () => {
      try {
        // Verificar sesión en Supabase
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          // No hay sesión, limpiar datos locales
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('sessionActive');
          }
          setUserInfo(null);
          setIsLoading(false);
          return;
        }

        // Intentar cargar desde localStorage primero
        if (typeof window !== 'undefined') {
          const storedUserInfo = localStorage.getItem('userInfo');

          if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
            setIsLoading(false);
            return;
          }
        }


        // Modificar la parte que verifica/crea el perfil del usuario

        // Después de verificar la sesión
        if (session.user) {
          try {
            // Intentar un enfoque diferente para verificar si existe el perfil
            const { count, error: countError } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true })
              .eq('id', session.user.id);

            if (countError) {
              console.error("Error al verificar si existe el perfil:", countError);
            }

            // Si encontramos un perfil (count > 0), intentamos obtenerlo
            if (count && count > 0) {
              // El perfil existe, intentamos obtenerlo usando .select() sin .single()
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('nombre, apellido, es_admin')
                .eq('id', session.user.id);

              if (profileError) {
                console.error("Error obteniendo el perfil existente:", profileError);
              }

              // Si tenemos datos del perfil, usamos el primero
              if (profileData && profileData.length > 0) {
                const userProfile = profileData[0];
                const userInfo = {
                  id: session.user.id,
                  email: session.user.email || '',
                  nombre: userProfile.nombre || '',
                  apellido: userProfile.apellido || '',
                  es_admin: userProfile.es_admin || false,
                  avatar_url: undefined, // Aquí puedes agregar lógica para obtener el avatar si es necesario
                  lastLoginAt: new Date().toISOString()
                };

                setUserInfo(userInfo);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('userInfo', JSON.stringify(userInfo));
                  localStorage.setItem('sessionActive', 'true');
                }
              } else {
                // No pudimos obtener datos del perfil, usar datos por defecto
                console.log("Perfil existe pero no pudimos obtener sus datos, usando valores por defecto");
                const userInfo = {
                  id: session.user.id,
                  email: session.user.email || '',
                  nombre: 'Usuario',
                  apellido: 'Existente',
                  es_admin: true, // Por seguridad, en producción esto debería ser verificado
                  lastLoginAt: new Date().toISOString()
                };

                setUserInfo(userInfo);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('userInfo', JSON.stringify(userInfo));
                  localStorage.setItem('sessionActive', 'true');
                }
              }
            } else {
              // El perfil NO existe, intentamos crearlo
              console.log("Perfil no encontrado, intentando crear uno...");

              // Crear un perfil básico basado en los datos de autenticación
              const { data: userData } = await supabase.auth.getUser();

              // Extraer nombre y apellido de los metadatos si existen
              const nombre = userData.user?.user_metadata?.nombre || 'Usuario';
              const apellido = userData.user?.user_metadata?.apellido || 'Nuevo';

              // Intentar actualizar primero en lugar de insertar (upsert)
              const { error: upsertError } = await supabase
                .from('profiles')
                .upsert([
                  {
                    id: session.user.id,
                    nombre,
                    apellido,
                    es_admin: true
                  }
                ], {
                  onConflict: 'id'
                });

              if (upsertError) {
                console.error("Error en upsert:", upsertError);
              } else {
                console.log("Perfil creado/actualizado exitosamente con upsert");
              }

              // Independientemente del resultado, establecer la información del usuario
              const userInfo = {
                id: session.user.id,
                email: session.user.email || '',
                nombre,
                apellido,
                es_admin: true,
                lastLoginAt: new Date().toISOString()
              };

              setUserInfo(userInfo);
              if (typeof window !== 'undefined') {
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                localStorage.setItem('sessionActive', 'true');
              }
            }
          } catch (error) {
            console.error("Error procesando información del usuario:", error);

            // En caso de error, aún intentamos proporcionar alguna información básica
            const userInfo = {
              id: session.user.id,
              email: session.user.email || '',
              nombre: 'Usuario',
              apellido: 'Temporal',
              es_admin: true,
              lastLoginAt: new Date().toISOString()
            };

            setUserInfo(userInfo);
            if (typeof window !== 'undefined') {
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              localStorage.setItem('sessionActive', 'true');
            }
          }
        }

      } catch (error) {
        console.error('Error cargando información de usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Limpiar datos cuando se cierra sesión
        setUserInfo(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('sessionActive');
        }
      } else if (event === 'SIGNED_IN' && session) {
        // Cargar el usuario cuando inicia sesión
        loadUser();
      }
    });

    // Cargar el usuario al montar el componente
    loadUser();

    // Limpiar el listener al desmontar
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  // Función de cierre de sesión
  const logout = async () => {
    try {
      await supabase.auth.signOut();

      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('sessionActive');
      }

      setUserInfo(null);
      router.replace('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para actualizar información del usuario
  const updateUserInfo = (data: Partial<UserInfo>) => {
    if (!userInfo) return;

    const updatedUserInfo = { ...userInfo, ...data };
    setUserInfo(updatedUserInfo);

    if (typeof window !== 'undefined') {
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, isLoading, logout, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};