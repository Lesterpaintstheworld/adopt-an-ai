import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [annualBilling, setAnnualBilling] = useState(false);

  const plans = [
    {
      title: 'Free',
      price: 0,
      features: [
        'Basic AI interaction',
        'Limited compute resources',
        'System prompt customization',
        'Basic progress tracking'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outlined' as const,
    },
    {
      title: 'Standard',
      price: annualBilling ? 8.99 : 9.99,
      features: [
        'Enhanced compute allocation',
        'Memory systems access',
        'Basic creative tools',
        'Extended tracking metrics',
        'Priority support'
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'contained' as const,
    },
    {
      title: 'Professional',
      price: annualBilling ? 24.99 : 29.99,
      features: [
        'Full compute access',
        'Advanced autonomy features',
        'All creative capabilities',
        'Complete development tools',
        'Premium support',
        'Custom infrastructure'
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'contained' as const,
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          Pricing Plans
        </Typography>
        <Typography variant="h5" color="text.secondary" component="p">
          Choose the perfect plan for your AI development needs
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Monthly</Typography>
          <Switch
            checked={annualBilling}
            onChange={() => setAnnualBilling(!annualBilling)}
            color="primary"
            sx={{ mx: 2 }}
          />
          <Typography>
            Annual
            <Typography
              component="span"
              sx={{
                ml: 1,
                bgcolor: 'success.main',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
              }}
            >
              Save 20%
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4} alignItems="flex-end">
        {plans.map((plan, index) => (
          <Grid
            item
            key={plan.title}
            xs={12}
            sm={6}
            md={4}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader
                  title={plan.title}
                  titleTypographyProps={{ align: 'center' }}
                  sx={{
                    backgroundColor: index === 1 ? 'primary.main' : 'grey.200',
                    color: index === 1 ? 'white' : undefined,
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography component="h2" variant="h3" color="text.primary">
                      ${plan.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                  <List>
                    {plan.features.map((feature) => (
                      <ListItem key={feature} sx={{ py: 1 }}>
                        <ListItemIcon>
                          <CheckIcon sx={{ color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    fullWidth
                    variant={plan.buttonVariant}
                    color={index === 1 ? 'primary' : 'inherit'}
                    onClick={() => navigate('/payment')}
                    sx={{ mt: 2 }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Enterprise Solutions
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Need a custom solution? Contact us for enterprise pricing and features.
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate('/contact')}
        >
          Contact Sales
        </Button>
      </Box>
    </Container>
  );
};

export default PricingPage;
