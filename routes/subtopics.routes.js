const express = require("express");
const router = express.Router();
const subtopics = require("../controllers/subtopic.controller");

router.get("/", async (req, res) => {
  try {
    res.json(await subtopics.getAllSubTopics());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/filters", async (req, res) => {
  // try {
  res.json(await subtopics.getSubTopicsByFilter(req.body));
  // } catch (err) {
  //   res.status(500).json(err);
  // }
});

router.get("/:id", async (req, res) => {
  try {
    const subtopic = await subtopics.getSubTopicById(req.params.id);
    if (subtopic) {
      res.json(subtopic);
    } else {
      res.status(404).send({ message: "Subtopic not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await subtopics.delSubTopicById(req.params.id);
    if (deleted) {
      res.send({ message: "Subtopic deleted successfully" });
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
    const subtopic = await subtopics.storeNewSubTopic(req.body);
    if (subtopic) {
      res.json(subtopic);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while inserting subtopic" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const subtopic = await subtopics.updateSubTopic(req.body, req.params.id);
    if (subtopic) {
      res.json(subtopic);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while updating subtopic" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/change-status/:id", async (req, res) => {
  try {
    const statusChanged = await subtopics.ChangeStatus(req);
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

module.exports = router;
