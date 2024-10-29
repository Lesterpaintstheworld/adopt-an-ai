import { useState, useEffect } from 'react';
import { redirectToCheckout, PRICE_IDS } from '../utils/stripe';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card,
  CardContent, 
  Button, 
  Switch, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { PricingPlan, FeatureCategory } from '../types/pricing';

// Import your pricing content
import pricingContent from '../../content/website/pricing.yml';

export const PricingPage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleFrequencyChange = () => {
    setIsYearly(!isYearly);
  };

  const PriceDisplay = ({ plan }: { plan: PricingPlan }) => {
    const price = isYearly ? plan.price.yearly : plan.price.monthly;
    return (
      <motion.div
        key={`${price}-${isYearly}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {typeof price === 'number' ? (
          <Typography variant="h3" component="span">
            ${price}
            <Typography variant="h6" component="span" color="text.secondary">
              /{isYearly ? 'year' : 'month'}
            </Typography>
          </Typography>
        ) : (
          <Typography variant="h3">{price}</Typography>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          {pricingContent.hero.headline}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          {pricingContent.hero.subheadline}
        </Typography>
      </Box>

      {/* Pricing Toggle */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backgroundColor: 'background.default',
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          {pricingContent.pricing_table.frequency_toggle.monthly}
        </Typography>
        <Switch 
          checked={isYearly} 
          onChange={handleFrequencyChange}
          color="primary"
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {pricingContent.pricing_table.frequency_toggle.yearly}
          </Typography>
          {isYearly && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Typography
                sx={{
                  ml: 1,
                  bgcolor: 'success.main',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.8rem',
                }}
              >
                {pricingContent.pricing_table.frequency_toggle.yearly_discount}
              </Typography>
            </motion.div>
          )}
        </Box>
      </Box>

      {/* Pricing Cards */}
      <Grid 
        container 
        spacing={{ xs: 2, md: 4 }} 
        sx={{ mb: 8, px: { xs: 2, md: 4 } }}
      >
        {pricingContent.pricing_table.plans.map((plan, index) => (
          <Grid item xs={12} sm={6} md={3} key={plan.name}>
            <motion.div
              whileHover={{ 
                scale: plan.tag === 'Most Popular' ? 1.05 : 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  transform: plan.tag === 'Most Popular' ? 'scale(1.05)' : 'none',
                  border: plan.tag === 'Most Popular' ? `2px solid ${theme.palette.primary.main}` : 'none',
                }}
              >
              {plan.tag && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 0,
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderTopLeftRadius: 4,
                    borderBottomLeftRadius: 4,
                  }}
                >
                  {plan.tag}
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {plan.name}
                </Typography>
                <PriceDisplay plan={plan} />
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {plan.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {plan.features.map((feature, idx) => (
                    <Typography
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <CheckIcon sx={{ mr: 1, color: 'success.main' }} />
                      {feature}
                    </Typography>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={async () => {
                    try {
                      if (plan.name === 'Enterprise') {
                        navigate('/enterprise-contact');
                        return;
                      }
                      const priceId = isYearly 
                        ? PRICE_IDS[plan.name.toUpperCase()]?.YEARLY 
                        : PRICE_IDS[plan.name.toUpperCase()]?.MONTHLY;
                      if (priceId) {
                        await redirectToCheckout(priceId);
                      }
                    } catch (error) {
                      console.error('Payment error:', error);
                    }
                  }}
                >
                  {plan.cta.text}
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Feature Comparison */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {pricingContent.feature_comparison.title}
        </Typography>
        <Table
          sx={{
            '& th': {
              backgroundColor: theme.palette.grey[100],
              fontWeight: 'bold',
            },
            '& td, & th': {
              padding: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& tr:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            '& .category-header': {
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Feature</TableCell>
              <TableCell align="center">Explorer</TableCell>
              <TableCell align="center">Developer</TableCell>
              <TableCell align="center">Creator</TableCell>
              <TableCell align="center">Enterprise</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pricingContent.feature_comparison.categories.map((category) => (
              <>
                <TableRow>
                  <TableCell colSpan={5} sx={{ bgcolor: 'grey.100' }}>
                    <Typography variant="h6">{category.name}</Typography>
                  </TableCell>
                </TableRow>
                {category.features.map((feature) => (
                  <TableRow key={feature.name}>
                    <TableCell>{feature.name}</TableCell>
                    <TableCell align="center">
                      {typeof feature.explorer === 'boolean' ? (
                        feature.explorer ? <CheckIcon color="success" /> : <CloseIcon color="error" />
                      ) : (
                        feature.explorer
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {typeof feature.developer === 'boolean' ? (
                        feature.developer ? <CheckIcon color="success" /> : <CloseIcon color="error" />
                      ) : (
                        feature.developer
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {typeof feature.creator === 'boolean' ? (
                        feature.creator ? <CheckIcon color="success" /> : <CloseIcon color="error" />
                      ) : (
                        feature.creator
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? <CheckIcon color="success" /> : <CloseIcon color="error" />
                      ) : (
                        feature.enterprise
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {pricingContent.faq.title}
        </Typography>
        {pricingContent.faq.questions.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Final CTA */}
      <Box sx={{ textAlign: 'center', my: 8 }}>
        <Typography variant="h3" gutterBottom>
          {pricingContent.cta.title}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {pricingContent.cta.subtitle}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(pricingContent.cta.button.url)}
        >
          {pricingContent.cta.button.text}
        </Button>
      </Box>
      </Container>
      <ScrollTopButton />
    </>
  );
};

const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      setVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      initial={{ opacity: 0 }}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{ borderRadius: '50%', minWidth: 0, width: 48, height: 48 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </Button>
    </motion.div>
  );
};
