let problemModel = require('../models/problemModel');

getProblems = function() {
    return new Promise((resolve, reject) => {
        problemModel.find({}, function(err, problems) {
            if (problems) {
                resolve(problems);
            } else {
                reject(err);
            }
        })
    });
}

getProblem = function(id) {
    return new Promise((resolve, reject) => {
        problemModel.findOne({ id: id }, function(err, problem) {
            if (problem) {
                resolve(problem)
            } else {
                reject(err);
            }
        })
    });
}

addProblem = function(newProblem) {
    return new Promise((resolve, reject) => {
        problemModel.findOne({ name: newProblem.name }, function(err, problem) {
            if (problem) {
                reject("Problem already exists!")
            } else {
                problemModel.count({}, function(err, num) {
                    newProblem.id = num + 1;
                    let mongoProblem = new problemModel(newProblem);
                    mongoProblem.save();
                    resolve(newProblem);
                })
            }
        })
    })
}

module.exports = {
    getProblems: getProblems,
    getProblem: getProblem,
    addProblem: addProblem
}