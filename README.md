because.js
==========


Overview
--------

because.js is a Javascript client library for accessing BCS HTTP services
provided by Boundless, like geocoding and routing.

This library abstracts away details of how HTTP requests are constructed and
made and how HTTP responses are parsed, so that you are just using Javascript
objects to ask for data which comes in the form of other Javascript objects.

To use these services, you first need credentials, which you can get by signing
up at Boundless Connect. Consult the docs for this library to see how to use
your credentials to enable the library to make requests against BCS services.


Installing
-----------

To download the code for use, first clone the repository:

    git clone https://github.com/harts-boundless/because.js.git

Normally you would next want to install dependencies in `node_modules` with

    npm install

If the library is eventually published via `npm`, then it may also be installed
using `npm install` like any other `npm` package.


Compiling
---------

This project is compiled with the Typescript compiler, `tsc`. Options for `tsc`
are in `tsconfig.json`. This directs `tsc` to look for Typescript `.ts` files
under `src/` and to put compiled `.js` output under `lib/`.

Assuming a prior npm install, you should be able to compile with:

    npm run compile

This also performs type checks, but code is not "done" unless it also passes
style checks and tests.


Running Tests
-------------

Test files can be found under `test/`. Tests are run with `mocha` and use
`chai` assertions. After `npm install`, run `mocha` with

    npm run test


Style Checking
--------------

`tslint` is used to check a little more rigorously than `tsc`. Its
configuration is `tsconfig.json`. After `npm install`, run `tslint` with

    npm run lint

