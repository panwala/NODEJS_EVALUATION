require("../config/database/mongodb");
const request = require("supertest");
const { expect, describe, test, afterAll } = require("@jest/globals");
let authorizationToken, postData;
const app = require("../app");
describe("APIs Testing...", () => {
  test("POST /api/authenticate should perform user authentication and return a JWT token.", async () => {
    const res = await request(app).post("/api/authenticate").send({
      email: "prempanwala710@gmail.com",
      password: "prem0131",
    });
    authorizationToken = res.body.data.token.accessToken; //.toString();
    console.log("authorizationToken", authorizationToken);
    expect(res.statusCode).toBe(200);
  });

  test("GET /api/user should authenticate the request and return the respective user profile.", async () => {
    let token = "Bearer " + authorizationToken;
    const res = await request(app).get("/api/user").set("authorization", token);
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/posts/ would add a new post created by the authenticated user.", async () => {
    let token = "Bearer " + authorizationToken;
    const res = await request(app)
      .post("/api/posts/")
      .set("authorization", token)
      .send({
        post_title: "Demo post title2",
        post_description: "Demo post description2",
      });
    postData = res.body.data;
    expect(res.statusCode).toBe(201);
  });

  test("POST /api/like/{id} would like the post with {id} by the authenticated user.", async () => {
    let token = "Bearer " + authorizationToken;
    console.log("${postData._id}", postData._id);
    const res = await request(app)
      .post(`/api/like/${postData._id}`)
      .set("authorization", token);
    expect(res.statusCode).toBe(201);
  });

  test("POST /api/unlike/{id} would unlike the post with {id} by the authenticated user.", async () => {
    let token = "Bearer " + authorizationToken;
    console.log("${postData._id}", postData._id);
    const res = await request(app)
      .post(`/api/unlike/${postData._id}`)
      .set("authorization", token);
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/comment/{id} add comment for post with {id} by the authenticated user.", async () => {
    let token = "Bearer " + authorizationToken;
    console.log("${postData._id}", postData._id);
    const res = await request(app)
      .post(`/api/comment/${postData._id}`)
      .set("authorization", token)
      .send({
        comment: "demo comment",
      });
    expect(res.statusCode).toBe(201);
  });

  test("GET /api/posts/{id} would return a single post with {id} populated with its number of likes and comments", async () => {
    let token = "Bearer " + authorizationToken;
    console.log("${postData._id}", postData._id);
    const res = await request(app)
      .get(`/api/posts/${postData._id}`)
      .set("authorization", token);
    expect(res.statusCode).toBe(200);
  });

  test("GET /api/all_posts would return all posts created by authenticated user sorted by post time.", async () => {
    let token = "Bearer " + authorizationToken;
    console.log("${postData._id}", postData._id);
    const res = await request(app)
      .get(`/api/all_posts`)
      .set("authorization", token);
    expect(res.statusCode).toBe(200);
  });

  test("DELETE /api/posts/{id} would delete post with {id} created by the authenticated user.", async () => {
    let token = "Bearer " + authorizationToken;
    console.log("${postData._id}", postData._id);
    const res = await request(app)
      .delete(`/api/posts/${postData._id}`)
      .set("authorization", token);
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/follow/{id} authenticated user would follow user with {id}", async () => {
    let token = "Bearer " + authorizationToken;
    const res = await request(app)
      .post(`/api/follow/6414833bb0ea7331ac4b6e98`)
      .set("authorization", token);
    expect(res.statusCode).toBe(201);
  });

  test("POST /api/unfollow/{id} authenticated user would unfollow a user with {id}", async () => {
    let token = "Bearer " + authorizationToken;
    const res = await request(app)
      .post(`/api/unfollow/6414833bb0ea7331ac4b6e98`)
      .set("authorization", token);
    expect(res.statusCode).toBe(200);
  });
});
