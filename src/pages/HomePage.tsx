import { Container, Typography, Grid, Button, Box, Card, CardContent, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const HomePage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const testimonials = [
    {
      name: "Sarah K.",
      avatar: "/avatars/sarah.jpg",
      quote: "Developing my AI companion has been an incredible journey. The platform makes it so intuitive!"
    },
    {
      name: "Michael R.",
      avatar: "/avatars/michael.jpg",
      quote: "The tech tree system really helps understand the progression of AI capabilities."
    },
    {
      name: "Jessica T.",
      avatar: "/avatars/jessica.jpg",
      quote: "I've learned so much about AI development through this platform."
    }
  ];

  const faqs = [
    {
      question: "What is raise-an.ai?",
      answer: "raise-an.ai is a platform that allows you to develop and nurture your own AI companion through a guided development process."
    },
    {
      question: "How does the tech tree work?",
      answer: "The tech tree represents different capabilities and skills your AI can develop. As you progress, you unlock new features and abilities."
    },
    {
      question: "What resources do I need?",
      answer: "You can start with our free tier which includes basic AI interaction capabilities. Premium tiers offer additional compute resources and features."
    },
    {
      question: "How long does it take to develop an AI?",
      answer: "The development timeline varies based on your goals and engagement. Some users see significant progress within weeks, while others prefer a longer development journey."
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          raise-an.ai
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Foster and develop your own AI companion
        </Typography>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Create Your AI
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/create')}
                  size="large"
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Adopt an AI
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/adopt')}
                  size="large"
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  Browse AIs
                </Button>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Testimonials Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            What Our Users Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                        <Typography variant="h6">{testimonial.name}</Typography>
                      </Box>
                      <Typography variant="body1" color="text.secondary">
                        "{testimonial.quote}"
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 4 }}>
            {faqs.map((faq, index) => (
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
        </Box>
      </motion.div>
    </Container>
  );
};
