# ![RealWorld Ember Example App](logo-ember.png)

> ### Ember.js codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.


### [Demo]()&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)


This codebase was created to demonstrate a fully fledged fullstack application built with **Ember** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Ember** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

# How it works

> Describe the general architecture of your app here

# Getting started

## Installation

* `git clone <https://github.com/Alonski/realworld-ember.git>` this repository
* change into the new directory
* `yarn`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Linting

This project uses a combination of [ESLint][eslint] and [Prettier][prettier] to maintain uniform style for our JavaScript code.

To run verification of the code, but not fix anything automatically, you can run

```bash
yarn lint
```

However, thanks to the power of the tools we use, many problems can be fixed automatically.  That can be done by running

```bash
yarn lint:fix
```

Which will detect which problems can be fixed automatically and write the correct version back to the files in question.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

TODO

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

[eslint]: http://eslint.org/
[prettier]: https://github.com/prettier/prettier
