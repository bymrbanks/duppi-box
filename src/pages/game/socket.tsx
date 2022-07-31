import React, { useState, useEffect, useRef } from "react";
import SocketIOClient from "socket.io-client";

import io from "socket.io-client";
let socket: any;

const useSocket = () => {
  const [input, setInput] = useState("");

  useEffect(() => {
    socketInitializer();
    return () => {
      console.log("This will be logged on unmount");
    };
  });

  const socketInitializer = async () => {
    await fetch("/api/socket/server");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("playerMove", (msg: string) => {
      console.log(msg);
    });
  };

  const onChangeHandler = () => {
    let playerMove = { id: "1", move: true, rounds: 1 };
    socket.emit("playerMove", playerMove);
  };

  return;
};

export default useSocket;
