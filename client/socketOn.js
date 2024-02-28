const messageform = document.querySelector(".chatbox form")
const messageList = document.querySelector("#messagelist")
const userList = document.querySelector("ul#users")
const chatboxinput = document.querySelector(".chatbox input")
const socket = io("http://localhost:5000")

let users = []
let messages = []
let isUser = ''

// listens for messages
socket.on('message', message => {
    messages.push(message)
    updateMessages()
})

socket.on('private', data => {
    isUser = data.name
})

// user events
socket.on('users', (_users) => {
    users = _users
    updateUsers()
})

messageform.addEventListener('submit', (e) => {
    // all of this sends the message, clears the input
    e.preventDefault()
    let message = chatboxinput.value
    socket.emit('message', message)
    chatboxinput.value = ''
})

// updates userList array, clears the existing list and iterates through array to create list items for each user
const updateUsers = () => {
    userList.textContent = ''
    for (let x = 0; x < users.length; x++) {
        let node = document.createElement('li')
        let textNode = document.createTextNode(users[x])
        node.appendChild(textNode)
        userList.appendChild(node)
    }
}

const updateMessages = () => {
    messageList.textContent = ''
    for (let x = 0; x < messages.length; x++) {
        const show = isUser === messages[x].user ? true : false
        messageList.innerHTML += `
        <li class=${show ? "private" : "notPrivate"}>
            <p>${messages[x].user}</p>
            <p>${messages[x].message}</p>
        </li>
        `
    }
}

// adds user to the chat
const addUser = (user) => {
    username = user || `User${Math.floor(Math.random() * 100)}`
    socket.emit('adduser', username)
}   

addUser()