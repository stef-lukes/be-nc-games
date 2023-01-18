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

  describe("4 GET/api/reviews/:review_id", () => {
    test("status 200, should respond with an object containing the properties: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at", () => {
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
            comment_count: 0,
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

  describe("5 PATCH/api/reviews/:review_id", () => {
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
          expect(body.msg).toBe(`totes is an invalid request property`);
        });
    });
  });

  // ====================================

  describe("6 GET/api/users", () => {
    test("status 200, returns an array of user objects each containing properties of 'username', 'name', and 'avatar_url'", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(Array.isArray(users)).toBe(true);
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
    test("status 404, should respond with an error message when passed a non existent endpoint", () => {
      return request(app)
        .get(`/api/invalid_endpoint`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe(`Endpoint not found.`);
        });
    });
  });
});

// ====================================

describe("7. GET /api/reviews/:review_id (comment count)", () => {
  test("status 200, should now respond with the same object as in TEST BLOCK 4 with the addition of a COMMENTS_COUNT property, which counts the number references to the review_id passed in the comments data", () => {
    return request(app)
      .get(`/api/reviews/3`)
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
          votes: 5,
          comment_count: 3,
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

describe("8 GET /api/reviews", () => {
  test("status: 200, responds with an array of category objects, each of which should have a slug property and a description property", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        const { reviews } = res.body;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
        expect(reviews).toBeSortedBy("created_at", { descending: true });
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

describe("9. GET /api/reviews/:review_id/comments", () => {
  test("status: 200, should respond with an array of comments for the given review_id of which each should have properties: comment_id, votes, created_at, author, body, review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        const { body } = res;
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(3);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: 2,
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("status 404, valid data type (number) but does not match any existing review_id", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review 999 does not exist");
      });
  });
  test("status 400, invalid data type (not a number) passed into query as review_id", () => {
    return request(app)
      .get("/api/reviews/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("status 200, valid path but review has no comments and returns empty array ", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((res) => {
        const { body } = res;
        expect(body.comments).toEqual([]);
      });
  });
});

// ====================================

describe("10 POST /api/reviews/:review_id/comments", () => {
  test("status 201, request body accepts an object with username and body and responds with the posted comment", () => {
    const commentPost = {
      username: "mallionaire",
      body: "It's alright, yeah",
    };
    return request(app)
      .post(`/api/reviews/2/comments`)
      .send(commentPost)
      .expect(201)
      .then(({ body }) => {
        expect(body.commentPost).toEqual({
          comment_id: 7,
          body: "It's alright, yeah",
          votes: 0,
          author: "mallionaire",
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("status 400, body does not contain both mandatory keys", () => {
    const badPost = {
      username: "mallionaire",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(badPost)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("status 400, invalid data type (not a number) passed into query as review_id", () => {
    return request(app)
      .get("/api/reviews/invalid_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
  test("status 404, review_id in path does not exist", () => {
    const commentPost = {
      username: "mallionaire",
      body: "It's alright, yeah",
    };
    return request(app)
      .post("/api/reviews/999/comments")
      .send(commentPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review 999 does not exist");
      });
  });
  test("status 404, a user not in the database tries to post", () => {
    const commentPost = {
      username: "steflukes",
      body: "Not as fun as Buck-a-Roo",
    };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(commentPost)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username does not exist");
      });
  });
});

// ====================================

describe("11. GET /api/reviews (queries)", () => {
  describe("SORT_BY queries", () => {
    test("status 200, sorts reviews by any valid column", () => {
      return request(app)
        .get("/api/reviews?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("title", { descending: true });
        });
    });
    test("status 400, user enters non-valid sort_by query", () => {
      return request(app)
        .get("/api/reviews?sort_by=invalid_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort query");
        });
    });
  });
  describe("ORDER queries", () => {
    test("status 200, switches sort order between descending and ascending.  Default is descending", () => {
      return request(app)
        .get("/api/reviews?sort_by=title&&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("title", { ascending: true });
        });
    });
    test("status 400, user enters invalid order query", () => {
      return request(app)
        .get("/api/reviews?order=invalid_query")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query");
        });
    });
  });
  describe("CATEGORY queries", () => {
    test("status 200, filters reviews by category value specified in the query", () => {
      return request(app)
        .get("/api/reviews?category=social deduction")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toHaveLength(11);
        });
    });
    test("status 404, user enters a non existent category", () => {
      return request(app)
        .get("/api/reviews?category=turd burgling")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Category: turd burgling does not exist");
        });
    });
  });
});

// ====================================

describe("12. DELETE /api/comments/:comment_id", () => {
  test("status 204, Should: delete the given comment by comment_id and delete", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("status 404, comment_id in path does not exist", () => {
    return request(app)
      .delete("/api/comments/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment ID: 9999999 does not exist");
      });
  });
  test("status 400 - comment_id in path is not a number", () => {
    return request(app)
      .delete("/api/comments/noID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request");
      });
  });
});
