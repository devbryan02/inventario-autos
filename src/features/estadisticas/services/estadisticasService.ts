import { supabase } from "@/lib/supabase";
import { Auto } from "@/features/autos/types";
import { PrecioCompraVenta, EstadisticasGenerales } from "../types/estadisticas.type";

/**
 * Obtiene los datos de precios de compra y venta de todos los autos
 */
export async function fetchPreciosCompraVenta(): Promise<PrecioCompraVenta[]> {
  // Obtenemos sólo los campos necesarios para optimizar la consulta
  const { data, error } = await supabase
    .from("autos")
    .select("id, marca, modelo, precio_compra, precio_venta")
    .order("marca", { ascending: true })
    .order("modelo", { ascending: true });

  if (error) {
    console.error("Error fetching precio compra venta:", error);
    throw new Error(`Error al obtener datos de precios: ${error.message}`);
  }

  // Transformamos los datos para facilitar su uso en el gráfico
  const transformedData = data.map(auto => ({
    id: auto.id,
    nombre: `${auto.marca} ${auto.modelo}`,
    precio_compra: auto.precio_compra || 0,
    precio_venta: auto.precio_venta || 0,
    diferencia: (auto.precio_venta || 0) - (auto.precio_compra || 0),
    porcentajeGanancia: auto.precio_compra ? 
      ((auto.precio_venta || 0) - auto.precio_compra) / auto.precio_compra * 100 : 0
  }));

  return transformedData;
}

/**
 * Obtiene estadísticas generales del inventario de autos
 */
export async function fetchEstadisticasGenerales(): Promise<EstadisticasGenerales> {
  // Consulta de estadísticas básicas
  const { data, error } = await supabase
    .from("autos")
    .select("*");

  if (error) {
    console.error("Error fetching estadísticas generales:", error);
    throw new Error(`Error al obtener estadísticas generales: ${error.message}`);
  }

  // Procesamos los datos para obtener estadísticas
  const autos: Auto[] = data;
  const totalAutos = autos.length;
  
  const totalCompra = autos.reduce((sum, auto) => 
    sum + (auto.precio_compra || 0), 0);
  
  const totalVenta = autos.reduce((sum, auto) => 
    sum + (auto.precio_venta || 0), 0);
  
  const gananciaProyectada = totalVenta - totalCompra;
  
  // Contadores por estado
  const contadorEstados = autos.reduce((acc, auto) => {
    const estado = auto.estado;
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalAutos,
    totalCompra,
    totalVenta,
    gananciaProyectada,
    contadorEstados,
    promedioCompra: totalAutos ? totalCompra / totalAutos : 0,
    promedioVenta: totalAutos ? totalVenta / totalAutos : 0,
  };
}