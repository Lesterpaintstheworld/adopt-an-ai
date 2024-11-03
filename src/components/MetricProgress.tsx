import { Box, Typography, LinearProgress } from '@mui/material';
import { COLORS } from '../theme/colors';

interface MetricProgressProps {
  current: string | number | Date;
  target: string | number | Date;
  label: string;
}

const formatDateValue = (value: any): string => {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (typeof value === 'string' && !isNaN(Date.parse(value))) {
    try {
      return new Date(value).toLocaleDateString();
    } catch {
      return value;
    }
  }
  return String(value);
};

export const MetricProgress = ({ current, target, label }: MetricProgressProps) => {
  const parseValue = (value: string | number | Date): number => {
    if (value instanceof Date) {
      return value.getTime();
    }
    if (typeof value === 'number') {
      return value;
    }
    const stringValue = String(value);
    return parseFloat(stringValue.replace('%', '')) || 0;
  };

  const currentValue = parseValue(current);
  const targetValue = parseValue(target);
  const progress = targetValue !== 0 ? (currentValue / targetValue) * 100 : 0;

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2">
          {formatDateValue(current)} / {formatDateValue(target)}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={Math.min(progress, 100)}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: `${COLORS.primary}33`,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: progress >= 100 ? COLORS.secondary : COLORS.primary,
          }
        }}
      />
    </Box>
  );
};

export default MetricProgress;
