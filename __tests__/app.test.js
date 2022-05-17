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
  // ====================================

  describe("3 GET /api/categories", () => {
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
    test("status 404, should respond with an error message when passed an invalid endpoint", () => {
      return request(app)
        .get(`/api/invalid_endpoint`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Endpoint not found.`);
        });
    });
  });

  // ====================================

  describe("4 GET/api/reviews/:reviewId", () => {
    test("status 200, should respond with an object containing the properties: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at", () => {
      const REVIEW_ID = 1;
      return request(app)
        .get(`/api/reviews/1`)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: new Date(1610964020514).toISOString(),
            votes: 1,
          });
        });
    });
    test("status 404, should respond with an error message when passed an endpoint with the correct type but doesn't exist in the database", () => {
      return request(app)
        .get(`/api/reviews/999999`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual(`Review 999999 does not exist`);
        });
    });
    test("status 400, responds with a bad request error when passed an invalid data type", () => {
      return request(app)
        .get("/api/reviews/invalid_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request");
        });
    });
  });

  // ====================================

  describe.only("5 PATCH/api/reviews/:review_id", () => {
    test("status:200, responds with the updated review", () => {
      const reviewUpdate = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/reviews/3")
        .send(reviewUpdate)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 3,
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "We couldn't find the werewolf!",
            category: "social deduction",
            created_at: new Date(1610964101251).toISOString(),
            votes: 10,
          });
        });
    });
    test("status 404, should respond with an error message when passed an endpoint with the correct type but doesn't exist in the database", () => {
      const reviewUpdate = {
        inc_votes: 5,
      };
      return request(app)
        .patch(`/api/reviews/999999`)
        .send(reviewUpdate)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual(`Review 999999 does not exist`);
        });
    });
    test("status 400, responds with a bad request error when passed an invalid data type", () => {
      const reviewUpdate = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/reviews/invalid_id")
        .send(reviewUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request");
        });
    });
    test("status 400, responds with a custom error when request object 'inc_votes' property has invalid value", () => {
      const reviewUpdate = {
        inc_votes: "hello",
      };
      return request(app)
        .patch("/api/reviews/3")
        .send(reviewUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request");
        });
    });
    test("status 400, as above but tests error handling if request body key is invalid", () => {
      const reviewUpdate = {
        totes: 5,
      };
      return request(app)
        .patch("/api/reviews/3")
        .send(reviewUpdate)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid request");
        });
    });
  });
});
