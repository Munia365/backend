import app from "./app";
import { env } from "./config/env";

const port = env.PORT;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${env.NODE_ENV || "development"}`);
  console.log(`Frontend URL: ${env.FRONT_END_URL}`);
});


const shutdown = (signal: string) => {
  console.log(`\n${signal} received.Shutting down gracefully...`);
  server.close(() => {
    console.log(" Server closed");
    process.exit(0);
  });


  setTimeout(() => {
    console.error("Forcing shutdown");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));


process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
