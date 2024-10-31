import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import { AIEntity, Connection } from '../../../types/myais';

interface NetworkViewProps {
  entity: AIEntity;
}

const NetworkView: React.FC<NetworkViewProps> = ({ entity }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Network Connections
      </Typography>
      
      <Grid container spacing={2}>
        {entity.connections.map((connection) => (
          <Grid item xs={12} key={connection.targetId}>
            <Card>
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2
              }}>
                <Avatar sx={{ 
                  bgcolor: getConnectionColor(connection.type),
                  width: 48,
                  height: 48
                }}>
                  {connection.targetId[0]}
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <Typography variant="subtitle1">
                      {connection.targetId}
                    </Typography>
                    <Chip 
                      label={connection.type}
                      size="small"
                      sx={{ 
                        backgroundColor: getConnectionColor(connection.type),
                        color: 'white'
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Connection Strength
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={connection.strength}
                    sx={{ 
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getConnectionColor(connection.type)
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {entity.connections.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          color: 'text.secondary'
        }}>
          <Typography>
            No network connections established yet
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const getConnectionColor = (type: Connection['type']): string => {
  const colors = {
    mentor: '#4CAF50',   // Green
    peer: '#2196F3',     // Blue
    student: '#9C27B0'   // Purple
  };
  return colors[type];
};

export default NetworkView;
