
import { WebSocketServer } from "ws";

const wss=new WebSocketServer({port: 8080});

interface User {
    socket: WebSocket;
    room:string;
}

let allSocket:User[]=[];

wss.on("connection", (socket) => {
    console.log("connected");
    socket.on("message", (msg) => {
        //@ts-ignore
        const parsedMsg = JSON.parse(msg);
        if (parsedMsg.type == 'join') {
            console.log(parsedMsg);
            allSocket.push({ socket: socket as unknown as WebSocket, room: parsedMsg.payload.roomID });
        }
        if (parsedMsg.type == 'chat') {
            let currentUserRoom = null;
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].socket === socket as unknown as WebSocket) {
                    currentUserRoom = allSocket[i].room;
                }
            }

            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].room == currentUserRoom) {
                    allSocket[i].socket.send(parsedMsg.payload.message);
                }
            }
        }
    });
});

