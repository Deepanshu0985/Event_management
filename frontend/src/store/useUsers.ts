import axios from "axios";
import { create } from "zustand";

interface userSchema {
  _id: string;
  Name: string;
}

type User = {
  userData: userSchema[];
  getUsers: () => Promise<void>;
  addUser: (item: userSchema) => void;
};

const useUsers = create<User>((set) => ({
  userData: [],

  getUsers: async () => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";
    const res = await axios.get(`${API_URL}/api/users`);
    set({ userData: res.data });
  },

  addUser: (item) =>
    set((state) =>
      state.userData.find((i) => i.Name === item.Name)
        ? state
        : { userData: [...state.userData, item] }
    ),
}));

export default useUsers;