import React, { useState } from 'react';
import { BrainCircuit, Send, RefreshCw} from 'lucide-react';
import { generateSummary, sendSummaryToSlack } from '../api/todoApi';
import { Todo } from '../types';

interface SummaryPanelProps {
  todos: Todo[];
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ todos }) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);
      const summaryText = await generateSummary();
      setSummary(summaryText);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSendToSlack = async () => {
    if (!summary) return;
    
    try {
      setIsSending(true);
      await sendSummaryToSlack(summary);
    } catch (error) {
      console.error('Error sending to Slack:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const pendingTodos = todos.filter(todo => !todo.completed);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <BrainCircuit className="h-5 w-5 text-blue-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">
          Summary Assistant
        </h2>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Generate a smart summary of your pending tasks using OpenAI, then send it to Slack with one click.
        </p>
        
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className={`w-2 h-2 rounded-full mr-1.5 ${pendingTodos.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>
            {pendingTodos.length === 0 
              ? 'No pending tasks' 
              : `${pendingTodos.length} pending task${pendingTodos.length !== 1 ? 's' : ''}`}
          </span>
        </div>
        
        <button
          onClick={handleGenerateSummary}
          disabled={isGenerating || pendingTodos.length === 0}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="animate-spin h-4 w-4 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <BrainCircuit className="h-4 w-4 mr-2" />
              Generate Summary
            </>
          )}
        </button>
      </div>
      
      {summary && (
        <div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generated Summary
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-sm text-gray-800 dark:text-gray-200">
              {summary.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>
                  {line}
                </p>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleSendToSlack}
            disabled={isSending || !summary}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send to Slack
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            The summary will be posted to your configured Slack channel.
          </p>
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;