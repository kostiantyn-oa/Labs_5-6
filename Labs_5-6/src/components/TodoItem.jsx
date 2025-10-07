import React, { useState } from "react";
import "../styles/TodoItem.css";

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.todo);

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== todo.todo) {
      onEdit(todo.id, editedTitle);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(todo.todo);
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={isEditing}
        />
        {isEditing ? (
          <input
            type="text"
            className="todo-edit-input"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
        ) : (
          <span className="todo-text">{todo.todo}</span>
        )}
      </div>
      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              className="save-button"
              onClick={handleSave}
              aria-label="Зберегти зміни"
            >
              ✓
            </button>
            <button
              className="cancel-button"
              onClick={handleCancel}
              aria-label="Скасувати редагування"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              className="edit-button"
              onClick={() => setIsEditing(true)}
              aria-label="Редагувати завдання"
            >
              ✏️
            </button>
            <button
              className="delete-button"
              onClick={() => onDelete(todo.id)}
              aria-label="Видалити завдання"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};