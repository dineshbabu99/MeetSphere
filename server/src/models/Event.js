const mongoose =
  require("mongoose");

const ticketSchema =
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
    },

    sold: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },
  });

const eventSchema =
  new mongoose.Schema(
    {
      title: String,

      description: String,

      category: String,

      location: String,

      eventDateTime: {
        type: Date,
        required: true,
      },

      bookingStart: {
        type: Date,
        required: true,
      },

      bookingEnd: {
        type: Date,
        required: true,
      },

      image: String,

      capacity: Number,

      sold: {
        type: Number,
        default: 0,
      },

      organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      status: {
        type: String,

        enum: [
          "Open",
          "Pending",
          "Rejected",
          "Draft",
        ],

        default: "Draft",
      },

      tickets: [ticketSchema],
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Event",
    eventSchema
  );
