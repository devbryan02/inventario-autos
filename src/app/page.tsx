"use client";

import { useState, useEffect, Suspense, JSX } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Car, Lock, UserPlus } from "lucide-react";
import EnhancedLoginForm from "@/features/admin/AdminLoginFormStyled";
import EnhancedSignUpForm from "@/features/admin/AdminSingUpFormStyled";
import { supabase } from "@/lib/supabase";

function HomeContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom: string | null = searchParams.get('redirectedFrom');

  // Verificar sesión al cargar la página
  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 flex flex-col">
      {redirectedFrom && (
        <div className="alert alert-warning shadow-lg max-w-md mx-auto mt-4">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Debes iniciar sesión para acceder a esa página.</span>
          </div>
        </div>
      )}

      {/* Header/Hero Section */}
      <div className="hero bg-base-200 py-8">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
              <Car className="text-primary" size={40} />
              <span>Auto<span className="text-primary">Inventario</span></span>
            </h1>
            <p className="py-4 text-base-content/70 max-w-md mx-auto">
              Sistema de gestión para inventario de autos, mantenimientos y ventas
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full max-w-6xl">
          {/* Left Column - App Showcase */}
          <div className="hidden lg:flex lg:col-span-3 flex-col space-y-6">
            <div className="card bg-base-100 shadow-xl overflow-hidden">
              <div className="card-body pb-0">
                <h2 className="card-title text-2xl font-bold">
                  Gestiona tu negocio de autos
                </h2>
                <p className="text-base-content/70">
                  Control completo y eficiente para tu inventario de vehículos
                </p>
              </div>
              <figure className="px-6 pb-6 pt-2">
                <div className="relative w-full h-[300px] bg-base-200 rounded-xl overflow-hidden">
                  {/* Placeholder para una imagen de dashboard */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Car size={80} className="mx-auto text-primary/30" />
                      <p className="mt-4 text-base-content/50 px-8">
                        Visualiza estadísticas, inventario y más en un dashboard moderno
                      </p>
                    </div>
                  </div>
                </div>
              </figure>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg font-medium flex items-center gap-2">
                    <div className="badge badge-primary p-3">1</div>
                    Inventario Detallado
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Control completo de cada vehículo con todos sus datos relevantes
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg font-medium flex items-center gap-2">
                    <div className="badge badge-primary p-3">2</div>
                    Seguimiento de Costos
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Registra compras, reparaciones y calcula ganancias proyectadas
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg font-medium flex items-center gap-2">
                    <div className="badge badge-primary p-3">3</div>
                    Análisis de Datos
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Estadísticas y gráficos para tomar decisiones informadas
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg font-medium flex items-center gap-2">
                    <div className="badge badge-primary p-3">4</div>
                    Mantenimientos
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Registro completo de reparaciones y mantenimientos realizados
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Forms */}
          <div className="col-span-1 lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {/* Tabs for switching between login and signup */}
                <div className="tabs tabs-boxed p-1 mb-6 bg-base-200">
                  <button
                    className={`tab flex-1 ${activeTab === 'login' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('login')}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </button>
                  <button
                    className={`tab flex-1 ${activeTab === 'signup' ? 'tab-active' : ''}`}
                    onClick={() => setActiveTab('signup')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrarse
                  </button>
                </div>

                {/* Form Content */}
                <div className="transition-all duration-300">
                  {activeTab === 'login' ? (
                    <EnhancedLoginForm />
                  ) : (
                    null
                  )}
                </div>

                {/* Quick action for switching forms */}
                <div className="mt-6 text-center text-sm">
                  {activeTab === 'login' ? (
                    <p className="text-base-content/70">
                      ¿No tienes cuenta?{" "}
                      <button
                        onClick={() => setActiveTab('signup')}
                        className="text-primary hover:underline font-medium"
                      >
                        Regístrate aquí
                      </button>
                    </p>
                  ) : (
                    <p className="text-base-content/70">
                      ¿Ya tienes una cuenta?{" "}
                      <button
                        onClick={() => setActiveTab('login')}
                        className="text-primary hover:underline font-medium"
                      >
                        Inicia sesión
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <aside>
          <p className="text-sm text-base-content/70">
            © 2025 AutoInventario - Sistema de gestión para concesionarios
          </p>
        </aside>
      </footer>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}