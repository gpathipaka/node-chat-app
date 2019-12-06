const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {addUser, getUser, removeUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirPath = path.join(__dirname, '../public')
app.use(express.static(publicDirPath))

let count = 1000
io.on('connection', (socket) => {
    
    socket.on('join', ({username, room}, callback) => {
        const { error, user } = addUser({id: socket.id, username, room})
        if (error) {
            return callback(error)
        }
        socket.join(room)
        socket.emit('message', generateMessage(user.username, `Weclome ${username}`))
        socket.broadcast.to(room).emit('message', generateMessage(user.username, `${username} has Joined !!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
     })
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback('Delivered')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(user.username,`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

   
   socket.on('sendLoclocation', (loc) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${loc.latitude},${loc.longitude}`))
    })
})


server.listen(port, () => {
    console.log(`Application is listerning on ${port}!`)
})