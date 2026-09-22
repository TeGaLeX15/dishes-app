// pages/DishesPage.tsx
import { useMemo, useState } from "react";
import { ChevronDown, ListFilter, Plus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDishes } from "../api/dishes";
import DishCard from "../components/dishes/DishCard";

const DishSkeleton = () => {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="aspect-[16/10] animate-pulse bg-slate-200" />

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-5 w-20 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="border-t border-border pt-4">
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </article>
  );
};

const DishesPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");

  // Получение списка блюд с сервера
  const {
    data: dishes,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  // Формирование списка уникальных категорий из API
  const categories = useMemo(() => {
    if (!dishes) {
      return [];
    }

    return Array.from(new Set(dishes.map((dish) => dish.category)));
  }, [dishes]);

  // Фильтрация блюд по поиску и категории
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
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-200" />
        </header>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row">
          <div className="h-11 flex-1 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-11 lg:w-56 animate-pulse rounded-xl bg-slate-200" />
        </div>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DishSkeleton />
          <DishSkeleton />
          <DishSkeleton />
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
              !
            </div>

            <div>
              <h1 className="text-lg font-semibold text-red-900">
                Не удалось загрузить блюда
              </h1>

              <p className="mt-1 text-sm leading-5 text-red-700">
                Проверьте подключение к серверу и попробуйте снова.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/30 active:scale-[0.98]"
              >
                Повторить
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!dishes || dishes.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-green-50 text-primary">
            <Plus size={26} />
          </div>

          <h1 className="mt-5 text-xl font-semibold">Блюд пока нет</h1>

          <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
            Добавьте первое блюдо, чтобы начать формировать меню.
          </p>

          <Link
            to="/dishes/new"
            className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold !text-white shadow-sm transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98]"
          >
            <Plus size={18} />
            Добавить блюдо
          </Link>
        </div>
      </main>
    );
  }

  const hasFilters = search.trim() !== "" || category !== "Все";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="sticky top-0 z-10 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Блюда
            </h1>

            <p className="mt-1 text-sm text-muted sm:text-base">
              Показано {filteredDishes.length} из {dishes.length}{" "}
              {dishes.length === 1 ? "блюда" : "блюд"}
            </p>
          </div>

          <Link
            to="/dishes/new"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold !text-white shadow-sm transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98]"
          >
            <Plus size={18} />
            Добавить блюдо
          </Link>
        </div>
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
            className="h-11 w-full rounded-xl border border-border bg-white pl-11 pr-11 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Очистить поиск"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition-colors hover:bg-slate-100 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative lg:w-56">
          <ListFilter
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Фильтр по категории"
            className="h-11 w-full appearance-none rounded-xl border border-border bg-white pl-11 pr-10 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="Все">Все категории</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
          />
        </div>
      </div>

      {filteredDishes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-slate-100 text-muted">
            <Search size={21} />
          </div>

          <h2 className="mt-4 text-xl font-semibold">Ничего не найдено</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            По вашему запросу нет подходящих блюд. Попробуйте изменить поиск или
            выбрать другую категорию.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("Все");
              }}
              className="mt-5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
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
