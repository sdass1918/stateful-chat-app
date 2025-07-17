"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const server = app.listen(8081);
const wss = new ws_1.WebSocketServer({ server });
/*
* This is an example of how the rooms object is going to look like
* rooms:Record<string, WebSocket[]> = {
*     room1: [ws1, ws2, ws3],
*     room2: [ws4, ws5, ws6]
* }
*/
const rooms = {};
const RelayerServer = new ws_1.WebSocket('ws://localhost:3000');
RelayerServer.on('message', function message(data) {
    const message = JSON.parse(data);
    if (message.type === "chat") {
        rooms[message.room].forEach(socket => { socket.send(message.message); });
    }
});
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        const message = JSON.parse(data);
        if (message.type === "join-room") {
            const room = message.room;
            if (!rooms[room]) {
                rooms[room] = [];
            }
            rooms[room].push(ws);
        }
        RelayerServer.send(data);
    });
    ws.send('something');
});
