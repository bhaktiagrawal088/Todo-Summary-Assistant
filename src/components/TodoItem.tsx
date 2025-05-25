import React, { useState } from 'react';
import { Check, Edit, Trash2, X, Save } from 'lucide-react';
import { Todo, TodoFormData } from '../types';
import { updateTodo, deleteTodo } from '../api/todoApi';

interface TodoItemProps {
  todo: Todo;
  onTodoUpdated: () => void;
  onTodoDeleted: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onTodoUpdated, onTodoDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<TodoFormData>>({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    category: todo.category
  });
  
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };
  
  const handleToggleComplete = async () => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed });
      onTodoUpdated();
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTodo(todo._id);
        onTodoDeleted();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    if (!editFormData.title?.trim()) {
      return;
    }
    
    try {
      await updateTodo(todo._id, editFormData);
      setIsEditing(false);
      onTodoUpdated();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`border rounded-lg p-4 mb-3 transition-all duration-200 ${
      todo.completed 
        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
    }`}>
      {isEditing ? (
        // Edit mode
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            value={editFormData.title}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Task title"
            required
          />
          
          <textarea
            name="description"
            value={editFormData.description}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Task description"
            rows={3}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <select
                name="priority"
                value={editFormData.priority}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <input
                type="text"
                name="category"
                value={editFormData.category}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Category"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <>
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <button
                onClick={handleToggleComplete}
                className={`h-5 w-5 rounded-full border ${
                  todo.completed 
                    ? 'bg-green-500 border-green-500 dark:bg-green-600 dark:border-green-600' 
                    : 'border-gray-300 dark:border-gray-600'
                } flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {todo.completed && <Check className="h-3 w-3 text-white" />}
              </button>
            </div>
            
            <div className="ml-3 flex-1">
              <h3 className={`text-base font-medium ${
                todo.completed 
                  ? 'text-gray-500 dark:text-gray-400 line-through' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`mt-1 text-sm ${
                  todo.completed 
                    ? 'text-gray-500 dark:text-gray-500' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {todo.description}
                </p>
              )}
              
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
                
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {todo.category}
                </span>
                
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Updated: {formatDate(todo.updatedAt)}
                </span>
              </div>
            </div>
            
            <div className="ml-4 flex-shrink-0 flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-full p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Edit todo"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleDelete}
                className="rounded-full p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-label="Delete todo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;