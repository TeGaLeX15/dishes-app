// pages/DishesPage.tsx
import { useMemo, useState } from "react";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getDishes } from "../api/dishes";
import DishCard from "../components/dishes/DishCard";

const DishesPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");

  const {
    data: dishes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  const categories = useMemo(() => {
    if (!dishes) {
      return [];
    }

    return Array.from(new Set(dishes.map((dish) => dish.category)));
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    if (!dishes) {
      return [];
    }

    const normalizedSearch = search.trim().toLowerCase();

    return dishes.filter((dish) => {
      const matchesSearch =
        normalizedSearch === "" ||
        dish.name.toLowerCase().includes(normalizedSearch) ||
        dish.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(normalizedSearch),
        );

      const matchesCategory = category === "Все" || dish.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [dishes, search, category]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-muted">Загрузка блюд...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">
            Не удалось загрузить блюда
          </h1>

          <p className="mt-1 text-sm text-red-700">
            Проверьте подключение к серверу и попробуйте снова.
          </p>
        </div>
      </main>
    );
  }

  if (!dishes || dishes.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-white p-8 text-center">
          <h1 className="text-xl font-semibold">Блюд пока нет</h1>

          <p className="mt-2 text-sm text-muted">
            Добавьте первое блюдо, чтобы оно появилось здесь.
          </p>
        </div>
      </main>
    );
  }

  const hasFilters = search.trim() !== "" || category !== "Все";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-primary">Меню</p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Блюда
          </h1>

          <p className="mt-2 text-muted">Управляйте блюдами вашего меню</p>
        </div>

        <Link
          to="/dishes/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <Plus size={18} />
          Добавить блюдо
        </Link>
      </header>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по названию или ингредиентам..."
            className="h-11 w-full rounded-xl border border-border bg-white pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Очистить поиск"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition-colors hover:bg-slate-100 hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative lg:w-56">
          <SlidersHorizontal
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-border bg-white pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary"
          >
            <option value="Все">Все категории</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredDishes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-10 text-center">
          <h2 className="text-xl font-semibold">Ничего не найдено</h2>

          <p className="mt-2 text-sm text-muted">
            Попробуйте изменить запрос или выбрать другую категорию.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("Все");
              }}
              className="mt-5 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </section>
      )}
    </main>
  );
};

export default DishesPage;
