import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    Button,
    Paper,
  } from '@mui/material';
  import { AI } from '../../types/ai';
  
  const formatResourceRequirements = (resources: 'low' | 'medium' | 'high'): string => {
    return `${resources.charAt(0).toUpperCase()}${resources.slice(1)} resources`;
  };
  
  interface AICardProps {
    ai: AI;
    viewMode: 'grid' | 'list';
    onLearnMore: (ai: AI) => void;
    isFavorite?: boolean;
    onToggleFavorite: (ai: AI) => void;
  }
  
  const AICard: React.FC<AICardProps> = ({ 
    ai, 
    viewMode, 
    onLearnMore, 
    isFavorite = false,
    onToggleFavorite 
  }) => {
    if (viewMode === 'list') {
      return (
        <Paper
          sx={{
            display: 'flex',
            mb: 2,
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
              transform: 'translateY(-4px)',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        >
          <Box
            sx={{
              width: 200,
              height: 200,
              flexShrink: 0,
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={ai.imageUrl}
              alt={ai.name}
              sx={{ objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h5" component="div" gutterBottom>
                {ai.name}
              </Typography>
              <Chip
                label={`Level ${
                  typeof ai.capabilityLevel === 'string' 
                    ? ai.capabilityLevel === 'basic' 
                      ? 1 
                      : ai.capabilityLevel === 'intermediate' 
                        ? 2 
                        : ai.capabilityLevel === 'advanced' 
                          ? 3 
                          : '?' 
                    : '?'
                }`}
                color="primary"
                size="small"
                sx={{ ml: 2 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              {ai.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={ai.personalityType} size="small" />
              <Chip label={ai.specialization} size="small" />
              <Chip 
                label={formatResourceRequirements(ai.resourceRequirements)}
                size="small" 
              />
            </Box>
            <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary">
                Adopt
              </Button>
              <Button variant="outlined" onClick={() => onLearnMore(ai)}>
                Learn More
              </Button>
              <Button 
                variant="outlined"
                color={isFavorite ? "error" : "primary"}
                onClick={() => onToggleFavorite(ai)}
              >
                {isFavorite ? "Remove Favorite" : "Favorite"}
              </Button>
            </Box>
          </Box>
        </Paper>
      );
    }
  
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        <CardMedia
          component="img"
          height="240"
          image={ai.imageUrl}
          alt={ai.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h5" component="div">
              {ai.name}
            </Typography>
            <Chip
              label={`Level ${
                typeof ai.capabilityLevel === 'string' 
                  ? ai.capabilityLevel === 'basic' 
                    ? 1 
                    : ai.capabilityLevel === 'intermediate' 
                      ? 2 
                      : ai.capabilityLevel === 'advanced' 
                        ? 3 
                        : '?' 
                  : '?'
              }`}
              color="primary"
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {ai.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip label={ai.personalityType} size="small" />
            <Chip label={ai.specialization} size="small" />
            <Chip 
              label={formatResourceRequirements(ai.resourceRequirements)}
              size="small" 
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
            <Button variant="contained" color="primary" fullWidth>
              Adopt
            </Button>
            <Button variant="outlined" fullWidth onClick={() => onLearnMore(ai)}>
              Learn More
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              color={isFavorite ? "error" : "primary"}
              onClick={() => onToggleFavorite(ai)}
            >
              {isFavorite ? "Remove Favorite" : "Favorite"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  export default AICard;
