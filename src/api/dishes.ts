// api/dishes.ts
import { api } from "../lib/axios";
import type { Dish, DishFormValues } from "../types/dish";

/**
 * Получает список всех блюд.
 */
export const getDishes = async (): Promise<Dish[]> => {
  const response = await api.get<Dish[]>("/dishes");

  return response.data;
};

/**
 * Получает одно блюдо по ID.
 */
export const getDish = async (id: string): Promise<Dish> => {
  const response = await api.get<Dish>(`/dishes/${id}`);

  return response.data;
};

/**
 * Создаёт новое блюдо.
 */
export const createDish = async (
  data: DishFormValues,
): Promise<Dish> => {
  const response = await api.post<Dish>("/dishes", data);

  return response.data;
};

/**
 * Обновляет существующее блюдо.
 */
export const updateDish = async (
  id: string,
  data: DishFormValues,
): Promise<Dish> => {
  const response = await api.patch<Dish>(`/dishes/${id}`, data);

  return response.data;
};

/**
 * Удаляет блюдо.
 */
export const deleteDish = async (id: string): Promise<void> => {
  await api.delete(`/dishes/${id}`);
};