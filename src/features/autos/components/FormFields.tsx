
import { 
  Car, 
  Calendar, 
  Palette,
  Tag,
  CheckSquare,
  DollarSign,
  Type,
  Gauge,
  FileText,
  CalendarDays,
  ClipboardList
} from "lucide-react";


interface FormState {
    marca: string;
    modelo: string;
    anio: number;
    color: string | null;
    kilometraje: number | null;
    precio_compra: number | null;
    precio_venta: number | null;
    numero_serie: string | null;
    observaciones: string | null;
    fecha_ingreso: string;
    estado: "listo" | "reparacion" | "vendido" | "entregado";
}


interface FormFieldsProps {
    formData: FormState;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    isEdit?: boolean;
}

export function FormFields({ formData, handleChange }: FormFieldsProps) {
    return (
        <div className="bg-base-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl text-primary font-medium mb-4 flex items-center gap-2">
                <Car size={24} />
                <span>Registrar Nuevo Auto</span>
            </h2>
            <div className="divider mt-0 mb-4"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                {/* Fila 1 */}
                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <Tag className="text-primary" size={18} />
                            Marca*
                        </span>
                    </label>
                    <input 
                        type="text" 
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        placeholder="Toyota" 
                        className="input input-bordered w-full input-primary focus:ring-2 focus:ring-primary/30 transition-all" 
                        required 
                    />
                </div>

                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <Type className="text-primary" size={18} />
                            Modelo*
                        </span>
                    </label>
                    <input 
                        type="text" 
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        placeholder="Corolla" 
                        className="input input-bordered w-full input-primary focus:ring-2 focus:ring-primary/30 transition-all" 
                        required 
                    />
                </div>

                {/* Fila 2 */}
                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <Calendar className="text-primary" size={18} />
                            Año*
                        </span>
                    </label>
                    <input 
                        type="number" 
                        name="anio"
                        value={formData.anio || ''}
                        onChange={handleChange}
                        placeholder="2023" 
                        className="input input-bordered w-full input-primary focus:ring-2 focus:ring-primary/30 transition-all" 
                        min="1900"
                        max={new Date().getFullYear() + 1}
                        required 
                    />
                </div>

                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <Gauge className="text-primary" size={18} />
                            Kilometraje
                        </span>
                    </label>
                    <input 
                        type="number" 
                        name="kilometraje"
                        value={formData.kilometraje === null ? '' : formData.kilometraje}
                        onChange={handleChange}
                        placeholder="0" 
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary/30 transition-all" 
                        min="0"
                    />
                </div>

                {/* Fila 3 */}
                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <Palette className="text-primary" size={18} />
                            Color
                        </span>
                    </label>
                    <input 
                        type="text" 
                        name="color"
                        value={formData.color || ''}
                        onChange={handleChange}
                        placeholder="Azul" 
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary/30 transition-all" 
                    />
                </div>

                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <FileText className="text-primary" size={18} />
                            Número de Serie
                        </span>
                    </label>
                    <input 
                        type="text" 
                        name="numero_serie"
                        value={formData.numero_serie || ''}
                        onChange={handleChange}
                        placeholder="XYZ123456789" 
                        className="input input-bordered w-full focus:ring-2 focus:ring-primary/30 transition-all" 
                    />
                </div>

                {/* Fila 4 */}
                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <CheckSquare className="text-primary" size={18} />
                            Estado*
                        </span>
                    </label>
                    <select 
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="select select-bordered w-full focus:ring-2 focus:ring-primary/30 transition-all" 
                        required
                    >
                        <option value="listo">Listo</option>
                        <option value="reparacion">En Reparación</option>
                        <option value="vendido">Vendido</option>
                        <option value="entregado">Entregado</option>
                    </select>
                </div>

                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <CalendarDays className="text-primary" size={18} />
                            Fecha de Ingreso*
                        </span>
                    </label>
                    <input 
                        type="date" 
                        name="fecha_ingreso"
                        value={formData.fecha_ingreso}
                        onChange={handleChange}
                        className="input input-bordered w-full input-primary focus:ring-2 focus:ring-primary/30 transition-all" 
                        required 
                    />
                </div>

                {/* Fila 5 - Precios */}
                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <DollarSign className="text-primary" size={18} />
                            Precio de Compra
                        </span>
                    </label>
                    <div className="input-group">
                        <input 
                            type="number" 
                            name="precio_compra"
                            value={formData.precio_compra === null ? '' : formData.precio_compra}
                            onChange={handleChange}
                            placeholder="350000" 
                            className="input input-bordered w-full focus:ring-2 focus:ring-primary/30 transition-all" 
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium flex items-center gap-2">
                            <DollarSign className="text-primary" size={18} />
                            Precio de Venta
                        </span>
                    </label>
                    <div className="input-group">
                        <input 
                            type="number" 
                            name="precio_venta"
                            value={formData.precio_venta === null ? '' : formData.precio_venta}
                            onChange={handleChange}
                            placeholder="400000" 
                            className="input input-bordered w-full focus:ring-2 focus:ring-primary/30 transition-all" 
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            <div className="divider my-4"></div>

            {/* Observaciones - full width */}
            <div className="form-control">
                <label className="label py-1">
                    <span className="label-text font-medium flex items-center gap-2">
                        <ClipboardList className="text-primary" size={18} />
                        Observaciones
                    </span>
                </label>
                <textarea 
                    name="observaciones"
                    value={formData.observaciones || ''}
                    onChange={handleChange}
                    placeholder="Detalles adicionales..." 
                    className="textarea textarea-bordered w-full h-24 focus:ring-2 focus:ring-primary/30 transition-all" 
                />
            </div>
        </div>
    );
}