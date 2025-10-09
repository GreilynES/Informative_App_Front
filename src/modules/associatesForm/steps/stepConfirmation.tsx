import type { FormLike } from "../../../shared/types/form-lite";
import { TermsAndSubmit } from "../components/TermsAndSubmit";

interface Step5Props {
  form: FormLike;
  onPrev: () => void;
  isSubmitting?: boolean;
}

export function Step5({ form, onPrev, isSubmitting }: Step5Props) {
  return (
    <TermsAndSubmit
      form={form as any}
      isSubmitting={isSubmitting}
      prevStep={onPrev}
    />
  );
}