const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
//model
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const server = http.createServer(app);
const cookie_parser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// routers_api

const user_api = require("./routes/route_user");
const conversation_api = require("./routes/route_conversation");
const message_api = require("./routes/route_message");
const friend_api = require("./routes/route_friend");

//// post
const postMessage_api = require("./routes/route_postmessage");
const chatPost_api = require("./routes/router_chatpost");
const repliedChatPost_api = require("./routes/route_repliedchat_post");
///EMOJI
const emoji_api = require("./routes/route_emoji");
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://facebook-clone-fn.vercel.app",
      "https://facebook-fn-ffa75922dc76.herokuapp.com",
      "https://main.d5h1jgaml9gu7.amplifyapp.com",
    ],
  })
);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://facebook-clone-fn.vercel.app",
      "https://facebook-fn-ffa75922dc76.herokuapp.com",
      "https://main.d5h1jgaml9gu7.amplifyapp.com",
    ],
  },
});
//how to allow https://ad56-122-100-73-99.ngrok-free.app/

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connnted potatos"));

app.use(express.json());
app.use(cookie_parser());

let users = [];

function addUSer(user, socketId) {
  console.log("id", user._id);
  const checked = users.some((checked) => checked.user._id === user._id);
  !checked && users.push({ user, socketId });

  console.log("Added", users);
}

function removedUser(socketId) {
  console.log("remove function socketID", socketId);
  const removeUser = users.find((checked) => checked.socketId === socketId);
  users = users.filter((checked) => checked.socketId !== socketId);

  return { removeUser, users };
}
///GPT ZONE

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
app.post("/gpt", async (req, res) => {
  // const { message } = req.query;

  try {
    const { prompt } = req.body;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    console.log(completion.data.choices[0].text);
    res.status(200).json({ message: completion.data.choices[0].text });
  } catch (err) {
    console.log("ERROR", err);
    res.status(200).json({ message: err });
  }
});
app.post("/gpt_image", async (req, res) => {
  // const { message } = req.query;

  try {
    const { prompt } = req.body;
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });
    const image = response.data.data[0].url;
    console.log(image);
    res.status(200).json({ message: image });
  } catch (err) {
    console.log("ERROR", err);
    res.status(200).json({ message: err });
  }
});
io.on("connection", (socket) => {
  socket.on("add_user", (user) => {
    console.log(user.username, "is connected");
    addUSer(user, socket.id);

    io.emit("get_user", users);
  });
  socket.on("join_room", (conversation) => {
    console.log("DOC CONVERSATION", conversation);
    const roomIdsSet = new Set(socket.rooms);
    const roomIds = [...roomIdsSet];
    roomIds.forEach((roomId) => {
      if (roomId !== socket.id) {
        console.log("LEAVE");
        socket.leave(roomId);
      }
    });
    console.log("join room", conversation._id);
    socket.join(conversation._id);
  });

  socket.on("add_message", (message) => {
    console.log("SEND", message.text, "TO", message.conversationId);
    socket.to(message.conversationId).emit("get_to_message", message);
  });

  socket.on("add_post_message", (post) => {
    console.log("SOCKETpost_message", post.senderId);
    console.log("SOCKETconversationId", post.text);
    socket.emit("get_post_message", post);
  });

  socket.on("logout", () => {
    const { removeUser, users } = removedUser(socket.id);
    console.log(removeUser, "logged out");
    io.emit("get_user", users); // checked **** send back array or not
  });
  socket.on("disconnect", () => {
    const { removeUser, users } = removedUser(socket.id);

    removeUser && console.log(removeUser, "discconected");
    removeUser && io.emit("get_user", users); // checked **** send back array or not
  });
});

app.use("/user/api", user_api);
app.use("/conversation/api", conversation_api);
app.use("/message/api", message_api);
// this is for filter
app.use("/friend/api", friend_api);

/// post section
app.use("/post_message/api", postMessage_api);
app.use("/chatpost/api", chatPost_api);
app.use("/repliedchat_post/api", repliedChatPost_api);
app.use("/emoji_sentiment/api", emoji_api);
app.get("/", (req, res) => {
  res.json({ master: "DEPLOY SUCCESS AWS" });
});
server.listen(
  process.env.PORT || 4000,
  console.log("server is running on port 4000")
);
