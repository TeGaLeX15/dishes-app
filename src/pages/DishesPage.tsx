// pages/DishesPage.tsx
import { useQuery } from "@tanstack/react-query";

import { getDishes } from "../api/dishes";

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
    return <p>Загрузка блюд...</p>;
  }

  if (isError) {
    return <p>Не удалось загрузить блюда.</p>;
  }

  if (!dishes || dishes.length === 0) {
    return <p>Блюд пока нет.</p>;
  }

  return (
    <main>
      <h1>Блюда</h1>

      {dishes.map((dish) => (
        <div key={dish.id}>
          <h2>{dish.name}</h2>
          <p>{dish.ingredients.join(", ")}</p>
          <p>{dish.price} ₸</p>
          <p>{dish.cookingTime} мин.</p>
        </div>
      ))}
    </main>
  );
};

export default DishesPage;