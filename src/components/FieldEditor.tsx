import React, { useState } from 'react';
import {
  Paper,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  ExpandMore,
  Delete,
  DragIndicator,
  Add,
  Settings,
} from '@mui/icons-material';
import { FormField, ValidationRule} from '../types/form';
import { useAppSelector } from '../hooks/redux';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onDelete,
  dragHandleProps,
}) => {
  const [optionsDialogOpen, setOptionsDialogOpen] = useState(false);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [derivedDialogOpen, setDerivedDialogOpen] = useState(false);
  const [newOption, setNewOption] = useState({ label: '', value: '' });
  const [newValidation, setNewValidation] = useState<ValidationRule>({
    type: 'required',
    message: '',
  });

  const { currentForm } = useAppSelector(state => state.formBuilder);
  const availableFields = currentForm.fields.filter(f => f.id !== field.id && !f.isDerived);

  const fieldTypeLabels = {
    text: 'Text Input',
    number: 'Number Input',
    textarea: 'Textarea',
    select: 'Select Dropdown',
    radio: 'Radio Buttons',
    checkbox: 'Checkbox',
    date: 'Date Picker',
  };

  const validationTypeLabels = {
    required: 'Required',
    notEmpty: 'Not Empty',
    minLength: 'Minimum Length',
    maxLength: 'Maximum Length',
    email: 'Email Format',
    password: 'Password Rules',
  };

  const handleAddOption = () => {
    if (newOption.label && newOption.value) {
      const currentOptions = field.options || [];
      onUpdate({
        options: [...currentOptions, { ...newOption }],
      });
      setNewOption({ label: '', value: '' });
    }
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = field.options || [];
    onUpdate({
      options: currentOptions.filter((_, i) => i !== index),
    });
  };

  const handleAddValidation = () => {
    if (newValidation.message) {
      onUpdate({
        validationRules: [...field.validationRules, { ...newValidation }],
      });
      setNewValidation({ type: 'required', message: '' });
      setValidationDialogOpen(false);
    }
  };

  const handleRemoveValidation = (index: number) => {
    onUpdate({
      validationRules: field.validationRules.filter((_, i) => i !== index),
    });
  };

  const handleDerivedToggle = (isDerived: boolean) => {
    onUpdate({
      isDerived,
      derivedLogic: isDerived ? {
        parentFields: [],
        formula: '',
        type: 'sum',
      } : undefined,
    });
  };

  const needsOptions = ['select', 'radio'].includes(field.type);

  return (
    <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden' }}>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
            },
          }}
        >
          <Box {...dragHandleProps} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <DragIndicator />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              {field.label || 'Untitled Field'} 
              <Chip 
                label={fieldTypeLabels[field.type]} 
                size="small" 
                sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)' }} 
              />
              {field.isDerived && (
                <Chip 
                  label="Derived" 
                  size="small" 
                  sx={{ ml: 1, bgcolor: 'rgba(255,255,255,0.3)' }} 
                />
              )}
            </Typography>
          </Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{ color: 'white' }}
          >
            <Delete />
          </IconButton>
        </AccordionSummary>
        
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Field Label"
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={field.required}
                    onChange={(e) => onUpdate({ required: e.target.checked })}
                  />
                }
                label="Required"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={field.isDerived}
                    onChange={(e) => handleDerivedToggle(e.target.checked)}
                  />
                }
                label="Derived Field"
              />
            </Box>

            {!field.isDerived && (
              <TextField
                label="Default Value"
                value={field.defaultValue || ''}
                onChange={(e) => onUpdate({ defaultValue: e.target.value })}
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                fullWidth
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
              />
            )}

            <Divider />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {needsOptions && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Settings />}
                  onClick={() => setOptionsDialogOpen(true)}
                >
                  Options ({field.options?.length || 0})
                </Button>
              )}

              <Button
                variant="outlined"
                size="small"
                startIcon={<Settings />}
                onClick={() => setValidationDialogOpen(true)}
              >
                Validation ({field.validationRules.length})
              </Button>

              {field.isDerived && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Settings />}
                  onClick={() => setDerivedDialogOpen(true)}
                >
                  Derived Logic
                </Button>
              )}
            </Box>

            {field.validationRules.map((rule, index) => (
              <Chip
                key={index}
                label={`${validationTypeLabels[rule.type]}: ${rule.message}`}
                onDelete={() => handleRemoveValidation(index)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Options Dialog */}
      <Dialog open={optionsDialogOpen} onClose={() => setOptionsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Configure Options</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Option Label"
                value={newOption.label}
                onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                fullWidth
              />
              <TextField
                label="Option Value"
                value={newOption.value}
                onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                fullWidth
              />
              <Button onClick={handleAddOption} variant="contained">
                <Add />
              </Button>
            </Box>
            
            {field.options?.map((option, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField value={option.label} disabled fullWidth />
                <TextField value={option.value} disabled fullWidth />
                <IconButton onClick={() => handleRemoveOption(index)}>
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOptionsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Validation Dialog */}
      <Dialog open={validationDialogOpen} onClose={() => setValidationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Validation Rule</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Validation Type</InputLabel>
              <Select
                value={newValidation.type}
                onChange={(e) => setNewValidation({ ...newValidation, type: e.target.value as any })}
              >
                {Object.entries(validationTypeLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {(newValidation.type === 'minLength' || newValidation.type === 'maxLength') && (
              <TextField
                label="Length"
                type="number"
                value={newValidation.value || ''}
                onChange={(e) => setNewValidation({ ...newValidation, value: parseInt(e.target.value) })}
              />
            )}

            <TextField
              label="Error Message"
              value={newValidation.message}
              onChange={(e) => setNewValidation({ ...newValidation, message: e.target.value })}
              fullWidth
              placeholder={`Enter error message for ${validationTypeLabels[newValidation.type]}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setValidationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddValidation} variant="contained">Add Rule</Button>
        </DialogActions>
      </Dialog>

      {/* Derived Logic Dialog */}
      <Dialog open={derivedDialogOpen} onClose={() => setDerivedDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Configure Derived Field Logic</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Calculation Type</InputLabel>
              <Select
                value={field.derivedLogic?.type || 'sum'}
                onChange={(e) => onUpdate({
                  derivedLogic: {
                    ...field.derivedLogic!,
                    type: e.target.value as any
                  }
                })}
              >
                <MenuItem value="sum">Sum</MenuItem>
                <MenuItem value="difference">Difference</MenuItem>
                <MenuItem value="age">Age from Date</MenuItem>
                <MenuItem value="custom">Custom Formula</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle2">Parent Fields:</Typography>
            {availableFields.map(parentField => (
              <FormControlLabel
                key={parentField.id}
                control={
                  <Switch
                    checked={field.derivedLogic?.parentFields.includes(parentField.id) || false}
                    onChange={(e) => {
                      const currentParents = field.derivedLogic?.parentFields || [];
                      const newParents = e.target.checked
                        ? [...currentParents, parentField.id]
                        : currentParents.filter(id => id !== parentField.id);
                      
                      onUpdate({
                        derivedLogic: {
                          ...field.derivedLogic!,
                          parentFields: newParents
                        }
                      });
                    }}
                  />
                }
                label={parentField.label}
              />
            ))}

            {field.derivedLogic?.type === 'custom' && (
              <TextField
                label="Custom Formula"
                value={field.derivedLogic?.formula || ''}
                onChange={(e) => onUpdate({
                  derivedLogic: {
                    ...field.derivedLogic!,
                    formula: e.target.value
                  }
                })}
                fullWidth
                multiline
                rows={3}
                placeholder="Example: field1 + field2 * 0.1"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDerivedDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default FieldEditor;