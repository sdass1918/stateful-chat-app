"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const server = app.listen(3000);
const wss = new ws_1.WebSocketServer({ server });
const servers = [];
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    servers.push(ws);
    ws.on('message', function message(data) {
        servers.forEach(server => {
            server.send(data);
        });
    });
});
