import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import type {
  PayloadAction,
} from "@reduxjs/toolkit";

import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const API = `${API_BASE}/tickets`;


export type TicketItem = {
  _id?: string;

  ticketId: string;
  userId: string;

  eventId: string;

  eventName: string;

  ticketType: string;

  location: string;

  date: string;

  price: number;

  quantity: number;

  purchaseDate: string;

  attendanceStatus?:
    | "Booked"
    | "Attended"
    | "Not Arrived";

  userName?: string;

  userEmail?: string;
};


type TicketState = {
  tickets: TicketItem[];

  total: number;

  loading: boolean;

  error: string | null;
};



const calculateTotal = (
  tickets: TicketItem[]
) => {

  return tickets.reduce(
    (acc, ticket) =>

      acc +
      ticket.price *
      ticket.quantity,

    0
  );
};



const storedTickets =
  JSON.parse(
    localStorage.getItem(
      "tickets"
    ) || "[]"
  );



const initialState: TicketState = {
  tickets: storedTickets,

  total:
    calculateTotal(
      storedTickets
    ),

  loading: false,

  error: null,
};



/* -------------------------------- */
/* PURCHASE TICKET API */
/* -------------------------------- */

export const purchaseTicket =
  createAsyncThunk(

    "tickets/purchaseTicket",

    async (
  ticketData: TicketItem[],

      thunkAPI
    ) => {

      try {

        const response =
          await axios.post(
            `${API}/purchase`,

            ticketData
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||

          "Failed to purchase ticket"
        );
      }
    }
  );



/* -------------------------------- */
/* FETCH USER TICKETS */
/* -------------------------------- */
export const fetchTickets =
  createAsyncThunk(
    "tickets/fetchTickets",

    async (
      userId: string,
      thunkAPI
    ) => {

      try {

        const response =
          await axios.get(
            `${API}/${userId}`
          );

        return response.data;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||

          "Failed to fetch tickets"
        );
      }
    }
  );

export const cancelTicket =
  createAsyncThunk(

    "tickets/cancelTicket",

    async (
      ticketId: string,
      thunkAPI
    ) => {

      try {

        const response =
          await axios.delete(
            `${API}/${ticketId}`
          );

        return {
          ticketId,
          message:
            response.data.message,
        };

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||

          "Failed to cancel ticket"
        );
      }
    }
  );

export const fetchAllTickets =
  createAsyncThunk(
    "tickets/fetchAllTickets",

    async (_, thunkAPI) => {

      const state =
        thunkAPI.getState() as {
          auth: {
            token: string | null;
          };
        };

      try {

        const response =
          await axios.get(
            `${API}/admin/all`,
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
            "Failed to fetch booked tickets"
        );
      }
    }
  );

export const updateTicketAttendance =
  createAsyncThunk(
    "tickets/updateTicketAttendance",

    async (
      payload: {
        ticketId: string;
        attendanceStatus:
          | "Booked"
          | "Attended"
          | "Not Arrived";
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
            `${API}/attendance/${payload.ticketId}`,
            {
              attendanceStatus:
                payload.attendanceStatus,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${state.auth.token}`,
              },
            }
          );

        return response.data.ticket;

      } catch (error: any) {

        return thunkAPI.rejectWithValue(
          error.response?.data
            ?.message ||
            "Failed to update attendance"
        );
      }
    }
  );
const ticketSlice =
  createSlice({

    name: "tickets",

    initialState,

    reducers: {

      removeTicket: (
        state,

        action:
          PayloadAction<string>
      ) => {

        const existingTicket =
          state.tickets.find(
            (ticket) =>
              ticket._id ===
              action.payload
          );



        if (!existingTicket)
          return;



        if (
          existingTicket.quantity >
          1
        ) {

          existingTicket.quantity -= 1;

        } else {

          state.tickets =
            state.tickets.filter(
              (ticket) =>
                ticket._id !==
                action.payload
            );
        }



        state.total =
          calculateTotal(
            state.tickets
          );



        localStorage.setItem(
          "tickets",

          JSON.stringify(
            state.tickets
          )
        );
      },



      clearTickets: (
        state
      ) => {

        state.tickets = [];

        state.total = 0;

        localStorage.removeItem(
          "tickets"
        );
      },



      clearTicketError: (
        state
      ) => {

        state.error = null;
      },
    },



    extraReducers: (
      builder
    ) => {

      builder



        /* PURCHASE */

        .addCase(
          purchaseTicket.pending,

          (state) => {

            state.loading = true;

            state.error = null;
          }
        )



        .addCase(
  purchaseTicket.fulfilled,

  (
    state,
    action
  ) => {

    state.loading = false;

    // Backend returns tickets array
    state.tickets = [
      ...state.tickets,
      ...action.payload.tickets,
    ];

    state.total =
      calculateTotal(
        state.tickets
      );

    localStorage.setItem(
      "tickets",

      JSON.stringify(
        state.tickets
      )
    );
  }
)



        .addCase(
          purchaseTicket.rejected,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.error =
              action.payload as string;
          }
        )



        /* FETCH */

        .addCase(
          fetchTickets.pending,

          (state) => {

            state.loading = true;
          }
        )



        .addCase(
          fetchTickets.fulfilled,

          (
            state,
            action
          ) => {

            state.loading = false;

            state.tickets =
              action.payload;

            state.total =
              calculateTotal(
                action.payload
              );



            localStorage.setItem(
              "tickets",

              JSON.stringify(
                action.payload
              )
            );
          }
        )

.addCase(
  cancelTicket.fulfilled,

  (state, action) => {

    state.tickets =
      state.tickets.filter(
        (ticket) =>
          ticket._id !==
          action.payload.ticketId
      );

    state.total =
      calculateTotal(
        state.tickets
      );

    localStorage.setItem(
      "tickets",

      JSON.stringify(
        state.tickets
      )
    );
  }
)

        .addCase(
          fetchTickets.rejected,

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
          fetchAllTickets.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchAllTickets.fulfilled,
          (state, action) => {

            state.loading = false;
            state.tickets =
              action.payload;

            state.total =
              calculateTotal(
                action.payload
              );
          }
        )

        .addCase(
          fetchAllTickets.rejected,
          (state, action) => {

            state.loading = false;
            state.error =
              action.payload as string;
          }
        )

        .addCase(
          updateTicketAttendance.fulfilled,
          (state, action) => {

            state.tickets =
              state.tickets.map(
                (ticket) =>
                  ticket._id ===
                  action.payload._id
                    ? {
                        ...ticket,
                        attendanceStatus:
                          action.payload
                            .attendanceStatus,
                      }
                    : ticket
              );
          }
        );

        
    },
  });



export const {
  removeTicket,
  clearTickets,
  clearTicketError,
} = ticketSlice.actions;



export default
  ticketSlice.reducer;
