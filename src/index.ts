import { createServer } from "http";
import { app } from "./app";

const PORT = process.env.PORT || 5000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
