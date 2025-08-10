import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import { List, Preview, Build, DateRange } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loadForm } from '../store/formBuilderSlice';

const MyFormsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { savedForms } = useAppSelector(state => state.formBuilder);

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
  };

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFieldTypeCount = (form: any) => {
    const types = form.fields.reduce((acc: any, field: any) => {
      acc[field.type] = (acc[field.type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(types)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <List />
          <Typography variant="h4">My Forms</Typography>
          <Chip 
            label={`${savedForms.length} Forms`} 
            color="primary" 
            sx={{ ml: 'auto' }}
          />
        </Box>
      </Paper>

      {savedForms.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <List sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Saved Forms
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't created any forms yet. Start building your first form!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Build />}
            onClick={() => navigate('/create')}
            size="large"
          >
            Create Your First Form
          </Button>
        </Paper>
      ) : (
        <>
          <Alert severity="info" sx={{ mb: 3 }}>
            All forms are saved locally in your browser's storage. Click "Preview" to test a form or "Edit" to modify it.
          </Alert>
          
          <Grid container spacing={3}>
            {savedForms
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((form) => (
                <Grid item xs={12} md={6} lg={4} key={form.id}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                        <Build color="primary" />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {form.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <DateRange fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(form.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={`${form.fields.length} Fields`}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        {form.fields.some(f => f.isDerived) && (
                          <Chip
                            label="Has Derived Fields"
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        )}
                        {form.fields.some(f => f.validationRules.length > 0) && (
                          <Chip
                            label="Has Validations"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {getFieldTypeCount(form)}
                      </Typography>
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
                      <Button
                        size="small"
                        startIcon={<Preview />}
                        onClick={() => handlePreviewForm(form.id)}
                      >
                        Preview
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Build />}
                        onClick={() => handleEditForm(form.id)}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default MyFormsPage;