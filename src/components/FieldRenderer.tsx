import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { FormField } from '../types/form';

interface FieldRendererProps {
  field: FormField;
  value: any;
  error?: string;
  onChange: (value: any) => void;
  readOnly?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  error,
  onChange,
  readOnly = false,
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            disabled={readOnly}
            fullWidth
            margin="normal"
          />
        );

      case 'number':
        return (
          <TextField
            label={field.label}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            error={!!error}
            helperText={error}
            required={field.required}
            disabled={readOnly}
            fullWidth
            margin="normal"
          />
        );

      case 'textarea':
        return (
          <TextField
            label={field.label}
            multiline
            rows={4}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            disabled={readOnly}
            fullWidth
            margin="normal"
          />
        );

      case 'select':
        return (
          <FormControl fullWidth margin="normal" error={!!error} disabled={readOnly}>
            <InputLabel required={field.required}>{field.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              label={field.label}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 2 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" margin="normal" error={!!error} disabled={readOnly}>
            <FormLabel component="legend" required={field.required}>
              {field.label}
            </FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <Box margin="normal">
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  disabled={readOnly}
                />
              }
              label={field.label + (field.required ? ' *' : '')}
            />
            {error && (
              <Typography variant="caption" color="error" display="block">
                {error}
              </Typography>
            )}
          </Box>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={field.label}
              value={value ? dayjs(value) : null}
              onChange={(newValue: Dayjs | null) => {
                onChange(newValue ? newValue.toDate() : null);
              }}
              disabled={readOnly}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: !!error,
                  helperText: error,
                  required: field.required,
                },
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {renderField()}
      {field.isDerived && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
          This field is automatically calculated
        </Typography>
      )}
    </Box>
  );
};

export default FieldRenderer;