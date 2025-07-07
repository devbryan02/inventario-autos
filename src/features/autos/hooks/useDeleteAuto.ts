import { useState } from 'react';
import Swal from 'sweetalert2';
import { deleteAuto } from '../services';

export const useDeleteAuto = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);

  const confirmAndDelete = async (id: number, marca: string, modelo: string) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar vehículo?',
        html: `¿Estás seguro de eliminar <strong>${marca} ${modelo}</strong>?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        focusCancel: true,
        buttonsStyling: false,
        width: '24rem',
        padding: '1.5rem',
        customClass: {
          popup: 'bg-base-200 text-base-content rounded-xl shadow-lg',
          title: 'text-xl font-bold text-warning',
          htmlContainer: 'text-sm text-neutral',
          confirmButton: 'btn btn-error text-white font-semibold',
          cancelButton: 'btn btn-outline btn-neutral ml-2',
        },
      });

      if (result.isConfirmed) {
        setLoading(true);
        await deleteAuto(id);

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Vehículo eliminado',
          text: `${marca} ${modelo}`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          buttonsStyling: false,
          customClass: {
            popup: 'bg-base-100 text-success-content shadow-xl rounded-md px-4 py-2',
            title: 'text-sm font-semibold',
            container: 'mt-4 mr-4',
          },
        });

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'error',
        title: 'Error al eliminar',
        text: 'Ocurrió un error al intentar eliminar el vehículo. Por favor, inténtalo de nuevo más tarde.',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        buttonsStyling: false,
        customClass: {
          popup: 'bg-error text-white rounded-md px-4 py-2',
          title: 'text-sm font-semibold',
          container: 'mb-4 mr-4',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return { confirmAndDelete, loading };
};
