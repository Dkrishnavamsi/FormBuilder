import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormBuilderState, FormField, FormSchema } from '../types/form';

const loadSavedForms = (): FormSchema[] => {
  try {
    const saved = localStorage.getItem('formBuilder_savedForms');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveForms = (forms: FormSchema[]) => {
  localStorage.setItem('formBuilder_savedForms', JSON.stringify(forms));
};

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    fields: [],
  },
  savedForms: loadSavedForms(),
  isPreviewMode: false,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormName: (state, action: PayloadAction<string>) => {
      state.currentForm.name = action.payload;
    },
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: `field_${Date.now()}_${Math.random()}`,
        order: state.currentForm.fields.length,
      };
      state.currentForm.fields.push(newField);
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      const { id, updates } = action.payload;
      const field = state.currentForm.fields.find(f => f.id === id);
      if (field) {
        Object.assign(field, updates);
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
      // Reorder remaining fields
      state.currentForm.fields.forEach((field, index) => {
        field.order = index;
      });
    },
    reorderFields: (state, action: PayloadAction<FormField[]>) => {
      state.currentForm.fields = action.payload.map((field, index) => ({
        ...field,
        order: index,
      }));
    },
    saveForm: (state) => {
      const newForm: FormSchema = {
        id: `form_${Date.now()}`,
        name: state.currentForm.name || `Form ${state.savedForms.length + 1}`,
        fields: [...state.currentForm.fields],
        createdAt: new Date(),
      };
      state.savedForms.push(newForm);
      saveForms(state.savedForms);
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = {
          name: form.name,
          fields: [...form.fields],
        };
      }
    },
    clearCurrentForm: (state) => {
      state.currentForm = {
        name: '',
        fields: [],
      };
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.isPreviewMode = action.payload;
    },
  },
});

export const {
  setFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadForm,
  clearCurrentForm,
  setPreviewMode,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;