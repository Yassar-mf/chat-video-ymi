const app = require('express')();
const server = require("http").createServer(app)
const cors = require("cors");

const io = require('socket.io')(server,{
    cors:{
        origin:"*",
        methods: ["GET","POST"]
    }
})

app.use(cors())

const PORT = process.env.PORT || 5000;

app.get("/",(req, res)=>{
    res.send('Serveur lancé')
})


io.on('connection',(socket)=>{
    socket.emit('moi', socket.id)
    socket.on('disconnect',()=>{
        socket.broadcast.emit('finappel')
    })

    socket.on("appelerutilisateur",({ utilisateuraappeler, donneeSignal, de, nom })=>{
        io.to(utilisateuraappeler).emit("appelerutilisateur",{ signal: donneeSignal, de, nom })
    })

    socket.on("repondrealapel",(donnee)=>{
        
        io.to(donnee.a).emit("appelaccepte",donnee.signal)
    })

})


server.listen(PORT, () => console.log(`Serveur lancé sur le port : http://localhost:${PORT}`))