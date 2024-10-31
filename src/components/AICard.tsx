import { AI } from '../types/ai';

interface AICardProps {
  ai: AI;
  viewMode: 'grid' | 'list';
}

const AICard: React.FC<AICardProps> = ({ ai, viewMode }) => {
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${
      viewMode === 'list' ? 'flex gap-4' : ''
    }`}>
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-2">{ai.name}</h3>
        <p className="text-gray-600 mb-4">{ai.personality}</p>
        
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-1">Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {ai.capabilities.map((capability) => (
              <span
                key={capability}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-1">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {ai.specializations.map((spec) => (
              <span
                key={spec}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm">
            <div>Compute: {ai.resourceRequirements.compute}%</div>
            <div>Memory: {ai.resourceRequirements.memory}%</div>
          </div>
          <div className="flex gap-2">
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200">
              Details
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Adopt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICard;
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { AI } from '../types/ai';

interface AICardProps {
  ai: AI;
  viewMode: 'grid' | 'list';
}

const AICard: React.FC<AICardProps> = ({ ai, viewMode }) => {
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
              label={`Level ${ai.capabilityLevel}`}
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
            <Chip label={`${ai.resourceRequirements} resources`} size="small" />
          </Box>
          <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary">
              Adopt
            </Button>
            <Button variant="outlined">
              Learn More
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
            label={`Level ${ai.capabilityLevel}`}
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
          <Chip label={`${ai.resourceRequirements} resources`} size="small" />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
          <Button variant="contained" color="primary" fullWidth>
            Adopt
          </Button>
          <Button variant="outlined" fullWidth>
            Learn More
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AICard;
