import React, { useState, useEffect, useRef } from 'react'
// import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({socket, username, room}) => {
    const [chatMessage, setChatMessage] = useState("");
    const [messageList, setMessageList] = useState([])

    //send message with data
    const sendMessage = async()=>{
        if(chatMessage !== ""){
            const sentMessageData = {
                room: room,
                author: username,
                message: chatMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
            //send message, but also include it in message list so that we can loop it
            await socket.emit("send_message", sentMessageData);
            setMessageList((prevList)=>[...prevList, sentMessageData])
            setChatMessage("")
        }
    }

      //listen for message from backend for receive_message event, add same to message list
  useEffect(()=>{
    socket.on("receive_message",(gotMessageData)=>{
      setMessageList((prevList)=> [...prevList, gotMessageData])
    })
  },[socket])

  //to make the chat scrollable, we added overflow y to auto in css, now to scroll automatically, use effct
  const chatBodyRef = useRef();
  useEffect(() => {
    // Scroll to the bottom of the chat body
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messageList]);

  return (
    <div className='chat-window'>
      <div className="chat-header">
        <p><span className="greenbutton" >.</span> Live Chat</p>
      </div>
      <div className="chat-body" ref={chatBodyRef}>
          {/* add scrollable here */}
      {/* <ScrollToBottom className='message-container'> */}
        {messageList.map((itemMsg)=>{
        
        // conditionally change message id to make it left or right depending on who is sending it
        return (<div className='message' id={username === itemMsg.author ? "you" : "other"} >
            <div>
                <div className='message-content'>
                    <p>{itemMsg.message}</p>
                </div>
                <div className='message-meta'>
                    <p id='time'>{itemMsg.time}</p>
                    <p id='author'>{itemMsg.author}</p>
                </div>
            </div>
        </div>)
      })}
      {/* </ScrollToBottom> */}
      </div>
      <div className="chat-footer">
        <input type="text" placeholder='Message' value={chatMessage} onChange={(e)=>{setChatMessage(e.target.value)}}  onKeyDown={(e)=>{
            if(e.key === "Enter"){
                sendMessage();
            }
        }}/>
        <button onClick={sendMessage} >&#9658;</button>
      </div>
    </div>
  )
}

export default Chat
