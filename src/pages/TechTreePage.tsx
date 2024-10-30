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
import techTree from '@/content/tech/tech-tree.yml';

// Constants for layout calculations
const BASE_PHASE_WIDTH = 2400; // Base width that we'll adjust
const ITEM_HEIGHT = 120;
const LAYER_PADDING = 40;
const CHRONOLOGICAL_SPACING = 400; // Changed from 300 to 400
const PHASE_START_PADDING = 200; // Reduced from 300 to start items closer to phase beginning
const PHASE_PADDING = 200; // Increased from 100 to add more space between phases
const ITEM_IMAGE_SIZE = 60;

const getTagColor = (tag: string) => {
  const tagType = tag.split(' ')[1];
  switch (tagType) {
    case 'CREATIVE':
      return { color: '#d32f2f', borderColor: '#d32f2f' };
    case 'TECHNICAL':
      return { color: '#1976d2', borderColor: '#1976d2' };
    case 'SOCIAL':
      return { color: '#388e3c', borderColor: '#388e3c' };
    case 'INTEGRATION':
      return { color: '#7b1fa2', borderColor: '#7b1fa2' };
    case 'COGNITIVE':
      return { color: '#f57c00', borderColor: '#f57c00' };
    case 'OPERATIONAL':
      return { color: '#0288d1', borderColor: '#0288d1' };
    default:
      return { color: '#757575', borderColor: '#757575' };
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
        <Box>
          <Typography variant="subtitle2">{item.description}</Typography>
          {item.prerequisites && (
            <Box mt={1}>
              <Typography variant="caption" color="textSecondary">
                Prerequisites:
              </Typography>
              {item.prerequisites.map((prereq: string) => (
                <Chip
                  key={prereq}
                  label={prereq}
                  size="small"
                  variant="outlined"
                  sx={{ m: 0.5 }}
                />
              ))}
            </Box>
          )}
        </Box>
      }
      arrow
    >
      <Paper
        elevation={2}
        onMouseEnter={() => onHover(item.name)}
        onMouseLeave={() => onHover(null)}
        sx={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: 280,
          p: 2,
          display: 'flex',
          gap: 2,
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
            zIndex: 10,
          },
          backgroundColor: (theme) => 
            phase === 'phase_1' ? theme.palette.primary.light :
            phase === 'phase_2' ? theme.palette.secondary.light :
            phase === 'phase_3' ? theme.palette.success.light :
            theme.palette.warning.light,
          opacity: 0.9,
          fontWeight: (item.prerequisites || []).includes(highlightedItem) || item.name === highlightedItem ? 'bold' : 'normal',
        }}
      >
        <Box
          sx={{
            width: ITEM_IMAGE_SIZE,
            height: ITEM_IMAGE_SIZE,
            borderRadius: 1,
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
              // Fallback to a colored background if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
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
                borderWidth: '1px',
                borderStyle: 'solid',
                '& .MuiSvgIcon-root': {
                  color: getTagColor(item.tag).color
                }
              }}
            />
          </Box>
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
        position: 'relative',
        overflowX: 'auto',
        overflowY: 'auto',
        height: 'calc(100vh - 64px)',
        width: '100%',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: Object.values(techTree).reduce((acc: number, phase: any) => 
            acc + calculatePhaseWidth(phase), 0) + 300, // Add some extra padding
          height: 2000,
          p: 4,
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
