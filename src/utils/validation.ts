import { FormField, FormValues } from '../types/form';

export const validateField = (
  field: FormField,
  value: any,
  allValues?: FormValues
): string | null => {
  // Handle derived fields
  if (field.isDerived && field.derivedLogic && allValues) {
    const derivedValue = calculateDerivedValue(field, allValues);
    if (derivedValue !== null && derivedValue !== undefined) {
      return null; // Derived fields don't validate input, they calculate values
    }
  }

  for (const rule of field.validationRules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;
      case 'notEmpty':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;
      case 'minLength':
        if (typeof value === 'string' && value.length < Number(rule.value)) {
          return rule.message;
        }
        break;
      case 'maxLength':
        if (typeof value === 'string' && value.length > Number(rule.value)) {
          return rule.message;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return rule.message;
        }
        break;
      case 'password':
        const passwordRegex = /^(?=.*\d).{8,}$/;
        if (value && !passwordRegex.test(value)) {
          return rule.message;
        }
        break;
    }
  }

  return null;
};

export const calculateDerivedValue = (
  field: FormField,
  allValues: FormValues
): any => {
  if (!field.isDerived || !field.derivedLogic) return null;

  const { parentFields, type, formula } = field.derivedLogic;
  const parentValues = parentFields.map(id => allValues[id]);

  switch (type) {
    case 'sum':
      return parentValues.reduce((sum, val) => sum + (Number(val) || 0), 0);
    case 'difference':
      return parentValues.length >= 2 
        ? (Number(parentValues[0]) || 0) - (Number(parentValues[1]) || 0) 
        : 0;
    case 'age':
      if (parentValues[0]) {
        const birthDate = new Date(parentValues[0]);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1;
        }
        return age;
      }
      return 0;
    case 'custom':
      // Simple formula evaluation (for demo purposes)
      try {
        let expression = formula;
        parentFields.forEach((fieldId, index) => {
          const fieldValue = Number(parentValues[index]) || 0;
          expression = expression.replace(new RegExp(fieldId, 'g'), fieldValue.toString());
        });
        // Basic mathematical operations only for safety
        if (/^[0-9+\-*/(). ]+$/.test(expression)) {
          return eval(expression);
        }
      } catch {
        return 0;
      }
      return 0;
    default:
      return null;
  }
};

export const validateForm = (
  fields: FormField[],
  values: FormValues
): { isValid: boolean; errors: { [fieldId: string]: string } } => {
  const errors: { [fieldId: string]: string } = {};

  fields.forEach(field => {
    const error = validateField(field, values[field.id], values);
    if (error) {
      errors[field.id] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};