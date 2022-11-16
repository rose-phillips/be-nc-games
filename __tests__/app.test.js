const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const jestSorted = require("jest-sorted");

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

describe("\nGET /api/categories tests:\n", () => {
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

describe("\nGET /api/reviews tests:\n", () => {
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
