import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import DishCard from "../../components/dishes/DishCard";
import type { Dish } from "../../types/dish";

const mockMutate = vi.fn();

vi.mock("../../hooks/useDishMutations", () => ({
  useDeleteDish: () => ({
    mutate: mockMutate,
    isPending: false,
    isError: false,
  }),
}));

const dish: Dish = {
  id: "1",
  name: "Паста Карбонара",
  ingredients: ["Спагетти", "Бекон", "Яйцо", "Пармезан"],
  image: "https://example.com/pasta.jpg",
  price: 2500,
  cookingTime: 25,
  category: "Паста",
};

const renderDishCard = () => {
  return render(
    <MemoryRouter>
      <DishCard dish={dish} />
    </MemoryRouter>,
  );
};

describe("DishCard", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображает информацию о блюде", () => {
    renderDishCard();

    expect(
      screen.getByRole("heading", {
        name: "Паста Карбонара",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Паста")).toBeInTheDocument();

    expect(
      screen.getByText("Спагетти, Бекон, Яйцо, Пармезан"),
    ).toBeInTheDocument();

    expect(screen.getByText("2 500 ₸")).toBeInTheDocument();

    expect(screen.getByText("25 мин.")).toBeInTheDocument();
  });

  it("содержит ссылку на редактирование блюда", () => {
    renderDishCard();

    const editLink = screen.getByRole("link", {
      name: "Редактировать Паста Карбонара",
    });

    expect(editLink).toHaveAttribute("href", "/dishes/1/edit");
  });

  it("удаляет блюдо после подтверждения", () => {
    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(true);

    renderDishCard();

    const deleteButton = screen.getByRole("button", {
      name: "Удалить Паста Карбонара",
    });

    fireEvent.click(deleteButton);

    expect(confirmMock).toHaveBeenCalledWith(
      "Удалить блюдо «Паста Карбонара»?",
    );

    expect(mockMutate).toHaveBeenCalledWith("1");

    confirmMock.mockRestore();
  });

  it("не удаляет блюдо после отмены подтверждения", () => {
    const confirmMock = vi.spyOn(window, "confirm").mockReturnValue(false);

    renderDishCard();

    const deleteButton = screen.getByRole("button", {
      name: "Удалить Паста Карбонара",
    });

    fireEvent.click(deleteButton);

    expect(confirmMock).toHaveBeenCalledWith(
      "Удалить блюдо «Паста Карбонара»?",
    );

    expect(mockMutate).not.toHaveBeenCalled();

    confirmMock.mockRestore();
  });
});
