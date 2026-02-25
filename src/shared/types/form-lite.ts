export type FormLike = {
  Field: any;
  state: any;
  handleSubmit: () => void;
  reset: () => void;
  setFieldValue: any; // relajado para versiones distintas
  // TanStack React Form expone useStore para seleccionar parte del estado de forma reactiva
  useStore: <T>(selector: (state: any) => T) => T;
  forceLookup: boolean;
};

export type FieldLike<T = any> = {
  state: { value: T };
  handleChange: (value: T) => void;
  handleBlur: () => void;
};
