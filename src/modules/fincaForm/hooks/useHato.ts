import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createHato, createAnimal} from '../services/hatoService';
import type { CreateHatoDto, CreateAnimalDto } from '../models/hatoInfoType';

interface AnimalForm {
  id: string;
  nombre: string;
  edad: string;
  cantidad: string;
}

interface HatoFormValues {
  tipoExplotacion: string;
  totalGanado: string;
  razaPredominante: string;
  animales: AnimalForm[];
}

export function useHatoForm(idFinca: number, onSuccess?: () => void) {
  const [formValues, setFormValues] = useState<HatoFormValues>({
    tipoExplotacion: '',
    totalGanado: '',
    razaPredominante: '',
    animales: [],
  });

  const [currentAnimal, setCurrentAnimal] = useState({
    nombre: '',
    edad: '',
    cantidad: '',
  });

  // Mutación para crear el hato
  const hatoMutation = useMutation({
    mutationFn: async (values: HatoFormValues) => {
      console.log("[Hook] Creando hato para finca:", idFinca);
      
      const hatoPayload: CreateHatoDto = {
        idFinca,
        tipoExplotacion: values.tipoExplotacion,
        totalGanado: parseInt(values.totalGanado),
        ...(values.razaPredominante && { razaPredominante: values.razaPredominante }),
      };

      const hato = await createHato(hatoPayload);
      console.log("[Hook] Hato creado con ID:", hato.idHato);

      // Crear los animales si hay
      if (values.animales.length > 0) {
        console.log("[Hook] Creando", values.animales.length, "animales...");
        
        const animalPromises = values.animales.map((animal) => {
          const animalPayload: CreateAnimalDto = {
            idHato: hato.idHato,
            tipoAnimal: animal.nombre,
            edadAnios: parseInt(animal.edad),
            cantidad: parseInt(animal.cantidad),
          };
          return createAnimal(animalPayload);
        });

        await Promise.all(animalPromises);
        console.log("[Hook] ✅ Todos los animales creados");
      }

      return hato;
    },
    onSuccess: () => {
      console.log("[Hook] ✅ Proceso completado exitosamente");
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("[Hook] ❌ Error en el proceso:", error);
    },
  });

  const agregarAnimal = () => {
    if (!currentAnimal.nombre || !currentAnimal.edad || !currentAnimal.cantidad) {
      alert('Por favor completa todos los campos del animal');
      return;
    }

    const nuevoAnimal: AnimalForm = {
      id: Date.now().toString(),
      nombre: currentAnimal.nombre,
      edad: currentAnimal.edad,
      cantidad: currentAnimal.cantidad,
    };

    setFormValues({
      ...formValues,
      animales: [...formValues.animales, nuevoAnimal],
    });

    setCurrentAnimal({ nombre: '', edad: '', cantidad: '' });
  };

  const eliminarAnimal = (id: string) => {
    setFormValues({
      ...formValues,
      animales: formValues.animales.filter(a => a.id !== id),
    });
  };

  const handleSubmit = async () => {
    if (!formValues.tipoExplotacion || !formValues.totalGanado) {
      alert('Por favor completa los campos obligatorios');
      return false;
    }

    try {
      await hatoMutation.mutateAsync(formValues);
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    formValues,
    setFormValues,
    currentAnimal,
    setCurrentAnimal,
    agregarAnimal,
    eliminarAnimal,
    handleSubmit,
    isLoading: hatoMutation.isPending,
    isSuccess: hatoMutation.isSuccess,
    isError: hatoMutation.isError,
    error: hatoMutation.error,
  };
}
