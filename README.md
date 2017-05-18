# because.js


## Overview

`because.js` is a Javascript client library that helps programmers get
interesting data from the [BCS HTTP
services](https://github.com/boundlessgeo/bcs): coordinates for street
addresses (geocoding) turn-by-turn directions (routing), discovery and metadata
for basemaps available through Boundless, and more.

`because.js` wraps these HTTP services for convenient use from Javascript. It
abstracts away many of the details of authentication, how HTTP requests are
constructed and sent, and how HTTP responses are parsed. Instead of
re-implementing all these details in every new project and for each additional
service, a programmer building on this library provides a higher-level
specification of what data is wanted, and gets the results back as convenient
Javascript objects.

Besides making it faster and easier to get started, using a client library has
benefits for maintainability. Whenever improvements are needed, they can be
made in the library, for the shared benefit of all the projects that use it.
When the upstream services change, the library can change to accommodate this,
instead of each project individually somehow discovering and making the
necessary adjustments.

To use because.js and the BCS services, you first need credentials, which you
can get by signing up at [Boundless
Connect.](https://connect.boundlessgeo.com/)

If you're interested in because.js, you would probably be even more interested
in [the Boundless Web SDK](https://github.com/boundlessgeo/sdk).



## Installing

These instructions assume you already have signed up with [Boundless
Connect.](https://connect.boundlessgeo.com/)

You'll need to [install Node and
npm](https://docs.npmjs.com/getting-started/installing-node) if you don't have
them already. You should also [install
Yarn](https://yarnpkg.com/lang/en/docs/install/) if you don't have that.

The source code for because.js is managed using git, and published on GitHub.
To download the code, use git to clone the repository from GitHub:

    git clone https://github.com/harts-boundless/because.js.git

When this is cloned, you can find a usable UMD module under `dist/because.js`.

However, it may be a little out of date. If you want to make sure you have a
fresh bundle reflecting the latest state of the original code in `src/` then
see the section on "Building" below.


## Example Code
How to build
------------

All of the project's build tasks are automated with GNU `make`.

If you just want to generally compile things and run tests, you can simply run:

    make

To build a single bundle including all of the capabilities of because.js, run:

    make dist/because.js

This will create the JS bundle `dist/because.js` and the accompanying sourcemap
`dist/because.js.map`. Only `dist/because.js` is needed to use the library, but
it can be useful for debugging to have the sourcemap available alongside.

`dist/because.js` is a [UMD module.](https://github.com/umdjs/umd) If you don't
know or care what that means, you can just include it in the normal `<script>`
way. This will define a global variable `because`.

There are multiple ways to use because.js (e.g. as CommonJS or ES2015 modules)
but the bundle is the simplest, in the sense that it does not require an
additional build step or loader to get a result in the browser.



If you want to find some example code to look at, you can find an extended
usage example containing some demos under `example/`.

See `example/README.md` for simple instructions on how to run the example.

This example code uses React and ES2015, but that's just for illustration
purposes. It doesn't matter at all whether you use React or anything like that;
because.js will work the same in any case.


## Build tools

This section is for those who are interested in how this project is built.
If you just want to use because.js, you can safely ignore this section.

As already mentioned, the entry point and overall orchestration of build tasks
is done with GNU `make`. If you aren't already familiar, the essence of `make`
is that you edit `Makefile` to define rules for making files. Each rule
has a list of other files that must exist as prerequisites, and some shell
commands that are run to actually make that file. `make` then checks to see
which files to generate (based on which output files are older than the input
files they're based on) and resolves the order to build things in. It's a
time-tested, language-agnostic tool.

The project code located under `src/` is written in
[Typescript](https://www.typescriptlang.org/docs/tutorial.html). Typescript is
a language very similar to Javascript (ES2015), except that it has type
annotations, and a few other minor features. The type checking particularly
helps control the propagation of funky values like undefined, null or NaN.
Crucially for our purposes, Typescript compiles to normal Javascript and is
generally pretty close to the semantics of Javascript.

Typescript code is both typechecked and compiled down to Javascript code using
the excellent Typescript compiler, `tsc`. Options for `tsc` are in files
conventionally named `tsconfig.json`. For just one example, some of this
projects' `tsconfig.json` files direct `tsc` to look for Typescript `.ts` files
under `src/`, turn them into ES5 code packaged as CommonJS modules, and output
these as `.js` files into `lib/`.

For some capabilities, like promises, `tsc` cannot generate downlevel code
(e.g. ES5) without the help of a polyfill. So we use a few of those.

Other aspects like concatenation/bundling/minification are handled by
[webpack](https://webpack.github.io/) together with the loader plugin for
webpack named [ts-loader](https://github.com/TypeStrong/ts-loader).

Build dependencies are managed by `yarn`, which is kind of an alternative to
`npm`.


## Running Tests

Automated tests are discovered and run by [mocha](https://mochajs.org/) with
the help of [ts-mocha](https://www.npmjs.com/package/ts-mocha) to eliminate
most of the friction of doing mocha tests with Typescript. The tests are
written using [chai](http://chaijs.com/) using `assert()`.

To kick off a run of the tests, use

    make test

Test coverage is measured using
[istanbul](https://www.npmjs.com/package/istanbul) via its command-line
interface, [nyc](https://www.npmjs.com/package/nyc).


## Running Style Checks

Code smells and style problems are detected in the Typescript source code using
[tslint](https://palantir.github.io/tslint/). This is a little more rigorous
than `tsc`, also bringing in stylistic issues and usages that are likely to
indicate errors even if they do compile.

You can start a lint pass on the source code with

    make lint

The options are conventionally in files called `tslint.json`. In this project,
tslint configuration is kept in two files for slightly different purposes:
`config/tslint.json` is specifies a base set of syntactic rules that can be run
quickly, while `config/tslint.typechecked.json` is a superset of those rules
which adds rules that require type checking, and therefore take a little more
time and require a little more configuration.


## Building Docs

API reference docs are built using [Typedoc](http://typedoc.org/).

These docs would be of little use to anyone except people working on
because.js.

As of this writing, this build configuration is currently not working.

The configuration for typedoc is in `config/typedoc.json` and depends on the
base `config/tsconfig.json`. Typedoc can be finicky about the locations of
configuration files, so be careful about making changes.


## Watch

Run `make watch` to start a process that watches the source tree for changes
and triggers rebuilds of `dist/because.js` (via wepack). This is useful if you
are making edits to the library in `src/`.
