import React from 'react';
import { ClipboardList, Loader } from 'lucide-react';
import TodoItem from './TodoItem';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onTodoUpdated: () => void;
  onTodoDeleted: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ 
  todos, 
  isLoading, 
  onTodoUpdated, 
  onTodoDeleted 
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  if (todos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <ClipboardList className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tasks yet</h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Get started by adding your first task using the form above.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      {activeTodos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
            Active Tasks ({activeTodos.length})
          </h2>
          
          <div>
            {activeTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onTodoUpdated={onTodoUpdated}
                onTodoDeleted={onTodoDeleted}
              />
            ))}
          </div>
        </div>
      )}
      
      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
            Completed ({completedTodos.length})
          </h2>
          
          <div>
            {completedTodos.map(todo => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onTodoUpdated={onTodoUpdated}
                onTodoDeleted={onTodoDeleted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;