import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../lib/axios";
import {
  createDish,
  deleteDish,
  getDish,
  getDishes,
  updateDish,
} from "../../api/dishes";
import type { Dish, DishFormValues } from "../../types/dish";

vi.mock("../../lib/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

const dish: Dish = {
  id: "1",
  name: "Паста Карбонара",
  ingredients: ["Спагетти", "Бекон"],
  image: "https://example.com/pasta.jpg",
  price: 2500,
  cookingTime: 25,
  category: "Паста",
};

const dishData: DishFormValues = {
  name: "Паста Карбонара",
  ingredients: ["Спагетти", "Бекон"],
  image: "https://example.com/pasta.jpg",
  price: 2500,
  cookingTime: 25,
  category: "Паста",
};

describe("dishes API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("получает список блюд", async () => {
    mockedApi.get.mockResolvedValue({
      data: [dish],
    });

    const result = await getDishes();

    expect(result).toEqual([dish]);
    expect(mockedApi.get).toHaveBeenCalledWith("/dishes");
  });

  it("получает блюдо по ID", async () => {
    mockedApi.get.mockResolvedValue({
      data: dish,
    });

    const result = await getDish("1");

    expect(result).toEqual(dish);
    expect(mockedApi.get).toHaveBeenCalledWith("/dishes/1");
  });

  it("создаёт новое блюдо", async () => {
    mockedApi.post.mockResolvedValue({
      data: dish,
    });

    const result = await createDish(dishData);

    expect(result).toEqual(dish);
    expect(mockedApi.post).toHaveBeenCalledWith("/dishes", dishData);
  });

  it("обновляет существующее блюдо", async () => {
    mockedApi.patch.mockResolvedValue({
      data: dish,
    });

    const result = await updateDish("1", dishData);

    expect(result).toEqual(dish);
    expect(mockedApi.patch).toHaveBeenCalledWith("/dishes/1", dishData);
  });

  it("удаляет блюдо", async () => {
    mockedApi.delete.mockResolvedValue({
      data: undefined,
    });

    await deleteDish("1");

    expect(mockedApi.delete).toHaveBeenCalledWith("/dishes/1");
  });
});
