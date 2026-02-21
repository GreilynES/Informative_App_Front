import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createHato, createAnimal } from '../services/hatoService';
import type { CreateHatoDto, CreateAnimalDto } from '../models/hatoInfoType';

export function useHatoForm(idFinca: number, onSuccess?: () => void) {
  const [formValues, setFormValues] = useState<
    Omit<CreateHatoDto, 'idFinca' | 'totalGanado' | 'animales'> & { totalGanado: string }
  >({
    tipoExplotacion: '',
    razaPredominante: '',
    totalGanado: '',
  });

  // Estado para animales “en edición” (strings para inputs)
  const [animalsInput, setAnimalsInput] = useState<
    Array<
      Pick<CreateAnimalDto, 'tipoAnimal'> & {
        edadAnios: string;
        cantidad: string;
        _localId: string; // solo para la UI
      }
    >
  >([]);

  const [currentAnimal, setCurrentAnimal] = useState<
    Pick<CreateAnimalDto, 'tipoAnimal'> & { edadAnios: string; cantidad: string }
  >({
    tipoAnimal: '',
    edadAnios: '',
    cantidad: '',
  });

  const hatoMutation = useMutation({
    mutationFn: async () => {
      // 1) Crear Hato (sin forrajes aquí, y sin animales en el payload)
      const total = Number.parseInt(formValues.totalGanado, 10);
      const hatoPayload: CreateHatoDto = {
        idFinca,
        tipoExplotacion: formValues.tipoExplotacion.trim(),
        totalGanado: Number.isFinite(total) ? total : 0,
        ...(formValues.razaPredominante?.trim()
          ? { razaPredominante: formValues.razaPredominante.trim() }
          : {}),
        animales: [], // ← requerido por el tipo, pero enviamos vacío; los creamos luego
      };

      const hato = await createHato(hatoPayload);

      // 2) Crear Animales (si hay)
      if (animalsInput.length > 0) {
        const promises = animalsInput.map((a) => {
          const cant = Number.parseInt(a.cantidad, 10);
          const animalPayload: CreateAnimalDto = {
            idHato: hato.idHato,
            tipoAnimal: a.tipoAnimal.trim(),
            cantidad: Number.isFinite(cant) ? cant : 0,
          };
          return createAnimal(animalPayload);
        });

        await Promise.all(promises);
      }

      return hato;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (_error: any) => {
    },
  });

  // Helpers UI
  const agregarAnimal = () => {
    if (
      !currentAnimal.tipoAnimal.trim() ||
      !currentAnimal.cantidad.trim()
    ) {
      alert('Por favor completa todos los campos del animal');
      return;
    }

    setAnimalsInput((prev) => [
      ...prev,
      {
        _localId: Date.now().toString(),
        tipoAnimal: currentAnimal.tipoAnimal,
        edadAnios: currentAnimal.edadAnios,
        cantidad: currentAnimal.cantidad,
      },
    ]);

    setCurrentAnimal({ tipoAnimal: '', edadAnios: '', cantidad: '' });

    // Si quieres calcular totalGanado automáticamente desde animales:
    const nuevoTotal =
      animalsInput.reduce((acc, a) => acc + (parseInt(a.cantidad, 10) || 0), 0) +
      (parseInt(currentAnimal.cantidad, 10) || 0);

    setFormValues((prev) => ({ ...prev, totalGanado: String(nuevoTotal) }));
  };

  const eliminarAnimal = (localId: string) => {
    setAnimalsInput((prev) => {
      const filtrados = prev.filter((a) => a._localId !== localId);
      const nuevoTotal = filtrados.reduce((acc, a) => acc + (parseInt(a.cantidad, 10) || 0), 0);
      setFormValues((fv) => ({ ...fv, totalGanado: String(nuevoTotal) }));
      return filtrados;
    });
  };

  const handleSubmit = async () => {
    if (!formValues.tipoExplotacion || formValues.totalGanado === '') {
      alert('Por favor completa los campos obligatorios');
      return false;
    }
    try {
      await hatoMutation.mutateAsync();
      return true;
    } catch {
      return false;
    }
  };

  return {
    formValues,
    setFormValues,
    currentAnimal,
    setCurrentAnimal,
    animalsInput,
    setAnimalsInput,
    agregarAnimal,
    eliminarAnimal,
    handleSubmit,
    isLoading: hatoMutation.isPending,
    isSuccess: hatoMutation.isSuccess,
    isError: hatoMutation.isError,
    error: hatoMutation.error,
  };
}
