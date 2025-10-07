import { useState, useEffect, useCallback } from "react";
import { todosApi } from "../api/todosApi";

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [allTodos, setAllTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const [totalTodos, setTotalTodos] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  const [localTodos, setLocalTodos] = useState([]);

  const [deletedTodoIds, setDeletedTodoIds] = useState(new Set());

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = (currentPage - 1) * limitPerPage;
      const data = await todosApi.getAllTodos(limitPerPage, skip);
      const filteredTodos = data.todos.filter(
        (todo) => !deletedTodoIds.has(todo.id)
      );
      setTodos(filteredTodos);
      setTotalTodos(data.total - deletedTodoIds.size);

      if (allTodos.length === 0) {
        const allData = await todosApi.getAllTodos(data.total, 0);
        const filteredAllTodos = allData.todos.filter(
          (todo) => !deletedTodoIds.has(todo.id)
        );
        setAllTodos(filteredAllTodos);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limitPerPage, allTodos.length, deletedTodoIds]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const filteredTodos = searchTerm
    ? [...localTodos, ...allTodos].filter((todo) =>
        todo.todo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [...localTodos, ...todos];

  const addTodo = (todoText) => {
    if (!todoText.trim()) return;

    const newTodo = {
      id: Date.now(),
      todo: todoText,
      completed: false,
      userId: 1,
    };

    setLocalTodos((prevLocal) => [newTodo, ...prevLocal]);
  };

  const toggleTodo = async (id) => {
    const isLocalTodo = id > 1000000000000;

    if (isLocalTodo) {
      setLocalTodos((prevLocal) =>
        prevLocal.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      return;
    }

    const todoToUpdate = allTodos.find((todo) => todo.id === id);
    if (!todoToUpdate) {
      console.error("Todo not found:", id);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      setAllTodos((prevAll) =>
        prevAll.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      await todosApi.updateTodo(id, {
        completed: !todoToUpdate.completed,
      });
    } catch (err) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      setAllTodos((prevAll) =>
        prevAll.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const editTodoTitle = async (id, newTitle) => {
    if (!newTitle.trim()) return;

    const isLocalTodo = id > 1000000000000;

    if (isLocalTodo) {
      setLocalTodos((prevLocal) =>
        prevLocal.map((todo) =>
          todo.id === id ? { ...todo, todo: newTitle } : todo
        )
      );
      return;
    }

    const previousTodos = [...todos];
    const previousAllTodos = [...allTodos];
    setIsLoading(true);
    setError(null);

    try {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, todo: newTitle } : todo
        )
      );

      setAllTodos((prevAll) =>
        prevAll.map((todo) =>
          todo.id === id ? { ...todo, todo: newTitle } : todo
        )
      );

      await todosApi.updateTodo(id, { todo: newTitle });
    } catch (err) {
      setTodos(previousTodos);
      setAllTodos(previousAllTodos);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    const isLocalTodo = id > 1000000000000;

    if (isLocalTodo) {
      setLocalTodos((prevLocal) => prevLocal.filter((todo) => todo.id !== id));
      return;
    }

    const previousTodos = [...todos];
    const previousAllTodos = [...allTodos];
    setIsLoading(true);
    setError(null);

    try {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setAllTodos((prevAll) => prevAll.filter((todo) => todo.id !== id));
      setDeletedTodoIds((prev) => new Set([...prev, id]));
      setTotalTodos((prev) => prev - 1);
      await todosApi.deleteTodo(id);
    } catch (err) {
      setTodos(previousTodos);
      setAllTodos(previousAllTodos);
      setDeletedTodoIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setTotalTodos((prev) => prev + 1);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextPage = () => {
    const totalPages = Math.ceil(totalTodos / limitPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const setLimit = (limit) => {
    setLimitPerPage(limit);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalTodos / limitPerPage);

  return {
    todos: filteredTodos,
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
  };
};
