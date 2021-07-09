const express = require('express')
const app = express();
const PORT = process.env.PORT || 3001
const io = require('socket.io')(PORT,{
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET','POST']
    },
})

const Document = require('./Document')
const User = require('./User')
// const Chat = require('./Chat')

// mongoose
app.use(express.json())
app.use(require('./auth'))
const mongoose = require('mongoose');

const MONGOURI = "mongodb+srv://Ash:Bucksin7NBA@cluster0.z1jvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(MONGOURI,{
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
    socket.on("get-document",async (documentId,user)=>{
        const document = await findOrCreateDocument(documentId)
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
        socket.on("send-message", async (message) =>{
            console.log(message)
            io.in(roomId).emit("receive-message",message)
        })
    })
})

app.get("/",(req,res)=>res.send("hello"))

app.listen(8080,()=>{
    console.log("Server is running",8080);
})

async function findOrCreateDocument(id) {
    if (id == null) return
  
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: "" })
}