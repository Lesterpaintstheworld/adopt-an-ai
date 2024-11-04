import React, { useState, useEffect, useRef } from 'react';
import IconLoader from '../components/IconLoader';
import {
  Box,
  Typography,
  Paper,
  Chip,
} from '@mui/material';

import { TechTree, PhaseData, Perk, PerkFullData } from '../types/tech';
import YamlModal from '../components/YamlModal';

const isPerk = (item: unknown): item is Perk => {
  return item !== null && 
         typeof item === 'object' && 
         'capability_id' in item &&
         'name' in item;
};

const isPhaseData = (data: unknown): data is PhaseData => {
  return data !== null && 
         typeof data === 'object' && 
         'name' in data &&
         'period' in data;
};

interface ModalState {
  isOpen: boolean;
  data: any | null;
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

  // Handle primitive types directly
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);

  // Handle arrays by recursively converting elements and joining
  if (Array.isArray(value)) {
    return value.map(item => safeToString(item)).filter(Boolean).join(', ');
  }

  // Handle objects
  if (typeof value === 'object') {
    // Handle Date objects
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    // Handle specific object structures
    if ('implementation' in value && 'requirement' in value) {
      return `${safeToString(value.implementation)} - ${safeToString(value.requirement)}`;
    }

    if ('description' in value && 'requirements' in value) {
      return `${safeToString(value.description)} (${safeToString(value.requirements)})`;
    }

    if ('description' in value) {
      return safeToString(value.description);
    }

    if ('name' in value) {
      return safeToString(value.name);
    }

    if ('long' in value) {
      return safeToString(value.long);
    }

    if ('short' in value) {
      return safeToString(value.short);
    }

    // Handle objects with a single Phase key
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0].startsWith('Phase')) {
      return `${keys[0]}: ${safeToString(value[keys[0]])}`;
    }

    // For other objects, try to get a meaningful string representation
    try {
      // Convert object values to string and join them
      return Object.values(value)
        .map(v => safeToString(v))
        .filter(Boolean)
        .join(' - ');
    } catch {
      // Last resort - try direct string conversion
      try {
        return String(value);
      } catch {
        return '[Complex Object]';
      }
    }
  }

  // Final fallback
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
const calculateNodePositions = (techTree: TechTree) => {
  const positions: { [key: string]: { x: number, y: number } } = {};
  let currentX = 0;
  
  Object.entries(techTree).forEach(([_phaseKey, phaseData]: [string, PhaseData]) => {
    const phaseWidth = calculatePhaseWidth(phaseData);
    
    Object.entries(phaseData)
      .filter(([key]) => !['name', 'period', 'description'].includes(key))
      .forEach(([_layerKey, items]: [string, any], layerIndex) => {
        if (Array.isArray(items)) {
          items.forEach((item: Perk) => {
            if (!item.capability_id) {
              console.warn(`Missing capability_id for item: ${item.name}`);
            }
            
            positions[item.capability_id] = {
              x: currentX + ((item.chronologicalOrder || 1) * CHRONOLOGICAL_SPACING),
              y: layerIndex * (ITEM_HEIGHT + LAYER_PADDING) + 100
            };
          });
        }
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
  const CORNER_RADIUS = 24; // Radius for rounded corners

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
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
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
                stroke={isHighlighted ? "#4fc3f7" : "rgba(255,255,255,0.3)"}
                strokeWidth={isHighlighted ? "3" : "2"}
                fill="none"
                strokeDasharray={isHighlighted ? "" : "6,3"}
                filter={isHighlighted ? "url(#glow)" : "none"}
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
    // Find the item in the tech tree with proper type assertions
    const item = Object.values(techTree as TechTree).flatMap(phase => 
      Object.entries(phase as PhaseData)
        .filter(([key]) => !['name', 'period', 'description'].includes(key))
        .flatMap(([_, items]) => items as Perk[])
    ).find(item => item.capability_id === perkId);

    if (!item?.file_base_name) {
      console.warn(`No file_base_name found for perk ${perkId}`);
      return null;
    }

    // Use file_base_name to load the file
    const modules = import.meta.glob('../../content/tech/*.yml', { eager: true }) as Record<string, { default: PerkFullData }>;
    const path = `../../content/tech/${item.file_base_name}.yml`;
    
    if (path in modules) {
      const module = modules[path];
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
        elevation={3}
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
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            zIndex: 10,
          },
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          borderRadius: '12px',
          border: highlightedItem === item.capability_id ? 
            '2px solid #4fc3f7' :
            '1px solid rgba(255, 255, 255, 0.1)',
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
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          padding: 3,
          gap: 1
        }}>
          <Typography 
            variant="subtitle1" 
            fontWeight="bold" 
            sx={{ 
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0,0,0,0.6)',
              fontSize: '1.1rem',
              lineHeight: 1.2
            }}
          >
            {mergedData.name}
          </Typography>
          <Chip
            icon={getTagIcon(mergedData.tag)}
            label={mergedData.tag.split(' ')[1]}
            size="small"
            variant="filled"
            sx={{
              ...getTagColor(item.tag),
              '& .MuiChip-icon': {
                color: '#ffffff',
                marginLeft: '8px',
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
              },
              borderRadius: '16px',
              fontWeight: 600,
              height: '32px',
              minWidth: '140px',
              paddingLeft: '12px',
              paddingRight: '12px',
              fontSize: '0.9rem',
              marginTop: 'auto',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              letterSpacing: '0.5px'
            }}
          />
        </Box>
      </Paper>
  );
};

interface TechTreePageProps {
  standalone?: boolean;
}

const TechTreePage = ({ standalone = false }: TechTreePageProps): JSX.Element => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    data: null
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePerkClick = async (perk: Perk) => {
    if (!perk) return;
    
    try {
      let fullData = null;
      if (perk.capability_id) {
        fullData = await loadFullPerkData(perk.capability_id);
      }
      
      setModalState({
        isOpen: true,
        data: fullData || perk
      });
    } catch (error) {
      console.error('Error handling perk click:', error);
    }
  };
  
  const validateTechTree = (techTree: TechTree) => {
    const seenIds = new Set();
    const errors: string[] = [];

    Object.entries(techTree).forEach(([phaseKey, phaseData]) => {
      if (!isPhaseData(phaseData)) return;

      Object.entries(phaseData)
        .filter(([key]) => !['name', 'period', 'description'].includes(key))
        .forEach(([layerKey, items]) => {
          if (Array.isArray(items)) {
            items.forEach(item => {
              if (isPerk(item)) {
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

  // Get all unique items from tech tree with phase and layer info
  const allItems = React.useMemo(() => {
    const seen = new Set<string>();
    return Object.entries(techTree as TechTree).flatMap(([phaseKey, phaseData]: [string, PhaseData]) =>
      Object.entries(phaseData)
        .filter(([key]) => !['name', 'period', 'description'].includes(key))
        .flatMap(([layerKey, items]: [string, any]) => {
          if (!Array.isArray(items)) return [];
          
          return items
            .filter((item: Perk) => {
              if (!item.capability_id) return false;
              if (seen.has(item.capability_id)) {
                console.warn(`Duplicate capability_id found: ${item.capability_id} in ${phaseKey}/${layerKey}`);
                return false;
              }
              seen.add(item.capability_id);
              return true;
            })
            .map((item: Perk) => ({
              ...item,
              phase: phaseKey,
              layer: layerKey
            }))
            .sort(sortByChronologicalOrder);
        })
    );
  }, []);

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
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                url(/website/convergence-dark.png)
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
                pointerEvents: 'none'
              }
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

              // Debug logging
              console.log('Phase data:', phaseData);
              console.log('Raw name:', phaseData.name);
              console.log('Raw period:', phaseData.period);

              // Extra defensive conversion
              let phaseName = '';
              let phasePeriod = '';

              try {
                // Handle name
                if (typeof phaseData.name === 'object') {
                  console.log('Name is object:', phaseData.name);
                  phaseName = safeToString(phaseData.name);
                } else {
                  phaseName = String(phaseData.name || '');
                }

                // Handle period
                if (typeof phaseData.period === 'object') {
                  console.log('Period is object:', phaseData.period);
                  phasePeriod = safeToString(phaseData.period);
                } else {
                  phasePeriod = String(phaseData.period || '');
                }

                // Final safety check
                if (typeof phaseName !== 'string') phaseName = '[Invalid Name]';
                if (typeof phasePeriod !== 'string') phasePeriod = '[Invalid Period]';

                console.log('Processed name:', phaseName);
                console.log('Processed period:', phasePeriod);

              } catch (error) {
                console.error('Error processing phase data:', error);
                phaseName = '[Error]';
                phasePeriod = '';
              }

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
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {`${phaseName} (${phasePeriod})`}
                </Typography>
              );
            })}
          </Box>
        </Box>
      </Box>
      <YamlModal
        open={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        title={modalState.data?.name || 'Perk Details'}
        data={modalState.data}
      />
    </>
  );
};

export default TechTreePage;
