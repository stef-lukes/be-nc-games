# Northcoders House of Games API

## Add .env. files to connect to DB

You will need to create two .env files in order to successfully connect to the two databases locally: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
