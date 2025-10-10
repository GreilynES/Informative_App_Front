import type { FormLike } from "../../../shared/types/form-lite";
import { TermsAndSubmit } from "../components/TermsAndSubmit";

interface Step7Props {
  form: FormLike;
  onPrev: () => void;
  isSubmitting?: boolean;
}

export function Step7({ form, onPrev, isSubmitting }: Step7Props) {
  return (
    <TermsAndSubmit
      form={form as any}
      isSubmitting={isSubmitting}
      prevStep={onPrev}
    />
  );
}