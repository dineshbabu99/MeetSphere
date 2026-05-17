import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice";
import ticketReducer from "./slices/ticketSlice";
import registerReducer from "./slices/registerSlice"
import attendeeReducer from "./slices/attendeeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    tickets: ticketReducer,
    register: registerReducer,
    attendees: attendeeReducer,
  },
});

export type RootState = ReturnType<
  typeof store.getState
>;

export type AppDispatch =
  typeof store.dispatch;