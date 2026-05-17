import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type EventItem = Record<string, unknown>;

type EventState = {
  events: EventItem[];
};

const initialState: EventState = {
  events: [],
};

const eventSlice = createSlice({
  name: "events",

  initialState,

  reducers: {
    setEvents: (
      state,
      action: PayloadAction<EventItem[]>
    ) => {
      state.events = action.payload;
    },

    addEvent: (
      state,
      action: PayloadAction<EventItem>
    ) => {
      state.events.push(action.payload);
    },
  },
});

export const { setEvents, addEvent } =
  eventSlice.actions;

export default eventSlice.reducer;
