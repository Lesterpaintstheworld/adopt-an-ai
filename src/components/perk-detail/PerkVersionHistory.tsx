import { FC } from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent } from '@mui/lab';
import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { formatValue } from '../../utils/formatters';
import { COLORS } from '../../theme/colors';
import { PerkVersion } from '../../types/perk';

interface VersionHistoryProps {
  versionHistory: PerkVersion[];
}

export const PerkVersionHistory: FC<VersionHistoryProps> = ({ versionHistory }) => {
  return (
    <Timeline sx={{ 
      [`& .MuiTimelineItem-root:before`]: {
        flex: 0,
        padding: 0
      }
    }}>
      {versionHistory?.map((version, index) => (
        <TimelineItem key={index} sx={{ minHeight: 'auto' }}>
          <TimelineSeparator>
            <TimelineDot 
              color={index === 0 ? "primary" : "grey"} 
              sx={{ my: 0.5 }}
            />
            {index < (versionHistory?.length ?? 0) - 1 && (
              <TimelineConnector />
            )}
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Version {formatValue(version.version)} - {formatValue(version.date)}
            </Typography>
            <List dense sx={{ py: 0 }}>
              {version.changes.map((change: string, changeIndex: number) => (
                <ListItem key={changeIndex} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 8 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={change}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { color: COLORS.text.secondary }
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Typography 
              variant="caption" 
              sx={{ 
                color: COLORS.text.secondary,
                display: 'block',
                mt: 0.5 
              }}
            >
              Reviewed by: {formatValue(version.reviewed_by)}
              {version.approved_by && ` | Approved by: ${formatValue(version.approved_by)}`}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
