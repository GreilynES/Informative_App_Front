import React, { useEffect } from 'react';
import { useHatoForm } from '../hooks/useHato';

interface HatoFormProps {
  idFinca: number;
  onNext: () => void;
  onPrev: () => void;
}

export function HatoForm({ idFinca, onNext, onPrev }: HatoFormProps) {
  const {
    formValues,
    setFormValues,
    currentAnimal,
    setCurrentAnimal,
    agregarAnimal,
    eliminarAnimal,
    handleSubmit,
    isLoading,
  } = useHatoForm(idFinca, () => {}); // No auto-navegar al guardar

  // Calcular automáticamente el total del hato
  useEffect(() => {
    const total = formValues.animales.reduce((sum, animal) => {
      return sum + (parseInt(animal.cantidad) || 0);
    }, 0);
    
    if (total.toString() !== formValues.totalGanado) {
      setFormValues({ ...formValues, totalGanado: total.toString() });
    }
  }, [formValues.animales]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9] mb-6">
      <form onSubmit={onSubmit}>
        {/* Título */}
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#708C3E] flex items-center justify-center">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-[#708C3E]">
            Descripción del hato ganadero
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Campos principales en dos columnas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Tipo de explotación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formValues.tipoExplotacion}
                onChange={(e) => setFormValues({ ...formValues, tipoExplotacion: e.target.value })}
                placeholder="Indica el sistema productivo usado (intensivo, extensivo o mixto)."
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Raza predominante
              </label>
              <input
                type="text"
                value={formValues.razaPredominante}
                onChange={(e) => setFormValues({ ...formValues, razaPredominante: e.target.value })}
                placeholder="La raza de ganado más común en tu hato, por ejemplo, Brahman, Holstein, Criollo, etc."
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
          </div>

          {/* Campos para agregar animal */}
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Animal
              </label>
              <input
                type="text"
                value={currentAnimal.nombre}
                onChange={(e) => setCurrentAnimal({ ...currentAnimal, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                placeholder="Ej: Vaca"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Edad
              </label>
              <input
                type="number"
                value={currentAnimal.edad}
                onChange={(e) => setCurrentAnimal({ ...currentAnimal, edad: e.target.value })}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                placeholder="Edad en años"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={currentAnimal.cantidad}
                onChange={(e) => setCurrentAnimal({ ...currentAnimal, cantidad: e.target.value })}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                placeholder="Cantidad"
                min="1"
              />
            </div>

            <button
              type="button"
              onClick={agregarAnimal}
              className="px-4 py-2 bg-white border border-[#CFCFCF] rounded-md text-[#4A4A4A] hover:bg-gray-50 hover:border-[#708C3E] transition-colors"
            >
              Agregar
            </button>
          </div>

          {/* Tabla de animales */}
          {formValues.animales.length > 0 && (
            <div className="overflow-x-auto border border-[#CFCFCF] rounded-md">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#4A4A4A] border-b border-[#CFCFCF]">
                      Animal
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#4A4A4A] border-b border-[#CFCFCF]">
                      Edad
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[#4A4A4A] border-b border-[#CFCFCF]">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-[#4A4A4A] border-b border-[#CFCFCF]">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {formValues.animales.map((animal, idx) => (
                    <tr key={animal.id} className={idx !== formValues.animales.length - 1 ? "border-b border-[#CFCFCF]" : ""}>
                      <td className="px-4 py-3 text-sm text-[#4A4A4A]">{animal.nombre}</td>
                      <td className="px-4 py-3 text-sm text-[#4A4A4A]">{animal.edad}</td>
                      <td className="px-4 py-3 text-sm text-[#4A4A4A]">{animal.cantidad}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => eliminarAnimal(animal.id)}
                          className="px-3 py-1 border border-[#CFCFCF] rounded text-sm text-[#4A4A4A] hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
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

          {/* Total del hato - CALCULADO AUTOMÁTICAMENTE */}
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Total del hato <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formValues.totalGanado}
              readOnly
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm bg-gray-100 text-gray-600 cursor-not-allowed"
              placeholder="Se calcula automáticamente"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este valor se calcula automáticamente sumando las cantidades de animales ingresados
            </p>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="px-6 py-4 border-t border-[#DCD6C9] flex justify-between">
          <button
            type="button"
            onClick={onPrev}
            disabled={isLoading}
            className="px-4 py-2 rounded border border-[#CFCFCF] text-[#4A4A4A] hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={isLoading}
            className="px-6 py-2 rounded bg-[#708C3E] text-white shadow hover:bg-[#5a7132] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Guardando...' : 'Siguiente'}
          </button>
        </div>
      </form>
    </div>
  );
}