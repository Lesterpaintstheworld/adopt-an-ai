import { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
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
}));

interface Props {
  systemPrompt: string;
}

export default function AgentChat({ systemPrompt }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
    setMessages(messages => [...messages, { role: 'user', content: input.trim() }]);
    setIsLoading(true);

    try {
      const response = await getChatCompletion(newMessages);
      if (response) {
        setMessages(messages => [...messages, { role: 'assistant', content: response.content || '' }]);
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
              <Typography>{message.content}</Typography>
            </Box>
          )
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </MessageContainer>

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
    </StyledPaper>
  );
}
