import express from "express";
import config from "./config/config.js";
import dbConnect from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth/authRoutes.js";
import bodyParser from "body-parser";
import morgan from "morgan";
import {
  Admin,
  authMiddleware,
  isAdminMiddleware,
} from "./helpers/helperFunction.js";
import adminRouter from "./routes/admin/adminRouter.js";
import userRouter from "./routes/user/userRouter.js";

const app = express();
const port = config.PORT;

app.set("trust proxy", true);
morgan.token("remote-addr", function (req) {
  return req.headers["x-forwarded-for"] || req.socket.remoteAddress;
});

morgan.token("url", (req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  return req.originalUrl;
});

app.use(
  morgan(
    ":remote-addr :method :url :status :res[content-length] - :response-time ms"
  )
);
//middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON input" });
  }
  next(err); // Pass to the next middleware if not a JSON error
});

// Default error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

//routting
app.use("/api/auth", authRouter);
app.use("/api/admin", authMiddleware, isAdminMiddleware, adminRouter);
app.use("/api/user", userRouter);
//database connection
dbConnect()
  .then(() => {
    Admin();
    app.listen(port, () => {
      console.log(`server listening at ${port} port`);
    });
  })
  .catch(() => {
    console.log(`unable to connected to server`);
  });
