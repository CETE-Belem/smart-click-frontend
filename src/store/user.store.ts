import { IUser } from "@/types/IUser";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserStore = {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
};

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
