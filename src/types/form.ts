export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty';
  value?: string | number;
  message: string;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface DerivedFieldLogic {
  parentFields: string[];
  formula: string; // Simple formula like "field1 + field2" or custom logic
  type: 'sum' | 'difference' | 'age' | 'custom';
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue: string | number | boolean | Date | null;
  validationRules: ValidationRule[];
  options?: FieldOption[]; // For select/radio fields
  isDerived: boolean;
  derivedLogic?: DerivedFieldLogic;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: Date;
}

export interface FormBuilderState {
  currentForm: {
    name: string;
    fields: FormField[];
  };
  savedForms: FormSchema[];
  isPreviewMode: boolean;
}

export interface FormValues {
  [fieldId: string]: any;
}

export interface FieldError {
  fieldId: string;
  message: string;
}