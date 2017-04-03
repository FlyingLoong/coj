let mongoose = require('mongoose');

let ProblemSchema = mongoose.Schema({
    id: Number,
    name: String,
    desc: String,
    difficulty: String
});

let ProblemModel = mongoose.model("ProblemModel", ProblemSchema);

module.exports = ProblemModel;