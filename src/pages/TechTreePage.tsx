import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
} from '@mui/material';
import { TechTree, PhaseData, Perk } from '@/types/tech';
import { TAG_STYLES } from '@/utils/tagStyles';
import { getPerkIconUrl } from '@/utils/perkIconUrl';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsIcon from '@mui/icons-material/Settings';
import techTree from '../../content/tech/tech-tree.yml';

// Constants for layout calculations
const BASE_PHASE_WIDTH = 2400; // Base width that we'll adjust
const ITEM_HEIGHT = 160;
const LAYER_PADDING = 60;
const CHRONOLOGICAL_SPACING = 400; // Augmenté de 200 à 400 pour plus d'espace horizontal
const PHASE_START_PADDING = 200;
const PHASE_PADDING = 200;
const ITEM_IMAGE_SIZE = 80;

const getTagColor = (tag: string) => {
  const tagType = tag.split(' ')[1];
  switch (tagType) {
    case 'CREATIVE':
      return { backgroundColor: '#d32f2f', color: '#ffffff', minWidth: '120px' };
    case 'TECHNICAL':
      return { backgroundColor: '#1976d2', color: '#ffffff', minWidth: '120px' };
    case 'SOCIAL':
      return { backgroundColor: '#388e3c', color: '#ffffff', minWidth: '120px' };
    case 'INTEGRATION':
      return { backgroundColor: '#7b1fa2', color: '#ffffff', minWidth: '120px' };
    case 'COGNITIVE':
      return { backgroundColor: '#f57c00', color: '#ffffff', minWidth: '120px' };
    case 'OPERATIONAL':
      return { backgroundColor: '#0288d1', color: '#ffffff', minWidth: '120px' };
    default:
      return { backgroundColor: '#757575', color: '#ffffff', minWidth: '120px' };
  }
};

const sortByChronologicalOrder = (a: any, b: any) => {
  return (a.chronologicalOrder || 1) - (b.chronologicalOrder || 1);
};


const getTagIcon = (tag: string) => {
  const iconType = tag.split(' ')[1];
  switch (iconType) {
    case 'CREATIVE':
      return <BrushIcon />;
    case 'TECHNICAL':
      return <BuildIcon />;
    case 'SOCIAL':
      return <PeopleIcon />;
    case 'INTEGRATION':
      return <NetworkCheckIcon />;
    case 'COGNITIVE':
      return <PsychologyIcon />;
    case 'OPERATIONAL':
      return <SettingsIcon />;
    default:
      return <CodeIcon />;
  }
};

// Calculate width needed for a single phase
const calculatePhaseWidth = (phaseData: any) => {
  let maxChronologicalOrder = 0;
  
  // Check all layers in the phase
  Object.entries(phaseData).forEach(([key, value]: [string, any]) => {
    if (!['name', 'period', 'description'].includes(key)) {
      value.forEach((item: any) => {
        if (item.chronologicalOrder) {
          maxChronologicalOrder = Math.max(maxChronologicalOrder, item.chronologicalOrder);
        }
      });
    }
  });
  
  // Calculate width based on the highest chronological order
  return (maxChronologicalOrder * CHRONOLOGICAL_SPACING) + PHASE_START_PADDING + PHASE_PADDING;
};

// Helper to calculate item positions
const calculateNodePositions = (techTree: any) => {
  const positions: { [key: string]: { x: number, y: number } } = {};
  let currentX = 0; // Track the cumulative x position
  
  Object.entries(techTree).forEach(([phaseKey, phaseData]: [string, any]) => {
    const phaseWidth = calculatePhaseWidth(phaseData);
    
    // Handle all non-metadata entries (layers)
    Object.entries(phaseData)
      .filter(([key]) => !['name', 'period', 'description'].includes(key))
      .forEach(([layerKey, items]: [string, any], layerIndex) => {
        // Process each item in the layer
        items.forEach((item: any) => {
          if (!item.chronologicalOrder) {
            console.warn(`Missing chronologicalOrder for item: ${item.name}`);
          }
          
          positions[item.name] = {
            x: currentX + ((item.chronologicalOrder || 1) * CHRONOLOGICAL_SPACING),
            y: layerIndex * (ITEM_HEIGHT + LAYER_PADDING) + 100
          };
        });
      });
    
    currentX += phaseWidth; // Move to next phase
  });
  
  return positions;
};

// Component for drawing connection lines
const ConnectionLines = ({ 
  positions, 
  items,
  highlightedItem 
}: { 
  positions: any, 
  items: any[],
  highlightedItem: string | null 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const CORNER_RADIUS = 20; // Radius for rounded corners

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {items.map((item) => 
        item.prerequisites?.map((prereq: string) => {
          const start = positions[prereq];
          const end = positions[item.name];
          if (!start || !end) return null;

          const isHighlighted = 
            highlightedItem === item.name || 
            highlightedItem === prereq;

          // Calculate path points
          const startX = start.x + 280; // Exit from right side of prerequisite
          const startY = start.y + 40;  // Middle height of box
          const endX = end.x;           // Enter from left side of dependent
          const endY = end.y + 40;      // Middle height of box
          
          // Calculate the midpoint for the path
          const midX = startX + (endX - startX) / 2;
          const goingUp = endY < startY;

          // Create path with rounded corners based on direction
          const path = goingUp 
            ? `
              M ${startX} ${startY}
              H ${midX - CORNER_RADIUS}
              Q ${midX} ${startY} ${midX} ${startY - CORNER_RADIUS}
              V ${endY + CORNER_RADIUS}
              Q ${midX} ${endY} ${midX + CORNER_RADIUS} ${endY}
              H ${endX}
            `
            : `
              M ${startX} ${startY}
              H ${midX - CORNER_RADIUS}
              Q ${midX} ${startY} ${midX} ${startY + CORNER_RADIUS}
              V ${endY - CORNER_RADIUS}
              Q ${midX} ${endY} ${midX + CORNER_RADIUS} ${endY}
              H ${endX}
            `;

          return (
            <g key={`${prereq}-${item.name}`}>
              <defs>
                <marker
                  id={`arrowhead-${isHighlighted ? 'highlighted' : 'normal'}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill={isHighlighted ? "#000" : "#666"}
                  />
                </marker>
              </defs>
              <path
                d={path}
                stroke={isHighlighted ? "#000" : "#666"}
                strokeWidth={isHighlighted ? "3" : "2"}
                fill="none"
                strokeDasharray={isHighlighted ? "" : "4"}
                markerEnd={`url(#arrowhead-${isHighlighted ? 'highlighted' : 'normal'})`}
              />
            </g>
          );
        })
      )}
    </svg>
  );
};

const TechItem = ({ 
  item, 
  phase, 
  position,
  onHover,
  highlightedItem
}: { 
  item: Perk;
  phase: string;
  position: { x: number, y: number };
  onHover: (itemName: string | null) => void;
  highlightedItem: string | null;
}) => {
  return (
    <Tooltip
      title={
        <Box sx={{ 
          p: 2,
          minWidth: '600px',
          maxWidth: '800px'
        }}>
          <Typography 
            variant="body1"
            sx={{ 
              fontSize: '1.3rem',
              lineHeight: 1.6,
              color: '#ffffff',
              mb: 2,
              whiteSpace: 'normal'
            }}
          >
            {item.longDescription || item.description}
          </Typography>
          {item.prerequisites && item.prerequisites.length > 0 && (
            <Box mt={3}>
              <Typography 
                variant="subtitle1"
                sx={{ 
                  fontSize: '1.2rem',
                  mb: 1.5,
                  color: '#ffffff',
                  fontWeight: 'bold'
                }}
              >
                Prerequisites:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {item.prerequisites.map((prereq: string) => (
                  <Chip
                    key={prereq}
                    label={prereq}
                    size="medium"
                    variant="outlined"
                    sx={{ 
                      fontSize: '1.1rem',
                      color: '#ffffff',
                      borderColor: '#ffffff',
                      height: '36px',
                      '& .MuiChip-label': {
                        color: '#ffffff',
                        px: 2
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      }
      arrow
      PopperProps={{
        sx: {
          maxWidth: 'none !important',
          width: 'auto !important',
          '& .MuiTooltip-tooltip': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: '24px',
            maxWidth: 'none !important',
            width: 'auto !important',
            fontSize: '1.2rem'
          },
          '& .MuiTooltip-arrow': {
            color: 'rgba(0, 0, 0, 0.9)'
          }
        },
        modifiers: [
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              altAxis: true,
              altBoundary: true,
              padding: 8
            }
          }
        ]
      }}
      enterDelay={0}
      enterNextDelay={0}
    >
      <Paper
        elevation={2}
        onMouseEnter={() => onHover(item.name)}
        onMouseLeave={() => onHover(null)}
        sx={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: 350,
          height: ITEM_HEIGHT - 40,
          display: 'flex',
          gap: 3,
          padding: 0,
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
            zIndex: 10,
          },
          backgroundColor: (theme) => {
            const alpha = 0.95;
            return phase === 'phase_1' ? `${theme.palette.primary.light}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` :
              phase === 'phase_2' ? `${theme.palette.secondary.light}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` :
              phase === 'phase_3' ? `${theme.palette.success.light}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` :
              `${theme.palette.warning.light}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
          },
          fontWeight: item.name === highlightedItem || (item.prerequisites || []).includes(highlightedItem) ? 'bold' : 'normal',
        }}
      >
        <Box
          sx={{
            width: ITEM_HEIGHT - 40,
            height: ITEM_HEIGHT - 40,
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <img 
            src={getPerkIconUrl(item.name)}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {item.name}
          </Typography>
          <Chip
            icon={getTagIcon(item.tag)}
            label={item.tag.split(' ')[1]}
            size="small"
            variant="outlined"
            sx={{
              ...getTagColor(item.tag),
              '& .MuiChip-icon': {
                color: '#ffffff',
                marginLeft: '8px'
              },
              borderRadius: '16px',
              fontWeight: 500,
              height: '28px',
              minWidth: '140px',
              paddingLeft: '12px',
              paddingRight: '12px',
              fontSize: '0.9rem',
              marginTop: 'auto'
            }}
          />
        </Box>
      </Paper>
    </Tooltip>
  );
};

export const TechTreePage = () => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setPositions(calculateNodePositions(techTree));
  }, []);

  // Flatten all items for easier processing
  const allItems = Object.entries(techTree as TechTree).flatMap(([phaseKey, phaseData]: [string, PhaseData]) =>
    Object.entries(phaseData)
      .filter(([key]) => !['name', 'period', 'description'].includes(key))
      .flatMap(([layerKey, items]: [string, any]) => {
        // Sort items within each layer by chronological order
        const sortedItems = [...items].sort(sortByChronologicalOrder);
        return sortedItems.map((item: any) => ({ ...item, phase: phaseKey }));
      })
  );

  return (
    <Box
        ref={containerRef}
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          overflowX: 'auto',
          overflowY: 'auto',
          width: '200vw',
          height: 'calc(200vh - 128px)',
          bgcolor: 'transparent',
          zIndex: 2,
          transform: 'scale(0.5)',
          transformOrigin: 'top left',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: (Object.values(techTree).reduce((acc: number, phase: any) => 
              acc + calculatePhaseWidth(phase), 0) + 300),
            height: 2000,
            p: 4,
            minWidth: '16000px',
            backgroundImage: 'url(/website/convergence-dark.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <ConnectionLines 
            positions={positions} 
            items={allItems}
            highlightedItem={highlightedItem}
          />
          
          {allItems.map((item) => (
            <TechItem
              key={item.name}
              item={item}
              phase={item.phase}
              position={positions[item.name] || { x: 0, y: 0 }}
              onHover={setHighlightedItem}
              highlightedItem={highlightedItem}
            />
          ))}
          
          {/* Phase headers */}
          {Object.entries(techTree).map(([phaseKey, phaseData]: [string, any], index) => {
            const previousPhases = Object.values(techTree).slice(0, index);
            const xPosition = previousPhases.reduce((acc: number, phase: any) => {
              return acc + calculatePhaseWidth(phase);
            }, 0);
            
            return (
              <Typography
                key={phaseKey}
                variant="h5"
                sx={{
                  position: 'absolute',
                  left: xPosition + PHASE_START_PADDING,
                  top: 20,
                  width: 280,
                  textAlign: 'center',
                }}
              >
                {phaseData.name} ({phaseData.period})
              </Typography>
            );
          })}
        </Box>
      </Box>
  );
};
