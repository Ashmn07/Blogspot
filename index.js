const express = require('express')
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 8080
// const server = require('http').Server(app)
const io = require('socket.io')(PORT)

require('./models/Document')
require('./models/DomainModel')
require('./models/User')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/documents'))
app.use(require('./routes/domains'))
const mongoose = require('mongoose');

const Document = mongoose.model('Document')

mongoose.connect(process.env.MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on("connected",()=>{
    console.log("Connected to mongo yeahhh");
})
mongoose.connection.on("error",()=>{
    console.log("err connecting",err);
})


io.on('connection',socket=>{
    socket.on("get-document",async (documentId,user,name)=>{
        const document = await findOrCreateDocument(documentId,name)
        socket.join(documentId); // joining the room   
        socket.emit("load-document",document.data)

        socket.on("send-changes",delta =>{
            socket.broadcast.to(documentId).emit("receive-changes",delta)
        })

        socket.on("save-document", async data => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
    socket.on("join-room", async roomId => {
        socket.join(roomId)
        socket.on("send-message", async (message,user) =>{
            io.in(roomId).emit("receive-message",message,user)
        })
    })
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

// app.get("/",(req,res)=>{})

app.listen(PORT,()=>{
    console.log("Server is running",8080);
})

async function findOrCreateDocument(id,name) {
    if (id == null) return
  
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id,name: name,data: "" })
}