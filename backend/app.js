import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import ErrorHandler from "./middleware/error.js";

const app = express();

const { NODE_ENV } = process.env;

app.use(express.json());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hackers know about our stack
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "config/.env",
  });
}

// import routes
import authRouter from "./routes/authRoutes.js";
import otpRouter from "./routes/otpRoutes.js";
import user from "./controller/user.js";
import shop from "./controller/shop.js";
import product from "./controller/product.js";
import event from "./controller/event.js";
import coupon from "./controller/coupounCode.js";


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/user", user);
app.use("/api/v1/shop", shop);
app.use("/api/v1/product", product);
app.use("/api/v1/event", event);
app.use("/api/v1/coupon", coupon);

// it's for ErrorHandling
app.use(ErrorHandler);

export default app;
