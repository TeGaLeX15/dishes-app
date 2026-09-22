// pages/DishFormPage.tsx
import { useEffect } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock3,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { getDish } from "../api/dishes";
import { useCreateDish, useUpdateDish } from "../hooks/useDishMutations";
import { dishSchema, type DishFormSchema } from "../schemas/dish.schema";
import type { DishFormValues } from "../types/dish";

const inputBaseClass =
  "w-full rounded-xl border bg-white text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/10";

const DishFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const createDishMutation = useCreateDish();
  const updateDishMutation = useUpdateDish();

  // Получение данных блюда при редактировании
  const {
    data: dish,
    isLoading: isDishLoading,
    isError: isDishError,
  } = useQuery({
    queryKey: ["dish", id],
    queryFn: () => getDish(id!),
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  const imageUrl = useWatch({
    control,
    name: "image",
  });

  // Заполнение формы данными существующего блюда
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

  // Преобразование данных формы в формат, который ожидает API
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
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-6">
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            </div>

            <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
      </main>
    );
  }

  if (isEditMode && isDishError) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          to="/dishes"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Назад к блюдам
        </Link>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-sm font-bold text-red-600">
              !
            </div>

            <div>
              <h1 className="text-lg font-semibold text-red-900">
                Не удалось загрузить блюдо
              </h1>

              <p className="mt-1 text-sm leading-5 text-red-700">
                Проверьте подключение к серверу и попробуйте снова.
              </p>

              <Link
                to="/dishes"
                className="mt-4 inline-flex text-sm font-semibold text-red-700 transition-colors hover:text-red-900"
              >
                Вернуться к блюдам
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-7">
        <Link
          to="/dishes"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Назад к блюдам
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {isEditMode ? "Редактировать блюдо" : "Добавить блюдо"}
          </h1>

          <p className="mt-2 text-sm text-muted sm:text-base">
            {isEditMode
              ? "Измените информацию о блюде"
              : "Заполните информацию о новом блюде"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-green-50 text-primary">
              <Tag size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold">Информация о блюде</h2>

              <p className="mt-0.5 text-sm text-muted">
                Основные данные для отображения в меню
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Название
              </label>

              <input
                id="name"
                type="text"
                autoComplete="off"
                placeholder="Например, Паста Карбонара"
                {...register("name")}
                aria-invalid={Boolean(errors.name)}
                className={`${inputBaseClass} h-11 px-4 ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-border"
                }`}
              />

              {errors.name && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.name.message}
                </p>
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
                aria-invalid={Boolean(errors.ingredients)}
                className={`${inputBaseClass} resize-none px-4 py-3 ${
                  errors.ingredients
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-border"
                }`}
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
                inputMode="url"
                placeholder="https://example.com/image.jpg"
                {...register("image")}
                aria-invalid={Boolean(errors.image)}
                className={`${inputBaseClass} h-11 px-4 ${
                  errors.image
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-border"
                }`}
              />

              {errors.image ? (
                <p className="mt-2 text-sm text-red-600">
                  {errors.image.message}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted">
                  Укажите прямую ссылку на изображение
                </p>
              )}

              {imageUrl && !errors.image && /^https?:\/\//i.test(imageUrl) && (
                <div className="mt-4 overflow-hidden rounded-xl border border-border bg-slate-50">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <ImageIcon size={16} className="text-muted" />

                    <span className="text-xs font-medium text-muted">
                      Предпросмотр
                    </span>
                  </div>

                  <div className="aspect-[16/7] bg-slate-100">
                    <img
                      src={imageUrl}
                      alt="Предпросмотр блюда"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-medium"
                >
                  Цена, ₸
                </label>

                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    placeholder="2500"
                    {...register("price", {
                      valueAsNumber: true,
                    })}
                    aria-invalid={Boolean(errors.price)}
                    className={`${inputBaseClass} h-11 px-4 ${
                      errors.price
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-border"
                    }`}
                  />
                </div>

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

                <div className="relative">
                  <Clock3
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    id="cookingTime"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    placeholder="25"
                    {...register("cookingTime", {
                      valueAsNumber: true,
                    })}
                    aria-invalid={Boolean(errors.cookingTime)}
                    className={`${inputBaseClass} h-11 px-4 pr-11 ${
                      errors.cookingTime
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-border"
                    }`}
                  />
                </div>

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

              <div className="relative">
                <select
                  id="category"
                  {...register("category")}
                  aria-invalid={Boolean(errors.category)}
                  className={`${inputBaseClass} h-11 appearance-none px-4 pr-10 ${
                    errors.category
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                      : "border-border"
                  }`}
                >
                  <option value="">Выберите категорию</option>
                  <option value="Паста">Паста</option>
                  <option value="Пицца">Пицца</option>
                  <option value="Салаты">Салаты</option>
                  <option value="Супы">Супы</option>
                  <option value="Десерты">Десерты</option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>

              {errors.category && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {isMutationError && (
            <div className="mt-7 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm font-bold text-red-600">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Не удалось сохранить блюдо
                  </p>

                  <p className="mt-1 text-sm leading-5 text-red-700">
                    Проверьте подключение к серверу и попробуйте снова.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-slate-50/70 p-6 sm:flex-row sm:justify-end sm:px-8">
          <Link
            to="/dishes"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.98]"
          >
            Отмена
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold !text-white shadow-sm transition-all hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check size={17} />

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
