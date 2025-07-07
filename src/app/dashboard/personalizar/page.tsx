"use client";

import { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Palette, 
  Building,
  Check
} from 'lucide-react';

// Temas disponibles en DaisyUI
const THEMES = [
  { name: "light", label: "Claro", icon: Sun },
  { name: "dark", label: "Oscuro", icon: Moon },
  { name: "dim", label: "Dim", icon: Moon },
  { name: "corporate", label: "Corporativo", icon: Building },
  { name: "cupcake", label: "Cupcake", icon: Palette },
  { name: "bumblebee", label: "Bumblebee", icon: Palette },
  { name: "emerald", label: "Esmeralda", icon: Palette },
  { name: "synthwave", label: "Synthwave", icon: Palette },
  { name: "retro", label: "Retro", icon: Palette },
  { name: "cyberpunk", label: "Cyberpunk", icon: Palette },
  { name: "night", label: "Noche", icon: Moon },
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<string>('dim');
  const [saveStatus, setSaveStatus] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
  
  // Cargar el tema actual cuando el componente se monte
  useEffect(() => {
    // Obtener el tema del localStorage o usar el tema del HTML
    const savedTheme = localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme') || 'dim';
    setCurrentTheme(savedTheme);
  }, []);
  
  // Cambiar el tema
  const changeTheme = (theme: string) => {
    // Actualizar el estado
    setCurrentTheme(theme);
    
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
    
    // Actualizar el atributo data-theme del HTML
    document.documentElement.setAttribute('data-theme', theme);
    
    // Mostrar mensaje de confirmación
    setSaveStatus({
      status: 'success',
      message: `Tema "${theme}" aplicado correctamente`
    });
    
    // Limpiar mensaje después de un tiempo
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };
  
  // Componente para renderizar cada tema
const ThemeButton = ({ 
  themeName, 
  label, 
  Icon 
}: { 
  themeName: string; 
  label: string; 
  Icon: React.ComponentType<{ size?: number; className?: string }>; 
}) => (
  <button
    onClick={() => changeTheme(themeName)}
    className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
      currentTheme === themeName 
        ? 'bg-primary text-primary-content shadow-md' 
        : 'bg-base-200 hover:bg-base-300'
    }`}
    aria-label={`Cambiar al tema ${label}`}
  >
    <Icon size={18} />
    <span>{label}</span>
    {currentTheme === themeName && <Check size={16} className="ml-auto" />}
  </button>
);
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Título y descripción */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Personalización de Tema</h1>
        </div>
        <p className="text-base-content/70 mt-2 ml-1">
          Cambia la apariencia de la aplicación según tus preferencias
        </p>
      </div>
      
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title text-primary flex items-center gap-2">
            <Palette size={20} />
            Tema y apariencia
          </h2>
          <p className="text-sm text-base-content/70">
            Selecciona el tema que más te guste para personalizar tu experiencia
          </p>
          
          <div className="mt-6">
            <h3 className="font-medium mb-3">Selecciona un tema:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {THEMES.map(({ name, label, icon: Icon }) => (
                <ThemeButton key={name} themeName={name} label={label} Icon={Icon} />
              ))}
            </div>
            
            {/* Mensaje de estado */}
            {saveStatus && (
              <div className={`alert mt-6 ${saveStatus.status === 'success' ? 'alert-success' : 'alert-error'}`}>
                <div className="flex items-center gap-2">
                  {saveStatus.status === 'success' ? <Check size={18} /> : null}
                  <span>{saveStatus.message}</span>
                </div>
              </div>
            )}
            
            <div className="divider mt-8">Vista previa de componentes</div>
            
            <div className="bg-base-200 p-6 rounded-lg">
              <h4 className="font-bold text-base-content mb-4">Elementos de interfaz</h4>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-neutral">Neutral</button>
                <button className="btn btn-ghost">Ghost</button>
                <button className="btn btn-link">Link</button>
              </div>
              
              <div className="mt-6">
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Campo de texto</span>
                  </label>
                  <input type="text" placeholder="Ejemplo de input" className="input input-bordered w-full max-w-xs" />
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="badge">Badge</div>
                <div className="badge badge-primary">Primary</div>
                <div className="badge badge-secondary">Secondary</div>
                <div className="badge badge-accent">Accent</div>
              </div>
              
              <div className="mt-6">
                <progress className="progress w-56" value="40" max="100"></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}