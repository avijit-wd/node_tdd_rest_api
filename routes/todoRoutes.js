const router = require("express").Router();
const {
  createTodo,
  getTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

router.route("/").get(getTodo).post(createTodo);
router.route("/:todoId").get(getTodoById).put(updateTodo).delete(deleteTodo);

module.exports = router;
