import React,{ useCallback, useState, useEffect } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import './styles.css';
import {io} from 'socket.io-client'

const TOOLBAR = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  // [{ size: ["small", false, "large", "huge"] }], // custom dropdown

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"],
];

function TextEditor() {

  const documentId = "123450"
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()

  //setting socket to url value of backend socket server
  useEffect(() =>{
    const s = io("http://localhost:3001/")
    setSocket(s);

    return () =>{
      s.disconnect();
    }
  }, []);

  // load data after quill value is set to new Quill() and every time documentId
  // changes we fetch new document
  useEffect(() =>{
    if(socket == null || quill == null) return    // if quill or socket is null it will just return. That is why useCallback() happens first
    socket.once('load-document',document=>{       //Event listener
      quill.setContents(document)
      quill.enable()      // allows user to edit. If not given it does not allow user to edit.
    })

    socket.emit("get-document",documentId) //passing documentId to backend so that it fetches data frm backend or creates new one
  },[socket,quill,documentId])

  // saving data to database after an interval of every 2 seconds
  useEffect(() =>{
    if(socket == null || quill == null) return
    const interval = setInterval(() =>{
      socket.emit('save-document', quill.getContents());
    }, 2000)
    
    return () => {
      clearInterval(interval);
    }
  }, [socket,quill])

  // send and receive changes
  useEffect(() =>{
    if(socket == null || quill == null) return
    
    const handler = (delta) => {
      quill.updateContents(delta) 
      quill.scrollIntoView()         
    }

    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    }
  }, [socket,quill])

  
  //quill listens for text change. Whenever text changes, the handler function is 
  //called and quill passes the old content, new changes 
  //and source to the handler. Handler emits the changes delta to the server.i
  useEffect(() =>{
    if(socket == null || quill == null) return
    
    const handler = (newDelta, oldDelta, source) =>{
      if(source !== "user") return;  //we are checking if change is made by user if its done by api then we return null
      socket.emit("send-changes", newDelta)
    }

    quill.on('text-change',handler)

    return () => {
      quill.off('text-change',handler)
    }
  }, [socket,quill])

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow", modules: { toolbar: TOOLBAR }, scrollingContainer: '#scrolling-container' });
    q.disable()
    q.setText("Loading...")
    setQuill(q)
  }, []);

  return <div className="texteditor__container" style={{flex:'2',height:'100%',overflowY:'auto'}} ref={wrapperRef}></div>;
}

export default TextEditor


