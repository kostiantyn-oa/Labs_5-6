import axios from "axios";

const BASE_URL = "https://dummyjson.com/todos";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const todosApi = {
  getAllTodos: async (limit = 10, skip = 0) => {
    try {
      const response = await apiClient.get(`?limit=${limit}&skip=${skip}`);
      return {
        todos: response.data.todos,
        total: response.data.total,
        limit: response.data.limit,
        skip: response.data.skip,
      };
    } catch (error) {
      throw new Error(`Помилка завантаження todos: ${error.message}`);
    }
  },

  addTodo: async (todoData) => {
    try {
      const response = await apiClient.post("/add", todoData);
      return response.data;
    } catch (error) {
      throw new Error(`Помилка додавання todo: ${error.message}`);
    }
  },

  updateTodo: async (id, todoData) => {
    try {
      const response = await apiClient.put(`/${id}`, todoData);
      return response.data;
    } catch (error) {
      throw new Error(`Помилка оновлення todo: ${error.message}`);
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await apiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Помилка видалення todo: ${error.message}`);
    }
  },
};
