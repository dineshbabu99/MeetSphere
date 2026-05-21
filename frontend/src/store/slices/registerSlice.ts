import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

export type Role =
  | "Admin"
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
        password: string;
      },

      thunkAPI
    ) => {

      try {

        const response =
          await axios.post(
            "http://localhost:5000/api/auth/register",

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