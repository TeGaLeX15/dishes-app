// components/dishes/DishCard.tsx
import { Clock3, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeleteDish } from "../../hooks/useDishMutations";
import type { Dish } from "../../types/dish";

interface DishCardProps {
  dish: Dish;
}

const priceFormatter = new Intl.NumberFormat("ru-RU");

const DishCard = ({ dish }: DishCardProps) => {
  const deleteDishMutation = useDeleteDish();

  // Подтверждение удаления и отправка запроса на сервер
  const handleDelete = () => {
    const confirmed = window.confirm(`Удалить блюдо «${dish.name}»?`);

    if (!confirmed) {
      return;
    }

    deleteDishMutation.mutate(dish.id);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={dish.image}
          alt={dish.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-primary">
              {dish.category}
            </span>

            <h2 className="mt-2 text-lg font-semibold leading-6 tracking-tight">
              {dish.name}
            </h2>
          </div>

          <strong className="shrink-0 text-lg font-bold tracking-tight text-primary">
            {priceFormatter.format(dish.price)} ₸
          </strong>
        </div>

        <p className="mb-5 line-clamp-2 min-h-12 text-sm leading-6 text-muted">
          {dish.ingredients.join(", ")}
        </p>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <Clock3 size={16} />
            {dish.cookingTime} мин.
          </span>

          <div className="flex items-center gap-1">
            <Link
              to={`/dishes/${dish.id}/edit`}
              aria-label={`Редактировать ${dish.name}`}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <Pencil size={17} />
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteDishMutation.isPending}
              aria-label={`Удалить ${dish.name}`}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        {deleteDishMutation.isError && (
          <div className="mt-3 rounded-lg bg-red-50 px-3 py-2">
            <p className="text-sm text-red-700">
              Не удалось удалить блюдо. Попробуйте снова.
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default DishCard;
