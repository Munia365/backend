import app from "./app";
import { env } from "./config/env";

const port = env.PORT;

// Create HTTP server from Express app
const server = app.listen(port, () => {

   // Server has been created and is now listening for requests

  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${env.NODE_ENV || "development"}`);
  console.log(`Frontend URL: ${env.FRONT_END_URL}`);
});

// Gracefully shut down the server on termination signals
const shutdown = (signal: string) => {
  console.log(`\n${signal} received.Shutting down gracefully...`);

  // Stop accepting new connections, finish existing ones
  server.close(() => {
    console.log(" Server closed");
    process.exit(0);
  });

  // Force shutdown if connections don't close in time
  setTimeout(() => {
    console.error("Forcing shutdown");
    process.exit(1);
  }, 10000);
};


// Handle OS termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Crash the process on uncaught errors (let process manager restart it)
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
