// src/modules/volunteersForm/components/DisponibilidadAreasSection.tsx

import { Calendar, Target, Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface DisponibilidadAreasProps {
  form?: any;
  formData?: any;
  handleInputChange?: (field: string, value: any) => void;
  tipoSolicitante: 'INDIVIDUAL' | 'ORGANIZACION';
}

export function DisponibilidadAreasSection({
  form,
  handleInputChange,
  tipoSolicitante,
}: DisponibilidadAreasProps) {
  
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState<string[]>([]);
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<string[]>([]);
  const [razonSocial, setRazonSocial] = useState("");
  const [otraArea, setOtraArea] = useState("");

  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const horarios = [
    { label: 'Mañana (8:00 AM - 12:00 PM)', value: 'mañana' },
    { label: 'Tarde (1:00 PM - 4:30 PM)', value: 'tarde' },
    { label: 'Flexible', value: 'flexible' },
  ];
  const areas = [
    'Eventos y actividades',
    'Educación ambiental',
    'Apoyo administrativo',
    'Comunicación y redes sociales',
    'Trabajo de campo/fincas',
    'Capacitación y talleres',
    'Mejora y mantenimiento de Infraestructura',
  ];

  // ✅ Efecto para actualizar el formulario cuando cambian los valores
  useEffect(() => {
    const disponibilidad = {
      fechaInicio,
      fechaFin,
      dias: diasSeleccionados,
      horarios: horariosSeleccionados,
    };

    const areas = areasSeleccionadas.map(area => ({
      nombreArea: area === 'Otro' ? otraArea : area
    })).filter(a => a.nombreArea);

    if (tipoSolicitante === 'ORGANIZACION' && form) {
      // Actualizar TanStack Form
      form.setFieldValue('organizacion.disponibilidades', [disponibilidad]);
      form.setFieldValue('organizacion.areasInteres', areas);
      
      if (razonSocial.trim()) {
        form.setFieldValue('organizacion.razonesSociales', [{ razonSocial }]);
      }
    } else if (tipoSolicitante === 'INDIVIDUAL' && handleInputChange) {
      // Actualizar estado de Individual
      handleInputChange('disponibilidades', [disponibilidad]);
      handleInputChange('areasInteres', areas);
    }
  }, [
    fechaInicio,
    fechaFin,
    diasSeleccionados,
    horariosSeleccionados,
    areasSeleccionadas,
    otraArea,
    razonSocial,
    tipoSolicitante,
    form,
    handleInputChange,
  ]);

  const handleDiaChange = (dia: string) => {
    setDiasSeleccionados(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const handleHorarioChange = (horario: string) => {
    setHorariosSeleccionados(prev => 
      prev.includes(horario) ? prev.filter(h => h !== horario) : [...prev, horario]
    );
  };

  const handleAreaChange = (area: string) => {
    setAreasSeleccionadas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="space-y-6">
      {/* ========== DISPONIBILIDAD ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">
            Disponibilidad
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Fechas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periodo de disponibilidad de inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periodo de disponibilidad fin <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
          </div>

          {/* Días disponibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días disponibles <span className="text-gray-500 text-xs">(checkboxes múltiples)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dias.map(dia => (
                <label key={dia} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={diasSeleccionados.includes(dia)}
                    onChange={() => handleDiaChange(dia)}
                    className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
                  />
                  <span className="text-sm text-gray-700">{dia}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Horario preferido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario preferido <span className="text-gray-500 text-xs">(checkboxes múltiples)</span>
            </label>
            <div className="space-y-2">
              {horarios.map(horario => (
                <label key={horario.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={horariosSeleccionados.includes(horario.value)}
                    onChange={() => handleHorarioChange(horario.value)}
                    className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
                  />
                  <span className="text-sm text-gray-700">{horario.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========== ÁREAS DE INTERÉS ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">
            Áreas de interés
          </h3>
          <span className="text-sm text-gray-500">
            (checkboxes múltiples, requerido al menos 1)
          </span>
        </div>

        <div className="p-6 space-y-3">
          {areas.map(area => (
            <label key={area} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={areasSeleccionadas.includes(area)}
                onChange={() => handleAreaChange(area)}
                className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
              />
              <span className="text-sm text-gray-700">{area}</span>
            </label>
          ))}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={areasSeleccionadas.includes('Otro')}
              onChange={() => handleAreaChange('Otro')}
              className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
            />
            <span className="text-sm text-gray-700">Otro (especificar)</span>
          </label>

          {areasSeleccionadas.includes('Otro') && (
            <div className="ml-6 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Si seleccionó "Otro", especifique <span className="text-gray-500 text-xs">(text, condicional)</span>
              </label>
              <input
                type="text"
                value={otraArea}
                onChange={(e) => setOtraArea(e.target.value)}
                placeholder="Especifique el área de interés"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
            </div>
          )}
        </div>
      </div>

      {/* ========== RAZÓN SOCIAL (Solo para Organización) ========== */}
      {tipoSolicitante === 'ORGANIZACION' && (
        <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#708C3E]">
              Razón Social / Objetivos
            </h3>
          </div>

          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describa los objetivos o razón social de su organización
            </label>
            <textarea
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              rows={4}
              placeholder="Ej: Promover la conservación del medio ambiente mediante educación y participación comunitaria..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
            />
          </div>
        </div>
      )}
    </div>
  );
}