
import {  createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TicketItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type TicketState = {
  tickets: TicketItem[];
  total: number;
};

const initialState: TicketState = {
  tickets: [],
  total: 0,
};

const calculateTotal = (
  tickets: TicketItem[]
) => {
  return tickets.reduce(
    (acc, ticket) =>
      acc +
      ticket.price * ticket.quantity,
    0
  );
};

const ticketSlice = createSlice({
  name: "tickets",

  initialState,

  reducers: {
    addTicket: (
      state,
      action: PayloadAction<TicketItem>
    ) => {
      const existingTicket =
        state.tickets.find(
          (ticket) =>
            ticket.id === action.payload.id
        );

      if (existingTicket) {
        existingTicket.quantity += 1;
      } else {
        state.tickets.push({
          ...action.payload,
          quantity: 1,
        });
      }

      state.total = calculateTotal(
        state.tickets
      );
    },

    removeTicket: (
      state,
      action: PayloadAction<string>
    ) => {
      const existingTicket =
        state.tickets.find(
          (ticket) =>
            ticket.id === action.payload
        );

      if (!existingTicket) return;

      if (existingTicket.quantity > 1) {
        existingTicket.quantity -= 1;
      } else {
        state.tickets =
          state.tickets.filter(
            (ticket) =>
              ticket.id !== action.payload
          );
      }

      state.total = calculateTotal(
        state.tickets
      );
    },

    clearTickets: (state) => {
      state.tickets = [];

      state.total = 0;
    },
  },
});

export const {
  addTicket,
  removeTicket,
  clearTickets,
} = ticketSlice.actions;

export default ticketSlice.reducer;