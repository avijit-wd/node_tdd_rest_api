const request = require("supertest");
const server = require("../../server");
const newTodo = require("../mock-data/newTodo.json");
const todos = require("../mock-data/allTodos.json");

const endPointUrl = "/todos/";
let firstTodo;
let newTodoId;
let nonExistingTodoId = "600f190207c45e9983fc3ae7";
const testData = { title: "Make integration test for put", done: true };

describe(endPointUrl, () => {
  it(`GET ${endPointUrl}`, async () => {
    const response = await request(server).get(endPointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });
  it(`Get by Id ${endPointUrl}:todoId`, async () => {
    const response = await request(server).get(
      `${endPointUrl}${firstTodo._id}`
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });
  it(`Get todo by id doesn't exists ${endPointUrl}`, async () => {
    const response = await request(server).get(
      `${endPointUrl}600f190257c95e9523fc3aee`
    );
    expect(response.statusCode).toBe(404);
  });
  it(`POST ${endPointUrl}`, async () => {
    const response = await request(server).post(endPointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
  });
  it(`Should return error 500 on malformed data with POST ${endPointUrl}`, async () => {
    const response = await request(server)
      .post(endPointUrl)
      .send({ title: "Missing done property" });
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required.",
    });
  });
  it(`PUT ${endPointUrl}`, async () => {
    const testData = { title: "Make integration test for put", done: true };
    const response = await request(server)
      .put(`${endPointUrl}${newTodoId}`)
      .send(testData);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testData.title);
    expect(response.body.done).toBe(testData.done);
  });
  it("should return 404 on PUT " + endPointUrl, async () => {
    const res = await request(server)
      .put(endPointUrl + nonExistingTodoId)
      .send(testData);
    expect(res.statusCode).toBe(404);
  });
  test("DELETE", async () => {
    const res = await request(server)
      .delete(endPointUrl + newTodoId)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(testData.title);
    expect(res.body.done).toBe(testData.done);
  });
  test("HTTP DELETE 404", async () => {
    const res = await request(server)
      .delete(endPointUrl + nonExistingTodoId)
      .send();
    expect(res.statusCode).toBe(404);
  });
});
