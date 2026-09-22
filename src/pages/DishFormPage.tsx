// pages/DishFormPage.tsx
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { getDish } from "../api/dishes";
import { useCreateDish, useUpdateDish } from "../hooks/useDishMutations";
import { dishSchema, type DishFormSchema } from "../schemas/dish.schema";
import type { DishFormValues } from "../types/dish";

const DishFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const createDishMutation = useCreateDish();
  const updateDishMutation = useUpdateDish();

  const {
    data: dish,
    isLoading: isDishLoading,
    isError: isDishError,
  } = useQuery({
    queryKey: ["dish", id],
    queryFn: () => getDish(id as string),
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DishFormSchema>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: "",
      ingredients: "",
      image: "",
      price: undefined,
      cookingTime: undefined,
      category: "",
    },
  });

  useEffect(() => {
    if (!dish) {
      return;
    }

    reset({
      name: dish.name,
      ingredients: dish.ingredients.join(", "),
      image: dish.image,
      price: dish.price,
      cookingTime: dish.cookingTime,
      category: dish.category,
    });
  }, [dish, reset]);

  const onSubmit = (data: DishFormSchema) => {
    const dishData: DishFormValues = {
      name: data.name,
      ingredients: data.ingredients
        .split(",")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
      image: data.image,
      price: data.price,
      cookingTime: data.cookingTime,
      category: data.category,
    };

    if (isEditMode && id) {
      updateDishMutation.mutate(
        {
          id,
          data: dishData,
        },
        {
          onSuccess: () => {
            navigate("/dishes");
          },
        },
      );

      return;
    }

    createDishMutation.mutate(dishData, {
      onSuccess: () => {
        navigate("/dishes");
      },
    });
  };

  const isPending =
    createDishMutation.isPending || updateDishMutation.isPending;

  const isMutationError =
    createDishMutation.isError || updateDishMutation.isError;

  if (isEditMode && isDishLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-muted">Загрузка блюда...</p>
      </main>
    );
  }

  if (isEditMode && isDishError) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">
            Не удалось загрузить блюдо
          </h1>

          <p className="mt-1 text-sm text-red-700">
            Проверьте подключение к серверу и попробуйте снова.
          </p>

          <Link
            to="/dishes"
            className="mt-4 inline-flex text-sm font-semibold text-red-700 hover:text-red-900"
          >
            Вернуться к блюдам
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/dishes"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Назад к блюдам
        </Link>

        <p className="mb-2 text-sm font-medium text-primary">Меню</p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {isEditMode ? "Редактировать блюдо" : "Добавить блюдо"}
        </h1>

        <p className="mt-2 text-muted">
          {isEditMode
            ? "Измените информацию о блюде"
            : "Заполните информацию о новом блюде"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Название
            </label>

            <input
              id="name"
              type="text"
              placeholder="Например, Паста Карбонара"
              {...register("name")}
              className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
            />

            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="ingredients"
              className="mb-2 block text-sm font-medium"
            >
              Ингредиенты
            </label>

            <textarea
              id="ingredients"
              rows={4}
              placeholder="Спагетти, Бекон, Яйцо, Пармезан"
              {...register("ingredients")}
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
            />

            <p className="mt-2 text-xs text-muted">
              Укажите ингредиенты через запятую
            </p>

            {errors.ingredients && (
              <p className="mt-2 text-sm text-red-600">
                {errors.ingredients.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium">
              Изображение
            </label>

            <input
              id="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...register("image")}
              className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
            />

            {errors.image && (
              <p className="mt-2 text-sm text-red-600">
                {errors.image.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium">
                Цена, ₸
              </label>

              <input
                id="price"
                type="number"
                min="1"
                placeholder="2500"
                {...register("price", {
                  valueAsNumber: true,
                })}
                className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
              />

              {errors.price && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cookingTime"
                className="mb-2 block text-sm font-medium"
              >
                Время приготовления, мин.
              </label>

              <input
                id="cookingTime"
                type="number"
                min="1"
                placeholder="25"
                {...register("cookingTime", {
                  valueAsNumber: true,
                })}
                className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-primary"
              />

              {errors.cookingTime && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.cookingTime.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium"
            >
              Категория
            </label>

            <select
              id="category"
              {...register("category")}
              className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">Выберите категорию</option>
              <option value="Паста">Паста</option>
              <option value="Пицца">Пицца</option>
              <option value="Салаты">Салаты</option>
              <option value="Супы">Супы</option>
              <option value="Десерты">Десерты</option>
            </select>

            {errors.category && (
              <p className="mt-2 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {isMutationError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">
              Не удалось сохранить блюдо
            </p>

            <p className="mt-1 text-sm text-red-700">
              Проверьте подключение к серверу и попробуйте снова.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/dishes"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold transition-colors hover:bg-slate-50"
          >
            Отмена
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Сохранение..."
              : isEditMode
                ? "Сохранить изменения"
                : "Сохранить блюдо"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default DishFormPage;
