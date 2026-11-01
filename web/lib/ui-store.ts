"use client";

import { create } from "zustand";

interface UIState {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useUI = create<UIState>()((set) => ({
  searchOpen: false,
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
