
export interface Player {
    id: string;
    name: string;
    action: string;
    score: number;
    status: string;
}
export interface Match {
    id: string;
    player: Player[];
    winner: string;
    loser: string;
    status: string;
    rounds: number;
    createdAt: string;
    updatedAt: string;
}

// Socket Types
export interface ServerToClientEvents {
    noArg: () => void;
    inputUpdate: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
  }
  
  export  interface ClientToServerEvents {
    hello: () => void;
  }
  
  export  interface InterServerEvents {
    ping: () => void;
  }
  
  export  interface SocketData {
    name: string;
    age: number;
  }


import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
