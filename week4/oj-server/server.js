let express = require("express");
let app = express();
let mongoose = require("mongoose");
let restRouter = require("./routes/rest");

let path = require("path");

let http = require("http");

let socket_io = require("socket.io");
let io = socket_io();
let socketIoService = require("./services/socketService.js")(io);

mongoose.connect("mongodb://localhost/coj");

app.use("/api/v1", restRouter);

app.use(express.static(path.join(__dirname, "../public")));

app.use(function(req, res) {
    res.sendFile("index.html", { root: (path.join(__dirname, "../public")) });
})

/*
app.listen(3000, function() {
    console.log("App is listen port 3000...");
});*/

let server = http.createServer(app);
io.attach(server);
server.listen(3000);

server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
    throw error;
}

function onListening() {
    let addr = server.address();
    let bind = typeof addr == "string" ?
        'pipe ' + addr :
        'port' + addr.port;
    console.log("App is listening on " + bind);
}