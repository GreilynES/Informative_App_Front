export type FormLike = {
  Field: any;
  state: any;
  handleSubmit: () => void;
  reset: () => void;
  setFieldValue: any; // relajado para versiones distintas
};

export type FieldLike<T = any> = {
  state: { value: T };
  handleChange: (value: T) => void;
  handleBlur: () => void;
};
