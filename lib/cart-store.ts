"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  courseId: string;
  title: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  coverImageUrl: string | null;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (courseId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.some((i) => i.courseId === item.courseId)) return;
        set({ items: [...get().items, item] });
      },
      removeItem: (courseId) => set({ items: get().items.filter((i) => i.courseId !== courseId) }),
      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);
