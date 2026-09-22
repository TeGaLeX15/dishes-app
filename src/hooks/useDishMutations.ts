// hooks/useDishMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDish, updateDish } from "../api/dishes";
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

export const useUpdateDish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DishFormValues }) =>
      updateDish(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dish", variables.id],
      });
    },
  });
};
