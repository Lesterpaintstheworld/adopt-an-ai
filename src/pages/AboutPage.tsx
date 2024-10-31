import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
} from '@mui/material';

interface AboutContent {
  hero: {
    headline: string;
    subheadline: string;
  };
  mission: {
    title: string;
    content: string;
    key_points: Array<{
      title: string;
      description: string;
    }>;
  };
  vision: {
    title: string;
    content: string;
    timeline: {
      current_phase: string;
      phases: Array<{
        year: string;
        title: string;
        description: string;
      }>;
    };
  };
  technology: {
    title: string;
    subtitle: string;
    components: Array<{
      name: string;
      description: string;
    }>;
  };
  team: {
    title: string;
    subtitle: string;
    members: Array<{
      name: string;
      description: string;
    }>;
  };
  connect: {
    title: string;
    channels: Array<{
      name: string;
      description: string;
      url: string;
    }>;
  };
}
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import your about content
import { AboutContent } from '../../types/about';
import aboutContent from '../../content/website/about.yml';

const AboutPage = () => {
  const content = aboutContent as AboutContent;
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          my: 8,
          minHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            {content.hero.headline}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            {content.hero.subheadline}
          </Typography>
        </motion.div>
      </Box>

      {/* Mission Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h3" gutterBottom align="center">
          {content.mission.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          {aboutContent.mission.content}
        </Typography>
        <Grid container spacing={4}>
          {aboutContent.mission.key_points.map((point: { title: string; description: string }, index: number) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {point.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {point.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Vision Section */}
      <Box sx={{ my: 8, bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom align="center">
            {aboutContent.vision.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
            {aboutContent.vision.content}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {aboutContent.vision.timeline.phases.map((phase: { year: string; title: string; description: string }, index: number) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    bgcolor: phase.year === aboutContent.vision.timeline.current_phase 
                      ? 'primary.light' 
                      : 'background.paper'
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {phase.year}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {phase.title}
                    </Typography>
                    <Typography variant="body2">
                      {phase.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Technology Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h3" gutterBottom align="center">
          {aboutContent.technology.title}
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          {aboutContent.technology.subtitle}
        </Typography>
        <Grid container spacing={4}>
          {aboutContent.technology.components.map((component: { name: string; description: string }, index: number) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {component.name}
                    </Typography>
                    <Typography variant="body2">
                      {component.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ my: 8, bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom align="center">
            {aboutContent.team.title}
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
            {aboutContent.team.subtitle}
          </Typography>
          <Grid container spacing={4}>
            {aboutContent.team.members.map((member, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body2">
                      {member.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Connect Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h3" gutterBottom align="center">
          {aboutContent.connect.title}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {aboutContent.connect.channels.map((channel, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' }
                }}
                onClick={() => navigate(channel.url)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {channel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {channel.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutPage;
