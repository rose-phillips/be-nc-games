const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed");
const connection = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("\n/api/categories tests:\n", () => {
  describe("GET:200 and send array of category objects", () => {
    test("200 status", () => {
      return request(app).get("/api/categories").expect(200);
    });
    test("get array of category objects with slug and description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
          expect(response.body.categories).toEqual(expect.any(Array));
          expect(Object.keys(response.body.categories[0])).toEqual(
            expect.arrayContaining(["slug", "description"])
          );
        });
    });

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
  });
});
