import type { FormLike } from "../../../shared/types/form-lite";
import { ZodError } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { associateApplySchema } from "../schemas/associateApply";
import { Step1 } from "../steps/stepPersonalInformation";
import { Step2 } from "../steps/stepFincaGeoPropi";
import { Step3 } from "../steps/stepForrajeRegisto";

import { Step6 } from "../steps/stepDocumentsUpload";
import { Step7 } from "../steps/stepConfirmation";
import { Step4 } from "../steps/stepActividadessCaracteristicas";
import { Step5 } from "../steps/stepAccessoComercializacion";

interface StepsProps {
  step: number;
  form: FormLike;
  lookup: (id: string) => Promise<any>;
  nextStep: () => void;
  prevStep: () => void;
  isSubmitting?: boolean;
}

export function Steps({ step, form, lookup, nextStep, prevStep, isSubmitting }: StepsProps) {
  const [, bump] = useState(0);

  
  const formTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const anyForm = form as any;
    if (typeof anyForm?.subscribe === "function") {
      const unsub = anyForm.subscribe(() => bump((x) => x + 1));
      return () => { try { unsub && unsub(); } catch {} };
    }
  }, [form]);

  useEffect(() => {
    const anyForm = form as any;
    if (typeof anyForm?.subscribe === "function") return;
    const id = setInterval(() => bump((x) => x + 1), 250);
    return () => clearInterval(id);
  }, [form]);

  const getValues = () => {
    const anyForm = form as any;
    if (anyForm?.state?.values && typeof anyForm.state.values === "object") return anyForm.state.values;
    if (anyForm?.values && typeof anyForm.values === "object") return anyForm.values;
    if (typeof anyForm?.getValues === "function") {
      const v = anyForm.getValues();
      if (v && typeof v === "object") return v;
    }
    if (typeof anyForm?.getState === "function") {
      const st = anyForm.getState?.();
      if (st?.values && typeof st.values === "object") return st.values;
    }
    return {} as Record<string, any>;
  };

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema = (associateApplySchema as any)?.shape?.[name];
      if (fieldSchema) fieldSchema.parse(value);
      return undefined;
    } catch (error) {
      if (error instanceof ZodError) {
        return error.issues[0]?.message || "Error de validación";
      }
      return "Error de validación";
    }
  };

  const checkStepValidity = (values: any) => {
    switch (step) {
      case 1: {
        const vive = (values.viveEnFinca ?? true) as boolean;

        const distanciaOk = vive
          ? true
          : (() => {
              const raw = values.distanciaFinca;
              const txt = raw == null ? "" : String(raw).trim();
              if (!txt) return false;
              const n = Number(txt.replace(",", "."));
              return Number.isFinite(n) && n > 0;
            })();

        const baseOk =
          (values.cedula?.length ?? 0) >= 8 &&
          (values.nombre?.length ?? 0) >= 1 &&
          (values.apellido1?.length ?? 0) >= 1 &&
          (values.apellido2?.length ?? 0) >= 1 &&
          !!values.fechaNacimiento &&
          (values.telefono?.length ?? 0) >= 8 &&
          !!values.email &&
          (values.marcaGanado?.length ?? 0) >= 1 &&
          (values.CVO?.length ?? 0) >= 1;

        if (!baseOk || !distanciaOk) return false;

        const toValidate: Array<[string, any]> = [
          ["cedula", values.cedula],
          ["nombre", values.nombre],
          ["apellido1", values.apellido1],
          ["apellido2", values.apellido2],
          ["fechaNacimiento", values.fechaNacimiento],
          ["telefono", values.telefono],
          ["email", values.email],
          ["marcaGanado", values.marcaGanado],
          ["CVO", values.CVO],
        ];
        if (!vive) toValidate.push(["distanciaFinca", values.distanciaFinca]);

        const anyError = toValidate.some(([n, v]) => !!validateField(n, v));
        return !anyError;
      }

      case 2: {
        const areaOk =
          values.areaHa !== null && values.areaHa !== undefined && String(values.areaHa).trim() !== "";

        const fincaValid =
          (values.nombreFinca?.length ?? 0) >= 1 &&
          areaOk &&
          (values.numeroPlano?.length ?? 0) >= 1;

        const geografiaValid =
          (values.provincia?.length ?? 0) >= 1 &&
          (values.canton?.length ?? 0) >= 1 &&
          (values.distrito?.length ?? 0) >= 1;

        let propietarioValid = true;
        if (values.esPropietario === false) {
          propietarioValid = !!(
            (values.propietarioCedula?.length ?? 0) >= 8 &&
            (values.propietarioNombre?.length ?? 0) >= 1 &&
            (values.propietarioApellido1?.length ?? 0) >= 1 &&
            (values.propietarioApellido2?.length ?? 0) >= 1 &&
            (values.propietarioTelefono?.length ?? 0) >= 8 &&
            (values.propietarioEmail?.length ?? 0) >= 1 &&
            !!values.propietarioFechaNacimiento
          );
        }
        return fincaValid && geografiaValid && propietarioValid;
      }

      case 3: {
        const hasForrajes = Array.isArray(values.forrajes) && values.forrajes.length > 0;
        const hasRegistros = values.registrosProductivos != null;
        return hasForrajes && hasRegistros;
      }

      case 4:
      case 5:
        return true;

      case 6: {
        const docsOk =
          values.idCopy !== null && values.idCopy !== undefined &&
          values.farmMap !== null && values.farmMap !== undefined;
        return docsOk;
      }

      case 7:
        return !!values.acceptTerms;

      default:
        return false;
    }
  };

  const values = getValues();

  const fingerprint = useMemo(() => {
    try {
      return JSON.stringify(values, (_k, v) => {
        if (v instanceof File) return { __file: true, name: v.name, size: v.size, type: v.type };
        if (v instanceof Date) return v.toISOString();
        if (typeof v === "function") return undefined;
        return v;
      });
    } catch {
      return String(Date.now());
    }
  }, [values]);

  const canProceed = useMemo(() => checkStepValidity(values), [step, fingerprint]);

  
  const scrollToFormTop = () => {
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  };

  const goNext = () => {
    nextStep();
    requestAnimationFrame(scrollToFormTop);
  };

  const goPrev = () => {
    prevStep();
    requestAnimationFrame(scrollToFormTop);
  };
 

  return (
    <div ref={formTopRef} className="scroll-mt-[120px]">
      {step === 1 && (
        <Step1
          form={form}
          lookup={lookup}
          onNext={goNext}            
          canProceed={canProceed}
        />
      )}

      {step === 2 && (
        <Step2
          form={form}
          onNext={goNext}            
          onPrev={goPrev}            
          canProceed={canProceed}
        />
      )}

      {step === 3 && (
        <Step3
          form={form}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {step === 4 && (
        <Step4
          form={form}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {step === 5 && (
        <Step5
          form={form}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}

      {step === 6 && (
        <Step6
          form={form}
          onPrev={goPrev}
          onNext={goNext}
          canProceed={canProceed}
        />
      )}

      {step === 7 && (
        <Step7
          form={form}
          onPrev={goPrev}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
