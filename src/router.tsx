// router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";

import DishesPage from "./pages/DishesPage";
import DishFormPage from "./pages/DishFormPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dishes" replace />,
  },
  {
    path: "/dishes",
    element: <DishesPage />,
  },
  {
    path: "/dishes/new",
    element: <DishFormPage />,
  },
  {
    path: "/dishes/:id/edit",
    element: <DishFormPage />,
  },
]);
