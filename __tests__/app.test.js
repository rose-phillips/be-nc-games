const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const jestSorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("\nerror handling tests:\n", () => {
  test("sends 400 - bad request when passed incorrect path", () => {
    return request(app)
      .get("/api/wrongpath")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid path");
      });
  });
});

describe("\nGET /api/categories tests:\n", () => {
  test("200 status and an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories).toEqual(expect.any(Array));
        expect(response.body.categories.length).toBe(4);
        response.body.categories.forEach((category) => {
          expect(Object.keys(category)).toEqual(
            expect.arrayContaining(["slug", "description"])
          );
        });
      });
  });
});

describe("\nGET /api/reviews tests:\n", () => {
  test("get 200 status and an array of objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toEqual(expect.any(Array));
        expect(response.body.reviews.length).toBe(13);
        response.body.reviews.forEach((review) => {
          expect(Object.keys(review)).toEqual(
            expect.arrayContaining([
              "owner",
              "title",
              "review_id",
              "category",
              "review_img_url",
              "created_at",
              "votes",
              "designer",
              "comment_count",
            ])
          );
        });
      });
  });
  test("objects sorted by date", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("\nGET /api/reviews/:review_id\n", () => {
  test("get 200 status and matching review", () => {
    const review_id = 2;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then((response) => {
        expect(response.body.review).toEqual({
          review_id: 2,
          title: "Jenga",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Fiddly fun for all the family",
          category: "dexterity",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
        });
      });
  });
  test("get 404 'not found' when review_id not found", () => {
    const review_id = 1000;
    return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(404)
      .then((response) => expect(response.body.msg).toBe("not found"));
  });
});
describe("\nGET /api/reviews/:review_id/comments\n", () => {
  test("GET 200 status and matching comments", () => {
    const review_id = 3;
    return request(app)
      .get(`/api/reviews/${review_id}/comments`)
      .expect(200)
      .then((response) => {
        response.body.comments.forEach((comment) => {
          expect(Object.keys(comment)).toEqual(
            expect.arrayContaining([
              "comment_id",
              "body",
              "review_id",
              "author",
              "votes",
              "created_at",
            ])
          );
          expect(response.body.comments.length).toBe(3);
        });
      });
  });
});
describe("\nPOST /api/reviews/:review_id/comments\n", () => {
  test("get 201 status and add new review comment to database and return new comment", () => {
    const review_id = 2;
    const newComment = {
      username: "dav3rid",
      body: "This is exactly what I was saying to my cat last night.",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          body: "This is exactly what I was saying to my cat last night.",
        });
      });
  });
  test("get 404 'not found' when review_id not found", () => {
    const review_id = 2000;
    const newComment = {
      username: "dav3rid",
      body: "This is exactly what I was saying to my cat last night.",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(404)
      .then((response) => expect(response.body.msg).toBe("not found"));
  });
  test("get 400 'invalid input' when body not provided", () => {
    const review_id = 2;
    const newComment = {
      username: "dav3rid",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => expect(response.body.msg).toBe("invalid input"));
  });
  test("get 404 'user not found' when username doesn't exist in users", () => {
    const review_id = 2;
    const newComment = {
      username: "Justine",
      body: "This is exactly what I was saying to my cat last night.",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(404)
      .then((response) => expect(response.body.msg).toBe("user not found"));
  });
  test("get 400 'invalid input' when username not provided", () => {
    const review_id = 3;
    const newComment = {
      body: "This is exactly what I was saying to my cat last night.",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => expect(response.body.msg).toBe("invalid input"));
  });
  test("get 201 and no unwanted changes to values when request body has unnecessary keys", () => {
    const review_id = 2;
    const newComment = {
      username: "dav3rid",
      body: "This is exactly what I was saying to my cat last night.",
      votes: 4,
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => expect(response.body.votes).toBe(0));
  });
  test("get 400 status and 'invalid input' when mispelled username property", () => {
    const review_id = 3;
    const newComment = {
      uzername: "dav3rid",
      body: "based take bro",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => expect(response.body.msg).toBe("invalid input"));
  });
  test("get 400 status and 'invalid input' when mispelled body property", () => {
    const review_id = 3;
    const newComment = {
      username: "dav3rid",
      boody: "based take bro",
    };
    return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(400)
      .then((response) => expect(response.body.msg).toBe("invalid input"));
  });
});
describe(`\nPATCH /api/reviews/:review_id\n`, () => {
  test("get 201 status, add votes, return the ammended review - positive number", () => {
    const review_id = 3;
    const newVotes = { inc_votes: 1 };
    return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(newVotes)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: 3,
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          // 5 before patch. adding 1.
          votes: 6,
          designer: expect.any(String),
        });
      });
  });
  test("get 201 status, subtract votes, return the ammended review - negative number", () => {
    const review_id = 3;
    const newVotes = { inc_votes: -10 };
    return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(newVotes)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: 3,
          category: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          // 5 before patch. adding -10.
          votes: -5,
          designer: expect.any(String),
        });
      });
  });
  test(`get 201 and no unwanted changes to values when request body has unnecessary keys`, () => {
    const review_id = 3;
    const newVotes = { inc_votes: 1, category: "mainmin' and murderin'!" };
    return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(newVotes)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: 3,
          category: "social deduction",
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 6,
          designer: expect.any(String),
        });
      });
  });
  test(`get 404 'not found' when review_id not found`, () => {
    const review_id = 2000;
    const newVotes = { inc_votes: 1 };
    return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(newVotes)
      .expect(404)
      .then((response) => expect(response.body.msg).toBe("not found"));
  });
  test("get 400 'invalid input' when mispelled inc_votes property", () => {
    const review_id = 3;
    const newVotes = { incvotes: 1 };
    return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(newVotes)
      .expect(400)
      .then((response) => expect(response.body.msg).toBe("invalid input"));
  });
});
describe(`\nGET /api/users\n`, () => {
  test("get 200 status and an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toEqual(expect.any(Array));
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
