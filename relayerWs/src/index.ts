import  { WebSocketServer , WebSocket} from 'ws';
import express from 'express';

const app = express();

const server = app.listen(3000);
const wss = new WebSocketServer({ server });

const servers: WebSocket[] = [];

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  servers.push(ws);

  ws.on('message', function message(data: string) {
    servers.forEach(server => {
        server.send(data);
    })
  });
});