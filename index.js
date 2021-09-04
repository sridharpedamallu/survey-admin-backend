const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const path = require("path");
const topicRoutes = require("./routes/topics.routes");
const subTopicRoutes = require("./routes/subtopics.routes");
const questionRoutes = require("./routes/questions.routes");
const questionaireRoutes = require("./routes/questionaires.routes");
const commonRoutes = require("./routes/common.routes");
const userRoutes = require("./routes/users.routes");

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const dir = path.join(__dirname, "public");

app.use(express.static(dir));

app.use("/topics", topicRoutes);
app.use("/subtopics", subTopicRoutes);
app.use("/questions", questionRoutes);
app.use("/questionaires", questionaireRoutes);
app.use("/common", commonRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("hello from simple server :)");
});

app.listen(port, () => {
  console.log("App started");
});
