import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import { validateEnv } from "./config/validateEnv";
import { stream } from "./config/logger";
import { errorHandler } from "./middleware/errorHandler";
import {
  checkDatabase,
  checkRedis,
  socketHealthCheck,
  getSystemInfo,
} from "./services/healthCheck";
import router from "./routes";

// Load environment variables
config();

// Validate environment variables
validateEnv();

export const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS configuration
// app.use(
//   cors({
//     origin: true,
//     methods: "*",
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Accept",
//       "Origin",
//       "X-Requested-With",
//     ],
//     exposedHeaders: ["Content-Range", "X-Content-Range"],
//     credentials: true,
//     maxAge: 86400,
//   })
// );

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Performance middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("combined", { stream }));

app.get("/", (req, res) => {
  res.send("ok");
});

//health check
app.get("/health", async (req, res) => {
  try {
    const [dbStatus, redisStatus, socketStatus] = await Promise.all([
      checkDatabase(),
      checkRedis(),
      socketHealthCheck(),
    ]);

    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
        socket: socketStatus,
      },
      system: getSystemInfo(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: error.message,
    });
  }
});

// Routes
app.use("/api/v1", router);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});
