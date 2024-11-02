import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tooltip,
} from '@mui/material';

const sanitizePerkData = (perk: Perk | null): Perk | null => {
  if (!perk) return null;
  
  const sanitized = { ...perk };
  // Convert any object values to strings for safe rendering
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] && typeof sanitized[key] === 'object') {
      sanitized[key] = JSON.stringify(sanitized[key]);
    }
  });
  return sanitized;
};
import { TechTree, PhaseData, Perk, PerkFullData } from '../types/tech';
import PerkDetailModal from '../components/PerkDetailModal';

interface ModalState {
  isOpen: boolean;
  selectedPerk: Perk | null;
  fullData: PerkFullData | null;
}
import { getPerkIconUrl } from '../utils/perkIconUrl';
import CodeIcon from '@mui/icons-material/Code';
import BrushIcon from '@mui/icons-material/Brush';
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsIcon from '@mui/icons-material/Settings';
import techTree from '../../content/tech/tech-tree.yml';

// Constants for layout calculations
const ITEM_HEIGHT = 160;
const LAYER_PADDING = 60;
const CHRONOLOGICAL_SPACING = 400; // Augmenté de 200 à 400 pour plus d'espace horizontal
const PHASE_START_PADDING = 200;
const PHASE_PADDING = 200;

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
  
  Object.entries(techTree).forEach(([_phaseKey, phaseData]: [string, any]) => {
    const phaseWidth = calculatePhaseWidth(phaseData);
    
    // Handle all non-metadata entries (layers)
    Object.entries(phaseData)
      .filter(([key]) => !['name', 'period', 'description'].includes(key))
      .forEach(([_layerKey, items]: [string, any], layerIndex) => {
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


const loadFullPerkData = async (perkId: string): Promise<PerkFullData | null> => {
  try {
    const fullData = await import(`../../content/tech/${perkId}.yml`);
    return fullData.default;
  } catch {
    return null;
  }
};

const mergePerkData = (basicPerk: Perk, fullData: PerkFullData | null): Perk => {
  if (!fullData) return basicPerk;
  
  return {
    ...basicPerk,
    name: fullData.name,
    description: fullData.description.short,
    longDescription: fullData.description.long,
  };
};

interface TechItemProps {
  item: Perk;
  phase: string;
  position: { x: number, y: number };
  onHover: (itemName: string | null) => void;
  highlightedItem: string | null;
  onClick: (perk: Perk) => void;
}

const TechItem = ({ 
  item, 
  phase, 
  position,
  onHover,
  highlightedItem,
  onClick
}: TechItemProps) => {
  const [mergedData, setMergedData] = React.useState<Perk>(item);

  useEffect(() => {
    const loadData = async () => {
      if (item.capability_id) {
        const fullData = await loadFullPerkData(item.capability_id);
        setMergedData(mergePerkData(item, fullData));
      }
    };
    loadData();
  }, [item]);

  return (
    <Paper
        elevation={2}
        onClick={() => onClick(item)}
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
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
            zIndex: 10,
          },
          backgroundColor: () => {
            const alpha = 0.75;
            return phase === 'phase_1' ? `rgba(13, 31, 97, ${alpha})` : // Deep space blue
                   phase === 'phase_2' ? `rgba(16, 37, 114, ${alpha})` : // Slightly lighter deep space blue
                   phase === 'phase_3' ? `rgba(19, 44, 135, ${alpha})` : // Even lighter deep space blue
                   `rgba(22, 51, 160, ${alpha})`; // Lightest deep space blue
          },
          fontWeight: item.name === highlightedItem || (item.prerequisites || []).includes(highlightedItem || '') ? 'bold' : 'normal',
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
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#ffffff' }}>
            {mergedData.name}
          </Typography>
          <Chip
            icon={getTagIcon(mergedData.tag)}
            label={mergedData.tag.split(' ')[1]}
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
  );
};

interface TechTreePageProps {
  standalone?: boolean;
}

const TechTreePage: React.FC<TechTreePageProps> = ({ standalone = false }) => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    selectedPerk: null,
    fullData: null,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePerkClick = async (perk: Perk) => {
    let fullData = null;
    if (perk?.capability_id) {
      fullData = await loadFullPerkData(perk.capability_id);
    }
    setModalState({
      isOpen: true,
      selectedPerk: sanitizePerkData(perk),
      fullData: fullData ? sanitizePerkData(fullData) : null,
    });
  };
  
  useEffect(() => {
    setPositions(calculateNodePositions(techTree));
  }, []);

  // Flatten all items for easier processing
  const allItems = Object.entries(techTree as TechTree).flatMap(([phaseKey, phaseData]: [string, PhaseData]) =>
    Object.entries(phaseData)
      .filter(([key]) => !['name', 'period', 'description'].includes(key))
      .flatMap(([_, items]: [string, any]) => {
        // Sort items within each layer by chronological order
        const sortedItems = [...items].sort(sortByChronologicalOrder);
        return sortedItems.map((item: any) => ({ ...item, phase: phaseKey }));
      })
  );

  return (
    <>
      <Box sx={{ 
        height: '100vh', 
        overflow: 'hidden',
        paddingTop: standalone ? '0' : '64px'
      }}>
        <Box
          ref={containerRef}
          sx={{
            position: 'fixed',
            top: standalone ? 0 : 64,
            left: 0,
            right: 0,
            bottom: 0,
            overflowX: 'auto',
            overflowY: 'auto',
            width: '200vw',
            height: 'calc(200vh - 128px)',
            bgcolor: 'transparent',
            zIndex: 1,
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
                onClick={handlePerkClick}
              />
            ))}

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
      </Box>
      <PerkDetailModal
        open={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        perk={modalState.selectedPerk}
        fullData={modalState.fullData}
      />
    </>
  );
};

export default TechTreePage;
