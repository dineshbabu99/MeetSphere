import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL;

const API = `${API_BASE}/events`;

export type TicketType = {
  _id?: string;
  id?: string;

  name: string;

  description?: string;

  price: number;

  capacity: number;

  sold?: number;
};


type Organizer = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export type EventItem = {
  _id?: string;

  organizer?: Organizer;
  
  title: string;

  description: string;

  category: string;

  location: string;

  eventDateTime: string;

  bookingStart: string;

  bookingEnd: string;

  image: string;

  capacity: number;

  sold: number;

  status:
    | "Open"
    | "Pending"
    | "Rejected"
    | "Draft";

  tickets: TicketType[];
};

type EventState = {
  events: EventItem[];

  loading: boolean;

  error: string | null;
};



const initialState: EventState = {
  events: [],

  loading: false,

  error: null,
};



// FETCH EVENTS
export const fetchEvents =
  createAsyncThunk(
    "events/fetchEvents",

    async (_, thunkAPI) => {

      try {

        const response =
          await axios.get(
            `${API}`
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to fetch events"
        );
      }
    }
  );



// CREATE EVENT
export const createEvent =
  createAsyncThunk(
    "events/createEvent",

    async (
      eventData: EventItem,
      thunkAPI
    ) => {
      const state =
        thunkAPI.getState() as {
          auth: {
            token: string | null;
          };
        };

      try {

        const response =
          await axios.post(
            `${API}/create`,

            eventData,
            {
              headers: {
                Authorization:
                  `Bearer ${state.auth.token}`,
              },
            }
          );

        return response.data.event;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to create event"
        );
      }
    }
  );

export const updateEvent =
  createAsyncThunk(
    "events/updateEvent",

    async (
      payload: {
        eventId: string;
        eventData: Partial<EventItem>;
      },
      thunkAPI
    ) => {

      const state =
        thunkAPI.getState() as {
          auth: {
            token: string | null;
          };
        };

      try {

        const response =
          await axios.put(
            `${API}/${payload.eventId}`,
            payload.eventData,
            {
              headers: {
                Authorization:
                  `Bearer ${state.auth.token}`,
              },
            }
          );

        return response.data.event;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to update event"
        );
      }
    }
  );

export const deleteEvent =
  createAsyncThunk(
    "events/deleteEvent",

    async (eventId: string, thunkAPI) => {

      const state =
        thunkAPI.getState() as {
          auth: {
            token: string | null;
          };
        };

      try {

        await axios.delete(
          `${API}/${eventId}`,
          {
            headers: {
              Authorization:
                `Bearer ${state.auth.token}`,
            },
          }
        );

        return eventId;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to delete event"
        );
      }
    }
  );

export const updateEventStatus =
  createAsyncThunk(
    "events/updateEventStatus",

    async (
      payload: {
        eventId: string;
        status:
          | "Open"
          | "Pending"
          | "Rejected"
          | "Draft";
      },
      thunkAPI
    ) => {

      const state =
        thunkAPI.getState() as {
          auth: {
            token: string | null;
          };
        };

      try {

        const response =
          await axios.patch(
            `${API}/${payload.eventId}/status`,
            {
              status:
                payload.status,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${state.auth.token}`,
              },
            }
          );

        return response.data.event;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to update event status"
        );
      }
    }
  );



const eventSlice =
  createSlice({
    name: "events",

    initialState,

    reducers: {},

    extraReducers: (
      builder
    ) => {

      builder

        // FETCH EVENTS
        .addCase(
          fetchEvents.pending,
          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          fetchEvents.fulfilled,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.events =
              action.payload;
          }
        )

        .addCase(
          fetchEvents.rejected,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        )



        // CREATE EVENT
        .addCase(
          createEvent.pending,
          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          createEvent.fulfilled,
          (
            state,
            action
          ) => {

            state.loading = false;

            state.events.push(
              action.payload
            );
          }
        )

        .addCase(
          createEvent.rejected,
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
          updateEventStatus.fulfilled,
          (state, action) => {

            state.events =
              state.events.map(
                (event) =>
                  event._id ===
                  action.payload._id
                    ? action.payload
                    : event
              );
          }
        )

        .addCase(
          updateEventStatus.rejected,
          (state, action) => {

            state.error =
              action.payload as string;
          }
        )

        .addCase(
          updateEvent.fulfilled,
          (state, action) => {

            state.events =
              state.events.map(
                (event) =>
                  event._id ===
                  action.payload._id
                    ? action.payload
                    : event
              );
          }
        )

        .addCase(
          updateEvent.rejected,
          (state, action) => {

            state.error =
              action.payload as string;
          }
        )

        .addCase(
          deleteEvent.fulfilled,
          (state, action) => {

            state.events =
              state.events.filter(
                (event) =>
                  event._id !==
                  action.payload
              );
          }
        )

        .addCase(
          deleteEvent.rejected,
          (state, action) => {

            state.error =
              action.payload as string;
          }
        );
    },
  });

export default
eventSlice.reducer;
