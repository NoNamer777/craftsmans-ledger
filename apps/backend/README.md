# @craftsmans-ledger/backend

This project was created using the [Ktor Project Generator](https://start.ktor.io) and adjusted to fit into the Nx powered mono-repository.

## Getting started

Make sure to follow the instructions in the [README](../../README.md#getting-started) at the root of the repository about getting started with this project, which include generating the self-signed SSL certificate, the required keystore and setting up the required environment variables for this app to enable HTTPS during development.

Here are some useful links to get more info about Ktor:

- [Ktor Documentation](https://ktor.io/docs/home.html)
- [Ktor GitHub page](https://github.com/ktorio/ktor)

## Features

Here's a list of features included in this project:

| Name                                                                   | Description                                                                        |
|------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| [Routing](https://start.ktor.io/p/routing)                             | Provides a structured routing DSL                                                  |
| [kotlinx.serialization](https://start.ktor.io/p/kotlinx-serialization) | Handles JSON serialization using kotlinx.serialization library                     |
| [Content Negotiation](https://start.ktor.io/p/content-negotiation)     | Provides automatic content conversion according to Content-Type and Accept headers |
| [Exposed](https://start.ktor.io/p/exposed)                             | Adds Exposed database to your application                                          |
| [Status Pages](https://start.ktor.io/p/status-pages)                   | Provides exception handling for routes                                             |
| [Static Content](https://start.ktor.io/p/static-content)               | Serves static files from defined locations                                         |

## Building & Running

This project is managed by Nx. To run the API backend, execute the following command:

```bash
npx nx run backend:run
```

Find more commands to run by inspecting the project in the Nx graph by running:

```bash
npx nx graph
```

## Databases

This app uses a database to store its data on. Currently, we support the following databases:

| Type    | Default |
|---------|---------|
| MySQl   |         |
| MariaDB |         |
| H2      | ✅       |

Interaction with the databases and definitions for the tables are handled via [Expose](https://www.jetbrains.com/help/exposed/get-started-with-exposed.html), see their documentation for more info on how to work with schema's, transactions, etc.

### Environment variables

Modify the [Environment file](./.env) to determine which database to use when running the app locally, or in a Docker container. The `DB_TYPE` should be set to determine which type of database to use. If no valid argument is provided, the default database type (`h2`) will be used. This database will default to be in-memory.

Don't forget to set the corresponding environment variables for your database! If you use a MySQL database for example, you'll need to set the environment variables prefixed with `MYSQL_` in order for the app to properly connect to your database instance.

### Environments

For production, remote test and development environments we use `MariaDB` as the database type. For unit testing, an in-memory `H2` database will be used. For details on how to connect to those databases (other than the production environment obviously), please contact one of the code owners.
