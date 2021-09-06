const http = require("http");
const express = require("express");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static('public'))

const guid = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

const todoList = [
  {
    id: "kt3ytv9kmsnc6wpz4q",
    title: "Todo 1",
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "kt3yty1qos5cpklbi1n",
    title: "Todo 2",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "kt3yu1329gbbwsrnmbf",
    title: "Todo 3",
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

app.get("/todos", (req, res) => {
  if (req.query?.completedOnly == "true") {
    return res.json(todoList.filter((x) => x.isCompleted == true));
  }
  res.json(todoList);
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  const index = todoList.findIndex((x) => x.id == id);
  if (index < 0) {
    return res.status(404).json({
      message: "Item not found",
    });
  }

  res.json(todoList[index]);
});

app.post("/todos", (req, res) => {
  const title = req.body.title;
  if (!title) {
    return res.status(400).json({
      message: "'title' Required",
    });
  }

  const item = {
    id: guid(),
    title,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  todoList.push(item);
  res.json(item);
});

app.put("/todos/:id", (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  if (!title) {
    return res.status(400).json({
      message: "'title' required",
    });
  }

  const index = todoList.findIndex((x) => x.id == id);
  if (index < 0) {
    return res.status(404).json({
      message: "Item not found",
    });
  }

  todoList[index].title = title;
  todoList[index].updatedAt = new Date();
  res.json(todoList[index]);
});

app.put("/todos/:id/toggle-complete", (req, res) => {
  const id = req.params.id;

  const index = todoList.findIndex((x) => x.id == id);
  if (index < 0) {
    return res.status(404).json({
      message: "Item not found",
    });
  }

  todoList[index].isCompleted = !todoList[index].isCompleted;
  todoList[index].updatedAt = new Date();
  res.json(todoList[index]);
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  const index = todoList.findIndex((x) => x.id == id);
  if (index < 0) {
    return res.status(404).json({
      message: "Item not found",
    });
  }

  todoList.splice(index, 1);
  res.status(204).send();
});

http
  .createServer(app)
  .listen(3000, () => console.log("Server started at 3000"));
