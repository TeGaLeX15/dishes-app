import { describe, expect, it } from "vitest";
import { dishSchema } from "../../schemas/dish.schema";

describe("dishSchema", () => {
  it("принимает корректные данные блюда", () => {
    const result = dishSchema.safeParse({
      name: "Паста Карбонара",
      ingredients: "Спагетти, Бекон, Яйцо",
      image: "https://example.com/image.jpg",
      price: 2500,
      cookingTime: 25,
      category: "Паста",
    });

    expect(result.success).toBe(true);
  });

  it("отклоняет слишком короткое название", () => {
    const result = dishSchema.safeParse({
      name: "П",
      ingredients: "Спагетти, Бекон",
      image: "https://example.com/image.jpg",
      price: 2500,
      cookingTime: 25,
      category: "Паста",
    });

    expect(result.success).toBe(false);
  });

  it("отклоняет пустые ингредиенты", () => {
    const result = dishSchema.safeParse({
      name: "Паста",
      ingredients: "",
      image: "https://example.com/image.jpg",
      price: 2500,
      cookingTime: 25,
      category: "Паста",
    });

    expect(result.success).toBe(false);
  });

  it("отклоняет некорректный URL изображения", () => {
    const result = dishSchema.safeParse({
      name: "Паста",
      ingredients: "Спагетти, Бекон",
      image: "not-a-url",
      price: 2500,
      cookingTime: 25,
      category: "Паста",
    });

    expect(result.success).toBe(false);
  });

  it("отклоняет цену, равную нулю", () => {
    const result = dishSchema.safeParse({
      name: "Паста",
      ingredients: "Спагетти, Бекон",
      image: "https://example.com/image.jpg",
      price: 0,
      cookingTime: 25,
      category: "Паста",
    });

    expect(result.success).toBe(false);
  });

  it("отклоняет время приготовления, равное нулю", () => {
    const result = dishSchema.safeParse({
      name: "Паста",
      ingredients: "Спагетти, Бекон",
      image: "https://example.com/image.jpg",
      price: 2500,
      cookingTime: 0,
      category: "Паста",
    });

    expect(result.success).toBe(false);
  });

  it("отклоняет пустую категорию", () => {
    const result = dishSchema.safeParse({
      name: "Паста",
      ingredients: "Спагетти, Бекон",
      image: "https://example.com/image.jpg",
      price: 2500,
      cookingTime: 25,
      category: "",
    });

    expect(result.success).toBe(false);
  });
});
