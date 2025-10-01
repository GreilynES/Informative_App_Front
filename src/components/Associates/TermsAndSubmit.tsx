import type { FormLike, FieldLike } from "../../types/form-lite";

export function TermsAndSubmit({
  form,
  isSubmitting,
  prevStep,
}: {
  form: FormLike;
  isSubmitting?: boolean;
  prevStep: () => void;
}) {
  const err =
    form.state?.errors?.acceptTerms || form.state?.meta?.errors?.acceptTerms?.[0]?.message;

  return (
    <div className="bg-[#FAF9F5] border border-[#DCD6C9] rounded-xl p-6 shadow-md mb-8">
      <h2 className="text-3xl font-bold text-[#708C3E] text-center">Confirmación de Solicitud</h2>

      <div className="space-y-6 text-[#4A4A4A] mt-6">
        <form.Field name="acceptTerms">
          {(f: FieldLike<boolean>) => (
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={!!f.state.value}
                onChange={(e) => f.handleChange(e.target.checked)}
                onBlur={f.handleBlur}
                className="mt-1"
              />
              <span className="text-sm">
                Confirmo que he leído y acepto los términos y el aviso de privacidad.
              </span>
            </label>
          )}
        </form.Field>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 rounded border border-[#DCD6C9] text-[#4A4A4A]"
        >
          Volver
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded bg-[#708C3E] text-white shadow hover:opacity-95 disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Enviar solicitud"}
        </button>
      </div>
    </div>
  );
}
