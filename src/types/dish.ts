// types/dish.ts
export interface Dish {
  id: string;
  name: string;
  ingredients: string[];
  image: string;
  price: number;
  cookingTime: number;
  category: string;
}

export type DishFormValues = Omit<Dish, "id">;