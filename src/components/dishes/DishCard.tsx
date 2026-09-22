// components/dishes/DishCard.tsx
import { Clock3, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useDeleteDish } from "../../hooks/useDishMutations";
import type { Dish } from "../../types/dish";

interface DishCardProps {
  dish: Dish;
}

const DishCard = ({ dish }: DishCardProps) => {
  const deleteDishMutation = useDeleteDish();

  const handleDelete = () => {
    const confirmed = window.confirm(`Удалить блюдо «${dish.name}»?`);

    if (!confirmed) {
      return;
    }

    deleteDishMutation.mutate(dish.id);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {dish.name}
            </h2>

            <span className="mt-1 inline-block text-sm text-muted">
              {dish.category}
            </span>
          </div>

          <strong className="shrink-0 text-lg font-semibold text-primary">
            {dish.price} ₸
          </strong>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted">
          {dish.ingredients.join(", ")}
        </p>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <Clock3 size={16} />
            {dish.cookingTime} мин.
          </span>

          <div className="flex gap-1">
            <Link
              to={`/dishes/${dish.id}/edit`}
              aria-label={`Редактировать ${dish.name}`}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-foreground"
            >
              <Pencil size={17} />
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteDishMutation.isPending}
              aria-label={`Удалить ${dish.name}`}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>

        {deleteDishMutation.isError && (
          <p className="mt-3 text-sm text-red-600">
            Не удалось удалить блюдо. Попробуйте снова.
          </p>
        )}
      </div>
    </article>
  );
};

export default DishCard;
