/**
 * Formatea un número a formato de moneda en soles peruanos
 * @param value El valor numérico a formatear
 * @param currency El código de moneda (por defecto 'S/')
 * @returns String formateado en formato de moneda
 */
export function formatCurrency(value: number | null | undefined, currency: string = 'S/'): string {
    // Manejar valores nulos o indefinidos
    if (value === null || value === undefined) {
      return `${currency} 0.00`;
    }
    
    // Formatear el número con separadores de miles y 2 decimales
    const formattedValue = value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return `${currency} ${formattedValue}`;
  }
  
  /**
   * Formatea una fecha en formato legible
   * @param dateString La fecha a formatear
   * @param format El formato deseado (corto o largo)
   * @returns String formateado con la fecha
   */
  export function formatDate(dateString: string | Date, format: 'short' | 'long' = 'short'): string {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (format === 'short') {
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    return date.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  /**
   * Trunca un texto a una longitud máxima y añade puntos suspensivos
   * @param text El texto a truncar
   * @param maxLength La longitud máxima permitida
   * @returns El texto truncado con puntos suspensivos si excede la longitud
   */
  export function truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  }
  
  /**
   * Calcula el porcentaje de un valor respecto a un total
   * @param value El valor para calcular el porcentaje
   * @param total El valor total que representa el 100%
   * @param decimals Número de decimales a mostrar
   * @returns El porcentaje calculado con el número de decimales especificado
   */
  export function calculatePercentage(
    value: number,
    total: number,
    decimals: number = 2
  ): number {
    if (total === 0) return 0;
    const percentage = (value / total) * 100;
    return Number(percentage.toFixed(decimals));
  }
  
  /**
   * Genera un color aleatorio en formato hexadecimal
   * @returns String con el color hexadecimal
   */
  export function randomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
  
  /**
   * Convierte un objeto Date a formato ISO string para inputs date
   * @param date Objeto Date o string de fecha
   * @returns String en formato YYYY-MM-DD
   */
  export function toISODateString(date: Date | string | null | undefined): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Extraer año, mes y día y formatear como YYYY-MM-DD
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Devuelve un texto de descripción del tiempo transcurrido (ej: "hace 5 días")
   * @param date La fecha para calcular el tiempo transcurrido
   * @returns String con la descripción del tiempo transcurrido
   */
  export function timeAgo(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    // Intervalos en segundos para diferentes unidades de tiempo
    const intervals = {
      año: 31536000,
      mes: 2592000,
      semana: 604800,
      día: 86400,
      hora: 3600,
      minuto: 60
    };
    
    if (seconds < 60) {
      return 'hace un momento';
    }
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      
      if (interval >= 1) {
        // Manejar plural/singular
        return interval === 1 
          ? `hace 1 ${unit}` 
          : `hace ${interval} ${unit}${unit !== 'mes' ? 's' : 'es'}`;
      }
    }
    
    return 'hace un momento';
  }