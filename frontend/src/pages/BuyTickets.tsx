import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../store/hooks";

import {
  fetchEvents,
} from "../store/slices/eventSlice";

import { fetchTickets } from "../store/slices/ticketSlice";
import { payWithRazorpay } from "../api/payWithRazorpay";

const formatDateTime = (
  value: string
) => {

  const date =
    new Date(value);

  return {
    date:
      date.toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      ),
    time:
      date.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      ),
  };
};

export default function BuyTickets() {
  const dispatch =
    useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  const {
    events,
    loading: eventsLoading,
    error: eventsError,
  } = useAppSelector(
    (state) => state.events
  );

  const { error: ticketError } = useAppSelector((state) => state.tickets);

  const [
    selectedEventId,
    setSelectedEventId,
  ] = useState("");

  const [
    qty,
    setQty,
  ] = useState<
    Record<string, number>
  >({});

  useEffect(() => {

    dispatch(fetchEvents());

  }, [dispatch]);

  const availableEvents =
    useMemo(
      () =>
        events.filter(
          (event) => {

            const now =
              new Date();

            const bookingStarted =
              now >=
              new Date(
                event.bookingStart
              );

            const bookingEnded =
              now >
              new Date(
                event.bookingEnd
              );

            const soldOut =
              event.sold >=
              event.capacity;

            return (
              event.status === "Open" &&
              bookingStarted &&
              !bookingEnded &&
              !soldOut
            );
          }
        ),
      [events]
    );

  useEffect(() => {

    if (
      availableEvents.length === 0
    ) {

      if (selectedEventId) {

        setSelectedEventId("");
        setQty({});
      }

      return;
    }

    const selectedEventExists =
      availableEvents.some(
        (event) =>
          event._id ===
          selectedEventId
      );

    if (selectedEventExists) {

      return;
    }

    setSelectedEventId(
      availableEvents[0]._id || ""
    );
    setQty({});

  }, [
    availableEvents,
    selectedEventId,
  ]);

  const selectedEvent =
    availableEvents.find(
      (event) =>
        event._id ===
        selectedEventId
    );

  const selectedEventDate =
    selectedEvent
      ? formatDateTime(
          selectedEvent.eventDateTime
        )
      : null;

  const changeQty = (
    id: string,
    type: "inc" | "dec",
    max: number
  ) => {

    setQty((prev) => {

      const current =
        prev[id] || 0;

      return {
        ...prev,
        [id]:
          type === "inc"
            ? Math.min(
                current + 1,
                max
              )
            : Math.max(
                current - 1,
                0
              ),
      };
    });
  };

  const summary =
    useMemo(() => {

      if (!selectedEvent) {

        return [];
      }

      return selectedEvent.tickets
        .map((ticket) => {

          const id =
            ticket._id ||
            ticket.name;

          const quantity =
            qty[id] || 0;

          return {
            ...ticket,
            id,
            quantity,
            total:
              quantity *
              ticket.price,
          };
        })
        .filter(
          (ticket) =>
            ticket.quantity > 0
        );
    }, [qty, selectedEvent]);

  const totalPrice =
    useMemo(() => {

      return summary.reduce(
        (acc, item) =>
          acc + item.total,
        0
      );
    }, [summary]);

  const resetQuantities = () => {

    setQty({});
  };

  const [paying, setPaying] = useState(false);

  const completePurchase = async () => {
    if (!selectedEvent?._id || !user?._id || !token || summary.length === 0) {
      return;
    }

    const items = summary.map((ticket) => ({
      ticketType: ticket.name,
      quantity: ticket.quantity,
    }));

    setPaying(true);

    try {
      const result = await payWithRazorpay({
        eventId: selectedEvent._id,
        items,
        token,
        userName: user.name,
        userEmail: user.email,
        eventTitle: selectedEvent.title,
      });

      await dispatch(fetchEvents());
      if (user._id) {
        await dispatch(fetchTickets(user._id));
      }

      resetQuantities();
      alert(result.message);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Payment failed";
      alert(message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Buy Tickets
        </h1>

        <p className="mt-2 text-gray-400">
          Secure your spot at the best events
        </p>
      </div>

      {(eventsError || ticketError) && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {eventsError || ticketError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Events
            </h2>

            {eventsLoading && (
              <span className="text-sm text-gray-400">
                Loading...
              </span>
            )}
          </div>

          <div className="space-y-4">
            {availableEvents.map(
              (event) => {
                const dateTime =
                  formatDateTime(
                    event.eventDateTime
                  );

                return (
                  <button
                    key={event._id}
                    type="button"
                    onClick={() => {
                      setSelectedEventId(
                        event._id || ""
                      );
                      resetQuantities();
                    }}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:border-[var(--accent)] hover:bg-[var(--bg3)] ${
                      selectedEventId ===
                      event._id
                        ? "border-[var(--accent)] bg-[var(--bg3)]"
                        : "border-white/10"
                    }`}
                  >
                    <div className="h-14 w-14 overflow-hidden rounded-xl bg-white/5">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[var(--accent)]">
                          {event.title
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {event.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        {dateTime.date} - {event.capacity - event.sold} left
                      </p>
                    </div>
                  </button>
                );
              }
            )}

            {!eventsLoading &&
              availableEvents.length ===
                0 && (
                <div className="rounded-2xl border border-white/10 bg-[var(--bg3)] p-5 text-sm text-gray-400">
                  No events are currently open for booking.
                </div>
              )}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
              {selectedEvent ? (
                <>
                  <div className="mb-5 h-56 overflow-hidden rounded-2xl bg-[var(--bg3)]">
                    {selectedEvent.image ? (
                      <img
                        src={
                          selectedEvent.image
                        }
                        alt={
                          selectedEvent.title
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl font-bold text-[var(--accent)]">
                        {selectedEvent.title
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    {selectedEvent.title}
                  </h2>

                  <p className="mt-3 text-sm text-gray-400">
                    {selectedEvent.location} - {selectedEventDate?.date} - {selectedEventDate?.time}
                  </p>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--bg3)] p-8 text-center text-gray-400">
                  Select an event to view available tickets.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
              <h2 className="mb-5 text-2xl font-bold text-white">
                Select Tickets
              </h2>

              <div className="space-y-5">
                {selectedEvent?.tickets.map(
                  (ticket) => {
                    const id =
                      ticket._id ||
                      ticket.name;

                    const sold =
                      ticket.sold || 0;

                    const remaining =
                      Math.max(
                        ticket.capacity -
                          sold,
                        0
                      );

                    const selected =
                      qty[id] || 0;

                    const progress =
                      ticket.capacity > 0
                        ? Math.round(
                            (sold /
                              ticket.capacity) *
                              100
                          )
                        : 0;

                    const soldOut =
                      remaining === 0;

                    return (
                      <div
                        key={id}
                        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[var(--bg3)] p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {ticket.name}
                          </h3>

                          <p className="mt-1 text-sm text-gray-400">
                            {remaining} left
                          </p>

                          <div className="mt-3 h-2 w-36 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-[var(--accent)]"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-2xl font-bold text-white">
                            {ticket.price ===
                            0
                              ? "Free"
                              : `₹${ticket.price}`}
                          </div>

                          <div className="mt-3 flex items-center gap-3 sm:justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                changeQty(
                                  id,
                                  "dec",
                                  remaining
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg4)] text-white transition-all hover:bg-white/10"
                            >
                              -
                            </button>

                            <span className="w-5 text-center font-semibold text-white">
                              {selected}
                            </span>

                            <button
                              type="button"
                              disabled={
                                soldOut ||
                                selected >=
                                  remaining
                              }
                              onClick={() =>
                                changeQty(
                                  id,
                                  "inc",
                                  remaining
                                )
                              }
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-white transition-all ${
                                soldOut ||
                                selected >=
                                  remaining
                                  ? "cursor-not-allowed bg-gray-600"
                                  : "bg-[var(--accent)] hover:opacity-90"
                              }`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}

                {selectedEvent &&
                  selectedEvent.tickets.length ===
                    0 && (
                    <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-400">
                      This event has no ticket types yet.
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
              <h2 className="mb-5 text-2xl font-bold text-white">
                Order Summary
              </h2>

              {summary.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-gray-400">
                  Select tickets to continue
                </div>
              ) : (
                <div className="space-y-4">
                  {summary.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl bg-[var(--bg3)] p-4"
                    >
                      <div>
                        <h3 className="font-semibold text-white">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>

                      <div className="text-lg font-bold text-[var(--accent)]">
                        ₹{item.total}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="my-5 border-t border-white/10"></div>

              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>

                <span className="text-[var(--accent)]">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[var(--bg2)] p-5">
              <h2 className="mb-3 text-2xl font-bold text-white">Checkout</h2>

              <p className="mb-5 text-sm text-gray-400">
                Pay securely with Razorpay — UPI, cards, and wallets supported.
              </p>

              <button
                type="button"
                onClick={completePurchase}
                disabled={summary.length === 0 || paying || !user?._id || !token}
                className={`w-full rounded-xl py-4 text-lg font-semibold text-white transition-all ${
                  summary.length === 0 || paying || !user?._id || !token
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-[var(--accent)] hover:opacity-90"
                }`}
              >
                {paying
                  ? "Opening payment..."
                  : totalPrice === 0
                    ? "Book free tickets"
                    : `Pay ₹${totalPrice} with Razorpay`}
              </button>

              {!user?._id && (
                <p className="mt-3 text-center text-sm text-gray-400">
                  Please log in to buy tickets.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
