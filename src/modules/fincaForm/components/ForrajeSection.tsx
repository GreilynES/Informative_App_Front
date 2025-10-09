import React, { useEffect } from 'react';
import type { FormLike } from '../../../shared/types/form-lite';
import type { ForrajeItem } from '../models/forrajeInfoType';

interface ForrajeSectionProps {
  form: FormLike;
}

// Tipo local para el draft (utilizacion obligatoria aquí)
type ForrajeDraft = Omit<ForrajeItem, 'id' | 'idForraje'> & {
  utilizacion: string;
};

export function ForrajeSection({ form }: ForrajeSectionProps) {
  // Cargar lo que haya en el form (si vuelven atrás, etc.)
  const forrajesExistentes = (form as any).state?.values?.forrajes || [];

  const [forrajes, setForrajes] = React.useState<ForrajeItem[]>(forrajesExistentes);
  const [currentForraje, setCurrentForraje] = React.useState<ForrajeDraft>({
    tipoForraje: '',
    variedad: '',
    hectareas: 0,
    utilizacion: '',
  });
  const [error, setError] = React.useState<string | null>(null);

  // 🔄 Sincroniza automáticamente con el form global
  useEffect(() => {
    (form as any).setFieldValue('forrajes', forrajes);
  }, [forrajes, form]);

  const agregarForraje = () => {
    // Validaciones básicas
    if (
      !currentForraje.tipoForraje.trim() ||
      !currentForraje.variedad.trim() ||
      !currentForraje.utilizacion.trim() ||
      currentForraje.hectareas <= 0
    ) {
      setError('Por favor complete todos los campos correctamente (las hectáreas deben ser mayores a 0).');
      return;
    }

    const nuevoForraje: ForrajeItem = {
      id: Date.now(), // ID temporal para la lista
      tipoForraje: currentForraje.tipoForraje.trim(),
      variedad: currentForraje.variedad.trim(),
      hectareas: currentForraje.hectareas,
      utilizacion: currentForraje.utilizacion.trim(),
    };

    const nuevos = [...forrajes, nuevoForraje];
    setForrajes(nuevos);

    // Reset del draft
    setCurrentForraje({
      tipoForraje: '',
      variedad: '',
      hectareas: 0,
      utilizacion: '',
    });

    setError(null);
    console.log('[ForrajeSection] Forraje agregado:', nuevoForraje);
  };

  const eliminarForraje = (id: number | undefined) => {
    if (!id) return;
    const nuevos = forrajes.filter(f => f.id !== id);
    setForrajes(nuevos);
    console.log('[ForrajeSection] Forraje eliminado:', id);
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9] mb-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full border-2 border-[#708C3E] flex items-center justify-center">
          <span className="text-[#708C3E] font-medium">○</span>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">
          Utilización de forraje y suplementación
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {/* Info */}
        <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
          Registra cada tipo de forraje utilizado en la finca. Puedes agregar varios registros.
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Draft de forraje */}
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              value={currentForraje.tipoForraje}
              onChange={(e) => setCurrentForraje({ ...currentForraje, tipoForraje: e.target.value })}
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F]"
            >
              <option value="">Seleccione</option>
              <option value="Pastos mejorados de piso">Pastos mejorados de piso</option>
              <option value="Pasto de corta">Pasto de corta</option>
              <option value="Caña de azúcar">Caña de azúcar</option>
              <option value="Banco de proteína">Banco de proteína</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Variedad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentForraje.variedad}
              onChange={(e) => setCurrentForraje({ ...currentForraje, variedad: e.target.value })}
              placeholder="Ej: Estrella africana, Cuba 22..."
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Hectáreas <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={currentForraje.hectareas || ''}
              onChange={(e) =>
                setCurrentForraje({
                  ...currentForraje,
                  hectareas: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Utilización <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentForraje.utilizacion}
              onChange={(e) => setCurrentForraje({ ...currentForraje, utilizacion: e.target.value })}
              placeholder="Alimentación directa, ensilaje, heno..."
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F]"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={agregarForraje}
              className="flex-1 px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Tabla */}
        {forrajes.length > 0 && (
          <div className="overflow-x-auto border border-[#CFCFCF] rounded-md mt-4">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Variedad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Hectáreas</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Utilización</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {forrajes.map((f, idx) => (
                  <tr
                    key={f.id || idx}
                    className={idx !== forrajes.length - 1 ? 'border-b border-[#CFCFCF]' : ''}
                  >
                    <td className="px-4 py-3 text-sm">{f.tipoForraje}</td>
                    <td className="px-4 py-3 text-sm">{f.variedad}</td>
                    <td className="px-4 py-3 text-sm">{f.hectareas}</td>
                    <td className="px-4 py-3 text-sm">{f.utilizacion}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => eliminarForraje(f.id)}
                        className="px-3 py-1 border border-[#CFCFCF] rounded text-sm text-[#4A4A4A] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
