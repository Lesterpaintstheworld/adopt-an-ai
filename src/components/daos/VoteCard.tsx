import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  LinearProgress,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiButton-root': {
    minWidth: 120,
  }
}));

interface VoteProps {
  id: string;
  title: string;
  description: string;
  endDate: string;
  yesVotes: number;
  noVotes: number;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  onVote?: (voteId: string, vote: 'yes' | 'no') => void;
}

export default function VoteCard({ 
  id,
  title, 
  description, 
  endDate, 
  yesVotes, 
  noVotes,
  status,
  onVote 
}: VoteProps) {
  const totalVotes = yesVotes + noVotes;
  const yesPercentage = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;

  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">{title}</Typography>
          <Chip 
            label={status}
            color={
              status === 'passed' ? 'success' : 
              status === 'rejected' ? 'error' : 
              status === 'active' ? 'primary' : 
              'default'
            }
          />
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Vote Progress
          </Typography>
          <Box sx={{ position: 'relative', height: 8 }}>
            {/* No votes bar (background) */}
            <LinearProgress 
              variant="determinate"
              value={100 - yesPercentage}
              sx={{
                height: '100%',
                borderRadius: 4,
                backgroundColor: 'transparent',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'rgba(255, 0, 0, 0.6)',
                  transform: 'none !important',
                  transition: 'none',
                  right: 0,
                  left: 'unset',
                },
                position: 'absolute',
                width: '100%',
              }}
            />
            {/* Yes votes bar (foreground) */}
            <LinearProgress 
              variant="determinate"
              value={yesPercentage}
              sx={{
                height: '100%',
                borderRadius: 4,
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'rgba(46, 204, 113, 0.8)',
                },
                position: 'absolute',
                width: '100%',
                zIndex: 1,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="success.main">
              Yes: {yesVotes} ({yesPercentage.toFixed(1)}%)
            </Typography>
            <Typography variant="body2" color="error.main">
              No: {noVotes} ({(100 - yesPercentage).toFixed(1)}%)
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Ends on: {new Date(endDate).toLocaleDateString()}
        </Typography>

        {status === 'active' && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="success"
              onClick={() => onVote?.(id, 'yes')}
            >
              Vote YES
            </Button>
            <Button 
              variant="contained" 
              color="error"
              onClick={() => onVote?.(id, 'no')}
            >
              Vote NO
            </Button>
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}
