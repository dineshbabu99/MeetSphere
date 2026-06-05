import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL;

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
};

type AuthState = {
  token: string | null;

  user: User | null;

  users: User[];

  loading: boolean;

  error: string | null;
};
const storedUser =
  localStorage.getItem("user");
const initialState: AuthState = {
  token:
    localStorage.getItem(
      "token"
    ),

  user:
    storedUser &&
    storedUser !== "undefined"
      ? JSON.parse(storedUser)
      : null,

  users: [],

  loading: false,

  error: null,
};
// LOGIN USER
export const loginUser =
  createAsyncThunk(
    "auth/loginUser",

    async (
      userData: {
        email: string;
        password: string;
      },

      thunkAPI
    ) => {

      try {

        const response =
          await axios.post(
            `${API}/login`,

            userData
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Login failed"
        );
      }
    }
  );

export const fetchCurrentUser =
  createAsyncThunk(
    "auth/fetchCurrentUser",

    async (_, thunkAPI) => {

      const state =
        thunkAPI.getState() as {
          auth: AuthState;
        };

      try {

        const response =
          await axios.get(
            `${API}/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${state.auth.token}`,
              },
            }
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch user details"
        );
      }
    }
  );

export const updateCurrentUser =
  createAsyncThunk(
    "auth/updateCurrentUser",

    async (
      userData: {
        name: string;
        email: string;
        password?: string;
      },
      thunkAPI
    ) => {

      const state =
        thunkAPI.getState() as {
          auth: AuthState;
        };

      try {

        const response =
          await axios.put(
            `${API}/me`,
            userData,
            {
              headers: {
                Authorization:
                  `Bearer ${state.auth.token}`,
              },
            }
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to update user details"
        );
      }
    }
  );

export const fetchUsers =
  createAsyncThunk(
    "auth/fetchUsers",

    async (_, thunkAPI) => {

      const state =
        thunkAPI.getState() as {
          auth: AuthState;
        };

      try {

        const response =
          await axios.get(
            `${API}/users`,
            {
              headers: {
                Authorization:
                  `Bearer ${state.auth.token}`,
              },
            }
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch users"
        );
      }
    }
  );

export const updateUserRole =
  createAsyncThunk(
    "auth/updateUserRole",

    async (
      payload: {
        userId: string;
        role: Role;
      },
      thunkAPI
    ) => {

      const state =
        thunkAPI.getState() as {
          auth: AuthState;
        };

      try {

        const response =
          await axios.patch(
            `${API}/users/${payload.userId}/role`,
            {
              role: payload.role,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${state.auth.token}`,
              },
            }
          );

        return response.data.user;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to update user role"
        );
      }
    }
  );



const authSlice =
  createSlice({
    name: "auth",

    initialState,

    reducers: {

logout: (state) => {

  state.token = null;

  state.user = null;

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );
},

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
          loginUser.pending,
          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        // SUCCESS
  .addCase(
  loginUser.fulfilled,
  (
    state,
    action
  ) => {

    state.loading = false;

    state.token =
      action.payload.token;

    state.user =
      action.payload;

    localStorage.setItem(
      "token",
      action.payload.token
    );

    localStorage.setItem(
      "user",

      JSON.stringify(
        action.payload
      )
    );
  }
)
        // FAILED
        .addCase(
          loginUser.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        )

        .addCase(
          fetchCurrentUser.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchCurrentUser.fulfilled,
          (state, action) => {

            state.loading = false;
            state.user =
              action.payload;

            localStorage.setItem(
              "user",
              JSON.stringify(
                state.user
              )
            );
          }
        )

        .addCase(
          fetchCurrentUser.rejected,
          (state, action) => {

            state.loading = false;
            state.error =
              action.payload as string;
          }
        )

        .addCase(
          updateCurrentUser.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateCurrentUser.fulfilled,
          (state, action) => {

            state.loading = false;
            state.token =
              action.payload.token;

            state.user =
              action.payload;

            localStorage.setItem(
              "token",
              action.payload.token
            );

            localStorage.setItem(
              "user",
              JSON.stringify(
                action.payload
              )
            );
          }
        )

        .addCase(
          updateCurrentUser.rejected,
          (state, action) => {

            state.loading = false;
            state.error =
              action.payload as string;
          }
        )

        .addCase(
          fetchUsers.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchUsers.fulfilled,
          (state, action) => {

            state.loading = false;
            state.users =
              action.payload;
          }
        )

        .addCase(
          fetchUsers.rejected,
          (state, action) => {

            state.loading = false;
            state.error =
              action.payload as string;
          }
        )

        .addCase(
          updateUserRole.fulfilled,
          (state, action) => {

            state.users =
              state.users.map(
                (user) =>
                  user._id ===
                  action.payload._id
                    ? action.payload
                    : user
              );

            if (
              state.user?._id ===
              action.payload._id
            ) {

              state.user =
                action.payload;

              localStorage.setItem(
                "user",
                JSON.stringify(
                  action.payload
                )
              );
            }
          }
        )

        .addCase(
          updateUserRole.rejected,
          (state, action) => {

            state.error =
              action.payload as string;
          }
        );
    },
  });

export const {
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
