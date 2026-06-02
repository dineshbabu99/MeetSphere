import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_BASE =
  // import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const API = `${API_BASE}/auth`;

export type Role =
  | "Admin"
  | "Event Organizer"
  | "User";

export type User = {
  _id?: string;

  name: string;

  email: string;

  role: Role;

  token?: string;
};

type RegisterState = {
  user: User | null;

  loading: boolean;

  error: string | null;
};

const initialState: RegisterState = {
  user: null,

  loading: false,

  error: null,
};



// REGISTER USER
export const registerUser =
  createAsyncThunk(
    "register/registerUser",

    async (
      userData: {
        name: string;
        email: string;
        role: Role;
        password: string;
      },

      thunkAPI
    ) => {

      try {

        const response =
          await axios.post(
            `${API}/register`,

            userData
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Registration failed"
        );
      }
    }
  );



const registerSlice =
  createSlice({
    name: "register",

    initialState,

    reducers: {
      clearError: (state) => {
        state.error = null;
      },
    },

    extraReducers: (
      builder
    ) => {

      builder

        // PENDING
        .addCase(
          registerUser.pending,
          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        // SUCCESS
        .addCase(
          registerUser.fulfilled,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.user =
              action.payload;
          }
        )

        // FAILED
        .addCase(
          registerUser.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        );
    },
  });

export const {
  clearError,
} = registerSlice.actions;

export default registerSlice.reducer;
