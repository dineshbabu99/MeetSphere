import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice";
import ticketReducer from "./slices/ticketSlice";
import registerReducer from "./slices/registerSlice"
import attendeeReducer from "./slices/attendeeSlice"
import scheduleReducer from "./slices/scheduleSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    tickets: ticketReducer,
    register: registerReducer,
    attendees: attendeeReducer,
    schedules: scheduleReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch =
  typeof store.dispatch;
