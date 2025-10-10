import type { FormLike } from "../../../shared/types/form-lite";
import { TermsAndSubmit } from "../components/TermsAndSubmit";

interface Step6Props {
  form: FormLike;
  onPrev: () => void;
  isSubmitting?: boolean;
}

export function Step6({ form, onPrev, isSubmitting }: Step6Props) {
  return (
    <TermsAndSubmit
      form={form as any}
      isSubmitting={isSubmitting}
      prevStep={onPrev}
    />
  );
}