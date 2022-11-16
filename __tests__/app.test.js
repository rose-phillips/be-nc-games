const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("\nerror handling tests:\n", () => {
  test("sends 404 - bad request when passed incorrect path", () => {
    return request(app)
      .get("/api/wrongpath")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid path");
      });
  });
});

describe("\n/api/categories tests:\n", () => {
  describe("GET:200 and send array of category objects", () => {
    test("200 status and an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          expect(response.body.categories).toEqual(expect.any(Array));
        });
    });
    test("all categories objects are sent", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          expect(response.body.categories.length).toBe(4);
        });
    });
    test("properties of slug and desciption on objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          response.body.categories.forEach((category) => {
            expect(Object.keys(category)).toEqual(
              expect.arrayContaining(["slug", "description"])
            );
          });
        });
    });
  });
});

describe("\n/api/reviews tests:\n", () => {
  describe("GET:200 and send array of reviews with comment count added", () => {
    test("get 200 status and an array of objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          expect(response.body.reviews).toEqual(expect.any(Array));
        });
    });
    test("all reviews objects are sent", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
          expect(response.body.reviews.length).toBe(13);
        });
    });
    test("all properties returned including new comment_count property", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
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
  });
});
