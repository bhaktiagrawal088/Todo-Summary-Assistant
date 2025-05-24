import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import Todo from '../models/Todo.js';

dotenv.config();

const router = express.Router();
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

console.log('SLACK_WEBHOOK_URL:', SLACK_WEBHOOK_URL);


router.post('/send-summary', async (req, res) => {
  try {
    const { summary } = req.body;
    
    if (!summary) {
      return res.status(400).json({ message: 'Summary is required' });
    }
    
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });
    
    const message = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "📋 Todo Summary",
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: summary
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `*Progress:* ${completedTodos}/${totalTodos} tasks completed • Generated on ${new Date().toLocaleString()}`
            }
          ]
        }
      ]
    };
    
    await axios.post(SLACK_WEBHOOK_URL, message);
    
    res.json({ message: 'Summary sent to Slack successfully' });
  } catch (error) {
    console.error('Slack error:', error);
    res.status(500).json({ 
      message: 'Failed to send summary to Slack',
      error: error.response?.data || error.message 
    });
  }
});

export default router;