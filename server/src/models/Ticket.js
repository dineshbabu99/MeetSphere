const mongoose =
  require("mongoose");

const ticketSchema =
  new mongoose.Schema(
    {
      ticketId: {
        type: String,
        required: true,
        unique: true,
      },

      eventId: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        require:true,
      },
      eventName: {
        type: String,
        required: true,
      },


      ticketType: {
        type: String,
        required: true,
      },

      location: {
        type: String,
      },

      date: {
        type: String,
      },

      price: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },

      purchaseDate: {
        type: Date,
        default: Date.now,
      },
      status: {
  type: String,

  enum: [
    "Active",
    "Cancelled",
  ],

  default: "Active",
},
      attendanceStatus: {
        type: String,
        enum: [
          "Booked",
          "Attended",
          "Not Arrived",
        ],
        default: "Booked",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Ticket",
    ticketSchema
  );
