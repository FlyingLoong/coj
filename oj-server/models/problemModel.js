let mongoose = require('mongoose');

let problemSchema = mongoose.Schema({
    id: Number,
    name: String,
    desc: String,
    difficulty: String
});

let problemModel = mongoose.model("ProblemModel", problemSchema);

module.exports = problemModel;