import React, {useState,useEffect} from 'react'
import {io} from 'socket.io-client'
import Button from '@material-ui/core/Button'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip'
import {useHistory} from 'react-router-dom'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

function Chat({id}) {

    const history = useHistory()

    const [message,setMessage] = useState('');
    const [socket, setSocket] = useState();
    const [temp,setTemp] = useState([])

    useEffect(() =>{
        const s = io("/")
        setSocket(s)
        
        return () =>{
            s.disconnect();
        }
    },[])

    useEffect(() =>{
      console.log(temp)
    },[temp])

    useEffect(() =>{
        if(socket == null) return;
        socket.emit("join-room", id)
    },[id, socket])

    const sendMessage = (e) =>{
        e.preventDefault()
        socket.emit("send-message", message,localStorage.getItem("user"))
        setMessage("")
    }

    useEffect(() =>{
        if(socket == null) return
        socket.on("receive-message",(message,user)=>{
            display(message,JSON.parse(user))          
        })
    },[id, socket])

    const display = (message,user) => {
      setTemp((temp)=>[...temp,{user,message}])
      // t.push({user,message})
      // console.log(t)
        // const mes = document.createElement("div")
        // const nameDiv = document.createElement("div")
        // nameDiv.textContent = user.name
        // mes.style.padding = '7px 10px'
        // mes.style.margin = "5px 15px 15px 15px"
        // nameDiv.style.margin = "15px 15px 0 15px"
        // mes.style.maxWidth="50%"
        // nameDiv.style.fontWeight="bold"
        // mes.style.width="max-content"
        // mes.style.height="auto"
        // mes.style.wordWrap="break-word"
        // nameDiv.style.wordWrap="break-word"
        // if(user._id !== JSON.parse(localStorage.getItem("user"))._id){
        //     mes.style.backgroundColor="#141414"
        //     mes.style.color = "white"
        //     mes.style.alignSelf="flex-start"
        //     nameDiv.style.alignSelf="flex-start"
        // }
        // else{
        //     mes.style.backgroundColor="white"
        //     mes.style.color = "#141414"  
        //     mes.style.alignSelf="flex-end" 
        //     nameDiv.style.alignSelf="flex-end" 
        // }
        // mes.style.borderRadius = "10px"
        // mes.textContent=message
        // document.querySelector(".messages").append(nameDiv)
        // document.querySelector(".messages").append(mes)
        const chCont = document.querySelector(".message-container")
        const ch = chCont.scrollHeight
        chCont.scroll(0,ch)
    }

    const styles = {
        message_container:{
            overflowY: 'scroll',
            flex:'1',
        },
        chat__container: {
            flex:'1',
            display:'flex',
            flexDirection:'column',
            justifyContent: 'space-between',
            height:'100%',
            width: '33vw'
        },
        form:{
            backgroundColor:"#141414",
            color:'white'
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
        },
        chat__buttons:{
          display:'flex'
        },
        
    }
    return (
      <div className="chat__container" style={styles.chat__container}>
        <div style={styles.chat__header}>
          <h3 style={styles.chat__headertext}>Chat</h3>
          <div style={styles.chat__buttons}>
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
          <Tooltip title="Exit Room">
          <Button
            style={styles.chat__shareButton}
            onClick={()=>history.push('/')}
          >
            <ExitToAppIcon/>
          </Button>
          </Tooltip>
          </div>
        </div>
        <div className="message-container" style={styles.message_container}>
          <div className="messages" style={{display:'flex',flexDirection:'column'}}>
            {
              temp.length!==0?temp.map(t=>{
                let addMessStyles,addNameStyles;
                if(t.user._id === JSON.parse(localStorage.getItem("user"))._id){
                  addMessStyles = {
                    backgroundColor:"white",
                    color:"black",  
                    alignSelf:"flex-end", 
                  }
                  addNameStyles = {
                    alignSelf:"flex-end"
                  }
                }
                else{
                  addMessStyles = {
                    backgroundColor:"#141414",
                    color:"white",  
                    alignSelf:"flex-start", 
                  }
                  addNameStyles = {
                    alignSelf:"flex-start"
                  }
                }
                return(
                  <>
                  <div style={{
                    ...addNameStyles,
                    margin : "15px 15px 0 15px",
                    fontWeight:'bold',
                    wordWrap:"break-word",
                  }}>
                    {t.user.name}
                  </div>
                  <div style={{
                    ...addMessStyles,
                    borderRadius:"10px",
                    padding : '7px 10px',
                    margin : "5px 15px 15px 15px",
                    maxWidth:"50%",
                    width:"max-content",
                    height:"auto",
                    wordWrap:"break-word",
                  }}>
                    {t.message}
                  </div>
                  </>
                )
              }):null
            }
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
