import axios from 'axios';
import { Todo, TodoFormData } from '../types';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:3004/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const handleError = (error : any , message: string) => {
  console.error(message, error);
  toast.error(error.response?.data?.message || message);
  throw error;
};

export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await api.get('/todos');
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to fetch todos');
  }
};

export const createTodo = async (todoData: TodoFormData): Promise<Todo> => {
  try {
    const response = await api.post('/todos', todoData);
    toast.success('Todo added successfully');
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to create todo');
  }
};

export const updateTodo = async (id: string, todoData: Partial<TodoFormData> | { completed: boolean }): Promise<Todo> => {
  try {
    const response = await api.patch(`/todos/${id}`, todoData);
    toast.success('Todo updated successfully');
    return response.data;
  } catch (error) {
    return handleError(error, 'Failed to update todo');
  }
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await api.delete(`/todos/${id}`);
    toast.success('Todo deleted successfully');
  } catch (error) {
    handleError(error, 'Failed to delete todo');
  }
};

export const generateSummary = async (): Promise<string> => {
  try {
    const response = await api.get('/summary');
    return response.data.summary;
  } catch (error) {
    return handleError(error, 'Failed to generate summary');
  }
};

export const sendSummaryToSlack = async (summary: string): Promise<void> => {
  try {
    await api.post('/slack/send-summary', { summary });
    toast.success('Summary sent to Slack!');
  } catch (error) {
    handleError(error, 'Failed to send summary to Slack');
  }
};