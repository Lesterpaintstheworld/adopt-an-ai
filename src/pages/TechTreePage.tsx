import React, { useState, useEffect, useRef, FC } from 'react';
import { SxProps } from '@mui/system';

import IconLoader from '../components/IconLoader';
import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material';

import { TechTree, PhaseData, Perk, PerkFullData } from '../types/tech';
import PerkDetailModal from '../components/PerkDetailModal';

interface ModalState {
  isOpen: boolean;
  selectedPerk: Perk | null;
  fullData: PerkFullData | null;
}
import { getPerkIconUrl } from '../utils/iconUtils';
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

const safeToString = (value: any): string => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return '';
  }

  // Handle primitive types
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(safeToString).join(', ');
  }

  // Handle objects
  if (typeof value === 'object') {
    // Handle Date objects
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    // Handle objects with implementation/requirement
    if ('implementation' in value && 'requirement' in value) {
      return `${safeToString(value.implementation)}: ${safeToString(value.requirement)}`;
    }

    // Handle objects with description fields
    if ('description' in value) {
      return safeToString(value.description);
    }

    // Handle objects with name fields
    if ('name' in value) {
      return safeToString(value.name);
    }

    // Handle objects with long/short descriptions
    if ('long' in value) return safeToString(value.long);
    if ('short' in value) return safeToString(value.short);

    // Handle objects with single Phase key
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0].startsWith('Phase')) {
      return `${keys[0]}: ${safeToString(value[keys[0]])}`;
    }

    // For other objects, try to get a meaningful string representation
    try {
      return Object.values(value)
        .map(v => safeToString(v))
        .filter(Boolean)
        .join(' - ');
    } catch {
      return '[Complex Object]';
    }
  }

  // Fallback - try to convert to string
  try {
    return String(value);
  } catch {
    return '[Unknown Value]';
  }
};

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
  let currentX = 0;
  
  Object.entries(techTree).forEach(([_phaseKey, phaseData]: [string, any]) => {
    const phaseWidth = calculatePhaseWidth(phaseData);
    
    Object.entries(phaseData)
      .filter(([key]) => !['name', 'period', 'description'].includes(key))
      .forEach(([_layerKey, items]: [string, any], layerIndex) => {
        items.forEach((item: any) => {
          if (!item.capability_id) {
            console.warn(`Missing capability_id for item: ${item.name}`);
          }
          
          positions[item.capability_id] = {
            x: currentX + ((item.chronologicalOrder || 1) * CHRONOLOGICAL_SPACING),
            y: layerIndex * (ITEM_HEIGHT + LAYER_PADDING) + 100
          };
        });
      });
    
    currentX += phaseWidth;
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
        item.prerequisites?.map((prereq: string, prereqIndex: number) => {
          const prereqItem = items.find(i => i.name === prereq);
          if (!prereqItem) return null;

          const start = positions[prereqItem.capability_id];
          const end = positions[item.capability_id];
          if (!start || !end) return null;

          const isHighlighted = 
            highlightedItem === item.capability_id || 
            highlightedItem === prereqItem.capability_id;

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
            <g key={`${prereqItem.capability_id}-to-${item.capability_id}-${prereqIndex}`}>
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
    // Find the item in the tech tree
    const item = Object.values(techTree).flatMap(phase => 
      Object.entries(phase)
        .filter(([key]) => !['name', 'period', 'description'].includes(key))
        .flatMap(([_, items]) => items)
    ).find(item => item.capability_id === perkId);

    if (!item?.file_base_name) {
      console.warn(`No file_base_name found for perk ${perkId}`);
      return null;
    }

    // Use file_base_name to load the file
    const modules = import.meta.glob('../../content/tech/*.yml', { eager: true });
    const path = `../../content/tech/${item.file_base_name}.yml`;
    
    console.log('Trying to load perk details from:', path);
    console.log('Available modules:', Object.keys(modules));
    
    if (path in modules) {
      const module = modules[path];
      console.log('Loaded module:', module);
      return module.default;
    }
    
    console.warn(`No detail file found at path: ${path}`);
    return null;
  } catch (error) {
    console.error(`Error loading perk data for ${perkId}:`, error);
    return null;
  }
};

const mergePerkData = (basicPerk: Perk, fullData: PerkFullData | null): Perk => {
  if (!fullData) return basicPerk;
  
  return {
    ...basicPerk,
    name: fullData.name,
    description: typeof fullData.description === 'object' 
      ? fullData.description.short  // TypeScript now knows this is PerkDescription
      : fullData.description,
  };
};

interface TechItemProps {
  item: Perk;
  position: { x: number, y: number };
  onHover: (itemName: string | null) => void;
  highlightedItem: string | null;
  onClick: (perk: Perk) => void;
  allItems: Perk[]; // Added allItems prop
}

const TechItem = ({ 
  item, 
  position,
  onHover,
  highlightedItem,
  onClick,
  allItems
}: TechItemProps) => {
  const [mergedData, setMergedData] = React.useState<Perk>(item);

  useEffect(() => {
    const loadData = async () => {
      if (item.capability_id) {
        const fullData = await loadFullPerkData(item.capability_id, allItems);
        setMergedData(mergePerkData(item, fullData));
      }
    };
    loadData();
  }, [item, allItems]);

  return (
    <Paper
        elevation={2}
        onClick={() => onClick(item)}
        onMouseEnter={() => onHover(item.capability_id)}
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
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // All boxes are black with 75% opacity
          fontWeight: item.capability_id === highlightedItem || 
                     (item.prerequisites || []).some(prereq => {
                       const prereqItem = allItems.find(i => i.name === prereq);
                       return prereqItem?.capability_id === highlightedItem;
                     })
                     ? 'bold' : 'normal',
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
          <IconLoader
            perk={item}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
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
    if (!perk) return;
    
    console.log('Loading details for perk:', perk);
    
    try {
      let fullData = null;
      if (perk.capability_id) {
        fullData = await loadFullPerkData(perk.capability_id);
        console.log('Loaded full data:', fullData);
      }
      
      // Create safe copies of the data before setting state
      const sanitizedPerk = { ...perk };
      const sanitizedFullData = fullData ? { ...fullData } : null;
      
      console.log('Setting modal state with:', {
        sanitizedPerk,
        sanitizedFullData
      });
      
      setModalState({
        isOpen: true,
        selectedPerk: sanitizedPerk,
        fullData: sanitizedFullData,
      });
    } catch (error) {
      console.error('Error handling perk click:', error);
    }
  };
  
  const validateTechTree = (techTree: TechTree) => {
    const seenIds = new Set();
    const errors: string[] = [];

    Object.entries(techTree).forEach(([phaseKey, phaseData]) => {
      Object.entries(phaseData).forEach(([layerKey, items]) => {
        if (Array.isArray(items)) {
          items.forEach((item: any) => {
            if (item.capability_id) {
              if (seenIds.has(item.capability_id)) {
                errors.push(`Duplicate capability_id found: ${item.capability_id} in ${phaseKey}/${layerKey}`);
              }
              seenIds.add(item.capability_id);
            }
          });
        }
      });
    });

    if (errors.length > 0) {
      console.error('Tech Tree validation errors:', errors);
    }
    
    return errors.length === 0;
  };

  useEffect(() => {
    validateTechTree(techTree);
    setPositions(calculateNodePositions(techTree));
  }, []);

  // Flatten all items for easier processing while avoiding duplicates
  const allItems = Object.entries(techTree as TechTree).flatMap(([phaseKey, phaseData]: [string, PhaseData]) => {
    const layerItems = Object.entries(phaseData)
      .filter(([key]) => !['name', 'period', 'description'].includes(key))
      .flatMap(([layerKey, items]: [string, any]) => {
        // Verify items is an array
        if (!Array.isArray(items)) return [];
        
        // Filter duplicates based on capability_id
        const uniqueItems = items.reduce((acc: any[], item: any) => {
          if (!acc.some(existingItem => existingItem.capability_id === item.capability_id)) {
            acc.push({ ...item, phase: phaseKey, layer: layerKey });
          } else {
            console.warn(`Duplicate capability_id found: ${item.capability_id} in ${phaseKey}/${layerKey}`);
          }
          return acc;
        }, []);
        
        return uniqueItems.sort(sortByChronologicalOrder);
      });
      
    return layerItems;
  });

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
            
            {allItems.map((item) => {
              if (!item.capability_id) {
                console.warn('Item missing capability_id:', item);
                return null;
              }
              
              return (
                <TechItem
                  key={`${item.phase}-${item.layer}-${item.capability_id}`}
                  item={item}
                  position={positions[item.capability_id] || { x: 0, y: 0 }}
                  onHover={(itemId) => setHighlightedItem(itemId)}
                  highlightedItem={highlightedItem}
                  onClick={handlePerkClick}
                  allItems={allItems}
                />
              );
            })}

            {Object.entries(techTree).map(([phaseKey, phaseData]: [string, PhaseData], index) => {
              const previousPhases = Object.values(techTree).slice(0, index);
              const xPosition = previousPhases.reduce((acc: number, phase: any) => {
                return acc + calculatePhaseWidth(phase);
              }, 0);

              // Extract and format name and period separately
              const phaseName = safeToString(phaseData.name || '');
              const phasePeriod = safeToString(phaseData.period || '');

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
                  {phaseName} ({phasePeriod})
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
