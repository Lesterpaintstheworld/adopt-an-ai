const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const config = require('../config');
const { AppError } = require('../utils/errors');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/ai/chat - Send messages to OpenAI
router.post('/chat', async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: config.openai.defaultModel,
      messages: req.body.messages,
      temperature: req.body.temperature || config.openai.defaultTemperature,
      max_tokens: req.body.max_tokens || config.openai.defaultMaxTokens
    });
    res.json(response);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new AppError('Failed to get AI response', 500, error.message);
  }
});

module.exports = router;
