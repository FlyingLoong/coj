let router = require('express').Router();
//let router = express.Router();

let problemService = require('../services/problemService');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

router.get('/problems', function(req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

router.get('/problems/:id', function(req, res) {
    let id = req.params.id;
    problemService.getProblem(id)
        .then(problem => res.json(problem));
});

router.post('/problems', jsonParser, function(req, res) {
    problemService.addProblem(req.body)
        .then(problem => res.json(problem))
        .catch(err => res.status(400).send("Problem already exists!"))
});

module.exports = router;