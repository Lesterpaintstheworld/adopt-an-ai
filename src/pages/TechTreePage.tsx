import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
} from '@mui/material';

// Constants for layout calculations
const PHASE_WIDTH = 2400;
const ITEM_HEIGHT = 120;
const LAYER_PADDING = 40;
const CHRONOLOGICAL_SPACING = 500;
const PHASE_START_PADDING = 300;

const sortByChronologicalOrder = (a: any, b: any) => {
  return (a.chronologicalOrder || 1) - (b.chronologicalOrder || 1);
};
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsIcon from '@mui/icons-material/Settings';
import techTree from '../../content/tech/tech-tree.yml';

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

// Helper to calculate item positions
const calculateNodePositions = (techTree: any) => {
  const positions: { [key: string]: { x: number, y: number } } = {};
  
  Object.entries(techTree).forEach(([phaseKey, phaseData]: [string, any], phaseIndex) => {
    const layers = Object.entries(phaseData)
      .filter(([key]) => !['name', 'period', 'description'].includes(key));
    
    layers.forEach(([layerKey, items]: [string, any], layerIndex) => {
      // Sort items by chronological order before positioning
      const sortedItems = [...items].sort(sortByChronologicalOrder);
      
      sortedItems.forEach((item: any, itemIndex: number) => {
        const chronologicalOrder = item.chronologicalOrder || itemIndex + 1;
        
        positions[item.name] = {
          x: (phaseIndex * PHASE_WIDTH) + PHASE_START_PADDING + ((chronologicalOrder - 1) * CHRONOLOGICAL_SPACING),
          y: layerIndex * (ITEM_HEIGHT + LAYER_PADDING) + 100
        };
      });
    });
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

          return (
            <path
              key={`${prereq}-${item.name}`}
              d={`
                M${start.x + 280} ${start.y + 40}
                H${start.x + 340}
                C${start.x + 360} ${start.y + 40},
                ${start.x + 360} ${end.y + 40},
                ${start.x + 380} ${end.y + 40}
                H${end.x}
              `}
              stroke={isHighlighted ? "#000" : "#666"}
              strokeWidth={isHighlighted ? "3" : "2"}
              fill="none"
              strokeDasharray={isHighlighted ? "" : "4"}
            />
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
  item: any; 
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight="bold">
            {item.name}
          </Typography>
          <Chip
            icon={getTagIcon(item.tag)}
            label={item.tag.split(' ')[1]}
            size="small"
            variant="outlined"
          />
        </Box>
      </Paper>
    </Tooltip>
  );
};

export const TechTreePage = () => {
  const [positions, setPositions] = useState<any>({});
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setPositions(calculateNodePositions(techTree));
  }, []);

  // Flatten all items for easier processing
  const allItems = Object.entries(techTree).flatMap(([phaseKey, phaseData]: [string, any]) =>
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
          width: Object.keys(techTree).length * 2400 + 600, // Match the new PHASE_WIDTH and add extra padding
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
        {Object.entries(techTree).map(([phaseKey, phaseData]: [string, any], index) => (
          <Typography
            key={phaseKey}
            variant="h5"
            sx={{
              position: 'absolute',
              left: index * PHASE_WIDTH + PHASE_START_PADDING,
              top: 20,
              width: 280,
              textAlign: 'center',
            }}
          >
            {phaseData.name} ({phaseData.period})
          </Typography>
        ))}
      </Box>
    </Box>
  );
};
