// hooks/useDishMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDish } from "../api/dishes";
import type { DishFormValues } from "../types/dish";

export const useCreateDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DishFormValues) => createDish(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};