import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  // Crear cliente de Supabase para el middleware
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
  
  // Verificar si hay una sesión activa
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // URLs que requieren autenticación
  const protectedPaths = ['/dashboard', '/dashboard/autos', '/dashboard/configuracion'];
  
  // Comprobar si la ruta actual está protegida
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(`${path}/`)
  );

  // Si la ruta está protegida pero no hay sesión, redirigir al login
  if (isProtectedPath && !session) {
    // URL a la que el usuario intentaba acceder
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay una sesión y el usuario intenta acceder a la página de inicio, redirigir al dashboard
  if (session && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};