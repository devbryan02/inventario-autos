export interface PrecioCompraVenta {
    id: number;
    nombre: string;
    precio_compra: number;
    precio_venta: number;
    diferencia: number;
    porcentajeGanancia: number;
  }
  
  export interface EstadisticasGenerales {
    totalAutos: number;
    totalCompra: number;
    totalVenta: number;
    gananciaProyectada: number;
    contadorEstados: Record<string, number>;
    promedioCompra: number;
    promedioVenta: number;
  }