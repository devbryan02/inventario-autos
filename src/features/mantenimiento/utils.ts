/**
 * Formatea una fecha en formato legible
 */
export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }
  
  /**
   * Formatea un valor monetario
   */
  export function formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) return 'N/A';
    
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }