import express from 'express';
import Todo from '../models/Todo.js';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai'; 

dotenv.config();


const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

console.log('Cohere Key:', process.env.COHERE_API_KEY); 


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ completed: false }).sort({ priority: -1 });

    if (todos.length === 0) {
      return res.json({
        summary: "You have no pending tasks. Great job staying on top of things!"
      });
    }

    const todoText = todos.map(todo => {
      return `- ${todo.title} (Priority: ${todo.priority}, Category: ${todo.category})${todo.description ? ': ' + todo.description : ''}`;
    }).join('\n');

    const prompt = `
Here are my current pending tasks:

${todoText}
Give me a short summary in 3-4 lines:
1. Total tasks
2. summarize the task
3. A quick motivational note
Keep it concise.
`;

    const response = await cohere.generate({
      model: 'command-r-plus',
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7
    });

    const summary = response.generations[0].text.trim();

    console.log('Cohere response:', response);

    res.json({ summary });

    if (!response.generations || response.generations.length === 0) {
  return res.status(500).json({
    message: 'Cohere response did not contain a summary.'
  });
}

  } catch (error) {
    console.error('Summary generation error:', error);

    if (error.statusCode === 429 || error.code === 'insufficient_quota' || error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        message: 'Cohere API quota exceeded. Summary generation temporarily unavailable.'
      });
    }

    res.status(500).json({
      message: 'Failed to generate summary',
      error: error.message || error.toString()
    });
  }
});

export default router;
