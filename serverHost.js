if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const http = require('http')
const app = require('./app')
const socketio = require("socket.io")
const express = require('express')
const path = require('path')
const mysql = require('mysql')

const userInfo = require('./app')

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
        origin: ['http://192.168.1.109:5000']
    }
})

// let values = [messageObj.message, messageObj.email, messageObj.timestamp]
// connection.query('INSERT INTO chatrooms (message, email, timestamp) VALUES (?, ?, ?)', values, (err, data) => {
//   if (err) { console.log(err) }
//   console.log('Message inserted')
// })

io.on("connection", (socket) => {
  socket.on('message', data => {
    socket.broadcast.emit('sendMessage', data)
  })
})
   
  
server.listen(port, () => console.log('Server running on port: ' + port))