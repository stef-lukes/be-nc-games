# Hosting a PSQL DB using ElephantSQL and Cyclic

There are many ways to host APIs online. In these notes we will be using [ElephantSQL](https://www.elephantsql.com/) to create an online location for your database, and [Cyclic](https://www.cyclic.sh/) to host the API.

## 1. Make a GitHub repo for your API

Before you do this, please make your own public repo so that you can share your project as part of your portfolio by doing the following:

1. Create a new _public_ GitHub repository, and do **not** initialise the project with a readme, .gitignore or license.
2. From your _local_ copy of your repository, push your code to your new respository using the following commands:

```bash
git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main
```

## 2. Set up an instance of your database using ElephantSQL

Create an account on [ElephantSQL](https://www.elephantsql.com/), or you can link a GitHub or a Google account to log in.

You will need to create a team, which you can name whatever you like. You'll need to answer "Yes" to the Terms of Service and GDPR statements, and provide them with an email address.

Once you have created a team, navigate to "Create a New Instance", which you can also name whatever you like - we suggest something appropriate to the database you're creating, make sure you choose the free "Tiny Turtle" plan 🐢, then click "Select Region".

_There are options to add credit card and billing info, ignore them, you don't need to!_

Select any region, this will be the location of your hosted server, so it may be slightly beneficial to choose a location closer to you. Click "Review", then "Create Instance".

Now you have your server instance, click on it's name so you're on the "Details" page.

We will need the **URL** for the next part (this will start with "postgres://..." ). Copy it to your clipboard for now, or keep this tab open for the next step!

## 3. Add your production .env file to your local repo

We will need to provide an environment variable for our production DB called `DATABASE_URL`, it will provide the online location of the DB you have just created.

Add a new .env file called `.env.production`.

In it replace the `<URL>` with the value you got in the previous step.

```
DATABASE_URL=<URL>
```

## 4. Update your connection pool

At the top of the file that creates and exports your connection pool (this may be called something like `connection.js`), assign the value of the NODE_ENV to a variable (you may have already created this variable):

```js
const ENV = process.env.NODE_ENV || "development";
```

It is important to check that we have either the development/test PGDATABASE variable or the production DATABASE_URL. If both are missing from the `process.env`, then throw an error.

```js
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}
```

Next, add a `config` variable. If the `ENV` is "production", this variable should hold a config object, containing the `DATABASE_URL` at the `connectionString` key. This allows you to connect to the hosted database from your local machine.

```js
const ENV = process.env.NODE_ENV || "development";
// ...
const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
      }
    : {};

module.exports = new Pool(config);
// ...
```

## 5. Add a listen file

If you haven't already, we will need to add a `listen.js` file at the top level of our folder, which we will provide to our hosting provider so they know how to get our app started.

```js
const app = require("./app.js");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
```

## 6. Update your package.json

In your `package.json` file, set your "main" key to your listen.js file. Missing this will result in an error from our hosting provider, as it won't know where to enter the app.

```json
"main": "listen.js"
```

Add the following keys to the scripts:

```json
{
  "scripts": {
    "start": "node listen.js",
    "seed-prod": "NODE_ENV=production npm run seed"
  }
}
```

Also make sure your `dotenv` and `pg` dependancies are in your _dependancies_, not your _devDependanies_, as Cyclic will need access to these libraries.

_If you haven't already, push all your changes to GitHub!_

## 7. Seed your online database

Your `package.json` should have a `seed-prod` script (if it doesn't, check the previous step).

**Run the seed-prod script**

```bash
npm run seed-prod
```

This script should check whether you're in production, and if you are, it should connect to the production database. If you have other .env files (you might not!), leave them as they are.

You can test if this has worked by going to the "Browser" section in your ElephantSQL [instance's](https://customer.elephantsql.com/instance) control panel. Here you can add queries, just make sure not to try out any that might break your database! Stick to `SELECT`s, rather than `DELETE`s or `POST`s.

## 8. Get your API hosted using Cyclic

Sign up to [Cyclic](https://www.cyclic.sh/), using your GitHub account. Once you're signed up, click on the "Deploy" button.

Navigate to the "Link Your Own" tab, and search the repositories for your repo. Once you've selected it press "Connect".

It will then deploy your site on a console, hopefully with no errors...

After some confetti, you will have the option to provide some Environment Variables, either by clicking on the "environment variables console" link in the red box below the console, or in the "Variables" section of the app's Cyclic dashboard.

It will ask for the environment variables (which it may suggest, or you may need to add yourself using the "Add variable" button).

1. Set `DATABASE_URL` to your database's URL (the same one you put in your `.env.production`).
2. Set `NODE_ENV` to the string "production" (you won't need to add the quotes).
3. Press "Save".

It should provide you with a link to your new hosted app, in the top right of the screen. 

Due to Cyclic's auto-generation feature - your url might start it's life as something a bit wacky (along the lines of `easy-lion-cardigan`) - if you would like to change this to something more relevant, you can do so by heading to the `Environments` section and editing the `Custom Subdomain`. You will need to re-deploy your app for this change to take effect (it might take a little while for things to update).

Check your endpoints are working, and you're good to go! 🎉
