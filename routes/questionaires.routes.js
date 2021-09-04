const express = require("express");
const router = express.Router();
const questionaires = require("../controllers/questionaire.controller");

router.get("/", async (req, res) => {
  try {
    res.json(await questionaires.getAllQuestionaires());
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.get("/all", async (req, res) => {
  try {
    res.send(await questionaires.getAll());
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const questionaire = await questionaires.getQuestionById(req.params.id);
    if (questionaire) {
      res.json(questionaire);
    } else {
      res.status(404).send({ message: "Questionaire not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await questionaires.delQuestionaireById(req.params.id);
    if (deleted) {
      res.send({ message: "Questionaire deleted successfully" });
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while deleting Questionaire" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const questionaire = await questionaires.storeNewQuestionaire(req.body);
    if (questionaire) {
      res.json(questionaire);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while inserting questionaire" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const questionaire = await questionaires.updateQuestionaire(
      req.body,
      req.params.id
    );
    if (questionaire) {
      res.json(questionaire);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while updating questionaire" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/change-status/:id", async (req, res) => {
  try {
    const statusChanged = await questionaires.ChangeStatus(req);
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

router.get("/:id/assigned-questions", async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(500).json({ message: "questionaire id required" });
    }
    const questionaire = await questionaires.getAssignedQuestions(
      req.params.id
    );
    if (questionaire) {
      res.json(questionaire);
    } else {
      res.status(404).send({ message: "Questionaire not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:id/assign-questions", async (req, res) => {
  try {
    const questionaire = await questionaires.assignQuestions(
      req.body.questions,
      req.params.id
    );
    res.send({ message: "Questions assigned successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/:id/remove-questions", async (req, res) => {
  try {
    const questionaire = await questionaires.getQuestionById(req.params.id);
    if (questionaire) {
      res.json(questionaire);
    } else {
      res.status(404).send({ message: "Questionaire not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
