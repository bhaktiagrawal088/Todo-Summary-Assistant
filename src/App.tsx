import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import SummaryPanel from './components/SummaryPanel';
import Footer from './components/Footer';
import { Todo } from './types';
import { fetchTodos } from './api/todoApi';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    loadTodos();    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);
  
  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTodos();
        setTodos(data);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Toaster position="top-right" />
      <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TodoForm onTodoAdded={loadTodos} />
            <TodoList 
              todos={todos} 
              isLoading={isLoading} 
              onTodoUpdated={loadTodos}
              onTodoDeleted={loadTodos}
            />
          </div>
          
          <div className="lg:col-span-1">
            <SummaryPanel todos={todos} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;