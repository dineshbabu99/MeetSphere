import {
  createSlice,
  
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AttendeeStatus =
  | "In"
  | "Out"
  | "Pending";

export type TicketType =
  | "VIP"
  | "GA"
  | "Early Bird";

export type Attendee = {
  id: string;
  name: string;
  email: string;
  ticket: TicketType;
  registered: string;
  status: AttendeeStatus;
};

type AttendeeState = {
  attendees: Attendee[];
};

const initialState: AttendeeState = {
  attendees: JSON.parse(
    localStorage.getItem("attendees") ||
      "[]"
  ),
};

const attendeeSlice = createSlice({
  name: "attendees",

  initialState,

  reducers: {
    addAttendee: (
      state,
      action: PayloadAction<Attendee>
    ) => {
      state.attendees.push(
        action.payload
      );

      localStorage.setItem(
        "attendees",
        JSON.stringify(state.attendees)
      );
    },

    removeAttendee: (
      state,
      action: PayloadAction<string>
    ) => {
      state.attendees =
        state.attendees.filter(
          (attendee) =>
            attendee.id !==
            action.payload
        );

      localStorage.setItem(
        "attendees",
        JSON.stringify(state.attendees)
      );
    },

    updateAttendeeStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: AttendeeStatus;
      }>
    ) => {
      const attendee =
        state.attendees.find(
          (item) =>
            item.id ===
            action.payload.id
        );

      if (attendee) {
        attendee.status =
          action.payload.status;

        localStorage.setItem(
          "attendees",
          JSON.stringify(
            state.attendees
          )
        );
      }
    },

    clearAttendees: (state) => {
      state.attendees = [];

      localStorage.removeItem(
        "attendees"
      );
    },
  },
});

export const {
  addAttendee,
  removeAttendee,
  updateAttendeeStatus,
  clearAttendees,
} = attendeeSlice.actions;

export default attendeeSlice.reducer;