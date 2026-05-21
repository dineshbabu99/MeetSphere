const express =
  require("express");

const cors =
  require("cors");

const dotenv =
  require("dotenv");



const connectDB =
  require("./config/db");



const authRoutes =
  require("./routes/authRoutes");

const eventRoutes =
  require("./routes/eventRoutes");

const ticketRoutes =
  require("./routes/ticketRoutes");

const scheduleRoutes =
  require("./routes/scheduleRoutes");



dotenv.config();



connectDB();



const app =
  express();



/* Middleware */

app.use(cors());

app.use(express.json());



/* Routes */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/schedules",
  scheduleRoutes
);



/* Test Route */

app.get("/", (req, res) => {

  res.send(
    "MeetSphere API Running"
  );
});



/* Server */

const PORT =
  process.env.PORT || 5000;



app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});
