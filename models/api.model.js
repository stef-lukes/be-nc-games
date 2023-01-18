exports.fetchAPI = () => {
  return {
    "GET /api": {
      description:
        "serves up a json representation of all the available endpoints of the api",
    },
    "GET /api/categories": {
      description: "serves an array of all categories",
      queries: [],
      exampleResponse: {
        categories: [
          {
            description: "Players attempt to uncover each other's hidden role",
            slug: "Social deduction",
          },
        ],
      },
    },
    "GET /api/reviews": {
      description: "serves an array of all reviews",
      queries: ["category", "sort_by", "order"],
      exampleResponse: {
        reviews: [
          {
            title: "One Night Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "happyamy2016",
            review_img_url:
              "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            category: "hidden-roles",
            created_at: 1610964101251,
            votes: 5,
          },
        ],
      },
    },
    "GET /api/users": {
      description: "serves an array of all users",
      queries: [],
      exampleResponse: {
        reviews: [
          {
            username: "tickle122",
            name: "Tom Tickle",
            avatar_url:
              "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
          },
        ],
      },
    },
    "GET /api/comments": {
      description: "serves an array of all comments",
      queries: [],
      exampleResponse: {
        reviews: [
          {
            body: "I loved this game too!",
            votes: 16,
            author: "happyamy2016",
            review_id: 2,
            created_at: new Date(1511354163389),
          },
        ],
      },
    },
  };
};
