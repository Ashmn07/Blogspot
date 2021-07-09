import React, {useState,useEffect} from 'react'
import {io} from 'socket.io-client'
import Button from '@material-ui/core/Button'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip'

// const user = {
//     name:"tom",
//     id:'2'
// }

function Chat({id}) {

    console.log(id)

    const [message,setMessage] = useState('');
    const [socket, setSocket] = useState();

    useEffect(() =>{
        const s = io("http://localhost:3001/")
        setSocket(s)
        
        return () =>{
            s.disconnect();
        }
    },[])

    useEffect(() =>{
        if(socket == null) return;
        socket.emit("join-room", id)
    },[id, socket])

    useEffect(() =>{
        if(socket == null) return
        socket.on("receive-message",message=>{
           display(message)          
        })
    },[id, socket])


    const display = (message) => {
        const mes = document.createElement("div")
        mes.style.padding = '7px 10px'
        mes.style.margin = "15px"
        mes.style.maxWidth="50%"
        mes.style.width="max-content"
        mes.style.height="auto"
        mes.style.wordWrap="break-word"
        mes.style.backgroundColor="#141414"
        mes.style.color = "white"
        mes.style.borderRadius = "10px"
        mes.textContent=message
        document.querySelector(".messages").append(mes)
        const chCont = document.querySelector(".message-container")
        const ch = chCont.scrollHeight
        chCont.scroll(0,ch)
    }

    const sendMessage = (e) =>{
        e.preventDefault()
        socket.emit("send-message", message)
        setMessage("")
    }

    const styles = {
        message_container:{
            // marginTop: '10px',
            // marginLeft: '20px',
            overflowY: 'scroll',
            // overflowX:'hidden',
            flex:'1',
        },
        chat__container: {
            flex:'1',
            display:'flex',
            // position: 'sticky',
            // top:0,
            flexDirection:'column',
            justifyContent: 'space-between',
            height:'100%',
            // maxHeight: '100vh',
            width: '33vw'
        },
        form:{
            backgroundColor:"#141414"
        },
        input:{
            marginLeft: '10px',
            background: 'transparent',
            padding: '15px',
            outlineWidth: 0,
            width: '90%',
            border: 'none',
            outline: 'none',
            color: 'white',
            fontSize: '1rem'
        },
        chat__header:{
            display: 'flex',
            backgroundColor:"#141414",
            color:'white',
            width:'100%',
            height:'fit-content',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        chat__headertext:{
            marginLeft:'25px',
        },
        chat__shareButton: {
            backgroundColor:"white",
            color:"#141414",
            marginRight:'10px',
            cursor: 'pointer',
        }
    }
    return (
      <div className="chat__container" style={styles.chat__container}>
        <div style={styles.chat__header}>
          <h3 style={styles.chat__headertext}>Chat</h3>
          <Tooltip title="Copy Room Code">
          <Button
            style={styles.chat__shareButton}
            onClick={() =>
              navigator.clipboard.writeText(id)
            }
          >
            <FileCopyIcon/>
          </Button>
          </Tooltip>
        </div>
        <div className="message-container" style={styles.message_container}>
          <div className="messages">
            {/* <div style={{backgroundColor:"#ff1616"}}>
                    <p>{message}</p>
                </div> */}
          </div>
        </div>
        <form onSubmit={(e) => sendMessage(e)} style={styles.form}>
          <input
            type="text"
            placeholder="Enter Message"
            style={styles.input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
    );
}

export default Chat
