
import MantenimientoList from "@/features/mantenimiento/components/MantenimientoList";

function MantenimientoPage() {
    return ( 
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Mantenimientos</h1>
            <MantenimientoList autoId={1} autoMarca="Toyota" autoModelo="Corolla" />
        </div>
     );
}

export default MantenimientoPage;