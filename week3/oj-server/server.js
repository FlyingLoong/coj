let express = require("express");
let app = express();
let mongoose = require("mongoose");
let restRouter = require("./routes/rest");

let path = require("path");

mongoose.connect("mongodb://localhost/coj");

app.use("/api/v1", restRouter);

app.use(express.static(path.join(__dirname, "../public")));

app.use(function(req, res) {
    res.sendFile("index.html", { root: (path.join(__dirname, "../public")) });
})

app.listen(3000, function() {
    console.log("App is listen port 3000...");
});