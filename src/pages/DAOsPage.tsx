import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { TutorialHighlight } from '../components/tutorial/TutorialHighlight';
import DAOSideMenu from '../components/daos/DAOSideMenu';
import VoteCard from '../components/daos/VoteCard';

// Example data
const daos = [
  { id: 'dao1', name: 'Core Development', memberCount: 150 },
  { id: 'dao2', name: 'Treasury Management', memberCount: 75 },
  { id: 'dao3', name: 'Community Projects', memberCount: 300 },
  { id: 'dao4', name: 'Research & Development', memberCount: 120 },
];

const votes = {
  dao1: [
    {
      id: 'vote1',
      title: 'Implement New AI Training Protocol',
      description: 'Proposal to implement a new training protocol that will improve AI model efficiency by 30%.',
      endDate: '2024-02-01',
      yesVotes: 80,
      noVotes: 20,
      status: 'active' as const,
    },
    {
      id: 'vote2',
      title: 'Upgrade Network Infrastructure',
      description: 'Upgrade our current infrastructure to support increased computational demands.',
      endDate: '2024-01-25',
      yesVotes: 95,
      noVotes: 15,
      status: 'passed' as const,
    }
  ],
  // Add votes for other DAOs...
};

export default function DAOsPage() {
  const [selectedDAO, setSelectedDAO] = useState(daos[0].id);

  const handleVote = (voteId: string, vote: 'yes' | 'no') => {
    console.log(`Voted ${vote} on proposal ${voteId}`);
    // Implement voting logic here
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }}>
      <DAOSideMenu 
        daos={daos}
        selectedDAO={selectedDAO}
        onSelectDAO={setSelectedDAO}
      />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 4,
        overflow: 'auto',
      }}>
        <TutorialHighlight pageKey="DAOs" />
        
        <Typography variant="h4" gutterBottom>
          {daos.find(dao => dao.id === selectedDAO)?.name} Proposals
        </Typography>

        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
          {votes[selectedDAO as keyof typeof votes]?.map((vote) => (
            <VoteCard 
              key={vote.id}
              {...vote}
              onVote={handleVote}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
