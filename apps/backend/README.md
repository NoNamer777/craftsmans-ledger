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
npx nx run backend
```

Find more commands to run by inspecting the project in the Nx graph by running:

```bash
npx nx graph
```
