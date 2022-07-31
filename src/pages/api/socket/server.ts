import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../../utils/types";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";


import { Server } from 'socket.io'

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('New Socket Connection')
      socket.on('playerMove', data => {
        // console.log(data)
        socket.broadcast.emit('playerMove', data)
      })
    })
  }
  res.end()
}

export default SocketHandler