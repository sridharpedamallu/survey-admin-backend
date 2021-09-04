const express = require("express");
const router = express.Router();

const imController = require("../controllers/import.controller");
const topics = require("../controllers/topic.controller");
const subtopics = require("../controllers/subtopic.controller");
const questions = require("../controllers/question.controller");

router.post("/import-data", imController.uploadFileHandler);

router.post("/bulk-load", async (req, res) => {
  if (req.body.target.toLowerCase() === "topics") {
    res.send(await topics.storeBulkTopics(req));
  } else if (req.body.target.toLowerCase() === "subtopics") {
    res.send(await subtopics.storeBulkTopics(req));
  } else if (req.body.target.toLowerCase() === "questions") {
    res.send(await questions.storeBulkTopics(req));
  } else {
    res.send("Target is invalid");
  }
});

module.exports = router;
