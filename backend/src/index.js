//step 1 setting up server
//step 4 cookie parser
const express = require("express");
const app = express();
require("dotenv").config();
const main = require("./config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/UserAuthentication");
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const cors = require("cors");
const videoRouter = require("./routes/videoCreator");
const profileRouter = require("./routes/profile");

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB and Redis once, reuse across requests (needed for serverless)
let ready = null;
const init = () => {
  if (!ready) {
    ready = Promise.all([
      main(),
      redisClient.isOpen ? null : redisClient.connect(),
    ]).catch((err) => {
      ready = null; // allow retry on the next request
      throw err;
    });
  }
  return ready;
};

app.use(async (req, res, next) => {
  try {
    await init();
    next();
  } catch (err) {
    console.log("Connection error: " + err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiRouter);
app.use("/video", videoRouter);
app.use("/profile", profileRouter);

// Local development: start a normal server
if (require.main === module) {
  init()
    .then(() => {
      console.log("DB Connected");
      app.listen(process.env.PORT, () => {
        console.log("Server listening at port number: " + process.env.PORT);
      });
    })
    .catch((err) => console.log("Error: " + err));
}

// Vercel: import and serve the exported app
module.exports = app;
