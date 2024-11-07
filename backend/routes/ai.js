const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/ai/chat - Send messages to OpenAI
router.post('/chat', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: req.body.messages,
      temperature: req.body.temperature || 0.7,
      max_tokens: req.body.max_tokens || 1000
    });
    res.json(response);
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

module.exports = router;
