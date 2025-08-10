import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add, Save, Clear } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  setFormName,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  clearCurrentForm,
} from "../store/formBuilderSlice";
import { FormField } from "../types/form";
import FieldEditor from "../components/FieldEditor";

const CreatePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentForm } = useAppSelector((state) => state.formBuilder);
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [newFieldType, setNewFieldType] = useState<FormField["type"]>("text");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fieldTypes = [
    { value: "text", label: "Text Input" },
    { value: "number", label: "Number Input" },
    { value: "textarea", label: "Textarea" },
    { value: "select", label: "Select Dropdown" },
    { value: "radio", label: "Radio Buttons" },
    { value: "checkbox", label: "Checkbox" },
    { value: "date", label: "Date Picker" },
  ];

  const handleAddField = () => {
    const newField = {
      type: newFieldType,
      label: `New ${fieldTypes.find((t) => t.value === newFieldType)?.label}`,
      required: false,
      defaultValue: null,
      validationRules: [],
      options: ["select", "radio"].includes(newFieldType)
        ? [
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ]
        : undefined,
      isDerived: false,
    };

    dispatch(addField(newField));
    setAddFieldDialogOpen(false);
  };

  const handleSaveForm = () => {
    if (currentForm.fields.length === 0) {
      setSnackbarMessage("Please add at least one field before saving");
      setSnackbarOpen(true);
      return;
    }

    if (!currentForm.name.trim()) {
      setSnackbarMessage("Please provide a form name");
      setSnackbarOpen(true);
      return;
    }

    dispatch(saveForm());
    setSnackbarMessage("Form saved successfully!");
    setSnackbarOpen(true);
    setSaveDialogOpen(false);
  };

  const handleClearForm = () => {
    dispatch(clearCurrentForm());
    setSnackbarMessage("Form cleared");
    setSnackbarOpen(true);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(currentForm.fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    dispatch(reorderFields(items));
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearForm}
            disabled={currentForm.fields.length === 0}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => setSaveDialogOpen(true)}
            disabled={currentForm.fields.length === 0}
          >
            Save Form
          </Button>
        </Box>

        <TextField
          label="Form Name"
          value={currentForm.name}
          onChange={(e) => dispatch(setFormName(e.target.value))}
          fullWidth
          margin="normal"
        />
      </Paper>

      {currentForm.fields.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No fields added yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the + button to add your first form field
          </Typography>
        </Paper>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {[...currentForm.fields] // make a shallow copy to avoid state mutation
                  .sort((a, b) => a.order - b.order)
                  .map((field, index) => (
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <FieldEditor
                            field={field}
                            onUpdate={(updates) =>
                              dispatch(updateField({ id: field.id, updates }))
                            }
                            onDelete={() => dispatch(deleteField(field.id))}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Fab
        color="primary"
        aria-label="add field"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => setAddFieldDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Add Field Dialog */}
      <Dialog
        open={addFieldDialogOpen}
        onClose={() => setAddFieldDialogOpen(false)}
      >
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Field Type</InputLabel>
            <Select
              value={newFieldType}
              onChange={(e) =>
                setNewFieldType(e.target.value as FormField["type"])
              }
            >
              {fieldTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFieldDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddField} variant="contained">
            Add Field
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save Form Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Form Name"
            value={currentForm.name}
            onChange={(e) => dispatch(setFormName(e.target.value))}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveForm} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreatePage;
