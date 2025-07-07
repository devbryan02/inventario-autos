import AdminSignUpFormStyled from './AdminSingUpFormStyled';

export function EnhancedSignUpForm() {
  // Componente envoltorio para mejorar el diseño del AdminSignUpForm existente
  return (
    <div className="w-full">
      <AdminSignUpFormStyled />
    </div>
  );
}