import express from "express";
import env from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import fileupload from "express-fileupload";
import router from "./routes";
import guestRoutes from "./routes/guestRoutes";

env.config();
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(
  fileupload({
    createParentPath: true,
    useTempFiles: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the system");
});

app.use("/api", router);
app.use("/api/guest", guestRoutes);

app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status);
  res.json({
    status,
    error: error.message,
  });
});

app.listen(PORT, HOST, () => console.log("listening on port " + PORT));
