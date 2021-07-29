const { io } = require("../../server/server");
const { generateMessage } = require("../utils/message");


io.on("connection", (client) => {
    console.log("A new user just connected");

    client.emit(
        "newMessage",
        generateMessage("Admin", "Welcome to the chat app")
    );

    client.broadcast.emit(
        "newMessage",
        generateMessage("Admin", "new User join")
    );

    client.on("disconnect", () => {
        console.log("User was disconnect");
    });
});