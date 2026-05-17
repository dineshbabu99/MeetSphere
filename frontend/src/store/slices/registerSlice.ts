import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Role = "Admin" | "User";

export type User = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type RegisterState = {
  users: User[];
};

const initialState: RegisterState = {
  users: JSON.parse(
    localStorage.getItem("users") || "[]"
  ),
};

const registerSlice = createSlice({
  name: "register",

  initialState,

  reducers: {
    registerUser: (
      state,
      action: PayloadAction<User>
    ) => {
      const existingUser =
        state.users.find(
          (user) =>
            user.email ===
            action.payload.email
        );

      if (!existingUser) {
        state.users.push(action.payload);

        localStorage.setItem(
          "users",
          JSON.stringify(state.users)
        );
      }
    },

    removeUser: (
      state,
      action: PayloadAction<string>
    ) => {
      state.users = state.users.filter(
        (user) =>
          user.email !== action.payload
      );

      localStorage.setItem(
        "users",
        JSON.stringify(state.users)
      );
    },

    clearUsers: (state) => {
      state.users = [];

      localStorage.removeItem("users");
    },
  },
});

export const {
  registerUser,
  removeUser,
  clearUsers,
} = registerSlice.actions;

export default registerSlice.reducer;