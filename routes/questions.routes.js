const express = require("express");
const router = express.Router();
const questions = require("../controllers/question.controller");

router.get("/get-by-type/:type", async (req, res) => {
  try {
    res.json(await questions.getAllQuestionsByType(req.params.type));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    res.json(await questions.getAllQuestions());
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const question = await questions.getQuestionById(req.params.id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).send({ message: "Question not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await questions.delQuestionById(req.params.id);
    if (deleted) {
      res.send({ message: "Question deleted successfully" });
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while deleting subtopic" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const question = await questions.storeNewQuestion(req.body);
    if (question) {
      res.json(question);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while inserting question" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const question = await questions.updateQuestion(req.body, req.params.id);
    if (question) {
      res.json(question);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while updating question" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/change-status/:id", async (req, res) => {
  try {
    const statusChanged = await questions.ChangeStatus(req);
    if (statusChanged) {
      res.send(statusChanged);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while updating status" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/question-options/:id", async (req, res) => {
  try {
    res.send(await questions.getQuestionOptions(req.params.id));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
