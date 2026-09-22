// pages/DishesPage.tsx
import { useQuery } from "@tanstack/react-query";

import { getDishes } from "../api/dishes";
import DishCard from "../components/dishes/DishCard";

const DishesPage = () => {
  const {
    data: dishes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

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

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-primary">
          Меню
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Блюда
        </h1>

        <p className="mt-2 text-muted">
          Управляйте блюдами вашего меню
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </section>
    </main>
  );
};

export default DishesPage;