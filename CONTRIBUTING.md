# Contributing

Welcome and thank you for investing your time in contributing to Handle!

## Developing

### Requirements and Setup

Handle requires [Node.js][nodejs] v14 or newer, and some dependencies.
After installing Node.js, you can install dependencies as below, and you should be ready to develop Handle!

```shell
git clone git@github.com:wolimst/handle.git
cd handle
npm install
```

### Useful Commands

- Clean and install dependencies

  ```shell
  npm ci
  ```

- Build and start dev server

  ```shell
  npm run dev
  ```

- Run all unit tests

  ```shell
  npm run test
  ```

- Check if there are errors or warnings in the code

  ```shell
  npm run lint && npm run check
  ```

- Format the code in the project

  ```shell
  npm run format
  ```

Refer to `scripts` section in `package.json` file for more commands.

## [Pull Request Process][docs-pull-requests]

1. Fork this repository and create your branch from `main`
1. Make changes and add tests if necessary
1. Make sure to run checks, tests and formatter
1. Submit a pull request with comprehensive description about the changes you've made
1. Please respond back to questions or change requests, if there is any, from a reviewer
1. The reviewer will approve and merge the pull request!

[nodejs]: https://nodejs.org/
[docs-pull-requests]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/about-collaborative-development-models
