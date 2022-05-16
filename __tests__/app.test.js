process.env.NODE_ENV = "test";
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("/api", () => {
  describe("GET /api/categories", () => {
    test("status: 200, responds with an array of category objects, each of which should have a slug property and a description property", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((res) => {
          const { categories } = res.body;
          expect(categories).toBeInstanceOf(Array);
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test("status 404, should respond with an error message when passed an endpoint with the correct type but doesn't exist in the database", () => {
      return request(app)
        .get(`/api/999999`)
        .expect(404)
        .then(({ body }) => {
          console.log(body);
          expect(body.msg).toEqual(`Bad request: 404! Endpoint not found.`);
        });
    });
  });
});
