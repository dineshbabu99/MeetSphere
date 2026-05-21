import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

import type {
  EventItem,
} from "./eventSlice";

const API =
  "http://localhost:5000/api/schedules";

export type ScheduleSession = {
  _id?: string;
  startTime: string;
  endTime?: string;
  title: string;
  speaker?: string;
  tag?: string;
  venue?: string;
  description?: string;
};

export type ScheduleDay = {
  _id?: string;
  date: string;
  title?: string;
  sessions: ScheduleSession[];
};

export type ScheduleItem = {
  _id?: string;
  event:
    | string
    | Pick<
        EventItem,
        | "_id"
        | "title"
        | "category"
        | "location"
        | "eventDateTime"
        | "image"
        | "status"
      >;
  days: ScheduleDay[];
};

type ScheduleState = {
  schedules: ScheduleItem[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

type AddSessionPayload = {
  eventId: string;
  date: string;
  dayTitle?: string;
  startTime: string;
  endTime?: string;
  title: string;
  speaker?: string;
  tag?: string;
  venue?: string;
  description?: string;
};

const initialState: ScheduleState = {
  schedules: [],
  loading: false,
  saving: false,
  error: null,
};

export const fetchSchedules =
  createAsyncThunk(
    "schedules/fetchSchedules",
    async (_, thunkAPI) => {

      try {

        const response =
          await axios.get(API);

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch schedules"
        );
      }
    }
  );

export const addScheduleSession =
  createAsyncThunk(
    "schedules/addScheduleSession",
    async (
      payload: AddSessionPayload,
      thunkAPI
    ) => {

      try {

        const {
          eventId,
          ...sessionData
        } = payload;

        const response =
          await axios.post(
            `${API}/event/${eventId}/sessions`,
            sessionData
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to save session"
        );
      }
    }
  );

const getScheduleEventId = (
  schedule: ScheduleItem
) => {

  return typeof schedule.event ===
    "string"
    ? schedule.event
    : schedule.event._id;
};

const upsertScheduleInState = (
  schedules: ScheduleItem[],
  schedule: ScheduleItem
) => {

  const eventId =
    getScheduleEventId(
      schedule
    );

  const index =
    schedules.findIndex(
      (item) =>
        getScheduleEventId(
          item
        ) === eventId
    );

  if (index >= 0) {

    schedules[index] =
      schedule;

    return;
  }

  schedules.push(
    schedule
  );
};

const scheduleSlice =
  createSlice({
    name: "schedules",
    initialState,
    reducers: {},
    extraReducers: (
      builder
    ) => {

      builder
        .addCase(
          fetchSchedules.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )
        .addCase(
          fetchSchedules.fulfilled,
          (state, action) => {

            state.loading = false;
            state.schedules =
              action.payload;
          }
        )
        .addCase(
          fetchSchedules.rejected,
          (state, action) => {

            state.loading = false;
            state.error =
              action.payload as string;
          }
        )
        .addCase(
          addScheduleSession.pending,
          (state) => {

            state.saving = true;
            state.error = null;
          }
        )
        .addCase(
          addScheduleSession.fulfilled,
          (state, action) => {

            state.saving = false;
            upsertScheduleInState(
              state.schedules,
              action.payload
            );
          }
        )
        .addCase(
          addScheduleSession.rejected,
          (state, action) => {

            state.saving = false;
            state.error =
              action.payload as string;
          }
        );
    },
  });

export default
scheduleSlice.reducer;
