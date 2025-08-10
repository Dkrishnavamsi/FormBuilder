import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { Preview, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { FormValues } from "../types/form";
import { validateForm, calculateDerivedValue } from "../utils/validation";
import FieldRenderer from "../components/FieldRenderer";

const PreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentForm } = useAppSelector((state) => state.formBuilder);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<{ [fieldId: string]: string }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // Initialize form values with defaults
    const initialValues: FormValues = {};
    currentForm.fields.forEach((field) => {
      if (field.isDerived) {
        initialValues[field.id] = calculateDerivedValue(field, initialValues);
      } else if (
        field.defaultValue !== null &&
        field.defaultValue !== undefined
      ) {
        initialValues[field.id] = field.defaultValue;
      }
    });
    setFormValues(initialValues);
  }, [currentForm.fields]);

  useEffect(() => {
    // Update derived fields when any value changes
    const updatedValues = { ...formValues };
    let hasChanges = false;

    currentForm.fields.forEach((field) => {
      if (field.isDerived) {
        const newValue = calculateDerivedValue(field, formValues);
        if (updatedValues[field.id] !== newValue) {
          updatedValues[field.id] = newValue;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setFormValues(updatedValues);
    }
  }, [formValues, currentForm.fields]);

  const handleValueChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm(currentForm.fields, formValues);

    if (validation.isValid) {
      setSnackbarMessage(
        "Form submitted successfully! (This is just a preview)"
      );
      setSnackbarOpen(true);
      setErrors({});
    } else {
      setErrors(validation.errors);
      setSnackbarMessage("Please fix the validation errors");
      setSnackbarOpen(true);
    }
  };

  const handleReset = () => {
    const resetValues: FormValues = {};
    currentForm.fields.forEach((field) => {
      if (field.isDerived) {
        resetValues[field.id] = calculateDerivedValue(field, resetValues);
      } else if (
        field.defaultValue !== null &&
        field.defaultValue !== undefined
      ) {
        resetValues[field.id] = field.defaultValue;
      } else {
        resetValues[field.id] = "";
      }
    });
    setFormValues(resetValues);
    setErrors({});
  };

  if (currentForm.fields.length === 0) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Preview sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Form to Preview
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please create a form first to see the preview.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/create")}
          >
            Go to Form Builder
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Preview />
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            {currentForm.name || "Form Preview"}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/create")}
          >
            Back to Builder
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          This is a preview of how your form will appear to end users. All
          validations and derived fields are functional.
        </Alert>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {Array.from(currentForm.fields ?? [])
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  value={formValues[field.id]}
                  error={errors[field.id]}
                  onChange={(value) => handleValueChange(field.id, value)}
                  readOnly={field.isDerived}
                />
              ))}
          </Box>

          <Box
            sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}
          >
            <Button type="button" variant="outlined" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={
            errors && Object.keys(errors).length > 0 ? "error" : "success"
          }
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PreviewPage;
