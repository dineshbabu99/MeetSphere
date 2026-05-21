const mongoose =
  require("mongoose");

const sessionSchema =
  new mongoose.Schema(
    {
      startTime: {
        type: String,
        required: true,
      },

      endTime: {
        type: String,
      },

      title: {
        type: String,
        required: true,
      },

      speaker: {
        type: String,
      },

      tag: {
        type: String,
        default: "Session",
      },

      venue: {
        type: String,
      },

      description: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

const daySchema =
  new mongoose.Schema(
    {
      date: {
        type: Date,
        required: true,
      },

      title: {
        type: String,
      },

      sessions: [sessionSchema],
    },
    {
      timestamps: true,
    }
  );

const scheduleSchema =
  new mongoose.Schema(
    {
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
        unique: true,
      },

      days: [daySchema],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Schedule",
    scheduleSchema
  );
