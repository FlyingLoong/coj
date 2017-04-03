let router = require('express').Router();
//let router = express.Router();

let problemService = require('../services/problemService');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();

let node_rest_client = require('node-rest-client');
let restClient = new node_rest_client();

const EXECUTOR_SERVER_URL = "http://localhost:5000/build_and_run";

restClient.registerMethod("build_and_run", EXECUTOR_SERVER_URL, "POST");

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
        .catch(err => res.status(400).send(err))
});

router.post('/build_and_run', jsonParser, function(req, res) {
    const userCode = req.body.user_code;
    const lang = req.body.lang;

    console.log(lang + " ;" + userCode);
    return {};
})

module.exports = router;