import cors from "cors";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

import http from "node:http";
import { Server } from "socket.io";
import { InitialAppProps } from "./src/types/InitialAppProps";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT;

io.on("connection", (socket) => {
  const { deviceType } = socket.handshake.query;
  socket.join(deviceType!);

  socket.on(
    "show-in-tv",
    ({ broadcaster, broadcasterIndex, program }: InitialAppProps) => {
      console.log(broadcasterIndex);

      io.to("tv").emit("show-in-tv", {
        broadcaster,
        broadcasterIndex,
        program,
      });
    }
  );
});

server.listen(process.env.PORT, () => {
  console.log(`Server runing in http://localhost:${PORT} 🔥`);
});
