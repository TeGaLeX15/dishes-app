// api/dishes.ts
import { api } from "../lib/axios";
import type { Dish, DishFormValues } from "../types/dish";

/**
 * Получение списка всех блюд
 */
export const getDishes = async (): Promise<Dish[]> => {
  const response = await api.get<Dish[]>("/dishes");

  return response.data;
};

/**
 * Получение одного блюдо по ID
 */
export const getDish = async (id: string): Promise<Dish> => {
  const response = await api.get<Dish>(`/dishes/${id}`);

  return response.data;
};

/**
 * Создание нового блюда
 */
export const createDish = async (data: DishFormValues): Promise<Dish> => {
  const response = await api.post<Dish>("/dishes", data);

  return response.data;
};

/**
 * Обновление существующего блюда
 */
export const updateDish = async (
  id: string,
  data: DishFormValues,
): Promise<Dish> => {
  const response = await api.patch<Dish>(`/dishes/${id}`, data);

  return response.data;
};

/**
 * Удаление блюда
 */
export const deleteDish = async (id: string): Promise<void> => {
  await api.delete(`/dishes/${id}`);
};
