import { useTodos } from "../hooks/useTodos";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";
import { SearchBar } from "./SearchBar";
import { Pagination } from "./Pagination";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import "../styles/TodoList.css";

export const TodoList = () => {
  const {
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodoTitle,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    limitPerPage,
    totalTodos,
    goToNextPage,
    goToPrevPage,
    setLimit,
  } = useTodos();

  return (
    <div className="todo-list-container">
      <h1 className="todo-title">📝 Мій список справ</h1>
      <TodoForm onAddTodo={addTodo} />
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {error && <ErrorMessage message={error} />}

      {isLoading && todos.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="todos-wrapper">
            {todos.length === 0 ? (
              <p className="empty-message">
                {searchTerm
                  ? "Нічого не знайдено. Спробуйте інший запит."
                  : "Немає завдань. Додайте нове!"}
              </p>
            ) : (
              <div className="todos-list">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodoTitle}
                  />
                ))}
              </div>
            )}
          </div>

          {!searchTerm && totalTodos > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNextPage={goToNextPage}
              onPrevPage={goToPrevPage}
              limitPerPage={limitPerPage}
              onLimitChange={setLimit}
              totalTodos={totalTodos}
            />
          )}

          <div className="todos-stats">
            <p>Всього завдань: {todos.length}</p>
            <p>Виконано: {todos.filter((t) => t.completed).length}</p>
            <p>Залишилось: {todos.filter((t) => !t.completed).length}</p>
          </div>
        </>
      )}
    </div>
  );
};
