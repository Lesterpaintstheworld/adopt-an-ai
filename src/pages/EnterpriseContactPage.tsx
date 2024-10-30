import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { useState } from 'react';

export const EnterpriseContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 8 }}>
        <Typography variant="h3" gutterBottom align="center">
          Enterprise Solutions
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Let's discuss your custom AI development needs
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Company"
            margin="normal"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <TextField
            fullWidth
            label="Message"
            margin="normal"
            required
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
          >
            Send Message
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
import { Box, Typography } from '@mui/material';

const EnterpriseContactPage = () => {
  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Enterprise Solutions
      </Typography>
      <Typography variant="body1">
        Contact us to learn more about our enterprise offerings.
      </Typography>
    </Box>
  );
};

export default EnterpriseContactPage;
