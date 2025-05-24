
import { useState } from "react";
import { Todo } from "../types";
import { Edit, Save, Trash2, X } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
}

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  high: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
};

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);

  const handleSave = () => {
    onUpdate({ ...todo, title: editedTitle, description: editedDescription });
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const toggleComplete = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  return (
    <div
      className={`border rounded-xl p-5 mb-4 shadow-sm transition-all duration-300 ease-in-out transform hover:scale-[1.01] ${
        todo.completed
          ? "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 opacity-80"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <input
  type="checkbox"
  checked={todo.completed}
  onChange={toggleComplete}
  className="mt-1 w-5 h-5 accent-blue-600 rounded border-gray-300 focus:ring-blue-500"
/>

          <div className="flex flex-col">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-lg font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={2}
                  className="mt-2 text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-600 dark:text-gray-300"
                />
              </>
            ) : (
              <>
                <h3
                  className={`text-lg font-semibold tracking-tight ${
                    todo.completed
                      ? "text-gray-500 dark:text-gray-400 line-through"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p
                    className={`mt-1 text-sm leading-snug ${
                      todo.completed
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {todo.description}
                  </p>
                )}
              </>
            )}
            <div className="mt-3 flex gap-2">
              <span
                className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${priorityColors[todo.priority]} shadow-sm`}
              >
                {todo.priority}
              </span>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 shadow-sm">
                {todo.category}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-md p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
                aria-label="Edit todo"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 transition"
                aria-label="Delete todo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
