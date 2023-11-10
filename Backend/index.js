const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors())

//create http
const http = require('http');
const myServer = http.createServer(app);

const {Server} = require('socket.io');

//create io
const io = new Server(myServer, {cors:{
    //front end connection
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
}})

//io connection first

io.on("connection", (socket)=>{
    //message on connection
    console.log(`User : ${socket.id} joined the chat!`);

    //disconnected message
    socket.on("disconnect", ()=>{
        console.log(`${socket.id} disconnected from the network.`)
    });

    //to join a room, listen event join_room to get data from front
    socket.on("join_room", (roomData)=>{
        socket.join(roomData);
        console.log(`User ${socket.id} joined room: ${roomData}`);
    })

    //listen to front end message
    socket.on("send_message",(gotMessageData)=>{
        console.log(gotMessageData)
        //send message to front of same room
        socket.to(gotMessageData.room).emit("receive_message", gotMessageData)
    });


})


myServer.listen(5000, ()=>{
    console.log("My server is on 5k")
})