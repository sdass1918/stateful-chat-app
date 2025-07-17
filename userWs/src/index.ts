import  { WebSocketServer , WebSocket} from 'ws';
import express from 'express';

const app = express();

const server = app.listen(8081);
const wss = new WebSocketServer({ server });


/*
* This is an example of how the rooms object is going to look like
* rooms:Record<string, WebSocket[]> = { 
*     room1: [ws1, ws2, ws3],
*     room2: [ws4, ws5, ws6]
* }        
*/


const rooms:Record<string, WebSocket[]> = {
    
};

const RelayerServer = new WebSocket('ws://localhost:3000');

RelayerServer.on('message', function message(data: string) {
  const message = JSON.parse(data);
    if(message.type === "chat") {
        rooms[message.room].forEach(socket => {socket.send(message.message)});
    }
})

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: string) {
    const message = JSON.parse(data);
    if(message.type === "join-room") {
        const room = message.room;
        if(!rooms[room]) {
            rooms[room] = [];
        }
        rooms[room].push(ws);
    }
    RelayerServer.send(data);
    
  });

  ws.send('something');
});