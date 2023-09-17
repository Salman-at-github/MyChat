import {  useRef, useState } from 'react';
import './App.css';
import Chat from './Chat';

//import io for connection
import io from 'socket.io-client';
//connect to backend io
const socket = io.connect('http://localhost:5000');



function App() {

  const [username, setusername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  //emit the join room event
  const joinRoom = ()=>{
    if(username !== "" && room !== ""){
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }
  //on pressing enter in username, focus room number
  const roomNumberRef = useRef();
  return (
    <div className='App'>
      {!showChat && 
    <div className='joinChatContainer'>
      <h2>Join Chat Now</h2>
      <input type="text" placeholder='Username' onChange={(e)=>{setusername(e.target.value)}} value={username} onKeyDown={(e)=>{
        if(e.key === "Enter"){
          roomNumberRef.current.focus();
        }
      }}/>
      <input ref={roomNumberRef} type="text" placeholder='Room No.' onChange={(e)=>{setRoom(e.target.value)}} value={room} onKeyDown={(e)=>{
        if(e.key === "Enter"){
          joinRoom();
        }
      }}/>
      <button onClick={joinRoom}>Join Room</button>
    </div>
      }
    {showChat && 
    <Chat socket={socket} username={username} room={room}/>
    }
    </div>
  );
}

export default App;
