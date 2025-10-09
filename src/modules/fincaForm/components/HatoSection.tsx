import React, { useEffect } from 'react';
import type { FormLike } from '../../../shared/types/form-lite';
import type { CreateHatoDto } from '../models/hatoInfoType';

interface HatoFormProps {
  form: FormLike;
  onNext: () => void;
  onPrev: () => void;
}

export function HatoSection({ form }: HatoFormProps) {
  // Cargar lo que exista en el form global
  const hatoDataExistente = (form as any).state?.values?.hatoData;

  const [formValues, setFormValues] = React.useState<CreateHatoDto>(
    hatoDataExistente || {
      idFinca: 0, // el backend lo ignora en la transacción de solicitud
      tipoExplotacion: '',
      totalGanado: 0,
      razaPredominante: '',
      animales: [],
    }
  );

  const [currentAnimal, setCurrentAnimal] = React.useState({
    nombre: '',
    edad: '',
    cantidad: '',
  });

  // Calcular automáticamente el total del hato
  useEffect(() => {
    const total = (formValues.animales || []).reduce((sum: number, animal: any) => {
      return sum + (parseInt(animal.cantidad) || 0);
    }, 0);

    if (total !== formValues.totalGanado) {
      setFormValues((prev) => ({ ...prev, totalGanado: total }));
    }
  }, [formValues.animales]);

  // 🔄 Sincronizar SIEMPRE con el form global (sin necesitar botón/submit local)
  useEffect(() => {
    (form as any).setFieldValue('hatoData', {
      tipoExplotacion: formValues.tipoExplotacion,
      totalGanado: String(formValues.totalGanado), // el hook lo parsea a number
      razaPredominante: formValues.razaPredominante || '',
      animales: formValues.animales || [],
      idFinca: 0,
    });
  }, [formValues, form]);

  const agregarAnimal = () => {
    if (!currentAnimal.nombre || !currentAnimal.edad || !currentAnimal.cantidad) {
      alert('Por favor completa todos los campos del animal');
      return;
    }

    const nuevoAnimal = {
      id: Date.now().toString(),
      nombre: currentAnimal.nombre,
      edad: currentAnimal.edad,
      cantidad: currentAnimal.cantidad,
    };

    setFormValues((prev: any) => ({
      ...prev,
      animales: [...(prev.animales || []), nuevoAnimal],
    }));

    setCurrentAnimal({ nombre: '', edad: '', cantidad: '' });
  };

  const eliminarAnimal = (id: string) => {
    setFormValues((prev: any) => ({
      ...prev,
      animales: (prev.animales || []).filter((a: any) => a.id !== id),
    }));
  };

  return (
    <div className="bg-[#FAF9F5] rounded-xl shadow-md border border-[#DCD6C9] mb-6">
      {/* 🔧 IMPORTANTE: ya no hay <form> aquí dentro */}
      <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-[#708C3E] flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#708C3E]">Descripción del hato ganadero</h3>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
              Tipo de explotación <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formValues.tipoExplotacion}
              onChange={(e) => setFormValues({ ...formValues, tipoExplotacion: e.target.value })}
              placeholder="Intensivo, extensivo o mixto"
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Raza predominante</label>
            <input
              type="text"
              value={formValues.razaPredominante || ''}
              onChange={(e) => setFormValues({ ...formValues, razaPredominante: e.target.value })}
              placeholder="Brahman, Holstein, Criollo, etc."
              className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
          </div>
        </div>

        {/* Agregar animales */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Los números de hembras y machos hacen referencia a la edad en años de los animales.
          </p>

          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Animal</label>
              <input
                type="text"
                value={currentAnimal.nombre}
                onChange={(e) => setCurrentAnimal({ ...currentAnimal, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                placeholder="Ej: Vaca"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Edad</label>
              <input
                type="number"
                value={currentAnimal.edad}
                onChange={(e) => setCurrentAnimal({ ...currentAnimal, edad: e.target.value })}
                className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
                placeholder="Años"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Cantidad</label>
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
        </div>

        {/* Tabla */}
        {Array.isArray(formValues.animales) && formValues.animales.length > 0 && (
          <div className="overflow-x-auto border border-[#CFCFCF] rounded-md">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Animal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Edad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Cantidad</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {formValues.animales.map((animal: any, idx: number) => (
                  <tr key={animal.id || idx} className={idx !== formValues.animales.length - 1 ? "border-b border-[#CFCFCF]" : ""}>
                    <td className="px-4 py-3 text-sm">{animal.nombre}</td>
                    <td className="px-4 py-3 text-sm">{animal.edad}</td>
                    <td className="px-4 py-3 text-sm">{animal.cantidad}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => eliminarAnimal(animal.id)}
                        className="px-3 py-1 border border-[#CFCFCF] rounded text-sm hover:bg-red-50 hover:text-red-600"
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

        {/* Total */}
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">
            Total del hato <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={String(formValues.totalGanado)}
            readOnly
            className="w-full px-3 py-2 border border-[#CFCFCF] rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            placeholder="Se calcula automáticamente"
          />
          <p className="text-xs text-gray-500 mt-1">
            Este valor se calcula automáticamente sumando las cantidades de animales ingresados.
          </p>
        </div>
      </div>
    </div>
  );
}
