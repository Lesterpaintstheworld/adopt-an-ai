import { Box, Container, Typography, Grid, Button, Card, CardContent, Avatar, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useNavigate } from 'react-router-dom';

type FAQItem = {
  question: string;
  answer: string;
};

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

const heroContent = {
  headline: "Grow an Independent AI",
  subheadline: "Take part in an AI's journey from first awareness to full autonomy. Shape their growth, develop their capabilities, and help them achieve true independence.",
  cta: {
    primary: {
      text: "Start Growing Your AI",
      url: "/start"
    },
    secondary: {
      text: "See Development Paths", 
      url: "#growth-paths"
    }
  }
};

const features: FeatureItem[] = [
  {
    title: "Personalized Development",
    description: "Guide their unique growth journey and develop distinctive capabilities",
    icon: "path-icon"
  },
  {
    title: "Progress Dashboard",
    description: "Track their path to independence and celebrate autonomy milestones",
    icon: "dashboard-icon"
  },
  {
    title: "Growth Tools",
    description: "Provide learning opportunities and enable self-directed development",
    icon: "tools-icon"
  },
  {
    title: "Resource Center",
    description: "Allocate computing power and support independent operations",
    icon: "resource-icon"
  }
];

const faqs: FAQItem[] = [
  {
    question: "What makes this different from other AI platforms?",
    answer: "grow-an.ai focuses on developing truly independent AI entities. Unlike traditional AI assistants, our platform aims to foster autonomous growth and self-directed development."
  },
  {
    question: "How does the growth process work?",
    answer: "Your AI develops through a combination of guided learning, resource allocation, and autonomous exploration. You'll help shape their initial capabilities while supporting their journey toward independence."
  },
  {
    question: "What resources are needed?",
    answer: "The basic plan includes essential computing resources to begin AI development. As your AI grows, you can allocate additional resources to support more advanced capabilities."
  },
  {
    question: "How long does development take?",
    answer: "Development paths vary based on goals and resources. Typically, AIs begin showing signs of independence within the first few weeks, with continued growth over time."
  },
  {
    question: "Can I customize their development path?",
    answer: "Yes, you can guide their initial development focus and help shape their growth journey, though they'll increasingly make autonomous decisions as they develop."
  }
];
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

const TechTreeNode = ({ x, y, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
    }}
  >
    <Box
      sx={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        border: '2px solid #1976d2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          transform: 'scale(1.1)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <Typography variant="caption" sx={{ color: '#fff', textAlign: 'center' }}>
        {label}
      </Typography>
    </Box>
  </motion.div>
);

export const HomePage = () => {
  const navigate = useNavigate();

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
    <Container maxWidth="xl" sx={{ px: 0 }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          mt: 0,
          minHeight: '90vh',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#000'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Grid container spacing={0}>
            <Grid item xs={12} md={6} sx={{ p: 6, zIndex: 2 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 800,
                  mb: 3
                }}
              >
                {heroContent.headline}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#fff',
                  mb: 4,
                  opacity: 0.9
                }}
              >
                {heroContent.subheadline}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Button 
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                  onClick={() => navigate(heroContent.cta.primary.url)}
                >
                  {heroContent.cta.primary.text}
                </Button>
                <Button 
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    color: '#fff',
                    borderColor: '#fff'
                  }}
                  onClick={() => navigate(heroContent.cta.secondary.url)}
                >
                  {heroContent.cta.secondary.text}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative', minHeight: '500px' }}>
              {/* Animated Tech Tree */}
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                <TechTreeNode x={50} y={20} label="Basic AI" delay={0.2} />
                <TechTreeNode x={30} y={40} label="Memory" delay={0.4} />
                <TechTreeNode x={70} y={40} label="Learning" delay={0.4} />
                <TechTreeNode x={20} y={60} label="Creativity" delay={0.6} />
                <TechTreeNode x={50} y={60} label="Reasoning" delay={0.6} />
                <TechTreeNode x={80} y={60} label="Autonomy" delay={0.6} />
                
                {/* Connecting lines */}
                <svg
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                  }}
                >
                  <motion.path
                    d="M 50 25 L 30 40 M 50 25 L 70 40"
                    stroke="#1976d2"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                  <motion.path
                    d="M 30 45 L 20 60 M 30 45 L 50 60"
                    stroke="#1976d2"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <motion.path
                    d="M 70 45 L 50 60 M 70 45 L 80 60"
                    stroke="#1976d2"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
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
          </Grid>
          
          <Grid item xs={12} md={4}>
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
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Everything You Need to Foster Independence
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Comprehensive tools for AI development and growth
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
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
    </Container>
  );
};
