if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const http = require('http')
const app = require('./app')
const socketio = require("socket.io")
const express = require('express')
const path = require('path')
const mysql = require('mysql')

const userNameReq = require('./app')

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})


app.use(express.static(path.resolve(__dirname, 'client')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

const port = 5000

const server = http.createServer(app)

const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

const users = []

io.on("connection", socket => {
    // listens for events from client
    socket.on("adduser", () => {
      socket.user = userNameReq.username
      users.push(userNameReq.username)
      io.sockets.emit("users", users) // sends events and data to client
    
      io.to(socket.id).emit("private", { // sends an event to all clients in a specific room
        id: socket.id,
        name: socket.user,
        msg: "secret message"
      })
    })
  
    socket.on("message", message => {
        let messageObj = {
            message, // message (from user)
            sender: socket.id, // id of the user
            timestamp: Date.now()
        }

        console.log(messageObj)
        
      io.sockets.emit("message", {
        message,
        user: socket.user,
        id: socket.id
      })
    })
  
    socket.on("disconnect", () => {
      console.log(`user ${socket.user} is disconnected`)
      if (socket.user) {
        users.splice(users.indexOf(socket.user), 1)
        io.sockets.emit("user", users)
        console.log("remaining users:", users)
      }
    })
})
  
server.listen(port, () => console.log('Server running on port: ' + port))

// console.log(server)