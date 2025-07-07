"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Car, 
  PlusCircle, 
  SunMedium, 
  LogOut,
  Home,
  Wrench,
  User
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();
  const { userInfo, isLoading, logout } = useUser();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path ? "bg-primary text-primary-content" : "";
  };

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading && !userInfo) {
        router.push('/');
      }
    };
    
    checkAuth();
  }, [userInfo, isLoading, router]);

  // Mostrar spinner mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Si no hay usuario después de cargar, no renderizar nada (la redirección ocurrirá)
  if (!userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200 drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* Top Navbar */}
        <div className="navbar bg-base-300 lg:hidden">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="font-bold text-lg">Inentario Auto</span>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </div>
      
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="w-64 bg-base-300 min-h-full flex flex-col justify-between">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-base-content/10">
            <div className="flex items-center gap-3">
              <Car size={24} className="text-primary" />
              <h2 className="text-xl font-bold">Inventario Auto</h2>
            </div>
          </div>
          
          {/* User Info */}
          {userInfo && (
            <div className="p-4 bg-base-200 flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10 text-center p-1">
                  {userInfo.avatar_url ? (
                    <img src={userInfo.avatar_url} alt={`${userInfo.nombre}`} />
                  ) : (
                    <span className="text-lg">{userInfo.nombre.charAt(0)}{userInfo.apellido.charAt(0)}</span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium">{userInfo.nombre} {userInfo.apellido}</p>
                <p className="text-xs opacity-70">{userInfo.email}</p>
              </div>
            </div>
          )}
          
          {/* Navigation Menu */}
          <ul className="menu p-4 text-base-content gap-2">
            <li className="menu-title">
              <span>Navegación</span>
            </li>
            <li>
              <Link href="/dashboard" className={isActive("/dashboard")}>
                <Home size={18} />
                Dashboard
              </Link>
            </li>
            
            <li className="menu-title mt-">
              <span>Gestión de Autos</span>
            </li>
            <li>
              <Link href="/dashboard/autos/agregar" className={isActive("/dashboard/autos/agregar")}>
                <PlusCircle size={18} />
                Agregar Auto
              </Link>
            </li>
            <li>
              <Link href="/dashboard/autos" className={isActive("/dashboard/autos")}>
                <Car size={18} />
                Ver Inventario
              </Link>
            </li>
            
            <li>
              <Link href="/dashboard/mantenimientos" className={isActive("/dashboard/mantenimientos")}>
                <Wrench size={18} />
                Mantenimientos
              </Link>
            </li>
            <li className="menu-title mt-4">
              <span>Sistema</span>
            </li>
            <li>
              <Link href="/dashboard/personalizar" className={isActive("/dashboard/personalizar")}>
                <SunMedium size={18} />
                Personalización
              </Link>
            </li>
            <li>
              <Link href="/dashboard/perfil" className={isActive("/dashboard/perfil")}>
                <User size={18} />
                Mi Perfil
              </Link>
            </li>
          </ul>
          
          {/* Footer */}
          <div className="p-4 mt-auto border-t border-base-content/10">
            <button 
              className="btn btn-outline btn-block" 
              onClick={logout}
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}