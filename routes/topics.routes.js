const express = require("express");
const router = express.Router();
const topics = require("../controllers/topic.controller");

router.get("/", async (req, res) => {
  try {
    res.json(await topics.getAllTopics());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const topic = await topics.getTopicById(req.params.id);
    if (topic) {
      res.json(topic);
    } else {
      res.status(404).send({ message: "Topic not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await topics.delTopicById(req.params.id);
    if (deleted) {
      res.send({ message: "Topic deleted successfully" });
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while deleting topic" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const topic = await topics.storeNewTopic(req.body);
    if (topic) {
      res.json(topic);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while inserting topic" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const topic = await topics.updateTopic(req.body, req.params.id);
    if (topic) {
      res.json(topic);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while updating topic" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/change-status/:id", async (req, res) => {
  try {
    const statusChanged = await topics.ChangeStatus(req);
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
