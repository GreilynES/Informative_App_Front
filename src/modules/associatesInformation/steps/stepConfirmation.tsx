import type { FormLike } from "../../../shared/types/form-lite";
import { TermsAndSubmit } from "../../associatesForm/components/TermsAndSubmit";

interface Step4Props {
  form: FormLike;
  onPrev: () => void;
  isSubmitting?: boolean;
}

export function Step4({ form, onPrev, isSubmitting }: Step4Props) {
  return (
    <TermsAndSubmit
      form={form as any}
      isSubmitting={isSubmitting}
      prevStep={onPrev}
    />
  );
}