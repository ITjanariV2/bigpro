const messageform = document.querySelector(".chatbox")
const messageList = document.querySelector("#messagelist")
const userList = document.querySelector("#users")
const chatboxinput = document.querySelector(".messageFormInput")
const socket = io("http://localhost:5000")

socket.on('sendMessage', message => {
    console.log(message)
})

messageform.addEventListener('submit', e => {
    e.preventDefault()
    const message = chatboxinput.value

    if (message == '') { return }
    socket.emit('message', message)

    chatboxinput.value = ''

})

// `
// <li class=${show ? "private" : "notPrivate"}>
//     <p>${messages[x].user}</p>
//     <p>${messages[x].message}</p>
// </li>
// `