// schemas/dish.schema.ts
import { z } from "zod";

export const dishSchema = z.object({
  name: z.string().trim().min(2, "Название должно содержать минимум 2 символа"),

  ingredients: z.string().trim().min(2, "Укажите ингредиенты"),

  image: z.string().trim().url("Введите корректный URL изображения"),

  price: z
    .number({
      error: "Введите цену",
    })
    .positive("Цена должна быть больше 0"),

  cookingTime: z
    .number({
      error: "Введите время приготовления",
    })
    .int("Время должно быть целым числом")
    .positive("Время должно быть больше 0"),

  category: z.string().trim().min(1, "Выберите категорию"),
});

export type DishFormSchema = z.infer<typeof dishSchema>;
