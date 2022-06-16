import { Server } from "socket.io";

let players: { id: string, cursor: object, color: string}[] = [];

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log(`-> Client ${socket.id} connected`);
      players.push({id: socket.id, cursor:{}, color: `#${Math.floor(Math.random()*16777215).toString(16)}`});
  
      socket.on('cursor', (position) => {
        const index = players.findIndex(el => el.id === socket.id);
        if(index !== -1) players[index].cursor = {x: position.x, y : position.y}
        socket.emit('players', players);
      })
     
      socket.on('disconnect', () => {
        const index = players.findIndex(el => el.id === socket.id);
        if(index !== -1) players.splice(index,1)[0];
  
        console.log(`<- Client ${socket.id} disconnected`);
      })
    });
  }
  res.end()
}

export default SocketHandler
