import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import * as MuiIcons from '@mui/icons-material';
import techContent from '../../content/tech/tech.yml';
import type { TechTreeContent, Perk } from '../types/tech';

export const TechTreePage = () => {
  const content = techContent as TechTreeContent;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPerks = selectedCategory
    ? content.perks.filter(perk => perk.category === selectedCategory)
    : content.perks;

  const PerkCard = ({ perk }: { perk: Perk }) => {
    // @ts-ignore - MuiIcons has dynamic icons
    const Icon = perk.icon ? MuiIcons[perk.icon] : MuiIcons.Stars;

    const tooltipContent = (
      <Box sx={{ p: 1, maxWidth: 300 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          {perk.name}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {perk.description}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" display="block">
            Category: {perk.category}
          </Typography>
          <Typography variant="caption" display="block">
            Level: {perk.level}
          </Typography>
          {perk.prerequisites && (
            <Typography variant="caption" display="block">
              Prerequisites: {perk.prerequisites.join(', ')}
            </Typography>
          )}
        </Box>
      </Box>
    );

    return (
      <Tooltip
        title={tooltipContent}
        placement="top"
        arrow
        PopperProps={{
          sx: {
            '& .MuiTooltip-tooltip': {
              bgcolor: 'background.paper',
              color: 'text.primary',
              boxShadow: 3,
              '& .MuiTooltip-arrow': {
                color: 'background.paper',
              },
            },
          },
        }}
      >
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            '&:hover': {
              transform: 'translateY(-4px)',
              transition: 'transform 0.2s ease-in-out',
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconButton size="small" color="primary">
                <Icon />
              </IconButton>
              <Typography variant="h6" component="h2" sx={{ ml: 1 }}>
                {perk.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {perk.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={`Level ${perk.level}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={perk.category}
                size="small"
                sx={{ ml: 1 }}
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Tooltip>
    );
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Tech Tree
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Unlock new capabilities as you progress
        </Typography>

        {/* Category filters */}
        <Box sx={{ mb: 4, display: 'flex', gap: 1 }}>
          <Tooltip title="Show all categories">
            <Chip
              label="All"
              onClick={() => setSelectedCategory(null)}
              color={selectedCategory === null ? 'primary' : 'default'}
              clickable
            />
          </Tooltip>
          {content.categories.map((category) => (
            <Tooltip key={category.name} title={category.description}>
              <Chip
                label={category.name}
                onClick={() => setSelectedCategory(category.name)}
                color={selectedCategory === category.name ? 'primary' : 'default'}
                clickable
              />
            </Tooltip>
          ))}
        </Box>

        {/* Perks grid */}
        <Grid container spacing={3}>
          {filteredPerks.map((perk) => (
            <Grid item key={perk.id} xs={12} sm={6} md={4}>
              <PerkCard perk={perk} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
