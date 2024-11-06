import { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { ChatMessage, getChatCompletion } from '../../utils/openai';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(3),
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  flexDirection: 'column',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  marginBottom: theme.spacing(2),
  '& > div': {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    maxWidth: '80%',
  }
}));

const UserMessage = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginLeft: 'auto',
}));

const AssistantMessage = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginRight: 'auto',
  '& p': {
    margin: 0,
  },
  '& code': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '2px 4px',
    borderRadius: 4,
    fontSize: '0.9em',
  },
  '& pre': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'auto',
    '& code': {
      backgroundColor: 'transparent',
      padding: 0,
    }
  },
  '& ul, & ol': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
  '& h1, & h2, & h3, & h4, & h5, & h6': {
    margin: `${theme.spacing(1)} 0`,
    fontSize: '1em',
    fontWeight: 600,
  },
}));

interface Props {
  systemPrompt: string;
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  showGenerateButton?: boolean;
  onGenerate?: () => void;
}

export default function AgentChat({ 
  systemPrompt, 
  messages, 
  onMessagesChange,
  showGenerateButton = false,
  onGenerate
}: Props) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
      { role: 'user', content: input.trim() }
    ] as ChatMessage[];

    setInput('');
    onMessagesChange([...messages, { role: 'user', content: input.trim() }]);
    setIsLoading(true);

    try {
      const response = await getChatCompletion(newMessages);
      if (response) {
        onMessagesChange([...messages, 
          { role: 'user', content: input.trim() },
          { role: 'assistant', content: response.content || '' }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      
      <MessageContainer>
        {messages.map((message, index) => (
          message.role !== 'system' && (
            <Box
              key={index}
              component={message.role === 'user' ? UserMessage : AssistantMessage}
            >
              {message.role === 'assistant' ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
              ) : (
                <Typography>{message.content}</Typography>
              )}
            </Box>
          )
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </MessageContainer>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            sx={{ minWidth: 100 }}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </Button>
        </Box>
        
        {showGenerateButton && (
          <Button
            variant="contained"
            onClick={onGenerate}
            fullWidth
            sx={{ 
              mt: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            Generate System Prompt
          </Button>
        )}
      </Box>
    </StyledPaper>
  );
}
