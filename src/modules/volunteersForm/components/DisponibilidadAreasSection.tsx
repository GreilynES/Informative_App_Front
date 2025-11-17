import { Calendar, Target, Heart } from "lucide-react";
import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import { z } from "zod";
import { volunteerOrganizacionSchema } from "../schemas/volunteerSchema";

interface DisponibilidadAreasProps {
  form?: any;
  formData?: any;
  handleInputChange?: (field: string, value: any) => void;
  tipoSolicitante: "INDIVIDUAL" | "ORGANIZACION";
}

export type DisponibilidadAreasSectionHandle = {

  validateAndShowErrors: () => boolean;

  isValid: () => boolean;

  clearErrors: () => void;
};

export const DisponibilidadAreasSection = forwardRef<
  DisponibilidadAreasSectionHandle,
  DisponibilidadAreasProps
>(function DisponibilidadAreasSection(
  { form, handleInputChange, tipoSolicitante }: DisponibilidadAreasProps,
  ref
) {
  // ── Estado original (sin cambios de intención)
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState<string[]>([]);
  const [areasSeleccionadas, setAreasSeleccionadas] = useState<string[]>([]);
  const [razonSocial, setRazonSocial] = useState("");
  const [otraArea, setOtraArea] = useState("");

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const horarios = [
    { label: "Mañana (8:00 AM - 12:00 PM)", value: "mañana" },
    { label: "Tarde (1:00 PM - 4:30 PM)", value: "tarde" },
    { label: "Flexible", value: "flexible" },
  ];
  const areas = [
    "Eventos y actividades",
    "Educación ambiental",
    "Apoyo administrativo",
    "Comunicación y redes sociales",
    "Trabajo de campo/fincas",
    "Capacitación y talleres",
    "Mejora y mantenimiento de Infraestructura",
  ];

  // Hoy (YYYY-MM-DD) para min en <input type="date">
  const today = useMemo(() => {
    const t = new Date();
    const mm = String(t.getMonth() + 1).padStart(2, "0");
    const dd = String(t.getDate()).padStart(2, "0");
    return `${t.getFullYear()}-${mm}-${dd}`;
  }, []);

  // Errores UI mostrados bajo los campos
  const [errors, setErrors] = useState<{
    fechaInicio?: string;
    fechaFin?: string;
    dias?: string;
    horarios?: string;
    areasInteres?: string;
  }>({});

  
  const [showErrors, setShowErrors] = useState(false);

  
  const orgShape = volunteerOrganizacionSchema.shape.organizacion.shape;

  const disponibilidadArraySchema =
    (orgShape.disponibilidades as z.ZodOptional<any>).unwrap?.() ?? orgShape.disponibilidades;
  const disponibilidadItemSchema: z.ZodTypeAny = (disponibilidadArraySchema as z.ZodArray<any>)
    .element;

  const areasInteresArraySchema =
    (orgShape.areasInteres as z.ZodOptional<any>).unwrap?.() ?? orgShape.areasInteres;

  // Helpers de validación → generan mensajes (sin mostrarlos todavía)
  const buildDisponibilidadPayload = () => ({
    fechaInicio,
    fechaFin,
    dias: diasSeleccionados,
    horarios: horariosSeleccionados,
  });

  const buildAreasPayload = () =>
    areasSeleccionadas
      .map((area) => ({ nombreArea: area === "Otro" ? otraArea : area }))
      .filter((a) => a.nombreArea);

  const getDisponibilidadErrors = (payload: {
    fechaInicio: string;
    fechaFin: string;
    dias: string[];
    horarios: string[];
  }) => {
    const res = disponibilidadItemSchema.safeParse(payload);
    const base = { fechaInicio: "", fechaFin: "", dias: "", horarios: "" };

    if (!res.success) {
      for (const issue of res.error.issues) {
        const key = (issue.path[0] as string) || "";
        if (key === "fechaInicio") base.fechaInicio = issue.message;
        if (key === "fechaFin") base.fechaFin = issue.message;
        if (key === "dias") base.dias = issue.message;
        if (key === "horarios") base.horarios = issue.message;
      }
    }
    return base;
  };

  const getAreasErrors = (list: { nombreArea: string }[]) => {
    const res = (areasInteresArraySchema as z.ZodArray<any>).safeParse(list);
    return { areasInteres: res.success ? "" : res.error.issues[0]?.message || "Seleccione al menos un área de interés" };
  };

  const isEmptyErrors = (e: typeof errors) =>
    !e.fechaInicio && !e.fechaFin && !e.dias && !e.horarios && !e.areasInteres;

  useImperativeHandle(ref, () => ({
    validateAndShowErrors: () => {
      const disp = buildDisponibilidadPayload();
      const areas = buildAreasPayload();
      const e1 = getDisponibilidadErrors(disp);
      const e2 = getAreasErrors(areas);
      const merged = { ...e1, ...e2 };
      setErrors(merged);
      setShowErrors(true);
      return isEmptyErrors(merged);
    },
    isValid: () => {
      const disp = buildDisponibilidadPayload();
      const areas = buildAreasPayload();
      const merged = { ...getDisponibilidadErrors(disp), ...getAreasErrors(areas) };
      return isEmptyErrors(merged);
    },
    clearErrors: () => {
      setShowErrors(false);
      setErrors({});
    },
  }));

  
  useEffect(() => {
    const disponibilidad = buildDisponibilidadPayload();
    const areasPayload = buildAreasPayload();

    if (tipoSolicitante === "ORGANIZACION" && form) {
      form.setFieldValue("organizacion.disponibilidades", [disponibilidad]);
      form.setFieldValue("organizacion.areasInteres", areasPayload);
      if (razonSocial.trim()) {
        form.setFieldValue("organizacion.razonesSociales", [{ razonSocial }]);
      }
    } else if (tipoSolicitante === "INDIVIDUAL" && handleInputChange) {
      handleInputChange("disponibilidades", [disponibilidad]);
      handleInputChange("areasInteres", areasPayload);
    }

  
    if (showErrors) {
      const e1 = getDisponibilidadErrors(disponibilidad);
      const e2 = getAreasErrors(areasPayload);
      setErrors({ ...e1, ...e2 });
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
    showErrors,
  ]);

  // Handlers originales
  const handleDiaChange = (dia: string) => {
    setDiasSeleccionados((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleHorarioChange = (horario: string) => {
    setHorariosSeleccionados((prev) =>
      prev.includes(horario) ? prev.filter((h) => h !== horario) : [...prev, horario]
    );
  };

  const handleAreaChange = (area: string) => {
    setAreasSeleccionadas((prev) => (prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]));
  };

  // fechaFin no puede ser antes de hoy ni de fechaInicio
  const minFechaFin = fechaInicio && fechaInicio > today ? fechaInicio : today;

  return (
    <div className="space-y-6">
      {/* ========== DISPONIBILIDAD ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Disponibilidad</h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Fechas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periodo de disponibilidad de inicio *
              </label>
              <input
                type="date"
                value={fechaInicio}
                min={today}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
              {showErrors && errors.fechaInicio && (
                <p className="text-sm text-red-600 mt-1">{errors.fechaInicio}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periodo de disponibilidad fin *
              </label>
              <input
                type="date"
                value={fechaFin}
                min={minFechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#6F8C1F] focus:border-[#6F8C1F]"
              />
              {showErrors && errors.fechaFin && (
                <p className="text-sm text-red-600 mt-1">{errors.fechaFin}</p>
              )}
            </div>
          </div>

          {/* Días disponibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días disponibles <span className="text-gray-500 text-xs">(checkboxes múltiples)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dias.map((dia) => (
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
            {showErrors && errors.dias && <p className="text-sm text-red-600 mt-1">{errors.dias}</p>}
          </div>

          {/* Horario preferido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario preferido <span className="text-gray-500 text-xs">(checkboxes múltiples)</span>
            </label>
            <div className="space-y-2">
              {horarios.map((horario) => (
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
            {showErrors && errors.horarios && (
              <p className="text-sm text-red-600 mt-1">{errors.horarios}</p>
            )}
          </div>
        </div>
      </div>

      {/* ========== ÁREAS DE INTERÉS ========== */}
      <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
        <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
          <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-[#708C3E]">Áreas de interés</h3>
          <span className="text-sm text-gray-500">(checkboxes múltiples, requerido al menos 1)</span>
        </div>

        <div className="p-6 space-y-3">
          {areas.map((area) => (
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
              checked={areasSeleccionadas.includes("Otro")}
              onChange={() => handleAreaChange("Otro")}
              className="rounded border-gray-300 text-[#708C3E] focus:ring-[#6F8C1F]"
            />
            <span className="text-sm text-gray-700">Otro (especificar)</span>
          </label>

          {areasSeleccionadas.includes("Otro") && (
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

          {showErrors && errors.areasInteres && (
            <p className="text-sm text-red-600 mt-1">{errors.areasInteres}</p>
          )}
        </div>
      </div>

      {/* ========== RAZÓN SOCIAL (Solo para Organización) ========== */}
      {tipoSolicitante === "ORGANIZACION" && (
        <div className="bg-white rounded-xl shadow-md border border-[#DCD6C9]">
          <div className="px-6 py-4 border-b border-[#DCD6C9] flex items-center gap-3">
            <div className="w-8 h-8 bg-[#708C3E] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#708C3E]">Razón Social / Objetivos</h3>
          </div>

          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describa los objetivos o razón social de su organización *
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
});
