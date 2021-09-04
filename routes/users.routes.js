const express = require("express");
const router = express.Router();
const users = require("../controllers/user.controller");

router.get("/", async (req, res) => {
  try {
    res.json(await users.getAllUsers());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await users.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ message: "user not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await users.delUserById(req.params.id);
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
    const user = await users.storeNewUser(req.body);
    if (user) {
      res.json(user);
    } else {
      res
        .status(500)
        .send({ message: "unexpected error while inserting user" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await users.updateUser(req.body, req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(500).send({ message: "unexpected error while updating user" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/change-status/:id", async (req, res) => {
  try {
    const statusChanged = await users.ChangeStatus(req);
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
